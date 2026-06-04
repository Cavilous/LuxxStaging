-- Add Double Shot yacht to inventory
INSERT INTO inventory (
    id,
    make,
    model,
    category,
    price_per_hour,
    specifications,
    description,
    images,
    location,
    is_published,
    is_featured,
    slug,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Double Shot',
    'Luxury Motor Yacht',
    'yacht',
    9995,
    '{
        "length": "95ft",
        "guests": 12,
        "crew": 3,
        "cruising_speed": "28 knots",
        "max_speed": "35 knots",
        "amenities": ["Premium sound system", "Water toys", "Full bar", "Spacious deck", "Air conditioning", "Professional crew"]
    }',
    'Experience luxury at its finest aboard Double Shot, a stunning 95-foot motor yacht featuring a distinctive red hull stripe and modern design. This high-performance vessel offers spacious deck areas, premium amenities, and professional crew service for the ultimate Miami charter experience.',
    '["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/double-shot.jpg-bfLtuMvbPEYDdDOxWOk7p7krrIrbTK.jpeg"]',
    'Miami Beach',
    true,
    true,
    'double-shot',
    NOW(),
    NOW()
);
