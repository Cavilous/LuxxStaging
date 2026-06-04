import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { adminUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import * as bcrypt from "bcryptjs"

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = "support@alhmedia.com"
const ADMIN_PASSWORD = "ALH2026alh!"
const ADMIN_NAME = "Super Admin"
const ADMIN_ROLE = "super_admin"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const providedSecret = searchParams.get("secret")
    
    const setupSecret = process.env.SETUP_SECRET
    
    if (!setupSecret) {
      return NextResponse.json(
        { 
          error: "Setup endpoint is not configured. Please set SETUP_SECRET environment variable." 
        },
        { status: 500 }
      )
    }
    
    if (!providedSecret || providedSecret !== setupSecret) {
      return NextResponse.json(
        { error: "Invalid or missing setup secret" },
        { status: 401 }
      )
    }
    
    const existingUser = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, ADMIN_EMAIL))
      .limit(1)
    
    if (existingUser.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Admin user already exists. No action taken.",
        alreadyExists: true
      })
    }
    
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
    
    const [newUser] = await db
      .insert(adminUsers)
      .values({
        email: ADMIN_EMAIL,
        passwordHash,
        name: ADMIN_NAME,
        role: ADMIN_ROLE,
        isActive: true,
      })
      .returning()
    
    return NextResponse.json({
      success: true,
      message: "Super admin user created successfully!",
      user: {
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      },
      instructions: "You can now login at /admin/login with the configured credentials."
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { 
        error: "Failed to create admin user", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
