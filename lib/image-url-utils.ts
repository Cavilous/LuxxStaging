export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  
  const trimmed = url.trim()
  if (!trimmed || trimmed.length === 0) return null
  
  if (trimmed === 'undefined' || trimmed === 'null' || trimmed === '[object Object]') return null
  
  if (trimmed.startsWith('/api/objects/')) {
    return trimmed
  }
  
  if (trimmed.startsWith('/objects/')) {
    return `/api${trimmed}`
  }
  
  if (trimmed.startsWith('https://storage.googleapis.com/')) {
    try {
      const gcsUrl = new URL(trimmed)
      const pathParts = gcsUrl.pathname.split('/')
      
      const uploadsIndex = pathParts.findIndex(part => part === 'uploads')
      if (uploadsIndex !== -1) {
        const objectPath = pathParts.slice(uploadsIndex).join('/')
        return `/api/objects/${objectPath}`
      }
      
      if (pathParts.length >= 3) {
        const objectPath = pathParts.slice(2).join('/')
        return `/api/objects/${objectPath}`
      }
    } catch {
      return null
    }
  }
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  
  if (trimmed.startsWith('uploads/')) {
    return `/api/objects/${trimmed}`
  }
  
  return null
}
