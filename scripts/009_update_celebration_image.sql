-- Update Celebration yacht with the provided image
UPDATE inventory 
SET 
  images = ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/celebration-1.jpg-9cCGJJBrB9LvZM2DNLuLxCscCspOPW.jpeg'],
  updated_at = NOW()
WHERE 
  category = 'yacht' 
  AND LOWER(make) = 'celebration';

-- Also update the description to be more specific
UPDATE inventory 
SET 
  description = 'Luxury ferry-style yacht perfect for group charters and events. Features multiple decks, panoramic windows, and spacious passenger areas with stunning Miami skyline views.',
  updated_at = NOW()
WHERE 
  category = 'yacht' 
  AND LOWER(make) = 'celebration';
