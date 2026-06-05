"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Car, Check, ChevronDown, DollarSign, SlidersHorizontal, Tag, X } from "lucide-react"

type CarsFilterState = {
  brands: string[]
  bodyTypes: string[]
  priceRange: [number, number]
}

interface CarsFiltersProps {
  filters: CarsFilterState
  onFiltersChange: (filters: Partial<CarsFilterState>) => void
  availableBrands: string[]
  availableBodyTypes: string[]
  priceMax: number
}

const filterButtonClass =
  "magnetic-hover cut-corner-button h-10 shrink-0 border border-[#ECAC36]/25 bg-black/70 px-3.5 text-white shadow-luxury-rest transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ECAC36]/70 hover:bg-[#ECAC36]/10 hover:text-white focus-angular"

const optionButtonClass =
  "group flex min-h-10 items-center justify-between gap-2 border px-3 py-2 text-left text-sm font-medium transition-all duration-200 cut-corner-button focus-angular"

const chipButtonClass =
  "luxx-filter-chip inline-flex min-h-8 items-center gap-2 border border-[#ECAC36]/35 bg-[#ECAC36]/10 px-3 py-1.5 text-xs font-semibold text-[#ECAC36] transition-all duration-200 cut-corner hover:-translate-y-0.5 hover:border-[#ECAC36]/70 hover:bg-[#ECAC36]/20 hover:text-[#f3c764]"

function formatPrice(value: number): string {
  return `$${value.toLocaleString()}`
}

export function CarsFilters({
  filters,
  onFiltersChange,
  availableBrands,
  availableBodyTypes,
  priceMax,
}: CarsFiltersProps) {
  const displayBrands = Array.from(new Set(availableBrands.filter(Boolean)))
  const displayBodyTypes = Array.from(new Set(availableBodyTypes.filter(Boolean)))
  const availableBrandSet = new Set(displayBrands)
  const availableBodyTypeSet = new Set(displayBodyTypes)
  const selectedBrands = filters.brands.filter((brand) => availableBrandSet.has(brand))
  const selectedBodyTypes = filters.bodyTypes.filter((bodyType) => availableBodyTypeSet.has(bodyType))
  const hasCustomPrice = filters.priceRange[0] > 0 || filters.priceRange[1] < priceMax

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
    onFiltersChange({
      brands: [],
      bodyTypes: [],
      priceRange: [0, priceMax],
    })
  }

  const activeCount = selectedBrands.length + selectedBodyTypes.length + (hasCustomPrice ? 1 : 0)

  return (
    <div className="sticky top-0 z-40 border-b border-[#ECAC36]/20 bg-[#060606]/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
              <span className="flex h-8 w-8 items-center justify-center border border-[#ECAC36]/25 bg-[#ECAC36]/10 text-[#ECAC36] cut-corner">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              Fleet Filters
            </div>
            {activeCount > 0 && (
              <span className="border border-[#ECAC36]/25 bg-[#ECAC36]/10 px-2.5 py-1 text-xs font-semibold text-[#ECAC36] cut-corner lg:hidden">
                {activeCount} Active
              </span>
            )}
          </div>

          <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 scrollbar-hide lg:pb-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button className={filterButtonClass}>
                  <Tag className="mr-1 h-4 w-4" />
                  Brand {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[calc(100vw-2rem)] max-w-sm border-[#ECAC36]/30 bg-[#080808] p-4 shadow-luxury-hover cut-corner-card">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.12em] text-white">
                      Brands
                    </h4>
                    <span className="text-xs text-[#B5B5B5]">{displayBrands.length} available</span>
                  </div>
                  <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
                    {displayBrands.map((brand) => {
                      const isSelected = selectedBrands.includes(brand)

                      return (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          aria-pressed={isSelected}
                          className={cn(
                            optionButtonClass,
                            isSelected
                              ? "border-[#ECAC36] bg-[#ECAC36] text-black shadow-luxury-hover"
                              : "border-white/10 bg-white/[0.03] text-white hover:border-[#ECAC36]/50 hover:bg-[#ECAC36]/10 hover:text-[#f3c764]",
                          )}
                        >
                          <span className="truncate">{brand}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button className={filterButtonClass}>
                  <Car className="mr-1 h-4 w-4" />
                  Body {selectedBodyTypes.length > 0 && `(${selectedBodyTypes.length})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[calc(100vw-2rem)] max-w-xs border-[#ECAC36]/30 bg-[#080808] p-4 shadow-luxury-hover cut-corner-card">
                <div className="space-y-3">
                  <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.12em] text-white">
                    Body Types
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {displayBodyTypes.map((bodyType) => {
                      const isSelected = selectedBodyTypes.includes(bodyType)

                      return (
                        <button
                          key={bodyType}
                          onClick={() => toggleBodyType(bodyType)}
                          aria-pressed={isSelected}
                          className={cn(
                            optionButtonClass,
                            isSelected
                              ? "border-[#ECAC36] bg-[#ECAC36] text-black shadow-luxury-hover"
                              : "border-white/10 bg-white/[0.03] text-white hover:border-[#ECAC36]/50 hover:bg-[#ECAC36]/10 hover:text-[#f3c764]",
                          )}
                        >
                          <span className="truncate">{bodyType}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button className={filterButtonClass} aria-label="Filter by price range">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[calc(100vw-2rem)] max-w-sm border-[#ECAC36]/30 bg-[#080808] p-4 shadow-luxury-hover cut-corner-card">
                <div className="space-y-4">
                  <h4 className="font-heading text-sm font-semibold uppercase tracking-[0.12em] text-white">
                    Daily Rate
                  </h4>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      onFiltersChange({ priceRange: [value[0] ?? 0, value[1] ?? priceMax] })
                    }
                    max={priceMax}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-[#B5B5B5]">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{formatPrice(filters.priceRange[1])}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {activeCount > 0 && (
              <Button
                onClick={clearAll}
                variant="ghost"
                className="magnetic-hover ml-auto h-10 shrink-0 text-[#ECAC36] transition-all duration-200 cut-corner-button hover:-translate-y-0.5 hover:bg-[#ECAC36]/10 hover:text-[#f3c764]"
              >
                Clear All ({activeCount})
              </Button>
            )}
          </div>
        </div>

        {activeCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[...selectedBrands, ...selectedBodyTypes].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  if (selectedBrands.includes(filter)) toggleBrand(filter)
                  if (selectedBodyTypes.includes(filter)) toggleBodyType(filter)
                }}
                className={chipButtonClass}
              >
                {filter}
                <X className="h-3 w-3" />
              </button>
            ))}
            {hasCustomPrice && (
              <button
                onClick={() => onFiltersChange({ priceRange: [0, priceMax] })}
                className={chipButtonClass}
              >
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
