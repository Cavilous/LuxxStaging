"use server"

import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

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

    const response = await fetch(galleryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      console.warn(`Failed to fetch SmugMug gallery: ${galleryUrl}`)
      return []
    }

    const html = await response.text()
    
    const imageUrls: string[]= []
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

    return [...new Set(imageUrls)].slice(0, 15)
  } catch (error) {
    console.error(`Error fetching SmugMug images from ${galleryUrl}:`, error)
    return []
  }
}

function parseColor(colorStr: string): { exterior: string; interior: string } {
  if (!colorStr) return { exterior: '', interior: '' }

  const cleanColor = colorStr.trim()
  
  if (cleanColor.includes('/') || cleanColor.toLowerCase().includes(' on ')) {
    const parts = cleanColor.split(/\s*\/\s*|\s+on\s+/i)
    return {
      exterior: parts[0]?.trim() || '',
      interior: parts[1]?.trim() || ''
    }
  }

  return { exterior: cleanColor, interior: '' }
}

function parsePrice(priceStr: string): number | null {
  if (!priceStr || priceStr.toLowerCase().includes('request')) {
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
    if (urlMatch && urlMatch[0].includes('smugmug.com')) {
      smugmugUrl = urlMatch[0]
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

export async function bulkImportCars(csvContent: string): Promise<{
  success: boolean
  message: string
  imported: number
  skipped: number
  failed: number
}> {
  try {
    const lines = csvContent.split('\n')
    const cars: ParsedCar[] = []

    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (!trimmedLine || trimmedLine.startsWith(',,,') || trimmedLine.toLowerCase() === 'luxx') {
        continue
      }

      const row = parseCsvRow(trimmedLine)
      if (!row) continue

      const parsed = parseCar(row)
      if (parsed) {
        cars.push(parsed)
      }
    }

    console.log(`Parsed ${cars.length} cars from CSV`)

    let imported = 0
    let skipped = 0
    let failed = 0

    for (const car of cars) {
      try {
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
          console.log(`Skipping duplicate: ${car.title}`)
          skipped++
          continue
        }

        const images: string[] = []
        if (car.smugmugUrl) {
          console.log(`Fetching images for ${car.title} from ${car.smugmugUrl}`)
          const fetchedImages = await fetchSmugMugImages(car.smugmugUrl)
          if (fetchedImages.length > 0) {
            images.push(...fetchedImages)
            console.log(`Fetched ${fetchedImages.length} images for ${car.title}`)
          }
        }

        const specifications: any = {
          make: car.make,
          model: car.model
        }

        if (car.exteriorColor) specifications.exteriorColor = car.exteriorColor
        if (car.interiorColor) specifications.interiorColor = car.interiorColor

        await db.insert(inventory).values({
          category: 'car',
          title: car.title,
          description: `Experience luxury and performance with the ${car.title}. This stunning ${car.exteriorColor || 'exotic'} vehicle combines elegance with power, perfect for making a statement in Miami.`,
          pricePerDay: car.pricePerDay ? car.pricePerDay.toString() : '500',
          specifications,
          images,
          smugmugUrl: car.smugmugUrl,
          isPublished: false,
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        imported++
        console.log(`Imported: ${car.title} (${car.exteriorColor}) with ${images.length} images`)

      } catch (error) {
        console.error(`Failed to import ${car.title}:`, error)
        failed++
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return {
      success: true,
      message: `Import completed: ${imported} imported, ${skipped} skipped, ${failed} failed`,
      imported,
      skipped,
      failed
    }

  } catch (error) {
    console.error('Bulk import error:', error)
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      imported: 0,
      skipped: 0,
      failed: 0
    }
  }
}
