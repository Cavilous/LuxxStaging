import { BreadcrumbSchema } from "@/components/breadcrumb-schema"
import { db } from "@/lib/db"
import { eq, desc } from "drizzle-orm"
import { blogPosts } from "@/lib/db/schema"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Tag, ArrowRight } from "lucide-react"
import { normalizeImageUrl } from "@/lib/image-url-utils"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Blog | Miami Luxury Lifestyle, Travel & Events | Luxx Miami",
  description: "Explore insider guides to Miami's luxury lifestyle. Discover the best exotic cars, restaurants, nightlife, and experiences for discerning travelers.",
  keywords: ["miami blog", "luxury lifestyle miami", "miami travel guide", "exotic cars miami", "miami restaurants", "miami nightlife"],
  openGraph: {
    title: "Luxx Miami Blog - Luxury Lifestyle Guides",
    description: "Insider guides to Miami's most exclusive experiences. From exotic cars to fine dining, discover the best of Miami.",
    url: "https://luxxmiami.com/blog",
    type: "website",
    images: [
      {
        url: "https://luxxmiami.com/luxx-logo.png",
        width: 800,
        height: 600,
        alt: "Luxx Miami Blog",
      },
    ],
  },
  alternates: {
    canonical: "https://luxxmiami.com/blog",
  },
}

async function getBlogPosts() {
  try {
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        featuredImage: blogPosts.featuredImage,
        category: blogPosts.category,
        tags: blogPosts.tags,
        author: blogPosts.author,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt))

    return posts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://luxxmiami.com' },
          { name: 'Blog', url: 'https://luxxmiami.com/blog' },
        ]}
      />
      
      <section className="relative bg-[#0A0A0A] hero-angled-bottom">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3">
            Luxx Miami <span className="text-[#ECAC36]">Blog</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl leading-relaxed">
            Your insider guide to Miami's luxury lifestyle. Discover the best exotic cars, fine dining, nightlife hotspots, and exclusive experiences curated for discerning travelers.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-400 text-lg">No blog posts yet. Check back soon for luxury lifestyle guides and Miami insights.</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-[#111] rounded-lg overflow-hidden border border-[#ECAC36]/20 hover:border-[#ECAC36]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
              >
                {post.featuredImage && normalizeImageUrl(post.featuredImage) && !post.featuredImage.includes('luxx.miami') ? (
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image
                      src={normalizeImageUrl(post.featuredImage)!}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center border-b border-[#ECAC36]/20">
                    <span className="text-[#ECAC36] text-5xl font-heading font-bold">L</span>
                  </div>
                )}
                
                <div className="p-5 md:p-6 space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {post.category && (
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#ECAC36]" />
                        <span className="text-[#ECAC36]">{post.category}</span>
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-lg md:text-xl font-heading font-bold text-white group-hover:text-[#ECAC36] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-[#ECAC36] text-sm font-medium pt-2">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
