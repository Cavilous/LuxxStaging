"use client"

import { useState, useMemo } from "react"
import { CarsFilters } from "@/components/cars-filters"
import { InventoryCard } from "@/components/inventory-card"
import { LoadMoreGrid } from "@/components/load-more-grid"

const INITIAL_ITEMS = 12
const LOAD_MORE_COUNT = 8

function SkeletonCard() {
  return (
    <div className="bg-[#0A0A0A] cut-corner-card overflow-hidden">
      <div className="aspect-[3/2] skeleton-card"></div>
      <div className="p-4 space-y-2">
        <div className="h-5 skeleton-card cut-corner-button"></div>
        <div className="h-4 skeleton-card cut-corner-button w-3/4"></div>
        <div className="h-6 skeleton-card cut-corner-button w-1/2"></div>
        <div className="h-4 skeleton-card cut-corner-button"></div>
        <div className="h-10 skeleton-card cut-corner-button"></div>
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
            No Vehicles Match Your Filters
          </h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Try adjusting your search criteria to discover more options from our exclusive collection.
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

interface Car {
  id: string
  slug: string | null
  type: "car"
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
  brand: string
  bodyType: string
  seats: string
  transmission: string
  color: string
}

interface CarsPageContentProps {
  initialCars: Car[]
}

export function CarsPageContent({ initialCars }: CarsPageContentProps) {
  const [sort, setSort] = useState("price_desc")
  const [filters, setFilters] = useState({
    brands: [] as string[],
    bodyTypes: [] as string[],
    priceRange: [0, 5000] as [number, number],
  })

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }))
  }

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      bodyTypes: [],
      priceRange: [0, 5000],
    })
    setSort("price_desc")
  }

  const filteredAndSortedCars = useMemo(() => {
    const filtered = initialCars.filter((car) => {
      if (filters.brands.length && !filters.brands.includes(car.brand)) return false
      if (filters.bodyTypes.length && !filters.bodyTypes.includes(car.bodyType)) return false

      const price = Number.parseInt(car.price.replace(/[$,]/g, ""))
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false

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
  }, [initialCars, filters, sort])

  return (
    <>
      <CarsFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <div className="section-divider-angled bg-[#ECAC36] mx-4"></div>

      <section className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[#B5B5B5] text-sm">
            {filteredAndSortedCars.length} cars available
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
          items={filteredAndSortedCars}
          initialCount={INITIAL_ITEMS}
          incrementCount={LOAD_MORE_COUNT}
          renderItem={(car, index) => (
            <InventoryCard
              key={car.id}
              id={car.id}
              slug={car.slug || undefined}
              type={car.type}
              title={car.title}
              subtitle={car.subtitle}
              price={car.price}
              priceUnit={car.priceUnit}
              image={car.image}
              lqImage={car.lqImage}
              focalPoint={car.focalPoint}
              flipHorizontal={car.flipHorizontal}
              flipVertical={car.flipVertical}
              specs={car.specs}
              badges={car.badges}
              priority={index < 4}
            />
          )}
          renderSkeleton={() => <SkeletonCard />}
          emptyState={<EmptyState onClearFilters={clearAllFilters} />}
        />
      </section>
    </>
  )
}