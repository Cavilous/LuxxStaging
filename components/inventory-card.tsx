"use client"

import Image from "next/image"
import Link from "next/link"
import { normalizeImageUrl } from "@/lib/media-utils"
import { ProgressiveImage } from "@/components/progressive-image"

interface InventoryCardProps {
  type: "car" | "yacht" | "villa" | "jet"
  title: string
  subtitle: string
  price: string
  priceUnit: string
  image: string
  lqImage?: string | null
  specs: string[]
  badges?: string[]
  featured?: boolean
  slug?: string
  id?: string
  focalPoint?: string
  flipHorizontal?: boolean
  flipVertical?: boolean
  priority?: boolean
  yachtPricing?: {
    "4h": number
    "6h": number
    "8h": number
    "full-day"?: number
  }
}

export function InventoryCard({
  type,
  title,
  subtitle,
  price,
  priceUnit,
  image,
  lqImage,
  specs,
  badges = [],
  featured = false,
  slug,
  id,
  focalPoint = '50% 40%',
  flipHorizontal = false,
  flipVertical = false,
  priority = false,
  yachtPricing,
}: InventoryCardProps) {
  const normalizedImage = normalizeImageUrl(image)
  
  const getFlipTransform = () => {
    const transforms: string[] = []
    if (flipHorizontal) transforms.push('scaleX(-1)')
    if (flipVertical) transforms.push('scaleY(-1)')
    return transforms.length > 0 ? transforms.join(' ') : undefined
  }
  
  const getDetailUrl = () => {
    const itemSlug = slug || id || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    let basePath = ""
    if (type === "villa") {
      basePath = "houses"
    } else if (type === "car") {
      basePath = "cars"
    } else if (type === "yacht") {
      basePath = "yachts"
    } else if (type === "jet") {
      basePath = "jets"
    } else {
      basePath = `${type}s`
    }

    return `/${basePath}/${itemSlug}`
  }

  const getPlaceholderImage = () => {
    if (normalizedImage && !normalizedImage.includes("/placeholder.svg")) return normalizedImage

    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23333;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'
  }

  const getBadgeToShow = (): string | null => {
    if (type === "car") return null
    if (!badges || badges.length === 0) return null
    if (type === "yacht") {
      const filtered = badges.filter(b => b.toLowerCase() !== "popular")
      return filtered.length > 0 ? filtered[0] : null
    }
    return badges[0]
  }

  const badgeToShow = getBadgeToShow()

  const hasValidPrice = price && price !== "$0" && price !== "0" && price.trim() !== ""

  return (
    <div className="group bg-[#0A0A0A] overflow-hidden transition-all duration-300 rounded-lg hover:shadow-[0_0_30px_rgba(236,172,54,0.15)] hover:-translate-y-1">
      <Link href={getDetailUrl()} className="block cursor-pointer">
        <div className="relative aspect-[3/2] overflow-hidden">
          <ProgressiveImage
            src={getPlaceholderImage()}
            lqSrc={lqImage}
            alt={title || "Luxury Vehicle"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            quality={70}
            className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
            objectPosition={focalPoint}
            style={{ transform: getFlipTransform() }}
            priority={priority}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {badgeToShow !== null && (
            <div className="absolute top-3 left-3 z-10">
              <div className="badge-gold cut-corner-button px-3 py-1 text-xs font-bold text-black shadow-lg">
                {badgeToShow}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="mb-3">
            {hasValidPrice ? (
              <div className="font-bold text-2xl md:text-3xl leading-none text-[#ECAC36] tracking-tight">
                {price}<span className="font-medium text-sm md:text-base text-gray-400 ml-1">/{priceUnit}</span>
              </div>
            ) : (
              <div className="font-semibold text-lg text-[#ECAC36]">
                Call for pricing
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white truncate leading-tight group-hover:text-[#ECAC36] transition-colors duration-300">
            {title || "Luxury Vehicle"}
          </h3>
          {subtitle && (
            <p className="text-sm truncate text-gray-500">{subtitle}</p>
          )}
        </div>
      </Link>
    </div>
  )
}
