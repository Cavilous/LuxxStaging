import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight } from "lucide-react"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { cache } from "react"
import { normalizeImageUrl } from "@/lib/image-url-utils"

interface BlogPost {
  slug: string
  title: string
  excerpt: string | null
  featuredImage: string | null
  category: string | null
  publishedAt: Date | null
}

const getLatestBlogs = cache(async (): Promise<BlogPost[]> => {
  try {
    const posts = await db
      .select({
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        featuredImage: blogPosts.featuredImage,
        category: blogPosts.category,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(3)

    return posts
  } catch (error) {
    console.error("Error fetching latest blogs:", error)
    return []
  }
})

export async function LatestBlogs() {
  const posts = await getLatestBlogs()

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#0A0A0A]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-2">
              Latest from the Blog
            </h2>
            <p className="text-gray-400">
              Insights, guides, and stories from the world of luxury in Miami.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#ECAC36]/40 text-[#ECAC36] hover:bg-[#ECAC36]/10 hover:border-[#ECAC36] transition-all duration-300 cut-corner font-medium"
          >
            View All Posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="bg-[#111111] border border-[#222222] hover:border-[#ECAC36]/40 transition-all duration-300 overflow-hidden cut-corner">
                <div className="relative h-48 overflow-hidden">
                  {post.featuredImage && normalizeImageUrl(post.featuredImage) ? (
                    <Image
                      src={normalizeImageUrl(post.featuredImage)!}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                      <span className="text-[#ECAC36]/30 text-4xl font-heading font-bold">LUXX</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {post.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#ECAC36]/90 text-black text-xs font-semibold tracking-wider uppercase">
                      {post.category}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#ECAC36] transition-colors duration-300">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  {post.publishedAt && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm" suppressHydrationWarning>
                      <Calendar className="h-4 w-4" />
                      <time dateTime={new Date(post.publishedAt).toISOString()} suppressHydrationWarning>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[#ECAC36]/40 text-[#ECAC36] hover:bg-[#ECAC36]/10 hover:border-[#ECAC36] transition-all duration-300 cut-corner font-medium"
          >
            View All Posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
