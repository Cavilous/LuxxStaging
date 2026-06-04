"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sparkles,
  Loader2,
  Check,
  X,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Code,
} from "lucide-react"
import { toast } from "sonner"

interface SpecValue {
  value: any
  confidence: number
}

interface AIResult {
  seoTitle?: string
  seoDescription?: string
  description?: string
  schemaJsonLd?: Record<string, any>
  imageAlts?: string[]
  specifications?: Record<string, SpecValue>
}

interface CurrentValues {
  title: string
  subtitle?: string
  brand?: string
  description?: string
  pricePerDay?: string | number
  images?: string[]
  slug?: string
  specifications?: Record<string, any>
}

interface AIReviewPanelProps {
  category: "car" | "yacht" | "villa"
  currentValues: CurrentValues
  onApply: (updates: {
    description?: string
    seoTitle?: string
    seoDescription?: string
    schemaJsonLd?: string
    imageAlts?: string[]
    specifications?: Record<string, any>
  }) => void
}

const CONFIDENCE_THRESHOLD = 0.75

export function AIReviewPanel({ category, currentValues, onApply }: AIReviewPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<AIResult | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const [selectedSpecs, setSelectedSpecs] = useState<Set<string>>(new Set())
  const [applySeo, setApplySeo] = useState(true)
  const [applyDescription, setApplyDescription] = useState(true)
  const [applySchema, setApplySchema] = useState(true)
  const [applyImageAlts, setApplyImageAlts] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["seo", "description", "specs", "schema", "imageAlts"])
  )
  const [previewMode, setPreviewMode] = useState<"preview" | "html">("preview")

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  const handleGenerate = async () => {
    if (!currentValues.title) {
      toast.error("Please enter a title first")
      return
    }

    setIsGenerating(true)
    setResult(null)
    setShowPanel(false)

    try {
      const response = await fetch("/api/admin/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title: currentValues.title,
          subtitle: currentValues.subtitle,
          brand: currentValues.brand,
          specifications: currentValues.specifications,
          pricePerDay: currentValues.pricePerDay,
          images: currentValues.images,
          slug: currentValues.slug,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to generate AI content")
        return
      }

      if (data.result) {
        setResult(data.result)
        setShowPanel(true)

        const specs = data.result.specifications || {}
        const autoSelected = new Set<string>()
        Object.entries(specs).forEach(([key, val]: [string, any]) => {
          if (val && val.confidence >= CONFIDENCE_THRESHOLD && val.value !== null && val.value !== undefined) {
            const currentVal = currentValues.specifications?.[key]
            if (currentVal === null || currentVal === undefined || currentVal === "" || currentVal === "null") {
              autoSelected.add(key)
            }
          }
        })
        setSelectedSpecs(autoSelected)

        toast.success("AI content generated! Review below.")
      }
    } catch (error) {
      console.error("AI generation error:", error)
      toast.error("Failed to generate AI content")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApplySelected = () => {
    if (!result) return

    const updates: Parameters<typeof onApply>[0] = {}

    if (applySeo) {
      if (result.seoTitle) updates.seoTitle = result.seoTitle
      if (result.seoDescription) updates.seoDescription = result.seoDescription
    }

    if (applyDescription && result.description) {
      updates.description = result.description
    }

    if (applySchema && result.schemaJsonLd) {
      updates.schemaJsonLd = JSON.stringify(result.schemaJsonLd, null, 2)
    }

    if (applyImageAlts && result.imageAlts?.length) {
      updates.imageAlts = result.imageAlts
    }

    if (selectedSpecs.size > 0 && result.specifications) {
      const specUpdates: Record<string, any> = {}
      selectedSpecs.forEach((key) => {
        const spec = result.specifications![key]
        if (spec && spec.value !== null && spec.value !== undefined) {
          specUpdates[key] = spec.value
        }
      })
      if (Object.keys(specUpdates).length > 0) {
        updates.specifications = specUpdates
      }
    }

    onApply(updates)
    toast.success("AI content applied!")
    setShowPanel(false)
    setResult(null)
  }

  const toggleSpec = (key: string) => {
    setSelectedSpecs((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectAllSpecs = () => {
    if (!result?.specifications) return
    const all = new Set<string>()
    Object.entries(result.specifications).forEach(([key, val]) => {
      if (val && val.value !== null && val.value !== undefined) {
        all.add(key)
      }
    })
    setSelectedSpecs(all)
  }

  const deselectAllSpecs = () => {
    setSelectedSpecs(new Set())
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-400"
    if (confidence >= CONFIDENCE_THRESHOLD) return "text-yellow-400"
    return "text-red-400"
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return "High"
    if (confidence >= CONFIDENCE_THRESHOLD) return "Medium"
    return "Low"
  }

  const formatSpecLabel = (key: string): string => {
    const labels: Record<string, string> = {
      year: "Year",
      make: "Make",
      model: "Model",
      trim: "Trim",
      bodyType: "Body Type",
      seats: "Seats",
      doors: "Doors",
      drivetrain: "Drivetrain",
      transmission: "Transmission",
      engine: "Engine",
      horsepower: "Horsepower",
      torque: "Torque",
      acceleration: "0-60 mph",
      topSpeed: "Top Speed",
      fuelType: "Fuel Type",
      features: "Features",
      exteriorColor: "Exterior Color",
      interiorColor: "Interior Color",
      highlights: "Highlights",
      length: "Length (ft)",
      guests: "Max Guests",
      crew: "Crew",
      cabins: "Cabins",
      builder: "Builder",
      beamFt: "Beam (ft)",
      draftFt: "Draft (ft)",
      yearBuilt: "Year Built",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      sqft: "Sq Ft",
      pool: "Pool",
      waterfront: "Waterfront",
      garage: "Garage Spaces",
    }
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
  }

  const formatSpecValue = (value: any): string => {
    if (Array.isArray(value)) return value.join(", ")
    if (typeof value === "boolean") return value ? "Yes" : "No"
    return String(value)
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="border-[#ECAC36] text-[#ECAC36] hover:bg-[#ECAC36]/10 cut-corner"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating SEO Package...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </>
        )}
      </Button>

      {showPanel && result && (
        <Card className="bg-[#0D0D0D] border-[#ECAC36]/30 mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#ECAC36] text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Review Panel
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleApplySelected}
                  className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Apply Selected
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowPanel(false)
                    setResult(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* SEO Section */}
            {(result.seoTitle || result.seoDescription) && (
              <div className="border border-[#333333] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("seo")}
                  className="w-full flex items-center justify-between p-3 bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={applySeo}
                      onChange={(e) => {
                        e.stopPropagation()
                        setApplySeo(e.target.checked)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-[#ECAC36]"
                    />
                    <span className="text-white font-medium">SEO Title & Meta Description</span>
                  </div>
                  {expandedSections.has("seo") ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {expandedSections.has("seo") && (
                  <div className="p-3 space-y-3">
                    {result.seoTitle && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">
                            SEO Title ({result.seoTitle.length} chars)
                          </span>
                          <span
                            className={`text-xs ${result.seoTitle.length >= 55 && result.seoTitle.length <= 60 ? "text-green-400" : "text-yellow-400"}`}
                          >
                            Target: 55-60
                          </span>
                        </div>
                        <div className="bg-[#0A0A0A] border border-[#333333] rounded p-2 text-sm text-white">
                          {result.seoTitle}
                        </div>
                      </div>
                    )}
                    {result.seoDescription && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">
                            Meta Description ({result.seoDescription.length} chars)
                          </span>
                          <span
                            className={`text-xs ${result.seoDescription.length >= 150 && result.seoDescription.length <= 160 ? "text-green-400" : "text-yellow-400"}`}
                          >
                            Target: 150-160
                          </span>
                        </div>
                        <div className="bg-[#0A0A0A] border border-[#333333] rounded p-2 text-sm text-white">
                          {result.seoDescription}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Description Section */}
            {result.description && (
              <div className="border border-[#333333] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("description")}
                  className="w-full flex items-center justify-between p-3 bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={applyDescription}
                      onChange={(e) => {
                        e.stopPropagation()
                        setApplyDescription(e.target.checked)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-[#ECAC36]"
                    />
                    <span className="text-white font-medium">Listing Description (HTML)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewMode(previewMode === "preview" ? "html" : "preview")
                      }}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 border border-[#333333] rounded"
                    >
                      {previewMode === "preview" ? (
                        <>
                          <Code className="h-3 w-3" /> HTML
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" /> Preview
                        </>
                      )}
                    </button>
                    {expandedSections.has("description") ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>
                {expandedSections.has("description") && (
                  <div className="p-3">
                    {previewMode === "preview" ? (
                      <div
                        className="bg-[#0A0A0A] border border-[#333333] rounded p-4 text-sm text-gray-200 prose prose-invert prose-sm max-w-none
                          [&_h3]:text-[#ECAC36] [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2
                          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                          [&_a]:text-[#ECAC36] [&_a]:underline [&_a]:hover:text-[#B8860B]
                          [&_p]:mb-3"
                        dangerouslySetInnerHTML={{ __html: result.description }}
                      />
                    ) : (
                      <div className="relative">
                        <pre className="bg-[#0A0A0A] border border-[#333333] rounded p-4 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                          {result.description}
                        </pre>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(result.description || "")
                            toast.success("HTML copied!")
                          }}
                          className="absolute top-2 right-2 p-1 bg-[#222222] rounded hover:bg-[#333333]"
                        >
                          <Copy className="h-3 w-3 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Specifications Section */}
            {result.specifications && Object.keys(result.specifications).length > 0 && (
              <div className="border border-[#333333] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("specs")}
                  className="w-full flex items-center justify-between p-3 bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-white font-medium">
                    Specifications ({selectedSpecs.size} selected)
                  </span>
                  {expandedSections.has("specs") ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {expandedSections.has("specs") && (
                  <div className="p-3 space-y-2">
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={selectAllSpecs}
                        className="text-xs text-[#ECAC36] hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-xs text-gray-500">|</span>
                      <button
                        type="button"
                        onClick={deselectAllSpecs}
                        className="text-xs text-gray-400 hover:underline"
                      >
                        Deselect All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(result.specifications)
                        .filter(([_, val]) => val && val.value !== null && val.value !== undefined)
                        .map(([key, val]) => {
                          const currentVal = currentValues.specifications?.[key]
                          const hasCurrentValue =
                            currentVal !== null &&
                            currentVal !== undefined &&
                            currentVal !== "" &&
                            currentVal !== "null"
                          const isLowConfidence = val.confidence < CONFIDENCE_THRESHOLD
                          const isSelected = selectedSpecs.has(key)

                          return (
                            <div
                              key={key}
                              onClick={() => toggleSpec(key)}
                              className={`flex items-start gap-2 p-2 rounded cursor-pointer border transition-colors ${
                                isSelected
                                  ? "border-[#ECAC36]/50 bg-[#ECAC36]/5"
                                  : "border-[#222222] bg-[#0A0A0A] hover:border-[#333333]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSpec(key)}
                                className="accent-[#ECAC36] mt-1 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">
                                    {formatSpecLabel(key)}
                                  </span>
                                  {isLowConfidence && (
                                    <AlertTriangle className="h-3 w-3 text-red-400 flex-shrink-0" />
                                  )}
                                  <span
                                    className={`text-xs ${getConfidenceColor(val.confidence)}`}
                                  >
                                    {Math.round(val.confidence * 100)}%
                                  </span>
                                </div>
                                <div className="text-sm text-white truncate">
                                  {formatSpecValue(val.value)}
                                </div>
                                {hasCurrentValue && (
                                  <div className="text-xs text-gray-500 truncate">
                                    Current: {formatSpecValue(currentVal)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                    </div>

                    {Object.entries(result.specifications).some(
                      ([_, val]) => val && val.confidence < CONFIDENCE_THRESHOLD
                    ) && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        Items marked with low confidence need manual review
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* JSON-LD Schema Section */}
            {result.schemaJsonLd && (
              <div className="border border-[#333333] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("schema")}
                  className="w-full flex items-center justify-between p-3 bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={applySchema}
                      onChange={(e) => {
                        e.stopPropagation()
                        setApplySchema(e.target.checked)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-[#ECAC36]"
                    />
                    <span className="text-white font-medium">JSON-LD Schema</span>
                  </div>
                  {expandedSections.has("schema") ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {expandedSections.has("schema") && (
                  <div className="p-3">
                    <div className="relative">
                      <pre className="bg-[#0A0A0A] border border-[#333333] rounded p-4 text-xs text-gray-300 overflow-x-auto max-h-60">
                        {JSON.stringify(result.schemaJsonLd, null, 2)}
                      </pre>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(result.schemaJsonLd, null, 2))
                          toast.success("Schema JSON copied!")
                        }}
                        className="absolute top-2 right-2 p-1 bg-[#222222] rounded hover:bg-[#333333]"
                      >
                        <Copy className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image ALTs Section */}
            {result.imageAlts && result.imageAlts.length > 0 && (
              <div className="border border-[#333333] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection("imageAlts")}
                  className="w-full flex items-center justify-between p-3 bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={applyImageAlts}
                      onChange={(e) => {
                        e.stopPropagation()
                        setApplyImageAlts(e.target.checked)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-[#ECAC36]"
                    />
                    <span className="text-white font-medium">
                      Image ALT Text ({result.imageAlts.length} images)
                    </span>
                  </div>
                  {expandedSections.has("imageAlts") ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {expandedSections.has("imageAlts") && (
                  <div className="p-3 space-y-2">
                    {result.imageAlts.map((alt, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2 bg-[#0A0A0A] border border-[#222222] rounded"
                      >
                        <span className="text-xs text-gray-500 mt-0.5 flex-shrink-0 w-6 text-right">
                          {i === 0 ? "Hero" : `#${i + 1}`}
                        </span>
                        <span className="text-sm text-gray-200">{alt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Apply Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#333333]">
              <p className="text-xs text-gray-500">
                Review each section above. Toggle checkboxes to include/exclude from apply.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={handleApplySelected}
                className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
              >
                <Check className="mr-1 h-4 w-4" />
                Apply Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
