"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const sections = [
  { id: "home", label: "Home" },
  { id: "featured-exotics", label: "Cars" },
  { id: "luxury-yachts", label: "Yachts" },
  { id: "premium-villas", label: "Villas" },
  { id: "latest-guides", label: "Blog" },
  { id: "miami-guides", label: "Guides" },
  { id: "concierge", label: "Details" },
]

export function HomepageSectionNav() {
  const [activeId, setActiveId] = useState("home")
  const [visible, setVisible] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    let ticking = false

    const updateActiveSection = () => {
      const marker = window.scrollY + Math.min(window.innerHeight * 0.42, 360)
      const sectionElements = sections
        .map((section) => ({ id: section.id, el: document.getElementById(section.id) }))
        .filter((section): section is { id: string; el: HTMLElement } => Boolean(section.el))

      let nextActiveId = sectionElements[0]?.id ?? "home"
      sectionElements.forEach((section) => {
        if (section.el.offsetTop <= marker) {
          nextActiveId = section.id
        }
      })

      setActiveId((current) => (current === nextActiveId ? current : nextActiveId))
      setVisible((current) => {
        const hero = document.getElementById("home")
        const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight
        const nextVisible = window.scrollY + 8 >= heroBottom
        return current === nextVisible ? current : nextVisible
      })
      ticking = false
    }

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection)
        ticking = true
      }
    }

    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    updateActiveSection()

    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [])

  const scrollToSection = useCallback((id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    const target = document.getElementById(id)
    target?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <nav
      id="scrollDotNav"
      className={`${visible ? "sdn-visible" : ""} ${collapsed ? "sdn-collapsed" : ""}`}
      aria-label="Homepage sections"
    >
      <button
        type="button"
        className="sdn-toggle"
        aria-label={collapsed ? "Show section navigation" : "Hide section navigation"}
        aria-pressed={!collapsed}
        onClick={() => setCollapsed((current) => !current)}
      >
        <Eye className="sdn-eye-open" size={16} strokeWidth={1.5} aria-hidden="true" />
        <EyeOff className="sdn-eye-closed" size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>

      <div className="sdn-track">
        {sections.map((section) => {
          const isActive = section.id === activeId

          return (
            <button
              key={section.id}
              type="button"
              className={`sdn-item ${isActive ? "sdn-active" : ""}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToSection(section.id)}
            >
              <span className="sdn-dot" aria-hidden="true" />
              <span className="sdn-label">{section.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
