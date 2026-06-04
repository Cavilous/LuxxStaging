import { NextRequest, NextResponse } from "next/server"
import { sendBuyerInquiryConfirmation } from "@/lib/email-service"
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
    }, 'buy-sell-inquiry')

    if (!securityCheck.passed) {
      return NextResponse.json({ error: securityCheck.error }, { status: securityCheck.statusCode || 400 })
    }

    const { assetId, assetTitle, name, email, phone, message } = body

    if (!name || !email || !phone || !assetTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Log for analytics
    await logFormSubmission({
      formType: 'buy_sell_inquiry',
      pageRoute: assetId ? `/buy-sell/${assetId}` : '/buy-sell',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      payload: { assetId, assetTitle, name, email, phone, message },
    })

    // Log to Google Sheets
    try {
      await logBuySellLead({
        leadType: 'buyer',
        name,
        phone,
        email,
        assetId,
        assetTitle,
        message,
      })
      console.log('📊 Buy-sell inquiry logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    const result = await sendBuyerInquiryConfirmation({
      customerEmail: email,
      customerName: name,
      phone,
      vehicleType: assetTitle,
      budget: "Contact for pricing",
      message: message || undefined,
    })

    if (!result.adminResult.success) {
      console.error("Failed to send buyer inquiry emails:", result)
      return NextResponse.json(
        { error: "Failed to send emails" },
        { status: 500 }
      )
    }

    console.log(`✅ Buyer inquiry received from ${name} (${email}) - Asset: ${assetTitle} (${assetId})`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Buyer inquiry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
