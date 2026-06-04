import { readFileSync } from "fs"
import { join } from "path"
import { parse } from "papaparse"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { extractImagesFromSmugMug } from "@/lib/smugmug-utils"

interface YachtRow {
  "Boat Brand": string
  "Boat Size": string
  "4 Hour Retail": string
  "Photos": string
}

// Parse pricing - handle various formats
function parsePrice(priceStr: string): number | null {
  if (!priceStr || priceStr.toLowerCase().includes("request") || priceStr.toLowerCase().includes("inquire")) {
    return null
  }

  // Remove $ and commas, parse number
  const cleaned = priceStr.replace(/[$,]/g, "").trim()
  const price = parseFloat(cleaned)
  return isNaN(price) ? null : price
}

// Calculate 6hr and 8hr pricing based on 4hr base
function calculatePackagePricing(price4Hr: number) {
  return {
    price4Hr,
    price6Hr: Math.round(price4Hr * 1.4), // 40% more
    price8Hr: Math.round(price4Hr * 1.7), // 70% more
  }
}

// Extract SmugMug URL from various formats
function extractSmugMugUrl(photoUrl: string): string | null {
  if (!photoUrl) return null
  
  // Already a SmugMug URL
  if (photoUrl.includes("smugmug.com")) {
    return photoUrl.trim()
  }
  
  // Skip non-SmugMug URLs for now
  return null
}

// Generate slug from yacht name
function generateSlug(brand: string, size: string): string {
  const combined = `${brand} ${size}`
  return combined
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Parse boat size to extract length in feet
function parseBoatSize(size: string): number | null {
  const match = size.match(/(\d+)/)
  return match ? parseInt(match[1]) : null
}

async function importYachts() {
  console.log("🚤  Starting yacht import...")

  const csvPath = join(process.cwd(), "attached_assets", "Parker Final - Yachts_1763773073002.csv")
  const csvContent = readFileSync(csvPath, "utf-8")

  const { data } = parse<YachtRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  console.log(`📊 Found ${data.length} yachts to import`)

  let imported = 0
  let skipped = 0
  let failed = 0

  for (const [index, row] of data.entries()) {
    try {
      const brand = row["Boat Brand"]?.trim()
      const size = row["Boat Size"]?.trim()
      const price4HrStr = row["4 Hour Retail"]?.trim()
      const photoUrl = row["Photos"]?.trim()

      // Validate required fields
      if (!brand || !size) {
        console.warn(`⚠️  Row ${index + 1}: Missing brand or size, skipping`)
        skipped++
        continue
      }

      // Parse pricing
      const price4Hr = parsePrice(price4HrStr)
      if (!price4Hr) {
        console.warn(`⚠️  Row ${index + 1}: No valid pricing for ${brand} ${size}, skipping`)
        skipped++
        continue
      }

      const pricing = calculatePackagePricing(price4Hr)
      const slug = generateSlug(brand, size)
      const lengthFt = parseBoatSize(size)

      // Extract SmugMug URL
      const smugmugUrl = extractSmugMugUrl(photoUrl)
      
      let images: string[] = []
      
      if (smugmugUrl) {
        console.log(`🖼️  Fetching images for ${brand} ${size} from SmugMug...`)
        try {
          const smugmugImages = await extractImagesFromSmugMug(smugmugUrl)
          images = smugmugImages.map(img => img.url)
          console.log(`   ✅ Found ${images.length} images`)
        } catch (error) {
          console.error(`   ❌ Failed to fetch SmugMug images:`, error)
          // Continue without images rather than failing
        }
      } else {
        console.log(`⚠️  Row ${index + 1}: No valid SmugMug URL for ${brand} ${size}`)
      }

      // Prepare yacht data
      const title = `${brand} ${size}`
      const description = `Luxury ${lengthFt}' ${brand} yacht available for charter in Miami. Perfect for special occasions, corporate events, and unforgettable experiences on the water.`
      
      const specifications = {
        brand,
        length: size,
        lengthFt,
        capacity: null, // Not provided in CSV
        amenities: ["Captain & Crew", "Sound System", "Air Conditioning", "Water Toys"],
      }

      // Check if yacht already exists
      const existing = await db.query.inventory.findFirst({
        where: (inv, { and, eq }) => and(
          eq(inv.slug, slug),
          eq(inv.category, "yacht")
        )
      })

      if (existing) {
        console.log(`⏭️  Yacht already exists: ${title}, skipping`)
        skipped++
        continue
      }

      // Insert yacht
      await db.insert(inventory).values({
        title,
        subtitle: brand,
        description,
        category: "yacht",
        pricePer4Hr: pricing.price4Hr.toString(),
        pricePer6Hr: pricing.price6Hr.toString(),
        pricePer8Hr: pricing.price8Hr.toString(),
        images: images,
        specifications,
        isPublished: images.length > 0, // Only publish if we have images
        isFeatured: false,
        slug,
        smugmugUrl: smugmugUrl || undefined,
        focalPoint: "50% 40%",
      })

      console.log(`✅ Imported: ${title} (${images.length} images)`)
      imported++

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`❌ Failed to import row ${index + 1}:`, error)
      failed++
    }
  }

  console.log("\n" + "=".repeat(50))
  console.log("🎉 Import Complete!")
  console.log(`✅ Imported: ${imported}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Failed: ${failed}`)
  console.log("=".repeat(50) + "\n")
}

// Run import
importYachts()
  .then(() => {
    console.log("✨ Yacht import finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Yacht import failed:", error)
    process.exit(1)
  })
