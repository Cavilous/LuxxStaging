import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vendors } from '@/lib/db/schema'
import { requireApiAuth } from '@/lib/auth-helpers'
import { desc } from 'drizzle-orm'

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
    console.error('Error fetching suppliers:', error)
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 })
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
    const { name, category, description, contactName, contactEmail, contactPhone, website, apiType, apiCredentials, metadata } = body

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
        metadata: normalizeSupplierMetadata(metadata),
      })
      .returning()

    const sanitized = {
      ...vendor,
      apiCredentials: vendor.apiType !== 'none' ? { configured: true } : {},
    }

    return NextResponse.json(sanitized, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 })
  }
}
