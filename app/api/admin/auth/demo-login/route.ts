import { NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"

export const dynamic = "force-dynamic"

const SESSION_DURATION = 60 * 60 * 24 * 7
const DEMO_ADMIN_ID = "00000000-0000-4000-8000-000000000001"
const DEMO_ADMIN_EMAIL = "demo-admin@luxxmiami.local"
const JWT_SECRET_FALLBACK = "your-secret-key-change-in-production"

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

export async function POST(request: NextRequest) {
  if (process.env.DISABLE_DEMO_ADMIN_ACCESS === "true" || !isDemoAccessHost(request.headers.get("host"))) {
    return NextResponse.json({ error: "Demo admin access is not enabled for this domain." }, { status: 403 })
  }

  try {
    const token = jwt.sign(
      {
        userId: DEMO_ADMIN_ID,
        email: DEMO_ADMIN_EMAIL,
        role: "admin",
      },
      getJwtSecret(),
      { expiresIn: SESSION_DURATION }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: DEMO_ADMIN_ID,
        email: DEMO_ADMIN_EMAIL,
        name: "Demo Admin",
        role: "admin",
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
