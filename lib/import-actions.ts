"use server"

import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { extractImagesFromSmugMug } from "@/lib/smugmug-utils"
import { extractImagesFromGoogleDrive, isGoogleDriveUrl } from "@/lib/google-drive-utils"

export interface DuplicateCheck {
  id: string
  title: string
  subtitle: string | null
  isDuplicate: boolean
}

// Generate URL-friendly slug from title and optional subtitle
function generateSlug(title: string, subtitle?: string | null): string {
  const combined = subtitle ? `${title} ${subtitle}` : title
  return combined
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Ensure slug is unique by checking database and adding suffix if needed
// excludeId: Optional ID to exclude from uniqueness check (for updates)
async function ensureUniqueSlug(baseSlug: string, category: string, excludeId?: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const conditions = [
      eq(inventory.category, category),
      eq(inventory.slug, slug)
    ]
    
    // Exclude the record being updated from uniqueness check
    if (excludeId) {
      conditions.push(sql`${inventory.id} != ${excludeId}`)
    }
    
    const existing = await db
      .select({ id: inventory.id })
      .from(inventory)
      .where(and(...conditions))
      .limit(1)
    
    if (existing.length === 0) {
      return slug
    }
    
    counter++
    slug = `${baseSlug}-${counter}`
  }
}

export interface ImportResult {
  success: boolean
  created: number
  updated: number
  skipped: number
  failed: number
  errors: { row: number, message: string }[]
}

// Check for duplicate cars by brand + model + color
export async function checkCarDuplicates(
  cars: Array<{ brand: string, model: string, exteriorColor: string | null }>
): Promise<DuplicateCheck[]> {
  const results: DuplicateCheck[] = []
  
  for (const car of cars) {
    const title = `${car.brand} ${car.model}`
    const subtitle = car.exteriorColor || null
    
    // Check if exists
    const existing = await db
      .select({ id: inventory.id })
      .from(inventory)
      .where(
        and(
          eq(inventory.category, 'car'),
          eq(inventory.title, title),
          car.exteriorColor ? eq(inventory.subtitle, car.exteriorColor) : sql`${inventory.subtitle} IS NULL`
        )
      )
      .limit(1)
    
    results.push({
      id: existing[0]?.id || '',
      title,
      subtitle,
      isDuplicate: existing.length > 0
    })
  }
  
  return results
}

// Check for duplicate villas by title
export async function checkVillaDuplicates(
  villas: Array<{ title: string }>
): Promise<DuplicateCheck[]> {
  const results: DuplicateCheck[] = []
  
  for (const villa of villas) {
    const existing = await db
      .select({ id: inventory.id })
      .from(inventory)
      .where(
        and(
          eq(inventory.category, 'villa'),
          eq(inventory.title, villa.title)
        )
      )
      .limit(1)
    
    results.push({
      id: existing[0]?.id || '',
      title: villa.title,
      subtitle: null,
      isDuplicate: existing.length > 0
    })
  }
  
  return results
}

// Check for duplicate yachts by title
export async function checkYachtDuplicates(
  yachts: Array<{ title: string }>
): Promise<DuplicateCheck[]> {
  const results: DuplicateCheck[] = []
  
  for (const yacht of yachts) {
    const existing = await db
      .select({ id: inventory.id })
      .from(inventory)
      .where(
        and(
          eq(inventory.category, 'yacht'),
          eq(inventory.title, yacht.title)
        )
      )
      .limit(1)
    
    results.push({
      id: existing[0]?.id || '',
      title: yacht.title,
      subtitle: null,
      isDuplicate: existing.length > 0
    })
  }
  
  return results
}

// Import cars with duplicate handling
export async function importCars(
  cars: Array<{
    brand: string
    model: string
    exteriorColor: string | null
    interiorColor: string | null
    pricePerDay: number | null
    imageUrl: string
    duplicateAction?: 'skip' | 'update' | 'create'
    existingId?: string
  }>
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: []
  }
  
  for (let i = 0; i < cars.length; i++) {
    const car = cars[i]
    
    try {
      const title = `${car.brand} ${car.model}`
      const subtitle = car.exteriorColor || null
      
      // Handle SmugMug and Google Drive URLs - extract images from galleries/folders
      let images: string[] = []
      
      if (car.imageUrl && car.imageUrl.includes('smugmug.com')) {
        // SmugMug gallery
        try {
          console.log(`[Import] Scraping SmugMug gallery for ${title}:`, car.imageUrl)
          const smugmugImages = await extractImagesFromSmugMug(car.imageUrl.trim())
          images = smugmugImages.map(img => img.url)
          console.log(`[Import] Successfully scraped ${images.length} images for ${title}`)
        } catch (smugmugError) {
          console.error(`[Import] SmugMug scraping failed for ${title}:`, smugmugError)
          images = car.imageUrl ? [car.imageUrl] : []
        }
      } else if (car.imageUrl && isGoogleDriveUrl(car.imageUrl)) {
        // Google Drive shared folder
        try {
          console.log(`[Import] Extracting images from Google Drive folder for ${title}:`, car.imageUrl)
          const driveImages = await extractImagesFromGoogleDrive(car.imageUrl.trim())
          images = driveImages.map(img => img.url)
          console.log(`[Import] Successfully extracted ${images.length} images for ${title}`)
        } catch (driveError) {
          console.error(`[Import] Google Drive extraction failed for ${title}:`, driveError)
          result.errors.push({
            row: i + 1,
            message: `Google Drive extraction failed: ${driveError instanceof Error ? driveError.message : 'Unknown error'}`
          })
          images = []
        }
      } else {
        images = car.imageUrl ? [car.imageUrl] : []
      }
      
      // Check if duplicate exists first
      const existing = await db
        .select({ id: inventory.id, slug: inventory.slug })
        .from(inventory)
        .where(
          and(
            eq(inventory.category, 'car'),
            eq(inventory.title, title),
            subtitle ? eq(inventory.subtitle, subtitle) : sql`${inventory.subtitle} IS NULL`
          )
        )
        .limit(1)
      
      // Determine slug based on scenario
      let slug: string
      const duplicateAction = car.duplicateAction || 'skip'
      
      if (existing.length > 0 && duplicateAction === 'update' && existing[0].slug) {
        // Preserve existing slug AS-IS when updating (no changes to URL)
        slug = existing[0].slug
      } else {
        // Generate new slug for new items or duplicateAction='create'
        const baseSlug = generateSlug(title, subtitle)
        slug = await ensureUniqueSlug(baseSlug, 'car')
      }
      
      // Build the data object
      const carData = {
        category: 'car' as const,
        title,
        subtitle,
        slug,
        pricePerDay: car.pricePerDay?.toString() || null,
        specifications: {
          brand: car.brand,
          model: car.model,
          exteriorColor: car.exteriorColor,
          interiorColor: car.interiorColor
        },
        images: images,
        isPublished: false,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      if (existing.length > 0) {
        const duplicateAction = car.duplicateAction || 'skip'
        
        if (duplicateAction === 'skip') {
          result.skipped++
        } else if (duplicateAction === 'update') {
          await db
            .update(inventory)
            .set({ ...carData, updatedAt: new Date() })
            .where(eq(inventory.id, existing[0].id))
          result.updated++
        } else if (duplicateAction === 'create') {
          await db.insert(inventory).values(carData)
          result.created++
        }
      } else {
        await db.insert(inventory).values(carData)
        result.created++
      }
    } catch (error) {
      result.failed++
      result.errors.push({
        row: i + 1,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  revalidatePath('/admin/cars')
  return result
}

// Import villas with duplicate handling
export async function importVillas(
  villas: Array<{
    title: string
    location: string
    bedrooms: number | null
    bathrooms: number | null
    guests: number | null
    pricePerDay: number | null
    securityDeposit: number | null
    cleaningFee: number | null
    imageUrl: string
    duplicateAction?: 'skip' | 'update' | 'create'
    existingId?: string
  }>
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: []
  }
  
  for (let i = 0; i < villas.length; i++) {
    const villa = villas[i]
    
    try {
      // Handle SmugMug and Google Drive URLs - extract images from galleries/folders
      let images: string[] = []
      
      if (villa.imageUrl && villa.imageUrl.includes('smugmug.com')) {
        // SmugMug gallery
        try {
          console.log(`[Import] Scraping SmugMug gallery for ${villa.title}:`, villa.imageUrl)
          const smugmugImages = await extractImagesFromSmugMug(villa.imageUrl.trim())
          images = smugmugImages.map(img => img.url)
          console.log(`[Import] Successfully scraped ${images.length} images for ${villa.title}`)
        } catch (smugmugError) {
          console.error(`[Import] SmugMug scraping failed for ${villa.title}:`, smugmugError)
          images = villa.imageUrl ? [villa.imageUrl] : []
        }
      } else if (villa.imageUrl && isGoogleDriveUrl(villa.imageUrl)) {
        // Google Drive shared folder
        try {
          console.log(`[Import] Extracting images from Google Drive folder for ${villa.title}:`, villa.imageUrl)
          const driveImages = await extractImagesFromGoogleDrive(villa.imageUrl.trim())
          images = driveImages.map(img => img.url)
          console.log(`[Import] Successfully extracted ${images.length} images for ${villa.title}`)
        } catch (driveError) {
          console.error(`[Import] Google Drive extraction failed for ${villa.title}:`, driveError)
          result.errors.push({
            row: i + 1,
            message: `Google Drive extraction failed: ${driveError instanceof Error ? driveError.message : 'Unknown error'}`
          })
          images = []
        }
      } else {
        images = villa.imageUrl ? [villa.imageUrl] : []
      }
      
      // Check if duplicate exists first
      const existing = await db
        .select({ id: inventory.id, slug: inventory.slug })
        .from(inventory)
        .where(
          and(
            eq(inventory.category, 'villa'),
            eq(inventory.title, villa.title)
          )
        )
        .limit(1)
      
      // Determine slug based on scenario
      let slug: string
      const duplicateAction = villa.duplicateAction || 'skip'
      
      if (existing.length > 0 && duplicateAction === 'update' && existing[0].slug) {
        // Preserve existing slug AS-IS when updating (no changes to URL)
        slug = existing[0].slug
      } else {
        // Generate new slug for new items or duplicateAction='create'
        const baseSlug = generateSlug(villa.title, villa.location)
        slug = await ensureUniqueSlug(baseSlug, 'villa')
      }
      
      // Auto-publish if has complete data (price, images, etc.)
      const hasCompleteData = villa.pricePerDay !== null && images.length > 0
      
      // Build the data object
      const villaData = {
        category: 'villa' as const,
        title: villa.title,
        subtitle: villa.location,
        slug,
        pricePerDay: villa.pricePerDay?.toString() || null,
        specifications: {
          bedrooms: villa.bedrooms,
          bathrooms: villa.bathrooms,
          guests: villa.guests,
          securityDeposit: villa.securityDeposit,
          cleaningFee: villa.cleaningFee
        },
        images: images,
        isPublished: hasCompleteData,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      if (existing.length > 0) {
        const duplicateAction = villa.duplicateAction || 'skip'
        
        if (duplicateAction === 'skip') {
          result.skipped++
        } else if (duplicateAction === 'update') {
          await db
            .update(inventory)
            .set({ ...villaData, updatedAt: new Date() })
            .where(eq(inventory.id, existing[0].id))
          result.updated++
        } else if (duplicateAction === 'create') {
          await db.insert(inventory).values(villaData)
          result.created++
        }
      } else {
        await db.insert(inventory).values(villaData)
        result.created++
      }
    } catch (error) {
      result.failed++
      result.errors.push({
        row: i + 1,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  revalidatePath('/admin/houses')
  return result
}

// Import yachts with SmugMug scraping and duplicate handling
export async function importYachts(
  yachts: Array<{
    title: string
    year: number | null
    length: string | null
    capacity: number | null
    pricePer4Hr: number | null
    pricePer6Hr: number | null
    pricePer8Hr: number | null
    imageUrl: string
    duplicateAction?: 'skip' | 'update' | 'create'
    existingId?: string
  }>
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: []
  }
  
  for (let i = 0; i < yachts.length; i++) {
    const yacht = yachts[i]
    
    try {
      // Handle SmugMug URLs - extract images from gallery
      let images: string[] = []
      if (yacht.imageUrl && yacht.imageUrl.includes('smugmug.com')) {
        try {
          console.log(`[Import] Scraping SmugMug gallery for ${yacht.title}:`, yacht.imageUrl)
          const smugmugImages = await extractImagesFromSmugMug(yacht.imageUrl.trim())
          images = smugmugImages.map(img => img.url)
          console.log(`[Import] Successfully scraped ${images.length} images for ${yacht.title}`)
        } catch (smugmugError) {
          console.error(`[Import] SmugMug scraping failed for ${yacht.title}:`, smugmugError)
          images = yacht.imageUrl ? [yacht.imageUrl] : []
        }
      } else {
        images = yacht.imageUrl ? [yacht.imageUrl] : []
      }
      
      // Check if duplicate exists first
      const existing = await db
        .select({ id: inventory.id, slug: inventory.slug })
        .from(inventory)
        .where(
          and(
            eq(inventory.category, 'yacht'),
            eq(inventory.title, yacht.title)
          )
        )
        .limit(1)
      
      // Determine slug based on scenario
      let slug: string
      const duplicateAction = yacht.duplicateAction || 'skip'
      
      if (existing.length > 0 && duplicateAction === 'update' && existing[0].slug) {
        slug = existing[0].slug
      } else {
        const baseSlug = generateSlug(yacht.title)
        slug = await ensureUniqueSlug(baseSlug, 'yacht')
      }
      
      // Build the data object
      const yachtData = {
        category: 'yacht' as const,
        title: yacht.title,
        slug,
        pricePer4Hr: yacht.pricePer4Hr?.toString() || null,
        pricePer6Hr: yacht.pricePer6Hr?.toString() || null,
        pricePer8Hr: yacht.pricePer8Hr?.toString() || null,
        specifications: {
          year: yacht.year,
          length: yacht.length,
          capacity: yacht.capacity,
        },
        images,
        smugmugUrl: yacht.imageUrl && yacht.imageUrl.includes('smugmug.com') ? yacht.imageUrl : null,
        isPublished: false,
        updatedAt: new Date()
      }
      
      if (existing.length > 0) {
        const duplicateAction = yacht.duplicateAction || 'skip'
        
        if (duplicateAction === 'skip') {
          result.skipped++
        } else if (duplicateAction === 'update') {
          await db
            .update(inventory)
            .set({ ...yachtData, updatedAt: new Date() })
            .where(eq(inventory.id, existing[0].id))
          result.updated++
        } else if (duplicateAction === 'create') {
          await db.insert(inventory).values(yachtData)
          result.created++
        }
      } else {
        await db.insert(inventory).values(yachtData)
        result.created++
      }
    } catch (error) {
      result.failed++
      result.errors.push({
        row: i + 1,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  revalidatePath('/admin/yachts')
  return result
}

// Migration: Add slugs to existing items that don't have them
export async function migrateMissingSlugs(): Promise<{
  success: boolean
  updated: number
  errors: string[]
}> {
  const result = {
    success: true,
    updated: 0,
    errors: [] as string[]
  }
  
  try {
    // Find all items with null or empty slugs
    const itemsWithoutSlugs = await db
      .select()
      .from(inventory)
      .where(
        sql`${inventory.slug} IS NULL OR ${inventory.slug} = ''`
      )
    
    console.log(`[Migration] Found ${itemsWithoutSlugs.length} items without slugs`)
    
    for (const item of itemsWithoutSlugs) {
      try {
        // Generate slug from title and subtitle
        const baseSlug = generateSlug(item.title, item.subtitle)
        const slug = await ensureUniqueSlug(baseSlug, item.category)
        
        // Update the item with the new slug
        await db
          .update(inventory)
          .set({ 
            slug,
            updatedAt: new Date() 
          })
          .where(eq(inventory.id, item.id))
        
        result.updated++
        console.log(`[Migration] Added slug "${slug}" to ${item.category}: ${item.title}`)
      } catch (error) {
        const errorMsg = `Failed to generate slug for ${item.title}: ${error instanceof Error ? error.message : 'Unknown error'}`
        result.errors.push(errorMsg)
        console.error(`[Migration] ${errorMsg}`)
      }
    }
    
    console.log(`[Migration] Complete: Updated ${result.updated} items`)
  } catch (error) {
    result.success = false
    result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    console.error('[Migration] Failed:', error)
  }
  
  return result
}

// Migration: Fix double-encoded JSON in images and specifications
export async function fixDoubleEncodedJSON(): Promise<{
  success: boolean
  updated: number
  errors: string[]
}> {
  const result = {
    success: true,
    updated: 0,
    errors: [] as string[]
  }
  
  try {
    // Get all items - we'll check each one
    const allItems = await db
      .select()
      .from(inventory)
    
    console.log(`[Migration] Checking ${allItems.length} items for double-encoded JSON`)
    
    for (const item of allItems) {
      try {
        let needsUpdate = false
        const updates: any = {}
        
        // Fix images if it's a string
        if (typeof item.images === 'string') {
          try {
            updates.images = JSON.parse(item.images)
            needsUpdate = true
            console.log(`[Migration] Fixed images for ${item.title}`)
          } catch (e) {
            console.error(`[Migration] Failed to parse images for ${item.title}:`, e)
          }
        }
        
        // Fix specifications if it's a string  
        if (typeof item.specifications === 'string') {
          try {
            updates.specifications = JSON.parse(item.specifications)
            needsUpdate = true
            console.log(`[Migration] Fixed specifications for ${item.title}`)
          } catch (e) {
            console.error(`[Migration] Failed to parse specifications for ${item.title}:`, e)
          }
        }
        
        // Update if needed
        if (needsUpdate) {
          await db
            .update(inventory)
            .set({ 
              ...updates,
              updatedAt: new Date() 
            })
            .where(eq(inventory.id, item.id))
          
          result.updated++
        }
      } catch (error) {
        const errorMsg = `Failed to fix JSON for ${item.title}: ${error instanceof Error ? error.message : 'Unknown error'}`
        result.errors.push(errorMsg)
        console.error(`[Migration] ${errorMsg}`)
      }
    }
    
    console.log(`[Migration] Complete: Fixed ${result.updated} items`)
  } catch (error) {
    result.success = false
    result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    console.error('[Migration] Failed:', error)
  }
  
  return result
}

// CSV Import Functions
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
  if (!priceStr || priceStr.toLowerCase().includes('request') || priceStr.toLowerCase().includes('price upon')) {
    return null
  }

  const numericPrice = priceStr.replace(/[^0-9.]/g, '')
  const price = parseFloat(numericPrice)
  
  return isNaN(price) ? null : price
}

export async function importCarsFromCSV(csvText: string): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: []
  }

  try {
    const lines = csvText.split('\n')
    const carsToImport: any[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (!line || line.startsWith(',,,') || line.toLowerCase().startsWith('make')) {
        continue
      }

      try {
        const parts = line.split(',')
        
        if (parts.length < 5) continue
        
        const make = parts[0]?.trim() || ''
        const model = parts[1]?.trim() || ''
        
        if (!make || !model) continue

        const color = parts[2]?.trim() || ''
        const price = parts[3]?.trim() || ''
        const imageLinks = parts.slice(4).join(',').trim()

        const { exterior, interior } = parseColor(color)
        const pricePerDay = parsePrice(price)

        let imageUrl: string = ''
        if (imageLinks && !imageLinks.toLowerCase().includes('no photos')) {
          const urlMatch = imageLinks.match(/https?:\/\/[^\s"',]+/)
          if (urlMatch) {
            const url = urlMatch[0]
            if (url.includes('smugmug.com') || url.includes('drive.google.com')) {
              imageUrl = url
            }
          }
        }

        carsToImport.push({
          brand: make,
          model: model,
          exteriorColor: exterior || null,
          interiorColor: interior || null,
          pricePerDay: pricePerDay,
          imageUrl: imageUrl,
          duplicateAction: 'update'
        })
      } catch (error) {
        result.errors.push({
          row: i + 1,
          message: error instanceof Error ? error.message : 'Failed to parse row'
        })
      }
    }

    console.log(`[CSV Import] Parsed ${carsToImport.length} cars from CSV`)

    if (carsToImport.length === 0) {
      return {
        success: false,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 1,
        errors: [{ row: 0, message: 'No valid cars found in CSV' }]
      }
    }

    const importResult = await importCars(carsToImport)
    
    return importResult
  } catch (error) {
    console.error('[CSV Import] Fatal error:', error)
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 1,
      errors: [{ row: 0, message: error instanceof Error ? error.message : 'Unknown error' }]
    }
  }
}

export async function importVillasFromCSV(csvText: string): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: []
  }

  try {
    const lines = csvText.split('\n')
    const villasToImport: any[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (!line || line.startsWith(',,,') || line.toLowerCase().includes('title') || line.toLowerCase().includes('villa name')) {
        continue
      }

      try {
        const parts = line.split(',')
        
        if (parts.length < 8) continue
        
        const title = parts[0]?.trim() || ''
        const location = parts[1]?.trim() || ''
        
        if (!title || !location) continue

        const bedroomsStr = parts[2]?.trim() || ''
        const bathroomsStr = parts[3]?.trim() || ''
        const guestsStr = parts[4]?.trim() || ''
        const priceStr = parts[5]?.trim() || ''
        const securityDepositStr = parts[6]?.trim() || ''
        const cleaningFeeStr = parts[7]?.trim() || ''
        const imageLinks = parts.slice(8).join(',').trim()

        const bedrooms = bedroomsStr ? parseInt(bedroomsStr) : null
        const bathrooms = bathroomsStr ? parseFloat(bathroomsStr) : null
        const guests = guestsStr ? parseInt(guestsStr) : null
        const pricePerDay = parsePrice(priceStr)
        const securityDeposit = parsePrice(securityDepositStr)
        const cleaningFee = parsePrice(cleaningFeeStr)

        let imageUrl: string = ''
        if (imageLinks && !imageLinks.toLowerCase().includes('no photos')) {
          const urlMatch = imageLinks.match(/https?:\/\/[^\s"',]+/)
          if (urlMatch) {
            const url = urlMatch[0]
            if (url.includes('smugmug.com') || url.includes('drive.google.com')) {
              imageUrl = url
            }
          }
        }

        villasToImport.push({
          title: title,
          location: location,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          guests: guests,
          pricePerDay: pricePerDay,
          securityDeposit: securityDeposit,
          cleaningFee: cleaningFee,
          imageUrl: imageUrl,
          duplicateAction: 'update'
        })
      } catch (error) {
        result.errors.push({
          row: i + 1,
          message: error instanceof Error ? error.message : 'Failed to parse row'
        })
      }
    }

    console.log(`[CSV Import] Parsed ${villasToImport.length} villas from CSV`)

    if (villasToImport.length === 0) {
      return {
        success: false,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 1,
        errors: [{ row: 0, message: 'No valid villas found in CSV' }]
      }
    }

    const importResult = await importVillas(villasToImport)
    
    return importResult
  } catch (error) {
    console.error('[CSV Import] Fatal error:', error)
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 1,
      errors: [{ row: 0, message: error instanceof Error ? error.message : 'Unknown error' }]
    }
  }
}

export async function importYachtsFromCSV(csvText: string): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: []
  }

  try {
    const lines = csvText.split('\n')
    const yachtsToImport: any[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (!line || line.startsWith(',,,') || line.toLowerCase().includes('title') || line.toLowerCase().includes('yacht name')) {
        continue
      }

      try {
        const parts = line.split(',')
        
        if (parts.length < 5) continue
        
        const title = parts[0]?.trim() || ''
        const specs = parts[1]?.trim() || ''
        const price4hrStr = parts[2]?.trim() || ''
        const price6hrStr = parts[3]?.trim() || ''
        const price8hrStr = parts[4]?.trim() || ''
        const imageLinks = parts.slice(5).join(',').trim()
        
        if (!title) continue

        const { year, length, capacity } = parseYachtSpecs(specs)
        const pricePer4Hr = parsePrice(price4hrStr)
        const pricePer6Hr = parsePrice(price6hrStr)
        const pricePer8Hr = parsePrice(price8hrStr)

        let imageUrl: string = ''
        if (imageLinks && !imageLinks.toLowerCase().includes('no photos')) {
          const urlMatch = imageLinks.match(/https?:\/\/[^\s"',]+/)
          if (urlMatch) {
            const url = urlMatch[0]
            if (url.includes('smugmug.com') || url.includes('drive.google.com')) {
              imageUrl = url
            }
          }
        }

        yachtsToImport.push({
          title: title,
          year: year,
          length: length,
          capacity: capacity,
          pricePer4Hr: pricePer4Hr,
          pricePer6Hr: pricePer6Hr,
          pricePer8Hr: pricePer8Hr,
          imageUrl: imageUrl,
          duplicateAction: 'update'
        })
      } catch (error) {
        result.errors.push({
          row: i + 1,
          message: error instanceof Error ? error.message : 'Failed to parse row'
        })
      }
    }

    console.log(`[CSV Import] Parsed ${yachtsToImport.length} yachts from CSV`)

    if (yachtsToImport.length === 0) {
      return {
        success: false,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 1,
        errors: [{ row: 0, message: 'No valid yachts found in CSV' }]
      }
    }

    const importResult = await importYachts(yachtsToImport)
    
    return importResult
  } catch (error) {
    console.error('[CSV Import] Fatal error:', error)
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 1,
      errors: [{ row: 0, message: error instanceof Error ? error.message : 'Unknown error' }]
    }
  }
}
