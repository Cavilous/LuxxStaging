"use client"

import Link from "next/link"
import { useRef } from "react"
import type { CSSProperties, PointerEvent } from "react"
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

function isExteriorNoteSubtitle(subtitle: string): boolean {
  const normalizedSubtitle = subtitle.trim().replace(/\s+/g, " ").toLowerCase()
  return /\bexterior\b/.test(normalizedSubtitle) && normalizedSubtitle.length <= 80
}

function shouldShowSubtitle(type: InventoryCardProps["type"], subtitle: string): boolean {
  if (!subtitle) return false
  if (type === "yacht" || type === "villa") return true
  return !isExteriorNoteSubtitle(subtitle)
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
  const cardRef = useRef<HTMLDivElement>(null)
  const animationFrame = useRef<number | null>(null)
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
  const displaySubtitle = subtitle.trim()
  const showSubtitle = shouldShowSubtitle(type, displaySubtitle)

  const cardStyle = {
    "--luxx-shine-x": "50%",
    "--luxx-shine-y": "50%",
  } as CSSProperties

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || typeof window === "undefined") return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const card = cardRef.current
    if (!card || animationFrame.current !== null) return

    const { clientX, clientY } = event
    animationFrame.current = window.requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        animationFrame.current = null
        return
      }

      const x = clientX - rect.left
      const y = clientY - rect.top

      card.style.setProperty("--luxx-shine-x", `${Math.max(0, Math.min(100, (x / rect.width) * 100))}%`)
      card.style.setProperty("--luxx-shine-y", `${Math.max(0, Math.min(100, (y / rect.height) * 100))}%`)
      animationFrame.current = null
    })
  }

  const resetPointerEffect = () => {
    if (animationFrame.current !== null) {
      window.cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }

    const card = cardRef.current
    if (!card) return
    card.style.setProperty("--luxx-shine-x", "50%")
    card.style.setProperty("--luxx-shine-y", "50%")
  }

  return (
    <div
      ref={cardRef}
      className="luxx-magnetic-card group bg-[#0A0A0A] overflow-hidden rounded-lg border border-white/10"
      style={cardStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerEffect}
    >
      <Link href={getDetailUrl()} className="relative z-[1] block cursor-pointer">
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

        <div className="relative p-4 space-y-2">
          <div className="luxx-card-edge absolute inset-x-4 top-0 h-px"></div>
          <div className="mb-3">
            {hasValidPrice ? (
              <div className="font-bold text-2xl md:text-3xl leading-none text-[#ECAC36] tracking-normal">
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
          {showSubtitle && (
            <p className="text-sm truncate text-gray-500">{displaySubtitle}</p>
          )}
        </div>
      </Link>
      <div className="luxx-card-shine pointer-events-none" aria-hidden="true"></div>
    </div>
  )
}
