import { InventoryRow } from "@/components/inventory-row"
import { Button } from "@/components/ui/button"
import { Users, Bed, Bath, Shield, MapPin, Car, Info, Waves, Maximize } from "lucide-react"
import { notFound } from "next/navigation"
import { RequestInfoDrawer } from "@/components/request-info-drawer"
import { ProductSchema } from "@/components/product-schema"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { db } from "@/lib/db"
import { eq, and, ne, or, ilike } from "drizzle-orm"
import { inventory } from "@/lib/db/schema"
import type { Metadata } from "next"
import { buildVillaSpecRows, getExplicitFeatures, getExplicitAmenities, isPresentString, isPresentNumber } from "@/lib/display-guards"
import { PhotoGallery } from "@/components/photo-gallery-wrapper"
import { VillaAvailabilityCalendar } from "@/components/villa-availability-calendar"
import { getFallbackVillas } from "@/lib/fallback-villas"

export const revalidate = 900
export const dynamic = "force-dynamic"
export const dynamicParams = true

const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'

function normalizeRouteToken(value: string | null | undefined) {
  return (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function getFallbackVillaBySlug(slug: string) {
  const normalizedSlug = normalizeRouteToken(slug)

  return getFallbackVillas().find((villa) => {
    return [
      villa.slug,
      villa.id,
      villa.title,
    ].some((value) => normalizeRouteToken(value) === normalizedSlug)
  }) || null
}

function getVillaImages(images: unknown) {
  return Array.isArray(images)
    ? (images as any[]).map((img: any) => typeof img === 'string' ? img : img?.url).filter(Boolean)
    : []
}

function mapSimilarVillas(villas: any[], currentVillaId: string, currentVillaSlug?: string | null, neighborhood?: string | null) {
  const villasWithPhotos = villas
    .filter((villa) => villa.id !== currentVillaId && villa.slug !== currentVillaSlug)
    .filter((villa) => getVillaImages(villa.images).length > 0)

  const normalizedNeighborhood = neighborhood?.toLowerCase() || ''

  const sameNeighborhoodVillas = normalizedNeighborhood ? villasWithPhotos.filter((villa) => {
    const specs = (villa.specifications as any) || {}
    const villaNeighborhood = specs.neighborhood?.toLowerCase() || ''
    return villaNeighborhood === normalizedNeighborhood
  }) : []
  const otherVillas = normalizedNeighborhood ? villasWithPhotos.filter((villa) => {
    const specs = (villa.specifications as any) || {}
    const villaNeighborhood = specs.neighborhood?.toLowerCase() || ''
    return villaNeighborhood !== normalizedNeighborhood
  }) : villasWithPhotos

  const sortedVillas = [...sameNeighborhoodVillas, ...otherVillas].slice(0, 3)

  return sortedVillas.map((villa) => {
    const images = getVillaImages(villa.images)
    return {
      id: villa.slug,
      type: "villa" as const,
      title: villa.title,
      subtitle: villa.subtitle || "Luxury Villa",
      price: villa.pricePerDay ? `$${Number(villa.pricePerDay).toLocaleString()}` : "Rate upon request",
      priceUnit: villa.pricePerDay ? "night" : "",
      image: images[0] || fallbackImage,
      specs: [],
      badges: villa.isFeatured ? ["Featured"] : [],
      focalPoint: villa.focalPoint || '50% 40%',
      flipHorizontal: villa.flipHorizontal || false,
      flipVertical: villa.flipVertical || false,
    }
  })
}

export async function generateStaticParams() {
  return []
}

interface VillaDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getVillaBySlug(slug: string) {
  try {
    const villas = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.category, "villa"),
          eq(inventory.isPublished, true),
          or(
            eq(inventory.slug, slug),
            ilike(inventory.title, `%${slug.replace(/-/g, " ")}%`)
          )
        )
      )
      .limit(1)

    if (villas.length > 0) {
      return villas[0]
    }

    return getFallbackVillaBySlug(slug)
  } catch (error) {
    console.error('Error fetching villa:', error)
    return getFallbackVillaBySlug(slug)
  }
}

async function getSimilarVillas(currentVillaId: string, neighborhood?: string | null, currentVillaSlug?: string | null) {
  try {
    const allVillas = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.category, "villa"),
          eq(inventory.isPublished, true),
          ne(inventory.id, currentVillaId)
        )
      )
      .limit(10)

    return mapSimilarVillas(allVillas.length > 0 ? allVillas : getFallbackVillas(), currentVillaId, currentVillaSlug, neighborhood)
  } catch (error) {
    console.error('Error fetching similar villas:', error)
    return mapSimilarVillas(getFallbackVillas(), currentVillaId, currentVillaSlug, neighborhood)
  }
}

export async function generateMetadata({ params }: VillaDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const villa = await getVillaBySlug(slug)

  if (!villa) {
    return {
      title: "Villa Not Found | Luxx Miami",
    }
  }

  const images = Array.isArray(villa.images) 
    ? (villa.images as any[]).map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean)
    : []

  const specs = (villa.specifications as any) || {}
  const pricePerNight = Number(villa.pricePerDay || 0)
  const bedrooms = specs.bedrooms || 3
  const guests = specs.guests || 6
  const priceText = pricePerNight > 0 ? ` from $${pricePerNight.toLocaleString()}/night.` : '.'
  const defaultDescription = `Rent ${villa.title} in Miami${priceText} ${bedrooms} bedrooms, sleeps ${guests} guests. Private pool, premium amenities. Book your Miami luxury vacation today.`
  const titlePrice = pricePerNight > 0 ? ` | From $${pricePerNight.toLocaleString()}/Night` : ''
  
  return {
    title: `${villa.title}${titlePrice} | Luxx Miami Vacation Rentals`,
    description: villa.description || defaultDescription,
    keywords: [`${villa.title} rental`, "luxury villa rental miami", "beach house rental", "miami vacation home", "waterfront rental miami", "luxury airbnb miami"],
    openGraph: {
      title: `${villa.title} Rental Miami`,
      description: villa.description || `Experience luxury living in the ${villa.title}. Available for nightly rental in Miami.`,
      type: "website",
      url: `https://luxxmiami.com/houses/${slug}`,
      images: images.length > 0 ? [{ url: images[0], width: 1200, height: 630, alt: villa.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${villa.title} Rental Miami`,
      description: villa.description || `Experience luxury living in the ${villa.title}. Available for nightly rental in Miami.`,
      images: images.length > 0 ? [images[0]] : undefined,
    },
    alternates: {
      canonical: `https://luxxmiami.com/houses/${slug}`,
    },
  }
}

export default async function VillaDetailPage({ params }: VillaDetailPageProps) {
  const { slug } = await params
  const villa = await getVillaBySlug(slug)

  if (!villa) {
    notFound()
  }

  const specs = (villa.specifications as any) || {}
  const neighborhood = specs.neighborhood || "Miami"
  
  const similarVillas = await getSimilarVillas(villa.id, neighborhood, villa.slug)
  const specRows = buildVillaSpecRows(specs)
  const explicitFeatures = getExplicitFeatures(specs)
  const explicitAmenities = getExplicitAmenities(specs)
  const allAmenities = [...explicitFeatures, ...explicitAmenities]
  
  const villaData = {
    id: villa.slug,
    type: "villa",
    title: villa.title || "Luxury Villa",
    subtitle: villa.subtitle || "",
    price: `$${Number(villa.pricePerDay || 0).toLocaleString()}`,
    priceUnit: "night",
    neighborhood: isPresentString(specs.neighborhood) ? specs.neighborhood : null,
    year: isPresentNumber(specs.year) ? specs.year : null,
    sqft: isPresentString(specs.sqft) ? specs.sqft : null,
    images: Array.isArray(villa.images) 
      ? getVillaImages(villa.images)
      : [fallbackImage],
    specRows,
    amenities: allAmenities,
    badges: [...(villa.isFeatured ? ["Featured"] : []), ...(specs.badges || [])],
    description: villa.description || null,
    policies: {
      minAge: 25,
      deposit: isPresentString(specs.deposit) ? specs.deposit : null,
      minStay: isPresentString(specs.min_stay) ? specs.min_stay : (isPresentString(specs.minStay) ? specs.minStay : null),
      insurance: "Property damage coverage included",
    },
    pricing: {
      nightly: `$${Number(villa.pricePerDay || 0).toLocaleString()}`,
      weekly: `$${Math.round(Number(villa.pricePerDay || 0) * 6).toLocaleString()}`,
      monthly: `$${Math.round(Number(villa.pricePerDay || 0) * 25).toLocaleString()}`,
    },
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      <ProductSchema
        name={villaData.title}
        description={villaData.description || `${villaData.title} available for rental in Miami.`}
        image={villaData.images.filter(img => typeof img === 'string')}
        price={Number(villa.pricePerDay || 0)}
        category="villa"
        year={villaData.year || undefined}
        url={`https://luxxmiami.com/houses/${villa.slug}`}
        specs={specs}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://luxxmiami.com' },
          { name: 'Houses', url: 'https://luxxmiami.com/houses' },
          ...(villaData.neighborhood ? [{ name: villaData.neighborhood, url: 'https://luxxmiami.com/houses' }] : []),
          { name: villaData.title, url: `https://luxxmiami.com/houses/${villa.slug}` },
        ]}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <a href="/houses" className="hover:text-[#ECAC36]">
            Houses
          </a>
          <span className="mx-2">/</span>
          {villaData.neighborhood ? (
            <span>{villaData.neighborhood}</span>
          ) : (
            <span>Miami</span>
          )}
          <span className="mx-2">/</span>
          <span className="text-white">{villaData.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <PhotoGallery 
              images={villaData.images} 
              title={villaData.title} 
              badges={villaData.badges}
              focalPoint={villa.focalPoint || '50% 50%'}
              flipHorizontal={villa.flipHorizontal || false}
              flipVertical={villa.flipVertical || false}
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-heading font-black text-white mb-2">{villaData.title}</h1>
              <p className="text-xl text-gray-400 mb-4">{villaData.subtitle}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                {villaData.sqft && <><span>{villaData.sqft}</span><span>•</span></>}
                {villaData.neighborhood && <><span>{villaData.neighborhood}</span><span>•</span></>}
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Miami, FL
                </span>
              </div>
            </div>

            {/* Pricing / Availability */}
            {villa.externalSource === 'hostaway' && villa.externalId ? (
              <VillaAvailabilityCalendar
                externalId={villa.externalId}
                villaTitle={villaData.title}
                basePricePerDay={Number(villa.pricePerDay || 0) > 0 ? Number(villa.pricePerDay) : undefined}
              />
            ) : Number(villa.pricePerDay || 0) > 0 ? (
              <div className="bg-charcoal/50 rounded-2xl p-6 border border-[#ECAC36]/20">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-heading font-black text-[#ECAC36]">{villaData.price}</span>
                  <span className="text-gray-400">/ {villaData.priceUnit}</span>
                </div>
                <div className="flex gap-2 mb-4">
                  {Object.entries(villaData.pricing).map(([period, price]) => (
                    <div key={period} className="bg-[#ECAC36]/20 rounded-lg px-3 py-1 text-sm">
                      <span className="text-[#ECAC36] font-semibold">{period}:</span>
                      <span className="text-white ml-1">{price}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  {villaData.policies.deposit && <p>• Deposit: {villaData.policies.deposit}</p>}
                  {villaData.policies.minStay && <p>• {villaData.policies.minStay}</p>}
                </div>
                <RequestInfoDrawer itemTitle={villaData.title} itemCategory="villa">
                  <Button className="w-full cut-corner bg-[#ECAC36] text-black font-semibold hover:bg-[#ECAC36]/90 min-h-[48px]">
                    <Info className="mr-2 h-4 w-4" />
                    Request Information
                  </Button>
                </RequestInfoDrawer>
              </div>
            ) : (
              <div className="bg-charcoal/50 rounded-2xl p-6 border border-[#ECAC36]/20">
                <p className="text-gray-400 mb-4">Contact us for pricing and availability.</p>
                <RequestInfoDrawer itemTitle={villaData.title} itemCategory="villa">
                  <Button className="w-full cut-corner bg-[#ECAC36] text-black font-semibold hover:bg-[#ECAC36]/90 min-h-[48px]">
                    <Info className="mr-2 h-4 w-4" />
                    Request Information
                  </Button>
                </RequestInfoDrawer>
              </div>
            )}

            {/* Specifications - Only show if explicitly set in CMS */}
            {villaData.specRows.length > 0 && (
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-[#ECAC36] rounded-full mr-3"></span>
                  Property Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {villaData.specRows.map((row) => {
                    const IconComponent = row.icon === 'bed' ? Bed : row.icon === 'bath' ? Bath : row.icon === 'users' ? Users : row.icon === 'car' ? Car : row.icon === 'waves' ? Waves : row.icon === 'maximize' ? Maximize : Bed
                    return (
                      <div key={row.label} className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-[#ECAC36]" />
                        <div>
                          <p className="text-white font-medium">{row.value}</p>
                          <p className="text-sm text-gray-400">{row.subLabel}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-4">Property details shown are provided by LUXX Miami and may vary. Contact us to confirm details.</p>
              </div>
            )}

            {/* Amenities - Only show if explicitly set in CMS */}
            {villaData.amenities.length > 0 && (
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-[#ECAC36] rounded-full mr-3"></span>
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {villaData.amenities.map((amenity: string) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#ECAC36] rounded-full"></div>
                      <span className="text-gray-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policies - Only show if we have explicit policy info from CMS */}
            {(villaData.policies.deposit || villaData.policies.minStay) && (
              <div className="bg-charcoal/30 rounded-2xl p-6">
                <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-[#ECAC36]" />
                  Rental Policies
                </h3>
                <div className="space-y-2 text-sm">
                  {villaData.policies.deposit && (
                    <p className="text-gray-300">
                      <strong className="text-white">Security Deposit:</strong> {villaData.policies.deposit}
                    </p>
                  )}
                  {villaData.policies.minStay && (
                    <p className="text-gray-300">
                      <strong className="text-white">Minimum Stay:</strong> {villaData.policies.minStay}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description - Full width below photo/form, renders HTML from CMS */}
        {villaData.description && (
          <div className="mt-16">
            <h2 className="text-3xl font-heading font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-8 bg-[#ECAC36] rounded-full mr-3"></span>
              About This Property
            </h2>
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-heading prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:my-4 prose-ul:space-y-2
                prose-li:text-gray-300
                prose-a:text-[#ECAC36] prose-a:no-underline hover:prose-a:underline prose-a:font-medium"
              dangerouslySetInnerHTML={{ __html: villaData.description }}
            />
          </div>
        )}

        {/* Similar Properties */}
        <div className="mt-16">
          <InventoryRow title="Similar Properties" items={similarVillas} />
        </div>
      </main>
    </div>
  )
}
