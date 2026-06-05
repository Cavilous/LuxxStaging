"use client"

import { useEffect, useId, useRef, useState } from "react"
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react"
import { normalizeImageUrl } from "@/lib/media-utils"
import { ProgressiveImage } from "@/components/progressive-image"
import {
  CAR_DISCOUNT_TIERS,
  getDiscountHref,
  getReservationTotal,
  getTieredDailyRate,
  parseDailyRate,
} from "@/lib/car-discount-tiers"
import { getFleetBrandLogo, getFleetBrandLogoStyle } from "@/lib/brand-logo-utils"

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

function getCardActionLabel(type: InventoryCardProps["type"]) {
  if (type === "yacht") return "View yacht"
  if (type === "villa") return "View property"
  if (type === "jet") return "View jet"
  return "View vehicle"
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
  const rateGuideRef = useRef<HTMLDivElement>(null)
  const animationFrame = useRef<number | null>(null)
  const latestPointer = useRef<{ clientX: number; clientY: number } | null>(null)
  const [isRateGuideOpen, setIsRateGuideOpen] = useState(false)
  const rateGuidePanelId = useId()
  const normalizedImage = normalizeImageUrl(image)

  useEffect(() => {
    return () => {
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current)
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
  const detailUrl = getDetailUrl()
  const cardActionLabel = getCardActionLabel(type)
  const dailyRate = type === "car" ? parseDailyRate(price) : 0
  const showDiscountTiers = type === "car" && dailyRate > 0
  const brandLogo = type === "car" ? getFleetBrandLogo(brand, title) : null
  const brandLogoStyle = type === "car" ? getFleetBrandLogoStyle(brand, title) : null
  const lowestRateTier = CAR_DISCOUNT_TIERS[CAR_DISCOUNT_TIERS.length - 1]
  const lowestDailyRate =
    showDiscountTiers && lowestRateTier ? getTieredDailyRate(dailyRate, lowestRateTier.days) : 0

  useEffect(() => {
    const card = cardRef.current
    if (!brandLogo || !card || typeof window === "undefined") return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mobileLike =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches

    if (mobileLike || reduceMotion || !("IntersectionObserver" in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && entry.intersectionRatio >= 0.08) {
          card.classList.add("logo-scroll-visible")
        } else {
          card.classList.remove("logo-scroll-visible")
        }
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: [0, 0.08],
      }
    )

    card.dataset.logoScrollBound = "1"
    observer.observe(card)

    return () => {
      observer.disconnect()
      card.classList.remove("logo-scroll-visible")
      delete card.dataset.logoScrollBound
    }
  }, [brandLogo])

  useEffect(() => {
    if (!showDiscountTiers) return

    const closeOnOutsidePointer = (event: Event) => {
      const guide = rateGuideRef.current
      if (!guide || !(event.target instanceof Node) || guide.contains(event.target)) return
      setIsRateGuideOpen(false)
    }

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return
      setIsRateGuideOpen(false)
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [showDiscountTiers])

  const cardStyle = {
    "--luxx-shine-x": "50%",
    "--luxx-shine-y": "50%",
    ...(brandLogoStyle || {}),
  } as CSSProperties

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
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

    card.style.setProperty("--luxx-shine-x", "50%")
    card.style.setProperty("--luxx-shine-y", "50%")
    card.style.transition = "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 220ms ease, box-shadow 220ms ease, background 220ms ease"
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)"
  }

  const handleRateGuideTriggerClick = () => {
    setIsRateGuideOpen((isOpen) => !isOpen)
  }

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
          <span className="mt-3 inline-flex min-h-9 items-center justify-center border border-[#ECAC36]/30 bg-[#ECAC36]/10 px-3 text-xs font-bold uppercase tracking-normal text-[#ECAC36] transition-colors duration-200 cut-corner-button group-hover:border-[#ECAC36]/70 group-hover:bg-[#ECAC36]/15">
            {cardActionLabel}
          </span>
        </div>
      </a>
      {showDiscountTiers && (
        <div
          ref={rateGuideRef}
          className={`luxx-rate-guide relative z-[4] mx-4 mb-4 mt-1 ${
            isRateGuideOpen ? "is-open" : ""
          }`}
        >
          <button
            type="button"
            className="luxx-rate-guide-trigger flex min-h-10 w-full items-center justify-between gap-3 border border-[#ECAC36]/25 bg-white/[0.035] px-3 py-2 text-left text-inherit cut-corner-button"
            aria-controls={rateGuidePanelId}
            aria-expanded={isRateGuideOpen}
            aria-label={`View multi-day rate tiers for ${title}`}
            onClick={handleRateGuideTriggerClick}
          >
            <div>
              <span className="block text-[0.68rem] font-semibold uppercase tracking-normal text-[#ECAC36]">
                Prices as low as
              </span>
              <span className="block text-sm font-black leading-tight text-white">
                ${lowestDailyRate.toLocaleString()}<span className="text-[0.7rem] font-semibold text-gray-500">/day</span>
              </span>
            </div>
            <span className="text-xs font-semibold text-white/80">View rates</span>
          </button>
          <div id={rateGuidePanelId} className="luxx-rate-guide-panel">
            <div className="luxx-rate-guide-delivery-sticker">Free delivery</div>
            <div className="luxx-rate-guide-header">Multi-Day Rate Tiers</div>
            {CAR_DISCOUNT_TIERS.map((tier) => {
              const rate = getTieredDailyRate(dailyRate, tier.days)
              const tierHref = getDiscountHref(detailUrl, tier, dailyRate)
              const savingsPerDay = Math.max(0, dailyRate - rate)
              const reservationTotal = getReservationTotal(rate, tier.days)

              return (
                <a
                  key={tier.slug}
                  href={tierHref}
                  className={`luxx-rate-guide-row focus-angular ${
                    tier.emphasis === "best"
                      ? "luxx-rate-guide-row--best"
                      : ""
                  }`}
                  aria-label={`${tier.label} rate for ${title}: $${rate.toLocaleString()} per day, ${reservationTotal.toLocaleString()} total`}
                  onClick={() => setIsRateGuideOpen(false)}
                >
                  <span className="luxx-rate-guide-duration">{tier.label}</span>
                  <span className="luxx-rate-guide-price-group">
                    <span className="flex items-baseline justify-end gap-1">
                      <span className="text-sm font-bold text-[#ECAC36]">${rate.toLocaleString()}</span>
                      <span className="text-[0.7rem] text-gray-500">/day</span>
                    </span>
                    <span className="luxx-rate-guide-total">
                      Total ${reservationTotal.toLocaleString()}
                    </span>
                    <span
                      className={`luxx-rate-guide-save ${
                        tier.emphasis === "best"
                          ? "luxx-rate-guide-save--best"
                          : tier.emphasis === "mid"
                            ? "luxx-rate-guide-save--mid"
                            : ""
                      }`}
                    >
                      Save <span className="luxx-rate-guide-save-value">${savingsPerDay.toLocaleString()}/day</span>
                    </span>
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      )}
      <div className="luxx-card-shine pointer-events-none" aria-hidden="true"></div>
    </div>
  )
}
