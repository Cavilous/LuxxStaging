"use client"

import { VillaCard } from "./villa-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

interface VillaRowProps {
  title: string
  items: Array<{
    id: string
    title: string
    neighborhood: string
    price: string
    image: string
    bedrooms: number
    bathrooms: number
    guests: number
    features: string[]
    badges?: string[]
    featured?: boolean
  }>
}

export function VillaRow({ title, items }: VillaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold text-white">{title}</h2>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="border-gold/30 text-gold hover:bg-gold hover:text-black"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="border-gold/30 text-gold hover:bg-gold hover:text-black"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <VillaCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
