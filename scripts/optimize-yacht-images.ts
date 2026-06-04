import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { optimizeImageBatch } from "@/lib/image-optimizer"

async function optimizeYachtImages() {
  console.log("🚤 Starting yacht image optimization...\n")
  
  // Get all yachts with images
  const yachts = await db
    .select()
    .from(inventory)
    .where(eq(inventory.category, "yacht"))
  
  const yachtsWithImages = yachts.filter(y => {
    const images = y.images as string[] | null
    return images && images.length > 0
  })
  
  console.log(`📊 Found ${yachtsWithImages.length} yachts with images\n`)
  
  let processed = 0
  let succeeded = 0
  let failed = 0
  
  for (const yacht of yachtsWithImages) {
    console.log(`\n🚤 ${processed + 1}/${yachtsWithImages.length}: ${yacht.title}`)
    processed++
    
    try {
      const currentImages = yacht.images as string[]
      console.log(`  Current images: ${currentImages.length}`)
      
      // Check if already optimized (images start with /objects/)
      const alreadyOptimized = currentImages.every(img => img.startsWith('/objects/'))
      
      if (alreadyOptimized) {
        console.log(`  ⏭️  Already optimized, skipping`)
        succeeded++
        continue
      }
      
      // Optimize images
      const slug = yacht.slug || yacht.id.toString()
      const destinationPrefix = `yachts/${slug}/image`
      
      console.log(`  🔄 Optimizing ${currentImages.length} images to WebP...`)
      
      const results = await optimizeImageBatch(currentImages, destinationPrefix, {
        quality: 85,
        format: 'webp',
        maxWidth: 2400, // Max width for web display
      })
      
      // Extract new URLs
      const newImageUrls = results.map(r => r.newUrl)
      
      // Count successful optimizations
      const optimizedCount = results.filter(r => r.newUrl !== r.originalUrl).length
      
      if (optimizedCount === 0) {
        console.log(`  ⚠️  No images were optimized`)
        failed++
        continue
      }
      
      // Update database with optimized images
      await db
        .update(inventory)
        .set({ images: newImageUrls as any })
        .where(eq(inventory.id, yacht.id))
      
      console.log(`  ✅ Updated with ${optimizedCount}/${currentImages.length} optimized WebP images`)
      succeeded++
      
    } catch (error: any) {
      console.error(`  ❌ Failed:`, error.message)
      failed++
    }
  }
  
  console.log(`\n✨ Yacht image optimization complete!`)
  console.log(`✅ Successfully optimized: ${succeeded}/${yachtsWithImages.length}`)
  console.log(`❌ Failed: ${failed}/${yachtsWithImages.length}`)
}

optimizeYachtImages()
  .then(() => {
    console.log("\n🎉 Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Optimization failed:", error)
    process.exit(1)
  })
