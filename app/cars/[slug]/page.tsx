import { InventoryRow } from "@/components/inventory-row"
import { Calendar, Users, Gauge, Fuel, Shield, MapPin, Settings, Car } from 'lucide-react'
import { notFound } from "next/navigation"
import { EmbeddedInquiryForm } from "@/components/embedded-inquiry-form"
import { ProductSchema } from "@/components/product-schema"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { db } from "@/lib/db"
import { eq, and, ne, ilike, sql } from "drizzle-orm"
import { inventory } from "@/lib/db/schema"
import type { Metadata } from "next"
import { buildCarSpecRows, getExplicitFeatures, isPresentString, isPresentNumber } from "@/lib/display-guards"
import { getBrandSeoUrl } from "@/lib/seo-constants"
import { PhotoGallery } from "@/components/photo-gallery-wrapper"
import { getFallbackCars } from "@/lib/fallback-cars"

export const revalidate = 900
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const cars = await db
      .select({ slug: inventory.slug })
      .from(inventory)
      .where(and(eq(inventory.category, "car"), eq(inventory.isPublished, true)))
      .limit(50)
    
    return cars
      .filter((car) => car.slug && typeof car.slug === 'string')
      .map((car) => ({ slug: String(car.slug) }))
  } catch (error) {
    console.error('Error generating static params for cars:', error)
    return []
  }
}

interface CarDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getCarBySlug(slug: string) {
  const fallbackMatch = () => {
    const fallbackCars = getFallbackCars()
    const exact = fallbackCars.find((car) => car.slug === slug)
    if (exact) return exact

    const make = slug.split('-')[0]
    return fallbackCars.find((car) => car.slug.startsWith(`${make}-`)) || null
  }

  try {
    const cars = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.category, "car"),
          eq(inventory.slug, slug),
          eq(inventory.isPublished, true)
        )
      )
      .limit(1)

    if (cars.length > 0) {
      return cars[0]
    }

    const slugParts = slug.split('-')
    const make = slugParts[0]
    
    const fallbackCars = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.category, "car"),
          eq(inventory.isPublished, true),
          ilike(inventory.title, `%${make}%`)
        )
      )
      .limit(1)

    if (fallbackCars.length > 0) {
      return fallbackCars[0]
    }

    return fallbackMatch()
  } catch (error) {
    console.error('Error fetching car:', error)
    return fallbackMatch()
  }
}

async function getSimilarCars(currentCarId: string, brand: string) {
  const fallbackSimilarCars = () => {
    const normalizedBrand = brand.toLowerCase()
    return getFallbackCars()
      .filter((car) => car.id !== currentCarId && car.slug !== currentCarId)
      .sort((a, b) => {
        const aSame = a.brand.toLowerCase().startsWith(normalizedBrand) ? 1 : 0
        const bSame = b.brand.toLowerCase().startsWith(normalizedBrand) ? 1 : 0
        return bSame - aSame
      })
      .slice(0, 3)
      .map((car) => ({
        id: car.slug,
        type: "car" as const,
        title: car.title,
        subtitle: car.subtitle || "Premium",
        price: car.pricePerDay ? `$${Number(car.pricePerDay).toLocaleString()}` : "",
        priceUnit: "day",
        image: car.images[0],
        specs: [],
        badges: car.isFeatured ? ["Popular"] : [],
        focalPoint: car.focalPoint || '50% 40%',
        flipHorizontal: car.flipHorizontal || false,
        flipVertical: car.flipVertical || false,
      }))
  }

  try {
    const allCars = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.category, "car"),
          eq(inventory.isPublished, true),
          ne(inventory.id, currentCarId)
        )
      )
      .limit(20)

    const carsWithPhotos = allCars.filter((car) => {
      const images = Array.isArray(car.images) 
        ? (car.images as any[]).map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean)
        : []
      return images.length > 0
    })

    const sameBrandCars = carsWithPhotos.filter((car) => 
      car.title?.toLowerCase().startsWith(brand.toLowerCase())
    )
    const otherCars = carsWithPhotos.filter((car) => 
      !car.title?.toLowerCase().startsWith(brand.toLowerCase())
    )

    const sortedCars = [...sameBrandCars, ...otherCars].slice(0, 3)

    if (sortedCars.length === 0) {
      return fallbackSimilarCars()
    }

    return sortedCars.map((car) => {
      const specs = (car.specifications as any) || {}
      const images = Array.isArray(car.images) 
        ? (car.images as any[]).map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean)
        : []
      return {
        id: car.slug,
        type: "car" as const,
        title: car.title,
        subtitle: car.subtitle || "Premium",
        price: `$${Number(car.pricePerDay || 0).toLocaleString()}`,
        priceUnit: "day",
        image: images[0],
        specs: [],
        badges: car.isFeatured ? ["Popular"] : [],
        focalPoint: car.focalPoint || '50% 40%',
        flipHorizontal: car.flipHorizontal || false,
        flipVertical: car.flipVertical || false,
      }
    })
  } catch (error) {
    console.error('Error fetching similar cars:', error)
    return fallbackSimilarCars()
  }
}

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const car = await getCarBySlug(slug)

  if (!car) {
    return {
      title: "Car Not Found | Luxx Miami",
    }
  }

  const specs = (car.specifications as any) || {}
  const brand = (car as any).brand || car.title?.split(' ')[0] || "Luxury"
  const images = Array.isArray(car.images) 
    ? (car.images as any[]).map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean)
    : []

  const pricePerDay = Number(car.pricePerDay || 0)
  const priceText = pricePerDay > 0 ? ` from $${pricePerDay.toLocaleString()}/day.` : '.'
  const defaultDescription = `Rent the ${car.title} in Miami${priceText} ${specs.horsepower ? specs.horsepower + 'hp, ' : ''}${specs.acceleration ? specs.acceleration + ' 0-60. ' : ''}Free delivery, 150 miles/day included. Reserve your exotic car today.`
  const titlePrice = pricePerDay > 0 ? ` | From $${pricePerDay.toLocaleString()}/day` : ''
  
  return {
    title: `${car.title} Rental Miami${titlePrice} | Luxx Miami`,
    description: car.description || defaultDescription,
    keywords: [`${car.title} rental`, `${brand} rental miami`, "exotic car rental", "luxury car rental miami", "supercar rental", "sports car rental miami"],
    openGraph: {
      title: `${car.title} Rental Miami`,
      description: car.description || `Experience luxury with the ${car.title}. Available for daily rental in Miami.`,
      type: "website",
      url: `https://luxxmiami.com/cars/${slug}`,
      images: images.length > 0 ? [{ url: images[0], width: 1200, height: 630, alt: car.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${car.title} Rental Miami`,
      description: car.description || `Experience luxury with the ${car.title}. Available for daily rental in Miami.`,
      images: images.length > 0 ? [images[0]] : undefined,
    },
    alternates: {
      canonical: `https://luxxmiami.com/cars/${slug}`,
    },
  }
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { slug } = await params
  const car = await getCarBySlug(slug)

  if (!car) {
    notFound()
  }

  const specs = (car.specifications as any) || {}
  const brand = (car as any).brand || car.title?.split(' ')[0] || "Luxury"
  const similarCars = await getSimilarCars(car.id, brand)
  
  // Fallback gradient image (data URI) instead of placeholder.svg
  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'
  
  const specRows = buildCarSpecRows(specs)
  const explicitFeatures = getExplicitFeatures(specs)
  
  const carData = {
    id: car.slug,
    type: "car",
    title: car.title || "Luxury Vehicle",
    subtitle: car.subtitle || "",
    price: `$${Number(car.pricePerDay || 0).toLocaleString()}`,
    priceUnit: "day",
    brand: brand,
    year: isPresentNumber(specs.year) ? specs.year : null,
    images: Array.isArray(car.images) 
      ? (car.images as any[]).map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean)
      : [fallbackImage],
    specRows,
    features: explicitFeatures,
    badges: [...(car.isFeatured ? ["Featured"] : []), ...(specs.badges || [])],
    description: car.description || null,
    policies: {
      minAge: 25,
      deposit: isPresentString(specs.deposit) ? specs.deposit : null,
      mileageLimit: isPresentString(specs.mileage_limit) ? specs.mileage_limit : (isPresentString(specs.mileageLimit) ? specs.mileageLimit : null),
      insurance: "Comprehensive coverage included",
    },
  }

  return (
    <div className="min-h-screen bg-black">
      <ProductSchema
        name={carData.title}
        description={carData.description || `${carData.title} available for rental in Miami.`}
        image={carData.images.filter(img => typeof img === 'string')}
        price={Number(car.pricePerDay || 0)}
        category="car"
        brand={carData.brand}
        year={carData.year || undefined}
        url={`https://luxxmiami.com/cars/${car.slug}`}
        specs={specs}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://luxxmiami.com' },
          { name: 'Cars', url: 'https://luxxmiami.com/cars' },
          { name: carData.brand, url: `https://luxxmiami.com${getBrandSeoUrl(carData.brand.toLowerCase().replace(/\s+/g, '-'))}` },
          { name: carData.title, url: `https://luxxmiami.com/cars/${car.slug}` },
        ]}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <a href="/cars" className="hover:text-[#ECAC36]">
            Cars
          </a>
          <span className="mx-2">/</span>
          <a href={getBrandSeoUrl(carData.brand.toLowerCase().replace(/\s+/g, '-'))} className="hover:text-[#ECAC36]">
            {carData.brand}
          </a>
          <span className="mx-2">/</span>
          <span className="text-white">{carData.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <PhotoGallery 
              images={carData.images} 
              title={carData.title} 
              badges={carData.badges}
              focalPoint={car.focalPoint || '50% 50%'}
              flipHorizontal={car.flipHorizontal || false}
              flipVertical={car.flipVertical || false}
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-heading font-black text-white mb-2">{carData.title}</h1>
              <p className="text-xl text-gray-400 mb-4">{carData.subtitle}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                {carData.year && <><span>{carData.year}</span><span className="mx-2">•</span></>}
                <span>{carData.brand}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Miami, FL
                </span>
              </div>
            </div>

            {/* Pricing - Conditionally show price or contact message */}
            {Number(car.pricePerDay || 0) > 0 ? (
              <div className="bg-charcoal/50 rounded-2xl p-6 border border-[#ECAC36]/20">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-heading font-black text-[#ECAC36]">{carData.price}</span>
                  <span className="text-gray-400">/ {carData.priceUnit}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  {carData.policies.deposit && <p>• Deposit: {carData.policies.deposit}</p>}
                  {carData.policies.mileageLimit && <p>• Included: {carData.policies.mileageLimit}</p>}
                </div>
              </div>
            ) : (
              <div className="bg-charcoal/50 rounded-2xl p-6 border border-[#ECAC36]/20">
                <p className="text-gray-400">Contact us for pricing and availability.</p>
              </div>
            )}

            {/* Embedded Inquiry Form */}
            <EmbeddedInquiryForm itemTitle={carData.title} itemCategory="car" />

            {/* Specifications - Only show if we have explicitly set specs */}
            {carData.specRows.length > 0 && (
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-[#ECAC36] rounded-full mr-3"></span>
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {carData.specRows.map((row) => {
                    const IconComponent = row.icon === 'users' ? Users : row.icon === 'gauge' ? Gauge : row.icon === 'calendar' ? Calendar : row.icon === 'fuel' ? Fuel : row.icon === 'settings' ? Settings : row.icon === 'car' ? Car : Gauge
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
            {carData.features.length > 0 && (
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-6 bg-[#ECAC36] rounded-full mr-3"></span>
                  Features
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {carData.features.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#ECAC36] rounded-full"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policies - Only show if we have explicit policy info from CMS */}
            {(carData.policies.deposit || carData.policies.mileageLimit) && (
              <div className="bg-charcoal/30 rounded-2xl p-6">
                <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-[#ECAC36]" />
                  Rental Policies
                </h3>
                <div className="space-y-2 text-sm">
                  {carData.policies.deposit && (
                    <p className="text-gray-300">
                      <strong className="text-white">Security Deposit:</strong> {carData.policies.deposit}
                    </p>
                  )}
                  {carData.policies.mileageLimit && (
                    <p className="text-gray-300">
                      <strong className="text-white">Mileage:</strong> {carData.policies.mileageLimit}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description - Full width below photo/form, renders HTML from CMS */}
        {carData.description && (
          <div className="mt-16">
            <h2 className="text-3xl font-heading font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-8 bg-[#ECAC36] rounded-full mr-3"></span>
              About This Vehicle
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
              dangerouslySetInnerHTML={{ __html: carData.description }}
            />
          </div>
        )}

        {/* Similar Vehicles */}
        <div className="mt-16">
          <InventoryRow title="Similar Vehicles" items={similarCars} />
        </div>
      </main>
    </div>
  )
}
