"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LoadMoreGridProps<T> {
  items: T[]
  initialCount?: number
  incrementCount?: number
  renderItem: (item: T, index: number) => React.ReactNode
  renderSkeleton?: () => React.ReactNode
  gridClassName?: string
  emptyState?: React.ReactNode
}

function DefaultSkeleton() {
  return (
    <div className="bg-[#0A0A0A] rounded-lg overflow-hidden">
      <div className="aspect-[3/2] bg-gray-800 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-800 rounded animate-pulse" />
        <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse" />
        <div className="h-6 bg-gray-800 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  )
}

export function LoadMoreGrid<T>({
  items,
  initialCount = 12,
  incrementCount = 8,
  renderItem,
  renderSkeleton = DefaultSkeleton,
  gridClassName = "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6",
  emptyState,
}: LoadMoreGridProps<T>) {
  const [displayCount, setDisplayCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const hasMore = displayCount < items.length
  const visibleItems = items.slice(0, displayCount)

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + incrementCount, items.length))
      setIsLoading(false)
    }, 300)
  }, [isLoading, hasMore, incrementCount, items.length])

  useEffect(() => {
    setDisplayCount(initialCount)
  }, [items, initialCount])

  useEffect(() => {
    if (!loadMoreRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { rootMargin: "200px" }
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [hasMore, isLoading, loadMore])

  if (items.length === 0) {
    return emptyState || null
  }

  return (
    <div className="space-y-8">
      <div className={gridClassName}>
        {visibleItems.map((item, index) => renderItem(item, index))}
        
        {isLoading && (
          <>
            {Array.from({ length: Math.min(incrementCount, 4) }).map((_, i) => (
              <div key={`skeleton-${i}`}>
                {renderSkeleton()}
              </div>
            ))}
          </>
        )}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center pt-4">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            className="cut-corner bg-[#ECAC36] hover:bg-[#d4992e] text-black font-semibold px-8 py-3 min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              `Load More (${items.length - displayCount} remaining)`
            )}
          </Button>
        </div>
      )}

      {!hasMore && items.length > initialCount && (
        <div className="text-center text-gray-500 text-sm pt-4">
          Showing all {items.length} items
        </div>
      )}
    </div>
  )
}
