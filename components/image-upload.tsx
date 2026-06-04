"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, ImageIcon, GripVertical, Star, Loader2, AlertCircle, RefreshCw, ArrowUp, ChevronUp, ChevronDown } from "lucide-react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { toast } from "sonner"
import type { ImageEntry, ImageObject } from "@/lib/image-types"
import { getImageUrl, isImageObject, getImageMeta } from "@/lib/image-types"
import { normalizeImageUrl } from "@/lib/image-url-utils"

interface ImageUploadProps {
  images?: ImageEntry[]
  setImages?: (entries: ImageEntry[]) => void
  value?: ImageEntry[]
  onChange?: (entries: ImageEntry[]) => void
  maxImages?: number
  label?: string
  onUploadingChange?: (isUploading: boolean) => void
  onHasErrors?: (hasErrors: boolean) => void
  itemTitle?: string
}

interface PendingUpload {
  id: string
  localUrl: string
  file: File
  status: 'uploading' | 'success' | 'error'
  serverUrl?: string
  errorMessage?: string
  errorCode?: string
}

function formatBytes(bytes: number | undefined): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function getEntryDisplayUrl(entry: ImageEntry): string {
  return getImageUrl(entry)
}

function getEntryDragId(entry: ImageEntry): string {
  if (typeof entry === 'string') return entry
  return entry.hqUrl
}

export function ImageUpload({ 
  images: imagesProp, 
  setImages: setImagesProp,
  value,
  onChange,
  maxImages = 100, 
  label = "Images",
  onUploadingChange,
  onHasErrors,
  itemTitle = 'image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([])
  const objectUrlsRef = useRef<string[]>([])
  
  const images: ImageEntry[] = imagesProp ?? value ?? []
  const setImages = setImagesProp ?? onChange ?? (() => {})
  
  // Track current images in a ref to avoid stale closure issues during parallel uploads
  const imagesRef = useRef(images)
  imagesRef.current = images

  const hasErrors = pendingUploads.some(p => p.status === 'error')
  const isUploading = pendingUploads.some(p => p.status === 'uploading')
  
  useEffect(() => {
    onUploadingChange?.(isUploading)
  }, [isUploading, onUploadingChange])

  useEffect(() => {
    onHasErrors?.(hasErrors)
  }, [hasErrors, onHasErrors])

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const uploadSingleFile = async (pending: PendingUpload, index: number = 0): Promise<{ success: boolean; serverUrl?: string; imageObject?: ImageObject; error?: string; errorCode?: string }> => {
    const formData = new FormData()
    formData.append("file", pending.file)

    console.log(`[ImageUpload] Starting upload: ${pending.file.name} (${(pending.file.size / 1024 / 1024).toFixed(2)}MB)`)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          'x-item-title': itemTitle,
          'x-image-index': String(index),
        },
      })

      const responseData = await response.json().catch(() => ({}))

      if (!response.ok) {
        const errorMsg = responseData.error || `Upload failed with status ${response.status}`
        const errorCode = responseData.code || 'UNKNOWN'
        
        console.error(`[ImageUpload] Upload failed for ${pending.file.name}:`, {
          status: response.status,
          error: errorMsg,
          code: errorCode,
          fileName: pending.file.name,
          fileSize: pending.file.size,
          fileType: pending.file.type
        })

        toast.error(`Upload failed: ${pending.file.name}`, {
          description: errorMsg,
          duration: 8000,
        })

        return { success: false, error: errorMsg, errorCode }
      }

      console.log(`[ImageUpload] Upload successful for ${pending.file.name}: ${responseData.url}`)
      
      return { success: true, serverUrl: responseData.url, imageObject: responseData.imageObject }
    } catch (networkError) {
      const errorMsg = networkError instanceof Error ? networkError.message : 'Network error'
      console.error(`[ImageUpload] Network error for ${pending.file.name}:`, networkError)
      
      toast.error(`Upload failed: ${pending.file.name}`, {
        description: `Network error: ${errorMsg}`,
        duration: 8000,
      })

      return { success: false, error: `Network error: ${errorMsg}`, errorCode: 'NETWORK_ERROR' }
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - images.length - pendingUploads.filter(p => p.status !== 'error').length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    if (filesToUpload.length === 0) {
      toast.warning("Maximum images reached", {
        description: `You can upload up to ${maxImages} images.`
      })
      return
    }

    const newPendingUploads: PendingUpload[] = filesToUpload.map(file => {
      const localUrl = URL.createObjectURL(file)
      objectUrlsRef.current.push(localUrl)
      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        localUrl,
        file,
        status: 'uploading' as const
      }
    })

    setPendingUploads(prev => [...prev, ...newPendingUploads])
    setUploading(true)

    const currentImageCount = imagesRef.current.length
    const uploadResults = await Promise.allSettled(
      newPendingUploads.map(async (pending, idx) => {
        const result = await uploadSingleFile(pending, currentImageCount + idx)
        return { pendingId: pending.id, localUrl: pending.localUrl, ...result }
      })
    )

    const successfulEntries: ImageEntry[] = []

    uploadResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { pendingId, localUrl, success, serverUrl, imageObject, error, errorCode } = result.value
        
        if (success && serverUrl) {
          successfulEntries.push(imageObject || serverUrl)
          URL.revokeObjectURL(localUrl)
          objectUrlsRef.current = objectUrlsRef.current.filter(u => u !== localUrl)
          setPendingUploads(prev => prev.filter(p => p.id !== pendingId))
        } else {
          setPendingUploads(prev => prev.map(p => 
            p.id === pendingId 
              ? { ...p, status: 'error' as const, errorMessage: error, errorCode } 
              : p
          ))
        }
      } else {
        console.error("[ImageUpload] Promise rejected:", result.reason)
      }
    })

    if (successfulEntries.length > 0) {
      const newImages = [...imagesRef.current, ...successfulEntries]
      imagesRef.current = newImages
      console.log(`[ImageUpload] Adding ${successfulEntries.length} images to gallery. Total: ${newImages.length}`)
      setImages(newImages)
    }

    setUploading(false)
  }

  const retryUpload = async (pendingId: string) => {
    const pending = pendingUploads.find(p => p.id === pendingId)
    if (!pending) return

    setPendingUploads(prev => prev.map(p => 
      p.id === pendingId ? { ...p, status: 'uploading' as const, errorMessage: undefined, errorCode: undefined } : p
    ))

    const result = await uploadSingleFile(pending, imagesRef.current.length)

    if (result.success && result.serverUrl) {
      URL.revokeObjectURL(pending.localUrl)
      objectUrlsRef.current = objectUrlsRef.current.filter(u => u !== pending.localUrl)
      setPendingUploads(prev => prev.filter(p => p.id !== pendingId))
      
      const entry: ImageEntry = result.imageObject || result.serverUrl
      const newImages = [...imagesRef.current, entry]
      imagesRef.current = newImages
      console.log(`[ImageUpload] Retry successful. Total images: ${newImages.length}`)
      setImages(newImages)
    } else {
      setPendingUploads(prev => prev.map(p => 
        p.id === pendingId 
          ? { ...p, status: 'error' as const, errorMessage: result.error, errorCode: result.errorCode } 
          : p
      ))
    }
  }

  const removeFailedUpload = (pendingId: string) => {
    const pending = pendingUploads.find(p => p.id === pendingId)
    if (pending) {
      URL.revokeObjectURL(pending.localUrl)
      objectUrlsRef.current = objectUrlsRef.current.filter(u => u !== pending.localUrl)
    }
    setPendingUploads(prev => prev.filter(p => p.id !== pendingId))
  }

  const removeImage = async (index: number) => {
    const entry = images[index]
    const url = getImageUrl(entry)
    try {
      await fetch("/api/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
    } catch (error) {
      console.error("Delete error:", error)
    }
    setImages(images.filter((_, i) => i !== index))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    if (result.source.index === result.destination.index) return

    const items = Array.from(images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setImages(items)
  }

  const setAsHero = useCallback((index: number) => {
    if (index === 0) return
    const items = Array.from(images)
    const [item] = items.splice(index, 1)
    items.unshift(item)
    setImages(items)
    toast.success("Image set as hero/cover")
  }, [images, setImages])

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return
    const items = Array.from(images)
    ;[items[index - 1], items[index]] = [items[index], items[index - 1]]
    setImages(items)
  }, [images, setImages])

  const moveDown = useCallback((index: number) => {
    if (index >= images.length - 1) return
    const items = Array.from(images)
    ;[items[index], items[index + 1]] = [items[index + 1], items[index]]
    setImages(items)
  }, [images, setImages])

  return (
    <div className="space-y-4">
      <Label className="text-gray-300">{label}</Label>

      {hasErrors && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>Some images failed to upload. Please retry or remove them before saving.</span>
        </div>
      )}

      <div className="border-2 border-dashed border-[#333333] rounded-lg p-6 bg-[#0A0A0A]">
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 text-[#ECAC36]">
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Images"}
              </div>
            </Label>
            <Input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={isUploading || images.length >= maxImages}
            />
          </div>
          <p className="mt-2 text-sm text-gray-400">
            {images.length + pendingUploads.filter(p => p.status !== 'error').length}/{maxImages} images • Max 50MB per file • Drag to reorder
          </p>
        </div>
      </div>

      {(images.length > 0 || pendingUploads.length > 0) && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Star className="h-4 w-4 text-[#ECAC36]" />
            First image is the cover/featured image
          </p>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images" direction="vertical">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {images.map((entry, index) => {
                    const displayUrl = getEntryDisplayUrl(entry)
                    const dragId = getEntryDragId(entry)
                    const meta = getImageMeta(entry)
                    const isObj = isImageObject(entry)
                    return (
                    <Draggable key={dragId} draggableId={dragId} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style}
                          className={`flex items-center gap-3 p-2 rounded-lg border ${index === 0 ? 'border-[#ECAC36]/50 bg-[#ECAC36]/5' : 'border-[#333333] bg-[#111111]'} ${snapshot.isDragging ? "opacity-70 shadow-lg shadow-black/50" : ""}`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1"
                          >
                            <GripVertical className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="w-16 h-16 flex-shrink-0 relative rounded overflow-hidden bg-[#0A0A0A]">
                            <img
                              src={displayUrl.startsWith('blob:') ? displayUrl : (normalizeImageUrl(displayUrl) || "/placeholder.svg")}
                              alt={isObj ? (entry as ImageObject).alt : `Image ${index + 1}`}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {index === 0 && (
                                <span className="bg-[#ECAC36] text-black px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                  <Star className="h-3 w-3" fill="currentColor" />
                                  Cover
                                </span>
                              )}
                              <span className="text-sm text-gray-400">#{index + 1}</span>
                              {isObj && (
                                <span className="text-xs text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">HQ+LQ</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500 truncate">{meta.seoFilename || displayUrl.split('/').pop()}</p>
                              {meta.width && meta.height && (
                                <span className="text-xs text-gray-600 flex-shrink-0">{meta.width}x{meta.height}</span>
                              )}
                              {meta.bytes && (
                                <span className="text-xs text-gray-600 flex-shrink-0">{formatBytes(meta.bytes)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 bg-transparent border-[#333333] text-gray-300 hover:text-white hover:border-[#ECAC36]"
                                onClick={() => moveUp(index)}
                                title="Move up"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                            )}
                            {index < images.length - 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 bg-transparent border-[#333333] text-gray-300 hover:text-white hover:border-[#ECAC36]"
                                onClick={() => moveDown(index)}
                                title="Move down"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            )}
                            {index !== 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs bg-transparent border-[#333333] text-gray-300 hover:text-white hover:border-[#ECAC36]"
                                onClick={() => setAsHero(index)}
                                title="Set as cover image"
                              >
                                <ArrowUp className="h-3 w-3 mr-1" />
                                Cover
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                    )
                  })}
                  {provided.placeholder}
                  {pendingUploads.map((pending) => (
                    <div key={pending.id} className="flex items-center gap-3 p-2 rounded-lg border border-[#333333] bg-[#111111]">
                      <div className="w-5 flex-shrink-0" />
                      <div className="w-16 h-16 flex-shrink-0 relative rounded overflow-hidden bg-[#0A0A0A]">
                        <img
                          src={pending.localUrl}
                          alt={`Uploading ${pending.file.name}`}
                          className={`absolute inset-0 w-full h-full object-cover ${pending.status === 'uploading' ? 'opacity-50' : pending.status === 'error' ? 'opacity-30' : ''}`}
                        />
                        {pending.status === 'uploading' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Loader2 className="h-5 w-5 text-[#ECAC36] animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {pending.status === 'uploading' && (
                          <span className="text-xs text-gray-400">Uploading...</span>
                        )}
                        {pending.status === 'error' && (
                          <span className="text-xs text-red-400">{pending.errorMessage || 'Upload failed'}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {pending.status === 'error' && (
                          <>
                            <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => retryUpload(pending.id)}>
                              <RefreshCw className="h-3 w-3 mr-1" /> Retry
                            </Button>
                            <Button type="button" size="sm" variant="destructive" className="h-7 w-7 p-0" onClick={() => removeFailedUpload(pending.id)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  )
}
