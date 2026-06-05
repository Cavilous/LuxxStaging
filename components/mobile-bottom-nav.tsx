"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Anchor, Building2, Car, Home, Phone } from "lucide-react"
import { TrackedPhoneLink } from "@/components/tracked-phone-link"

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    match: ["/"],
  },
  {
    label: "Fleet",
    href: "/cars-listing",
    icon: Car,
    match: ["/cars", "/cars-listing", "/car-brand"],
  },
  {
    label: "Yachts",
    href: "/yachts",
    icon: Anchor,
    match: ["/yachts"],
  },
  {
    label: "Villas",
    href: "/houses",
    icon: Building2,
    match: ["/houses"],
  },
] as const

function isActivePath(pathname: string | null, matches: readonly string[]) {
  if (!pathname) return false

  return matches.some((match) => {
    if (match === "/") return pathname === "/"
    return pathname === match || pathname.startsWith(`${match}/`)
  })
}

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="luxx-mobile-bottom-nav lg:hidden" aria-label="Primary mobile navigation">
      <div className="luxx-mobile-bottom-nav-shell">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = isActivePath(pathname, item.match)

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`luxx-mobile-bottom-nav-item ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="luxx-mobile-bottom-nav-icon">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}

        <TrackedPhoneLink
          phoneNumber="+13056055899"
          className="luxx-mobile-bottom-nav-item luxx-mobile-bottom-nav-item--call"
          ariaLabel="Call Luxx Miami"
          suppressHydrationWarning
        >
          <span className="luxx-mobile-bottom-nav-icon">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>Call</span>
        </TrackedPhoneLink>
      </div>
    </nav>
  )
}
