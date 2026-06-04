import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, and, or } from "drizzle-orm"

interface InventoryItem {
  id: string
  title: string
  category: string
  slug: string | null
  subtitle: string | null
  brandSlug: string | null
  pricePerDay: number | null
  pricePer4Hr: number | null
  images: unknown
  isPublished: boolean
}

interface DuplicateGroup {
  key: string
  items: InventoryItem[]
  similarity: number
  reason: string
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function calculateSimilarity(a: string, b: string): number {
  const normA = normalizeTitle(a)
  const normB = normalizeTitle(b)
  
  if (normA === normB) return 100
  
  const wordsA = normA.split(' ')
  const wordsB = normB.split(' ')
  
  let matches = 0
  for (const word of wordsA) {
    if (wordsB.includes(word)) matches++
  }
  
  const total = Math.max(wordsA.length, wordsB.length)
  return Math.round((matches / total) * 100)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryFilter = searchParams.get('category') || 'all'
    
    const conditions = []
    if (categoryFilter !== 'all') {
      conditions.push(eq(inventory.category, categoryFilter))
    }
    
    const items = await db
      .select({
        id: inventory.id,
        title: inventory.title,
        category: inventory.category,
        slug: inventory.slug,
        subtitle: inventory.subtitle,
        brandSlug: inventory.brandSlug,
        pricePerDay: inventory.pricePerDay,
        pricePer4Hr: inventory.pricePer4Hr,
        images: inventory.images,
        isPublished: inventory.isPublished
      })
      .from(inventory)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
    
    const duplicateGroups: Map<string, DuplicateGroup> = new Map()
    
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i]
        const itemB = items[j]
        
        if (itemA.category !== itemB.category) continue
        
        const normTitleA = normalizeTitle(itemA.title)
        const normTitleB = normalizeTitle(itemB.title)
        
        let isDuplicate = false
        let similarity = 0
        let reason = ''
        
        if (normTitleA === normTitleB) {
          isDuplicate = true
          similarity = 100
          reason = 'Exact title match'
        } else if (itemA.brandSlug && itemA.brandSlug === itemB.brandSlug) {
          const titleSim = calculateSimilarity(itemA.title, itemB.title)
          if (titleSim >= 80) {
            isDuplicate = true
            similarity = titleSim
            reason = 'Same brand with similar title'
          }
        } else {
          const titleSim = calculateSimilarity(itemA.title, itemB.title)
          if (titleSim >= 90) {
            isDuplicate = true
            similarity = titleSim
            reason = 'Very similar titles'
          }
        }
        
        if (isDuplicate) {
          const key = [itemA.id, itemB.id].sort().join('-')
          
          if (!duplicateGroups.has(key)) {
            const existingGroupA = Array.from(duplicateGroups.values()).find(g => 
              g.items.some(item => item.id === itemA.id)
            )
            const existingGroupB = Array.from(duplicateGroups.values()).find(g => 
              g.items.some(item => item.id === itemB.id)
            )
            
            if (existingGroupA && !existingGroupB) {
              if (!existingGroupA.items.find(item => item.id === itemB.id)) {
                existingGroupA.items.push(itemB as InventoryItem)
              }
            } else if (existingGroupB && !existingGroupA) {
              if (!existingGroupB.items.find(item => item.id === itemA.id)) {
                existingGroupB.items.push(itemA as InventoryItem)
              }
            } else if (!existingGroupA && !existingGroupB) {
              duplicateGroups.set(key, {
                key,
                items: [itemA as InventoryItem, itemB as InventoryItem],
                similarity,
                reason
              })
            }
          }
        }
      }
    }
    
    const consolidatedGroups: DuplicateGroup[] = []
    const processedIds = new Set<string>()
    
    for (const group of duplicateGroups.values()) {
      const newItems: InventoryItem[] = []
      for (const item of group.items) {
        if (!processedIds.has(item.id)) {
          newItems.push(item)
          processedIds.add(item.id)
        }
      }
      if (newItems.length >= 2) {
        consolidatedGroups.push({
          ...group,
          items: newItems
        })
      }
    }
    
    consolidatedGroups.sort((a, b) => b.similarity - a.similarity)
    
    return NextResponse.json({ duplicates: consolidatedGroups })
  } catch (error) {
    console.error('Error fetching duplicates:', error)
    return NextResponse.json({ error: 'Failed to fetch duplicates' }, { status: 500 })
  }
}
