import { type NextRequest, NextResponse } from "next/server"
import { sendBuyerInquiryConfirmation } from "@/lib/email-service"
import { logFormSubmission } from "@/lib/analytics-helpers"
import { performSecurityChecks, getClientIp, hashIp } from "@/lib/security"
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
    }, 'buyer-inquiry')

    if (!securityCheck.passed) {
      console.warn(`🛡️ Security check failed: ${securityCheck.error}`)
      return NextResponse.json(
        { error: securityCheck.error },
        { status: securityCheck.statusCode || 400 }
      )
    }

    // Validate required fields
    const { assetId, assetTitle, name, phone, email, purchaseType, message } = body

    if (!assetId || !name || !phone || !email || !purchaseType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log for analytics
    await logFormSubmission({
      formType: 'buyer_inquiry',
      pageRoute: `/buy-sell/${assetId}`,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      payload: { assetId, assetTitle, name, phone, email, purchaseType, message },
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
        purchaseType,
        message,
      })
      console.log('📊 Buyer inquiry logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    // Send email notifications
    try {
      await sendBuyerInquiryConfirmation({
        customerEmail: email,
        customerName: name,
        phone,
        vehicleType: purchaseType,
        budget: 'To be discussed',
        message,
        assetTitle
      })
    } catch (emailError) {
      console.error('Error sending buyer inquiry emails:', emailError)
    }

    // Success response
    return NextResponse.json({
      ok: true,
      message: "Inquiry submitted successfully",
    })
  } catch (error) {
    console.error('[Buyer Inquiry API Error]:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
