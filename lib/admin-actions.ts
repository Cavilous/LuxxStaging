"use server"

import { createDbClient } from "@/lib/db/client"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { adminUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function adminSignIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const client = createDbClient()

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      await db
        .update(adminUsers)
        .set({ lastLoginAt: new Date() })
        .where(eq(adminUsers.id, data.user.id))
    }

    return { success: true }
  } catch (error) {
    console.error("Admin login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function adminSignOut() {
  redirect("/admin/login")
}
