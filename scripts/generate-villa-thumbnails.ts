import { db } from '../lib/db'
import { inventory } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import sharp from 'sharp'
import { Storage } from '@google-cloud/storage'
import { randomUUID } from 'crypto'

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106"

const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
})

// Use public object search paths for thumbnails (accessible without auth)
const PUBLIC_OBJECT_SEARCH_PATHS = process.env.PUBLIC_OBJECT_SEARCH_PATHS || ''
const THUMBNAIL_WIDTH = 400
const THUMBNAIL_HEIGHT = 300

interface ThumbnailStats {
  totalVillas: number
  totalImages: number
  processedVillas: number
  processedImages: number
  failedImages: number
  skippedVillas: number
}

async function downloadImageFromUrl(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function resizeImage(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer)
    .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 85, progressive: true })
    .toBuffer()
}

async function uploadToObjectStorage(thumbnailBuffer: Buffer): Promise<string> {
  if (!PUBLIC_OBJECT_SEARCH_PATHS) {
    throw new Error('PUBLIC_OBJECT_SEARCH_PATHS environment variable not set')
  }

  // Use first public path for thumbnails
  const publicPath = PUBLIC_OBJECT_SEARCH_PATHS.split(',')[0].trim()
  if (!publicPath) {
    throw new Error('No valid public path found in PUBLIC_OBJECT_SEARCH_PATHS')
  }

  const thumbnailId = randomUUID()
  const objectPath = `${publicPath}/thumbnails/${thumbnailId}.jpg`
  
  const pathParts = objectPath.split('/')
  const bucketName = pathParts[1]
  const objectName = pathParts.slice(2).join('/')

  const bucket = objectStorageClient.bucket(bucketName)
  const file = bucket.file(objectName)

  await file.save(thumbnailBuffer, {
    metadata: {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000',
      metadata: {
        generated: new Date().toISOString(),
        width: THUMBNAIL_WIDTH.toString(),
        height: THUMBNAIL_HEIGHT.toString(),
      },
    },
  })

  // Make the file publicly readable
  await file.makePublic()

  // Return public URL
  return `https://storage.googleapis.com/${bucketName}/${objectName}`
}

async function processVilla(villa: any, stats: ThumbnailStats): Promise<void> {
  const images = Array.isArray(villa.images) 
    ? villa.images.filter((img: any) => typeof img === 'string' && img.startsWith('https://'))
    : []

  // Skip if no images or already has thumbnails
  const existingThumbnails = Array.isArray(villa.thumbnails) ? villa.thumbnails : []
  if (images.length === 0) {
    console.log(`  ⏭️  Skipping ${villa.title}: No images`)
    stats.skippedVillas++
    return
  }

  if (existingThumbnails.length === images.length) {
    console.log(`  ⏭️  Skipping ${villa.title}: Already has ${existingThumbnails.length} thumbnails`)
    stats.skippedVillas++
    return
  }

  console.log(`\n📍 Processing: ${villa.title}`)
  console.log(`   Found ${images.length} images`)

  const thumbnailUrls: string[] = []
  
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i]
    try {
      console.log(`   [${i + 1}/${images.length}] Processing image...`)
      
      // Download original image
      const imageBuffer = await downloadImageFromUrl(imageUrl)
      stats.totalImages++
      
      // Resize to thumbnail
      const thumbnailBuffer = await resizeImage(imageBuffer)
      
      // Upload to Object Storage
      const thumbnailUrl = await uploadToObjectStorage(thumbnailBuffer)
      thumbnailUrls.push(thumbnailUrl)
      
      stats.processedImages++
      console.log(`   ✓ Created thumbnail ${i + 1}`)
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`   ❌ Failed to process image ${i + 1}:`, error)
      stats.failedImages++
      // Use original URL as fallback
      thumbnailUrls.push(imageUrl)
    }
  }

  // Update database with thumbnail URLs
  await db
    .update(inventory)
    .set({
      thumbnails: thumbnailUrls,
      updatedAt: new Date(),
    })
    .where(eq(inventory.id, villa.id))

  stats.processedVillas++
  console.log(`   ✅ Updated ${villa.title} with ${thumbnailUrls.length} thumbnails`)
}

async function generateVillaThumbnails() {
  console.log('🏠 Starting Villa Thumbnail Generation\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (!PUBLIC_OBJECT_SEARCH_PATHS) {
    console.error('❌ PUBLIC_OBJECT_SEARCH_PATHS environment variable not set!')
    console.error('Please set it in your Replit environment variables.')
    console.error('Example: /bucket-name/public or /bucket-name/assets')
    process.exit(1)
  }

  console.log(`📁 Using public storage path: ${PUBLIC_OBJECT_SEARCH_PATHS.split(',')[0].trim()}\n`)

  const stats: ThumbnailStats = {
    totalVillas: 0,
    totalImages: 0,
    processedVillas: 0,
    processedImages: 0,
    failedImages: 0,
    skippedVillas: 0,
  }

  try {
    // Fetch all villas
    const villas = await db
      .select()
      .from(inventory)
      .where(eq(inventory.category, 'villa'))

    stats.totalVillas = villas.length
    console.log(`📊 Found ${stats.totalVillas} villas to process\n`)

    // Process each villa
    for (const villa of villas) {
      await processVilla(villa, stats)
    }

    // Print final stats
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Thumbnail Generation Complete!\n')
    console.log('📊 Final Statistics:')
    console.log(`   Total Villas: ${stats.totalVillas}`)
    console.log(`   Processed Villas: ${stats.processedVillas}`)
    console.log(`   Skipped Villas: ${stats.skippedVillas}`)
    console.log(`   Total Images: ${stats.totalImages}`)
    console.log(`   Successfully Processed: ${stats.processedImages}`)
    console.log(`   Failed: ${stats.failedImages}`)
    console.log(`   Success Rate: ${((stats.processedImages / stats.totalImages) * 100).toFixed(1)}%`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
generateVillaThumbnails()
  .then(() => {
    console.log('🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
