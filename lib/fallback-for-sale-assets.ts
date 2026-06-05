export type ForSaleAssetCategory = "car" | "yacht" | "villa"

export interface ForSaleAssetListResponse {
  id: string
  slug: string
  title: string
  category: ForSaleAssetCategory
  brand: string
  model: string
  year: number | null
  specs: Record<string, any>
  heroImage: string
  images: string[]
  advertisedPrice: number | null
  managedAssetPrice: number | null
  managementTerms: Record<string, any>
  status: string
  location: string
  description: string
  badges: string[]
}

export interface ForSaleAssetDetailResponse extends ForSaleAssetListResponse {
  metaTitle: string | null
  metaDescription: string | null
}

const fallbackForSaleAssets: ForSaleAssetDetailResponse[] = [
  {
    id: "fallback-for-sale-ferrari-sf90",
    slug: "staging-demo-ferrari-sf90-stradale",
    title: "Ferrari SF90 Stradale - Staging Demo",
    category: "car",
    brand: "Ferrari",
    model: "SF90 Stradale",
    year: 2024,
    specs: {
      horsepower: 986,
      miles: 1200,
      transmission: "Automatic",
      drivetrain: "AWD",
      exteriorColor: "Rosso Corsa",
      interiorColor: "Nero",
    },
    heroImage: "/ferrari-sf90-stradale.png",
    images: [
      "/ferrari-sf90-stradale.png",
      "/lamborghini-huracan.png",
      "/mclaren-720s.png",
    ],
    advertisedPrice: 695000,
    managedAssetPrice: 615000,
    managementTerms: {
      ownerUseAllotment: 28,
      minHoldMonths: 18,
      revSharePctOwner: 70,
      revSharePctLuxx: 30,
      maintenanceIncluded: true,
      insuranceIncluded: true,
    },
    status: "Live",
    location: "Miami, FL",
    description:
      "Staging-safe demo listing for public preview when live inventory is unavailable. Final availability, condition, and pricing must be confirmed by Luxx Miami.",
    badges: ["Staging Demo", "Managed Program"],
    metaTitle: "Ferrari SF90 Stradale for Sale - Staging Demo",
    metaDescription:
      "Staging-safe Ferrari SF90 Stradale demo listing for Luxx Miami public preview.",
  },
  {
    id: "fallback-for-sale-azimut-62",
    slug: "staging-demo-azimut-62-flybridge",
    title: "Azimut 62 Flybridge - Staging Demo",
    category: "yacht",
    brand: "Azimut",
    model: "62 Flybridge",
    year: 2021,
    specs: {
      lengthFt: 62,
      guests: 12,
      cabins: 3,
      crew: 2,
      builder: "Azimut",
    },
    heroImage: "/luxury-azimut-yacht.png",
    images: [
      "/luxury-azimut-yacht.png",
      "/luxury-yacht.png",
      "/miami-celebration-yacht.png",
    ],
    advertisedPrice: 1250000,
    managedAssetPrice: 1095000,
    managementTerms: {
      ownerUseAllotment: 21,
      minHoldMonths: 24,
      revSharePctOwner: 65,
      revSharePctLuxx: 35,
      maintenanceIncluded: true,
      insuranceIncluded: false,
    },
    status: "Live",
    location: "Miami Beach, FL",
    description:
      "Staging-safe demo yacht listing for public preview when live buy/sell data is unavailable. Details are sample-only and require Luxx Miami confirmation.",
    badges: ["Staging Demo"],
    metaTitle: "Azimut 62 Flybridge for Sale - Staging Demo",
    metaDescription:
      "Staging-safe Azimut 62 Flybridge demo listing for Luxx Miami public preview.",
  },
  {
    id: "fallback-for-sale-waterfront-villa",
    slug: "staging-demo-miami-waterfront-villa",
    title: "Miami Waterfront Villa - Staging Demo",
    category: "villa",
    brand: "",
    model: "",
    year: null,
    specs: {
      bedrooms: 6,
      bathrooms: 6.5,
      sqft: 6200,
      waterfront: true,
      pool: true,
      garage: 3,
    },
    heroImage: "/luxury-waterfront-villa.png",
    images: [
      "/luxury-waterfront-villa.png",
      "/south-beach-villa-art-deco.png",
      "/luxury-penthouse-miami-interior.png",
    ],
    advertisedPrice: 4900000,
    managedAssetPrice: 4450000,
    managementTerms: {
      ownerUseAllotment: 35,
      minHoldMonths: 24,
      revSharePctOwner: 60,
      revSharePctLuxx: 40,
      maintenanceIncluded: true,
      insuranceIncluded: false,
    },
    status: "Live",
    location: "Miami, FL",
    description:
      "Staging-safe demo villa listing for public preview when live assets are unavailable. The listing is sample content and not an active offer.",
    badges: ["Staging Demo", "Concierge Managed"],
    metaTitle: "Miami Waterfront Villa for Sale - Staging Demo",
    metaDescription:
      "Staging-safe Miami waterfront villa demo listing for Luxx Miami public preview.",
  },
]

function cloneListAsset(asset: ForSaleAssetDetailResponse): ForSaleAssetListResponse {
  const { metaTitle: _metaTitle, metaDescription: _metaDescription, ...listAsset } = asset

  return {
    ...listAsset,
    specs: { ...asset.specs },
    images: [...asset.images],
    managementTerms: { ...asset.managementTerms },
    badges: [...asset.badges],
  }
}

function cloneDetailAsset(asset: ForSaleAssetDetailResponse): ForSaleAssetDetailResponse {
  return {
    ...asset,
    specs: { ...asset.specs },
    images: [...asset.images],
    managementTerms: { ...asset.managementTerms },
    badges: [...asset.badges],
  }
}

function normalizeFilterValue(value: string | null | undefined) {
  return value?.trim().toLowerCase() || ""
}

export function getFallbackForSaleAssets({
  category,
  search,
}: {
  category?: string | null
  search?: string | null
} = {}) {
  const normalizedCategory = normalizeFilterValue(category)
  const normalizedSearch = normalizeFilterValue(search)

  return fallbackForSaleAssets
    .filter((asset) => asset.status === "Live")
    .filter((asset) => {
      if (!normalizedCategory || normalizedCategory === "all") return true
      return asset.category === normalizedCategory
    })
    .filter((asset) => {
      if (!normalizedSearch) return true

      const haystack = [
        asset.title,
        asset.brand,
        asset.model,
        asset.location,
        ...asset.badges,
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(normalizedSearch)
    })
    .map(cloneListAsset)
}

export function getFallbackForSaleAssetBySlug(slug: string) {
  const normalizedSlug = normalizeFilterValue(slug)
  const asset = fallbackForSaleAssets.find(
    (candidate) => candidate.status === "Live" && candidate.slug === normalizedSlug
  )

  return asset ? cloneDetailAsset(asset) : null
}
