import { NextResponse, type NextRequest } from "next/server"
import * as jose from "jose"

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

function canUseDemoAdmin(request: NextRequest) {
  return process.env.DISABLE_DEMO_ADMIN_ACCESS !== "true" && isDemoAccessHost(request.headers.get("host"))
}

function redirectToDemoAdmin(request: NextRequest, returnTo: string) {
  const demoLoginUrl = new URL("/api/admin/auth/demo-login", request.url)
  demoLoginUrl.searchParams.set("returnTo", returnTo)
  return NextResponse.redirect(demoLoginUrl)
}

async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    const jwtSecret = process.env.JWT_SECRET || JWT_SECRET_FALLBACK
    
    const secret = new TextEncoder().encode(jwtSecret)
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: ["HS256"]
    })
    
    if (!payload.userId || !payload.email || !payload.role) {
      return false
    }
    
    return true
  } catch (error) {
    return false
  }
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith("/admin")
  const isAdminLoginRoute = pathname.startsWith("/admin/login")
  const isSetupRoute = pathname === "/setup-admin"

  if (isSetupRoute) {
    return NextResponse.next()
  }

  if (isAdminLoginRoute && canUseDemoAdmin(request)) {
    const returnTo = request.nextUrl.searchParams.get("returnTo") || "/admin"
    return redirectToDemoAdmin(request, returnTo)
  }

  if (isAdminRoute && !isAdminLoginRoute) {
    const adminSessionToken = request.cookies.get("admin_session")?.value
    
    if (!adminSessionToken) {
      if (canUseDemoAdmin(request)) {
        return redirectToDemoAdmin(request, pathname)
      }

      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("returnTo", pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    const isValid = await verifyAdminSession(adminSessionToken)
    if (!isValid) {
      if (canUseDemoAdmin(request)) {
        const response = redirectToDemoAdmin(request, pathname)
        response.cookies.delete("admin_session")
        return response
      }

      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("returnTo", pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete("admin_session")
      return response
    }
    
    return NextResponse.next()
  }

  return NextResponse.next()
}
