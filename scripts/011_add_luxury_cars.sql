-- Add luxury car inventory with proper titles and data structure
DELETE FROM inventory WHERE category = 'car';

INSERT INTO inventory (
  id,
  category,
  make,
  model,
  year,
  price_per_day,
  price_per_hour,
  color,
  description,
  specifications,
  images,
  badges,
  is_published,
  is_featured,
  slug,
  created_at,
  updated_at
) VALUES 
-- Ferrari SF90 Stradale
(
  gen_random_uuid(),
  'car',
  'Ferrari',
  'SF90 Stradale',
  2024,
  2495.00,
  312.00,
  'Rosso Corsa Red',
  'Experience the pinnacle of Ferrari engineering with the SF90 Stradale. This hybrid supercar combines a twin-turbo V8 with three electric motors, delivering 986 horsepower of pure exhilaration. Perfect for Miami''s most exclusive events.',
  '{"horsepower": 986, "acceleration": "2.5s 0-60mph", "top_speed": "211mph", "engine": "4.0L Twin-Turbo V8 + Electric Motors", "transmission": "8-Speed Dual-Clutch", "drivetrain": "AWD", "fuel_type": "Hybrid", "seats": 2}',
  ARRAY['/placeholder.svg?height=400&width=600'],
  ARRAY['Hybrid Supercar', 'Track Ready', 'Limited Edition'],
  true,
  true,
  'ferrari-sf90-stradale',
  NOW(),
  NOW()
),
-- Lamborghini Huracán EVO
(
  gen_random_uuid(),
  'car',
  'Lamborghini',
  'Huracán EVO',
  2024,
  2195.00,
  275.00,
  'Verde Mantis Green',
  'The Lamborghini Huracán EVO represents the evolution of the most successful V10-powered Lamborghini ever. With its naturally aspirated V10 engine and advanced aerodynamics, it delivers an authentic supercar experience on Miami''s streets.',
  '{"horsepower": 630, "acceleration": "2.9s 0-60mph", "top_speed": "202mph", "engine": "5.2L Naturally Aspirated V10", "transmission": "7-Speed Dual-Clutch", "drivetrain": "AWD", "fuel_type": "Gasoline", "seats": 2}',
  ARRAY['/placeholder.svg?height=400&width=600'],
  ARRAY['V10 Engine', 'All-Wheel Drive', 'Track Focused'],
  true,
  true,
  'lamborghini-huracan-evo',
  NOW(),
  NOW()
),
-- Rolls-Royce Cullinan
(
  gen_random_uuid(),
  'car',
  'Rolls-Royce',
  'Cullinan',
  2024,
  1895.00,
  237.00,
  'Arctic White',
  'The Rolls-Royce Cullinan is the ultimate luxury SUV, combining the brand''s legendary craftsmanship with commanding presence. Perfect for sophisticated Miami adventures with unparalleled comfort and prestige.',
  '{"horsepower": 563, "acceleration": "4.8s 0-60mph", "top_speed": "155mph", "engine": "6.75L Twin-Turbo V12", "transmission": "8-Speed Automatic", "drivetrain": "AWD", "fuel_type": "Gasoline", "seats": 5}',
  ARRAY['/placeholder.svg?height=400&width=600'],
  ARRAY['Ultra Luxury', 'Hand-Crafted Interior', 'Bespoke Options'],
  true,
  true,
  'rolls-royce-cullinan',
  NOW(),
  NOW()
),
-- McLaren 720S
(
  gen_random_uuid(),
  'car',
  'McLaren',
  '720S',
  2024,
  2295.00,
  287.00,
  'Azura Blue',
  'The McLaren 720S delivers breathtaking performance with its carbon fiber construction and twin-turbo V8. Experience Formula 1-derived technology in a road-legal supercar that dominates Miami''s premium car scene.',
  '{"horsepower": 710, "acceleration": "2.7s 0-60mph", "top_speed": "212mph", "engine": "4.0L Twin-Turbo V8", "transmission": "7-Speed Dual-Clutch", "drivetrain": "RWD", "fuel_type": "Gasoline", "seats": 2}',
  ARRAY['/placeholder.svg?height=400&width=600'],
  ARRAY['Carbon Fiber Body', 'Active Aerodynamics', 'Track Proven'],
  true,
  false,
  'mclaren-720s',
  NOW(),
  NOW()
),
-- Bentley Continental GT
(
  gen_random_uuid(),
  'car',
  'Bentley',
  'Continental GT',
  2024,
  1695.00,
  212.00,
  'Beluga Black',
  'The Bentley Continental GT combines handcrafted luxury with grand touring performance. This elegant coupe offers the perfect blend of British refinement and powerful performance for Miami''s most discerning clients.',
  '{"horsepower": 626, "acceleration": "3.6s 0-60mph", "top_speed": "207mph", "engine": "6.0L Twin-Turbo W12", "transmission": "8-Speed Dual-Clutch", "drivetrain": "AWD", "fuel_type": "Gasoline", "seats": 4}',
  ARRAY['/placeholder.svg?height=400&width=600'],
  ARRAY['Handcrafted Interior', 'Grand Tourer', 'British Luxury'],
  true,
  false,
  'bentley-continental-gt',
  NOW(),
  NOW()
);

-- Update the title field for all cars (computed from make and model)
UPDATE inventory 
SET 
  subtitle = CASE 
    WHEN make = 'Ferrari' THEN 'Italian Supercar Excellence'
    WHEN make = 'Lamborghini' THEN 'Raging Bull Performance'
    WHEN make = 'Rolls-Royce' THEN 'The Pinnacle of Luxury'
    WHEN make = 'McLaren' THEN 'Formula 1 Technology'
    WHEN make = 'Bentley' THEN 'British Grand Touring'
    ELSE 'Luxury Performance Vehicle'
  END
WHERE category = 'car';

-- Add computed title field (this should be handled by a trigger or computed column in production)
UPDATE inventory 
SET specifications = specifications || jsonb_build_object('title', make || ' ' || model)
WHERE category = 'car';
