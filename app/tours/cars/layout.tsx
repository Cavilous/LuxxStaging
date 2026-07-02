import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Exotic Car Ride-Along Tours in Miami | Luxx Miami",
  description: "Book a seat in a Lamborghini, Ferrari, or McLaren for a guided ride-along tour of Miami's most iconic destinations. No license, insurance, or deposit required.",
  openGraph: {
    title: "Exotic Car Ride-Along Tours in Miami | Luxx Miami",
    description: "Book a seat in an exotic car for a guided ride-along tour of Miami's most iconic destinations.",
    type: "website",
    url: "https://luxxmiami.com/tours/cars",
  },
  alternates: {
    canonical: "/tours/cars",
  },
}

export default function ToursCarsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
