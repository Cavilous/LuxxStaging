"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { importCarsFromCSV } from "@/lib/import-actions"

interface ImportResult {
  success: boolean
  created: number
  updated: number
  skipped: number
  failed: number
  errors: { row: number; message: string }[]
}

export function ImportCarsClient() {
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
      setResult(null)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile)
      setResult(null)
    } else {
      alert('Please drop a valid CSV file')
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsImporting(true)
    setProgress("Reading CSV file...")
    setResult(null)

    try {
      const text = await file.text()
      setProgress("Parsing car data and fetching images...")
      
      const result = await importCarsFromCSV(text)
      
      setResult(result)
      setProgress("")
    } catch (error) {
      console.error('Import error:', error)
      setResult({
        success: false,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 1,
        errors: [{ row: 0, message: error instanceof Error ? error.message : 'Unknown error' }]
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* CSV Format Guide */}
      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-[#ECAC36]" />
            CSV Format
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-400 space-y-2">
          <p>Your CSV should have the following columns:</p>
          <div className="bg-[#0A0A0A] p-4 cut-corner font-mono text-sm">
            Make, Model, Color, Price, Image Links
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Make:</strong> Brand name (e.g., Lamborghini, Ferrari)</li>
            <li><strong>Model:</strong> Model name (e.g., Urus, 488 Spider)</li>
            <li><strong>Color:</strong> Exterior / Interior (e.g., "Black / Red")</li>
            <li><strong>Price:</strong> Daily rental price (e.g., 1095 or "price upon request")</li>
            <li><strong>Image Links:</strong> SmugMug gallery URL</li>
          </ul>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="bg-[#111111] border-[#333333] cut-corner">
        <CardHeader>
          <CardTitle className="text-white">Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed cut-corner p-12 text-center ${
              file ? 'border-[#ECAC36] bg-[#ECAC36]/5' : 'border-[#333333] hover:border-[#ECAC36]/50'
            } transition-colors cursor-pointer`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {file ? (
              <div className="space-y-4">
                <CheckCircle2 className="h-16 w-16 text-[#ECAC36] mx-auto" />
                <div>
                  <p className="text-white font-semibold text-lg">{file.name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setResult(null)
                  }}
                  variant="outline"
                  className="border-[#333333] text-white hover:bg-[#0A0A0A]"
                >
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-16 w-16 text-gray-500 mx-auto" />
                <div>
                  <p className="text-white font-semibold text-lg">Drop CSV file here</p>
                  <p className="text-gray-400 text-sm mt-1">or click to browse</p>
                </div>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleImport}
                disabled={isImporting}
                className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner flex-1"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Cars
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Progress */}
          {isImporting && progress && (
            <div className="mt-4 p-4 bg-[#0A0A0A] cut-corner">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#ECAC36]" />
                {progress}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Import {result.success ? 'Completed' : 'Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0A0A0A] p-4 cut-corner">
                <p className="text-gray-400 text-sm">Created</p>
                <p className="text-2xl font-bold text-green-500">{result.created}</p>
              </div>
              <div className="bg-[#0A0A0A] p-4 cut-corner">
                <p className="text-gray-400 text-sm">Updated</p>
                <p className="text-2xl font-bold text-blue-500">{result.updated}</p>
              </div>
              <div className="bg-[#0A0A0A] p-4 cut-corner">
                <p className="text-gray-400 text-sm">Skipped</p>
                <p className="text-2xl font-bold text-yellow-500">{result.skipped}</p>
              </div>
              <div className="bg-[#0A0A0A] p-4 cut-corner">
                <p className="text-gray-400 text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-500">{result.failed}</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/50 cut-corner p-4">
                <p className="text-red-400 font-semibold flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4" />
                  Errors Encountered
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.errors.map((error, idx) => (
                    <div key={idx} className="text-sm text-gray-300">
                      <span className="text-red-400">Row {error.row}:</span> {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Link href="/admin/cars" className="flex-1">
                <Button className="w-full bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                  View Cars
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setFile(null)
                  setResult(null)
                  setProgress("")
                }}
                variant="outline"
                className="border-[#333333] text-white hover:bg-[#0A0A0A]"
              >
                Import Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
