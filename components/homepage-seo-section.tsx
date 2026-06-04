import Link from "next/link"

const FAQ_DATA = [
  {
    question: "How much does it cost to rent an exotic car in Miami?",
    answer: "Our exotic car rental rates start at $595 per day for vehicles like the Chevrolet Corvette, with premium supercars like the Ferrari SF90 and Lamborghini Aventador ranging from $1,500 to $3,500+ per day. We also offer 4-hour and hourly rentals for shorter experiences. All rates include standard insurance and 24/7 concierge support."
  },
  {
    question: "What is the minimum age to rent a luxury car in Miami?",
    answer: "The minimum age to rent from Luxx Miami is 25 years old with a valid driver's license. For high-performance vehicles like Ferraris and Lamborghinis, renters must be at least 25 with a clean driving record. International licenses are accepted with a valid passport."
  },
  {
    question: "Do you deliver exotic cars anywhere in Miami?",
    answer: "Yes, we offer complimentary delivery throughout Miami-Dade County including Miami Beach, Brickell, Downtown, Wynwood, Design District, Coral Gables, and Key Biscayne. We also deliver to Miami International Airport (MIA), Fort Lauderdale Airport (FLL), private airports, hotels, and yacht clubs. Delivery outside our standard zone is available for an additional fee."
  },
  {
    question: "What security deposit is required for exotic car rentals?",
    answer: "Security deposits vary by vehicle class. Standard luxury vehicles require $2,500-$5,000, while supercars and hypercars require $10,000-$25,000. Deposits are fully refundable upon safe return of the vehicle. We accept major credit cards - debit cards are not accepted for the deposit."
  },
  {
    question: "Can I rent a yacht for a day in Miami?",
    answer: "Absolutely. Our yacht charters range from 4-hour sunset cruises to full-day adventures exploring Biscayne Bay, Star Island, and the Miami sandbar. All charters include a professional captain, crew, and fuel. Catering and water toys can be added to enhance your experience."
  },
  {
    question: "Do you offer chauffeur services for exotic cars?",
    answer: "Yes, professional chauffeur services are available for all vehicles in our fleet. This is popular for weddings, corporate events, airport transfers, and nightlife experiences where you'd prefer not to drive. Chauffeur rates start at $75/hour in addition to the vehicle rental."
  },
  {
    question: "What happens if the car breaks down during my rental?",
    answer: "Our 24/7 concierge team handles all roadside situations. In the rare event of a mechanical issue, we'll dispatch a replacement vehicle to your location as quickly as possible - typically within 2 hours in the Miami area. You won't be charged for time lost due to mechanical problems."
  },
  {
    question: "Can I take an exotic rental car outside of Florida?",
    answer: "Our vehicles must remain within Florida unless prior written approval is obtained. Many clients enjoy driving to Palm Beach, Naples, Orlando, or the Florida Keys. Cross-state travel requires additional insurance and a higher deposit. Contact our team to arrange out-of-state trips."
  }
]

export function HomepageSeoSection() {
  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-8">
            Luxury Rentals in <span className="text-[#ECAC36]">Miami</span>
          </h2>
          
          <div className="space-y-10 text-gray-200 leading-relaxed">
            <div>
              <p className="text-lg mb-4">
                Luxx Miami is South Florida's premier destination for luxury vehicle and lifestyle rentals. Whether you're cruising through Brickell in a Lamborghini, celebrating on a private yacht in Biscayne Bay, or hosting guests at a waterfront villa in Miami Beach, we deliver experiences that define Miami luxury.
              </p>
              <p>
                Our curated fleet features the world's most desirable vehicles and vessels, maintained to the highest standards and backed by white-glove concierge service. From the moment you inquire to the moment you return, our team ensures every detail exceeds expectations.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">
                Exotic Car Rentals
              </h3>
              <p className="mb-4">
                Miami's exotic car scene is legendary, and our fleet captures its essence. We specialize in the marques that turn heads along Ocean Drive and command attention at every valet - <Link href="/miami/ferrari-rental" className="text-[#ECAC36] hover:text-[#e6c766] transition-colors">Ferrari</Link>, <Link href="/miami/lamborghini-rental" className="text-[#ECAC36] hover:text-[#e6c766] transition-colors">Lamborghini</Link>, <Link href="/miami/mclaren-rental" className="text-[#ECAC36] hover:text-[#e6c766] transition-colors">McLaren</Link>, Rolls-Royce, Bentley, and more.
              </p>
              <p className="mb-4">
                Our <Link href="/cars" className="text-[#ECAC36] hover:text-[#e6c766] transition-colors">exotic car collection</Link> includes everything from the Lamborghini Urus for family adventures to the Ferrari SF90 Stradale for those seeking pure performance. Every vehicle is meticulously detailed before each rental and equipped with the latest technology.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                <li>Italian supercars: Ferrari, Lamborghini, Maserati</li>
                <li>British luxury: Rolls-Royce, Bentley, McLaren, Aston Martin</li>
                <li>German performance: Mercedes-AMG, BMW M, Porsche</li>
                <li>American muscle: Corvette, Ford GT, luxury SUVs</li>
              </ul>
              <p>
                Popular for Miami events including Art Basel, the Miami Grand Prix, yacht shows, and high-profile weddings. Business travelers appreciate our seamless airport delivery to MIA and FLL.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">
                Yacht Charters
              </h3>
              <p className="mb-4">
                Experience Miami from the water with our <Link href="/yachts" className="text-[#ECAC36] hover:text-[#e6c766] transition-colors">luxury yacht charter fleet</Link>. From intimate 40-foot sport yachts perfect for couples to 100+ foot mega yachts designed for large celebrations, we match the perfect vessel to your occasion.
              </p>
              <p className="mb-4">
                All charters include an experienced captain and crew who know Biscayne Bay intimately. Cruise past Star Island's celebrity estates, anchor at the famous Miami sandbar, explore the pristine waters around Key Biscayne, or venture to Bimini for a Bahamas day trip.
              </p>
              <p>
                Corporate entertaining, birthday celebrations, bachelor and bachelorette parties, sunset cruises, and proposals - our team has orchestrated thousands of memorable moments on the water.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">
                Luxury Villa Rentals
              </h3>
              <p className="mb-4">
                Our <Link href="/houses" className="text-[#ECAC36] hover:text-[#e6c766] transition-colors">luxury villa portfolio</Link> features Miami's most exclusive residential properties. From modern waterfront estates in Miami Beach to private compounds in Coconut Grove, these homes offer the privacy and amenities that discerning guests expect.
              </p>
              <p>
                Many of our villas feature private docks, heated pools, home theaters, chef's kitchens, and staff quarters. Ideal for extended stays, family gatherings, corporate retreats, or photo and film productions seeking stunning Miami backdrops.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">
                Concierge & Delivery Services
              </h3>
              <p className="mb-4">
                Luxx Miami's 24/7 concierge team handles every detail of your rental experience. We deliver vehicles directly to your hotel, residence, airport, or yacht - anywhere in Miami-Dade, Broward, and Palm Beach counties. Our drivers arrive on time, present the vehicle, and provide a thorough walkthrough.
              </p>
              <p>
                Beyond rentals, we assist with dinner reservations at Miami's top restaurants, nightclub table service, private chef bookings, event planning, and lifestyle management. Consider us your local connection to Miami's best experiences.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">
                Miami Car Tours & Additional Services
              </h3>
              <p className="mb-4">
                Explore Miami's iconic neighborhoods behind the wheel of an exotic car with our <Link href="/tours/cars" className="text-[#ECAC36] hover:text-[#e6c766] transition-colors">guided driving tours</Link>. Routes include the Art Deco Historic District, Key Biscayne's scenic Rickenbacker Causeway, and the vibrant streets of Wynwood and the Design District.
              </p>
              <p className="mb-4">
                We also offer <Link href="/repair" className="text-[#ECAC36] hover:text-[#e6c766] transition-colors">exotic car repair and maintenance services</Link> for private owners, as well as <Link href="/buy-sell" className="text-[#ECAC36] hover:text-[#e6c766] transition-colors">buying and selling assistance</Link> for those looking to acquire or consign luxury vehicles.
              </p>
            </div>

            <div className="border-t border-[#ECAC36]/20 pt-10">
              <h3 className="text-2xl font-heading font-bold text-white mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-6">
                {FAQ_DATA.map((faq, index) => (
                  <div key={index} className="border-b border-gray-800 pb-6 last:border-b-0">
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_DATA.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}
