/**
 * Shared Media Utilities
 * 
 * Centralized utilities for handling inventory images site-wide.
 * Used by: InventoryCard, PhotoGallery, detail pages, buy-sell pages
 */

// Keywords indicating interior shots (should not be primary)
const INTERIOR_KEYWORDS = [
  'interior', 'inside', 'cabin', 'cockpit', 'dashboard', 'dash',
  'steering', 'seat', 'seats', 'console', 'gauge', 'gauges',
  'bedroom', 'bathroom', 'kitchen', 'galley', 'living', 'dining',
  'stateroom', 'salon', 'lounge', 'helm', 'bridge'
]

// Keywords indicating exterior shots (preferred for primary)
const EXTERIOR_KEYWORDS = [
  'exterior', 'outside', 'front', 'side', 'rear', 'back',
  'profile', 'hero', 'main', 'cover', 'featured', 'primary',
  'aerial', 'drone', 'beauty', 'showcase', 'display'
]

/**
 * Normalize an image URL to a consistent format for display.
 * Handles GCS URLs, API proxy URLs, and external URLs.
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  
  // Trim and validate basic format
  const trimmed = url.trim()
  if (!trimmed || trimmed.length === 0) return null
  
  // Skip obviously malformed URLs that would cause 400 errors
  if (trimmed === 'undefined' || trimmed === 'null' || trimmed === '[object Object]') return null
  
  // Already normalized to proxy format
  if (trimmed.startsWith('/api/objects/')) return trimmed
  
  // Old proxy format without /api prefix
  if (trimmed.startsWith('/objects/')) return `/api${trimmed}`
  
  // GCS URLs - convert to proxy
  if (trimmed.startsWith('https://storage.googleapis.com/replit-objstore')) {
    try {
      const gcsUrl = new URL(trimmed)
      const pathParts = gcsUrl.pathname.split('/')
      const uploadsIndex = pathParts.findIndex(part => part === 'uploads')
      if (uploadsIndex !== -1) {
        return `/api/objects/${pathParts.slice(uploadsIndex).join('/')}`
      }
    } catch {
      return null
    }
  }
  
  // External URLs (SmugMug, etc) - pass through
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  
  // Relative uploads path
  if (trimmed.startsWith('uploads/')) return `/api/objects/${trimmed}`
  
  // Unknown format - return null (safer than potentially malformed URL)
  return null
}

/**
 * Extract filename from a URL for keyword analysis
 */
function getFilename(url: string): string {
  try {
    const urlObj = new URL(url, 'https://example.com')
    const pathname = urlObj.pathname
    const parts = pathname.split('/')
    return parts[parts.length - 1].toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}

/**
 * Check if an image URL appears to be an interior shot based on filename
 */
export function isInteriorImage(url: string): boolean {
  const filename = getFilename(url)
  return INTERIOR_KEYWORDS.some(keyword => filename.includes(keyword))
}

/**
 * Check if an image URL appears to be an exterior shot based on filename
 */
export function isExteriorImage(url: string): boolean {
  const filename = getFilename(url)
  return EXTERIOR_KEYWORDS.some(keyword => filename.includes(keyword))
}

/**
 * Score an image for primary position (higher = better for primary)
 * 
 * Scoring logic:
 * - Exterior keywords: +10 points
 * - Interior keywords: -20 points (strongly avoid)
 * - Position bonus: Earlier images get slight preference (CMS ordering)
 */
function scoreImageForPrimary(url: string, index: number): number {
  let score = 0
  
  // Exterior boost
  if (isExteriorImage(url)) {
    score += 10
  }
  
  // Interior penalty
  if (isInteriorImage(url)) {
    score -= 20
  }
  
  // Position preference (first images get small bonus to respect CMS ordering)
  // Max 5 points for first image, decreasing
  score += Math.max(0, 5 - index)
  
  return score
}

export interface ImageWithUrl {
  url: string
  [key: string]: unknown
}

/**
 * Extract URLs from various image array formats.
 * Supports: plain strings, objects with `url`, and ImageObject with `hqUrl`.
 */
export function extractImageUrls(images: unknown[]): string[] {
  if (!Array.isArray(images)) return []
  
  return images
    .map((img): string | null => {
      if (typeof img === 'string') return img
      if (img && typeof img === 'object') {
        if ('hqUrl' in img && typeof (img as any).hqUrl === 'string') {
          return (img as any).hqUrl
        }
        if ('url' in img) {
          return (img as ImageWithUrl).url
        }
      }
      return null
    })
    .filter((url): url is string => url !== null && url.length > 0)
}

/**
 * Extract LQ URLs from image entries that have them.
 * Returns null for entries that don't have LQ variants.
 */
export function extractLqImageUrls(images: unknown[]): (string | null)[] {
  if (!Array.isArray(images)) return []
  
  return images.map((img): string | null => {
    if (img && typeof img === 'object' && 'lqUrl' in img && typeof (img as any).lqUrl === 'string') {
      return (img as any).lqUrl
    }
    return null
  })
}

/**
 * Get the LQ (low-quality) URL for the primary image in an array.
 * Returns null if the first image entry doesn't have an LQ variant.
 */
export function getPrimaryLqImage(images: unknown[]): string | null {
  if (!Array.isArray(images) || images.length === 0) return null
  const first = images[0]
  if (first && typeof first === 'object' && 'lqUrl' in first && typeof (first as any).lqUrl === 'string') {
    return (first as any).lqUrl
  }
  return null
}

/**
 * Get ordered images for display, optimizing primary image selection.
 * 
 * Rules:
 * 1. If CMS explicitly set first image as exterior or marked as cover, keep it
 * 2. Never show interior as primary if exterior exists
 * 3. Prefer front/side exterior using filename heuristics
 * 4. Maintain relative order of remaining images
 * 
 * @param images - Raw image array from database (strings or objects with url)
 * @param options - Configuration options
 * @returns Ordered array of normalized image URLs
 */
export function getOrderedImages(
  images: unknown[],
  options: {
    /** If true, always use first image as-is (CMS explicit ordering) */
    preserveOrder?: boolean
    /** Maximum number of images to return */
    limit?: number
  } = {}
): string[] {
  const urls = extractImageUrls(images)
  
  if (urls.length === 0) return []
  
  // Normalize all URLs
  const normalizedUrls = urls
    .map(normalizeImageUrl)
    .filter((url): url is string => url !== null)
  
  if (normalizedUrls.length === 0) return []
  
  // If preserveOrder is true or only one image, return as-is
  if (options.preserveOrder || normalizedUrls.length === 1) {
    return options.limit ? normalizedUrls.slice(0, options.limit) : normalizedUrls
  }
  
  // Check if first image is already a good exterior shot
  const firstImageScore = scoreImageForPrimary(normalizedUrls[0], 0)
  
  // If first image scores well (exterior or neutral), keep CMS ordering
  if (firstImageScore >= 0) {
    return options.limit ? normalizedUrls.slice(0, options.limit) : normalizedUrls
  }
  
  // First image is interior - find best exterior to swap with
  let bestExteriorIndex = -1
  let bestExteriorScore = -Infinity
  
  for (let i = 1; i < normalizedUrls.length; i++) {
    const score = scoreImageForPrimary(normalizedUrls[i], i)
    if (score > bestExteriorScore && !isInteriorImage(normalizedUrls[i])) {
      bestExteriorScore = score
      bestExteriorIndex = i
    }
  }
  
  // If we found a better exterior image, move it to first position
  if (bestExteriorIndex !== -1 && bestExteriorScore > firstImageScore) {
    const reordered = [...normalizedUrls]
    const [exterior] = reordered.splice(bestExteriorIndex, 1)
    reordered.unshift(exterior)
    return options.limit ? reordered.slice(0, options.limit) : reordered
  }
  
  // No better option found, use original order
  return options.limit ? normalizedUrls.slice(0, options.limit) : normalizedUrls
}

/**
 * Get the primary (cover) image for an inventory item.
 * 
 * Uses intelligent ordering to select the best primary image.
 */
export function getPrimaryImage(images: unknown[]): string | null {
  const ordered = getOrderedImages(images)
  return ordered.length > 0 ? ordered[0] : null
}

/**
 * Analyze images to detect potential issues for CMS tooling
 */
export interface ImageAnalysis {
  hasImages: boolean
  imageCount: number
  primaryIsInterior: boolean
  hasExteriorImages: boolean
  interiorCount: number
  exteriorCount: number
  unknownCount: number
}

export function analyzeImages(images: unknown[]): ImageAnalysis {
  const urls = extractImageUrls(images)
  
  let interiorCount = 0
  let exteriorCount = 0
  
  for (const url of urls) {
    if (isInteriorImage(url)) {
      interiorCount++
    } else if (isExteriorImage(url)) {
      exteriorCount++
    }
  }
  
  const unknownCount = urls.length - interiorCount - exteriorCount
  const primaryIsInterior = urls.length > 0 && isInteriorImage(urls[0])
  
  return {
    hasImages: urls.length > 0,
    imageCount: urls.length,
    primaryIsInterior,
    hasExteriorImages: exteriorCount > 0,
    interiorCount,
    exteriorCount,
    unknownCount
  }
}
