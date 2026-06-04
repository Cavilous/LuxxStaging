export interface ImageObject {
  hqUrl: string
  lqUrl: string
  width: number
  height: number
  bytes: number
  format: string
  alt: string
  seoFilename: string
}

export type ImageEntry = string | ImageObject

export function isImageObject(entry: unknown): entry is ImageObject {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'hqUrl' in entry &&
    'lqUrl' in entry &&
    typeof (entry as ImageObject).hqUrl === 'string' &&
    typeof (entry as ImageObject).lqUrl === 'string'
  )
}

export function getImageUrl(entry: ImageEntry): string {
  if (typeof entry === 'string') return entry
  return entry.hqUrl
}

export function getLqImageUrl(entry: ImageEntry): string | null {
  if (typeof entry === 'string') return null
  return entry.lqUrl
}

export function getImageAlt(entry: ImageEntry, fallback: string = ''): string {
  if (typeof entry === 'string') return fallback
  return entry.alt || fallback
}

export function getImageMeta(entry: ImageEntry): { width?: number; height?: number; bytes?: number; format?: string; seoFilename?: string } {
  if (typeof entry === 'string') return {}
  return {
    width: entry.width,
    height: entry.height,
    bytes: entry.bytes,
    format: entry.format,
    seoFilename: entry.seoFilename,
  }
}

export function parseImageArray(images: unknown): ImageEntry[] {
  if (!Array.isArray(images)) return []
  return images.filter((img): img is ImageEntry => {
    if (typeof img === 'string') return img.length > 0
    return isImageObject(img)
  })
}

export function extractAllUrls(images: ImageEntry[]): string[] {
  return images.map(getImageUrl).filter(Boolean)
}
