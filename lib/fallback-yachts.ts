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
const doubleShotImage = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/double-shot.jpg-bfLtuMvbPEYDdDOxWOk7p7krrIrbTK.jpeg"
const wallyImage = "https://photos.smugmug.com/AVAILABLE-YACHTS/85-Wally/i-PqRBfLp/0/KNV8QGsh5NRptSFgPGpDR8LzXgfmJDKGnVvL88Cst/L/IMG_4639-L.jpg"
const azimutDaniellaImage = "https://photos.smugmug.com/YACHTS/Daniela-100-FT-Azimut/i-Tn52xQq/0/Lwbc8wp4pwsBZcZwq9RNMjQD3kLcDcLk6XmVGdx6c/XL/Photo%20Jun%2003%202023%2C%206%2051%2044%20AM-XL.jpg"
const leopardImage = "https://photos.smugmug.com/YACHTS/Leopard-94f/i-MnJN3jd/0/LgJsVpkgrbjr6M5fD7vBcjqSz8q6mvq2ZHbbv3P4x/L/1.%20Yacht%20Outside%20Front-L.jpg"
const paladinImage = "https://photos.smugmug.com/YACHTS/Paladin-100-footer/i-MbFsCZC/0/MVJK6bNLJvV6fCWbMtdR4xp68d8hGVZLhvGFS3tW5/L/DSC07840-L.jpg"
const rodmanImage = "https://photos.smugmug.com/AVAILABLE-YACHTS/Rodman-110-ft/i-Q8fbSnv/0/MbbNGX4xS6VvxcwccqZvRTtjjjJpnR2Nt25j3GBsj/XL/Foto%203-19-22%2C%207%2044%2017%20p.m.-XL.jpg"
const azimutContempImage = "https://photos.smugmug.com/YACHTS/86-ft-azimut/i-kbkb8Fz/0/NCmDzKmHt4NxJDD4dbpNfDspPnHvwwZ2swJBQ3r9f/L/InShot_20220209_114837909-L.jpg"
const azimut72Image = "https://photos.smugmug.com/YACHTS/72-AZIMUT/i-GzFcBJN/0/MMwRBKGLgxHTfwL2Lc5Swk3b6ZszB6Pv7nPB5v42b/L/7230042_20190926094824784_1_XLARGE-L.jpg"
const azimutFlybridge1Image = "https://photos.smugmug.com/YACHTS/70-Azimut-Lupo-1/i-SMLggD3/0/KJFTJ73FpSdVvHCMpP4Gzg44j6G8FSk66XvmBdmvZ/L/70%27%20Azimut%20-%20Lupo%201%20-%201-L.jpg"
const azimutFlybridge2Image = "https://photos.smugmug.com/YACHTS/70-Azimut-Lupo-2/i-TfjJ2bF/0/LLwbX3VrMbmHRTQ3TJkhkx8KWC4FcGNdwCTCfsGtL/L/70%27%20Azimut%20-%20Lupo%202%20-%201-L.jpg"
const marquisImage = "https://photos.smugmug.com/YACHTS/66-MARQUIS/i-PK87kB4/0/LQFpjMpXGGKkTxntBDrzd9m8VTCWKZBfFXbQjTGxw/XL/Marquis%20660%20Sport%20-%20Drone%20-9-XL.jpg"
const azimutDeonImage = "https://photos.smugmug.com/YACHTS/64-Azimut-Deon/Drone/i-qsHHt8z/0/KffW3FBSSqPtsh3hCMvMC96j6X6S5cCG8HLm4BFBZ/XL/64%27%20Azimut%20-%20Deon%20-%20Drone%20-%202-XL.jpg"
const prestigeImage = "https://photos.smugmug.com/YACHTS/Prestige-68-ft/i-9nH5nZm/0/MkFLbmmG33HMkM4JVMHdh9Sn2mksWx3mSppnktxjs/L/dba4a4cf-897e-4795-95a0-7d71750ed24e-L.jpg"

const fallbackYachtImagesBySlug: Record<string, string[]> = {
  celebration: [yachtImage],
  technomar: [wallyImage],
  princess: [paladinImage],
  "rodman-jacuzzi": [rodmanImage],
  "leopard-115": [paladinImage],
  paladin: [paladinImage],
  "azimut-daniella": [azimutDaniellaImage],
  "pershing-94": [wallyImage],
  "leopard-94": [leopardImage],
  "pershing-90": [azimutContempImage],
  "azimut-contemp": [azimutContempImage],
  wally: [wallyImage],
  panther: [wallyImage],
  "pershing-82": [marquisImage],
  aicon: [prestigeImage],
  "adonis-numarine": [azimutDeonImage],
  "aicon-therapy": [prestigeImage],
  "ferretti-lumar": [marquisImage],
  "azimut-72": [azimut72Image],
  "azimut-flybridge-1": [azimutFlybridge1Image],
  "azimut-flybridge-2": [azimutFlybridge2Image],
  prestige: [prestigeImage],
  marquis: [marquisImage],
  "azimut-deon": [azimutDeonImage],
  "50-luxx": [prestigeImage],
  "double-shot": [doubleShotImage],
}

const fallbackYachtImagesByTitle: Record<string, string[]> = {
  celebration: [yachtImage],
  technomar: [wallyImage],
  princess: [paladinImage],
  rodmanwjacuzzi: [rodmanImage],
  leopard: [leopardImage],
  paladin: [paladinImage],
  azimutdaniella: [azimutDaniellaImage],
  pershing: [wallyImage],
  azimutcontemp: [azimutContempImage],
  wally: [wallyImage],
  panther: [wallyImage],
  aicon: [prestigeImage],
  adonisnumarine: [azimutDeonImage],
  aicontherapy: [prestigeImage],
  ferrettilumar: [marquisImage],
  azimut: [azimut72Image],
  azimutflybridge1: [azimutFlybridge1Image],
  azimutflybridge2: [azimutFlybridge2Image],
  prestige: [prestigeImage],
  marquis: [marquisImage],
  azimutdeon: [azimutDeonImage],
  "50luxx": [prestigeImage],
  doubleshot: [doubleShotImage],
}

function normalizeYachtImageKey(value: string | null | undefined) {
  return (value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "")
}

export function getFallbackYachtImages(slug?: string | null, title?: string | null): string[] {
  if (slug && fallbackYachtImagesBySlug[slug]) return fallbackYachtImagesBySlug[slug]

  const slugKey = normalizeYachtImageKey(slug)
  const titleKey = normalizeYachtImageKey(title)

  return (
    fallbackYachtImagesByTitle[slugKey] ||
    fallbackYachtImagesByTitle[titleKey] ||
    [wallyImage]
  )
}

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
    images: images.length > 0 ? images : getFallbackYachtImages(slug, title),
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
    images: [doubleShotImage],
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
