import { Suspense, cache } from "react"
import { YachtsPageContent } from "@/components/yachts-page-content"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { db } from "@/lib/db"
import { eq, and, sql } from "drizzle-orm"
import { inventory } from "@/lib/db/schema"
import type { Metadata } from "next"
import { getPrimaryImage, getPrimaryLqImage } from "@/lib/media-utils"
import { getSortSetting } from "@/lib/sort-settings-actions"
import { getYachtOrderBy } from "@/lib/inventory-sort-utils"
import { getFallbackYachts } from "@/lib/fallback-yachts"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Luxury Yacht Charters Miami | Private Yacht Rentals & Boat Charters",
  description: "Charter luxury yachts in Miami. 4-hour, 6-hour, and 8-hour packages available. Experience Miami waters in style with our premium yacht fleet.",
  keywords: ["yacht charter miami", "luxury yacht rental", "boat charter miami", "private yacht", "yacht rental miami beach"],
  openGraph: {
    title: "Luxury Yacht Charters Miami",
    description: "Charter premium yachts in Miami with flexible hourly packages. Cruise the coast in ultimate luxury.",
    url: "https://luxxmiami.com/yachts",
    type: "website",
  },
  alternates: {
    canonical: "https://luxxmiami.com/yachts",
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
  const make = item.make || ""
  const model = item.model || ""
  const title = item.title || [make, model].filter(Boolean).join(" ") || "Luxury Yacht"

  return {
    id: item.id,
    slug: item.slug || null,
    title,
    subtitle: item.subtitle || item.location || "Miami",
    images: item.images || [],
    focalPoint: item.focalPoint ?? item.focal_point ?? null,
    flipHorizontal: item.flipHorizontal ?? item.flip_horizontal ?? false,
    flipVertical: item.flipVertical ?? item.flip_vertical ?? false,
    pricePerHour: item.pricePerHour ?? item.price_per_hour ?? null,
    pricePer4Hr: item.pricePer4Hr ?? item.price_per_4hr ?? null,
    pricePer6Hr: item.pricePer6Hr ?? item.price_per_6hr ?? null,
    pricePer8Hr: item.pricePer8Hr ?? item.price_per_8hr ?? null,
    isFeatured: item.isFeatured ?? item.is_featured ?? false,
    specifications: item.specifications || {},
  }
}

const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'

function transformYachts(rows: any[]) {
  return rows.map(normalizeInventoryRow).map((yacht) => {
    const specs = (yacht.specifications as any) || {}
    const length = specs.length ? Number.parseInt(specs.length) : undefined
    const guests = specs.guests ? Number.parseInt(specs.guests) : undefined
    const price4hr = yacht.pricePer4Hr ? Number(yacht.pricePer4Hr) : (yacht.pricePerHour ? Number(yacht.pricePerHour) * 4 : 0)
    const primaryImage = getPrimaryImage(yacht.images as unknown[])

    return {
      id: yacht.id,
      slug: yacht.slug,
      type: "yacht" as const,
      title: yacht.title,
      subtitle: yacht.subtitle || "Miami",
      price: `$${price4hr.toLocaleString()}`,
      priceUnit: "4h",
      pricePerHour: yacht.pricePerHour ? Number(yacht.pricePerHour) : undefined,
      pricePer4Hr: yacht.pricePer4Hr ? Number(yacht.pricePer4Hr) : undefined,
      pricePer6Hr: yacht.pricePer6Hr ? Number(yacht.pricePer6Hr) : undefined,
      pricePer8Hr: yacht.pricePer8Hr ? Number(yacht.pricePer8Hr) : undefined,
      image: primaryImage || fallbackImage,
      lqImage: getPrimaryLqImage(yacht.images as unknown[]),
      focalPoint: yacht.focalPoint || '50% 40%',
      specs: [
        specs.length ? `${specs.length} length` : "",
        "Up to 13 guests",
        specs.crew ? `${specs.crew} crew` : "2 crew",
        specs.amenities?.[0] || "Premium amenities",
      ].filter(Boolean),
      badges: [
        yacht.isFeatured ? "Featured" : "",
        length && length >= 100 ? "Ultra Luxury" : "",
        length && length >= 80 ? "Luxury" : "Popular",
      ].filter(Boolean),
      length,
      guests,
      flipHorizontal: yacht.flipHorizontal || false,
      flipVertical: yacht.flipVertical || false,
    }
  })
}

const YachtsData = cache(async () => {
  try {
    const sortMode = await getSortSetting("yacht")
    const orderClauses = getYachtOrderBy(sortMode)

    let yachts: any[] = []
    try {
      yachts = await db
        .select({
          id: inventory.id,
          slug: inventory.slug,
          title: inventory.title,
          subtitle: inventory.subtitle,
          images: inventory.images,
          focalPoint: inventory.focalPoint,
          flipHorizontal: inventory.flipHorizontal,
          flipVertical: inventory.flipVertical,
          pricePerHour: inventory.pricePerHour,
          pricePer4Hr: inventory.pricePer4Hr,
          pricePer6Hr: inventory.pricePer6Hr,
          pricePer8Hr: inventory.pricePer8Hr,
          isFeatured: inventory.isFeatured,
          specifications: inventory.specifications,
        })
        .from(inventory)
        .where(and(eq(inventory.category, "yacht"), eq(inventory.isPublished, true)))
        .orderBy(...orderClauses)
    } catch (richQueryError) {
      console.error("[Yachts page rich query failed, using compatibility query]:", richQueryError)
      try {
        const result = await db.execute(sql`
          SELECT to_jsonb(i) AS item
          FROM inventory i
          WHERE i.category = 'yacht'
            AND i.is_published = true
          ORDER BY i.id
        `)
        yachts = getExecuteRows(result)
      } catch (compatibilityQueryError) {
        console.error("[Yachts page compatibility query failed]:", compatibilityQueryError)
      }
    }

    if (yachts.length === 0) {
      yachts = getFallbackYachts()
    }

    return <YachtsPageContent initialYachts={transformYachts(yachts)} />
  } catch (error) {
    console.error("Error fetching yachts:", error)
    return <YachtsPageContent initialYachts={transformYachts(getFallbackYachts())} />
  }
})

export default function YachtsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://luxxmiami.com' },
          { name: 'Luxury Yachts', url: 'https://luxxmiami.com/yachts' },
        ]}
      />
      <section className="relative bg-[#0A0A0A] hero-angled-bottom">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3">
            Luxury <span className="text-[#ECAC36]">Yachts & Boats</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed">
            Explore Miami's pristine waters aboard our exclusive fleet of luxury yachts. From intimate cruises to grand celebrations, experience world-class service, premium amenities, and unforgettable moments on the ocean.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        }
      >
        <YachtsData />
      </Suspense>

      <section className="py-16 md:py-24 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-heading prose-headings:font-bold
              prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-[#ECAC36] prose-h2:border-l-4 prose-h2:border-[#ECAC36] prose-h2:pl-4
              prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-white
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-[#ECAC36] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:text-gray-300 prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-li:text-gray-300 prose-li:mb-2 prose-li:marker:text-[#ECAC36]"
          >
            <h2>Luxury Yacht Charters in Miami</h2>
            <p>
              There's no better way to experience Miami than from the deck of a luxury yacht. Biscayne Bay's turquoise waters, the iconic Miami skyline, and the stunning homes of Star Island create a backdrop that must be seen to be believed. Our carefully curated fleet offers the finest yacht charter experiences in South Florida.
            </p>
            <p>
              Whether you're celebrating a special occasion, entertaining clients, or simply seeking an unforgettable day on the water, our yacht charters deliver exceptional service, stunning vessels, and memories that last a lifetime.
            </p>

            <h2>Our Charter Packages</h2>
            <h3>4-Hour Coastal Experience</h3>
            <p>
              Perfect for a half-day adventure, our 4-hour charters allow you to explore Miami's highlights. Cruise past the mansions of Star Island, anchor at a sandbar for swimming, and enjoy the stunning views of downtown Miami. This package is ideal for sunset cruises, birthday celebrations, and casual entertaining.
            </p>

            <h3>6-Hour Miami Explorer</h3>
            <p>
              Extend your adventure with our 6-hour package. This popular option gives you time to explore multiple destinations, including Nixon Sandbar, Key Biscayne, and the waters around Fisher Island. Perfect for corporate events, bachelor/bachelorette parties, and groups wanting a full afternoon experience.
            </p>

            <h3>8-Hour Full-Day Charter</h3>
            <p>
              The ultimate Miami yacht experience. Our full-day charters allow for island hopping, extended water sports, gourmet dining aboard, and complete relaxation. Ideal for weddings, milestone celebrations, and those who want to make the most of Miami's waters.
            </p>

            <h2>What's Included</h2>
            <ul>
              <li><strong>Professional Captain & Crew:</strong> USCG-certified captains and experienced crew ensure your safety and comfort</li>
              <li><strong>Fuel & Dockage:</strong> All operating costs are included in your charter rate</li>
              <li><strong>Water Toys:</strong> Jet skis, paddleboards, snorkeling gear, and inflatables (varies by yacht)</li>
              <li><strong>Sound System:</strong> Premium audio systems to set the perfect atmosphere</li>
              <li><strong>Galley Access:</strong> Refrigerators, ice, and basic beverage service</li>
            </ul>

            <h2>Popular Destinations</h2>
            <h3>Star Island & The Venetian Islands</h3>
            <p>
              Cruise past Miami's most exclusive addresses. Star Island is home to celebrities, business moguls, and stunning architectural masterpieces. The neighboring Venetian Islands offer equally impressive views of waterfront mansions and manicured tropical landscapes.
            </p>

            <h3>Nixon Sandbar & Haulover Sandbar</h3>
            <p>
              Miami's famous sandbars are perfect for anchoring, swimming, and socializing with other yachters. Crystal-clear shallow waters, floating tiki bars, and a party atmosphere make these spots weekend favorites. On weekdays, enjoy a more private experience.
            </p>

            <h3>Key Biscayne & Stiltsville</h3>
            <p>
              The historic stilt houses of Biscayne Bay offer unique photo opportunities and a glimpse into Miami's maritime past. Key Biscayne's pristine beaches and the Crandon Park marina are perfect for an extended stop.
            </p>

            <h2>Federal Guest Capacity Notice</h2>
            <p>
              In accordance with U.S. Coast Guard regulations, all charter vessels are limited to a maximum of 13 passengers. This federal safety requirement applies to all yacht charters regardless of vessel size. Our team will work with you to ensure your group size meets these requirements.
            </p>

            <h2>Book Your Charter</h2>
            <p>
              Planning a yacht charter in Miami is simple with Luxx Miami. Contact our team to discuss your preferences, group size, and desired date. We'll recommend the perfect vessel from our fleet and handle every detail, from provisioning to itinerary planning. Your only job is to enjoy the ride. For more{" "}
              <a href="https://luxmiami.com/yachts-rental-miami" target="_blank" rel="noopener" className="text-[#ECAC36] hover:underline">luxury yacht charters in Miami</a>, our partner Lux Miami offers additional vessels across South Florida.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
