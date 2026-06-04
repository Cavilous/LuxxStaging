import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { parse } from "papaparse"
import { readFileSync } from "fs"
import { join } from "path"

interface VillaRow {
  "VILLA NAME ": string
  LOCATION: string
  "PROPERTY INFO ": string
  "retail $ starting at / weekend rates subject to change + tax": string
  "SECURITY DEP.": string
  "CLEANING FEE": string
  "PROPERTY PHOTOS ": string
}

// Intelligent parser for property info
function parsePropertyInfo(propertyInfo: string) {
  const info = {
    bedrooms: 0,
    bathrooms: 0,
    guests: 0,
  }

  // Extract bedrooms - various formats: "7BR", "7 Bedrooms", "7 bedrooms", "7 bed"
  const bedroomMatch = propertyInfo.match(/(\d+)\s*(?:BR|bedroom|bedrooms|bed)/i)
  if (bedroomMatch) {
    info.bedrooms = parseInt(bedroomMatch[1])
  }

  // Extract bathrooms - various formats: "6.5 Bathrooms", "6 bath", "6 BA"
  const bathroomMatch = propertyInfo.match(/(\d+(?:\.\d+)?)\s*(?:bathroom|bathrooms|bath|BA)/i)
  if (bathroomMatch) {
    info.bathrooms = parseFloat(bathroomMatch[1])
  }

  // Extract guests - formats: "Sleeps 16", "16 guests", "12 guests"
  const guestsMatch = propertyInfo.match(/(?:Sleeps|sleeps)\s*(\d+)|(\d+)\s*guests/i)
  if (guestsMatch) {
    info.guests = parseInt(guestsMatch[1] || guestsMatch[2])
  }

  return info
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

// Extract Google Drive folder ID from URL
function extractDriveFolderId(url: string): string | null {
  if (!url || !url.includes("drive.google.com")) return null
  
  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

// Generate slug from villa name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function importVillas() {
  console.log("🏖️  Starting villa import...")

  const csvPath = join(process.cwd(), "attached_assets", "Parker Final - Villas_1763739811448.csv")
  const csvContent = readFileSync(csvPath, "utf-8")

  const { data } = parse<VillaRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  console.log(`📊 Found ${data.length} villas to import`)

  let imported = 0
  let skipped = 0
  const seenSlugs = new Set<string>()
  let duplicateCounter = 0

  for (const row of data) {
    const villaName = row["VILLA NAME "]?.trim()
    const location = row.LOCATION?.trim()
    const propertyInfo = row["PROPERTY INFO "]?.trim()
    const priceStr = row["retail $ starting at / weekend rates subject to change + tax"]?.trim()
    const securityDep = row["SECURITY DEP."]?.trim()
    const cleaningFee = row["CLEANING FEE"]?.trim()
    const photosUrl = row["PROPERTY PHOTOS "]?.trim()

    if (!villaName || villaName === "VILLA NAME") {
      skipped++
      continue
    }

    // Skip if location is "waiting on update"
    const isIncomplete = location?.toLowerCase().includes("waiting") || 
                          propertyInfo?.toLowerCase().includes("waiting")

    // Parse property details
    const propertyDetails = parsePropertyInfo(propertyInfo || "")
    const pricePerDay = parsePrice(priceStr)
    const securityDeposit = parsePrice(securityDep)
    const cleaningFeeAmount = parsePrice(cleaningFee)

    // Create slug (handle duplicates)
    let slug = generateSlug(villaName)
    if (seenSlugs.has(slug)) {
      duplicateCounter++
      slug = `${slug}-${duplicateCounter}`
      console.log(`⚠️  Duplicate slug detected, using: ${slug}`)
    }
    seenSlugs.add(slug)

    // Extract Drive folder ID for later image fetching
    const driveFolderId = extractDriveFolderId(photosUrl || "")

    // Build specifications object
    const specifications = {
      bedrooms: propertyDetails.bedrooms || null,
      bathrooms: propertyDetails.bathrooms || null,
      guests: propertyDetails.guests || null,
      location: location || "Miami",
      securityDeposit: securityDeposit || null,
      cleaningFee: cleaningFeeAmount || null,
      amenities: ["Pool", "WiFi", "Air Conditioning"],
      driveFolderId: driveFolderId,
    }

    // Build description
    const description = `Luxury villa in ${location || "Miami"}. ${propertyInfo || ""}`

    try {
      await db.insert(inventory).values({
        category: "villa",
        title: villaName,
        subtitle: location || "Miami",
        description: description.trim(),
        pricePerDay: pricePerDay ? pricePerDay.toString() : null,
        specifications: specifications as any,
        images: [], // Will be populated later
        isPublished: !isIncomplete && pricePerDay !== null,
        isFeatured: false,
        slug: slug,
        metaTitle: `${villaName} - Luxury Villa Rental in ${location || "Miami"}`,
        metaDescription: `Book ${villaName}, a ${propertyDetails.bedrooms}-bedroom luxury villa in ${location || "Miami"}. ${propertyDetails.guests ? `Sleeps ${propertyDetails.guests}.` : ""} Starting at $${pricePerDay || "TBD"}/night.`,
      })

      imported++
      console.log(`✅ Imported: ${villaName} (${location})`)
    } catch (error) {
      console.error(`❌ Failed to import ${villaName}:`, error)
      skipped++
    }
  }

  console.log(`\n🎉 Import complete!`)
  console.log(`✅ Successfully imported: ${imported}`)
  console.log(`⏭️  Skipped: ${skipped}`)
}

importVillas()
  .then(() => {
    console.log("✨ Done!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Import failed:", error)
    process.exit(1)
  })
