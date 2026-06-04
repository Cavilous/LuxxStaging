import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import EditHouseForm from "./edit-house-form"

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    returnUrl?: string
  }>
}

async function getHouseData(id: string) {
  try {
    const [house] = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, id))
      .limit(1)

    return house || null
  } catch (error) {
    console.error("Error fetching house:", error)
    return null
  }
}

export default async function EditHousePage({ params, searchParams }: PageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const house = await getHouseData(id)
  const returnUrl = resolvedSearchParams.returnUrl || "/admin/houses"

  if (!house) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Link href={returnUrl}>
            <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
              Back to Houses
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return <EditHouseForm house={house} returnUrl={returnUrl} />
}
