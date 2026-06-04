"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchFilterBarProps {
  placeholder?: string
  filterSlot?: React.ReactNode
}

export function SearchFilterBar({ placeholder = "Search...", filterSlot }: SearchFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "")

  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("q", value)
      } else {
        params.delete("q")
      }
      params.delete("page")
      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== (searchParams.get("q") || "")) {
        updateSearch(searchValue)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, searchParams, updateSearch])

  const hasActiveFilters = Array.from(searchParams.entries()).some(
    ([key]) => key !== "page" && key !== "q"
  )

  const clearAllFilters = () => {
    router.push(window.location.pathname)
    setSearchValue("")
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 bg-[#0A0A0A] border-[#333333] text-white"
        />
      </div>
      {filterSlot}
      {hasActiveFilters && (
        <Button
          onClick={clearAllFilters}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
