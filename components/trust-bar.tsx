"use client"

import { useState } from "react"
import { Shield, Clock, MapPin, Star, Users, Award } from "lucide-react"

export function TrustBar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const trustItems = [
    {
      icon: Clock,
      title: "24/7 Operations",
      description: "Always available",
    },
    {
      icon: MapPin,
      title: "Brickell Base",
      description: "Prime location",
    },
    {
      icon: Shield,
      title: "Delivery Service",
      description: "To your door",
    },
    {
      icon: Users,
      title: "Celebrity Trusted",
      description: "A-list approved",
    },
    {
      icon: Star,
      title: "5-Star Rated",
      description: "500+ reviews",
    },
    {
      icon: Award,
      title: "Pro Media",
      description: "Photo & video",
    },
  ]

  return (
    <section className="py-20 bg-black/60 backdrop-blur-sm relative">
      {/* Section divider */}
      <div className="section-divider -mt-16" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="text-center group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Diagonal tile with 6° top edge */}
              <div
                className="relative bg-black/80 backdrop-blur-sm border border-[#ECAC36]/30 p-6 mb-4 h-44 flex flex-col items-center justify-center shadow-luxury-rest group-hover:shadow-luxury-hover transition-all duration-[320ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                  clipPath: "polygon(0 6%, 100% 0, 100% 100%, 0 100%)",
                }}
              >
                {/* Icon with angular movement on hover */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#ECAC36]/20 to-[#e6c766]/20 cut-corner mb-3 transition-transform duration-[320ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  style={{
                    transform: hoveredIndex === index ? "translate(4px, -2px)" : "translate(0, 0)",
                  }}
                >
                  <item.icon className="h-6 w-6 text-[#ECAC36]" />
                </div>

                <h3 className="font-heading font-bold text-white mb-1 text-sm tracking-tight">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.description}</p>

                {/* Subtle glow on hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#ECAC36]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[320ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  style={{
                    clipPath: "polygon(0 6%, 100% 0, 100% 100%, 0 100%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
