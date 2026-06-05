"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

// Import FloatingContact lazily to avoid SSR hydration issues
import { FloatingContact } from "@/components/floating-contact"
import { useEffect, useState } from "react"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")
  const [showFloating, setShowFloating] = useState(false)

  useEffect(() => {
    // Delay mounting to ensure client-side only
    const timer = setTimeout(() => setShowFloating(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (isAdminPage) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileBottomNav />
      {showFloating && <FloatingContact />}
    </>
  )
}
