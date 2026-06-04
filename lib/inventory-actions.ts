"use server"

import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { extractImagesFromSmugMug } from "@/lib/smugmug-utils"
import { toTitleCaseSmart } from "@/lib/text-normalization"
import { generateUniqueSlug, generateBrandSlug } from "@/lib/slug-utils"
import { syncSeoPagesForUnit, detachUnitFromAllPages } from "@/lib/seo-sync"

async function checkAuth() {
  return { userId: "admin", session: null }
}

export async function createInventoryItem(prevState: any, formData: FormData) {
  try {
    await checkAuth()
    const category = formData.get("category") as string
    const rawTitle = formData.get("title") as string
    const rawSubtitle = formData.get("subtitle") as string | null
    const description = formData.get("description") as string | null

    if (!category) {
      return { error: "Category is required" }
    }
    if (!rawTitle || rawTitle.trim() === "") {
      return { error: "Title is required" }
    }
    
    const title = toTitleCaseSmart(rawTitle)
    const subtitle = rawSubtitle ? toTitleCaseSmart(rawSubtitle) : null
    const brand = formData.get("brand") as string | null
    
    const pricePerDay = formData.get("price_per_day")
      ? Number.parseFloat(formData.get("price_per_day") as string)
      : null
    const pricePerHour = formData.get("price_per_hour")
      ? Number.parseFloat(formData.get("price_per_hour") as string)
      : null
    const pricePer4Hr = formData.get("price_per_4hr")
      ? Number.parseFloat(formData.get("price_per_4hr") as string)
      : null
    const pricePer6Hr = formData.get("price_per_6hr")
      ? Number.parseFloat(formData.get("price_per_6hr") as string)
      : null
    const pricePer8Hr = formData.get("price_per_8hr")
      ? Number.parseFloat(formData.get("price_per_8hr") as string)
      : null
    
    const isPublished = formData.get("is_published") === "true"
    const isFeatured = formData.get("is_featured") === "true"

    const smugmugUrl = formData.get("smugmug_url") as string | null
    let images = []
    
    if (smugmugUrl && smugmugUrl.trim()) {
      try {
        const smugmugImages = await extractImagesFromSmugMug(smugmugUrl.trim())
        images = smugmugImages.map(img => img.url)
      } catch (error) {
        const imagesJson = formData.get("images") as string
        images = imagesJson ? JSON.parse(imagesJson) : []
      }
    } else {
      const imagesJson = formData.get("images") as string
      images = imagesJson ? JSON.parse(imagesJson) : []
    }

    const { slug, wasModified } = await generateUniqueSlug({
      title,
      brand,
      subtitle,
      category
    })
    
    const brandSlug = generateBrandSlug(brand)

    let specifications: Record<string, any> = {}
    if (category === "car") {
      const seats = formData.get("seats") as string
      const bodyType = formData.get("body_type") as string

      if (!seats) {
        return { error: "Seats is required for cars" }
      }
      if (!bodyType) {
        return { error: "Body type is required for cars" }
      }
      if (!pricePerDay) {
        return { error: "Price per day is required for cars" }
      }

      const featuresRaw = formData.get("features") as string
      const highlightsRaw = formData.get("highlights") as string
      specifications = {
        brand: brand || (title && title.trim() ? title.split(" ")[0] : ""),
        year: formData.get("year") ? Number.parseInt(formData.get("year") as string) : null,
        make: (formData.get("make") as string) || null,
        model: (formData.get("model") as string) || null,
        trim: (formData.get("trim") as string) || null,
        seats: Number.parseInt(seats),
        doors: formData.get("doors") ? Number.parseInt(formData.get("doors") as string) : null,
        transmission: (formData.get("transmission") as string) || null,
        bodyType,
        drivetrain: (formData.get("drivetrain") as string) || null,
        engine: (formData.get("engine") as string) || null,
        horsepower: formData.get("horsepower") ? Number.parseInt(formData.get("horsepower") as string) : null,
        torque: (formData.get("torque") as string) || null,
        acceleration: (formData.get("acceleration") as string) || null,
        topSpeed: formData.get("topSpeed") ? Number.parseInt(formData.get("topSpeed") as string) : null,
        fuelType: (formData.get("fuelType") as string) || null,
        exteriorColor: (formData.get("exteriorColor") as string) || null,
        interiorColor: (formData.get("interiorColor") as string) || null,
        features: featuresRaw ? featuresRaw.split(",").map(f => f.trim()).filter(Boolean) : null,
        highlights: highlightsRaw ? highlightsRaw.split(",").map(h => h.trim()).filter(Boolean) : null,
      }
    } else if (category === "yacht") {
      const length = formData.get("length") as string
      const guests = formData.get("guests") as string

      if (!length) {
        return { error: "Length is required for yachts" }
      }
      if (!guests) {
        return { error: "Max guests is required for yachts" }
      }
      // Yachts need either hourly or at least one package pricing option
      if (!pricePerHour && !pricePer4Hr && !pricePer6Hr && !pricePer8Hr) {
        return { error: "At least one pricing option is required (hourly rate or package pricing)" }
      }

      specifications = {
        length,
        guests: Number.parseInt(guests),
        crew: formData.get("crew") ? Number.parseInt(formData.get("crew") as string) : null,
        marina: formData.get("marina") as string,
      }
    } else if (category === "villa") {
      const bedrooms = formData.get("bedrooms") as string
      const bathrooms = formData.get("bathrooms") as string
      const guests = formData.get("guests") as string

      if (!bedrooms) {
        return { error: "Bedrooms is required for villas" }
      }
      if (!bathrooms) {
        return { error: "Bathrooms is required for villas" }
      }
      if (!guests) {
        return { error: "Max guests is required for villas" }
      }
      if (!pricePerDay) {
        return { error: "Price per night is required for villas" }
      }

      specifications = {
        bedrooms: Number.parseInt(bedrooms),
        bathrooms: Number.parseFloat(bathrooms),
        guests: Number.parseInt(guests),
        securityDeposit: formData.get("security_deposit")
          ? Number.parseFloat(formData.get("security_deposit") as string)
          : null,
        cleaningFee: formData.get("cleaning_fee") ? Number.parseFloat(formData.get("cleaning_fee") as string) : null,
      }
    }

    const metaTitle = (formData.get("meta_title") as string) || null
    const metaDescription = (formData.get("meta_description") as string) || null

    const serviceCitiesJson = formData.get("service_cities") as string | null
    const serviceCities = serviceCitiesJson ? JSON.parse(serviceCitiesJson) : ['miami']
    const tagsJson = formData.get("tags") as string | null
    const tags = tagsJson ? JSON.parse(tagsJson) : []
    const transactionType = (formData.get("transaction_type") as string) || 'rental'

    const result = await db.insert(inventory).values({
      category,
      title,
      subtitle: subtitle || null,
      brand: brand || null,
      description: description || null,
      pricePerDay: pricePerDay ? pricePerDay.toString() : null,
      pricePerHour: pricePerHour ? pricePerHour.toString() : null,
      pricePer4Hr: pricePer4Hr ? pricePer4Hr.toString() : null,
      pricePer6Hr: pricePer6Hr ? pricePer6Hr.toString() : null,
      pricePer8Hr: pricePer8Hr ? pricePer8Hr.toString() : null,
      slug,
      specifications,
      images,
      smugmugUrl: smugmugUrl || null,
      isPublished,
      isFeatured,
      serviceCities,
      tags,
      transactionType,
      metaTitle,
      metaDescription,
    }).returning()

    const routeName = category === "villa" ? "houses" : `${category}s`
    revalidatePath(`/admin/${routeName}`)
    revalidatePath(`/${routeName}`)
    revalidatePath("/")
    if (slug) {
      revalidatePath(`/${routeName}/${slug}`)
    }
    
    if (brand) {
      revalidatePath(`/car-brand/${brandSlug}`)
      revalidatePath(`/miami/${brandSlug}-rental`)
    }

    if (isPublished && result[0]) {
      syncSeoPagesForUnit(result[0].id).catch(err => {
        console.error('[SEO Sync Error on create]:', err)
      })
    }

    const successMessage = wasModified 
      ? `Item created successfully. Slug was auto-adjusted to: ${slug}`
      : "Item created successfully"
    
    return { success: successMessage, data: result[0], slugModified: wasModified }
  } catch (error) {
    console.error('[Inventory Create Error]:', error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function updateInventoryItem(id: string, prevState: any, formData: FormData) {
  try {
    await checkAuth()
    
    const existingItem = await db.select({
      title: inventory.title,
      slug: inventory.slug,
      brand: inventory.brand
    }).from(inventory).where(eq(inventory.id, id)).limit(1)
    
    if (existingItem.length === 0) {
      return { error: "Item not found" }
    }
    
    const rawTitle = formData.get("title") as string
    const rawSubtitle = formData.get("subtitle") as string | null
    const description = formData.get("description") as string | null
    
    if (!rawTitle || rawTitle.trim() === "") {
      return { error: "Title is required - please ensure all fields are filled" }
    }
    
    const title = toTitleCaseSmart(rawTitle)
    const subtitle = rawSubtitle ? toTitleCaseSmart(rawSubtitle) : null
    const brand = formData.get("brand") as string | null
    const category = formData.get("category") as string
    
    const titleChanged = existingItem[0].title !== title
    const brandChanged = existingItem[0].brand !== brand
    let newSlug: string | undefined
    let slugWasModified = false
    
    if (titleChanged || brandChanged) {
      const slugResult = await generateUniqueSlug({
        title,
        brand,
        subtitle,
        category,
        existingId: id
      })
      newSlug = slugResult.slug
      slugWasModified = slugResult.wasModified
    }
    
    const pricePerDay = formData.get("price_per_day")
      ? Number.parseFloat(formData.get("price_per_day") as string)
      : null
    const pricePerHour = formData.get("price_per_hour")
      ? Number.parseFloat(formData.get("price_per_hour") as string)
      : null
    const pricePer4Hr = formData.get("price_per_4hr")
      ? Number.parseFloat(formData.get("price_per_4hr") as string)
      : null
    const pricePer6Hr = formData.get("price_per_6hr")
      ? Number.parseFloat(formData.get("price_per_6hr") as string)
      : null
    const pricePer8Hr = formData.get("price_per_8hr")
      ? Number.parseFloat(formData.get("price_per_8hr") as string)
      : null
    
    const isPublished = formData.get("is_published") === "true"
    const isFeatured = formData.get("is_featured") === "true"

    const smugmugUrl = formData.get("smugmug_url") as string | null
    let images = []
    
    const imagesJson = formData.get("images") as string
    console.log("[updateInventoryItem] Raw images from FormData:", imagesJson)
    
    if (smugmugUrl && smugmugUrl.trim()) {
      try {
        const smugmugImages = await extractImagesFromSmugMug(smugmugUrl.trim())
        images = smugmugImages.map(img => img.url)
      } catch (error) {
        images = imagesJson ? JSON.parse(imagesJson) : []
      }
    } else {
      images = imagesJson ? JSON.parse(imagesJson) : []
    }
    
    console.log("[updateInventoryItem] Parsed images to save:", JSON.stringify(images))

    let specifications: Record<string, any> = {}
    if (category === "car") {
      const featuresRaw = formData.get("features") as string
      const highlightsRaw = formData.get("highlights") as string
      specifications = {
        brand: brand || (title && title.trim() ? title.split(" ")[0] : ""),
        year: formData.get("year") ? Number.parseInt(formData.get("year") as string) : null,
        make: (formData.get("make") as string) || null,
        model: (formData.get("model") as string) || null,
        trim: (formData.get("trim") as string) || null,
        seats: formData.get("seats") ? Number.parseInt(formData.get("seats") as string) : null,
        doors: formData.get("doors") ? Number.parseInt(formData.get("doors") as string) : null,
        transmission: (formData.get("transmission") as string) || null,
        bodyType: (formData.get("body_type") as string) || null,
        drivetrain: (formData.get("drivetrain") as string) || null,
        engine: (formData.get("engine") as string) || null,
        horsepower: formData.get("horsepower") ? Number.parseInt(formData.get("horsepower") as string) : null,
        torque: (formData.get("torque") as string) || null,
        acceleration: (formData.get("acceleration") as string) || null,
        topSpeed: formData.get("topSpeed") ? Number.parseInt(formData.get("topSpeed") as string) : null,
        fuelType: (formData.get("fuelType") as string) || null,
        exteriorColor: (formData.get("exteriorColor") as string) || null,
        interiorColor: (formData.get("interiorColor") as string) || null,
        features: featuresRaw ? featuresRaw.split(",").map(f => f.trim()).filter(Boolean) : null,
        highlights: highlightsRaw ? highlightsRaw.split(",").map(h => h.trim()).filter(Boolean) : null,
      }
    } else if (category === "yacht") {
      // Yachts need at least one pricing option
      if (!pricePerHour && !pricePer4Hr && !pricePer6Hr && !pricePer8Hr) {
        return { error: "At least one pricing option is required (hourly rate or package pricing)" }
      }
      
      specifications = {
        length: formData.get("length") as string,
        guests: formData.get("guests") ? Number.parseInt(formData.get("guests") as string) : null,
        crew: formData.get("crew") ? Number.parseInt(formData.get("crew") as string) : null,
        marina: formData.get("marina") as string,
      }
    } else if (category === "villa") {
      specifications = {
        bedrooms: formData.get("bedrooms") ? Number.parseInt(formData.get("bedrooms") as string) : null,
        bathrooms: formData.get("bathrooms") ? Number.parseFloat(formData.get("bathrooms") as string) : null,
        guests: formData.get("guests") ? Number.parseInt(formData.get("guests") as string) : null,
        securityDeposit: formData.get("security_deposit")
          ? Number.parseFloat(formData.get("security_deposit") as string)
          : null,
        cleaningFee: formData.get("cleaning_fee") ? Number.parseFloat(formData.get("cleaning_fee") as string) : null,
      }
    }

    const focalPoint = formData.get("focal_point") as string | null
    const flipHorizontal = formData.get("flip_horizontal") === "true"
    const flipVertical = formData.get("flip_vertical") === "true"

    const imageSourceUrlsJson = formData.get("image_source_urls") as string | null
    const imageSourceUrls = imageSourceUrlsJson ? JSON.parse(imageSourceUrlsJson) : undefined

    const brandSlug = generateBrandSlug(brand)
    
    const metaTitle = (formData.get("meta_title") as string) || null
    const metaDescription = (formData.get("meta_description") as string) || null
    const aiContentGenerated = formData.has("ai_content_generated") ? formData.get("ai_content_generated") === "true" : undefined

    const serviceCitiesJson = formData.get("service_cities") as string | null
    const serviceCities = serviceCitiesJson ? JSON.parse(serviceCitiesJson) : undefined
    const tagsJson = formData.get("tags") as string | null
    const tags = tagsJson ? JSON.parse(tagsJson) : undefined
    const transactionType = (formData.get("transaction_type") as string) || undefined

    const updateData: any = {
      title,
      subtitle: subtitle || null,
      brand: brand || null,
      description: description || null,
      specifications,
      images,
      focalPoint: focalPoint || null,
      flipHorizontal,
      flipVertical,
      smugmugUrl: smugmugUrl || null,
      isPublished,
      isFeatured,
      metaTitle,
      metaDescription,
      updatedAt: new Date(),
    }

    if (aiContentGenerated !== undefined) updateData.aiContentGenerated = aiContentGenerated

    if (serviceCities !== undefined) updateData.serviceCities = serviceCities
    if (tags !== undefined) updateData.tags = tags
    if (transactionType !== undefined) updateData.transactionType = transactionType
    
    if (imageSourceUrls !== undefined) {
      updateData.imageSourceUrls = imageSourceUrls
    }
    
    if (newSlug) {
      updateData.slug = newSlug
    }
    
    if (formData.has("price_per_day")) {
      updateData.pricePerDay = pricePerDay ? pricePerDay.toString() : null
    }
    if (formData.has("price_per_hour")) {
      updateData.pricePerHour = pricePerHour ? pricePerHour.toString() : null
    }
    if (formData.has("price_per_4hr")) {
      updateData.pricePer4Hr = pricePer4Hr ? pricePer4Hr.toString() : null
    }
    if (formData.has("price_per_6hr")) {
      updateData.pricePer6Hr = pricePer6Hr ? pricePer6Hr.toString() : null
    }
    if (formData.has("price_per_8hr")) {
      updateData.pricePer8Hr = pricePer8Hr ? pricePer8Hr.toString() : null
    }

    console.log("[updateInventoryItem] Saving to DB with images:", JSON.stringify(updateData.images))
    
    const result = await db.update(inventory)
      .set(updateData)
      .where(eq(inventory.id, id))
      .returning()
    
    console.log("[updateInventoryItem] DB result images:", JSON.stringify(result[0]?.images))

    const routeName = category === "villa" ? "houses" : `${category}s`
    revalidatePath(`/admin/${routeName}`)
    revalidatePath(`/${routeName}`)
    revalidatePath("/")

    const itemSlug = newSlug || existingItem[0].slug
    if (itemSlug) {
      revalidatePath(`/${routeName}/${itemSlug}`)
    }
    
    if (brandSlug) {
      revalidatePath(`/car-brand/${brandSlug}`)
      revalidatePath(`/miami/${brandSlug}-rental`)
    }

    if (result[0]) {
      if (isPublished) {
        syncSeoPagesForUnit(result[0].id).catch(err => {
          console.error('[SEO Sync Error on update]:', err)
        })
      } else {
        detachUnitFromAllPages(result[0].id).catch(err => {
          console.error('[SEO Detach Error on unpublish]:', err)
        })
      }
    }

    let successMessage = "Item updated successfully"
    if (newSlug && slugWasModified) {
      successMessage = `Item updated successfully. Slug was auto-adjusted to: ${newSlug}`
    } else if (newSlug) {
      successMessage = `Item updated successfully. Slug updated to: ${newSlug}`
    }
    
    return { success: successMessage, data: result[0], slugModified: slugWasModified }
  } catch (error) {
    console.error('[Inventory Update Error]:', error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function duplicateInventoryItem(id: string) {
  try {
    await checkAuth()

    const items = await db.select().from(inventory).where(eq(inventory.id, id)).limit(1)
    if (items.length === 0) {
      return { error: "Item not found" }
    }

    const source = items[0]
    const newTitle = `${source.title} (Copy)`

    const { slug } = await generateUniqueSlug({
      title: newTitle,
      brand: source.brand,
      subtitle: source.subtitle,
      category: source.category,
    })

    const brandSlug = generateBrandSlug(source.brand)

    const result = await db.insert(inventory).values({
      category: source.category,
      title: newTitle,
      subtitle: source.subtitle,
      brand: source.brand,
      brandSlug,
      description: source.description,
      pricePerDay: source.pricePerDay,
      pricePerHour: source.pricePerHour,
      pricePerWeek: source.pricePerWeek,
      pricePerMonth: source.pricePerMonth,
      pricePer4Hr: source.pricePer4Hr,
      pricePer6Hr: source.pricePer6Hr,
      pricePer8Hr: source.pricePer8Hr,
      currency: source.currency,
      specifications: source.specifications,
      features: source.features,
      images: source.images,
      thumbnails: source.thumbnails,
      focalPoint: source.focalPoint,
      flipHorizontal: source.flipHorizontal,
      flipVertical: source.flipVertical,
      videoUrl: source.videoUrl,
      smugmugUrl: source.smugmugUrl,
      imageSourceUrls: source.imageSourceUrls,
      slug,
      serviceCities: source.serviceCities,
      tags: source.tags,
      transactionType: source.transactionType,
      metaTitle: source.metaTitle,
      metaDescription: source.metaDescription,
      isPublished: false,
      isFeatured: false,
      aiContentGenerated: false,
    }).returning()

    const routeName = source.category === "villa" ? "houses" : `${source.category}s`
    revalidatePath(`/admin/${routeName}`)

    return { success: "Item duplicated successfully", data: result[0] }
  } catch (error) {
    console.error('[Inventory Duplicate Error]:', error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    await checkAuth()
    await db.delete(inventory).where(eq(inventory.id, id))

    revalidatePath("/admin/cars")
    revalidatePath("/admin/yachts")
    revalidatePath("/admin/houses")
    revalidatePath("/cars")
    revalidatePath("/yachts")
    revalidatePath("/houses")
    revalidatePath("/")

    return { success: "Item deleted successfully" }
  } catch (error) {
    console.error('[Inventory Delete Error]:', error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function togglePublishStatus(id: string, isPublished: boolean) {
  try {
    await checkAuth()
    const result = await db.update(inventory)
      .set({
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(inventory.id, id))
      .returning()

    revalidatePath("/admin/cars")
    revalidatePath("/admin/yachts")
    revalidatePath("/admin/houses")
    revalidatePath("/cars")
    revalidatePath("/yachts")
    revalidatePath("/houses")
    revalidatePath("/")

    return { success: "Status updated successfully", data: result[0] }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

export async function toggleFeaturedStatus(id: string, isFeatured: boolean) {
  try {
    await checkAuth()
    const result = await db.update(inventory)
      .set({
        isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(inventory.id, id))
      .returning()

    revalidatePath("/admin/cars")
    revalidatePath("/admin/yachts")
    revalidatePath("/admin/houses")
    revalidatePath("/cars")
    revalidatePath("/yachts")
    revalidatePath("/houses")
    revalidatePath("/")

    return { success: "Featured status updated successfully", data: result[0] }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}
