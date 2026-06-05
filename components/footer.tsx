"use client"

import Image from "next/image"
import Link from "next/link"
import { TrackedPhoneLink } from "@/components/tracked-phone-link"
import { Instagram } from "lucide-react"
import { SOCIAL_LINKS } from "@/lib/social-config"

const FOOTER_BRAND_LINKS = [
  { name: "Audi", slug: "audi" },
  { name: "Bentley", slug: "bentley" },
  { name: "BMW", slug: "bmw" },
  { name: "Cadillac", slug: "cadillac" },
  { name: "Ferrari", slug: "ferrari" },
  { name: "Lamborghini", slug: "lamborghini" },
  { name: "McLaren", slug: "mclaren" },
  { name: "Mercedes", slug: "mercedes" },
  { name: "Porsche", slug: "porsche" },
  { name: "Rolls-Royce", slug: "rolls-royce" },
  { name: "Tesla", slug: "tesla" },
]

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-[#ECAC36]/30 py-12 md:py-16">
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ECAC36] to-transparent"
        style={{
          clipPath: "polygon(0 0, 100% 0, 94% 100%, 6% 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 md:pt-8">
        {/* Location Section */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="beveled bg-gradient-to-br from-[#ECAC36]/10 to-[#e6c766]/5 border border-[#ECAC36]/30 p-4 sm:p-6 shadow-luxury-rest">
            <div className="text-gray-300 text-center space-y-1">
              <p className="font-semibold text-[#ECAC36] text-base sm:text-lg">Brickell, Miami FL</p>
              <p className="text-sm">24/7 Operations</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8 md:mb-12">
          {/* Brand Column */}
          <div className="text-center md:text-left sm:col-span-2 lg:col-span-1">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-pic-logo-transparent-background%20%281%29-NsrnIlw2XUmCf9NaHqCqGNTdzkkgw9.png"
              alt="Luxx Miami"
              width={64}
              height={64}
              className="h-16 w-auto mb-4 mx-auto md:mx-0"
            />
            <p className="text-gray-400 leading-relaxed">
              Miami's premier luxury rental service for discerning clients.
            </p>
          </div>

          {/* Rentals Column - Brand Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6 flex items-center justify-center md:justify-start">
              <span
                className="w-2 h-2 bg-[#ECAC36] mr-3"
                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
              />
              Rentals
            </h4>
            <ul className="space-y-2 text-gray-400 text-center md:text-left text-sm">
              {FOOTER_BRAND_LINKS.map((brand) => (
                <li key={brand.slug} className="flex items-center justify-center md:justify-start">
                  <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                  <Link
                    href={`/car-brand/${brand.slug}`}
                    className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  >
                    {brand.name} Rental Miami
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6 flex items-center justify-center md:justify-start">
              <span
                className="w-2 h-2 bg-[#ECAC36] mr-3"
                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
              />
              Services
            </h4>
            <ul className="space-y-3 text-gray-400 text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/cars"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  Exotic Cars
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/yachts"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  Yachts
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/houses"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  Villas
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/tours/cars"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  Car Tours
                </a>
              </li>
            </ul>
          </div>

          {/* Guides Column */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6 flex items-center justify-center md:justify-start">
              <span
                className="w-2 h-2 bg-[#ECAC36] mr-3"
                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
              />
              Guides
            </h4>
            <ul className="space-y-3 text-gray-400 text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/blog"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  Blog
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/miami-club-guide"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  Club Guide
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/miami-restaurant-guide"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  Restaurants
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/buy-sell"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  Buy/Sell
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/repair"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                >
                  Repair & Customization
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6 flex items-center justify-center md:justify-start">
              <span
                className="w-2 h-2 bg-[#ECAC36] mr-3"
                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
              />
              Contact
            </h4>
            <div className="space-y-3 text-gray-400 text-center md:text-left">
              <p className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <TrackedPhoneLink phoneNumber="+13056055899" className="hover:text-gold-gradient transition-colors duration-[220ms]">
                  Phone: (305) 605-5899
                </TrackedPhoneLink>
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a href="https://wa.me/13056055899" target="_blank" rel="noopener noreferrer" className="hover:text-gold-gradient transition-colors duration-[220ms]">
                  WhatsApp: (305) 605-5899
                </a>
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a href="mailto:luxxmiamigroup@gmail.com" className="hover:text-gold-gradient transition-colors duration-[220ms]">
                  Email: luxxmiamigroup@gmail.com
                </a>
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <span className="text-[#ECAC36] mr-2 text-xs">◆</span>
                <a
                  href="/admin/login"
                  className="hover:text-gold-gradient transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] text-sm opacity-75"
                >
                  Admin Login
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 border border-[#ECAC36]/30 hover:border-[#ECAC36] hover:bg-[#ECAC36]/10 rounded-lg transition-all duration-300"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="h-5 w-5 text-[#ECAC36]" />
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 border border-[#ECAC36]/30 hover:border-[#ECAC36] hover:bg-[#ECAC36]/10 rounded-lg transition-all duration-300"
            aria-label="Follow us on Facebook"
          >
            <svg className="h-5 w-5 text-[#ECAC36]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 border border-[#ECAC36]/30 hover:border-[#ECAC36] hover:bg-[#ECAC36]/10 rounded-lg transition-all duration-300"
            aria-label="Follow us on TikTok"
          >
            <svg className="h-5 w-5 text-[#ECAC36]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
          <a
            href={SOCIAL_LINKS.googleReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 border border-[#ECAC36]/30 hover:border-[#ECAC36] hover:bg-[#ECAC36]/10 rounded-lg transition-all duration-300"
            aria-label="See our Google Reviews"
          >
            <svg className="h-5 w-5 text-[#ECAC36]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
          </a>
        </div>

        {/* Copyright Section */}
        <div className="relative pt-8">
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#ECAC36] to-transparent"
            style={{ transform: "translateX(-50%) skewX(-6deg)" }}
          />
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2026 Luxx Miami. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
