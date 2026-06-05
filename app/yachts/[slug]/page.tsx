import { InventoryRow } from "@/components/inventory-row"
import { Users, Anchor, Clock, Waves, Shield, MapPin, Bed, Settings } from "lucide-react"
import { notFound } from "next/navigation"
import { EmbeddedInquiryForm } from "@/components/embedded-inquiry-form"
import { ProductSchema } from "@/components/product-schema"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { db } from "@/lib/db"
import { eq, and, ne, or, ilike } from "drizzle-orm"
import { inventory } from "@/lib/db/schema"
import type { Metadata } from "next"
import { buildYachtSpecRows, getExplicitFeatures, isPresentString, isPresentNumber } from "@/lib/display-guards"
import { PhotoGallery } from "@/components/photo-gallery-wrapper"
import { getFallbackYachts } from "@/lib/fallback-yachts"

export const revalidate = 900
export const dynamicParams = true

const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'

function getYachtImages(yacht: { images?: unknown }) {
  if (!Array.isArray(yacht.images)) return []
  return (yacht.images as any[])
    .map((img: any) => typeof img === 'string' ? img : img?.url)
    .filter(Boolean)
}

function getFallbackYachtBySlug(slug: string) {
  return getFallbackYachts().find((yacht) => yacht.slug === slug) || null
}

function getFallbackYachtStaticParams() {
  return getFallbackYachts().map((yacht) => ({ slug: yacht.slug }))
}

function getYachtPrice4Hr(yacht: { pricePerHour?: unknown; pricePer4Hr?: unknown }) {
  const pricePerHour = yacht.pricePerHour ? Number(yacht.pricePerHour) : 0
  return yacht.pricePer4Hr ? Number(yacht.pricePer4Hr) : pricePerHour * 4
}

function mapSimilarYacht(yacht: any) {
  const price4hr = getYachtPrice4Hr(yacht)
  const images = getYachtImages(yacht)

  return {
    id: yacht.slug || yacht.id,
    type: "yacht" as const,
    title: yacht.title || "Luxury Yacht",
    subtitle: yacht.subtitle || "Luxury Yacht",
    price: `$${price4hr.toLocaleString()}`,
    priceUnit: "4h",
    image: images[0] || fallbackImage,
    specs: [],
    badges: yacht.isFeatured ? ["Popular"] : [],
    focalPoint: yacht.focalPoint || '50% 40%',
    flipHorizontal: yacht.flipHorizontal || false,
    flipVertical: yacht.flipVertical || false,
  }
}

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL && !process.env.POSTGRES_PRISMA_URL) {
    return getFallbackYachtStaticParams()
  }

  try {
    const yachts = await db
      .select({ slug: inventory.slug })
      .from(inventory)
      .where(and(eq(inventory.category, "yacht"), eq(inventory.isPublished, true)))
      .limit(50)

    return yachts
      .filter((yacht) => yacht.slug && typeof yacht.slug === 'string')
      .map((yacht) => ({ slug: String(yacht.slug) }))
  } catch (error) {
    console.error('Error generating static params for yachts:', error)
    return getFallbackYachtStaticParams()
  }
}

interface YachtDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getYachtBySlug(slug: string) {
  try {
    const yachts = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.category, "yacht"),
          eq(inventory.isPublished, true),
          or(
            eq(inventory.slug, slug),
            ilike(inventory.title, `%${slug.replace("-", " ")}%`)
          )
        )
      )
      .limit(1)

    if (yachts.length > 0) {
      return yachts[0]
    }

    return getFallbackYachtBySlug(slug)
  } catch (error) {
    console.error('Error fetching yacht:', error)
    return getFallbackYachtBySlug(slug)
  }
}

async function getSimilarYachts(currentYachtId: string, brand: string, currentSlug?: string | null) {
  const fallbackSimilarYachts = () => getFallbackYachts()
    .filter((yacht) => yacht.id !== currentYachtId && yacht.slug !== currentYachtId && yacht.slug !== currentSlug)
    .sort((a, b) => {
      const aBrand = a.title?.toLowerCase().startsWith(brand.toLowerCase()) ? 0 : 1
      const bBrand = b.title?.toLowerCase().startsWith(brand.toLowerCase()) ? 0 : 1
      return aBrand - bBrand
    })
    .slice(0, 3)
    .map(mapSimilarYacht)

  try {
    const allYachts = await db
      .select({
        id: inventory.id,
        slug: inventory.slug,
        title: inventory.title,
        subtitle: inventory.subtitle,
        images: inventory.images,
        pricePerHour: inventory.pricePerHour,
        pricePer4Hr: inventory.pricePer4Hr,
        isFeatured: inventory.isFeatured,
        specifications: inventory.specifications,
        focalPoint: inventory.focalPoint,
        flipHorizontal: inventory.flipHorizontal,
        flipVertical: inventory.flipVertical,
      })
      .from(inventory)
      .where(
        and(
          eq(inventory.category, "yacht"),
          eq(inventory.isPublished, true),
          ne(inventory.id, currentYachtId)
        )
      )
      .limit(10)

    const yachtsWithPhotos = allYachts.filter((yacht) => {
      const images = Array.isArray(yacht.images) 
        ? (yacht.images as any[]).map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean)
        : []
      return images.length > 0
    })

    const sameBrandYachts = yachtsWithPhotos.filter((yacht) => 
      yacht.title?.toLowerCase().startsWith(brand.toLowerCase())
    )
    const otherYachts = yachtsWithPhotos.filter((yacht) => 
      !yacht.title?.toLowerCase().startsWith(brand.toLowerCase())
    )

    const sortedYachts = [...sameBrandYachts, ...otherYachts].slice(0, 3).map(mapSimilarYacht)

    return sortedYachts.length > 0 ? sortedYachts : fallbackSimilarYachts()
  } catch (error) {
    console.error('Error fetching similar yachts:', error)
    return fallbackSimilarYachts()
  }
}

export async function generateMetadata({ params }: YachtDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const yacht = await getYachtBySlug(slug)

  if (!yacht) {
    return {
      title: "Yacht Not Found | Luxx Miami",
    }
  }

  const images = getYachtImages(yacht)

  const specs = (yacht.specifications as any) || {}
  const length = specs.length || "Luxury"
  const price4hr = getYachtPrice4Hr(yacht)
  const priceText = price4hr > 0 ? ` Starting at $${price4hr.toLocaleString()} for 4 hours.` : ''
  const defaultDescription = `Charter the ${yacht.title} (${length}) in Miami.${priceText} Up to 13 guests, professional crew included. Book your luxury yacht experience today.`
  const titlePrice = price4hr > 0 ? ` | From $${price4hr.toLocaleString()}` : ''
  
  return {
    title: `${yacht.title} Yacht Charter Miami${titlePrice} | Luxx Miami`,
    description: yacht.description || defaultDescription,
    keywords: [`${yacht.title} charter`, "yacht charter miami", "luxury yacht rental", "boat rental miami", "miami yacht party", "private yacht charter"],
    openGraph: {
      title: `${yacht.title} Charter Miami`,
      description: yacht.description || `Experience luxury on the water with ${yacht.title}. Available for charter in Miami.`,
      type: "website",
      url: `https://luxxmiami.com/yachts/${slug}`,
      images: images.length > 0 ? [{ url: images[0], width: 1200, height: 630, alt: yacht.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${yacht.title} Charter Miami`,
      description: yacht.description || `Experience luxury on the water with ${yacht.title}. Available for charter in Miami.`,
      images: images.length > 0 ? [images[0]] : undefined,
    },
    alternates: {
      canonical: `https://luxxmiami.com/yachts/${slug}`,
    },
  }
}

export default async function YachtDetailPage({ params }: YachtDetailPageProps) {
  const { slug } = await params
  const yacht = await getYachtBySlug(slug)

  if (!yacht) {
    notFound()
  }

  const specs = (yacht.specifications as any) || {}
  const brand = yacht.title?.split(' ')[0] || "Luxury"
  const similarYachts = await getSimilarYachts(yacht.id, brand, yacht.slug)
  
  // Calculate hourly price, deriving from 4-hour price if needed
  const pricePerHour = yacht.pricePerHour 
    ? Number(yacht.pricePerHour) 
    : yacht.pricePer4Hr 
      ? Math.round(Number(yacht.pricePer4Hr) / 4)
      : 0
  const price4hr = yacht.pricePer4Hr ? Number(yacht.pricePer4Hr) : pricePerHour * 4
  const price6hr = yacht.pricePer6Hr ? Number(yacht.pricePer6Hr) : pricePerHour * 6
  const price8hr = yacht.pricePer8Hr ? Number(yacht.pricePer8Hr) : pricePerHour * 8
  
  const specRows = buildYachtSpecRows(specs)
  const explicitFeatures = getExplicitFeatures(specs)
  const yachtImages = getYachtImages(yacht)
  
  const yachtData = {
    id: yacht.slug || yacht.id,
    type: "yacht",
    title: yacht.title || "Luxury Yacht",
    subtitle: yacht.subtitle || "",
    price: `$${price4hr.toLocaleString()}`,
    priceUnit: "4 hours",
    brand: brand,
    year: isPresentNumber(specs.year) ? specs.year : null,
    length: isPresentString(specs.length) ? specs.length : null,
    marina: isPresentString(specs.marina) ? specs.marina : null,
    images: yachtImages.length > 0 ? yachtImages : [fallbackImage],
    specRows,
    features: explicitFeatures,
    badges: [...(yacht.isFeatured ? ["Featured"] : []), ...(specs.badges || [])],
    description: yacht.description || null,
    policies: {
      minAge: 21,
      deposit: isPresentString(specs.deposit) ? specs.deposit : null,
      duration: isPresentString(specs.duration) ? specs.duration : null,
      insurance: "Full marine coverage included",
    },
    pricing: {
      "4h": `$${price4hr.toLocaleString()}`,
      "6h": `$${price6hr.toLocaleString()}`,
      "8h": `$${price8hr.toLocaleString()}`,
    },
  }

  return (
    <div className="min-h-screen bg-black">
      <ProductSchema
        name={yachtData.title}
        description={yachtData.description || `${yachtData.title} available for charter in Miami.`}
        image={yachtData.images.filter(img => typeof img === 'string')}
        price={pricePerHour}
        category="yacht"
        brand={yachtData.brand}
        year={yachtData.year || undefined}
        url={`https://luxxmiami.com/yachts/${yacht.slug}`}
        specs={specs}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://luxxmiami.com' },
          { name: 'Yachts', url: 'https://luxxmiami.com/yachts' },
          { name: yachtData.title, url: `https://luxxmiami.com/yachts/${yacht.slug}` },
        ]}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <a href="/yachts" className="hover:text-[#ECAC36]">
            Yachts
          </a>
          <span className="mx-2">/</span>
          <a href={`/yachts/${yachtData.brand.toLowerCase()}`} className="hover:text-[#ECAC36]">
            {yachtData.brand}
          </a>
          <span className="mx-2">/</span>
          <span className="text-white">{yachtData.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <PhotoGallery 
              images={yachtData.images} 
              title={yachtData.title} 
              badges={yachtData.badges}
              focalPoint={yacht.focalPoint || '50% 50%'}
              flipHorizontal={yacht.flipHorizontal || false}
              flipVertical={yacht.flipVertical || false}
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-heading font-black text-white mb-2">{yachtData.title}</h1>
              <p className="text-xl text-gray-400 mb-4">{yachtData.subtitle}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                {yachtData.year && <><span>{yachtData.year}</span><span>•</span></>}
                {yachtData.length && <><span>{yachtData.length}</span><span>•</span></>}
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {yachtData.marina || "Miami, FL"}
                </span>
              </div>
            </div>

            {/* Pricing - Conditionally show price or contact message */}
            {price4hr > 0 ? (
              <div className="bg-charcoal/50 rounded-2xl p-6 border border-[#ECAC36]/20">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-heading font-black text-[#ECAC36]">{yachtData.price}</span>
                  <span className="text-gray-400">/ {yachtData.priceUnit}</span>
                </div>
                <div className="flex gap-2 mb-4">
                  {Object.entries(yachtData.pricing).map(([duration, price]) => (
                    <div key={duration} className="bg-[#ECAC36]/20 rounded-lg px-3 py-1 text-sm">
                      <span className="text-[#ECAC36] font-semibold">{duration}:</span>
                      <span className="text-white ml-1">{price}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  {yachtData.policies.deposit && <p>• Deposit: {yachtData.policies.deposit}</p>}
                  {yachtData.policies.duration && <p>• Duration: {yachtData.policies.duration}</p>}
                </div>
              </div>
            ) : (
              <div className="bg-charcoal/50 rounded-2xl p-6 border border-[#ECAC36]/20">
                <p className="text-gray-400">Contact us for charter pricing and availability.</p>
              </div>
            )}

            {/* Embedded Inquiry Form */}
            <EmbeddedInquiryForm itemTitle={yachtData.title} itemCategory="yacht" />

            {/* Specifications - Only show if explicitly set in CMS */}
            {yachtData.specRows.length > 0 && (
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-[#ECAC36] rounded-full mr-3"></span>
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {yachtData.specRows.map((row) => {
                    const IconComponent = row.icon === 'users' ? Users : row.icon === 'anchor' ? Anchor : row.icon === 'waves' ? Waves : row.icon === 'clock' ? Clock : row.icon === 'bed' ? Bed : row.icon === 'settings' ? Settings : Anchor
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
                <p className="text-xs text-gray-500 mt-4">Specifications shown are provided by LUXX Miami and may vary. Contact us to confirm details.</p>
              </div>
            )}

            {/* Features - Only show if explicitly set in CMS */}
            {yachtData.features.length > 0 && (
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-[#ECAC36] rounded-full mr-3"></span>
                  Included Features
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {yachtData.features.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#ECAC36] rounded-full"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notice - 13 Guest Cap */}
            <div className="bg-[#ECAC36]/10 border border-[#ECAC36]/30 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-[#ECAC36] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Guest Capacity Notice</h4>
                  <p className="text-sm text-gray-300">
                    Federal maritime regulations limit yacht charters to a maximum of <span className="text-[#ECAC36] font-semibold">13 guests</span>. All guests must be accounted for prior to departure. Additional fees may apply for events or special occasions.
                  </p>
                </div>
              </div>
            </div>

            {/* Policies - Only show if we have explicit policy info from CMS */}
            {(yachtData.policies.deposit || yachtData.policies.duration) && (
              <div className="bg-charcoal/30 rounded-2xl p-6">
                <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-[#ECAC36]" />
                  Charter Policies
                </h3>
                <div className="space-y-2 text-sm">
                  {yachtData.policies.deposit && (
                    <p className="text-gray-300">
                      <strong className="text-white">Security Deposit:</strong> {yachtData.policies.deposit}
                    </p>
                  )}
                  {yachtData.policies.duration && (
                    <p className="text-gray-300">
                      <strong className="text-white">Duration:</strong> {yachtData.policies.duration}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description - Full width below photo/form, renders HTML from CMS */}
        {yachtData.description && (
          <div className="mt-16">
            <h2 className="text-3xl font-heading font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-8 bg-[#ECAC36] rounded-full mr-3"></span>
              About This Yacht
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
              dangerouslySetInnerHTML={{ __html: yachtData.description }}
            />
          </div>
        )}

        {/* Similar Yachts */}
        <div className="mt-16">
          <InventoryRow title="Similar Yachts" items={similarYachts} />
        </div>
      </main>
    </div>
  )
}
