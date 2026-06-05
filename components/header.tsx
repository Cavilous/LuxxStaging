"use client"

import { useState, useEffect, useCallback, type CSSProperties, type PointerEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Menu, Phone, ChevronDown, Home, Car, Anchor, Building, Briefcase, Instagram, X } from "lucide-react"
import { SOCIAL_LINKS } from "@/lib/social-config"
import { TrackedPhoneLink } from "@/components/tracked-phone-link"
import { getFleetBrandLogoStyle } from "@/lib/brand-logo-utils"

const desktopMagneticQuery = "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

type HeaderStyleVars = CSSProperties & {
  "--luxx-brand-rgb"?: string
  "--brand-logo"?: string
  "--brand-glow-rgb"?: string
  "--luxx-mobile-delay"?: string
}

const brandAccentRgb: Record<string, string> = {
  "Aston Martin": "26, 111, 82",
  Audi: "190, 194, 201",
  Bentley: "187, 147, 70",
  BMW: "28, 105, 212",
  Cadillac: "191, 169, 105",
  Ferrari: "255, 40, 0",
  Lamborghini: "194, 162, 82",
  "Land Rover": "27, 112, 72",
  Maserati: "37, 85, 154",
  McLaren: "255, 135, 0",
  Mercedes: "198, 198, 198",
  Porsche: "213, 0, 28",
  "Rolls-Royce": "192, 192, 192",
  Tesla: "232, 33, 39",
}

const getBrandStyle = (brandName: string): HeaderStyleVars => {
  const logoVars = getFleetBrandLogoStyle(brandName) as HeaderStyleVars | null

  return {
    "--luxx-brand-rgb": logoVars?.["--brand-glow-rgb"] ?? brandAccentRgb[brandName] ?? "236, 172, 54",
    ...logoVars,
  }
}

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

  const handleMagneticPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !window.matchMedia(desktopMagneticQuery).matches) {
      return
    }

    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2

    target.style.setProperty("--luxx-menu-magnet-x", `${(x * 0.16).toFixed(2)}px`)
    target.style.setProperty("--luxx-menu-magnet-y", `${(y * 0.2).toFixed(2)}px`)
  }, [])

  const handleMagneticPointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--luxx-menu-magnet-x", "0px")
    event.currentTarget.style.setProperty("--luxx-menu-magnet-y", "0px")
  }, [])

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
          <Link
            href="/"
            className="luxx-header-brand luxx-header-magnetic relative flex flex-shrink-0 items-center overflow-hidden rounded-md outline-none focus-visible:ring-1 focus-visible:ring-[#ECAC36]/40"
            onPointerMove={handleMagneticPointerMove}
            onPointerLeave={handleMagneticPointerLeave}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-pic-logo-transparent-background%20%281%29-NsrnIlw2XUmCf9NaHqCqGNTdzkkgw9.png"
              alt="Luxx Miami"
              width={64}
              height={64}
              priority
              sizes="64px"
              className="luxx-header-brand-image relative z-10 h-12 w-auto lg:h-16"
            />
          </Link>

          {/* Desktop Navigation - Right aligned */}
          <div className="hidden lg:flex items-center gap-1">
            <nav className="flex items-center">
              {navItems.map((item) => (
                <div key={item.name} className="luxx-header-nav-group relative group">
                  <Link
                    href={item.href}
                    className="luxx-header-menu-link luxx-header-magnetic relative flex items-center overflow-hidden rounded-md border border-white/0 px-4 py-2 text-sm font-medium text-white/90 outline-none"
                    onPointerMove={handleMagneticPointerMove}
                    onPointerLeave={handleMagneticPointerLeave}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {item.hasSubmenu && (
                      <ChevronDown className="relative z-10 ml-1 h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                    )}
                  </Link>

                  {item.hasSubmenu && item.submenuType === "brands" && item.brands && (
                    <div className="invisible absolute left-0 top-full w-56 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none">
                      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/98 shadow-2xl shadow-black/60 ring-1 ring-[#ECAC36]/0 backdrop-blur-md transition-[border-color,box-shadow] duration-200 group-hover:border-[#ECAC36]/20 group-hover:shadow-[0_18px_55px_rgba(0,0,0,0.55),0_0_24px_rgba(236,172,54,0.10)] group-focus-within:border-[#ECAC36]/20">
                        <div className="p-3">
                          <Link
                            href="/cars"
                            className="luxx-header-submenu-link luxx-header-magnetic relative mb-2 block overflow-hidden rounded-md border border-white/0 border-b-white/10 px-2.5 py-2 text-sm font-medium text-[#ECAC36] outline-none"
                            onPointerMove={handleMagneticPointerMove}
                            onPointerLeave={handleMagneticPointerLeave}
                          >
                            View All Cars
                          </Link>
                          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">By Brand</div>
                          <div className="grid grid-cols-2 gap-1">
                            {item.brands.map((brand) => (
                              <Link
                                key={brand.name}
                                href={brand.href}
                                className="luxx-header-brand-link luxx-header-magnetic relative block overflow-hidden rounded-md border border-white/0 px-2.5 py-1.5 text-sm text-white/70 outline-none"
                                style={getBrandStyle(brand.name)}
                                onPointerMove={handleMagneticPointerMove}
                                onPointerLeave={handleMagneticPointerLeave}
                              >
                                <span className="relative z-10">{brand.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.hasSubmenu && item.submenuType === "services" && item.services && (
                    <div className="invisible absolute right-0 top-full w-64 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none">
                      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/98 shadow-2xl shadow-black/60 ring-1 ring-[#ECAC36]/0 backdrop-blur-md transition-[border-color,box-shadow] duration-200 group-hover:border-[#ECAC36]/20 group-hover:shadow-[0_18px_55px_rgba(0,0,0,0.55),0_0_24px_rgba(236,172,54,0.10)] group-focus-within:border-[#ECAC36]/20">
                        <div className="p-2">
                          {item.services.map((service) => (
                            <Link
                              key={service.name}
                              href={service.href}
                              className="luxx-header-submenu-link luxx-header-magnetic relative block overflow-hidden rounded-md border border-white/0 px-3 py-2.5 text-sm text-white/70 outline-none"
                              onPointerMove={handleMagneticPointerMove}
                              onPointerLeave={handleMagneticPointerLeave}
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
              className="flex h-12 w-12 items-center justify-center rounded bg-[#ECAC36] text-black transition-colors hover:bg-[#d49c2e]"
              ariaLabel="Call us"
              suppressHydrationWarning
            >
              <Phone className="h-5 w-5" />
            </TrackedPhoneLink>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="luxx-mobile-menu-trigger h-12 w-12 text-white hover:bg-white/10"
                aria-label="Open navigation menu"
                aria-controls="luxx-mobile-navigation"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
              <SheetContent side="right" className="luxx-mobile-sheet bg-black/98 backdrop-blur-md border-l border-white/10 w-full sm:w-full sm:max-w-full p-0 overflow-y-auto">
                <button
                  type="button"
                  className="luxx-mobile-sheet-close"
                  aria-label="Close navigation menu"
                  aria-controls="luxx-mobile-navigation"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
                <div id="luxx-mobile-navigation" className="luxx-mobile-menu flex min-h-full flex-col px-5 pb-7 pt-6">
                  <div className="luxx-mobile-menu-brand">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-pic-logo-transparent-background%20%281%29-NsrnIlw2XUmCf9NaHqCqGNTdzkkgw9.png"
                      alt="Luxx Miami"
                      width={58}
                      height={58}
                      sizes="58px"
                      className="h-12 w-auto"
                    />
                    <div className="luxx-mobile-menu-brand-copy">
                      <span>Luxx Miami</span>
                      <span>Luxury rentals</span>
                    </div>
                  </div>

                  <nav className="luxx-mobile-nav" aria-label="Mobile navigation">
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.name}
                        className="luxx-mobile-nav-section"
                        style={{ "--luxx-mobile-delay": `${95 + index * 58}ms` } as HeaderStyleVars}
                      >
                        {!item.hasSubmenu ? (
                          <Link
                            href={item.href}
                            className="luxx-mobile-nav-item"
                            onClick={() => setIsOpen(false)}
                            suppressHydrationWarning
                          >
                            <span className="luxx-mobile-nav-icon">{Icon && <Icon className="h-5 w-5" />}</span>
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <div className="luxx-mobile-nav-block">
                            <Link 
                              href={item.href}
                              className="luxx-mobile-nav-item luxx-mobile-nav-item--primary"
                              onClick={() => setIsOpen(false)}
                              suppressHydrationWarning
                            >
                              <span className="luxx-mobile-nav-icon">{Icon && <Icon className="h-5 w-5" />}</span>
                              <span>{item.name}</span>
                            </Link>
                            {item.submenuType === "brands" && item.brands && (
                              <div className="luxx-mobile-brand-grid">
                                {item.brands.map((brand) => (
                                  <Link
                                    key={brand.name}
                                    href={brand.href}
                                    className="luxx-mobile-brand-chip"
                                    style={getBrandStyle(brand.name)}
                                    aria-label={`View ${brand.name} rentals`}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <span className="relative z-10">{brand.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                            {item.submenuType === "services" && item.services && (
                              <div className="luxx-mobile-service-list">
                                {item.services.map((service) => (
                                  <Link
                                    key={service.name}
                                    href={service.href}
                                    className="luxx-mobile-service-link"
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
                  </nav>
                  
                  {/* Mobile CTA */}
                  <div className="luxx-mobile-cta-wrap">
                    <div className="luxx-mobile-cta-label">Call us directly</div>
                    <Link 
                      href="tel:+13056055899"
                      className="luxx-mobile-cta"
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
