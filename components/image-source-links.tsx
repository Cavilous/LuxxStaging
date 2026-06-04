"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Copy, Trash2, Check, Link2 } from "lucide-react"
import { format } from "date-fns"

export interface ImageSourceUrl {
  url: string
  addedAt: string
  source?: string
}

interface ImageSourceLinksProps {
  urls: ImageSourceUrl[]
  onRemove?: (url: string) => void
  className?: string
}

export function ImageSourceLinks({ urls, onRemove, className = "" }: ImageSourceLinksProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  if (!urls || urls.length === 0) {
    return null
  }

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getSourceLabel = (url: string, source?: string): string => {
    if (source) return source
    if (url.includes("smugmug")) return "SmugMug"
    if (url.includes("drive.google")) return "Google Drive"
    if (url.includes("dropbox")) return "Dropbox"
    return "External Link"
  }

  const getSourceColor = (url: string, source?: string): string => {
    const label = getSourceLabel(url, source).toLowerCase()
    if (label.includes("smugmug")) return "bg-green-500/20 text-green-400 border-green-500/30"
    if (label.includes("google")) return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    if (label.includes("dropbox")) return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
    return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  const truncateUrl = (url: string, maxLength: number = 60): string => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength - 3) + "..."
  }

  return (
    <Card className={`bg-[#1a1a1a] border-[#333] ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <Link2 className="h-4 w-4 text-[#ECAC36]" />
          Image Source Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {urls.map((item, index) => (
          <div
            key={`${item.url}-${index}`}
            className="flex items-center gap-2 p-2 bg-[#0A0A0A] rounded border border-[#333] group"
          >
            <span
              className={`text-xs px-2 py-0.5 rounded border ${getSourceColor(item.url, item.source)}`}
            >
              {getSourceLabel(item.url, item.source)}
            </span>
            
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-sm text-[#ECAC36] hover:text-[#B8860B] truncate"
              title={item.url}
            >
              {truncateUrl(item.url)}
            </a>
            
            {item.addedAt && (
              <span className="text-xs text-gray-500 hidden sm:inline">
                {format(new Date(item.addedAt), "MMM d, yyyy")}
              </span>
            )}
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                onClick={() => handleCopy(item.url)}
                title="Copy URL"
              >
                {copiedUrl === item.url ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
              
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-7 w-7 text-gray-400 hover:text-white"
                title="Open in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-400"
                  onClick={() => onRemove(item.url)}
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <p className="text-xs text-gray-500 pt-1">
          {urls.length} source{urls.length !== 1 ? "s" : ""} used for importing images
        </p>
      </CardContent>
    </Card>
  )
}

export function addImageSourceUrl(
  existingUrls: ImageSourceUrl[],
  newUrl: string,
  source?: string
): ImageSourceUrl[] {
  const normalizedUrl = newUrl.trim()
  
  if (existingUrls.some(u => u.url === normalizedUrl)) {
    return existingUrls
  }
  
  return [
    ...existingUrls,
    {
      url: normalizedUrl,
      addedAt: new Date().toISOString(),
      source: source || undefined,
    },
  ]
}

export function removeImageSourceUrl(
  existingUrls: ImageSourceUrl[],
  urlToRemove: string
): ImageSourceUrl[] {
  return existingUrls.filter(u => u.url !== urlToRemove)
}
