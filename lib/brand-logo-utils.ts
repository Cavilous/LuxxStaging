export type FleetBrandLogo = {
  key: string
  logo: string
  rgb: string
}

const BRAND_LOGOS: Record<string, FleetBrandLogo> = {
  "aston-martin": {
    key: "aston-martin",
    logo: "/assets/icons/brand/aston-martin.svg",
    rgb: "137, 172, 154",
  },
  audi: {
    key: "audi",
    logo: "/assets/icons/brand/audi.svg",
    rgb: "230, 230, 230",
  },
  bentley: {
    key: "bentley",
    logo: "/assets/icons/brand/bentley.svg",
    rgb: "201, 166, 97",
  },
  bmw: {
    key: "bmw",
    logo: "/assets/icons/brand/bmw.svg",
    rgb: "28, 105, 212",
  },
  cadillac: {
    key: "cadillac",
    logo: "/assets/icons/brand/cadillac.svg",
    rgb: "192, 192, 192",
  },
  chevrolet: {
    key: "chevrolet",
    logo: "/assets/icons/brand/chevrolet.svg",
    rgb: "213, 0, 28",
  },
  ferrari: {
    key: "ferrari",
    logo: "/assets/icons/brand/ferrari.svg",
    rgb: "255, 40, 0",
  },
  ford: {
    key: "ford",
    logo: "/assets/icons/brand/ford.svg",
    rgb: "0, 102, 204",
  },
  lamborghini: {
    key: "lamborghini",
    logo: "/assets/icons/brand/lamborghini.svg",
    rgb: "182, 162, 114",
  },
  "land-rover": {
    key: "land-rover",
    logo: "/assets/icons/brand/land-rover.svg",
    rgb: "35, 126, 86",
  },
  maserati: {
    key: "maserati",
    logo: "/assets/icons/brand/maserati.svg",
    rgb: "12, 44, 104",
  },
  maybach: {
    key: "maybach",
    logo: "/assets/icons/brand/maybach.svg",
    rgb: "201, 166, 97",
  },
  mclaren: {
    key: "mclaren",
    logo: "/assets/icons/brand/mclaren.svg",
    rgb: "255, 135, 0",
  },
  mercedes: {
    key: "mercedes",
    logo: "/assets/icons/brand/mercedes.svg",
    rgb: "0, 173, 239",
  },
  porsche: {
    key: "porsche",
    logo: "/assets/icons/brand/porsche.svg",
    rgb: "213, 0, 28",
  },
  "rolls-royce": {
    key: "rolls-royce",
    logo: "/assets/icons/brand/rolls-royce.svg",
    rgb: "192, 192, 192",
  },
  tesla: {
    key: "tesla",
    logo: "/assets/icons/brand/tesla.svg",
    rgb: "204, 0, 0",
  },
}

function normalizeBrandLogoKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

export function getFleetBrandLogo(brand?: string, title?: string): FleetBrandLogo | null {
  const haystack = `${brand || ""} ${title || ""}`.toLowerCase()
  const key = normalizeBrandLogoKey(haystack)

  if (!key) return null
  if (key.includes("rollsroyce") || key.includes("cullinan") || key.includes("ghost") || key.includes("dawn")) return BRAND_LOGOS["rolls-royce"]
  if (key.includes("maybach")) return BRAND_LOGOS.maybach
  if (key.includes("mercedes") || key.includes("benz") || key.includes("amg") || key.includes("g63") || key.includes("g550")) return BRAND_LOGOS.mercedes
  if (key.includes("lamborghini") || key.includes("huracan") || key.includes("urus") || key.includes("aventador")) return BRAND_LOGOS.lamborghini
  if (key.includes("ferrari") || key.includes("488") || key.includes("812") || key.includes("sf90")) return BRAND_LOGOS.ferrari
  if (key.includes("mclaren") || key.includes("720s") || key.includes("570s")) return BRAND_LOGOS.mclaren
  if (key.includes("porsche") || key.includes("911") || key.includes("gt3")) return BRAND_LOGOS.porsche
  if (key.includes("bentley")) return BRAND_LOGOS.bentley
  if (key.includes("cadillac") || key.includes("escalade")) return BRAND_LOGOS.cadillac
  if (key.includes("bmw")) return BRAND_LOGOS.bmw
  if (key.includes("audi")) return BRAND_LOGOS.audi
  if (key.includes("tesla") || key.includes("cybertruck")) return BRAND_LOGOS.tesla
  if (key.includes("corvette") || key.includes("chevrolet") || key.includes("chevy")) return BRAND_LOGOS.chevrolet
  if (key.includes("landrover") || key.includes("rangerover")) return BRAND_LOGOS["land-rover"]
  if (key.includes("astonmartin")) return BRAND_LOGOS["aston-martin"]
  if (key.includes("maserati")) return BRAND_LOGOS.maserati
  if (key.includes("mustang") || key.includes("ford")) return BRAND_LOGOS.ford

  return null
}

export function getFleetBrandLogoStyle(brand?: string, title?: string) {
  const brandLogo = getFleetBrandLogo(brand, title)
  if (!brandLogo) return null

  return {
    "--brand-logo": `url('${brandLogo.logo}')`,
    "--brand-glow-rgb": brandLogo.rgb,
  }
}

export function getFleetBrandPageLogoStyle(brand?: string, title?: string) {
  const brandLogo = getFleetBrandLogo(brand, title)
  if (!brandLogo) return null

  return {
    "--page-brand-logo": `url('${brandLogo.logo}')`,
    "--page-brand-glow-rgb": brandLogo.rgb,
  }
}
