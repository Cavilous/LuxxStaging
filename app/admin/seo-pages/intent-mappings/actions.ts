'use server'

import { getAllIntentMappings, upsertIntentMapping, deleteIntentMapping } from '@/lib/seo-page-actions'

export async function fetchAllIntentMappings() {
  return getAllIntentMappings()
}

export async function saveIntentMapping(data: {
  id?: string
  sourceType: string
  sourceValue: string
  urlSegment: string
  displayName: string
  category?: string | null
  isActive?: boolean
}) {
  return upsertIntentMapping(data)
}

export async function removeIntentMapping(id: string) {
  return deleteIntentMapping(id)
}
