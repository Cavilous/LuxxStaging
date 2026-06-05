"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
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
  brand?: string
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

type BrandTreatment = {
  label: string
  rgb: string
}

const DEFAULT_BRAND_TREATMENT: BrandTreatment = {
  label: "Luxx",
  rgb: "236, 172, 54",
}

const BRAND_TREATMENTS: Record<string, BrandTreatment> = {
  "aston martin": { label: "Aston Martin", rgb: "72, 168, 134" },
  audi: { label: "Audi", rgb: "220, 220, 220" },
  bentley: { label: "Bentley", rgb: "58, 133, 94" },
  bmw: { label: "BMW", rgb: "0, 102, 177" },
  cadillac: { label: "Cadillac", rgb: "210, 54, 70" },
  chevrolet: { label: "Chevrolet", rgb: "238, 185, 53" },
  ferrari: { label: "Ferrari", rgb: "255, 40, 0" },
  ford: { label: "Ford", rgb: "40, 112, 205" },
  lamborghini: { label: "Lamborghini", rgb: "182, 162, 114" },
  "land rover": { label: "Land Rover", rgb: "28, 95, 72" },
  maserati: { label: "Maserati", rgb: "30, 80, 160" },
  mclaren: { label: "McLaren", rgb: "255, 135, 0" },
  mercedes: { label: "Mercedes-Benz", rgb: "0, 173, 239" },
  "mercedes benz": { label: "Mercedes-Benz", rgb: "0, 173, 239" },
  porsche: { label: "Porsche", rgb: "210, 180, 120" },
  "range rover": { label: "Range Rover", rgb: "28, 95, 72" },
  "rolls royce": { label: "Rolls-Royce", rgb: "180, 165, 145" },
  tesla: { label: "Tesla", rgb: "210, 24, 45" },
}

const BRAND_NAMES = Object.keys(BRAND_TREATMENTS).sort((a, b) => b.length - a.length)

function normalizeBrandName(value: string): string {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim()
}

function formatFallbackBrand(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      const normalized = word.toLowerCase()
      if (normalized.length <= 3) return normalized.toUpperCase()
      return normalized.charAt(0).toUpperCase() + normalized.slice(1)
    })
    .join(" ")
}

function getBrandTreatment(brand: string | undefined, title: string): BrandTreatment {
  const normalizedBrand = normalizeBrandName(brand || "")
  if (normalizedBrand && BRAND_TREATMENTS[normalizedBrand]) {
    return BRAND_TREATMENTS[normalizedBrand]
  }

  const normalizedTitle = normalizeBrandName(title)
  const inferredBrand = BRAND_NAMES.find((name) => normalizedTitle.includes(name))
  if (inferredBrand) return BRAND_TREATMENTS[inferredBrand]

  if (brand && brand.trim()) {
    return {
      label: formatFallbackBrand(brand),
      rgb: DEFAULT_BRAND_TREATMENT.rgb,
    }
  }

  return DEFAULT_BRAND_TREATMENT
}

function supportsDesktopMotion(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
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
  brand,
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
  const latestPointer = useRef<{ clientX: number; clientY: number } | null>(null)
  const logoFadeTimer = useRef<number | null>(null)
  const normalizedImage = normalizeImageUrl(image)

  useEffect(() => {
    return () => {
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current)
      }
      if (logoFadeTimer.current !== null) {
        window.clearTimeout(logoFadeTimer.current)
      }
    }
  }, [])
  
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
  const brandTreatment = getBrandTreatment(brand, title)

  const cardStyle = {
    "--luxx-shine-x": "50%",
    "--luxx-shine-y": "50%",
    "--luxx-brand-rgb": brandTreatment.rgb,
  } as CSSProperties

  const handlePointerEnter = () => {
    if (!supportsDesktopMotion()) return

    const card = cardRef.current
    if (!card || type !== "car") return

    if (logoFadeTimer.current !== null) {
      window.clearTimeout(logoFadeTimer.current)
      logoFadeTimer.current = null
    }

    card.classList.remove("logo-fade-ready", "logo-fading")
    card.classList.add("logo-cooldown")
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !supportsDesktopMotion()) return

    const card = cardRef.current
    if (!card) return

    latestPointer.current = { clientX: event.clientX, clientY: event.clientY }
    if (animationFrame.current !== null) return

    animationFrame.current = window.requestAnimationFrame(() => {
      const pointer = latestPointer.current
      const rect = card.getBoundingClientRect()
      if (!pointer || rect.width <= 0 || rect.height <= 0) {
        animationFrame.current = null
        return
      }

      const x = pointer.clientX - rect.left
      const y = pointer.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -5
      const rotateY = ((x - centerX) / centerX) * 5
      const shineX = Math.max(0, Math.min(100, (x / rect.width) * 100))
      const shineY = Math.max(0, Math.min(100, (y / rect.height) * 100))

      card.style.setProperty("--luxx-shine-x", `${shineX.toFixed(1)}%`)
      card.style.setProperty("--luxx-shine-y", `${shineY.toFixed(1)}%`)
      card.style.transition = "none"
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
      animationFrame.current = null
    })
  }

  const resetPointerEffect = () => {
    if (animationFrame.current !== null) {
      window.cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }
    latestPointer.current = null

    const card = cardRef.current
    if (!card) return

    if (type === "car") {
      if (logoFadeTimer.current !== null) {
        window.clearTimeout(logoFadeTimer.current)
      }
      card.classList.add("logo-fade-ready")
      void card.offsetWidth
      card.classList.add("logo-fading")
      logoFadeTimer.current = window.setTimeout(() => {
        card.classList.remove("logo-cooldown", "logo-fade-ready", "logo-fading")
        logoFadeTimer.current = null
      }, 4050)
    }

    card.style.setProperty("--luxx-shine-x", "50%")
    card.style.setProperty("--luxx-shine-y", "50%")
    card.style.transition = "all 0.4s ease"
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)"
  }

  return (
    <div
      ref={cardRef}
      className={`luxx-magnetic-card luxx-inventory-card luxx-inventory-card--${type} group bg-[#0A0A0A] overflow-hidden rounded-lg border border-white/10`}
      style={cardStyle}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerEffect}
    >
      {type === "car" && <span className="luxx-car-brand-glow" aria-hidden="true"></span>}
      <Link href={getDetailUrl()} className="relative z-[1] block cursor-pointer">
        <div className="relative aspect-[3/2] overflow-hidden">
          <ProgressiveImage
            src={getPlaceholderImage()}
            lqSrc={lqImage}
            alt={title || "Luxury Vehicle"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            quality={70}
            className="luxx-card-image object-cover"
            objectPosition={focalPoint}
            style={{ transform: getFlipTransform() }}
            priority={priority}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {type === "car" && brandTreatment.label && (
            <div className="luxx-card-brand-mark" aria-hidden="true">
              <span>{brandTreatment.label}</span>
            </div>
          )}

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
