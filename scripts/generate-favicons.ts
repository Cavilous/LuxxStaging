import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { join } from 'path'

async function generateFavicons() {
  console.log('🎨 Generating favicons from Luxx Miami logo...\n')
  
  const logoPath = join(process.cwd(), 'public', 'luxx-logo.png')
  const publicDir = join(process.cwd(), 'public')
  
  try {
    // Read the original logo
    const logoBuffer = await sharp(logoPath).toBuffer()
    const metadata = await sharp(logoBuffer).metadata()
    console.log(`📸 Original logo: ${metadata.width}x${metadata.height}`)
    
    // Generate favicon.ico (32x32)
    console.log('\n🔧 Generating favicon.ico (32x32)...')
    await sharp(logoBuffer)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .png()
      .toFile(join(publicDir, 'favicon-32x32.png'))
    
    // Generate 16x16 favicon
    console.log('🔧 Generating favicon-16x16.png...')
    await sharp(logoBuffer)
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .png()
      .toFile(join(publicDir, 'favicon-16x16.png'))
    
    // Generate Apple Touch Icon (180x180)
    console.log('🔧 Generating apple-touch-icon.png (180x180)...')
    await sharp(logoBuffer)
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'))
    
    // Generate Android Chrome icons
    console.log('🔧 Generating android-chrome-192x192.png...')
    await sharp(logoBuffer)
      .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .png()
      .toFile(join(publicDir, 'android-chrome-192x192.png'))
    
    console.log('🔧 Generating android-chrome-512x512.png...')
    await sharp(logoBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .png()
      .toFile(join(publicDir, 'android-chrome-512x512.png'))
    
    // Generate main favicon.ico using the 32x32 version
    console.log('🔧 Generating favicon.ico...')
    await sharp(logoBuffer)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
      .toFormat('png')
      .toFile(join(publicDir, 'favicon.ico'))
    
    console.log('\n✅ All favicons generated successfully!')
    console.log('\nGenerated files:')
    console.log('  - favicon.ico (32x32)')
    console.log('  - favicon-16x16.png')
    console.log('  - favicon-32x32.png')
    console.log('  - apple-touch-icon.png (180x180)')
    console.log('  - android-chrome-192x192.png')
    console.log('  - android-chrome-512x512.png')
    
  } catch (error: any) {
    console.error('❌ Error generating favicons:', error.message)
    throw error
  }
}

generateFavicons()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Failed:', error)
    process.exit(1)
  })
