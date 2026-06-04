import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as jwt from "jsonwebtoken"
import { randomUUID } from "crypto"
import { uploadToObjectStorage, getPublicUrl } from "@/lib/object-storage"
import { db } from "@/lib/db"
import { uploadLogs } from "@/lib/db/schema"
import { processImageBuffer } from "@/lib/image-pipeline"

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const dynamic = "force-dynamic"

async function logUpload(data: {
  fileName: string
  fileSize: number
  fileType?: string
  status: 'success' | 'error'
  resultUrl?: string
  errorCode?: string
  errorMessage?: string
  durationMs?: number
  uploadContext?: string
  userEmail?: string
}) {
  try {
    await db.insert(uploadLogs).values({
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileType: data.fileType || null,
      status: data.status,
      resultUrl: data.resultUrl || null,
      errorCode: data.errorCode || null,
      errorMessage: data.errorMessage || null,
      durationMs: data.durationMs || null,
      uploadContext: data.uploadContext || null,
      userEmail: data.userEmail || null,
    })
  } catch (e) {
    console.error("[Upload] Failed to log upload:", e)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let fileName = 'unknown'
  let fileSize = 0
  let fileType = 'unknown'
  let userEmail: string | undefined
  const uploadContext = request.headers.get('x-upload-context') || 'unknown'
  
  try {
    // Verify admin JWT token
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    
    if (!token) {
      console.error("[Upload] No admin session token found in cookies")
      await logUpload({ fileName, fileSize, status: 'error', errorCode: 'NO_SESSION', errorMessage: 'Unauthorized - No session found', durationMs: Date.now() - startTime, uploadContext })
      return NextResponse.json({ 
        error: "Unauthorized - No session found",
        code: "NO_SESSION"
      }, { status: 401 })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email?: string }
      userEmail = decoded.email
    } catch (jwtError) {
      console.error("[Upload] JWT verification failed:", jwtError instanceof Error ? jwtError.message : jwtError)
      await logUpload({ fileName, fileSize, status: 'error', errorCode: 'INVALID_SESSION', errorMessage: 'Unauthorized - Invalid session', durationMs: Date.now() - startTime, uploadContext })
      return NextResponse.json({ 
        error: "Unauthorized - Invalid session",
        code: "INVALID_SESSION"
      }, { status: 401 })
    }
    
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (formError) {
      const errorMsg = formError instanceof Error ? formError.message : "Unknown error"
      console.error("[Upload] Failed to parse form data:", errorMsg)
      await logUpload({ fileName, fileSize, status: 'error', errorCode: 'FORM_PARSE_ERROR', errorMessage: errorMsg, durationMs: Date.now() - startTime, uploadContext, userEmail })
      return NextResponse.json({ 
        error: "Failed to process upload. The file may be too large or the request was interrupted.",
        code: "FORM_PARSE_ERROR",
        details: errorMsg
      }, { status: 400 })
    }
    
    const file = formData.get("file") as File

    if (!file) {
      console.error("[Upload] No file provided in form data")
      await logUpload({ fileName, fileSize, status: 'error', errorCode: 'NO_FILE', errorMessage: 'No file provided', durationMs: Date.now() - startTime, uploadContext, userEmail })
      return NextResponse.json({ 
        error: "No file provided",
        code: "NO_FILE"
      }, { status: 400 })
    }

    fileName = file.name
    fileSize = file.size
    fileType = file.type

    console.log(`[Upload] START - Processing file: ${fileName}, size: ${(fileSize / 1024 / 1024).toFixed(2)}MB, type: ${fileType}`)

    // Check file size
    if (fileSize > MAX_FILE_SIZE) {
      console.error(`[Upload] File too large: ${(fileSize / 1024 / 1024).toFixed(2)}MB exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`)
      await logUpload({ fileName, fileSize, fileType, status: 'error', errorCode: 'FILE_TOO_LARGE', errorMessage: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`, durationMs: Date.now() - startTime, uploadContext, userEmail })
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB. Your file is ${(fileSize / 1024 / 1024).toFixed(2)}MB.`,
        code: "FILE_TOO_LARGE",
        maxSize: MAX_FILE_SIZE,
        actualSize: fileSize
      }, { status: 413 })
    }

    // Validate file type - be lenient with empty MIME types (Safari/iOS often omit them)
    // We'll validate by extension instead when MIME type is missing
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml']
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg']
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || ''
    
    const hasMimeType = fileType && fileType !== 'application/octet-stream'
    const hasValidMimeType = hasMimeType && validMimeTypes.includes(fileType)
    const hasValidExtension = validExtensions.includes(fileExtension)
    
    if (!hasValidMimeType && !hasValidExtension) {
      console.error(`[Upload] Invalid file type: MIME=${fileType}, ext=${fileExtension}`)
      await logUpload({ fileName, fileSize, fileType, status: 'error', errorCode: 'INVALID_FILE_TYPE', errorMessage: `Invalid file type: ${fileType || fileExtension}`, durationMs: Date.now() - startTime, uploadContext, userEmail })
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, AVIF, SVG`,
        code: "INVALID_FILE_TYPE",
        allowedTypes: validMimeTypes,
        actualType: fileType,
        actualExtension: fileExtension
      }, { status: 400 })
    }
    
    console.log(`[Upload] File type validation passed: MIME=${fileType || 'empty'}, ext=${fileExtension}`)

    const buffer = Buffer.from(await file.arrayBuffer())
    
    const itemTitle = request.headers.get('x-item-title') || 'image'
    const imageIndex = parseInt(request.headers.get('x-image-index') || '0', 10)

    try {
      console.log(`[Upload] Processing through image pipeline: ${fileName}`)
      
      const result = await processImageBuffer(buffer, itemTitle, imageIndex)
      
      const duration = Date.now() - startTime
      console.log(
        `[Upload] SUCCESS in ${duration}ms. ` +
        `HQ: ${(result.hqBytes / 1024).toFixed(0)}KB, ` +
        `LQ: ${(result.lqBytes / 1024).toFixed(0)}KB, ` +
        `${result.imageObject.width}x${result.imageObject.height}`
      )

      await logUpload({
        fileName,
        fileSize,
        fileType,
        status: 'success',
        resultUrl: result.imageObject.hqUrl,
        durationMs: duration,
        uploadContext,
        userEmail
      })

      return NextResponse.json({
        url: result.imageObject.hqUrl,
        imageObject: result.imageObject,
        filename: fileName,
        size: fileSize,
        type: fileType,
        duration,
        hqBytes: result.hqBytes,
        lqBytes: result.lqBytes,
      })
    } catch (uploadError) {
      const duration = Date.now() - startTime
      const errorMsg = uploadError instanceof Error ? uploadError.message : "Unknown error"
      console.error(`[Upload] EXCEPTION after ${duration}ms:`, errorMsg)
      if (uploadError instanceof Error && uploadError.stack) {
        console.error("[Upload] Stack trace:", uploadError.stack)
      }
      await logUpload({
        fileName,
        fileSize,
        fileType,
        status: 'error',
        errorCode: 'STORAGE_EXCEPTION',
        errorMessage: errorMsg,
        durationMs: duration,
        uploadContext,
        userEmail
      })
      return NextResponse.json({ 
        error: "Upload to storage failed. Please try again.",
        code: "STORAGE_EXCEPTION",
        fileName,
        fileSize,
        duration,
        details: errorMsg
      }, { status: 500 })
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[Upload] UNEXPECTED ERROR after ${duration}ms:`, error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("[Upload] Error details:", errorMessage)
    if (errorStack) {
      console.error("[Upload] Stack trace:", errorStack)
    }
    await logUpload({
      fileName,
      fileSize,
      fileType,
      status: 'error',
      errorCode: 'UNEXPECTED_ERROR',
      errorMessage,
      durationMs: duration,
      uploadContext,
      userEmail
    })
    return NextResponse.json({ 
      error: "Upload failed. Please try again.",
      code: "UNEXPECTED_ERROR",
      fileName,
      fileSize,
      duration,
      details: errorMessage
    }, { status: 500 })
  }
}
