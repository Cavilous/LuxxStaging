import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vendors, inventory } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { requireApiAuth } from '@/lib/auth-helpers'
import { fetchHostAwayListings, type NormalizedListing } from '@/lib/hostaway'

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
    const [vendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, id))
      .limit(1)

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    if (vendor.apiType !== 'hostaway') {
      return NextResponse.json({ error: 'Vendor does not have a HostAway API configured' }, { status: 400 })
    }

    const credentials = vendor.apiCredentials as { accountId?: string; apiKey?: string }
    if (!credentials?.accountId || !credentials?.apiKey) {
      return NextResponse.json({ error: 'HostAway API credentials are not configured' }, { status: 400 })
    }

    const listings = await fetchHostAwayListings({
      accountId: credentials.accountId,
      apiKey: credentials.apiKey,
    })

    const externalIds = listings.map(l => l.externalId)
    let existingIds: Set<string> = new Set()

    if (externalIds.length > 0) {
      const existing = await db
        .select({ externalId: inventory.externalId })
        .from(inventory)
        .where(
          and(
            eq(inventory.externalSource, 'hostaway'),
            inArray(inventory.externalId, externalIds)
          )
        )
      existingIds = new Set(existing.map(e => e.externalId).filter(Boolean) as string[])
    }

    const listingsWithStatus = listings.map(listing => ({
      ...listing,
      alreadyInCms: existingIds.has(listing.externalId),
    }))

    return NextResponse.json({
      listings: listingsWithStatus,
      total: listings.length,
      alreadyImported: existingIds.size,
      newListings: listings.length - existingIds.size,
    })
  } catch (error) {
    console.error('Error fetching HostAway listings:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch listings'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
