-- Production Import Batch 10/10
-- Cars 91-91 of 91

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'porsche GT3RS Weissach',
  NULL,
  'Experience luxury and performance with the porsche GT3RS Weissach. This stunning Grey vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1295.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"porsche","model":"GT3RS Weissach","exteriorColor":"Grey","interiorColor":"Carbon Fiber"}'::jsonb,
  '["https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-8d2DXbC/0/NWtX4wQmj2tXJ3CbbLdGn7Vcw4nKsP8WNSBSQQzRT/L/IMG_5643-L.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-FHWSxJN/0/MmxvHgrgX6hvMjtz9fjnBCWG4mVNfhGHx4Sqh7ZV7/M/IMG_5642-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-NxPd3cW/0/K3PXT38QTq2pF8PxcwJdVzL2bhfxRNc3pMdk8bnmP/M/IMG_6220-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-HrMKXHZ/0/M9QHxSW5jXxrLSwX6kvB2L47Jbk7dRTRQFt3mBMVs/M/IMG_5637-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-BzXFZNC/0/LP4gM4gNxfbFfbJt8N48c5L55NNC2mVsd6sHDtMrK/M/IMG_5636-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-8d2DXbC/0/L2Fzgqxp8RCc4T6TSBDXXKLj9XfcjhS5MPBSjHGz2/XL/IMG_5643-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition',
  true,
  false,
  NOW(),
  NOW()
);

