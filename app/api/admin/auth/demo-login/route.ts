import { NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_ID, DEMO_ADMIN_NAME, DEMO_ADMIN_ROLE } from "@/lib/demo-admin"

export const dynamic = "force-dynamic"

const SESSION_DURATION = 60 * 60 * 24 * 7
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

function safeReturnTo(request: NextRequest) {
  const requestedReturnTo = request.nextUrl.searchParams.get("returnTo")

  if (!requestedReturnTo || !requestedReturnTo.startsWith("/") || requestedReturnTo.startsWith("//")) {
    return "/admin"
  }

  return requestedReturnTo
}

function createDemoToken() {
  return jwt.sign(
      {
        userId: DEMO_ADMIN_ID,
        email: DEMO_ADMIN_EMAIL,
        role: DEMO_ADMIN_ROLE,
    },
    getJwtSecret(),
    { expiresIn: SESSION_DURATION }
  )
}

function setDemoSessionCookie(response: NextResponse, token: string) {
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  })
}

function isDemoAccessEnabled(request: NextRequest) {
  return process.env.DISABLE_DEMO_ADMIN_ACCESS !== "true" && isDemoAccessHost(request.headers.get("host"))
}

export async function GET(request: NextRequest) {
  if (!isDemoAccessEnabled(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  try {
    const token = createDemoToken()
    const response = NextResponse.redirect(new URL(safeReturnTo(request), request.url))
    setDemoSessionCookie(response, token)
    return response
  } catch (error) {
    console.error("Demo admin redirect error:", error)
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}

export async function POST(request: NextRequest) {
  if (!isDemoAccessEnabled(request)) {
    return NextResponse.json({ error: "Demo admin access is not enabled for this domain." }, { status: 403 })
  }

  try {
    const token = createDemoToken()
    const response = NextResponse.json({
      success: true,
      user: {
        id: DEMO_ADMIN_ID,
        email: DEMO_ADMIN_EMAIL,
        name: DEMO_ADMIN_NAME,
        role: DEMO_ADMIN_ROLE,
      },
    })

    setDemoSessionCookie(response, token)

    return response
  } catch (error) {
    console.error("Demo admin login error:", error)
    return NextResponse.json({ error: "Demo admin access failed." }, { status: 500 })
  }
}
