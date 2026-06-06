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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2, Eye, EyeOff } from "lucide-react"
import { createAdminUser } from "@/lib/user-actions"
import { ADMIN_ROLE_OPTIONS } from "@/lib/auth-utils"
import { toast } from "sonner"

export function AddUserDialog() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ops",
  })
  const selectedRole = ADMIN_ROLE_OPTIONS.find((role) => role.value === formData.role)

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    const submitData = new FormData()
    submitData.set("name", formData.name)
    submitData.set("email", formData.email)
    submitData.set("password", formData.password)
    submitData.set("role", formData.role)

    startTransition(async () => {
      const result = await createAdminUser(submitData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("User created successfully")
        setFormData({ name: "", email: "", password: "", role: "ops" })
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111111] border-[#333333] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add Team User</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a team member account with login credentials and role-based dashboard access.
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
            <Label className="text-gray-300">Password *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-[#222] border-[#333] text-white cut-corner pr-10"
                placeholder="Min 8 characters"
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
            <Label className="text-gray-300">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="bg-[#222] border-[#333] text-white cut-corner">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#222] border-[#333]">
                {ADMIN_ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole && (
              <p className="mt-2 text-xs text-gray-500">{selectedRole.description}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-[#333] text-gray-300 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-semibold"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
