import { type NextRequest, NextResponse } from "next/server"
import { sendSellIntakeConfirmation } from "@/lib/email-service"
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
    }, 'sell-intake')

    if (!securityCheck.passed) {
      console.warn(`🛡️ Security check failed: ${securityCheck.error}`)
      return NextResponse.json(
        { error: securityCheck.error },
        { status: securityCheck.statusCode || 400 }
      )
    }

    // Validate required fields
    const {
      name,
      phone,
      email,
      assetCategory,
      brand,
      model,
      year,
      condition,
      photos,
      targetPrice,
      availableDocs,
      message,
      utmSource,
      utmMedium,
      utmCampaign,
    } = body

    if (!name || !phone || !email || !assetCategory) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log for analytics
    await logFormSubmission({
      formType: 'sell_intake',
      pageRoute: '/buy-sell',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      payload: { name, phone, email, assetCategory, brand, model, year, condition, photos: photos?.length || 0, targetPrice, availableDocs, message },
    })

    // Log to Google Sheets
    try {
      await logBuySellLead({
        leadType: 'seller',
        name,
        phone,
        email,
        assetCategory,
        brand,
        model,
        year,
        condition,
        targetPrice,
        availableDocs,
        message,
        utmSource,
        utmMedium,
        utmCampaign,
      })
      console.log('📊 Sell intake logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    const vehicleInfo = `${year || ''} ${brand || ''} ${model || ''} ${assetCategory}`.trim()
    const askingPrice = targetPrice || 'To be discussed'

    // Send email notifications
    try {
      await sendSellIntakeConfirmation({
        customerEmail: email,
        customerName: name,
        phone,
        vehicleInfo,
        askingPrice,
        message
      })
    } catch (emailError) {
      console.error('Error sending sell intake emails:', emailError)
    }

    // Success response
    return NextResponse.json({
      ok: true,
      message: "Sell intake submitted successfully",
    })
  } catch (error) {
    console.error('[Sell Intake API Error]:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
