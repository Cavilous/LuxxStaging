import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as jwt from "jsonwebtoken"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { processImageFromUrl } from "@/lib/image-pipeline"
import type { ImageObject } from "@/lib/image-types"
import { isImageObject } from "@/lib/image-types"

export const dynamic = "force-dynamic"
export const maxDuration = 300

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    console.error("JWT_SECRET environment variable is not set")
    return false
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return false
  try {
    const decoded = jwt.verify(token, jwtSecret) as { role?: string }
    return decoded.role === 'super_admin' || decoded.role === 'admin'
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { itemId, dryRun = false } = body

  if (!itemId) {
    return NextResponse.json({ error: "itemId required" }, { status: 400 })
  }

  try {
    const [item] = await db.select().from(inventory).where(eq(inventory.id, itemId)).limit(1)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const rawImages = (item.images as any[]) || []
    const title = item.title || 'image'

    let alreadyProcessed = 0
    let needsProcessing = 0
    const newImages: (string | ImageObject)[] = []
    const errors: Array<{ index: number; url: string; error: string }> = []

    for (let i = 0; i < rawImages.length; i++) {
      const entry = rawImages[i]

      if (isImageObject(entry)) {
        alreadyProcessed++
        newImages.push(entry)
        continue
      }

      const url = typeof entry === 'string' ? entry : (entry?.url || entry?.hqUrl || '')
      if (!url) {
        errors.push({ index: i, url: '', error: 'Empty URL' })
        continue
      }

      needsProcessing++

      if (dryRun) {
        newImages.push(url)
        continue
      }

      try {
        console.log(`[MigrateImages] Processing ${i + 1}/${rawImages.length} for "${title}": ${url.substring(0, 60)}...`)
        const result = await processImageFromUrl(url, title, i)
        newImages.push(result.imageObject)
        console.log(`[MigrateImages] Done ${i + 1}: HQ=${(result.hqBytes / 1024).toFixed(0)}KB LQ=${(result.lqBytes / 1024).toFixed(0)}KB`)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.error(`[MigrateImages] Failed ${i + 1}: ${errorMsg}`)
        errors.push({ index: i, url, error: errorMsg })
        newImages.push(url)
      }

      if (i < rawImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    if (!dryRun && needsProcessing > 0) {
      await db.update(inventory)
        .set({ images: newImages, updatedAt: new Date() })
        .where(eq(inventory.id, itemId))

      console.log(`[MigrateImages] Updated "${title}": ${needsProcessing - errors.length} migrated, ${errors.length} failed, ${alreadyProcessed} already done`)
    }

    return NextResponse.json({
      success: true,
      itemId,
      title: item.title,
      dryRun,
      stats: {
        total: rawImages.length,
        alreadyProcessed,
        needsProcessing,
        migrated: dryRun ? 0 : needsProcessing - errors.length,
        failed: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[MigrateImages] Error:`, errorMsg)
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const items = await db.select({
      id: inventory.id,
      title: inventory.title,
      category: inventory.category,
      images: inventory.images,
    }).from(inventory)

    const summary = items.map(item => {
      const images = (item.images as any[]) || []
      const stringCount = images.filter((img: any) => typeof img === 'string').length
      const objectCount = images.filter((img: any) => isImageObject(img)).length

      return {
        id: item.id,
        title: item.title,
        category: item.category,
        totalImages: images.length,
        legacyStrings: stringCount,
        processedObjects: objectCount,
        needsMigration: stringCount > 0,
      }
    })

    const needsMigration = summary.filter(s => s.needsMigration)

    return NextResponse.json({
      total: summary.length,
      needsMigration: needsMigration.length,
      fullyMigrated: summary.length - needsMigration.length,
      items: needsMigration,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
