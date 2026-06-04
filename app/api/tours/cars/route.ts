import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, and, isNotNull, desc } from "drizzle-orm"

export async function GET() {
  try {
    const tourCars = await db
      .select({
        id: inventory.id,
        title: inventory.title,
        subtitle: inventory.subtitle,
        images: inventory.images,
        specifications: inventory.specifications,
        pricePerDay: inventory.pricePerDay,
      })
      .from(inventory)
      .where(
        and(
          eq(inventory.category, "car"),
          eq(inventory.isPublished, true),
          eq(inventory.isFeatured, true),
          isNotNull(inventory.images)
        )
      )
      .orderBy(desc(inventory.createdAt))
      .limit(9)

    const carsWithImages = tourCars.filter(car => car.images && (car.images as string[]).length > 0)

    const formattedCars = carsWithImages.map(car => {
      const specs = car.specifications as any || {}
      return {
        id: car.id,
        make: car.title?.split(" ")[0] || "Luxury",
        model: car.title?.split(" ").slice(1).join(" ") || "Car",
        images: car.images as string[],
        specifications: specs,
        tourMaxPassengers: specs.seats || 3,
        tourPricing: { perHour: { pax1: Math.round((Number(car.pricePerDay) || 500) / 8) } },
      }
    })

    return NextResponse.json(formattedCars)
  } catch (error) {
    console.error("Error fetching tour cars:", error)
    return NextResponse.json({ error: "Failed to fetch tour cars" }, { status: 500 })
  }
}
