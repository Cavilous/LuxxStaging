-- Create ForSaleAsset table for buy/sell inventory
CREATE TABLE for_sale_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('car', 'yacht', 'villa')),
  brand TEXT,
  model TEXT,
  year INTEGER,
  specs JSONB DEFAULT '{}',
  media JSONB DEFAULT '[]', -- array of image/video URLs
  hero_image TEXT,
  
  -- Pricing structure
  advertised_price NUMERIC, -- full purchase price
  managed_asset_price NUMERIC, -- discounted price if Luxx manages
  management_terms JSONB DEFAULT '{}', -- ownerUseAllotment, minHoldMonths, revSharePctOwner, etc.
  
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Live', 'Draft', 'UnderOffer', 'Sold')),
  location TEXT,
  documents JSONB DEFAULT '[]', -- array of document URLs/metadata
  badges JSONB DEFAULT '[]', -- Featured, New, etc.
  seo JSONB DEFAULT '{}', -- meta title, description, etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Create SellIntake table for consignment leads
CREATE TABLE sell_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  asset_category TEXT NOT NULL CHECK (asset_category IN ('car', 'yacht', 'villa')),
  brand TEXT,
  model TEXT,
  year INTEGER,
  condition TEXT,
  photos JSONB DEFAULT '[]', -- uploaded photo URLs
  target_price NUMERIC,
  available_docs JSONB DEFAULT '[]', -- checkboxes for available documents
  message TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create InvestorProgram singleton table
CREATE TABLE investor_program (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL DEFAULT 'Invest with Luxx',
  subhead TEXT,
  program_bullets JSONB DEFAULT '[]', -- array of bullet points
  case_studies JSONB DEFAULT '[]', -- array of {title, result, image}
  faq JSONB DEFAULT '[]', -- array of {question, answer}
  disclaimer TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id)
);

-- Create indexes for performance
CREATE INDEX idx_for_sale_assets_category ON for_sale_assets(category);
CREATE INDEX idx_for_sale_assets_status ON for_sale_assets(status);
CREATE INDEX idx_for_sale_assets_slug ON for_sale_assets(slug);
CREATE INDEX idx_sell_intake_created_at ON sell_intake(created_at);

-- Insert default investor program data
INSERT INTO investor_program (headline, subhead, program_bullets, case_studies, faq, disclaimer) VALUES (
  'Invest with Luxx',
  'Generate returns through luxury asset ownership and management',
  '[
    "Professional asset management and maintenance",
    "Revenue sharing from luxury rentals and experiences", 
    "Owner usage privileges in Miami",
    "Transparent reporting and performance tracking"
  ]',
  '[
    {
      "title": "2022 Ferrari SF90",
      "result": "28% annual return",
      "image": "/placeholder.svg?height=200&width=300"
    },
    {
      "title": "85ft Azimut Yacht", 
      "result": "$180K net revenue",
      "image": "/placeholder.svg?height=200&width=300"
    }
  ]',
  '[
    {
      "question": "What is the minimum investment?",
      "answer": "Minimum investments vary by asset category, typically starting at $500K for managed asset programs."
    },
    {
      "question": "How often can I use the asset?",
      "answer": "Owner usage allotments are defined per asset, typically 30-60 days per year depending on the management terms."
    },
    {
      "question": "What are the management fees?",
      "answer": "Management fees are built into the revenue sharing structure, typically 40-60% to Luxx with the remainder to the owner."
    }
  ]',
  'This information is for illustrative purposes only and does not constitute investment advice. Past performance does not guarantee future results. All investments carry risk of loss.'
);

-- Add sample ForSaleAsset data (1 car, 1 yacht, 1 villa)
INSERT INTO for_sale_assets (
  slug, title, category, brand, model, year, specs, hero_image,
  advertised_price, managed_asset_price, management_terms,
  status, location, badges
) VALUES 
(
  'ferrari-sf90-stradale-2022',
  '2022 Ferrari SF90 Stradale',
  'car',
  'Ferrari',
  'SF90 Stradale',
  2022,
  '{"horsepower": 986, "miles": 4200, "transmission": "8-speed dual-clutch", "topSpeed": "211 mph"}',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC09371.jpg-O5HNBgv5aKL6h2eBmJofJr3ZkGM5Nd.jpeg',
  1250000,
  950000,
  '{"ownerUseAllotment": 45, "minHoldMonths": 24, "revSharePctOwner": 60, "revSharePctLuxx": 40, "estAnnualGross": 180000, "estAnnualNetToOwner": 108000}',
  'Live',
  'Miami Beach, FL',
  '["Featured"]'
),
(
  'azimut-85-flybridge-2021',
  '2021 Azimut 85 Flybridge',
  'yacht',
  'Azimut',
  '85 Flybridge',
  2021,
  '{"lengthFt": 85, "guests": 12, "crew": 3, "engines": "Twin MTU 16V 2000 M96L"}',
  '/placeholder.svg?height=400&width=600',
  3200000,
  2400000,
  '{"ownerUseAllotment": 60, "minHoldMonths": 36, "revSharePctOwner": 55, "revSharePctLuxx": 45, "estAnnualGross": 420000, "estAnnualNetToOwner": 231000}',
  'Live',
  'Miami Marina',
  '["New"]'
),
(
  'star-island-villa-2020',
  'Star Island Waterfront Villa',
  'villa',
  NULL,
  NULL,
  2020,
  '{"bedrooms": 7, "bathrooms": 8, "sqft": 12000, "waterfront": true, "pool": true, "dock": "80ft"}',
  '/placeholder.svg?height=400&width=600',
  18500000,
  14500000,
  '{"ownerUseAllotment": 90, "minHoldMonths": 60, "revSharePctOwner": 70, "revSharePctLuxx": 30, "estAnnualGross": 850000, "estAnnualNetToOwner": 595000}',
  'Live',
  'Star Island, Miami Beach',
  '["Featured"]'
);
