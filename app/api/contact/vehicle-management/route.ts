import { NextRequest, NextResponse } from "next/server"
import { sendVehicleManagementInquiry } from "@/lib/email-service"
import { logFormSubmission } from "@/lib/analytics-helpers"
import { performSecurityChecks } from "@/lib/security"
import { logFleetManagement } from "@/lib/google-sheets"

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
    }, 'vehicle-management')

    if (!securityCheck.passed) {
      return NextResponse.json({ error: securityCheck.error }, { status: securityCheck.statusCode || 400 })
    }

    const { name, email, phone, vehicleCount, currentStorage, message, source } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await logFormSubmission({
      formType: 'contact_vehicle_management',
      pageRoute: source || '/vehicle-management',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      payload: { name, email, phone, vehicleCount, currentStorage, message, source },
    })

    // Log to Google Sheets
    try {
      await logFleetManagement({
        name,
        email,
        phone,
        vehicleCount,
        currentStorage,
        message,
      })
      console.log('📊 Fleet management inquiry logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    const result = await sendVehicleManagementInquiry({
      customerEmail: email,
      customerName: name,
      phone,
      vehicleCount: vehicleCount || "Not specified",
      currentStorage: currentStorage || "Not specified",
      message: message || undefined,
    })

    if (!result.adminResult.success) {
      console.error("Failed to send vehicle management inquiry emails:", result)
      return NextResponse.json(
        { error: "Failed to send emails" },
        { status: 500 }
      )
    }

    console.log(`✅ Vehicle management inquiry from ${name} (${email}) - Vehicles: ${vehicleCount}, Source: ${source}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Vehicle management inquiry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
