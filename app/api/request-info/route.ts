import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { leadSubmissions } from "@/lib/db/schema"
import { sendInfoRequestConfirmation } from "@/lib/email-service"
import { logFormSubmission } from "@/lib/analytics-helpers"
import { performSecurityChecks, getClientIp } from "@/lib/security"
import { logRentalInquiry } from "@/lib/google-sheets"
import { createGHLContact } from "@/lib/gohighlevel"

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Received info request submission')
    const body = await request.json()
    const ip = getClientIp(request)
    
    const securityCheck = await performSecurityChecks(request, {
      turnstileToken: body.turnstileToken,
      honeypot: body._website,
      formLoadedAt: body._formLoadedAt,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    }, 'request-info')

    if (!securityCheck.passed) {
      console.warn(`🛡️ Security check failed: ${securityCheck.error}`)
      return NextResponse.json(
        { success: false, error: securityCheck.error },
        { status: securityCheck.statusCode || 400 }
      )
    }

    const { name, phone, email, message, itemTitle, itemCategory, startDate, endDate, location } = body

    if (!name || !phone) {
      console.error('❌ Missing required fields:', { name: !!name, phone: !!phone })
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Store in database with date range in metadata
    console.log('💾 Saving to database...')
    await db.insert(leadSubmissions).values({
      name,
      phone,
      email,
      message: message || null,
      submissionType: "request_info",
      metadata: {
        itemTitle,
        itemCategory,
        startDate: startDate || null,
        endDate: endDate || null,
        location: location || null,
      },
    })
    console.log('✅ Saved to database successfully')

    // Log for analytics with inventory context
    await logFormSubmission({
      formType: 'request_info',
      pageRoute: body.source === 'embedded_form' ? `/inventory/${itemCategory}` : undefined,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      payload: { name, phone, email, message, itemTitle, itemCategory, startDate, endDate, location },
      inventoryContext: itemTitle ? {
        inventoryId: body.itemId,
        inventorySlug: body.itemSlug,
        inventoryTitle: itemTitle,
        inventoryCategory: itemCategory,
      } : undefined,
    })

    // Log to Google Sheets
    try {
      await logRentalInquiry({
        name,
        phone,
        email,
        itemTitle,
        itemCategory,
        startDate,
        endDate,
        location,
        message,
        source: body.source || 'website',
      })
      console.log('📊 Logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    // Create GHL contact
    try {
      const { hasDriversLicense, hasInsurance, travelType, tripType } = body

      const categoryTagMap: Record<string, string> = {
        car: 'car-inquiry',
        cars: 'car-inquiry',
        yacht: 'yacht-inquiry',
        yachts: 'yacht-inquiry',
        villa: 'villa-inquiry',
        villas: 'villa-inquiry',
        house: 'villa-inquiry',
        houses: 'villa-inquiry',
      }
      const tag = itemCategory
        ? (categoryTagMap[itemCategory.toLowerCase()] || `${itemCategory.toLowerCase()}-inquiry`)
        : 'rental-inquiry'

      const serviceLineMap: Record<string, string> = {
        car: 'Car', cars: 'Car',
        yacht: 'Yacht', yachts: 'Yacht',
        villa: 'Villa', villas: 'Villa',
        house: 'Villa', houses: 'Villa',
      }
      const serviceLine = itemCategory
        ? (serviceLineMap[itemCategory.toLowerCase()] ?? undefined)
        : undefined

      await createGHLContact({
        name,
        phone,
        email,
        source: 'Website - Rental Inquiry',
        tags: [tag],
        itemTitle: itemTitle || undefined,
        location: location || undefined,
        hasDriversLicense: hasDriversLicense !== undefined ? Boolean(hasDriversLicense) : undefined,
        hasInsurance: hasInsurance !== undefined ? Boolean(hasInsurance) : undefined,
        travelType: travelType || undefined,
        serviceLine,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        occasionPurpose: tripType || undefined,
        specialRequests: message || undefined,
      })
    } catch (ghlError) {
      console.error('⚠️ GHL contact creation failed (non-blocking):', ghlError)
    }

    // Send email notifications
    console.log('📧 Attempting to send info request emails...')
    try {
      const emailResults = await sendInfoRequestConfirmation({
        customerEmail: email,
        customerName: name,
        phone,
        message,
        itemTitle,
        itemCategory,
        startDate,
        endDate,
        location
      })
      
      console.log('📧 Email send results:', {
        customer: emailResults.customerResult.success ? 'sent' : 'failed',
        admin: emailResults.adminResult.success ? 'sent' : 'failed'
      })
      
      if (!emailResults.customerResult.success || !emailResults.adminResult.success) {
        console.warn('⚠️ Some emails failed to send but request was saved to database')
      }
    } catch (emailError) {
      console.error('❌ Error sending info request emails:', emailError)
    }

    console.log('✅ Request processed successfully')
    return NextResponse.json(
      { success: true, message: "Request submitted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Error processing request info:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit request" },
      { status: 500 }
    )
  }
}
