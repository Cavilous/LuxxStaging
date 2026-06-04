import 'server-only'
import { Resend } from 'resend'

const FROM_EMAIL = 'Luxx Miami <requests@luxxmiami.com>'
const ADMIN_EMAIL = 'luxxmiamigroup@gmail.com'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(options: EmailOptions) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured in environment variables')
      return { success: false, error: 'RESEND_API_KEY not configured' }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    console.log('📧 Attempting to send email via Resend:', {
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
    })

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    })

    if (error) {
      console.error('❌ Resend API error:', JSON.stringify(error, null, 2))
      return { success: false, error }
    }

    console.log('✅ Email sent successfully via Resend:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Email service exception:', error)
    return { success: false, error }
  }
}

export async function sendBookingConfirmation(data: {
  customerEmail: string
  customerName: string
  itemTitle: string
  itemCategory: string
  dates: string
  totalPrice: string
  bookingDetails: string
}) {
  const customerHtml = generateBookingConfirmationEmail(data)
  const adminHtml = generateAdminBookingNotification(data)

  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: 'Booking Request Received - Luxx Miami',
    html: customerHtml,
  })

  const adminResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Booking Request: ${data.itemTitle}`,
    html: adminHtml,
  })

  return { customerResult, adminResult }
}

export async function sendCustomizationQuoteConfirmation(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleInfo: string
  services: string[]
  details: string
}) {
  const customerHtml = generateCustomizationQuoteEmail(data)
  const adminHtml = generateAdminCustomizationNotification(data)

  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: 'Customization Quote Request Received - Luxx Miami',
    html: customerHtml,
  })

  const adminResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Customization Quote: ${data.vehicleInfo}`,
    html: adminHtml,
  })

  return { customerResult, adminResult }
}

export async function sendInsuranceClaimConfirmation(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleInfo: string
  claimNumber: string
  damageDescription: string
}) {
  const customerHtml = generateInsuranceClaimEmail(data)
  const adminHtml = generateAdminInsuranceNotification(data)

  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: 'Insurance Claim Submitted - Luxx Miami',
    html: customerHtml,
  })

  const adminResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Insurance Claim: ${data.vehicleInfo}`,
    html: adminHtml,
  })

  return { customerResult, adminResult }
}

export async function sendInfoRequestConfirmation(data: {
  customerEmail: string
  customerName: string
  phone: string
  message?: string
  itemTitle?: string
  itemCategory?: string
  startDate?: string
  endDate?: string
  location?: string
}) {
  console.log('📧 Preparing info request confirmation emails for:', data.customerEmail)
  
  const customerHtml = generateInfoRequestEmail(data)
  const adminHtml = generateAdminInfoRequestNotification(data)

  console.log('📧 Sending customer confirmation email...')
  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: 'Information Request Received - Luxx Miami',
    html: customerHtml,
  })

  console.log('📧 Sending admin notification email to:', ADMIN_EMAIL)
  const adminResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Info Request: ${data.customerName}`,
    html: adminHtml,
  })

  console.log('📧 Email results - Customer:', customerResult.success ? '✅' : '❌', 'Admin:', adminResult.success ? '✅' : '❌')

  return { customerResult, adminResult }
}

export async function sendBuyerInquiryConfirmation(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleType: string
  budget: string
  message?: string
  assetTitle?: string
}) {
  const customerHtml = generateBuyerInquiryEmail(data)
  const adminHtml = generateAdminBuyerInquiryNotification(data)

  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: 'Buyer Inquiry Received - Luxx Miami',
    html: customerHtml,
  })

  const adminResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Buyer Inquiry: ${data.vehicleType}`,
    html: adminHtml,
  })

  return { customerResult, adminResult }
}

export async function sendSellIntakeConfirmation(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleInfo: string
  askingPrice: string
  message?: string
}) {
  const customerHtml = generateSellIntakeEmail(data)
  const adminHtml = generateAdminSellIntakeNotification(data)

  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: 'Sell Intake Submitted - Luxx Miami',
    html: customerHtml,
  })

  const adminResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Sell Intake: ${data.vehicleInfo}`,
    html: adminHtml,
  })

  return { customerResult, adminResult }
}

export async function sendInvestorInterestConfirmation(data: {
  customerEmail: string
  customerName: string
  phone: string
  investmentRange: string
  message?: string
}) {
  const customerHtml = generateInvestorInterestEmail(data)
  const adminHtml = generateAdminInvestorInterestNotification(data)

  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: 'Investor Interest Received - Luxx Miami',
    html: customerHtml,
  })

  const adminResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Investor Interest: ${data.customerName}`,
    html: adminHtml,
  })

  return { customerResult, adminResult }
}

export async function sendVehicleManagementInquiry(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleCount: string
  currentStorage?: string
  message?: string
}) {
  const customerHtml = generateVehicleManagementEmail(data)
  const adminHtml = generateAdminVehicleManagementNotification(data)

  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: 'Vehicle Management Inquiry - Luxx Miami',
    html: customerHtml,
  })

  const adminResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Vehicle Management Inquiry: ${data.customerName}`,
    html: adminHtml,
  })

  return { customerResult, adminResult }
}

function generateBookingConfirmationEmail(data: {
  customerName: string
  itemTitle: string
  itemCategory: string
  dates: string
  totalPrice: string
  bookingDetails: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0A0A0A; color: #FFFFFF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1A1A1A; border: 1px solid #333333; border-radius: 8px;">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #ECAC36;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ECAC36; letter-spacing: 2px;">LUXX MIAMI</h1>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #999999; letter-spacing: 1px;">LUXURY LIFESTYLE RENTALS</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #FFFFFF;">Booking Request Received</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Dear ${data.customerName},
                    </p>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Thank you for your reservation request. We're thrilled to help you experience luxury in Miami. Our team will be in touch soon to confirm availability and finalize your booking.
                    </p>
                    
                    <!-- Booking Details -->
                    <div style="background-color: #0A0A0A; border-left: 3px solid #ECAC36; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #ECAC36;">Reservation Details</h3>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Item:</strong> ${data.itemTitle}</p>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Category:</strong> ${data.itemCategory}</p>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Dates:</strong> ${data.dates}</p>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Estimated Total:</strong> ${data.totalPrice}</p>
                      ${data.bookingDetails}
                    </div>
                    
                    <!-- Important Note -->
                    <div style="background-color: #2A2A2A; border: 1px solid #444444; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #999999;">
                        <strong style="color: #ECAC36;">Please Note:</strong> Pricing and availability are subject to final confirmation. Our team will verify all details and provide final pricing based on your specific requirements.
                      </p>
                    </div>
                    
                    <!-- Next Steps -->
                    <h3 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #FFFFFF;">What Happens Next?</h3>
                    <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #CCCCCC;">
                      <li>Our team will review your request promptly</li>
                      <li>We'll confirm availability and finalize pricing</li>
                      <li>You'll receive payment instructions for the 50% deposit</li>
                      <li>Once deposit is received, your reservation is confirmed</li>
                    </ul>
                    
                    <!-- Contact -->
                    <div style="background-color: #0A0A0A; padding: 20px; border-radius: 4px; text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;">Questions? Contact us:</p>
                      <p style="margin: 0 0 5px; font-size: 15px; color: #ECAC36; font-weight: 600;">(305) 605-5899</p>
                      <p style="margin: 0; font-size: 15px; color: #ECAC36; font-weight: 600;">luxxmiamigroup@gmail.com</p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #0A0A0A; border-top: 1px solid #333333; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                    <p style="margin: 0 0 10px; font-size: 13px; color: #666666;">
                      © 2025 Luxx Miami. All rights reserved.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #555555;">
                      Miami, Florida | Luxury Lifestyle Rentals
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateAdminBookingNotification(data: {
  customerEmail: string
  customerName: string
  itemTitle: string
  itemCategory: string
  dates: string
  totalPrice: string
  bookingDetails: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Booking Request</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 30px; background-color: #ECAC36; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 24px; color: #000000;">🔔 New Booking Request</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 20px; font-size: 20px; color: #333333;">Customer Information</h2>
                    <p style="margin: 0 0 10px; font-size: 15px; color: #666666;"><strong>Name:</strong> ${data.customerName}</p>
                    <p style="margin: 0 0 20px; font-size: 15px; color: #666666;"><strong>Email:</strong> ${data.customerEmail}</p>
                    
                    <h2 style="margin: 0 0 20px; font-size: 20px; color: #333333;">Booking Details</h2>
                    <p style="margin: 0 0 10px; font-size: 15px; color: #666666;"><strong>Item:</strong> ${data.itemTitle}</p>
                    <p style="margin: 0 0 10px; font-size: 15px; color: #666666;"><strong>Category:</strong> ${data.itemCategory}</p>
                    <p style="margin: 0 0 10px; font-size: 15px; color: #666666;"><strong>Dates:</strong> ${data.dates}</p>
                    <p style="margin: 0 0 10px; font-size: 15px; color: #666666;"><strong>Total:</strong> ${data.totalPrice}</p>
                    ${data.bookingDetails}
                    
                    <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ECAC36; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; color: #856404;">
                        <strong>Action Required:</strong> Contact customer promptly to confirm availability and finalize booking.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateCustomizationQuoteEmail(data: {
  customerName: string
  vehicleInfo: string
  services: string[]
  details: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Customization Quote Request</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FFFFFF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1A1A1A; border: 1px solid #333333; border-radius: 8px;">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #ECAC36;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ECAC36; letter-spacing: 2px;">LUXX MIAMI</h1>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #999999; letter-spacing: 1px;">LUXURY CUSTOMIZATION</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #FFFFFF;">Quote Request Received</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Dear ${data.customerName},
                    </p>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Thank you for your customization quote request. Our specialists will review your requirements and be in touch soon with a detailed estimate.
                    </p>
                    
                    <div style="background-color: #0A0A0A; border-left: 3px solid #ECAC36; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px; font-size: 18px; color: #ECAC36;">Request Details</h3>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Vehicle:</strong> ${data.vehicleInfo}</p>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Services:</strong> ${data.services.join(', ')}</p>
                      <p style="margin: 0; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Details:</strong> ${data.details}</p>
                    </div>
                    
                    <div style="background-color: #2A2A2A; border: 1px solid #444444; padding: 15px; border-radius: 4px;">
                      <p style="margin: 0; font-size: 13px; color: #999999;">
                        <strong style="color: #ECAC36;">Please Note:</strong> Estimates are subject to change based on final vehicle inspection and specific customization requirements.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #0A0A0A; border-top: 1px solid #333333; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #666666;">© 2025 Luxx Miami. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateAdminCustomizationNotification(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleInfo: string
  services: string[]
  details: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #ECAC36; margin-bottom: 20px;">🔧 New Customization Quote Request</h1>
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <h2>Request Details</h2>
          <p><strong>Vehicle:</strong> ${data.vehicleInfo}</p>
          <p><strong>Services:</strong> ${data.services.join(', ')}</p>
          <p><strong>Details:</strong> ${data.details}</p>
          <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ECAC36; margin-top: 20px;">
            <strong>Action Required:</strong> Contact customer promptly with quote estimate.
          </div>
        </div>
      </body>
    </html>
  `
}

function generateInsuranceClaimEmail(data: {
  customerName: string
  vehicleInfo: string
  claimNumber: string
  damageDescription: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FFFFFF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1A1A1A; border: 1px solid #333333; border-radius: 8px;">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #ECAC36;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ECAC36;">LUXX MIAMI</h1>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #999999;">INSURANCE & REPAIR</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #FFFFFF;">Claim Submitted Successfully</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Dear ${data.customerName},
                    </p>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Your insurance claim has been submitted and prioritized. Our team will be in touch soon to coordinate next steps.
                    </p>
                    
                    <div style="background-color: #0A0A0A; border-left: 3px solid #ECAC36; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px; font-size: 18px; color: #ECAC36;">Claim Details</h3>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Vehicle:</strong> ${data.vehicleInfo}</p>
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Claim Number:</strong> ${data.claimNumber}</p>
                      <p style="margin: 0; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Description:</strong> ${data.damageDescription}</p>
                    </div>
                    
                    <div style="background-color: #2A2A2A; border: 1px solid #444444; padding: 15px; border-radius: 4px;">
                      <p style="margin: 0; font-size: 13px; color: #999999;">
                        <strong style="color: #ECAC36;">Please Note:</strong> All repair estimates are subject to insurance approval and final damage assessment.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #0A0A0A; border-top: 1px solid #333333; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #666666;">© 2025 Luxx Miami. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateAdminInsuranceNotification(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleInfo: string
  claimNumber: string
  damageDescription: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #ECAC36;">🚨 New Insurance Claim</h1>
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <h2>Claim Details</h2>
          <p><strong>Vehicle:</strong> ${data.vehicleInfo}</p>
          <p><strong>Claim #:</strong> ${data.claimNumber}</p>
          <p><strong>Damage:</strong> ${data.damageDescription}</p>
          <div style="background: #ffcccc; padding: 15px; border-left: 4px solid #cc0000; margin-top: 20px;">
            <strong>URGENT:</strong> Contact customer promptly to coordinate repair.
          </div>
        </div>
      </body>
    </html>
  `
}

function formatDateRangeForEmailHtml(
  startDate: string | undefined, 
  endDate: string | undefined, 
  category: string | undefined
): { dateHtml: string; durationHtml: string } {
  if (!startDate || !endDate) {
    return { dateHtml: '', durationHtml: '' }
  }
  
  try {
    const start = new Date(startDate + 'T12:00:00')
    const end = new Date(endDate + 'T12:00:00')
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { dateHtml: '', durationHtml: '' }
    }
    
    const formatOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'America/New_York'
    }
    
    const startFormatted = start.toLocaleDateString('en-US', formatOptions)
    const endFormatted = end.toLocaleDateString('en-US', formatOptions)
    
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    let labels: { start: string; end: string; unit: string }
    switch (category) {
      case 'villa':
        labels = { start: 'Check-in', end: 'Check-out', unit: days === 1 ? 'night' : 'nights' }
        break
      case 'yacht':
        labels = { start: 'Charter Start', end: 'Charter End', unit: days === 1 ? 'day' : 'days' }
        break
      default:
        labels = { start: 'Pickup', end: 'Drop-off', unit: days === 1 ? 'day' : 'days' }
    }
    
    const dateHtml = `
      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">${labels.start}:</strong> ${startFormatted} (ET)</p>
      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">${labels.end}:</strong> ${endFormatted} (ET)</p>
    `
    
    const durationHtml = `<p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Duration:</strong> ${days} ${labels.unit}</p>`
    
    return { dateHtml, durationHtml }
  } catch {
    return { dateHtml: '', durationHtml: '' }
  }
}

function generateInfoRequestEmail(data: {
  customerName: string
  itemTitle?: string
  itemCategory?: string
  startDate?: string
  endDate?: string
  location?: string
}): string {
  const { dateHtml, durationHtml } = formatDateRangeForEmailHtml(data.startDate, data.endDate, data.itemCategory)
  const hasDetails = data.itemTitle || dateHtml || data.location
  
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FFFFFF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1A1A1A; border: 1px solid #333333; border-radius: 8px;">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #ECAC36;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ECAC36;">LUXX MIAMI</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #FFFFFF;">Request Received</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Dear ${data.customerName},
                    </p>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Thank you for reaching out to Luxx Miami. We've received your inquiry${data.itemTitle ? ` about the ${data.itemTitle}` : ''} and will respond shortly with the information you requested.
                    </p>
                    ${hasDetails ? `
                    <div style="background-color: #0A0A0A; border-left: 3px solid #ECAC36; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px; font-size: 18px; color: #ECAC36;">Your Request</h3>
                      ${data.itemTitle ? `<p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Item:</strong> ${data.itemTitle}</p>` : ''}
                      ${data.itemCategory ? `<p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Category:</strong> ${data.itemCategory.charAt(0).toUpperCase() + data.itemCategory.slice(1)}</p>` : ''}
                      ${dateHtml}
                      ${durationHtml}
                      ${data.location ? `<p style="margin: 0; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Location:</strong> ${data.location}</p>` : ''}
                    </div>
                    ` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #0A0A0A; border-top: 1px solid #333333; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #666666;">© 2025 Luxx Miami. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateAdminInfoRequestNotification(data: {
  customerEmail: string
  customerName: string
  phone: string
  message?: string
  itemTitle?: string
  itemCategory?: string
  startDate?: string
  endDate?: string
  location?: string
}): string {
  const { dateHtml, durationHtml } = formatDateRangeForEmailHtml(data.startDate, data.endDate, data.itemCategory)
  const hasDateRange = data.startDate && data.endDate
  
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #ECAC36;">📧 New Information Request</h1>
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          ${data.itemTitle || data.itemCategory || hasDateRange || data.location ? `
          <h2>Request Details</h2>
          ${data.itemTitle ? `<p><strong>Item:</strong> ${data.itemTitle}</p>` : ''}
          ${data.itemCategory ? `<p><strong>Category:</strong> ${data.itemCategory.charAt(0).toUpperCase() + data.itemCategory.slice(1)}</p>` : ''}
          ${hasDateRange ? dateHtml + durationHtml : ''}
          ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
          ` : ''}
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
          <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ECAC36; margin-top: 20px;">
            <strong>Action Required:</strong> Contact customer promptly to provide information.
          </div>
        </div>
      </body>
    </html>
  `
}

function generateBuyerInquiryEmail(data: {
  customerName: string
  vehicleType: string
  budget: string
  assetTitle?: string
}): string {
  const purchaseTypeLabel = data.vehicleType === 'direct' ? 'Direct Purchase' : 
                            data.vehicleType === 'managed' ? 'Managed Asset Program' : 
                            data.vehicleType === 'both' ? 'Both Options' : data.vehicleType
  
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FFFFFF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1A1A1A; border: 1px solid #333333; border-radius: 8px;">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #ECAC36;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ECAC36;">LUXX MIAMI</h1>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #999999;">BUY & SELL</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #FFFFFF;">Buyer Inquiry Received</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Dear ${data.customerName},
                    </p>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Thank you for your interest in purchasing ${data.assetTitle ? `the ${data.assetTitle}` : 'through Luxx Miami'}. Our team will contact you soon to discuss the details.
                    </p>
                    
                    <div style="background-color: #0A0A0A; border-left: 3px solid #ECAC36; padding: 20px; border-radius: 4px;">
                      ${data.assetTitle ? `<p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Asset:</strong> ${data.assetTitle}</p>` : ''}
                      <p style="margin: 0; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Purchase Type:</strong> ${purchaseTypeLabel}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #0A0A0A; border-top: 1px solid #333333; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #666666;">© 2025 Luxx Miami. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateAdminBuyerInquiryNotification(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleType: string
  budget: string
  message?: string
  assetTitle?: string
}): string {
  const purchaseTypeLabel = data.vehicleType === 'direct' ? 'Direct Purchase' : 
                            data.vehicleType === 'managed' ? 'Managed Asset Program' : 
                            data.vehicleType === 'both' ? 'Both Options' : data.vehicleType

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #ECAC36;">💎 New Asset Purchase Inquiry</h1>
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <h2>Inquiry Details</h2>
          ${data.assetTitle ? `<p><strong>Asset:</strong> ${data.assetTitle}</p>` : ''}
          <p><strong>Purchase Type:</strong> ${purchaseTypeLabel}</p>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
          <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ECAC36; margin-top: 20px;">
            <strong>Action Required:</strong> Contact customer promptly to discuss purchase options.
          </div>
        </div>
      </body>
    </html>
  `
}

function generateSellIntakeEmail(data: {
  customerName: string
  vehicleInfo: string
  askingPrice: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FFFFFF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1A1A1A; border: 1px solid #333333; border-radius: 8px;">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #ECAC36;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ECAC36;">LUXX MIAMI</h1>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #999999;">SELL YOUR LUXURY VEHICLE</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #FFFFFF;">Sell Request Submitted</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Dear ${data.customerName},
                    </p>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Thank you for choosing Luxx Miami to help sell your vehicle. Our team will review your submission and contact you to discuss the next steps.
                    </p>
                    
                    <div style="background-color: #0A0A0A; border-left: 3px solid #ECAC36; padding: 20px; border-radius: 4px;">
                      <p style="margin: 0 0 10px; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Vehicle:</strong> ${data.vehicleInfo}</p>
                      <p style="margin: 0; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Asking Price:</strong> ${data.askingPrice}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #0A0A0A; border-top: 1px solid #333333; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #666666;">© 2025 Luxx Miami. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateAdminSellIntakeNotification(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleInfo: string
  askingPrice: string
  message?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #ECAC36;">💰 New Sell Intake</h1>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Vehicle:</strong> ${data.vehicleInfo}</p>
          <p><strong>Asking Price:</strong> ${data.askingPrice}</p>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
        </div>
      </body>
    </html>
  `
}

function generateInvestorInterestEmail(data: {
  customerName: string
  investmentRange: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FFFFFF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1A1A1A; border: 1px solid #333333; border-radius: 8px;">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #ECAC36;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ECAC36;">LUXX MIAMI</h1>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #999999;">CO-OWNERSHIP PROGRAM</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #FFFFFF;">Interest Confirmed</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Dear ${data.customerName},
                    </p>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Thank you for your interest in Luxx Miami's co-ownership program. Our investment team will contact you with detailed information and the investor deck.
                    </p>
                    
                    <div style="background-color: #0A0A0A; border-left: 3px solid #ECAC36; padding: 20px; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Investment Range:</strong> ${data.investmentRange}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #0A0A0A; border-top: 1px solid #333333; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #666666;">© 2025 Luxx Miami. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateAdminInvestorInterestNotification(data: {
  customerEmail: string
  customerName: string
  phone: string
  investmentRange: string
  message?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #ECAC36;">💎 New Investor Interest</h1>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Investment Range:</strong> ${data.investmentRange}</p>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
          <div style="background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin-top: 20px;">
            <strong>Action Required:</strong> Send investor deck and schedule call.
          </div>
        </div>
      </body>
    </html>
  `
}

function generateVehicleManagementEmail(data: {
  customerName: string
  vehicleCount: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #FFFFFF;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1A1A1A; border: 1px solid #333333; border-radius: 8px;">
                <tr>
                  <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #ECAC36;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ECAC36;">LUXX MIAMI</h1>
                    <p style="margin: 10px 0 0; font-size: 14px; color: #999999;">VEHICLE MANAGEMENT PROGRAM</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #FFFFFF;">Inquiry Received</h2>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Dear ${data.customerName},
                    </p>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      Thank you for your interest in Luxx Miami's Vehicle Management Program. Our fleet manager will contact you within 24 hours to discuss your vehicle(s) and provide a custom management proposal.
                    </p>
                    
                    <div style="background-color: #0A0A0A; border-left: 3px solid #ECAC36; padding: 20px; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Vehicles:</strong> ${data.vehicleCount}</p>
                    </div>
                    
                    <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.6; color: #CCCCCC;">
                      In the meantime, feel free to call us at <a href="tel:+13056055899" style="color: #ECAC36;">(305) 605-5899</a> with any questions.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; background-color: #0A0A0A; border-top: 1px solid #333333; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #666666;">© 2025 Luxx Miami. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function generateAdminVehicleManagementNotification(data: {
  customerEmail: string
  customerName: string
  phone: string
  vehicleCount: string
  currentStorage?: string
  message?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #ECAC36;">🚗 New Vehicle Management Inquiry</h1>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Number of Vehicles:</strong> ${data.vehicleCount}</p>
          ${data.currentStorage ? `<p><strong>Current Storage:</strong> ${data.currentStorage}</p>` : ''}
          ${data.message ? `<p><strong>Vehicle Details:</strong> ${data.message}</p>` : ''}
          <div style="background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin-top: 20px;">
            <strong>Action Required:</strong> Prepare management proposal and schedule consultation.
          </div>
        </div>
      </body>
    </html>
  `
}
