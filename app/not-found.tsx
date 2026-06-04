import { cache } from "react"
import { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, and, desc, sql } from "drizzle-orm"
import { InventoryCard } from "@/components/inventory-card"
import { Phone, Car, Ship, Home, MessageCircle } from "lucide-react"
import { getPrimaryImage, extractImageUrls } from "@/lib/media-utils"
import { CAR_BRANDS } from "@/lib/car-brands"
import { BRAND_SEO_SLUGS } from "@/lib/seo-constants"

export const metadata: Metadata = {
  title: "Page Not Found | Luxx Miami",
  description: "The page you're looking for doesn't exist. Browse our collection of exotic cars, luxury yachts, and premium villas in Miami.",
  robots: {
    index: false,
    follow: true,
  },
}

type InventoryItem = {
  id: string
  slug: string | null
  title: string
  subtitle: string | null
  category: string
  images: unknown
  focalPoint: string | null
  flipHorizontal: boolean
  flipVertical: boolean
  pricePerDay: string | null
  pricePerHour: string | null
  pricePer4Hr: string | null
  isFeatured: boolean
  specifications: unknown
}

const getFeaturedCars = cache(async (): Promise<InventoryItem[]> => {
  try {
    const cars = await db
      .select({
        id: inventory.id,
        slug: inventory.slug,
        title: inventory.title,
        subtitle: inventory.subtitle,
        category: inventory.category,
        images: inventory.images,
        focalPoint: inventory.focalPoint,
        flipHorizontal: inventory.flipHorizontal,
        flipVertical: inventory.flipVertical,
        pricePerDay: inventory.pricePerDay,
        pricePerHour: inventory.pricePerHour,
        pricePer4Hr: inventory.pricePer4Hr,
        isFeatured: inventory.isFeatured,
        specifications: inventory.specifications,
      })
      .from(inventory)
      .where(and(
        eq(inventory.category, "car"),
        eq(inventory.isPublished, true)
      ))
      .orderBy(desc(inventory.pricePerDay))
      .limit(20)

    const filtered = cars.filter(car => {
      const images = extractImageUrls(car.images as unknown[])
      return images.length > 0
    })
    
    const sortByPrice = (a: InventoryItem, b: InventoryItem) => {
      const priceA = a.pricePerDay ? Number(a.pricePerDay) : 0
      const priceB = b.pricePerDay ? Number(b.pricePerDay) : 0
      return priceB - priceA
    }
    
    const featured = filtered.filter(car => car.isFeatured).sort(sortByPrice)
    const nonFeatured = filtered.filter(car => !car.isFeatured).sort(sortByPrice)
    const combined = [...featured, ...nonFeatured]
    
    return combined.slice(0, 6)
  } catch (error) {
    console.error("Error fetching featured cars:", error)
    return []
  }
})

const getFeaturedYachts = cache(async (): Promise<InventoryItem[]> => {
  try {
    const yachts = await db
      .select({
        id: inventory.id,
        slug: inventory.slug,
        title: inventory.title,
        subtitle: inventory.subtitle,
        category: inventory.category,
        images: inventory.images,
        focalPoint: inventory.focalPoint,
        flipHorizontal: inventory.flipHorizontal,
        flipVertical: inventory.flipVertical,
        pricePerDay: inventory.pricePerDay,
        pricePerHour: inventory.pricePerHour,
        pricePer4Hr: inventory.pricePer4Hr,
        isFeatured: inventory.isFeatured,
        specifications: inventory.specifications,
      })
      .from(inventory)
      .where(and(
        eq(inventory.category, "yacht"),
        eq(inventory.isPublished, true)
      ))
      .orderBy(desc(sql`COALESCE(${inventory.pricePer4Hr}::numeric, ${inventory.pricePerHour}::numeric * 4, 0)`))
      .limit(30)

    const getEffectivePrice = (yacht: InventoryItem) => {
      if (yacht.pricePer4Hr) return Number(yacht.pricePer4Hr)
      if (yacht.pricePerHour) return Number(yacht.pricePerHour) * 4
      return 0
    }

    const filtered = yachts.filter(yacht => {
      const images = extractImageUrls(yacht.images as unknown[])
      return images.length > 0
    })
    
    const sortByYachtPrice = (a: InventoryItem, b: InventoryItem) => {
      return getEffectivePrice(b) - getEffectivePrice(a)
    }
    
    const featured = filtered.filter(yacht => yacht.isFeatured).sort(sortByYachtPrice)
    const nonFeatured = filtered.filter(yacht => !yacht.isFeatured).sort(sortByYachtPrice)
    const combined = [...featured, ...nonFeatured]
    
    return combined.slice(0, 6)
  } catch (error) {
    console.error("Error fetching featured yachts:", error)
    return []
  }
})

const getFeaturedVillas = cache(async (): Promise<InventoryItem[]> => {
  try {
    const villas = await db
      .select({
        id: inventory.id,
        slug: inventory.slug,
        title: inventory.title,
        subtitle: inventory.subtitle,
        category: inventory.category,
        images: inventory.images,
        focalPoint: inventory.focalPoint,
        flipHorizontal: inventory.flipHorizontal,
        flipVertical: inventory.flipVertical,
        pricePerDay: inventory.pricePerDay,
        pricePerHour: inventory.pricePerHour,
        pricePer4Hr: inventory.pricePer4Hr,
        isFeatured: inventory.isFeatured,
        specifications: inventory.specifications,
      })
      .from(inventory)
      .where(and(
        eq(inventory.category, "villa"),
        eq(inventory.isPublished, true)
      ))
      .orderBy(desc(inventory.pricePerDay))
      .limit(20)

    const filtered = villas.filter(villa => {
      const images = extractImageUrls(villa.images as unknown[])
      return images.length > 0
    })
    
    const sortByPrice = (a: InventoryItem, b: InventoryItem) => {
      const priceA = a.pricePerDay ? Number(a.pricePerDay) : 0
      const priceB = b.pricePerDay ? Number(b.pricePerDay) : 0
      return priceB - priceA
    }
    
    const featured = filtered.filter(villa => villa.isFeatured).sort(sortByPrice)
    const nonFeatured = filtered.filter(villa => !villa.isFeatured).sort(sortByPrice)
    const combined = [...featured, ...nonFeatured]
    
    return combined.slice(0, 6)
  } catch (error) {
    console.error("Error fetching featured villas:", error)
    return []
  }
})

function transformToCardProps(item: InventoryItem, type: "car" | "yacht" | "villa") {
  // Use shared media utility for intelligent primary image selection
  const primaryImage = getPrimaryImage(item.images as unknown[])
  
  const specs = item.specifications as Record<string, any> || {}
  const specsList: string[] = []
  
  if (type === "car") {
    if (specs.year) specsList.push(specs.year)
    if (specs.transmission) specsList.push(specs.transmission)
    if (specs.horsepower) specsList.push(`${specs.horsepower} HP`)
  } else if (type === "yacht") {
    if (specs.length) specsList.push(`${specs.length}'`)
    if (specs.guests) specsList.push(`${specs.guests} guests`)
    if (specs.cabins) specsList.push(`${specs.cabins} cabins`)
  } else if (type === "villa") {
    if (specs.bedrooms) specsList.push(`${specs.bedrooms} BR`)
    if (specs.bathrooms) specsList.push(`${specs.bathrooms} BA`)
    if (specs.guests) specsList.push(`${specs.guests} guests`)
  }

  let price = "Rate upon request"
  let priceUnit = "day"
  
  if (type === "yacht") {
    const price4hr = item.pricePer4Hr ? Number(item.pricePer4Hr) : (item.pricePerHour ? Number(item.pricePerHour) * 4 : 0)
    if (price4hr > 0) {
      price = `$${price4hr.toLocaleString()}`
      priceUnit = "4h"
    }
  } else {
    if (item.pricePerDay && Number(item.pricePerDay) > 0) {
      price = `$${Number(item.pricePerDay).toLocaleString()}`
      priceUnit = "day"
    }
  }

  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'

  return {
    type,
    title: item.title,
    subtitle: item.subtitle || "Miami",
    price,
    priceUnit,
    image: primaryImage || fallbackImage,
    specs: specsList,
    badges: item.isFeatured ? ["Featured"] : [],
    featured: item.isFeatured,
    slug: item.slug || undefined,
    id: item.id,
    focalPoint: item.focalPoint || "50% 40%",
    flipHorizontal: item.flipHorizontal,
    flipVertical: item.flipVertical,
  }
}

export default async function NotFound() {
  const [cars, yachts, villas] = await Promise.all([
    getFeaturedCars(),
    getFeaturedYachts(),
    getFeaturedVillas(),
  ])

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          That link may be outdated. Here are popular options instead.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#ECAC36] text-black font-semibold rounded-lg hover:bg-[#d99b2f] transition-colors"
          >
            <Car className="w-5 h-5" />
            Browse Cars
          </Link>
          <Link
            href="/yachts"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#ECAC36] text-black font-semibold rounded-lg hover:bg-[#d99b2f] transition-colors"
          >
            <Ship className="w-5 h-5" />
            Browse Yachts
          </Link>
          <Link
            href="/houses"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#ECAC36] text-black font-semibold rounded-lg hover:bg-[#d99b2f] transition-colors"
          >
            <Home className="w-5 h-5" />
            Browse Villas
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 border border-[#ECAC36] text-[#ECAC36] font-semibold rounded-lg hover:bg-[#ECAC36] hover:text-black transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contact
          </Link>
        </div>
      </section>

      <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Browse by Brand</h2>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {CAR_BRANDS.filter(b => b.slug !== "other").map((brand) => {
            const hasSeoPage = BRAND_SEO_SLUGS.has(brand.slug)
            return (
              <Link
                key={brand.slug}
                href={hasSeoPage ? `/miami/${brand.slug}-rental` : `/cars`}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-gray-300 rounded-lg hover:border-[#ECAC36] hover:text-[#ECAC36] transition-colors text-sm md:text-base"
              >
                {brand.name}
              </Link>
            )
          })}
        </div>
      </section>

      {cars.length > 0 && (
        <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              <span className="text-[#ECAC36]">Featured</span> Exotic Cars
            </h2>
            <Link
              href="/cars"
              className="text-[#ECAC36] hover:text-[#d99b2f] font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {cars.slice(0, 4).map((car, index) => (
              <InventoryCard
                key={car.id}
                {...transformToCardProps(car, "car")}
                priority={index < 2}
              />
            ))}
          </div>
        </section>
      )}

      {yachts.length > 0 && (
        <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              <span className="text-[#ECAC36]">Luxury</span> Yachts
            </h2>
            <Link
              href="/yachts"
              className="text-[#ECAC36] hover:text-[#d99b2f] font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {yachts.slice(0, 4).map((yacht) => (
              <InventoryCard
                key={yacht.id}
                {...transformToCardProps(yacht, "yacht")}
              />
            ))}
          </div>
        </section>
      )}

      {villas.length > 0 && (
        <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              <span className="text-[#ECAC36]">Premium</span> Villas
            </h2>
            <Link
              href="/houses"
              className="text-[#ECAC36] hover:text-[#d99b2f] font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {villas.slice(0, 4).map((villa) => (
              <InventoryCard
                key={villa.id}
                {...transformToCardProps(villa, "villa")}
              />
            ))}
          </div>
        </section>
      )}

      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Experience Miami in Style with <span className="text-[#ECAC36]">Luxx Miami</span>
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Luxx Miami is your premier destination for luxury rentals in South Florida. 
            Whether you're looking for an exotic car to cruise down Ocean Drive, a yacht for 
            an unforgettable sunset charter, or a waterfront villa for your Miami getaway, 
            we have the perfect option for you. Our curated collection features the world's 
            most prestigious brands including Ferrari, Lamborghini, Rolls-Royce, and more. 
            Experience the Miami lifestyle with our white-glove service and competitive rates. 
            Contact our concierge team today to start planning your luxury experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="tel:+13056055899"
              className="inline-flex items-center gap-2 text-[#ECAC36] hover:text-white transition-colors"
            >
              <Phone className="w-5 h-5" />
              (305) 605-5899
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
