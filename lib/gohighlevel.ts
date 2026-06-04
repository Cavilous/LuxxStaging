import 'server-only'

const GHL_LOCATION_ID = 'jHsahHRyi4idYXLBABQB'
const GHL_PIPELINE_ID = 'vt7aqT3ehcUlkm3gJRv1'
const GHL_STAGE_ID = 'e6b25012-0af0-478d-8525-5788179cf75c'

export interface GHLContactPayload {
  name: string
  phone: string
  email?: string
  source?: string
  tags?: string[]
  itemTitle?: string
  location?: string
  hasDriversLicense?: boolean
  hasInsurance?: boolean
  travelType?: string
  serviceLine?: string
  startDate?: string
  endDate?: string
  occasionPurpose?: string
  specialRequests?: string
}

export interface GHLContactResult {
  success: boolean
  contactId?: string
  error?: string
}

function computeRentalDays(startDate?: string, endDate?: string): number | undefined {
  if (!startDate || !endDate) return undefined
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined
  const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return days > 0 ? days : undefined
}

export async function createGHLContact(payload: GHLContactPayload): Promise<GHLContactResult> {
  const apiKey = process.env.GOHIGHLEVEL_API_KEY
  if (!apiKey) {
    console.warn('⚠️ GOHIGHLEVEL_API_KEY is not set  -  skipping GHL contact creation')
    return { success: false, error: 'GOHIGHLEVEL_API_KEY not configured' }
  }

  const [firstName, ...rest] = (payload.name || '').trim().split(' ')
  const lastName = rest.join(' ') || undefined

  const body: Record<string, unknown> = {
    firstName,
    ...(lastName ? { lastName } : {}),
    ...(payload.phone ? { phone: payload.phone } : {}),
    ...(payload.email ? { email: payload.email } : {}),
    source: payload.source || 'Website',
    locationId: GHL_LOCATION_ID,
    ...(payload.tags && payload.tags.length > 0 ? { tags: payload.tags } : {}),
  }

  const customFields: Array<{ id: string; field_value: string | number }> = []

  if (payload.serviceLine) {
    customFields.push({ id: 'mSMg0CqrkCIEZVJnnVX2', field_value: payload.serviceLine })
  }
  if (payload.startDate) {
    customFields.push({ id: '2h7S46zUi3IAzJnmEs0W', field_value: payload.startDate })
  }
  if (payload.endDate) {
    customFields.push({ id: 'frtNIbv7EWa1LwGwS1NK', field_value: payload.endDate })
  }
  const rentalDays = computeRentalDays(payload.startDate, payload.endDate)
  if (rentalDays !== undefined) {
    customFields.push({ id: 'IP7wSPmCFeCLJwVoYChU', field_value: rentalDays })
  }
  if (payload.occasionPurpose) {
    customFields.push({ id: '5iyJmUczmjnaGP0E9As5', field_value: payload.occasionPurpose })
  }
  if (payload.specialRequests) {
    customFields.push({ id: '18OssYNG8aKKqKLxlOr8', field_value: payload.specialRequests })
  }
  if (payload.hasInsurance !== undefined) {
    customFields.push({ id: 'Oitilgnv3uQcYKf5OXcY', field_value: payload.hasInsurance ? 'Approved' : 'Pending' })
  }

  if (customFields.length > 0) {
    body.customFields = customFields
  }

  try {
    const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ GHL API error:', response.status, data)
      return { success: false, error: `GHL API responded with ${response.status}` }
    }

    const contactId = data?.contact?.id
    console.log('✅ GHL contact created:', contactId)

    if (contactId) {
      await createGHLOpportunity({
        contactId,
        name: payload.name,
        apiKey,
        itemTitle: payload.itemTitle,
        serviceLine: payload.serviceLine,
        location: payload.location,
      })
      const noteBody = buildContactNote(payload)
      if (noteBody) {
        await createGHLNote({ contactId, body: noteBody, apiKey })
      }
    }

    return { success: true, contactId }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('❌ GHL request failed:', message)
    return { success: false, error: message }
  }
}

function buildContactNote(payload: GHLContactPayload): string | undefined {
  const lines: string[] = []
  if (payload.itemTitle) lines.push(`Asset: ${payload.itemTitle}`)
  if (payload.serviceLine) lines.push(`Category: ${payload.serviceLine}`)
  if (payload.startDate && payload.endDate) {
    const days = computeRentalDays(payload.startDate, payload.endDate)
    lines.push(`Dates: ${payload.startDate} – ${payload.endDate}${days ? ` (${days} day${days !== 1 ? 's' : ''})` : ''}`)
  } else if (payload.startDate) {
    lines.push(`Start Date: ${payload.startDate}`)
  }
  if (payload.location) lines.push(`Location: ${payload.location}`)
  if (payload.hasDriversLicense !== undefined) {
    lines.push(`Driver's License: ${payload.hasDriversLicense ? 'Yes' : 'No'}`)
  }
  if (payload.hasInsurance !== undefined) {
    lines.push(`Insurance: ${payload.hasInsurance ? 'Yes' : 'No'}`)
  }
  if (payload.travelType) lines.push(`Travel Type: ${payload.travelType.charAt(0).toUpperCase() + payload.travelType.slice(1)}`)
  if (payload.occasionPurpose) lines.push(`Occasion / Purpose: ${payload.occasionPurpose}`)
  if (payload.specialRequests) lines.push(`Message: ${payload.specialRequests}`)
  return lines.length > 0 ? lines.join('\n') : undefined
}

async function createGHLNote({
  contactId,
  body,
  apiKey,
}: {
  contactId: string
  body: string
  apiKey: string
}): Promise<void> {
  try {
    const response = await fetch(
      `https://services.leadconnectorhq.com/contacts/${contactId}/notes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          Version: '2021-07-28',
        },
        body: JSON.stringify({ body }),
      }
    )
    const data = await response.json()
    if (!response.ok) {
      console.error('❌ GHL note creation failed:', response.status, data)
    } else {
      console.log('✅ GHL note created:', data?.note?.id || data?.id)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('❌ GHL note request failed:', message)
  }
}

async function createGHLOpportunity({
  contactId,
  name,
  apiKey,
  itemTitle,
  serviceLine,
  location,
}: {
  contactId: string
  name: string
  apiKey: string
  itemTitle?: string
  serviceLine?: string
  location?: string
}): Promise<void> {
  const oppCustomFields: Array<{ id: string; field_value: string }> = []
  if (itemTitle) oppCustomFields.push({ id: 'LAgSG7cIKRteAyrmx5Y4', field_value: itemTitle })
  if (serviceLine) oppCustomFields.push({ id: '4G0LP2AmXjiLEB1Zq6bd', field_value: serviceLine })
  if (location) oppCustomFields.push({ id: 'pXpxmxWr2LopXwE5BGSx', field_value: location })

  try {
    const response = await fetch('https://services.leadconnectorhq.com/opportunities/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
      },
      body: JSON.stringify({
        pipelineId: GHL_PIPELINE_ID,
        pipelineStageId: GHL_STAGE_ID,
        locationId: GHL_LOCATION_ID,
        contactId,
        name,
        status: 'open',
        ...(oppCustomFields.length > 0 ? { customFields: oppCustomFields } : {}),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ GHL opportunity creation failed:', response.status, data)
    } else {
      console.log('✅ GHL opportunity created:', data?.opportunity?.id)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('❌ GHL opportunity request failed:', message)
  }
}
