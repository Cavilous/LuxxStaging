"use server"

import { db } from "@/lib/db"
import { forSaleAssets } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { eq, desc, ilike, or, and, sql } from "drizzle-orm"
import { toTitleCaseSmart } from "@/lib/text-normalization"

export async function getForSaleAssetById(id: string) {
  try {
    const [asset] = await db
      .select()
      .from(forSaleAssets)
      .where(eq(forSaleAssets.id, id))
      .limit(1)

    if (!asset) {
      return { error: "Asset not found" }
    }

    return { success: true, data: asset }
  } catch (error) {
    console.error("Error fetching for-sale asset:", error)
    return { error: "Failed to fetch asset" }
  }
}

export async function getForSaleAssets(filters?: {
  search?: string
  category?: string
  status?: string
  hasManagedPrice?: string
}) {
  try {
    const conditions: any[] = []

    if (filters?.search) {
      conditions.push(
        or(
          ilike(forSaleAssets.title, `%${filters.search}%`),
          ilike(forSaleAssets.brand, `%${filters.search}%`),
          ilike(forSaleAssets.model, `%${filters.search}%`)
        )
      )
    }

    if (filters?.category && filters.category !== "all") {
      conditions.push(eq(forSaleAssets.category, filters.category))
    }

    if (filters?.status && filters.status !== "all") {
      conditions.push(eq(forSaleAssets.status, filters.status))
    }

    if (filters?.hasManagedPrice === "yes") {
      conditions.push(sql`${forSaleAssets.managedAssetPrice} IS NOT NULL`)
    } else if (filters?.hasManagedPrice === "no") {
      conditions.push(sql`${forSaleAssets.managedAssetPrice} IS NULL`)
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const assets = await db
      .select()
      .from(forSaleAssets)
      .where(whereClause)
      .orderBy(desc(forSaleAssets.updatedAt))

    return { success: true, data: assets }
  } catch (error) {
    console.error("Error fetching for-sale assets:", error)
    return { error: "Failed to fetch assets" }
  }
}

export async function getForSaleAssetStats() {
  try {
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(forSaleAssets)
    
    const [liveResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(forSaleAssets)
      .where(eq(forSaleAssets.status, "Live"))
    
    const [underOfferResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(forSaleAssets)
      .where(eq(forSaleAssets.status, "UnderOffer"))
    
    const [managedPriceResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(forSaleAssets)
      .where(sql`${forSaleAssets.managedAssetPrice} IS NOT NULL`)

    return {
      success: true,
      data: {
        total: totalResult?.count || 0,
        live: liveResult?.count || 0,
        underOffer: underOfferResult?.count || 0,
        withManagedPrice: managedPriceResult?.count || 0,
      }
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { error: "Failed to fetch stats" }
  }
}

export async function createForSaleAsset(formData: FormData) {
  try {
    const rawTitle = formData.get("title") as string
    const category = formData.get("category") as string
    
    if (!rawTitle || !category) {
      return { error: "Title and category are required" }
    }

    const title = toTitleCaseSmart(rawTitle)
    const brand = toTitleCaseSmart(formData.get("brand") as string)
    const model = toTitleCaseSmart(formData.get("model") as string)

    const slug = (formData.get("slug") as string) || 
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    const existingSlug = await db
      .select({ id: forSaleAssets.id })
      .from(forSaleAssets)
      .where(eq(forSaleAssets.slug, slug))
      .limit(1)

    if (existingSlug.length > 0) {
      return { error: "An asset with this slug already exists" }
    }

    const advertisedPriceStr = formData.get("advertisedPrice") as string
    const managedAssetPriceStr = formData.get("managedAssetPrice") as string
    const yearStr = formData.get("year") as string
    const specsJson = formData.get("specifications") as string
    const badgesJson = formData.get("badges") as string
    const managementTermsJson = formData.get("managementTerms") as string
    const imagesJson = formData.get("images") as string
    const imageSourceUrlsJson = formData.get("imageSourceUrls") as string

    const advertisedPrice = advertisedPriceStr && !isNaN(parseFloat(advertisedPriceStr)) 
      ? parseFloat(advertisedPriceStr).toFixed(2) 
      : null
    const managedAssetPrice = managedAssetPriceStr && !isNaN(parseFloat(managedAssetPriceStr)) 
      ? parseFloat(managedAssetPriceStr).toFixed(2) 
      : null
    const year = yearStr && !isNaN(parseInt(yearStr, 10)) 
      ? parseInt(yearStr, 10) 
      : null

    let specifications = {}
    let badges: string[] = []
    let managementTerms = {}
    let images: string[] = []
    let imageSourceUrls: any[] = []

    try {
      specifications = specsJson ? JSON.parse(specsJson) : {}
      badges = badgesJson ? JSON.parse(badgesJson) : []
      managementTerms = managementTermsJson ? JSON.parse(managementTermsJson) : {}
      images = imagesJson ? JSON.parse(imagesJson) : []
      imageSourceUrls = imageSourceUrlsJson ? JSON.parse(imageSourceUrlsJson) : []
    } catch (e) {
      console.error("Error parsing JSON fields:", e)
    }

    const [newAsset] = await db
      .insert(forSaleAssets)
      .values({
        slug,
        title,
        category,
        brand: brand || null,
        model: model || null,
        year,
        heroImage: formData.get("heroImage") as string || null,
        images,
        imageSourceUrls,
        advertisedPrice,
        managedAssetPrice,
        status: (formData.get("status") as string) || "Draft",
        location: formData.get("location") as string || null,
        description: formData.get("description") as string || null,
        specifications,
        badges,
        managementTerms,
        metaTitle: formData.get("metaTitle") as string || null,
        metaDescription: formData.get("metaDescription") as string || null,
      })
      .returning()

    revalidatePath("/admin/for-sale")
    return { success: true, data: newAsset }
  } catch (error) {
    console.error("Error creating for-sale asset:", error)
    return { error: error instanceof Error ? error.message : "Failed to create asset" }
  }
}

export async function updateForSaleAsset(id: string, formData: FormData) {
  try {
    const rawTitle = formData.get("title") as string
    const category = formData.get("category") as string
    
    if (!rawTitle || !category) {
      return { error: "Title and category are required" }
    }

    const title = toTitleCaseSmart(rawTitle)
    const brand = toTitleCaseSmart(formData.get("brand") as string)
    const model = toTitleCaseSmart(formData.get("model") as string)

    const advertisedPriceStr = formData.get("advertisedPrice") as string
    const managedAssetPriceStr = formData.get("managedAssetPrice") as string
    const yearStr = formData.get("year") as string
    const specsJson = formData.get("specifications") as string
    const badgesJson = formData.get("badges") as string
    const managementTermsJson = formData.get("managementTerms") as string
    const imagesJson = formData.get("images") as string
    const imageSourceUrlsJson = formData.get("imageSourceUrls") as string

    const advertisedPrice = advertisedPriceStr && !isNaN(parseFloat(advertisedPriceStr)) 
      ? parseFloat(advertisedPriceStr).toFixed(2) 
      : null
    const managedAssetPrice = managedAssetPriceStr && !isNaN(parseFloat(managedAssetPriceStr)) 
      ? parseFloat(managedAssetPriceStr).toFixed(2) 
      : null
    const year = yearStr && !isNaN(parseInt(yearStr, 10)) 
      ? parseInt(yearStr, 10) 
      : null

    let specifications = {}
    let badges: string[] = []
    let managementTerms = {}
    let images: string[] = []
    let imageSourceUrls: any[] = []

    try {
      specifications = specsJson ? JSON.parse(specsJson) : {}
      badges = badgesJson ? JSON.parse(badgesJson) : []
      managementTerms = managementTermsJson ? JSON.parse(managementTermsJson) : {}
      images = imagesJson ? JSON.parse(imagesJson) : []
      imageSourceUrls = imageSourceUrlsJson ? JSON.parse(imageSourceUrlsJson) : []
    } catch (e) {
      console.error("Error parsing JSON fields:", e)
    }

    const [updatedAsset] = await db
      .update(forSaleAssets)
      .set({
        title,
        category,
        brand: brand || null,
        model: model || null,
        year,
        heroImage: formData.get("heroImage") as string || null,
        images,
        imageSourceUrls,
        advertisedPrice,
        managedAssetPrice,
        status: (formData.get("status") as string) || "Draft",
        location: formData.get("location") as string || null,
        description: formData.get("description") as string || null,
        specifications,
        badges,
        managementTerms,
        metaTitle: formData.get("metaTitle") as string || null,
        metaDescription: formData.get("metaDescription") as string || null,
        updatedAt: new Date(),
      })
      .where(eq(forSaleAssets.id, id))
      .returning()

    revalidatePath("/admin/for-sale")
    return { success: true, data: updatedAsset }
  } catch (error) {
    console.error("Error updating for-sale asset:", error)
    return { error: error instanceof Error ? error.message : "Failed to update asset" }
  }
}

export async function deleteForSaleAsset(id: string) {
  try {
    await db.delete(forSaleAssets).where(eq(forSaleAssets.id, id))
    revalidatePath("/admin/for-sale")
    return { success: true }
  } catch (error) {
    console.error("Error deleting for-sale asset:", error)
    return { error: "Failed to delete asset" }
  }
}

export async function updateAssetStatus(id: string, status: string) {
  try {
    const [updatedAsset] = await db
      .update(forSaleAssets)
      .set({ status, updatedAt: new Date() })
      .where(eq(forSaleAssets.id, id))
      .returning()

    revalidatePath("/admin/for-sale")
    return { success: true, data: updatedAsset }
  } catch (error) {
    console.error("Error updating asset status:", error)
    return { error: "Failed to update status" }
  }
}
