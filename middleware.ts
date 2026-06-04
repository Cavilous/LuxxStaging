import { NextRequest, NextResponse } from "next/server"
import { updateSession } from "./lib/middleware-auth"

const TRACKING_PARAMS = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'dclid',
  'ref', 'source', '_ga', '_gl', 'mc_cid', 'mc_eid',
])

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname === "/cars") {
    const url = request.nextUrl.clone()
    url.pathname = "/cars-listing"
    url.search = ""
    return NextResponse.redirect(url, 301)
  }

  if (pathname.startsWith("/brand/")) {
    const brandSlug = pathname.replace("/brand/", "")
    const url = request.nextUrl.clone()
    url.pathname = `/miami/${brandSlug}-rental`
    url.search = ""
    return NextResponse.redirect(url, 301)
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
    const searchParams = request.nextUrl.searchParams
    let hasTrackingParams = false
    const cleanParams = new URLSearchParams()

    searchParams.forEach((value, key) => {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        hasTrackingParams = true
      } else {
        cleanParams.append(key, value)
      }
    })

    if (hasTrackingParams) {
      const url = request.nextUrl.clone()
      url.search = cleanParams.toString() ? `?${cleanParams.toString()}` : ""
      return NextResponse.redirect(url, 301)
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, apple-touch-icon.png (favicon files)
     * - site.webmanifest (web manifest)
     * - robots.txt, sitemap.xml (SEO files)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.png|apple-touch-icon\\.png|android-chrome-.*\\.png|favicon-.*\\.png|site\\.webmanifest|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
