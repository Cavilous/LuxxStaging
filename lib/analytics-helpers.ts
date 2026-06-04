import 'server-only'
import { db } from '@/lib/db'
import { formSubmissionEvents } from '@/lib/db/schema'
import { headers } from 'next/headers'

interface InventoryContext {
  inventoryId?: string
  inventorySlug?: string
  inventoryTitle?: string
  inventoryCategory?: string
}

interface FormSubmissionData {
  formType: string
  pageUrl?: string
  pageRoute?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  payload: Record<string, unknown>
  inventoryContext?: InventoryContext
}

function sanitizePayload(payload: unknown): unknown {
  if (payload === null || payload === undefined) {
    return payload
  }
  
  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item))
  }
  
  if (typeof payload === 'object') {
    const sensitiveFields = ['password', 'passwordHash', 'token', 'secret', 'apiKey', 'creditCard', 'ssn']
    const sanitized: Record<string, unknown> = {}
    
    for (const [key, value] of Object.entries(payload)) {
      const lowerKey = key.toLowerCase()
      if (sensitiveFields.some(f => lowerKey.includes(f))) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = sanitizePayload(value)
      }
    }
    
    return sanitized
  }
  
  return payload
}

export async function logFormSubmission(data: FormSubmissionData): Promise<void> {
  try {
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || undefined
    const referrer = headersList.get('referer') || undefined
    const pageUrl = data.pageUrl || referrer || ''
    
    const deviceType = userAgent
      ? /mobile|android|iphone|ipad|tablet/i.test(userAgent)
        ? 'mobile'
        : 'desktop'
      : undefined

    const sanitizedPayload = sanitizePayload(data.payload) as Record<string, unknown>

    const metadata: Record<string, unknown> = {}
    if (data.inventoryContext) {
      if (data.inventoryContext.inventoryId) metadata.inventoryId = data.inventoryContext.inventoryId
      if (data.inventoryContext.inventorySlug) metadata.inventorySlug = data.inventoryContext.inventorySlug
      if (data.inventoryContext.inventoryTitle) metadata.inventoryTitle = data.inventoryContext.inventoryTitle
      if (data.inventoryContext.inventoryCategory) metadata.inventoryCategory = data.inventoryContext.inventoryCategory
    }

    await db.insert(formSubmissionEvents).values({
      formType: data.formType,
      pageUrl,
      pageRoute: data.pageRoute,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      payload: sanitizedPayload,
      deviceType,
      userAgent,
      referrer,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    })
  } catch (error) {
    console.error('Failed to log form submission:', error)
  }
}
