"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowRight,
  BookOpen,
  Car,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  EyeOff,
  Home,
  Info,
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
  infoTip: string
  note: string
  href?: string
  actionLabel?: string
  scrollTarget?: string[]
  scrollTop?: boolean
  spotlightSelectors?: string[]
  secondaryActions?: DemoAction[]
}

type PendingScroll = (Pick<DemoStep, "scrollTarget" | "scrollTop"> & { href: string }) | null
type SpotlightPlacement = "top" | "bottom"
type SpotlightState = {
  top: number
  left: number
  width: number
  height: number
  tooltipTop: number
  tooltipLeft: number
  arrowLeft: number
  pointerTop: number
  pointerLeft: number
  placement: SpotlightPlacement
}

type DemoTooltipStyle = CSSProperties & {
  "--luxx-demo-arrow-left"?: string
}

const demoSteps: DemoStep[] = [
  {
    key: "homepage",
    label: "Homepage",
    icon: Home,
    title: "Homepage polish is ready",
    body: "Start on the hero, then scroll down to reveal the page index/table of contents and use it to guide the review.",
    callout: "Scroll past the hero to reveal the table of contents, then use the walkthrough panel to guide the review.",
    infoTip: "Use this as the opening proof point: the homepage now has a clear review flow from hero to section index to inventory.",
    note: "Open with the polished first impression, then scroll once so the table of contents animation is easy to see.",
    href: "/",
    actionLabel: "Open homepage",
    scrollTop: true,
    spotlightSelectors: [".homepage-section-nav", "#home .page-reveal", "#home"],
  },
  {
    key: "menu-logos",
    label: "Menu UI",
    icon: Sparkles,
    title: "Menu UI improvements are ready",
    body: "Desktop menu hover, brand-logo motion, magnetic hover, and mobile navigation polish are ready to show.",
    callout: "Hover Exotic Cars and the brand links so they can see the menu logo motion and magnetic feel.",
    infoTip: "Show desktop hover first, then the mobile navigation. Keep it simple: the menu now feels premium instead of flat.",
    note: "This shows the navigation polish directly instead of only describing it.",
    href: "/",
    actionLabel: "Open homepage",
    scrollTop: true,
    spotlightSelectors: [
      "[data-demo='menu-brand-hover']",
      "[data-demo='menu-ui']",
      ".luxx-mobile-menu-trigger",
    ],
  },
  {
    key: "fleet",
    label: "Fleet cards",
    icon: Car,
    title: "Fleet cards and filters are ready",
    body: "Cards have cleaner motion, brand-logo glimmer, working card links, and a tighter brand/filter experience.",
    callout: "Open the fleet and show one card hover plus the brand buttons/filter area.",
    infoTip: "Call out the improved card feel, brand buttons, and cleaner filters. Keep it visual; no need to explain the code.",
    note: "This is the main product-display upgrade: the fleet should feel smoother and more premium.",
    href: "/cars-listing",
    actionLabel: "Show cards",
    scrollTop: true,
    spotlightSelectors: ["[data-demo='fleet-filters']", ".luxx-brand-shortcut-rail", ".fleet-grid"],
  },
  {
    key: "pricing",
    label: "Multi-day pricing",
    icon: CheckCircle2,
    title: "Multi-day pricing is connected",
    body: "The rate guide opens the car detail page with the selected daily rate, reservation total, savings, and free delivery.",
    callout: "Show the selected-rate detail page and point at the reservation total.",
    infoTip: "Use one example rate. The selected daily rate, total reservation amount, savings, and free delivery are the important selling points.",
    note: "This is a clean upsell moment: lower daily rate, total reservation amount, and savings are visible in one place.",
    href: "/cars/ferrari-812-superfast-2?tier=3-day&days=3&rate=2155",
    actionLabel: "Open pricing example",
    spotlightSelectors: ["[data-demo='multi-day-pricing']", "main h1", "h1"],
  },
  {
    key: "blog-thumbnails",
    label: "Blog thumbnails",
    icon: BookOpen,
    title: "Blog thumbnails are fixed",
    body: "Homepage blog cards now show real image thumbnails instead of blank placeholders.",
    callout: "Scroll to the blog cards and point out that the thumbnails now load.",
    infoTip: "Use plain language for the client: the homepage blog cards are fixed and no longer show empty image areas.",
    note: "This is a quick visible proof point on the homepage.",
    href: "/",
    actionLabel: "Show blog cards",
    scrollTarget: ["Latest from the Blog"],
    spotlightSelectors: ["[data-demo='blog-thumbnails']", "[data-demo='blog-section']"],
  },
  {
    key: "brand-pages",
    label: "Brand pages fixed",
    icon: Sparkles,
    title: "Brand pages are fixed across brands",
    body: "Brand pages now open, show matching cars, and include the branded background logo polish.",
    callout: "Open Bentley, Ferrari, and Rolls-Royce so it is clear this is not only one brand page.",
    infoTip: "Keep the language simple: the brand pages open and show the right cars. Production inventory count differences belong in the next package.",
    note: "This is the clean client phrasing: brand pages are fixed across the demo set.",
    href: "/car-brand/bentley",
    actionLabel: "Open Bentley",
    spotlightSelectors: ["[data-demo='brand-page-inventory']", ".fleet-grid", "main h1", "h1"],
    secondaryActions: [
      { label: "Open Ferrari", href: "/car-brand/ferrari" },
      { label: "Open Rolls-Royce", href: "/car-brand/rolls-royce" },
    ],
  },
  {
    key: "listings",
    label: "Yachts & villas",
    icon: Ship,
    title: "Yachts and villas load",
    body: "Yachts and villas no longer dead-end; the visible listing pages load preview inventory and working cards.",
    callout: "Open yachts first, then villas.",
    infoTip: "This is a staging fix: listings and details now populate so the demo path does not dead-end.",
    note: "Keep this quick in the walkthrough: the point is that the preview does not dead-end.",
    href: "/yachts",
    actionLabel: "Open yachts",
    spotlightSelectors: ["main h1", "h1", "#luxury-yachts", "#premium-villas"],
    secondaryActions: [{ label: "Open villas", href: "/houses" }],
  },
  {
    key: "private",
    label: "Private preview",
    icon: EyeOff,
    title: "Private preview is covered",
    body: "The demo has a preview acknowledgement gate and noindex rules so it is not positioned as a public launch.",
    callout: "Mention the privacy gate and noindex setup before sharing the link.",
    infoTip: "Say this is a private review link. The acknowledgement gate and noindex settings protect the preview while it is being shown.",
    note: "Use this to reassure them the demo is for review only.",
    secondaryActions: [{ label: "Open preview rules", href: "/robots.txt" }],
  },
  {
    key: "qa-next",
    label: "QA & next steps",
    icon: CheckCircle2,
    title: "QA pass and next recommendations",
    body: "The visible demo path, brand menus, card links, and major listing pages were checked. After approval, the next package should include production inventory reconciliation, slug cleanup, and deeper SEO/internal-link mapping.",
    callout: "Close with what is working now, then name the next package items.",
    infoTip: "Frame remaining differences as next-step recommendations: production inventory sync, clean slugs, internal links, and SEO mapping.",
    note: "This frames recommendations as the next phase, not as problems with the preview.",
  },
]

const readySteps = demoSteps.slice(0, demoSteps.length - 1)
const packageSteps = demoSteps.slice(demoSteps.length - 1)

function scrollToHeading(targets: string[]) {
  const normalizedTargets = targets.map((target) => target.toLowerCase())
  const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
  const match = headings.find((heading) => {
    const text = heading.textContent?.toLowerCase() || ""
    return normalizedTargets.some((target) => text.includes(target))
  })

  match?.scrollIntoView({ behavior: "smooth", block: "center" })
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function findVisibleTarget(selectors: string[]) {
  for (const selector of selectors) {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(selector))
    const target = candidates.find((element) => {
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)

      return (
        rect.width > 8 &&
        rect.height > 8 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      )
    })

    if (target) return target
  }

  return null
}

export function PresentationCallouts() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [activeKey, setActiveKey] = useState(demoSteps[0].key)
  const [pendingScroll, setPendingScroll] = useState<PendingScroll>(null)
  const [spotlight, setSpotlight] = useState<SpotlightState | null>(null)
  const [openInfoKey, setOpenInfoKey] = useState<string | null>(null)
  const active = demoSteps.find((step) => step.key === activeKey) || demoSteps[0]
  const activeIndex = Math.max(
    demoSteps.findIndex((step) => step.key === active.key),
    0,
  )
  const ActiveIcon = active.icon
  const isAdminPath = pathname.startsWith("/admin")

  useEffect(() => {
    if (isAdminPath) return
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
  }, [isAdminPath, pathname, pendingScroll])

  useEffect(() => {
    if (isAdminPath || !isOpen || !active.spotlightSelectors?.length) {
      setSpotlight(null)
      return
    }

    let frameId: number | null = null
    let settleTimeout: number | null = null

    const updateSpotlight = () => {
      frameId = null

      if (window.innerWidth < 768) {
        setSpotlight(null)
        return
      }

      const target = findVisibleTarget(active.spotlightSelectors || [])
      if (!target) {
        setSpotlight(null)
        return
      }

      const rect = target.getBoundingClientRect()
      const margin = 16
      const pad = 10
      const tooltipWidth = Math.min(320, window.innerWidth - margin * 2)
      const centerX = rect.left + rect.width / 2
      const tooltipLeft = clamp(centerX - tooltipWidth / 2, margin, window.innerWidth - tooltipWidth - margin)
      const placement: SpotlightPlacement = rect.top > 176 || rect.bottom + 150 > window.innerHeight ? "top" : "bottom"
      const tooltipTop = placement === "top" ? Math.max(margin, rect.top - 18) : Math.min(window.innerHeight - margin, rect.bottom + 18)
      const ringLeft = clamp(rect.left - pad, margin, window.innerWidth - margin)
      const ringTop = clamp(rect.top - pad, margin, window.innerHeight - margin)
      const ringWidth = clamp(rect.width + pad * 2, 0, window.innerWidth - ringLeft - margin)
      const ringHeight = clamp(rect.height + pad * 2, 0, window.innerHeight - ringTop - margin)

      setSpotlight({
        top: ringTop,
        left: ringLeft,
        width: ringWidth,
        height: ringHeight,
        tooltipTop,
        tooltipLeft,
        arrowLeft: clamp(centerX - tooltipLeft, 22, tooltipWidth - 22),
        pointerTop:
          placement === "top"
            ? Math.max(margin, ringTop - 36)
            : Math.min(window.innerHeight - margin - 34, ringTop + ringHeight + 6),
        pointerLeft: clamp(centerX - 17, margin, window.innerWidth - margin - 34),
        placement,
      })
    }

    const requestUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateSpotlight)
      }
    }

    requestUpdate()
    settleTimeout = window.setTimeout(requestUpdate, 180)
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      if (settleTimeout !== null) window.clearTimeout(settleTimeout)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [active, isAdminPath, isOpen, pathname])

  function goToStep(step: DemoStep) {
    setOpenInfoKey(null)
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

  function goToRelativeStep(direction: -1 | 1) {
    const nextIndex = (activeIndex + direction + demoSteps.length) % demoSteps.length
    goToStep(demoSteps[nextIndex])
  }

  function toggleInfoTip(key: string) {
    setOpenInfoKey((currentKey) => currentKey === key ? null : key)
  }

  if (isAdminPath) {
    return null
  }

  return (
    <div className="luxx-demo-callouts fixed inset-x-3 bottom-3 z-[70] max-w-none sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-w-[calc(100vw-2rem)]">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="luxx-demo-toggle magnetic-hover cut-corner flex min-h-12 w-full items-center justify-center border border-[#ECAC36]/50 bg-black/90 px-5 py-3 text-sm font-bold text-[#ECAC36] shadow-2xl backdrop-blur-md sm:w-auto"
          aria-label="Open presentation notes"
          aria-expanded={false}
        >
          Demo Notes
        </button>
      ) : (
        <>
          {spotlight ? (
            <>
              <div
                className="luxx-demo-spotlight"
                style={{
                  top: `${spotlight.top}px`,
                  left: `${spotlight.left}px`,
                  width: `${spotlight.width}px`,
                  height: `${spotlight.height}px`,
                }}
                aria-hidden="true"
              >
                <span className="luxx-demo-red-marker luxx-demo-red-marker--top">
                  <ArrowRight className="h-6 w-6" />
                </span>
                <span className="luxx-demo-red-marker luxx-demo-red-marker--right">
                  <ArrowRight className="h-6 w-6" />
                </span>
                <span className="luxx-demo-red-marker luxx-demo-red-marker--bottom">
                  <ArrowRight className="h-6 w-6" />
                </span>
                <span className="luxx-demo-red-marker luxx-demo-red-marker--left">
                  <ArrowRight className="h-6 w-6" />
                </span>
              </div>
              <div
                className={`luxx-demo-pointer luxx-demo-pointer--${spotlight.placement}`}
                style={{
                  top: `${spotlight.pointerTop}px`,
                  left: `${spotlight.pointerLeft}px`,
                }}
                aria-hidden="true"
              >
                <ArrowRight className="h-5 w-5" />
              </div>
              <div
                className={`luxx-demo-tooltip luxx-demo-tooltip--${spotlight.placement}`}
                style={
                  {
                    top: `${spotlight.tooltipTop}px`,
                    left: `${spotlight.tooltipLeft}px`,
                    "--luxx-demo-arrow-left": `${spotlight.arrowLeft}px`,
                  } as DemoTooltipStyle
                }
                aria-live="polite"
              >
                <span className="luxx-demo-tooltip-kicker">{active.label}</span>
                <span>{active.callout}</span>
              </div>
            </>
          ) : (
            <div className="luxx-demo-banner mb-2 ml-auto flex w-full items-center gap-2 border border-[#ECAC36]/25 bg-black/85 px-3 py-2.5 text-xs font-semibold text-gray-200 shadow-xl backdrop-blur-md sm:w-[min(390px,calc(100vw-2rem))]">
              <ArrowRight className="h-4 w-4 shrink-0 text-[#ECAC36]" />
              <span>{active.callout}</span>
            </div>
          )}

          <aside className="luxx-demo-panel cut-corner max-h-[calc(100svh-1.5rem)] w-full overflow-y-auto overscroll-contain border border-[#ECAC36]/35 bg-black/90 p-3 text-white shadow-2xl backdrop-blur-md sm:w-[min(390px,calc(100vw-2rem))] sm:p-4">
            <div className="luxx-demo-panel-header mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-[#ECAC36]">Client walkthrough</p>
                <h2 className="mt-1 text-lg font-heading font-black">Ready checklist</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="luxx-demo-close flex h-12 w-12 shrink-0 items-center justify-center rounded-sm text-gray-400 hover:bg-white/10 hover:text-white"
                aria-label="Close presentation notes"
              >
                <X className="h-5 w-5" />
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
                      const isInfoOpen = openInfoKey === step.key

                      return (
                        <div
                          key={step.key}
                          className={`luxx-demo-step-shell relative grid grid-cols-[minmax(0,1fr)_auto] gap-2 ${
                            isInfoOpen ? "is-info-open" : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => goToStep(step)}
                            className={`luxx-demo-step-button luxx-demo-step-main magnetic-hover cut-corner flex min-h-12 items-center justify-between gap-3 px-3 py-3 text-left text-sm font-bold sm:min-h-0 sm:py-2.5 ${
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
                          <button
                            type="button"
                            onClick={() => toggleInfoTip(step.key)}
                            className={`luxx-demo-info-button cut-corner flex min-h-12 w-12 items-center justify-center border text-sm sm:min-h-0 sm:w-10 ${
                              isActive
                                ? "border-[#ECAC36]/45 bg-[#ECAC36]/15 text-[#ECAC36]"
                                : "border-white/15 bg-white/[0.045] text-gray-300 hover:border-[#ECAC36]/45 hover:text-[#ECAC36]"
                            }`}
                            aria-label={`${step.label} info tip`}
                            aria-expanded={isInfoOpen}
                            aria-describedby={`demo-info-${step.key}`}
                          >
                            <Info className="h-4 w-4" />
                          </button>
                          <div
                            id={`demo-info-${step.key}`}
                            className={`luxx-demo-info-popover ${
                              isInfoOpen ? "is-open" : ""
                            }`}
                            role="tooltip"
                          >
                            <span className="luxx-demo-info-kicker">Info tip</span>
                            {step.infoTip}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`relative overflow-hidden cut-corner border border-white/10 bg-white/[0.04] p-4 ${
                active.key === "homepage" ? "luxx-demo-feature-card--homepage" : ""
              }`}
            >
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
              <p className="luxx-demo-active-body text-sm leading-relaxed text-gray-300">{active.body}</p>
              <div className="luxx-demo-active-tip mt-3 flex gap-2 border border-white/10 bg-black/30 px-3 py-2.5 text-xs leading-relaxed text-gray-300">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#ECAC36]" />
                <span>
                  <span className="font-bold text-[#ECAC36]">Info tip: </span>
                  {active.infoTip}
                </span>
              </div>
              <div className="luxx-demo-note mt-3 border border-[#ECAC36]/20 bg-[#ECAC36]/10 px-3 py-2 text-xs leading-relaxed text-[#f4d28a]">
                <span className="font-bold text-[#ECAC36]">Walkthrough note: </span>
                {active.note}
              </div>

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
                    className="luxx-demo-action cut-corner min-h-11 bg-[#ECAC36] px-4 py-3 text-sm font-bold text-black hover:bg-[#e6c766] sm:min-h-0 sm:px-3 sm:py-2 sm:text-xs"
                  >
                    {active.actionLabel}
                  </button>
                  {active.secondaryActions?.map((action) => (
                    <button
                      key={action.href}
                      type="button"
                      onClick={() => goToAction(action)}
                      className="luxx-demo-action cut-corner min-h-11 border border-[#ECAC36]/35 px-4 py-3 text-sm font-bold text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black sm:min-h-0 sm:px-3 sm:py-2 sm:text-xs"
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
                      className="luxx-demo-action cut-corner min-h-11 border border-[#ECAC36]/35 px-4 py-3 text-sm font-bold text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black sm:min-h-0 sm:px-3 sm:py-2 sm:text-xs"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="luxx-demo-controls mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <button
                type="button"
                onClick={() => goToRelativeStep(-1)}
                className="luxx-demo-nav cut-corner flex min-h-11 items-center justify-center gap-2 border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-gray-200 hover:border-[#ECAC36]/45 hover:text-[#ECAC36]"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-xs font-bold text-gray-500">
                {activeIndex + 1}/{demoSteps.length}
              </span>
              <button
                type="button"
                onClick={() => goToRelativeStep(1)}
                className="luxx-demo-nav cut-corner flex min-h-11 items-center justify-center gap-2 bg-[#ECAC36] px-3 py-2 text-xs font-bold text-black hover:bg-[#e6c766]"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#ECAC36]" />
              <span>Use Next to walk through each improvement in order.</span>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
