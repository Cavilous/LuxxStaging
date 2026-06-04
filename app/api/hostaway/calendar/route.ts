import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { inventory, vendors } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { fetchListingCalendar } from "@/lib/hostaway"

export const revalidate = 3600

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const externalId = searchParams.get("listingId")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  if (!externalId || !from || !to) {
    return NextResponse.json(
      { error: "Missing required parameters: listingId, from, to" },
      { status: 400 }
    )
  }

  const dateRe = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRe.test(from) || !dateRe.test(to)) {
    return NextResponse.json(
      { error: "Dates must be in YYYY-MM-DD format" },
      { status: 400 }
    )
  }

  try {
    const listings = await db
      .select({
        externalSource: inventory.externalSource,
        externalId: inventory.externalId,
      })
      .from(inventory)
      .where(
        and(
          eq(inventory.externalSource, "hostaway"),
          eq(inventory.externalId, externalId)
        )
      )
      .limit(1)

    if (listings.length === 0) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    const hostawayVendors = await db
      .select({
        apiCredentials: vendors.apiCredentials,
      })
      .from(vendors)
      .where(
        and(
          eq(vendors.apiType, "hostaway"),
          eq(vendors.isActive, true)
        )
      )
      .limit(1)

    if (hostawayVendors.length === 0) {
      return NextResponse.json(
        { error: "No active HostAway vendor configured" },
        { status: 404 }
      )
    }

    const creds = hostawayVendors[0].apiCredentials as {
      accountId: string
      apiKey: string
    }

    if (!creds?.accountId || !creds?.apiKey) {
      return NextResponse.json(
        { error: "Invalid HostAway credentials" },
        { status: 500 }
      )
    }

    const calendarDays = await fetchListingCalendar(creds, externalId, from, to)

    const response = NextResponse.json({ days: calendarDays })
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=300")
    return response
  } catch (error) {
    console.error("HostAway calendar fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch availability calendar" },
      { status: 500 }
    )
  }
}
