"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Copy, ExternalLink, Check, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { normalizeImageUrl } from "@/lib/media-utils"

interface InventoryItem {
  id: string
  title: string
  category: string
  slug: string | null
  subtitle: string | null
  brandSlug: string | null
  pricePerDay: number | null
  pricePer4Hr: number | null
  images: unknown[]
  isPublished: boolean
}

interface DuplicateGroup {
  key: string
  items: InventoryItem[]
  similarity: number
  reason: string
}

export default function DuplicatesPage() {
  const [loading, setLoading] = useState(true)
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  
  useEffect(() => {
    fetchDuplicates()
  }, [categoryFilter])
  
  const fetchDuplicates = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/duplicates?category=${categoryFilter}`)
      const data = await res.json()
      setDuplicates(data.duplicates || [])
    } catch (error) {
      console.error('Error fetching duplicates:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const togglePublish = async (itemId: string, currentStatus: boolean) => {
    setUpdating(itemId)
    try {
      const res = await fetch('/api/admin/inventory/toggle-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, isPublished: !currentStatus })
      })
      
      if (res.ok) {
        await fetchDuplicates()
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
    } finally {
      setUpdating(null)
    }
  }
  
  const getCategoryPath = (category: string) => {
    if (category === 'villa') return 'houses'
    return `${category}s`
  }
  
  const getPrice = (item: InventoryItem) => {
    if (item.pricePerDay) return `$${item.pricePerDay.toLocaleString()}/day`
    if (item.pricePer4Hr) return `$${item.pricePer4Hr.toLocaleString()}/4hr`
    return 'No price'
  }
  
  const getPrimaryImage = (images: unknown[]): string | null => {
    if (!Array.isArray(images) || images.length === 0) return null
    const first = images[0]
    if (typeof first === 'string') return normalizeImageUrl(first)
    if (first && typeof first === 'object' && 'url' in first) {
      return normalizeImageUrl((first as { url: string }).url)
    }
    return null
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Duplicate Detection</h1>
            <p className="text-gray-400">Find and manage potential duplicate listings</p>
          </div>
          <Button onClick={fetchDuplicates} variant="outline" className="border-[#ECAC36] text-[#ECAC36]">
            Refresh
          </Button>
        </div>
        
        <Card className="bg-charcoal border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <div className="flex items-center gap-4">
              <CardTitle className="text-white">Filter by Category</CardTitle>
              <div className="flex gap-2">
                {['all', 'car', 'yacht', 'villa'].map(cat => (
                  <Badge
                    key={cat}
                    variant={categoryFilter === cat ? 'admin-gold' : 'admin-category'}
                    className="cursor-pointer capitalize"
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat === 'all' ? 'All' : cat === 'villa' ? 'Villas' : `${cat}s`}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#ECAC36]" />
                <span className="ml-3 text-gray-400">Analyzing inventory for duplicates...</span>
              </div>
            ) : duplicates.length === 0 ? (
              <div className="text-center py-12">
                <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-gray-400">No potential duplicates found</p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-400">
                  Found {duplicates.length} potential duplicate group{duplicates.length !== 1 ? 's' : ''}
                </p>
                
                {duplicates.map((group, groupIndex) => (
                  <Card key={group.key} className="bg-gray-900/50 border-yellow-500/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Copy className="h-5 w-5 text-yellow-400" />
                        <div>
                          <CardTitle className="text-lg text-white">
                            Potential Duplicate Group #{groupIndex + 1}
                          </CardTitle>
                          <p className="text-sm text-yellow-300">
                            {group.reason} ({group.similarity}% match)
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {group.items.map((item) => (
                          <div 
                            key={item.id} 
                            className={`flex items-center gap-4 p-3 rounded-lg ${
                              item.isPublished ? 'bg-gray-800/50' : 'bg-gray-800/30 opacity-60'
                            }`}
                          >
                            <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                              {getPrimaryImage(item.images) ? (
                                <Image
                                  src={getPrimaryImage(item.images)!}
                                  alt={item.title}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                  No img
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-white font-medium truncate">{item.title}</h4>
                                {!item.isPublished && (
                                  <Badge variant="admin-category" className="text-xs">
                                    Unpublished
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                <span className="capitalize">{item.category}</span>
                                <span>•</span>
                                <span>{getPrice(item)}</span>
                                {item.subtitle && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate">{item.subtitle}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => togglePublish(item.id, item.isPublished)}
                                disabled={updating === item.id}
                                className={item.isPublished ? 'border-yellow-500 text-yellow-500' : 'border-green-500 text-green-500'}
                              >
                                {updating === item.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : item.isPublished ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-1" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-1" />
                                    Publish
                                  </>
                                )}
                              </Button>
                              
                              <Link href={`/admin/${getCategoryPath(item.category)}/${item.id}/edit?returnUrl=/admin/duplicates`}>
                                <Button size="sm" className="bg-[#ECAC36] hover:bg-[#B8860B] text-black">
                                  Edit
                                </Button>
                              </Link>
                              
                              {item.slug && (
                                <Link href={`/${getCategoryPath(item.category)}/${item.slug}`} target="_blank">
                                  <Button size="sm" variant="outline" className="border-gray-600">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-charcoal border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p className="font-medium text-white mb-1">Detection Heuristics</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Exact title match across different listings</li>
                  <li>Same title + brand combination</li>
                  <li>Similar title with identical specs</li>
                  <li>Matching slug patterns</li>
                </ul>
                <p className="mt-2 text-yellow-300">
                  Note: Unpublishing hides the item from the public site but preserves all data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
