import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import EditCarForm from "./edit-car-form"

interface TourRoute {
  id: string
  title: string
  duration: string
}

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    returnUrl?: string
  }>
}

async function getCarData(id: string) {
  try {
    const [car] = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, id))
      .limit(1)

    return car || null
  } catch (error) {
    console.error("Error fetching car:", error)
    return null
  }
}

async function getTourRoutes(): Promise<TourRoute[]> {
  try {
    const result = await db.execute(
      sql`SELECT id, title, duration FROM tour_routes ORDER BY title`
    )

    return (result.rows as TourRoute[]) || []
  } catch (error) {
    console.error("Error fetching tour routes:", error)
    return []
  }
}

export default async function EditCarPage({ params, searchParams }: PageProps) {
  const [{ id }, resolvedSearchParams, routes] = await Promise.all([
    params,
    searchParams,
    getTourRoutes()
  ])
  const car = await getCarData(id)

  const returnUrl = resolvedSearchParams.returnUrl || "/admin/cars"

  if (!car) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
          <Link href={returnUrl}>
            <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
              Back to Cars
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return <EditCarForm car={car} routes={routes} returnUrl={returnUrl} />
}
