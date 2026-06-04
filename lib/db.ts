import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './db/schema'

const connectionString = process.env.DATABASE_URL!

export const client = postgres(connectionString, {
  prepare: false,
  idle_timeout: 20,
  max_lifetime: 60 * 5,
  connect_timeout: 30,
  max: 10,
  connection: {
    application_name: 'luxx-miami',
  },
})

export const db = drizzle(client, { schema })

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  label = 'query'
): Promise<T> {
  let lastError: Error | undefined
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      const isRetryable =
        error.code === 'CONNECTION_CLOSED' ||
        error.code === 'CONNECTION_ENDED' ||
        error.code === 'CONNECT_TIMEOUT' ||
        error.message?.includes('CONNECTION_CLOSED') ||
        error.message?.includes('timeout') ||
        error.message?.includes('ECONNRESET') ||
        error.message?.includes('terminating connection')

      if (isRetryable && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        console.warn(`⚠️ ${label} failed (attempt ${attempt}/${maxRetries}): ${error.code || error.message}. Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        console.error(`❌ ${label} failed after ${attempt} attempt(s):`, error.message)
        throw lastError
      }
    }
  }
  throw lastError
}
