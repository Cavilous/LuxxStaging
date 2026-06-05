"use client"

import { useDeferredValue, useEffect, useMemo, useState } from "react"
import { CarsFilters } from "@/components/cars-filters"
import { InventoryCard } from "@/components/inventory-card"
import { LoadMoreGrid } from "@/components/load-more-grid"

const INITIAL_ITEMS = 12
const LOAD_MORE_COUNT = 8
const BRAND_ORDER = ["Ferrari", "Lamborghini", "Rolls-Royce", "McLaren", "Porsche", "Bentley", "Mercedes", "BMW", "Audi", "Land Rover", "Cadillac", "Maserati", "Chevrolet", "Ford", "Tesla"]
const BODY_TYPE_ORDER = ["Supercar", "Convertible", "SUV", "Sedan", "Coupe"]
const DEMO_FILTER_BRAND_EXCLUSIONS = new Set(["bugatti", "koenigsegg", "pagani"])
const BRAND_ALIASES: Record<string, string> = {
  chevy: "Chevrolet",
  mclaren: "McLaren",
  mercedesamg: "Mercedes",
  mercedesbenz: "Mercedes",
  rollsroyce: "Rolls-Royce",
}

function normalizeFilterValue(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function canonicalizeBrand(brand: string): string {
  const trimmedBrand = brand.trim()
  if (!trimmedBrand) return ""

  return BRAND_ALIASES[normalizeFilterValue(trimmedBrand)] || trimmedBrand
}

function parsePrice(price: string): number {
  return Number.parseInt(price.replace(/[$,]/g, "")) || 0
}

function sortByPreferredOrder(values: string[], preferredOrder: string[]): string[] {
  return [...values].sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a)
    const bIndex = preferredOrder.indexOf(b)

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.localeCompare(b)
  })
}

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
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ECAC36]/40 to-transparent" />
        <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
  const priceMax = useMemo(() => {
    const highestPrice = initialCars.reduce((max, car) => Math.max(max, parsePrice(car.price)), 0)
    return Math.max(1000, Math.ceil(highestPrice / 100) * 100)
  }, [initialCars])

  const availableBrands = useMemo(() => {
    const brands = Array.from(
      new Set(
        initialCars
          .map((car) => canonicalizeBrand(car.brand))
          .filter((brand) => brand && !DEMO_FILTER_BRAND_EXCLUSIONS.has(normalizeFilterValue(brand))),
      ),
    )
    return sortByPreferredOrder(brands, BRAND_ORDER)
  }, [initialCars])

  const availableBodyTypes = useMemo(() => {
    const bodyTypes = Array.from(new Set(initialCars.map((car) => car.bodyType).filter(Boolean)))
    return sortByPreferredOrder(bodyTypes, BODY_TYPE_ORDER)
  }, [initialCars])

  const [sort, setSort] = useState("price_desc")
  const [filters, setFilters] = useState({
    brands: [] as string[],
    bodyTypes: [] as string[],
    priceRange: [0, priceMax] as [number, number],
  })

  useEffect(() => {
    setFilters((prevFilters) => {
      const validBrands = prevFilters.brands.filter((brand) => availableBrands.includes(brand))
      const validBodyTypes = prevFilters.bodyTypes.filter((bodyType) => availableBodyTypes.includes(bodyType))
      const nextPriceRange: [number, number] = [
        Math.max(0, Math.min(prevFilters.priceRange[0], priceMax)),
        Math.max(0, Math.min(prevFilters.priceRange[1], priceMax)),
      ]

      if (
        validBrands.length === prevFilters.brands.length &&
        validBodyTypes.length === prevFilters.bodyTypes.length &&
        nextPriceRange[0] === prevFilters.priceRange[0] &&
        nextPriceRange[1] === prevFilters.priceRange[1]
      ) {
        return prevFilters
      }

      return {
        brands: validBrands,
        bodyTypes: validBodyTypes,
        priceRange: nextPriceRange,
      }
    })
  }, [availableBrands, availableBodyTypes, priceMax])

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }))
  }

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      bodyTypes: [],
      priceRange: [0, priceMax],
    })
    setSort("price_desc")
  }

  const deferredFilters = useDeferredValue(filters)
  const isFilterTransitioning = deferredFilters !== filters

  const filteredAndSortedCars = useMemo(() => {
    const filtered = initialCars.filter((car) => {
      const carBrand = normalizeFilterValue(canonicalizeBrand(car.brand))
      const carBodyType = normalizeFilterValue(car.bodyType)

      if (
        deferredFilters.brands.length &&
        !deferredFilters.brands.some((brand) => carBrand === normalizeFilterValue(canonicalizeBrand(brand)))
      ) {
        return false
      }

      if (
        deferredFilters.bodyTypes.length &&
        !deferredFilters.bodyTypes.some((bodyType) => carBodyType === normalizeFilterValue(bodyType))
      ) {
        return false
      }

      const price = parsePrice(car.price)
      if (price < deferredFilters.priceRange[0] || price > deferredFilters.priceRange[1]) return false

      return true
    })

    switch (sort) {
      case "price_asc":
        return filtered.sort(
          (a, b) => parsePrice(a.price) - parsePrice(b.price)
        )
      case "price_desc":
        return filtered.sort(
          (a, b) => parsePrice(b.price) - parsePrice(a.price)
        )
      case "featured":
      default:
        return filtered.sort(
          (a, b) => (b.badges.includes("Featured") ? 1 : 0) - (a.badges.includes("Featured") ? 1 : 0)
        )
    }
  }, [initialCars, deferredFilters, sort])

  return (
    <>
      <CarsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableBrands={availableBrands}
        availableBodyTypes={availableBodyTypes}
        priceMax={priceMax}
      />

      <div className="section-divider-angled bg-[#ECAC36] mx-4"></div>

      <section className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between gap-3 transition-opacity duration-200">
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

        <div
          className={`transition-all duration-200 ease-out ${
            isFilterTransitioning ? "translate-y-1 opacity-80" : "translate-y-0 opacity-100"
          }`}
        >
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
                brand={car.brand}
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
        </div>
      </section>
    </>
  )
}
