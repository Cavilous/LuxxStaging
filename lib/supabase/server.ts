import 'server-only'
import { createDbClient } from '@/lib/db/client'

export function createClient() {
  return createDbClient()
}
