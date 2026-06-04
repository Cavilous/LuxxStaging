import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vendors } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireApiAuth } from '@/lib/auth-helpers'

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
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, id))
      .limit(1)

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const redacted = {
      ...vendor,
      apiCredentials: vendor.apiCredentials && typeof vendor.apiCredentials === 'object'
        ? Object.fromEntries(
            Object.entries(vendor.apiCredentials as Record<string, string>).map(
              ([k, v]) => [k, typeof v === 'string' && v.length > 4 ? v.slice(0, 4) + '****' : '****']
            )
          )
        : vendor.apiCredentials,
    }

    return NextResponse.json(redacted)
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 })
  }
}

export async function PUT(
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
    const body = await request.json()
    const { name, category, description, contactName, contactEmail, contactPhone, website, apiType, apiCredentials, isActive } = body

    const updateData: Record<string, any> = { updatedAt: new Date() }
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (contactName !== undefined) updateData.contactName = contactName
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone
    if (website !== undefined) updateData.website = website
    if (apiType !== undefined) updateData.apiType = apiType
    if (apiCredentials !== undefined) updateData.apiCredentials = apiCredentials
    if (isActive !== undefined) updateData.isActive = isActive

    const [vendor] = await db
      .update(vendors)
      .set(updateData)
      .where(eq(vendors.id, id))
      .returning()

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const redacted = {
      ...vendor,
      apiCredentials: vendor.apiCredentials && typeof vendor.apiCredentials === 'object'
        ? Object.fromEntries(
            Object.entries(vendor.apiCredentials as Record<string, string>).map(
              ([k, v]) => [k, typeof v === 'string' && v.length > 4 ? v.slice(0, 4) + '****' : '****']
            )
          )
        : vendor.apiCredentials,
    }

    return NextResponse.json(redacted)
  } catch (error) {
    console.error('Error updating vendor:', error)
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 })
  }
}

export async function DELETE(
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
    const [vendor] = await db
      .delete(vendors)
      .where(eq(vendors.id, id))
      .returning()

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vendor:', error)
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 })
  }
}
