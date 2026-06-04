"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bed, ChevronDown, DollarSign, Users } from "lucide-react"

interface VillasFiltersProps {
  filters: {
    priceRange: [number, number]
    bedrooms: string
    guests: string
  }
  onFiltersChange: (filters: any) => void
}

const BEDROOM_OPTIONS = ["2", "3", "4", "5", "6+"]
const GUEST_OPTIONS = ["2", "4", "6", "8", "10", "12+"]

function formatPrice(value: number): string {
  return `$${value.toLocaleString()}`
}

export function VillasFilters({ filters, onFiltersChange }: VillasFiltersProps) {
  const clearAll = () => {
    onFiltersChange({
      priceRange: [0, 5000],
      bedrooms: "",
      guests: "",
    })
  }

  const activeCount = 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 ? 1 : 0) +
    (filters.bedrooms ? 1 : 0) +
    (filters.guests ? 1 : 0)

  return (
    <div className="bg-[#0A0A0A] border-b border-[#ECAC36]/20 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {/* Nightly Rate */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap">
                <DollarSign className="mr-1 h-4 w-4" />
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}/night
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Nightly Rate</h4>
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

          {/* Bedrooms Buttons */}
          {BEDROOM_OPTIONS.map((option) => (
            <Button
              key={option}
              onClick={() => onFiltersChange({ bedrooms: filters.bedrooms === option ? "" : option })}
              className={`cut-corner-button whitespace-nowrap ${
                filters.bedrooms === option
                  ? "bg-[#ECAC36] text-black hover:bg-[#ECAC36]/90"
                  : "bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36]"
              }`}
            >
              {option} beds
            </Button>
          ))}

          {/* Guests Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap">
                <Users className="mr-1 h-4 w-4" />
                Guests {filters.guests && `(${filters.guests})`}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
              <div className="space-y-2">
                <h4 className="font-medium text-white mb-2">Guest Count</h4>
                {GUEST_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => onFiltersChange({ guests: filters.guests === option ? "" : option })}
                    className={`w-full text-left px-3 py-2 text-sm cut-corner-button ${
                      filters.guests === option
                        ? "bg-[#ECAC36] text-black"
                        : "text-white hover:bg-[#ECAC36]/10 border border-[#ECAC36]/30"
                    }`}
                  >
                    {option} guests
                  </button>
                ))}
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
