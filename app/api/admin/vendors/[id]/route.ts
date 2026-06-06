import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vendors } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireApiAuth } from '@/lib/auth-helpers'

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function cleanString(value: unknown) {
  if (value === null || value === undefined) return null
  const cleaned = String(value).trim()
  return cleaned || null
}

function cleanInstagramHandle(value: unknown) {
  const cleaned = cleanString(value)
  return cleaned ? cleaned.replace(/^@+/, '') : null
}

function cleanTags(value: unknown) {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []
  return values
    .map((tag) => cleanString(tag))
    .filter((tag): tag is string => !!tag)
}

function cleanRating(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const rating = Number(value)
  if (!Number.isFinite(rating)) return null
  return Math.min(5, Math.max(1, Math.round(rating)))
}

function cleanBoolean(value: unknown) {
  return value === true || value === 'true'
}

function normalizeSupplierMetadata(metadata: unknown, existing: Record<string, unknown> = {}) {
  const input = isRecord(metadata) ? metadata : {}
  const next: Record<string, unknown> = { ...existing, ...input }
  const has = (key: string) => Object.prototype.hasOwnProperty.call(input, key)

  if (has('supplierType') || has('categoryLabel')) {
    next.supplierType = cleanString(input.supplierType ?? input.categoryLabel)
  }
  if (has('instagramHandle')) next.instagramHandle = cleanInstagramHandle(input.instagramHandle)
  if (has('serviceArea')) next.serviceArea = cleanString(input.serviceArea)
  if (has('internalRating')) next.internalRating = cleanRating(input.internalRating)
  if (has('preferredSupplier')) next.preferredSupplier = cleanBoolean(input.preferredSupplier)
  if (has('paymentTerms')) next.paymentTerms = cleanString(input.paymentTerms)
  if (has('commissionNotes')) next.commissionNotes = cleanString(input.commissionNotes)
  if (has('source')) next.source = cleanString(input.source)
  if (has('tags')) next.tags = cleanTags(input.tags)
  if (has('privateNotes')) next.privateNotes = cleanString(input.privateNotes)

  return next
}

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
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
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
    console.error('Error fetching supplier:', error)
    return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 })
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
    const { name, category, description, contactName, contactEmail, contactPhone, website, apiType, apiCredentials, isActive, metadata } = body

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
    if (metadata !== undefined) {
      const [existingVendor] = await db
        .select({ metadata: vendors.metadata })
        .from(vendors)
        .where(eq(vendors.id, id))
        .limit(1)

      if (!existingVendor) {
        return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
      }

      updateData.metadata = normalizeSupplierMetadata(metadata, isRecord(existingVendor.metadata) ? existingVendor.metadata : {})
    }

    const [vendor] = await db
      .update(vendors)
      .set(updateData)
      .where(eq(vendors.id, id))
      .returning()

    if (!vendor) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
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
    console.error('Error updating supplier:', error)
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 })
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
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 })
  }
}
