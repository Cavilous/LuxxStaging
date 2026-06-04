"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FilterOption {
  label: string
  value: string
}

interface FilterSelectProps {
  paramKey: string
  label: string
  options: FilterOption[]
}

export function FilterSelect({ paramKey, label, options }: FilterSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentValue = searchParams.get(paramKey)

  const updateFilter = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(paramKey, value)
    } else {
      params.delete(paramKey)
    }
    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  const selectedOption = options.find(opt => opt.value === currentValue)
  const displayLabel = selectedOption ? selectedOption.label : label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-[#0A0A0A] border-[#333333] text-white hover:bg-[#222222] cut-corner">
          {displayLabel}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#111111] border-[#333333] text-white">
        <DropdownMenuItem
          onClick={() => updateFilter(null)}
          className="hover:bg-[#222222] cursor-pointer"
        >
          {label}
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => updateFilter(option.value)}
            className={`hover:bg-[#222222] cursor-pointer ${currentValue === option.value ? "bg-[#ECAC36]/20 text-[#ECAC36]" : ""}`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}