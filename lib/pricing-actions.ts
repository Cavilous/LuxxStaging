'use server'

import { db } from '@/lib/db'
import { pricingRules, addOns, bundleTemplates } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { sendBookingConfirmation } from '@/lib/email-service'

export async function getPricingRules() {
  try {
    const rules = await db
      .select()
      .from(pricingRules)
      .where(eq(pricingRules.isActive, true))
      .orderBy(pricingRules.priority)

    return rules.map(rule => ({
      ...rule,
      discountPercent: rule.discountPercent?.toString() || null
    }))
  } catch (error) {
    console.error('Error fetching pricing rules:', error)
    return []
  }
}

export async function getAddOnsByCategory(category: string) {
  try {
    const items = await db
      .select()
      .from(addOns)
      .where(and(
        eq(addOns.category, category),
        eq(addOns.isActive, true)
      ))
      .orderBy(addOns.displayOrder)

    return items.map(item => ({
      ...item,
      basePrice: item.basePrice?.toString() || null,
      pricePerUnit: item.pricePerUnit?.toString() || null
    }))
  } catch (error) {
    console.error('Error fetching add-ons:', error)
    return []
  }
}

export async function getAllAddOns() {
  try {
    const items = await db
      .select()
      .from(addOns)
      .where(eq(addOns.isActive, true))
      .orderBy(addOns.category, addOns.displayOrder)

    return items.map(item => ({
      ...item,
      basePrice: item.basePrice?.toString() || null,
      pricePerUnit: item.pricePerUnit?.toString() || null
    }))
  } catch (error) {
    console.error('Error fetching all add-ons:', error)
    return []
  }
}

export async function getBundleTemplates() {
  try {
    const bundles = await db
      .select()
      .from(bundleTemplates)
      .where(eq(bundleTemplates.isActive, true))
      .orderBy(bundleTemplates.displayOrder)

    return bundles.map(bundle => ({
      ...bundle,
      discountPercent: bundle.discountPercent?.toString() || null,
      categories: bundle.categories as string[]
    }))
  } catch (error) {
    console.error('Error fetching bundle templates:', error)
    return []
  }
}

export async function getActivePricingRule(ruleType: string, category?: string, duration?: number) {
  try {
    const conditions = [
      eq(pricingRules.ruleType, ruleType),
      eq(pricingRules.isActive, true)
    ]

    if (category) {
      conditions.push(eq(pricingRules.category, category))
    }

    const rules = await db
      .select()
      .from(pricingRules)
      .where(and(...conditions))
      .orderBy(pricingRules.priority)

    if (!duration) {
      return rules[0] || null
    }

    const applicableRule = rules.find(rule => {
      const minOk = rule.minDuration === null || duration >= rule.minDuration
      const maxOk = rule.maxDuration === null || duration <= rule.maxDuration
      return minOk && maxOk
    })

    return applicableRule || null
  } catch (error) {
    console.error('Error fetching active pricing rule:', error)
    return null
  }
}

export async function fetchAddOnsByCategory(category: string) {
  return getAddOnsByCategory(category)
}

export async function fetchActivePricingRules() {
  return getPricingRules()
}

export async function submitBooking(data: {
  itemId: string
  itemCategory: string
  itemTitle: string
  bookingDetails: any
  selectedAddOns: any[]
  pricingBreakdown: any
}) {
  try {
    const { bookings } = await import('@/lib/db/schema')
    
    const bookingNumber = `LUXX-${Date.now().toString(36).toUpperCase()}`
    
    const items = [{
      id: data.itemId,
      category: data.itemCategory,
      title: data.itemTitle,
      ...data.bookingDetails
    }]
    
    const bookingRecord = await db.insert(bookings).values({
      bookingNumber,
      customerName: data.bookingDetails.name,
      customerEmail: data.bookingDetails.email,
      customerPhone: data.bookingDetails.phone,
      items: items as any,
      addOns: data.selectedAddOns as any,
      bundles: [] as any,
      baseTotal: data.pricingBreakdown.baseTotal.toFixed(2),
      discountTotal: data.pricingBreakdown.totalDiscount.toFixed(2),
      addOnsTotal: data.pricingBreakdown.addOnsTotal.toFixed(2),
      finalTotal: data.pricingBreakdown.finalTotal.toFixed(2),
      depositAmount: (data.pricingBreakdown.finalTotal * 0.5).toFixed(2),
      balanceAmount: (data.pricingBreakdown.finalTotal * 0.5).toFixed(2),
      balanceDueDate: data.bookingDetails.startDate 
        ? new Date(new Date(data.bookingDetails.startDate).getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      paymentMethod: null,
      status: 'pending',
      startDate: data.bookingDetails.startDate ? new Date(data.bookingDetails.startDate) : null,
      endDate: data.bookingDetails.endDate ? new Date(data.bookingDetails.endDate) : null,
      notes: data.bookingDetails.specialRequests || null,
      metadata: {
        whatsappOptIn: data.bookingDetails.whatsappOptIn || false,
        pricingBreakdown: data.pricingBreakdown
      } as any
    }).returning()

    try {
      const formatDate = (date: string | null) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })
      }

      const dates = data.bookingDetails.startDate && data.bookingDetails.endDate
        ? `${formatDate(data.bookingDetails.startDate)} - ${formatDate(data.bookingDetails.endDate)}`
        : data.bookingDetails.selectedPackage
        ? `Package: ${data.bookingDetails.selectedPackage}`
        : 'Custom dates'

      let addOnsHtml = ''
      if (data.selectedAddOns && data.selectedAddOns.length > 0) {
        addOnsHtml = '<p style="margin: 10px 0 0; font-size: 14px; color: #CCCCCC;"><strong style="color: #FFFFFF;">Add-Ons:</strong></p><ul style="margin: 5px 0 0 20px; font-size: 14px; color: #CCCCCC;">'
        data.selectedAddOns.forEach((addon: any) => {
          addOnsHtml += `<li>${addon.name} ${addon.quantity > 1 ? `(x${addon.quantity})` : ''}</li>`
        })
        addOnsHtml += '</ul>'
      }

      const emailResults = await sendBookingConfirmation({
        customerEmail: data.bookingDetails.email,
        customerName: data.bookingDetails.name,
        itemTitle: data.itemTitle,
        itemCategory: data.itemCategory,
        dates,
        totalPrice: `$${data.pricingBreakdown.finalTotal.toFixed(2)}`,
        bookingDetails: addOnsHtml
      })
      
      console.log('Email results:', {
        customerEmail: emailResults.customerResult.success ? 'sent' : 'failed',
        adminEmail: emailResults.adminResult.success ? 'sent' : 'failed',
        customerError: emailResults.customerResult.error || null,
        adminError: emailResults.adminResult.error || null
      })
    } catch (emailError) {
      console.error('Error sending booking confirmation emails:', emailError)
    }

    return { success: true, bookingId: bookingRecord[0]?.id, bookingNumber }
  } catch (error) {
    console.error('Error submitting booking:', error)
    return { success: false, error: 'Failed to submit booking. Please try again.' }
  }
}
