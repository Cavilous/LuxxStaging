import { NextResponse, type NextRequest } from "next/server"
import * as jose from "jose"

async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not set")
      return false
    }
    
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

  if (isAdminRoute && !isAdminLoginRoute) {
    const adminSessionToken = request.cookies.get("admin_session")?.value
    
    if (!adminSessionToken) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("returnTo", pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    const isValid = await verifyAdminSession(adminSessionToken)
    if (!isValid) {
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
