"use client"

import { useState } from "react"
import { upsertSortSetting } from "@/lib/sort-settings-actions"
import { SORT_MODE_LABELS, SORT_MODE_DESCRIPTIONS } from "@/lib/sort-settings-constants"
import type { SortMode } from "@/lib/sort-settings-constants"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Anchor, Home, Save, Loader2, Check } from "lucide-react"

interface InventorySortSettingsProps {
  initialSettings: Record<string, SortMode>
}

const CATEGORIES = [
  { key: "car", label: "Exotic Cars", icon: Car, route: "/cars" },
  { key: "yacht", label: "Yachts", icon: Anchor, route: "/yachts" },
  { key: "villa", label: "Villas", icon: Home, route: "/houses" },
]

const SORT_MODES: SortMode[] = [
  "featured_first",
  "price_high_to_low",
  "price_high_brand_grouped",
  "brand_alpha",
  "price_low_to_high",
]

export function InventorySortSettings({ initialSettings }: InventorySortSettingsProps) {
  const [settings, setSettings] = useState<Record<string, SortMode>>(initialSettings)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSave = async (category: string) => {
    setSaving((prev) => ({ ...prev, [category]: true }))
    setErrors((prev) => ({ ...prev, [category]: "" }))
    setSaved((prev) => ({ ...prev, [category]: false }))

    const result = await upsertSortSetting(category, settings[category])

    if (result.success) {
      setSaved((prev) => ({ ...prev, [category]: true }))
      setTimeout(() => setSaved((prev) => ({ ...prev, [category]: false })), 2000)
    } else {
      setErrors((prev) => ({ ...prev, [category]: result.error || "Failed to save" }))
    }

    setSaving((prev) => ({ ...prev, [category]: false }))
  }

  return (
    <div className="space-y-6">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon
        const currentMode = settings[cat.key] || "featured_first"
        const isSaving = saving[cat.key]
        const isSaved = saved[cat.key]
        const error = errors[cat.key]
        const hasChanged = currentMode !== initialSettings[cat.key]

        return (
          <Card key={cat.key} className="bg-[#111111] border-[#333333]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ECAC36]/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#ECAC36]" />
                  </div>
                  <div>
                    <CardTitle className="text-white">{cat.label}</CardTitle>
                    <CardDescription className="text-gray-400">
                      Sort order for the public {cat.route} listing page
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => handleSave(cat.key)}
                  disabled={isSaving || !hasChanged}
                  size="sm"
                  className={
                    isSaved
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-[#ECAC36] hover:bg-[#d49a2e] text-black"
                  }
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : isSaved ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <select
                  value={currentMode}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      [cat.key]: e.target.value as SortMode,
                    }))
                  }
                  className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-lg px-4 py-3 text-sm focus:border-[#ECAC36] focus:ring-1 focus:ring-[#ECAC36] outline-none transition-colors"
                >
                  {SORT_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {SORT_MODE_LABELS[mode]}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  {SORT_MODE_DESCRIPTIONS[currentMode]}
                </p>
                {error && (
                  <p className="text-xs text-red-400">{error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
