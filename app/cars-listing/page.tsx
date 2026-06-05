import { Suspense, cache } from "react"
import { CarsPageContent } from "@/components/cars-page-content"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { db } from "@/lib/db"
import { eq, and, desc, sql } from "drizzle-orm"
import { inventory } from "@/lib/db/schema"
import type { Metadata } from "next"
import { getPrimaryImage } from "@/lib/media-utils"
import { getFallbackCars } from "@/lib/fallback-cars"
import { normalizeFleetBodyType, resolveFleetBrand } from "@/lib/car-filter-utils"

export const metadata: Metadata = {
  title: "Luxury Exotic Car Rentals Miami | Lamborghini, Ferrari, Rolls Royce",
  description: "Rent exotic cars in Miami. Choose from Lamborghini, Ferrari, McLaren, Rolls Royce, and more. Premium luxury car rental service with 24/7 concierge.",
  keywords: ["exotic car rental miami", "luxury car rental", "lamborghini rental miami", "ferrari rental", "supercar rental"],
  openGraph: {
    title: "Luxury Exotic Car Rentals Miami",
    description: "Rent the world's most exclusive exotic cars in Miami. Premium fleet with 24/7 concierge service.",
    url: "https://luxxmiami.com/cars-listing",
    type: "website",
  },
  alternates: {
    canonical: "https://luxxmiami.com/cars-listing",
  },
}

function SkeletonCard() {
  return (
    <div className="bg-[#0A0A0A] cut-corner-card overflow-hidden">
      <div className="aspect-[3/2] skeleton-card"></div>
      <div className="p-4 space-y-2">
        <div className="h-5 skeleton-card cut-corner-button"></div>
        <div className="h-4 skeleton-card cut-corner-button w-3/4"></div>
        <div className="h-6 skeleton-card cut-corner-button w-1/2"></div>
        <div className="h-4 skeleton-card cut-corner-button"></div>
        <div className="h-10 skeleton-card cut-corner-button"></div>
      </div>
    </div>
  )
}

function getExecuteRows(result: any): any[] {
  if (Array.isArray(result)) return result
  if (Array.isArray(result?.rows)) return result.rows
  return []
}

function normalizeInventoryRow(row: any) {
  const item = row?.item || row || {}

  return {
    id: item.id,
    slug: item.slug || null,
    title: item.title || "Luxury Car",
    subtitle: item.subtitle || "",
    brand: item.brand || null,
    brandSlug: item.brandSlug ?? item.brand_slug ?? null,
    images: item.images || [],
    pricePerDay: item.pricePerDay ?? item.price_per_day ?? null,
    isFeatured: item.isFeatured ?? item.is_featured ?? false,
    specifications: item.specifications || {},
    focalPoint: item.focalPoint ?? item.focal_point ?? null,
    flipHorizontal: item.flipHorizontal ?? item.flip_horizontal ?? false,
    flipVertical: item.flipVertical ?? item.flip_vertical ?? false,
  }
}

const CarsData = cache(async () => {
  try {
    let cars: any[] = []
    try {
      cars = await db
        .select({
          id: inventory.id,
          slug: inventory.slug,
          title: inventory.title,
          subtitle: inventory.subtitle,
          brand: inventory.brand,
          brandSlug: inventory.brandSlug,
          images: inventory.images,
          focalPoint: inventory.focalPoint,
          flipHorizontal: inventory.flipHorizontal,
          flipVertical: inventory.flipVertical,
          pricePerDay: inventory.pricePerDay,
          isFeatured: inventory.isFeatured,
          specifications: inventory.specifications,
        })
        .from(inventory)
        .where(and(eq(inventory.category, "car"), eq(inventory.isPublished, true)))
        .orderBy(desc(inventory.isFeatured), desc(inventory.createdAt))
    } catch (richQueryError) {
      console.error("[Cars listing rich query failed, using compatibility query]:", richQueryError)
      try {
        const result = await db.execute(sql`
          SELECT to_jsonb(i) AS item
          FROM inventory i
          WHERE i.category = 'car'
            AND i.is_published = true
          ORDER BY i.id
        `)
        cars = getExecuteRows(result)
      } catch (compatibilityQueryError) {
        console.error("[Cars listing compatibility query failed]:", compatibilityQueryError)
      }
    }

    if (cars.length === 0) {
      cars = getFallbackCars()
    }

    const transformedCars = cars.map(normalizeInventoryRow).map((car) => {
      const specs = (car.specifications as any) || {}
      const bodyType = normalizeFleetBodyType(specs.bodyType)
      const brand = resolveFleetBrand({
        brand: car.brand,
        make: specs.make || specs.brand,
        title: car.title,
      })

      // Use shared media utility for intelligent primary image selection
      const primaryImage = getPrimaryImage(car.images as unknown[])

      const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'

      return {
        id: car.id,
        slug: car.slug,
        type: "car" as const,
        title: car.title || "Luxury Car",
        subtitle: car.subtitle || "",
        price: `$${car.pricePerDay ? Number(car.pricePerDay).toLocaleString() : "0"}`,
        priceUnit: "day",
        image: primaryImage || fallbackImage,
        focalPoint: car.focalPoint || '50% 40%',
        specs: [
          specs.seats ? `${specs.seats} seats` : "2 seats",
          specs.horsepower ? `${specs.horsepower}hp` : "",
          specs.acceleration || "",
          specs.transmission || "Auto",
        ].filter(Boolean),
        badges: [
          ...(car.isFeatured ? ["Featured"] : []),
          ...(bodyType === "Convertible" ? ["Convertible"] : []),
        ],
        brand: brand || "Luxury",
        bodyType,
        seats: specs.seats?.toString() || "2",
        transmission: specs.transmission || "Auto",
        color: car.subtitle?.split(" / ")[0] || "Black",
        flipHorizontal: car.flipHorizontal || false,
        flipVertical: car.flipVertical || false,
      }
    })

    return <CarsPageContent initialCars={transformedCars} />
  } catch (error) {
    console.error("Error fetching cars:", error)
    return <CarsPageContent initialCars={[]} />
  }
})

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function CarsListingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://luxxmiami.com' },
          { name: 'Exotic Cars', url: 'https://luxxmiami.com/cars-listing' },
        ]}
      />
      <section className="relative bg-[#0A0A0A] hero-angled-bottom">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3">
            Luxury & <span className="text-[#ECAC36]">Exotic Cars</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed">
            Experience Miami in unparalleled style with our curated collection of exotic supercars, luxury sedans, and high-performance vehicles. From Ferrari and Lamborghini to Rolls-Royce and Mercedes, drive the car of your dreams.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        }
      >
        <CarsData />
      </Suspense>
    </div>
  )
}
