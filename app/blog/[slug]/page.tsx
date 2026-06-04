import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { Calendar, User, ArrowLeft, Tag } from "lucide-react"
import { marked } from "marked"
import DOMPurify from "dompurify"
import { JSDOM } from "jsdom"
import { normalizeImageUrl } from "@/lib/image-url-utils"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))

  if (!post) {
    return {
      title: "Post Not Found | Luxx Miami",
    }
  }

  return {
    title: post.metaTitle || `${post.title} | Luxx Miami Blog`,
    description: post.metaDescription || post.excerpt || `Read ${post.title} on the Luxx Miami Blog.`,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author || "Luxx Miami"],
      images: post.featuredImage ? [{ url: normalizeImageUrl(post.featuredImage) || "/luxx-logo.png" }] : [{ url: "/luxx-logo.png", width: 400, height: 400 }],
      url: `https://luxxmiami.com/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.featuredImage ? [normalizeImageUrl(post.featuredImage) || ""] : undefined,
    },
    alternates: {
      canonical: `https://luxxmiami.com/blog/${post.slug}`,
    },
  }
}

function isHtmlContent(content: string): boolean {
  const htmlPattern = /<(h[1-6]|p|div|ul|ol|li|strong|em|a|blockquote|img|br)\b[^>]*>/i
  return htmlPattern.test(content)
}

function renderContentToHtml(content: string, postTitle: string): string {
  const window = new JSDOM("").window
  const purify = DOMPurify(window as unknown as Window)
  
  let html: string
  if (isHtmlContent(content)) {
    html = content
  } else {
    html = marked.parse(content, { async: false }) as string
  }
  
  const sanitizedHtml = purify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'figure', 'figcaption', 'hr', 'div', 'span'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button', 'object', 'embed'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'],
  })
  
  const normalizedTitle = postTitle.toLowerCase().trim()
  const escapedTitle = normalizedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const duplicateHeadingPattern = new RegExp(
    `<(h[1-6])[^>]*>\\s*${escapedTitle}\\s*<\\/\\1>`,
    'gi'
  )
  const cleanedHtml = sanitizedHtml.replace(duplicateHeadingPattern, '')
  
  return cleanedHtml
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))

  if (!post || !post.isPublished) {
    notFound()
  }

  const contentHtml = renderContentToHtml(post.content, post.title)

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://luxxmiami.com' },
          { name: 'Blog', url: 'https://luxxmiami.com/blog' },
          { name: post.title, url: `https://luxxmiami.com/blog/${post.slug}` },
        ]}
      />
      
      <main className="min-h-screen bg-[#0A0A0A]">
        {post.featuredImage && normalizeImageUrl(post.featuredImage) && (
          <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full">
            <Image
              src={normalizeImageUrl(post.featuredImage)!}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
          </div>
        )}

        <article className={`container mx-auto px-4 ${post.featuredImage ? "-mt-32 relative z-10" : "pt-16"}`}>
          <div className="max-w-3xl mx-auto">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-[#ECAC36] hover:text-[#ECAC36]/80 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <header className="mb-10">
              {post.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ECAC36]/10 border border-[#ECAC36]/30 text-[#ECAC36] text-sm font-medium tracking-wider mb-4 cut-corner">
                  <Tag className="h-3 w-3" />
                  {post.category}
                </span>
              )}
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-gray-400 mb-6">{post.excerpt}</p>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-b border-[#333333] py-4">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#ECAC36]" />
                  {post.author || "Luxx Miami"}
                </span>
                {post.publishedAt && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#ECAC36]" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                )}
              </div>
            </header>

            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            <footer className="mt-16 pt-8 border-t border-[#333333]">
              <div className="flex items-center justify-between">
                <Link 
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] border border-[#333333] text-white hover:border-[#ECAC36]/50 transition-colors cut-corner"
                >
                  <ArrowLeft className="h-4 w-4" />
                  More Articles
                </Link>
                <div className="text-gray-500 text-sm">
                  Share this article
                </div>
              </div>
            </footer>
          </div>
        </article>

        <div className="py-20"></div>
      </main>
    </>
  )
}
