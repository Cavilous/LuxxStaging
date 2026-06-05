export interface FallbackVilla {
  id: string
  category: "villa"
  slug: string
  title: string
  subtitle: string
  description: string
  images: string[]
  thumbnails: string[]
  pricePerDay: string | number | null
  isFeatured: boolean
  specifications: Record<string, any>
  focalPoint: string
  flipHorizontal: boolean
  flipVertical: boolean
  externalSource: string | null
  externalId: string | null
}

function villa(
  id: string,
  slug: string,
  title: string,
  subtitle: string,
  pricePerDay: string | number | null,
  specifications: Record<string, any>,
  images: string[],
  isFeatured = false,
  description?: string
): FallbackVilla {
  const guests = specifications.guests ?? specifications.maxGuests ?? null

  return {
    id,
    category: "villa",
    slug,
    title,
    subtitle,
    description:
      description ||
      `Luxury villa in ${subtitle}. ${specifications.bedrooms || "Multiple"} bedrooms${guests ? `, sleeps ${guests} guests` : ""}.`,
    images,
    thumbnails: [],
    pricePerDay,
    isFeatured,
    specifications: {
      ...specifications,
      guests,
      location: specifications.location || subtitle,
      neighborhood: specifications.neighborhood || subtitle,
      amenities: specifications.amenities || ["Pool", "WiFi", "Air Conditioning"],
    },
    focalPoint: "50% 40%",
    flipHorizontal: false,
    flipVertical: false,
    externalSource: null,
    externalId: null,
  }
}

export const fallbackVillas: FallbackVilla[] = [
  villa(
    "9687f985-3e02-43a3-991e-e99a944cb92b",
    "villa-vivian",
    "Villa Vivian",
    "Biscayne Bay",
    "3250.00",
    { bedrooms: 5, bathrooms: 4, guests: 12 },
    [
      "https://drive.google.com/uc?export=view&id=1DyrPVo2rUU-GvHshpelYqIDI4yjjIPc9",
      "https://drive.google.com/uc?export=view&id=1olBxfXnaZfPV-m3MNyujnPSdmla7016n",
      "https://drive.google.com/uc?export=view&id=1ig2G-uApgTwQHgCvZMynXl3XnR74yQM4",
      "https://drive.google.com/uc?export=view&id=1IW3y7dOPKF4TlAQQS55C1-k-fXpYbBDv",
      "https://drive.google.com/uc?export=view&id=1R-ffDMQ31WTxgTi2HcgmFI_bKJqmh2Yw",
    ],
    true,
    "Luxury villa in Biscayne Bay. 5 bedrooms - 4 bathrooms - 12 guests"
  ),
  villa(
    "9687747f-5f45-47c2-8a46-4456d946c0ae",
    "villa-zar",
    "VILLA ZAR",
    "Coral Gables",
    "1395.00",
    { bedrooms: 5, bathrooms: 5, guests: 13, cleaningFee: 600, securityDeposit: 1000 },
    [
      "https://drive.google.com/uc?export=view&id=1O2MOg-q6vo7qZ02wJsDT-D3QM4iV0eUq",
      "https://drive.google.com/uc?export=view&id=1omTs7ypiqgicXcRV4QlU3JVKapQYgoYp",
      "https://drive.google.com/uc?export=view&id=1jHq6fWKlAhOkVY_1l6rybk_0bpj84bx0",
      "https://drive.google.com/uc?export=view&id=151brmUFmuEHy5_NZN29d7GR9gYRuHzQX",
      "https://drive.google.com/uc?export=view&id=1N3NUSSyIniYlHLG9aptoO85dC6huc15J",
    ],
    false,
    "Luxury villa in Coral Gables. 5 bedrooms - 5 bathrooms - 13 guests"
  ),
  villa(
    "9451d381-0d93-4b47-8a1a-5985570ba417",
    "villa-cristo",
    "Villa Cristo",
    "South Miami",
    "2095.00",
    { bedrooms: 6, bathrooms: 8, guests: 10, cleaningFee: 950, securityDeposit: 2500 },
    [
      "https://drive.google.com/uc?export=view&id=1MCECbrPsghUKWD6gCpX5qBgghVEB0Hh5",
      "https://drive.google.com/uc?export=view&id=1bOZGWKc0_yq5WBsOwFb9qOiPbtxX4xBN",
      "https://drive.google.com/uc?export=view&id=1l5HBSfETGyWin6JeAOjWomDPupRORjGJ",
      "https://drive.google.com/uc?export=view&id=15d7XYnAfl8q0alXqTEmnG26lv4BcA3uD",
      "https://drive.google.com/uc?export=view&id=1kcnoGlKWwKAXrStt3IYlYEgGaFNJqA28",
    ],
    false,
    "Luxury villa in South Miami. 6 bedrooms - 8 bathrooms - 10 guests"
  ),
  villa(
    "f4a231cb-bf72-43cf-b160-0f8f6eb42d83",
    "casa-brisa",
    "CASA BRISA",
    "Fort Lauderdale",
    "999.00",
    { bedrooms: 5, bathrooms: 4, guests: 14, cleaningFee: 600, securityDeposit: 1000, pool: "Heated pool" },
    [
      "https://drive.google.com/uc?export=view&id=16aLlJGqI9qwiUFBTtSTOlE_LQr6KxP7j",
      "https://drive.google.com/uc?export=view&id=1kjWIRkByLQr_pv69rOXfcUJxcciSYBa0",
      "https://drive.google.com/uc?export=view&id=1pw19z1_fGLhwwJBUcmdReWGxL24MPxX3",
      "https://drive.google.com/uc?export=view&id=1pvGG322Kr7jq_pBPeVMjn5DOGkmWI8xu",
      "https://drive.google.com/uc?export=view&id=1T7QKixQx9SSIZM4CpBE4U0-vmbmZuptv",
    ],
    false,
    "Luxury villa in Fort Lauderdale. 5 bedrooms / 4 bathrooms. Heated pool. Sleeps 14"
  ),
  villa(
    "c156d43e-bf40-484d-801a-91cc71170512",
    "casa-lanus",
    "CASA LANUS",
    "Fort Lauderdale",
    "999.00",
    { bedrooms: 5, bathrooms: 4, guests: 10, cleaningFee: 600, securityDeposit: 1000 },
    [
      "https://drive.google.com/uc?export=view&id=1W65-oB3Vw2Q4QN9jhRuQT3ahHxpLR3ZY",
      "https://drive.google.com/uc?export=view&id=1eE02o_NXkHiLEUc74agdQGyAmk3dhdE8",
      "https://drive.google.com/uc?export=view&id=1fZyLwwen2XET3o3GZUhYpGXq0Lm5zlGg",
      "https://drive.google.com/uc?export=view&id=1v3joUTVgmxj8oxlri-Z_QkUXjbiZC-fX",
      "https://drive.google.com/uc?export=view&id=13Aridq29R4boQc4ha-zN7ETHP5XnVZGL",
    ],
    false,
    "Luxury villa in Fort Lauderdale. 5 BR / 4 BA. Sleeps 10"
  ),
  villa(
    "6665fafc-ccee-4807-b2da-d667fb1d88c6",
    "villa-zehavo",
    "VILLA ZEHAVO",
    "Golden Beach",
    null,
    { bedrooms: 6, bathrooms: 5, cleaningFee: 900 },
    [
      "https://drive.google.com/uc?export=view&id=1Xchb8jDZj96stS18k87R_BFO9CUccZAL",
      "https://drive.google.com/uc?export=view&id=1PizOs2Vv2tEz4voj2O-l9_tgM2BUD2js",
      "https://drive.google.com/uc?export=view&id=1BkZN19L5cbSRFaP1fPkyuxZMC05hc8G8",
      "https://drive.google.com/uc?export=view&id=1x7_EkjtR6nEYharsZVPfwnbGWoLR7k3k",
      "https://drive.google.com/uc?export=view&id=1oUPxo_hBZebTbQ83Y3lQV7GMXKJLLg57",
    ],
    false,
    "Luxury villa in Golden Beach. 6 bed / 5 bath"
  ),
  villa(
    "a1561c98-45d5-493e-9aeb-1ee70a9061cd",
    "villa-celeste",
    "VILLA CELESTE",
    "Fort Lauderdale",
    "1925.00",
    { bedrooms: 5, bathrooms: 6, cleaningFee: 650, securityDeposit: 1000 },
    [
      "https://drive.google.com/uc?export=view&id=1qe_2msZB-_uHcKGGQaEGruyP3gSyQJs0",
      "https://drive.google.com/uc?export=view&id=1ePiY_gDlZYhkroNtAWKRC9Et2BxiOjIR",
      "https://drive.google.com/uc?export=view&id=11lmO0ZPH58tDQky_ufVbXiy64XUcu4V-",
      "https://drive.google.com/uc?export=view&id=1IWniIV9nU1aP5oKK8vsHlAtwT6KouuCD",
      "https://drive.google.com/uc?export=view&id=1RJaJOH7aZj9_N37Hy_MTYEeQpYa-nLHf",
    ],
    false,
    "Luxury villa in Fort Lauderdale. 5 bedrooms - 6 bathrooms"
  ),
  villa(
    "1095075f-fb6f-43fa-8bbe-e62f67cb7ae8",
    "villa-myriam",
    "VILLA MYRIAM",
    "Miami Shores",
    "2095.00",
    { bedrooms: 6, bathrooms: 5.5, guests: 14, cleaningFee: 750, securityDeposit: 2500 },
    [
      "https://drive.google.com/uc?export=view&id=1HQloFAy3nlBGg02Ylep3wvGacz_YBQK9",
      "https://drive.google.com/uc?export=view&id=1Pix9M2Vg8u0Prg37wAH6sw64_47Bt0Qf",
      "https://drive.google.com/uc?export=view&id=1nP6bq_OwRnwatqD2W3R4CkSjFBj2P8UM",
      "https://drive.google.com/uc?export=view&id=1ilKUh4Bjav3HVP14EBedoW5aDdsJlhKm",
      "https://drive.google.com/uc?export=view&id=1YfGxyysQTC3eWNkd7_95YYeGHLorPiXV",
    ],
    true,
    "Luxury villa in Miami Shores. 6 bedrooms - 5.5 bathrooms - 14 guests"
  ),
  villa(
    "97634603-5898-4e09-87d4-7873be557810",
    "villa-justa",
    "VILLA JUSTA",
    "Miami Shores",
    "1595.00",
    { bedrooms: 7, guests: 16, cleaningFee: 750, securityDeposit: 1000 },
    [
      "https://drive.google.com/uc?export=view&id=1g-pa0vybTw1jeDy8lWupLE4uUiMlggiC",
      "https://drive.google.com/uc?export=view&id=17dAYGxvmIdkFAQE9mdPHhY2mNkOgK7DL",
      "https://drive.google.com/uc?export=view&id=1fIVlNBVoZX82KKz24PpXtBURqKXlMa7Y",
      "https://drive.google.com/uc?export=view&id=1Hqc8Ss54OyYRWRVCAC1ue6Or-lbL6qQ3",
      "https://drive.google.com/uc?export=view&id=1XdkkjYHNuj8MCif422LYwHC1YeNtT-0K",
    ],
    true,
    "Luxury villa in Miami Shores. 7 BR. Sleeps 16"
  ),
  villa(
    "6c117d1c-5b3a-4b3e-9428-0252f2681762",
    "luxxfinity-penthouse",
    "LUXXFINITY Penthouse",
    "Downtown Miami",
    "2250.00",
    { bedrooms: 5, bathrooms: 7.5, guests: 10, cleaningFee: 800, securityDeposit: 7500 },
    [
      "https://drive.google.com/uc?export=view&id=1MzsSV2MEYKbdLEwrDMWfyUi61Yog9Af3",
      "https://drive.google.com/uc?export=view&id=1w_VJu4p9Dw6whz9nP51ypuxC_o63zubo",
      "https://drive.google.com/uc?export=view&id=1P52Xgh4C3YJW3Y57hvjkEkx4GKhf1ru0",
      "https://drive.google.com/uc?export=view&id=1rkSQfJEF_PyTgwLJOk7fLcpc209ksyaw",
      "https://drive.google.com/uc?export=view&id=1FNsPygbK__dPTm8468ruj80NFu4dT0b3",
    ],
    true,
    "Luxury villa in Downtown Miami. 5 bedrooms - 7.5 bathrooms - 10 guests"
  ),
  villa(
    "3fb52ad9-a969-47c4-874c-bd68f66dd0dd",
    "villa-palma",
    "VILLA PALMA",
    "Fort Lauderdale",
    "2095.00",
    { bedrooms: 6, bathrooms: 5.5, guests: 16, cleaningFee: 750, securityDeposit: 2500 },
    [
      "https://drive.google.com/uc?export=view&id=1u0QC-VH-uFr4pdgNyhVENeI2805Sw1X2",
      "https://drive.google.com/uc?export=view&id=1krEJpfFxcpw98MXjOGYA2R74YUUZxNYq",
      "https://drive.google.com/uc?export=view&id=1tJ0cPEp_i2uoR8ESyiC_1idzBDc8kzis",
      "https://drive.google.com/uc?export=view&id=1x6_w0DUaJrtFyiLCwodSdOQKsBg_gFWK",
      "https://drive.google.com/uc?export=view&id=1dbfJCOGOrQnNrUuRb0ux2JxkXlin0wCn",
    ],
    false,
    "Luxury villa in Fort Lauderdale. 6 bedrooms - 5.5 bathrooms - sleeps 16"
  ),
]

export function getFallbackVillas() {
  return fallbackVillas
}
