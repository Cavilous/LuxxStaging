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

export const BRAND_SEO_SLUGS = new Set([
  'aston-martin', 'audi', 'bentley', 'bmw', 'cadillac', 'ferrari',
  'lamborghini', 'land-rover', 'maserati', 'mclaren', 'mercedes',
  'porsche', 'rolls-royce', 'tesla',
])

export function getBrandSeoUrl(brandSlug: string): string {
  return BRAND_SEO_SLUGS.has(brandSlug) ? `/miami/${brandSlug}-rental` : '/cars-listing'
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
