import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, MapPin, Utensils } from "lucide-react"

export const metadata: Metadata = {
  title: "Miami Restaurant Guide | Fine Dining Destinations | Luxx Miami",
  description:
    "Discover Miami's finest dining destinations with our curated restaurant guide. From waterfront dining to innovative cuisine, explore the best restaurants Miami has to offer.",
  openGraph: {
    title: "Miami Restaurant Guide | Fine Dining Destinations | Luxx Miami",
    description: "Discover Miami's finest dining destinations with our curated restaurant guide.",
    type: "website",
  },
}

const restaurants = [
  {
    name: "KiKi on The River",
    cuisine: "Modern Greek",
    location: "Miami River",
    description:
      "A Greek restaurant featuring modern Greek cuisine and an authentic Mediterranean island-inspired riverfront setting complete with 150 feet dock space. Built at the site of one of Miami's original fish markets, paying homage to its rustic origins.",
    highlights: ["Waterfront Dining", "150ft Dock", "Mediterranean Atmosphere"],
    website: "https://kikiontheriver.com/",
    image: "/stock_images/waterfront_restauran_f596cc11.jpg",
  },
  {
    name: "Mandrake Miami",
    cuisine: "Contemporary",
    location: "Miami",
    description:
      "Offering curated experiences and one-of-a-kind entertainment. Whether planning a chic corporate affair or an extravagant soiree, Mandrake Miami delivers personalized service, refined cuisine, and unique mixology.",
    highlights: ["Private Events", "Refined Cuisine", "Unique Mixology"],
    website: "https://mandrakemiami.com/",
    image: "/stock_images/fine_dining_restaura_997d193e.jpg",
  },
  {
    name: "Gekko Miami",
    cuisine: "Japanese Steakhouse",
    location: "Brickell",
    description:
      "A Japanese-inspired steakhouse and lounge from David Grutman and Bad Bunny. Located in Miami's thriving Brickell neighborhood, featuring premium steak cuts, jaw-dropping sushi inventions, and delicious seafood appetizers.",
    highlights: ["Premium Steaks", "Innovative Sushi", "Celebrity Partnership"],
    website: "https://gekko.com/",
    image: "/stock_images/modern_japanese_stea_bf9c1db3.jpg",
  },
  {
    name: "Rusty Pelican Miami",
    cuisine: "Contemporary Seafood",
    location: "Rickenbacker Marina",
    description:
      "Situated right on the Rickenbacker Marina with unmatchable waterfront views of Miami. Contemporary cuisine with exotic Latin-inspired dishes and the freshest local seafood, plus an impressive wall of over a thousand wine varietals.",
    highlights: ["Waterfront Views", "Fresh Seafood", "1000+ Wine Selection"],
    website: "https://www.therustypelican.com/",
    image: "/stock_images/waterfront_restauran_e9b39dca.jpg",
  },
  {
    name: "Elcielo Miami",
    cuisine: "Modern Colombian",
    location: "Brickell",
    description:
      "Located in the heart of downtown Miami on the banks of the river. Offers modern signature cuisine with creative and innovative style inspired by Colombian ancestral roots, using avant-garde cooking techniques and neuroscience.",
    highlights: ["Neurogastronomy", "Colombian Roots", "Avant-garde Techniques"],
    website: "https://elcielomiami.com/",
    image: "/stock_images/fine_dining_restaura_bdc2bfaf.jpg",
  },
  {
    name: "Pane & Vino Miami",
    cuisine: "Authentic Italian",
    location: "Miami",
    description:
      "A gastronomic and cultural journey where Italian philosophy is reflected in every detail. Experience the connection between Earth's vibrations and hands that transform natural produce into delicious dishes through ancient knowledge.",
    highlights: ["Authentic Italian", "Cultural Experience", "Natural Ingredients"],
    website: "https://www.paneevinomia.com/",
    image: "/stock_images/italian_restaurant_a_0bb63e3d.jpg",
  },
  {
    name: "Casa Tua",
    cuisine: "Italian Mediterranean",
    location: "Miami Beach Art Deco District",
    description:
      "Hidden behind lush foliage in Miami Beach's Art Deco District. An iconic culinary destination housed in a historic villa with boutique hotel, restaurant and exclusive private members club, designed by Michele Bonan.",
    highlights: ["Historic Villa", "Art Deco District", "Members Club"],
    website: "https://www.casatualife.com/",
    image: "/stock_images/italian_restaurant_a_dd3b8e01.jpg",
  },
  {
    name: "The Deck at Island Gardens",
    cuisine: "Fine Dining",
    location: "Island Gardens",
    description:
      "A premier outdoor lounge boasting a remarkable super-yacht marina. Ideal for fine dining with breathtaking vistas of Downtown Miami and Biscayne Bay, offering waterfront cabana lounges and memorable South Miami sunset experiences.",
    highlights: ["Super-yacht Marina", "Outdoor Dining", "Sunset Views"],
    website: "https://www.thedeckmiami.com/",
    image: "/stock_images/modern_japanese_stea_be8ffb96.jpg",
  },
  {
    name: "Sexy Fish",
    cuisine: "Asian-inspired Seafood",
    location: "Brickell",
    description:
      "A London import bringing theatrical dining to Miami's Brickell neighborhood. Known for its striking interiors featuring Damien Hirst installations, exceptional sushi, and world-class cocktails in an electric atmosphere that embodies Miami's glamorous nightlife.",
    highlights: ["Damien Hirst Art", "Premium Sushi", "Theatrical Dining"],
    website: "https://sexyfish.com/miami/",
    image: "/stock_images/fine_dining_restaura_997d193e.jpg",
  },
  {
    name: "Amazonico",
    cuisine: "Latin American & Japanese Fusion",
    location: "Brickell",
    description:
      "An exotic Latin American restaurant bringing the flavors of the Amazon to Miami. Features a stunning tropical atmosphere with live entertainment, offering a unique fusion of South American and Japanese cuisines with an emphasis on premium ingredients and theatrical presentation.",
    highlights: ["Tropical Atmosphere", "Live Entertainment", "Fusion Cuisine"],
    website: "https://amazonicorestaurant.com/miami/",
    image: "/stock_images/waterfront_restauran_f596cc11.jpg",
  },
]

export default function MiamiRestaurantGuide() {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/stock_images/luxury_restaurant_fi_c9f5151e.jpg"
            alt="Luxury Restaurant Fine Dining"
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
            MIAMI RESTAURANT
            <span className="block text-[#ECAC36]">GUIDE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Miami is sexy, beachy, boozy fun. Luckily, the food has become part of the spectacle. Explore Miami with
            Luxx, one table at a time.
          </p>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-16 md:space-y-24">
            {restaurants.map((restaurant, index) => (
              <article
                key={restaurant.name}
                className={`group flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative overflow-hidden cut-corner aspect-[4/3]">
                    <Image
                      src={restaurant.image}
                      alt={`${restaurant.name} - ${restaurant.cuisine} restaurant in Miami`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Cuisine badge */}
                    <div className="absolute top-4 left-4">
                      <div className="px-4 py-2 bg-[#ECAC36] text-black text-sm font-bold shadow-lg">
                        {restaurant.cuisine}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 group-hover:text-[#ECAC36] transition-colors duration-300">
                      {restaurant.name}
                    </h2>
                    <div className="flex items-center gap-2 text-[#ECAC36]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">{restaurant.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed">{restaurant.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {restaurant.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1.5 text-xs font-medium text-[#ECAC36] border border-[#ECAC36]/30 bg-[#ECAC36]/5"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Link
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#ECAC36] text-black font-bold transition-all duration-300 hover:bg-[#e6c766] hover:shadow-lg cut-corner min-h-[48px]"
                    >
                      <Utensils className="w-4 h-4" />
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
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
                Arrive in <span className="text-[#ECAC36]">Style</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                Complete your dining experience with a luxury vehicle from our exotic car collection. Make an impression
                that matches Miami's finest restaurants.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/cars-listing"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#ECAC36] text-black font-bold transition-all duration-300 hover:bg-[#e6c766] hover:shadow-lg cut-corner min-h-[48px]"
                >
                  Browse Exotic Cars
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#ECAC36] text-[#ECAC36] font-bold transition-all duration-300 hover:bg-[#ECAC36] hover:text-black cut-corner min-h-[48px]"
                >
                  Plan Your Evening
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
