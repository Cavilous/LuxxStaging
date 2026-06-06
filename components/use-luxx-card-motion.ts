"use client"

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react"

function supportsDesktopMotion(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function useLuxxCardMotion<T extends HTMLElement>() {
  const cardRef = useRef<T>(null)
  const animationFrame = useRef<number | null>(null)
  const latestPointer = useRef<{ clientX: number; clientY: number } | null>(null)

  useEffect(() => {
    return () => {
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])

  const handlePointerMove = (event: ReactPointerEvent<T>) => {
    if (event.pointerType !== "mouse" || !supportsDesktopMotion()) return

    const card = cardRef.current
    if (!card) return

    latestPointer.current = { clientX: event.clientX, clientY: event.clientY }
    if (animationFrame.current !== null) return

    animationFrame.current = window.requestAnimationFrame(() => {
      const pointer = latestPointer.current
      const rect = card.getBoundingClientRect()
      if (!pointer || rect.width <= 0 || rect.height <= 0) {
        animationFrame.current = null
        return
      }

      const x = pointer.clientX - rect.left
      const y = pointer.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -5
      const rotateY = ((x - centerX) / centerX) * 5
      const shineX = Math.max(0, Math.min(100, (x / rect.width) * 100))
      const shineY = Math.max(0, Math.min(100, (y / rect.height) * 100))
      const logoX = Math.max(-8, Math.min(108, (x / rect.width) * 100))
      const logoY = Math.max(12, Math.min(88, (y / rect.height) * 100))

      card.style.setProperty("--luxx-shine-x", `${shineX.toFixed(1)}%`)
      card.style.setProperty("--luxx-shine-y", `${shineY.toFixed(1)}%`)
      card.style.setProperty("--luxx-logo-x", `${logoX.toFixed(1)}%`)
      card.style.setProperty("--luxx-logo-y", `${logoY.toFixed(1)}%`)
      card.style.transition = "none"
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
      animationFrame.current = null
    })
  }

  const resetPointerEffect = () => {
    if (animationFrame.current !== null) {
      window.cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }
    latestPointer.current = null

    const card = cardRef.current
    if (!card) return

    card.style.setProperty("--luxx-shine-x", "50%")
    card.style.setProperty("--luxx-shine-y", "50%")
    card.style.setProperty("--luxx-logo-x", "50%")
    card.style.setProperty("--luxx-logo-y", "50%")
    card.style.transition = "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 220ms ease, box-shadow 220ms ease, background 220ms ease"
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)"
  }

  return {
    cardRef,
    handlePointerMove,
    resetPointerEffect,
  }
}
