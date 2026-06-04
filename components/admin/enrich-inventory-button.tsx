"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wand2, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface EnrichResult {
  success: boolean
  message?: string
  appliedUpdates?: Record<string, any>
  skippedUpdates?: Record<string, { reason: string; value?: any; confidence?: number }>
  error?: string
}

interface EnrichInventoryButtonProps {
  inventoryId: string
  category: "car" | "yacht" | "villa"
  getFormData: () => {
    title: string
    subtitle?: string
    currentSpecs: Record<string, any>
  }
  onEnriched: (updates: Record<string, any>) => void
}

export function EnrichInventoryButton({
  inventoryId,
  category,
  getFormData,
  onEnriched,
}: EnrichInventoryButtonProps) {
  const [isEnriching, setIsEnriching] = useState(false)
  const [lastResult, setLastResult] = useState<EnrichResult | null>(null)

  const handleEnrich = async () => {
    const formData = getFormData()

    if (!formData.title) {
      toast.error("Please enter a title first")
      return
    }

    setIsEnriching(true)
    setLastResult(null)

    try {
      const response = await fetch("/api/admin/inventory/enrich", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventoryId,
          category,
          title: formData.title,
          subtitle: formData.subtitle,
          currentSpecs: formData.currentSpecs,
        }),
      })

      const result: EnrichResult = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to enrich inventory")
      }

      setLastResult(result)

      if (result.appliedUpdates && Object.keys(result.appliedUpdates).length > 0) {
        onEnriched(result.appliedUpdates)
        const fieldNames = Object.keys(result.appliedUpdates).join(", ")
        toast.success(`Fields enriched: ${fieldNames}`)
      } else {
        toast.info("No missing fields to enrich")
      }
    } catch (error) {
      console.error("Error enriching inventory:", error)
      toast.error(error instanceof Error ? error.message : "Failed to enrich inventory")
      setLastResult({ success: false, error: "Failed to enrich" })
    } finally {
      setIsEnriching(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleEnrich}
        disabled={isEnriching}
        className="border-purple-500 text-purple-400 hover:bg-purple-500/10 cut-corner"
      >
        {isEnriching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enriching...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Enrich Inventory
          </>
        )}
      </Button>
      {lastResult && lastResult.appliedUpdates && Object.keys(lastResult.appliedUpdates).length > 0 && (
        <span className="text-xs text-green-400 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {Object.keys(lastResult.appliedUpdates).length} field(s) updated
        </span>
      )}
    </div>
  )
}
