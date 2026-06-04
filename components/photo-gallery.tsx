"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { getOrderedImages, extractLqImageUrls, extractImageUrls, normalizeImageUrl } from "@/lib/media-utils"
import { ProgressiveImage } from "@/components/progressive-image"

interface PhotoGalleryProps {
  images: (string | { hqUrl: string; lqUrl: string; [key: string]: any })[]
  title: string
  badges?: string[]
  focalPoint?: string
  flipHorizontal?: boolean
  flipVertical?: boolean
}

export function PhotoGallery({ 
  images: rawImages, 
  title, 
  badges = [],
  focalPoint = '50% 50%',
  flipHorizontal = false,
  flipVertical = false
}: PhotoGalleryProps) {
  const images = useMemo(() => 
    getOrderedImages(rawImages),
    [rawImages]
  )
  const lqUrlMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const entry of rawImages) {
      if (entry && typeof entry === 'object' && 'hqUrl' in entry && 'lqUrl' in entry) {
        const hq = normalizeImageUrl(entry.hqUrl)
        if (hq && entry.lqUrl) map.set(hq, entry.lqUrl)
      }
    }
    return map
  }, [rawImages])
  const lqUrls = useMemo(() => images.map(url => lqUrlMap.get(url) || null), [images, lqUrlMap])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [showAllImages, setShowAllImages] = useState(false)

  const getFlipTransform = () => {
    const transforms: string[] = []
    if (flipHorizontal) transforms.push('scaleX(-1)')
    if (flipVertical) transforms.push('scaleY(-1)')
    return transforms.join(' ') || undefined
  }
  
  const INITIAL_IMAGE_COUNT = 10
  const hasMoreImages = images.length > INITIAL_IMAGE_COUNT
  const visibleImages = showAllImages || !hasMoreImages ? images : images.slice(0, INITIAL_IMAGE_COUNT)

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setIsLightboxOpen(true)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    } else {
      setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
  }

  return (
    <>
      {/* Main Gallery Display */}
      <div className="space-y-4">
        {/* Main Image - click anywhere to open gallery */}
        <div 
          className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openLightbox(0)}
          aria-label="Open gallery"
        >
          <ProgressiveImage
            src={images[0] || "/placeholder.svg"}
            lqSrc={lqUrls[0]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            quality={85}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            objectPosition={focalPoint}
            style={{ transform: getFlipTransform() }}
          />
          {badges.length > 0 && (
            <div className="absolute top-4 left-4 flex gap-2">
              {badges.map((badge: string) => (
                <Badge key={badge} className="bg-[#ECAC36] text-black font-semibold">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Gallery
          </div>
        </div>

        {/* Thumbnail Grid */}
        {visibleImages.length > 1 && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {visibleImages.slice(1).map((image: string, index: number) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(index + 1)}
                >
                  <ProgressiveImage
                    src={image || "/placeholder.svg"}
                    lqSrc={lqUrls[index + 1]}
                    alt={`${title} ${index + 2}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    quality={80}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreImages && !showAllImages && (
              <button
                onClick={() => setShowAllImages(true)}
                className="w-full py-3 bg-[#ECAC36] hover:bg-[#e6c766] text-black font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Load All {images.length} Photos
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none" showCloseButton={false}>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full"
                  onClick={() => navigateImage("prev")}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full"
                  onClick={() => navigateImage("next")}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center p-8">
              <img
                src={images[selectedImageIndex] || "/placeholder.svg"}
                alt={`${title} ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 max-w-md">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2">
                    {images.map((image, index) => (
                      <CarouselItem key={index} className="pl-2 basis-1/5">
                        <div
                          className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                            index === selectedImageIndex
                              ? "border-[#ECAC36] opacity-100"
                              : "border-transparent opacity-60 hover:opacity-80"
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${title} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="text-white border-white/20 hover:bg-white/20" />
                  <CarouselNext className="text-white border-white/20 hover:bg-white/20" />
                </Carousel>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
