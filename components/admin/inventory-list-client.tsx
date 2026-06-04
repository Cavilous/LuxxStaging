"use client"

import { useState, useTransition, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Eye, EyeOff, Loader2, Star, Sparkles, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { deleteInventoryItem, duplicateInventoryItem, togglePublishStatus, toggleFeaturedStatus } from "@/lib/inventory-actions"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { SortableHeader } from "@/components/admin/sortable-header"

interface InventoryItem {
  id: string
  title: string
  subtitle: string | null
  images: any
  pricePerDay: string | null
  pricePerHour: string | null
  pricePer4Hr: string | null
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date | null
  category: string
  specifications: any
  focalPoint: string | null
  flipHorizontal: boolean | null
  flipVertical: boolean | null
  aiContentGenerated: boolean | null
}

interface InventoryListClientProps {
  items: InventoryItem[]
  category: "car" | "yacht" | "villa" | "jet"
  icon: ReactNode
}

export function InventoryListClient({ items, category, icon }: InventoryListClientProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryHref = category === "villa" ? "houses" : `${category}s`

  const getEditUrl = (itemId: string) => {
    const currentParams = searchParams.toString()
    const returnUrl = currentParams ? `?${currentParams}` : ""
    return `/admin/${categoryHref}/${itemId}/edit${returnUrl ? `?returnUrl=${encodeURIComponent(`/admin/${categoryHref}${returnUrl}`)}` : ""}`
  }

  const handleDelete = (id: string) => {
    if (deleteId !== id) {
      setDeleteId(id)
      return
    }

    startTransition(() => {
      deleteInventoryItem(id).then((result) => {
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Item deleted successfully")
          setDeleteId(null)
          router.refresh()
        }
      })
    })
  }

  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  const handleDuplicate = (id: string) => {
    setDuplicatingId(id)
    startTransition(() => {
      duplicateInventoryItem(id).then((result) => {
        if (result.error) {
          toast.error(result.error)
        } else if (result.data) {
          toast.success("Item duplicated as draft")
          router.push(getEditUrl(result.data.id))
        }
      }).catch(() => {
        toast.error("Failed to duplicate item")
      }).finally(() => {
        setDuplicatingId(null)
      })
    })
  }

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    startTransition(() => {
      togglePublishStatus(id, !currentStatus).then((result) => {
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success(currentStatus ? "Item unpublished" : "Item published")
          router.refresh()
        }
      })
    })
  }

  const handleToggleFeatured = (id: string, currentStatus: boolean) => {
    startTransition(() => {
      toggleFeaturedStatus(id, !currentStatus).then((result) => {
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success(currentStatus ? "Removed from featured" : "Added to featured")
          router.refresh()
        }
      })
    })
  }

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  const handleBulkPublish = () => {
    startTransition(() => {
      const promises = selectedItems.map((id) => {
        const item = items.find((i) => i.id === id)
        if (item && !item.isPublished) {
          return togglePublishStatus(id, true)
        }
        return Promise.resolve({ success: "Already published" })
      })
      
      Promise.all(promises).then((results) => {
        const errors = results.filter((r) => 'error' in r && r.error)
        if (errors.length > 0) {
          toast.error(`Failed to publish ${errors.length} item(s)`)
        } else {
          toast.success(`Successfully published ${selectedItems.length} item(s)`)
          setSelectedItems([])
          router.refresh()
        }
      })
    })
  }

  const handleBulkDraft = () => {
    startTransition(() => {
      const promises = selectedItems.map((id) => {
        const item = items.find((i) => i.id === id)
        if (item && item.isPublished) {
          return togglePublishStatus(id, false)
        }
        return Promise.resolve({ success: "Already draft" })
      })
      
      Promise.all(promises).then((results) => {
        const errors = results.filter((r) => 'error' in r && r.error)
        if (errors.length > 0) {
          toast.error(`Failed to unpublish ${errors.length} item(s)`)
        } else {
          toast.success(`Successfully unpublished ${selectedItems.length} item(s)`)
          setSelectedItems([])
          router.refresh()
        }
      })
    })
  }

  const handleBulkDelete = () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)? This action cannot be undone.`)) {
      return
    }

    startTransition(() => {
      const promises = selectedItems.map((id) => deleteInventoryItem(id))
      
      Promise.all(promises).then((results) => {
        const errors = results.filter((r) => 'error' in r && r.error)
        if (errors.length > 0) {
          toast.error(`Failed to delete ${errors.length} item(s)`)
        } else {
          toast.success(`Successfully deleted ${selectedItems.length} item(s)`)
          setSelectedItems([])
          router.refresh()
        }
      })
    })
  }

  const getCategoryHref = () => categoryHref

  const getPriceDisplay = (item: InventoryItem) => {
    if (category === "car") {
      return { price: `$${item.pricePerDay}`, unit: "/day" }
    }
    if (category === "yacht") {
      return { price: `$${item.pricePer4Hr || item.pricePerHour}`, unit: item.pricePer4Hr ? "/4h" : "/hr" }
    }
    if (category === "villa") {
      return { price: `$${item.pricePerDay}`, unit: "/night" }
    }
    if (category === "jet") {
      return { price: `$${item.pricePerHour || item.pricePerDay}`, unit: item.pricePerHour ? "/hr" : "/day" }
    }
    return { price: "N/A", unit: "" }
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="mb-4 bg-[#0A0A0A] border border-[#ECAC36]/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkPublish}
                disabled={isPending}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Eye className="h-4 w-4 mr-1" />
                Publish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDraft}
                disabled={isPending}
                className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
              >
                <EyeOff className="h-4 w-4 mr-1" />
                Draft
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                disabled={isPending}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333333]">
              <th className="text-left py-3 px-4 w-12">
                <Checkbox
                  checked={selectedItems.length === items.length && items.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-[#ECAC36] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:border-[#ECAC36]"
                />
              </th>
              <th className="text-left py-3 px-4">
              <SortableHeader 
                column="title" 
                label={category === "car" ? "Car" : category === "yacht" ? "Yacht" : category === "jet" ? "Jet" : "Villa"} 
              />
            </th>
            <th className="text-left py-3 px-4">
              <SortableHeader column="price" label="Price" />
            </th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Featured</th>
            <th className="text-center py-3 px-4 text-gray-300 font-medium">AI</th>
            <th className="text-left py-3 px-4">
              <SortableHeader column="created" label="Created" />
            </th>
            <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => {
            let images: string[] = []
            try {
              if (typeof item.images === 'string') {
                images = JSON.parse(item.images)
              } else if (Array.isArray(item.images)) {
                images = item.images
              }
            } catch (e) {
              images = []
            }
            const coverImage = images[0] || null
            const { price, unit } = getPriceDisplay(item)
            
            const getObjectPosition = () => {
              if (!item.focalPoint) return "center"
              const [x, y] = item.focalPoint.split(" ")
              return `${x} ${y}`
            }
            
            const getFlipTransform = () => {
              const transforms: string[] = []
              if (item.flipHorizontal) transforms.push("scaleX(-1)")
              if (item.flipVertical) transforms.push("scaleY(-1)")
              return transforms.length > 0 ? transforms.join(" ") : undefined
            }
            
            return (
              <tr key={item.id} className="border-b border-[#333333] hover:bg-[#0A0A0A]">
                <td className="py-4 px-4">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                    className="border-[#ECAC36] data-[state=checked]:bg-[#ECAC36] data-[state=checked]:border-[#ECAC36]"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-[#0A0A0A] border border-[#333333]">
                      {coverImage ? (
                        <Image
                          src={coverImage}
                          alt={item.title || 'Item'}
                          fill
                          className="object-cover"
                          style={{
                            objectPosition: getObjectPosition(),
                            transform: getFlipTransform(),
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {icon}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="text-sm text-gray-400">{item.subtitle}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-[#ECAC36]">{price}<span className="text-gray-400 text-sm">{unit}</span></div>
                </td>
                <td className="py-4 px-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTogglePublish(item.id, item.isPublished)}
                    disabled={isPending}
                    className="p-0 h-auto hover:bg-transparent"
                  >
                    {item.isPublished ? (
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/50 cursor-pointer hover:bg-green-500/20">
                        <Eye className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/50 cursor-pointer hover:bg-gray-500/20">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                  </Button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.isFeatured}
                      onCheckedChange={() => handleToggleFeatured(item.id, item.isFeatured)}
                      disabled={isPending}
                      className="data-[state=checked]:bg-[#ECAC36]"
                    />
                    {item.isFeatured && (
                      <Star className="h-4 w-4 text-[#ECAC36] fill-[#ECAC36]" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  {item.aiContentGenerated ? (
                    <span title="AI content generated" className="inline-flex items-center gap-1 text-green-400">
                      <Sparkles className="h-4 w-4" />
                    </span>
                  ) : (
                    <span title="No AI content" className="text-red-400/60">
                      <svg className="h-4 w-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-gray-400">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={getEditUrl(item.id)}>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-[#ECAC36]"
                      onClick={() => handleDuplicate(item.id)}
                      disabled={isPending || duplicatingId === item.id}
                      title="Duplicate"
                    >
                      {duplicatingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className={deleteId === item.id ? "text-white bg-red-600 hover:bg-red-700" : "text-red-400 hover:text-red-300"}
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      title="Delete"
                    >
                      {isPending && deleteId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          {deleteId === item.id && <span className="ml-1 text-xs">Confirm?</span>}
                        </>
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    </>
  )
}
