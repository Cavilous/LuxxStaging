
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState("")
  const returnTo = searchParams.get("returnTo") || "/admin"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push(returnTo)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDemoAccess() {
    setDemoLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        router.push(returnTo)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Demo access failed")
      }
    } catch (err) {
      setError("Demo access failed")
      console.error("Demo login error:", err)
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-black/60 border-[#ECAC36]/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="bg-black/40 border-[#ECAC36]/30 text-white"
                autoComplete="email"
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="bg-black/40 border-[#ECAC36]/30 text-white"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ECAC36] to-[#e6c766] text-black font-bold hover:opacity-90"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button
              type="button"
              disabled={demoLoading}
              onClick={handleDemoAccess}
              className="w-full border border-[#ECAC36]/50 bg-[#ECAC36]/10 text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black"
            >
              {demoLoading ? "Opening demo..." : "Enter Demo Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
