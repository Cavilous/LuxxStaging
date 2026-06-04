import { Suspense, cache } from "react"
import { VillasPageContent } from "@/components/villas-page-content"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { db } from "@/lib/db"
import { eq, and, desc, asc } from "drizzle-orm"
import { inventory } from "@/lib/db/schema"
import type { Metadata } from "next"
import { getPrimaryImage, getPrimaryLqImage } from "@/lib/media-utils"
import { getSortSetting } from "@/lib/sort-settings-actions"
import { getInventoryOrderBy } from "@/lib/inventory-sort-utils"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Luxury Villa Rentals Miami | Beachfront Villas & Waterfront Estates",
  description: "Rent exclusive luxury villas in Miami. Beachfront properties, waterfront estates, and private mansions with premium amenities and 24/7 concierge.",
  keywords: ["luxury villa rental miami", "miami beach house rental", "waterfront villa miami", "mansion rental miami", "luxury vacation homes"],
  openGraph: {
    title: "Luxury Villa Rentals Miami",
    description: "Experience Miami's finest luxury villas. Exclusive beachfront properties with world-class amenities.",
    url: "https://luxxmiami.com/houses",
    type: "website",
  },
  alternates: {
    canonical: "https://luxxmiami.com/houses",
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

const VillasData = cache(async () => {
  try {
    const sortMode = await getSortSetting("villa")
    const orderClauses = getInventoryOrderBy(sortMode)

    const villas = await db
      .select({
        id: inventory.id,
        slug: inventory.slug,
        title: inventory.title,
        subtitle: inventory.subtitle,
        images: inventory.images,
        thumbnails: inventory.thumbnails,
        focalPoint: inventory.focalPoint,
        flipHorizontal: inventory.flipHorizontal,
        flipVertical: inventory.flipVertical,
        pricePerDay: inventory.pricePerDay,
        isFeatured: inventory.isFeatured,
        specifications: inventory.specifications,
      })
      .from(inventory)
      .where(and(eq(inventory.category, "villa"), eq(inventory.isPublished, true)))
      .orderBy(...orderClauses)

    const transformedVillas = villas.map((villa) => {
      const specs = (villa.specifications as any) || {}
      const specsList = []

      if (specs.bedrooms) specsList.push(`${specs.bedrooms} BR`)
      if (specs.bathrooms) specsList.push(`${specs.bathrooms} BA`)
      if (specs.guests) specsList.push(`${specs.guests} guests`)
      if (specs.location) specsList.push(specs.location)

      const badges = []
      if (villa.isFeatured) badges.push("Featured")
      if (specs.amenities) badges.push(...specs.amenities.slice(0, 2))
      
      // Use shared media utility for intelligent primary image selection
      // Prefer thumbnails if available, otherwise use main images
      const thumbnails = Array.isArray(villa.thumbnails) 
        ? (villa.thumbnails as unknown[])
        : []
      const primaryThumbnail = thumbnails.length > 0 ? getPrimaryImage(thumbnails) : null
      const primaryImage = primaryThumbnail || getPrimaryImage(villa.images as unknown[])
      // Fallback gradient image (data URI) instead of placeholder.svg
      const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'

      return {
        id: villa.id,
        slug: villa.slug,
        type: "villa" as const,
        title: villa.title,
        subtitle: specs.location || villa.subtitle || "Miami",
        price: villa.pricePerDay ? `$${Number(villa.pricePerDay).toLocaleString()}` : "Rate upon request",
        priceUnit: villa.pricePerDay ? "night" : "",
        image: primaryImage || fallbackImage,
        lqImage: getPrimaryLqImage(villa.images as unknown[]),
        focalPoint: villa.focalPoint || '50% 40%',
        specs: specsList,
        badges: badges,
        bedrooms: specs.bedrooms ? Number.parseInt(specs.bedrooms) : undefined,
        guests: specs.guests ? Number.parseInt(specs.guests) : undefined,
        flipHorizontal: villa.flipHorizontal || false,
        flipVertical: villa.flipVertical || false,
      }
    })

    return <VillasPageContent initialVillas={transformedVillas} />
  } catch (error) {
    console.error("Error fetching villas:", error)
    return <div className="text-center py-8 text-red-400">Error loading villas</div>
  }
})

export default function HousesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://luxxmiami.com' },
          { name: 'Luxury Villas', url: 'https://luxxmiami.com/houses' },
        ]}
      />
      <section className="relative bg-[#0A0A0A] hero-angled-bottom">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3">
            Luxury <span className="text-[#ECAC36]">Villas & Houses</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed">
            Discover Miami's finest waterfront estates and luxury properties. From oceanfront mansions to private islands, experience the pinnacle of luxury living in South Florida's most exclusive neighborhoods.
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
        <VillasData />
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
            <h2>Luxury Villa Rentals in Miami</h2>
            <p>
              Miami is synonymous with luxury living, and our collection of exclusive villas represents the pinnacle of South Florida's residential offerings. From stunning waterfront estates in Miami Beach to private compounds in the Gables, each property in our portfolio has been carefully selected for its exceptional quality, prime location, and world-class amenities.
            </p>
            <p>
              Whether you're planning an extended vacation, hosting a corporate retreat, or celebrating a milestone event, our luxury villas provide the perfect backdrop for unforgettable experiences. Every property features premium finishes, designer furnishings, and the privacy that discerning guests expect.
            </p>

            <h2>Premier Neighborhoods for Villa Rentals</h2>
            <h3>Miami Beach & Star Island</h3>
            <p>
              The iconic barrier island of Miami Beach offers some of the most sought-after addresses in the world. Star Island and Palm Island feature ultra-private estates with direct water access, while South Beach combines historic Art Deco charm with modern luxury condominiums. Wake up to ocean breezes and fall asleep to the gentle sounds of Biscayne Bay.
            </p>

            <h3>Coral Gables & Coconut Grove</h3>
            <p>
              For those seeking Mediterranean elegance and lush tropical landscapes, Coral Gables delivers with its historic mansions and manicured golf course communities. Neighboring Coconut Grove offers a bohemian vibe with waterfront estates and sailing clubs, perfect for guests who appreciate the finer aspects of Miami's maritime heritage.
            </p>

            <h3>Key Biscayne</h3>
            <p>
              This exclusive island community offers a retreat from the bustling city while remaining just minutes from downtown Miami. Crystal-clear waters, championship golf courses, and some of Miami's most private beachfront properties make Key Biscayne a favorite among our distinguished clientele.
            </p>

            <h2>What to Expect from Our Villa Rentals</h2>
            <ul>
              <li><strong>Private Pools & Spas:</strong> Nearly all our properties feature resort-style pools, hot tubs, and outdoor entertainment areas</li>
              <li><strong>Waterfront Access:</strong> Many villas include private docks, boat lifts, and direct ocean or bay access</li>
              <li><strong>Smart Home Technology:</strong> Climate control, lighting, security, and entertainment systems at your fingertips</li>
              <li><strong>Gourmet Kitchens:</strong> Professional-grade appliances for in-home dining or your private chef</li>
              <li><strong>Concierge Services:</strong> 24/7 support for reservations, transportation, and special requests</li>
            </ul>

            <h2>Plan Your Luxury Miami Getaway</h2>
            <p>
              Booking a luxury villa in Miami with Luxx Miami is effortless. Our team works directly with property owners to ensure availability, arrange pre-arrival provisioning, and coordinate any special requests. From private chef dinners to yacht charters departing from your villa's dock, we handle every detail so you can focus on enjoying Miami.
            </p>
            <p>
              Contact our concierge team today to discuss your requirements and discover the perfect villa for your Miami experience. Whether it's a week-long family vacation or a month-long sabbatical, we'll match you with a property that exceeds your expectations.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
