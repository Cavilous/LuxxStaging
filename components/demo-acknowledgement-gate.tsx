"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ShieldCheck, Sparkles } from "lucide-react"

const STORAGE_KEY = "luxx-demo-preview-acknowledged"

export function DemoAcknowledgementGate() {
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)
  const [checked, setChecked] = useState(false)

  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/setup-admin")

  useEffect(() => {
    if (isAdminRoute) {
      setReady(true)
      setVisible(false)
      return
    }

    const params = new URLSearchParams(window.location.search)
    if (params.get("demoPreview") === "reset") {
      window.sessionStorage.removeItem(STORAGE_KEY)
    }

    setVisible(window.sessionStorage.getItem(STORAGE_KEY) !== "true")
    setReady(true)
  }, [isAdminRoute])

  useEffect(() => {
    if (!visible) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  if (!ready || !visible) return null

  const enterDemo = () => {
    if (!checked) return
    window.sessionStorage.setItem(STORAGE_KEY, "true")
    setVisible(false)
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex min-h-dvh items-center justify-center overflow-y-auto bg-black/86 px-4 py-8 text-white backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-ack-title"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(236,172,54,0.18),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_26%)]" />

      <div className="relative w-full max-w-2xl overflow-hidden border border-[#ECAC36]/30 bg-[#070707] shadow-[0_32px_90px_rgba(0,0,0,0.72)] cut-corner-card">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ECAC36] to-transparent" />
        <div className="relative p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#ECAC36]/35 bg-[#ECAC36]/10 text-[#ECAC36] cut-corner">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ECAC36]">Private Preview</p>
              <h2 id="demo-ack-title" className="mt-1 text-2xl font-black leading-tight text-white sm:text-3xl">
                Luxx Miami Demo Site
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-6 text-white/72 sm:text-base">
            <p>
              This staging site is a working demo for review. Some content, links, inventory details, pricing, and integrations may still be adjusted before final launch.
            </p>
            <p>
              It also includes early design direction, animation concepts, and interface polish being shared before final project approval.
            </p>
          </div>

          <label className="mt-7 flex cursor-pointer items-start gap-3 border border-white/10 bg-white/[0.035] p-4 text-sm leading-5 text-white/78 transition-colors hover:border-[#ECAC36]/35 hover:bg-[#ECAC36]/8 cut-corner">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-[#ECAC36]"
            />
            <span>
              I understand this is a private preview, and that the design and animation work shown here is being shared for review before the project is finalized.
            </span>
          </label>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-white/45">
              Please keep this preview within the review group unless we agree otherwise.
            </p>
            <button
              type="button"
              onClick={enterDemo}
              disabled={!checked}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#ECAC36] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-[#d99a24] disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/35 cut-corner-button"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Enter Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
