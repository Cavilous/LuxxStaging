import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import { formSubmissionEvents } from '@/lib/db/schema'
import { and, gte, lte, desc, sql, count, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await requireSuperAdmin()

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const formType = searchParams.get('formType')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const aggregation = searchParams.get('aggregation')

    const offset = (page - 1) * limit

    const conditions = []
    if (startDate) {
      conditions.push(gte(formSubmissionEvents.createdAt, new Date(startDate)))
    }
    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setHours(23, 59, 59, 999)
      conditions.push(lte(formSubmissionEvents.createdAt, endDateObj))
    }
    if (formType) {
      conditions.push(eq(formSubmissionEvents.formType, formType))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    if (aggregation === 'daily') {
      const dailyData = await db
        .select({
          date: sql<string>`DATE(${formSubmissionEvents.createdAt})`.as('date'),
          count: count(),
        })
        .from(formSubmissionEvents)
        .where(whereClause)
        .groupBy(sql`DATE(${formSubmissionEvents.createdAt})`)
        .orderBy(sql`DATE(${formSubmissionEvents.createdAt})`)

      return NextResponse.json({
        success: true,
        data: dailyData,
      })
    }

    if (aggregation === 'byFormType') {
      const byFormType = await db
        .select({
          formType: formSubmissionEvents.formType,
          count: count(),
        })
        .from(formSubmissionEvents)
        .where(whereClause)
        .groupBy(formSubmissionEvents.formType)
        .orderBy(desc(count()))

      return NextResponse.json({
        success: true,
        data: byFormType,
      })
    }

    const [totalResult] = await db
      .select({ count: count() })
      .from(formSubmissionEvents)
      .where(whereClause)

    const total = totalResult?.count || 0

    const events = await db
      .select({
        id: formSubmissionEvents.id,
        formType: formSubmissionEvents.formType,
        pageUrl: formSubmissionEvents.pageUrl,
        pageRoute: formSubmissionEvents.pageRoute,
        customerName: formSubmissionEvents.customerName,
        customerEmail: formSubmissionEvents.customerEmail,
        customerPhone: formSubmissionEvents.customerPhone,
        deviceType: formSubmissionEvents.deviceType,
        metadata: formSubmissionEvents.metadata,
        createdAt: formSubmissionEvents.createdAt,
      })
      .from(formSubmissionEvents)
      .where(whereClause)
      .orderBy(desc(formSubmissionEvents.createdAt))
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
    console.error('Error fetching form analytics:', error)
    if ((error as Error).message?.includes('Unauthorized') || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ success: false, error: (error as Error).message }, { status: 403 })
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch form analytics' }, { status: 500 })
  }
}
