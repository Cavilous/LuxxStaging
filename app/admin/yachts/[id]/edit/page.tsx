import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import EditYachtForm from "./edit-yacht-form"

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    returnUrl?: string
  }>
}

async function getYachtData(id: string) {
  try {
    const [yacht] = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, id))
      .limit(1)

    return yacht || null
  } catch (error) {
    console.error("Error fetching yacht:", error)
    return null
  }
}

export default async function EditYachtPage({ params, searchParams }: PageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const yacht = await getYachtData(id)
  const returnUrl = resolvedSearchParams.returnUrl || "/admin/yachts"

  if (!yacht) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Yacht Not Found</h1>
          <Link href={returnUrl}>
            <Button className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold cut-corner">
              Back to Yachts
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return <EditYachtForm yacht={yacht} returnUrl={returnUrl} />
}
