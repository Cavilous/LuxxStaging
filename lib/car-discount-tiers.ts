export type CarDiscountTier = {
  label: string
  slug: string
  days: number
  savingsPerDay: number
  floorPercent: number
  emphasis?: "mid" | "best"
}

/**
 * Optional per-listing multi-day rates sourced from the inventory table
 * (inventory.pricePerWeek / inventory.pricePerMonth). When a listing supplies
 * these, they win over the config-computed rate for the matching tier; when
 * absent, the config below is the fallback. Accepts the raw decimal strings
 * that drizzle returns, or numbers, or null/undefined.
 */
export type RateOverrides = {
  pricePerWeek?: string | number | null
  pricePerMonth?: string | number | null
}

// ---------------------------------------------------------------------------
// EDITABLE CONFIG
// Percentages/savings below are the single source of truth for the fallback
// (compute-from-daily) path. `savingsPerDay` = flat $ off the daily rate;
// `floorPercent` = the lowest the per-day rate may fall to (as a % of base),
// so premium vehicles never discount below a sensible floor.
// ---------------------------------------------------------------------------
export const CAR_DISCOUNT_TIERS: CarDiscountTier[] = [
  { label: "3-Day", slug: "3-day", days: 3, savingsPerDay: 150, floorPercent: 80 },
  { label: "7-Day", slug: "7-day", days: 7, savingsPerDay: 300, floorPercent: 65, emphasis: "mid" },
  { label: "14-Day", slug: "14-day", days: 14, savingsPerDay: 450, floorPercent: 58, emphasis: "mid" },
  { label: "Monthly", slug: "monthly", days: 30, savingsPerDay: 600, floorPercent: 55, emphasis: "best" },
]

// Which per-listing override column feeds which tier. Weekly rate governs the
// 7-day tier; monthly rate governs the 30-day (Monthly) tier. Tiers without a
// matching column always use the config computation.
const OVERRIDE_DAYS = {
  week: 7,
  month: 30,
} as const

export function roundRateToFive(value: number) {
  return Math.round(value / 5) * 5
}

function toPositiveNumber(value: string | number | null | undefined): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

/**
 * Per-day rate derived purely from the editable config (base daily rate minus
 * the tier's savings, never below the tier floor).
 */
function getConfigDailyRate(baseRate: number, days: number) {
  const tier = [...CAR_DISCOUNT_TIERS].reverse().find((candidate) => days >= candidate.days)
  if (!tier) return baseRate

  const fixedSavingsRate = baseRate - tier.savingsPerDay
  const floorRate = baseRate * (tier.floorPercent / 100)
  return roundRateToFive(Math.max(fixedSavingsRate, floorRate))
}

/**
 * Per-day rate for a given rental length. If the listing supplies a matching
 * per-listing override (weekly rate for the 7-day tier, monthly rate for the
 * 30-day tier), that override is converted to a per-day figure and used;
 * otherwise the config computation is the fallback. The override is clamped so
 * a mis-entered column can never quote *above* the base daily rate.
 */
export function getTieredDailyRate(baseRate: number, days: number, overrides?: RateOverrides) {
  if (baseRate <= 0) return baseRate

  const overrideDaily = getOverrideDailyRate(baseRate, days, overrides)
  if (overrideDaily !== null) return overrideDaily

  return getConfigDailyRate(baseRate, days)
}

function getOverrideDailyRate(
  baseRate: number,
  days: number,
  overrides?: RateOverrides,
): number | null {
  if (!overrides) return null

  let total = 0
  let periodDays = 0
  if (days === OVERRIDE_DAYS.week) {
    total = toPositiveNumber(overrides.pricePerWeek)
    periodDays = OVERRIDE_DAYS.week
  } else if (days === OVERRIDE_DAYS.month) {
    total = toPositiveNumber(overrides.pricePerMonth)
    periodDays = OVERRIDE_DAYS.month
  }

  if (total <= 0 || periodDays <= 0) return null

  // Clamp to the base rate so an override never quotes above the daily price.
  const perDay = Math.min(total / periodDays, baseRate)
  return roundRateToFive(perDay)
}

export function getReservationTotal(dailyRate: number, days: number) {
  return dailyRate * days
}

// ---------------------------------------------------------------------------
// CONTINUOUS RATE (Limitless-style estimator)
// A single piecewise-continuous function over 1..30 days built from the same
// CAR_DISCOUNT_TIERS + RateOverrides above. Used by both the listing-card pills
// (1D / 3D / 5D / 7D / 14D+) and the detail-page slider, so every day value
// resolves through one source of truth.
//
//   1-2   -> base daily rate (no discount)
//   3-4   -> 3-day tier
//   5-6   -> midpoint between the 3-day and 7-day tiers (rounded to $5)
//   7-13  -> 7-day tier (weekly override wins when present)
//   14-29 -> 14-day tier
//   30    -> monthly tier (monthly override wins when present)
// ---------------------------------------------------------------------------
export function effectiveDailyRate(days: number, baseRate: number, overrides?: RateOverrides): number {
  if (baseRate <= 0) return baseRate

  const clampedDays = Math.max(1, Math.min(30, Math.round(days)))

  // 1-2 days: no multi-day discount, quote the base rate.
  if (clampedDays < 3) return baseRate

  // 5-6 days: interpolate halfway between the 3-day and 7-day tier rates. The
  // Limitless design has a dedicated 5D pill with no matching tier, so we blend.
  if (clampedDays >= 5 && clampedDays < 7) {
    const threeDay = getTieredDailyRate(baseRate, 3, overrides)
    const sevenDay = getTieredDailyRate(baseRate, 7, overrides)
    return roundRateToFive((threeDay + sevenDay) / 2)
  }

  // Every other bracket resolves to its governing tier's day count so the
  // per-listing weekly/monthly overrides are honored via getTieredDailyRate.
  let tierDays = 3
  if (clampedDays >= 30) tierDays = 30
  else if (clampedDays >= 14) tierDays = 14
  else if (clampedDays >= 7) tierDays = 7

  return getTieredDailyRate(baseRate, tierDays, overrides)
}

export function parseDailyRate(price: string) {
  return Number.parseInt(price.replace(/[^0-9]/g, ""), 10) || 0
}
