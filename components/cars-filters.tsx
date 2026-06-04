"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, DollarSign, Tag } from "lucide-react"

interface CarsFiltersProps {
  filters: {
    brands: string[]
    bodyTypes: string[]
    priceRange: [number, number]
  }
  onFiltersChange: (filters: any) => void
}

const BRANDS = ["Ferrari", "Lamborghini", "Rolls-Royce", "McLaren", "Porsche", "Mercedes", "BMW", "Audi", "Bentley", "Aston Martin", "Maserati", "Bugatti", "Koenigsegg", "Pagani"]

function formatPrice(value: number): string {
  return `$${value.toLocaleString()}`
}

export function CarsFilters({ filters, onFiltersChange }: CarsFiltersProps) {
  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    onFiltersChange({ brands: newBrands })
  }

  const clearAll = () => {
    onFiltersChange({
      brands: [],
      bodyTypes: [],
      priceRange: [0, 5000],
    })
  }

  const activeCount = filters.brands.length + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 ? 1 : 0)

  return (
    <div className="bg-[#0A0A0A] border-b border-[#ECAC36]/20 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {/* Brand Dropdown - First */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap">
                <Tag className="mr-1 h-4 w-4" />
                Brand {filters.brands.length > 0 && `(${filters.brands.length})`}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
              <div className="space-y-3">
                <h4 className="font-medium text-white">Select Brands</h4>
                <div className="grid grid-cols-2 gap-2">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`text-left px-3 py-2 text-sm cut-corner-button ${
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

          {/* Price Range - Second */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap" aria-label="Filter by price range">
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
                  max={5000}
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

          {/* Clear All */}
          {activeCount > 0 && (
            <Button
              onClick={clearAll}
              variant="ghost"
              className="text-[#ECAC36] hover:text-[#ECAC36]/80 hover:bg-[#ECAC36]/10 cut-corner-button ml-auto"
            >
              Clear All ({activeCount})
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
