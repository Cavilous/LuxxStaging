"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
}

export function Pagination({ currentPage, totalItems, itemsPerPage }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete("page")
    } else {
      params.set("page", page.toString())
    }
    router.push(`?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-400">
        Showing <span className="text-white font-medium">{startItem}</span> to{" "}
        <span className="text-white font-medium">{endItem}</span> of{" "}
        <span className="text-white font-medium">{totalItems}</span> items
      </p>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="bg-[#0A0A0A] border-[#333333] text-gray-400 hover:text-white disabled:opacity-50"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="bg-[#0A0A0A] border-[#333333] text-gray-400 hover:text-white disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className={
                  currentPage === pageNum
                    ? "bg-[#ECAC36] text-black hover:bg-[#B8860B]"
                    : "bg-[#0A0A0A] border-[#333333] text-gray-400 hover:text-white"
                }
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        <Button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="bg-[#0A0A0A] border-[#333333] text-gray-400 hover:text-white disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="bg-[#0A0A0A] border-[#333333] text-gray-400 hover:text-white disabled:opacity-50"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}