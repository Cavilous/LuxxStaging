import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { forSaleAssets } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { normalizeImageUrl } from "@/lib/image-url-utils"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const assets = await db
      .select()
      .from(forSaleAssets)
      .where(
        and(
          eq(forSaleAssets.slug, slug),
          eq(forSaleAssets.status, "Live")
        )
      )
      .limit(1)

    if (assets.length === 0) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      )
    }

    const asset = assets[0]
    const specs = (asset.specifications as Record<string, any>) || {}
    const badges = Array.isArray(asset.badges) ? asset.badges : []
    const managementTerms = (asset.managementTerms as Record<string, any>) || {}
    const rawImages = Array.isArray(asset.images) ? asset.images : []
    const images = rawImages.map((img: string) => normalizeImageUrl(img)).filter((url): url is string => url !== null)
    const heroImage = normalizeImageUrl(asset.heroImage) || (images.length > 0 ? images[0] : "/placeholder.svg")

    const transformedAsset = {
      id: asset.id,
      slug: asset.slug,
      title: asset.title,
      category: asset.category as "car" | "yacht" | "villa",
      brand: asset.brand || "",
      model: asset.model || "",
      year: asset.year || null,
      specs: specs,
      heroImage: heroImage,
      images: images,
      advertisedPrice: asset.advertisedPrice ? Number(asset.advertisedPrice) : null,
      managedAssetPrice: asset.managedAssetPrice ? Number(asset.managedAssetPrice) : null,
      managementTerms: managementTerms,
      status: asset.status,
      location: asset.location || "Miami, FL",
      description: asset.description || "",
      badges: badges as string[],
      metaTitle: asset.metaTitle,
      metaDescription: asset.metaDescription,
    }

    return NextResponse.json(transformedAsset)
  } catch (error) {
    console.error("Error fetching asset:", error)
    return NextResponse.json(
      { error: "Failed to fetch asset" },
      { status: 500 }
    )
  }
}
