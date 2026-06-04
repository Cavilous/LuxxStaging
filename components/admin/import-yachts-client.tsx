"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { importYachtsFromCSV } from "@/lib/import-actions"

interface ImportResult {
  success: boolean
  created: number
  updated: number
  skipped: number
  failed: number
  errors: { row: number; message: string }[]
}

export function ImportYachtsClient() {
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
      setProgress("Parsing yacht data and fetching images...")
      
      const result = await importYachtsFromCSV(text)
      
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
            Title, Specs, 4hr Price, 6hr Price, 8hr Price, Image Links
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Title:</strong> Yacht name (e.g., "Ocean Dream")</li>
            <li><strong>Specs:</strong> Year, length, capacity (e.g., "2020 | 77ft | 13 guests")</li>
            <li><strong>4hr Price:</strong> 4-hour package price (e.g., 3500)</li>
            <li><strong>6hr Price:</strong> 6-hour package price (e.g., 4500)</li>
            <li><strong>8hr Price:</strong> 8-hour package price (e.g., 5500)</li>
            <li><strong>Image Links:</strong> SmugMug gallery URL or Google Drive folder URL</li>
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
            <Upload className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            {file ? (
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-white mb-2">Drop your CSV file here or click to browse</p>
                <p className="text-gray-400 text-sm">Supports .csv files only</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {file && !result && (
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleImport}
                disabled={isImporting}
                className="flex-1 bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  'Start Import'
                )}
              </Button>
              <Button
                onClick={() => setFile(null)}
                variant="outline"
                disabled={isImporting}
                className="border-[#333333] text-gray-400 hover:bg-[#333333]/50 cut-corner"
              >
                Cancel
              </Button>
            </div>
          )}

          {progress && (
            <div className="mt-4 p-3 bg-[#0A0A0A] cut-corner flex items-center gap-2 text-gray-300">
              <Loader2 className="h-4 w-4 animate-spin text-[#ECAC36]" />
              {progress}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {result.success && result.failed === 0 ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0A0A0A] p-4 cut-corner">
                <div className="text-2xl font-bold text-green-500">{result.created}</div>
                <div className="text-gray-400 text-sm">Created</div>
              </div>
              <div className="bg-[#0A0A0A] p-4 cut-corner">
                <div className="text-2xl font-bold text-blue-500">{result.updated}</div>
                <div className="text-gray-400 text-sm">Updated</div>
              </div>
              <div className="bg-[#0A0A0A] p-4 cut-corner">
                <div className="text-2xl font-bold text-yellow-500">{result.skipped}</div>
                <div className="text-gray-400 text-sm">Skipped</div>
              </div>
              <div className="bg-[#0A0A0A] p-4 cut-corner">
                <div className="text-2xl font-bold text-red-500">{result.failed}</div>
                <div className="text-gray-400 text-sm">Failed</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-red-400 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Errors ({result.errors.length})
                </h4>
                <div className="bg-[#0A0A0A] p-4 cut-corner max-h-64 overflow-y-auto">
                  {result.errors.map((error, idx) => (
                    <div key={idx} className="text-sm text-gray-300 mb-2">
                      <span className="text-red-400">Row {error.row}:</span> {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Link href="/admin/yachts" className="flex-1">
                <Button className="w-full bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                  View Yachts
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setFile(null)
                  setResult(null)
                }}
                variant="outline"
                className="flex-1 border-[#333333] text-gray-400 hover:bg-[#333333]/50 cut-corner"
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
