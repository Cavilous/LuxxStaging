"use server"

import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createBlogPost(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const featuredImage = formData.get("featuredImage") as string
  const category = formData.get("category") as string
  const metaTitle = formData.get("metaTitle") as string
  const metaDescription = formData.get("metaDescription") as string
  const isPublished = formData.get("isPublished") === "true"
  const author = formData.get("author") as string || "Luxx Miami"

  const slug = generateSlug(title)

  const [newPost] = await db.insert(blogPosts).values({
    title,
    slug,
    content,
    excerpt: excerpt || null,
    featuredImage: featuredImage || null,
    category: category || null,
    metaTitle: metaTitle || title,
    metaDescription: metaDescription || excerpt || null,
    author,
    isPublished,
    publishedAt: isPublished ? new Date() : null,
  }).returning()

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  redirect("/admin/blog")
}

export async function updateBlogPost(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const featuredImage = formData.get("featuredImage") as string
  const category = formData.get("category") as string
  const metaTitle = formData.get("metaTitle") as string
  const metaDescription = formData.get("metaDescription") as string
  const isPublished = formData.get("isPublished") === "true"
  const author = formData.get("author") as string || "Luxx Miami"

  const slug = generateSlug(title)

  const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, id))

  await db.update(blogPosts)
    .set({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      featuredImage: featuredImage || null,
      category: category || null,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || null,
      author,
      isPublished,
      publishedAt: isPublished && !existing?.publishedAt ? new Date() : existing?.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
  redirect("/admin/blog")
}

export async function deleteBlogPost(formData: FormData) {
  const id = formData.get("id") as string

  await db.delete(blogPosts).where(eq(blogPosts.id, id))

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  redirect("/admin/blog")
}

export async function getBlogPost(id: string) {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id))
  return post
}

export async function getBlogPostBySlug(slug: string) {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug))
  return post
}
