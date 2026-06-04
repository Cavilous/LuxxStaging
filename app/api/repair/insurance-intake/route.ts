import { NextRequest, NextResponse } from 'next/server'
import { sendInsuranceClaimConfirmation } from '@/lib/email-service'
import { logFormSubmission } from '@/lib/analytics-helpers'
import { logRepairService } from '@/lib/google-sheets'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const fullName = formData.get('fullName') as string
    const mobile = formData.get('mobile') as string
    const email = formData.get('email') as string
    const vin = formData.get('vin') as string
    const year = formData.get('year') as string
    const make = formData.get('make') as string
    const model = formData.get('model') as string
    const dateOfLoss = formData.get('dateOfLoss') as string
    const damageAreasRaw = formData.get('damageAreas')
    const damageDescription = formData.get('damageDescription') as string
    const carrier = formData.get('carrier') as string
    const claimNumber = formData.get('claimNumber') as string
    const deductible = formData.get('deductible') as string

    if (!fullName || !mobile || !email || !damageAreasRaw) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    let damageAreas
    try {
      damageAreas = JSON.parse(damageAreasRaw as string)
    } catch (parseError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid damage areas format' 
      }, { status: 400 })
    }

    const vehicleInfo = `${year} ${make} ${model} (VIN: ${vin})`
    const damageDetails = `Areas affected: ${damageAreas.join(', ')}. ${damageDescription}`

    // Log for analytics
    await logFormSubmission({
      formType: 'insurance_intake',
      pageRoute: '/repair',
      customerName: fullName,
      customerEmail: email,
      customerPhone: mobile,
      payload: { fullName, mobile, email, vin, year, make, model, dateOfLoss, damageAreas, damageDescription, carrier, claimNumber, deductible },
    })

    // Get additional form fields
    const trim = formData.get('trim') as string
    const mileage = formData.get('mileage') as string
    const isDrivable = formData.get('isDrivable') as string
    const airbagDeployed = formData.get('airbagDeployed') as string
    const pickupLocation = formData.get('pickupLocation') as string
    const needEnclosedTow = formData.get('needEnclosedTow') as string
    const consentSigned = formData.get('consentSigned') === 'true'

    // Log to Google Sheets
    try {
      await logRepairService({
        requestType: 'insurance',
        name: fullName,
        phone: mobile,
        email,
        vin,
        year,
        make,
        model,
        trim,
        mileage,
        dateOfLoss,
        damageAreas,
        isDrivable,
        airbagDeployed,
        carrier,
        claimNumber,
        deductible,
        pickupLocation,
        needEnclosedTow,
        consent: consentSigned,
      })
      console.log('📊 Insurance intake logged to Google Sheets')
    } catch (sheetsError) {
      console.error('⚠️ Failed to log to Google Sheets:', sheetsError)
    }

    try {
      await sendInsuranceClaimConfirmation({
        customerEmail: email,
        customerName: fullName,
        phone: mobile,
        vehicleInfo,
        claimNumber,
        damageDescription: damageDetails
      })
    } catch (emailError) {
      console.error('Error sending insurance claim emails:', emailError)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Insurance claim submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting insurance claim:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit claim. Please try again.' 
    }, { status: 500 })
  }
}
