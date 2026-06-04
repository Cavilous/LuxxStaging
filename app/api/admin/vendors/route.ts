import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vendors } from '@/lib/db/schema'
import { requireApiAuth } from '@/lib/auth-helpers'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    await requireApiAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const allVendors = await db
      .select()
      .from(vendors)
      .orderBy(desc(vendors.createdAt))

    const sanitized = allVendors.map(v => ({
      ...v,
      apiCredentials: v.apiType !== 'none' ? { configured: true } : {},
    }))

    return NextResponse.json(sanitized)
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireApiAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, category, description, contactName, contactEmail, contactPhone, website, apiType, apiCredentials } = body

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }

    const [vendor] = await db
      .insert(vendors)
      .values({
        name,
        category: category || 'house',
        description: description || null,
        contactName: contactName || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        website: website || null,
        apiType: apiType || 'none',
        apiCredentials: apiCredentials || {},
      })
      .returning()

    const sanitized = {
      ...vendor,
      apiCredentials: vendor.apiType !== 'none' ? { configured: true } : {},
    }

    return NextResponse.json(sanitized, { status: 201 })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
  }
}
