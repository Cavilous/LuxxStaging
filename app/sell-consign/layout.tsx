import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sell or Consign Your Luxury Asset | Luxx Miami",
  description: "Partner with Miami's premier luxury rental platform to sell or consign your exotic car, yacht, or villa. Access our exclusive network of high-net-worth buyers and renters.",
  openGraph: {
    title: "Sell or Consign Your Luxury Asset | Luxx Miami",
    description: "Partner with Miami's premier luxury rental platform to sell or consign your exotic car, yacht, or villa.",
    type: "website",
    url: "https://luxxmiami.com/sell-consign",
  },
  alternates: {
    canonical: "/sell-consign",
  },
}

export default function SellConsignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
