import 'server-only'
import sharp from 'sharp'
import { randomUUID } from 'crypto'
import { uploadToObjectStorage, getPublicUrl } from './object-storage'
import type { ImageObject } from './image-types'

const HQ_MAX_WIDTH = 2000
const HQ_MAX_HEIGHT = 2000
const HQ_QUALITY = 82

const LQ_MAX_WIDTH = 800
const LQ_MAX_HEIGHT = 800
const LQ_TARGET_BYTES = 200 * 1024
const LQ_QUALITY_START = 75
const LQ_QUALITY_MIN = 30
const LQ_QUALITY_STEP = 10

export function generateSeoFilename(title: string, index: number): string {
  const slug = title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

  const suffix = index === 0 ? '' : `-${index + 1}`
  return `${slug}${suffix}.webp`
}

async function compressToTarget(
  inputBuffer: Buffer,
  maxWidth: number,
  maxHeight: number,
  targetBytes: number
): Promise<{ buffer: Buffer; quality: number }> {
  let quality = LQ_QUALITY_START

  while (quality >= LQ_QUALITY_MIN) {
    const result = await sharp(inputBuffer)
      .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()

    if (result.length <= targetBytes || quality <= LQ_QUALITY_MIN) {
      return { buffer: result, quality }
    }

    quality -= LQ_QUALITY_STEP
  }

  const finalBuffer = await sharp(inputBuffer)
    .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: LQ_QUALITY_MIN })
    .toBuffer()

  return { buffer: finalBuffer, quality: LQ_QUALITY_MIN }
}

export interface ProcessImageResult {
  imageObject: ImageObject
  hqBytes: number
  lqBytes: number
  originalBytes: number
}

export async function processImageBuffer(
  buffer: Buffer,
  title: string,
  index: number,
  alt: string = ''
): Promise<ProcessImageResult> {
  const originalBytes = buffer.length
  const seoFilename = generateSeoFilename(title, index)
  const baseId = randomUUID()

  const metadata = await sharp(buffer).metadata()
  const originalWidth = metadata.width || 0
  const originalHeight = metadata.height || 0

  const hqBuffer = await sharp(buffer)
    .resize(HQ_MAX_WIDTH, HQ_MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: HQ_QUALITY })
    .toBuffer()

  const hqMeta = await sharp(hqBuffer).metadata()

  const { buffer: lqBuffer } = await compressToTarget(
    buffer,
    LQ_MAX_WIDTH,
    LQ_MAX_HEIGHT,
    LQ_TARGET_BYTES
  )

  const hqPath = `uploads/hq/${baseId}.webp`
  const lqPath = `uploads/lq/${baseId}.webp`

  await Promise.all([
    uploadToObjectStorage(hqBuffer, hqPath, 'image/webp'),
    uploadToObjectStorage(lqBuffer, lqPath, 'image/webp'),
  ])

  const hqUrl = getPublicUrl(hqPath)
  const lqUrl = getPublicUrl(lqPath)

  const imageObject: ImageObject = {
    hqUrl,
    lqUrl,
    width: hqMeta.width || originalWidth,
    height: hqMeta.height || originalHeight,
    bytes: hqBuffer.length,
    format: 'webp',
    alt: alt || `${title} - Image ${index + 1}`,
    seoFilename,
  }

  return {
    imageObject,
    hqBytes: hqBuffer.length,
    lqBytes: lqBuffer.length,
    originalBytes,
  }
}

export async function processImageFromUrl(
  imageUrl: string,
  title: string,
  index: number,
  alt: string = ''
): Promise<ProcessImageResult> {
  console.log(`[ImagePipeline] Downloading: ${imageUrl.substring(0, 80)}...`)

  const response = await fetch(imageUrl, {
    signal: AbortSignal.timeout(30000),
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; LuxxMiami/1.0)',
      'Accept': 'image/*,*/*;q=0.8',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  console.log(`[ImagePipeline] Downloaded ${(buffer.length / 1024).toFixed(0)}KB, processing...`)

  const result = await processImageBuffer(buffer, title, index, alt)

  console.log(
    `[ImagePipeline] Done: HQ=${(result.hqBytes / 1024).toFixed(0)}KB, ` +
    `LQ=${(result.lqBytes / 1024).toFixed(0)}KB, ` +
    `${result.imageObject.width}x${result.imageObject.height}`
  )

  return result
}

export interface BatchProcessResult {
  images: ImageObject[]
  stats: {
    total: number
    success: number
    failed: number
    totalOriginalKB: number
    totalHqKB: number
    totalLqKB: number
  }
  errors: Array<{ index: number; url: string; error: string }>
}

export async function processImageBatch(
  imageUrls: string[],
  title: string,
  existingAlts: string[] = []
): Promise<BatchProcessResult> {
  const images: ImageObject[] = []
  const errors: Array<{ index: number; url: string; error: string }> = []
  let totalOriginalKB = 0
  let totalHqKB = 0
  let totalLqKB = 0

  console.log(`[ImagePipeline] Starting batch: ${imageUrls.length} images for "${title}"`)

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]
    const alt = existingAlts[i] || ''

    try {
      console.log(`[ImagePipeline] Processing ${i + 1}/${imageUrls.length}...`)
      const result = await processImageFromUrl(url, title, i, alt)
      images.push(result.imageObject)
      totalOriginalKB += result.originalBytes / 1024
      totalHqKB += result.hqBytes / 1024
      totalLqKB += result.lqBytes / 1024

      if (i < imageUrls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[ImagePipeline] Failed image ${i + 1}: ${errorMsg}`)
      errors.push({ index: i, url, error: errorMsg })
    }
  }

  console.log(
    `[ImagePipeline] Batch complete: ${images.length}/${imageUrls.length} success, ` +
    `Original=${totalOriginalKB.toFixed(0)}KB, HQ=${totalHqKB.toFixed(0)}KB, LQ=${totalLqKB.toFixed(0)}KB`
  )

  return {
    images,
    stats: {
      total: imageUrls.length,
      success: images.length,
      failed: errors.length,
      totalOriginalKB: Math.round(totalOriginalKB),
      totalHqKB: Math.round(totalHqKB),
      totalLqKB: Math.round(totalLqKB),
    },
    errors,
  }
}
