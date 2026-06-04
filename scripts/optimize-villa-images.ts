import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { optimizeImageBatch } from "@/lib/image-optimizer"

async function optimizeVillaImages() {
  console.log("🏖️  Starting villa image optimization...\n")
  
  // Get all villas with images
  const villas = await db
    .select()
    .from(inventory)
    .where(eq(inventory.category, "villa"))
  
  const villasWithImages = villas.filter(v => {
    const images = v.images as string[] | null
    return images && images.length > 0
  })
  
  console.log(`📊 Found ${villasWithImages.length} villas with images\n`)
  
  let processed = 0
  let succeeded = 0
  let failed = 0
  
  for (const villa of villasWithImages) {
    console.log(`\n🏖️  ${processed + 1}/${villasWithImages.length}: ${villa.title}`)
    processed++
    
    try {
      const currentImages = villa.images as string[]
      console.log(`  Current images: ${currentImages.length}`)
      
      // Check if already optimized (images start with /objects/)
      const alreadyOptimized = currentImages.every(img => img.startsWith('/objects/'))
      
      if (alreadyOptimized) {
        console.log(`  ⏭️  Already optimized, skipping`)
        succeeded++
        continue
      }
      
      // Optimize images
      const slug = villa.slug || villa.id.toString()
      const destinationPrefix = `villas/${slug}/image`
      
      console.log(`  🔄 Optimizing ${currentImages.length} images to WebP...`)
      
      const results = await optimizeImageBatch(currentImages, destinationPrefix, {
        quality: 90, // Higher quality for villas (more detail needed)
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
        .where(eq(inventory.id, villa.id))
      
      console.log(`  ✅ Updated with ${optimizedCount}/${currentImages.length} optimized WebP images`)
      succeeded++
      
    } catch (error: any) {
      console.error(`  ❌ Failed:`, error.message)
      failed++
    }
  }
  
  console.log(`\n✨ Villa image optimization complete!`)
  console.log(`✅ Successfully optimized: ${succeeded}/${villasWithImages.length}`)
  console.log(`❌ Failed: ${failed}/${villasWithImages.length}`)
}

optimizeVillaImages()
  .then(() => {
    console.log("\n🎉 Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Optimization failed:", error)
    process.exit(1)
  })
