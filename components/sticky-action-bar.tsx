"use client"

import { useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Calendar } from "lucide-react"
import { BookingModalEnhanced } from "./booking-modal-enhanced"

interface StickyActionBarProps {
  item: {
    id?: string
    type: "car" | "yacht" | "villa" | "jet"
    title: string
    price: string
    priceUnit: string
    image?: string
    pricing?: any
    pricePer4Hr?: number
    pricePer6Hr?: number
    pricePer8Hr?: number
    pricePerDay?: number
    pricePerNight?: number
  }
  showPriceBreakdown?: boolean
}

export function StickyActionBar({ item, showPriceBreakdown = false }: StickyActionBarProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const pathname = usePathname()

  const handleCall = useCallback(() => {
    fetch('/api/analytics/track-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: '+13056055899',
        pageUrl: window.location.href,
        pageRoute: pathname,
      }),
      keepalive: true,
    }).catch(() => {})
    window.location.href = "tel:+13056055899"
  }, [pathname])

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in the ${item.title}. Can you provide more information?`
    window.open(`https://wa.me/13056055899?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/98 backdrop-blur-md border-t border-[#ECAC36]/30 p-3 md:p-4 shadow-[0_-4px_20px_rgba(212,175,55,0.15)]">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-3">
            {/* Price Summary - Always Visible */}
            <div className="flex-shrink-0">
              <div className="text-xl md:text-2xl font-heading font-black text-[#ECAC36]">
                {item.price}
                <span className="text-xs md:text-sm text-white/90 ml-1">/ {item.priceUnit}</span>
              </div>
              {showPriceBreakdown && <p className="hidden md:block text-xs text-gray-300">Plus taxes and fees • Deposit required</p>}
            </div>

            {/* Action Buttons - Primary CTA separated from secondary */}
            <div className="flex items-center gap-3 flex-1 md:flex-initial justify-end">
              {/* Primary CTA - Reserve */}
              <Button
                onClick={() => setIsBookingOpen(true)}
                className="min-h-[52px] px-6 md:px-8 flex-1 md:flex-initial bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-bold text-base shadow-lg shadow-[#ECAC36]/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <Calendar className="h-5 w-5 mr-2" />
                <span>Reserve Now</span>
              </Button>
              
              {/* Secondary CTAs - Contact options */}
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/20">
                <Button
                  onClick={handleCall}
                  variant="ghost"
                  className="min-h-[44px] px-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2 text-sm">Call</span>
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  variant="ghost"
                  className="min-h-[44px] px-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2 text-sm">WhatsApp</span>
                </Button>
              </div>
              
              {/* Mobile contact buttons */}
              <div className="flex sm:hidden gap-1">
                <Button
                  onClick={handleCall}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModalEnhanced isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} item={item} />
    </>
  )
}
