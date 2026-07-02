"use client"

import { useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { Info, Truck } from "lucide-react"
import { EmbeddedInquiryForm } from "@/components/embedded-inquiry-form"
import {
  effectiveDailyRate,
  getReservationTotal,
  type RateOverrides,
} from "@/lib/car-discount-tiers"

const GOLD = "#ECAC36"
const SLIDER_MIN = 1
const SLIDER_MAX = 30

interface CarRateEstimatorProps {
  title: string
  basePricePerDay: number
  overrides?: RateOverrides
  deposit?: string | null
  mileageLimit?: string | null
}

/**
 * Limitless-style single-slider estimator. A continuous <input type="range"> over
 * 1..30 days drives a live "Current Rate" / "Estimated Total" summary, and the
 * chosen duration feeds the existing inquiry flow via pricingNote + initialRentalDays.
 */
export function CarRateEstimator({
  title,
  basePricePerDay,
  overrides,
  deposit,
  mileageLimit,
}: CarRateEstimatorProps) {
  const [days, setDays] = useState(1)

  const currentRate = useMemo(
    () => effectiveDailyRate(days, basePricePerDay, overrides),
    [days, basePricePerDay, overrides],
  )
  const estimatedTotal = getReservationTotal(currentRate, days)
  const savingsPerDay = Math.max(0, basePricePerDay - currentRate)
  const isDiscounted = savingsPerDay > 0

  const fillPercent = ((days - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100
  const trackStyle: CSSProperties = {
    background: `linear-gradient(to right, ${GOLD} 0%, ${GOLD} ${fillPercent}%, rgba(255,255,255,0.10) ${fillPercent}%, rgba(255,255,255,0.10) 100%)`,
  }

  const pricingNote = isDiscounted
    ? `${days}-day multi-day rate selected: $${currentRate.toLocaleString()}/day for ${days} days. Estimated total is $${estimatedTotal.toLocaleString()}. Base rate is $${basePricePerDay.toLocaleString()}/day.`
    : `${days}-day rental selected at $${currentRate.toLocaleString()}/day. Estimated total is $${estimatedTotal.toLocaleString()}.`

  return (
    <div className="space-y-6">
      <div
        className="relative overflow-hidden rounded-2xl border border-[#ECAC36]/20 bg-charcoal/50 p-6"
        data-demo="multi-day-pricing"
      >
        <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#ECAC36]/50 bg-[#ECAC36]/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#ECAC36] shadow-[0_0_24px_rgba(236,172,54,0.22)]">
          <Truck className="h-3.5 w-3.5" aria-hidden="true" />
          Free Miami delivery included
        </div>

        {/* Base price */}
        <div className="mb-6 flex flex-wrap items-baseline gap-2 pt-8 sm:pt-0 sm:pr-48">
          <span className="text-4xl font-heading font-black text-[#ECAC36]">
            ${basePricePerDay.toLocaleString()}
          </span>
          <span className="text-gray-400">/ day</span>
        </div>

        {/* Duration slider */}
        <div className="mb-6">
          <label
            htmlFor="rate-estimator-days"
            className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"
          >
            <Info className="h-4 w-4 text-[#ECAC36]" aria-hidden="true" />
            Duration ({days} {days === 1 ? "Day" : "Days"})
          </label>
          <input
            id="rate-estimator-days"
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            aria-label={`Rental duration: ${days} days`}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg accent-[#ECAC36] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ECAC36] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(236,172,54,0.5)] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#ECAC36]"
            style={trackStyle}
          />
          <div className="mt-2 flex justify-between text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/25">
            <span>1 Day</span>
            <span>15 Days</span>
            <span>30 Days</span>
          </div>
        </div>

        {/* Live summary */}
        <div className="space-y-6 rounded-2xl border border-white/5 bg-black/40 p-6">
          <div className="flex items-end justify-between">
            <span className="mb-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/40">
              Current Rate
            </span>
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-black text-white sm:text-4xl">
                  ${currentRate.toLocaleString()}
                </span>
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/40">
                  /day
                </span>
              </div>
              {isDiscounted && (
                <span className="mt-1 block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#ECAC36]">
                  Save ${savingsPerDay.toLocaleString()}/day
                </span>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          <div className="flex items-end justify-between">
            <span className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/40">
              Estimated Total
            </span>
            <span className="text-4xl font-black leading-none text-[#ECAC36] sm:text-6xl">
              ${estimatedTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {(deposit || mileageLimit) && (
          <div className="mt-4 space-y-2 text-sm text-gray-400">
            {deposit && <p>• Deposit: {deposit}</p>}
            {mileageLimit && <p>• Included: {mileageLimit}</p>}
          </div>
        )}
      </div>

      {/* Inquiry form driven by the slider state */}
      <EmbeddedInquiryForm
        itemTitle={title}
        itemCategory="car"
        pricingNote={pricingNote}
        initialRentalDays={days}
      />
    </div>
  )
}
