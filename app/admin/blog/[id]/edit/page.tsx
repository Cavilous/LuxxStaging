import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BlogPostForm } from "@/components/admin/blog-post-form"
import { updateBlogPost, getBlogPost } from "@/lib/blog-actions"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPost(id)

  if (!post) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-[#222222]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Post</h1>
            <p className="text-gray-400">Update your blog post</p>
          </div>
        </div>

        <BlogPostForm 
          action={updateBlogPost} 
          initialData={{
            id: post.id,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || "",
            featuredImage: post.featuredImage,
            category: post.category,
            metaTitle: post.metaTitle,
            metaDescription: post.metaDescription,
            author: post.author,
            isPublished: post.isPublished,
          }}
        />
      </div>
    </AdminLayout>
  )
}
