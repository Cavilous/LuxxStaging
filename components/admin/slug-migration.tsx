"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { migrateMissingSlugs, fixDoubleEncodedJSON } from "@/lib/import-actions"

export function SlugMigration() {
  const [isRunningSlugs, setIsRunningSlugs] = useState(false)
  const [isRunningJSON, setIsRunningJSON] = useState(false)
  const [slugResult, setSlugResult] = useState<{
    success: boolean
    updated: number
    errors: string[]
  } | null>(null)
  const [jsonResult, setJsonResult] = useState<{
    success: boolean
    updated: number
    errors: string[]
  } | null>(null)

  const runSlugMigration = async () => {
    setIsRunningSlugs(true)
    setSlugResult(null)
    
    try {
      const migrationResult = await migrateMissingSlugs()
      setSlugResult(migrationResult)
    } catch (error) {
      setSlugResult({
        success: false,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsRunningSlugs(false)
    }
  }

  const runJSONMigration = async () => {
    setIsRunningJSON(true)
    setJsonResult(null)
    
    try {
      const migrationResult = await fixDoubleEncodedJSON()
      setJsonResult(migrationResult)
    } catch (error) {
      setJsonResult({
        success: false,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsRunningJSON(false)
    }
  }

  return (
    <Card className="bg-[#111111] border-[#333333] cut-corner">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wrench className="h-5 w-5 text-[#ECAC36]" />
          Data Migration Tools
        </CardTitle>
        <CardDescription className="text-gray-400">
          Fix common issues with imported data (slugs, images, specifications)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Slug Migration */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">1. Fix Missing Slugs</h3>
            <Button
              onClick={runSlugMigration}
              disabled={isRunningSlugs}
              className="bg-[#ECAC36] text-black hover:bg-[#ECAC36]/90"
            >
              {isRunningSlugs ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Wrench className="h-4 w-4 mr-2" />
                  Generate Missing Slugs
                </>
              )}
            </Button>

            {slugResult && (
              <div className={`p-4 rounded-lg border ${
                slugResult.success 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-start gap-2">
                  {slugResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">
                      {slugResult.success ? 'Slug Migration Complete' : 'Slug Migration Failed'}
                    </p>
                    <p className="text-sm text-gray-300">
                      Updated {slugResult.updated} items
                    </p>
                    {slugResult.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-red-400 mb-1">Errors:</p>
                        <ul className="text-xs text-gray-400 space-y-1">
                          {slugResult.errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* JSON Migration */}
          <div className="space-y-3 pt-4 border-t border-[#333333]">
            <h3 className="text-sm font-medium text-white">2. Fix Images & Specifications</h3>
            <Button
              onClick={runJSONMigration}
              disabled={isRunningJSON}
              className="bg-[#ECAC36] text-black hover:bg-[#ECAC36]/90"
            >
              {isRunningJSON ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Wrench className="h-4 w-4 mr-2" />
                  Fix Double-Encoded JSON
                </>
              )}
            </Button>

            {jsonResult && (
              <div className={`p-4 rounded-lg border ${
                jsonResult.success 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-start gap-2">
                  {jsonResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">
                      {jsonResult.success ? 'JSON Fix Complete' : 'JSON Fix Failed'}
                    </p>
                    <p className="text-sm text-gray-300">
                      Fixed {jsonResult.updated} items with encoding issues
                    </p>
                    {jsonResult.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-red-400 mb-1">Errors:</p>
                        <ul className="text-xs text-gray-400 space-y-1">
                          {jsonResult.errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#333333]">
            <p className="text-xs text-gray-500">
              💡 <strong>When to use:</strong>
            </p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1">
              <li>• <strong>Missing Slugs:</strong> If detail pages return 404 errors</li>
              <li>• <strong>Images/Specs:</strong> If detail pages show no images or missing specs</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
