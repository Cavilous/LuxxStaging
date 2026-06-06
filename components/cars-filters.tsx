"use client"

import { useState } from "react"
import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { getFleetBrandLogoStyle } from "@/lib/brand-logo-utils"
import type { FleetBrandFilterOption } from "@/lib/car-filter-utils"
import { Car, Check, ChevronDown, DollarSign, SlidersHorizontal, Tag, X } from "lucide-react"

type CarsFilterState = {
  brands: string[]
  bodyTypes: string[]
  priceRange: [number, number]
}

type OpenFilterPanel = "brand" | "body" | "price" | null

interface CarsFiltersProps {
  filters: CarsFilterState
  onFiltersChange: (filters: Partial<CarsFilterState>) => void
  availableBrandOptions: FleetBrandFilterOption[]
  availableBodyTypes: string[]
  priceMax: number
  hasPricesAboveMax: boolean
}

const filterButtonClass =
  "magnetic-hover cut-corner-button h-11 min-w-0 w-full justify-between border border-white/10 bg-white/[0.035] px-3 py-1.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_28px_rgba(0,0,0,0.26)] transition-all duration-200 hover:border-[#ECAC36]/50 hover:bg-[#ECAC36]/10 hover:text-white focus-angular md:h-10 md:min-w-[9.25rem] md:w-auto md:shrink-0 md:px-3 md:py-1"

const activeFilterButtonClass =
  "border-[#ECAC36]/70 bg-[#ECAC36]/15 text-[#f3c764] shadow-[inset_0_1px_0_rgba(236,172,54,0.16),0_12px_30px_rgba(0,0,0,0.32)]"

const optionButtonClass =
  "group flex min-h-11 items-center justify-between gap-2 overflow-hidden border px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 cut-corner-button focus-angular md:min-h-9 md:px-2.5 md:py-2 md:text-[13px]"

const chipButtonClass =
  "luxx-filter-chip inline-flex h-8 max-w-[13rem] shrink-0 items-center gap-2 border border-[#ECAC36]/35 bg-[#ECAC36]/10 px-3 py-1.5 text-xs font-semibold text-[#ECAC36] transition-all duration-200 cut-corner hover:border-[#ECAC36]/70 hover:bg-[#ECAC36]/20 hover:text-[#f3c764] focus-angular md:h-7 md:max-w-none md:px-2.5 md:py-1"

const filterPanelClass =
  "mt-3 overflow-hidden border border-[#ECAC36]/25 bg-[#080808]/95 shadow-[0_24px_64px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,255,255,0.035)] cut-corner-card md:mt-2"

function formatPrice(value: number): string {
  return `$${value.toLocaleString()}`
}

function formatPriceRange(range: [number, number], priceMax: number, hasPricesAboveMax: boolean): string {
  const upperSuffix = hasPricesAboveMax && range[1] >= priceMax ? "+" : ""
  return `${formatPrice(range[0])} - ${formatPrice(range[1])}${upperSuffix}`
}

export function CarsFilters({
  filters,
  onFiltersChange,
  availableBrandOptions,
  availableBodyTypes,
  priceMax,
  hasPricesAboveMax,
}: CarsFiltersProps) {
  const [openPanel, setOpenPanel] = useState<OpenFilterPanel>(null)
  const displayBrands = availableBrandOptions.filter((brand) => Boolean(brand.name))
  const displayBodyTypes = Array.from(new Set(availableBodyTypes.filter(Boolean)))
  const availableBrandSet = new Set(displayBrands.map((brand) => brand.name))
  const availableBodyTypeSet = new Set(displayBodyTypes)
  const selectedBrands = filters.brands.filter((brand) => availableBrandSet.has(brand))
  const selectedBodyTypes = filters.bodyTypes.filter((bodyType) => availableBodyTypeSet.has(bodyType))
  const hasCustomPrice = filters.priceRange[0] > 0 || filters.priceRange[1] < priceMax

  const togglePanel = (panel: OpenFilterPanel) => {
    setOpenPanel((currentPanel) => (currentPanel === panel ? null : panel))
  }

  const toggleBrand = (brand: string) => {
    if (!availableBrandSet.has(brand)) return

    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    onFiltersChange({ brands: newBrands })
  }

  const toggleBodyType = (bodyType: string) => {
    if (!availableBodyTypeSet.has(bodyType)) return

    const newBodyTypes = selectedBodyTypes.includes(bodyType)
      ? selectedBodyTypes.filter((type) => type !== bodyType)
      : [...selectedBodyTypes, bodyType]
    onFiltersChange({ bodyTypes: newBodyTypes })
  }

  const clearAll = () => {
    setOpenPanel(null)
    onFiltersChange({
      brands: [],
      bodyTypes: [],
      priceRange: [0, priceMax],
    })
  }

  const activeCount = selectedBrands.length + selectedBodyTypes.length + (hasCustomPrice ? 1 : 0)
  const priceLabel = formatPriceRange(filters.priceRange, priceMax, hasPricesAboveMax)
  const totalBrandCount = displayBrands.reduce((total, brand) => total + brand.count, 0)

  return (
    <div data-demo="fleet-filters" className="sticky top-0 z-40 border-y border-[#ECAC36]/15 bg-[#050505]/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 md:py-2">
        <div className="border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] px-3 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.28)] cut-corner-card md:px-3.5 md:py-2 lg:px-4">
          <div className="luxx-brand-shortcut-rail" aria-label="Quick brand filters">
            <button
              type="button"
              onClick={() => onFiltersChange({ brands: [] })}
              aria-pressed={selectedBrands.length === 0}
              className={cn("luxx-brand-shortcut", selectedBrands.length === 0 && "is-active")}
            >
              <span className="luxx-brand-shortcut-logo luxx-brand-shortcut-logo--all" aria-hidden="true" />
              <span>All</span>
              <em>{totalBrandCount}</em>
            </button>
            {displayBrands.map(({ name: brand, count }) => {
              const logoStyle = getFleetBrandLogoStyle(brand) as CSSProperties | null
              const isSelected = selectedBrands.includes(brand)

              return (
                <button
                  key={`quick-${brand}`}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  aria-pressed={isSelected}
                  className={cn("luxx-brand-shortcut", isSelected && "is-active")}
                  style={logoStyle || undefined}
                >
                  <span className="luxx-brand-shortcut-logo" aria-hidden="true" />
                  <span>{brand}</span>
                  <em>{count}</em>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:flex-wrap md:justify-center md:gap-x-4 md:gap-y-2 md:text-left">
            <div className="flex w-full shrink-0 items-center justify-center gap-3 md:w-auto md:gap-2">
              <div className="flex items-center justify-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-white/90 md:gap-2 md:text-xs md:tracking-[0.12em]">
                <span className="flex h-9 w-9 items-center justify-center border border-[#ECAC36]/30 bg-[#ECAC36]/10 text-[#ECAC36] cut-corner md:h-8 md:w-8">
                  <SlidersHorizontal className="h-4 w-4" />
                </span>
                Fleet Filters
              </div>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="cut-corner-button border border-[#ECAC36]/30 bg-[#ECAC36]/10 px-3 py-2 text-xs font-semibold text-[#ECAC36] transition-colors hover:border-[#ECAC36]/60 hover:bg-[#ECAC36]/15 hover:text-[#f3c764] focus-angular md:px-2.5 md:py-1.5 xl:hidden"
                >
                  Clear All ({activeCount})
                </button>
              )}
            </div>

            <div className="flex w-full justify-center pb-1 md:w-auto md:pb-0">
              <div className="grid w-full max-w-4xl grid-cols-1 gap-2 sm:grid-cols-3 md:flex md:max-w-none md:flex-wrap md:items-center md:justify-center md:gap-2">
                <Button
                  type="button"
                  onClick={() => togglePanel("brand")}
                  aria-expanded={openPanel === "brand"}
                  aria-controls="fleet-brand-panel"
                  className={cn(filterButtonClass, (selectedBrands.length > 0 || openPanel === "brand") && activeFilterButtonClass)}
                >
                  <span className="flex min-w-0 items-center gap-2.5 md:gap-2">
                    <Tag className="h-4 w-4 text-[#ECAC36] md:h-3.5 md:w-3.5" />
                    <span className="min-w-0 text-left leading-tight">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B5B5B5] md:text-[10px] md:tracking-[0.1em]">
                        Brand
                      </span>
                      <span className="block truncate text-sm font-semibold md:text-[13px]">
                        {selectedBrands.length > 0 ? `${selectedBrands.length} selected` : "All makes"}
                      </span>
                    </span>
                  </span>
                  <ChevronDown
                    className={cn("ml-2 h-4 w-4 text-[#ECAC36] transition-transform md:h-3.5 md:w-3.5", openPanel === "brand" && "rotate-180")}
                  />
                </Button>

                <Button
                  type="button"
                  onClick={() => togglePanel("body")}
                  aria-expanded={openPanel === "body"}
                  aria-controls="fleet-body-panel"
                  className={cn(filterButtonClass, (selectedBodyTypes.length > 0 || openPanel === "body") && activeFilterButtonClass)}
                >
                  <span className="flex min-w-0 items-center gap-2.5 md:gap-2">
                    <Car className="h-4 w-4 text-[#ECAC36] md:h-3.5 md:w-3.5" />
                    <span className="min-w-0 text-left leading-tight">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B5B5B5] md:text-[10px] md:tracking-[0.1em]">
                        Body
                      </span>
                      <span className="block truncate text-sm font-semibold md:text-[13px]">
                        {selectedBodyTypes.length > 0 ? `${selectedBodyTypes.length} selected` : "Any style"}
                      </span>
                    </span>
                  </span>
                  <ChevronDown
                    className={cn("ml-2 h-4 w-4 text-[#ECAC36] transition-transform md:h-3.5 md:w-3.5", openPanel === "body" && "rotate-180")}
                  />
                </Button>

                <Button
                  type="button"
                  onClick={() => togglePanel("price")}
                  aria-expanded={openPanel === "price"}
                  aria-controls="fleet-price-panel"
                  className={cn(filterButtonClass, "md:min-w-[12.5rem]", (hasCustomPrice || openPanel === "price") && activeFilterButtonClass)}
                  aria-label="Filter by price range"
                >
                  <span className="flex min-w-0 items-center gap-2.5 md:gap-2">
                    <DollarSign className="h-4 w-4 text-[#ECAC36] md:h-3.5 md:w-3.5" />
                    <span className="min-w-0 text-left leading-tight">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B5B5B5] md:text-[10px] md:tracking-[0.1em]">
                        Daily Rate
                      </span>
                      <span className="block truncate text-sm font-semibold md:text-[13px]">{priceLabel}</span>
                    </span>
                  </span>
                  <ChevronDown
                    className={cn("ml-2 h-4 w-4 text-[#ECAC36] transition-transform md:h-3.5 md:w-3.5", openPanel === "price" && "rotate-180")}
                  />
                </Button>

                {activeCount > 0 && (
                  <Button
                    type="button"
                    onClick={clearAll}
                    variant="ghost"
                    className="magnetic-hover hidden h-10 shrink-0 border border-[#ECAC36]/25 px-3 text-[#ECAC36] transition-all duration-200 cut-corner-button hover:border-[#ECAC36]/60 hover:bg-[#ECAC36]/10 hover:text-[#f3c764] xl:inline-flex"
                  >
                    <X className="h-4 w-4" />
                    Clear All ({activeCount})
                  </Button>
                )}
              </div>
            </div>
          </div>

          {openPanel === "brand" && (
            <div id="fleet-brand-panel" className={filterPanelClass}>
              <div className="border-b border-white/[0.07] p-4 md:px-3 md:py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.12em] text-white md:text-xs">
                    Brands
                  </h4>
                  <span className="text-xs text-[#B5B5B5]">{displayBrands.length} available</span>
                </div>
              </div>
              <div className="grid max-h-[22rem] grid-cols-1 gap-2 overflow-y-auto p-3 pr-2 sm:grid-cols-2 md:max-h-[15rem] md:gap-1.5 md:p-2.5 md:pr-2 lg:grid-cols-4">
                {displayBrands.map(({ name: brand, count }) => {
                  const isSelected = selectedBrands.includes(brand)

                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => toggleBrand(brand)}
                      aria-pressed={isSelected}
                      className={cn(
                        optionButtonClass,
                        isSelected
                          ? "border-[#ECAC36]/80 bg-[#ECAC36]/15 text-[#f3c764] shadow-[inset_0_1px_0_rgba(236,172,54,0.16)]"
                          : "border-white/10 bg-white/[0.035] text-white hover:border-[#ECAC36]/45 hover:bg-white/[0.055] hover:text-[#f3c764]",
                      )}
                    >
                      <span className="min-w-0 truncate">{brand}</span>
                      <span
                        className={cn(
                          "ml-auto shrink-0 border px-1.5 py-0.5 text-[11px] font-semibold leading-none cut-corner-sm",
                          isSelected
                            ? "border-[#ECAC36]/30 bg-black/25 text-[#ECAC36]"
                            : "border-white/10 bg-black/20 text-[#B5B5B5] group-hover:text-[#f3c764]",
                        )}
                      >
                        {count}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#ECAC36]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {openPanel === "body" && (
            <div id="fleet-body-panel" className={filterPanelClass}>
              <div className="border-b border-white/[0.07] p-4 md:px-3 md:py-2.5">
                <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.12em] text-white md:text-xs">
                  Body Types
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 md:gap-1.5 md:p-2.5 lg:grid-cols-5">
                {displayBodyTypes.map((bodyType) => {
                  const isSelected = selectedBodyTypes.includes(bodyType)

                  return (
                    <button
                      key={bodyType}
                      type="button"
                      onClick={() => toggleBodyType(bodyType)}
                      aria-pressed={isSelected}
                      className={cn(
                        optionButtonClass,
                        isSelected
                          ? "border-[#ECAC36]/80 bg-[#ECAC36]/15 text-[#f3c764] shadow-[inset_0_1px_0_rgba(236,172,54,0.16)]"
                          : "border-white/10 bg-white/[0.035] text-white hover:border-[#ECAC36]/45 hover:bg-white/[0.055] hover:text-[#f3c764]",
                      )}
                    >
                      <span className="truncate">{bodyType}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#ECAC36]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {openPanel === "price" && (
            <div id="fleet-price-panel" className={filterPanelClass}>
              <div className="border-b border-white/[0.07] p-4 md:px-3 md:py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.12em] text-white md:text-xs">
                    Daily Rate
                  </h4>
                  <span className="text-xs font-semibold text-[#ECAC36]">{priceLabel}</span>
                </div>
              </div>
              <div className="mx-auto max-w-full space-y-5 p-4 md:max-w-xl md:space-y-3 md:p-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    onFiltersChange({ priceRange: [value[0] ?? 0, value[1] ?? priceMax] })
                  }
                  max={priceMax}
                  min={0}
                  step={100}
                  className="py-3 md:py-2 [&_[data-slot=slider-range]]:bg-[#ECAC36] [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-[#ECAC36] [&_[data-slot=slider-thumb]]:bg-[#080808] [&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-white/15"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-white/10 bg-white/[0.035] px-3 py-2.5 cut-corner md:py-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B5B5B5]">
                      Min
                    </span>
                    <span className="text-sm font-semibold text-white">{formatPrice(filters.priceRange[0])}</span>
                  </div>
                  <div className="border border-white/10 bg-white/[0.035] px-3 py-2.5 text-right cut-corner md:py-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B5B5B5]">
                      Max
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {formatPrice(filters.priceRange[1])}
                      {hasPricesAboveMax && filters.priceRange[1] >= priceMax ? "+" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCount > 0 && (
            <div className="mt-3 max-w-full overflow-x-auto pb-1 scrollbar-hide md:mt-2">
              <div className="flex max-w-full justify-center gap-2 md:flex-wrap md:gap-1.5 md:pb-0">
                {selectedBrands.map((brand) => (
                  <button
                    key={`brand-${brand}`}
                    type="button"
                    onClick={() => toggleBrand(brand)}
                    className={chipButtonClass}
                    aria-label={`Remove ${brand} brand filter`}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    <span className="truncate">{brand}</span>
                    <X className="h-3 w-3 shrink-0" />
                  </button>
                ))}
                {selectedBodyTypes.map((bodyType) => (
                  <button
                    key={`body-${bodyType}`}
                    type="button"
                    onClick={() => toggleBodyType(bodyType)}
                    className={chipButtonClass}
                    aria-label={`Remove ${bodyType} body filter`}
                  >
                    <Car className="h-3.5 w-3.5" />
                    <span className="truncate">{bodyType}</span>
                    <X className="h-3 w-3 shrink-0" />
                  </button>
                ))}
                {hasCustomPrice && (
                  <button
                    type="button"
                    onClick={() => onFiltersChange({ priceRange: [0, priceMax] })}
                    className={chipButtonClass}
                    aria-label="Remove price range filter"
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="truncate">{priceLabel}</span>
                    <X className="h-3 w-3 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
