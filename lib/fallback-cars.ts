export interface FallbackCar {
  id: string
  slug: string
  title: string
  subtitle: string
  brand: string
  brandSlug: string
  images: string[]
  pricePerDay: string | number | null
  isFeatured: boolean
  specifications: Record<string, any>
  focalPoint: string
  flipHorizontal: boolean
  flipVertical: boolean
}

export const fallbackCars: FallbackCar[] = [
  {
    "id": "fallback-audi-r8",
    "slug": "audi-r8",
    "title": "Audi R8",
    "subtitle": "Yellow exterior",
    "brand": "Audi",
    "brandSlug": "audi",
    "images": [
      "https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-fTHhtnP/0/Mzb3QS4wSpb5qrrvmRjdzHCg8dqPFsjt5GZMBhBCZ/L/250530090353-1-L.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-fTHhtnP/0/LrmBWQLgFgdjDJzd6jnZbpBB62hdZpKfmSsSPwxNx/M/250530090353-1-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-8vfQJpf/0/Nfg5L89GpVhTS9rTf3z59WNCS77bWZjpQt9rfcJM8/M/250530090353-2-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-sq4MnFP/0/McSMVPRztj2PzkxzMFCf2FPKwSWFrPK2gK3ctgzBn/M/250530090353-3-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-4n5tN7D/0/NXZ43Bvwhb3mhJ7HLTqvzS2ZSPCnwwZK26zMbvbrB/M/250530090353-4-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-R8-Yellow/i-fTHhtnP/0/Mmhw4NcCLZk2sNKBpjNhGR7Bvcn2SWKVhscGsXLrr/XL/250530090353-1-XL.jpg"
    ],
    "pricePerDay": "795.00",
    "isFeatured": false,
    "specifications": {
      "make": "AUDI",
      "model": "R8",
      "exteriorColor": "Yellow",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-audi-s5",
    "slug": "audi-s5",
    "title": "Audi S5",
    "subtitle": "",
    "brand": "Audi",
    "brandSlug": "audi",
    "images": [
      "https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-WLKb7z8/0/NNd9HrdvvrR7RTcD6M42KSb6pQNFhdrHGNGsrzn22/L/DSC07989-L.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-6xKmLNw/0/Kx9TF8R8sxrDrRs64gjgnTkCTRnbhzVtTgH2Gvjjn/M/DSC07964-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-7Fq2xrJ/0/MWrQtPDqnS9njzmQxfB7Jr93mHvXSFB8pDpZNBtW7/M/DSC07967-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-gNpkdqg/0/LPgN2T3jmv7MPBbMK5KHnQKBjG3Cq2rjSkMHcMjSP/M/DSC07971-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-VhLxjtn/0/L4QnSHZX8frZQdcDHZgTr4hkJH3kVMKNw9H2z7wcn/M/DSC07974-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Audi-S5-White/i-WLKb7z8/0/M3hH8hZZjR8mvBThngFcnC2sCcrVpzKkZVM5TLq6M/XL/DSC07989-XL.jpg"
    ],
    "pricePerDay": "295.00",
    "isFeatured": false,
    "specifications": {
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-audi-q5-sportback-premium",
    "slug": "audi-q5-sportback-premium",
    "title": "Audi Q5 Sportback Premium",
    "subtitle": "grey exterior",
    "brand": "Audi",
    "brandSlug": "audi",
    "images": [
      "https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-h8Khcmg/0/KvrZxVGKRkfdQbhVK9GsqXXfmJLq282jGSwkdvxDf/L/_DSC6217-Enhanced-NR-L.jpg",
      "https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-h8Khcmg/0/KjnPGGkhHGrvbGNZM2b27zN7ZBHpXXxhTrTJ3FBqF/M/_DSC6217-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-ntBG3WD/0/LwNrSdsWtzst4tWm9wgTJCCKpFmzbhHtvDKgXZRDR/M/_DSC6219-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-f3Lh7KK/0/Mq9Dttd5nhR7ZGQWxBMmjWf8KC4xDhRq8VfQRLL2T/M/_DSC6221-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-ggJVCNt/0/KQCn9s97ZS5wrDsxrscPBZPq3NX8dH5gX76D6dmsM/M/_DSC6224-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/AUDI-Q5-SPORTBACK-PREMIUM/i-h8Khcmg/0/NLTJRpNQRHnJn9ZtZzd7gFfVqthZBZnGX9s3R3s5D/XL/_DSC6217-Enhanced-NR-XL.jpg"
    ],
    "pricePerDay": "250.00",
    "isFeatured": false,
    "specifications": {
      "make": "Audi",
      "model": "q5 sportback premium",
      "exteriorColor": "grey",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bmw-m4-competiton-convertible",
    "slug": "bmw-m4-competiton-convertible",
    "title": "BMW M4 Competiton Convertible",
    "subtitle": "White exterior",
    "brand": "BMW",
    "brandSlug": "bmw",
    "images": [
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-NWmZd8H/0/KkCRrfK5cRq3vQ4vTtsrs7DBfB4B5P5gX2mMbXBHz/L/_DSC5426-Enhanced-NR-L.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-73k6sw4/0/MVzPsbH8MnjKffv7KCdnj37rh43r6M8qFwpgvRbbb/M/_DSC5417-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-NWmZd8H/0/LS6QBDWC2Jks8KvQk54rrhsmjhmqNg4HMrHPNgRzK/M/_DSC5426-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-6RSB4fs/0/MjnPGpmLTbrWWgJ3JFqsNqDvmvFpHM4WZSDN6MtR8/M/_DSC5429-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-2DcbVXJ/0/MGTdDtZxVPGbcpBTw5RgV7h7ZL4vXVKnnVxJ7GmC3/M/_DSC5432-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-M4-competition/i-NWmZd8H/0/MhCZWf9tsnVZBs9PzwszLHWWWFmV6gb4KqLxdmcvT/XL/_DSC5426-Enhanced-NR-XL.jpg"
    ],
    "pricePerDay": "495.00",
    "isFeatured": false,
    "specifications": {
      "make": "BMW",
      "model": "M4 Competiton Convertible",
      "exteriorColor": "White",
      "bodyType": "Convertible"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bmw-m8",
    "slug": "bmw-m8",
    "title": "BMW M8",
    "subtitle": "Black exterior",
    "brand": "BMW",
    "brandSlug": "bmw",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-BCfpSHp/0/LLgPX9qJSvpsnPsbvcfqprzWQCm5K5c4tZ84pcDxM/L/0B3A2865-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-BCfpSHp/0/LfSKGm9bR8ZLt2z5xcWQtsDPtzMgNXwMqMB4GPDgV/M/0B3A2865-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-DRSF6RL/0/LVfjR4RvNGRZTXvBWrq7gWtrFKKhdBKzmgHPJLjgc/M/0B3A2865%202-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-GJ7CBmX/0/K6hhP6PJx2GXK2MmPRPgDTkP9TsDDKtz9Xs6m5Lp6/M/0B3A2866-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-w7qBHhD/0/K5TKhRgvMKfJ2XW5jBF9BmrJXhwhwwn2JLtd495X2/M/0B3A2867-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-M8-Black-White/i-BCfpSHp/0/NZfNktMs6mSFdW5CQGjT6k69P5zgHnQjqPL5TNG8H/XL/0B3A2865-XL.jpg"
    ],
    "pricePerDay": "595.00",
    "isFeatured": false,
    "specifications": {
      "make": "BMW",
      "model": "M8",
      "exteriorColor": "Black",
      "interiorColor": "White",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bmw-x5",
    "slug": "bmw-x5",
    "title": "BMW X5",
    "subtitle": "Black exterior",
    "brand": "BMW",
    "brandSlug": "bmw",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-9fcFHSs/0/NNk2xGjTkwwTN2JvWmzm4HjwGpXzwTPckcCPdK3GK/L/IMG_9138-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-9fcFHSs/0/MRjRs4c7hCBvdSxfv4FdSXQcH8zG5b3xD2K4bhFFs/M/IMG_9138-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-w8s4DxJ/0/LG9VVzWRq8vq8nwCgFBFZdCkrXPjHd32JmmPkSkk6/M/IMG_9139-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-xXt3sJH/0/KS89nQgmhX9LcSZzgQ42DhcSZ7bNH9LDsmNmsdng7/M/IMG_9140-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-42tJ2jC/0/LkkTtcWNDBWKQ2WPmC6PNJLSD9pmLTpPLtWTvHXD7/M/IMG_9141-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/BMW-X5-B-B/i-9fcFHSs/0/NWcVwgW8q9sj59bFWgP8bCHndH8n3NMt6JjVhk9vL/XL/IMG_9138-XL.jpg"
    ],
    "pricePerDay": "645.00",
    "isFeatured": false,
    "specifications": {
      "make": "BMW",
      "model": "X5",
      "exteriorColor": "Black",
      "interiorColor": "Black",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bmw-x6-x-drive-40i",
    "slug": "bmw-x6-x-drive-40i",
    "title": "BMW X6 X Drive 40i",
    "subtitle": "Dark Green exterior",
    "brand": "BMW",
    "brandSlug": "bmw",
    "images": [
      "https://photos.smugmug.com/Luxx-dy/BMW-X6/i-bpwmhmT/0/Mxf2T7NqkkjD7wWKN8kxvjJDK6qLjZQH9nwTSnzn7/L/_DSC6278-Enhanced-NR-L.jpg",
      "https://photos.smugmug.com/Luxx-dy/BMW-X6/i-FjrtrL2/0/KngrjD9xgqtVqFVqJjMKJtTf2FWBjGn8FdDNdtbB6/M/Carro%209-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/BMW-X6/i-3vjbv8J/0/KSwNdtgCqqmJmHDbMkcGHfmdTjqN8WRmdcnF9DJBx/M/_DSC6241-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/BMW-X6/i-z5bNRtQ/0/Ljq47rX33zzKZC8QmXkFqJrGHWsLFhjKgFTcdcXw6/M/_DSC6245-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/BMW-X6/i-MndTNzw/0/MQHqm7Jq5Th5Xfv8mBQQ5tJVcszBvxHVnfxXF7Ghs/M/_DSC6246-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/BMW-X6/i-bpwmhmT/0/KV4JmmSqDppLpVr9Z3TZxjt8msBb9JRQLhTGjpxVr/XL/_DSC6278-Enhanced-NR-XL.jpg"
    ],
    "pricePerDay": "645.00",
    "isFeatured": false,
    "specifications": {
      "make": "BMW",
      "model": "X6 X Drive 40i",
      "exteriorColor": "Dark Green",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bmw-x6m",
    "slug": "bmw-x6m",
    "title": "BMW X6M",
    "subtitle": "Black exterior",
    "brand": "BMW",
    "brandSlug": "bmw",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-qBPZbZB/0/NFFcWnBR2n89VVw3rn7JLCpSHf5BRcwFNXx3L67BP/L/PHOTO-2022-10-17-17-45-37-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-qBPZbZB/0/KhPLWSQjSrsZsGFJTRR2pNgVrqqLjX8gR3xd47r5J/M/PHOTO-2022-10-17-17-45-37-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-2kwtj3h/0/Lscj7dvHtFZzpTcdgMGrNsnQGH3KzBzTNWCBMK2C6/M/PHOTO-2022-10-17-17-45-37%202-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-DgFG3nV/0/KHQxCQn6Z5DBm87jVZgC8V47NKFhTZz8Rbd9xH93z/M/PHOTO-2022-10-17-17-45-37%203-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-V9bPpPz/0/MF4kTZ4G4LxRkg4nhPhqLzdKvLxqKXdxM86XpHrvr/M/PHOTO-2022-10-17-17-45-37%204-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X6-M-Pack-2022/i-qBPZbZB/0/LQsdS93Vs5JnFHS3sKsqckjHLxSPNhMKtnhb3tHbc/XL/PHOTO-2022-10-17-17-45-37-XL.jpg"
    ],
    "pricePerDay": "645.00",
    "isFeatured": false,
    "specifications": {
      "make": "BMW",
      "model": "X6M",
      "exteriorColor": "Black",
      "interiorColor": "Brown",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bmw-x7-xdrive-40i",
    "slug": "bmw-x7-xdrive-40i",
    "title": "BMW X7 Xdrive 40i",
    "subtitle": "Carbon Black Metallic exterior",
    "brand": "BMW",
    "brandSlug": "bmw",
    "images": [
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-tWm6Sx9/0/NjRZFWhSgSPzhZqgwzXTS58J9gmBhL9dMMSrzMFx6/L/0fzOtjbw-L.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-tWm6Sx9/0/LsBfLFd6hTGBCSXjvrBG6RJtMSCqTWNVcJsGqKrzR/M/0fzOtjbw-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-jpMrcH5/0/MhMc6xfBVRGWmCScxRhsK9gBGGvKLKhgkVGhqzmqg/M/CaLynYdQ-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-sX3QDbC/0/MVSPHTVzNZVHT3vd6b8DqJQxCDBmjHFZ2wbp2CRfg/M/YeWhg0lQ-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-bcNpbBR/0/KzgHxtc9bC7MBDNDWKmssJFcbnSSXmVk6nL2hvCVF/M/IMG_0396-M.jpg",
      "https://photos.smugmug.com/Luxx-dy/2023-BMW-X7-M-40i/i-tWm6Sx9/0/LkKpBJWzgGMM9vncg3DWmbxRQ6qLWspFxZf3Dkzpj/XL/0fzOtjbw-XL.jpg"
    ],
    "pricePerDay": "645.00",
    "isFeatured": false,
    "specifications": {
      "make": "BMW",
      "model": "X7 XDrive 40i",
      "exteriorColor": "Carbon Black Metallic",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bmw-xm5",
    "slug": "bmw-xm5",
    "title": "BMW Xm5",
    "subtitle": "White exterior",
    "brand": "BMW",
    "brandSlug": "bmw",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-Krk2FHW/0/KJfTzpGfw7M5PswHLq5cncK6m37k8KJ6L2jL6CQfx/L/PHOTO-2022-10-17-17-45-08-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-Krk2FHW/0/MgjW5WKhDsFhbHKBJgdw3bGz7GR3kdK2H4xL7LL5d/M/PHOTO-2022-10-17-17-45-08-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-khMjXXC/0/MjZzPRqF2tVHCVKbxqNDRxL9M3BwdJLLQjmWZKbXF/M/PHOTO-2022-10-17-17-45-08%202-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-GHzjkJh/0/LdTmSpHkKcNvSCM5DWNnMwMX3vZp4Xbf7FxXcT6RM/M/PHOTO-2022-10-17-17-45-08%203-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-DsRrHqt/0/KJbQpjdBczHCTGkFRCS8Fjr6pkhFnHwJTtpTpgBj6/M/PHOTO-2022-10-17-17-45-08%204-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/BMW/BMW-X5-M-Pack-2022/i-Krk2FHW/0/KM8tN8mcrMxgV3bHrmNgb5XdfNsSBL5m3xcnXDmKw/XL/PHOTO-2022-10-17-17-45-08-XL.jpg"
    ],
    "pricePerDay": "645.00",
    "isFeatured": false,
    "specifications": {
      "make": "BMW",
      "model": "XM5",
      "exteriorColor": "White",
      "interiorColor": "Brown",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bmw-m2",
    "slug": "bmw-m2",
    "title": "BMW M2",
    "subtitle": "Baby blue exterior",
    "brand": "BMW",
    "brandSlug": "bmw",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/BMW-M2/i-ggSXWVp/0/MX9fdPGHqpfGnH94vQ9mXQfCFvbVF4jPrSKXKhdKr/L/DSC07491-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/BMW-M2/i-ggSXWVp/0/KvBMdhzN5s3XnBQTxGv62V3Cj8pqBFbkKW3NWRrqt/M/DSC07491-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/BMW-M2/i-rwXhL2c/0/NQkb5kjzxw9W4QDg9f4bsjNd8bkGvRbzq3CCfpxtM/M/DSC07498-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/BMW-M2/i-RFrVTD4/0/NTcf5GppGcQ3TzTmjwBJPxhjcrzCR6XdB6zDHFCXW/M/DSC07502-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/BMW-M2/i-6LsgCGS/0/KHMv4Hz7SXrpggcFTwwRWGJJhnthhtfgsT8rwt7bT/M/DSC07508-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/BMW-M2/i-ggSXWVp/0/LJmdwpdDftN3HcLzfkLhPXhFpjGvPMd4Df3wvgRhH/XL/DSC07491-XL.jpg"
    ],
    "pricePerDay": "350.00",
    "isFeatured": false,
    "specifications": {
      "make": "BMW",
      "model": "m2",
      "exteriorColor": "Baby blue",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bentley-bentayga",
    "slug": "bentley-bentayga",
    "title": "Bentley Bentayga",
    "subtitle": "White exterior",
    "brand": "Bentley",
    "brandSlug": "bentley",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-White/i-bhr4rq5/0/MGbWqQ3PmzbTsT2Cz3r59XQXZZhQKKXvStRknm7Cf/L/DSC03647-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-White/i-bhr4rq5/0/LxB2HRQ8FMdgtjRP6rKrPNVGzMPThRZT3Jq69xQBv/M/DSC03647-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-White/i-zSW8Lmd/0/LwcNd8FnqPXZTbnZdBHM29W7zM4KjQ5sgVwHNSj6W/M/DSC03608-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-White/i-JSLDCFg/0/LwLCDFnh6vXCkpvT3VJG7LGJnk2ZTbhJ5dB73Z54G/M/DSC03628-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-White/i-wtF5rc8/0/KhhRDwsxNNDCsTwHPJBns5JRNTVmKmVQQvJDCb4XG/M/DSC03651-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-White/i-bhr4rq5/0/MntjsP3kMqXQDH3B5WFn326NHRWjj5f9xzJKSBDRx/XL/DSC03647-XL.jpg"
    ],
    "pricePerDay": "895.00",
    "isFeatured": false,
    "specifications": {
      "make": "Bentley",
      "model": "Bentayga",
      "exteriorColor": "White",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bentley-bentayga-speed",
    "slug": "bentley-bentayga-speed",
    "title": "Bentley Bentayga Speed",
    "subtitle": "black exterior",
    "brand": "Bentley",
    "brandSlug": "bentley",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-Speed/i-pXMDCqQ/0/NF84ms4sC7hsJVWfVhfDHRmB5hBvHWBVsxH8BhhSH/L/DSC03839-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-Speed/i-pXMDCqQ/0/MLr9F4vMcCv7rthQVLMdbCh4XppcM7cwc6c9NbbwB/M/DSC03839-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-Speed/i-FDghqkr/0/MHJM5LM72WjNmqJqZCdMMjnThsk5tpfvKt22W7rXX/M/DSC03839-Edit-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-Speed/i-56BZvjJ/0/MSM3Gw9228gkhCt69RdprjvgFv6d5WSZCPNBVSscM/M/DSC03840-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-Speed/i-jxpwcKJ/0/NfXb9pFrVRLhRwPxB8j8vtBhNxp9pC6MqZDfqDKdr/M/DSC03847-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Bentayga-Speed/i-pXMDCqQ/0/LdJJdQcrzNZwQsxp8wXMBRXpVW8wghXMhpJ34Qqvh/XL/DSC03839-XL.jpg"
    ],
    "pricePerDay": "995.00",
    "isFeatured": false,
    "specifications": {
      "make": "Bentley",
      "model": "Bentayga Speed",
      "exteriorColor": "black",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-bentley-spur",
    "slug": "bentley-spur",
    "title": "Bentley Spur",
    "subtitle": "blue exterior",
    "brand": "Bentley",
    "brandSlug": "bentley",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Flying-Spur/i-BhC4RsR/0/MzpzB756ZsvhRPkmjtMDLqjv58N55bMmnqTRVBtwF/L/197A6163-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Flying-Spur/i-BhC4RsR/0/MLLvsLL8j8f4phgFpRP3NKHCQnGhfRC4pHSXhKmBM/M/197A6163-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Flying-Spur/i-9s6mjCc/0/LSB4d7W62J9qDnSBxhp48FBq5VxKfd7WqNvLWKQnn/M/197A6168-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Flying-Spur/i-823RkLb/0/NPcFGRBthrB2TfghJT56BWQLRDhSNVS2ZxWStP6M2/M/197A6144-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Flying-Spur/i-3w3dDPc/0/NXpRdJrW8V3VxRGnQ29RhZjWWfFQLJqzVJDxpSM59/M/197A6129-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Bentley-Flying-Spur/i-BhC4RsR/0/Kppzn8fN4zm9htgv9tvbZbm29ss7rWmdJnC6qjT77/XL/197A6163-XL.jpg"
    ],
    "pricePerDay": "1175.00",
    "isFeatured": false,
    "specifications": {
      "make": "Bentley",
      "model": "Spur",
      "exteriorColor": "blue",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-cadillac-escalade",
    "slug": "cadillac-escalade",
    "title": "Cadillac Escalade",
    "subtitle": "BLACK exterior",
    "brand": "Cadillac",
    "brandSlug": "cadillac",
    "images": [
      "https://photos.smugmug.com/Luxx-mu/Cadillac-Escalade-Captain-6-Seats-Black/i-g22BgHG/0/MzW4LdgfGKdg65Zxs8mgkDFDdG3sNCxvNbNScXjs7/L/Photo%20Nov%2020%202024%2C%2010%2011%2002%20AM-L.jpg",
      "https://photos.smugmug.com/Luxx-mu/Cadillac-Escalade-Captain-6-Seats-Black/i-cZBvRbF/0/NjW9zG6fpFtWrM8Bb56h98MJDm6ZW7qXhRVPgZQfn/M/4-escalade08803-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Cadillac-Escalade-Captain-6-Seats-Black/i-Vh4p9VK/0/MKF8KhsgHzHcGtMqFTrCTVGLTvW6vcvp5Q2dFpKmw/M/5-escalade08795-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Cadillac-Escalade-Captain-6-Seats-Black/i-SsrV72N/0/M9Tk2kCzV4hj8j5hfgkNfGjq2ThFXKh9L7r8smr9z/M/6-escalade08793-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Cadillac-Escalade-Captain-6-Seats-Black/i-n5DP7K9/0/KZPGJ4X58sN2xNcdJn4cQW4ZrjBNxj9qbTpDHZf88/M/Escalade-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Cadillac-Escalade-Captain-6-Seats-Black/i-g22BgHG/0/MhXzbxQ74TfHphFTsJQn42kk59k8dBzdtPmBFG3qs/XL/Photo%20Nov%2020%202024%2C%2010%2011%2002%20AM-XL.jpg"
    ],
    "pricePerDay": "550.00",
    "isFeatured": false,
    "specifications": {
      "make": "CADILLAC",
      "model": "ESCALADE",
      "exteriorColor": "BLACK",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-cadillac-escalade-esv",
    "slug": "cadillac-escalade-esv",
    "title": "Cadillac Escalade Esv",
    "subtitle": "Black exterior",
    "brand": "Cadillac",
    "brandSlug": "cadillac",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-ESV-Black-Black/i-5HML3QQ/0/KtbRJFRfpzMnqVQdNnMFPphgc7975stZTJcNrTQ2r/L/DSC08983-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-ESV-Black-Black/i-5HML3QQ/0/Lr7pvtntvgKMvMCqSd4sNxkmdGBZ3Hk7MJ7RSTxZF/M/DSC08983-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-ESV-Black-Black/i-tmtBjNq/0/K6FMhhx2fR5BGmrs4M2sDKRPD9zHMQSfnPKcWPVqM/M/DSC09033-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-ESV-Black-Black/i-FhcXcdh/0/M2d64MMgcRM7xFjp4SQ4mjLNLr7mfHbGsQRGKxn7v/M/DSC09035-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-ESV-Black-Black/i-Zhjp8FZ/0/L9qnfwf7Vg5n6x2ZrRknSrvpBvrJkDpx97mNkq9gZ/M/DSC09039-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-ESV-Black-Black/i-5HML3QQ/0/MJ52HX2mgw6h6LjXTL2FXNZ7gQGcrqmLQWPShtBsj/XL/DSC08983-XL.jpg"
    ],
    "pricePerDay": "550.00",
    "isFeatured": false,
    "specifications": {
      "make": "CADILLAC",
      "model": "ESCALADE ESV",
      "exteriorColor": "Black",
      "interiorColor": "Black",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-cadillac-escalade-platinum",
    "slug": "cadillac-escalade-platinum",
    "title": "Cadillac Escalade Platinum",
    "subtitle": "Black exterior",
    "brand": "Cadillac",
    "brandSlug": "cadillac",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-Plat-Black-Brown/i-M6JTmxd/0/NNP6D4pvS4hMtkR6t4wNx7bSZp8KQqtTtF2Z8KjFC/L/IMG_3613-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-Plat-Black-Brown/i-M6JTmxd/0/MPRnbKGWBnKgxNbhjpFswQFMZR6Sg2hxFMGdgQWrD/M/IMG_3613-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-Plat-Black-Brown/i-PZ96Lpb/0/NChdqRhfvVS6zNhVPQx9rDQwNNhZhSzNRjq4VG55D/M/IMG_3614-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-Plat-Black-Brown/i-J2zvbh8/0/KrwpJkqTJZkcG4rq5DpgrGWTbgMQPNJtCVN6KPT6k/M/IMG_3615-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-Plat-Black-Brown/i-5CvCmD3/0/MJRPFkFRN994kVcQsjHH3JZQBcb2SvNnX4VCknPSW/M/IMG_3616-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Escalade-Plat-Black-Brown/i-M6JTmxd/0/KQqNTTHndvmJ4SqwPntKG8g9FkhzHt3v28W4d8hBL/XL/IMG_3613-XL.jpg"
    ],
    "pricePerDay": "550.00",
    "isFeatured": false,
    "specifications": {
      "make": "CADILLAC",
      "model": "ESCALADE PLATINUM",
      "exteriorColor": "Black",
      "interiorColor": "Brown",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-chevy-c8",
    "slug": "chevy-c8",
    "title": "Chevy C8",
    "subtitle": "BLUE exterior",
    "brand": "Chevy",
    "brandSlug": "chevy",
    "images": [
      "https://photos.smugmug.com/Luxx-pr/C8-Blue-Conv/i-2vcMjjZ/0/KjqzSZqnK846NXSvHMwFV2pJdsVzWqS8gFBq9KWTt/L/DSC09299-L.jpg",
      "https://photos.smugmug.com/Luxx-pr/C8-Blue-Conv/i-2vcMjjZ/0/ML5Z58cVT2TFHvmtF39N5ZL3z2NK6nQbTLBLh4h2V/M/DSC09299-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/C8-Blue-Conv/i-k3K6TJR/0/MbCVrRRrJrMKvHvLz7C5w4g8LhLbJcPgNVsddW5vp/M/DSC09302-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/C8-Blue-Conv/i-sff6cjD/0/LwQKW3rXB3dSqxsQ7LzJXXGDLrm46d8H5KchsDJqN/M/DSC09303-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/C8-Blue-Conv/i-Sf2WC2d/0/Mphd7gcGzdL2nWfQJD8rPrqWSRXQbMtQWbLPddScW/M/DSC09304-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/C8-Blue-Conv/i-2vcMjjZ/0/M86KDzVmwRtxGFXJBvK6LL7X9zNr5RRb7pXKvLZB7/XL/DSC09299-XL.jpg"
    ],
    "pricePerDay": "495.00",
    "isFeatured": false,
    "specifications": {
      "make": "CHEVY",
      "model": "C8",
      "exteriorColor": "BLUE",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-chevy-corvette-c8",
    "slug": "chevy-corvette-c8",
    "title": "Chevy Corvette C8",
    "subtitle": "Green exterior",
    "brand": "Chevy",
    "brandSlug": "chevy",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/C8-Lime-Green-Black/i-hqkTKbb/0/MgZjhpP5sR4SjPtTFkTtFNzKpVrKqdpbM7gcsLkCM/L/dsc03719-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/C8-Lime-Green-Black/i-hqkTKbb/0/L5wgFPPhKnwPK4Q87btL5vXmQ4W8mXHrTxnZH27Wz/M/dsc03719-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/C8-Lime-Green-Black/i-9ZQjjmL/0/KptTLXHGz5BMcs9756845HDzdPQrW6JqCB4nRJHbv/M/dsc03723-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/C8-Lime-Green-Black/i-q7tPfff/0/MmpnXxM9stbbcPnN2F2TV43T65xp4g3HTWDrSwqh4/M/dsc03735-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/C8-Lime-Green-Black/i-H9XhjnX/0/NT2NCJfZFcnKTNPSGSg2F2tS8xnSbHpt6NgS5mp5J/M/dsc03737-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/C8-Lime-Green-Black/i-hqkTKbb/0/MDvKvm7hmf7r4Rngjt8N5ZRqqKwPMxRhNKW3VhXQJ/XL/dsc03719-XL.jpg"
    ],
    "pricePerDay": "495.00",
    "isFeatured": false,
    "specifications": {
      "make": "CHEVY",
      "model": "CORVETTE C8",
      "exteriorColor": "Green",
      "interiorColor": "Black",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-cadillac-escalade-2",
    "slug": "cadillac-escalade-2",
    "title": "Cadillac Escalade",
    "subtitle": "Black exterior",
    "brand": "Cadillac",
    "brandSlug": "cadillac",
    "images": [
      "https://photos.smugmug.com/Luxx-mo/Gloss-Black-Escalade/i-DJQVPBZ/0/KqHTsgGkJBknC6n6mnTpHzzGHjdzhWQzgdqMFhqHb/L/Empire%20Exotics%20Gloss%20Black%20Escalade-01-L.jpg",
      "https://photos.smugmug.com/Luxx-mo/Gloss-Black-Escalade/i-DJQVPBZ/0/MHTXFqGvFvrTBCc3HrWVn9ssVM3Phbbp3kJKdbgJ6/M/Empire%20Exotics%20Gloss%20Black%20Escalade-01-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/Gloss-Black-Escalade/i-Gz5mbPH/0/NFS4K9dSwGbLSr5rQ9gcwtPdbCgFbwfJJ8RNQWg9m/M/Empire%20Exotics%20Gloss%20Black%20Escalade-02-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/Gloss-Black-Escalade/i-BkjDqx5/0/LVNcLJDW2wBL5BfKsqDV5btLvR6hmbnMPx5npSF9p/M/Empire%20Exotics%20Gloss%20Black%20Escalade-03-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/Gloss-Black-Escalade/i-bcPmqFJ/0/NP7mcbMLcShBJszJvFRHszNzjTcTFNf2KVj2kLjh2/M/Empire%20Exotics%20Gloss%20Black%20Escalade-04-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/Gloss-Black-Escalade/i-DJQVPBZ/0/L8pDpVFTFZZMkdxqRhNfjsJS34rhNpfwkFMdV26GF/XL/Empire%20Exotics%20Gloss%20Black%20Escalade-01-XL.jpg"
    ],
    "pricePerDay": "595.00",
    "isFeatured": false,
    "specifications": {
      "make": "Cadillac",
      "model": "Escalade",
      "exteriorColor": "Black",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-cadillac-escalade-v-series-esv",
    "slug": "cadillac-escalade-v-series-esv",
    "title": "Cadillac Escalade V-series Esv",
    "subtitle": "Black / Black exterior",
    "brand": "Cadillac",
    "brandSlug": "cadillac",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Escalade-v/i-fkCmGj8/0/MQWh3gnMj7FwMcVLxxj46KbZRvJdcbVP94VDngtct/L/RD1_9838-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Escalade-v/i-h6pVR7c/0/M58DMKw8wHdzjfHQvTtHtFfKhrp8Kshz4SvCCfwT7/M/RD1_9922-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Escalade-v/i-QwrbsGC/0/Kg6Lg448tFCfzm2RWfvdbX8SDh99W5ZwzsBJp3Wq7/M/RD1_9879-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Escalade-v/i-MJHff6g/0/LRVwKx6r6HwZNsQkC4JZvSzZzBXQH44kw7FX2MRXF/M/RD1_9872-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Escalade-v/i-8sHhz74/0/KsDhV5DpqsCjF2KBvmxpzcLL2PXVcCjXBTwCgrqGc/M/RD1_9881-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Escalade-v/i-fkCmGj8/0/LbzzdJX5zFz7Gb8XSq8McgwwZpzVv4BJWZdJjMjTJ/XL/RD1_9838-XL.jpg"
    ],
    "pricePerDay": "595.00",
    "isFeatured": false,
    "specifications": {
      "brand": "Cadillac",
      "seats": 5,
      "bodyType": "Suv",
      "horsepower": 682,
      "acceleration": "4.4s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-chevrolet-corvette",
    "slug": "chevrolet-corvette",
    "title": "Chevrolet Corvette",
    "subtitle": "Blue / Black exterior",
    "brand": "Chevrolet",
    "brandSlug": "chevrolet",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/CHEVY-C8-CORVETTE-BLUE-ON-WHITE/i-25f8Rkn/0/LLK4L8wgk9tnxHt54SxB5zZgBfKnM7fvSDgWwWDzv/L/467F8754-C7B7-4939-BB7C-AFD7202A2360_1_105_c-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CHEVY-C8-CORVETTE-BLUE-ON-WHITE/i-25f8Rkn/0/LFFqLskJTqN6pB8DpD9pq7vZVZkftpBN68TDbhRsQ/M/467F8754-C7B7-4939-BB7C-AFD7202A2360_1_105_c-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CHEVY-C8-CORVETTE-BLUE-ON-WHITE/i-KtfrC9t/0/LsGmtx8Q5GWGQ2ct68DmXcRQKSf8Bqw5nV5zGbQsn/M/E3CD5A9F-950B-43AF-B032-FDE58D60AE3A_1_105_c-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CHEVY-C8-CORVETTE-BLUE-ON-WHITE/i-xgn7sfh/0/MMgSSWs4vz4Q2D4CHZQW2d5Fb2ZjDVqDzwPQ3DzLf/M/IMG_3753-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CHEVY-C8-CORVETTE-BLUE-ON-WHITE/i-XsrVTGG/0/LLMr5gqQZwDrdqH4HPqz7PxQw2XBdrTLbpPVCtF69/M/EB600637-01CA-44A0-B968-9443E499AACC_1_105_c-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CHEVY-C8-CORVETTE-BLUE-ON-WHITE/i-25f8Rkn/0/KswWZhm3cmKPLd7sjX3VGTL3f9XgrVT8k7ct4wH2w/XL/467F8754-C7B7-4939-BB7C-AFD7202A2360_1_105_c-XL.jpg"
    ],
    "pricePerDay": "495.00",
    "isFeatured": false,
    "specifications": {
      "brand": "Chevrolet",
      "seats": 2,
      "bodyType": "Coupe",
      "horsepower": 490,
      "acceleration": "3.7s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-chevrolet-corvette-z06",
    "slug": "chevrolet-corvette-z06",
    "title": "Chevrolet Corvette Z06",
    "subtitle": "Yellow exterior",
    "brand": "Chevrolet",
    "brandSlug": "chevrolet",
    "images": [
      "https://photos.smugmug.com/Luxx-Fo/Yellow-Corvette-ZO6/i-s4TMRqL/0/KDStMDtds5bR78msqZ27mGqw8jvDRXHjskXFQh9B7/L/IMG_6221-L.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Yellow-Corvette-ZO6/i-s4TMRqL/0/Lvzj2n2sMgmZf3vWKrNcfTgxzTNFnjSr99Lrw5dSC/M/IMG_6221-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Yellow-Corvette-ZO6/i-tVntdsh/0/MHDWz9mrJc6QL37sHrFvM6vzm5WvmHnGzBTGHMD8n/M/IMG_6222-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Yellow-Corvette-ZO6/i-sJvFDmS/0/Kj9JgGkSBm2TFP6nBQzfXsStgPhpw5fKmt4fZN4Gm/M/IMG_6224-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Yellow-Corvette-ZO6/i-g6BFpH5/0/LBtCxgRk2mcfCTzwL2XJnRnDPJj879bmhqZGZH2m7/M/IMG_6225-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Yellow-Corvette-ZO6/i-s4TMRqL/0/KxZZWFtcrDwfnMTnf4PTTTQZ6XGNqvd9kxNtJ7PPs/XL/IMG_6221-XL.jpg"
    ],
    "pricePerDay": "695.00",
    "isFeatured": false,
    "specifications": {
      "make": "Chevrolet",
      "model": "Corvette Z06",
      "exteriorColor": "Yellow",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-chevy-corvette-stingray-c8-3lt",
    "slug": "chevy-corvette-stingray-c8-3lt",
    "title": "Chevy Corvette Stingray C8 3lt",
    "subtitle": "Blue exterior",
    "brand": "Chevy",
    "brandSlug": "chevy",
    "images": [
      "https://photos.smugmug.com/Cars/Chevrolet-Corvette-Stingray-C8/i-4s6Fg7Z/0/KZRBKQLpBDH6FSZQZ6HX2zGdBRB96qg9kznsD7hqR/L/_DSC5523-Enhanced-NR-L.jpg",
      "https://photos.smugmug.com/Cars/Chevrolet-Corvette-Stingray-C8/i-LqKtHf7/0/L4wPXXvBCwbBqrHgvWSZmC9ZHXC2kqvCT57Wr3TPB/M/Corvette%20New%20-M.jpg",
      "https://photos.smugmug.com/Cars/Chevrolet-Corvette-Stingray-C8/i-MNjHjCb/0/L2mv4jj4Qp5GnGJjJkqHdGHRMRB5pCzNvSGNvkXFZ/M/9-8-23%20drop%20off%20%281%29-M.jpg",
      "https://photos.smugmug.com/Cars/Chevrolet-Corvette-Stingray-C8/i-WjNDxQ8/0/ML4Nhh8ngfNbXjnfKZQvgWS9GnSNwQHpRFwjc7Wkn/M/_DSC5477-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Cars/Chevrolet-Corvette-Stingray-C8/i-vhTjtH6/0/Mr6LbRbWfBQLQm2CX8ThGgjq9mKHqDkhZQXczggxg/M/_DSC5480-Enhanced-NR-M.jpg",
      "https://photos.smugmug.com/Cars/Chevrolet-Corvette-Stingray-C8/i-4s6Fg7Z/0/NXtQgHK9ttL2pfb4Gb7mxL6cjZQ8CTkdCtSHBS9Xb/XL/_DSC5523-Enhanced-NR-XL.jpg"
    ],
    "pricePerDay": "495.00",
    "isFeatured": false,
    "specifications": {
      "make": "Chevy",
      "model": "Corvette Stingray C8 3LT",
      "exteriorColor": "Blue",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-chevy-suburban-ls",
    "slug": "chevy-suburban-ls",
    "title": "Chevy Suburban Ls",
    "subtitle": "Black exterior",
    "brand": "Chevy",
    "brandSlug": "chevy",
    "images": [
      "https://photos.smugmug.com/Cars/Suburban-Ls/i-xTgjzJv/0/KPHNWSv63XsP3h65FWzCfQTW7hFxP8RLpf82TVqn2/L/DSC_5433-L.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Ls/i-zJfnkm8/0/MqJnGtmr9fXCs6x994R5pwF8CPNPWbD88mMgdqWK5/M/3%20carro%205-M.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Ls/i-VvSMhJW/0/Ldw2Ngcjgs84GG3njSVsP36w4bf8tkPwjBLs4HWsZ/M/DSC_5407-M.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Ls/i-XZ2bMfc/0/LsXvWDDfQH77bmhwFLDVTMk6NQMzXbBgG6QZ2V2rf/M/DSC_5409-M.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Ls/i-pz3dfFD/0/MJpwm2xqb66ZZZD7krkmcf5sDg6FpcFqspG8qxXv5/M/DSC_5410-M.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Ls/i-xTgjzJv/0/LsK4DhgdwwQmF6pKDc4kCR7sxJpZ2Nb7TChz3h5kZ/XL/DSC_5433-XL.jpg"
    ],
    "pricePerDay": "395.00",
    "isFeatured": false,
    "specifications": {
      "make": "Chevy",
      "model": "Suburban Ls",
      "exteriorColor": "Black",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-chevy-suburban-premier",
    "slug": "chevy-suburban-premier",
    "title": "Chevy Suburban Premier",
    "subtitle": "Black exterior",
    "brand": "Chevy",
    "brandSlug": "chevy",
    "images": [
      "https://photos.smugmug.com/Cars/Suburban-Premier/i-Z9DkFNS/0/M8m9pJvPts5HKc973VJHX3HptRG979tGcVpGbMnhw/L/DSC_5343-L.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Premier/i-hSJN5Tn/0/LSGfpWZPcZs5M8xBdV65sqCDt3xND8gxXV5phxw3f/M/DSC_5341-M.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Premier/i-SVKNcnf/0/KxBNsTBWjVL4ZssPb5gcDr2M376sVV5C9bwsZvLhC/M/DSC_5342-M.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Premier/i-Z9DkFNS/0/MXdzW6V7BxF9thPb6dnQQ8QkNFjnd9mjPmJ47zSGn/M/DSC_5343-M.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Premier/i-hm83WM8/0/KxpPcTSPGMzD73SpVmWH9RhBx6Xv3tkVMgqPWhHZr/M/DSC_5344-M.jpg",
      "https://photos.smugmug.com/Cars/Suburban-Premier/i-Z9DkFNS/0/KgN8wj5S2C2MF7KRm89sCmV9PSKrShk62pv5TwQgN/XL/DSC_5343-XL.jpg"
    ],
    "pricePerDay": "395.00",
    "isFeatured": false,
    "specifications": {
      "make": "Chevy",
      "model": "Suburban Premier",
      "exteriorColor": "Black",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-ferrari-488-spider",
    "slug": "ferrari-488-spider",
    "title": "Ferrari 488 Spider",
    "subtitle": "White exterior",
    "brand": "Ferrari",
    "brandSlug": "ferrari",
    "images": [
      "https://photos.smugmug.com/Luxx-pr/Ferrari-488-Spider-WhiteBlack/i-j6KRnXr/0/NLtWRzdGZL7PsfP5XKKTwGWPp42BcCTPV4NB27qt8/L/DSC03662-L.jpg",
      "https://photos.smugmug.com/Luxx-pr/Ferrari-488-Spider-WhiteBlack/i-j6KRnXr/0/K7m2pxdkFwh7NWnqB7B7bqTVNQN27FF78TLS5wsrJ/M/DSC03662-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Ferrari-488-Spider-WhiteBlack/i-3cCZJR3/0/MHdgngcSSzxXxBJCb5V64FHhpCNtpwB2VZw8wg3SG/M/DSC03663-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Ferrari-488-Spider-WhiteBlack/i-sz3sZ6R/0/KrDcjJ6CRd9V3wDcGVJXg3FCgp4GTTPhf7xS895R2/M/DSC03664-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Ferrari-488-Spider-WhiteBlack/i-CSpD6mC/0/L85SGfwCB64HBfG99bFFtrg7FXH444pR4xJ9fdgxm/M/DSC03665-M.jpg",
      "https://photos.smugmug.com/Luxx-pr/Ferrari-488-Spider-WhiteBlack/i-j6KRnXr/0/MvW4TTsszBfxqJD7gNVm9HkdK2DskBKrpRqxkRqMq/XL/DSC03662-XL.jpg"
    ],
    "pricePerDay": "1195.00",
    "isFeatured": false,
    "specifications": {
      "make": "FERRARI",
      "model": "488 Spider",
      "exteriorColor": "White",
      "bodyType": "Convertible"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-ferrari-812-superfast",
    "slug": "ferrari-812-superfast",
    "title": "Ferrari 812 Superfast",
    "subtitle": "White exterior",
    "brand": "Ferrari",
    "brandSlug": "ferrari",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-superfast-White/i-qFnjMVg/0/Mc9DZPFTZRKJh4vxrLnkTQGs4qdXmRFDmHB3F88rQ/L/DSC05659-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-superfast-White/i-JsNWVj9/0/KzLQNn7qs4jwp8M7ZF3SC9t8KVmpxmXdNdg3xNxsq/M/DSC05636-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-superfast-White/i-ZkZVZVs/0/Nbvd4wch7xm4rFS7dBr4st9DdVbBzDc76K7B45NCT/M/DSC05640-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-superfast-White/i-7SDgcnp/0/KDh2KDFz5pKJc4vwRF8X99kKpk9nNMRr3k8W5pLcP/M/DSC05641-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-superfast-White/i-8Kdj7xZ/0/KhVwdnSbWsdhqNn64jjdbgPqGbp8L3whnDKWw67CR/M/DSC05642-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-superfast-White/i-qFnjMVg/0/KNpQRHbLDpSnvhFdG23pzFd7fRMpcDZhv2qPwfvRt/XL/DSC05659-XL.jpg"
    ],
    "pricePerDay": "2395.00",
    "isFeatured": false,
    "specifications": {
      "make": "FERRARI",
      "model": "812 Superfast",
      "exteriorColor": "White",
      "interiorColor": "Red",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-ferrari-f8-spider",
    "slug": "ferrari-f8-spider",
    "title": "Ferrari F8 Spider",
    "subtitle": "gray exterior",
    "brand": "Ferrari",
    "brandSlug": "ferrari",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Ferrari-F8-Spider-Matte-Grey/i-ZpjNjb8/0/L6KRXpckHxBBzMvgxh7DzT82gTP9m6bKBjhBXJLxr/L/DSC08385-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Ferrari-F8-Spider-Matte-Grey/i-ZpjNjb8/0/NMSfnQ27mLtkm3C7wfkM6jJZ48WLQL3NL7QM7FCzX/M/DSC08385-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Ferrari-F8-Spider-Matte-Grey/i-nvZqnGX/0/NcRfWhF3TpD2fRDpzKqkkmcm3NHM3KSN35sfnjTN8/M/DSC08387-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Ferrari-F8-Spider-Matte-Grey/i-MJsSXSG/0/LfwtJ8ms8nc69wWQKw9gq3qV6cm75XXfFB5mPFdr3/M/DSC08389-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Ferrari-F8-Spider-Matte-Grey/i-WqCJ2fC/0/NLPjHdt7ZjBRDxpnrBnnnL7zgQCb9FRMrw43vBGJP/M/DSC08393-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Ferrari-F8-Spider-Matte-Grey/i-ZpjNjb8/0/LpPn7fWWSksgpK67rMcKCLmV4BBPDMZNfH9HnPQZG/XL/DSC08385-XL.jpg"
    ],
    "pricePerDay": "1795.00",
    "isFeatured": false,
    "specifications": {
      "make": "FERRARI F8",
      "model": "SPIDER",
      "exteriorColor": "gray",
      "bodyType": "Convertible"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-ferrari-portofino",
    "slug": "ferrari-portofino",
    "title": "Ferrari Portofino",
    "subtitle": "Black exterior",
    "brand": "Ferrari",
    "brandSlug": "ferrari",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Ferrari-Portofino-Black-Black/i-vMr4bn8/0/LzcfLV49PvkR59xZHPq4FLNjQ3wgSwL79tBTrmDtK/L/DSC00945-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Ferrari-Portofino-Black-Black/i-vMr4bn8/0/Lf9qbCR6CfLbKMC5ZKbhSN4cHfdjNngF3WCNFM4GV/M/DSC00945-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Ferrari-Portofino-Black-Black/i-hmfdJD2/0/LQv56S6Sg7gmTVxc6DxhWNz8xFFkTm64Wt5pxSkQp/M/DSC00947-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Ferrari-Portofino-Black-Black/i-MjCm3Cd/0/L54ddgwhJhJLrqs2cnQ5X78czwQ7Gg7jSXGWT6Rxq/M/DSC00951-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Ferrari-Portofino-Black-Black/i-tfr8crP/0/NPrq3Kpj4VXSZZ2pjxkJ2VB5BHKcZtq8HvSMkX3mB/M/DSC00957-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Ferrari-Portofino-Black-Black/i-vMr4bn8/0/LD2tHgcTv42Wv748t5C9G7ngP4wNftnd4LRJMfDjW/XL/DSC00945-XL.jpg"
    ],
    "pricePerDay": "1195.00",
    "isFeatured": false,
    "specifications": {
      "make": "FERRARI",
      "model": "portofino",
      "exteriorColor": "Black",
      "interiorColor": "Black",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-ferrari-488",
    "slug": "ferrari-488",
    "title": "Ferrari 488",
    "subtitle": "Black / Black exterior",
    "brand": "Ferrari",
    "brandSlug": "ferrari",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-cbH2XtZ/0/KnsStBBJGbvzKRrhrxd6cqDGpGZNp6DNzPKc7h29W/L/DSC05199-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-JctqdhJ/0/LBv44zc7cQFzZmk9zgwQdxRFjFKbPVQM6KmChMjXz/M/DSC05240-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-s8LkVgL/0/M8wGJw8qrHjfnrVPzcsqTz3BJP8vd3vKt97qrvJPf/M/DSC05312-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-4qPQ4Hq/0/LrP3VCbtvPNSWHw4W8ZLNDfDzndKpCqPg7Kd368Dh/M/DSC05245-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-BK28RZf/0/NTsvSjkDm6WMBMJZ9PpvQPsvpR8sXzj5ZwM9GpgZ4/M/DSC05254-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/FERRARI/Black-Ferrari-488-Spyder/i-cbH2XtZ/0/M5Tnwcvgk3Bk9CdVtgFtD8fVJt43HsKmb9QTV2zDc/XL/DSC05199-XL.jpg"
    ],
    "pricePerDay": "1195.00",
    "isFeatured": true,
    "specifications": {
      "brand": "Ferrari",
      "seats": 2,
      "bodyType": "Supercar",
      "horsepower": 661,
      "acceleration": "3.0s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-ferrari-812-superfast-2",
    "slug": "ferrari-812-superfast-2",
    "title": "Ferrari 812 Superfast",
    "subtitle": "White / Red exterior",
    "brand": "Ferrari",
    "brandSlug": "ferrari",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-D9BStFd/0/LhrkhHvqFBkrSdPzLst6sWTfqQBXRVmB4fW442rD9/L/6EC07618-8A2E-4083-994E-4113888F6B09-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-D9BStFd/0/KLhfXxTF8s7cfBMjzjgCDpTtGC9BB5vnkvGFKrZgM/M/6EC07618-8A2E-4083-994E-4113888F6B09-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-xHsJts2/0/MMWJS2T6Rtfgtg264FPvt9KMLR2RS8SMSr8Pzxn4Z/M/76D51838-AFE8-4AA6-8A54-AEF95BD5DF86-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-sfFJvZF/0/LngRLVSnbNkHzzj9LvgTFdHgJxPGh6drgnw9jmMgw/M/C0C2F28B-D9B7-42FE-AD57-88E7E88DCDEF-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-dXNW78v/0/NPWMThcphstDMQJ7GJd6bhM77C8pLxz8QmNzWRkGJ/M/18FCEAC9-22DD-441E-AB3B-06BAD9FB6F0C-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-812-super-fast-Gray/i-D9BStFd/0/KGtxXVMskXkcgGbdNRqSWzSsSRh59L4PJV9jrFbzP/XL/6EC07618-8A2E-4083-994E-4113888F6B09-XL.jpg"
    ],
    "pricePerDay": "2395.00",
    "isFeatured": false,
    "specifications": {
      "brand": "Ferrari",
      "seats": 2,
      "bodyType": "Supercar",
      "horsepower": 789,
      "acceleration": "2.9s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-ferrari-f8",
    "slug": "ferrari-f8",
    "title": "Ferrari F8",
    "subtitle": "Red exterior",
    "brand": "Ferrari",
    "brandSlug": "ferrari",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-tZnsqTJ/0/LKwkcKHvc4dmQzJd9RQS49Dds5W8gVKs8f9KVWg4w/L/DSC01802-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-tZnsqTJ/0/MdcL3pBBtCwQkpVBSK8CMVg9m9DzH9Gz2QdPmP9cz/M/DSC01802-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-NHcq6Hm/0/MSKkP4rTG6nJrwSRcMMhTqNgPvL6RKC6sdwq9WfZk/M/DSC01808-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-h6Wc6cz/0/MHhRBNm3CzppwLFxCH4wjqJ2gLfzVkdzXqmqq9wQn/M/DSC01845-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-3k6HqSf/0/Ls58WZm7rVPk48Z3k2q3LqSq6h5cJjVk5BqN3Ddmm/M/DSC01857-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Red-Ferrari-F8-Spider/i-tZnsqTJ/0/Ksnd7pXcfHqRVbL9JZjTtRsVb5T7DSMgKhtDRfCdf/XL/DSC01802-XL.jpg"
    ],
    "pricePerDay": "1795.00",
    "isFeatured": false,
    "specifications": {
      "make": "Ferrari",
      "model": "F8",
      "exteriorColor": "Red",
      "interiorColor": "Peanut Butter",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-ferrari-sf-90",
    "slug": "ferrari-sf-90",
    "title": "Ferrari Sf-90",
    "subtitle": "Grey / Black exterior",
    "brand": "Ferrari",
    "brandSlug": "ferrari",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-r6DFPhh/0/LnxnxNfzXdKHgWNHfTWxBd3mDXKh5NR2cdfsvJpnx/L/DSC09371-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-Sd2n37k/0/MZhTgrL5XZMT3vbDWJwSfbqhH2hzNFbrm6r5VWdP3/M/Snapinsta.app_video_4844B44A7B54566CD740393A888430A4_video_dashinit-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-BL5g5G9/0/NPSBrZQtfnHLHNSwzzq5Hj3NbLNhcbQRDPtLCrQWP/M/DSC09294-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-7WSTDzS/0/Kgc8CR9zrRpZmjw2tPCcjGTmrRTjbx3VQwGjmScNj/M/DSC09303-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-zGwCVSN/0/NVP72SD5JmsKChvvdV2sPd9PQ9tGFvMXj2pQvkV2G/M/DSC09336-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Ferrari-SF90/i-r6DFPhh/0/M2mCvd7zm88x6hbcHssxQqvn9hgBx4J4RTNrmQX6r/XL/DSC09371-XL.jpg"
    ],
    "pricePerDay": "2595.00",
    "isFeatured": false,
    "specifications": {
      "brand": "Ferrari",
      "seats": 2,
      "bodyType": "Supercar",
      "horsepower": 986,
      "acceleration": "2.5s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-huracan-evo",
    "slug": "lamborghini-huracan-evo",
    "title": "Lamborghini Huracan Evo",
    "subtitle": "BLACK exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-Tqq7HmZ/0/MXvv3crJVdQFFWbk88mx4H25hz4339dNnNG7365KC/L/Photo%20May%2007%202025%2C%203%2057%2008%20PM-L.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-Tqq7HmZ/0/KDz9M9QzQkrjXp3ZxV8rGx3Qsc6wfHKx2WqqhQ7cd/M/Photo%20May%2007%202025%2C%203%2057%2008%20PM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-c5sp76c/0/Nh6qJ7bT45Q7WqRbqW5SGFrWhFg5fnG4mNWvTbN9D/M/hurracan6-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-XPTHct4/0/K9N6hkFHxbBnxjSDF3fS25QJkFh5bn5GQRMmzx2wn/M/hurracan4-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-WdZHmd3/0/MkxF2BTKZRqgFdsbfX4HtDVFpL8z5Q6nzhr2fsxSr/M/Photo%20May%2004%202025%2C%209%2059%2006%20PM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Huracan-Evo-Black-Orange/i-Tqq7HmZ/0/MfgwJShzDQr8tR3pmDgK2Lmn2Cw9bqCvzTd9MV5B2/XL/Photo%20May%2007%202025%2C%203%2057%2008%20PM-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "LAMBORGHINI",
      "model": "HURACAN EVO",
      "exteriorColor": "BLACK",
      "interiorColor": "ORANGE",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-huracan-tecnica",
    "slug": "lamborghini-huracan-tecnica",
    "title": "Lamborghini Huracan Tecnica",
    "subtitle": "BABY BLUE exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-qxnpQm3/0/Kkjx6bVfJKdhVFxS5DcrHKXbwB9G5vVsLHzppkv5N/L/DSC01584-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-qxnpQm3/0/KPR6gKXrQdx2t4zdfJGfnrZCL5WgwsXhcrqdg5s9k/M/DSC01584-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-kLDg5Mb/0/Mq2mLFC5LQG4BrzjRVJtGzBvm8dxDfC6wXVPggdFL/M/DSC01598-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-56C6m34/0/Ld7XL3wWBqDQ2ZKhHXhHqPxp5Jqm7B44p67H243Md/M/DSC01617-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-rTW6QST/0/LmqBz5sWWRGB8FwWsP97dFkwMJJZVMbKmWP9tPC67/M/DSC01632-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Huracan-Tecnica/i-qxnpQm3/0/M9rpGVwGFZQn6qkTSf2Vvkbw8nsgdvTbq4XKztqNx/XL/DSC01584-XL.jpg"
    ],
    "pricePerDay": "1195.00",
    "isFeatured": false,
    "specifications": {
      "make": "LAMBORGHINI",
      "model": "HURACAN TECNICA",
      "exteriorColor": "BABY BLUE",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus",
    "slug": "lamborghini-urus",
    "title": "Lamborghini Urus",
    "subtitle": "White exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-kr2v5pr/0/KgJGXVkpvKxDJ4qsh8wmfkFxz3pjKMcr2hJsVZdqF/L/IMG_9091-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-kr2v5pr/0/LM5q42kKvmLdgj3kqsCfm4nGN7ZGRwMbFKJTds4Bz/M/IMG_9091-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-Rzpw5XM/0/NKTD5ttt2f2sMKSbXtKw2R3Jf2gzWDFqLMZG3rLG2/M/IMG_9092-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-qWvTXGh/0/LK6GmrkC3hWxLBGb4B3JJKBHqfPw722xfMsg464Tt/M/IMG_9093-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-gMd36ct/0/Ld6MgMVFVdNJKH8BqT56d89b9bC99rk6P6nBKK8GR/M/IMG_9094-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Urus-White-Orange/i-kr2v5pr/0/M8VDb9DFJWnhNMsQW8XP92XkLfWRPqbj5WJmC7mTN/XL/IMG_9091-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "LAMBORGHINI",
      "model": "URUS",
      "exteriorColor": "White",
      "interiorColor": "Orange",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus-s",
    "slug": "lamborghini-urus-s",
    "title": "Lamborghini Urus S",
    "subtitle": "GRAPHITE ORANGE exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-2K2vS5H/0/KQmvMvQxS4sDkhJfXrmnL5q6RTLC8gpLmwCGrsBWp/L/Photo%20Jun%2010%202025%2C%2010%2034%2039%20AM-L.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-2K2vS5H/0/NXDRR6KLBcpbgBdGtqszhWKxgZPZJnpWQ4tG8nFCH/M/Photo%20Jun%2010%202025%2C%2010%2034%2039%20AM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-bWVW69P/0/K7NSDM5TbGHvHCQ3hW9jNSR3Sz9LFFw2fRBWTDCmk/M/Photo%20Jun%2010%202025%2C%2010%2038%2005%20AM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-ZSF9V9d/0/M9jRd2RLXZtpGRD4wVcXFfbzxwxnvt7xDvh2ggzpV/M/Photo%20Jun%2010%202025%2C%2010%2038%2016%20AM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-8LKgnk7/0/KS7GGHZ64tLrZkg7LFxnptxM2p4sf5348dgG3cnhJ/M/Photo%20Jun%2010%202025%2C%2010%2038%2034%20AM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Lamborghini-Urus-S-Graphite-Orange/i-2K2vS5H/0/LSb3trFCJt8msxvWGxzGWFFHdvLQ2pjLTpPfFfP9R/XL/Photo%20Jun%2010%202025%2C%2010%2034%2039%20AM-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "LAMBORGHINI",
      "model": "URUS S",
      "exteriorColor": "GRAPHITE ORANGE",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus-s-type",
    "slug": "lamborghini-urus-s-type",
    "title": "Lamborghini Urus S Type",
    "subtitle": "orange exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-xSZq85D/0/KrVF9HgMZcGC5FFjdqDVtMTd3rpbqBC2zVMjHFZQM/L/IMG_9293-L.jpg",
      "https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-xSZq85D/0/K3FjL4BVr5B5QWC5tnZXMh6CDRmSwswRXW8BgZJkr/M/IMG_9293-M.jpg",
      "https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-ZGw8TpT/0/LBQXwbKrZDGZFRDV4KqSPdBpmjCdvQmF6BHcpPzWC/M/IMG_9304-M.jpg",
      "https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-sr9wGHb/0/KRb2z4bc3pVzwxd2RWznJ6NrTjWLzVRktqtcKJqWR/M/IMG_9306-M.jpg",
      "https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-JxwJC4K/0/L6qMVpMF4fpmt425BpPp6n355csCV2Qbt6Hr2GBS4/M/IMG_9308-M.jpg",
      "https://photos.smugmug.com/Liv/Lambo-Urus-S-Orange-/i-xSZq85D/0/Mkm7fCJBgWWtWqfVm3HkCtKz6XnVGXhCc9vph98qM/XL/IMG_9293-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "LAMBORGHINI",
      "model": "URUS S TYPE",
      "exteriorColor": "orange",
      "interiorColor": "grey & orange",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus-2",
    "slug": "lamborghini-urus-2",
    "title": "Lamborghini Urus",
    "subtitle": "Matte Black exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-VK4zqgq/0/LpvDK9nB8PNb3VHQJbZ7R6zWdVk7nMPS6FZxBkDHC/L/DSC02373-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-VK4zqgq/0/L2rBh7fgxK5DD2nCvTV6wPgHPJpvSXpD27LNLvQ4M/M/DSC02373-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-bp8LBqH/0/KZ4BFbLkVJ3gDPHJBktBkKrQJNz6rBJf9pC9qcBZC/M/DSC02388-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-bNDhZBb/0/Lckzhnc2mqWwK7pqQjq4sFq6pHBmBxgJJKXQR69L5/M/DSC02393-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-ZzkmzJ8/0/NCj7HT8th5sGPJFnZQdqWzrnXHLxGHrRp4sJw9Wtj/M/DSC02397-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Yellow/i-VK4zqgq/0/MSpR4GptBMHHQw8jbNs2XXptv6zf6ZSRvkVScGdVx/XL/DSC02373-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "LAMBORGHINI",
      "model": "Urus",
      "exteriorColor": "Matte Black",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus-performante",
    "slug": "lamborghini-urus-performante",
    "title": "Lamborghini Urus Performante",
    "subtitle": "black exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Performante/i-PnK5kMv/0/K5HBgVQ2SxNbbvT48t86krbMLF9Qb6xbzffd4pCDh/L/DSC01107-Edit-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Performante/i-PnK5kMv/0/LMpHPkfmnm8KvZFX8gbD27qGMQMqshDM7Wvzp5W3N/M/DSC01107-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Performante/i-wQgKSZw/0/LBs9nL22t2hr25J7j4xPsDnDvzQHgt65PshptHbrJ/M/DSC01115-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Performante/i-JT3MpKF/0/MrkPQn2x623FrG6nCr7Wgq7K9sM9kp67nhHmPG5MZ/M/DSC01123-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Performante/i-D9B9fjP/0/K9QFHWpqGf82kxKQztsD5XhtZWHTmd9N4G5Kzt2hM/M/DSC01126-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Lamborghini-Urus-Performante/i-PnK5kMv/0/M3BKShXZkX2CZgNv3FFLNrDmjvrp4XfV4F7mT4Rw9/XL/DSC01107-Edit-XL.jpg"
    ],
    "pricePerDay": "1195.00",
    "isFeatured": false,
    "specifications": {
      "make": "LAMBORGHINI",
      "model": "Urus Performante",
      "exteriorColor": "black",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-aventador",
    "slug": "lamborghini-aventador",
    "title": "Lamborghini Aventador",
    "subtitle": "Gray exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Lambo-Aventador-Gray/i-7HttQSm/0/K7SmRwnJV5RWgnKmdxmj4LKJtfmNLZPJgbKNcX4b5/L/IMG_3956-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lambo-Aventador-Gray/i-fkhzbBS/0/Kbvbs7tRFCPNv7Vxjh7RXw2ZG9x9nsdV2z6QpzhZb/M/IMG_3957-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lambo-Aventador-Gray/i-4wcTVZ9/0/K3pxQ5w3NtSQvB2SqgZRcCDZPkW5RwcqSghcW6MTr/M/IMG_3959-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lambo-Aventador-Gray/i-JcNzL9C/0/KbzkptBGHS2fPss2NFnhhWKwNt2Pp8g8fXWHc6Lnt/M/IMG_3960-M.jpg"
    ],
    "pricePerDay": "2295.00",
    "isFeatured": true,
    "specifications": {
      "brand": "Lamborghini",
      "seats": 2,
      "bodyType": "Supercar",
      "horsepower": 730,
      "acceleration": "2.9s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-huracan-evo-2",
    "slug": "lamborghini-huracan-evo-2",
    "title": "Lamborghini Huracan Evo",
    "subtitle": "Yellow exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Yellow-Evo-Spider-/i-bt4Wr3J/0/MMq47jwgzh3LRpmCfnG4wSG9kV7KgBjKznCSjhVZT/L/DSC08405-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Yellow-Evo-Spider-/i-bt4Wr3J/0/LX66VBKGndgZfPxSg4zhGb4HNkJ7PpKpzqw6JrkwD/M/DSC08405-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Yellow-Evo-Spider-/i-8fKPnrf/0/NbXXRfn4ptZNZjMvrqZHHKHtt2rZNF8nz3H8tVNFb/M/DSC08389-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Yellow-Evo-Spider-/i-ZB6BR9j/0/LBpDPLphLC55jmdTXXXpfrMBkJscSCxVSFRMmc6Rn/M/DSC08373-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Yellow-Evo-Spider-/i-dWxg9d8/0/KS6wMZFzpGTDg9J8D5NqpKJfLjtT462XkZmNqvPMw/M/DSC08382-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Yellow-Evo-Spider-/i-bt4Wr3J/0/NJxZrCF5mr6FPhwLQ56gSkGqwk9xNVC676Nh6DSv7/XL/DSC08405-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "Lamborghini",
      "model": "Huracan Evo",
      "exteriorColor": "Yellow",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-huracan-sto",
    "slug": "lamborghini-huracan-sto",
    "title": "Lamborghini Huracan Sto",
    "subtitle": "Blue exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-STO/i-DVLTF3k/0/L/_BMS5199-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-STO/i-t8ZztKQ/0/MF75w2HzHCfVQJ2bkvFxfDNcSGVSPFZTBptzgNrVj/M/_BMS5188-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-STO/i-P2BRBzw/0/LDCftRG5ZRF4BcZJwtbNfk57tkVPJKPr6XkjbgMzV/M/_BMS5311-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-STO/i-cQ5MRx5/0/Kb8fRdJ5F7R2pdcX2zRS3sGhpLmXnRtD2B7d2t2gd/M/_BMS5224-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-STO/i-KgBtCBL/0/NfRFKMGvMD3xZxf4FWbPRCRXT5VM8sR99S7pv2Wq4/M/_BMS5154-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-STO/i-DVLTF3k/0/XL/_BMS5199-XL.jpg"
    ],
    "pricePerDay": "1895.00",
    "isFeatured": false,
    "specifications": {
      "make": "Lamborghini",
      "model": "Huracan sto",
      "exteriorColor": "Blue",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus-3",
    "slug": "lamborghini-urus-3",
    "title": "Lamborghini Urus",
    "subtitle": "Yellow / Red exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/Luxx-mo/White-Urus-Pics/i-VNT3xNs/0/L55qsNqx58h5474R8gnKbh2RgTzftVvkgxGxrmxcG/L/Empire%20Exotics%20White%20Urus-26-L.jpg",
      "https://photos.smugmug.com/Luxx-mo/White-Urus-Pics/i-VNT3xNs/0/MNtJXwDbfsFq6DzC9cVrssSwBgkQCzgj9MHgRZtzX/M/Empire%20Exotics%20White%20Urus-26-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/White-Urus-Pics/i-fGNP33V/0/MCxCLKtxW7sRZNPsT4Jcsq38w9FkF7HKTDzv2jxz8/M/Empire%20Exotics%20White%20Urus-25-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/White-Urus-Pics/i-LF5kFrz/0/L4tvzz3pB5Pr2H7h76kzbSfBWRG9NqcCHv9V3n8rn/M/Empire%20Exotics%20White%20Urus-24-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/White-Urus-Pics/i-g3p9Lhf/0/MQN9wkfDZ6DWDG39dVv77nrHqbsrqxgTG2KcSstNW/M/Empire%20Exotics%20White%20Urus-23-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/White-Urus-Pics/i-VNT3xNs/0/MchLQZNsZS7pGqG4hPqvWN8D77CWLxqqzB54BHdHJ/XL/Empire%20Exotics%20White%20Urus-26-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "brand": "Lamborghini",
      "seats": 5,
      "bodyType": "Suv",
      "horsepower": 657,
      "acceleration": "3.6s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus-s-2",
    "slug": "lamborghini-urus-s-2",
    "title": "Lamborghini Urus S",
    "subtitle": "Blue exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Blu-Cepheus-Urus-S/i-JSKKZBt/0/K8mg7XVjNWm4t8hQxCScNW7JKjrsjLCPWX8xwSkzM/L/DSC01874-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Blu-Cepheus-Urus-S/i-JSKKZBt/0/LmS4FpchwCmpNMxSjbDfjq2gPcfKL5JctbcbKkdqt/M/DSC01874-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Blu-Cepheus-Urus-S/i-4wjWrn2/0/L3zS2xst6FxjnC3h3GmRGtqttkrBnZhhJfLQrBXqQ/M/DSC01819-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Blu-Cepheus-Urus-S/i-D7BF4wS/0/KVZKCHjQp5Cc7Xz2PWcXmXT2s5dzvxjgzMCBQ4LJK/M/DSC01810-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Blu-Cepheus-Urus-S/i-pJ22CX5/0/KxHB9v44hKwxD5WggnPtSWw8JJn6ZPQ3mfGHQ3NQn/M/DSC01811-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Blu-Cepheus-Urus-S/i-JSKKZBt/0/KxN3MmRRTnzcKV2MLhvPz5nHNq5DMzsHsnBMBGFSM/XL/DSC01874-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "Lamborghini",
      "model": "Urus S",
      "exteriorColor": "Blue",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus-se",
    "slug": "lamborghini-urus-se",
    "title": "Lamborghini Urus Se",
    "subtitle": "BLACK exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/Luxx-Fo/25-Lamborghini-Urus-SE/i-mbqZMxm/0/MWJGr8m3HpCh8VWTGfb6CvqrNqBBvML6rh29RXp8r/L/ForzaExotic%20Urus%20SE%201-L.jpg",
      "https://photos.smugmug.com/Luxx-Fo/25-Lamborghini-Urus-SE/i-mbqZMxm/0/KkwjxspqFk3Dj6g6z8qpVLdHJ5m9JNqvShQpRShDb/M/ForzaExotic%20Urus%20SE%201-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/25-Lamborghini-Urus-SE/i-bnVWdGW/0/NWZ3Kj4974h3X27bqZhTMN8xz6QC3vMpmZMbBm9mf/M/ForzaExotic%20Urus%20SE%202-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/25-Lamborghini-Urus-SE/i-Zbn5rDG/0/KcZkcRdRvQWrTG6bRb2Zz5j7N7tbfwZJd6CRhrkff/M/ForzaExotic%20Urus%20SE%203-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/25-Lamborghini-Urus-SE/i-V6Z8hbV/0/MG4hzNbQCSQG46F5DXNb8jLsvB3SMhDVLJb4tWZTQ/M/ForzaExotic%20Urus%20SE%204-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/25-Lamborghini-Urus-SE/i-mbqZMxm/0/NDXhhkxNFc8Vt5DnRdnJJ7m5mxnnBNXCngcTNZnrp/XL/ForzaExotic%20Urus%20SE%201-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "Lamborghini",
      "model": "Urus SE",
      "exteriorColor": "BLACK",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus-stage-2",
    "slug": "lamborghini-urus-stage-2",
    "title": "Lamborghini Urus Stage 2",
    "subtitle": "Orange / Orange exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-gW3s9CK/0/MHZg4Z8rFqzCGFqzHfx9738XzBRSCSvpXNXhkC5sQ/L/IMG_3459_jpg-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-qMrkG8q/0/NXf55NzV25Mf8QSLszSHPj4WWTG7DPHFRpt457TKH/M/IMG_3515_jpg-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-SbbghWG/0/KTnhJGXMvMJB6jdbFqq3gMM82Hj3RHnP3tvmTpqkg/M/IMG_3519_jpg-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-5K2jNcG/0/NFB9HMJDkbKPDngFnCxZJKsGbvWq56XjwnCHz9wM6/M/IMG_3509_jpg-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-Rb2StNh/0/LGS43smfqNPMvZPpJ5sqzhddhhvpbzhHT2KVqdDWG/M/7f27214a-460a-48c5-a4fb-d51b2d8fbe0a-M.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "brand": "Lamborghini",
      "seats": 5,
      "bodyType": "Suv",
      "horsepower": 657,
      "acceleration": "3.6s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-urus-stage-2-2",
    "slug": "lamborghini-urus-stage-2-2",
    "title": "Lamborghini Urus Stage 2",
    "subtitle": "Orange exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-gW3s9CK/0/MHZg4Z8rFqzCGFqzHfx9738XzBRSCSvpXNXhkC5sQ/L/IMG_3459_jpg-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-qMrkG8q/0/NXf55NzV25Mf8QSLszSHPj4WWTG7DPHFRpt457TKH/M/IMG_3515_jpg-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-SbbghWG/0/KTnhJGXMvMJB6jdbFqq3gMM82Hj3RHnP3tvmTpqkg/M/IMG_3519_jpg-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-5K2jNcG/0/NFB9HMJDkbKPDngFnCxZJKsGbvWq56XjwnCHz9wM6/M/IMG_3509_jpg-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-Rb2StNh/0/LGS43smfqNPMvZPpJ5sqzhddhhvpbzhHT2KVqdDWG/M/7f27214a-460a-48c5-a4fb-d51b2d8fbe0a-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Urus-Orange/i-gW3s9CK/0/KbqM7c4vrd6V4qMZSQNGwXXR4JBtzQkttKQJSJPx6/XL/IMG_3459_jpg-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "Lamborghini",
      "model": "Urus stage 2",
      "exteriorColor": "Orange",
      "interiorColor": "orange",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mclaren-570s",
    "slug": "mclaren-570s",
    "title": "Mclaren 570s",
    "subtitle": "BLACK exterior",
    "brand": "Mclaren",
    "brandSlug": "mclaren",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/570S/i-Bkxbqg5/0/Lng92msbFQWQfgZ9qJBpmps2KnNch2VPPphtdc6dX/L/DSC00966-Edit-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/570S/i-Bkxbqg5/0/M5pLNrwrDZMSVv2wvhrgQCfdmgZ6L9tPvv8XbmBfj/M/DSC00966-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/570S/i-j5pvmG9/0/NJSKggxr2S7kKmGmV9mdVL6Wb8zG8QH8mW4C2Tttb/M/DSC00972-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/570S/i-gjm6MSr/0/LLp4cxMcL97X9DHhZbmL6gtw2Gh3GCv6wwk6sXWgv/M/DSC00984-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/570S/i-hN6PGX9/0/MxpdnnsKsxrvFLjWvJc3WLTjtPHJ3VptVXg8t7jgP/M/DSC00998-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/570S/i-Bkxbqg5/0/L3FmRFg66QgmRJwDQfz8PpkZ9rDHmdMMP4PZS3Xz7/XL/DSC00966-Edit-XL.jpg"
    ],
    "pricePerDay": "895.00",
    "isFeatured": false,
    "specifications": {
      "make": "MCLAREN",
      "model": "570S",
      "exteriorColor": "BLACK",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-amg-gt",
    "slug": "mercedes-benz-amg-gt",
    "title": "Mercedes Benz AMG Gt",
    "subtitle": "White exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/AMG-GTS-White-Black/i-ckrWgx7/0/NML8jHM6QQz2MPCm54kWGn8kvVCgS4gq2LD6JfRJM/L/DSC00797-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/AMG-GTS-White-Black/i-ckrWgx7/0/NDWSth955XPXs9nLcfC58Xx3jxvndVs5NKqc4kQjB/M/DSC00797-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/AMG-GTS-White-Black/i-nQnv8Ts/0/LvjDDM8nWmx5R34LJHBFDhgv4pZqXVdHbgDrhZStR/M/DSC00799-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/AMG-GTS-White-Black/i-nzFBxcF/0/LxrHqpXrzbKQMdSG9GvPKjbZWnzm4zPG6jJ8WBr4h/M/DSC00810-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/AMG-GTS-White-Black/i-FsHVfK4/0/KhvLQpt4RBJkK8zJ28845Wkrz75dcXbGwd8sFVHTR/M/DSC00812-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/AMG-GTS-White-Black/i-ckrWgx7/0/Lh7G3knDn3k3xnsQbjXVWjdsnzNjXNhG9Jhgr5Dtr/XL/DSC00797-XL.jpg"
    ],
    "pricePerDay": "550.00",
    "isFeatured": false,
    "specifications": {
      "make": "MERCEDES BENZ",
      "model": "AMG GT",
      "exteriorColor": "White",
      "interiorColor": "Black",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-g63",
    "slug": "mercedes-benz-g63",
    "title": "Mercedes Benz G63",
    "subtitle": "blue exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/G63/i-x797Tpc/0/LhsfnVSDTjt42tsjRN5cKz4fBFt8L8gFw3ctLX77h/L/DSC01262-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/G63/i-x797Tpc/0/MJDtzxX5jpVkBzWWT5mWgBXKWjkRPJqCDTZszDRdP/M/DSC01262-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/G63/i-qk3Hj9s/0/MSh2XJswCtCHj3LkXVR2xfdXC7bbCT3HTRSSShR6f/M/DSC01274-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/G63/i-zxt8v5n/0/K7shNpbw4zQ3M37VH7fjkt3c5NBKtKd36p8tH2T8G/M/DSC01282-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/G63/i-K7KDJGh/0/NdhJ5D4LxfJFDFg5P7n2pr5Xf3bszFkCRF3BXcGF3/M/DSC01291-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/G63/i-x797Tpc/0/LncZg3jRS798hhx7vkbp7mSw2f5QmVM5Bjn7zKgpS/XL/DSC01262-XL.jpg"
    ],
    "pricePerDay": "795.00",
    "isFeatured": false,
    "specifications": {
      "make": "MERCEDES BENZ",
      "model": "G63",
      "exteriorColor": "blue",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-maybach-s580",
    "slug": "mercedes-benz-maybach-s580",
    "title": "Mercedes Benz Maybach S580",
    "subtitle": "white exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Maybach/i-P2xCMFP/0/KR6DSP65cgnwzKTzxRNhH5hnJRWx9g6G48nGLJpHh/L/DSC07561-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Maybach/i-P2xCMFP/0/MWkcM6cp2P3nzKQ5674r6Q9W5Lf6ZrGm42CstSpZt/M/DSC07561-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Maybach/i-MKcQKbx/0/MfD5L2QGGP72ngFR7cFnBfXpLtvTJ7V89WH5LCkZt/M/DSC07588-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Maybach/i-cb5CZ3Q/0/K5p4rjVLN6Z975jjgLCjWcgZCgMpJWvxtBfQGmWZS/M/DSC07606-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Maybach/i-NwcLJdD/0/NMWHwc9BRP4cJMSVwh6Vw4wnGQvKDpJHNJmhf2sPk/M/DSC07620-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Maybach/i-P2xCMFP/0/MTj8RxJQ68KRq7rv7DW4sr8Xq66kNg7NHJrqkT8jw/XL/DSC07561-XL.jpg"
    ],
    "pricePerDay": "1045.00",
    "isFeatured": false,
    "specifications": {
      "make": "MERCEDES BENZ",
      "model": "Maybach S580",
      "exteriorColor": "white",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-s580",
    "slug": "mercedes-benz-s580",
    "title": "Mercedes Benz S580",
    "subtitle": "2TONE BLACK SILVER exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/Luxx-mu/Maybach-S580-2-Tone-Black-Silver/i-FxHgwKt/0/LKjCKJSVMf6CGMHksJNJT5DZFTHvwxQ3XF7TkDsM8/L/Photo%20May%2007%202025%2C%2011%2051%2009%20PM-L.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-S580-2-Tone-Black-Silver/i-FxHgwKt/0/NcQwx8cZ9XMJq4zpnwMX5Z2bG4bP26tDKGzBxgqwR/M/Photo%20May%2007%202025%2C%2011%2051%2009%20PM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-S580-2-Tone-Black-Silver/i-99Rf3fV/0/LvxmJBrXmnt49FHqjf5BHmRt9ZwQsJq6XbhD72Cf8/M/Photo%20May%2007%202025%2C%2011%2051%2009%20PM%20%281%29-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-S580-2-Tone-Black-Silver/i-gvWnHVP/0/LLqbwSjgTx8ZdsJpTP3rzhgg353tBftK4XrssTv38/M/Photo%20May%2007%202025%2C%2011%2051%2009%20PM%20%282%29-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-S580-2-Tone-Black-Silver/i-sJS4fLz/0/L8FdtSm3nTtWpHr3rSJLWwLdWCTNGwLHNmwW6BRTD/M/Photo%20May%2007%202025%2C%2011%2051%2009%20PM%20%283%29-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-S580-2-Tone-Black-Silver/i-FxHgwKt/0/L6PLMxTTSv6vV4SNZWdnVmtFZ33MvgpgjFc8zXKbG/XL/Photo%20May%2007%202025%2C%2011%2051%2009%20PM-XL.jpg"
    ],
    "pricePerDay": "595.00",
    "isFeatured": false,
    "specifications": {
      "make": "MERCEDES BENZ",
      "model": "S580",
      "exteriorColor": "2TONE BLACK SILVER",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-cla250",
    "slug": "mercedes-benz-cla250",
    "title": "Mercedes Benz Cla250",
    "subtitle": "White exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-CLA250/i-tCfNC6g/0/KXB9mHT7G5ZVGwZdNrctNPc3k6vBnTwT3dmzRGv8m/L/DSC03407-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-CLA250/i-tCfNC6g/0/LbZ5gqxVTG5z3M8CX5Ccwz7snpS6VmtVxtGgBL86L/M/DSC03407-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-CLA250/i-mpCBTfz/0/LJWP5HCHZ6RsbRZqnp6FCW7h8JQmVTtvVNpZLwtRr/M/DSC03429-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-CLA250/i-fwWjJFp/0/NFV6GtGj9zLtJZMZhQxNqrjLMqRNqxj3kmQmn3crw/M/DSC03452-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-CLA250/i-SGtxKXH/0/LwNL34Ttt2cHfLhD9LbHHvr5CwJNCMNLSHBbPHKsp/M/DSC03461-M.jpg"
    ],
    "pricePerDay": "250.00",
    "isFeatured": false,
    "specifications": {
      "make": "MERCEDES BENZ",
      "model": "cla250",
      "exteriorColor": "White",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-e350",
    "slug": "mercedes-benz-e350",
    "title": "Mercedes Benz E350",
    "subtitle": "White exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-E350-White-Black/i-KQfZ6MK/0/MXDMP26CNCf2RMZLdTHMpch5pxRGc6jnrWqfFwJ4B/L/IMG_8288-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-E350-White-Black/i-KQfZ6MK/0/L3v7tchXnLNsHCQW5SMhFK6sX3nxKTvZHNJkCSWct/M/IMG_8288-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-E350-White-Black/i-zS8W5qT/0/Kfnx8mD4kQTxXv5tg8vjLHRnfVCq3JDfvSN9VjVVG/M/IMG_8289-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-E350-White-Black/i-DGb54Th/0/MwFrBDhpfw2XR9VMnWqhj99KL9cR5bdbDLB8nmB3d/M/IMG_8290-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-E350-White-Black/i-VWKtVst/0/LBsjWLNWcSHbkZZsJ7knZ3Drwtx7wG5Rv7fX9rkJH/M/IMG_8291-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Mercedes-Benz-E350-White-Black/i-KQfZ6MK/0/LRHMZtpDNpFTcj8SNGkxSppqDTt6wP9wRXnZt644T/XL/IMG_8288-XL.jpg"
    ],
    "pricePerDay": "295.00",
    "isFeatured": false,
    "specifications": {
      "make": "MERCEDES BENZ",
      "model": "e350",
      "exteriorColor": "White",
      "interiorColor": "Black",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-s580-2",
    "slug": "mercedes-benz-s580-2",
    "title": "Mercedes Benz S580",
    "subtitle": "BLACK exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Black/i-xWdbJBz/0/LRfKGjkzM6hx3mHxrhx7pk89LbvQNLGc5k4rtb3Km/L/DSC01493-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Black/i-xWdbJBz/0/LZvfW3V87PwksBQwBqgZcF2XHsVJdDKLQczRmTGRC/M/DSC01493-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Black/i-LL6vM6j/0/NfTszzCvH9RdLw4H5hcHBtBNzfXbhKVFCdgRJrXs3/M/DSC01504-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Black/i-N3gWBxw/0/MzVTLZzDzF8bZhKqxcdxdV4zB4zXw5LdsppfFfpxm/M/DSC01527-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Black/i-Xsjw2Dd/0/K6d5DrvhtpxwBTJhgh59ffc7CDFCw3VdxfqbHgjvp/M/DSC01558-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/S580-Black/i-xWdbJBz/0/LbvR2CCcjzgQtF8dhdcbmFKQxLCb5PpnQSdBDxL3d/XL/DSC01493-XL.jpg"
    ],
    "pricePerDay": "550.00",
    "isFeatured": false,
    "specifications": {
      "make": "MERCEDES BENZ",
      "model": "s580",
      "exteriorColor": "BLACK",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-g63-wagon",
    "slug": "mercedes-g63-wagon",
    "title": "Mercedes G63 Wagon",
    "subtitle": "SATING GREEN exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/Luxx-mu/Mercedes-Benz-G63-G-Wagon-Satin-Brown-Red/i-rp9v8Jx/0/MwKk8zv3Lqp9qRKwLm6crLJgfwsGjPp3Md542GKrm/L/Photo%20May%2023%202025%2C%201%2006%2042%20PM-L.jpg",
      "https://photos.smugmug.com/Luxx-mu/Mercedes-Benz-G63-G-Wagon-Satin-Brown-Red/i-rp9v8Jx/0/L4LhWzNPdD7D68XKchkPFkTjhhQkWpjDwHpfxjdCR/M/Photo%20May%2023%202025%2C%201%2006%2042%20PM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Mercedes-Benz-G63-G-Wagon-Satin-Brown-Red/i-NjdwnhB/0/LNjZbjHdx8gZVKxft8wQtRqcKxmcSjNWsNrZcLZ7F/M/Photo%20May%2023%202025%2C%201%2006%2042%20PM%20%281%29-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Mercedes-Benz-G63-G-Wagon-Satin-Brown-Red/i-nLT43bc/0/LzmkmWnvZnXCCnfnnPVtTpHwbfDnGGZ6hJDZczsjp/M/Photo%20May%2023%202025%2C%201%2006%2042%20PM%20%282%29-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Mercedes-Benz-G63-G-Wagon-Satin-Brown-Red/i-mj6bwMH/0/KSCVC86VZMcMCCKDxWpJ2pXR4TMKFCmtwBBTf9gV5/M/Photo%20May%2023%202025%2C%201%2006%2042%20PM%20%283%29-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Mercedes-Benz-G63-G-Wagon-Satin-Brown-Red/i-rp9v8Jx/0/Mc6XX6VT6pH7v2z4L7nLsdNJ8hZh2DNQqVVHJvKfT/XL/Photo%20May%2023%202025%2C%201%2006%2042%20PM-XL.jpg"
    ],
    "pricePerDay": "795.00",
    "isFeatured": false,
    "specifications": {
      "make": "MERCEDES",
      "model": "G63 WAGON",
      "exteriorColor": "SATING GREEN",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-gls-600",
    "slug": "mercedes-gls-600",
    "title": "Mercedes Gls 600",
    "subtitle": "BLACK exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/Luxx-mu/Maybach-GLS-600-SUV-Grey-Red/i-tnMWgVs/0/K8BpJ2TX4Zh6kdG4cFLkhXbbsW2kcht92nDcd3Mgk/L/Photo%20May%2007%202025%2C%204%2013%2014%20PM-L.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-GLS-600-SUV-Grey-Red/i-8KnPcCc/0/KdtK54chvBmHcXZBVkwRX8N8xS4Hm62wnWkg62Cpg/M/Photo%20May%2007%202025%2C%209%2054%2056%20PM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-GLS-600-SUV-Grey-Red/i-tnMWgVs/0/LznQvvh2bKLtvZcJSJDC3PNjrddTbpWPkcKQNjKnB/M/Photo%20May%2007%202025%2C%204%2013%2014%20PM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-GLS-600-SUV-Grey-Red/i-p8jvbwV/0/KXhghsTkcD3tDJw6N4B9w5WS5TmSCNhhqNsBFs5DB/M/Photo%20May%2007%202025%2C%204%2015%2046%20PM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-GLS-600-SUV-Grey-Red/i-x7zTw8C/0/KrwVTWJ2JkPj7fw6vH2s5LG5rLqk5zLjV2GkKFzDP/M/Photo%20May%2007%202025%2C%204%2015%2058%20PM-M.jpg",
      "https://photos.smugmug.com/Luxx-mu/Maybach-GLS-600-SUV-Grey-Red/i-tnMWgVs/0/K7KQjW4TtMV8gRgr4LGmSpXrLTj6D9V66mvbCCwHt/XL/Photo%20May%2007%202025%2C%204%2013%2014%20PM-XL.jpg"
    ],
    "pricePerDay": "1045.00",
    "isFeatured": false,
    "specifications": {
      "make": "MERCEDES",
      "model": "GLS 600",
      "exteriorColor": "BLACK",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mclaren-gt",
    "slug": "mclaren-gt",
    "title": "Mclaren Gt",
    "subtitle": "Blue exterior",
    "brand": "Mclaren",
    "brandSlug": "mclaren",
    "images": [
      "https://photos.smugmug.com/Luxx-Fo/Mclaren-GT/i-5kbD7Vz/0/K8LkGpctGPnCk7VKXxtSmrC4Kt5ZZ5Nb5GLdhMDSB/L/forza%20aston%20martin%20dbx%20707%2014%20%281%20of%201-L.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mclaren-GT/i-5kbD7Vz/0/L8fS87gf9Xp6XHm7qKM4xKXTdPcPTHjFrFZcvJLXK/M/forza%20aston%20martin%20dbx%20707%2014%20%281%20of%201-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mclaren-GT/i-vKCgm6b/0/KrpZKrTxLCkmBm74X2zxJWGzKbcBg52npbn8KLXWF/M/forza%20aston%20martin%20dbx%20707%2015%20%281%20of%201-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mclaren-GT/i-RWXpnh2/0/NGJnFbL4P2mFk4zHvv77wpQk6mcs23q4DPzD4cmJ4/M/forza%20aston%20martin%20dbx%20707%2018%20%281%20of%201-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mclaren-GT/i-qxkhXGB/0/MMZpsRHnTt7S6HPgxvfStGBh8tjtVkv6gbpnkXSg2/M/forza%20aston%20martin%20dbx%20707%2019%20%281%20of%201-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mclaren-GT/i-5kbD7Vz/0/K5X2Tn8NdFj87tX3W5w99T7XTwVQXTrbCX59KZdCH/XL/forza%20aston%20martin%20dbx%20707%2014%20%281%20of%201-XL.jpg"
    ],
    "pricePerDay": "995.00",
    "isFeatured": false,
    "specifications": {
      "make": "McLAren",
      "model": "GT",
      "exteriorColor": "Blue",
      "bodyType": "Supercar"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-amg-53",
    "slug": "mercedes-benz-amg-53",
    "title": "Mercedes Benz AMG 53",
    "subtitle": "gray exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/GLE-AMG-53-/i-86Xcmb6/0/LHvqzsRKPNL332rgbHR9cRrTPh9822KmR67SZX6d2/L/DSC04140-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/GLE-AMG-53-/i-86Xcmb6/0/NKG8KLzxLQ6XNtGthztjTDdT37nwXMMB66bPq4vqx/M/DSC04140-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/GLE-AMG-53-/i-WNZFwDS/0/NDSs465NgpV73ZGrPbZ3WT3jgtZr3HJHf6bSqL7Lp/M/DSC04183-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/GLE-AMG-53-/i-6drCJDF/0/MkH62T7gCwqD6F4SvsGcML4trxXCK4Lpwxhjb8dVb/M/DSC04188-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/GLE-AMG-53-/i-XDvx6Bc/0/Kqd77vvbh7fft6q5W6FTBPmvTxjmXVLkxxTgnHZnX/M/DSC04187-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/GLE-AMG-53-/i-86Xcmb6/0/Kg6DTVMDw8V92Fhk7MchFP2LcXvQGRqwLmhSHvjf9/XL/DSC04140-XL.jpg"
    ],
    "pricePerDay": "595.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "Amg 53",
      "exteriorColor": "gray",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-brabus-700",
    "slug": "mercedes-benz-brabus-700",
    "title": "Mercedes Benz Brabus 700",
    "subtitle": "BLACK exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-700/i-gLP3LR7/0/MTgRCSmxsBqp3cS3s8MXHWLDh8CK2nhDKJmhxmWM2/L/DSC02446-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-700/i-gLP3LR7/0/KzbMCHPJr7QxpmHmNWff9vx2gw5xK7ZP2fmSR3snj/M/DSC02446-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-700/i-k8n9V2s/0/M8PgXHfgsqS4txBfXvgZWdGwDnGqdbsNtVwvjF7Hx/M/DSC02449-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-700/i-g6STtJt/0/MWGzTV3jDvLfdwgtBCFTj4W3HPctKwPTNPnHvjPXm/M/DSC02450-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-700/i-cFpdF4N/0/LrGhDkFsMG4bmtbK68k2rg7x84jdJGh5mL9mkKTHs/M/DSC02453-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-700/i-gLP3LR7/0/LbpL7J95QjHDLRdkq79g47v6JQDS5g2bCkftnmKTg/XL/DSC02446-XL.jpg"
    ],
    "pricePerDay": "995.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "BRABUS 700",
      "exteriorColor": "BLACK",
      "interiorColor": "RED",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-brabus-rocket-900",
    "slug": "mercedes-benz-brabus-rocket-900",
    "title": "Mercedes Benz Brabus Rocket 900",
    "subtitle": "BLACK exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-Rocket-900/i-wffjwZL/0/NgHGjg7TVwSRCKJp3P9m5H7XHHsCn5tKBWpLQvVNs/L/DSC01578-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-Rocket-900/i-wffjwZL/0/LTJHKkLrZxMrGvpjkKVgq8ZJXVd3Pq9vXrZ2HdNB4/M/DSC01578-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-Rocket-900/i-T2zr484/0/Kw8kFN9RpNTsSZ75DHMFKBL6nxCT66BNwbRNBHkgQ/M/DSC01605-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-Rocket-900/i-JpSdkMn/0/KWhTjbSLRnwqT2Wb4XxKfLHJnz387Xm47zNhVHh4N/M/DSC01581-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-Rocket-900/i-jgJPLQn/0/LDXpt2ZKz67qXWR58bJKTrC7H2G84zw78JKTW2K2s/M/DSC01589-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Brabus-Rocket-900/i-wffjwZL/0/LxtKZn7DKJQ9zchsSMhJvmWS8P3xrRWbxSHczLnb3/XL/DSC01578-XL.jpg"
    ],
    "pricePerDay": "995.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "BRABUS ROCKET 900",
      "exteriorColor": "BLACK",
      "interiorColor": "RED",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-g550",
    "slug": "mercedes-benz-g550",
    "title": "Mercedes Benz G550",
    "subtitle": "White exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-G550/i-bLSRQWR/0/Lwxc2PXsxj446qvXSQ4fjrGmQ7QTFCJjMnc4JxtDb/L/forza%20g550%20reedit%207%20%281%20of%201%29-L.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-G550/i-PJScgT4/0/Kz7xmBRLJDCxVMMvSgq2XvbpCkTXfBZtvCPMcnRsR/M/forza%20g550%201%20%281%20of%201%29-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-G550/i-BkTJLfg/0/M29SLBPcgCbSbhtshFpvmpVDS8MN3CnDMfs2nwzJX/M/forza%20g550%207%20%281%20of%201%29-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-G550/i-C4wJckk/0/K8ZC5mmZFGNQqzBFQpQzrmf3qp2THdWzHjFPQPL2X/M/forza%20g550%208%20%281%20of%201%29-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-G550/i-rvG5chG/0/Krc2vbjZP5g4dHxRZxxMS7C6z5k6Cf3FNJBzSqZ8w/M/forza%20g550%209%20%281%20of%201%29-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-G550/i-bLSRQWR/0/MQ5Q9XDqjxhnLk5FdPdpfHCtpt8K9xZwdszR3s8LM/XL/forza%20g550%20reedit%207%20%281%20of%201%29-XL.jpg"
    ],
    "pricePerDay": "695.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "G550",
      "exteriorColor": "White",
      "interiorColor": "Red",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-g700",
    "slug": "mercedes-benz-g700",
    "title": "Mercedes Benz G700",
    "subtitle": "BLACK exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Mercedes-G700-4X4/i-NkJRNZb/0/K2ccWRRPfXnmgRcMjVrfPKVrpxJSVZ3sCndKswCfj/L/DSC05359-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Mercedes-G700-4X4/i-NkJRNZb/0/Ng9jcBzhCbcJ77xT969jbh6ZM6mbkRjLvgx2HWXv8/M/DSC05359-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Mercedes-G700-4X4/i-Lr4hRvT/0/L7f39qq6wJWkRFfngDPLpGRrSwm9jDnNcxHRDZ2v8/M/DSC05369-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Mercedes-G700-4X4/i-jxTNgbM/0/LDWKCmVCHTsQBKBtwdNWjTQbBkTgHQt4TfxwTHzXf/M/DSC05339-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Mercedes-G700-4X4/i-Zbn8T7R/0/KVcttJJTBr8VPfQ2VRQ24HWxzQWnFJ4LNDffQxgxb/M/DSC05353-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Mercedes-G700-4X4/i-NkJRNZb/0/KHnTDVGdkBTcsXMtd4QhGscHTsxQ3xZwPWxzJdt43/XL/DSC05359-XL.jpg"
    ],
    "pricePerDay": "995.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "G700",
      "exteriorColor": "BLACK",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-maybach",
    "slug": "mercedes-benz-maybach",
    "title": "Mercedes Benz Maybach",
    "subtitle": "Red exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-SUV-Red/i-DkMQ3p8/0/MC75TBBSx39CmbN8zHXtVwW8K6MbBFqtJP3kRcBqJ/L/DSC05815-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-SUV-Red/i-DkMQ3p8/0/NFDS6wgJHvwjfmv8ChR62HGZhVMF8S2K2Ssm38wvK/M/DSC05815-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-SUV-Red/i-zdmmKx5/0/Mt3BGPKMBhTPR6RGKHFHMpXHvM5XgfqBdwJghXJGb/M/DSC05816-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-SUV-Red/i-rWJZSKG/0/MsmC4cVDtQZ572vj4PxGhdgJbQ6VH4rxvp9DGvXCb/M/DSC05817-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-SUV-Red/i-RNC3dvd/0/Lzhmqq2rTNGJP2kMBfjzMpm8Nj9G5nrk85S6FmMPj/M/DSC05818-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-SUV-Red/i-DkMQ3p8/0/KzjK7fXb3nxdp52pmDGJFTjVkZ5kZppn5mbMRHwpw/XL/DSC05815-XL.jpg"
    ],
    "pricePerDay": "1045.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "Maybach",
      "exteriorColor": "Red",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-maybach-gls",
    "slug": "mercedes-benz-maybach-gls",
    "title": "Mercedes Benz Maybach Gls",
    "subtitle": "Black Gold exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Black-Gold-Maybach-GLS/i-56wSCTc/0/L4WP3xVKtP2wrwSvv8bN9CGVFBhwDBzCN7ckfHqHz/L/DSC08479-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Black-Gold-Maybach-GLS/i-56wSCTc/0/Kd6xL87HvNdLs2DTtjcZWXVCLTHJDhxCfdGQGZVQG/M/DSC08479-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Black-Gold-Maybach-GLS/i-MSjswvk/0/MqW7G6vw54x6T9HTD6mCZ4GcNwq9TDjbCLjJFJZxk/M/DSC08476-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Black-Gold-Maybach-GLS/i-vMfkmmX/0/Lhv4BHdgbDzGWNgLBbXzzNbmVZdxszjWwtLG4ZCwQ/M/DSC08490-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Black-Gold-Maybach-GLS/i-5XhTdBn/0/LfwbFqWkp48G2nzsCSLWZwZzvn664ggQjbvr42dzz/M/DSC08477-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Black-Gold-Maybach-GLS/i-56wSCTc/0/MpLmzjGbkQN9Z4Rz4sW5NXm4qhNF8xRvFc3whgVkH/XL/DSC08479-XL.jpg"
    ],
    "pricePerDay": "1045.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "Maybach  GLS",
      "exteriorColor": "Black Gold",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-maybach-van-panda",
    "slug": "mercedes-benz-maybach-van-panda",
    "title": "Mercedes Benz Maybach Van Panda",
    "subtitle": "White exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-Van-Panda/i-jBmf5Bt/0/Mc52fM77j6KFGkjBFNszTfsSnhK7BfZnR2scr3tRt/L/DSC08863-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-Van-Panda/i-jBmf5Bt/0/L2Bnqhb5ngQNk62PcJHKVbvdjrmSpSjQgKfB3WTWJ/M/DSC08863-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-Van-Panda/i-kq8fDMw/0/NLNZKzDm2hkr8XS5p6BLkr2rFMLRg6Zh2kn7xjvhH/M/DSC08864-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-Van-Panda/i-WDJXntP/0/LzzqnTKPdgDGNLvP8J7ksd4NDMHrdJW4jsVZbgMgJ/M/DSC08865-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-Van-Panda/i-ckCttB6/0/Lq8NxcxqsBf8k6Gn33vv3McN4jT2MwcT4L7Hqfsr8/M/DSC08866-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Maybach-Van-Panda/i-jBmf5Bt/0/NLhrJgHg75Fhxt8qmSxGv9J69N4nbnzCksRgv75Lc/XL/DSC08863-XL.jpg"
    ],
    "pricePerDay": "500.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "Maybach VAn panda",
      "exteriorColor": "White",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-s580-3",
    "slug": "mercedes-benz-s580-3",
    "title": "Mercedes Benz S580",
    "subtitle": "Black exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-S580/i-s8L9KXL/0/K6BjQB3JCHc6j9QP5r6XNkrmSdZZpbnSDpMb6BJc5/L/s580%20forzaexoticrental%20%281%20of%201%29-L.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-S580/i-s8L9KXL/0/KpcwMLd2m6X6vsjBjPDGDSBQL5jtsxPkncLZjX9Qw/M/s580%20forzaexoticrental%20%281%20of%201%29-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-S580/i-qX4RhL3/0/L75h9RwtsvKbw4hT54CTgjvLs7V9zst2nhL5Fr2xk/M/s580%20forzaexoticrental%204%20%281%20of%201%29-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-S580/i-wn4k4mk/0/KzNgJcM6V9MSwSRjQKN8RjXJbkkwG29xVfZVQmb95/M/s580%20forzaexoticrental%207%20%281%20of%201%29-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-S580/i-DCfPJth/0/MPVCpH38bc7sQkMrCCsQtgd8qjDd2mVJq8VcXXnJW/M/s580%20forzaexoticrental%209%20%281%20of%201%29-M.jpg",
      "https://photos.smugmug.com/Luxx-Fo/Mercedes-S580/i-s8L9KXL/0/KS7xdZLP7g7jdgfcLQDGhqqf5jCCfbxLMLfq7N4Hj/XL/s580%20forzaexoticrental%20%281%20of%201%29-XL.jpg"
    ],
    "pricePerDay": "550.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "S580",
      "exteriorColor": "Black",
      "interiorColor": "Red",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-sprinter",
    "slug": "mercedes-benz-sprinter",
    "title": "Mercedes Benz Sprinter",
    "subtitle": "white exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/White-Sprinter/i-N5gQhKh/0/Mr64kw5VwFzWJDCNWr73B4WNCNsGxfWCkwvkFZ4bH/L/whitesprinter-06312-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/White-Sprinter/i-N5gQhKh/0/MbMjH4c3DMCPBh8TPzxdcQ5NGsxNV5vHjLkqpBt8J/M/whitesprinter-06312-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/White-Sprinter/i-GjwS7WS/0/NKGq8WcjbJ4mWnvMwg4zcF9CfXKPPjsLz7PbmnHtv/M/whitesprinter-06319-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/White-Sprinter/i-NRjJwdP/0/M7x9x3qpV2d4PmMR2JcZkTT2TChnG3SR639ZVpD3T/M/whitesprinter-06322-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/White-Sprinter/i-9qJCFwn/0/Lrw7Q2ZNzZznpfQKjZCbXHSzxqPRSjn7bwLM54vvh/M/whitesprinter-06332-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/White-Sprinter/i-N5gQhKh/0/LjqZNB6Kb5bQ3B2hcQTrKsSxn7c36h4g4D3BK4jhR/XL/whitesprinter-06312-XL.jpg"
    ],
    "pricePerDay": "500.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "SPRINTER",
      "exteriorColor": "white",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-benz-s580-4",
    "slug": "mercedes-benz-s580-4",
    "title": "Mercedes Benz S580",
    "subtitle": "Blk Red exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/2023-MB-S580-Blk-Red-/i-vtLcDTz/0/LH9tB4jsz2CvSW3XMxKmXLBhcT43wGQ7BLdZCZqFn/L/DSC09232-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/2023-MB-S580-Blk-Red-/i-vtLcDTz/0/NLG59k4Xn3mk4tBhHWhgsjMFs9STGhKTv6VWHxg8n/M/DSC09232-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/2023-MB-S580-Blk-Red-/i-PSNpXKN/0/M2hKQzNWjmMmdTQt6BBSLK44NLq3n7n2cKrX3GZJT/M/DSC09233-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/2023-MB-S580-Blk-Red-/i-HwMGnTF/0/MGTgTcG5BTsJhd4QhQcdzjLnJxm6qxgt3NKdmPGXQ/M/DSC09234-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/2023-MB-S580-Blk-Red-/i-Hz26Bhf/0/KLRvCF48J4mhznfw86Q4TtqM7VrSt9RFBXBZXGnSV/M/DSC09235-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/2023-MB-S580-Blk-Red-/i-vtLcDTz/0/MxLFndsWM4hxNNNdtKRgJpKZmsk7mkWJ4w5MwBJrC/XL/DSC09232-XL.jpg"
    ],
    "pricePerDay": "495.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes Benz",
      "model": "s580",
      "exteriorColor": "Blk Red",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-g-wagon",
    "slug": "mercedes-g-wagon",
    "title": "Mercedes G Wagon",
    "subtitle": "Black exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/Luxx-mo/Matte-Black-G-Wagon/i-hwRXwTN/0/KVCn7zjdVQBdBRT5dHrRzzM9x6KVZ94QNCrGXwSMR/L/Empire%20Exotics%20Matte%20Black%20G%20Wagon-01-L.jpg",
      "https://photos.smugmug.com/Luxx-mo/Matte-Black-G-Wagon/i-hwRXwTN/0/LwcSbSVv6Cg45cfTWQ2zXpDn54FzBcmJqLQh8hxSn/M/Empire%20Exotics%20Matte%20Black%20G%20Wagon-01-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/Matte-Black-G-Wagon/i-gNwG7z8/0/MxvnnS46JbQ7XWCWVJNJJ2DZCJhm5WHcVRxpKFCWP/M/Empire%20Exotics%20Matte%20Black%20G%20Wagon-02-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/Matte-Black-G-Wagon/i-mXvCbtG/0/Kk2VWkvCXSmKdnjPnc5rmJZg7mfwf3v4xppbHqQ83/M/Empire%20Exotics%20Matte%20Black%20G%20Wagon-03-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/Matte-Black-G-Wagon/i-W3mnp8r/0/KM59cMcJDxXwH7hD28NHQxSmdB5rkqVjPDWPJQMm5/M/Empire%20Exotics%20Matte%20Black%20G%20Wagon-04-M.jpg",
      "https://photos.smugmug.com/Luxx-mo/Matte-Black-G-Wagon/i-hwRXwTN/0/MNttXQwJMNxNh2nh7hhvz3ppT3HkLrKwZkN2GRb2f/XL/Empire%20Exotics%20Matte%20Black%20G%20Wagon-01-XL.jpg"
    ],
    "pricePerDay": "795.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes",
      "model": "G wagon",
      "exteriorColor": "Black",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-gt-53",
    "slug": "mercedes-gt-53",
    "title": "Mercedes Gt 53",
    "subtitle": "Silver exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/MERCEDES-BENZ/MercedesBenz-GT53/i-jWkVCPt/0/Mmg96pDnxNFBPPsp8v8ckPg6z2KK7p7Ft6WJhpLJG/L/8099DE91-7CC1-4E3C-9F1A-17A94A605169_1_102_o-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/MERCEDES-BENZ/MercedesBenz-GT53/i-jWkVCPt/0/Mx5HVkfvNDfgDFTGdQRDtSq4B73mRfrPRjRw9XBv9/M/8099DE91-7CC1-4E3C-9F1A-17A94A605169_1_102_o-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/MERCEDES-BENZ/MercedesBenz-GT53/i-8TzMMSt/0/KxTrLWq46JT6cDkXVwjcxXNQPb2xWnZp4BqLr3pgm/M/EC21AF70-82C1-4900-B841-7B7D93BA59F8_1_102_o-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/MERCEDES-BENZ/MercedesBenz-GT53/i-Bc9txkP/0/LtQKp7CLd3q27vttLbK5SFqPSpBHk8PTBV7BZ8BKT/M/A0BCA316-CF36-4213-9968-A09F3B7A7D0D_1_102_o-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/MERCEDES-BENZ/MercedesBenz-GT53/i-NQ8pp4V/0/LsvNtkHqBW4krKLLcgpvGqdshQ99cTjT257mzNJ9M/M/0EA7A33F-2905-422B-810C-15C9D833B7C8_1_102_o-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/MERCEDES-BENZ/MercedesBenz-GT53/i-jWkVCPt/0/LKbB6g6tVRBvrK9skvt9qPw3wjDTWmF3fmx3spWmr/XL/8099DE91-7CC1-4E3C-9F1A-17A94A605169_1_102_o-XL.jpg"
    ],
    "pricePerDay": "595.00",
    "isFeatured": false,
    "specifications": {
      "make": "Mercedes",
      "model": "GT 53",
      "exteriorColor": "Silver",
      "interiorColor": "Black",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-porsche-911-turbo-s",
    "slug": "porsche-911-turbo-s",
    "title": "Porsche 911 Turbo S",
    "subtitle": "Green exterior",
    "brand": "Porsche",
    "brandSlug": "porsche",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Porsche-911-Turbo-S-Green-Tan/i-g7qV9nb/0/NGRG2HdW6qmCmnd3jjGhx3Pd6MZPwbdbK2rz7BZLz/L/IMG_3800-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Porsche-911-Turbo-S-Green-Tan/i-g7qV9nb/0/MJKJKFBjTg89Nq8HcKgc289PwCNTLjmK64CgnhsDs/M/IMG_3800-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Porsche-911-Turbo-S-Green-Tan/i-VLS837m/0/LrZCsG7c4L9z7dThfwZtBm4wtdsq66kTnr2LnSTdc/M/IMG_3801-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Porsche-911-Turbo-S-Green-Tan/i-7kFbb24/0/NQQ7C35vgvZzpzX5b8gwb6cqVgVD2hvZD84sjTP55/M/dsc04031-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Porsche-911-Turbo-S-Green-Tan/i-6pMDrnz/0/KgCDsCMG5C4Sj6jPhdSGhQpK962xSnQ38mXGwPh6C/M/dsc04033-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Porsche-911-Turbo-S-Green-Tan/i-g7qV9nb/0/KfLQBC3HGmQw8v3nqDgk73ZkDsfdrcb598WQQGm9j/XL/IMG_3800-XL.jpg"
    ],
    "pricePerDay": "1295.00",
    "isFeatured": false,
    "specifications": {
      "make": "PORSCHE",
      "model": "911 TURBO S",
      "exteriorColor": "Green",
      "interiorColor": "Tan",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-porsche-gt3",
    "slug": "porsche-gt3",
    "title": "Porsche Gt3",
    "subtitle": "BLUE exterior",
    "brand": "Porsche",
    "brandSlug": "porsche",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/GT3/i-qkK6V9s/0/L5VZ42Hd88qdcbx2PZ9BwVXwpw9k6JpDnmJw3SPsS/M/DSC07117-Edit-2-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/GT3/i-f2PpNMx/0/KhgcrJ7c8Fw3nFMtFfzMmKR59FxRwhGMc5m46CrmN/M/DSC07122-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/GT3/i-WdF3fH9/0/L4tmbzNz3w2bt9vgGvXBZLgqwd7dbcfjkC5J3KDmZ/M/DSC07142-M.jpg"
    ],
    "pricePerDay": "1195.00",
    "isFeatured": false,
    "specifications": {
      "make": "PORSCHE",
      "model": "GT3",
      "exteriorColor": "BLUE",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-porsche-911-carrera-cabriolet",
    "slug": "porsche-911-carrera-cabriolet",
    "title": "Porsche 911 Carrera Cabriolet",
    "subtitle": "Dark Blue exterior",
    "brand": "Porsche",
    "brandSlug": "porsche",
    "images": [
      "https://photos.smugmug.com/Cars/PORSCHE-911-CARRERA-4/i-JCKHfKm/0/KNTL7Rb3MMDGMpGvTQWvsHkKcZXbd4bSZ5Q7dCPW8/L/IMG_3461-L.jpg",
      "https://photos.smugmug.com/Cars/PORSCHE-911-CARRERA-4/i-Hq4fsDb/0/L79S6DTq9QqsSV9LDnTFW9xfs8Ldp2G3zxcPw8VWh/M/9-15-23-M.jpg",
      "https://photos.smugmug.com/Cars/PORSCHE-911-CARRERA-4/i-2vgSJxw/0/K28kBPnNg2R7Qd5JvxJ6WkqkFFqtVbLt82vr5XBmz/M/IMG_3448-M.jpg",
      "https://photos.smugmug.com/Cars/PORSCHE-911-CARRERA-4/i-qBGjwLb/0/MQPS463zrbsTqpf7zDpLvzfGBnfQqF3L8gZkNfjc5/M/IMG_3449-M.jpg",
      "https://photos.smugmug.com/Cars/PORSCHE-911-CARRERA-4/i-VvTc4cC/0/KSgQRnvCBL7NJNsKCjkSm755NDfm5pDmsdvMQgnZp/M/IMG_3450-M.jpg",
      "https://photos.smugmug.com/Cars/PORSCHE-911-CARRERA-4/i-JCKHfKm/0/M5257ZJdqK9LSNX4LBDn7DDVbrSh9PDS6LXk64XT6/XL/IMG_3461-XL.jpg"
    ],
    "pricePerDay": "795.00",
    "isFeatured": false,
    "specifications": {
      "make": "Porsche",
      "model": "911 Carrera Cabriolet",
      "exteriorColor": "Dark Blue",
      "bodyType": "Convertible"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-rolls-royce-cullinan",
    "slug": "rolls-royce-cullinan",
    "title": "Rolls Royce Cullinan",
    "subtitle": "White exterior",
    "brand": "Rolls-Royce",
    "brandSlug": "rolls-royce",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Rolls-Royce-Cullinan/i-qZtWbrG/0/LcXsB4vPwHBHZkgHLZFBsx3Fc7Md3D2J7t464q6Js/M/DSC07202-Edit-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Rolls-Royce-Cullinan/i-cCVMBkF/0/MBVnDMXtZwDS5Q2fnSn5QzbVQjHmt2prLv4KfQHr5/M/DSC07218-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/NEW/Rolls-Royce-Cullinan/i-VMn66Dd/0/MtDpKPzdhQ8pTDqTs86fB4W3qNFH2pxVntcHgRbFb/M/DSC07221-M.jpg"
    ],
    "pricePerDay": "1495.00",
    "isFeatured": false,
    "specifications": {
      "make": "ROLLS ROYCE",
      "model": "Cullinan",
      "exteriorColor": "White",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-rolls-royce-dawn",
    "slug": "rolls-royce-dawn",
    "title": "Rolls Royce Dawn",
    "subtitle": "Black exterior",
    "brand": "Rolls-Royce",
    "brandSlug": "rolls-royce",
    "images": [
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Dawn-Black-White/i-6qLpDJx/0/MFzvQZrPFvZmSmSRxJghmtnp6RD5csVzLLNJrrGWh/L/IMG_8341-L.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Dawn-Black-White/i-6qLpDJx/0/MqtGpVDXrJdwT3kBXJdX8m8r28P82kVcMZ2tbVsr3/M/IMG_8341-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Dawn-Black-White/i-dvDdGv7/0/K546pwm3PhmXdQbv9BnDKKFZhsbhDZGQspbMcRZqC/M/IMG_8342-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Dawn-Black-White/i-KvNH6Pc/0/MdVSw3JSR4bdZG7Npwscs62SWbBM3RfmtWJWhf9Wq/M/IMG_8344-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Dawn-Black-White/i-Q8rQz6S/0/LhdjqPMSPjT6btBMwwGLNwNTvDH7dqTtzSzSRFQbf/M/IMG_8346-M.jpg",
      "https://photos.smugmug.com/Rental-Fleet-2024-2025/Dawn-Black-White/i-6qLpDJx/0/KWwG7PrDQGPs4nBxB4sjFztfXqJF6gWQvqfgJPv9w/XL/IMG_8341-XL.jpg"
    ],
    "pricePerDay": "1295.00",
    "isFeatured": false,
    "specifications": {
      "make": "ROLLS ROYCE",
      "model": "DAWN",
      "exteriorColor": "Black",
      "interiorColor": "White",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-rolls-royce-mansory",
    "slug": "rolls-royce-mansory",
    "title": "Rolls Royce Mansory",
    "subtitle": "black exterior",
    "brand": "Rolls-Royce",
    "brandSlug": "rolls-royce",
    "images": [
      "https://photos.smugmug.com/Liv/Rolls-Royce-Mansory-Black-on-Blue/i-nScBwj2/0/KfQNT9MfHKZgcmvRWFv9t5qSxP543jpbtDF5qv4ZL/L/IMG_8679-L.jpg",
      "https://photos.smugmug.com/Liv/Rolls-Royce-Mansory-Black-on-Blue/i-kBvFNM6/0/LDFGFdxh7HHfjBXr9THw8q449xSwQpBRGDFmX4XB8/M/IMG_3120-M.jpg",
      "https://photos.smugmug.com/Liv/Rolls-Royce-Mansory-Black-on-Blue/i-gKQpqKK/0/Nb9jTCVZdMnL7jFKDb2KCrsTFCHc2FSZrmphSbfjZ/M/DSC06325-M.jpg",
      "https://photos.smugmug.com/Liv/Rolls-Royce-Mansory-Black-on-Blue/i-cDdgnmz/0/LhjXCw77gFsB3znhSkXLFV3g38FKZVkKBqQkBGds9/M/IMG_7642-M.jpg",
      "https://photos.smugmug.com/Liv/Rolls-Royce-Mansory-Black-on-Blue/i-4HZdqdF/0/M8k97nCsBfckKjrn8rFfdR6ktRbKDHk58TZrhn3Kd/M/IMG_7645-M.jpg",
      "https://photos.smugmug.com/Liv/Rolls-Royce-Mansory-Black-on-Blue/i-nScBwj2/0/L2hCLbj8spDdMmwnnmvnxT4HSXdRFx9mPn8qC4zvb/XL/IMG_8679-XL.jpg"
    ],
    "pricePerDay": "1695.00",
    "isFeatured": false,
    "specifications": {
      "make": "ROLLS ROYCE",
      "model": "MANSORY",
      "exteriorColor": "black",
      "interiorColor": "Tiffany blue with stars",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-rolls-royce-cullinan-2",
    "slug": "rolls-royce-cullinan-2",
    "title": "Rolls Royce Cullinan",
    "subtitle": "Black / Blue exterior",
    "brand": "Rolls-Royce",
    "brandSlug": "rolls-royce",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/RR-Cullinan-Black-on-White/i-dj6xndd/0/Mn7VBKrRnGGhqxtBz725WCGWZqXPcxGLBtk92MgBn/L/7F60CBE7-124A-43D4-83D3-3F0F985C0ED8-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/RR-Cullinan-Black-on-White/i-k63TNgx/0/NZHDBPSTB8G77XXgscwHPXxKV4zgGDwxhTVkjZ4RC/M/23315881-0BD6-4083-959C-6A07B775B4A0-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/RR-Cullinan-Black-on-White/i-r6sQJzS/0/KdwvpGFbkxC8ZBQmRcfNGj62n6XNKKmDRbJFghDZ9/M/2AD33770-057F-4D85-9C57-2F8EDDBF6EE3-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/RR-Cullinan-Black-on-White/i-MkvG8F3/0/KVrbJJBZKJcxrhnj64nxW6S2LfzT3bPr4VmDVRzQ8/M/3E6138DE-CC79-4896-BEFF-1817CF94F3CA-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/RR-Cullinan-Black-on-White/i-gBTkXLp/0/MgRHdLXxGXxPcGq4SZZFJFSPffSp5pW2dHCPG8tmd/M/452362A1-1040-4BD9-B418-D3D4C5C61BD4-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/RR-Cullinan-Black-on-White/i-dj6xndd/0/MtPx9hpQGfsH4F9ttspRCJpdcrhC7SsRzKBKGVx5H/XL/7F60CBE7-124A-43D4-83D3-3F0F985C0ED8-XL.jpg"
    ],
    "pricePerDay": "1495.00",
    "isFeatured": true,
    "specifications": {
      "brand": "Rolls Royce",
      "seats": 5,
      "bodyType": "Suv",
      "horsepower": 563,
      "acceleration": "5.0s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-rolls-royce-cullinan-3",
    "slug": "rolls-royce-cullinan-3",
    "title": "Rolls Royce Cullinan",
    "subtitle": "Black / White exterior",
    "brand": "Rolls-Royce",
    "brandSlug": "rolls-royce",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-cCmLzMW/0/MRLQnKvtjPGrFvDwZpdJLBZkfTMZFRNZtxR6Wxgnb/L/DSC05253-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-cCmLzMW/0/Mz8xvBWWkWBHfB3HfnkLGFkrFqVPGXLF9QJ47fgLr/M/DSC05253-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-DvpfV2x/0/MgvWk6H34ZDNv3ttc76D5DBjPph4mKfhp4dtZ5pS2/M/DSC05254-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-7zLfQmt/0/NSBgSwxzBvRz4FwLF4hjZMNLtJT8hhTPNJGBKFcsk/M/DSC05255-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-vTvxqPb/0/MzsFQBw6d3Sdd7tcgDXphzPmcgt3Mz6pNzh6rccHx/M/DSC05256-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Satin-White-Cullinan/i-cCmLzMW/0/MR6RS6cnG7BHTfXJfB73ZRvQPJcCDsJb9cGSjKSLJ/XL/DSC05253-XL.jpg"
    ],
    "pricePerDay": "1495.00",
    "isFeatured": true,
    "specifications": {
      "brand": "Rolls Royce",
      "seats": 5,
      "bodyType": "Suv",
      "horsepower": 563,
      "acceleration": "5.0s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-rolls-royce-cullinan-black-badge",
    "slug": "rolls-royce-cullinan-black-badge",
    "title": "Rolls Royce Cullinan Black Badge",
    "subtitle": "Purple exterior",
    "brand": "Rolls-Royce",
    "brandSlug": "rolls-royce",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-GTj6Bj2/0/NPp2vrQKBmXdxdtwb5VstPz3wM8R86vfdM7gFsRDd/L/DSC03489-Edit-Edit-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-GTj6Bj2/0/LmTmhNhfwV8FzMGSFJqw3cRVQhDr57RxLBSdVRdHQ/M/DSC03489-Edit-Edit-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-c5ZBBnr/0/LmHMcwgcxs6VB8rqN7LXLxzdBv4vm9gc6JCqMgXkG/M/DSC03477-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-57TXbzb/0/K96HRKfHFHCKGBHc5BQtrwvPMKMFtfsGMz9tngnXm/M/DSC03471-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-Ftgv84D/0/KPh3vj9QphSnmKtskpg64Hct8hHhTKMP5DzFnXxbP/M/DSC03467-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Purple-Black-Badge-Cullinan-/i-GTj6Bj2/0/NMpmrBxX2GdmFvddDd3X3vPHb3nk2Dtpgb952LTHV/XL/DSC03489-Edit-Edit-XL.jpg"
    ],
    "pricePerDay": "1495.00",
    "isFeatured": false,
    "specifications": {
      "make": "Rolls Royce",
      "model": "Cullinan Black Badge",
      "exteriorColor": "Purple",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-rolls-royce-dawn-2",
    "slug": "rolls-royce-dawn-2",
    "title": "Rolls Royce Dawn",
    "subtitle": "White exterior",
    "brand": "Rolls-Royce",
    "brandSlug": "rolls-royce",
    "images": [
      "https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-w4MVJN4/0/Kqrnhp8JbGSGRzT6tsXskzJC4KVkzX6Bf7snMTTSM/L/IMG_3697-L.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-w4MVJN4/0/KskVqS4NksGdjjWXLrfCLqQZqs7td7CLGZdhDh6kh/M/IMG_3697-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-zfrXfZ5/0/LVgFtq6Hc4P5k3pfL9PwSq33MRVfwgw3pT2RJLNX9/M/IMG_3698-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-LHk5h8p/0/MzcrnKD4MdBvbhC6wpmM4SXL7RpmvMRvdzjn4qtPD/M/IMG_3699-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-tBk358G/0/NVgfvFnZV9Jjq3R7vH4K7b8sm7xDR2Hq6TDNg9r27/M/IMG_3700-M.jpg",
      "https://photos.smugmug.com/EXOTIC-CARS/ROLLS-ROYCE-/DAWN/Rolls-Royce-Dawn-Gray/i-w4MVJN4/0/MFgKwRBx6BqNF2k2gXDKXkP2FMWG9msTcN6Gn6sJN/XL/IMG_3697-XL.jpg"
    ],
    "pricePerDay": "1295.00",
    "isFeatured": false,
    "specifications": {
      "brand": "Rolls Royce",
      "seats": 4,
      "bodyType": "Convertible",
      "horsepower": 563,
      "acceleration": "4.9s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-rolls-royce-ghost",
    "slug": "rolls-royce-ghost",
    "title": "Rolls Royce Ghost",
    "subtitle": "matte black exterior",
    "brand": "Rolls-Royce",
    "brandSlug": "rolls-royce",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-Hf6v7JS/0/LjpSxnxQBG825GDgq4HCxhqKX3wfWN8RmfKdvKPSv/L/DSC03901-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-Hf6v7JS/0/Kg68QgNsrNXsZhL8j2g4x9mWKx4rPrNRx2q5gRSzJ/M/DSC03901-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-rqgTDfF/0/NNcJ8ZJPfCpn29G5GNKXbLjsHtFr3CZMrjXXptLgX/M/DSC03921-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-7qX9Wp4/0/MJjDzT4XBNNTthG58FKj8n5bRvTkwRTQgWf4PGGfX/M/DSC03902-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-hvSvM9t/0/LcVxBfWkwLvGsp7kgG3D79MLFRbqBLFZT79DJMmxR/M/DSC03925-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Matte-Black-Rolls-Royce-Ghost/i-Hf6v7JS/0/LBxLR2Pqb6Hwr6G465jkSCQTGDjBb5x4WXW3WSMbN/XL/DSC03901-XL.jpg"
    ],
    "pricePerDay": "1395.00",
    "isFeatured": false,
    "specifications": {
      "make": "Rolls Royce",
      "model": "Ghost",
      "exteriorColor": "matte black",
      "interiorColor": "orange",
      "bodyType": "Sedan"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-rolls-royce-wraith",
    "slug": "rolls-royce-wraith",
    "title": "Rolls Royce Wraith",
    "subtitle": "grey exterior",
    "brand": "Rolls-Royce",
    "brandSlug": "rolls-royce",
    "images": [
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-CDxpjrX/0/Lw4pv8jJPTjwjKCXqMZZ6j7N5KWr9K8chKzg9wQW8/L/DSC05388-L.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-CDxpjrX/0/NX726B3rjNLg8fhq6QSCsDrCgCRjVNGd6hHQfL6jJ/M/DSC05388-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-WjZktBS/0/NFbL29z4swfGFzdkXJZjn7SPdX2x5dxHM3vM4d6sR/M/DSC05387-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-QfS9tbn/0/Kv9s7hVcSKSSKKKMxtCPqhHqfPxg99TFnLN96kv7K/M/DSC05403-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-GfRtTSr/0/KPjWsVFGh4gw6wnnZcghW2NvZxshZQ6JQfz52HjXQ/M/DSC05407-M.jpg",
      "https://photos.smugmug.com/MVP-MIAMI-CARS/Rolls-Royce-Wriath-Black-Badge/i-CDxpjrX/0/KNSx6w46D6BDzvw26LTr8VBkFLZjp5BjzwJSvJDgj/XL/DSC05388-XL.jpg"
    ],
    "pricePerDay": "1395.00",
    "isFeatured": false,
    "specifications": {
      "make": "Rolls Royce",
      "model": "Wraith",
      "exteriorColor": "grey",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-tesla-cybertruck",
    "slug": "tesla-cybertruck",
    "title": "Tesla Cybertruck",
    "subtitle": "Flat Silver exterior",
    "brand": "Tesla",
    "brandSlug": "tesla",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-wc67n8j/0/KHTZr2cG4FnpGsXJQJH7b2gw8J7tSkCBdj2S3ZHqd/L/IMG_3102-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-zWMHmSn/0/KfKvTvtqwQZJ7xQZZ4kjTjFFqnHVZ6gXQhvfPb6fs/M/2fb144f6ab4c4081a632b9e9e7965725-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-7JfGm95/0/LqNSBV5M3s5Vf4tVgksNHqmhDs28LVPsZ5Dj6ZRDW/M/IMG_3105-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-3Sb47M8/0/MdKMC3HqJLdRp7f5m8tLrPQjKt3p9fGtmQmC63FxG/M/IMG_3103-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-LX84TdJ/0/K3XxbL4jnZCJRfT3BBD42ZcvQzBhmFkJgqpw8J5bd/M/IMG_3101-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/CYBERTRUCK-SILVER/i-wc67n8j/0/NTnj7s3WRTLbbkGnSW94v9LB7HSQkkQCf2ZBSLJWx/XL/IMG_3102-XL.jpg"
    ],
    "pricePerDay": "595.00",
    "isFeatured": false,
    "specifications": {
      "brand": "Tesla",
      "seats": 5,
      "bodyType": "Suv",
      "horsepower": 845,
      "acceleration": "2.6s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-tesla-cybertruck-2",
    "slug": "tesla-cybertruck-2",
    "title": "Tesla Cybertruck",
    "subtitle": "Silver / Black exterior",
    "brand": "Tesla",
    "brandSlug": "tesla",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-dF7SRhB/0/KGpQJ9CLcnNtMvbfswXhKChxR3wTT2ck3z5mBwBmc/L/IMG_2332-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-dF7SRhB/0/L7F3XNQwKGWpvgDBrZw2prSQwLv94SgGmDcbhbmSB/M/IMG_2332-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-nJMMTCq/0/NF8GfJ76ZGrVTGMDDNBDQtnTW2LVLLjtfQ8C69jss/M/IMG_2358-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-mdZt5DL/0/KDnF6L5CQqfBWDLmq6K2qkvrj5bFHmhQBHJVpPQ8B/M/IMG_2334-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-3xT2nTX/0/LkS8rcCzn7CVfbszKqbvvtKS5VgvBjP4Jt8FdDbjR/M/IMG_2347-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/TESLA-CYBERTRUCK/i-dF7SRhB/0/KnK755wV3WfDgKJmDqHwVtQLRMzqS28xnP3KHmHR6/XL/IMG_2332-XL.jpg"
    ],
    "pricePerDay": "595.00",
    "isFeatured": false,
    "specifications": {
      "brand": "Tesla",
      "seats": 5,
      "bodyType": "Suv",
      "horsepower": 845,
      "acceleration": "2.6s",
      "transmission": "Automatic"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-tesla-model-x-plaid",
    "slug": "tesla-model-x-plaid",
    "title": "Tesla Model X Plaid",
    "subtitle": "Red exterior",
    "brand": "Tesla",
    "brandSlug": "tesla",
    "images": [
      "https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-gFBhkDX/0/KSFv42FcL9sccFVJzVFwHn9DDGW9K8CLhPrGJGSsQ/L/WhatsApp%20Image%202024-05-07%20at%203.59.25%20PM-L.jpg",
      "https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-9VGqGkN/0/MWZLzwv62mGrZm4KDtpwt7vG3NDXPn47StcH6gbBb/M/WhatsApp%20Image%202024-05-07%20at%203.59.02%20PM-M.jpg",
      "https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-xVpb489/0/Lfsv2tFQmwPSJXHqQ79ggGHv84PRDCwkp5pqBNMdf/M/WhatsApp%20Image%202024-05-07%20at%203.59.02%20PM%20%281%29-M.jpg",
      "https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-gFBhkDX/0/LMQ7dTNW3bFvrkNfvD2F9v9Ks8jZ3MwrGPPgfRwMn/M/WhatsApp%20Image%202024-05-07%20at%203.59.25%20PM-M.jpg",
      "https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-CFxJLrS/0/L7K5vMLmFzLhKnjmbHvcn4XB279bD3NMkxjB85jv4/M/WhatsApp%20Image%202024-05-07%20at%203.59.00%20PM-M.jpg",
      "https://photos.smugmug.com/Cars/Tesla-X-PLAID/i-gFBhkDX/0/KHCnkLZq99x8jnmXgBLN8qsn4FV62JSNbXxhLh6F6/XL/WhatsApp%20Image%202024-05-07%20at%203.59.25%20PM-XL.jpg"
    ],
    "pricePerDay": "295.00",
    "isFeatured": false,
    "specifications": {
      "make": "Tesla",
      "model": "model x plaid",
      "exteriorColor": "Red",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-lamborghini-hurracan-evo-spyder",
    "slug": "lamborghini-hurracan-evo-spyder",
    "title": "Lamborghini Hurracan Evo Spyder",
    "subtitle": "White exterior",
    "brand": "Lamborghini",
    "brandSlug": "lamborghini",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-rHLRprX/0/KhJN86dbsSrVgmKkPq4CpsBsLkcHhPhSZjCSqGCTd/L/IMG_7528-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-SKjhxPs/0/L29JN7HNGWdhK8cXksq6j65BCFsh7hcnd2KH2J5T8/M/IMG_7228_jpg-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-Q8SH5ZV/0/LbD78CMzFrX9ntvrzVbJ8hr6QGfQKk5fcnVkTmCtx/M/IMG_7246_jpg-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-hjzGTcV/0/LpFWfFWcV3BFg7C2FFjTSpgbZFxDRfc36rCzWDhRz/M/IMG_7533-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-3cpKvxd/0/K5VTCHBftpjMR3KH5SGJRmDw2GZDKN7jSVNzvgvR6/M/IMG_7218_jpg-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Lamborghini-Huracan-White/i-rHLRprX/0/LNm7mffNLW6jzpxnnB96gZWT2pNBNmzzWrcFPdW64/XL/IMG_7528-XL.jpg"
    ],
    "pricePerDay": "1095.00",
    "isFeatured": false,
    "specifications": {
      "make": "lamborghini",
      "model": "Hurracan evo spyder",
      "exteriorColor": "White",
      "interiorColor": "Red",
      "bodyType": "Convertible"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-mercedes-g63-amg",
    "slug": "mercedes-g63-amg",
    "title": "Mercedes G63 AMG",
    "subtitle": "Green exterior",
    "brand": "Mercedes",
    "brandSlug": "mercedes",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-j5dDTPH/0/MNvrMVDThQLHwR94Mbhf8bfd3GctZnW4bQJ4WSZwd/L/IMG_1684-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-j5dDTPH/0/MNjKXdXJmXqhjZC9LRZNNCc5Q73DsbnqCcqWgsFp2/M/IMG_1684-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-HJMPt62/0/MBmFS4FmVf53MKmK7Pn5Sw6RNStcW5rWhwggvBKZP/M/IMG_1685-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-7WSFNn8/0/LMmbKfbtR3czwvRRK7Np8JKVpFRddKNttZQ79QxXW/M/IMG_1677-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-4jBVhbc/0/KhfPmJ3Qb26TdFZ962H86jwFWVH3KFrzGJ43cwqTd/M/IMG_1675-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/G63-AMG-GREEN/i-j5dDTPH/0/NDnPm7ThfwhWj9kZsLk6qzVZszsjGxVTJpthLsTv6/XL/IMG_1684-XL.jpg"
    ],
    "pricePerDay": "795.00",
    "isFeatured": false,
    "specifications": {
      "make": "mercedes",
      "model": "G63 AMG",
      "exteriorColor": "Green",
      "interiorColor": "Beige",
      "bodyType": "SUV"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  },
  {
    "id": "fallback-porsche-gt3rs-weissach",
    "slug": "porsche-gt3rs-weissach",
    "title": "Porsche Gt3rs Weissach",
    "subtitle": "Grey exterior",
    "brand": "Porsche",
    "brandSlug": "porsche",
    "images": [
      "https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-8d2DXbC/0/NWtX4wQmj2tXJ3CbbLdGn7Vcw4nKsP8WNSBSQQzRT/L/IMG_5643-L.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-FHWSxJN/0/MmxvHgrgX6hvMjtz9fjnBCWG4mVNfhGHx4Sqh7ZV7/M/IMG_5642-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-NxPd3cW/0/K3PXT38QTq2pF8PxcwJdVzL2bhfxRNc3pMdk8bnmP/M/IMG_6220-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-HrMKXHZ/0/M9QHxSW5jXxrLSwX6kvB2L47Jbk7dRTRQFt3mBMVs/M/IMG_5637-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-BzXFZNC/0/LP4gM4gNxfbFfbJt8N48c5L55NNC2mVsd6sHDtMrK/M/IMG_5636-M.jpg",
      "https://photos.smugmug.com/AVAILABLE-CARS/Porsche-GT3-rs-Weissach-edition/i-8d2DXbC/0/L2Fzgqxp8RCc4T6TSBDXXKLj9XfcjhS5MPBSjHGz2/XL/IMG_5643-XL.jpg"
    ],
    "pricePerDay": "1295.00",
    "isFeatured": false,
    "specifications": {
      "make": "porsche",
      "model": "GT3RS Weissach",
      "exteriorColor": "Grey",
      "interiorColor": "Carbon Fiber",
      "bodyType": "Coupe"
    },
    "focalPoint": "50% 42%",
    "flipHorizontal": false,
    "flipVertical": false
  }
]

export function getFallbackCars() {
  return fallbackCars
}

export function getFallbackFeaturedCars(limit = 8) {
  const featured = fallbackCars.filter((car) => car.isFeatured)
  const source = featured.length > 0 ? featured : fallbackCars
  return source.slice(0, limit)
}

export function getFallbackCarsByTerms(terms: string[]) {
  const normalizedTerms = terms
    .map((term) => term.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim())
    .filter(Boolean)

  return fallbackCars.filter((car) => {
    const haystack = [car.brand, car.brandSlug, car.title, car.specifications?.make, car.specifications?.model]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')

    return normalizedTerms.some((term) => haystack.includes(term))
  })
}
