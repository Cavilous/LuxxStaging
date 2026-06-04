import { NextRequest, NextResponse } from "next/server"
import { sendInfoRequestConfirmation } from "@/lib/email-service"
import { logFormSubmission } from "@/lib/analytics-helpers"
import { performSecurityChecks } from "@/lib/security"
import { logGeneralContact } from "@/lib/google-sheets"
import { createGHLContact } from "@/lib/gohighlevel"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const securityCheck = await performSecurityChecks(request, {
      turnstileToken: body.turnstileToken,
      honeypot: body._website,
      formLoadedAt: body._formLoadedAt,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    }, 'general-contact')

    if (!securityCheck.passed) {
      console.warn(`🛡️ Security check failed: ${securityCheck.error}`)
      return NextResponse.json(
        { error: securityCheck.error },
        { status: securityCheck.statusCode || 400 }
      )
    }

    const { name, phone, email, serviceInterest, message } = body

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await logFormSubmission({
      formType: 'contact_general',
      pageRoute: '/contact',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      payload: { name, phone, email, serviceInterest, message },
    })

    // Log to Google Sheets
    try {
      await logGeneralContact({
        name,
        phone,
        email,
        serviceInterest,
        message,
      })
      console.log('📊 General contact logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    // Create GHL contact
    try {
      const serviceLineMap: Record<string, string> = {
        'Exotic Cars': 'Car',
        'Yachts & Boats': 'Yacht',
        'Villas & Houses': 'Villa',
        'Car Tours': 'Car',
        'Buy/Sell/Invest': 'Concierge',
        'Repair & Customization': 'Concierge',
      }
      const serviceLine = serviceInterest ? (serviceLineMap[serviceInterest] ?? undefined) : undefined

      await createGHLContact({
        name,
        phone,
        email,
        source: 'Website - Contact Form',
        tags: ['general-contact'],
        serviceLine,
        specialRequests: message || undefined,
      })
    } catch (ghlError) {
      console.error('⚠️ GHL contact creation failed (non-blocking):', ghlError)
    }

    // Send email notifications
    try {
      await sendInfoRequestConfirmation({
        customerEmail: email,
        customerName: name,
        phone,
        message: message ? `Service Interest: ${serviceInterest || 'General'}\n\n${message}` : `Service Interest: ${serviceInterest || 'General'}`,
      })
    } catch (emailError) {
      console.error('Error sending contact emails:', emailError)
    }

    console.log(`✅ General contact from ${name} (${email}) - Service: ${serviceInterest}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("General contact error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
