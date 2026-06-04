-- Add slugs to existing car inventory
-- This script generates URL-friendly slugs for all cars in the inventory

UPDATE inventory 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRIM(make || ' ' || COALESCE(model, '')), 
      '[^a-zA-Z0-9\s]', '', 'g'
    ), 
    '\s+', '-', 'g'
  )
)
WHERE category = 'car' AND (slug IS NULL OR slug = '');

-- Verify the slugs were created
SELECT make, model, slug FROM inventory WHERE category = 'car' LIMIT 10;
