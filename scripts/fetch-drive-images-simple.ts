import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Fetch image IDs from public Google Drive folder
async function fetchDriveFolderImages(folderId: string): Promise<string[]> {
  try {
    console.log(`  📂 Fetching folder: ${folderId}`)
    
    const folderUrl = `https://drive.google.com/drive/folders/${folderId}`
    
    const response = await fetch(folderUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      console.log(`  ⚠️  Failed to fetch folder (${response.status})`)
      return []
    }
    
    const html = await response.text()
    
    // Extract file IDs - Google Drive uses specific patterns for image files
    // Look for patterns like: ["FILE_ID"..."image/jpeg"] or similar
    const patterns = [
      /\["([\w-]{28,})"[^\]]*"image\//g,
      /data-id="([\w-]{28,})"/g,
    ]
    
    const fileIds = new Set<string>()
    
    for (const pattern of patterns) {
      const matches = html.matchAll(pattern)
      for (const match of matches) {
        fileIds.add(match[1])
      }
    }
    
    if (fileIds.size === 0) {
      console.log(`  ⚠️  No images found (folder may be private or empty)`)
      return []
    }
    
    console.log(`  ✅ Found ${fileIds.size} images`)
    
    // Convert to high-resolution URLs (w6000 = 6000px width for maximum quality)
    const imageUrls = Array.from(fileIds).map(id => 
      `https://drive.google.com/thumbnail?id=${id}&sz=w6000`
    )
    
    return imageUrls
  } catch (error: any) {
    console.error(`  ❌ Error:`, error.message)
    return []
  }
}

async function importVillaImages() {
  console.log("🖼️  Starting villa image import from Google Drive...\n")
  
  // Get all villas with Drive folder IDs
  const villas = await db
    .select()
    .from(inventory)
    .where(eq(inventory.category, "villa"))
  
  const villasWithDrive = villas.filter(v => {
    const specs = v.specifications as any
    return specs?.driveFolderId
  })
  
  console.log(`📊 Found ${villasWithDrive.length} villas with Google Drive folders\n`)
  
  let processed = 0
  let succeeded = 0
  let failed = 0
  
  for (const villa of villasWithDrive) {
    const specs = villa.specifications as any
    const folderId = specs.driveFolderId
    
    console.log(`\n🏖️  ${processed + 1}/${villasWithDrive.length}: ${villa.title}`)
    processed++
    
    try {
      // Fetch image URLs from Drive folder
      const imageUrls = await fetchDriveFolderImages(folderId)
      
      if (imageUrls.length === 0) {
        failed++
        continue
      }
      
      // Limit to first 15 images
      const finalUrls = imageUrls.slice(0, 15)
      
      // Update villa with image URLs
      await db
        .update(inventory)
        .set({ images: finalUrls as any })
        .where(eq(inventory.id, villa.id))
      
      console.log(`  ✅ Updated with ${finalUrls.length} images`)
      succeeded++
      
    } catch (error: any) {
      console.error(`  ❌ Failed:`, error.message)
      failed++
    }
    
    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log(`\n🎉 Image import complete!`)
  console.log(`✅ Successfully processed: ${succeeded}/${villasWithDrive.length}`)
  console.log(`❌ Failed: ${failed}/${villasWithDrive.length}`)
}

importVillaImages()
  .then(() => {
    console.log("\n✨ Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Import failed:", error)
    process.exit(1)
  })
