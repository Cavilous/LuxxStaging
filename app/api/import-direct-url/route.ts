import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as jwt from "jsonwebtoken"
import { randomUUID } from "crypto"
import { uploadToObjectStorage, getPublicUrl } from "@/lib/object-storage"
import { processImageFromUrl } from "@/lib/image-pipeline"

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const MAX_FILE_SIZE = 50 * 1024 * 1024

export const dynamic = "force-dynamic"

function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const ext = pathname.split('.').pop()?.toLowerCase()
    if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext
    }
  } catch {}
  return 'jpg'
}

function getExtensionFromContentType(contentType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/svg+xml': 'svg',
  }
  return mimeToExt[contentType] || 'jpg'
}

function isSmugMugPageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return (parsedUrl.hostname.endsWith('.smugmug.com') || parsedUrl.hostname === 'smugmug.com') 
      && !parsedUrl.hostname.startsWith('photos.')
  } catch {
    return false
  }
}

function isDirectImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname.toLowerCase()
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(pathname) || 
           parsedUrl.hostname.startsWith('photos.smugmug.com')
  } catch {
    return false
  }
}

// Resolution size ranking (highest to lowest)
const SIZE_PRIORITY: Record<string, number> = {
  'O': 11,   // Original (highest quality)
  '5K': 10,
  'X5': 9,
  '4K': 8,
  'X4': 7,
  'X3': 6,
  'X2': 5,
  'XL': 4,
  'L': 3,
  'M': 2,
  'S': 1,
  'Th': 0,
  'Ti': -1,
}

async function extractBestImageFromSmugMugPage(pageUrl: string): Promise<string | null> {
  console.log(`[ImportURL] Detected SmugMug page URL, extracting image: ${pageUrl}`)
  
  try {
    const response = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LuxxMiami/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(15000)
    })
    
    if (!response.ok) {
      console.error(`[ImportURL] Failed to fetch SmugMug page: ${response.status}`)
      return null
    }
    
    const html = await response.text()
    
    // Extract all SmugMug image URLs from the page
    const imageRegex = /https:\/\/photos\.smugmug\.com\/[^\s"'<>]+?\/i-[^\s"'<>\/]+\/[^\s"'<>]+?\/(O|Ti|Th|S|M|L|XL|X2|X3|X4|X5|4K|5K)\/[^\s"'<>]+?\.(jpg|jpeg|png|gif)/gi
    
    let match
    const imagesBySize: Array<{ url: string; size: string; priority: number }> = []
    
    while ((match = imageRegex.exec(html)) !== null) {
      const fullUrl = match[0]
      const sizeMatch = fullUrl.match(/\/(O|Ti|Th|S|M|L|XL|X2|X3|X4|X5|4K|5K)\//)
      if (sizeMatch) {
        const size = sizeMatch[1]
        const priority = SIZE_PRIORITY[size] ?? 0
        imagesBySize.push({ url: fullUrl, size, priority })
      }
    }
    
    if (imagesBySize.length === 0) {
      console.log(`[ImportURL] No SmugMug images found in page`)
      return null
    }
    
    // Sort by priority (highest first) and return the best one
    imagesBySize.sort((a, b) => b.priority - a.priority)
    const bestImage = imagesBySize[0]
    
    console.log(`[ImportURL] Extracted ${bestImage.size} resolution image from SmugMug page (${imagesBySize.length} sizes found)`)
    
    return bestImage.url
  } catch (error) {
    console.error(`[ImportURL] Error extracting from SmugMug page:`, error)
    return null
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url.trim())
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Check if this is a SmugMug page URL (not a direct image URL)
    let imageUrl = url.trim()
    
    if (isSmugMugPageUrl(imageUrl)) {
      const extractedUrl = await extractBestImageFromSmugMugPage(imageUrl)
      if (!extractedUrl) {
        return NextResponse.json({ 
          error: "Could not extract image from SmugMug page. Make sure the URL points to a specific image." 
        }, { status: 400 })
      }
      
      // For SmugMug CDN URLs, return them directly without uploading to storage
      // This matches how single SmugMug import works and is more reliable
      const duration = Date.now() - startTime
      console.log(`[ImportURL] SUCCESS (SmugMug CDN) in ${duration}ms: ${url} -> ${extractedUrl}`)
      
      return NextResponse.json({
        url: extractedUrl,
        originalUrl: url,
        source: 'smugmug_cdn',
        duration
      })
    }

    const itemTitle = request.headers.get('x-item-title') || 'image'
    const imageIndex = parseInt(request.headers.get('x-image-index') || '0', 10)

    try {
      console.log(`[ImportURL] Processing through pipeline: ${imageUrl}`)
      
      const result = await processImageFromUrl(imageUrl, itemTitle, imageIndex)
      
      const duration = Date.now() - startTime
      console.log(`[ImportURL] SUCCESS in ${duration}ms: ${url} -> HQ:${(result.hqBytes/1024).toFixed(0)}KB LQ:${(result.lqBytes/1024).toFixed(0)}KB`)
      
      return NextResponse.json({
        url: result.imageObject.hqUrl,
        imageObject: result.imageObject,
        originalUrl: url,
        size: result.originalBytes,
        duration,
        hqBytes: result.hqBytes,
        lqBytes: result.lqBytes,
      })
    } catch (fetchError) {
      const duration = Date.now() - startTime
      const errorMsg = fetchError instanceof Error ? fetchError.message : "Unknown error"
      console.error(`[ImportURL] Pipeline failed after ${duration}ms: ${errorMsg}`)
      
      return NextResponse.json({ 
        error: `Failed to process image: ${errorMsg}` 
      }, { status: 400 })
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[ImportURL] Error after ${duration}ms:`, error)
    
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json({ error: "Request timed out" }, { status: 408 })
    }
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Import failed" 
    }, { status: 500 })
  }
}
