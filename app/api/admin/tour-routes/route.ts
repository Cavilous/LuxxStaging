import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { requireApiAuth } from "@/lib/auth-helpers"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireApiAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const result = await db.execute(
      sql`SELECT id, title, duration FROM tour_routes ORDER BY title`
    )

    const routes = Array.isArray(result) ? result : []
    return NextResponse.json({ data: routes, error: null })
  } catch (error) {
    console.error('Error fetching tour routes:', error)
    return NextResponse.json({ data: [], error: null })
  }
}
