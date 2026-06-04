"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"

interface ProgressiveImageProps {
  src: string
  lqSrc?: string | null
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  fetchPriority?: "high" | "low" | "auto"
  sizes?: string
  className?: string
  style?: React.CSSProperties
  quality?: number
  objectFit?: "cover" | "contain" | "fill" | "none"
  objectPosition?: string
  onLoad?: () => void
}

export function ProgressiveImage({
  src,
  lqSrc,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  fetchPriority,
  sizes,
  className = "",
  style,
  quality = 75,
  objectFit = "cover",
  objectPosition,
  onLoad,
}: ProgressiveImageProps) {
  const [hqLoaded, setHqLoaded] = useState(false)
  const [lqLoaded, setLqLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const hasLq = !!lqSrc && lqSrc !== src

  useEffect(() => {
    if (!hasLq) {
      setHqLoaded(true)
    }
  }, [hasLq])

  const handleHqLoad = useCallback(() => {
    setHqLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleLqLoad = useCallback(() => {
    setLqLoaded(true)
  }, [])

  if (!hasLq) {
    return (
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        fetchPriority={fetchPriority}
        sizes={sizes}
        className={className}
        style={{
          objectFit,
          objectPosition,
          ...style,
        }}
        quality={quality}
        onLoad={handleHqLoad}
      />
    )
  }

  return (
    <div className="relative" style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}>
      <Image
        src={lqSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        className={`${className} transition-opacity duration-500 ${hqLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{
          objectFit,
          objectPosition,
          filter: hqLoaded ? 'none' : 'blur(4px)',
          position: fill ? undefined : 'absolute',
          inset: fill ? undefined : 0,
          zIndex: 1,
          ...style,
        }}
        quality={30}
        onLoad={handleLqLoad}
      />
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        fetchPriority={fetchPriority}
        sizes={sizes}
        className={`${className} transition-opacity duration-500 ${hqLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          objectFit,
          objectPosition,
          zIndex: 2,
          ...style,
        }}
        quality={quality}
        onLoad={handleHqLoad}
      />
    </div>
  )
}
