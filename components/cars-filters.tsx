"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Car, ChevronDown, DollarSign, SlidersHorizontal, Tag, X } from "lucide-react"

interface CarsFiltersProps {
  filters: {
    brands: string[]
    bodyTypes: string[]
    priceRange: [number, number]
  }
  onFiltersChange: (filters: any) => void
  availableBrands: string[]
  availableBodyTypes: string[]
  priceMax: number
}

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
  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    onFiltersChange({ brands: newBrands })
  }

  const toggleBodyType = (bodyType: string) => {
    const newBodyTypes = filters.bodyTypes.includes(bodyType)
      ? filters.bodyTypes.filter((type) => type !== bodyType)
      : [...filters.bodyTypes, bodyType]
    onFiltersChange({ bodyTypes: newBodyTypes })
  }

  const clearAll = () => {
    onFiltersChange({
      brands: [],
      bodyTypes: [],
      priceRange: [0, priceMax],
    })
  }

  const activeCount = filters.brands.length + 
    filters.bodyTypes.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < priceMax ? 1 : 0)

  return (
    <div className="bg-[#0A0A0A]/95 border-b border-[#ECAC36]/20 sticky top-0 z-40 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="hidden md:flex items-center gap-2 pr-1 text-sm font-semibold text-white">
            <SlidersHorizontal className="h-4 w-4 text-[#ECAC36]" />
            Filters
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button className="magnetic-hover cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap">
                <Tag className="mr-1 h-4 w-4" />
                Brand {filters.brands.length > 0 && `(${filters.brands.length})`}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
              <div className="space-y-3">
                <h4 className="font-medium text-white">Select Brands</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`magnetic-hover text-left px-3 py-2 text-sm cut-corner-button ${
                        filters.brands.includes(brand)
                          ? "bg-[#ECAC36] text-black"
                          : "text-white hover:bg-[#ECAC36]/10 border border-[#ECAC36]/30"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button className="magnetic-hover cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap">
                <Car className="mr-1 h-4 w-4" />
                Body {filters.bodyTypes.length > 0 && `(${filters.bodyTypes.length})`}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
              <div className="space-y-3">
                <h4 className="font-medium text-white">Select Body Types</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableBodyTypes.map((bodyType) => (
                    <button
                      key={bodyType}
                      onClick={() => toggleBodyType(bodyType)}
                      className={`magnetic-hover text-left px-3 py-2 text-sm cut-corner-button ${
                        filters.bodyTypes.includes(bodyType)
                          ? "bg-[#ECAC36] text-black"
                          : "text-white hover:bg-[#ECAC36]/10 border border-[#ECAC36]/30"
                      }`}
                    >
                      {bodyType}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button className="magnetic-hover cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap" aria-label="Filter by price range">
                <DollarSign className="mr-1 h-4 w-4" />
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Daily Rate</h4>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => onFiltersChange({ priceRange: value })}
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
              className="magnetic-hover text-[#ECAC36] hover:text-[#ECAC36]/80 hover:bg-[#ECAC36]/10 cut-corner-button ml-auto"
            >
              Clear All ({activeCount})
            </Button>
          )}
        </div>

        {activeCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[...filters.brands, ...filters.bodyTypes].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  if (filters.brands.includes(filter)) toggleBrand(filter)
                  if (filters.bodyTypes.includes(filter)) toggleBodyType(filter)
                }}
                className="luxx-filter-chip inline-flex items-center gap-2 cut-corner border border-[#ECAC36]/35 bg-[#ECAC36]/10 px-3 py-1.5 text-xs font-semibold text-[#ECAC36] hover:bg-[#ECAC36]/20"
              >
                {filter}
                <X className="h-3 w-3" />
              </button>
            ))}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < priceMax) && (
              <button
                onClick={() => onFiltersChange({ priceRange: [0, priceMax] })}
                className="luxx-filter-chip inline-flex items-center gap-2 cut-corner border border-[#ECAC36]/35 bg-[#ECAC36]/10 px-3 py-1.5 text-xs font-semibold text-[#ECAC36] hover:bg-[#ECAC36]/20"
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
