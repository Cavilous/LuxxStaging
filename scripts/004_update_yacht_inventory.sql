-- Clear existing yacht inventory and insert new yacht data
-- Delete existing yacht inventory
DELETE FROM inventory WHERE category = 'yacht';

-- Insert new yacht inventory from the provided list
INSERT INTO inventory (
  id,
  make,
  model,
  category,
  price_per_hour,
  specifications,
  is_published,
  is_featured,
  created_at,
  updated_at
) VALUES
  (gen_random_uuid(), 'Celebration', 'Ferry', 'yacht', 8595, '{"length": "120''"}', true, true, now(), now()),
  (gen_random_uuid(), 'Technomar', '', 'yacht', 8995, '{"length": "120''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Princess', '', 'yacht', 15995, '{"length": "100''"}', true, true, now(), now()),
  (gen_random_uuid(), 'Rodman W/ Jacuzzi', '', 'yacht', 6995, '{"length": "110''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Leopard', '', 'yacht', 7195, '{"length": "115''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Paladin', '', 'yacht', 7195, '{"length": "100''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Azimut Daniella+', '', 'yacht', 7595, '{"length": "100''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Pershing', '', 'yacht', 7195, '{"length": "94''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Leopard', '', 'yacht', 7195, '{"length": "94''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Pershing', '', 'yacht', 6995, '{"length": "90''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Azimut Contemp', 'Flame 2 Sea', 'yacht', 6795, '{"length": "90''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Wally', '', 'yacht', 8995, '{"length": "85''"}', true, true, now(), now()),
  (gen_random_uuid(), 'Panther', '', 'yacht', 6195, '{"length": "84''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Pershing', '', 'yacht', 6095, '{"length": "82''"}', true, false, now(), now()),
  (gen_random_uuid(), 'AICON', '', 'yacht', 4495, '{"length": "80''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Adonis Numarine', '', 'yacht', 6195, '{"length": "80''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Aicon Therapy', '', 'yacht', 5995, '{"length": "80''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Ferretti Lumar +', '', 'yacht', 4095, '{"length": "75''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Azimut', '', 'yacht', 4195, '{"length": "72''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Azimut Flybridge 1', '', 'yacht', 5995, '{"length": "70''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Azimut Flybridge 2', '', 'yacht', 5995, '{"length": "70''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Prestige', '', 'yacht', 4495, '{"length": "68''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Marquis', '', 'yacht', 4559, '{"length": "66''"}', true, false, now(), now()),
  (gen_random_uuid(), 'Azimut Deon', '', 'yacht', 4495, '{"length": "64''"}', true, false, now(), now()),
  (gen_random_uuid(), '50 Luxx', '', 'yacht', 1895, '{"length": "50''"}', true, false, now(), now());
