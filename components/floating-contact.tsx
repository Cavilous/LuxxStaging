"use client"

import { useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { Phone, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleWhatsApp = () => {
    window.open("https://wa.me/13056055899?text=Hi, I'm interested in your luxury rentals", "_blank")
  }

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

  return (
    <>
      {/* Main floating button - responsive positioning with safe area */}
      <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 pb-safe">
        {isOpen && (
          <div className="mb-4 space-y-3 animate-fade-in">
            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsApp}
              aria-label="Contact us on WhatsApp"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 md:px-5 rounded-full shadow-luxury-hover transition-all duration-300 cut-corner group whitespace-nowrap min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm pr-2">WhatsApp</span>
            </button>

            {/* Call Button */}
            <button
              onClick={handleCall}
              aria-label="Call us now"
              className="flex items-center gap-3 bg-[#ECAC36] hover:bg-[#B8941F] text-black px-4 py-3 md:px-5 rounded-full shadow-luxury-hover transition-all duration-300 cut-corner group whitespace-nowrap min-h-[48px]"
            >
              <Phone className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm pr-2">Call Us</span>
            </button>
          </div>
        )}

        {/* Toggle Button - responsive sizing */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="w-14 h-14 md:w-16 md:h-16 min-w-[56px] min-h-[56px] rounded-full bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black shadow-luxury-hover transition-all duration-300 border-2 border-black/20"
          aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <Phone className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
          )}
        </Button>
      </div>
    </>
  )
}
