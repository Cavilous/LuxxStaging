import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, and, or, isNull, sql, desc } from "drizzle-orm"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ImageOff, Image as ImageIcon, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import { analyzeImages, getPrimaryImage, normalizeImageUrl } from "@/lib/media-utils"
import Image from "next/image"
import { getDemoSafeAccessibleSections, getDemoSafeCurrentUser } from "../demo-safe-admin"

interface MediaIssue {
  id: string
  title: string
  category: string
  slug: string
  issueType: 'no_images' | 'interior_primary' | 'single_image'
  imageCount: number
  primaryImage: string | null
}

export default async function MediaQualityPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string, issue?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const categoryFilter = resolvedSearchParams.category || 'all'
  const issueFilter = resolvedSearchParams.issue || 'all'

  const [currentUser, accessibleSections] = await Promise.all([
    getDemoSafeCurrentUser(),
    getDemoSafeAccessibleSections(),
  ])
  
  const conditions = []
  if (categoryFilter !== 'all') {
    conditions.push(eq(inventory.category, categoryFilter))
  }
  conditions.push(eq(inventory.isPublished, true))
  
  let items: {
    id: string
    title: string
    category: string
    slug: string | null
    images: unknown
  }[] = []

  try {
    items = await db
      .select({
        id: inventory.id,
        title: inventory.title,
        category: inventory.category,
        slug: inventory.slug,
        images: inventory.images
      })
      .from(inventory)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(inventory.createdAt))
  } catch (error) {
    console.error("Error loading media quality inventory:", error)
  }
  
  const issues: MediaIssue[] = []
  let noImagesCount = 0
  let interiorPrimaryCount = 0
  let singleImageCount = 0
  let healthyCount = 0
  
  for (const item of items) {
    const images = (item.images as unknown[]) || []
    const analysis = analyzeImages(images)
    const primaryImage = getPrimaryImage(images)
    
    if (!analysis.hasImages) {
      noImagesCount++
      issues.push({
        id: item.id,
        title: item.title,
        category: item.category,
        slug: item.slug || '',
        issueType: 'no_images',
        imageCount: 0,
        primaryImage: null
      })
    } else if (analysis.primaryIsInterior && analysis.hasExteriorImages) {
      interiorPrimaryCount++
      issues.push({
        id: item.id,
        title: item.title,
        category: item.category,
        slug: item.slug || '',
        issueType: 'interior_primary',
        imageCount: analysis.imageCount,
        primaryImage
      })
    } else if (analysis.imageCount === 1) {
      singleImageCount++
      issues.push({
        id: item.id,
        title: item.title,
        category: item.category,
        slug: item.slug || '',
        issueType: 'single_image',
        imageCount: 1,
        primaryImage
      })
    } else {
      healthyCount++
    }
  }
  
  const filteredIssues = issueFilter === 'all' 
    ? issues 
    : issues.filter(i => i.issueType === issueFilter)
  
  const getCategoryPath = (category: string) => {
    if (category === 'villa') return 'houses'
    return `${category}s`
  }
  
  return (
    <AdminLayout
      user={currentUser ? { email: currentUser.email, role: currentUser.role } : null}
      accessibleSections={accessibleSections}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Media Quality</h1>
            <p className="text-gray-400">Identify and fix image issues across inventory</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ImageOff className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{noImagesCount}</p>
                  <p className="text-sm text-red-300">No Images</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{interiorPrimaryCount}</p>
                  <p className="text-sm text-yellow-300">Interior as Primary</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{singleImageCount}</p>
                  <p className="text-sm text-blue-300">Single Image</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-900/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Check className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{healthyCount}</p>
                  <p className="text-sm text-green-300">Healthy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-charcoal border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <div className="flex flex-wrap items-center gap-4">
              <CardTitle className="text-white">Filter Issues</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Link href="/admin/media-quality">
                  <Badge variant={categoryFilter === 'all' ? 'admin-gold' : 'admin-category'} className="cursor-pointer">
                    All Categories
                  </Badge>
                </Link>
                <Link href={`/admin/media-quality?category=car${issueFilter !== 'all' ? `&issue=${issueFilter}` : ''}`}>
                  <Badge variant={categoryFilter === 'car' ? 'admin-gold' : 'admin-category'} className="cursor-pointer">
                    Cars
                  </Badge>
                </Link>
                <Link href={`/admin/media-quality?category=yacht${issueFilter !== 'all' ? `&issue=${issueFilter}` : ''}`}>
                  <Badge variant={categoryFilter === 'yacht' ? 'admin-gold' : 'admin-category'} className="cursor-pointer">
                    Yachts
                  </Badge>
                </Link>
                <Link href={`/admin/media-quality?category=villa${issueFilter !== 'all' ? `&issue=${issueFilter}` : ''}`}>
                  <Badge variant={categoryFilter === 'villa' ? 'admin-gold' : 'admin-category'} className="cursor-pointer">
                    Villas
                  </Badge>
                </Link>
              </div>
              <div className="border-l border-gray-700 pl-4 flex flex-wrap gap-2">
                <Link href={`/admin/media-quality${categoryFilter !== 'all' ? `?category=${categoryFilter}` : ''}`}>
                  <Badge variant={issueFilter === 'all' ? 'admin-gold' : 'admin-category'} className="cursor-pointer">
                    All Issues
                  </Badge>
                </Link>
                <Link href={`/admin/media-quality?issue=no_images${categoryFilter !== 'all' ? `&category=${categoryFilter}` : ''}`}>
                  <Badge variant={issueFilter === 'no_images' ? 'admin-gold' : 'admin-issue-red'} className="cursor-pointer">
                    No Images
                  </Badge>
                </Link>
                <Link href={`/admin/media-quality?issue=interior_primary${categoryFilter !== 'all' ? `&category=${categoryFilter}` : ''}`}>
                  <Badge variant={issueFilter === 'interior_primary' ? 'admin-gold' : 'admin-issue-yellow'} className="cursor-pointer">
                    Interior Primary
                  </Badge>
                </Link>
                <Link href={`/admin/media-quality?issue=single_image${categoryFilter !== 'all' ? `&category=${categoryFilter}` : ''}`}>
                  <Badge variant={issueFilter === 'single_image' ? 'admin-gold' : 'admin-issue-blue'} className="cursor-pointer">
                    Single Image
                  </Badge>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No issues found matching your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="p-4 flex items-center gap-4 hover:bg-gray-900/50">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {issue.primaryImage ? (
                        <Image
                          src={issue.primaryImage}
                          alt={issue.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{issue.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="admin-category" className="text-xs capitalize">
                          {issue.category}
                        </Badge>
                        <Badge 
                          variant={
                            issue.issueType === 'no_images' ? 'admin-issue-red' :
                            issue.issueType === 'interior_primary' ? 'admin-issue-yellow' :
                            'admin-issue-blue'
                          }
                          className="text-xs"
                        >
                          {issue.issueType === 'no_images' && 'No Images'}
                          {issue.issueType === 'interior_primary' && 'Interior as Primary'}
                          {issue.issueType === 'single_image' && `Only ${issue.imageCount} Image`}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/${getCategoryPath(issue.category)}/${issue.id}/edit?returnUrl=/admin/media-quality`}>
                        <Button size="sm" className="bg-[#ECAC36] hover:bg-[#B8860B] text-black">
                          Edit Media
                        </Button>
                      </Link>
                      {issue.slug && (
                        <Link href={`/${getCategoryPath(issue.category)}/${issue.slug}`} target="_blank">
                          <Button size="sm" variant="outline" className="border-gray-600">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
