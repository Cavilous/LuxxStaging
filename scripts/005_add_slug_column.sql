-- Add slug column to inventory table
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS slug text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS inventory_slug_idx ON inventory(slug);

-- Update existing yacht records with slugs
UPDATE inventory 
SET slug = CASE 
  WHEN make = 'Celebration (Ferry)' THEN 'celebration'
  WHEN make = 'Technomar' THEN 'technomar'
  WHEN make = 'Princess' THEN 'princess'
  WHEN make = 'Rodman W/ Jacuzzi' THEN 'rodman-jacuzzi'
  WHEN make = 'Leopard' AND specifications->>'length' = '115''' THEN 'leopard-115'
  WHEN make = 'Paladin' THEN 'paladin'
  WHEN make = 'Azimut Daniella+' THEN 'azimut-daniella'
  WHEN make = 'Pershing' AND specifications->>'length' = '94''' THEN 'pershing-94'
  WHEN make = 'Leopard' AND specifications->>'length' = '94''' THEN 'leopard-94'
  WHEN make = 'Pershing' AND specifications->>'length' = '90''' THEN 'pershing-90'
  WHEN make = 'Azimut Contemp (Flame 2 Sea)' THEN 'azimut-contemp'
  WHEN make = 'Wally' THEN 'wally'
  WHEN make = 'Panther' THEN 'panther'
  WHEN make = 'Pershing' AND specifications->>'length' = '82''' THEN 'pershing-82'
  WHEN make = 'AICON' THEN 'aicon'
  WHEN make = 'Adonis Numarine' THEN 'adonis-numarine'
  WHEN make = 'Aicon Therapy' THEN 'aicon-therapy'
  WHEN make = 'Ferretti Lumar +' THEN 'ferretti-lumar'
  WHEN make = 'Azimut' AND specifications->>'length' = '72''' THEN 'azimut-72'
  WHEN make = 'Azimut Flybridge 1' THEN 'azimut-flybridge-1'
  WHEN make = 'Azimut Flybridge 2' THEN 'azimut-flybridge-2'
  WHEN make = 'Prestige' THEN 'prestige'
  WHEN make = 'Marquis' THEN 'marquis'
  WHEN make = 'Azimut Deon' THEN 'azimut-deon'
  WHEN make = '50 Luxx' THEN '50-luxx'
  ELSE LOWER(REPLACE(REPLACE(make, ' ', '-'), '/', '-'))
END
WHERE category = 'yacht';

-- Update any remaining NULL slugs with a fallback
UPDATE inventory 
SET slug = LOWER(REPLACE(REPLACE(COALESCE(make, 'yacht'), ' ', '-'), '/', '-')) || '-' || SUBSTRING(id::text, 1, 8)
WHERE slug IS NULL AND category = 'yacht';
