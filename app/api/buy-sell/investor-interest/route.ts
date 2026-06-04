import { type NextRequest, NextResponse } from "next/server"
import { sendInvestorInterestConfirmation } from "@/lib/email-service"
import { logFormSubmission } from "@/lib/analytics-helpers"
import { performSecurityChecks } from "@/lib/security"
import { logInvestorLead } from "@/lib/google-sheets"

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
    }, 'investor-interest')

    if (!securityCheck.passed) {
      return NextResponse.json({ error: securityCheck.error }, { status: securityCheck.statusCode || 400 })
    }

    // Validate required fields
    const { name, phone, email, company, interests, aumRange, message, utmSource, utmMedium, utmCampaign } = body

    if (!name || !phone || !email || !interests || interests.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log for analytics
    await logFormSubmission({
      formType: 'investor_interest',
      pageRoute: '/buy-sell',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      payload: { name, phone, email, company, interests, aumRange, message },
    })

    // Log to Google Sheets
    try {
      await logInvestorLead({
        name,
        phone,
        email,
        company,
        interests,
        aumRange,
        message,
        utmSource,
        utmMedium,
        utmCampaign,
      })
      console.log('📊 Investor interest logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    const investmentRange = aumRange || 'To be discussed'

    // Send email notifications
    try {
      await sendInvestorInterestConfirmation({
        customerEmail: email,
        customerName: name,
        phone,
        investmentRange,
        message
      })
    } catch (emailError) {
      console.error('Error sending investor interest emails:', emailError)
    }

    // Success response
    return NextResponse.json({
      ok: true,
      message: "Investor interest submitted successfully",
      deckDownloadUrl: "/investor-deck.pdf",
    })
  } catch (error) {
    console.error('[Investor Interest API Error]:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
