import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vendors, inventory } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { requireApiAuth } from '@/lib/auth-helpers'
import { fetchHostAwayListings } from '@/lib/hostaway'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
}

export async function POST(
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
    const { listingIds, resync = false } = body as { listingIds: string[]; resync?: boolean }

    if (!listingIds || !Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json({ error: 'No listing IDs provided' }, { status: 400 })
    }

    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, id))
      .limit(1)

    if (!vendor) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }

    if (vendor.apiType !== 'hostaway') {
      return NextResponse.json({ error: 'Supplier does not have a HostAway API configured' }, { status: 400 })
    }

    const credentials = vendor.apiCredentials as { accountId?: string; apiKey?: string }
    if (!credentials?.accountId || !credentials?.apiKey) {
      return NextResponse.json({ error: 'HostAway API credentials are not configured' }, { status: 400 })
    }

    const allListings = await fetchHostAwayListings({
      accountId: credentials.accountId,
      apiKey: credentials.apiKey,
    })

    const selectedListings = allListings.filter(l => listingIds.includes(l.externalId))

    if (selectedListings.length === 0) {
      return NextResponse.json({ error: 'None of the selected listings were found in HostAway' }, { status: 400 })
    }

    const existing = await db
      .select({ externalId: inventory.externalId })
      .from(inventory)
      .where(
        and(
          eq(inventory.externalSource, 'hostaway'),
          inArray(inventory.externalId, listingIds)
        )
      )
    const alreadyImportedIds = new Set(existing.map(e => e.externalId).filter(Boolean))

    let created = 0
    let updated = 0
    let skipped = 0
    const errors: { externalId: string; error: string }[] = []

    for (const listing of selectedListings) {
      try {
        const isExisting = alreadyImportedIds.has(listing.externalId)

        if (isExisting && !resync) {
          skipped++
          continue
        }

        const baseSlug = generateSlug(listing.title)
        const slug = `${baseSlug}-ha${listing.externalId}`

        if (isExisting && resync) {
          await db
            .update(inventory)
            .set({
              title: listing.title,
              description: listing.description || null,
              pricePerDay: listing.pricePerDay,
              pricePerWeek: listing.pricePerWeek,
              pricePerMonth: listing.pricePerMonth,
              currency: listing.currency,
              specifications: listing.specifications,
              features: listing.features,
              images: listing.images,
              imageSourceUrls: listing.images,
              serviceCities: listing.location ? [listing.location.toLowerCase()] : ['miami'],
            })
            .where(
              and(
                eq(inventory.externalSource, 'hostaway'),
                eq(inventory.externalId, listing.externalId)
              )
            )
          updated++
        } else {
          await db.insert(inventory).values({
            category: 'villa',
            title: listing.title,
            description: listing.description || null,
            pricePerDay: listing.pricePerDay,
            pricePerWeek: listing.pricePerWeek,
            pricePerMonth: listing.pricePerMonth,
            currency: listing.currency,
            specifications: listing.specifications,
            features: listing.features,
            images: listing.images,
            imageSourceUrls: listing.images,
            isPublished: false,
            isFeatured: false,
            availabilityStatus: 'available',
            slug,
            transactionType: 'rental',
            externalSource: 'hostaway',
            externalId: listing.externalId,
            serviceCities: listing.location ? [listing.location.toLowerCase()] : ['miami'],
          })
          created++
        }
      } catch (err) {
        console.error(`Error importing listing ${listing.externalId}:`, err)
        errors.push({
          externalId: listing.externalId,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      created,
      updated,
      skipped,
      failed: errors.length,
      errors,
    })
  } catch (error) {
    console.error('Error importing listings:', error)
    const message = error instanceof Error ? error.message : 'Failed to import listings'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
