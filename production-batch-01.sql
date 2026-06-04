-- Production Import Batch 1/10
-- Cars 1-10 of 91

INSERT INTO inventory (
  category, title, subtitle, description,
  price_per_day, price_per_hour, price_4hr, price_6hr, price_8hr,
  specifications, images, smugmug_url,
  is_published, is_featured, created_at, updated_at
) VALUES (
  'car',
  'AUDI R8',
  NULL,
  'Experience luxury and performance with the AUDI R8. This stunning Yellow vehicle combines elegance with power, perfect for making a statement in Miami.',
  '795.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"AUDI","model":"R8","exteriorColor":"Yellow"}'::jsonb,
  '["https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-fTHhtnP/0/Mzb3QS4wSpb5qrrvmRjdzHCg8dqPFsjt5GZMBhBCZ/L/250530090353-1-L.jpg","https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-fTHhtnP/0/LrmBWQLgFgdjDJzd6jnZbpBB62hdZpKfmSsSPwxNx/M/250530090353-1-M.jpg","https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-8vfQJpf/0/Nfg5L89GpVhTS9rTf3z59WNCS77bWZjpQt9rfcJM8/M/250530090353-2-M.jpg","https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-sq4MnFP/0/McSMVPRztj2PzkxzMFCf2FPKwSWFrPK2gK3ctgzBn/M/250530090353-3-M.jpg","https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-4n5tN7D/0/NXZ43Bvwhb3mhJ7HLTqvzS2ZSPCnwwZK26zMbvbrB/M/250530090353-4-M.jpg","https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-fTHhtnP/0/Mmhw4NcCLZk2sNKBpjNhGR7Bvcn2SWKVhscGsXLrr/XL/250530090353-1-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Luxx-pr/Audi-R8-Yellow',
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
  'AUDI S5',
  NULL,
  'Experience luxury and performance with the AUDI S5. This stunning exotic vehicle combines elegance with power, perfect for making a statement in Miami.',
  '295.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{}'::jsonb,
  '["https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-WLKb7z8/0/NNd9HrdvvrR7RTcD6M42KSb6pQNFhdrHGNGsrzn22/L/DSC07989-L.jpg","https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-6xKmLNw/0/Kx9TF8R8sxrDrRs64gjgnTkCTRnbhzVtTgH2Gvjjn/M/DSC07964-M.jpg","https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-7Fq2xrJ/0/MWrQtPDqnS9njzmQxfB7Jr93mHvXSFB8pDpZNBtW7/M/DSC07967-M.jpg","https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-gNpkdqg/0/LPgN2T3jmv7MPBbMK5KHnQKBjG3Cq2rjSkMHcMjSP/M/DSC07971-M.jpg","https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-VhLxjtn/0/L4QnSHZX8frZQdcDHZgTr4hkJH3kVMKNw9H2z7wcn/M/DSC07974-M.jpg","https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-WLKb7z8/0/M3hH8hZZjR8mvBThngFcnC2sCcrVpzKkZVM5TLq6M/XL/DSC07989-XL.jpg"]'::jsonb,
  NULL,
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
  'Audi q5 sportback premium',
  NULL,
  'Experience luxury and performance with the Audi q5 sportback premium. This stunning grey vehicle combines elegance with power, perfect for making a statement in Miami.',
  '250.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"Audi","model":"q5 sportback premium","exteriorColor":"grey"}'::jsonb,
  '["https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-h8Khcmg/0/KvrZxVGKRkfdQbhVK9GsqXXfmJLq282jGSwkdvxDf/L/_DSC6217-Enhanced-NR-L.jpg","https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-h8Khcmg/0/KjnPGGkhHGrvbGNZM2b27zN7ZBHpXXxhTrTJ3FBqF/M/_DSC6217-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-ntBG3WD/0/LwNrSdsWtzst4tWm9wgTJCCKpFmzbhHtvDKgXZRDR/M/_DSC6219-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-f3Lh7KK/0/Mq9Dttd5nhR7ZGQWxBMmjWf8KC4xDhRq8VfQRLL2T/M/_DSC6221-M.jpg","https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-ggJVCNt/0/KQCn9s97ZS5wrDsxrscPBZPq3NX8dH5gX76D6dmsM/M/_DSC6224-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-h8Khcmg/0/NLTJRpNQRHnJn9ZtZzd7gFfVqthZBZnGX9s3R3s5D/XL/_DSC6217-Enhanced-NR-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM',
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
  'BMW M4 Competiton Convertible',
  NULL,
  'Experience luxury and performance with the BMW M4 Competiton Convertible. This stunning White vehicle combines elegance with power, perfect for making a statement in Miami.',
  '495.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"BMW","model":"M4 Competiton Convertible","exteriorColor":"White"}'::jsonb,
  '["https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-NWmZd8H/0/KkCRrfK5cRq3vQ4vTtsrs7DBfB4B5P5gX2mMbXBHz/L/_DSC5426-Enhanced-NR-L.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-73k6sw4/0/MVzPsbH8MnjKffv7KCdnj37rh43r6M8qFwpgvRbbb/M/_DSC5417-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-NWmZd8H/0/LS6QBDWC2Jks8KvQk54rrhsmjhmqNg4HMrHPNgRzK/M/_DSC5426-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-6RSB4fs/0/MjnPGpmLTbrWWgJ3JFqsNqDvmvFpHM4WZSDN6MtR8/M/_DSC5429-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-2DcbVXJ/0/MGTdDtZxVPGbcpBTw5RgV7h7ZL4vXVKnnVxJ7GmC3/M/_DSC5432-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-NWmZd8H/0/MhCZWf9tsnVZBs9PzwszLHWWWFmV6gb4KqLxdmcvT/XL/_DSC5426-Enhanced-NR-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Luxx-dy/2023-BMW-M4-competition',
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
  'BMW M8',
  NULL,
  'Experience luxury and performance with the BMW M8. This stunning Black vehicle combines elegance with power, perfect for making a statement in Miami.',
  '595.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"BMW","model":"M8","exteriorColor":"Black","interiorColor":"White"}'::jsonb,
  '["https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-BCfpSHp/0/LLgPX9qJSvpsnPsbvcfqprzWQCm5K5c4tZ84pcDxM/L/0B3A2865-L.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-BCfpSHp/0/LfSKGm9bR8ZLt2z5xcWQtsDPtzMgNXwMqMB4GPDgV/M/0B3A2865-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-DRSF6RL/0/LVfjR4RvNGRZTXvBWrq7gWtrFKKhdBKzmgHPJLjgc/M/0B3A2865%202-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-GJ7CBmX/0/K6hhP6PJx2GXK2MmPRPgDTkP9TsDDKtz9Xs6m5Lp6/M/0B3A2866-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-w7qBHhD/0/K5TKhRgvMKfJ2XW5jBF9BmrJXhwhwwn2JLtd495X2/M/0B3A2867-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-BCfpSHp/0/NZfNktMs6mSFdW5CQGjT6k69P5zgHnQjqPL5TNG8H/XL/0B3A2865-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White',
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
  'BMW X5',
  NULL,
  'Experience luxury and performance with the BMW X5. This stunning Black vehicle combines elegance with power, perfect for making a statement in Miami.',
  '645.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"BMW","model":"X5","exteriorColor":"Black","interiorColor":"Black"}'::jsonb,
  '["https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-9fcFHSs/0/NNk2xGjTkwwTN2JvWmzm4HjwGpXzwTPckcCPdK3GK/L/IMG_9138-L.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-9fcFHSs/0/MRjRs4c7hCBvdSxfv4FdSXQcH8zG5b3xD2K4bhFFs/M/IMG_9138-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-w8s4DxJ/0/LG9VVzWRq8vq8nwCgFBFZdCkrXPjHd32JmmPkSkk6/M/IMG_9139-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-xXt3sJH/0/KS89nQgmhX9LcSZzgQ42DhcSZ7bNH9LDsmNmsdng7/M/IMG_9140-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-42tJ2jC/0/LkkTtcWNDBWKQ2WPmC6PNJLSD9pmLTpPLtWTvHXD7/M/IMG_9141-M.jpg","https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-9fcFHSs/0/NWcVwgW8q9sj59bFWgP8bCHndH8n3NMt6JjVhk9vL/XL/IMG_9138-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B',
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
  'BMW X6 X Drive 40i',
  NULL,
  'Experience luxury and performance with the BMW X6 X Drive 40i. This stunning Dark Green vehicle combines elegance with power, perfect for making a statement in Miami.',
  '645.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"BMW","model":"X6 X Drive 40i","exteriorColor":"Dark Green"}'::jsonb,
  '["https://photos.smugmug.com/Luxx-dy/BMW-X6/i-bpwmhmT/0/Mxf2T7NqkkjD7wWKN8kxvjJDK6qLjZQH9nwTSnzn7/L/_DSC6278-Enhanced-NR-L.jpg","https://photos.smugmug.com/Luxx-dy/BMW-X6/i-FjrtrL2/0/KngrjD9xgqtVqFVqJjMKJtTf2FWBjGn8FdDNdtbB6/M/Carro%209-M.jpg","https://photos.smugmug.com/Luxx-dy/BMW-X6/i-3vjbv8J/0/KSwNdtgCqqmJmHDbMkcGHfmdTjqN8WRmdcnF9DJBx/M/_DSC6241-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/BMW-X6/i-z5bNRtQ/0/Ljq47rX33zzKZC8QmXkFqJrGHWsLFhjKgFTcdcXw6/M/_DSC6245-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/BMW-X6/i-MndTNzw/0/MQHqm7Jq5Th5Xfv8mBQQ5tJVcszBvxHVnfxXF7Ghs/M/_DSC6246-Enhanced-NR-M.jpg","https://photos.smugmug.com/Luxx-dy/BMW-X6/i-bpwmhmT/0/KV4JmmSqDppLpVr9Z3TZxjt8msBb9JRQLhTGjpxVr/XL/_DSC6278-Enhanced-NR-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Luxx-dy/BMW-X6',
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
  'BMW X6M',
  NULL,
  'Experience luxury and performance with the BMW X6M. This stunning Black vehicle combines elegance with power, perfect for making a statement in Miami.',
  '645.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"BMW","model":"X6M","exteriorColor":"Black","interiorColor":"Brown"}'::jsonb,
  '["https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-qBPZbZB/0/NFFcWnBR2n89VVw3rn7JLCpSHf5BRcwFNXx3L67BP/L/PHOTO-2022-10-17-17-45-37-L.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-qBPZbZB/0/KhPLWSQjSrsZsGFJTRR2pNgVrqqLjX8gR3xd47r5J/M/PHOTO-2022-10-17-17-45-37-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-2kwtj3h/0/Lscj7dvHtFZzpTcdgMGrNsnQGH3KzBzTNWCBMK2C6/M/PHOTO-2022-10-17-17-45-37%202-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-DgFG3nV/0/KHQxCQn6Z5DBm87jVZgC8V47NKFhTZz8Rbd9xH93z/M/PHOTO-2022-10-17-17-45-37%203-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-V9bPpPz/0/MF4kTZ4G4LxRkg4nhPhqLzdKvLxqKXdxM86XpHrvr/M/PHOTO-2022-10-17-17-45-37%204-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-qBPZbZB/0/LQsdS93Vs5JnFHS3sKsqckjHLxSPNhMKtnhb3tHbc/XL/PHOTO-2022-10-17-17-45-37-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022',
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
  'BMW X7 XDrive 40i',
  NULL,
  'Experience luxury and performance with the BMW X7 XDrive 40i. This stunning Carbon Black Metallic vehicle combines elegance with power, perfect for making a statement in Miami.',
  '645.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"BMW","model":"X7 XDrive 40i","exteriorColor":"Carbon Black Metallic"}'::jsonb,
  '["https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-tWm6Sx9/0/NjRZFWhSgSPzhZqgwzXTS58J9gmBhL9dMMSrzMFx6/L/0fzOtjbw-L.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-tWm6Sx9/0/LsBfLFd6hTGBCSXjvrBG6RJtMSCqTWNVcJsGqKrzR/M/0fzOtjbw-M.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-jpMrcH5/0/MhMc6xfBVRGWmCScxRhsK9gBGGvKLKhgkVGhqzmqg/M/CaLynYdQ-M.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-sX3QDbC/0/MVSPHTVzNZVHT3vd6b8DqJQxCDBmjHFZ2wbp2CRfg/M/YeWhg0lQ-M.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-bcNpbBR/0/KzgHxtc9bC7MBDNDWKmssJFcbnSSXmVk6nL2hvCVF/M/IMG_0396-M.jpg","https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-tWm6Sx9/0/LkKpBJWzgGMM9vncg3DWmbxRQ6qLWspFxZf3Dkzpj/XL/0fzOtjbw-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i',
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
  'BMW XM5',
  NULL,
  'Experience luxury and performance with the BMW XM5. This stunning White vehicle combines elegance with power, perfect for making a statement in Miami.',
  '645.00',
  NULL,
  NULL,
  NULL,
  NULL,
  '{"make":"BMW","model":"XM5","exteriorColor":"White","interiorColor":"Brown"}'::jsonb,
  '["https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-Krk2FHW/0/KJfTzpGfw7M5PswHLq5cncK6m37k8KJ6L2jL6CQfx/L/PHOTO-2022-10-17-17-45-08-L.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-Krk2FHW/0/MgjW5WKhDsFhbHKBJgdw3bGz7GR3kdK2H4xL7LL5d/M/PHOTO-2022-10-17-17-45-08-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-khMjXXC/0/MjZzPRqF2tVHCVKbxqNDRxL9M3BwdJLLQjmWZKbXF/M/PHOTO-2022-10-17-17-45-08%202-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-GHzjkJh/0/LdTmSpHkKcNvSCM5DWNnMwMX3vZp4Xbf7FxXcT6RM/M/PHOTO-2022-10-17-17-45-08%203-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-DsRrHqt/0/KJbQpjdBczHCTGkFRCS8Fjr6pkhFnHwJTtpTpgBj6/M/PHOTO-2022-10-17-17-45-08%204-M.jpg","https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-Krk2FHW/0/KM8tN8mcrMxgV3bHrmNgb5XdfNsSBL5m3xcnXDmKw/XL/PHOTO-2022-10-17-17-45-08-XL.jpg"]'::jsonb,
  'https://cars-m.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022',
  true,
  false,
  NOW(),
  NOW()
);

