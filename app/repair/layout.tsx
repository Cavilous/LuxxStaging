import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Exotic Car Repair, PPF & Customization in Miami | Luxx Miami",
  description: "Insurance-backed collision repair, paint protection film, and customization for exotic and ultra-luxury vehicles in Miami. OEM parts and pre-loss restorations by specialists.",
  openGraph: {
    title: "Exotic Car Repair, PPF & Customization in Miami | Luxx Miami",
    description: "Insurance-backed collision repair, PPF, and customization for exotic and ultra-luxury vehicles in Miami.",
    type: "website",
    url: "https://luxxmiami.com/repair",
  },
  alternates: {
    canonical: "/repair",
  },
}

export default function RepairLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
