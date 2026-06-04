import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { requireApiAuth } from "@/lib/auth-helpers"

export async function POST(request: NextRequest) {
  try {
    await requireApiAuth()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
    const { category, title, subtitle, brand, specifications, pricePerDay, images, slug } = body

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      )
    }

    const brandName = brand || ""
    const specsContext = specifications
      ? Object.entries(specifications)
          .filter(([_, v]) => v !== null && v !== undefined && v !== "")
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      : ""

    const systemPrompt = `You are an SEO-focused luxury copywriter and vehicle specification expert for LuxxMiami.com, Miami's premier luxury rental platform. You produce structured JSON output only. Never invent VINs, plate numbers, or unique identifiers. If you are less than 75% confident about a specification value, set its confidence to below 0.75 and it will be flagged for review.`

    let userPrompt = ""

    if (category === "car") {
      userPrompt = buildCarPrompt(title, subtitle, brandName, specsContext, pricePerDay, slug, images)
    } else if (category === "yacht") {
      userPrompt = buildYachtPrompt(title, subtitle, specsContext, pricePerDay, slug)
    } else if (category === "villa") {
      userPrompt = buildVillaPrompt(title, subtitle, specsContext, pricePerDay, slug)
    } else {
      userPrompt = buildGenericPrompt(title, subtitle, category, specsContext, pricePerDay, slug)
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
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

    return NextResponse.json({ result: parsed })
  } catch (error) {
    console.error("[GenerateAI] Error:", error)
    let errorMessage = "Failed to generate AI content"
    if (error instanceof Error) {
      if (error.message.includes("API key")) errorMessage = "Invalid or missing OpenAI API key"
      else if (error.message.includes("rate limit")) errorMessage = "Rate limit exceeded. Try again later."
      else if (error.message.includes("timeout")) errorMessage = "Request timed out. Try again."
      else errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

function buildCarPrompt(
  title: string,
  subtitle: string | undefined,
  brand: string,
  specsContext: string,
  pricePerDay: string | undefined,
  slug: string | undefined,
  images: string[] | undefined
): string {
  const imageCount = images?.length || 0
  const imageAlts = imageCount > 0
    ? `\nGenerate ALT text for ${Math.min(imageCount, 10)} images. For image 1 (hero), write the most descriptive ALT. For others, vary angle/detail references.`
    : ""

  return `Given this luxury exotic car rental listing, produce a complete SEO package as JSON.

CAR: ${title}
BRAND: ${brand}
${subtitle ? `COLOR/INTERIOR: ${subtitle}` : ""}
${pricePerDay ? `PRICE: $${pricePerDay}/day` : ""}
${slug ? `URL SLUG: /cars/${slug}` : ""}
${specsContext ? `KNOWN SPECS:\n${specsContext}` : "NO SPECS PROVIDED"}
${imageAlts}

Return this exact JSON structure:
{
  "seoTitle": "string (55-60 chars, include brand + Miami + rental intent keyword)",
  "seoDescription": "string (150-160 chars, compelling with CTA, include Miami luxury rental terms)",
  "description": "string (HTML format, structured long-form listing description following these rules:\n- Use <h3> headings to break into sections\n- Use <ul><li> bullet lists for features/specs\n- Include a 'Why Rent with Luxx Miami' section\n- Include internal hyperlinks with keyword-rich anchor text:\n  <a href='/cars'>exotic car rentals in Miami</a>\n  <a href='/brand/${brand ? brand.toLowerCase().replace(/\\s+/g, '-') : 'luxury'}'>rent a ${brand || 'luxury car'} in Miami</a>\n  <a href='/contact'>contact Luxx Miami</a>\n  <a href='/cars/${slug || ''}'>book this ${brand || 'car'}</a>\n- Weave Miami intent terms naturally (South Beach, Brickell, Ocean Drive, Wynwood, Miami lifestyle)\n- 400-600 words, sophisticated tone, focus on driving experience and lifestyle\n- NO generic filler. Every sentence should add value for SEO or user.)",
  "schemaJsonLd": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "string (listing title)",
    "description": "string (short 1-2 sentence description)",
    "brand": { "@type": "Brand", "name": "${brand || 'Luxury'}" },
    "category": "Car Rental",
    "url": "https://luxxmiami.com/cars/${slug || ''}",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      ${pricePerDay ? `"price": "${pricePerDay}",` : ""}
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Luxx Miami" }
    }
  },
  "imageAlts": ["string array - descriptive ALT text per image, hero first"],
  "specifications": {
    "year": { "value": "number or null", "confidence": 0.0 },
    "make": { "value": "string or null", "confidence": 0.0 },
    "model": { "value": "string or null", "confidence": 0.0 },
    "trim": { "value": "string or null", "confidence": 0.0 },
    "bodyType": { "value": "string: Coupe|Convertible|SUV|Sedan|Roadster|Supercar|Wagon|Hatchback", "confidence": 0.0 },
    "seats": { "value": "number", "confidence": 0.0 },
    "doors": { "value": "number", "confidence": 0.0 },
    "drivetrain": { "value": "string: RWD|AWD|4WD|FWD|4MATIC|xDrive", "confidence": 0.0 },
    "transmission": { "value": "string e.g. '8-Speed Automatic'", "confidence": 0.0 },
    "engine": { "value": "string e.g. '4.0L Twin-Turbo V8'", "confidence": 0.0 },
    "horsepower": { "value": "number", "confidence": 0.0 },
    "torque": { "value": "string e.g. '553 lb-ft'", "confidence": 0.0 },
    "acceleration": { "value": "string e.g. '3.1s'", "confidence": 0.0 },
    "topSpeed": { "value": "number in mph or null", "confidence": 0.0 },
    "fuelType": { "value": "string: Gasoline|Diesel|Electric|Hybrid|Plug-in Hybrid", "confidence": 0.0 },
    "features": { "value": ["array of feature strings"], "confidence": 0.0 },
    "exteriorColor": { "value": "string or null", "confidence": 0.0 },
    "interiorColor": { "value": "string or null", "confidence": 0.0 },
    "highlights": { "value": ["3-6 short highlight strings"], "confidence": 0.0 }
  }
}

RULES:
- seoTitle must be 55-60 characters
- seoDescription must be 150-160 characters
- description must be valid HTML with internal links using keyword anchor text
- Internal links must point to luxxmiami.com paths only (relative hrefs like /cars, /brand/..., /contact)
- Never use "click here" as anchor text
- All specification confidence values must be honest (0.0-1.0)
- If uncertain about a spec, set confidence below 0.75
- Use base/standard trim specs when year/trim is ambiguous
- schemaJsonLd must be valid Schema.org Product markup`
}

function buildYachtPrompt(
  title: string,
  subtitle: string | undefined,
  specsContext: string,
  pricePerDay: string | undefined,
  slug: string | undefined
): string {
  return `Given this luxury yacht charter listing, produce a complete SEO package as JSON.

YACHT: ${title}
${subtitle ? `TYPE: ${subtitle}` : ""}
${pricePerDay ? `PRICE: $${pricePerDay}/day` : ""}
${slug ? `URL SLUG: /yachts/${slug}` : ""}
${specsContext ? `KNOWN SPECS:\n${specsContext}` : "NO SPECS PROVIDED"}

Return this exact JSON structure:
{
  "seoTitle": "string (55-60 chars, include yacht name + Miami charter intent)",
  "seoDescription": "string (150-160 chars, compelling with CTA)",
  "description": "string (HTML format with <h3> headings, <ul><li> bullets, internal links to /yachts, /contact, etc. 400-600 words about the yacht experience in Miami waters. Include 'Why Charter with Luxx Miami' section.)",
  "schemaJsonLd": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${title}",
    "description": "short description",
    "category": "Yacht Charter",
    "url": "https://luxxmiami.com/yachts/${slug || ''}",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      ${pricePerDay ? `"price": "${pricePerDay}",` : ""}
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Luxx Miami" }
    }
  },
  "imageAlts": [],
  "specifications": {
    "length": { "value": "number in feet or null", "confidence": 0.0 },
    "guests": { "value": "number or null", "confidence": 0.0 },
    "crew": { "value": "number or null", "confidence": 0.0 },
    "cabins": { "value": "number or null", "confidence": 0.0 },
    "builder": { "value": "string or null", "confidence": 0.0 },
    "beamFt": { "value": "number or null", "confidence": 0.0 },
    "draftFt": { "value": "number or null", "confidence": 0.0 },
    "yearBuilt": { "value": "number or null", "confidence": 0.0 },
    "highlights": { "value": ["3-6 short highlight strings"], "confidence": 0.0 }
  }
}

RULES:
- seoTitle 55-60 chars, seoDescription 150-160 chars
- description is valid HTML with internal links (/yachts, /contact)
- All spec confidence values honest (0.0-1.0)
- Schema.org Product markup`
}

function buildVillaPrompt(
  title: string,
  subtitle: string | undefined,
  specsContext: string,
  pricePerDay: string | undefined,
  slug: string | undefined
): string {
  return `Given this luxury villa rental listing, produce a complete SEO package as JSON.

VILLA: ${title}
${subtitle ? `LOCATION: ${subtitle}` : ""}
${pricePerDay ? `PRICE: $${pricePerDay}/night` : ""}
${slug ? `URL SLUG: /houses/${slug}` : ""}
${specsContext ? `KNOWN SPECS:\n${specsContext}` : "NO SPECS PROVIDED"}

Return this exact JSON structure:
{
  "seoTitle": "string (55-60 chars, include property + Miami + rental intent)",
  "seoDescription": "string (150-160 chars, compelling with CTA)",
  "description": "string (HTML format with <h3> headings, <ul><li> bullets, internal links to /houses, /contact. 400-600 words about the villa experience. Include 'Why Stay with Luxx Miami' section.)",
  "schemaJsonLd": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${title}",
    "description": "short description",
    "category": "Villa Rental",
    "url": "https://luxxmiami.com/houses/${slug || ''}",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      ${pricePerDay ? `"price": "${pricePerDay}",` : ""}
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Luxx Miami" }
    }
  },
  "imageAlts": [],
  "specifications": {
    "bedrooms": { "value": "number or null", "confidence": 0.0 },
    "bathrooms": { "value": "number or null", "confidence": 0.0 },
    "guests": { "value": "number or null", "confidence": 0.0 },
    "sqft": { "value": "number or null", "confidence": 0.0 },
    "pool": { "value": "boolean or null", "confidence": 0.0 },
    "waterfront": { "value": "boolean or null", "confidence": 0.0 },
    "garage": { "value": "number or null", "confidence": 0.0 },
    "highlights": { "value": ["3-6 short highlight strings"], "confidence": 0.0 }
  }
}

RULES:
- seoTitle 55-60 chars, seoDescription 150-160 chars
- description is valid HTML with internal links (/houses, /contact)
- All spec confidence values honest (0.0-1.0)
- Schema.org Product markup`
}

function buildGenericPrompt(
  title: string,
  subtitle: string | undefined,
  category: string,
  specsContext: string,
  pricePerDay: string | undefined,
  slug: string | undefined
): string {
  return `Given this luxury ${category} rental listing, produce a complete SEO package as JSON.

TITLE: ${title}
${subtitle ? `DETAILS: ${subtitle}` : ""}
${pricePerDay ? `PRICE: $${pricePerDay}/day` : ""}
${specsContext ? `KNOWN SPECS:\n${specsContext}` : ""}

Return JSON:
{
  "seoTitle": "string (55-60 chars)",
  "seoDescription": "string (150-160 chars)",
  "description": "string (HTML with headings, bullets, internal links to /contact. 300-500 words.)",
  "schemaJsonLd": {},
  "imageAlts": [],
  "specifications": {}
}`
}
