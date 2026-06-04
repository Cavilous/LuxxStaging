import { type NextRequest, NextResponse } from "next/server"
import { getSignedReadUrl } from "@/lib/object-storage"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const objectPath = path.join("/")

    let signedUrl = await getSignedReadUrl(objectPath)

    if (!signedUrl && objectPath.startsWith('uploads/')) {
      const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']
      const pathHasExtension = /\.[a-z]{2,4}$/i.test(objectPath)

      if (!pathHasExtension) {
        for (const ext of extensions) {
          const pathWithExt = `${objectPath}.${ext}`
          signedUrl = await getSignedReadUrl(pathWithExt)
          if (signedUrl) break
        }
      }
    }

    if (!signedUrl) {
      console.error("[Objects] Object not found:", objectPath)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const imageResponse = await fetch(signedUrl, {
      signal: AbortSignal.timeout(15000),
    })

    if (!imageResponse.ok) {
      console.error("[Objects] GCS fetch failed:", imageResponse.status, objectPath)
      return NextResponse.json({ error: "Failed to fetch object" }, { status: imageResponse.status })
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/webp'
    const body = imageResponse.body

    if (!body) {
      return NextResponse.json({ error: "Empty response from storage" }, { status: 502 })
    }

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Content-Length": imageResponse.headers.get('content-length') || '',
      },
    })
  } catch (error) {
    console.error("Error serving object:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
