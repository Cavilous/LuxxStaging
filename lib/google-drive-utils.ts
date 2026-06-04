import 'server-only'
import { google } from 'googleapis';

export interface GoogleDriveImage {
  url: string
  alt: string
  thumbnail?: string
}

let connectionSettings: any;

async function getAccessToken() {
  // Check if we have a valid cached token
  if (connectionSettings?.settings?.expires_at && connectionSettings?.settings?.access_token) {
    const expiresAt = new Date(connectionSettings.settings.expires_at).getTime()
    if (expiresAt > Date.now()) {
      return connectionSettings.settings.access_token;
    }
  }
  
  // Validate environment variables
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  if (!hostname) {
    throw new Error('Google Drive connector not available. REPLIT_CONNECTORS_HOSTNAME is not set.');
  }
  
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Google Drive connector not available. Replit identity token not found.');
  }

  // Fetch connection settings from Replit
  try {
    const response = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-drive',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Drive connection: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json()
    connectionSettings = data.items?.[0]
  } catch (error) {
    throw new Error(`Google Drive connector not available. Failed to fetch connection settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Extract access token with safe null checks
  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Drive not connected. Please set up the Google Drive integration in Replit.');
  }
  
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
async function getUncachableGoogleDriveClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

function validateGoogleDriveUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname.includes('drive.google.com') && url.includes('/folders/')
  } catch {
    return false
  }
}

export function extractDriveFolderId(url: string): string | null {
  if (!url || !url.includes("drive.google.com")) return null
  
  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

/**
 * Extract direct image URLs from a Google Drive shared folder using Drive API v3
 * 
 * REQUIREMENTS:
 * - Google Drive connector must be set up in Replit
 * - Folder must be publicly accessible (Anyone with link can view)
 * - Folder should contain image files (JPEG, PNG, GIF, etc.)
 * 
 * This uses the authenticated Google Drive API to reliably list all files in the folder.
 */
export async function extractImagesFromGoogleDrive(driveUrl: string): Promise<GoogleDriveImage[]> {
  if (!validateGoogleDriveUrl(driveUrl)) {
    throw new Error('Invalid Google Drive URL. Must be a shared folder URL (e.g., https://drive.google.com/drive/folders/ABC123)')
  }
  
  const folderId = extractDriveFolderId(driveUrl)
  if (!folderId) {
    throw new Error('Could not extract folder ID from Google Drive URL')
  }
  
  try {
    console.log('[Google Drive API] Fetching folder contents:', folderId)
    
    // Get authenticated Drive client
    const drive = await getUncachableGoogleDriveClient()
    
    // List all files in the folder that are images
    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/')`,
      fields: 'files(id, name, mimeType, thumbnailLink, webContentLink)',
      pageSize: 100,
      orderBy: 'name'
    })
    
    const files = response.data.files || []
    console.log(`[Google Drive API] Found ${files.length} image files in folder`)
    
    if (files.length === 0) {
      throw new Error('No image files found in Google Drive folder. Make sure the folder contains images and is publicly accessible.')
    }
    
    // Convert file metadata to image URLs
    const imageUrls: GoogleDriveImage[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.id || !file.name) continue
      
      // Generate direct view URL for the image
      const directUrl = `https://drive.google.com/uc?export=view&id=${file.id}`
      const thumbnailUrl = file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`
      
      // Clean up filename for alt text
      const altText = file.name
        .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
      
      imageUrls.push({
        url: directUrl,
        thumbnail: thumbnailUrl,
        alt: altText || `Image ${i + 1}`
      })
      
      console.log(`[Google Drive API] Image ${i + 1}: ${file.name} (${file.id})`)
    }
    
    console.log(`[Google Drive API] Successfully extracted ${imageUrls.length} images from folder`)
    
    return imageUrls
  } catch (error) {
    console.error('[Google Drive API Error]:', error)
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('not connected')) {
        throw new Error('Google Drive is not connected. Please set up the Google Drive integration in Replit.')
      }
      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        throw new Error('Access denied to Google Drive folder. Make sure the folder is publicly accessible with "Anyone with link can view" permissions.')
      }
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        throw new Error('Google Drive folder not found. Verify the folder ID is correct and the folder exists.')
      }
    }
    
    throw error
  }
}

/**
 * Check if a URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') && url.includes('/folders/')
}
