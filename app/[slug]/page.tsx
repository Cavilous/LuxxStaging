import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { db, withRetry } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { ArticleSchema } from "@/components/article-schema"
import { Car, Ship, Home } from "lucide-react"

export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getBlogPost(slug: string) {
  const [post] = await withRetry(() => db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1)
  , 3, `blog-post-${slug}`)

  return post
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Blog Post Not Found | Luxx Miami",
    }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author || "Luxx Miami"],
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: `https://luxxmiami.com/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post || !post.isPublished) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black">
      <ArticleSchema
        title={post.title}
        description={post.excerpt || post.metaDescription || ""}
        url={`https://luxxmiami.com/${slug}`}
        image={post.featuredImage || undefined}
        datePublished={post.publishedAt?.toISOString() || post.createdAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
        author={post.author || undefined}
        category={post.category || undefined}
      />
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {post.featuredImage && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </time>
            )}
            {post.category && (
              <>
                <span>•</span>
                <span className="text-[#ECAC36]">{post.category}</span>
              </>
            )}
            {post.author && (
              <>
                <span>•</span>
                <span>By {post.author}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed">{post.excerpt}</p>
          )}
        </header>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA Section */}
        <section className="mt-16 pt-12 border-t border-gray-800">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Ready for Your Miami Luxury Experience?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore our collection of exotic cars, luxury yachts, and stunning villas. 
              Create unforgettable memories in Miami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/cars"
              className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8 text-center hover:border-[#ECAC36]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#ECAC36]/10 rounded-full flex items-center justify-center group-hover:bg-[#ECAC36]/20 transition-colors">
                <Car className="w-8 h-8 text-[#ECAC36]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Exotic Cars</h3>
              <p className="text-gray-400 text-sm mb-4">Lamborghini, Ferrari, Rolls-Royce & more</p>
              <span className="inline-flex items-center text-[#ECAC36] font-semibold text-sm group-hover:gap-2 transition-all">
                Browse Collection
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

            <Link 
              href="/yachts"
              className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8 text-center hover:border-[#ECAC36]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#ECAC36]/10 rounded-full flex items-center justify-center group-hover:bg-[#ECAC36]/20 transition-colors">
                <Ship className="w-8 h-8 text-[#ECAC36]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Luxury Yachts</h3>
              <p className="text-gray-400 text-sm mb-4">Private charters for any occasion</p>
              <span className="inline-flex items-center text-[#ECAC36] font-semibold text-sm group-hover:gap-2 transition-all">
                View Yachts
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

            <Link 
              href="/houses"
              className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8 text-center hover:border-[#ECAC36]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#ECAC36]/10 rounded-full flex items-center justify-center group-hover:bg-[#ECAC36]/20 transition-colors">
                <Home className="w-8 h-8 text-[#ECAC36]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Luxury Villas</h3>
              <p className="text-gray-400 text-sm mb-4">Waterfront estates & penthouses</p>
              <span className="inline-flex items-center text-[#ECAC36] font-semibold text-sm group-hover:gap-2 transition-all">
                Explore Villas
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500 mb-4">Have questions? We're here to help.</p>
            <a 
              href="tel:+13056055899"
              className="inline-flex items-center justify-center gap-2 bg-[#ECAC36] hover:bg-[#b8972e] text-black font-bold py-3 px-8 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (305) 605-5899
            </a>
          </div>
        </section>

        {post.tags && Array.isArray(post.tags) && (post.tags as string[]).length > 0 && (
          <footer className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-wrap gap-2">
              {(post.tags as string[]).map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-[#ECAC36]/10 text-[#ECAC36] rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  )
}
