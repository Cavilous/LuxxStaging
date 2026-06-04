import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { inventory } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireApiAuth } from "@/lib/auth-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await requireApiAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const item = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, id))
      .limit(1)

    if (!item[0]) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: item[0], error: null })
  } catch (error) {
    console.error('Error fetching inventory item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}
