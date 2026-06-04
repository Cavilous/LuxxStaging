"use client"

import dynamic from "next/dynamic"

const PhotoGallery = dynamic(
  () => import("@/components/photo-gallery").then(mod => ({ default: mod.PhotoGallery })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[16/10] bg-[#111] animate-pulse rounded-lg" />
    ),
  }
)

export { PhotoGallery }
