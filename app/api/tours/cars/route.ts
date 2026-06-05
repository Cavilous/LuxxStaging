import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, and, isNotNull, desc } from "drizzle-orm"
import { fallbackCars, type FallbackCar } from "@/lib/fallback-cars"

type TourCar = {
  id: string
  make: string
  model: string
  images: string[]
  specifications: Record<string, any>
  tourCategory: string
  tourMaxPassengers: number
  tourPricing: any
}

type TourCarSource = {
  id: string
  title: string | null
  images: unknown
  specifications: unknown
  pricePerDay: string | number | null
  tourCategory?: string | null
  tourMaxPassengers?: number | null
  tourPricing?: unknown
}

const FALLBACK_TOUR_CAR_SLUGS = [
  "lamborghini-hurracan-evo-spyder",
  "ferrari-f8-spider",
  "porsche-gt3rs-weissach",
  "mclaren-570s",
  "rolls-royce-dawn",
  "mercedes-g63-amg",
]

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getTourPricing(source: TourCarSource, fallbackHourlyRate = 300) {
  if (isRecord(source.tourPricing) && isRecord(source.tourPricing.perHour)) {
    return source.tourPricing
  }

  const dailyRate = Number(source.pricePerDay)
  const perHour = Number.isFinite(dailyRate) && dailyRate > 0
    ? Math.max(fallbackHourlyRate, Math.round(dailyRate / 8))
    : fallbackHourlyRate

  return {
    perHour: {
      pax1: perHour,
      pax2: Math.max(175, Math.round(perHour * 0.75)),
      pax3: Math.max(150, Math.round(perHour * 0.6)),
      allowPax4: false,
    },
  }
}

function formatTourCar(source: TourCarSource): TourCar | null {
  const images = Array.isArray(source.images)
    ? source.images.filter((image): image is string => typeof image === "string" && image.trim() !== "")
    : []

  if (images.length === 0) return null

  const specs = isRecord(source.specifications) ? source.specifications : {}
  const titleParts = (source.title || "").trim().split(/\s+/).filter(Boolean)
  const make = String(specs.make || specs.brand || titleParts[0] || "Luxury")
  const modelFromTitle = titleParts[0]?.toLowerCase() === make.toLowerCase()
    ? titleParts.slice(1).join(" ")
    : titleParts.join(" ")
  const model = String(specs.model || modelFromTitle || "Car")
  const maxPassengers = Number(source.tourMaxPassengers || specs.seats || 3)

  return {
    id: source.id,
    make,
    model,
    images,
    specifications: specs,
    tourCategory: source.tourCategory || "exotic",
    tourMaxPassengers: Number.isFinite(maxPassengers) && maxPassengers > 0 ? maxPassengers : 3,
    tourPricing: getTourPricing(source),
  }
}

function formatFallbackTourCar(car: FallbackCar): TourCar | null {
  return formatTourCar({
    id: car.id,
    title: car.title,
    images: car.images,
    specifications: car.specifications,
    pricePerDay: car.pricePerDay,
    tourCategory: "exotic",
    tourMaxPassengers: Number(car.specifications?.seats) || 3,
  })
}

function getFallbackTourCars() {
  const carsBySlug = new Map(fallbackCars.map((car) => [car.slug, car]))
  const preferredCars = FALLBACK_TOUR_CAR_SLUGS
    .map((slug) => carsBySlug.get(slug))
    .filter((car): car is FallbackCar => Boolean(car))

  const formattedPreferredCars = preferredCars
    .map(formatFallbackTourCar)
    .filter((car): car is TourCar => car !== null)

  if (formattedPreferredCars.length > 0) {
    return formattedPreferredCars
  }

  return fallbackCars
    .map(formatFallbackTourCar)
    .filter((car): car is TourCar => car !== null)
    .slice(0, 6)
}

export async function GET() {
  try {
    const tourCars = await db
      .select({
        id: inventory.id,
        title: inventory.title,
        subtitle: inventory.subtitle,
        images: inventory.images,
        specifications: inventory.specifications,
        pricePerDay: inventory.pricePerDay,
        tourCategory: inventory.tourCategory,
        tourMaxPassengers: inventory.tourMaxPassengers,
        tourPricing: inventory.tourPricing,
      })
      .from(inventory)
      .where(
        and(
          eq(inventory.category, "car"),
          eq(inventory.isPublished, true),
          eq(inventory.isFeatured, true),
          isNotNull(inventory.images)
        )
      )
      .orderBy(desc(inventory.createdAt))
      .limit(9)

    const formattedCars = tourCars
      .map(formatTourCar)
      .filter((car): car is TourCar => car !== null)

    if (formattedCars.length === 0) {
      console.warn("Using fallback tour cars because the live query returned no displayable cars")
      return NextResponse.json(getFallbackTourCars())
    }

    return NextResponse.json(formattedCars)
  } catch (error) {
    console.warn("Using fallback tour cars because the live query failed:", error)
    return NextResponse.json(getFallbackTourCars())
  }
}
