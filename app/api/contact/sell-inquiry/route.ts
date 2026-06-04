import { NextRequest, NextResponse } from "next/server"
import { sendSellIntakeConfirmation } from "@/lib/email-service"
import { logFormSubmission } from "@/lib/analytics-helpers"
import { performSecurityChecks } from "@/lib/security"
import { logBuySellLead } from "@/lib/google-sheets"

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
    }, 'contact-sell-inquiry')

    if (!securityCheck.passed) {
      return NextResponse.json({ error: securityCheck.error }, { status: securityCheck.statusCode || 400 })
    }

    const { name, email, phone, assetType, intent, message, source } = body

    if (!name || !email || !phone || !assetType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Log for analytics
    await logFormSubmission({
      formType: 'contact_sell_inquiry',
      pageRoute: source || '/contact',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      payload: { name, email, phone, assetType, intent, message, source },
    })

    // Log to Google Sheets
    try {
      await logBuySellLead({
        leadType: 'seller',
        name,
        phone,
        email,
        assetCategory: assetType,
        message,
      })
      console.log('📊 Sell inquiry logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    const assetTypeLabels: Record<string, string> = {
      car: "Exotic Car",
      yacht: "Yacht",
      villa: "Villa / Property",
      other: "Other",
    }

    const result = await sendSellIntakeConfirmation({
      customerEmail: email,
      customerName: name,
      phone,
      vehicleInfo: assetTypeLabels[assetType] || assetType,
      askingPrice: "To be discussed",
      message: message || undefined,
    })

    if (!result.adminResult.success) {
      console.error("Failed to send sell inquiry emails:", result)
      return NextResponse.json(
        { error: "Failed to send emails" },
        { status: 500 }
      )
    }

    console.log(`✅ Sell inquiry received from ${name} (${email}) - Asset: ${assetType}, Source: ${source}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sell inquiry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
