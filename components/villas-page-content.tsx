"use client"

import { useState, useMemo } from "react"
import { VillasFilters } from "@/components/villas-filters"
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
            No Villas Match Your Filters
          </h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Try adjusting your search criteria to discover more luxury properties from our collection.
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

interface Villa {
  id: string
  slug: string | null
  type: "villa"
  title: string
  subtitle: string
  price: string
  priceUnit: string
  image: string
  lqImage?: string | null
  focalPoint?: string
  flipHorizontal?: boolean
  flipVertical?: boolean
  specs: string[]
  badges: string[]
  bedrooms?: number
  guests?: number
}

interface VillasPageContentProps {
  initialVillas: Villa[]
}

export function VillasPageContent({ initialVillas }: VillasPageContentProps) {
  const [sort, setSort] = useState("price_desc")
  const [filters, setFilters] = useState({
    priceRange: [0, 5000] as [number, number],
    bedrooms: "",
    guests: "",
  })

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }))
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      bedrooms: "",
      guests: "",
    })
    setSort("price_desc")
  }

  const filteredAndSortedVillas = useMemo(() => {
    const filtered = initialVillas.filter((villa) => {
      const price = Number.parseInt(villa.price.replace(/[$,]/g, "") || "0")
      if (price > 0 && (price < filters.priceRange[0] || price > filters.priceRange[1])) return false

      if (filters.bedrooms) {
        const beds = villa.bedrooms || 0
        if (filters.bedrooms === "6+") {
          if (beds < 6) return false
        } else {
          if (beds !== Number(filters.bedrooms)) return false
        }
      }

      if (filters.guests) {
        const guestCount = villa.guests || 0
        if (filters.guests === "12+") {
          if (guestCount < 12) return false
        } else {
          if (guestCount !== Number(filters.guests)) return false
        }
      }

      return true
    })

    switch (sort) {
      case "price_asc":
        return filtered.sort((a, b) => {
          const priceA = Number.parseInt(a.price.replace(/[$,]/g, "") || "0")
          const priceB = Number.parseInt(b.price.replace(/[$,]/g, "") || "0")
          return priceA - priceB
        })
      case "price_desc":
        return filtered.sort((a, b) => {
          const priceA = Number.parseInt(a.price.replace(/[$,]/g, "") || "0")
          const priceB = Number.parseInt(b.price.replace(/[$,]/g, "") || "0")
          return priceB - priceA
        })
      case "featured":
      default:
        return filtered.sort(
          (a, b) => (b.badges.includes("Featured") ? 1 : 0) - (a.badges.includes("Featured") ? 1 : 0)
        )
    }
  }, [initialVillas, filters, sort])

  return (
    <>
      <VillasFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <div className="section-divider-angled bg-[#ECAC36] mx-4"></div>

      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[#B5B5B5] text-sm">
            {filteredAndSortedVillas.length} villas available
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
          items={filteredAndSortedVillas}
          initialCount={INITIAL_ITEMS}
          incrementCount={LOAD_MORE_COUNT}
          renderItem={(villa, index) => (
            <InventoryCard
              key={villa.id}
              id={villa.id}
              slug={villa.slug || undefined}
              type={villa.type}
              title={villa.title}
              subtitle={villa.subtitle}
              price={villa.price}
              priceUnit={villa.priceUnit}
              image={villa.image}
              lqImage={villa.lqImage}
              focalPoint={villa.focalPoint}
              flipHorizontal={villa.flipHorizontal}
              flipVertical={villa.flipVertical}
              specs={villa.specs}
              badges={villa.badges}
              priority={index < 4}
            />
          )}
          renderSkeleton={() => <SkeletonCard />}
          emptyState={<EmptyState onClearFilters={clearAllFilters} />}
        />
      </main>
    </>
  )
}
