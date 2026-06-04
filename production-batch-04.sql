-- Production Import Batch 4/10
-- Cars 31-40 of 91

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'Ferrari 488',
  'Black / Black',
  'Experience luxury and performance with the Ferrari 488. This stunning black / black vehicle delivers an unforgettable driving experience in Miami.',
  '1195.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"brand":"Ferrari","seats":2,"bodyType":"Supercar","horsepower":661,"acceleration":"3.0s","transmission":"Automatic"}'::jsonb,
  '["https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-cbH2XtZ/0/KnsStBBJGbvzKRrhrxd6cqDGpGZNp6DNzPKc7h29W/L/DSC05199-L.jpg","https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-JctqdhJ/0/LBv44zc7cQFzZmk9zgwQdxRFjFKbPVQM6KmChMjXz/M/DSC05240-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-s8LkVgL/0/M8wGJw8qrHjfnrVPzcsqTz3BJP8vd3vKt97qrvJPf/M/DSC05312-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-4qPQ4Hq/0/LrP3VCbtvPNSWHw4W8ZLNDfDzndKpCqPg7Kd368Dh/M/DSC05245-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-BK28RZf/0/NTsvSjkDm6WMBMJZ9PpvQPsvpR8sXzj5ZwM9GpgZ4/M/DSC05254-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-cbH2XtZ/0/M5Tnwcvgk3Bk9CdVtgFtD8fVJt43HsKmb9QTV2zDc/XL/DSC05199-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder',
  true,
  true,
  NOW(),
  NOW()
);

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'Ferrari 812 Superfast',
  'White / Red',
  'Experience luxury and performance with the Ferrari 812 Superfast. This stunning white / red vehicle delivers an unforgettable driving experience in Miami.',
  '2395.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"brand":"Ferrari","seats":2,"bodyType":"Supercar","horsepower":789,"acceleration":"2.9s","transmission":"Automatic"}'::jsonb,
  '["https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-D9BStFd/0/LhrkhHvqFBkrSdPzLst6sWTfqQBXRVmB4fW442rD9/L/6EC07618-8A2E-4083-994E-4113888F6B09-L.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-D9BStFd/0/KLhfXxTF8s7cfBMjzjgCDpTtGC9BB5vnkvGFKrZgM/M/6EC07618-8A2E-4083-994E-4113888F6B09-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-xHsJts2/0/MMWJS2T6Rtfgtg264FPvt9KMLR2RS8SMSr8Pzxn4Z/M/76D51838-AFE8-4AA6-8A54-AEF95BD5DF86-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-sfFJvZF/0/LngRLVSnbNkHzzj9LvgTFdHgJxPGh6drgnw9jmMgw/M/C0C2F28B-D9B7-42FE-AD57-88E7E88DCDEF-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-dXNW78v/0/NPWMThcphstDMQJ7GJd6bhM77C8pLxz8QmNzWRkGJ/M/18FCEAC9-22DD-441E-AB3B-06BAD9FB6F0C-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-D9BStFd/0/KGtxXVMskXkcgGbdNRqSWzSsSRh59L4PJV9jrFbzP/XL/6EC07618-8A2E-4083-994E-4113888F6B09-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray',
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'Ferrari F8',
  NULL,
  'Experience luxury and performance with the Ferrari F8. This stunning Red vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1795.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"Ferrari","model":"F8","exteriorColor":"Red","interiorColor":"Peanut Butter"}'::jsonb,
  '["https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-tZnsqTJ/0/LKwkcKHvc4dmQzJd9RQS49Dds5W8gVKs8f9KVWg4w/L/DSC01802-L.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-tZnsqTJ/0/MdcL3pBBtCwQkpVBSK8CMVg9m9DzH9Gz2QdPmP9cz/M/DSC01802-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-NHcq6Hm/0/MSKkP4rTG6nJrwSRcMMhTqNgPvL6RKC6sdwq9WfZk/M/DSC01808-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-h6Wc6cz/0/MHhRBNm3CzppwLFxCH4wjqJ2gLfzVkdzXqmqq9wQn/M/DSC01845-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-3k6HqSf/0/Ls58WZm7rVPk48Z3k2q3LqSq6h5cJjVk5BqN3Ddmm/M/DSC01857-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-tZnsqTJ/0/Ksnd7pXcfHqRVbL9JZjTtRsVb5T7DSMgKhtDRfCdf/XL/DSC01802-XL.jpg"]'::jsonb,
  'https://carsforrent.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider',
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'Ferrari SF-90',
  'Grey / Black',
  'Experience luxury and performance with the Ferrari SF-90. This stunning grey / black vehicle delivers an unforgettable driving experience in Miami.',
  '2595.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"brand":"Ferrari","seats":2,"bodyType":"Supercar","horsepower":986,"acceleration":"2.5s","transmission":"Automatic"}'::jsonb,
  '["https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-r6DFPhh/0/LnxnxNfzXdKHgWNHfTWxBd3mDXKh5NR2cdfsvJpnx/L/DSC09371-L.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-Sd2n37k/0/MZhTgrL5XZMT3vbDWJwSfbqhH2hzNFbrm6r5VWdP3/M/Snapinsta.app_video_4844B44A7B54566CD740393A888430A4_video_dashinit-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-BL5g5G9/0/NPSBrZQtfnHLHNSwzzq5Hj3NbLNhcbQRDPtLCrQWP/M/DSC09294-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-7WSTDzS/0/Kgc8CR9zrRpZmjw2tPCcjGTmrRTjbx3VQwGjmScNj/M/DSC09303-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-zGwCVSN/0/NVP72SD5JmsKChvvdV2sPd9PQ9tGFvMXj2pQvkV2G/M/DSC09336-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-r6DFPhh/0/M2mCvd7zm88x6hbcHssxQqvn9hgBx4J4RTNrmQX6r/XL/DSC09371-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/AVAILABLE-CARS/Ferrari-SF90',
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'LAMBORGHINI HURACAN EVO',
  NULL,
  'Experience luxury and performance with the LAMBORGHINI HURACAN EVO. This stunning BLACK vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1095.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"LAMBORGHINI","model":"HURACAN EVO","exteriorColor":"BLACK","interiorColor":"ORANGE"}'::jsonb,
  '["https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-Tqq7HmZ/0/MXvv3crJVdQFFWbk88mx4H25hz4339dNnNG7365KC/L/Photo%20May%2007%202025%2C%203%2057%2008%20PM-L.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-Tqq7HmZ/0/KDz9M9QzQkrjXp3ZxV8rGx3Qsc6wfHKx2WqqhQ7cd/M/Photo%20May%2007%202025%2C%203%2057%2008%20PM-M.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-c5sp76c/0/Nh6qJ7bT45Q7WqRbqW5SGFrWhFg5fnG4mNWvTbN9D/M/hurracan6-M.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-XPTHct4/0/K9N6hkFHxbBnxjSDF3fS25QJkFh5bn5GQRMmzx2wn/M/hurracan4-M.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-WdZHmd3/0/MkxF2BTKZRqgFdsbfX4HtDVFpL8z5Q6nzhr2fsxSr/M/Photo%20May%2004%202025%2C%209%2059%2006%20PM-M.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-Tqq7HmZ/0/MfgwJShzDQr8tR3pmDgK2Lmn2Cw9bqCvzTd9MV5B2/XL/Photo%20May%2007%202025%2C%203%2057%2008%20PM-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange',
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'LAMBORGHINI HURACAN TECNICA',
  NULL,
  'Experience luxury and performance with the LAMBORGHINI HURACAN TECNICA. This stunning BABY BLUE vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1195.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"LAMBORGHINI","model":"HURACAN TECNICA","exteriorColor":"BABY BLUE"}'::jsonb,
  '["https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-qxnpQm3/0/Kkjx6bVfJKdhVFxS5DcrHKXbwB9G5vVsLHzppkv5N/L/DSC01584-L.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-qxnpQm3/0/KPR6gKXrQdx2t4zdfJGfnrZCL5WgwsXhcrqdg5s9k/M/DSC01584-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-kLDg5Mb/0/Mq2mLFC5LQG4BrzjRVJtGzBvm8dxDfC6wXVPggdFL/M/DSC01598-Edit-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-56C6m34/0/Ld7XL3wWBqDQ2ZKhHXhHqPxp5Jqm7B44p67H243Md/M/DSC01617-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-rTW6QST/0/LmqBz5sWWRGB8FwWsP97dFkwMJJZVMbKmWP9tPC67/M/DSC01632-Edit-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-qxnpQm3/0/M9rpGVwGFZQn6qkTSf2Vvkbw8nsgdvTbq4XKztqNx/XL/DSC01584-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica',
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'LAMBORGHINI URUS',
  NULL,
  'Experience luxury and performance with the LAMBORGHINI URUS. This stunning White vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1095.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"LAMBORGHINI","model":"URUS","exteriorColor":"White","interiorColor":"Orange"}'::jsonb,
  '["https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-kr2v5pr/0/KgJGXVkpvKxDJ4qsh8wmfkFxz3pjKMcr2hJsVZdqF/L/IMG_9091-L.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-kr2v5pr/0/LM5q42kKvmLdgj3kqsCfm4nGN7ZGRwMbFKJTds4Bz/M/IMG_9091-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-Rzpw5XM/0/NKTD5ttt2f2sMKSbXtKw2R3Jf2gzWDFqLMZG3rLG2/M/IMG_9092-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-qWvTXGh/0/LK6GmrkC3hWxLBGb4B3JJKBHqfPw722xfMsg464Tt/M/IMG_9093-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-gMd36ct/0/Ld6MgMVFVdNJKH8BqT56d89b9bC99rk6P6nBKK8GR/M/IMG_9094-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-kr2v5pr/0/M8VDb9DFJWnhNMsQW8XP92XkLfWRPqbj5WJmC7mTN/XL/IMG_9091-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange',
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'LAMBORGHINI URUS S',
  NULL,
  'Experience luxury and performance with the LAMBORGHINI URUS S. This stunning GRAPHITE ORANGE vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1095.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"LAMBORGHINI","model":"URUS S","exteriorColor":"GRAPHITE ORANGE"}'::jsonb,
  '["https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-2K2vS5H/0/KQmvMvQxS4sDkhJfXrmnL5q6RTLC8gpLmwCGrsBWp/L/Photo%20Jun%2010%202025%2C%2010%2034%2039%20AM-L.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-2K2vS5H/0/NXDRR6KLBcpbgBdGtqszhWKxgZPZJnpWQ4tG8nFCH/M/Photo%20Jun%2010%202025%2C%2010%2034%2039%20AM-M.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-bWVW69P/0/K7NSDM5TbGHvHCQ3hW9jNSR3Sz9LFFw2fRBWTDCmk/M/Photo%20Jun%2010%202025%2C%2010%2038%2005%20AM-M.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-ZSF9V9d/0/M9jRd2RLXZtpGRD4wVcXFfbzxwxnvt7xDvh2ggzpV/M/Photo%20Jun%2010%202025%2C%2010%2038%2016%20AM-M.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-8LKgnk7/0/KS7GGHZ64tLrZkg7LFxnptxM2p4sf5348dgG3cnhJ/M/Photo%20Jun%2010%202025%2C%2010%2038%2034%20AM-M.jpg","https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-2K2vS5H/0/LSb3trFCJt8msxvWGxzGWFFHdvLQ2pjLTpPfFfP9R/XL/Photo%20Jun%2010%202025%2C%2010%2034%2039%20AM-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange',
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'LAMBORGHINI URUS S TYPE',
  NULL,
  'Experience luxury and performance with the LAMBORGHINI URUS S TYPE. This stunning orange vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1095.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"LAMBORGHINI","model":"URUS S TYPE","exteriorColor":"orange","interiorColor":"grey & orange"}'::jsonb,
  '["https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-xSZq85D/0/KrVF9HgMZcGC5FFjdqDVtMTd3rpbqBC2zVMjHFZQM/L/IMG_9293-L.jpg","https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-xSZq85D/0/K3FjL4BVr5B5QWC5tnZXMh6CDRmSwswRXW8BgZJkr/M/IMG_9293-M.jpg","https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-ZGw8TpT/0/LBQXwbKrZDGZFRDV4KqSPdBpmjCdvQmF6BHcpPzWC/M/IMG_9304-M.jpg","https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-sr9wGHb/0/KRb2z4bc3pVzwxd2RWznJ6NrTjWLzVRktqtcKJqWR/M/IMG_9306-M.jpg","https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-JxwJC4K/0/L6qMVpMF4fpmt425BpPp6n355csCV2Qbt6Hr2GBS4/M/IMG_9308-M.jpg","https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-xSZq85D/0/Mkm7fCJBgWWtWqfVm3HkCtKz6XnVGXhCc9vph98qM/XL/IMG_9293-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Liv/Lambo-Urus-S-Orange-',
  true,
  false,
  NOW(),
  NOW()
);

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'LAMBORGHINI Urus',
  NULL,
  'Experience luxury and performance with the LAMBORGHINI Urus. This stunning Matte Black vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1095.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"LAMBORGHINI","model":"Urus","exteriorColor":"Matte Black"}'::jsonb,
  '["https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-VK4zqgq/0/LpvDK9nB8PNb3VHQJbZ7R6zWdVk7nMPS6FZxBkDHC/L/DSC02373-L.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-VK4zqgq/0/L2rBh7fgxK5DD2nCvTV6wPgHPJpvSXpD27LNLvQ4M/M/DSC02373-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-bp8LBqH/0/KZ4BFbLkVJ3gDPHJBktBkKrQJNz6rBJf9pC9qcBZC/M/DSC02388-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-bNDhZBb/0/Lckzhnc2mqWwK7pqQjq4sFq6pHBmBxgJJKXQR69L5/M/DSC02393-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-ZzkmzJ8/0/NCj7HT8th5sGPJFnZQdqWzrnXHLxGHrRp4sJw9Wtj/M/DSC02397-Edit-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-VK4zqgq/0/MSpR4GptBMHHQw8jbNs2XXptv6zf6ZSRvkVScGdVx/XL/DSC02373-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow',
  true,
  false,
  NOW(),
  NOW()
);

