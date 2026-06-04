import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BlogPostForm } from "@/components/admin/blog-post-form"
import { createBlogPost } from "@/lib/blog-actions"

export const dynamic = 'force-dynamic'

export default function CreateBlogPostPage() {
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
            <h1 className="text-3xl font-bold text-white">Create New Post</h1>
            <p className="text-gray-400">Write and publish a new blog post</p>
          </div>
        </div>

        <BlogPostForm action={createBlogPost} />
      </div>
    </AdminLayout>
  )
}
