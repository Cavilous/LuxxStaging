"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Globe, ExternalLink } from "lucide-react"
import { SERVICE_CITIES } from "@/lib/seo-constants"

interface SeoPreviewPanelProps {
  category: string
  brand: string
  model: string
  bodyType: string
  serviceCities: string[]
  tags: string[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const CATEGORY_URL_SEGMENTS: Record<string, string> = {
  car: 'exotic-car-rental',
  yacht: 'yacht-charter',
  villa: 'luxury-villa-rental',
}

export function SeoPreviewPanel({
  category,
  brand,
  model,
  bodyType,
  serviceCities,
  tags,
}: SeoPreviewPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const pages = useMemo(() => {
    const result: { slug: string; type: string }[] = []
    const cities = serviceCities.length > 0 ? serviceCities : ['miami']
    const hubSegment = CATEGORY_URL_SEGMENTS[category] || 'exotic-car-rental'

    for (const city of cities) {
      result.push({
        slug: `/${city}/${hubSegment}`,
        type: 'City Hub',
      })

      if (brand) {
        const brandSlug = slugify(brand)
        result.push({
          slug: `/${city}/${brandSlug}-rental`,
          type: 'Brand + City',
        })

        if (model) {
          const modelSlug = slugify(model)
          result.push({
            slug: `/${city}/${brandSlug}-${modelSlug}-rental`,
            type: 'Model + City',
          })
        }
      }
    }

    const seen = new Set<string>()
    return result.filter(p => {
      if (seen.has(p.slug)) return false
      seen.add(p.slug)
      return true
    })
  }, [category, brand, model, bodyType, serviceCities, tags])

  const cityNames = serviceCities
    .map(slug => SERVICE_CITIES.find(c => c.slug === slug)?.name || slug)
    .join(', ')

  return (
    <Card className="bg-[#111111] border-[#333333] cut-corner">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#ECAC36]" />
            <CardTitle className="text-white">SEO Pages Preview</CardTitle>
            <span className="text-sm text-gray-400 ml-2">
              {pages.length} page{pages.length !== 1 ? 's' : ''} will be created
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          {pages.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Add a brand and select service cities to preview SEO pages.
            </p>
          ) : (
            <div className="space-y-2">
              {cityNames && (
                <p className="text-xs text-gray-500 mb-3">
                  Serving: {cityNames}
                </p>
              )}
              {pages.map((page) => (
                <div
                  key={page.slug}
                  className="flex items-center justify-between px-3 py-2 bg-[#0A0A0A] border border-[#222222] rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#333333] text-gray-400">
                      {page.type}
                    </span>
                    <span className="text-sm text-gray-200 font-mono">
                      {page.slug}
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-gray-600" />
                </div>
              ))}
              <p className="text-xs text-gray-600 mt-3">
                Pages are created automatically when this item is published. Intent pages (convertible, wedding, etc.) are generated based on body type and tags.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
