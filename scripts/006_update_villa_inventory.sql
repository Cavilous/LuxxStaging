-- Update villa inventory with new data
-- Delete existing villa/house inventory
DELETE FROM inventory WHERE category IN ('villa', 'house');

-- Insert new villa inventory
INSERT INTO inventory (
  make, 
  model, 
  category, 
  price_per_day, 
  specifications, 
  is_published, 
  is_featured,
  slug,
  created_at,
  updated_at
) VALUES 
-- Villa Justa - Miami Shores
('Villa Justa', '7BR Luxury Villa', 'villa', 1595, 
 '{"bedrooms": 7, "bathrooms": null, "guests": 16, "security_deposit": 1000, "cleaning_fee": 750, "location": "Miami Shores"}', 
 true, true, 'villa-justa', NOW(), NOW()),

-- Villa Fe - Miami Shores  
('Villa Fe', '5BR Villa Faith', 'villa', 950,
 '{"bedrooms": 5, "bathrooms": null, "guests": 14, "security_deposit": 1000, "cleaning_fee": 500, "location": "Miami Shores"}',
 true, false, 'villa-fe', NOW(), NOW()),

-- Villa Celeste - Fort Lauderdale
('Villa Celeste', '5BR Luxury Villa', 'villa', 1925,
 '{"bedrooms": 5, "bathrooms": 6, "guests": null, "security_deposit": 1000, "cleaning_fee": 650, "location": "Fort Lauderdale"}',
 true, false, 'villa-celeste', NOW(), NOW()),

-- Villa Coraline - Coral Gables
('Villa Coraline', '5BR Villa', 'villa', 1195,
 '{"bedrooms": 5, "bathrooms": null, "guests": 14, "security_deposit": 1000, "cleaning_fee": 600, "location": "Coral Gables"}',
 true, false, 'villa-coraline', NOW(), NOW()),

-- Villa Felipe - Fort Lauderdale
('Villa Felipe', 'Luxury Villa', 'villa', 995,
 '{"bedrooms": 5, "bathrooms": 4.5, "guests": 12, "security_deposit": 1000, "cleaning_fee": 600, "location": "Fort Lauderdale"}',
 true, false, 'villa-felipe', NOW(), NOW()),

-- Villa Myriam - Miami Shores
('Villa Myriam', '6BR Luxury Villa', 'villa', 2095,
 '{"bedrooms": 6, "bathrooms": 5.5, "guests": 14, "security_deposit": 2500, "cleaning_fee": 750, "location": "Miami Shores"}',
 true, true, 'villa-myriam', NOW(), NOW()),

-- Villa Myka - Miami Beach (Rate upon request)
('Villa Myka', '7BR Luxury Villa', 'villa', null,
 '{"bedrooms": 7, "bathrooms": 7.5, "guests": null, "security_deposit": "price upon request", "cleaning_fee": "inquire", "rate_upon_request": true, "location": "Miami Beach"}',
 true, true, 'villa-myka', NOW(), NOW()),

-- Villa Indonesia - Miami Beach (Rate upon request)
('Villa Indonesia', '6BR Luxury Villa', 'villa', null,
 '{"bedrooms": 6, "bathrooms": 5.5, "guests": null, "security_deposit": "price upon request", "cleaning_fee": "inquire", "rate_upon_request": true, "location": "Miami Beach"}',
 true, false, 'villa-indonesia', NOW(), NOW()),

-- LUXXFINITY Penthouse - Downtown Miami
('LUXXFINITY Penthouse', 'Luxury Penthouse', 'villa', 2250,
 '{"bedrooms": 5, "bathrooms": 7.5, "guests": 10, "security_deposit": 7500, "cleaning_fee": 800, "location": "Downtown Miami"}',
 true, true, 'luxxfinity-penthouse', NOW(), NOW()),

-- Villa Terruar - Davie
('Villa Terruar', '7BR Luxury Villa', 'villa', 2195,
 '{"bedrooms": 7, "bathrooms": 4, "guests": 18, "security_deposit": 2500, "cleaning_fee": 850, "location": "Davie"}',
 true, false, 'villa-terruar', NOW(), NOW()),

-- Villa Fort - Miami Beach (Rate upon request)
('Villa Fort', '8BR Luxury Villa', 'villa', null,
 '{"bedrooms": 8, "bathrooms": 8.5, "guests": null, "security_deposit": "price upon request", "cleaning_fee": "inquire", "rate_upon_request": true, "location": "Miami Beach"}',
 true, false, 'villa-fort', NOW(), NOW()),

-- Villa Flor - Design District
('Villa Flor', '6BR Luxury Villa', 'villa', 1595,
 '{"bedrooms": 6, "bathrooms": 4.5, "guests": null, "security_deposit": 1000, "cleaning_fee": 650, "location": "Design District"}',
 true, false, 'villa-flor', NOW(), NOW()),

-- Villa Land - Hallandale Beach
('Villa Land', '5BR Villa', 'villa', 825,
 '{"bedrooms": 5, "bathrooms": 4, "guests": null, "security_deposit": "price upon request", "cleaning_fee": "inquire", "location": "Hallandale Beach"}',
 true, false, 'villa-land', NOW(), NOW()),

-- Villa Zar - Coral Gables
('Villa Zar', '5BR Luxury Villa', 'villa', 1395,
 '{"bedrooms": 5, "bathrooms": 5, "guests": 13, "security_deposit": 1000, "cleaning_fee": 600, "location": "Coral Gables"}',
 true, false, 'villa-zar', NOW(), NOW()),

-- Villa Cielo - Coconut Grove
('Villa Cielo', '4BR Villa', 'villa', 1995,
 '{"bedrooms": 4, "bathrooms": 5.5, "guests": 8, "security_deposit": 2500, "cleaning_fee": 650, "location": "Coconut Grove"}',
 true, false, 'villa-cielo', NOW(), NOW()),

-- Villa Mel - Coral Gables
('Villa Mel', '7BR Luxury Villa', 'villa', 1895,
 '{"bedrooms": 7, "bathrooms": 6, "guests": 12, "security_deposit": 1000, "cleaning_fee": 650, "location": "Coral Gables"}',
 true, false, 'villa-mel', NOW(), NOW()),

-- Villa Nick - Miami Beach (Rate upon request)
('Villa Nick', '5BR Villa', 'villa', null,
 '{"bedrooms": 5, "bathrooms": 5.5, "guests": null, "security_deposit": "price upon request", "cleaning_fee": "inquire", "rate_upon_request": true, "location": "Miami Beach"}',
 true, false, 'villa-nick', NOW(), NOW()),

-- Villa Granada - West Miami
('Villa Granada', '5BR Villa', 'villa', 799,
 '{"bedrooms": 5, "bathrooms": 4, "guests": 10, "security_deposit": 1000, "cleaning_fee": 650, "location": "West Miami"}',
 true, false, 'villa-granada', NOW(), NOW()),

-- Villa Casna - South Miami
('Villa Casna', '7BR Luxury Villa', 'villa', 1950,
 '{"bedrooms": 7, "bathrooms": 4, "guests": 12, "security_deposit": 2500, "cleaning_fee": 850, "location": "South Miami"}',
 true, false, 'villa-casna', NOW(), NOW()),

-- Villa Palma - Fort Lauderdale
('Villa Palma', '6BR Luxury Villa', 'villa', 2095,
 '{"bedrooms": 6, "bathrooms": 5.5, "guests": 16, "security_deposit": 2500, "cleaning_fee": 750, "location": "Fort Lauderdale"}',
 true, false, 'villa-palma', NOW(), NOW()),

-- Villa Vendimia - Miami Beach (Rate upon request)
('Villa Vendimia', '7BR Luxury Villa', 'villa', null,
 '{"bedrooms": 7, "bathrooms": 6.5, "guests": null, "security_deposit": "inquire", "cleaning_fee": "inquire", "rate_upon_request": true, "location": "Miami Beach"}',
 true, false, 'villa-vendimia', NOW(), NOW()),

-- Villa Laguna - South Miami
('Villa Laguna', '5BR Villa', 'villa', 1395,
 '{"bedrooms": 5, "bathrooms": 5.5, "guests": null, "security_deposit": 1000, "cleaning_fee": 650, "location": "South Miami"}',
 true, false, 'villa-laguna', NOW(), NOW()),

-- Villa Cofler - Miami Shores
('Villa Cofler', '6BR Luxury Villa', 'villa', 2095,
 '{"bedrooms": 6, "bathrooms": 6.5, "guests": 12, "security_deposit": 2500, "cleaning_fee": 750, "location": "Miami Shores"}',
 true, false, 'villa-cofler', NOW(), NOW()),

-- Villa Vivian - Biscayne Bay
('Villa Vivian', '5BR Villa', 'villa', 3250,
 '{"bedrooms": 5, "bathrooms": 4, "guests": 12, "security_deposit": null, "cleaning_fee": "inquire", "location": "Biscayne Bay"}',
 true, true, 'villa-vivian', NOW(), NOW()),

-- Villa Sabrina - Fort Lauderdale
('Villa Sabrina', '4BR Villa', 'villa', 995,
 '{"bedrooms": 4, "bathrooms": 4.5, "guests": 10, "security_deposit": 1000, "cleaning_fee": 600, "location": "Fort Lauderdale"}',
 true, false, 'villa-sabrina', NOW(), NOW());
