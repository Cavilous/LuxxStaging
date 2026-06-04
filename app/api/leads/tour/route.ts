import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { leadSubmissions } from "@/lib/db/schema"
import { logFormSubmission } from "@/lib/analytics-helpers"
import { performSecurityChecks } from "@/lib/security"
import { logRentalInquiry } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    console.log("[Tour Lead] Received tour booking request")
    const body = await request.json()
    
    const securityCheck = await performSecurityChecks(request, {
      turnstileToken: body.turnstileToken,
      honeypot: body._website,
      formLoadedAt: body._formLoadedAt,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.notes,
    }, 'tour-lead')

    if (!securityCheck.passed) {
      return NextResponse.json({ success: false, error: securityCheck.error }, { status: securityCheck.statusCode || 400 })
    }

    const { carId, carName, duration, name, phone, email, preferredDate, preferredTime, notes } = body

    if (!name || !phone || !email) {
      console.error("[Tour Lead] Missing required fields")
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    console.log("[Tour Lead] Saving to database...")
    await db.insert(leadSubmissions).values({
      name,
      phone,
      email,
      message: notes || null,
      submissionType: "tour_booking",
      metadata: {
        carId,
        carName,
        duration,
        preferredDate,
        preferredTime,
      },
    })
    console.log("[Tour Lead] Saved successfully")

    // Log for analytics
    await logFormSubmission({
      formType: 'tour_booking',
      pageRoute: '/tours/cars',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      payload: { carId, carName, duration, name, phone, email, preferredDate, preferredTime, notes },
    })

    // Log to Google Sheets
    try {
      await logRentalInquiry({
        name,
        phone,
        email,
        itemTitle: carName,
        itemCategory: 'Car Tour',
        startDate: preferredDate,
        message: `Duration: ${duration}, Preferred Time: ${preferredTime}. ${notes || ''}`.trim(),
        source: 'tour_lead',
      })
      console.log('📊 Tour lead logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    return NextResponse.json(
      { success: true, message: "Tour request submitted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Tour Lead] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit request" },
      { status: 500 }
    )
  }
}
