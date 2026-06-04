"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface GenerateDescriptionButtonProps {
  category: "car" | "yacht" | "villa"
  getFormData: () => {
    title: string
    subtitle?: string
    specifications?: Record<string, string | number | undefined>
  }
  onGenerated: (description: string) => void
}

export function GenerateDescriptionButton({
  category,
  getFormData,
  onGenerated,
}: GenerateDescriptionButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    const formData = getFormData()
    
    if (!formData.title) {
      toast.error("Please enter a title first")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/admin/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          title: formData.title,
          subtitle: formData.subtitle,
          specifications: formData.specifications,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.error || data.message || `Server error (${response.status})`
        console.error("API error:", response.status, data)
        toast.error(`Failed: ${errorMsg}`)
        return
      }
      
      if (data.description) {
        onGenerated(data.description)
        toast.success("Description generated!")
      } else {
        toast.error("No description was returned from AI")
      }
    } catch (error) {
      console.error("Error generating description:", error)
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      toast.error(`Failed to generate description: ${errorMsg}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isGenerating}
      className="border-[#ECAC36] text-[#ECAC36] hover:bg-[#ECAC36]/10 cut-corner"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate with AI
        </>
      )}
    </Button>
  )
}
