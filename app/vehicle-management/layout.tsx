import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vehicle Management Program | Earn From Your Exotic Car | Luxx Miami",
  description: "Put your exotic car to work with Luxx Miami's vehicle management program. We handle rentals, maintenance, insurance, and detailing while you earn passive income from your luxury vehicle.",
  openGraph: {
    title: "Vehicle Management Program | Earn From Your Exotic Car | Luxx Miami",
    description: "Put your exotic car to work with Luxx Miami's vehicle management program. Earn passive income while we handle everything.",
    type: "website",
    url: "https://luxxmiami.com/vehicle-management",
  },
  alternates: {
    canonical: "/vehicle-management",
  },
}

export default function VehicleManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
