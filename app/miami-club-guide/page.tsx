import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Miami Club Guide | Top Nightlife Destinations | Luxx Miami",
  description:
    "Discover Miami's premier nightlife destinations with our comprehensive club guide. From upscale lounges to high-energy dance floors, experience the city's vibrant nightlife.",
  openGraph: {
    title: "Miami Club Guide | Top Nightlife Destinations | Luxx Miami",
    description: "Discover Miami's premier nightlife destinations with our comprehensive club guide.",
    type: "website",
  },
}

interface ClubVenue {
  name: string
  slug: string
  description: string
  atmosphere: string
  music: string
  crowd: string
  dressCode: string
  coverImage: string
  images: string[]
  hasVenueImages: boolean
}

const clubs: ClubVenue[] = [
  {
    name: "Story Miami",
    slug: "story-miami",
    description:
      "Located in the heart of Miami's entertainment district, Story is the epitome of nightclub sophistication. With its state-of-the-art sound system and luxurious design, Story unfolds over multiple rooms, featuring an expansive outdoor terrace with a breathtaking view of the city skyline.",
    atmosphere: "Upscale, Multi-room, Rooftop Terrace",
    music: "Electronic, Commercial Hits",
    crowd: "Young Fashionable",
    dressCode: "Upscale",
    coverImage: "/stock_images/luxury_nightclub_int_0b64e371.jpg",
    images: ["/stock_images/luxury_nightclub_int_0b64e371.jpg"],
    hasVenueImages: false,
  },
  {
    name: "Strawberry Moon",
    slug: "strawberry-moon",
    description:
      "Perched above the city, Strawberry Moon is a beacon of chic and trendy nightlife. The spacious dance floor, framed by multiple bars and VIP areas, invites a young and fashionable crowd to indulge in a selection of exquisite drinks and cocktails.",
    atmosphere: "Chic, Rooftop, Panoramic Views",
    music: "Electronic, Top 40",
    crowd: "Young & Fashionable",
    dressCode: "Trendy",
    coverImage: "/stock_images/rooftop_bar_terrace__7f2281a4.jpg",
    images: ["/stock_images/rooftop_bar_terrace__7f2281a4.jpg"],
    hasVenueImages: false,
  },
  {
    name: "Mandrake",
    slug: "mandrake",
    description:
      "Mandrake offers an intimate escape into Miami's club world. With a small, dimly lit dance floor and a music selection as diverse as the city itself, this club is a gem for those seeking an exclusive atmosphere.",
    atmosphere: "Intimate, Dimly Lit, Outdoor Terrace",
    music: "Diverse Selection",
    crowd: "Diverse, Exclusive",
    dressCode: "Smart Casual",
    coverImage: "/stock_images/elegant_nightclub_un_eb262630.jpg",
    images: ["/stock_images/elegant_nightclub_un_eb262630.jpg"],
    hasVenueImages: false,
  },
  {
    name: "Vendome",
    slug: "vendome",
    description:
      "Vendome is the definition of luxury in the Miami club scene. Its sleek and modern design is matched only by the spacious dance floor and VIP accommodations. Rise above the night on the rooftop terrace and sip on masterfully crafted cocktails.",
    atmosphere: "Luxury, Sleek Design, Rooftop",
    music: "House, Electronic",
    crowd: "Upscale",
    dressCode: "Luxury",
    coverImage: "/stock_images/luxury_nightclub_int_5e6663fd.jpg",
    images: ["/stock_images/luxury_nightclub_int_5e6663fd.jpg"],
    hasVenueImages: false,
  },
  {
    name: "Dirty Rabbit",
    slug: "dirty-rabbit",
    description:
      "Dirty Rabbit stands apart as a club with a unique, underground vibe. The small dance floor and dim lighting set the stage for a wide range of music genres, creating an intimate and exclusive experience.",
    atmosphere: "Underground, Intimate, Dim Lighting",
    music: "Wide Range of Genres",
    crowd: "Diverse, Underground",
    dressCode: "Casual",
    coverImage: "/stock_images/elegant_nightclub_un_674e6ddc.jpg",
    images: ["/stock_images/elegant_nightclub_un_674e6ddc.jpg"],
    hasVenueImages: false,
  },
  {
    name: "Mr. Jones",
    slug: "mr-jones",
    description:
      "Sophistication meets high energy at Mr. Jones. With a spacious dance floor and multiple bars, this club offers a rooftop terrace that boasts stunning city views, where excitement meets elegance.",
    atmosphere: "Sophisticated, High Energy, City Views",
    music: "House, Electronic",
    crowd: "Upscale",
    dressCode: "Sophisticated",
    coverImage: "/stock_images/rooftop_bar_terrace__77696c25.jpg",
    images: ["/stock_images/rooftop_bar_terrace__77696c25.jpg"],
    hasVenueImages: false,
  },
  {
    name: "Rosario",
    slug: "rosario",
    description:
      "Rosario is a lively and upbeat salsa club catering to salsa enthusiasts and Latin music lovers. Features a spacious dance floor, live salsa band, and casual atmosphere perfect for dancing the night away.",
    atmosphere: "Lively, Casual, Outdoor Terrace",
    music: "Salsa, Latin",
    crowd: "Latin Music Enthusiasts",
    dressCode: "Casual",
    coverImage: "/stock_images/luxury_nightclub_int_56b34f5f.jpg",
    images: ["/stock_images/luxury_nightclub_int_56b34f5f.jpg"],
    hasVenueImages: false,
  },
  {
    name: "Swan",
    slug: "swan",
    description:
      "Swan is a trendy club in the heart of Miami featuring sleek modern design, spacious dance floor, and state-of-the-art lighting. The rooftop terrace offers stunning city views perfect for intimate conversations.",
    atmosphere: "Trendy, Modern, Rooftop Views",
    music: "Electronic, Top DJs",
    crowd: "Diverse Party-goers",
    dressCode: "Upscale",
    coverImage: "/stock_images/rooftop_bar_terrace__2348fd6e.jpg",
    images: ["/stock_images/rooftop_bar_terrace__2348fd6e.jpg"],
    hasVenueImages: false,
  },
]

export default function MiamiClubGuide() {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/stock_images/miami_nightlife_skyl_c19dcbc8.jpg"
            alt="Miami Nightlife Skyline"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0A0A0A]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#ECAC36] to-transparent" />
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-tight">
            MIAMI CLUB GUIDE
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Discover Miami's premier nightlife destinations where luxury meets excitement. From upscale lounges to
            high-energy dance floors, experience the pulse of the city.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-2 h-12 bg-[#ECAC36] mr-4" style={{ transform: "skewY(-8deg)" }} />
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">The Heart of Miami's Nightlife</h2>
            </div>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Miami is more than just a city; it's a mood, a vibe, a pulsing beat under the sultry sun. Our city's
              nightlife is a tapestry of lights, music, and culture, and the clubs in Miami are the heart of this
              vibrant scene. Whether you're in the mood for electronic beats or Latin rhythms, upscale lounges or
              underground vibes, Miami clubs offer something for every nocturnal preference.
            </p>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-16 md:space-y-24">
            {clubs.map((club, index) => (
              <article key={club.name} className="group">
                <div
                  className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}
                >
                  {/* Club Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative overflow-hidden cut-corner aspect-[4/3]">
                      <Image
                        src={club.coverImage}
                        alt={`${club.name} - Miami Nightclub`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Club badge */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className="px-4 py-2 bg-[#ECAC36] text-black text-sm font-bold shadow-lg">
                          Premium Venue
                        </div>
                        {!club.hasVenueImages && (
                          <div className="px-3 py-2 bg-orange-500/90 text-white text-xs font-medium shadow-lg" title="Stock image shown - venue-specific images needed">
                            Stock Image
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Club Info */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 group-hover:text-[#ECAC36] transition-colors duration-300">
                        {club.name}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">{club.description}</p>
                    </div>

                    {/* Club Details */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[#ECAC36] font-semibold text-sm uppercase tracking-wide">Atmosphere</span>
                          <p className="text-gray-300 mt-1">{club.atmosphere}</p>
                        </div>
                        <div>
                          <span className="text-[#ECAC36] font-semibold text-sm uppercase tracking-wide">Music</span>
                          <p className="text-gray-300 mt-1">{club.music}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[#ECAC36] font-semibold text-sm uppercase tracking-wide">Crowd</span>
                          <p className="text-gray-300 mt-1">{club.crowd}</p>
                        </div>
                        <div>
                          <span className="text-[#ECAC36] font-semibold text-sm uppercase tracking-wide">Dress Code</span>
                          <p className="text-gray-300 mt-1">{club.dressCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < clubs.length - 1 && (
                  <div className="mt-16 md:mt-24 flex justify-center">
                    <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#ECAC36]/50 to-transparent" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-8 md:p-12 bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-[#ECAC36]/30 cut-corner">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#ECAC36]/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#ECAC36]/5 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-1 bg-[#ECAC36]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Elevate Your Miami Experience
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                Extend the luxury beyond the club's doorstep. Arrive in style with our exotic car rentals or charter a
                yacht for the ultimate after-party experience. Every moment in Miami should be extraordinary.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cars-listing"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#ECAC36] text-black font-bold transition-all duration-300 hover:bg-[#e6c766] hover:shadow-lg cut-corner min-h-[48px]"
                >
                  Exotic Car Rentals
                </Link>
                <Link
                  href="/yachts"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#ECAC36] text-[#ECAC36] font-bold transition-all duration-300 hover:bg-[#ECAC36] hover:text-black cut-corner min-h-[48px]"
                >
                  Yacht Charters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
