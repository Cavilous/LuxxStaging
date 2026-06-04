export interface CarBrand {
  name: string
  slug: string
}

export const CAR_BRANDS: CarBrand[] = [
  { name: "Acura", slug: "acura" },
  { name: "Alfa Romeo", slug: "alfa-romeo" },
  { name: "Aston Martin", slug: "aston-martin" },
  { name: "Audi", slug: "audi" },
  { name: "Bentley", slug: "bentley" },
  { name: "BMW", slug: "bmw" },
  { name: "Bugatti", slug: "bugatti" },
  { name: "Cadillac", slug: "cadillac" },
  { name: "Chevrolet", slug: "chevrolet" },
  { name: "Dodge", slug: "dodge" },
  { name: "Ferrari", slug: "ferrari" },
  { name: "Ford", slug: "ford" },
  { name: "Jaguar", slug: "jaguar" },
  { name: "Koenigsegg", slug: "koenigsegg" },
  { name: "Lamborghini", slug: "lamborghini" },
  { name: "Land Rover", slug: "land-rover" },
  { name: "Lotus", slug: "lotus" },
  { name: "Maserati", slug: "maserati" },
  { name: "McLaren", slug: "mclaren" },
  { name: "Mercedes", slug: "mercedes" },
  { name: "Pagani", slug: "pagani" },
  { name: "Porsche", slug: "porsche" },
  { name: "Rolls-Royce", slug: "rolls-royce" },
  { name: "Tesla", slug: "tesla" },
  { name: "Other", slug: "other" },
]

export const CAR_BRAND_NAMES = CAR_BRANDS.map(b => b.name)

export function getBrandBySlug(slug: string): CarBrand | undefined {
  return CAR_BRANDS.find(b => b.slug === slug)
}

export function getBrandByName(name: string): CarBrand | undefined {
  return CAR_BRANDS.find(b => b.name.toLowerCase() === name.toLowerCase())
}

export function getSlugFromBrandName(name: string): string {
  const brand = getBrandByName(name)
  return brand?.slug || name.toLowerCase().replace(/\s+/g, '-')
}
