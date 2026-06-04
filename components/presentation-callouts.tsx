"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, Link2, Sparkles, Wrench, X } from "lucide-react"

const callouts = [
  {
    key: "animations",
    label: "Animations",
    icon: Sparkles,
    title: "Monarc-style motion layer",
    body: "Homepage index motion, magnetic inventory cards, glimmer sweeps, and polished filter interactions are now wired into the Luxx staging build.",
  },
  {
    key: "fixes",
    label: "Fixes",
    icon: Wrench,
    title: "Visible QA fixes",
    body: "Brand inventory matching is more forgiving, Bentley-style pages can pull all matching cars, and homepage blog cards now show real thumbnails instead of empty placeholders.",
  },
  {
    key: "links",
    label: "Links",
    icon: Link2,
    title: "Next SEO package",
    body: "Recommended next pass: repair old internal links, connect brand pages to `/cars`, add cross-links from guides to fleet pages, and standardize canonical destination paths.",
  },
]

export function PresentationCallouts() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeKey, setActiveKey] = useState(callouts[0].key)
  const active = callouts.find((callout) => callout.key === activeKey) || callouts[0]
  const ActiveIcon = active.icon

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="magnetic-hover cut-corner border border-[#ECAC36]/50 bg-black/90 px-4 py-3 text-sm font-bold text-[#ECAC36] shadow-2xl backdrop-blur-md"
          aria-label="Open presentation notes"
        >
          QA Notes
        </button>
      ) : (
        <aside className="cut-corner w-[min(390px,calc(100vw-2rem))] border border-[#ECAC36]/35 bg-black/90 p-4 text-white shadow-2xl backdrop-blur-md">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-[#ECAC36]">Tonight staging package</p>
              <h2 className="mt-1 text-lg font-heading font-black">Luxx Miami upgrade notes</h2>
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

          <div className="mb-4 grid grid-cols-3 gap-2">
            {callouts.map((callout) => {
              const Icon = callout.icon
              const isActive = callout.key === activeKey

              return (
                <button
                  key={callout.key}
                  type="button"
                  onClick={() => setActiveKey(callout.key)}
                  className={`magnetic-hover cut-corner flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-bold ${
                    isActive
                      ? "bg-[#ECAC36] text-black"
                      : "border border-white/15 bg-white/5 text-gray-200 hover:border-[#ECAC36]/40"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {callout.label}
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
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <CheckCircle2 className="h-4 w-4 text-[#ECAC36]" />
            Build, deploy, QA, then use this panel during the walkthrough.
          </div>
        </aside>
      )}
    </div>
  )
}
