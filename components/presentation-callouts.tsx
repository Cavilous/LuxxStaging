"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

const demoSteps: DemoStep[] = [
  {
    key: "homepage",
    label: "Homepage polish",
    icon: Home,
    title: "Homepage polish",
    body: "Hero motion, card polish, and blog thumbnails are ready for tonight's walkthrough.",
    callout: "Start here. The homepage is ready for the first look.",
    href: "/",
    actionLabel: "Show homepage",
    scrollTop: true,
  },
  {
    key: "fleet",
    label: "Fleet cards",
    icon: Car,
    title: "Fleet cards",
    body: "The fleet cards now feel smoother, with cleaner browsing for the client preview.",
    callout: "Show the card motion and cleaner fleet browsing.",
    href: "/cars",
    actionLabel: "Open fleet",
    scrollTarget: ["Featured Exotics"],
  },
  {
    key: "card-design",
    label: "Card design language",
    icon: Sparkles,
    title: "Card design language",
    body: "Cards now carry smoother motion, a cursor glimmer, brand-colored glow, and cleaner image behavior. The full package can add branded logo glimmers and richer vehicle info once assets and content are finalized.",
    callout: "Use this while showing how the card style carries across the site.",
    scrollTarget: ["Featured Exotics"],
  },
  {
    key: "bentley",
    label: "Bentley brand page",
    icon: Sparkles,
    title: "Bentley brand page",
    body: "Bentley now shows the right vehicles and keeps the page filled for the demo.",
    callout: "Use Bentley to show brand inventory working clearly.",
    href: "/car-brand/bentley",
    actionLabel: "Open Bentley",
  },
  {
    key: "listings",
    label: "Yachts/Villas loading",
    icon: Ship,
    title: "Yachts and villas load",
    body: "Yacht and villa listings show safe preview items if live inventory is unavailable.",
    callout: "Open yachts first, then villas. Both views are ready to review.",
    href: "/yachts",
    actionLabel: "Open yachts",
    secondaryActions: [{ label: "Open villas", href: "/houses" }],
  },
  {
    key: "private",
    label: "Noindex preview",
    icon: EyeOff,
    title: "Private preview is on",
    body: "Search engines are told not to list this staging site while the team reviews it.",
    callout: "This stays private until the launch package is approved.",
  },
]

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
  const [isOpen, setIsOpen] = useState(true)
  const [activeKey, setActiveKey] = useState(demoSteps[0].key)
  const active = demoSteps.find((step) => step.key === activeKey) || demoSteps[0]
  const ActiveIcon = active.icon

  function goToStep(step: DemoStep) {
    setActiveKey(step.key)

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
                <h2 className="mt-1 text-lg font-heading font-black">Guided demo</h2>
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

            <div className="mb-4 grid gap-2">
              {demoSteps.map((step) => {
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
                    {step.href ? <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-75" /> : null}
                  </button>
                )
              })}
            </div>

            <div className="relative overflow-hidden cut-corner border border-white/10 bg-white/[0.04] p-4">
              <div className="absolute right-3 top-3 text-[#ECAC36]/30">
                <ArrowRight className="luxx-callout-arrow h-8 w-8" />
              </div>
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center cut-corner bg-[#ECAC36] text-black">
                <ActiveIcon className="h-4 w-4" />
              </div>
              <h3 className="mb-2 pr-10 text-base font-bold">{active.title}</h3>
              <p className="text-sm leading-relaxed text-gray-300">{active.body}</p>

              {active.actionLabel ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (active.scrollTop) {
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
              Ready for tonight's client walkthrough.
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
