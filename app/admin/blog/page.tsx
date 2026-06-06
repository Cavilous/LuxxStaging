import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Edit, Trash2, Eye, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { desc, asc, and, or, ilike, sql, eq } from "drizzle-orm"
import { SearchFilterBar } from "@/components/admin/search-filter-bar"
import { FilterSelect } from "@/components/admin/filter-select"
import { Pagination } from "@/components/admin/pagination"
import { deleteBlogPost } from "@/lib/blog-actions"
import { getDemoSafeAccessibleSections, getDemoSafeCurrentUser } from "../demo-safe-admin"

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string, status?: string, category?: string, page?: string, sort?: string, order?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const { q, status, category } = resolvedSearchParams
  const page = Number(resolvedSearchParams.page) || 1
  const itemsPerPage = 20
  const sortColumn = resolvedSearchParams.sort || null
  const sortOrder = (resolvedSearchParams.order as 'asc' | 'desc') || 'desc'

  const conditions: any[] = []

  if (q) {
    conditions.push(
      or(
        ilike(blogPosts.title, `%${q}%`),
        ilike(blogPosts.excerpt, `%${q}%`)
      )!
    )
  }

  if (status === "published") {
    conditions.push(eq(blogPosts.isPublished, true))
  } else if (status === "draft") {
    conditions.push(eq(blogPosts.isPublished, false))
  }

  if (category) {
    conditions.push(eq(blogPosts.category, category))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [currentUser, accessibleSections] = await Promise.all([
    getDemoSafeCurrentUser(),
    getDemoSafeAccessibleSections(),
  ])

  let totalCount = 0
  let posts: any[] = []
  let categories: { category: string | null }[] = []

  try {
    const [totalCountResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(blogPosts)
      .where(whereClause)
    totalCount = totalCountResult?.count || 0

    posts = await db
      .select()
      .from(blogPosts)
      .where(whereClause)
      .orderBy(
        sortColumn === "title" ? (sortOrder === "asc" ? asc(blogPosts.title) : desc(blogPosts.title)) :
        sortOrder === "asc" ? asc(blogPosts.createdAt) : desc(blogPosts.createdAt)
      )
      .limit(itemsPerPage)
      .offset((page - 1) * itemsPerPage)

    categories = await db
      .selectDistinct({ category: blogPosts.category })
      .from(blogPosts)
      .where(sql`${blogPosts.category} IS NOT NULL`)
  } catch (error) {
    console.error("Error loading blog admin data:", error)
  }

  return (
    <AdminLayout
      user={currentUser ? { email: currentUser.email, role: currentUser.role } : null}
      accessibleSections={accessibleSections}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
            <p className="text-gray-400">Manage your blog content</p>
          </div>
          <Link href="/admin/blog/create">
            <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardContent className="p-4">
            <SearchFilterBar 
              placeholder="Search posts..."
              filterSlot={
                <>
                  <FilterSelect 
                    paramKey="status"
                    label="All Status"
                    options={[
                      { label: "Published", value: "published" },
                      { label: "Draft", value: "draft" }
                    ]}
                  />
                  <FilterSelect 
                    paramKey="category"
                    label="All Categories"
                    options={categories
                      .filter(c => c.category)
                      .map(c => ({ label: c.category!, value: c.category! }))}
                  />
                </>
              }
            />
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#333333] cut-corner">
          <CardHeader>
            <CardTitle className="text-white">Posts ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {!posts?.length ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                <p className="text-gray-400 mb-6">Create your first blog post to get started.</p>
                <Link href="/admin/blog/create">
                  <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div 
                      key={post.id} 
                      className="flex items-start gap-4 p-4 bg-[#0A0A0A] border border-[#333333] cut-corner hover:border-[#ECAC36]/30 transition-colors"
                    >
                      {post.featuredImage ? (
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden cut-corner">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 flex-shrink-0 bg-[#1A1A1A] flex items-center justify-center cut-corner">
                          <FileText className="h-8 w-8 text-gray-600" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white truncate">{post.title}</h3>
                            {post.excerpt && (
                              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{post.excerpt}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                              {post.category && (
                                <span className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {post.category}
                                </span>
                              )}
                              <span className="text-gray-600">/{post.slug}</span>
                            </div>
                          </div>
                          <Badge 
                            variant={post.isPublished ? "default" : "secondary"}
                            className={post.isPublished ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}
                          >
                            {post.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-white hover:bg-[#222222]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-400 hover:text-white hover:bg-[#222222]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form action={deleteBlogPost}>
                          <input type="hidden" name="id" value={post.id} />
                          <Button 
                            type="submit"
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Pagination 
                    currentPage={page}
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
