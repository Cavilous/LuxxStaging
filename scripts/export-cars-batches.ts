import { writeFileSync } from 'fs'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../lib/db/schema'
import { inventory } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

function escapeSQL(str: string | null): string {
  if (!str) return 'NULL'
  return `'${str.replace(/'/g, "''")}'`
}

function escapeSQLJson(obj: any): string {
  if (!obj) return 'NULL'
  const jsonStr = JSON.stringify(obj)
  return `'${jsonStr.replace(/'/g, "''")}'::jsonb`
}

async function exportToSQLBatches() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false })
  const db = drizzle(client, { schema })

  console.log('📊 Fetching all cars from development database...\n')
  
  const cars = await db
    .select()
    .from(inventory)
    .where(eq(inventory.category, 'car'))

  console.log(`✅ Found ${cars.length} cars to export\n`)

  const batchSize = 20
  const numBatches = Math.ceil(cars.length / batchSize)

  for (let batchNum = 0; batchNum < numBatches; batchNum++) {
    const startIdx = batchNum * batchSize
    const endIdx = Math.min(startIdx + batchSize, cars.length)
    const batchCars = cars.slice(startIdx, endIdx)

    const sqlStatements: string[] = []
    
    sqlStatements.push('-- ═══════════════════════════════════════════════════════════')
    sqlStatements.push(`-- Luxx Miami - Car Inventory Batch ${batchNum + 1}/${numBatches}`)
    sqlStatements.push('-- ═══════════════════════════════════════════════════════════')
    sqlStatements.push(`-- Generated: ${new Date().toISOString()}`)
    sqlStatements.push(`-- Cars in this batch: ${batchCars.length} (${startIdx + 1}-${endIdx} of ${cars.length})`)
    sqlStatements.push('-- ')
    sqlStatements.push('-- INSTRUCTIONS:')
    sqlStatements.push('-- 1. Open Database pane → Production → SQL tab')
    sqlStatements.push('-- 2. Copy and paste this entire file')
    sqlStatements.push('-- 3. Click "Run"')
    sqlStatements.push(`-- 4. Then run batch ${batchNum + 2} (if available)`)
    sqlStatements.push('-- ═══════════════════════════════════════════════════════════')
    sqlStatements.push('')

    for (const car of batchCars) {
      const title = escapeSQL(car.title)
      const description = escapeSQL(car.description)
      const pricePerDay = car.pricePerDay ? escapeSQL(car.pricePerDay) : 'NULL'
      const specifications = escapeSQLJson(car.specifications)
      const images = escapeSQLJson(car.images)
      const smugmugUrl = car.smugmugUrl ? escapeSQL(car.smugmugUrl) : 'NULL'
      const isPublished = car.isPublished ? 'true' : 'false'
      const isFeatured = car.isFeatured ? 'true' : 'false'

      sqlStatements.push(
        `INSERT INTO inventory (category, title, description, price_per_day, specifications, images, smugmug_url, is_published, is_featured, created_at, updated_at)`
      )
      sqlStatements.push(
        `VALUES ('car', ${title}, ${description}, ${pricePerDay}, ${specifications}, ${images}, ${smugmugUrl}, ${isPublished}, ${isFeatured}, NOW(), NOW());`
      )
      sqlStatements.push('')
    }

    sqlStatements.push('-- ═══════════════════════════════════════════════════════════')
    sqlStatements.push(`-- Batch ${batchNum + 1}/${numBatches} complete! ${batchCars.length} cars inserted.`)
    sqlStatements.push('-- ═══════════════════════════════════════════════════════════')

    const filename = `production-import-batch-${batchNum + 1}.sql`
    writeFileSync(filename, sqlStatements.join('\n'))

    const fileSize = (sqlStatements.join('\n').length / 1024).toFixed(2)
    console.log(`✅ Batch ${batchNum + 1}/${numBatches}: ${filename} (${fileSize} KB, ${batchCars.length} cars)`)
  }

  await client.end()

  console.log(`\n🚀 Created ${numBatches} batch files!`)
  console.log(`📝 Run them in order: batch-1.sql → batch-2.sql → ... → batch-${numBatches}.sql`)
}

exportToSQLBatches().catch((error) => {
  console.error('❌ Export failed:', error)
  process.exit(1)
})
