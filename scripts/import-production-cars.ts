import { readFileSync } from 'fs'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../lib/db/schema'
import { inventory } from '../lib/db/schema'
import { eq, and } from 'drizzle-orm'

interface CarRow {
  make: string
  model: string
  color: string
  price: string
  imageLinks: string
}

interface ParsedCar {
  title: string
  make: string
  model: string
  exteriorColor: string
  interiorColor: string
  pricePerDay: number | null
  smugmugUrl: string | null
}

async function fetchSmugMugImages(galleryUrl: string): Promise<string[]> {
  try {
    if (!galleryUrl || galleryUrl.includes('drive.google.com') || galleryUrl.toLowerCase().includes('no photos')) {
      return []
    }

    console.log(`  Fetching images from: ${galleryUrl.substring(0, 60)}...`)
    
    const response = await fetch(galleryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      console.warn(`  ⚠️  Failed to fetch gallery (${response.status})`)
      return []
    }

    const html = await response.text()
    
    const imageUrls: string[] = []
    const imgRegex = /"ImageURL":"(https:\/\/[^"]+)"/g
    let match

    while ((match = imgRegex.exec(html)) !== null) {
      const url = match[1].replace(/\\u002F/g, '/')
      if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) {
        imageUrls.push(url)
      }
    }

    if (imageUrls.length === 0) {
      const directImgRegex = /https:\/\/photos\.smugmug\.com\/[^"'\s]+\.jpg/gi
      const directMatches = html.match(directImgRegex)
      if (directMatches) {
        imageUrls.push(...directMatches)
      }
    }

    const uniqueImages = [...new Set(imageUrls)].slice(0, 15)
    console.log(`  ✓ Found ${uniqueImages.length} images`)
    return uniqueImages
  } catch (error) {
    console.error(`  ❌ Error fetching images:`, error)
    return []
  }
}

function parseColor(colorStr: string): { exterior: string; interior: string } {
  if (!colorStr) return { exterior: '', interior: '' }

  const cleanColor = colorStr.trim()
  
  // Handle "Black / Red" or "Black On Red" format
  if (cleanColor.includes('/') || cleanColor.toLowerCase().includes(' on ')) {
    const parts = cleanColor.split(/\s*\/\s*|\s+on\s+/i)
    return {
      exterior: parts[0]?.trim() || '',
      interior: parts[1]?.trim() || ''
    }
  }

  // Single color
  return { exterior: cleanColor, interior: '' }
}

function parsePrice(priceStr: string): number | null {
  if (!priceStr || priceStr.toLowerCase().includes('request') || priceStr.toLowerCase().includes('price upon')) {
    return null
  }

  const numericPrice = priceStr.replace(/[^0-9.]/g, '')
  const price = parseFloat(numericPrice)
  
  return isNaN(price) ? null : price
}

function parseCsvRow(row: string): CarRow | null {
  const parts = row.split(',')
  
  if (parts.length < 5) return null
  
  const make = parts[0]?.trim() || ''
  const model = parts[1]?.trim() || ''
  
  // Skip header rows and empty rows
  if (!make || !model || make.toLowerCase() === 'make') {
    return null
  }

  return {
    make,
    model,
    color: parts[2]?.trim() || '',
    price: parts[3]?.trim() || '',
    imageLinks: parts.slice(4).join(',').trim()
  }
}

function parseCar(row: CarRow): ParsedCar | null {
  const { make, model, color, price, imageLinks } = row
  
  if (!make || !model) return null

  const { exterior, interior } = parseColor(color)
  const pricePerDay = parsePrice(price)
  
  const title = `${make.trim()} ${model.trim()}`

  let smugmugUrl: string | null = null
  if (imageLinks && !imageLinks.toLowerCase().includes('no photos')) {
    const urlMatch = imageLinks.match(/https?:\/\/[^\s"',]+/)
    if (urlMatch) {
      const url = urlMatch[0]
      if (url.includes('smugmug.com')) {
        smugmugUrl = url
      } else if (url.includes('drive.google.com')) {
        console.log(`  ⚠️  Skipping Google Drive link for ${title}`)
      }
    }
  }

  return {
    title,
    make: make.trim(),
    model: model.trim(),
    exteriorColor: exterior,
    interiorColor: interior,
    pricePerDay,
    smugmugUrl
  }
}

async function main() {
  console.log('🚀 Starting PRODUCTION bulk car import...')
  console.log('⚠️  WARNING: Importing to PRODUCTION database\n')
  
  const productionDbUrl = process.env.DATABASE_URL
  
  if (!productionDbUrl) {
    console.error('❌ ERROR: DATABASE_URL not found')
    process.exit(1)
  }

  console.log(`📊 Connecting to production database...`)
  const client = postgres(productionDbUrl, { prepare: false })
  const db = drizzle(client, { schema })

  const csvContent = readFileSync('attached_assets/CARS - Sheet1_1763857218492.csv', 'utf-8')
  const lines = csvContent.split('\n')
  const cars: ParsedCar[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (!trimmedLine || trimmedLine.startsWith(',,,')) {
      continue
    }

    const row = parseCsvRow(trimmedLine)
    if (!row) continue

    const parsed = parseCar(row)
    if (parsed) {
      cars.push(parsed)
    }
  }

  console.log(`📋 Parsed ${cars.length} cars from CSV\n`)

  let imported = 0
  let skipped = 0
  let failed = 0
  let batchCount = 0

  for (const car of cars) {
    try {
      // Check for duplicates
      const existing = await db
        .select()
        .from(inventory)
        .where(
          and(
            eq(inventory.category, 'car'),
            eq(inventory.title, car.title)
          )
        )
        .limit(1)

      if (existing.length > 0) {
        console.log(`⏭️  Skipping duplicate: ${car.title}`)
        skipped++
        continue
      }

      console.log(`\n📦 Processing ${imported + 1}/${cars.length}: ${car.title}`)
      
      // Fetch images from SmugMug
      const images: string[] = []
      if (car.smugmugUrl) {
        const fetchedImages = await fetchSmugMugImages(car.smugmugUrl)
        if (fetchedImages.length > 0) {
          images.push(...fetchedImages)
        }
      }

      // Build specifications
      const specifications: any = {
        make: car.make,
        model: car.model
      }

      if (car.exteriorColor) specifications.exteriorColor = car.exteriorColor
      if (car.interiorColor) specifications.interiorColor = car.interiorColor

      // Insert into database
      await db.insert(inventory).values({
        category: 'car',
        title: car.title,
        description: `Experience luxury and performance with the ${car.title}. ${car.exteriorColor ? `This stunning ${car.exteriorColor} vehicle` : 'This exceptional vehicle'} delivers an unforgettable driving experience in Miami.`,
        pricePerDay: car.pricePerDay ? car.pricePerDay.toString() : null,
        specifications,
        images,
        smugmugUrl: car.smugmugUrl,
        isPublished: false,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      imported++
      console.log(`✅ Imported: ${car.title} - ${images.length} images`)

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200))

      // Progress update every 10 cars
      if (imported % 10 === 0) {
        console.log(`\n📊 Progress: ${imported}/${cars.length} cars imported`)
      }

    } catch (error) {
      console.error(`❌ Failed to import ${car.title}:`, error)
      failed++
    }
  }

  await client.end()

  console.log('\n═══════════════════════════════════════')
  console.log('📊 PRODUCTION IMPORT RESULTS')
  console.log('═══════════════════════════════════════')
  console.log(`✅ Imported: ${imported}`)
  console.log(`⏭️  Skipped:  ${skipped}`)
  console.log(`❌ Failed:   ${failed}`)
  console.log('═══════════════════════════════════════\n')
  
  console.log('🎉 Import complete! All cars are set to DRAFT status.')
  console.log('📝 Review and publish from /admin/inventory\n')
  
  process.exit(0)
}

main().catch((error) => {
  console.error('💥 Script failed:', error)
  process.exit(1)
})
