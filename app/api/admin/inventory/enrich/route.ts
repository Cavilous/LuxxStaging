import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { db } from "@/lib/db"
import { inventory, auditLogs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireApiAuth } from "@/lib/auth-helpers"

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
})

const CONFIDENCE_THRESHOLD = 0.75

interface EnrichmentUpdate {
  value: string | number | boolean
  confidence: number
}

interface EnrichmentResponse {
  updates: Record<string, EnrichmentUpdate>
}

const CAR_ENRICHABLE_FIELDS = [
  "seats",
  "transmission", 
  "bodyType",
  "horsepower",
  "acceleration",
  "drivetrain",
  "engine",
  "topSpeed",
]

const YACHT_ENRICHABLE_FIELDS = [
  "length",
  "guests",
  "crew",
  "cabins",
  "builder",
  "beamFt",
  "draftFt",
]

const VILLA_ENRICHABLE_FIELDS = [
  "bedrooms",
  "bathrooms",
  "guests",
  "sqft",
  "pool",
  "waterfront",
  "garage",
]

function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim()
    return lower === "" || lower === "null" || lower === "n/a" || lower === "undefined"
  }
  return false
}

function buildCarPrompt(title: string, subtitle: string | null, specs: Record<string, any>): string {
  return `You are a vehicle specification expert. Given the following luxury/exotic car information, provide accurate specifications for any missing fields.

Car: ${title}
${subtitle ? `Color/Interior: ${subtitle}` : ""}

Current known specifications:
${Object.entries(specs)
  .filter(([_, v]) => !isEmpty(v))
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n") || "None provided"}

Provide ONLY the following missing fields if you can determine them with high confidence:
- seats (number of seats, typically 2-5)
- transmission (e.g., "8-Speed Automatic", "7-Speed Dual-Clutch", "6-Speed Manual")
- bodyType (e.g., "SUV", "Coupe", "Sedan", "Convertible", "Roadster", "Supercar")
- horsepower (number, the peak HP)
- acceleration (0-60 mph time as string like "3.5s")
- drivetrain (e.g., "AWD", "RWD", "4WD")
- engine (e.g., "4.0L V8 Twin-Turbo", "5.2L V10")
- topSpeed (number in mph)

IMPORTANT:
- Only include fields you are confident about (>75% confidence)
- Use base/standard trim specs if year/trim is ambiguous
- Never guess VIN, plates, or unique identifiers
- If unsure about a field, omit it entirely

Respond with ONLY valid JSON in this exact format:
{
  "updates": {
    "fieldName": { "value": <value>, "confidence": <0.0-1.0> }
  }
}`
}

function buildYachtPrompt(title: string, subtitle: string | null, specs: Record<string, any>): string {
  return `You are a yacht specification expert. Given the following yacht information, provide accurate specifications for any missing fields.

Yacht: ${title}
${subtitle ? `Type/Details: ${subtitle}` : ""}

Current known specifications:
${Object.entries(specs)
  .filter(([_, v]) => !isEmpty(v))
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n") || "None provided"}

Provide ONLY the following missing fields if you can determine them with high confidence:
- length (length in feet, number only)
- guests (max guest capacity, number)
- crew (crew size, number)
- cabins (number of cabins)
- builder (manufacturer name)
- beamFt (beam width in feet)
- draftFt (draft depth in feet)

IMPORTANT:
- Only include fields you are confident about (>75% confidence)
- If unsure about a field, omit it entirely

Respond with ONLY valid JSON in this exact format:
{
  "updates": {
    "fieldName": { "value": <value>, "confidence": <0.0-1.0> }
  }
}`
}

function buildVillaPrompt(title: string, subtitle: string | null, specs: Record<string, any>): string {
  return `You are a luxury property specification expert. Given the following villa/property information, provide accurate specifications for any missing fields.

Property: ${title}
${subtitle ? `Location/Details: ${subtitle}` : ""}

Current known specifications:
${Object.entries(specs)
  .filter(([_, v]) => !isEmpty(v))
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n") || "None provided"}

Provide ONLY the following missing fields if you can determine them with high confidence:
- bedrooms (number)
- bathrooms (number)
- guests (max guest capacity, number)
- sqft (square footage, number)
- pool (boolean, true/false)
- waterfront (boolean, true/false)
- garage (number of garage spots or boolean)

IMPORTANT:
- Only include fields you are confident about (>75% confidence)
- If unsure about a field, omit it entirely

Respond with ONLY valid JSON in this exact format:
{
  "updates": {
    "fieldName": { "value": <value>, "confidence": <0.0-1.0> }
  }
}`
}

export async function POST(request: NextRequest) {
  try {
    await requireApiAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { inventoryId, category, title, subtitle, currentSpecs } = body

    if (!inventoryId || !category || !title) {
      return NextResponse.json(
        { error: "Missing required fields: inventoryId, category, title" },
        { status: 400 }
      )
    }

    const specs = currentSpecs || {}
    let prompt = ""
    let enrichableFields: string[] = []

    switch (category) {
      case "car":
        prompt = buildCarPrompt(title, subtitle, specs)
        enrichableFields = CAR_ENRICHABLE_FIELDS
        break
      case "yacht":
        prompt = buildYachtPrompt(title, subtitle, specs)
        enrichableFields = YACHT_ENRICHABLE_FIELDS
        break
      case "villa":
        prompt = buildVillaPrompt(title, subtitle, specs)
        enrichableFields = VILLA_ENRICHABLE_FIELDS
        break
      default:
        return NextResponse.json(
          { error: `Unsupported category: ${category}` },
          { status: 400 }
        )
    }

    console.log(`🔍 Enriching ${category} inventory: ${title}`)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a vehicle/yacht/property specification expert. Always respond with valid JSON only, no markdown or additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    })

    const responseText = completion.choices[0]?.message?.content || "{}"
    
    let enrichmentData: EnrichmentResponse
    try {
      enrichmentData = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", responseText)
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      )
    }

    if (!enrichmentData.updates || typeof enrichmentData.updates !== "object") {
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      )
    }

    const appliedUpdates: Record<string, any> = {}
    const skippedUpdates: Record<string, { reason: string; value?: any; confidence?: number }> = {}

    for (const [field, update] of Object.entries(enrichmentData.updates)) {
      if (!enrichableFields.includes(field)) {
        skippedUpdates[field] = { reason: "field_not_allowed" }
        continue
      }

      if (!isEmpty(specs[field])) {
        skippedUpdates[field] = { reason: "already_has_value", value: specs[field] }
        continue
      }

      if (update.confidence < CONFIDENCE_THRESHOLD) {
        skippedUpdates[field] = { 
          reason: "low_confidence", 
          value: update.value, 
          confidence: update.confidence 
        }
        continue
      }

      appliedUpdates[field] = update.value
    }

    if (Object.keys(appliedUpdates).length === 0) {
      return NextResponse.json({
        success: true,
        message: "No fields to enrich",
        appliedUpdates: {},
        skippedUpdates,
      })
    }

    const mergedSpecs = { ...specs, ...appliedUpdates }

    await db
      .update(inventory)
      .set({
        specifications: mergedSpecs,
        updatedAt: new Date(),
      })
      .where(eq(inventory.id, inventoryId))

    await db.insert(auditLogs).values({
      tableName: "inventory",
      recordId: inventoryId,
      action: "enrich",
      oldValues: specs,
      newValues: mergedSpecs,
      userEmail: "system@luxxmiami.com",
    })

    console.log(`✅ Enriched ${category}: ${title}`, appliedUpdates)

    return NextResponse.json({
      success: true,
      message: `Enriched ${Object.keys(appliedUpdates).length} field(s)`,
      appliedUpdates,
      skippedUpdates,
    })
  } catch (error) {
    console.error("Inventory enrichment error:", error)
    return NextResponse.json(
      { error: "Failed to enrich inventory" },
      { status: 500 }
    )
  }
}
