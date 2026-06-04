import 'server-only'
import { Storage, File } from "@google-cloud/storage"
import { randomUUID } from "crypto"

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106"

function createStorageClient(): Storage {
  // Always use Replit's sidecar endpoint for authentication
  // This works in both development and production on Replit
  return new Storage({
    credentials: {
      audience: "replit",
      subject_token_type: "access_token",
      token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
      type: "external_account",
      credential_source: {
        url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
        format: {
          type: "json",
          subject_token_field_name: "access_token",
        },
      },
      universe_domain: "googleapis.com",
    },
    projectId: "",
  })
}

export const objectStorageClient = createStorageClient()

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found")
    this.name = "ObjectNotFoundError"
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype)
  }
}

export class ObjectStorageService {
  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || ""
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      )
    }
    return dir
  }

  async getObjectEntityUploadURL(): Promise<string> {
    const privateObjectDir = this.getPrivateObjectDir()
    const objectId = randomUUID()
    const fullPath = `${privateObjectDir}/uploads/${objectId}`

    const { bucketName, objectName } = parseObjectPath(fullPath)

    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900,
    })
  }

  async getObjectEntityFile(objectPath: string): Promise<File> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError()
    }

    const parts = objectPath.slice(1).split("/")
    if (parts.length < 2) {
      throw new ObjectNotFoundError()
    }

    const entityId = parts.slice(1).join("/")
    let entityDir = this.getPrivateObjectDir()
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`
    }
    const objectEntityPath = `${entityDir}${entityId}`
    const { bucketName, objectName } = parseObjectPath(objectEntityPath)
    const bucket = objectStorageClient.bucket(bucketName)
    const objectFile = bucket.file(objectName)
    const [exists] = await objectFile.exists()
    if (!exists) {
      throw new ObjectNotFoundError()
    }
    return objectFile
  }

  normalizeObjectEntityPath(rawPath: string): string {
    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath
    }

    const url = new URL(rawPath)
    const rawObjectPath = url.pathname

    let objectEntityDir = this.getPrivateObjectDir()
    if (!objectEntityDir.endsWith("/")) {
      objectEntityDir = `${objectEntityDir}/`
    }

    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath
    }

    const entityId = rawObjectPath.slice(objectEntityDir.length)
    return `/objects/${entityId}`
  }
}

function parseObjectPath(path: string): {
  bucketName: string
  objectName: string
} {
  if (!path.startsWith("/")) {
    path = `/${path}`
  }
  const pathParts = path.split("/")
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name")
  }

  const bucketName = pathParts[1]
  const objectName = pathParts.slice(2).join("/")

  return {
    bucketName,
    objectName,
  }
}

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string
  objectName: string
  method: "GET" | "PUT" | "DELETE" | "HEAD"
  ttlSec: number
}): Promise<string> {
  // Use the sidecar's dedicated signing endpoint for better production compatibility
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  }
  
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  )
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(
      `Failed to sign object URL, status: ${response.status}, error: ${errorText}`
    )
  }

  const { signed_url: signedURL } = await response.json()
  return signedURL
}

/**
 * Upload a buffer directly to object storage using presigned URLs
 * This works in both development and production environments
 * Returns both the object path and a signed URL for access
 */
export async function uploadToObjectStorage(
  buffer: Buffer,
  objectPath: string,
  contentType: string = 'application/octet-stream'
): Promise<{ objectPath: string; publicUrl: string }> {
  const privateObjectDir = process.env.PRIVATE_OBJECT_DIR || ""
  if (!privateObjectDir) {
    throw new Error(
      "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
        "tool and set PRIVATE_OBJECT_DIR env var."
    )
  }

  // Ensure path doesn't start with /
  if (objectPath.startsWith('/')) {
    objectPath = objectPath.slice(1)
  }

  const fullPath = `${privateObjectDir}/${objectPath}`
  const { bucketName, objectName } = parseObjectPath(fullPath)

  // Get a presigned PUT URL for uploading
  const uploadUrl = await signObjectURL({
    bucketName,
    objectName,
    method: "PUT",
    ttlSec: 900, // 15 minutes for upload
  })

  // Upload directly to the presigned URL (works in production)
  // Convert Buffer to Uint8Array for fetch compatibility
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: new Uint8Array(buffer),
    headers: {
      "Content-Type": contentType,
    },
  })

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text().catch(() => 'Unknown error')
    throw new Error(
      `Failed to upload to storage, status: ${uploadResponse.status}, error: ${errorText}`
    )
  }

  // Return permanent GCS URL (bucket must be configured for public access)
  // If bucket is not public, use /api/objects/... path as fallback
  const permanentUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`

  return {
    objectPath: `/objects/${objectPath}`,
    publicUrl: permanentUrl,
  }
}

/**
 * Get the canonical URL for an existing object.
 * Returns the direct GCS URL which is stored in the database as source of truth.
 * Note: This URL requires authentication - use normalizeImageUrl() for public display.
 */
export function getPublicUrl(objectPath: string): string {
  const privateObjectDir = process.env.PRIVATE_OBJECT_DIR || ""
  if (!privateObjectDir) {
    throw new Error("PRIVATE_OBJECT_DIR not set")
  }

  // Handle both /objects/... and raw paths
  if (objectPath.startsWith('/objects/')) {
    objectPath = objectPath.slice('/objects/'.length)
  }
  if (objectPath.startsWith('/api/objects/')) {
    objectPath = objectPath.slice('/api/objects/'.length)
  }
  if (objectPath.startsWith('/')) {
    objectPath = objectPath.slice(1)
  }

  const fullPath = `${privateObjectDir}/${objectPath}`
  const { bucketName, objectName } = parseObjectPath(fullPath)

  return `https://storage.googleapis.com/${bucketName}/${objectName}`
}


/**
 * Get a signed URL for reading an object from storage
 * This works in both development and production environments
 * Returns null if the object doesn't exist
 */
export async function getSignedReadUrl(objectPath: string): Promise<string | null> {
  const privateObjectDir = process.env.PRIVATE_OBJECT_DIR || ""
  if (!privateObjectDir) {
    console.error("[ObjectStorage] PRIVATE_OBJECT_DIR not set")
    return null
  }

  // Handle both /objects/... and raw paths
  if (objectPath.startsWith('/objects/')) {
    objectPath = objectPath.slice('/objects/'.length)
  }
  if (objectPath.startsWith('/')) {
    objectPath = objectPath.slice(1)
  }

  const fullPath = `${privateObjectDir}/${objectPath}`
  const { bucketName, objectName } = parseObjectPath(fullPath)

  try {
    // Generate a signed URL for reading (1 hour - reasonable for redirect)
    const signedUrl = await signObjectURL({
      bucketName,
      objectName,
      method: "GET",
      ttlSec: 60 * 60, // 1 hour
    })

    return signedUrl
  } catch (error) {
    console.error("[ObjectStorage] Failed to get signed URL:", error instanceof Error ? error.message : error)
    return null
  }
}

/**
 * Download object content directly using presigned URL
 * This works in both development and production environments
 */
export async function downloadObject(objectPath: string): Promise<Buffer | null> {
  const signedUrl = await getSignedReadUrl(objectPath)
  if (!signedUrl) {
    return null
  }

  try {
    const response = await fetch(signedUrl)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      console.error(`[ObjectStorage] Download failed: ${response.status}`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error("[ObjectStorage] Download error:", error instanceof Error ? error.message : error)
    return null
  }
}
