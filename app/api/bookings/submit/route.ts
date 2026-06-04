import { NextRequest, NextResponse } from 'next/server'
import { submitBooking } from '@/lib/pricing-actions'
import { logFormSubmission } from '@/lib/analytics-helpers'
import { performSecurityChecks, getClientIp, hashIp } from '@/lib/security'
import { logRentalInquiry } from '@/lib/google-sheets'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const securityCheck = await performSecurityChecks(request, {
      turnstileToken: data.turnstileToken,
      honeypot: data._website,
      formLoadedAt: data._formLoadedAt,
      name: data.customerName,
      email: data.customerEmail,
      phone: data.customerPhone,
    }, 'booking-submit')

    if (!securityCheck.passed) {
      console.warn(`🛡️ Security check failed: ${securityCheck.error}`)
      return NextResponse.json(
        { success: false, error: securityCheck.error },
        { status: securityCheck.statusCode || 400 }
      )
    }

    const result = await submitBooking(data)
    
    if (result.success) {
      // Log for analytics with inventory context
      await logFormSubmission({
        formType: 'booking',
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        payload: data,
        inventoryContext: data.items?.[0] ? {
          inventoryId: data.items[0].id,
          inventoryTitle: data.items[0].title,
          inventoryCategory: data.items[0].category,
        } : undefined,
      })

      // Log to Google Sheets
      try {
        const item = data.items?.[0]
        await logRentalInquiry({
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail,
          itemTitle: item?.title,
          itemCategory: item?.category,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          source: 'booking',
        })
        console.log('📊 Booking logged to Google Sheets')
      } catch (sheetsError) {
        console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
      }

      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Error submitting booking:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit booking. Please try again.' 
    }, { status: 500 })
  }
}
