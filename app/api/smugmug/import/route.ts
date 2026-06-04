import { NextRequest, NextResponse } from "next/server"
import { extractImagesFromSmugMug } from "@/lib/smugmug-utils"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "SmugMug URL is required" }, { status: 400 })
    }
    
    const images = await extractImagesFromSmugMug(url.trim())
    
    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images found at this SmugMug URL" }, { status: 404 })
    }
    
    return NextResponse.json({ images })
  } catch (error) {
    console.error('[SmugMug API Error]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import images from SmugMug" },
      { status: 500 }
    )
  }
}
