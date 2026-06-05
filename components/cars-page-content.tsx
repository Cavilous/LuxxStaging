"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { CarsFilters } from "@/components/cars-filters"
import { InventoryCard } from "@/components/inventory-card"
import { LoadMoreGrid } from "@/components/load-more-grid"
import {
  buildFleetBrandOptions,
  canonicalizeFleetBrand,
  getDailyRateFilterMax,
  normalizeFilterKey,
  parseDailyRate,
} from "@/lib/car-filter-utils"

const INITIAL_ITEMS = 12
const LOAD_MORE_COUNT = 8
const BODY_TYPE_ORDER = ["Supercar", "Convertible", "SUV", "Sedan", "Coupe"]

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
  const priceValues = useMemo(() => initialCars.map((car) => parseDailyRate(car.price)), [initialCars])

  const priceMax = useMemo(() => {
    return getDailyRateFilterMax(priceValues)
  }, [priceValues])

  const hasPricesAboveMax = useMemo(() => {
    return priceValues.some((price) => price > priceMax)
  }, [priceMax, priceValues])

  const availableBrandOptions = useMemo(() => {
    return buildFleetBrandOptions(initialCars)
  }, [initialCars])

  const availableBrands = useMemo(() => availableBrandOptions.map((brand) => brand.name), [availableBrandOptions])

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
  const previousPriceMaxRef = useRef(priceMax)

  useEffect(() => {
    const previousPriceMax = previousPriceMaxRef.current

    setFilters((prevFilters) => {
      const validBrands = prevFilters.brands.filter((brand) => availableBrands.includes(brand))
      const validBodyTypes = prevFilters.bodyTypes.filter((bodyType) => availableBodyTypes.includes(bodyType))
      const nextUpper =
        prevFilters.priceRange[1] >= previousPriceMax
          ? priceMax
          : Math.max(0, Math.min(prevFilters.priceRange[1], priceMax))
      const nextPriceRange: [number, number] = [
        Math.max(0, Math.min(prevFilters.priceRange[0], nextUpper)),
        nextUpper,
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

    previousPriceMaxRef.current = priceMax
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
      const carBrand = normalizeFilterKey(canonicalizeFleetBrand(car.brand, { allowUnknown: true }))
      const carBodyType = normalizeFilterKey(car.bodyType)

      if (
        deferredFilters.brands.length &&
        !deferredFilters.brands.some(
          (brand) => carBrand === normalizeFilterKey(canonicalizeFleetBrand(brand, { allowUnknown: true })),
        )
      ) {
        return false
      }

      if (
        deferredFilters.bodyTypes.length &&
        !deferredFilters.bodyTypes.some((bodyType) => carBodyType === normalizeFilterKey(bodyType))
      ) {
        return false
      }

      const price = parseDailyRate(car.price)
      const upperRangeIsCeiling = deferredFilters.priceRange[1] >= priceMax
      if (price < deferredFilters.priceRange[0]) return false
      if (!upperRangeIsCeiling && price > deferredFilters.priceRange[1]) return false

      return true
    })

    switch (sort) {
      case "price_asc":
        return filtered.sort(
          (a, b) => parseDailyRate(a.price) - parseDailyRate(b.price)
        )
      case "price_desc":
        return filtered.sort(
          (a, b) => parseDailyRate(b.price) - parseDailyRate(a.price)
        )
      case "featured":
      default:
        return filtered.sort(
          (a, b) => (b.badges.includes("Featured") ? 1 : 0) - (a.badges.includes("Featured") ? 1 : 0)
        )
    }
  }, [initialCars, deferredFilters, priceMax, sort])

  return (
    <>
      <CarsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableBrandOptions={availableBrandOptions}
        availableBodyTypes={availableBodyTypes}
        priceMax={priceMax}
        hasPricesAboveMax={hasPricesAboveMax}
      />

      <div className="section-divider-angled bg-[#ECAC36] mx-4"></div>

      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 flex flex-col gap-3 border-b border-white/[0.07] pb-4 transition-opacity duration-200 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-[#B5B5B5]">
            {filteredAndSortedCars.length} cars available
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 min-w-[12rem] cut-corner-button border border-[#ECAC36]/35 bg-[#080808] px-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_24px_rgba(0,0,0,0.22)] focus-angular"
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
            gridClassName="fleet-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
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
