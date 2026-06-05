export type CarDiscountTier = {
  label: string
  slug: string
  days: number
  percent: number
  emphasis?: "mid" | "best"
}

export type SelectedCarDiscount = CarDiscountTier & {
  rate: number
  savingsPerDay: number
  totalSavings: number
}

export const CAR_DISCOUNT_TIERS: CarDiscountTier[] = [
  { label: "3-Day", slug: "3-day", days: 3, percent: 10 },
  { label: "7-Day", slug: "7-day", days: 7, percent: 15, emphasis: "mid" },
  { label: "14-Day", slug: "14-day", days: 14, percent: 20, emphasis: "mid" },
  { label: "Monthly", slug: "monthly", days: 30, percent: 30, emphasis: "best" },
]

export function roundRateToFive(value: number) {
  return Math.round(value / 5) * 5
}

export function getTieredDailyRate(baseRate: number, days: number) {
  const tier = [...CAR_DISCOUNT_TIERS].reverse().find((candidate) => days >= candidate.days)
  if (!tier) return baseRate
  return roundRateToFive(baseRate * (1 - tier.percent / 100))
}

export function getDiscountHref(detailUrl: string, tier: CarDiscountTier, baseRate: number) {
  const rate = getTieredDailyRate(baseRate, tier.days)
  const params = new URLSearchParams({
    tier: tier.slug,
    days: String(tier.days),
    rate: String(rate),
  })

  return `${detailUrl}?${params.toString()}`
}

export function parseDailyRate(price: string) {
  return Number.parseInt(price.replace(/[^0-9]/g, ""), 10) || 0
}

export function getSelectedCarDiscount(
  searchParams: Record<string, string | string[] | undefined>,
  baseRate: number,
): SelectedCarDiscount | null {
  const rawDays = Array.isArray(searchParams.days) ? searchParams.days[0] : searchParams.days
  const days = Number.parseInt(rawDays || "", 10)
  const tier = CAR_DISCOUNT_TIERS.find((candidate) => candidate.days === days)

  if (!tier || baseRate <= 0) return null

  const rate = getTieredDailyRate(baseRate, tier.days)
  const savingsPerDay = Math.max(0, baseRate - rate)

  return {
    ...tier,
    rate,
    savingsPerDay,
    totalSavings: savingsPerDay * tier.days,
  }
}
