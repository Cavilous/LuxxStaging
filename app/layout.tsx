import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"
import { ConditionalLayout } from "@/components/conditional-layout"
import { Toaster } from "sonner"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://luxxmiami.com'),
  title: "Luxx Miami - Luxury Rentals | Exotic Cars, Yachts, Villas & Jets",
  description:
    "Miami's premier luxury car rentals, yacht charters, villa stays, and private jet services. Elite lifestyle experiences for discerning clients.",
  keywords: ["luxury car rental miami", "yacht charter miami", "villa rental miami", "exotic cars", "private jet miami", "luxury rentals"],
  authors: [{ name: "Luxx Miami" }],
  creator: "Luxx Miami",
  publisher: "Luxx Miami",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxxmiami.com',
    siteName: 'Luxx Miami',
    title: 'Luxx Miami - Luxury Rentals | Exotic Cars, Yachts, Villas & Jets',
    description: 'Experience Miami\'s elite lifestyle with luxury car rentals, yacht charters, villa stays, and private jet services.',
    images: [
      {
        url: '/luxx-logo.png',
        width: 1080,
        height: 1080,
        alt: 'Luxx Miami - Premium Luxury Rentals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxx Miami - Luxury Rentals',
    description: 'Miami\'s premier luxury rental platform for exotic cars, yachts, and villas.',
    images: ['/luxx-logo.png'],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://luxxmiami.com',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://photos.smugmug.com" />
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
        <link rel="dns-prefetch" href="https://photos.smugmug.com" />
        <link rel="dns-prefetch" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
        <link 
          rel="preload" 
          as="image" 
          href="/_next/image?url=https%3A%2F%2Fhebbkx1anhila5yf.public.blob.vercel-storage.com%2FDSC09371.jpg-O5HNBgv5aKL6h2eBmJofJr3ZkGM5Nd.jpeg&w=1920&q=75"
          type="image/webp"
          fetchPriority="high"
          imageSrcSet="/_next/image?url=https%3A%2F%2Fhebbkx1anhila5yf.public.blob.vercel-storage.com%2FDSC09371.jpg-O5HNBgv5aKL6h2eBmJofJr3ZkGM5Nd.jpeg&w=640&q=75 640w, /_next/image?url=https%3A%2F%2Fhebbkx1anhila5yf.public.blob.vercel-storage.com%2FDSC09371.jpg-O5HNBgv5aKL6h2eBmJofJr3ZkGM5Nd.jpeg&w=1080&q=75 1080w, /_next/image?url=https%3A%2F%2Fhebbkx1anhila5yf.public.blob.vercel-storage.com%2FDSC09371.jpg-O5HNBgv5aKL6h2eBmJofJr3ZkGM5Nd.jpeg&w=1920&q=75 1920w"
          imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1C119H4YFL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1C119H4YFL');
          `}
        </Script>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster position="top-right" richColors theme="dark" />
        <Script
          src="https://link.msgsndr.com/js/external-tracking.js"
          data-tracking-id="tk_f8415cdcdc464b4496d6b082c59fefb7"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
