import { HeroSection } from "@/components/hero-section"
import { InventoryRow } from "@/components/inventory-row"
import { LatestBlogs } from "@/components/latest-blogs"
import { LocalBusinessSchema } from "@/components/local-business-schema"
import { HomepageSeoSection } from "@/components/homepage-seo-section"
import { PresentationCallouts } from "@/components/presentation-callouts"
import { HomepageSectionNav } from "@/components/homepage-section-nav"
import { db, withRetry } from "@/lib/db"
import { inventory, homePageSections } from "@/lib/db/schema"
import { eq, asc, and, sql } from "drizzle-orm"
import { cache } from "react"
import { getPrimaryImage, getPrimaryLqImage } from "@/lib/media-utils"
import { getFallbackFeaturedCars } from "@/lib/fallback-cars"

export const revalidate = 300

function getFallbackHomeCars() {
  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'

  return getFallbackFeaturedCars(8).map((car) => {
    const specs = car.specifications || {}
    const specsList = [
      specs.seats ? `${specs.seats} seats` : "2 seats",
      specs.horsepower ? `${specs.horsepower}hp` : "",
      specs.acceleration || "",
      specs.transmission || "Auto",
    ].filter(Boolean)

    return {
      id: car.slug || car.id,
      type: "car" as const,
      title: car.title,
      subtitle: car.subtitle || "",
      price: car.pricePerDay ? `$${Number(car.pricePerDay).toLocaleString()}` : "",
      priceUnit: "day",
      image: getPrimaryImage(car.images as unknown[]) || fallbackImage,
      lqImage: getPrimaryLqImage(car.images as unknown[]),
      focalPoint: car.focalPoint,
      flipHorizontal: car.flipHorizontal,
      flipVertical: car.flipVertical,
      specs: specsList,
      badges: car.isFeatured ? ["Featured"] : [],
    }
  })
}

const getHomePageSection = cache(async (section: string) => {
  try {
    // First try to get manually curated items from home_page_sections
    const curatedItems = await withRetry(() => db
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
        displayOrder: homePageSections.displayOrder,
        createdAt: inventory.createdAt,
      })
      .from(homePageSections)
      .innerJoin(inventory, eq(homePageSections.inventoryId, inventory.id))
      .where(and(
        eq(homePageSections.section, section),
        eq(inventory.isPublished, true)
      ))
      .orderBy(asc(homePageSections.displayOrder))
    , 3, `home-section-${section}`)

    // If no curated items, fall back to featured items for the category
    let items = curatedItems
    if (items.length === 0) {
      const categoryMap: Record<string, string> = {
        'featured_exotics': 'car',
        'luxury_yachts': 'yacht',
        'premium_villas': 'villa'
      }
      const category = categoryMap[section]

      if (category) {
        const featuredItems = await withRetry(() => db
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
            displayOrder: sql<number>`0`.as('displayOrder'),
            createdAt: inventory.createdAt,
          })
          .from(inventory)
          .where(and(
            eq(inventory.category, category),
            eq(inventory.isFeatured, true),
            eq(inventory.isPublished, true)
          ))
          .orderBy(asc(inventory.createdAt))
          .limit(8)
        , 3, `home-fallback-${section}`)

        items = featuredItems as typeof curatedItems
      }
    }

    if (items.length === 0 && section === "featured_exotics") {
      return getFallbackHomeCars()
    }

    return items.map((item) => {
      const specs = (item.specifications as any) || {}
      const specsList = []

      if (item.category === "car") {
        if (specs.seats) specsList.push(`${specs.seats} seats`)
        if (specs.horsepower) specsList.push(`${specs.horsepower}hp`)
        if (specs.acceleration) specsList.push(specs.acceleration)
        if (specs.transmission) specsList.push(specs.transmission)
      } else if (item.category === "yacht") {
        if (specs.guests) specsList.push(`${specs.guests} guests`)
        if (specs.crew) specsList.push(`${specs.crew} crew`)
        if (specs.amenities?.[0]) specsList.push(specs.amenities[0])
        if (specs.amenities?.[1]) specsList.push(specs.amenities[1])
      } else if (item.category === "villa") {
        if (specs.bedrooms) specsList.push(`${specs.bedrooms} BR`)
        if (specs.amenities?.[0]) specsList.push(specs.amenities[0])
        if (specs.amenities?.[1]) specsList.push(specs.amenities[1])
        if (specs.location) specsList.push(specs.location)
      }

      const badges = []
      if (item.isFeatured) badges.push("Featured")
      if (specs.badges) badges.push(...specs.badges.slice(0, 1))

      let price = ""
      let priceUnit = ""

      if (item.category === "car") {
        price = item.pricePerDay ? `$${Number(item.pricePerDay).toLocaleString()}` : ""
        priceUnit = "day"
      } else if (item.category === "yacht") {
        const price4hr = item.pricePer4Hr ? Number(item.pricePer4Hr) : item.pricePerHour ? Number(item.pricePerHour) * 4 : 0
        price = `$${price4hr.toLocaleString()}`
        priceUnit = "4h"
      } else if (item.category === "villa") {
        price = item.pricePerDay ? `$${Number(item.pricePerDay).toLocaleString()}` : ""
        priceUnit = "night"
      }

      // Use shared media utility for intelligent primary image selection
      const primaryImage = getPrimaryImage(item.images as unknown[])

      // Fallback gradient image (data URI) instead of placeholder.svg
      const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'

      const lqImage = getPrimaryLqImage(item.images as unknown[])

      return {
        id: item.slug || item.id,
        type: item.category as "car" | "yacht" | "villa",
        title: item.title,
        subtitle: item.subtitle || "",
        price,
        priceUnit,
        image: primaryImage || fallbackImage,
        lqImage,
        focalPoint: item.focalPoint || '50% 40%',
        flipHorizontal: item.flipHorizontal || false,
        flipVertical: item.flipVertical || false,
        specs: specsList,
        badges,
      }
    })
  } catch (error) {
    console.error(`Error fetching home page section "${section}":`, error)
    if (section === "featured_exotics") {
      return getFallbackHomeCars()
    }
    return []
  }
})

export default async function HomePage() {
  const [featuredExotics, featuredYachts, featuredVillas] = await Promise.all([
    getHomePageSection("featured_exotics"),
    getHomePageSection("luxury_yachts"),
    getHomePageSection("premium_villas"),
  ])
  return (
    <div className="min-h-screen bg-black">
      <LocalBusinessSchema />
      <HomepageSectionNav />
      <HeroSection />
      <PresentationCallouts />

      <main>
        <InventoryRow 
          id="featured-exotics"
          title="Featured Exotics" 
          description="Hand-picked exotic and luxury vehicles available for immediate rental. From supercars to luxury SUVs, experience Miami in style."
          items={featuredExotics}
          viewAllHref="/cars"
          showSectionDivider={false}
        />

        <InventoryRow 
          id="luxury-yachts"
          title="Luxury Yachts" 
          description="Explore Miami's pristine waters aboard our exclusive fleet of luxury yachts. Full crew, premium amenities, and unforgettable experiences included."
          items={featuredYachts}
          viewAllHref="/yachts"
          showSectionDivider={false}
        />
        <InventoryRow 
          id="premium-villas"
          title="Premium Villas" 
          description="Discover Miami's finest waterfront estates and luxury properties. Perfect for extended stays, events, or ultimate relaxation."
          items={featuredVillas}
          viewAllHref="/houses"
          showSectionDivider={false}
        />

        <LatestBlogs id="latest-guides" />

        {/* Content Promos - Enhanced CTAs */}
        <section id="miami-guides" className="py-20 bg-gradient-to-b from-black via-black/95 to-black">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-4">
                Discover Miami in Style
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Elevate your Miami experience with our curated guides and exclusive partnerships, including our sister service{" "}
                <a href="https://luxmiami.com" target="_blank" rel="noopener" className="text-[#ECAC36] hover:underline">Lux Miami</a>{" "}
                for additional luxury concierge rentals across Greater Miami.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <div className="luxx-glimmer-panel group cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-8 hover-lift border border-[#ECAC36]/20 hover:border-[#ECAC36]/40 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ECAC36]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <h3 className="text-2xl font-heading font-bold text-white mb-3 relative z-10">Miami Club Guide</h3>
                <p className="text-gray-300 mb-6 leading-relaxed relative z-10">
                  Exclusive access to Miami's hottest nightlife venues and VIP experiences.
                </p>
                <a 
                  href="/miami-club-guide" 
                  className="inline-flex items-center gap-2 text-[#ECAC36] hover:text-[#e6c766] font-semibold transition-all duration-300 group-hover:gap-3 relative z-10"
                >
                  Explore Clubs 
                  <span className="text-lg" aria-hidden="true">&rarr;</span>
                </a>
              </div>

              <div className="luxx-glimmer-panel group cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-8 hover-lift border border-[#ECAC36]/20 hover:border-[#ECAC36]/40 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ECAC36]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <h3 className="text-2xl font-heading font-bold text-white mb-3 relative z-10">Restaurant Guide</h3>
                <p className="text-gray-300 mb-6 leading-relaxed relative z-10">
                  Curated dining experiences at Miami's most prestigious restaurants.
                </p>
                <a 
                  href="/miami-restaurant-guide" 
                  className="inline-flex items-center gap-2 text-[#ECAC36] hover:text-[#e6c766] font-semibold transition-all duration-300 group-hover:gap-3 relative z-10"
                >
                  View Restaurants 
                  <span className="text-lg" aria-hidden="true">&rarr;</span>
                </a>
              </div>

              <div className="luxx-glimmer-panel group cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-8 hover-lift border border-[#ECAC36]/20 hover:border-[#ECAC36]/40 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ECAC36]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <h3 className="text-2xl font-heading font-bold text-white mb-3 relative z-10">Work With Us</h3>
                <p className="text-gray-300 mb-6 leading-relaxed relative z-10">
                  Partner with Miami's premier luxury rental service for exclusive opportunities.
                </p>
                <a 
                  href="/sell-consign" 
                  className="inline-flex items-center gap-2 text-[#ECAC36] hover:text-[#e6c766] font-semibold transition-all duration-300 group-hover:gap-3 relative z-10"
                >
                  Learn More 
                  <span className="text-lg" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <HomepageSeoSection id="concierge" />
      </main>
    </div>
  )
}
