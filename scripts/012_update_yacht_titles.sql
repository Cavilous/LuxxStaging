UPDATE inventory 
SET 
  title = make,
  subtitle = CASE 
    WHEN make = 'Celebration' THEN 'Ferry-Style Charter Yacht'
    WHEN make = 'Technomar' THEN 'Luxury Motor Yacht'
    WHEN make = 'Princess' THEN 'Premium Luxury Yacht'
    WHEN make = 'Wally' THEN 'High-Performance Yacht'
    WHEN make = 'Double Shot' THEN 'Sport Motor Yacht'
    ELSE 'Luxury Charter Yacht'
  END
WHERE category = 'yacht' AND title IS NULL;
