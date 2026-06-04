import { readFileSync } from 'fs'
import { bulkImportCars } from '../server/bulk-import-cars'

async function main() {
  console.log('Starting bulk car import...')
  
  const csvContent = readFileSync('attached_assets/Parker Final - CARS_1763834183573.csv', 'utf-8')
  
  const result = await bulkImportCars(csvContent)
  
  console.log('\n=== Import Results ===')
  console.log(`Success: ${result.success}`)
  console.log(`Message: ${result.message}`)
  console.log(`Imported: ${result.imported}`)
  console.log(`Skipped: ${result.skipped}`)
  console.log(`Failed: ${result.failed}`)
  console.log('======================\n')
  
  process.exit(result.success ? 0 : 1)
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
