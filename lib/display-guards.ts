export function isPresentString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isPresentNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value > 0
}

export function isTrueBoolean(value: unknown): value is true {
  return value === true
}

export function nonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0
}

export function isValidSpec(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0 && value !== 'N/A' && value !== 'n/a'
  if (typeof value === 'number') return !isNaN(value) && value > 0
  if (typeof value === 'boolean') return value === true
  if (Array.isArray(value)) return value.length > 0
  return false
}

export interface SpecRow {
  label: string
  value: string | number
  icon?: string
  subLabel?: string
}

export function buildCarSpecRows(specs: Record<string, unknown>): SpecRow[] {
  const rows: SpecRow[] = []
  
  if (isPresentNumber(specs.seats)) {
    rows.push({ label: 'Seats', value: `${specs.seats} Seats`, subLabel: 'Passenger capacity', icon: 'users' })
  }
  if (isPresentNumber(specs.horsepower)) {
    rows.push({ label: 'Horsepower', value: `${specs.horsepower} HP`, subLabel: 'Horsepower', icon: 'gauge' })
  }
  if (isPresentString(specs.acceleration)) {
    rows.push({ label: '0-60', value: specs.acceleration, subLabel: 'Acceleration', icon: 'calendar' })
  }
  if (isPresentString(specs.transmission)) {
    rows.push({ label: 'Transmission', value: specs.transmission, subLabel: 'Transmission type', icon: 'settings' })
  }
  if (isPresentString(specs.drivetrain)) {
    rows.push({ label: 'Drivetrain', value: specs.drivetrain, subLabel: 'Drive system', icon: 'car' })
  }
  if (isPresentString(specs.fuel_type) || isPresentString(specs.fuelType)) {
    const fuel = specs.fuel_type || specs.fuelType
    if (isPresentString(fuel)) {
      rows.push({ label: 'Fuel', value: fuel, subLabel: 'Fuel type', icon: 'fuel' })
    }
  }
  
  return rows
}

export function buildYachtSpecRows(specs: Record<string, unknown>): SpecRow[] {
  const rows: SpecRow[] = []
  
  if (isPresentNumber(specs.guests) || isPresentString(specs.guests)) {
    const guests = specs.guests
    rows.push({ label: 'Guests', value: `${guests} Guests`, subLabel: 'Maximum capacity', icon: 'users' })
  }
  if (isPresentString(specs.length)) {
    rows.push({ label: 'Length', value: specs.length, subLabel: 'Overall length', icon: 'anchor' })
  }
  if (isPresentString(specs.speed)) {
    rows.push({ label: 'Speed', value: specs.speed, subLabel: 'Cruising speed', icon: 'waves' })
  }
  if (isPresentNumber(specs.crew)) {
    rows.push({ label: 'Crew', value: `${specs.crew} Crew`, subLabel: 'Professional crew', icon: 'clock' })
  }
  if (isPresentNumber(specs.cabins)) {
    rows.push({ label: 'Cabins', value: `${specs.cabins} Cabins`, subLabel: 'Sleeping quarters', icon: 'bed' })
  }
  if (isPresentString(specs.engines)) {
    rows.push({ label: 'Engines', value: specs.engines, subLabel: 'Engine type', icon: 'settings' })
  }
  
  return rows
}

export function buildVillaSpecRows(specs: Record<string, unknown>): SpecRow[] {
  const rows: SpecRow[] = []
  
  if (isPresentNumber(specs.bedrooms)) {
    rows.push({ label: 'Bedrooms', value: `${specs.bedrooms} Bedrooms`, subLabel: 'Sleeping areas', icon: 'bed' })
  }
  if (isPresentNumber(specs.bathrooms)) {
    rows.push({ label: 'Bathrooms', value: `${specs.bathrooms} Bathrooms`, subLabel: 'Full bathrooms', icon: 'bath' })
  }
  if (isPresentNumber(specs.guests)) {
    rows.push({ label: 'Guests', value: `${specs.guests} Guests`, subLabel: 'Maximum occupancy', icon: 'users' })
  }
  if (isPresentString(specs.sqft)) {
    rows.push({ label: 'Size', value: specs.sqft, subLabel: 'Living space', icon: 'maximize' })
  }
  if (isPresentString(specs.parking)) {
    rows.push({ label: 'Parking', value: specs.parking, subLabel: 'Parking spaces', icon: 'car' })
  }
  if (isPresentString(specs.pool) && specs.pool !== 'No' && specs.pool !== 'None') {
    rows.push({ label: 'Pool', value: specs.pool, subLabel: 'Pool type', icon: 'waves' })
  }
  
  return rows
}

export function getExplicitFeatures(specs: Record<string, unknown>): string[] {
  const features = specs.features
  if (nonEmptyArray<string>(features)) {
    return features.filter(f => isPresentString(f))
  }
  return []
}

export function getExplicitAmenities(specs: Record<string, unknown>): string[] {
  const amenities = specs.amenities
  if (nonEmptyArray<string>(amenities)) {
    return amenities.filter(a => isPresentString(a))
  }
  return []
}
