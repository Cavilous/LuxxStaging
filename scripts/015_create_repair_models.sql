-- Create repair service package model
CREATE TABLE repair_service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ppf', 'wrap', 'tint', 'wheels', 'aero', 'interior', 'mechanical')),
  subtitle TEXT,
  description TEXT,
  inclusions JSONB DEFAULT '[]'::jsonb,
  estimated_turnaround_days INTEGER,
  starting_price NUMERIC(10,2),
  badges JSONB DEFAULT '[]'::jsonb,
  media JSONB DEFAULT '[]'::jsonb,
  hero_image TEXT,
  seo JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Create collision capability model
CREATE TABLE collision_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  oem_brands JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  equipment JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create repair lead model
CREATE TABLE repair_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('insurance', 'custom')),
  priority BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact info
  contact JSONB NOT NULL,
  
  -- Vehicle info
  vehicle JSONB NOT NULL,
  
  -- Insurance info (for insurance type)
  insurance JSONB,
  
  -- Service selections (for custom type)
  selections JSONB,
  
  -- Media references
  media JSONB DEFAULT '[]'::jsonb,
  
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'estimating', 'approved', 'in_shop', 'ready', 'delivered', 'lost')),
  
  -- Internal management
  internal_notes TEXT,
  assigned_owner UUID REFERENCES admin_users(id),
  
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Insert sample repair service packages
INSERT INTO repair_service_packages (slug, title, category, subtitle, description, inclusions, estimated_turnaround_days, starting_price, badges, hero_image) VALUES
('full-body-ppf-track-gloss', 'Full-Body PPF – Track Gloss', 'ppf', 'Ultimate protection for track days', 'Complete paint protection film coverage with high-gloss finish for maximum durability and clarity.', '["Full vehicle coverage", "10-year warranty", "Self-healing technology", "UV protection", "Professional installation"]', 7, 8500.00, '["Featured"]', '/placeholder.svg?height=400&width=600'),
('carbon-fiber-wrap', 'Carbon Fiber Wrap', 'wrap', 'Aggressive racing aesthetic', 'Premium 3M carbon fiber vinyl wrap with authentic texture and deep gloss finish.', '["3M premium vinyl", "5-year warranty", "Custom color matching", "Professional installation", "Paint-safe removal"]', 5, 4500.00, '["New"]', '/placeholder.svg?height=400&width=600'),
('ceramic-window-tint', 'Ceramic Window Tint', 'tint', 'Heat rejection & privacy', 'High-performance ceramic tint for maximum heat rejection and UV protection.', '["Ceramic technology", "99% UV protection", "Lifetime warranty", "Heat rejection", "Glare reduction"]', 1, 800.00, '[]', '/placeholder.svg?height=400&width=600'),
('forged-wheel-package', 'Forged Wheel Package', 'wheels', 'Custom forged wheels', 'Lightweight forged wheels with custom finishes and performance tires.', '["Custom sizing", "Multiple finishes", "Performance tires", "Professional mounting", "Alignment included"]', 14, 12000.00, '["Featured"]', '/placeholder.svg?height=400&width=600'),
('aero-body-kit', 'Aerodynamic Body Kit', 'aero', 'Track-focused aerodynamics', 'Carbon fiber aerodynamic enhancements for improved downforce and aesthetics.', '["Carbon fiber construction", "Wind tunnel tested", "Custom fitment", "Professional installation", "Paint matching available"]', 10, 15000.00, '[]', '/placeholder.svg?height=400&width=600'),
('luxury-interior-upgrade', 'Luxury Interior Upgrade', 'interior', 'Bespoke interior refinement', 'Custom leather, Alcantara, and carbon fiber interior enhancements.', '["Premium materials", "Custom stitching", "Color matching", "OEM+ quality", "Professional installation"]', 21, 8000.00, '[]', '/placeholder.svg?height=400&width=600');

-- Insert sample collision capabilities
INSERT INTO collision_capabilities (title, description, oem_brands, services, certifications, equipment, sort_order) VALUES
('Aluminum Chassis Repair', 'Specialized aluminum frame straightening and repair for exotic vehicles', '["Ferrari", "Lamborghini", "McLaren", "Aston Martin", "Porsche GT"]', '["Frame straightening", "Aluminum welding", "Structural analysis", "Geometry correction"]', '["I-CAR Platinum", "Aluminum Specialist"]', '["Celette frame machine", "Aluminum welding station"]', 1),
('Carbon Fiber Restoration', 'Expert carbon fiber panel repair and refinishing', '["McLaren", "Lamborghini", "Ferrari", "Bugatti", "Koenigsegg"]', '["Carbon repair", "Clear coat refinishing", "Structural integrity testing", "OEM pattern matching"]', '["Carbon Fiber Specialist", "OEM Certified"]', '["Autoclave chamber", "Carbon fiber tools"]', 2),
('ADAS Calibration', 'Advanced driver assistance system recalibration after collision repair', '["Ferrari", "Lamborghini", "McLaren", "Porsche", "Bentley", "Rolls-Royce"]', '["Camera calibration", "Radar alignment", "Sensor testing", "System validation"]', '["OEM Certified", "ADAS Specialist"]', '["Autel calibration system", "OEM diagnostic tools"]', 3),
('OEM Paint Matching', 'Factory-perfect paint matching and application', '["Ferrari", "Lamborghini", "McLaren", "Rolls-Royce", "Bentley", "Porsche", "Aston Martin", "Bugatti"]', '["Color matching", "Multi-stage paint", "Clear coat application", "Paint correction"]', '["PPG Certified", "OEM Paint Specialist"]', '["Paint booth", "Spectrophotometer", "Spray guns"]', 4);

-- Create indexes for performance
CREATE INDEX idx_repair_service_packages_category ON repair_service_packages(category);
CREATE INDEX idx_repair_service_packages_published ON repair_service_packages(is_published);
CREATE INDEX idx_repair_leads_type ON repair_leads(type);
CREATE INDEX idx_repair_leads_priority ON repair_leads(priority);
CREATE INDEX idx_repair_leads_status ON repair_leads(status);
CREATE INDEX idx_repair_leads_created_at ON repair_leads(created_at);
CREATE INDEX idx_collision_capabilities_active ON collision_capabilities(is_active);
CREATE INDEX idx_collision_capabilities_order ON collision_capabilities(sort_order);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_repair_service_packages_updated_at BEFORE UPDATE ON repair_service_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collision_capabilities_updated_at BEFORE UPDATE ON collision_capabilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_repair_leads_updated_at BEFORE UPDATE ON repair_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
