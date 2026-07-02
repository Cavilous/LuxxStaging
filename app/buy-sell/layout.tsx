import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buy & Sell Exotic Cars, Yachts & Villas in Miami | Luxx Miami",
  description: "Browse a curated collection of exotic cars, yachts, and villas for sale in Miami, or consign your luxury asset with Luxx Miami's network of qualified buyers.",
  openGraph: {
    title: "Buy & Sell Exotic Cars, Yachts & Villas in Miami | Luxx Miami",
    description: "Browse a curated collection of exotic cars, yachts, and villas for sale in Miami, or consign your luxury asset.",
    type: "website",
    url: "https://luxxmiami.com/buy-sell",
  },
  alternates: {
    canonical: "/buy-sell",
  },
}

export default function BuySellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
