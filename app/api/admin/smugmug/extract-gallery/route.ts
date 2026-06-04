import { NextRequest, NextResponse } from "next/server"
import { requireApiAuth } from "@/lib/auth-helpers"
import puppeteer from "puppeteer"

export const dynamic = "force-dynamic"
export const maxDuration = 120

interface GalleryResult {
  galleryUrl: string
  directImageUrls: string[]
  warnings?: string[]
}

interface ExtractionResponse {
  results: GalleryResult[]
  errors?: Array<{ url: string; error: string }>
}

const SIZE_PRIORITY: Record<string, number> = {
  'O': 11,
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

const ALL_SIZE_ALT = 'O|5K|X5|4K|X4|X3|X2|XL|L|M|S|Th|Ti'

function validateSmugMugUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const isSmugMug = parsedUrl.hostname.endsWith('.smugmug.com') || parsedUrl.hostname === 'smugmug.com'
    const isSafeProtocol = ['http:', 'https:'].includes(parsedUrl.protocol)
    return isSmugMug && isSafeProtocol
  } catch {
    return false
  }
}

function extractBestUrls(imageUrls: string[]): string[] {
  const imagesByKey = new Map<string, Array<{ url: string; size: string; priority: number }>>()

  for (const url of imageUrls) {
    const imageKeyMatch = url.match(/\/i-([^\/]+)\//)
    if (!imageKeyMatch) continue

    const imageKey = imageKeyMatch[1]
    const sizeMatch = url.match(new RegExp(`/(${ALL_SIZE_ALT})/`))
    if (!sizeMatch) continue

    const size = sizeMatch[1]
    const priority = SIZE_PRIORITY[size] ?? 0

    if (!imagesByKey.has(imageKey)) {
      imagesByKey.set(imageKey, [])
    }

    imagesByKey.get(imageKey)!.push({ url, size, priority })
  }

  const bestUrls: string[] = []
  for (const [, urls] of imagesByKey.entries()) {
    urls.sort((a, b) => b.priority - a.priority)
    bestUrls.push(urls[0].url)
  }

  return bestUrls
}

/**
 * Takes any photos.smugmug.com URL with a size suffix and upgrades it to the
 * target resolution by replacing both the path segment and the filename suffix.
 * e.g. /0/Th/abc-Th.jpg → /0/X5/abc-X5.jpg
 */
function upgradeSmugMugUrl(url: string, targetSize: string = 'X5'): string {
  return url.replace(
    new RegExp(`(\/\\d+\/)(${ALL_SIZE_ALT})(\/[^\/\\s"'<>]+-)(${ALL_SIZE_ALT})(\\.[a-z]{3,4})`),
    `$1${targetSize}$3${targetSize}$5`
  )
}

/**
 * Collect all photos.smugmug.com URLs from a block of text (HTML or JSON),
 * including ones embedded as JSON-escaped strings (\\/), and return them
 * de-escaped and deduplicated.
 */
function collectSmugMugUrls(text: string): string[] {
  const seen = new Set<string>()
  const results: string[] = []

  // Pattern 1: normal URLs with size suffix
  const strictRe = new RegExp(
    `https:\\/\\/photos\\.smugmug\\.com\\/[^\\s"'<>\\\\]+?\\/i-[^\\s"'<>\\\\\\/]+\\/[^\\s"'<>\\\\]+?\\/(${ALL_SIZE_ALT})\\/[^\\s"'<>\\\\]+?\\.(jpg|jpeg|png|gif|webp)`,
    'gi'
  )
  let m: RegExpExecArray | null
  while ((m = strictRe.exec(text)) !== null) {
    const url = m[0]
    if (!seen.has(url)) { seen.add(url); results.push(url) }
  }

  // Pattern 2: JSON-escaped URLs (backslash before each slash)
  const escapedRe = new RegExp(
    `https:\\\\\\/\\\\\\/photos\\.smugmug\\.com\\\\\\/[^"\\s]+?\\.(jpg|jpeg|png|gif|webp)`,
    'gi'
  )
  while ((m = escapedRe.exec(text)) !== null) {
    const url = m[0].replace(/\\\//g, '/')
    if (!seen.has(url)) { seen.add(url); results.push(url) }
  }

  return results
}

async function extractGalleryWithPuppeteer(galleryUrl: string): Promise<GalleryResult> {
  const warnings: string[] = []
  let browser = null

  try {
    console.log(`[SmugMug Gallery] Starting Puppeteer extraction: ${galleryUrl}`)

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    console.log(`[SmugMug Gallery] Navigating to gallery...`)
    await page.goto(galleryUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })

    await new Promise(resolve => setTimeout(resolve, 3000))

    let previousCount = 0
    let stableCount = 0
    const maxScrolls = 200
    const stableThreshold = 8
    const scrollWaitMs = 600

    console.log(`[SmugMug Gallery] Starting scroll loop...`)

    for (let scrollNum = 0; scrollNum < maxScrolls; scrollNum++) {
      await page.evaluate(() => { window.scrollBy(0, window.innerHeight * 1.2) })
      await new Promise(resolve => setTimeout(resolve, scrollWaitMs))

      const currentCount = await page.evaluate(() => {
        const galleryRoot = document.querySelector('div.sm-gallery-images, [data-testid="gallery"], .gallery-grid')
        const root = galleryRoot || document
        return root.querySelectorAll('img').length
      })

      if (currentCount === previousCount) {
        stableCount++
        if (stableCount >= stableThreshold) {
          console.log(`[SmugMug Gallery] Scroll complete: ${scrollNum + 1} scrolls, ${currentCount} images stable`)
          break
        }
      } else {
        stableCount = 0
      }

      previousCount = currentCount

      if (scrollNum % 20 === 0) {
        console.log(`[SmugMug Gallery] Scroll ${scrollNum + 1}: ${currentCount} images found`)
      }
    }

    // Scroll back to top then bottom to trigger any remaining lazy loads
    await page.evaluate(() => { window.scrollTo(0, 0) })
    await new Promise(resolve => setTimeout(resolve, 800))
    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight) })
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(`[SmugMug Gallery] Extracting image URLs from DOM...`)

    const allImageUrls = await page.evaluate(() => {
      const urls: string[] = []

      const galleryRoot = document.querySelector('div.sm-gallery-images, [data-testid="gallery"], .gallery-grid')
      const searchRoot = galleryRoot || document

      searchRoot.querySelectorAll('img').forEach(img => {
        const attrs = ['src', 'srcset', 'data-src', 'data-lazy-src', 'data-original']
        for (const attr of attrs) {
          const val = img.getAttribute(attr)
          if (!val) continue
          const parts = attr === 'srcset'
            ? val.split(',').map(s => s.trim().split(' ')[0])
            : [val]
          for (const u of parts) {
            if (u && u.includes('photos.smugmug.com')) {
              urls.push(u.startsWith('//') ? 'https:' + u : u)
            }
          }
        }
      })

      searchRoot.querySelectorAll('[style*="background"]').forEach(el => {
        const style = el.getAttribute('style') || ''
        const urlMatch = style.match(/url\(['"]?(https?:\/\/photos\.smugmug\.com[^'")\s]+)['"]?\)/i)
        if (urlMatch?.[1]) urls.push(urlMatch[1])
      })

      return urls
    })

    // Also scan the full page HTML for any URLs in script/JSON blobs
    const pageHtml = await page.content()
    const htmlUrls = collectSmugMugUrls(pageHtml)

    const combined = [...allImageUrls, ...htmlUrls]
    console.log(`[SmugMug Gallery] Found ${combined.length} raw URLs`)

    // Add upgraded versions of each URL
    const withUpgrades: string[] = []
    for (const url of combined) {
      withUpgrades.push(url)
      const upgraded = upgradeSmugMugUrl(url)
      if (upgraded !== url) withUpgrades.push(upgraded)
    }

    const bestUrls = extractBestUrls(withUpgrades)
    console.log(`[SmugMug Gallery] Extracted ${bestUrls.length} unique best-resolution images`)

    if (bestUrls.length === 0) {
      warnings.push('No images found via browser rendering. Gallery may require login or use a non-standard structure.')
    }

    return { galleryUrl, directImageUrls: bestUrls, warnings: warnings.length > 0 ? warnings : undefined }

  } catch (error) {
    console.error(`[SmugMug Gallery] Puppeteer error:`, error)
    throw error
  } finally {
    if (browser) await browser.close().catch(console.error)
  }
}

async function extractGalleryFallback(galleryUrl: string): Promise<GalleryResult> {
  console.log(`[SmugMug Gallery] Using smart fallback extraction: ${galleryUrl}`)

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xhtml+xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  }

  // Try both the plain URL and SmugMug's JSON format endpoint
  const urlsToTry = [galleryUrl]
  const sep = galleryUrl.includes('?') ? '&' : '?'
  urlsToTry.push(`${galleryUrl}${sep}format=json`)

  let html = ''
  for (const url of urlsToTry) {
    try {
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(25000),
      })
      if (response.ok) {
        html = await response.text()
        console.log(`[SmugMug Gallery] Fetched ${html.length} bytes from ${url}`)
        break
      }
    } catch (err) {
      console.warn(`[SmugMug Gallery] Fetch failed for ${url}:`, err)
    }
  }

  if (!html) {
    return {
      galleryUrl,
      directImageUrls: [],
      warnings: ['Could not fetch gallery page.'],
    }
  }

  // Collect all SmugMug image URLs from the page (normal + JSON-escaped)
  const foundUrls = collectSmugMugUrls(html)
  console.log(`[SmugMug Gallery] Fallback found ${foundUrls.length} raw SmugMug URLs`)

  // For each URL, also add an upgraded version (Th/S/M → X5/XL)
  const withUpgrades: string[] = []
  for (const url of foundUrls) {
    withUpgrades.push(url)
    const upgraded = upgradeSmugMugUrl(url, 'X5')
    if (upgraded !== url) withUpgrades.push(upgraded)
    // Also try XL as second choice
    const upgradedXL = upgradeSmugMugUrl(url, 'XL')
    if (upgradedXL !== url && upgradedXL !== upgraded) withUpgrades.push(upgradedXL)
  }

  // Also look for image keys embedded in JSON data blobs
  // SmugMug often embeds "Key":"i-XXXXX" or "ImageKey":"i-XXXXX" in their script tags
  const keyPattern = /"(?:Key|ImageKey|imageKey|key)"\s*:\s*"(i-[A-Za-z0-9]{4,})"/g
  const foundKeys = new Set<string>()
  let keyMatch: RegExpExecArray | null
  while ((keyMatch = keyPattern.exec(html)) !== null) {
    foundKeys.add(keyMatch[1])
  }

  if (foundKeys.size > 0) {
    console.log(`[SmugMug Gallery] Found ${foundKeys.size} additional image keys in embedded JSON`)
    // If we have template URLs from the page, try to construct higher-res ones for these keys
    // This is a best-effort: find any URL containing one of our known keys and adapt it
    for (const key of foundKeys) {
      const existingUrl = withUpgrades.find(u => u.includes(`/i-${key}/`))
      if (!existingUrl) {
        // Key found in JSON but no URL discovered yet  -  can't construct without knowing album path
        console.log(`[SmugMug Gallery] Key ${key} found in JSON but no URL template available`)
      }
    }
  }

  const bestUrls = extractBestUrls(withUpgrades)
  console.log(`[SmugMug Gallery] Fallback extracted ${bestUrls.length} unique best-resolution images`)

  const warnings: string[] = []
  if (bestUrls.length === 0) {
    warnings.push('No images found. SmugMug galleries load images via JavaScript  -  try the gallery import tool which uses a full browser.')
  } else if (bestUrls.length < 10) {
    warnings.push(`Only ${bestUrls.length} images found in static HTML. The gallery may contain more images that require JavaScript to load.`)
  }

  return {
    galleryUrl,
    directImageUrls: bestUrls,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireApiAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "urls array is required" }, { status: 400 })
    }

    if (urls.length > 20) {
      return NextResponse.json({ error: "Maximum 20 galleries per request" }, { status: 400 })
    }

    const results: GalleryResult[] = []
    const errors: Array<{ url: string; error: string }> = []

    for (const url of urls) {
      if (typeof url !== 'string' || !validateSmugMugUrl(url)) {
        errors.push({ url: String(url), error: 'Invalid SmugMug URL' })
        continue
      }

      try {
        let result: GalleryResult

        try {
          result = await extractGalleryWithPuppeteer(url)
        } catch (puppeteerError) {
          console.warn(`[SmugMug Gallery] Puppeteer failed, using smart fallback:`, puppeteerError)
          result = await extractGalleryFallback(url)
        }

        results.push(result)

      } catch (error) {
        console.error(`[SmugMug Gallery] Failed to extract ${url}:`, error)
        errors.push({
          url,
          error: error instanceof Error ? error.message : 'Extraction failed'
        })
      }
    }

    const response: ExtractionResponse = { results }
    if (errors.length > 0) {
      response.errors = errors
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('[SmugMug Gallery API Error]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract gallery" },
      { status: 500 }
    )
  }
}
