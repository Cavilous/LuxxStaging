"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowRight,
  Car,
  CheckCircle2,
  ExternalLink,
  EyeOff,
  Home,
  Ship,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react"

type DemoAction = {
  label: string
  href: string
}

type DemoStep = {
  key: string
  label: string
  icon: LucideIcon
  title: string
  body: string
  callout: string
  href?: string
  actionLabel?: string
  scrollTarget?: string[]
  scrollTop?: boolean
  secondaryActions?: DemoAction[]
}

type PendingScroll = (Pick<DemoStep, "scrollTarget" | "scrollTop"> & { href: string }) | null

const demoSteps: DemoStep[] = [
  {
    key: "homepage",
    label: "Homepage",
    icon: Home,
    title: "Homepage ready",
    body: "The homepage hero, featured sections, and visual polish are ready for the client walkthrough.",
    callout: "Start with the homepage for the first client pass.",
    href: "/",
    actionLabel: "Open homepage",
    scrollTop: true,
  },
  {
    key: "menu-logos",
    label: "Menu logos",
    icon: Sparkles,
    title: "Menu logo hovers ready",
    body: "The Exotic Cars menu now reveals brand-specific logo glow states on hover, with matching logo-backed brand chips on mobile.",
    callout: "Hover Exotic Cars, then hover a brand like Bentley to show the logo reveal.",
    href: "/",
    actionLabel: "Open homepage",
    scrollTop: true,
  },
  {
    key: "fleet",
    label: "Fleet cards",
    icon: Car,
    title: "Fleet cards ready",
    body: "The featured fleet cards are ready to show with polished motion, cleaner images, and simple browsing.",
    callout: "Scroll to the featured fleet cards and show the browsing polish.",
    href: "/",
    actionLabel: "Show cards",
    scrollTarget: ["Featured Exotics"],
    secondaryActions: [{ label: "Open full fleet", href: "/cars" }],
  },
  {
    key: "bentley",
    label: "Bentley page",
    icon: Sparkles,
    title: "Bentley brand page ready",
    body: "The Bentley page is ready to show a focused brand path with matching vehicles for the preview.",
    callout: "Use Bentley to show the brand page and inventory path.",
    href: "/car-brand/bentley",
    actionLabel: "Open Bentley",
  },
  {
    key: "listings",
    label: "Yachts & villas",
    icon: Ship,
    title: "Yachts and villas ready",
    body: "Yacht and villa listing pages load with safe preview inventory while final live listings are reconciled.",
    callout: "Open yachts first, then villas. Both listing views are ready to review.",
    href: "/yachts",
    actionLabel: "Open yachts",
    secondaryActions: [{ label: "Open villas", href: "/houses" }],
  },
  {
    key: "private",
    label: "Private preview",
    icon: EyeOff,
    title: "Private preview ready",
    body: "The staging preview is marked private for review, with public visibility handled in the launch checklist.",
    callout: "Share that the preview stays private while the team reviews it.",
    secondaryActions: [{ label: "Open preview rules", href: "/robots.txt" }],
  },
  {
    key: "inventory-sync",
    label: "Inventory sync notes",
    icon: CheckCircle2,
    title: "Items for the existing dev team",
    body: "Included in the package: a short handoff list to reconcile inventory fields, publish rules, and final source timing.",
    callout: "Frame this as normal handoff alignment for production parity.",
  },
]

const readySteps = demoSteps.slice(0, 6)
const packageSteps = demoSteps.slice(6)

function scrollToHeading(targets: string[]) {
  const normalizedTargets = targets.map((target) => target.toLowerCase())
  const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
  const match = headings.find((heading) => {
    const text = heading.textContent?.toLowerCase() || ""
    return normalizedTargets.some((target) => text.includes(target))
  })

  match?.scrollIntoView({ behavior: "smooth", block: "center" })
}

export function PresentationCallouts() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [activeKey, setActiveKey] = useState(demoSteps[0].key)
  const [pendingScroll, setPendingScroll] = useState<PendingScroll>(null)
  const active = demoSteps.find((step) => step.key === activeKey) || demoSteps[0]
  const ActiveIcon = active.icon

  useEffect(() => {
    if (!pendingScroll) return
    if (pathname !== pendingScroll.href) return

    const timeout = window.setTimeout(() => {
      if (pendingScroll.scrollTop) {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else if (pendingScroll.scrollTarget) {
        scrollToHeading(pendingScroll.scrollTarget)
      }

      setPendingScroll(null)
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [pathname, pendingScroll])

  function goToStep(step: DemoStep) {
    setActiveKey(step.key)
    const shouldScroll = step.scrollTop || step.scrollTarget

    if (step.href && step.href !== pathname) {
      if (shouldScroll) {
        setPendingScroll({ href: step.href, scrollTop: step.scrollTop, scrollTarget: step.scrollTarget })
      }
      router.push(step.href)
      return
    }

    if (step.scrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (step.scrollTarget) {
      scrollToHeading(step.scrollTarget)
      return
    }

    if (step.href) {
      router.push(step.href)
    }
  }

  function goToAction(action: DemoAction) {
    router.push(action.href)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="magnetic-hover cut-corner border border-[#ECAC36]/50 bg-black/90 px-4 py-3 text-sm font-bold text-[#ECAC36] shadow-2xl backdrop-blur-md"
          aria-label="Open presentation notes"
        >
          Demo Notes
        </button>
      ) : (
        <>
          <div className="mb-2 ml-auto flex w-[min(390px,calc(100vw-2rem))] items-center gap-2 border border-[#ECAC36]/25 bg-black/85 px-3 py-2 text-xs font-semibold text-gray-200 shadow-xl backdrop-blur-md">
            <ArrowRight className="h-4 w-4 shrink-0 text-[#ECAC36]" />
            <span>{active.callout}</span>
          </div>

          <aside className="cut-corner w-[min(390px,calc(100vw-2rem))] border border-[#ECAC36]/35 bg-black/90 p-4 text-white shadow-2xl backdrop-blur-md">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-[#ECAC36]">Client walkthrough</p>
                <h2 className="mt-1 text-lg font-heading font-black">Ready checklist</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-sm p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                aria-label="Close presentation notes"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 space-y-3">
              {[
                { title: "Ready now", steps: readySteps },
                { title: "Coming in package", steps: packageSteps },
              ].map((group) => (
                <div key={group.title}>
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    {group.title}
                  </p>
                  <div className="grid gap-2">
                    {group.steps.map((step) => {
                      const Icon = step.icon
                      const isActive = step.key === activeKey

                      return (
                        <button
                          key={step.key}
                          type="button"
                          onClick={() => goToStep(step)}
                          className={`magnetic-hover cut-corner flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-bold ${
                            isActive
                              ? "bg-[#ECAC36] text-black"
                              : "border border-white/15 bg-white/5 text-gray-200 hover:border-[#ECAC36]/40"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{step.label}</span>
                          </span>
                          {step.href || step.scrollTarget || step.scrollTop ? (
                            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-75" />
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden cut-corner border border-white/10 bg-white/[0.04] p-4">
              <div className="absolute right-3 top-3 text-[#ECAC36]/30">
                <ArrowRight className="luxx-callout-arrow h-8 w-8" />
              </div>
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center cut-corner bg-[#ECAC36] text-black">
                <ActiveIcon className="h-4 w-4" />
              </div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ECAC36]">
                {readySteps.some((step) => step.key === active.key) ? "Ready now" : "Coming in package"}
              </p>
              <h3 className="mb-2 pr-10 text-base font-bold">{active.title}</h3>
              <p className="text-sm leading-relaxed text-gray-300">{active.body}</p>

              {active.actionLabel ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (active.scrollTop || active.scrollTarget) {
                        goToStep(active)
                        return
                      }

                      if (active.href) {
                        goToAction({ label: active.actionLabel || active.label, href: active.href })
                        return
                      }

                      goToStep(active)
                    }}
                    className="cut-corner bg-[#ECAC36] px-3 py-2 text-xs font-bold text-black hover:bg-[#e6c766]"
                  >
                    {active.actionLabel}
                  </button>
                  {active.secondaryActions?.map((action) => (
                    <button
                      key={action.href}
                      type="button"
                      onClick={() => goToAction(action)}
                      className="cut-corner border border-[#ECAC36]/35 px-3 py-2 text-xs font-bold text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : active.secondaryActions ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {active.secondaryActions.map((action) => (
                    <button
                      key={action.href}
                      type="button"
                      onClick={() => goToAction(action)}
                      className="cut-corner border border-[#ECAC36]/35 px-3 py-2 text-xs font-bold text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle2 className="h-4 w-4 text-[#ECAC36]" />
              Ready items and package notes are organized for the walkthrough.
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
