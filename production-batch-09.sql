-- Production Import Batch 9/10
-- Cars 81-90 of 91

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'Rolls Royce Cullinan',
  'Black / White',
  'Experience luxury and performance with the Rolls Royce Cullinan. This stunning black / white vehicle delivers an unforgettable driving experience in Miami.',
  '1495.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"brand":"Rolls Royce","seats":5,"bodyType":"SUV","horsepower":563,"acceleration":"5.0s","transmission":"Automatic"}'::jsonb,
  '["https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-cCmLzMW/0/MRLQnKvtjPGrFvDwZpdJLBZkfTMZFRNZtxR6Wxgnb/L/DSC05253-L.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-cCmLzMW/0/Mz8xvBWWkWBHfB3HfnkLGFkrFqVPGXLF9QJ47fgLr/M/DSC05253-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-DvpfV2x/0/MgvWk6H34ZDNv3ttc76D5DBjPph4mKfhp4dtZ5pS2/M/DSC05254-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-7zLfQmt/0/NSBgSwxzBvRz4FwLF4hjZMNLtJT8hhTPNJGBKFcsk/M/DSC05255-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-vTvxqPb/0/MzsFQBw6d3Sdd7tcgDXphzPmcgt3Mz6pNzh6rccHx/M/DSC05256-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-cCmLzMW/0/MR6RS6cnG7BHTfXJfB73ZRvQPJcCDsJb9cGSjKSLJ/XL/DSC05253-XL.jpg"]'::jsonb,
  'https://carsforrent.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan',
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
  'Rolls Royce Cullinan Black Badge',
  NULL,
  'Experience luxury and performance with the Rolls Royce Cullinan Black Badge. This stunning Purple vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1495.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"Rolls Royce","model":"Cullinan Black Badge","exteriorColor":"Purple"}'::jsonb,
  '["https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-GTj6Bj2/0/NPp2vrQKBmXdxdtwb5VstPz3wM8R86vfdM7gFsRDd/L/DSC03489-Edit-Edit-L.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-GTj6Bj2/0/LmTmhNhfwV8FzMGSFJqw3cRVQhDr57RxLBSdVRdHQ/M/DSC03489-Edit-Edit-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-c5ZBBnr/0/LmHMcwgcxs6VB8rqN7LXLxzdBv4vm9gc6JCqMgXkG/M/DSC03477-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-57TXbzb/0/K96HRKfHFHCKGBHc5BQtrwvPMKMFtfsGMz9tngnXm/M/DSC03471-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-Ftgv84D/0/KPh3vj9QphSnmKtskpg64Hct8hHhTKMP5DzFnXxbP/M/DSC03467-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-GTj6Bj2/0/NMpmrBxX2GdmFvddDd3X3vPHb3nk2Dtpgb952LTHV/XL/DSC03489-Edit-Edit-XL.jpg"]'::jsonb,
  'https://carsforrent.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-',
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
  'Rolls Royce Dawn',
  'White',
  'Experience luxury and performance with the Rolls Royce Dawn. This stunning white vehicle delivers an unforgettable driving experience in Miami.',
  '1295.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"brand":"Rolls Royce","seats":4,"bodyType":"Convertible","horsepower":563,"acceleration":"4.9s","transmission":"Automatic"}'::jsonb,
  '["https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-w4MVJN4/0/Kqrnhp8JbGSGRzT6tsXskzJC4KVkzX6Bf7snMTTSM/L/IMG_3697-L.jpg","https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-w4MVJN4/0/KskVqS4NksGdjjWXLrfCLqQZqs7td7CLGZdhDh6kh/M/IMG_3697-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-zfrXfZ5/0/LVgFtq6Hc4P5k3pfL9PwSq33MRVfwgw3pT2RJLNX9/M/IMG_3698-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-LHk5h8p/0/MzcrnKD4MdBvbhC6wpmM4SXL7RpmvMRvdzjn4qtPD/M/IMG_3699-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-tBk358G/0/NVgfvFnZV9Jjq3R7vH4K7b8sm7xDR2Hq6TDNg9r27/M/IMG_3700-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-w4MVJN4/0/MFgKwRBx6BqNF2k2gXDKXkP2FMWG9msTcN6Gn6sJN/XL/IMG_3697-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray',
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
  'Rolls Royce Ghost',
  NULL,
  'Experience luxury and performance with the Rolls Royce Ghost. This stunning matte black vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1395.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"Rolls Royce","model":"Ghost","exteriorColor":"matte black","interiorColor":"orange"}'::jsonb,
  '["https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-Hf6v7JS/0/LjpSxnxQBG825GDgq4HCxhqKX3wfWN8RmfKdvKPSv/L/DSC03901-L.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-Hf6v7JS/0/Kg68QgNsrNXsZhL8j2g4x9mWKx4rPrNRx2q5gRSzJ/M/DSC03901-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-rqgTDfF/0/NNcJ8ZJPfCpn29G5GNKXbLjsHtFr3CZMrjXXptLgX/M/DSC03921-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-7qX9Wp4/0/MJjDzT4XBNNTthG58FKj8n5bRvTkwRTQgWf4PGGfX/M/DSC03902-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-hvSvM9t/0/LcVxBfWkwLvGsp7kgG3D79MLFRbqBLFZT79DJMmxR/M/DSC03925-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-Hf6v7JS/0/LBxLR2Pqb6Hwr6G465jkSCQTGDjBb5x4WXW3WSMbN/XL/DSC03901-XL.jpg"]'::jsonb,
  'https://carsforrent.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost',
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
  'Rolls Royce Wraith',
  NULL,
  'Experience luxury and performance with the Rolls Royce Wraith. This stunning grey vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1395.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"Rolls Royce","model":"Wraith","exteriorColor":"grey"}'::jsonb,
  '["https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-CDxpjrX/0/Lw4pv8jJPTjwjKCXqMZZ6j7N5KWr9K8chKzg9wQW8/L/DSC05388-L.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-CDxpjrX/0/NX726B3rjNLg8fhq6QSCsDrCgCRjVNGd6hHQfL6jJ/M/DSC05388-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-WjZktBS/0/NFbL29z4swfGFzdkXJZjn7SPdX2x5dxHM3vM4d6sR/M/DSC05387-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-QfS9tbn/0/Kv9s7hVcSKSSKKKMxtCPqhHqfPxg99TFnLN96kv7K/M/DSC05403-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-GfRtTSr/0/KPjWsVFGh4gw6wnnZcghW2NvZxshZQ6JQfz52HjXQ/M/DSC05407-M.jpg","https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-CDxpjrX/0/KNSx6w46D6BDzvw26LTr8VBkFLZjp5BjzwJSvJDgj/XL/DSC05388-XL.jpg"]'::jsonb,
  'https://carsforrent.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge',
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
  'Tesla Cybertruck',
  'Flat Silver',
  'Experience luxury and performance with the Tesla Cybertruck. This stunning flat silver vehicle delivers an unforgettable driving experience in Miami.',
  '595.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"brand":"Tesla","seats":5,"bodyType":"SUV","horsepower":845,"acceleration":"2.6s","transmission":"Automatic"}'::jsonb,
  '["https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-wc67n8j/0/KHTZr2cG4FnpGsXJQJH7b2gw8J7tSkCBdj2S3ZHqd/L/IMG_3102-L.jpg","https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-zWMHmSn/0/KfKvTvtqwQZJ7xQZZ4kjTjFFqnHVZ6gXQhvfPb6fs/M/2fb144f6ab4c4081a632b9e9e7965725-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-7JfGm95/0/LqNSBV5M3s5Vf4tVgksNHqmhDs28LVPsZ5Dj6ZRDW/M/IMG_3105-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-3Sb47M8/0/MdKMC3HqJLdRp7f5m8tLrPQjKt3p9fGtmQmC63FxG/M/IMG_3103-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-LX84TdJ/0/K3XxbL4jnZCJRfT3BBD42ZcvQzBhmFkJgqpw8J5bd/M/IMG_3101-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-wc67n8j/0/NTnj7s3WRTLbbkGnSW94v9LB7HSQkkQCf2ZBSLJWx/XL/IMG_3102-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER',
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
  'Tesla Cybertruck',
  'Silver / Black',
  'Experience luxury and performance with the Tesla Cybertruck. This stunning silver / black vehicle delivers an unforgettable driving experience in Miami.',
  '595.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"brand":"Tesla","seats":5,"bodyType":"SUV","horsepower":845,"acceleration":"2.6s","transmission":"Automatic"}'::jsonb,
  '["https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-dF7SRhB/0/KGpQJ9CLcnNtMvbfswXhKChxR3wTT2ck3z5mBwBmc/L/IMG_2332-L.jpg","https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-dF7SRhB/0/L7F3XNQwKGWpvgDBrZw2prSQwLv94SgGmDcbhbmSB/M/IMG_2332-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-nJMMTCq/0/NF8GfJ76ZGrVTGMDDNBDQtnTW2LVLLjtfQ8C69jss/M/IMG_2358-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-mdZt5DL/0/KDnF6L5CQqfBWDLmq6K2qkvrj5bFHmhQBHJVpPQ8B/M/IMG_2334-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-3xT2nTX/0/LkS8rcCzn7CVfbszKqbvvtKS5VgvBjP4Jt8FdDbjR/M/IMG_2347-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-dF7SRhB/0/KnK755wV3WfDgKJmDqHwVtQLRMzqS28xnP3KHmHR6/XL/IMG_2332-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK',
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
  'Tesla model x plaid',
  NULL,
  'Experience luxury and performance with the Tesla model x plaid. This stunning Red vehicle combines elegance with power, perfect for making a statement in Miami.',
  '295.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"Tesla","model":"model x plaid","exteriorColor":"Red"}'::jsonb,
  '["https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-gFBhkDX/0/KSFv42FcL9sccFVJzVFwHn9DDGW9K8CLhPrGJGSsQ/L/WhatsApp%20Image%202024-05-07%20at%203.59.25%20PM-L.jpg","https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-9VGqGkN/0/MWZLzwv62mGrZm4KDtpwt7vG3NDXPn47StcH6gbBb/M/WhatsApp%20Image%202024-05-07%20at%203.59.02%20PM-M.jpg","https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-xVpb489/0/Lfsv2tFQmwPSJXHqQ79ggGHv84PRDCwkp5pqBNMdf/M/WhatsApp%20Image%202024-05-07%20at%203.59.02%20PM%20%281%29-M.jpg","https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-gFBhkDX/0/LMQ7dTNW3bFvrkNfvD2F9v9Ks8jZ3MwrGPPgfRwMn/M/WhatsApp%20Image%202024-05-07%20at%203.59.25%20PM-M.jpg","https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-CFxJLrS/0/L7K5vMLmFzLhKnjmbHvcn4XB279bD3NMkxjB85jv4/M/WhatsApp%20Image%202024-05-07%20at%203.59.00%20PM-M.jpg","https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-gFBhkDX/0/KHCnkLZq99x8jnmXgBLN8qsn4FV62JSNbXxhLh6F6/XL/WhatsApp%20Image%202024-05-07%20at%203.59.25%20PM-XL.jpg"]'::jsonb,
  'https://dynastyluxuryrentals.smugmug.com/Cars/Tesla-X-PLAID',
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
  'lamborghini Hurracan evo spyder',
  NULL,
  'Experience luxury and performance with the lamborghini Hurracan evo spyder. This stunning White vehicle combines elegance with power, perfect for making a statement in Miami.',
  '1095.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"lamborghini","model":"Hurracan evo spyder","exteriorColor":"White","interiorColor":"Red"}'::jsonb,
  '["https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-rHLRprX/0/KhJN86dbsSrVgmKkPq4CpsBsLkcHhPhSZjCSqGCTd/L/IMG_7528-L.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-SKjhxPs/0/L29JN7HNGWdhK8cXksq6j65BCFsh7hcnd2KH2J5T8/M/IMG_7228_jpg-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-Q8SH5ZV/0/LbD78CMzFrX9ntvrzVbJ8hr6QGfQKk5fcnVkTmCtx/M/IMG_7246_jpg-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-hjzGTcV/0/LpFWfFWcV3BFg7C2FFjTSpgbZFxDRfc36rCzWDhRz/M/IMG_7533-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-3cpKvxd/0/K5VTCHBftpjMR3KH5SGJRmDw2GZDKN7jSVNzvgvR6/M/IMG_7218_jpg-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-rHLRprX/0/LNm7mffNLW6jzpxnnB96gZWT2pNBNmzzWrcFPdW64/XL/IMG_7528-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White',
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
  'mercedes G63 AMG',
  NULL,
  'Experience luxury and performance with the mercedes G63 AMG. This stunning Green vehicle combines elegance with power, perfect for making a statement in Miami.',
  '795.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"mercedes","model":"G63 AMG","exteriorColor":"Green","interiorColor":"Beige"}'::jsonb,
  '["https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-j5dDTPH/0/MNvrMVDThQLHwR94Mbhf8bfd3GctZnW4bQJ4WSZwd/L/IMG_1684-L.jpg","https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-j5dDTPH/0/MNjKXdXJmXqhjZC9LRZNNCc5Q73DsbnqCcqWgsFp2/M/IMG_1684-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-HJMPt62/0/MBmFS4FmVf53MKmK7Pn5Sw6RNStcW5rWhwggvBKZP/M/IMG_1685-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-7WSFNn8/0/LMmbKfbtR3czwvRRK7Np8JKVpFRddKNttZQ79QxXW/M/IMG_1677-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-4jBVhbc/0/KhfPmJ3Qb26TdFZ962H86jwFWVH3KFrzGJ43cwqTd/M/IMG_1675-M.jpg","https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-j5dDTPH/0/NDnPm7ThfwhWj9kZsLk6qzVZszsjGxVTJpthLsTv6/XL/IMG_1684-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN',
  true,
  false,
  NOW(),
  NOW()
);

