"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone, ChevronDown, Home, Car, Anchor, Building, Briefcase, Instagram } from "lucide-react"
import { SOCIAL_LINKS } from "@/lib/social-config"
import { TrackedPhoneLink } from "@/components/tracked-phone-link"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 20
    setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev))
  }, [])

  useEffect(() => {
    let ticking = false
    let rafId: number | null = null
    
    const throttledHandleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [handleScroll])

  const brandItems = [
    { name: "Aston Martin", href: "/miami/aston-martin-rental" },
    { name: "Audi", href: "/miami/audi-rental" },
    { name: "Bentley", href: "/miami/bentley-rental" },
    { name: "BMW", href: "/miami/bmw-rental" },
    { name: "Cadillac", href: "/miami/cadillac-rental" },
    { name: "Ferrari", href: "/miami/ferrari-rental" },
    { name: "Lamborghini", href: "/miami/lamborghini-rental" },
    { name: "Land Rover", href: "/miami/land-rover-rental" },
    { name: "Maserati", href: "/miami/maserati-rental" },
    { name: "McLaren", href: "/miami/mclaren-rental" },
    { name: "Mercedes", href: "/miami/mercedes-rental" },
    { name: "Porsche", href: "/miami/porsche-rental" },
    { name: "Rolls-Royce", href: "/miami/rolls-royce-rental" },
    { name: "Tesla", href: "/miami/tesla-rental" },
  ]

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { 
      name: "Exotic Cars", 
      href: "/cars", 
      icon: Car,
      hasSubmenu: true,
      submenuType: "brands" as const,
      brands: brandItems,
    },
    { name: "Yachts", href: "/yachts", icon: Anchor },
    { name: "Villas", href: "/houses", icon: Building },
    {
      name: "Services",
      href: "/tours/cars",
      icon: Briefcase,
      hasSubmenu: true,
      submenuType: "services" as const,
      services: [
        { name: "Car Tours (Ride-Along)", href: "/tours/cars" },
        { name: "Vehicles for Sale", href: "/buy-sell" },
        { name: "Sell & Consign", href: "/sell-consign" },
        { name: "Vehicle Management", href: "/vehicle-management" },
        { name: "Customization & Repair", href: "/repair" },
        { name: "Miami Club Guide", href: "/miami-club-guide" },
        { name: "Restaurant Guide", href: "/miami-restaurant-guide" },
      ],
    },
  ]

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/98 backdrop-blur-md shadow-lg' 
          : 'bg-black/90 backdrop-blur-sm'
      }`} 
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo - Left */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-pic-logo-transparent-background%20%281%29-NsrnIlw2XUmCf9NaHqCqGNTdzkkgw9.png"
              alt="Luxx Miami"
              width={64}
              height={64}
              priority
              sizes="64px"
              className="h-12 lg:h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Right aligned */}
          <div className="hidden lg:flex items-center gap-1">
            <nav className="flex items-center">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="luxx-nav-hover flex items-center rounded-md border border-white/0 px-4 py-2 text-sm font-medium text-white/90 outline-none hover:border-[#ECAC36]/25 hover:bg-white/[0.04] hover:text-[#ECAC36] focus-visible:border-[#ECAC36]/35 focus-visible:text-[#ECAC36]"
                  >
                    {item.name}
                    {item.hasSubmenu && (
                      <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </Link>

                  {item.hasSubmenu && item.submenuType === "brands" && item.brands && (
                    <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-black/98 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                        <div className="p-3">
                          <Link
                            href="/cars"
                            className="luxx-nav-hover mb-2 block rounded-md border-b border-white/10 px-2 py-2 text-sm font-medium text-[#ECAC36] outline-none hover:bg-white/[0.04] hover:text-[#e6c766] focus-visible:text-[#e6c766]"
                          >
                            View All Cars
                          </Link>
                          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">By Brand</div>
                          <div className="grid grid-cols-2 gap-0.5">
                            {item.brands.map((brand) => (
                              <Link
                                key={brand.name}
                                href={brand.href}
                                className="luxx-nav-hover block rounded px-2 py-1.5 text-sm text-white/70 outline-none hover:bg-white/5 hover:text-[#ECAC36] focus-visible:text-[#ECAC36]"
                              >
                                {brand.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.hasSubmenu && item.submenuType === "services" && item.services && (
                    <div className="absolute top-full right-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-black/98 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                        <div className="p-2">
                          {item.services.map((service) => (
                            <Link
                              key={service.name}
                              href={service.href}
                              className="luxx-nav-hover block rounded px-3 py-2.5 text-sm text-white/70 outline-none hover:bg-white/5 hover:text-[#ECAC36] focus-visible:text-[#ECAC36]"
                            >
                              {service.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Separator */}
            <div className="w-px h-6 bg-white/20 mx-3" />

            {/* Phone Number & Call CTA */}
            <TrackedPhoneLink 
              phoneNumber="+13056055899"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              suppressHydrationWarning
            >
              <span className="hidden xl:inline text-white/60">(305) 605-5899</span>
            </TrackedPhoneLink>
            
            <TrackedPhoneLink 
              phoneNumber="+13056055899"
              className="flex items-center gap-2 ml-2 px-5 py-2.5 bg-[#ECAC36] hover:bg-[#d49c2e] text-black font-semibold text-sm rounded transition-colors duration-200"
              suppressHydrationWarning
            >
              <Phone className="h-4 w-4" />
              <span>Call Now</span>
            </TrackedPhoneLink>

            {/* Social Icons */}
            <div className="hidden xl:flex items-center gap-2 ml-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/60 hover:text-[#ECAC36] transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/60 hover:text-[#ECAC36] transition-colors"
                aria-label="See our Google Reviews"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile: Phone + Menu */}
          <div className="flex items-center gap-3 lg:hidden">
            <TrackedPhoneLink 
              phoneNumber="+13056055899"
              className="flex items-center justify-center w-10 h-10 bg-[#ECAC36] hover:bg-[#d49c2e] text-black rounded transition-colors"
              ariaLabel="Call us"
              suppressHydrationWarning
            >
              <Phone className="h-5 w-5" />
            </TrackedPhoneLink>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 w-10 h-10" 
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black/98 backdrop-blur-md border-l border-white/10 w-full sm:w-full">
                <div className="flex flex-col mt-8 items-center">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.name} className="border-b border-white/10 w-full text-center">
                        {!item.hasSubmenu ? (
                          <Link
                            href={item.href}
                            className="flex items-center justify-center gap-3 text-white hover:text-[#ECAC36] py-4 px-2 transition-colors"
                            onClick={() => setIsOpen(false)}
                            suppressHydrationWarning
                          >
                            {Icon && <Icon className="h-5 w-5 text-[#ECAC36]/70" />}
                            <span className="font-medium text-lg">{item.name}</span>
                          </Link>
                        ) : (
                          <div className="py-4 px-2">
                            <Link 
                              href={item.href}
                              className="flex items-center justify-center gap-3 text-[#ECAC36] font-medium"
                              onClick={() => setIsOpen(false)}
                              suppressHydrationWarning
                            >
                              {Icon && <Icon className="h-5 w-5" />}
                              <span className="text-lg">{item.name}</span>
                            </Link>
                            {item.submenuType === "brands" && item.brands && (
                              <div className="mt-3 grid grid-cols-3 gap-2 max-w-md mx-auto">
                                {item.brands.map((brand) => (
                                  <Link
                                    key={brand.name}
                                    href={brand.href}
                                    className="text-sm text-white/60 hover:text-[#ECAC36] py-1.5 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {brand.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                            {item.submenuType === "services" && item.services && (
                              <div className="mt-3 space-y-1 max-w-md mx-auto">
                                {item.services.map((service) => (
                                  <Link
                                    key={service.name}
                                    href={service.href}
                                    className="block text-sm text-white/60 hover:text-[#ECAC36] py-1.5 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  
                  {/* Mobile CTA */}
                  <div className="mt-8 px-4 w-full max-w-sm">
                    <div className="text-center text-white/60 text-sm mb-3">Call us directly</div>
                    <Link 
                      href="tel:+13056055899"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-[#ECAC36] hover:bg-[#d49c2e] text-black font-semibold text-lg rounded transition-colors"
                      suppressHydrationWarning
                    >
                      <Phone className="h-5 w-5" />
                      <span>(305) 605-5899</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Subtle gold accent line on scroll */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ECAC36]/50 to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </header>
  )
}
