"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SortableHeaderProps {
  column: string
  label: string
}

export function SortableHeader({ column, label }: SortableHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sort")
  const currentOrder = searchParams.get("order")

  const isActive = currentSort === column
  const isAsc = isActive && currentOrder === "asc"
  const isDesc = isActive && currentOrder === "desc"

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (!isActive) {
      params.set("sort", column)
      params.set("order", "asc")
    } else if (isAsc) {
      params.set("order", "desc")
    } else {
      params.delete("sort")
      params.delete("order")
    }
    
    router.push(`?${params.toString()}`)
  }

  return (
    <Button
      onClick={handleSort}
      variant="ghost"
      className="px-0 hover:bg-transparent text-gray-300 hover:text-white font-medium"
    >
      {label}
      {!isActive && <ArrowUpDown className="ml-2 h-4 w-4 text-gray-600" />}
      {isAsc && <ArrowUp className="ml-2 h-4 w-4 text-[#ECAC36]" />}
      {isDesc && <ArrowDown className="ml-2 h-4 w-4 text-[#ECAC36]" />}
    </Button>
  )
}
