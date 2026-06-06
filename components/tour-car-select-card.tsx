"use client"

import type { CSSProperties } from "react"
import { CheckCircle, Users } from "lucide-react"
import { normalizeImageUrl } from "@/lib/media-utils"
import { getFleetBrandLogo, getFleetBrandLogoStyle } from "@/lib/brand-logo-utils"
import { ProgressiveImage } from "@/components/progressive-image"
import { useLuxxCardMotion } from "@/components/use-luxx-card-motion"

interface TourCarSelectCardProps {
  id: string
  make: string
  model: string
  image?: string | null
  maxPassengers?: number | null
  price: number
  durationLabel: string
  selected: boolean
  onSelect: () => void
}

const fallbackImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000;stop-opacity:1"/%3E%3Cstop offset="100%25" style="stop-color:%23201508;stop-opacity:1"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23ECAC36" font-size="24" font-family="Arial"%3ELuxx Miami%3C/text%3E%3C/svg%3E'

const brandNameOverrides: Record<string, string> = {
  mclaren: "McLaren",
  "rolls royce": "Rolls-Royce",
}

const uppercaseModelWords = new Set(["amg", "gt3rs", "gt3", "f8", "g63", "570s", "911", "sf90"])

function formatTourNameWord(word: string) {
  const lowerWord = word.toLowerCase()
  if (uppercaseModelWords.has(lowerWord) || /\d/.test(word)) return word.toUpperCase()
  if (lowerWord === "mclaren") return "McLaren"
  return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
}

function getDisplayTitle(make: string, model: string) {
  const rawTitle = `${make} ${model}`.replace(/\s+/g, " ").trim()
  if (!rawTitle) return "Luxury Tour Car"

  const title = rawTitle
    .split(" ")
    .map(formatTourNameWord)
    .join(" ")

  return Object.entries(brandNameOverrides).reduce(
    (currentTitle, [rawBrand, displayBrand]) =>
      currentTitle.replace(new RegExp(`\\b${rawBrand}\\b`, "i"), displayBrand),
    title,
  )
}

export function TourCarSelectCard({
  id,
  make,
  model,
  image,
  maxPassengers,
  price,
  durationLabel,
  selected,
  onSelect,
}: TourCarSelectCardProps) {
  const { cardRef, handlePointerMove, resetPointerEffect } = useLuxxCardMotion<HTMLButtonElement>()
  const title = getDisplayTitle(make, model)
  const normalizedImage = normalizeImageUrl(image) || fallbackImage
  const brandLogo = getFleetBrandLogo(make, title)
  const brandLogoStyle = getFleetBrandLogoStyle(make, title)
  const passengerCount = maxPassengers && maxPassengers > 0 ? maxPassengers : 3
  const cardStyle = {
    "--luxx-shine-x": "50%",
    "--luxx-shine-y": "50%",
    "--luxx-logo-x": "50%",
    "--luxx-logo-y": "50%",
    "--mobile-logo-glimmer-x": "50%",
    ...(brandLogoStyle || {}),
  } as CSSProperties

  return (
    <button
      ref={cardRef}
      type="button"
      className={`car-card luxx-magnetic-card luxx-inventory-card luxx-inventory-card--tour tour-car-card group cursor-pointer bg-[#0A0A0A] rounded-lg border ${
        selected ? "is-selected border-[#ECAC36]/80" : "border-white/10"
      }`}
      data-car-id={id}
      data-brand={brandLogo?.key || make}
      data-brand-logo-key={brandLogo?.key}
      data-brand-logo={brandLogo?.logo}
      aria-pressed={selected}
      aria-label={`Select ${title} ride-along tour, from $${price.toLocaleString()} for ${durationLabel}`}
      style={cardStyle}
      onClick={onSelect}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerEffect}
      onBlur={resetPointerEffect}
    >
      {brandLogo && <span className="car-brand-glow" aria-hidden="true" />}

      <div className="relative z-[1]">
        <div className="car-img-wrap relative aspect-[3/2] overflow-hidden">
          <ProgressiveImage
            src={normalizedImage}
            alt={title}
            fill
            sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1024px) 50vw, 33vw"
            quality={70}
            className="luxx-card-image object-cover"
            objectPosition="50% 42%"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/22 to-transparent" />

          {selected && (
            <div className="tour-card-selected-badge absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 border border-[#ECAC36]/50 bg-[#ECAC36] px-3 py-1 text-xs font-black uppercase tracking-normal text-black cut-corner-button">
              <CheckCircle className="h-3.5 w-3.5" strokeWidth={2.3} aria-hidden="true" />
              Selected
            </div>
          )}
        </div>

        <div className="car-body relative p-4">
          <div className="luxx-card-edge absolute inset-x-4 top-0 h-px" />
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <span className="block text-[0.68rem] font-bold uppercase tracking-normal text-[#ECAC36]/85">
                Ride-along from
              </span>
              <span className="block font-bold text-2xl md:text-3xl leading-none text-[#ECAC36] tracking-normal">
                ${price.toLocaleString()}
                <span className="ml-1 text-sm font-medium text-gray-400">/{durationLabel}</span>
              </span>
            </div>
          </div>

          <h3 className="mb-3 text-lg font-semibold leading-tight text-white transition-colors duration-300 group-hover:text-[#ECAC36]">
            {title}
          </h3>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
              <Users className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              Up to {passengerCount} passengers
            </span>
            <span className="tour-card-cta inline-flex min-h-9 items-center justify-center border border-[#ECAC36]/30 bg-[#ECAC36]/10 px-3 text-xs font-bold uppercase tracking-normal text-[#ECAC36] transition-colors duration-200 cut-corner-button group-hover:border-[#ECAC36]/70 group-hover:bg-[#ECAC36]/15">
              {selected ? "Chosen" : "Select tour"}
            </span>
          </div>
        </div>
      </div>

      <div className="luxx-card-shine pointer-events-none" aria-hidden="true" />
    </button>
  )
}
