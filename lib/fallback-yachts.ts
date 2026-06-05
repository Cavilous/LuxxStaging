export interface FallbackYacht {
  id: string
  slug: string
  title: string
  subtitle: string
  images: string[]
  pricePerHour: string | number | null
  pricePer4Hr: string | number | null
  pricePer6Hr: string | number | null
  pricePer8Hr: string | number | null
  isFeatured: boolean
  specifications: Record<string, any>
  description?: string | null
  location?: string | null
  focalPoint: string
  flipHorizontal: boolean
  flipVertical: boolean
}

function yachtPackagePricing(price4Hr: number) {
  return {
    pricePer4Hr: price4Hr,
    pricePer6Hr: Math.round(price4Hr * 1.4),
    pricePer8Hr: Math.round(price4Hr * 1.7),
  }
}

const yachtImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/celebration-1.jpg-9cCGJJBrB9LvZM2DNLuLxCscCspOPW.jpeg"

function yacht(
  slug: string,
  title: string,
  length: string,
  price4Hr: number,
  isFeatured = false,
  subtitle = "Luxury Charter Yacht",
  images: string[] = []
): FallbackYacht {
  return {
    id: `fallback-${slug}`,
    slug,
    title,
    subtitle,
    images,
    pricePerHour: null,
    ...yachtPackagePricing(price4Hr),
    isFeatured,
    specifications: {
      length,
      guests: 13,
      crew: 2,
      amenities: ["Premium amenities", "Captain & Crew", "Sound System", "Water Toys"],
    },
    focalPoint: "50% 40%",
    flipHorizontal: false,
    flipVertical: false,
  }
}

export const fallbackYachts: FallbackYacht[] = [
  yacht("celebration", "Celebration", "120'", 8595, true, "Ferry-Style Charter Yacht", [yachtImage]),
  yacht("technomar", "Technomar", "120'", 8995),
  yacht("princess", "Princess", "100'", 15995, true, "Premium Luxury Yacht"),
  yacht("rodman-jacuzzi", "Rodman W/ Jacuzzi", "110'", 6995),
  yacht("leopard-115", "Leopard", "115'", 7195),
  yacht("paladin", "Paladin", "100'", 7195),
  yacht("azimut-daniella", "Azimut Daniella+", "100'", 7595),
  yacht("pershing-94", "Pershing", "94'", 7195),
  yacht("leopard-94", "Leopard", "94'", 7195),
  yacht("pershing-90", "Pershing", "90'", 6995),
  yacht("azimut-contemp", "Azimut Contemp", "90'", 6795, false, "Flame 2 Sea"),
  yacht("wally", "Wally", "85'", 8995, true, "High-Performance Yacht"),
  yacht("panther", "Panther", "84'", 6195),
  yacht("pershing-82", "Pershing", "82'", 6095),
  yacht("aicon", "AICON", "80'", 4495),
  yacht("adonis-numarine", "Adonis Numarine", "80'", 6195),
  yacht("aicon-therapy", "Aicon Therapy", "80'", 5995),
  yacht("ferretti-lumar", "Ferretti Lumar +", "75'", 4095),
  yacht("azimut-72", "Azimut", "72'", 4195),
  yacht("azimut-flybridge-1", "Azimut Flybridge 1", "70'", 5995),
  yacht("azimut-flybridge-2", "Azimut Flybridge 2", "70'", 5995),
  yacht("prestige", "Prestige", "68'", 4495),
  yacht("marquis", "Marquis", "66'", 4559),
  yacht("azimut-deon", "Azimut Deon", "64'", 4495),
  yacht("50-luxx", "50 Luxx", "50'", 1895),
  {
    id: "fallback-double-shot",
    slug: "double-shot",
    title: "Double Shot",
    subtitle: "Sport Motor Yacht",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/double-shot.jpg-bfLtuMvbPEYDdDOxWOk7p7krrIrbTK.jpeg"],
    pricePerHour: null,
    ...yachtPackagePricing(9995),
    isFeatured: true,
    specifications: {
      length: "95ft",
      guests: 12,
      crew: 3,
      amenities: ["Premium sound system", "Water toys", "Full bar", "Spacious deck"],
    },
    focalPoint: "50% 40%",
    flipHorizontal: false,
    flipVertical: false,
  },
]

export function getFallbackYachts() {
  return fallbackYachts
}
