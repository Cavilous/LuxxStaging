"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Eye, EyeOff, Trash2 } from "lucide-react"
import { updateAssetStatus, deleteForSaleAsset } from "@/lib/for-sale-actions"
import { toast } from "sonner"
import Link from "next/link"

interface ForSaleActionsProps {
  assetId: string
  assetStatus: string
}

export function ForSaleActions({ assetId, assetStatus }: ForSaleActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const router = useRouter()

  const handleStatusToggle = () => {
    const newStatus = assetStatus === "Live" ? "Draft" : "Live"
    startTransition(async () => {
      const result = await updateAssetStatus(assetId, newStatus)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Asset ${newStatus === "Live" ? "published" : "unpublished"}`)
        router.refresh()
      }
    })
  }

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    startTransition(async () => {
      const result = await deleteForSaleAsset(assetId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Asset deleted successfully")
        router.refresh()
      }
      setConfirmDelete(false)
    })
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      <Link href={`/admin/for-sale/${assetId}/edit`}>
        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#333]">
          <DropdownMenuItem onClick={handleStatusToggle} className="text-white hover:bg-[#333]">
            {assetStatus === "Live" ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDelete} 
            className={confirmDelete ? "text-red-400 bg-red-500/20" : "text-red-400 hover:bg-red-500/20"}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {confirmDelete ? "Click again to confirm" : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
