import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const result = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, id))
      .limit(1)

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching inventory item:", error)
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
  }
}
