import { NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"
import { client } from "@/lib/db"

export const dynamic = "force-dynamic"

const SESSION_DURATION = 60 * 60 * 24 * 7
const DEMO_ADMIN_EMAIL = "demo-admin@luxxmiami.local"
const JWT_SECRET_FALLBACK = "your-secret-key-change-in-production"

type DemoAdminUser = {
  id: string
  email: string
  name: string | null
  role: string
}

function isDemoAccessHost(host: string | null) {
  if (!host) return false

  const normalizedHost = host.toLowerCase()
  return (
    normalizedHost === "luxx-staging.vercel.app" ||
    (normalizedHost.startsWith("luxx-staging-") && normalizedHost.endsWith(".vercel.app")) ||
    normalizedHost.startsWith("localhost:") ||
    normalizedHost.startsWith("127.0.0.1:")
  )
}

function getJwtSecret() {
  return process.env.JWT_SECRET || JWT_SECRET_FALLBACK
}

async function getOrCreateDemoAdmin() {
  const existingDemo = await client<DemoAdminUser[]>`
    SELECT id, email, name, role
    FROM admin_users
    WHERE email = ${DEMO_ADMIN_EMAIL}
    LIMIT 1
  `

  if (existingDemo[0]) {
    const updatedDemo = await client<DemoAdminUser[]>`
      UPDATE admin_users
      SET name = 'Demo Admin',
          role = 'admin',
          is_active = true,
          updated_at = NOW()
      WHERE id = ${existingDemo[0].id}
      RETURNING id, email, name, role
    `

    return updatedDemo[0]
  }

  try {
    const createdDemo = await client<DemoAdminUser[]>`
      INSERT INTO admin_users (email, name, role, is_active)
      VALUES (${DEMO_ADMIN_EMAIL}, 'Demo Admin', 'admin', true)
      RETURNING id, email, name, role
    `

    return createdDemo[0]
  } catch (error) {
    console.error("Could not create demo admin; falling back to first active admin:", error)
  }

  const [fallbackUser] = await client<DemoAdminUser[]>`
    SELECT id, email, name, role
    FROM admin_users
    WHERE COALESCE(is_active, true) = true
    ORDER BY CASE
      WHEN role = 'admin' THEN 0
      WHEN role = 'super_admin' THEN 1
      WHEN role = 'editor' THEN 2
      ELSE 3
    END
    LIMIT 1
  `

  return fallbackUser
}

export async function POST(request: NextRequest) {
  if (process.env.DISABLE_DEMO_ADMIN_ACCESS === "true" || !isDemoAccessHost(request.headers.get("host"))) {
    return NextResponse.json({ error: "Demo admin access is not enabled for this domain." }, { status: 403 })
  }

  try {
    const user = await getOrCreateDemoAdmin()

    if (!user) {
      return NextResponse.json({ error: "No active admin account is available for demo access." }, { status: 404 })
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      getJwtSecret(),
      { expiresIn: SESSION_DURATION }
    )

    await client`
      UPDATE admin_users
      SET last_login_at = NOW()
      WHERE id = ${user.id}
    `

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Demo admin login error:", error)
    return NextResponse.json({ error: "Demo admin access failed." }, { status: 500 })
  }
}
