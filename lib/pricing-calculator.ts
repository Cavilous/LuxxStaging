import { differenceInDays } from 'date-fns'

export interface PricingRule {
  id: string
  ruleType: string
  category: string | null
  minDuration: number | null
  maxDuration: number | null
  discountPercent: string | null
  isActive: boolean
  priority: number
}

export interface AddOn {
  id: string
  name: string
  description: string | null
  category: string
  priceType: string
  basePrice: string | null
  pricePerUnit: string | null
  minimumQuantity: number | null
  maximumQuantity: number | null
  unit: string | null
  quantity?: number
}

export interface BundleTemplate {
  id: string
  name: string
  displayName: string
  description: string | null
  categories: string[]
  discountPercent: string | null
  minimumItems: number
}

export interface CartItem {
  id: string
  category: string
  title: string
  pricePerDay?: string
  pricePer4Hr?: string
  pricePer6Hr?: string
  pricePer8Hr?: string
  startDate?: Date
  endDate?: Date
  packageType?: '4hr' | '6hr' | '8hr'
}

export interface PricingCalculation {
  baseTotal: number
  durationDiscount: number
  durationDiscountPercent: number
  bundleDiscount: number
  bundleDiscountPercent: number
  addOnsTotal: number
  subtotal: number
  totalDiscount: number
  finalTotal: number
  breakdown: {
    itemName: string
    basePrice: number
    duration?: number
    durationUnit?: string
    discount?: number
  }[]
  addOnsBreakdown: {
    name: string
    quantity: number
    unitPrice: number
    total: number
  }[]
}

export function calculateDuration(startDate: Date, endDate: Date, category: string): number {
  if (category === 'yacht') {
    const diffMs = endDate.getTime() - startDate.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60))
  }
  
  return differenceInDays(endDate, startDate)
}

export function getDurationDiscount(
  duration: number,
  category: string,
  pricingRules: PricingRule[]
): number {
  const applicableRules = pricingRules
    .filter(rule => 
      rule.isActive &&
      rule.ruleType === 'duration_discount' &&
      rule.category === category &&
      (rule.minDuration === null || duration >= rule.minDuration) &&
      (rule.maxDuration === null || duration <= rule.maxDuration)
    )
    .sort((a, b) => b.priority - a.priority)

  if (applicableRules.length === 0) return 0
  
  return parseFloat(applicableRules[0].discountPercent || '0')
}

export function getYachtPackageDiscount(
  packageType: '4hr' | '6hr' | '8hr',
  pricingRules: PricingRule[]
): number {
  const hourMap = { '4hr': 4, '6hr': 6, '8hr': 8 }
  const hours = hourMap[packageType]
  
  const applicableRules = pricingRules
    .filter(rule =>
      rule.isActive &&
      rule.ruleType === 'yacht_duration' &&
      rule.category === 'yacht' &&
      (rule.minDuration === null || hours >= rule.minDuration) &&
      (rule.maxDuration === null || hours <= rule.maxDuration)
    )
    .sort((a, b) => b.priority - a.priority)

  if (applicableRules.length === 0) return 0
  
  return parseFloat(applicableRules[0].discountPercent || '0')
}

export function getBundleDiscount(
  itemCount: number,
  pricingRules: PricingRule[]
): number {
  const applicableRules = pricingRules
    .filter(rule =>
      rule.isActive &&
      rule.ruleType === 'bundle_discount' &&
      (rule.minDuration === null || itemCount >= rule.minDuration) &&
      (rule.maxDuration === null || itemCount <= rule.maxDuration)
    )
    .sort((a, b) => b.priority - a.priority)

  if (applicableRules.length === 0) return 0
  
  return parseFloat(applicableRules[0].discountPercent || '0')
}

export function calculateAddOnsTotal(addOns: AddOn[]): {
  total: number
  breakdown: { name: string; quantity: number; unitPrice: number; total: number }[]
} {
  const breakdown = addOns.map(addOn => {
    const quantity = addOn.quantity || addOn.minimumQuantity || 1
    let unitPrice = 0

    if (addOn.priceType === 'flat' && addOn.basePrice) {
      unitPrice = parseFloat(addOn.basePrice)
    } else if (addOn.priceType === 'per_hour' && addOn.basePrice) {
      unitPrice = parseFloat(addOn.basePrice)
    } else if (addOn.priceType === 'per_day' && addOn.basePrice) {
      unitPrice = parseFloat(addOn.basePrice)
    } else if (addOn.priceType === 'per_unit' && addOn.pricePerUnit) {
      unitPrice = parseFloat(addOn.pricePerUnit)
    }

    const total = unitPrice * quantity

    return {
      name: addOn.name,
      quantity,
      unitPrice,
      total
    }
  })

  const total = breakdown.reduce((sum, item) => sum + item.total, 0)

  return { total, breakdown }
}

export function calculatePricing(
  cartItems: CartItem[],
  selectedAddOns: AddOn[],
  pricingRules: PricingRule[]
): PricingCalculation {
  let baseTotal = 0
  const breakdown: PricingCalculation['breakdown'] = []
  
  let totalDurationDiscount = 0

  cartItems.forEach(item => {
    if (item.category === 'yacht') {
      if (item.packageType && (item.pricePer4Hr || item.pricePer6Hr || item.pricePer8Hr)) {
        let packagePrice = 0
        if (item.packageType === '4hr' && item.pricePer4Hr) {
          packagePrice = parseFloat(item.pricePer4Hr)
        } else if (item.packageType === '6hr' && item.pricePer6Hr) {
          packagePrice = parseFloat(item.pricePer6Hr)
        } else if (item.packageType === '8hr' && item.pricePer8Hr) {
          packagePrice = parseFloat(item.pricePer8Hr)
        }

        const discountPercent = getYachtPackageDiscount(item.packageType, pricingRules)
        const discount = (packagePrice * discountPercent) / 100
        
        baseTotal += packagePrice
        totalDurationDiscount += discount

        breakdown.push({
          itemName: item.title,
          basePrice: packagePrice,
          duration: parseInt(item.packageType),
          durationUnit: 'hours',
          discount
        })
      }
    } else if (item.startDate && item.endDate && item.pricePerDay) {
      const duration = calculateDuration(item.startDate, item.endDate, item.category)
      const pricePerDay = parseFloat(item.pricePerDay)
      const itemBasePrice = pricePerDay * duration

      const discountPercent = getDurationDiscount(duration, item.category, pricingRules)
      const discount = (itemBasePrice * discountPercent) / 100

      baseTotal += itemBasePrice
      totalDurationDiscount += discount

      breakdown.push({
        itemName: item.title,
        basePrice: itemBasePrice,
        duration,
        durationUnit: item.category === 'villa' ? 'nights' : 'days',
        discount
      })
    }
  })

  const bundleDiscountPercent = cartItems.length >= 2 ? getBundleDiscount(cartItems.length, pricingRules) : 0
  const subtotalAfterDuration = baseTotal - totalDurationDiscount
  const bundleDiscount = (subtotalAfterDuration * bundleDiscountPercent) / 100

  const addOnsCalculation = calculateAddOnsTotal(selectedAddOns)
  const addOnsTotal = addOnsCalculation.total

  const totalDiscount = totalDurationDiscount + bundleDiscount
  const finalTotal = baseTotal - totalDiscount + addOnsTotal

  return {
    baseTotal,
    durationDiscount: totalDurationDiscount,
    durationDiscountPercent: totalDurationDiscount > 0 ? (totalDurationDiscount / baseTotal) * 100 : 0,
    bundleDiscount,
    bundleDiscountPercent,
    addOnsTotal,
    subtotal: baseTotal - totalDurationDiscount,
    totalDiscount,
    finalTotal,
    breakdown,
    addOnsBreakdown: addOnsCalculation.breakdown
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
