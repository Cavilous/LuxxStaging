"use client"

import { useState, useMemo } from "react"
import { YachtsFilters } from "@/components/yachts-filters"
import { InventoryCard } from "@/components/inventory-card"
import { LoadMoreGrid } from "@/components/load-more-grid"

const INITIAL_ITEMS = 12
const LOAD_MORE_COUNT = 8

function SkeletonCard() {
  return (
    <div className="bg-[#0A0A0A] rounded-lg overflow-hidden">
      <div className="aspect-[3/2] bg-gray-800 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-800 rounded animate-pulse" />
        <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
        <div className="h-6 bg-gray-800 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  )
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="col-span-full relative overflow-hidden">
      <div className="cut-corner bg-gradient-to-br from-black/40 via-black/60 to-black/40 border border-[#ECAC36]/20 p-12 md:p-16 text-center backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-heading font-bold text-white mb-3">
            No Yachts Match Your Filters
          </h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Try adjusting your search criteria to discover more options from our exclusive fleet.
          </p>
          <button
            onClick={onClearFilters}
            className="cut-corner-button bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black px-8 py-3 font-semibold shadow-luxury-hover transition-all duration-300"
          >
            Clear All Filters
          </button>
        </div>
        <div
          className="absolute top-0 right-0 w-32 h-32 bg-[#ECAC36]/5 blur-3xl"
          style={{ transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 bg-[#ECAC36]/5 blur-3xl"
          style={{ transform: "translate(-30%, 30%)" }}
        />
      </div>
    </div>
  )
}

interface Yacht {
  id: string
  slug: string | null
  type: "yacht"
  title: string
  subtitle: string
  price: string
  priceUnit: string
  pricePerHour?: number
  pricePer4Hr?: number
  pricePer6Hr?: number
  pricePer8Hr?: number
  image: string
  lqImage?: string | null
  focalPoint?: string
  flipHorizontal?: boolean
  flipVertical?: boolean
  specs: string[]
  badges: string[]
  length?: number
  guests?: number
}

interface YachtsPageContentProps {
  initialYachts: Yacht[]
}

export function YachtsPageContent({ initialYachts }: YachtsPageContentProps) {
  const [sort, setSort] = useState("price_desc")
  const [filters, setFilters] = useState({
    priceRange: [0, 10000] as [number, number],
    lengthRange: [30, 200] as [number, number],
  })

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }))
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      lengthRange: [30, 200],
    })
    setSort("price_desc")
  }

  const filteredAndSortedYachts = useMemo(() => {
    const filtered = initialYachts.filter((yacht) => {
      const price = Number.parseInt(yacht.price.replace(/[$,]/g, ""))
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false

      if (yacht.length) {
        if (yacht.length < filters.lengthRange[0] || yacht.length > filters.lengthRange[1]) return false
      }

      return true
    })

    switch (sort) {
      case "price_asc":
        return filtered.sort(
          (a, b) => Number.parseInt(a.price.replace(/[$,]/g, "")) - Number.parseInt(b.price.replace(/[$,]/g, ""))
        )
      case "price_desc":
        return filtered.sort(
          (a, b) => Number.parseInt(b.price.replace(/[$,]/g, "")) - Number.parseInt(a.price.replace(/[$,]/g, ""))
        )
      case "featured":
      default:
        return filtered.sort(
          (a, b) => (b.badges.includes("Featured") ? 1 : 0) - (a.badges.includes("Featured") ? 1 : 0)
        )
    }
  }, [initialYachts, filters, sort])

  return (
    <>
      <YachtsFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <div className="section-divider-angled bg-[#ECAC36] mx-4"></div>

      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[#B5B5B5] text-sm">
            {filteredAndSortedYachts.length} yachts available
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36] text-white px-4 py-2 text-sm focus-angular"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <LoadMoreGrid
          items={filteredAndSortedYachts}
          initialCount={INITIAL_ITEMS}
          incrementCount={LOAD_MORE_COUNT}
          renderItem={(yacht, index) => (
            <InventoryCard
              key={yacht.id}
              id={yacht.id}
              slug={yacht.slug || undefined}
              type={yacht.type}
              title={yacht.title}
              subtitle={yacht.subtitle}
              price={yacht.price}
              priceUnit={yacht.priceUnit}
              image={yacht.image}
              lqImage={yacht.lqImage}
              focalPoint={yacht.focalPoint}
              flipHorizontal={yacht.flipHorizontal}
              flipVertical={yacht.flipVertical}
              specs={yacht.specs}
              badges={yacht.badges}
              priority={index < 4}
              yachtPricing={yacht.pricePer4Hr && yacht.pricePer6Hr && yacht.pricePer8Hr ? {
                "4h": yacht.pricePer4Hr,
                "6h": yacht.pricePer6Hr,
                "8h": yacht.pricePer8Hr
              } : undefined}
            />
          )}
          renderSkeleton={() => <SkeletonCard />}
          emptyState={<EmptyState onClearFilters={clearAllFilters} />}
        />
      </main>
    </>
  )
}
