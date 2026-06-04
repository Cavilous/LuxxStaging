"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw, Pause, Play, Link2 } from "lucide-react"
import { toast } from "sonner"

interface UrlImportStatus {
  url: string
  status: 'queued' | 'importing' | 'success' | 'failed'
  resultUrl?: string
  error?: string
}

interface BulkImageImportProps {
  onImagesImported: (urls: string[]) => void
  onImportingChange?: (isImporting: boolean) => void
  existingSingleImport: React.ReactNode
}

export function BulkImageImport({ 
  onImagesImported, 
  onImportingChange,
  existingSingleImport 
}: BulkImageImportProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single')
  const [urlsInput, setUrlsInput] = useState('')
  const [importStatuses, setImportStatuses] = useState<UrlImportStatus[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const pauseRef = useRef(false)
  const abortRef = useRef(false)

  const parseUrls = (input: string): string[] => {
    const lines = input
      .split(/[\n,]/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    return lines
  }

  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  const importSingleUrl = async (url: string, retries = 2): Promise<{ success: boolean; resultUrl?: string; error?: string }> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch('/api/import-direct-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || `HTTP ${response.status}`)
        }

        const data = await response.json()
        return { success: true, resultUrl: data.url }
      } catch (error) {
        if (attempt === retries) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Import failed' 
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
    return { success: false, error: 'Max retries exceeded' }
  }

  const startBulkImport = async () => {
    const urls = parseUrls(urlsInput)
    
    if (urls.length === 0) {
      toast.warning('No URLs to import', { description: 'Please paste at least one URL' })
      return
    }

    const initialStatuses: UrlImportStatus[] = urls.map(url => ({
      url,
      status: validateUrl(url) ? 'queued' : 'failed',
      error: validateUrl(url) ? undefined : 'Invalid URL format'
    }))

    setImportStatuses(initialStatuses)
    setIsImporting(true)
    setIsPaused(false)
    pauseRef.current = false
    abortRef.current = false
    onImportingChange?.(true)

    const successfulUrls: string[] = []

    for (let i = 0; i < initialStatuses.length; i++) {
      if (abortRef.current) break

      while (pauseRef.current && !abortRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      if (abortRef.current) break

      const status = initialStatuses[i]
      
      if (status.status === 'failed') {
        continue
      }

      setImportStatuses(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'importing' } : s
      ))

      const result = await importSingleUrl(status.url)

      if (result.success && result.resultUrl) {
        successfulUrls.push(result.resultUrl)
        onImagesImported([result.resultUrl])
        
        setImportStatuses(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'success', resultUrl: result.resultUrl } : s
        ))
      } else {
        setImportStatuses(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'failed', error: result.error } : s
        ))
      }
    }

    setIsImporting(false)
    setIsPaused(false)
    onImportingChange?.(false)

    const successCount = importStatuses.filter(s => s.status === 'success').length + successfulUrls.length
    const failCount = importStatuses.filter(s => s.status === 'failed').length

    if (successCount > 0) {
      toast.success(`Imported ${successCount} images`, {
        description: failCount > 0 ? `${failCount} failed - use Retry Failed` : undefined
      })
    } else if (failCount > 0) {
      toast.error('All imports failed', { description: 'Check URLs and try again' })
    }
  }

  const retryFailed = async () => {
    const failedIndexes = importStatuses
      .map((s, i) => s.status === 'failed' && validateUrl(s.url) ? i : -1)
      .filter(i => i !== -1)

    if (failedIndexes.length === 0) {
      toast.info('No failed imports to retry')
      return
    }

    setIsImporting(true)
    pauseRef.current = false
    abortRef.current = false
    onImportingChange?.(true)

    for (const i of failedIndexes) {
      if (abortRef.current) break

      while (pauseRef.current && !abortRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      if (abortRef.current) break

      const status = importStatuses[i]

      setImportStatuses(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'importing', error: undefined } : s
      ))

      const result = await importSingleUrl(status.url)

      if (result.success && result.resultUrl) {
        onImagesImported([result.resultUrl])
        
        setImportStatuses(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'success', resultUrl: result.resultUrl } : s
        ))
      } else {
        setImportStatuses(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'failed', error: result.error } : s
        ))
      }
    }

    setIsImporting(false)
    onImportingChange?.(false)
  }

  const togglePause = () => {
    pauseRef.current = !pauseRef.current
    setIsPaused(pauseRef.current)
  }

  const clearImport = () => {
    abortRef.current = true
    setImportStatuses([])
    setUrlsInput('')
    setIsImporting(false)
    setIsPaused(false)
    onImportingChange?.(false)
  }

  const stats = {
    total: importStatuses.length,
    queued: importStatuses.filter(s => s.status === 'queued').length,
    importing: importStatuses.filter(s => s.status === 'importing').length,
    success: importStatuses.filter(s => s.status === 'success').length,
    failed: importStatuses.filter(s => s.status === 'failed').length
  }

  const progress = stats.total > 0 
    ? ((stats.success + stats.failed) / stats.total) * 100 
    : 0

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'single' | 'bulk')}>
        <TabsList className="bg-[#1a1a1a] border border-[#333333]">
          <TabsTrigger 
            value="single" 
            className="data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black"
            disabled={isImporting}
          >
            Single Import
          </TabsTrigger>
          <TabsTrigger 
            value="bulk" 
            className="data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black"
            disabled={isImporting}
          >
            Bulk Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-4">
          {existingSingleImport}
        </TabsContent>

        <TabsContent value="bulk" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Paste Image URLs (one per line)
            </Label>
            <Textarea
              value={urlsInput}
              onChange={(e) => setUrlsInput(e.target.value)}
              placeholder="https://photos.smugmug.com/image1.jpg
https://photos.smugmug.com/image2.jpg
https://example.com/image3.png

Paste one direct image URL per line. Order is preserved."
              className="bg-[#0A0A0A] border-[#333333] text-white min-h-[150px] font-mono text-sm"
              disabled={isImporting}
            />
            <p className="text-xs text-gray-500">
              {parseUrls(urlsInput).length} URL{parseUrls(urlsInput).length !== 1 ? 's' : ''} detected
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={startBulkImport}
              disabled={isImporting || parseUrls(urlsInput).length === 0}
              className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import All'
              )}
            </Button>

            {isImporting && (
              <Button
                onClick={togglePause}
                variant="outline"
                className="border-[#333333]"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
            )}

            {stats.failed > 0 && !isImporting && (
              <Button
                onClick={retryFailed}
                variant="outline"
                className="border-[#333333] text-[#ECAC36]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Failed ({stats.failed})
              </Button>
            )}

            {importStatuses.length > 0 && !isImporting && (
              <Button
                onClick={clearImport}
                variant="ghost"
                className="text-gray-400"
              >
                Clear
              </Button>
            )}
          </div>

          {importStatuses.length > 0 && (
            <div className="space-y-3 border border-[#333333] rounded-lg p-4 bg-[#111111]">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progress: {stats.success + stats.failed} / {stats.total}</span>
                <span className="flex gap-3">
                  <span className="text-green-400">{stats.success} success</span>
                  <span className="text-red-400">{stats.failed} failed</span>
                </span>
              </div>
              <Progress value={progress} className="h-2" />

              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {importStatuses.map((status, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-sm py-1 px-2 rounded bg-[#0a0a0a]"
                  >
                    {status.status === 'queued' && (
                      <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    )}
                    {status.status === 'importing' && (
                      <Loader2 className="h-4 w-4 text-[#ECAC36] animate-spin flex-shrink-0" />
                    )}
                    {status.status === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                    {status.status === 'failed' && (
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className="truncate flex-1 text-gray-300" title={status.url}>
                      {status.url.length > 60 ? status.url.slice(0, 60) + '...' : status.url}
                    </span>
                    {status.error && (
                      <span className="text-red-400 text-xs flex-shrink-0">
                        {status.error}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
