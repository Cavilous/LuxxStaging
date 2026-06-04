import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const { id, isPublished } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }
    
    await db
      .update(inventory)
      .set({ 
        isPublished,
        updatedAt: new Date()
      })
      .where(eq(inventory.id, id))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error toggling publish status:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}
