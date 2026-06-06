import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import * as jwt from "jsonwebtoken"
import { db } from "@/lib/db"
import { adminUsers } from "@/lib/db/schema"

export const dynamic = "force-dynamic"

const SESSION_DURATION = 60 * 60 * 24 * 7
const DEMO_ADMIN_EMAIL = "demo-admin@luxxmiami.local"

function isDemoAccessHost(host: string | null) {
  if (!host) return false

  const normalizedHost = host.toLowerCase()
  return (
    normalizedHost === "luxx-staging.vercel.app" ||
    normalizedHost.startsWith("luxx-staging-") && normalizedHost.endsWith(".vercel.app") ||
    normalizedHost.startsWith("localhost:") ||
    normalizedHost.startsWith("127.0.0.1:")
  )
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required")
  }
  return secret
}

export async function POST(request: NextRequest) {
  if (process.env.DISABLE_DEMO_ADMIN_ACCESS === "true" || !isDemoAccessHost(request.headers.get("host"))) {
    return NextResponse.json({ error: "Demo admin access is not enabled for this domain." }, { status: 403 })
  }

  try {
    let [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, DEMO_ADMIN_EMAIL))
      .limit(1)

    if (user) {
      ;[user] = await db
        .update(adminUsers)
        .set({
          name: "Demo Admin",
          role: "admin",
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(adminUsers.id, user.id))
        .returning()
    } else {
      ;[user] = await db
        .insert(adminUsers)
        .values({
          email: DEMO_ADMIN_EMAIL,
          name: "Demo Admin",
          role: "admin",
          isActive: true,
        })
        .returning()
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

    await db
      .update(adminUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminUsers.id, user.id))

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
