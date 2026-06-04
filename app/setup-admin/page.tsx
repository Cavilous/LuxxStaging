"use client"

import { useState } from "react"

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSetup = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup-admin", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`✅ Success: ${data.message}`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Setup Super Admin</h1>
          <p className="text-gray-400">Create the super admin user for the CMS</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSetup}
            disabled={loading}
            className="w-full bg-[#ECAC36] text-black font-semibold py-3 px-4 hover:bg-[#B8941C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            }}
          >
            {loading ? "Creating Admin User..." : "Create Super Admin User"}
          </button>

          {result && (
            <div className="p-4 bg-gray-900 border border-gray-700 text-white text-sm whitespace-pre-wrap">
              {result}
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Email: luxxmiami@alhmedia.com</p>
          <p>Password: LuxxMiami2024!</p>
        </div>
      </div>
    </div>
  )
}
