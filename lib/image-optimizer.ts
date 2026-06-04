import sharp from 'sharp'
import { uploadToObjectStorage } from './object-storage'

export interface ImageOptimizationOptions {
  quality?: number // WebP quality (1-100), default 85
  maxWidth?: number // Maximum width in pixels, default unlimited
  maxHeight?: number // Maximum height in pixels, default unlimited
  format?: 'webp' | 'jpeg' | 'png' // Output format, default webp
}

export interface OptimizedImage {
  buffer: Buffer
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  width: number
  height: number
  format: string
}

/**
 * Download and optimize an image from a URL
 * Converts to WebP format with configurable quality for optimal file size
 */
export async function downloadAndOptimizeImage(
  imageUrl: string,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImage> {
  const {
    quality = 85,
    maxWidth,
    maxHeight,
    format = 'webp'
  } = options

  try {
    console.log(`[Image Optimizer] Downloading: ${imageUrl.substring(0, 80)}...`)
    
    // Download image
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(30000), // 30s timeout
    })
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const originalBuffer = Buffer.from(arrayBuffer)
    const originalSize = originalBuffer.length
    
    console.log(`[Image Optimizer] Downloaded ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
    
    // Get original image metadata
    const metadata = await sharp(originalBuffer).metadata()
    console.log(`[Image Optimizer] Original: ${metadata.width}x${metadata.height} ${metadata.format}`)
    
    // Optimize image
    let pipeline = sharp(originalBuffer)
    
    // Resize if needed
    if (maxWidth || maxHeight) {
      pipeline = pipeline.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }
    
    // Convert to target format
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality })
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality })
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality })
    }
    
    const optimizedBuffer = await pipeline.toBuffer()
    const optimizedSize = optimizedBuffer.length
    const compressionRatio = ((1 - optimizedSize / originalSize) * 100)
    
    // Get final dimensions
    const finalMetadata = await sharp(optimizedBuffer).metadata()
    
    console.log(`[Image Optimizer] Optimized: ${finalMetadata.width}x${finalMetadata.height} ${format}`)
    console.log(`[Image Optimizer] Size: ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(optimizedSize / 1024 / 1024).toFixed(2)} MB (${compressionRatio.toFixed(1)}% reduction)`)
    
    return {
      buffer: optimizedBuffer,
      originalSize,
      optimizedSize,
      compressionRatio,
      width: finalMetadata.width!,
      height: finalMetadata.height!,
      format,
    }
  } catch (error) {
    console.error(`[Image Optimizer] Error processing ${imageUrl}:`, error)
    throw error
  }
}

/**
 * Download, optimize, and upload an image to object storage
 * Returns the new URL in object storage
 */
export async function optimizeAndUploadImage(
  imageUrl: string,
  destinationPath: string,
  options: ImageOptimizationOptions = {}
): Promise<{ url: string; metadata: OptimizedImage }> {
  // Download and optimize
  const optimized = await downloadAndOptimizeImage(imageUrl, options)
  
  // Upload to object storage
  const uploadedUrl = await uploadToObjectStorage(
    optimized.buffer,
    destinationPath,
    `image/${optimized.format}`
  )
  
  console.log(`[Image Optimizer] Uploaded to: ${uploadedUrl}`)
  
  return {
    url: uploadedUrl,
    metadata: optimized,
  }
}

/**
 * Batch process multiple images with progress tracking
 */
export async function optimizeImageBatch(
  imageUrls: string[],
  destinationPathPrefix: string,
  options: ImageOptimizationOptions = {}
): Promise<Array<{ originalUrl: string; newUrl: string; metadata: OptimizedImage }>> {
  const results = []
  
  console.log(`[Image Optimizer] Starting batch optimization of ${imageUrls.length} images`)
  
  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i]
    const destinationPath = `${destinationPathPrefix}-${i + 1}.${options.format || 'webp'}`
    
    try {
      console.log(`\n[Image Optimizer] Processing ${i + 1}/${imageUrls.length}`)
      
      const result = await optimizeAndUploadImage(imageUrl, destinationPath, options)
      
      results.push({
        originalUrl: imageUrl,
        newUrl: result.url,
        metadata: result.metadata,
      })
      
      // Rate limiting - wait between uploads
      if (i < imageUrls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error(`[Image Optimizer] Failed to process image ${i + 1}:`, error)
      // Keep original URL on failure
      results.push({
        originalUrl: imageUrl,
        newUrl: imageUrl,
        metadata: {
          buffer: Buffer.from(''),
          originalSize: 0,
          optimizedSize: 0,
          compressionRatio: 0,
          width: 0,
          height: 0,
          format: 'unknown',
        },
      })
    }
  }
  
  // Summary - only count successful optimizations for stats
  const successful = results.filter(r => r.newUrl !== r.originalUrl)
  const failed = results.filter(r => r.newUrl === r.originalUrl)
  
  const totalOriginalSize = successful.reduce((sum, r) => sum + r.metadata.originalSize, 0)
  const totalOptimizedSize = successful.reduce((sum, r) => sum + r.metadata.optimizedSize, 0)
  const totalCompression = totalOriginalSize > 0 
    ? ((1 - totalOptimizedSize / totalOriginalSize) * 100)
    : 0
  
  console.log(`\n[Image Optimizer] Batch complete!`)
  console.log(`✅ Successful: ${successful.length}/${imageUrls.length}`)
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}/${imageUrls.length} (kept original URLs)`)
  }
  if (successful.length > 0) {
    console.log(`💾 Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB → ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB (${totalCompression.toFixed(1)}% reduction)`)
  }
  
  return results
}
