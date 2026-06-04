"use client"

import { useState, useEffect, useCallback, useRef, ReactNode } from "react"

interface ParallaxWrapperProps {
  children: ReactNode
  className?: string
}

export function ParallaxWrapper({ children, className = "" }: ParallaxWrapperProps) {
  const [scrollY, setScrollY] = useState(0)
  const isMobileRef = useRef<boolean | null>(null)
  const rafIdRef = useRef<number | null>(null)

  const handleScroll = useCallback(() => {
    if (isMobileRef.current === null) {
      isMobileRef.current = window.innerWidth < 768 || 'ontouchstart' in window
    }
    if (!isMobileRef.current) {
      if (rafIdRef.current !== null) return
      rafIdRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        rafIdRef.current = null
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [handleScroll])

  return (
    <div
      className={className}
      style={{
        transform: scrollY > 0 ? `translateY(${scrollY * 0.5}px)` : 'none',
      }}
    >
      {children}
    </div>
  )
}
