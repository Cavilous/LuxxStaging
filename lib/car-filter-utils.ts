export type FleetBrandFilterOption = {
  name: string
  count: number
}

export type FleetBrandSource = {
  brand?: unknown
  make?: unknown
  title?: unknown
}

const IMPORTANT_FLEET_BRAND_ORDER = [
  "Ferrari",
  "Lamborghini",
  "Rolls-Royce",
  "McLaren",
  "Porsche",
  "Bentley",
  "Aston Martin",
  "Mercedes",
  "BMW",
  "Audi",
  "Land Rover",
  "Cadillac",
  "Maserati",
  "Chevrolet",
  "Ford",
  "Tesla",
]

const BRAND_ALIASES: Record<string, string> = {
  amg: "Mercedes",
  aston: "Aston Martin",
  astonmartin: "Aston Martin",
  audi: "Audi",
  bentley: "Bentley",
  bmw: "BMW",
  cadillac: "Cadillac",
  chevrolet: "Chevrolet",
  chevy: "Chevrolet",
  corvette: "Chevrolet",
  ferrari: "Ferrari",
  ferari: "Ferrari",
  ford: "Ford",
  lamborghini: "Lamborghini",
  lamborguini: "Lamborghini",
  land: "Land Rover",
  landrover: "Land Rover",
  maserati: "Maserati",
  macerati: "Maserati",
  mclaren: "McLaren",
  mercedes: "Mercedes",
  mercedesamg: "Mercedes",
  mercedesbenz: "Mercedes",
  mustang: "Ford",
  porsche: "Porsche",
  range: "Land Rover",
  rangerover: "Land Rover",
  rollsroyce: "Rolls-Royce",
  rr: "Rolls-Royce",
  tesla: "Tesla",
}

const BRAND_PREFIXES: Array<[string, string]> = [
  ["rollsroyce", "Rolls-Royce"],
  ["astonmartin", "Aston Martin"],
  ["rangerover", "Land Rover"],
  ["landrover", "Land Rover"],
  ["mercedesbenz", "Mercedes"],
  ["mercedesamg", "Mercedes"],
  ["lamborghini", "Lamborghini"],
  ["mclaren", "McLaren"],
  ["chevrolet", "Chevrolet"],
  ["maserati", "Maserati"],
  ["cadillac", "Cadillac"],
  ["ferrari", "Ferrari"],
  ["porsche", "Porsche"],
  ["bentley", "Bentley"],
  ["mercedes", "Mercedes"],
  ["mustang", "Ford"],
  ["corvette", "Chevrolet"],
  ["tesla", "Tesla"],
  ["aston", "Aston Martin"],
  ["audi", "Audi"],
  ["bmw", "BMW"],
  ["ford", "Ford"],
]

const GENERIC_BRAND_KEYS = new Set([
  "car",
  "cars",
  "exotic",
  "luxury",
  "luxurycar",
  "other",
  "unknown",
  "vehicle",
  "vehicles",
])

const EXCLUDED_FLEET_BRAND_KEYS = new Set(["bugatti", "koenigsegg", "pagani"])

const BODY_TYPE_ALIASES: Record<string, string> = {
  cabriolet: "Convertible",
  convertible: "Convertible",
  coupe: "Coupe",
  roadster: "Convertible",
  sedan: "Sedan",
  spider: "Convertible",
  spyder: "Convertible",
  supercar: "Supercar",
  suv: "SUV",
  truck: "SUV",
}

const DAILY_RATE_FALLBACK_MAX = 1000
const DAILY_RATE_HARD_MAX = 5000

export function normalizeFilterKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function stringifyFilterValue(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : ""
}

function toDisplayName(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const key = normalizeFilterKey(word)
      if (key === "bmw") return "BMW"
      if (key === "amg") return "AMG"
      if (key === "mclaren") return "McLaren"
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(" ")
}

function getKnownBrand(value: string): string {
  const key = normalizeFilterKey(value)
  if (!key) return ""

  const exactBrand = BRAND_ALIASES[key]
  if (exactBrand) return exactBrand

  return BRAND_PREFIXES.find(([prefix]) => key.startsWith(prefix))?.[1] || ""
}

export function canonicalizeFleetBrand(
  value: unknown,
  options: { allowUnknown?: boolean } = {},
): string {
  const rawValue = stringifyFilterValue(value)
  if (!rawValue) return ""

  const knownBrand = getKnownBrand(rawValue)
  if (knownBrand) return knownBrand

  if (!options.allowUnknown) return ""

  const shortValue = rawValue.split(/[\/,|]/)[0]?.replace(/\s+/g, " ").trim() || ""
  const words = shortValue.split(/\s+/).filter(Boolean)

  if (words.length === 0 || words.length > 2) return ""

  return toDisplayName(shortValue)
}

export function isDisplayableFleetBrand(brand: unknown): boolean {
  const key = normalizeFilterKey(stringifyFilterValue(brand))
  return Boolean(key) && !GENERIC_BRAND_KEYS.has(key) && !EXCLUDED_FLEET_BRAND_KEYS.has(key)
}

export function resolveFleetBrand({ brand, make, title }: FleetBrandSource): string {
  const fromBrand = canonicalizeFleetBrand(brand, { allowUnknown: true })
  if (isDisplayableFleetBrand(fromBrand)) return fromBrand

  const fromMake = canonicalizeFleetBrand(make, { allowUnknown: true })
  if (isDisplayableFleetBrand(fromMake)) return fromMake

  const fromTitle = canonicalizeFleetBrand(title, { allowUnknown: false })
  if (isDisplayableFleetBrand(fromTitle)) return fromTitle

  return ""
}

export function buildFleetBrandOptions(cars: Array<{ brand?: unknown }>): FleetBrandFilterOption[] {
  const counts = new Map<string, number>()

  cars.forEach((car) => {
    const brand = canonicalizeFleetBrand(car.brand, { allowUnknown: true })
    if (!isDisplayableFleetBrand(brand)) return

    counts.set(brand, (counts.get(brand) || 0) + 1)
  })

  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => {
    const aIndex = IMPORTANT_FLEET_BRAND_ORDER.indexOf(a.name)
    const bIndex = IMPORTANT_FLEET_BRAND_ORDER.indexOf(b.name)

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    if (a.count !== b.count) return b.count - a.count
    return a.name.localeCompare(b.name)
  })
}

export function normalizeFleetBodyType(value: unknown): string {
  const rawValue = stringifyFilterValue(value)
  const key = normalizeFilterKey(rawValue)
  return BODY_TYPE_ALIASES[key] || "Coupe"
}

export function parseDailyRate(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0

  const rawValue = stringifyFilterValue(value)
  if (!rawValue) return 0

  const parsedValue = Number.parseFloat(rawValue.replace(/[^0-9.]/g, ""))
  return Number.isFinite(parsedValue) ? Math.max(0, Math.round(parsedValue)) : 0
}

export function getDailyRateFilterMax(values: unknown[]): number {
  const highestDailyRate = values.reduce<number>((max, value) => Math.max(max, parseDailyRate(value)), 0)

  if (highestDailyRate <= 0) return DAILY_RATE_FALLBACK_MAX

  const roundedMax =
    highestDailyRate <= 2000
      ? Math.ceil(highestDailyRate / 100) * 100
      : Math.ceil(highestDailyRate / 500) * 500

  return Math.max(DAILY_RATE_FALLBACK_MAX, Math.min(roundedMax, DAILY_RATE_HARD_MAX))
}
