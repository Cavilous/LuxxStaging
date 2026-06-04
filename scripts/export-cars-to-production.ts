import { writeFileSync } from 'fs'
import { db } from '../lib/db'
import { inventory } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

function escapeSqlString(str: string | null): string {
  if (str === null || str === undefined) return 'NULL'
  return `'${str.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`
}

function formatJsonb(obj: any): string {
  if (!obj) return 'NULL'
  const jsonStr = JSON.stringify(obj)
  return `'${jsonStr.replace(/'/g, "''")}'::jsonb`
}

async function main() {
  console.log('🚀 Exporting cars from DEVELOPMENT database...\n')

  const cars = await db
    .select()
    .from(inventory)
    .where(eq(inventory.category, 'car'))
    .orderBy(inventory.title)

  console.log(`✅ Found ${cars.length} cars to export\n`)

  // Separate cars with images vs without
  const carsWithImages = cars.filter(car => car.images && Array.isArray(car.images) && car.images.length > 0)
  const carsWithoutImages = cars.filter(car => !car.images || !Array.isArray(car.images) || car.images.length === 0)

  console.log(`📸 ${carsWithImages.length} cars have images`)
  console.log(`📭 ${carsWithoutImages.length} cars have no images\n`)

  // Create cleanup SQL
  const cleanupSql = `-- Cleanup: Delete old cars from production database
-- Run this FIRST before importing new cars

DELETE FROM inventory WHERE category = 'car';

-- Verify deletion
SELECT COUNT(*) as remaining_cars FROM inventory WHERE category = 'car';
`

  writeFileSync('production-cleanup.sql', cleanupSql)
  console.log('✅ Created: production-cleanup.sql')

  // Create batch files (10 cars each)
  const batchSize = 10
  const totalBatches = Math.ceil(carsWithImages.length / batchSize)

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize
    const end = Math.min(start + batchSize, carsWithImages.length)
    const batchCars = carsWithImages.slice(start, end)
    
    let sql = `-- Production Import Batch ${i + 1}/${totalBatches}\n`
    sql += `-- Cars ${start + 1}-${end} of ${carsWithImages.length}\n\n`

    for (const car of batchCars) {
      sql += `INSERT INTO inventory (\n`
      sql += `  category, title, subtitle, description,\n`
      sql += `  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,\n`
      sql += `  specifications, images, smugmug_url,\n`
      sql += `  is_published, is_featured, created_at, updated_at\n`
      sql += `) VALUES (\n`
      sql += `  'car',\n`
      sql += `  ${escapeSqlString(car.title)},\n`
      sql += `  ${escapeSqlString(car.subtitle)},\n`
      sql += `  ${escapeSqlString(car.description)},\n`
      sql += `  ${car.pricePerDay ? escapeSqlString(car.pricePerDay) : 'NULL'},\n`
      sql += `  ${car.pricePerHour ? escapeSqlString(car.pricePerHour) : 'NULL'},\n`
      sql += `  ${car.price4hr ? escapeSqlString(car.price4hr) : 'NULL'},\n`
      sql += `  ${car.price6hr ? escapeSqlString(car.price6hr) : 'NULL'},\n`
      sql += `  ${car.price8hr ? escapeSqlString(car.price8hr) : 'NULL'},\n`
      sql += `  ${formatJsonb(car.specifications)},\n`
      sql += `  ${formatJsonb(car.images)},\n`
      sql += `  ${escapeSqlString(car.smugmugUrl)},\n`
      sql += `  true,\n`  // Publish cars with images
      sql += `  ${car.isFeatured ? 'true' : 'false'},\n`
      sql += `  NOW(),\n`
      sql += `  NOW()\n`
      sql += `);\n\n`
    }

    const batchNum = String(i + 1).padStart(2, '0')
    const filename = `production-batch-${batchNum}.sql`
    writeFileSync(filename, sql)
    
    const fileSize = (Buffer.byteLength(sql) / 1024).toFixed(2)
    console.log(`✅ Batch ${batchNum}/${totalBatches}: ${filename} (${fileSize} KB, ${batchCars.length} cars)`)
  }

  console.log(`\n🚀 Created ${totalBatches} batch files!\n`)
  
  // Create publish SQL for cars without images (optional)
  if (carsWithoutImages.length > 0) {
    let noImageSql = `-- Optional: Cars without images (${carsWithoutImages.length} total)\n`
    noImageSql += `-- These are NOT included in the main import\n`
    noImageSql += `-- You can import these manually if needed\n\n`
    
    noImageSql += `-- List of cars without images:\n`
    carsWithoutImages.forEach(car => {
      noImageSql += `-- ${car.title}\n`
    })
    
    writeFileSync('production-cars-no-images.txt', noImageSql)
    console.log(`📝 Created: production-cars-no-images.txt (${carsWithoutImages.length} cars)`)
  }

  console.log('\n═══════════════════════════════════════')
  console.log('📊 EXPORT SUMMARY')
  console.log('═══════════════════════════════════════')
  console.log(`Total cars exported:     ${cars.length}`)
  console.log(`Cars WITH images:        ${carsWithImages.length}`)
  console.log(`Cars WITHOUT images:     ${carsWithoutImages.length}`)
  console.log(`Batch files created:     ${totalBatches}`)
  console.log('═══════════════════════════════════════\n')

  process.exit(0)
}

main().catch((error) => {
  console.error('💥 Export failed:', error)
  process.exit(1)
})
