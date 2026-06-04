import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as jwt from "jsonwebtoken"
import { Client } from "@replit/object-storage"

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin JWT token (same auth as upload route)
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    
    if (!token) {
      console.error("[Delete] No admin session token found in cookies")
      return NextResponse.json({ error: "Unauthorized - No session found" }, { status: 401 })
    }

    try {
      jwt.verify(token, JWT_SECRET)
    } catch (jwtError) {
      console.error("[Delete] JWT verification failed:", jwtError instanceof Error ? jwtError.message : jwtError)
      return NextResponse.json({ error: "Unauthorized - Invalid session" }, { status: 401 })
    }
    
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Extract the object path from the URL
    // Handles both /api/objects/uploads/<id> and /api/objects/uploads/<id>.<ext>
    let objectPath = url
    if (objectPath.startsWith('/api/objects/')) {
      objectPath = objectPath.replace('/api/objects/', '')
    } else if (objectPath.startsWith('/objects/')) {
      objectPath = objectPath.replace('/objects/', '')
    }

    console.log(`[Delete] Attempting to delete object: ${objectPath}`)

    // Delete using Replit Object Storage SDK (same as upload route)
    const client = new Client()
    const result = await client.delete(objectPath)
    
    if (!result.ok) {
      console.error("[Delete] Delete failed:", result.error)
      // Don't fail if object doesn't exist - it might have been already deleted
      if (result.error?.message?.includes('not found') || result.error?.message?.includes('NoSuchKey')) {
        console.log("[Delete] Object not found, considering as already deleted")
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }

    console.log(`[Delete] Successfully deleted: ${objectPath}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Delete] Unexpected error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
