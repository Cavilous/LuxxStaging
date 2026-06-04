"use client"

import { useState, useCallback } from "react"
import { Upload, FileSpreadsheet, AlertCircle, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Papa from "papaparse"
import { toast } from "sonner"
import { parseCarRow, parseVillaRow, parseYachtRow } from "@/lib/import-utils"
import { 
  checkCarDuplicates, 
  checkVillaDuplicates, 
  checkYachtDuplicates,
  importCars, 
  importVillas,
  importYachts,
  type DuplicateCheck,
  type ImportResult
} from "@/lib/import-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Category = "cars" | "villas" | "yachts"
type DuplicateAction = 'skip' | 'update' | 'create'

interface ParsedRow {
  rowNumber: number
  data: any
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface DuplicateDecision {
  index: number
  action: DuplicateAction
  duplicate: DuplicateCheck
}

export function ImportClient() {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [parsedData, setParsedData] = useState<ParsedRow[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [duplicates, setDuplicates] = useState<DuplicateCheck[]>([])
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [currentDuplicateIndex, setCurrentDuplicateIndex] = useState(0)
  const [duplicateDecisions, setDuplicateDecisions] = useState<Map<number, DuplicateAction>>(new Map())
  const [applyToAllAction, setApplyToAllAction] = useState<DuplicateAction | null>(null)
  
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }, [])

  const processFile = async (uploadedFile: File) => {
    const validExtensions = ['.csv', '.tsv', '.txt']
    const fileName = uploadedFile.name.toLowerCase()
    const isValid = validExtensions.some(ext => fileName.endsWith(ext))
    
    if (!isValid) {
      toast.error("Invalid file type. Please upload CSV or TSV files.")
      return
    }

    setFile(uploadedFile)
    setIsProcessing(true)

    let detectedCategory: Category | null = null
    if (fileName.includes('car')) {
      detectedCategory = 'cars'
      setCategory('cars')
    } else if (fileName.includes('villa') || fileName.includes('house')) {
      detectedCategory = 'villas'
      setCategory('villas')
    } else if (fileName.includes('yacht') || fileName.includes('boat')) {
      detectedCategory = 'yachts'
      setCategory('yachts')
    }

    if (!detectedCategory) {
      toast.error("Could not detect category from filename. Please include 'car', 'villa', or 'yacht' in the filename.")
      setIsProcessing(false)
      return
    }

    // Auto-detect delimiter based on file extension
    const delimiter = fileName.endsWith('.csv') ? ',' : '\t'

    Papa.parse(uploadedFile, {
      delimiter,
      skipEmptyLines: true,
      complete: (results) => {
        parseData(results.data as string[][], detectedCategory!)
        setIsProcessing(false)
      },
      error: (error) => {
        toast.error(`Error parsing file: ${error.message}`)
        setIsProcessing(false)
      }
    })
  }

  const parseData = (rows: string[][], categoryToUse: Category) => {
    if (!categoryToUse) {
      toast.error("Please select a category (Cars or Villas)")
      return
    }

    const parsed: ParsedRow[] = []

    rows.forEach((row, index) => {
      const rowNumber = index + 1
      
      if (row.every(cell => !cell?.trim())) {
        return
      }

      if (categoryToUse === 'cars') {
        const result = parseCarRow(row)
        
        parsed.push({
          rowNumber,
          data: {
            brand: result.brand,
            model: result.model,
            exteriorColor: result.exteriorColor,
            interiorColor: result.interiorColor,
            pricePerDay: result.pricePerDay,
            imageUrl: result.imageUrl
          },
          isValid: result.errors.length === 0,
          errors: result.errors,
          warnings: result.warnings
        })
      } else if (categoryToUse === 'villas') {
        const result = parseVillaRow(row)
        
        parsed.push({
          rowNumber,
          data: {
            title: result.title,
            location: result.location,
            bedrooms: result.bedrooms,
            bathrooms: result.bathrooms,
            guests: result.guests,
            pricePerDay: result.pricePerDay,
            securityDeposit: result.securityDeposit,
            cleaningFee: result.cleaningFee,
            imageUrl: result.imageUrl
          },
          isValid: result.errors.length === 0,
          errors: result.errors,
          warnings: result.warnings
        })
      } else if (categoryToUse === 'yachts') {
        const result = parseYachtRow(row)
        
        parsed.push({
          rowNumber,
          data: {
            title: result.title,
            year: result.year,
            length: result.length,
            capacity: result.capacity,
            pricePer4Hr: result.pricePer4Hr,
            pricePer6Hr: result.pricePer6Hr,
            pricePer8Hr: result.pricePer8Hr,
            imageUrl: result.imageUrl
          },
          isValid: result.errors.length === 0,
          errors: result.errors,
          warnings: result.warnings
        })
      }
    })

    setParsedData(parsed)
    
    const validCount = parsed.filter(r => r.isValid).length
    const invalidCount = parsed.filter(r => !r.isValid).length
    const warningCount = parsed.filter(r => r.warnings.length > 0).length
    
    toast.success(`Parsed ${parsed.length} rows: ${validCount} valid, ${invalidCount} invalid${warningCount > 0 ? `, ${warningCount} with warnings` : ''}`)
  }

  const handleImportClick = async () => {
    const validRows = parsedData.filter(r => r.isValid)
    if (validRows.length === 0) return

    setIsImporting(true)

    try {
      if (category === 'cars') {
        const carData = validRows.map(row => ({
          brand: row.data.brand,
          model: row.data.model,
          exteriorColor: row.data.exteriorColor
        }))
        const duplicateResults = await checkCarDuplicates(carData)
        setDuplicates(duplicateResults)
        
        const hasDuplicates = duplicateResults.some(d => d.isDuplicate)
        if (hasDuplicates) {
          setCurrentDuplicateIndex(0)
          setShowDuplicateModal(true)
          setIsImporting(false)
        } else {
          await performImport()
        }
      } else if (category === 'villas') {
        const villaData = validRows.map(row => ({
          title: row.data.title
        }))
        const duplicateResults = await checkVillaDuplicates(villaData)
        setDuplicates(duplicateResults)
        
        const hasDuplicates = duplicateResults.some(d => d.isDuplicate)
        if (hasDuplicates) {
          setCurrentDuplicateIndex(0)
          setShowDuplicateModal(true)
          setIsImporting(false)
        } else {
          await performImport()
        }
      } else if (category === 'yachts') {
        const yachtData = validRows.map(row => ({
          title: row.data.title
        }))
        const duplicateResults = await checkYachtDuplicates(yachtData)
        setDuplicates(duplicateResults)
        
        const hasDuplicates = duplicateResults.some(d => d.isDuplicate)
        if (hasDuplicates) {
          setCurrentDuplicateIndex(0)
          setShowDuplicateModal(true)
          setIsImporting(false)
        } else {
          await performImport()
        }
      }
    } catch (error) {
      toast.error("Failed to check for duplicates")
      setIsImporting(false)
    }
  }

  const handleDuplicateDecision = (action: DuplicateAction, applyToAll: boolean = false) => {
    const newDecisions = new Map(duplicateDecisions)
    
    if (applyToAll) {
      setApplyToAllAction(action)
      duplicates.forEach((dup, index) => {
        if (dup.isDuplicate) {
          newDecisions.set(index, action)
        }
      })
      setDuplicateDecisions(newDecisions)
      setShowDuplicateModal(false)
      performImport(newDecisions)
    } else {
      newDecisions.set(currentDuplicateIndex, action)
      setDuplicateDecisions(newDecisions)
      
      const nextDuplicateIndex = duplicates.findIndex((dup, idx) => 
        idx > currentDuplicateIndex && dup.isDuplicate && !newDecisions.has(idx)
      )
      
      if (nextDuplicateIndex !== -1) {
        setCurrentDuplicateIndex(nextDuplicateIndex)
      } else {
        setShowDuplicateModal(false)
        performImport(newDecisions)
      }
    }
  }

  const performImport = async (decisions?: Map<number, DuplicateAction>) => {
    setIsImporting(true)
    const decisionsToUse = decisions || duplicateDecisions
    const validRows = parsedData.filter(r => r.isValid)

    try {
      if (category === 'cars') {
        const carsToImport = validRows.map((row, index) => ({
          brand: row.data.brand,
          model: row.data.model,
          exteriorColor: row.data.exteriorColor,
          interiorColor: row.data.interiorColor,
          pricePerDay: row.data.pricePerDay,
          imageUrl: row.data.imageUrl,
          duplicateAction: decisionsToUse.get(index) || (duplicates[index]?.isDuplicate ? 'skip' : undefined),
          existingId: duplicates[index]?.id
        }))
        
        const result = await importCars(carsToImport)
        setImportResult(result)
        setShowResultsModal(true)
      } else if (category === 'villas') {
        const villasToImport = validRows.map((row, index) => ({
          title: row.data.title,
          location: row.data.location,
          bedrooms: row.data.bedrooms,
          bathrooms: row.data.bathrooms,
          guests: row.data.guests,
          pricePerDay: row.data.pricePerDay,
          securityDeposit: row.data.securityDeposit,
          cleaningFee: row.data.cleaningFee,
          imageUrl: row.data.imageUrl,
          duplicateAction: decisionsToUse.get(index) || (duplicates[index]?.isDuplicate ? 'skip' : undefined),
          existingId: duplicates[index]?.id
        }))
        
        const result = await importVillas(villasToImport)
        setImportResult(result)
        setShowResultsModal(true)
      } else if (category === 'yachts') {
        const yachtsToImport = validRows.map((row, index) => ({
          title: row.data.title,
          year: row.data.year,
          length: row.data.length,
          capacity: row.data.capacity,
          pricePer4Hr: row.data.pricePer4Hr,
          pricePer6Hr: row.data.pricePer6Hr,
          pricePer8Hr: row.data.pricePer8Hr,
          imageUrl: row.data.imageUrl,
          duplicateAction: decisionsToUse.get(index) || (duplicates[index]?.isDuplicate ? 'skip' : undefined),
          existingId: duplicates[index]?.id
        }))
        
        const result = await importYachts(yachtsToImport)
        setImportResult(result)
        setShowResultsModal(true)
      }
    } catch (error) {
      toast.error("Import failed: " + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsImporting(false)
    }
  }

  const resetImport = () => {
    setFile(null)
    setCategory(null)
    setParsedData([])
    setDuplicates([])
    setDuplicateDecisions(new Map())
    setApplyToAllAction(null)
    setImportResult(null)
  }

  const validRows = parsedData.filter(r => r.isValid)
  const invalidRows = parsedData.filter(r => !r.isValid)
  const currentDuplicate = duplicates[currentDuplicateIndex]

  return (
    <div className="space-y-6">
      {!file && (
        <div className="bg-[#0A0A0A] border border-[#333333] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Select Category</h2>
          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={() => setCategory('cars')}
              variant={category === 'cars' ? 'default' : 'outline'}
              className="flex-1"
            >
              Cars
            </Button>
            <Button
              onClick={() => setCategory('yachts')}
              variant={category === 'yachts' ? 'default' : 'outline'}
              className="flex-1"
            >
              Yachts
            </Button>
            <Button
              onClick={() => setCategory('villas')}
              variant={category === 'villas' ? 'default' : 'outline'}
              className="flex-1"
            >
              Villas
            </Button>
          </div>
        </div>
      )}

      {category && !file && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            bg-[#0A0A0A] border-2 border-dashed rounded-lg p-12
            transition-colors duration-200
            ${isDragging ? 'border-[#ECAC36] bg-[#ECAC36]/5' : 'border-[#333333]'}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Drop your file here or click to browse
            </h3>
            <p className="text-gray-400 mb-4">
              Supports CSV (comma-separated) and TSV (tab-separated) files
            </p>
            <input
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>Select File</span>
              </Button>
            </label>
          </div>
        </div>
      )}

      {file && (
        <div className="bg-[#0A0A0A] border border-[#333333] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-[#ECAC36]" />
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {category === 'cars' ? 'Cars Import' : 'Villas Import'}
                </p>
              </div>
            </div>
            <Button onClick={resetImport} variant="outline" size="sm">
              Change File
            </Button>
          </div>

          {category === 'cars' && (
            <div className="bg-[#1A1A1A] rounded p-4 text-sm">
              <p className="text-gray-400 mb-2">Expected format (CSV or TSV):</p>
              <p className="font-mono text-[#ECAC36]">
                Brand, Model, Color, Price, Image URL
              </p>
            </div>
          )}

          {category === 'villas' && (
            <div className="bg-[#1A1A1A] rounded p-4 text-sm">
              <p className="text-gray-400 mb-2">Expected format (CSV or TSV):</p>
              <p className="font-mono text-[#ECAC36]">
                Title, Location, Property Info, Price, Security Deposit, Cleaning Fee, Image URL
              </p>
            </div>
          )}
        </div>
      )}

      {parsedData.length > 0 && (
        <div className="bg-[#0A0A0A] border border-[#333333] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Import Preview</h2>
          
          <div className="flex gap-4 mb-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded px-4 py-2">
              <p className="text-sm text-gray-400">Valid</p>
              <p className="text-2xl font-bold text-green-500">{validRows.length}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded px-4 py-2">
              <p className="text-sm text-gray-400">Invalid</p>
              <p className="text-2xl font-bold text-red-500">{invalidRows.length}</p>
            </div>
          </div>

          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#333333]">
                <tr>
                  <th className="text-left py-2 px-3 text-gray-400">Row</th>
                  <th className="text-left py-2 px-3 text-gray-400">Data</th>
                  <th className="text-left py-2 px-3 text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 50).map((row) => (
                  <tr key={row.rowNumber} className="border-b border-[#1A1A1A]">
                    <td className="py-2 px-3 text-gray-400">{row.rowNumber}</td>
                    <td className="py-2 px-3 text-white text-xs">
                      {category === 'cars' && (
                        <span>{row.data.brand} {row.data.model}</span>
                      )}
                      {category === 'villas' && (
                        <span>{row.data.title}</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {row.isValid ? (
                        <span className="text-green-500">✓ Valid</span>
                      ) : (
                        <span className="text-red-500 text-xs">
                          {row.errors.join(', ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {parsedData.length > 50 && (
            <p className="text-sm text-gray-400 mt-2">
              Showing first 50 rows of {parsedData.length}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <Button 
              onClick={handleImportClick} 
              disabled={validRows.length === 0 || isImporting}
              className="bg-[#ECAC36] hover:bg-[#B8941C]"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Import {validRows.length} Valid {validRows.length === 1 ? 'Item' : 'Items'}</>
              )}
            </Button>
            <Button onClick={resetImport} variant="outline" disabled={isImporting}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
        <DialogContent className="bg-[#0A0A0A] border-[#333333] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Duplicate Found
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              This item already exists in the database. How would you like to proceed?
            </DialogDescription>
          </DialogHeader>

          {currentDuplicate && (
            <div className="bg-[#1A1A1A] rounded-lg p-4 space-y-2">
              <div>
                <p className="text-sm text-gray-400">Title</p>
                <p className="text-white font-medium">{currentDuplicate.title}</p>
              </div>
              {currentDuplicate.subtitle && (
                <div>
                  <p className="text-sm text-gray-400">Subtitle</p>
                  <p className="text-white">{currentDuplicate.subtitle}</p>
                </div>
              )}
              <div className="pt-2 border-t border-[#333333]">
                <p className="text-xs text-gray-500">
                  Item {currentDuplicateIndex + 1} of {duplicates.filter(d => d.isDuplicate).length} duplicates
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <div className="flex gap-2 w-full">
              <Button
                onClick={() => handleDuplicateDecision('skip', false)}
                variant="outline"
                className="flex-1"
              >
                Skip
              </Button>
              <Button
                onClick={() => handleDuplicateDecision('update', false)}
                variant="outline"
                className="flex-1"
              >
                Update
              </Button>
              <Button
                onClick={() => handleDuplicateDecision('create', false)}
                variant="outline"
                className="flex-1"
              >
                Create New
              </Button>
            </div>
            <Button
              onClick={() => handleDuplicateDecision('skip', true)}
              variant="secondary"
              className="w-full bg-[#ECAC36] hover:bg-[#B8941C] text-black"
            >
              Apply "Skip" to All Duplicates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="bg-[#0A0A0A] border-[#333333] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Import Complete
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Here's a summary of your import operation
            </DialogDescription>
          </DialogHeader>

          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-2xl font-bold text-green-500">{importResult.created}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Updated</p>
                  <p className="text-2xl font-bold text-blue-500">{importResult.updated}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Skipped</p>
                  <p className="text-2xl font-bold text-yellow-500">{importResult.skipped}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Failed</p>
                  <p className="text-2xl font-bold text-red-500">{importResult.failed}</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Errors ({importResult.errors.length})
                  </h4>
                  <div className="max-h-48 overflow-auto space-y-2">
                    {importResult.errors.map((error, idx) => (
                      <div key={idx} className="text-sm text-gray-300 bg-[#1A1A1A] p-2 rounded">
                        <span className="text-red-400">Row {error.row}:</span> {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setShowResultsModal(false)
                resetImport()
              }}
              className="bg-[#ECAC36] hover:bg-[#B8941C] text-black"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
