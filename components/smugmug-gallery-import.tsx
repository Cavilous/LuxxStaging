"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  FolderOpen, 
  ImageIcon, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  Download
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface ExtractedGallery {
  galleryUrl: string
  directImageUrls: string[]
  warnings?: string[]
}

interface ImportStatus {
  url: string
  status: 'pending' | 'importing' | 'success' | 'failed'
  resultUrl?: string
  error?: string
}

interface SmugMugGalleryImportProps {
  onImagesImported: (urls: string[]) => void
  onImportingChange?: (isImporting: boolean) => void
  existingSourceUrls?: string[]
  onSourceUrlsChange?: (urls: string[]) => void
}

export function SmugMugGalleryImport({ 
  onImagesImported, 
  onImportingChange,
  existingSourceUrls = [],
  onSourceUrlsChange
}: SmugMugGalleryImportProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single')
  const [singleUrl, setSingleUrl] = useState('')
  const [bulkUrls, setBulkUrls] = useState('')
  
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedGalleries, setExtractedGalleries] = useState<ExtractedGallery[]>([])
  const [extractErrors, setExtractErrors] = useState<Array<{ url: string; error: string }>>([])
  
  const [isImporting, setIsImporting] = useState(false)
  const [importStatuses, setImportStatuses] = useState<ImportStatus[]>([])
  const abortRef = useRef(false)
  
  const [showAllPreviews, setShowAllPreviews] = useState(false)
  
  const totalExtractedImages = extractedGalleries.reduce((sum, g) => sum + g.directImageUrls.length, 0)
  
  const parseGalleryUrls = (): string[] => {
    if (mode === 'single') {
      return singleUrl.trim() ? [singleUrl.trim()] : []
    }
    return bulkUrls
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.startsWith('http'))
  }
  
  const handleExtract = async () => {
    const urls = parseGalleryUrls()
    if (urls.length === 0) {
      toast.warning('No gallery URLs', { description: 'Please enter at least one SmugMug gallery URL' })
      return
    }
    
    setIsExtracting(true)
    setExtractedGalleries([])
    setExtractErrors([])
    setImportStatuses([])
    
    try {
      const response = await fetch('/api/admin/smugmug/extract-gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls })
      })
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      setExtractedGalleries(data.results || [])
      setExtractErrors(data.errors || [])
      
      const totalImages = (data.results || []).reduce(
        (sum: number, g: ExtractedGallery) => sum + g.directImageUrls.length, 
        0
      )
      
      if (totalImages > 0) {
        toast.success(`Found ${totalImages} images`, {
          description: `From ${data.results?.length || 0} gallery${(data.results?.length || 0) !== 1 ? 'ies' : ''}`
        })
      } else {
        toast.warning('No images found', { 
          description: 'The galleries may be empty or require different extraction method' 
        })
      }
      
    } catch (error) {
      console.error('Gallery extraction error:', error)
      toast.error('Extraction failed', { 
        description: error instanceof Error ? error.message : 'Unknown error' 
      })
    } finally {
      setIsExtracting(false)
    }
  }
  
  const handleImport = async () => {
    if (totalExtractedImages === 0) {
      toast.warning('No images to import')
      return
    }
    
    const allImageUrls = extractedGalleries.flatMap(g => g.directImageUrls)
    
    const initialStatuses: ImportStatus[] = allImageUrls.map(url => ({
      url,
      status: 'pending'
    }))
    
    setImportStatuses(initialStatuses)
    setIsImporting(true)
    abortRef.current = false
    onImportingChange?.(true)
    
    const successfulUrls: string[] = []
    
    for (let i = 0; i < allImageUrls.length; i++) {
      if (abortRef.current) break
      
      const url = allImageUrls[i]
      
      setImportStatuses(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'importing' } : s
      ))
      
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
        const resultUrl = data.url
        
        successfulUrls.push(resultUrl)
        onImagesImported([resultUrl])
        
        setImportStatuses(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'success', resultUrl } : s
        ))
        
      } catch (error) {
        setImportStatuses(prev => prev.map((s, idx) => 
          idx === i ? { 
            ...s, 
            status: 'failed', 
            error: error instanceof Error ? error.message : 'Import failed' 
          } : s
        ))
      }
    }
    
    setIsImporting(false)
    onImportingChange?.(false)
    
    if (successfulUrls.length > 0 && onSourceUrlsChange) {
      const galleryUrls = extractedGalleries.map(g => g.galleryUrl)
      const allSourceUrls = [...existingSourceUrls, ...galleryUrls, ...allImageUrls]
      const uniqueSourceUrls = [...new Set(allSourceUrls)]
      onSourceUrlsChange(uniqueSourceUrls)
    }
    
    const successCount = importStatuses.filter(s => s.status === 'success').length + successfulUrls.length
    const failCount = importStatuses.filter(s => s.status === 'failed').length
    
    if (successCount > 0) {
      toast.success(`Imported ${successCount} images`, {
        description: failCount > 0 ? `${failCount} failed` : undefined
      })
    }
  }
  
  const handleCancel = () => {
    abortRef.current = true
    toast.info('Cancelling import...', { description: 'Already imported images will be kept' })
  }
  
  const clearAll = () => {
    setSingleUrl('')
    setBulkUrls('')
    setExtractedGalleries([])
    setExtractErrors([])
    setImportStatuses([])
  }
  
  const previewImages = extractedGalleries.flatMap(g => g.directImageUrls)
  const visiblePreviews = showAllPreviews ? previewImages : previewImages.slice(0, 10)
  
  const importStats = {
    total: importStatuses.length,
    pending: importStatuses.filter(s => s.status === 'pending').length,
    importing: importStatuses.filter(s => s.status === 'importing').length,
    success: importStatuses.filter(s => s.status === 'success').length,
    failed: importStatuses.filter(s => s.status === 'failed').length
  }
  
  const importProgress = importStats.total > 0 
    ? ((importStats.success + importStats.failed) / importStats.total) * 100 
    : 0
  
  return (
    <div className="space-y-4 border border-[#333333] rounded-lg p-4 bg-[#111111]">
      <div className="flex items-center gap-2 text-[#ECAC36]">
        <FolderOpen className="h-5 w-5" />
        <h3 className="font-semibold">SmugMug Gallery Import</h3>
      </div>
      
      <p className="text-sm text-gray-400">
        Import all images from SmugMug gallery pages. This will auto-scroll and extract all photos.
      </p>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMode('single')}
          disabled={isExtracting || isImporting}
          className={mode === 'single' 
            ? "bg-[#ECAC36] text-black border-[#ECAC36] hover:bg-[#B8860B]" 
            : "bg-transparent text-gray-300 border-[#333333] hover:bg-[#222222]"
          }
        >
          Single Gallery
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMode('bulk')}
          disabled={isExtracting || isImporting}
          className={mode === 'bulk' 
            ? "bg-[#ECAC36] text-black border-[#ECAC36] hover:bg-[#B8860B]" 
            : "bg-transparent text-gray-300 border-[#333333] hover:bg-[#222222]"
          }
        >
          Bulk Galleries
        </Button>
      </div>
      
      {mode === 'single' ? (
        <div className="space-y-2">
          <Label className="text-gray-300">Gallery URL</Label>
          <Input
            value={singleUrl}
            onChange={(e) => setSingleUrl(e.target.value)}
            placeholder="https://cars-m.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus/"
            className="bg-[#0A0A0A] border-[#333333] text-white"
            disabled={isExtracting || isImporting}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-gray-300">Gallery URLs (one per line)</Label>
          <Textarea
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            placeholder="https://cars-m.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus/
https://cars-m.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/
https://cars-m.smugmug.com/AVAILABLE-CARS/Rolls-Royce-Cullinan/"
            className="bg-[#0A0A0A] border-[#333333] text-white min-h-[120px] font-mono text-sm"
            disabled={isExtracting || isImporting}
          />
          <p className="text-xs text-gray-500">
            {parseGalleryUrls().length} gallery URL{parseGalleryUrls().length !== 1 ? 's' : ''} detected
          </p>
        </div>
      )}
      
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleExtract}
          disabled={isExtracting || isImporting || parseGalleryUrls().length === 0}
          variant="outline"
          className="border-[#ECAC36] text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black"
        >
          {isExtracting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Extracting...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4 mr-2" />
              Extract Images
            </>
          )}
        </Button>
        
        {totalExtractedImages > 0 && !isImporting && (
          <Button
            onClick={handleImport}
            disabled={isExtracting}
            className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold"
          >
            <Download className="h-4 w-4 mr-2" />
            Import {totalExtractedImages} Images
          </Button>
        )}
        
        {isImporting && (
          <Button
            onClick={handleCancel}
            variant="destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
        
        {(extractedGalleries.length > 0 || extractErrors.length > 0) && !isImporting && (
          <Button
            onClick={clearAll}
            variant="ghost"
            className="text-gray-400"
          >
            Clear
          </Button>
        )}
      </div>
      
      {extractErrors.length > 0 && (
        <div className="space-y-2 border border-red-900/50 rounded-lg p-3 bg-red-950/20">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Extraction Errors</span>
          </div>
          {extractErrors.map((err, idx) => (
            <div key={idx} className="text-sm text-red-300">
              <span className="text-gray-500">{err.url}:</span> {err.error}
            </div>
          ))}
        </div>
      )}
      
      {extractedGalleries.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              Found <span className="text-[#ECAC36] font-bold">{totalExtractedImages}</span> images 
              from {extractedGalleries.length} gallery{extractedGalleries.length !== 1 ? 'ies' : ''}
            </span>
          </div>
          
          {extractedGalleries.some(g => g.warnings && g.warnings.length > 0) && (
            <div className="text-xs text-yellow-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {extractedGalleries.flatMap(g => g.warnings || []).join('; ')}
            </div>
          )}
          
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {visiblePreviews.map((url, idx) => (
              <div 
                key={idx} 
                className="aspect-square relative rounded overflow-hidden border border-[#333333] bg-[#0A0A0A]"
              >
                <Image
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </div>
            ))}
          </div>
          
          {previewImages.length > 10 && (
            <Button
              onClick={() => setShowAllPreviews(!showAllPreviews)}
              variant="ghost"
              size="sm"
              className="text-gray-400"
            >
              {showAllPreviews ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show All ({previewImages.length})
                </>
              )}
            </Button>
          )}
        </div>
      )}
      
      {importStatuses.length > 0 && (
        <div className="space-y-3 border border-[#333333] rounded-lg p-3 bg-[#0A0A0A]">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Importing: {importStats.success + importStats.failed} / {importStats.total}</span>
            <span className="flex gap-3">
              <span className="text-green-400">{importStats.success} done</span>
              {importStats.failed > 0 && <span className="text-red-400">{importStats.failed} failed</span>}
            </span>
          </div>
          <Progress value={importProgress} className="h-2" />
          
          <div className="max-h-[150px] overflow-y-auto space-y-1 text-xs">
            {importStatuses.slice(-20).map((status, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 py-0.5"
              >
                {status.status === 'pending' && <span className="text-gray-500">...</span>}
                {status.status === 'importing' && <Loader2 className="h-3 w-3 text-[#ECAC36] animate-spin" />}
                {status.status === 'success' && <CheckCircle className="h-3 w-3 text-green-500" />}
                {status.status === 'failed' && <XCircle className="h-3 w-3 text-red-500" />}
                <span className="truncate flex-1 text-gray-400">
                  {status.url.split('/').pop()}
                </span>
                {status.error && <span className="text-red-400">{status.error}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
