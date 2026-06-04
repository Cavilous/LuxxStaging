// Utilities for parsing and validating import data

export interface ParsedCarData {
  brand: string
  model: string
  exteriorColor: string | null
  interiorColor: string | null
  pricePerDay: number | null
  imageUrl: string
}

export interface ParsedVillaData {
  title: string
  location: string
  bedrooms: number | null
  bathrooms: number | null
  guests: number | null
  pricePerDay: number | null
  securityDeposit: number | null
  cleaningFee: number | null
  imageUrl: string
}

export interface ParsedYachtData {
  title: string
  year: number | null
  length: string | null
  capacity: number | null
  pricePer4Hr: number | null
  pricePer6Hr: number | null
  pricePer8Hr: number | null
  imageUrl: string
}

// Normalize brand names (ferrari → Ferrari, LAMBORGHINI → Lamborghini)
export function normalizeBrand(brand: string): string {
  if (!brand) return ''
  
  const cleaned = brand.trim()
  
  // Special cases
  const specialCases: Record<string, string> = {
    'bmw': 'BMW',
    'mercedes': 'Mercedes-Benz',
    'mercedes benz': 'Mercedes-Benz',
    'mclaren': 'McLaren',
    'ferrari': 'Ferrari',
    'ferari': 'Ferrari', // common typo
    'lamborghini': 'Lamborghini',
    'lamborguini': 'Lamborghini', // common typo
    'rolls royce': 'Rolls-Royce',
    'aston martin': 'Aston Martin',
    'porsche': 'Porsche',
    'bentley': 'Bentley',
    'tesla': 'Tesla',
    'chevrolet': 'Chevrolet',
    'chevy': 'Chevrolet',
    'cadillac': 'Cadillac',
    'jeep': 'Jeep',
    'range rover': 'Range Rover',
    'audi': 'Audi',
    'maserati': 'Maserati',
    'macerati': 'Maserati', // common typo
  }
  
  const lowerBrand = cleaned.toLowerCase()
  if (specialCases[lowerBrand]) {
    return specialCases[lowerBrand]
  }
  
  // Title case for others
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Parse color string (e.g., "White / Red" → { exterior: "White", interior: "Red" })
export function parseColor(colorString: string): { exterior: string | null, interior: string | null } {
  if (!colorString) {
    return { exterior: null, interior: null }
  }
  
  const cleaned = colorString.trim()
  
  // Check if it contains a separator
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/').map(p => p.trim())
    return {
      exterior: parts[0] || null,
      interior: parts[1] || null
    }
  }
  
  // Single color - use for both
  return {
    exterior: cleaned,
    interior: null
  }
}

// Parse price string (handles $1,095, 1095, "price upon request", etc.)
export function parsePrice(priceString: string): number | null {
  if (!priceString) return null
  
  const cleaned = priceString.trim().toLowerCase()
  
  // Handle special cases
  if (cleaned.includes('price upon request') || 
      cleaned.includes('inquire') || 
      cleaned === 'price upon request' ||
      cleaned === 'inquire') {
    return null
  }
  
  // Remove $, commas, and extract number
  const numberMatch = cleaned.replace(/[$,]/g, '').match(/[\d.]+/)
  if (numberMatch) {
    const price = parseFloat(numberMatch[0])
    return isNaN(price) ? null : Math.round(price)
  }
  
  return null
}

// Parse villa property info (e.g., "7BR - Sleeps 16" or "5 bedrooms · 4 bathrooms · 10 guests")
export function parsePropertyInfo(info: string): { 
  bedrooms: number | null, 
  bathrooms: number | null, 
  guests: number | null 
} {
  if (!info) {
    return { bedrooms: null, bathrooms: null, guests: null }
  }
  
  const cleaned = info.toLowerCase()
  let bedrooms: number | null = null
  let bathrooms: number | null = null
  let guests: number | null = null
  
  // Pattern 1: "7BR - Sleeps 16"
  const brMatch = cleaned.match(/(\d+)\s*br/i)
  if (brMatch) {
    bedrooms = parseInt(brMatch[1])
  }
  
  // Pattern 2: "5 bedrooms"
  const bedroomMatch = cleaned.match(/(\d+)\s*bedrooms?/i)
  if (bedroomMatch) {
    bedrooms = parseInt(bedroomMatch[1])
  }
  
  // Bathrooms: "4 bathrooms", "4.5 bathrooms", "4.5 bath"
  const bathMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(?:bathrooms?|bath|ba)/i)
  if (bathMatch) {
    bathrooms = parseFloat(bathMatch[1])
  }
  
  // Guests: "Sleeps 16", "10 guests"
  const sleepsMatch = cleaned.match(/sleeps?\s*(\d+)/i)
  if (sleepsMatch) {
    guests = parseInt(sleepsMatch[1])
  }
  
  const guestsMatch = cleaned.match(/(\d+)\s*guests?/i)
  if (guestsMatch) {
    guests = parseInt(guestsMatch[1])
  }
  
  return { bedrooms, bathrooms, guests }
}

// Validate and parse car row data
export function parseCarRow(row: string[]): ParsedCarData & { errors: string[], warnings: string[] } {
  const [brand, model, color, price, imageUrl] = row
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields
  if (!brand?.trim()) errors.push("Missing brand")
  if (!model?.trim()) errors.push("Missing model")
  if (!price?.trim()) errors.push("Missing price")
  
  // Optional/warning fields
  if (!imageUrl?.trim()) warnings.push("Missing image URL")
  if (!color?.trim()) warnings.push("Missing color")
  
  const normalizedBrand = normalizeBrand(brand || '')
  const { exterior, interior } = parseColor(color || '')
  const pricePerDay = parsePrice(price || '')
  
  if (price?.trim() && pricePerDay === null) {
    warnings.push(`Could not parse price: "${price}"`)
  }
  
  return {
    brand: normalizedBrand,
    model: model?.trim() || '',
    exteriorColor: exterior,
    interiorColor: interior,
    pricePerDay,
    imageUrl: imageUrl?.trim() || '',
    errors,
    warnings
  }
}

// Validate and parse villa row data
export function parseVillaRow(row: string[]): ParsedVillaData & { errors: string[], warnings: string[] } {
  const [title, location, propertyInfo, price, securityDeposit, cleaningFee, imageUrl] = row
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields
  if (!title?.trim()) errors.push("Missing title")
  if (!location?.trim()) errors.push("Missing location")
  if (!propertyInfo?.trim()) errors.push("Missing property info")
  if (!price?.trim()) errors.push("Missing price")
  if (!securityDeposit?.trim()) errors.push("Missing security deposit")
  if (!cleaningFee?.trim()) errors.push("Missing cleaning fee")
  if (!imageUrl?.trim()) errors.push("Missing image URL")
  
  const { bedrooms, bathrooms, guests } = parsePropertyInfo(propertyInfo || '')
  const pricePerDay = parsePrice(price || '')
  const secDep = parsePrice(securityDeposit || '')
  const cleaning = parsePrice(cleaningFee || '')
  
  // Warnings for unparsed data
  if (propertyInfo?.trim() && (bedrooms === null || bathrooms === null)) {
    warnings.push(`Could not fully parse property info: "${propertyInfo}"`)
  }
  
  if (price?.trim() && pricePerDay === null) {
    warnings.push(`Price set to "upon request" or could not be parsed`)
  }
  
  return {
    title: title?.trim() || '',
    location: location?.trim() || '',
    bedrooms,
    bathrooms,
    guests,
    pricePerDay,
    securityDeposit: secDep,
    cleaningFee: cleaning,
    imageUrl: imageUrl?.trim() || '',
    errors,
    warnings
  }
}

// Parse yacht specifications (e.g., "2020 | 77ft | 13 guests")
export function parseYachtSpecs(specs: string): {
  year: number | null
  length: string | null
  capacity: number | null
} {
  if (!specs) {
    return { year: null, length: null, capacity: null }
  }
  
  const cleaned = specs.toLowerCase()
  
  // Extract year (4 digits)
  const yearMatch = specs.match(/\b(19|20)\d{2}\b/)
  const year = yearMatch ? parseInt(yearMatch[0]) : null
  
  // Extract length (e.g., "77ft", "77'", "77 feet")
  const lengthMatch = specs.match(/(\d+)\s*(?:ft|'|feet|foot)/i)
  const length = lengthMatch ? `${lengthMatch[1]}ft` : null
  
  // Extract capacity (e.g., "13 guests", "sleeps 12")
  const capacityMatch = cleaned.match(/(?:sleeps?|guests?)\s*:?\s*(\d+)|(\d+)\s*(?:guests?|people|passengers)/i)
  const capacity = capacityMatch ? parseInt(capacityMatch[1] || capacityMatch[2]) : null
  
  return { year, length, capacity }
}

// Validate and parse yacht row data
// Expected format: Title, Specs (Year|Length|Capacity), 4hr Price, 6hr Price, 8hr Price, Image URL
export function parseYachtRow(row: string[]): ParsedYachtData & { errors: string[], warnings: string[] } {
  const [title, specs, price4hr, price6hr, price8hr, imageUrl] = row
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields
  if (!title?.trim()) errors.push("Missing title")
  if (!imageUrl?.trim()) errors.push("Missing image URL")
  
  // Parse specifications
  const { year, length, capacity } = parseYachtSpecs(specs || '')
  
  // Parse pricing
  const pricePer4Hr = parsePrice(price4hr || '')
  const pricePer6Hr = parsePrice(price6hr || '')
  const pricePer8Hr = parsePrice(price8hr || '')
  
  // Warnings
  if (specs?.trim() && !year && !length && !capacity) {
    warnings.push(`Could not parse yacht specs: "${specs}"`)
  }
  
  if (!price4hr?.trim() && !price6hr?.trim() && !price8hr?.trim()) {
    warnings.push("No pricing information provided")
  }
  
  return {
    title: title?.trim() || '',
    year,
    length,
    capacity,
    pricePer4Hr,
    pricePer6Hr,
    pricePer8Hr,
    imageUrl: imageUrl?.trim() || '',
    errors,
    warnings
  }
}
