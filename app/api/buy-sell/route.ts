import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { forSaleAssets } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { getFallbackForSaleAssets } from "@/lib/fallback-for-sale-assets"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  try {
    let whereConditions = [eq(forSaleAssets.status, "Live")]

    if (category && category !== "all" && category !== "All") {
      whereConditions.push(eq(forSaleAssets.category, category.toLowerCase()))
    }

    const assets = await db
      .select()
      .from(forSaleAssets)
      .where(and(...whereConditions))
      .orderBy(desc(forSaleAssets.createdAt))

    const assetsWithImages = assets.filter((asset) => {
      const images = Array.isArray(asset.images) ? asset.images : []
      const hasHeroImage = asset.heroImage && asset.heroImage.trim() !== ""
      return images.length > 0 || hasHeroImage
    })

    let filteredAssets = assetsWithImages

    if (search) {
      const searchLower = search.toLowerCase()
      filteredAssets = assetsWithImages.filter(
        (asset) =>
          asset.title.toLowerCase().includes(searchLower) ||
          asset.brand?.toLowerCase().includes(searchLower) ||
          asset.model?.toLowerCase().includes(searchLower)
      )
    }

    const transformedAssets = filteredAssets.map((asset) => {
      const specs = (asset.specifications as Record<string, any>) || {}
      const badges = Array.isArray(asset.badges) ? asset.badges : []
      const managementTerms = (asset.managementTerms as Record<string, any>) || {}
      const images = Array.isArray(asset.images) ? asset.images : []

      return {
        id: asset.id,
        slug: asset.slug,
        title: asset.title,
        category: asset.category as "car" | "yacht" | "villa",
        brand: asset.brand || "",
        model: asset.model || "",
        year: asset.year || null,
        specs: specs,
        heroImage: asset.heroImage || (images.length > 0 ? images[0] : "/placeholder.svg"),
        images: images,
        advertisedPrice: asset.advertisedPrice ? Number(asset.advertisedPrice) : null,
        managedAssetPrice: asset.managedAssetPrice ? Number(asset.managedAssetPrice) : null,
        managementTerms: managementTerms,
        status: asset.status,
        location: asset.location || "Miami, FL",
        description: asset.description || "",
        badges: badges as string[],
      }
    })

    if (transformedAssets.length === 0) {
      console.warn("Using fallback buy-sell assets because the live query returned no displayable assets")
      return NextResponse.json(getFallbackForSaleAssets({ category, search }))
    }

    return NextResponse.json(transformedAssets)
  } catch (error) {
    console.warn("Using fallback buy-sell assets because the live query failed:", error)
    return NextResponse.json(getFallbackForSaleAssets({ category, search }))
  }
}
