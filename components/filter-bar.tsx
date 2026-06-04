"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronDown, Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

interface FilterBarProps {
  category: "cars" | "yachts" | "villas" | "jets"
  onFiltersChange?: (filters: any) => void
}

export function FilterBar({ category, onFiltersChange }: FilterBarProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [selectedSeats, setSelectedSeats] = useState("")
  const [selectedTransmission, setSelectedTransmission] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [selectedBedrooms, setSelectedBedrooms] = useState("")
  const [selectedGuestCount, setSelectedGuestCount] = useState("")
  const [yachtLengthRange, setYachtLengthRange] = useState([30, 200])

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 120 // Approximate hero strip height
      setIsSticky(window.scrollY > heroHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const brands = {
    cars: ["Ferrari", "Lamborghini", "Rolls-Royce", "McLaren", "Mercedes", "Porsche", "Cadillac", "Tesla", "Chevrolet"],
    yachts: ["Azimut", "Pershing", "Princess", "Ferretti", "Leopard", "Wally"],
    villas: ["Luxury Estates", "Waterfront", "Modern", "Classic"],
    jets: ["Gulfstream", "Bombardier", "Cessna", "Embraer"],
  }

  const bodyTypes = {
    cars: ["Coupe", "Convertible", "SUV", "Sedan", "Supercar"],
    yachts: ["Motor Yacht", "Flybridge", "Sport Yacht", "Catamaran"],
    villas: ["Waterfront", "Penthouse", "Estate", "Modern"],
    jets: ["Light", "Midsize", "Super-Mid", "Heavy"],
  }

  const transmissionOptions = ["Auto", "Manual", "Electric"]

  const colors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#DC2626" },
    { name: "Blue", value: "#2563EB" },
    { name: "Green", value: "#16A34A" },
    { name: "Yellow", value: "#EAB308" },
    { name: "Orange", value: "#EA580C" },
    { name: "Silver", value: "#94A3B8" },
    { name: "Gray", value: "#6B7280" },
  ]

  const seatOptions = ["2", "4", "5", "8+"]
  const bedroomOptions = ["1", "2", "3", "4", "5", "6+"]
  const guestCountOptions = ["2", "4", "6", "8", "10", "12+"]

  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    setSelectedBrands(newBrands)
    applyFilters({ brands: newBrands })
  }

  const toggleBodyType = (type: string) => {
    const newTypes = selectedBodyTypes.includes(type)
      ? selectedBodyTypes.filter((t) => t !== type)
      : [...selectedBodyTypes, type]
    setSelectedBodyTypes(newTypes)
    applyFilters({ bodyTypes: newTypes })
  }

  const toggleColor = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color]
    setSelectedColors(newColors)
    applyFilters({ colors: newColors })
  }

  const applyFilters = (updates: any = {}) => {
    const filters = {
      brands: selectedBrands,
      bodyTypes: selectedBodyTypes,
      priceRange,
      seats: selectedSeats,
      transmission: selectedTransmission,
      colors: selectedColors,
      dateRange,
      bedrooms: selectedBedrooms,
      guestCount: selectedGuestCount,
      yachtLengthRange,
      ...updates,
    }
    onFiltersChange?.(filters)
  }

  const clearAllFilters = () => {
    setSelectedBrands([])
    setSelectedBodyTypes([])
    setPriceRange([0, 3000])
    setSelectedSeats("")
    setSelectedTransmission("")
    setSelectedColors([])
    setDateRange({ start: "", end: "" })
    setSelectedBedrooms("")
    setSelectedGuestCount("")
    setYachtLengthRange([30, 200])
    onFiltersChange?.({
      brands: [],
      bodyTypes: [],
      priceRange: [0, 3000],
      seats: "",
      transmission: "",
      colors: [],
      dateRange: { start: "", end: "" },
      bedrooms: "",
      guestCount: "",
      yachtLengthRange: [30, 200],
    })
  }

  const activeFiltersCount =
    selectedBrands.length +
    selectedBodyTypes.length +
    selectedColors.length +
    (selectedSeats ? 1 : 0) +
    (selectedTransmission ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 3000 ? 1 : 0) +
    (dateRange.start || dateRange.end ? 1 : 0) +
    (selectedBedrooms ? 1 : 0) +
    (selectedGuestCount ? 1 : 0) +
    (yachtLengthRange[0] > 30 || yachtLengthRange[1] < 200 ? 1 : 0)

  const shouldShowFilter = (filterType: string) => {
    switch (category) {
      case "villas":
        return ["price", "bedrooms", "guestCount", "dates"].includes(filterType)
      case "yachts":
        return ["price", "yachtLength"].includes(filterType)
      case "cars":
      default:
        return ["brands", "bodyTypes", "price", "seats", "transmission", "colors", "dates"].includes(filterType)
    }
  }

  return (
    <div className={`bg-[#0A0A0A] border-b border-[#ECAC36]/20 sticky-filter ${isSticky ? "elevated" : ""}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {/* Brand Multi-select Dropdown - Only for cars */}
            {shouldShowFilter("brands") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap flex-shrink-0">
                    Brand {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Select Brands</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {brands[category].map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={brand}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => toggleBrand(brand)}
                            className="border-[#ECAC36]/50 data-[state=checked]:bg-[#ECAC36]"
                          />
                          <label htmlFor={brand} className="text-sm text-white cursor-pointer">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Body Type Chips - Only for cars */}
            {shouldShowFilter("bodyTypes") && (
              <div className="flex gap-2">
                {bodyTypes[category].map((type) => (
                  <Button
                    key={type}
                    onClick={() => toggleBodyType(type)}
                    className={`cut-corner-button whitespace-nowrap flex-shrink-0 ${
                      selectedBodyTypes.includes(type)
                        ? "bg-[#ECAC36] text-black hover:bg-[#ECAC36]/90"
                        : "bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36]"
                    }`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            )}

            {/* Price Range Slider */}
            {shouldShowFilter("price") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap flex-shrink-0">
                    ${priceRange[0]} - ${priceRange[1]}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">
                      {category === "villas" ? "Nightly Rate" : "Price Range"} (per day)
                    </h4>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => {
                        setPriceRange(value)
                        applyFilters({ priceRange: value })
                      }}
                      max={3000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-[#B5B5B5]">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Yacht Length Range Slider - Only for yachts */}
            {shouldShowFilter("yachtLength") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap flex-shrink-0">
                    {yachtLengthRange[0]}ft - {yachtLengthRange[1]}ft
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Yacht Length</h4>
                    <Slider
                      value={yachtLengthRange}
                      onValueChange={(value) => {
                        setYachtLengthRange(value)
                        applyFilters({ yachtLengthRange: value })
                      }}
                      max={200}
                      min={30}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-[#B5B5B5]">
                      <span>{yachtLengthRange[0]}ft</span>
                      <span>{yachtLengthRange[1]}ft</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Bedrooms Dropdown - Only for villas */}
            {shouldShowFilter("bedrooms") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap flex-shrink-0">
                    Bedrooms {selectedBedrooms && `(${selectedBedrooms})`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Number of Bedrooms</h4>
                    {bedroomOptions.map((bedrooms) => (
                      <button
                        key={bedrooms}
                        onClick={() => {
                          const newBedrooms = selectedBedrooms === bedrooms ? "" : bedrooms
                          setSelectedBedrooms(newBedrooms)
                          applyFilters({ bedrooms: newBedrooms })
                        }}
                        className={`w-full text-left px-3 py-2 text-sm cut-corner-button ${
                          selectedBedrooms === bedrooms ? "bg-[#ECAC36] text-black" : "text-white hover:bg-[#ECAC36]/10"
                        }`}
                      >
                        {bedrooms} bedrooms
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Guest Count Dropdown - Only for villas */}
            {shouldShowFilter("guestCount") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap flex-shrink-0">
                    Guests {selectedGuestCount && `(${selectedGuestCount})`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Guest Count</h4>
                    {guestCountOptions.map((guests) => (
                      <button
                        key={guests}
                        onClick={() => {
                          const newGuestCount = selectedGuestCount === guests ? "" : guests
                          setSelectedGuestCount(newGuestCount)
                          applyFilters({ guestCount: newGuestCount })
                        }}
                        className={`w-full text-left px-3 py-2 text-sm cut-corner-button ${
                          selectedGuestCount === guests ? "bg-[#ECAC36] text-black" : "text-white hover:bg-[#ECAC36]/10"
                        }`}
                      >
                        {guests} guests
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Seats Dropdown - Only for cars */}
            {shouldShowFilter("seats") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap flex-shrink-0">
                    Seats {selectedSeats && `(${selectedSeats})`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Number of Seats</h4>
                    {seatOptions.map((seats) => (
                      <button
                        key={seats}
                        onClick={() => {
                          const newSeats = selectedSeats === seats ? "" : seats
                          setSelectedSeats(newSeats)
                          applyFilters({ seats: newSeats })
                        }}
                        className={`w-full text-left px-3 py-2 text-sm cut-corner-button ${
                          selectedSeats === seats ? "bg-[#ECAC36] text-black" : "text-white hover:bg-[#ECAC36]/10"
                        }`}
                      >
                        {seats} seats
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Transmission Dropdown - Only for cars */}
            {shouldShowFilter("transmission") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap flex-shrink-0">
                    Transmission {selectedTransmission && `(${selectedTransmission})`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Transmission</h4>
                    {transmissionOptions.map((transmission) => (
                      <button
                        key={transmission}
                        onClick={() => {
                          const newTransmission = selectedTransmission === transmission ? "" : transmission
                          setSelectedTransmission(newTransmission)
                          applyFilters({ transmission: newTransmission })
                        }}
                        className={`w-full text-left px-3 py-2 text-sm cut-corner-button ${
                          selectedTransmission === transmission
                            ? "bg-[#ECAC36] text-black"
                            : "text-white hover:bg-[#ECAC36]/10"
                        }`}
                      >
                        {transmission}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Color Chips - Only for cars */}
            {shouldShowFilter("colors") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap flex-shrink-0">
                    Color {selectedColors.length > 0 && `(${selectedColors.length})`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Select Colors</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => toggleColor(color.name)}
                          className={`flex items-center space-x-2 p-2 cut-corner-button ${
                            selectedColors.includes(color.name)
                              ? "border-[#ECAC36] bg-[#ECAC36]/20"
                              : "border-[#ECAC36]/30 hover:border-[#ECAC36]"
                          }`}
                        >
                          <div
                            className="w-4 h-4 cut-corner-button border border-gray-300"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-xs text-white">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Dates Picker - For cars and villas */}
            {shouldShowFilter("dates") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cut-corner-button bg-[#0A0A0A] border border-[#ECAC36]/30 text-white hover:border-[#ECAC36] whitespace-nowrap flex-shrink-0">
                    <Calendar className="mr-2 h-4 w-4" />
                    Dates {(dateRange.start || dateRange.end) && "(Selected)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-[#0A0A0A] border-[#ECAC36]/30 cut-corner-card">
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Select Dates</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-[#B5B5B5]">Start Date</label>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => {
                            const newRange = { ...dateRange, start: e.target.value }
                            setDateRange(newRange)
                            applyFilters({ dateRange: newRange })
                          }}
                          className="w-full mt-1 px-3 py-2 bg-[#0A0A0A] border border-[#ECAC36]/30 text-white cut-corner-button focus-angular"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-[#B5B5B5]">End Date</label>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => {
                            const newRange = { ...dateRange, end: e.target.value }
                            setDateRange(newRange)
                            applyFilters({ dateRange: newRange })
                          }}
                          className="w-full mt-1 px-3 py-2 bg-[#0A0A0A] border border-[#ECAC36]/30 text-white cut-corner-button focus-angular"
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-[#ECAC36] hover:text-[#ECAC36]/80 hover:bg-[#ECAC36]/10 cut-corner-button"
            >
              Clear All
            </Button>
            {selectedBrands.map((brand) => (
              <Badge key={brand} className="badge-gold cut-corner-button">
                {brand}
                <button onClick={() => toggleBrand(brand)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedBodyTypes.map((type) => (
              <Badge key={type} className="badge-gold cut-corner-button">
                {type}
                <button onClick={() => toggleBodyType(type)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedColors.map((color) => (
              <Badge key={color} className="badge-gold cut-corner-button">
                {color}
                <button onClick={() => toggleColor(color)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedSeats && (
              <Badge className="badge-gold cut-corner-button">
                {selectedSeats} seats
                <button
                  onClick={() => {
                    setSelectedSeats("")
                    applyFilters({ seats: "" })
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedTransmission && (
              <Badge className="badge-gold cut-corner-button">
                {selectedTransmission}
                <button
                  onClick={() => {
                    setSelectedTransmission("")
                    applyFilters({ transmission: "" })
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedBedrooms && (
              <Badge className="badge-gold cut-corner-button">
                {selectedBedrooms} bedrooms
                <button
                  onClick={() => {
                    setSelectedBedrooms("")
                    applyFilters({ bedrooms: "" })
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedGuestCount && (
              <Badge className="badge-gold cut-corner-button">
                {selectedGuestCount} guests
                <button
                  onClick={() => {
                    setSelectedGuestCount("")
                    applyFilters({ guestCount: "" })
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 3000) && (
              <Badge className="badge-gold cut-corner-button">
                ${priceRange[0]} - ${priceRange[1]}
                <button
                  onClick={() => {
                    setPriceRange([0, 3000])
                    applyFilters({ priceRange: [0, 3000] })
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(yachtLengthRange[0] > 30 || yachtLengthRange[1] < 200) && (
              <Badge className="badge-gold cut-corner-button">
                {yachtLengthRange[0]}ft - {yachtLengthRange[1]}ft
                <button
                  onClick={() => {
                    setYachtLengthRange([30, 200])
                    applyFilters({ yachtLengthRange: [30, 200] })
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(dateRange.start || dateRange.end) && (
              <Badge className="badge-gold cut-corner-button">
                {dateRange.start} - {dateRange.end}
                <button
                  onClick={() => {
                    setDateRange({ start: "", end: "" })
                    applyFilters({ dateRange: { start: "", end: "" } })
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
