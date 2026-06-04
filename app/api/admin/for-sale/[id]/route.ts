import { db } from "@/lib/db"
import { forSaleAssets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireApiAuth } from "@/lib/auth-helpers"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await requireApiAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const [asset] = await db
      .select()
      .from(forSaleAssets)
      .where(eq(forSaleAssets.id, id))
      .limit(1)

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: asset })
  } catch (error) {
    console.error("Error fetching for-sale asset:", error)
    return NextResponse.json(
      { error: "Failed to fetch asset" },
      { status: 500 }
    )
  }
}
