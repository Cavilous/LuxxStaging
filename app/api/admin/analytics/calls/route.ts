import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { callEvents } from '@/lib/db/schema'
import { and, gte, lte, desc, sql, count } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await requireSuperAdmin()

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const aggregation = searchParams.get('aggregation')

    const offset = (page - 1) * limit

    const conditions = []
    if (startDate) {
      conditions.push(gte(callEvents.createdAt, new Date(startDate)))
    }
    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setHours(23, 59, 59, 999)
      conditions.push(lte(callEvents.createdAt, endDateObj))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    if (aggregation === 'daily') {
      const dailyData = await db
        .select({
          date: sql<string>`DATE(${callEvents.createdAt})`.as('date'),
          count: count(),
        })
        .from(callEvents)
        .where(whereClause)
        .groupBy(sql`DATE(${callEvents.createdAt})`)
        .orderBy(sql`DATE(${callEvents.createdAt})`)

      return NextResponse.json({
        success: true,
        data: dailyData,
      })
    }

    const [totalResult] = await db
      .select({ count: count() })
      .from(callEvents)
      .where(whereClause)

    const total = totalResult?.count || 0

    const events = await db
      .select({
        id: callEvents.id,
        phoneNumber: callEvents.phoneNumber,
        pageUrl: callEvents.pageUrl,
        pageRoute: callEvents.pageRoute,
        deviceType: callEvents.deviceType,
        userAgent: callEvents.userAgent,
        referrer: callEvents.referrer,
        createdAt: callEvents.createdAt,
      })
      .from(callEvents)
      .where(whereClause)
      .orderBy(desc(callEvents.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching call analytics:', error)
    if ((error as Error).message?.includes('Unauthorized') || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ success: false, error: (error as Error).message }, { status: 403 })
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch call analytics' }, { status: 500 })
  }
}
