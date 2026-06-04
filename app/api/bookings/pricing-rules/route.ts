import { NextResponse } from 'next/server'
import { getPricingRules } from '@/lib/pricing-actions'

export async function GET() {
  try {
    const rules = await getPricingRules()
    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching pricing rules:', error)
    return NextResponse.json({ error: 'Failed to fetch pricing rules' }, { status: 500 })
  }
}
