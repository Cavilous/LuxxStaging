export interface SmugMugImage {
  url: string
  alt: string
}

function validateSmugMugUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname.endsWith('.smugmug.com') || parsedUrl.hostname === 'smugmug.com'
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

export async function extractImagesFromSmugMug(smugmugUrl: string): Promise<SmugMugImage[]> {
  if (!validateSmugMugUrl(smugmugUrl)) {
    throw new Error('Invalid SmugMug URL. Only SmugMug.com URLs are allowed.')
  }
  
  try {
    console.log('[SmugMug] Fetching gallery:', smugmugUrl)
    
    const response = await fetch(smugmugUrl, {
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch SmugMug gallery: ${response.statusText}`)
    }

    const html = await response.text()
    console.log('[SmugMug] Downloaded HTML, size:', html.length, 'bytes')
    
    // Very broad regex to capture ALL SmugMug photo URLs in any format (including Original "O" size)
    const imageRegex = /https:\/\/photos\.smugmug\.com\/[^\s"'<>]+?\/i-[^\s"'<>\/]+\/[^\s"'<>]+?\/(O|Ti|Th|S|M|L|XL|X2|X3|X4|X5|4K|5K)\/[^\s"'<>]+?\.(jpg|jpeg|png|gif)/gi
    
    let match
    const imagesByKey = new Map<string, Array<{ url: string; size: string; priority: number }>>()
    let totalMatches = 0
    
    // Collect ALL URLs for each image key
    while ((match = imageRegex.exec(html)) !== null) {
      totalMatches++
      const fullUrl = match[0]
      
      // Extract the image key (i-xxxxx)
      const imageKeyMatch = fullUrl.match(/\/i-([^\/]+)\//)
      if (!imageKeyMatch) {
        continue
      }
      
      const imageKey = imageKeyMatch[1]
      
      // Extract size from URL
      const sizeMatch = fullUrl.match(/\/(O|Ti|Th|S|M|L|XL|X2|X3|X4|X5|4K|5K)\//)
      if (!sizeMatch) {
        continue
      }
      
      const size = sizeMatch[1]
      const priority = SIZE_PRIORITY[size] ?? 0
      
      if (!imagesByKey.has(imageKey)) {
        imagesByKey.set(imageKey, [])
      }
      
      imagesByKey.get(imageKey)!.push({ url: fullUrl, size, priority })
    }
    
    console.log(`[SmugMug] Found ${imagesByKey.size} unique images with ${totalMatches} total URLs`)
    
    // Select highest resolution URL for each image
    const imageUrls: SmugMugImage[] = []
    let index = 1
    
    for (const [imageKey, urls] of imagesByKey.entries()) {
      // Sort by priority (highest first)
      urls.sort((a, b) => b.priority - a.priority)
      const bestUrl = urls[0]
      
      console.log(`[SmugMug] Image ${index} (${imageKey}): Selected ${bestUrl.size} resolution (${urls.length} sizes available)`)
      
      // Extract filename for alt text
      const fileNameMatch = bestUrl.url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif)$/i)
      const fileName = fileNameMatch ? fileNameMatch[1] : `image-${index}`
      
      const altText = fileName
        .replace(/-(O|Ti|Th|S|M|L|XL|X2|X3|X4|X5|4K|5K)$/i, '')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      
      imageUrls.push({
        url: bestUrl.url,
        alt: `Image ${index}: ${altText}`,
      })
      
      index++
    }
    
    if (imageUrls.length === 0) {
      throw new Error('No images found in SmugMug gallery HTML')
    }
    
    console.log(`[SmugMug] Successfully extracted ${imageUrls.length} highest-resolution images from gallery`)
    
    return imageUrls
  } catch (error) {
    console.error('[SmugMug Import Error]:', error)
    throw error
  }
}
