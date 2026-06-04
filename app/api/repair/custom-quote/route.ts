import { NextRequest, NextResponse } from 'next/server'
import { sendCustomizationQuoteConfirmation } from '@/lib/email-service'
import { logFormSubmission } from '@/lib/analytics-helpers'
import { logRepairService } from '@/lib/google-sheets'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const contactRaw = formData.get('contact')
    const vehicleRaw = formData.get('vehicle')
    const servicesRaw = formData.get('services')
    
    if (!contactRaw || !vehicleRaw || !servicesRaw) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    let contact, vehicle, services
    try {
      contact = JSON.parse(contactRaw as string)
      vehicle = JSON.parse(vehicleRaw as string)
      services = JSON.parse(servicesRaw as string)
    } catch (parseError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid form data format' 
      }, { status: 400 })
    }

    const desiredDateWindow = formData.get('desiredDateWindow') as string
    const notes = formData.get('notes') as string

    const selectedServices: string[] = []
    Object.entries(services).forEach(([service, data]) => {
      if (typeof data === 'boolean' && data) {
        selectedServices.push(service.toUpperCase())
      } else if (typeof data === 'object' && (data as any).selected) {
        selectedServices.push(service.toUpperCase())
      }
    })

    const vehicleInfo = `${vehicle.year} ${vehicle.make} ${vehicle.model}`
    const serviceDetails = selectedServices.length > 0 
      ? selectedServices.join(', ')
      : 'Custom services'
    const details = `${serviceDetails}. ${notes ? `Notes: ${notes}` : ''} Desired window: ${desiredDateWindow}`

    // Log for analytics
    await logFormSubmission({
      formType: 'customization_quote',
      pageRoute: '/repair',
      customerName: contact.name,
      customerEmail: contact.email,
      customerPhone: contact.mobile,
      payload: { contact, vehicle, services: selectedServices, desiredDateWindow, notes },
    })

    // Get wrap and tint details
    const wrapDetails = services.wrap?.selected 
      ? `${services.wrap.finish || ''} ${services.wrap.color || ''}`.trim() 
      : undefined
    const tintPercent = services.tint?.selected ? services.tint.percent : undefined

    // Log to Google Sheets
    try {
      await logRepairService({
        requestType: 'customization',
        name: contact.name,
        phone: contact.mobile,
        email: contact.email,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        servicesRequested: selectedServices.join(', '),
        wrapDetails,
        tintPercent,
        desiredDate: desiredDateWindow,
        notes,
      })
      console.log('📊 Customization quote logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    try {
      await sendCustomizationQuoteConfirmation({
        customerEmail: contact.email,
        customerName: contact.name,
        phone: contact.mobile,
        vehicleInfo,
        services: selectedServices,
        details
      })
    } catch (emailError) {
      console.error('Error sending customization quote emails:', emailError)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Customization quote request submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting customization quote:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit quote request. Please try again.' 
    }, { status: 500 })
  }
}
