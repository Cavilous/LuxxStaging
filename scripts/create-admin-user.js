const { drizzle } = require('drizzle-orm/postgres-js')
const postgres = require('postgres')
const bcrypt = require('bcryptjs')
const { adminUsers, auditLogs } = require('../lib/db/schema')

async function createAdminUser() {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is required')
    process.exit(1)
  }

  const email = process.argv[2] || 'support@alhmedia.com'
  const password = process.argv[3] || 'ALH2026alh!'
  const name = process.argv[4] || 'Super Admin'
  const role = process.argv[5] || 'super_admin'

  console.log(`\n🔧 Creating admin user...`)
  console.log(`📧 Email: ${email}`)
  console.log(`👤 Name: ${name}`)
  console.log(`🔑 Role: ${role}\n`)

  const client = postgres(connectionString, { prepare: false })
  const db = drizzle(client)

  try {
    const passwordHash = await bcrypt.hash(password, 10)

    const [result] = await db.insert(adminUsers).values({
      email: email,
      passwordHash: passwordHash,
      name: name,
      role: role,
      isActive: true,
    }).returning()

    await db.insert(auditLogs).values({
      tableName: 'admin_users',
      recordId: result.id,
      action: 'create',
      changes: {
        email: email,
        role: role,
        is_active: true,
        note: 'Admin user created via script',
      },
      adminUserId: result.id,
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', email)
    console.log('⚠️  Please change the password after first login\n')
    
    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    if (error.message.includes('duplicate key')) {
      console.error('   User with this email already exists!')
    }
    await client.end()
    process.exit(1)
  }
}

createAdminUser()
