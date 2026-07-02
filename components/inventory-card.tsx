"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"
import { normalizeImageUrl } from "@/lib/media-utils"
import { ProgressiveImage } from "@/components/progressive-image"
import {
  effectiveDailyRate,
  parseDailyRate,
  type RateOverrides,
} from "@/lib/car-discount-tiers"
import { getFleetBrandLogo, getFleetBrandLogoStyle } from "@/lib/brand-logo-utils"
import { useLuxxCardMotion } from "@/components/use-luxx-card-motion"

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
  /**
   * Optional per-listing multi-day rates (inventory.pricePerWeek /
   * pricePerMonth). When provided, they win over the config-computed tier rate;
   * when omitted, the config in lib/car-discount-tiers is the fallback.
   */
  rateOverrides?: RateOverrides
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

function getCardActionLabel(type: InventoryCardProps["type"]) {
  if (type === "yacht") return "View yacht"
  if (type === "villa") return "View property"
  if (type === "jet") return "View jet"
  return "View vehicle"
}

function formatCardSpec(spec: string): string | null {
  const value = spec.trim().replace(/\s+/g, " ")
  if (!value || value.length > 28) return null

  const lowerValue = value.toLowerCase()
  const seatsMatch = lowerValue.match(/^(\d+)\s*seats?$/)
  if (seatsMatch) return `${seatsMatch[1]} Seats`

  const hpMatch = lowerValue.match(/^(\d{2,4})\s*hp$/)
  if (hpMatch) return `${hpMatch[1]} HP`

  const zeroSixtyMatch = lowerValue.match(/^(\d(?:\.\d+)?)\s*s(?:ec(?:onds?)?)?$/)
  if (zeroSixtyMatch) return `${zeroSixtyMatch[1]}s 0-60`

  if (lowerValue.includes("0-60")) {
    return value.replace(/\bmph\b/gi, "MPH")
  }

  if (lowerValue === "automatic") return "Auto"
  return value
}

function getCardSpecs(type: InventoryCardProps["type"], specs: string[]): string[] {
  if (type !== "car") return []

  const formattedSpecs = specs
    .map(formatCardSpec)
    .filter((spec): spec is string => Boolean(spec))

  const strongerSpecs = formattedSpecs.filter((spec) => !["Auto", "Automatic"].includes(spec))
  const specsToShow = strongerSpecs.length >= 2 ? strongerSpecs : formattedSpecs

  return Array.from(new Set(specsToShow)).slice(0, 3)
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
  rateOverrides,
  yachtPricing,
}: InventoryCardProps) {
  const { cardRef, handlePointerMove, resetPointerEffect } = useLuxxCardMotion<HTMLDivElement>()
  // Limitless-style pill control: which duration the card is currently quoting.
  const [selectedPillDays, setSelectedPillDays] = useState(1)
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
  const detailUrl = getDetailUrl()
  const cardActionLabel = getCardActionLabel(type)
  const dailyRate = type === "car" ? parseDailyRate(price) : 0
  const showDiscountTiers = type === "car" && dailyRate > 0
  const brandLogo = type === "car" ? getFleetBrandLogo(brand, title) : null
  const brandLogoStyle = type === "car" ? getFleetBrandLogoStyle(brand, title) : null
  // Segmented-control pills (label -> day count fed to effectiveDailyRate).
  const durationPills: { label: string; days: number }[] = [
    { label: "1D", days: 1 },
    { label: "3D", days: 3 },
    { label: "5D", days: 5 },
    { label: "7D", days: 7 },
    { label: "14D+", days: 14 },
  ]
  const displayedDailyRate = showDiscountTiers
    ? effectiveDailyRate(selectedPillDays, dailyRate, rateOverrides)
    : dailyRate
  const cardSpecs = getCardSpecs(type, specs)

  useEffect(() => {
    const card = cardRef.current
    if (!brandLogo || !card || typeof window === "undefined") return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mobileLike =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches
    if (reduceMotion || !("IntersectionObserver" in window)) return

    let isVisible = false
    let animationFrame: number | null = null

    const updateMobileLogoGlimmer = () => {
      animationFrame = null
      if (!isVisible) return

      const rect = card.getBoundingClientRect()
      const viewportHeight = Math.max(window.innerHeight || 1, 1)
      if (rect.bottom < 0 || rect.top > viewportHeight) {
        isVisible = false
        card.classList.remove("logo-scroll-visible")
        return
      }

      const centerY = rect.top + rect.height * 0.5
      const progress = Math.max(0, Math.min(1, centerY / viewportHeight))
      const glimmerX = Math.round((1 - progress) * 100)
      card.style.setProperty("--mobile-logo-glimmer-x", `${glimmerX}%`)
    }

    const requestMobileLogoGlimmerUpdate = () => {
      if (!mobileLike || animationFrame !== null) return
      animationFrame = window.requestAnimationFrame(updateMobileLogoGlimmer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && entry.intersectionRatio >= 0.08) {
          isVisible = true
          card.classList.add("logo-scroll-visible")
          requestMobileLogoGlimmerUpdate()
        } else {
          isVisible = false
          card.classList.remove("logo-scroll-visible")
        }
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: [0, 0.08, 0.22, 0.55],
      }
    )

    card.dataset.logoScrollBound = "1"
    card.style.setProperty("--mobile-logo-glimmer-x", "50%")
    observer.observe(card)
    window.addEventListener("scroll", requestMobileLogoGlimmerUpdate, { passive: true })
    window.addEventListener("resize", requestMobileLogoGlimmerUpdate, { passive: true })
    requestMobileLogoGlimmerUpdate()

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }
      observer.disconnect()
      window.removeEventListener("scroll", requestMobileLogoGlimmerUpdate)
      window.removeEventListener("resize", requestMobileLogoGlimmerUpdate)
      card.classList.remove("logo-scroll-visible")
      delete card.dataset.logoScrollBound
    }
  }, [brandLogo, cardRef])

  const cardStyle = {
    "--luxx-shine-x": "50%",
    "--luxx-shine-y": "50%",
    "--luxx-logo-x": "50%",
    "--luxx-logo-y": "50%",
    "--mobile-logo-glimmer-x": "50%",
    ...(brandLogoStyle || {}),
  } as CSSProperties

  return (
    <div
      ref={cardRef}
      className={`car-card luxx-magnetic-card luxx-inventory-card luxx-inventory-card--${type} group cursor-pointer bg-[#0A0A0A] rounded-lg border border-white/10`}
      data-brand={brandLogo?.key || brand}
      data-brand-logo-key={brandLogo?.key}
      data-brand-logo={brandLogo?.logo}
      style={cardStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerEffect}
    >
      {brandLogo && (
        <span
          className="car-brand-glow"
          aria-hidden="true"
        />
      )}
      <a href={detailUrl} className="relative z-[1] block cursor-pointer">
        <div className="car-img-wrap relative aspect-[3/2] overflow-hidden">
          <ProgressiveImage
            src={getPlaceholderImage()}
            lqSrc={lqImage}
            alt={title || "Luxury Vehicle"}
            fill
            sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1024px) 50vw, 25vw"
            quality={70}
            className="luxx-card-image object-cover"
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

        <div className="car-body relative p-4 space-y-2">
          <div className="luxx-card-edge absolute inset-x-4 top-0 h-px"></div>
          <div className="mb-3">
            {hasValidPrice ? (
              <div className="font-bold text-2xl md:text-3xl leading-none text-[#ECAC36] tracking-normal tabular-nums">
                {showDiscountTiers ? `$${displayedDailyRate.toLocaleString()}` : price}
                <span className="font-medium text-sm md:text-base text-gray-400 ml-1">/{priceUnit}</span>
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
          {cardSpecs.length > 0 && (
            <div className="luxx-card-specs" aria-label={`${title} quick specs`}>
              {cardSpecs.map((spec) => (
                <span key={spec} className="luxx-card-spec">
                  {spec}
                </span>
              ))}
            </div>
          )}
          {showSubtitle && (
            <p className="text-sm truncate text-gray-500">{displaySubtitle}</p>
          )}
          <span className="mt-3 inline-flex min-h-9 items-center justify-center border border-[#ECAC36]/30 bg-[#ECAC36]/10 px-3 text-xs font-bold uppercase tracking-normal text-[#ECAC36] transition-colors duration-200 cut-corner-button group-hover:border-[#ECAC36]/70 group-hover:bg-[#ECAC36]/15">
            {cardActionLabel}
          </span>
        </div>
      </a>
      {showDiscountTiers && (
        <div
          className="relative z-[4] mx-4 mb-4 mt-1 flex gap-1.5 rounded-xl border border-white/5 bg-white/5 p-1"
          role="group"
          aria-label={`Multi-day rate options for ${title}`}
        >
          {durationPills.map((pill) => {
            const isActive = selectedPillDays === pill.days
            return (
              <button
                key={pill.days}
                type="button"
                onClick={() => setSelectedPillDays(pill.days)}
                aria-pressed={isActive}
                aria-label={`${pill.label} rate: $${effectiveDailyRate(pill.days, dailyRate, rateOverrides).toLocaleString()} per day`}
                className={`flex-1 rounded-lg py-2 text-[10px] font-black transition-all ${
                  isActive
                    ? "bg-[#ECAC36] text-black"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {pill.label}
              </button>
            )
          })}
        </div>
      )}
      <div className="luxx-card-shine pointer-events-none" aria-hidden="true"></div>
    </div>
  )
}
