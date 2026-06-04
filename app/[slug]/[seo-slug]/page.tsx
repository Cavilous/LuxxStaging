import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { getSeoPageBySlug, getSeoPageUnits, getAlternativeUnits, getInventoryByBrand } from "@/lib/seo-page-actions"
import { SERVICE_CITIES } from "@/lib/seo-constants"
import { InventoryCard } from "@/components/inventory-card"
import Link from "next/link"

export const dynamic = 'force-dynamic'

interface SeoPageProps {
  params: Promise<{
    slug: string
    "seo-slug": string
  }>
}

function isValidCity(slug: string): boolean {
  return SERVICE_CITIES.some(c => c.slug === slug)
}

async function getSeoPage(city: string, seoSlug: string) {
  const compositeSlug = `${city}/${seoSlug}`
  return getSeoPageBySlug(compositeSlug)
}

export async function generateMetadata({ params }: SeoPageProps): Promise<Metadata> {
  const { slug: city, "seo-slug": seoSlug } = await params

  if (!isValidCity(city)) return {}

  const page = await getSeoPage(city, seoSlug)
  if (!page) return { title: "Page Not Found | Luxx Miami" }

  const metadata: Metadata = {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    alternates: {
      canonical: page.canonicalUrl || `https://luxxmiami.com/${city}/${seoSlug}`,
    },
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
      type: "website",
      url: `https://luxxmiami.com/${city}/${seoSlug}`,
    },
  }

  if (!page.isIndexable) {
    metadata.robots = { index: false, follow: true }
  }

  return metadata
}

export default async function SeoPage({ params }: SeoPageProps) {
  const { slug: city, "seo-slug": seoSlug } = await params

  if (!isValidCity(city)) {
    console.log(`[SEO Page] Invalid city: "${city}", seo-slug: "${seoSlug}"`)
    notFound()
  }

  const page = await getSeoPage(city, seoSlug)

  if (!page) {
    console.log(`[SEO Page] Not found in DB: "${city}/${seoSlug}"`)
    notFound()
  }

  if (page.redirectTo) {
    redirect(page.redirectTo)
  }

  if (!page.isPublished) {
    notFound()
  }

  const units = await getSeoPageUnits(page.id)

  let brandInventory: any[] = []
  if (page.pageType === 'brand-city') {
    if (page.brand) {
      brandInventory = await getInventoryByBrand(page.brand)
    } else {
      console.warn(`[SEO Page] brand-city page "${page.slug}" has no brand field set`)
    }
  }

  const hasUnits = units.length > 0
  const hasBrandInventory = brandInventory.length > 0
  let alternativeUnits: any[] = []
  if (!hasUnits && !hasBrandInventory) {
    alternativeUnits = await getAlternativeUnits(page.category, page.city, 6)
  }

  const displayUnits = hasUnits ? units : alternativeUnits

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.h1 || page.title,
    description: page.metaDescription,
    url: `https://luxxmiami.com/${city}/${seoSlug}`,
    numberOfItems: hasBrandInventory ? brandInventory.length : (hasUnits ? units.length : displayUnits.length),
    itemListElement: (hasBrandInventory ? brandInventory : (hasUnits ? units : displayUnits)).slice(0, 20).map((unit: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: unit.title,
        url: `https://luxxmiami.com/${unit.category === 'car' ? 'cars' : unit.category === 'yacht' ? 'yachts' : 'villas'}/${unit.slug}`,
        ...(unit.pricePerDay && {
          offers: {
            "@type": "Offer",
            price: unit.pricePerDay,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        }),
      },
    })),
  }

  return (
    <div className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#ECAC36] transition-colors">Home</Link>
            <span>/</span>
            <Link
              href={`/${city}/${page.category === 'car' ? 'exotic-car-rental' : page.category === 'yacht' ? 'yacht-charter' : 'luxury-villa-rental'}`}
              className="hover:text-[#ECAC36] transition-colors capitalize"
            >
              {SERVICE_CITIES.find(c => c.slug === city)?.name}
            </Link>
            {page.pageType !== 'city-hub' && (
              <>
                <span>/</span>
                <span className="text-gray-300">{page.title}</span>
              </>
            )}
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6">
            {page.h1 || page.title}
          </h1>

          {page.metaDescription && (
            <p className="text-lg text-gray-400 max-w-3xl mb-8">
              {page.metaDescription}
            </p>
          )}
        </div>
      </section>

      {hasBrandInventory && (
        <section className="pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">
              Available <span className="text-[#ECAC36]">{page.title?.replace(' Rental Miami', '').replace(' Miami', '')}</span> Inventory
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {brandInventory.map((unit: any, index: number) => {
                const images = Array.isArray(unit.images)
                  ? (unit.images as any[])
                      .map((img: any) => (typeof img === "string" ? img : img?.hqUrl || img?.url || img))
                      .filter(Boolean)
                  : []
                const lqImages = Array.isArray(unit.images)
                  ? (unit.images as any[])
                      .map((img: any) => (typeof img === "object" && img?.lqUrl ? img.lqUrl : null))
                      .filter(Boolean)
                  : []
                return (
                  <InventoryCard
                    key={unit.id}
                    type="car"
                    title={unit.title}
                    subtitle={unit.subtitle || ""}
                    price={`$${Number(unit.pricePerDay || 0).toLocaleString()}`}
                    priceUnit="day"
                    image={images[0] || ""}
                    lqImage={lqImages[0] || null}
                    specs={[]}
                    slug={unit.slug || undefined}
                    id={unit.id}
                    focalPoint={unit.focalPoint || "50% 40%"}
                    flipHorizontal={unit.flipHorizontal}
                    flipVertical={unit.flipVertical}
                    priority={index < 4}
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

      {page.content && (
        <section className="pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:text-white prose-a:text-[#ECAC36] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </section>
      )}

      {!hasBrandInventory && (
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            {!hasUnits && (
              <div className="mb-8 p-6 bg-[#111111] border border-[#333333] rounded-lg">
                <p className="text-gray-300">
                  We're currently building our {page.title?.toLowerCase()} fleet.
                  Check out these available options in {SERVICE_CITIES.find(c => c.slug === city)?.name}:
                </p>
              </div>
            )}

            {displayUnits.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {displayUnits.map((unit: any, index: number) => {
                  const images = Array.isArray(unit.images)
                    ? (unit.images as any[])
                        .map((img: any) => (typeof img === "string" ? img : img?.hqUrl || img?.url || img))
                        .filter(Boolean)
                    : []
                  const lqImages = Array.isArray(unit.images)
                    ? (unit.images as any[])
                        .map((img: any) => (typeof img === "object" && img?.lqUrl ? img.lqUrl : null))
                        .filter(Boolean)
                    : []
                  const categoryType = unit.category === 'car' ? 'car'
                    : unit.category === 'yacht' ? 'yacht'
                    : unit.category === 'villa' ? 'villa'
                    : 'car'
                  return (
                    <InventoryCard
                      key={unit.id}
                      type={categoryType}
                      title={unit.title}
                      subtitle={unit.subtitle || ""}
                      price={`$${Number(unit.pricePerDay || 0).toLocaleString()}`}
                      priceUnit="day"
                      image={images[0] || ""}
                      lqImage={lqImages[0] || null}
                      specs={[]}
                      slug={unit.slug || undefined}
                      id={unit.id}
                      focalPoint={unit.focalPoint || "50% 40%"}
                      flipHorizontal={unit.flipHorizontal}
                      flipVertical={unit.flipVertical}
                      priority={index < 4}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-6">
                  No inventory currently available for this category.
                </p>
                <Link
                  href={`/${page.category === 'car' ? 'cars' : page.category === 'yacht' ? 'yachts' : 'villas'}`}
                  className="inline-flex items-center gap-2 bg-[#ECAC36] hover:bg-[#b8972e] text-black font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  Browse All {page.category === 'car' ? 'Cars' : page.category === 'yacht' ? 'Yachts' : 'Villas'}
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
            Ready to Book?
          </h2>
          <p className="text-gray-400 mb-6">
            Contact us for availability, custom packages, and delivery options.
          </p>
          <a
            href="tel:+13056055899"
            className="inline-flex items-center gap-2 bg-[#ECAC36] hover:bg-[#b8972e] text-black font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Call (305) 605-5899
          </a>
        </div>
      </section>
    </div>
  )
}
