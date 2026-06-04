"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, MoveUp, MoveDown } from "lucide-react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addToHomePageSection, removeFromHomePageSection, moveHomePageSectionItem } from "@/lib/homepage-actions"

interface SectionItem {
  id: string
  section: string
  inventoryId: string
  displayOrder: number
  title: string
  category: string
  images: unknown
}

interface InventoryItem {
  id: string
  title: string
  category: string
  subtitle: string | null
  images: unknown
}

interface Props {
  section: string
  sectionTitle: string
  currentItems: SectionItem[]
  allInventory: InventoryItem[]
}

export function HomePageSectionManager({ section, sectionTitle, currentItems, allInventory }: Props) {
  const [selectedInventoryId, setSelectedInventoryId] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const currentInventoryIds = new Set(currentItems.map(item => item.inventoryId))
  const availableInventory = allInventory.filter(item => !currentInventoryIds.has(item.id))

  const handleAdd = async () => {
    if (!selectedInventoryId) return
    setIsAdding(true)
    try {
      await addToHomePageSection(section, selectedInventoryId)
      setSelectedInventoryId("")
      window.location.reload()
    } catch (error) {
      console.error("Error adding item:", error)
    }  finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (sectionId: string) => {
    try {
      await removeFromHomePageSection(sectionId)
      window.location.reload()
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const handleMove = async (sectionId: string, direction: "up" | "down") => {
    try {
      await moveHomePageSectionItem(sectionId, direction)
      window.location.reload()
    } catch (error) {
      console.error("Error moving item:", error)
    }
  }

  return (
    <div className="space-y-4">
      {currentItems.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No items selected for this section. Add items below.
        </div>
      )}

      <div className="space-y-2">
        {currentItems.map((item, index) => {
          const imageUrl = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : "/placeholder.svg"
          
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 bg-black/30 rounded-lg border border-[#444444]"
            >
              <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                <Image
                  src={imageUrl as string}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{item.title}</p>
                <p className="text-sm text-gray-400">Order: {index + 1}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMove(item.id, "up")}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-white"
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMove(item.id, "down")}
                  disabled={index === currentItems.length - 1}
                  className="text-gray-400 hover:text-white"
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {availableInventory.length > 0 && (
        <div className="flex gap-2 pt-4 border-t border-[#333333]">
          <Select value={selectedInventoryId} onValueChange={setSelectedInventoryId}>
            <SelectTrigger className="flex-1 bg-black border-[#444444] text-white">
              <SelectValue placeholder="Select item to add..." />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] border-[#444444]">
              {availableInventory.map((item) => (
                <SelectItem key={item.id} value={item.id} className="text-white hover:bg-[#222222]">
                  {item.title} {item.subtitle ? `- ${item.subtitle}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAdd}
            disabled={!selectedInventoryId || isAdding}
            className="bg-[#ECAC36] hover:bg-[#B8941F] text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      )}

      {availableInventory.length === 0 && currentItems.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm border-t border-[#333333]">
          All available items have been added to this section
        </div>
      )}
    </div>
  )
}
