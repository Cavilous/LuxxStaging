interface HostAwayCredentials {
  accountId: string
  apiKey: string
}

interface HostAwayImage {
  url?: string
  imageUrl?: string
  srcUrl?: string
  sortOrder?: number
  [key: string]: any
}

interface HostAwayAmenity {
  amenityId?: number
  name?: string
  amenityName?: string
  isAvailable?: boolean
  [key: string]: any
}

interface HostAwayListing {
  id: number
  name: string
  description?: string
  propertyTypeId?: number
  address?: string
  city?: string
  state?: string
  countryCode?: string
  zipcode?: string
  latitude?: number
  longitude?: number
  bedrooms?: number
  bathrooms?: number
  maxGuests?: number
  squareFeet?: number
  price?: number
  weeklyPrice?: number
  monthlyPrice?: number
  currencyCode?: string
  images?: HostAwayImage[]
  listingImages?: HostAwayImage[]
  propertyImages?: HostAwayImage[]
  photos?: HostAwayImage[] | string[]
  amenities?: HostAwayAmenity[]
  checkInTime?: string
  checkOutTime?: string
  minimumStay?: number
  houseRules?: string
  [key: string]: any
}

export interface NormalizedListing {
  externalId: string
  title: string
  description: string
  pricePerDay: string | null
  pricePerWeek: string | null
  pricePerMonth: string | null
  currency: string
  specifications: Record<string, any>
  features: string[]
  images: string[]
  location: string
  thumbnailUrl: string | null
}

export interface CalendarDay {
  date: string
  status: 'available' | 'booked' | 'blocked' | 'unavailable'
  price: number | null
  minimumStay: number | null
  isAvailable: boolean
}

async function getAccessToken(credentials: HostAwayCredentials): Promise<string> {
  const response = await fetch('https://api.hostaway.com/v1/accessTokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: credentials.accountId,
      client_secret: credentials.apiKey,
      scope: 'general',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HostAway auth failed (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  return data.access_token
}

function extractImageUrls(listing: HostAwayListing): string[] {
  const rawImages =
    listing.images ||
    listing.listingImages ||
    listing.propertyImages ||
    listing.photos ||
    []

  if (!Array.isArray(rawImages) || rawImages.length === 0) return []

  if (typeof rawImages[0] === 'string') {
    return (rawImages as string[]).filter(Boolean)
  }

  const objs = rawImages as HostAwayImage[]
  const sorted = [...objs].sort(
    (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
  )

  return sorted
    .map((img) => img.url || img.imageUrl || img.srcUrl || '')
    .filter(Boolean)
}

async function fetchListingDetail(
  token: string,
  listingId: number
): Promise<HostAwayListing | null> {
  try {
    const response = await fetch(`https://api.hostaway.com/v1/listings/${listingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.warn(`HostAway: failed to fetch detail for listing ${listingId} (${response.status}), using summary data`)
      return null
    }

    const data = await response.json()
    const result = data.result || null
    if (result) {
      const imgs = extractImageUrls(result)
      console.log(`HostAway listing ${listingId}: ${imgs.length} images found (fields checked: images/listingImages/propertyImages/photos)`)
    }
    return result
  } catch (err) {
    console.warn(`HostAway: error fetching detail for listing ${listingId}:`, err)
    return null
  }
}

async function batchedParallel<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map(fn))
    results.push(...batchResults)
  }
  return results
}

export async function fetchHostAwayListings(credentials: HostAwayCredentials): Promise<NormalizedListing[]> {
  const token = await getAccessToken(credentials)

  const response = await fetch('https://api.hostaway.com/v1/listings', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HostAway API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const summaryListings: HostAwayListing[] = data.result || []

  const enrichedListings = await batchedParallel(
    summaryListings,
    async (summary) => {
      const detail = await fetchListingDetail(token, summary.id)
      if (detail) {
        const merged = { ...summary, ...detail }
        const summaryImgs = extractImageUrls(summary)
        const detailImgs = extractImageUrls(detail)
        const imgs = detailImgs.length > 0 ? detailImgs : summaryImgs
        merged.images = imgs.map(url => ({ url, sortOrder: 0 }))
        return merged
      }
      return summary
    },
    5
  )

  return enrichedListings.map(normalizeListing)
}

export async function fetchListingCalendar(
  credentials: HostAwayCredentials,
  listingId: string,
  startDate: string,
  endDate: string
): Promise<CalendarDay[]> {
  const token = await getAccessToken(credentials)

  const url = new URL(`https://api.hostaway.com/v1/listings/${listingId}/calendar`)
  url.searchParams.set('startDate', startDate)
  url.searchParams.set('endDate', endDate)

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HostAway calendar API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const rawDays: any[] = data.result || []

  return rawDays.map((day): CalendarDay => {
    const isAvail = day.isAvailable === 1 || day.isAvailable === true || day.status === 'available'
    let status: CalendarDay['status'] = 'available'
    if (!isAvail) {
      if (day.status === 'booked') status = 'booked'
      else if (day.status === 'blocked') status = 'blocked'
      else status = 'unavailable'
    }
    return {
      date: day.date,
      status,
      price: day.price != null ? Number(day.price) : null,
      minimumStay: day.minimumStay != null ? Number(day.minimumStay) : null,
      isAvailable: isAvail,
    }
  })
}

function normalizeListing(listing: HostAwayListing): NormalizedListing {
  const images = extractImageUrls(listing)

  const locationParts = [listing.city, listing.state].filter(Boolean)
  const location = locationParts.join(', ') || ''

  const specifications: Record<string, any> = {}
  if (listing.bedrooms) specifications.bedrooms = listing.bedrooms
  if (listing.bathrooms) specifications.bathrooms = listing.bathrooms
  if (listing.maxGuests) specifications.guests = listing.maxGuests
  if (listing.squareFeet) specifications.squareFeet = listing.squareFeet
  if (listing.address) specifications.address = listing.address
  if (listing.zipcode) specifications.zipcode = listing.zipcode
  if (listing.countryCode) specifications.countryCode = listing.countryCode
  if (listing.latitude != null) specifications.latitude = listing.latitude
  if (listing.longitude != null) specifications.longitude = listing.longitude
  if (listing.checkInTime) specifications.checkInTime = listing.checkInTime
  if (listing.checkOutTime) specifications.checkOutTime = listing.checkOutTime
  if (listing.minimumStay) specifications.minimumStay = listing.minimumStay
  if (listing.houseRules) specifications.houseRules = listing.houseRules

  const features: string[] = []

  if (listing.propertyTypeId) {
    const propertyTypes: Record<number, string> = {
      1: 'Apartment', 2: 'House', 3: 'Condo', 4: 'Villa',
      5: 'Cabin', 6: 'Cottage', 7: 'Bungalow', 8: 'Townhouse',
    }
    const typeName = propertyTypes[listing.propertyTypeId]
    if (typeName) features.push(typeName)
  }

  const amenities = listing.amenities || listing.propertyAmenities || []
  if (Array.isArray(amenities)) {
    for (const amenity of amenities) {
      const amenityName = amenity.name || amenity.amenityName
      if (amenityName && amenity.isAvailable !== false) {
        features.push(String(amenityName))
      }
    }
  }

  return {
    externalId: String(listing.id),
    title: listing.name || 'Untitled Listing',
    description: listing.description || '',
    pricePerDay: listing.price ? String(listing.price) : null,
    pricePerWeek: listing.weeklyPrice ? String(listing.weeklyPrice) : null,
    pricePerMonth: listing.monthlyPrice ? String(listing.monthlyPrice) : null,
    currency: listing.currencyCode || 'USD',
    specifications,
    features,
    images,
    location,
    thumbnailUrl: images[0] || null,
  }
}
