import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { requireApiAuth } from "@/lib/auth-helpers"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    await requireApiAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY
    const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL


    if (!apiKey) {
      console.error("[GenerateDescription] Missing OpenAI API key")
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: baseURL || undefined,
    })

    const body = await request.json()
    const { category, title, subtitle, specifications } = body

    console.log(`[GenerateDescription] Request for category=${category}, title="${title}"`)

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      )
    }

    let prompt = ""

    if (category === "car") {
      prompt = `Write a compelling, SEO-optimized description for a luxury exotic car rental listing. The description should be 2-3 paragraphs, highlighting the driving experience, performance, and luxury features. Use sensory language that appeals to high-end clientele looking for an unforgettable Miami experience.

Car: ${title}
${subtitle ? `Color/Interior: ${subtitle}` : ""}
${specifications?.horsepower ? `Horsepower: ${specifications.horsepower}` : ""}
${specifications?.acceleration ? `0-60 mph: ${specifications.acceleration}` : ""}
${specifications?.transmission ? `Transmission: ${specifications.transmission}` : ""}
${specifications?.bodyType ? `Body Type: ${specifications.bodyType}` : ""}
${specifications?.seats ? `Seats: ${specifications.seats}` : ""}

Write the description without any headers or titles - just the body text. Focus on the emotional experience of driving this car through Miami.`
    } else if (category === "yacht") {
      prompt = `Write a compelling, SEO-optimized description for a luxury yacht charter listing in Miami. The description should be 2-3 paragraphs, highlighting the on-water experience, amenities, and exclusive nature of the charter. Use language that appeals to high-end clientele looking for an unforgettable Miami yacht experience.

Yacht: ${title}
${subtitle ? `Type: ${subtitle}` : ""}
${specifications?.length ? `Length: ${specifications.length}` : ""}
${specifications?.guests ? `Guest Capacity: ${specifications.guests}` : ""}
${specifications?.crew ? `Crew Size: ${specifications.crew}` : ""}
${specifications?.marina ? `Marina: ${specifications.marina}` : ""}

Write the description without any headers or titles - just the body text. Focus on the luxury experience of chartering this yacht in Miami waters.`
    } else if (category === "villa") {
      prompt = `Write a compelling, SEO-optimized description for a luxury villa rental listing in Miami. The description should be 2-3 paragraphs, highlighting the property's amenities, location, and exclusive features. Use language that appeals to high-end clientele looking for a luxurious Miami stay.

Property: ${title}
${subtitle ? `Location: ${subtitle}` : ""}
${specifications?.bedrooms ? `Bedrooms: ${specifications.bedrooms}` : ""}
${specifications?.bathrooms ? `Bathrooms: ${specifications.bathrooms}` : ""}
${specifications?.guests ? `Max Guests: ${specifications.guests}` : ""}

Write the description without any headers or titles - just the body text. Focus on the luxury lifestyle experience of staying at this property.`
    } else {
      prompt = `Write a compelling, SEO-optimized description for a luxury ${category} rental listing in Miami. The description should be 2-3 paragraphs, highlighting the features and exclusive nature of the offering. Use language that appeals to high-end clientele.

Title: ${title}
${subtitle ? `Details: ${subtitle}` : ""}

Write the description without any headers or titles - just the body text.`
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a luxury lifestyle copywriter specializing in high-end rentals in Miami. Write compelling, SEO-friendly descriptions that appeal to affluent clientele. Keep the tone sophisticated but not stuffy. Never use clichés. Focus on experiences and emotions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 1024,
    })

    const description = response.choices[0]?.message?.content?.trim() || ""
    const duration = Date.now() - startTime

    console.log(`[GenerateDescription] SUCCESS - Generated ${description.length} chars in ${duration}ms`)

    return NextResponse.json({ description })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[GenerateDescription] ERROR after ${duration}ms:`, error)
    
    let errorMessage = "Failed to generate description"
    if (error instanceof Error) {
      errorMessage = error.message
      if (error.message.includes("API key")) {
        errorMessage = "Invalid or missing OpenAI API key"
      } else if (error.message.includes("rate limit")) {
        errorMessage = "OpenAI rate limit exceeded. Please try again later."
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again."
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
