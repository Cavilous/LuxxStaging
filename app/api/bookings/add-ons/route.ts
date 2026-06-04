import { NextRequest, NextResponse } from 'next/server'
import { getAddOnsByCategory } from '@/lib/pricing-actions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    
    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 })
    }

    const addOns = await getAddOnsByCategory(category)
    return NextResponse.json(addOns)
  } catch (error) {
    console.error('Error fetching add-ons:', error)
    return NextResponse.json({ error: 'Failed to fetch add-ons' }, { status: 500 })
  }
}
