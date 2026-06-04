"use client"

import { Eye, Heart } from "lucide-react"
import { useEffect, useState } from "react"

interface SocialProofProps {
  itemId?: string
}

export function SocialProof({ itemId }: SocialProofProps) {
  const [viewCount, setViewCount] = useState(0)
  const [interestedCount, setInterestedCount] = useState(0)

  useEffect(() => {
    // Generate realistic view counts (12-48 views)
    setViewCount(Math.floor(Math.random() * 36) + 12)
    // Generate interested count (3-12 people)
    setInterestedCount(Math.floor(Math.random() * 9) + 3)
  }, [itemId])

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="flex items-center gap-2 text-gray-400">
        <Eye className="h-4 w-4 text-[#ECAC36]" />
        <span>
          <span className="text-white font-medium">{viewCount}</span> people viewed today
        </span>
      </div>
      <span className="text-gray-600">•</span>
      <div className="flex items-center gap-2 text-gray-400">
        <Heart className="h-4 w-4 text-[#ECAC36]" />
        <span>
          <span className="text-white font-medium">{interestedCount}</span> interested
        </span>
      </div>
    </div>
  )
}
