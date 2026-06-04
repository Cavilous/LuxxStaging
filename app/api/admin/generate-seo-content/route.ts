import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { requireApiAuth } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import { seoPages, inventory, seoPageUnits } from "@/lib/db/schema"
import { eq, and, desc, asc, sql } from "drizzle-orm"
import { getCityName } from "@/lib/seo-constants"

export async function POST(request: NextRequest) {
  const internalKey = request.headers.get('x-internal-key')
  const isInternalCall = !!(process.env.INTERNAL_API_SECRET && internalKey === process.env.INTERNAL_API_SECRET)

  if (!isInternalCall) {
    try {
      await requireApiAuth()
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY
    const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL

    if (!apiKey) {
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
    const {
      seoPageId,
      pageType,
      city,
      brand,
      model,
      intent,
      category,
      lowestPrice,
      unitCount,
    } = body

    if (!seoPageId || !pageType) {
      return NextResponse.json(
        { error: "seoPageId and pageType are required" },
        { status: 400 }
      )
    }

    const cityName = getCityName(city || "miami")

    const unitData = await getPageUnitData(seoPageId, category)

    const prompt = buildSeoPrompt({
      pageType,
      cityName,
      city: city || "miami",
      brand: brand || undefined,
      model: model || undefined,
      intent: intent || undefined,
      category: category || "car",
      lowestPrice: lowestPrice || unitData.lowestPrice,
      unitCount: unitCount || unitData.unitCount,
      unitSamples: unitData.samples,
    })

    const systemPrompt = `You are an SEO content strategist for LuxxMiami.com, Miami's premier luxury rental platform (exotic cars, yachts, villas). You produce structured JSON output only. Write compelling, accurate content that ranks for local luxury rental search queries. Never fabricate specific vehicle specs, prices, or availability numbers unless provided. Use real data when given. Include natural internal links using keyword-rich anchor text.`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 4096,
      response_format: { type: "json_object" },
    })

    const rawContent = response.choices[0]?.message?.content?.trim() || "{}"

    let parsed: any
    try {
      parsed = JSON.parse(rawContent)
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      )
    }

    const { content, h1, metaTitle, metaDescription } = parsed

    if (!content) {
      return NextResponse.json(
        { error: "AI did not return content" },
        { status: 500 }
      )
    }

    await db
      .update(seoPages)
      .set({
        content,
        h1: h1 || undefined,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        contentStatus: "generated",
        updatedAt: new Date(),
      })
      .where(eq(seoPages.id, seoPageId))

    return NextResponse.json({
      content,
      h1: h1 || "",
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
    })
  } catch (error) {
    console.error("[GenerateSeoContent] Error:", error)
    let errorMessage = "Failed to generate SEO content"
    if (error instanceof Error) {
      if (error.message.includes("API key")) errorMessage = "Invalid or missing OpenAI API key"
      else if (error.message.includes("rate limit")) errorMessage = "Rate limit exceeded. Try again later."
      else if (error.message.includes("timeout")) errorMessage = "Request timed out. Try again."
      else errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

async function getPageUnitData(seoPageId: string, category?: string) {
  try {
    const units = await db
      .select({
        title: inventory.title,
        brand: inventory.brand,
        pricePerDay: inventory.pricePerDay,
        slug: inventory.slug,
      })
      .from(seoPageUnits)
      .innerJoin(inventory, eq(seoPageUnits.inventoryId, inventory.id))
      .where(
        and(
          eq(seoPageUnits.seoPageId, seoPageId),
          eq(inventory.isPublished, true)
        )
      )
      .orderBy(asc(inventory.pricePerDay))
      .limit(10)

    const prices = units
      .map(u => parseFloat(u.pricePerDay || "0"))
      .filter(p => p > 0)

    return {
      lowestPrice: prices.length > 0 ? Math.min(...prices).toString() : undefined,
      unitCount: units.length,
      samples: units.map(u => ({
        title: u.title,
        brand: u.brand,
        price: u.pricePerDay,
        slug: u.slug,
      })),
    }
  } catch {
    return { lowestPrice: undefined, unitCount: 0, samples: [] }
  }
}

interface PromptParams {
  pageType: string
  cityName: string
  city: string
  brand?: string
  model?: string
  intent?: string
  category: string
  lowestPrice?: string
  unitCount?: number
  unitSamples: Array<{ title: string; brand: string | null; price: string | null; slug: string | null }>
}

function buildSeoPrompt(params: PromptParams): string {
  const { pageType, cityName, city, brand, model, intent, category, lowestPrice, unitCount, unitSamples } = params

  const categoryLabel = category === "car" ? "exotic car" : category === "yacht" ? "yacht" : "luxury villa"
  const categoryPlural = category === "car" ? "exotic cars" : category === "yacht" ? "yachts" : "luxury villas"
  const categoryPath = category === "car" ? "/cars" : category === "yacht" ? "/yachts" : "/houses"

  const fleetContext = unitSamples.length > 0
    ? `\nAVAILABLE INVENTORY (use for internal links and mentions):\n${unitSamples.map(u => `- ${u.title}${u.price ? ` ($${u.price}/day)` : ""}${u.slug ? ` [link: ${categoryPath}/${u.slug}]` : ""}`).join("\n")}`
    : ""

  const pricingContext = lowestPrice ? `\nSTARTING PRICE: From $${lowestPrice}/day` : ""
  const countContext = unitCount ? `\nFLEET SIZE: ${unitCount} ${categoryPlural} available` : ""

  const commonRules = `
RULES:
- metaTitle must be 55-60 characters
- metaDescription must be 150-160 characters
- content must be valid HTML with <h2>/<h3> headings, <p> paragraphs, <ul><li> lists
- Include 3-5 internal links with keyword-rich anchor text (never "click here"):
  <a href="${categoryPath}">${categoryPlural} in ${cityName}</a>
  <a href="/contact">contact Luxx Miami</a>
  ${brand ? `<a href="/${city}/${brand.toLowerCase().replace(/\\s+/g, '-')}-rental">${brand} rentals in ${cityName}</a>` : ""}
- Weave Miami-area location terms naturally (South Beach, Brickell, Ocean Drive, Wynwood, Coconut Grove, Key Biscayne)
- NO fabricated specs or features  -  only reference what is provided
- ${lowestPrice ? `Reference the starting price of $${lowestPrice}/day` : "Do NOT mention specific prices unless provided"}
- Sophisticated, aspirational tone  -  target affluent travelers and locals
- 500-800 words of content`

  const jsonStructure = `Return this exact JSON structure:
{
  "h1": "string (compelling H1 heading for the page)",
  "metaTitle": "string (55-60 chars, include primary keyword + Miami + rental intent)",
  "metaDescription": "string (150-160 chars, compelling with CTA, include location + rental terms)",
  "content": "string (HTML content  -  headings, paragraphs, lists, internal links)"
}`

  switch (pageType) {
    case "brand-city":
      return `Generate SEO landing page content for renting ${brand} ${categoryPlural} in ${cityName}.

PAGE TYPE: Brand + City landing page
BRAND: ${brand}
CITY: ${cityName}
CATEGORY: ${categoryLabel}
${pricingContext}${countContext}${fleetContext}

CONTENT STRUCTURE:
1. Opening section: "Why Rent a ${brand} in ${cityName}"  -  brand prestige + city lifestyle match
2. Fleet overview: Reference available models with internal links
3. ${cityName} driving experience: Best routes, neighborhoods, valet-friendly venues
4. Rental process: How booking works, delivery options, what's included
5. FAQ section (3-4 questions as <h3> with <p> answers):
   - "How much does it cost to rent a ${brand} in ${cityName}?"
   - "Can I get a ${brand} delivered to my hotel?"
   - "What do I need to rent a ${brand}?"
   - "Where can I drive a ${brand} in ${cityName}?"

${jsonStructure}

${commonRules}`

    case "model-city":
      return `Generate SEO landing page content for renting a ${brand} ${model} in ${cityName}.

PAGE TYPE: Model + City landing page
BRAND: ${brand}
MODEL: ${model}
CITY: ${cityName}
CATEGORY: ${categoryLabel}
${pricingContext}${countContext}${fleetContext}

CONTENT STRUCTURE:
1. Model introduction: What makes the ${brand} ${model} special  -  performance highlights, design
2. The ${cityName} experience: What it feels like driving this specific model in ${cityName}
3. Key features and highlights (use bullet list  -  only reference what you're confident about)
4. Ideal occasions: Events, celebrations, business trips where this model shines
5. Booking details: Process, delivery, requirements

${jsonStructure}

${commonRules}`

    case "intent-city":
      return `Generate SEO landing page content for ${intent} ${categoryLabel} rental in ${cityName}.

PAGE TYPE: Intent/Use-case + City landing page
INTENT: ${intent}
CITY: ${cityName}
CATEGORY: ${categoryLabel}
${pricingContext}${countContext}${fleetContext}

CONTENT STRUCTURE:
1. Use-case introduction: Why ${cityName} is perfect for ${intent} with a luxury ${categoryLabel}
2. Best ${categoryPlural} for ${intent}: Reference available inventory with links
3. Planning guide: Tips specific to this use case (timing, logistics, photo opportunities)
4. What's included: Delivery, concierge service, special arrangements
5. FAQ section (2-3 questions about this specific use case)

${jsonStructure}

${commonRules}`

    case "city-hub":
      return `Generate SEO hub page content for ${categoryLabel} rentals in ${cityName}.

PAGE TYPE: City hub/category overview page
CITY: ${cityName}
CATEGORY: ${categoryLabel}
${pricingContext}${countContext}${fleetContext}

CONTENT STRUCTURE:
1. City overview: Why ${cityName} is the ultimate destination for luxury ${categoryLabel} rentals
2. Fleet categories: Overview of what's available (brands, types, price ranges)
3. Popular choices: Reference specific inventory with internal links
4. ${cityName} highlights: Best areas, routes, venues, and experiences
5. Why rent with Luxx Miami: Trust signals, service quality, delivery, concierge
6. How it works: Simple booking process overview

${jsonStructure}

${commonRules}`

    default:
      return `Generate SEO landing page content for ${categoryLabel} rentals in ${cityName}.

PAGE TYPE: ${pageType}
CITY: ${cityName}
CATEGORY: ${categoryLabel}
${brand ? `BRAND: ${brand}` : ""}
${model ? `MODEL: ${model}` : ""}
${intent ? `INTENT: ${intent}` : ""}
${pricingContext}${countContext}${fleetContext}

CONTENT STRUCTURE:
1. Introduction with primary keyword focus
2. Fleet/inventory overview with internal links
3. Location-specific content for ${cityName}
4. Why choose Luxx Miami
5. FAQ section (2-3 questions)

${jsonStructure}

${commonRules}`
  }
}
