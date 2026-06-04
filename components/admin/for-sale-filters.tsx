"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useTransition, useRef, useCallback } from "react"

export function ForSaleFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const updateFilter = useCallback((key: string, value: string, debounce = false) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    const navigate = () => {
      startTransition(() => {
        router.push(`/admin/for-sale?${params.toString()}`)
      })
    }

    if (debounce) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(navigate, 300)
    } else {
      navigate()
    }
  }, [searchParams, router])

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search assets..."
          defaultValue={searchParams.get("q") || ""}
          onChange={(e) => updateFilter("q", e.target.value, true)}
          className="pl-10 bg-[#1a1a1a] border-[#333] text-white cut-corner"
        />
      </div>
      <Select 
        defaultValue={searchParams.get("category") || "all"} 
        onValueChange={(value) => updateFilter("category", value)}
      >
        <SelectTrigger className="w-full lg:w-48 bg-[#1a1a1a] border-[#333] text-white cut-corner">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] border-[#333]">
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="car">Cars</SelectItem>
          <SelectItem value="yacht">Yachts</SelectItem>
          <SelectItem value="villa">Villas</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        defaultValue={searchParams.get("status") || "all"} 
        onValueChange={(value) => updateFilter("status", value)}
      >
        <SelectTrigger className="w-full lg:w-48 bg-[#1a1a1a] border-[#333] text-white cut-corner">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] border-[#333]">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Live">Live</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="UnderOffer">Under Offer</SelectItem>
          <SelectItem value="Sold">Sold</SelectItem>
        </SelectContent>
      </Select>
      <Select 
        defaultValue={searchParams.get("managed") || "all"} 
        onValueChange={(value) => updateFilter("managed", value)}
      >
        <SelectTrigger className="w-full lg:w-48 bg-[#1a1a1a] border-[#333] text-white cut-corner">
          <SelectValue placeholder="Managed Price" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] border-[#333]">
          <SelectItem value="all">All Assets</SelectItem>
          <SelectItem value="yes">Has Managed Price</SelectItem>
          <SelectItem value="no">No Managed Price</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
