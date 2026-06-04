"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX, Loader2, Eye, EyeOff } from "lucide-react"
import { updateAdminUser, deleteAdminUser, toggleUserStatus } from "@/lib/user-actions"
import { toast } from "sonner"

interface UserActionsProps {
  user: {
    id: string
    name: string | null
    email: string
    role: string
    isActive: boolean
  }
  isCurrentUser?: boolean
}

export function UserActions({ user, isCurrentUser = false }: UserActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    password: "",
    role: user.role,
  })

  const handleUpdate = () => {
    if (!formData.email) {
      toast.error("Email is required")
      return
    }

    if (formData.password && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    const submitData = new FormData()
    submitData.set("name", formData.name)
    submitData.set("email", formData.email)
    if (formData.password) submitData.set("password", formData.password)
    submitData.set("role", formData.role)

    startTransition(async () => {
      const result = await updateAdminUser(user.id, submitData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("User updated successfully")
        setEditOpen(false)
        router.refresh()
      }
    })
  }

  const handleDelete = () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }

    startTransition(async () => {
      const result = await deleteAdminUser(user.id, true)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("User deleted successfully")
        router.refresh()
      }
      setDeleteConfirm(false)
    })
  }

  const handleToggleStatus = () => {
    startTransition(async () => {
      const result = await toggleUserStatus(user.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`User ${user.isActive ? "deactivated" : "activated"} successfully`)
        router.refresh()
      }
    })
  }

  return (
    <>
      <div className="flex items-center justify-end space-x-2">
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white"
          onClick={() => setEditOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isPending}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#333]">
            {!isCurrentUser && (
              <DropdownMenuItem onClick={handleToggleStatus} className="text-white hover:bg-[#333]">
                {user.isActive ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
            )}
            {isCurrentUser && (
              <DropdownMenuItem disabled className="text-gray-500">
                <UserX className="mr-2 h-4 w-4" />
                Cannot modify own status
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#333]" />
            {!isCurrentUser ? (
              <DropdownMenuItem
                onClick={handleDelete}
                className={deleteConfirm ? "text-red-400 bg-red-500/20" : "text-red-400 hover:bg-red-500/20"}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteConfirm ? "Click again to confirm" : "Delete User"}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled className="text-gray-500">
                <Trash2 className="mr-2 h-4 w-4" />
                Cannot delete own account
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#111111] border-[#333333] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update user details. Leave password blank to keep current password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-300">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#222] border-[#333] text-white cut-corner"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label className="text-gray-300">Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#222] border-[#333] text-white cut-corner"
                placeholder="john@luxxmiami.com"
              />
            </div>
            <div>
              <Label className="text-gray-300">New Password (optional)</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-[#222] border-[#333] text-white cut-corner pr-10"
                  placeholder="Leave blank to keep current"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Role {isCurrentUser && <span className="text-gray-500">(cannot change own role)</span>}</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                disabled={isCurrentUser}
              >
                <SelectTrigger className={`bg-[#222] border-[#333] text-white cut-corner ${isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#222] border-[#333]">
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="border-[#333] text-gray-300 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isPending}
              className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-semibold"
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
