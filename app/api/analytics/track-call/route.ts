import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { callEvents } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, pageUrl, pageRoute } = body

    if (!phoneNumber || !pageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const userAgent = request.headers.get('user-agent') || undefined
    const referrer = request.headers.get('referer') || undefined

    const deviceType = userAgent
      ? /mobile|android|iphone|ipad|tablet/i.test(userAgent)
        ? 'mobile'
        : 'desktop'
      : undefined

    await db.insert(callEvents).values({
      phoneNumber,
      pageUrl,
      pageRoute: pageRoute || undefined,
      deviceType,
      userAgent,
      referrer,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking call event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
