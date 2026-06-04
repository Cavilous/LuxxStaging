'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Link2, Loader2, Sparkles } from "lucide-react"
import { fetchPendingSeoPages } from "./actions"

interface SeoPage {
  id: string
  slug: string
  pageType: string
  city: string
  category: string
  title: string
  h1: string
  unitCount: number
  isPublished: boolean
  isIndexable: boolean
  contentStatus: string
  updatedAt: string
}

const PAGE_TYPE_COLORS: Record<string, string> = {
  'city-hub': 'bg-blue-600',
  'brand-city': 'bg-purple-600',
  'model-city': 'bg-green-600',
  'intent-city': 'bg-orange-600',
}

const CONTENT_STATUS_COLORS: Record<string, string> = {
  'pending': 'bg-yellow-600',
  'draft': 'bg-gray-600',
  'review': 'bg-blue-600',
  'published': 'bg-green-600',
}

export function SeoPagesList({
  initialPages,
  cities,
  initialFilters,
}: {
  initialPages: SeoPage[]
  cities: { slug: string; name: string }[]
  initialFilters: { pageType: string; city: string; category: string }
}) {
  const router = useRouter()
  const [bulkGenerating, setBulkGenerating] = useState(false)
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 })
  const [bulkError, setBulkError] = useState<string | null>(null)

  const pendingCount = initialPages.filter(p => p.contentStatus === 'pending').length

  async function handleBulkGenerate() {
    setBulkGenerating(true)
    setBulkError(null)
    try {
      const pendingPages = await fetchPendingSeoPages()
      if (pendingPages.length === 0) {
        setBulkError("No pending pages found")
        setBulkGenerating(false)
        return
      }

      setBulkProgress({ current: 0, total: pendingPages.length })

      for (let i = 0; i < pendingPages.length; i++) {
        const page = pendingPages[i]
        setBulkProgress({ current: i + 1, total: pendingPages.length })

        try {
          const res = await fetch('/api/admin/generate-seo-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              seoPageId: page.id,
              pageType: page.pageType,
              city: page.city,
              brand: page.brand,
              model: page.model,
              intent: page.intent,
              category: page.category,
              unitCount: page.unitCount,
            }),
          })

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}))
            console.error(`Failed to generate for ${page.slug}:`, errData.error || res.statusText)
          }
        } catch (err) {
          console.error(`Error generating for ${page.slug}:`, err)
        }
      }

      router.refresh()
    } catch (err) {
      setBulkError(err instanceof Error ? err.message : "Failed to fetch pending pages")
    } finally {
      setBulkGenerating(false)
      setBulkProgress({ current: 0, total: 0 })
    }
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams()
    const current = { ...initialFilters, [key]: value }
    if (current.pageType) params.set('pageType', current.pageType)
    if (current.city) params.set('city', current.city)
    if (current.category) params.set('category', current.category)
    router.push(`/admin/seo-pages?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">SEO Pages</h1>
          <p className="text-gray-400">Manage SEO landing pages ({initialPages.length} total)</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <button
              onClick={handleBulkGenerate}
              disabled={bulkGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-[#ECAC36] text-black font-medium hover:bg-[#d49a2e] disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
            >
              {bulkGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating {bulkProgress.current}/{bulkProgress.total}...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Content for Pending ({pendingCount})
                </>
              )}
            </button>
          )}
          <Link href="/admin/seo-pages/intent-mappings">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#333333] text-gray-300 hover:text-white hover:border-[#ECAC36] rounded text-sm transition-colors">
              <Link2 className="h-4 w-4" />
              Intent Mappings
            </button>
          </Link>
        </div>
      </div>

      {bulkError && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded text-sm">
          {bulkError}
        </div>
      )}

      <Card className="bg-[#111111] border-[#333333]">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={initialFilters.pageType}
              onChange={(e) => updateFilter('pageType', e.target.value)}
              className="bg-[#0A0A0A] border border-[#333333] text-white rounded px-3 py-2 text-sm"
            >
              <option value="">All Page Types</option>
              <option value="city-hub">City Hub</option>
              <option value="brand-city">Brand City</option>
              <option value="model-city">Model City</option>
              <option value="intent-city">Intent City</option>
            </select>

            <select
              value={initialFilters.city}
              onChange={(e) => updateFilter('city', e.target.value)}
              className="bg-[#0A0A0A] border border-[#333333] text-white rounded px-3 py-2 text-sm"
            >
              <option value="">All Cities</option>
              {cities.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>

            <select
              value={initialFilters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="bg-[#0A0A0A] border border-[#333333] text-white rounded px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              <option value="car">Car</option>
              <option value="yacht">Yacht</option>
              <option value="villa">Villa</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#111111] border-[#333333]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            SEO Pages ({initialPages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {initialPages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No SEO pages found matching filters
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#333333] text-gray-400">
                    <th className="text-left py-3 px-2">Slug</th>
                    <th className="text-left py-3 px-2">Page Type</th>
                    <th className="text-left py-3 px-2">City</th>
                    <th className="text-left py-3 px-2">Title</th>
                    <th className="text-center py-3 px-2">Units</th>
                    <th className="text-center py-3 px-2">Published</th>
                    <th className="text-center py-3 px-2">Index</th>
                    <th className="text-left py-3 px-2">Content</th>
                    <th className="text-left py-3 px-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {initialPages.map((page) => (
                    <tr
                      key={page.id}
                      className={`border-b border-[#222222] hover:bg-[#1a1a1a] transition-colors ${
                        page.unitCount === 0 ? 'bg-orange-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-2">
                        <Link
                          href={`/admin/seo-pages/${page.id}/edit`}
                          className="text-[#ECAC36] hover:underline font-mono text-xs"
                        >
                          {page.slug}
                        </Link>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={`${PAGE_TYPE_COLORS[page.pageType] || 'bg-gray-600'} text-white text-xs`}>
                          {page.pageType}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-gray-300 capitalize">
                        {page.city.replace(/-/g, ' ')}
                      </td>
                      <td className="py-3 px-2 text-white max-w-[200px] truncate">
                        {page.title}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={page.unitCount === 0 ? 'text-orange-400 font-bold' : 'text-gray-300'}>
                          {page.unitCount}
                          {page.unitCount === 0 && ' ⚠'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={page.isPublished ? 'text-green-400' : 'text-red-400'}>
                          {page.isPublished ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={page.isIndexable ? 'text-green-400' : 'text-yellow-400'}>
                          {page.isIndexable ? '✓' : 'noindex'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={`${CONTENT_STATUS_COLORS[page.contentStatus] || 'bg-gray-600'} text-white text-xs`}>
                          {page.contentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-gray-400 text-xs">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
