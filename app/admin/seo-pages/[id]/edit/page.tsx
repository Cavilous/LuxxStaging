'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, ExternalLink, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchSeoPageById, saveSeoPage } from "../../actions"

interface SeoPage {
  id: string
  slug: string
  pageType: string
  city: string
  category: string
  brand: string | null
  model: string | null
  intent: string | null
  title: string
  h1: string
  metaTitle: string | null
  metaDescription: string | null
  content: string | null
  contentStatus: string
  isPublished: boolean
  isIndexable: boolean
  canonicalUrl: string | null
  redirectTo: string | null
  unitCount: number
}

export default function EditSeoPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [page, setPage] = useState<SeoPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [h1, setH1] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [isIndexable, setIsIndexable] = useState(true)
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [redirectTo, setRedirectTo] = useState('')

  useEffect(() => {
    async function load() {
      const data = await fetchSeoPageById(id)
      if (data) {
        setPage(data as any)
        setTitle(data.title)
        setH1(data.h1)
        setMetaTitle(data.metaTitle || '')
        setMetaDescription(data.metaDescription || '')
        setContent(data.content || '')
        setIsPublished(data.isPublished)
        setIsIndexable(data.isIndexable)
        setCanonicalUrl(data.canonicalUrl || '')
        setRedirectTo(data.redirectTo || '')
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await saveSeoPage(id, {
        title,
        h1,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        content: content || undefined,
        isPublished,
        isIndexable,
        canonicalUrl: canonicalUrl || null,
        redirectTo: redirectTo || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleGenerate() {
    if (!page) return
    setGenerating(true)
    setGenerateError(null)
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
      const data = await res.json()
      if (!res.ok) {
        setGenerateError(data.error || 'Failed to generate content')
        return
      }
      if (data.h1) setH1(data.h1)
      if (data.metaTitle) setMetaTitle(data.metaTitle)
      if (data.metaDescription) setMetaDescription(data.metaDescription)
      if (data.content) setContent(data.content)
    } catch (err) {
      setGenerateError('Network error  -  please try again')
      console.error('Generate error:', err)
    } finally {
      setGenerating(false)
    }
  }

  const hasContent = page?.contentStatus !== 'pending' && content.trim().length > 0

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!page) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">SEO page not found</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/seo-pages">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit SEO Page</h1>
              <p className="text-gray-400 font-mono text-sm">/{page.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/${page.slug}`} target="_blank">
              <Button variant="outline" size="sm" className="border-[#333333] text-gray-300 hover:text-white">
                <ExternalLink className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </Link>
            <Button
              onClick={handleGenerate}
              disabled={generating || saving}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:text-purple-100 hover:bg-purple-500/10"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-1" />
              )}
              {generating ? 'Generating...' : hasContent ? 'Regenerate AI' : 'Generate AI'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold"
            >
              <Save className="h-4 w-4 mr-1" />
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
            </Button>
          </div>
        </div>

        {generateError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {generateError}
          </div>
        )}

        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white">Page Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="text-white ml-2">{page.pageType}</span>
              </div>
              <div>
                <span className="text-gray-400">City:</span>
                <span className="text-white ml-2 capitalize">{page.city.replace(/-/g, ' ')}</span>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>
                <span className="text-white ml-2 capitalize">{page.category}</span>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Units:</span>
              <span className={`ml-2 ${page.unitCount === 0 ? 'text-orange-400' : 'text-white'}`}>
                {page.unitCount} {page.unitCount === 0 && '(orphan - no inventory)'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white">Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-300">H1</Label>
              <Input
                value={h1}
                onChange={(e) => setH1(e.target.value)}
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Meta Title</Label>
                <span className={`text-xs ${metaTitle.length > 60 ? 'text-red-400' : metaTitle.length > 50 ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {metaTitle.length}/60
                </span>
              </div>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
                placeholder="Target: 60 characters"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">Meta Description</Label>
                <span className={`text-xs ${metaDescription.length > 155 ? 'text-red-400' : metaDescription.length > 140 ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {metaDescription.length}/155
                </span>
              </div>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
                rows={3}
                placeholder="Target: 155 characters"
              />
            </div>

            <div>
              <Label className="text-gray-300">Content (HTML)</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1 font-mono text-xs"
                rows={12}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Published</Label>
                <p className="text-gray-500 text-xs">Page is visible to users</p>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Indexable</Label>
                <p className="text-gray-500 text-xs">Allow search engines to index this page</p>
              </div>
              <Switch checked={isIndexable} onCheckedChange={setIsIndexable} />
            </div>

            <div>
              <Label className="text-gray-300">Canonical URL</Label>
              <Input
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
                placeholder="Leave empty for self-referencing"
              />
            </div>

            <div>
              <Label className="text-gray-300">Redirect To</Label>
              <Input
                value={redirectTo}
                onChange={(e) => setRedirectTo(e.target.value)}
                className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
                placeholder="Set to redirect this slug to another URL"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
