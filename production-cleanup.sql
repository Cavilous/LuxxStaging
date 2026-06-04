-- Cleanup: Delete old cars from production database
-- Run this FIRST before importing new cars

DELETE FROM inventory WHERE category = 'car';

-- Verify deletion
SELECT COUNT(*) as remaining_cars FROM inventory WHERE category = 'car';
