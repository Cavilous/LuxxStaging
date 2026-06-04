"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Anchor, ChevronDown, DollarSign } from "lucide-react"

interface YachtsFiltersProps {
  filters: {
    priceRange: [number, number]
    lengthRange: [number, number]
  }
  onFiltersChange: (filters: any) => void
}

function formatPrice(value: number): string {
  return `$${value.toLocaleString()}`
}

export function YachtsFilters({ filters, onFiltersChange }: YachtsFiltersProps) {
  const clearAll = () => {
    onFiltersChange({
      priceRange: [0, 10000],
      lengthRange: [30, 200],
    })
  }

  const activeCount = 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0) +
    (filters.lengthRange[0] > 30 || filters.lengthRange[1] < 200 ? 1 : 0)

  return (
    <div className="bg-[#0A0A0A] border-b border-[#ECAC36]/20 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {/* Hourly Rate */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap" aria-label="Filter by hourly rate">
                <DollarSign className="mr-1 h-4 w-4" />
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}/hr
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Hourly Rate</h4>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => onFiltersChange({ priceRange: value })}
                  max={10000}
                  min={0}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-[#B5B5B5]">
                  <span>{formatPrice(filters.priceRange[0])}</span>
                  <span>{formatPrice(filters.priceRange[1])}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Yacht Length */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap" aria-label="Filter by yacht length">
                <Anchor className="mr-1 h-4 w-4" />
                {filters.lengthRange[0]}ft - {filters.lengthRange[1]}ft
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Yacht Length</h4>
                <Slider
                  value={filters.lengthRange}
                  onValueChange={(value) => onFiltersChange({ lengthRange: value })}
                  max={200}
                  min={30}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-[#B5B5B5]">
                  <span>{filters.lengthRange[0]}ft</span>
                  <span>{filters.lengthRange[1]}ft</span>
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
