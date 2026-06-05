export const SERVICE_CITIES = [
  { slug: 'miami', name: 'Miami' },
  { slug: 'fort-lauderdale', name: 'Fort Lauderdale' },
  { slug: 'miami-beach', name: 'Miami Beach' },
  { slug: 'coral-gables', name: 'Coral Gables' },
  { slug: 'boca-raton', name: 'Boca Raton' },
  { slug: 'west-palm-beach', name: 'West Palm Beach' },
  { slug: 'hollywood', name: 'Hollywood' },
  { slug: 'aventura', name: 'Aventura' },
] as const

export type CitySlug = typeof SERVICE_CITIES[number]['slug']

export function getCityName(slug: string): string {
  const city = SERVICE_CITIES.find(c => c.slug === slug)
  return city?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export const CATEGORY_LABELS: Record<string, { singular: string; plural: string; urlSegment: string }> = {
  car: { singular: 'Car', plural: 'Cars', urlSegment: 'exotic-car-rental' },
  yacht: { singular: 'Yacht', plural: 'Yachts', urlSegment: 'yacht-charter' },
  villa: { singular: 'Villa', plural: 'Villas', urlSegment: 'luxury-villa-rental' },
}

export const BRAND_SEO_LABELS: Record<string, string> = {
  'aston-martin': 'Aston Martin',
  audi: 'Audi',
  bentley: 'Bentley',
  bmw: 'BMW',
  cadillac: 'Cadillac',
  ferrari: 'Ferrari',
  lamborghini: 'Lamborghini',
  'land-rover': 'Land Rover',
  maserati: 'Maserati',
  mclaren: 'McLaren',
  mercedes: 'Mercedes',
  porsche: 'Porsche',
  'rolls-royce': 'Rolls-Royce',
  tesla: 'Tesla',
}

export const BRAND_SEO_SLUGS = new Set(Object.keys(BRAND_SEO_LABELS))

const BRAND_SEO_ALIASES: Record<string, string> = {
  amg: 'mercedes',
  aston: 'aston-martin',
  benz: 'mercedes',
  mclaren: 'mclaren',
  mercedesamg: 'mercedes',
  mercedesbenz: 'mercedes',
  rangerover: 'land-rover',
  rollsroyce: 'rolls-royce',
}

export function normalizeBrandSeoSlug(value: string | null | undefined): string {
  const normalized = (value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!normalized) return ''

  const compact = normalized.replace(/-/g, '')
  return BRAND_SEO_ALIASES[compact] || BRAND_SEO_ALIASES[normalized] || normalized
}

export function getBrandSeoDisplayName(brandSlug: string | null | undefined): string {
  const normalized = normalizeBrandSeoSlug(brandSlug)
  return BRAND_SEO_LABELS[normalized] || normalized.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function parseBrandRentalSeoSlug(seoSlug: string): string | null {
  if (!seoSlug.endsWith('-rental')) return null

  const brandSlug = normalizeBrandSeoSlug(seoSlug.replace(/-rental$/, ''))
  return BRAND_SEO_SLUGS.has(brandSlug) ? brandSlug : null
}

export function getBrandSeoUrl(brandSlug: string): string {
  const normalized = normalizeBrandSeoSlug(brandSlug)
  return BRAND_SEO_SLUGS.has(normalized) ? `/car-brand/${normalized}` : '/cars-listing'
}

export const SUGGESTED_TAGS = [
  'wedding',
  'photoshoot',
  'music-video',
  'corporate',
  'prom',
  'birthday',
  'anniversary',
  'bachelor-party',
  'bachelorette-party',
] as const
