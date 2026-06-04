import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { db } from "@/lib/db"
import { inventory } from "@/lib/db/schema"
import { eq, and, sql, ilike, or } from "drizzle-orm"
import Link from "next/link"
import Image from "next/image"
import { Phone, MessageCircle } from "lucide-react"
import { cache } from "react"
import { InventoryCard } from "@/components/inventory-card"

export const dynamic = 'force-dynamic'

interface BrandPageProps {
  params: Promise<{
    "brand-slug": string
  }>
}

interface BrandData {
  slug: string
  name: string
  displayName: string
  metaTitle: string
  metaDescription: string
  h1: string
  introText: string
  longFormContent: string
}

const BRANDS: Record<string, BrandData> = {
  ferrari: {
    slug: "ferrari",
    name: "Ferrari",
    displayName: "Ferrari",
    metaTitle: "Ferrari Rental Miami | Exotic Ferrari Car Rentals – LUXX Miami",
    metaDescription: "Rent a Ferrari in Miami from LUXX Miami. Experience the thrill of driving a Prancing Horse through South Beach, Brickell, and beyond. Premium Ferrari rentals with delivery.",
    h1: "Ferrari Rentals in Miami",
    introText: "Experience the pinnacle of Italian automotive excellence with a Ferrari rental in Miami. From the iconic 488 to the breathtaking SF90, our Ferrari fleet delivers pure adrenaline and unmistakable style for your Miami adventure.",
    longFormContent: `
      <h2>The Ferrari Legacy: A Heritage of Excellence</h2>
      <p>Ferrari represents more than a century of Italian automotive passion distilled into every vehicle bearing the Prancing Horse badge. Founded by Enzo Ferrari in 1939, the marque has become synonymous with the pinnacle of automotive achievement, racing dominance, and uncompromising luxury. Each Ferrari is handcrafted in Maranello, Italy, where master artisans combine cutting-edge technology with time-honored craftsmanship to create machines that are as much works of art as they are high-performance vehicles.</p>
      <p>The Prancing Horse emblem carries with it decades of Formula 1 championships, legendary road cars, and a commitment to performance that remains unmatched. When you rent a Ferrari in Miami, you're not simply driving a car - you're experiencing a living piece of automotive history that continues to push the boundaries of what's possible on four wheels.</p>

      <h2>Why Rent a Ferrari in Miami</h2>
      <p>There's no better backdrop for a Ferrari than the sun-soaked streets of Miami. The city's vibrant culture, stunning oceanfront views, and year-round perfect weather create the ideal setting for experiencing everything a Ferrari has to offer. Whether you're cruising down Ocean Drive with the top down or accelerating along the MacArthur Causeway, a Ferrari transforms every Miami moment into an unforgettable memory.</p>
      <p>Miami's luxury lifestyle and Ferrari's legendary performance are a match made in automotive heaven. The city's appreciation for style, speed, and sophistication means you'll find yourself among fellow enthusiasts who understand and celebrate the Prancing Horse. From celebrity sightings to impromptu photo opportunities, driving a Ferrari in Miami is an experience that goes far beyond transportation.</p>

      <h3>Perfect for Special Occasions</h3>
      <p>A Ferrari rental elevates any Miami celebration to extraordinary heights. Whether you're celebrating a milestone birthday, anniversary, bachelor or bachelorette party, or simply treating yourself to an unforgettable vacation experience, arriving in a Ferrari makes a statement that words cannot express. The combination of Miami's glamorous atmosphere and Ferrari's timeless elegance creates moments you'll treasure forever.</p>

      <h3>Ideal for Business and Networking</h3>
      <p>In Miami's competitive business landscape, impressions matter. A Ferrari speaks volumes about success, taste, and attention to quality - attributes that resonate with high-level clients and business partners. Whether attending Art Basel, a yacht show, or closing a major deal, arriving in a Ferrari sets the tone for success.</p>
      
      <h2>Best Miami Routes for Your Ferrari</h2>
      <p>The A1A coastal highway offers one of the most scenic Ferrari drives in Florida. Starting from South Beach, you can cruise north through the Art Deco District, past the Fontainebleau, and continue up to Fort Lauderdale with the Atlantic Ocean as your constant companion. The smooth pavement and gentle curves are perfect for enjoying your Ferrari's responsive handling.</p>

      <h3>Key Biscayne and Rickenbacker Causeway</h3>
      <p>For those seeking photo-worthy moments, Key Biscayne provides a stunning backdrop. The Rickenbacker Causeway offers panoramic views of downtown Miami's skyline, and the palm-lined streets of the island create a tropical paradise perfect for capturing your Ferrari experience. The journey to the historic Cape Florida Lighthouse makes for an especially memorable drive.</p>

      <h3>Brickell and Downtown Miami</h3>
      <p>Brickell's gleaming towers and upscale restaurants provide the perfect urban setting for your Ferrari. Valet your Prancing Horse at Zuma, Komodo, or any of the area's celebrated establishments and make an entrance that sets the tone for your entire evening. Miami's vibrant nightlife scene appreciates the arrival of a Ferrari like nowhere else.</p>

      <h3>Top Photo Spots with Your Ferrari</h3>
      <ul>
        <li><strong>Wynwood Walls:</strong> Colorful murals create stunning contrasts with Ferrari's sleek lines</li>
        <li><strong>The Venetian Islands:</strong> Palm-lined bridges and water views make for magazine-worthy shots</li>
        <li><strong>Star Island Causeway:</strong> Capture Miami's skyline with your Ferrari in the foreground</li>
        <li><strong>South Pointe Park:</strong> Fisher Island and Government Cut create dramatic backdrops</li>
        <li><strong>Coconut Grove waterfront:</strong> Tropical ambiance meets Italian performance</li>
      </ul>
      
      <h2>What's Included with Your Ferrari Rental</h2>
      <p>Our Ferrari rentals include complimentary delivery anywhere in Miami-Dade County. Whether you're staying at a luxury hotel in South Beach, a private residence in Miami Beach, or arriving at Miami International Airport, we bring your Ferrari directly to you. This white-glove service ensures your experience begins the moment you arrive.</p>

      <h3>Security Deposits and Payment</h3>
      <p>All Ferrari rentals require a security deposit, which is fully refundable upon the vehicle's return in its original condition. We accept all major credit cards for deposits, and our team will walk you through the vehicle's features and controls before you take the wheel. Daily mileage allowances are generous, and additional miles can be arranged if you're planning an extended adventure.</p>

      <h3>Insurance and Protection Options</h3>
      <p>Insurance options are available to provide peace of mind during your rental. Our team can explain coverage options and help you choose the protection level that suits your needs. We're committed to making your Ferrari experience as smooth and enjoyable as possible from start to finish.</p>
      
      <h2>Popular Ferrari Models We Offer</h2>
      <p>Our Miami Ferrari fleet features the most sought-after models from Maranello, each maintained to factory specifications and detailed before every rental.</p>

      <h3>Ferrari 488 GTB and Spider</h3>
      <p>The Ferrari 488 GTB and Spider represent the perfect balance of everyday usability and supercar performance. With their twin-turbocharged V8 engines producing over 660 horsepower, these machines deliver breathtaking acceleration while remaining refined enough for a day of Miami exploration. The Spider variant adds open-top thrills, perfect for South Beach cruising.</p>

      <h3>Ferrari SF90 Stradale</h3>
      <p>For those seeking the ultimate Ferrari experience, the SF90 Stradale represents the pinnacle of Ferrari's engineering prowess. This plug-in hybrid hypercar combines a turbocharged V8 with three electric motors for nearly 1,000 combined horsepower. It's the most powerful Ferrari ever offered for rent in Miami, blending cutting-edge technology with visceral performance.</p>

      <h3>Ferrari 812 Superfast</h3>
      <p>The Ferrari 812 Superfast brings naturally aspirated V12 power to our fleet. With 789 horsepower from its front-mounted 6.5-liter engine, the 812 offers a driving experience that connects you directly to Ferrari's storied racing heritage. The symphony of a naturally aspirated V12 at full throttle is an experience every car enthusiast should have at least once.</p>

      <h2>Frequently Asked Questions</h2>

      <h3>What are the requirements to rent a Ferrari in Miami?</h3>
      <p>Renters must be at least 25 years old with a valid driver's license. A major credit card is required for the security deposit, and proof of full-coverage insurance may be requested. Our team can provide additional details during the booking process.</p>

      <h3>Is delivery included with Ferrari rentals?</h3>
      <p>Yes, complimentary delivery is included throughout Miami-Dade County. This includes hotels, private residences, Miami International Airport, and private aviation terminals. Additional delivery locations may incur a fee.</p>

      <h3>How much does it cost to rent a Ferrari in Miami?</h3>
      <p>Ferrari rental rates vary by model and season. Contact our concierge team for current pricing and availability. We also offer multi-day discounts and special packages that combine Ferrari rentals with yacht charters or villa stays.</p>

      <h3>Can I drive the Ferrari outside of Miami?</h3>
      <p>Ferrari rentals include generous daily mileage allowances that accommodate most Miami explorations. Extended trips, such as driving to Naples, Palm Beach, or the Florida Keys, can be arranged with advance notice. Additional mileage fees may apply.</p>

      <h3>What happens if there's an issue with the car?</h3>
      <p>Our 24/7 concierge team is always available to assist. In the unlikely event of a mechanical issue, we'll arrange immediate roadside assistance and, if necessary, provide a replacement vehicle to ensure your Miami experience continues uninterrupted.</p>
    `,
  },
  lamborghini: {
    slug: "lamborghini",
    name: "Lamborghini",
    displayName: "Lamborghini",
    metaTitle: "Lamborghini Rental Miami | Exotic Lamborghini Rentals – LUXX Miami",
    metaDescription: "Rent a Lamborghini in Miami. Turn heads in a Huracán or Urus across South Beach and Brickell. LUXX Miami offers premium Lamborghini rentals with airport delivery.",
    h1: "Lamborghini Rentals in Miami",
    introText: "Command attention with a Lamborghini rental in Miami. From the scissor doors to the aggressive styling, every Lamborghini makes a statement. Our curated collection of Huracáns, Urus SUVs, and more awaits your Miami adventure.",
    longFormContent: `
      <h2>The Lamborghini Legacy: Born to Be Bold</h2>
      <p>Lamborghini was born from a legendary rivalry. When Ferruccio Lamborghini, a successful tractor manufacturer, felt slighted by Enzo Ferrari, he decided to build his own sports cars. The result was a brand that has never compromised, never followed trends, and never failed to provoke a reaction. From the revolutionary Miura to today's Huracán and Urus, every Lamborghini is designed to be audaciously, unapologetically spectacular.</p>
      <p>Headquartered in Sant'Agata Bolognese, Italy, Lamborghini continues to push boundaries with angular designs, naturally aspirated engines, and the kind of drama that defines the Italian supercar experience. When you rent a Lamborghini in Miami, you're joining a legacy of those who refuse to blend in.</p>

      <h2>Why Rent a Lamborghini in Miami</h2>
      <p>Lamborghini and Miami share the same DNA: bold, unapologetic, and impossible to ignore. The angular lines and aggressive stance of a Lamborghini perfectly complement Miami's avant-garde architecture and vibrant street scene. When you roll down Collins Avenue in a Huracán, you're not just driving - you're making a statement that echoes the city's fearless spirit.</p>
      <p>The attention a Lamborghini attracts in Miami is unlike anywhere else in the world. This is a city that celebrates extravagance and rewards those who dare to stand out. Photographers will ask for shots, fellow car enthusiasts will give you thumbs up, and every traffic light becomes an opportunity for admiration. In Miami, a Lamborghini isn't excessive - it's expected.</p>

      <h3>Make Every Entrance Unforgettable</h3>
      <p>Nothing announces your arrival quite like a Lamborghini's scissor doors rising skyward. Whether pulling up to LIV nightclub, E11EVEN, or a charity gala at the Pérez Art Museum, the theatrical door mechanism transforms every arrival into an event. Miami's social scene was made for Lamborghini moments.</p>

      <h3>The Ultimate Miami Photo Companion</h3>
      <p>In the age of social media, a Lamborghini in Miami is content gold. The dramatic lines photograph beautifully against Art Deco buildings, graffiti murals, and ocean sunsets. Influencers, photographers, and content creators choose Lamborghini for its visual impact - every angle is a perfect shot.</p>
      
      <h2>Best Miami Routes for Your Lamborghini</h2>
      <p>Ocean Drive demands a Lamborghini. The famous stretch through South Beach is designed for slow cruising, where every café patron and beachgoer can appreciate your Lambo's dramatic styling. Time your drive for sunset when the golden light illuminates the pastel Art Deco buildings and your Lamborghini becomes part of Miami's living postcard.</p>

      <h3>The Overseas Highway to Key West</h3>
      <p>The drive from Miami to Key West on the Overseas Highway is a bucket-list Lamborghini experience. Though it requires planning and additional mileage, the seven-mile bridge and endless ocean views create a surreal backdrop for your Italian supercar. It's one of the most unique drives in America, and a Lamborghini makes it unforgettable.</p>

      <h3>Nightlife Arrivals in Brickell and Wynwood</h3>
      <p>For nightlife arrivals, the Brickell and Wynwood areas offer the perfect stage. Park your Lamborghini at LIV, Story, or E11EVEN and walk in knowing you've already made the night's biggest entrance. Miami's club scene appreciates bold moves, and nothing says bold like scissor doors opening under the velvet rope lights.</p>

      <h3>Top Lamborghini Photo Locations in Miami</h3>
      <ul>
        <li><strong>Wynwood Arts District:</strong> Graffiti walls create perfect contrast with Lambo's angular design</li>
        <li><strong>Ocean Drive at golden hour:</strong> Art Deco pastels meet Italian aggression</li>
        <li><strong>Venetian Causeway bridges:</strong> Water reflections and palm trees frame your shot</li>
        <li><strong>Design District:</strong> Luxury storefronts echo Lamborghini's premium positioning</li>
        <li><strong>Key Biscayne lighthouse:</strong> Historic backdrop meets futuristic design</li>
      </ul>
      
      <h2>What's Included with Your Lamborghini Rental</h2>
      <p>Lamborghini rentals from LUXX Miami include doorstep delivery throughout the Miami metropolitan area. Our team ensures your vehicle is detailed to perfection and fully fueled before handoff. We'll also provide a thorough orientation covering the vehicle's controls, drive modes, and unique features like the scissor doors and launch control.</p>

      <h3>Deposits and Requirements</h3>
      <p>A security deposit is required for all Lamborghini rentals. We understand that our clients value discretion and efficiency, so our rental process is streamlined to get you behind the wheel quickly. Valid driver's license, minimum age requirements (typically 25), and approved insurance coverage are the main prerequisites.</p>

      <h3>Weather and Convertible Considerations</h3>
      <p>Miami's weather is generally Lamborghini-friendly, but we recommend checking the forecast if you're renting a Huracán Spyder. Our team can advise on the best vehicle choice for your planned activities, whether that's a day at the beach, an evening in Brickell, or a weekend of Miami exploration.</p>
      
      <h2>Popular Lamborghini Models We Offer</h2>
      <p>Our Miami Lamborghini fleet represents the best of Sant'Agata Bolognese, each vehicle maintained to factory standards and prepared for your adventure.</p>

      <h3>Lamborghini Huracán EVO</h3>
      <p>The Lamborghini Huracán EVO is the heart of our Lamborghini fleet. With its naturally aspirated V10 producing 630 horsepower, the Huracán delivers the visceral Lamborghini experience that enthusiasts crave. The exhaust note alone is worth the rental, crackling and popping through Miami's urban canyons. Available in both coupe and Spyder configurations.</p>

      <h3>Lamborghini Urus</h3>
      <p>For those who need practicality without sacrificing presence, the Lamborghini Urus Super SUV is the answer. This 650-horsepower SUV combines Lamborghini's aggressive styling with genuine utility. It's perfect for Miami Beach weekends where you need room for friends and beach gear without compromising on performance or status.</p>

      <h3>Huracán Spyder</h3>
      <p>The Huracán Spyder adds open-air excitement to the Lamborghini experience. With Miami's year-round sunshine, dropping the top transforms every drive into an event. The V10 soundtrack resonates off buildings and palm trees, creating a symphony that's uniquely Miami.</p>

      <h2>Frequently Asked Questions</h2>

      <h3>What age do I need to be to rent a Lamborghini in Miami?</h3>
      <p>Most Lamborghini rentals require drivers to be at least 25 years old. This ensures our clients have sufficient driving experience for these high-performance vehicles. Valid driver's license and proof of insurance are also required.</p>

      <h3>How do the scissor doors work?</h3>
      <p>Lamborghini's iconic scissor doors (on Huracán models) open upward rather than outward. Our team will demonstrate proper operation during your vehicle orientation. They're surprisingly easy to use and add an unforgettable theatrical element to every entrance.</p>

      <h3>Is the Lamborghini Urus as exciting as the Huracán?</h3>
      <p>The Urus delivers unmistakable Lamborghini DNA in an SUV package. With 650 horsepower and supercar-like acceleration, the Urus offers the dramatic presence and performance you expect from the brand, plus the practicality of additional seating and cargo space.</p>

      <h3>Can I take a Lamborghini to the Keys?</h3>
      <p>Yes! The drive to Key West is one of the most spectacular Lamborghini experiences available. Extended mileage packages are available for this adventure. Contact our concierge team to arrange the details.</p>

      <h3>What's included in the daily rate?</h3>
      <p>Daily rates include delivery within Miami-Dade County, a generous mileage allowance, full tank of premium fuel, vehicle orientation, and 24/7 concierge support. Insurance options and additional miles can be added to your package.</p>
    `,
  },
  "rolls-royce": {
    slug: "rolls-royce",
    name: "Rolls-Royce",
    displayName: "Rolls-Royce",
    metaTitle: "Rolls-Royce Rental Miami | Luxury Rolls-Royce Rentals – LUXX Miami",
    metaDescription: "Rent a Rolls-Royce in Miami for ultimate luxury. Experience the Ghost, Cullinan, or Dawn in South Beach and beyond. LUXX Miami provides white-glove Rolls-Royce service.",
    h1: "Rolls-Royce Rentals in Miami",
    introText: "Elevate your Miami experience with the world's most prestigious automobile. A Rolls-Royce rental embodies sophistication, comfort, and timeless elegance. Whether for a special occasion or a week of luxury, our Rolls-Royce fleet awaits.",
    longFormContent: `
      <h2>The Rolls-Royce Legacy: The Pinnacle of Motoring Excellence</h2>
      <p>Since 1906, Rolls-Royce has been the undisputed symbol of automotive perfection. What began as a partnership between engineering genius Henry Royce and visionary Charles Rolls has evolved into the world's most prestigious motor car brand. Each Rolls-Royce is hand-built at the Goodwood manufacturing facility in England, where master craftspeople spend hundreds of hours perfecting every detail, from hand-stitched leather to bespoke woodwork.</p>
      <p>The Spirit of Ecstasy, the iconic hood ornament, represents the brand's unwavering commitment to excellence, craftsmanship, and refined luxury. When you rent a Rolls-Royce in Miami, you're experiencing over a century of automotive heritage distilled into a single, magnificent vehicle.</p>

      <h2>Why Rent a Rolls-Royce in Miami</h2>
      <p>Rolls-Royce represents the absolute pinnacle of automotive luxury, and Miami provides the perfect stage for such magnificence. The city's appreciation for the finer things in life means a Rolls-Royce is recognized and respected wherever you go. From Fisher Island to Star Island, a Rolls-Royce opens doors and elevates experiences in ways no other vehicle can.</p>
      <p>The ultra-quiet cabin of a Rolls-Royce creates a sanctuary from Miami's energetic pace. Behind the Spirit of Ecstasy, you can glide from meeting to dinner reservation in perfect serenity. The handcrafted interior, with its aromatic leathers and real wood veneers, transforms every journey into a first-class experience.</p>

      <h3>Perfect for Weddings and Celebrations</h3>
      <p>A Rolls-Royce is the quintessential wedding vehicle. The spacious interior accommodates wedding attire effortlessly, while the refined elegance creates stunning photographs. Miami's destination wedding venues, from the Vizcaya Museum to waterfront estates, provide perfect backdrops for your Rolls-Royce arrival.</p>

      <h3>Executive Presence for Business</h3>
      <p>In Miami's competitive business environment, arriving in a Rolls-Royce communicates success, stability, and attention to quality. Whether meeting international clients at Brickell City Centre or entertaining prospects at Casa Tua, a Rolls-Royce sets the appropriate tone for high-level negotiations.</p>
      
      <h2>Best Miami Routes for Your Rolls-Royce</h2>
      <p>Indian Creek Road on Miami Beach is lined with some of the most exclusive estates in the country. Driving a Rolls-Royce through this neighborhood of billionaires feels entirely appropriate - you're among peers. The tree-lined streets and palatial homes create a backdrop worthy of your distinguished vehicle.</p>

      <h3>Coral Gables and the Biltmore</h3>
      <p>Coral Gables offers old-world elegance that pairs beautifully with a Rolls-Royce. The Mediterranean Revival architecture, grand banyan trees, and stately boulevards like Alhambra Circle provide a refined setting for your luxury vehicle. Stop for lunch at the Biltmore Hotel, where valet attendants understand exactly what they're receiving.</p>

      <h3>Bal Harbour Shopping Experience</h3>
      <p>For oceanfront luxury, the drive to Bal Harbour combines scenic beauty with exclusive shopping. Arrive at Bal Harbour Shops in your Rolls-Royce and enjoy a day of boutiques and fine dining in one of Miami's most prestigious destinations.</p>

      <h3>Refined Miami Destinations</h3>
      <ul>
        <li><strong>Faena Miami Beach:</strong> The artistic hotel perfectly complements Rolls-Royce elegance</li>
        <li><strong>Fisher Island:</strong> Accessible by ferry, this exclusive enclave matches Rolls-Royce exclusivity</li>
        <li><strong>Miami Design District:</strong> Luxury boutiques and galleries attract fellow connoisseurs</li>
        <li><strong>Coconut Grove waterfront:</strong> Relaxed sophistication for a leisurely afternoon</li>
        <li><strong>Palm Beach (day trip):</strong> Worth Avenue shopping befits Rolls-Royce grandeur</li>
      </ul>
      
      <h2>What's Included with Your Rolls-Royce Rental</h2>
      <p>Rolls-Royce rentals from LUXX Miami include chauffeur service upon request. If you prefer to be driven rather than drive, our professional chauffeurs are trained to provide the white-glove service befitting a Rolls-Royce. This is particularly popular for weddings, special events, and business occasions where arriving as a passenger makes the most impact.</p>

      <h3>Self-Drive Options</h3>
      <p>Self-drive rentals are equally available for those who wish to experience Rolls-Royce from behind the wheel. Our team will acquaint you with the vehicle's unique features, including the umbrella compartment, starlight headliner (on equipped models), and the remarkably intuitive infotainment system.</p>

      <h3>Airport and FBO Delivery</h3>
      <p>Airport delivery is available at Miami International, Fort Lauderdale-Hollywood, and private FBOs throughout South Florida. Begin your Miami experience in Rolls-Royce fashion from the moment you land. Our team handles all arrangements to ensure a seamless handoff.</p>
      
      <h2>Popular Rolls-Royce Models We Offer</h2>
      <p>Our Rolls-Royce collection represents the finest examples from the Goodwood factory, each maintained to exacting standards and prepared for your distinguished arrival.</p>

      <h3>Rolls-Royce Ghost</h3>
      <p>The Rolls-Royce Ghost represents the "entry point" to Rolls-Royce ownership, yet offers a level of luxury that exceeds virtually everything else on the road. Its 6.75-liter V12 produces 563 horsepower, delivered with such smoothness that speed becomes almost secondary to the serenity of the experience.</p>

      <h3>Rolls-Royce Cullinan</h3>
      <p>The Rolls-Royce Cullinan brings Rolls-Royce luxury to an SUV platform. Named after the largest diamond ever discovered, the Cullinan offers commanding views, practical interior space, and the same magic carpet ride that defines every Rolls-Royce. Perfect for Miami families or groups who refuse to compromise on luxury.</p>

      <h3>Rolls-Royce Dawn</h3>
      <p>The Rolls-Royce Dawn convertible lets you experience Miami's perfect weather in absolute style. With the whisper-quiet roof retracted, you can enjoy the sunshine and ocean breezes while cocooned in unparalleled luxury. The Dawn transforms Miami's streets into your personal runway.</p>

      <h2>Frequently Asked Questions</h2>

      <h3>Is chauffeur service included with Rolls-Royce rentals?</h3>
      <p>Chauffeur service is available upon request for an additional fee. Many clients prefer being driven for weddings, business events, and special occasions. Self-drive options are also available for those who want the Rolls-Royce experience from behind the wheel.</p>

      <h3>What makes Rolls-Royce different from other luxury cars?</h3>
      <p>Rolls-Royce vehicles are hand-built by master craftspeople over several hundred hours. Every detail, from the hand-stitched leather to the precisely matched wood veneers, reflects this commitment to perfection. The legendary "magic carpet ride" suspension creates a driving experience unlike any other automobile.</p>

      <h3>What is the Starlight Headliner?</h3>
      <p>The Starlight Headliner features thousands of fiber optic lights hand-woven into the headliner to create a night sky effect. This bespoke feature is available on select models in our fleet and adds an extraordinary touch to evening drives.</p>

      <h3>Are Rolls-Royce rentals appropriate for airport pickups?</h3>
      <p>Absolutely. We offer delivery to Miami International Airport, Fort Lauderdale-Hollywood International, and private FBO terminals throughout South Florida. Beginning your Miami visit in a Rolls-Royce sets the perfect tone for your entire stay.</p>

      <h3>What occasions are best suited for a Rolls-Royce rental?</h3>
      <p>Rolls-Royce is ideal for weddings, anniversary celebrations, milestone birthdays, business entertainment, and any occasion where exceptional quality matters. The vehicle's refined presence communicates importance and appreciation for the finest things in life.</p>
    `,
  },
  mclaren: {
    slug: "mclaren",
    name: "McLaren",
    displayName: "McLaren",
    metaTitle: "McLaren Rental Miami | Exotic McLaren Rentals – LUXX Miami",
    metaDescription: "Rent a McLaren in Miami. Experience Formula 1 DNA on Miami's streets with our McLaren fleet. LUXX Miami offers 720S, Artura, and more with premium delivery service.",
    h1: "McLaren Rentals in Miami",
    introText: "Drive with Formula 1 DNA coursing through every component. A McLaren rental in Miami brings racing technology to the streets, offering precision handling and extraordinary performance wrapped in dramatic British design.",
    longFormContent: `
      <h2>The McLaren Legacy: Formula 1 Technology for the Road</h2>
      <p>McLaren's story begins on the racetrack. Founded by New Zealand racing driver Bruce McLaren in 1963, the company has amassed more Grand Prix victories than almost any other constructor in Formula 1 history. This racing heritage isn't just marketing - it's embedded in every road car McLaren produces. The same engineering philosophy that wins on Sunday directly influences the supercars available for rent on Monday.</p>
      <p>At the McLaren Technology Centre in Woking, England, road cars and race cars are developed side by side. Carbon fiber technology, aerodynamic innovations, and suspension systems flow directly from the racing program to the production line. When you rent a McLaren in Miami, you're driving a vehicle that shares more with an F1 car than any other supercar on the market.</p>

      <h2>Why Rent a McLaren in Miami</h2>
      <p>McLaren represents the pure distillation of Formula 1 technology for the road. Born from decades of racing dominance, every McLaren carries genuine motorsport DNA in its carbon fiber bones. In Miami - home to the newest F1 Grand Prix - driving a McLaren connects you to a racing legacy that few manufacturers can claim.</p>
      <p>The Miami Grand Prix has made the city synonymous with Formula 1, and McLaren's racing success adds special significance to renting one here. When you pilot a McLaren through Hard Rock Stadium's vicinity or along Biscayne Bay, you're experiencing a direct descendant of the cars that compete at the sport's highest level.</p>

      <h3>For the Driving Enthusiast</h3>
      <p>Unlike some supercars that prioritize straight-line speed, McLaren vehicles are engineered for total engagement. The hydraulic steering provides unfiltered road feedback, the carbon fiber monocoque delivers incredible rigidity, and the Proactive Chassis Control adapts to every corner. For drivers who appreciate the art of driving, McLaren offers an unmatched connection.</p>

      <h3>Miami Grand Prix Experience</h3>
      <p>During Miami Grand Prix weekend each May, renting a McLaren transforms your visit into a complete Formula 1 immersion. Arrive at the paddock in the same colors that race on Sunday. Our concierge team can coordinate rentals to align with race weekend events and festivities.</p>
      
      <h2>Best Miami Routes for Your McLaren</h2>
      <p>The roads through Coconut Grove offer a pleasant mix of sweeping curves and canopy-covered streets that suit a McLaren's precision handling. The village atmosphere and outdoor cafés provide perfect stops to admire your McLaren and stretch your legs during a day of exploration.</p>

      <h3>Homestead-Miami Speedway Track Experience</h3>
      <p>Homestead-Miami Speedway offers track day experiences where you can truly explore a McLaren's capabilities. Our team can help coordinate track time for clients who want to experience the car's full potential in a safe, controlled environment. It's an unforgettable add-on to any McLaren rental.</p>

      <h3>The MacArthur Causeway</h3>
      <p>For pure visual drama, the MacArthur Causeway between Miami Beach and downtown offers stunning water views and the downtown skyline as your destination. The McLaren's low stance and dramatic dihedral doors draw attention from pedestrians on the causeway walkways, making every drive an event.</p>

      <h3>Scenic McLaren Routes in Miami</h3>
      <ul>
        <li><strong>Card Sound Road:</strong> Light traffic and gentle curves showcase McLaren's handling</li>
        <li><strong>Key Biscayne loop:</strong> Coastal views with engaging road surfaces</li>
        <li><strong>A1A to Fort Lauderdale:</strong> Extended cruising with ocean vistas</li>
        <li><strong>Coral Gables residential:</strong> Tree-canopied streets perfect for photos</li>
        <li><strong>Miami Design District:</strong> Urban appreciation from fellow enthusiasts</li>
      </ul>
      
      <h2>What's Included with Your McLaren Rental</h2>
      <p>McLaren's dihedral doors are a signature feature that requires a brief orientation. Our team will demonstrate the proper opening and closing technique, as well as the optimal positioning for entering and exiting the low-slung cabin. Once mastered, these doors become one of the highlights of the McLaren experience.</p>

      <h3>Cabin Comfort and Fit</h3>
      <p>The McLaren's carbon fiber construction means the cabin is more intimate than some supercars. While this creates an incredibly connected driving experience, taller drivers should schedule an orientation to ensure comfort before committing to a multi-day rental.</p>

      <h3>Delivery and Track Day Coordination</h3>
      <p>Delivery and pickup are included throughout Miami-Dade and Broward counties. We're also happy to arrange delivery to track day events at Homestead-Miami Speedway or other approved driving experiences. McLaren and track time are natural companions.</p>
      
      <h2>Popular McLaren Models We Offer</h2>
      <p>Our McLaren collection represents the finest examples from the Woking factory, each prepared to deliver the driving experience that racing drivers have trusted for decades.</p>

      <h3>McLaren 720S</h3>
      <p>The McLaren 720S represents the brand's engineering excellence. With 710 horsepower from its twin-turbocharged V8, the 720S offers hypercar performance in a surprisingly usable package. Its active aerodynamics and Proactive Chassis Control create a driving experience that adapts to your every input.</p>

      <h3>McLaren Artura</h3>
      <p>The McLaren Artura brings hybrid technology to McLaren's lineup, combining a twin-turbo V6 with an electric motor for instant torque and improved efficiency. It's a glimpse of McLaren's future while delivering the connected driving experience the brand is famous for.</p>

      <h3>Spider Variants</h3>
      <p>Spider variants offer open-top McLaren thrills with minimal performance compromise thanks to the rigid carbon fiber monocoque structure. In Miami's perfect climate, the Spider versions let you experience the turbo whistle and exhaust note without any barriers.</p>

      <h2>Frequently Asked Questions</h2>

      <h3>Are McLarens difficult to drive?</h3>
      <p>McLaren vehicles are more accessible than their performance suggests. The progressive throttle response, precise steering, and excellent visibility make them surprisingly easy to drive in normal conditions. Our orientation ensures you're comfortable with all controls before departure.</p>

      <h3>What are dihedral doors?</h3>
      <p>McLaren's signature dihedral doors swing up and forward rather than out. They require less space to open than conventional doors and create a dramatic visual effect. Our team demonstrates proper operation during vehicle orientation.</p>

      <h3>Can I take a McLaren on a track day?</h3>
      <p>Yes! We can coordinate McLaren rentals with track day experiences at Homestead-Miami Speedway. This is the best way to experience McLaren's full performance potential in a safe, controlled environment. Contact our concierge team for availability.</p>

      <h3>How does McLaren compare to Ferrari or Lamborghini?</h3>
      <p>While all three are exceptional supercars, McLaren's focus on driving dynamics and racing heritage creates a distinctly different experience. McLarens typically offer the most direct, connected driving feel, while prioritizing lightweight construction and aerodynamic efficiency over pure straight-line speed.</p>

      <h3>Are McLaren rentals appropriate for Miami nightlife?</h3>
      <p>Absolutely. The 720S and other McLaren models turn heads at Miami's premier venues. The dihedral doors create memorable entrances, and the distinctive design ensures you'll be noticed. McLaren's sophisticated British design appeals to those who appreciate understated excellence.</p>
    `,
  },
  porsche: {
    slug: "porsche",
    name: "Porsche",
    displayName: "Porsche",
    metaTitle: "Porsche Rental Miami | Luxury Porsche Rentals – LUXX Miami",
    metaDescription: "Rent a Porsche in Miami. From the iconic 911 to the versatile Cayenne, experience German precision on Miami's streets. LUXX Miami offers premium Porsche rentals.",
    h1: "Porsche Rentals in Miami",
    introText: "Experience German precision engineering with a Porsche rental in Miami. From the legendary 911 to the versatile Cayenne, Porsche offers the perfect blend of performance, comfort, and everyday usability.",
    longFormContent: `
      <h2>The Porsche Legacy: 75 Years of Sports Car Excellence</h2>
      <p>Since 1948, Porsche has defined the sports car category with its unwavering commitment to the rear-engine 911 formula. What began in a small Stuttgart workshop has grown into one of the world's most respected performance brands, yet Porsche has never strayed from founder Ferdinand Porsche's vision: to build sports cars that offer pure driving pleasure with everyday usability.</p>
      <p>Every Porsche, from the iconic 911 to the versatile Cayenne, shares this philosophy. The result is a lineup that offers genuine performance without compromising practicality - exactly what you need for a Miami adventure that might include everything from beach runs to business dinners.</p>

      <h2>Why Rent a Porsche in Miami</h2>
      <p>Porsche occupies a unique space in the automotive world - exotic enough to turn heads, refined enough for daily driving, and engineered to perfection in every detail. In Miami, a Porsche proves equally at home navigating Brickell traffic as it is carving through the curves on a coastal highway. This versatility makes Porsche an ideal choice for extended Miami visits.</p>
      <p>The Porsche community in South Florida is one of the most active in the country. PCA (Porsche Club of America) events, cars and coffee gatherings, and impromptu Porsche spotting are common throughout Miami. Renting a Porsche here means joining a community of enthusiasts who appreciate the brand's unique philosophy.</p>

      <h3>The Perfect Multi-Day Companion</h3>
      <p>Unlike some exotics that feel demanding over extended periods, a Porsche invites long drives. The comfortable seats, intuitive controls, and refined powertrains make a 911 or Cayenne ideal for multi-day Miami explorations. Drive to the Keys, explore Palm Beach, or simply enjoy a week of Miami's diverse neighborhoods - Porsche makes every mile enjoyable.</p>

      <h3>Respected Everywhere</h3>
      <p>Porsche's reputation transcends demographics. Whether pulling up to a surf shop in Miami Beach or a gallery opening in the Design District, a Porsche communicates success without ostentation. It's the choice of those who appreciate engineering excellence over flash.</p>
      
      <h2>Best Miami Routes for Your Porsche</h2>
      <p>The 911's origins as a sports car make it perfect for Miami's more engaging roads. Head west toward the Everglades on Tamiami Trail for long, straight stretches that let you experience Porsche's legendary high-speed stability. The morning hours offer cooler temperatures and lighter traffic for the best experience.</p>

      <h3>Key Biscayne and Bill Baggs State Park</h3>
      <p>Key Biscayne provides perhaps the ideal Porsche environment in Miami. The mix of scenic coastal roads, moderate curves, and beautiful surroundings matches the 911's character perfectly. Park at Bill Baggs Cape Florida State Park and enjoy the lighthouse views before returning via the stunning Rickenbacker Causeway.</p>

      <h3>South Beach Urban Driving</h3>
      <p>South Beach's busy streets might seem an unlikely recommendation, but a Porsche handles urban environments with aplomb. The excellent visibility, precise steering, and quality suspension soak up imperfect pavement while maintaining the connected feel Porsche is famous for.</p>

      <h3>Recommended Porsche Drives in Miami</h3>
      <ul>
        <li><strong>A1A Scenic Highway:</strong> Ocean views perfectly match the 911's character</li>
        <li><strong>Everglades National Park entrance:</strong> Unique Florida landscapes for adventurous drivers</li>
        <li><strong>Coral Gables to Coconut Grove loop:</strong> Tree-lined streets and village ambiance</li>
        <li><strong>Star Island drive-by:</strong> Exclusive neighborhood showcases Miami luxury</li>
        <li><strong>Card Sound Road to the Keys:</strong> One of Florida's most engaging driving roads</li>
      </ul>
      
      <h2>What's Included with Your Porsche Rental</h2>
      <p>Porsche's rear-engine 911 has unique handling characteristics that become intuitive quickly but deserve respect. Our orientation covers the basics of weight distribution and how the 911 behaves differently from front or mid-engine sports cars. Most drivers find this enhances rather than complicates the experience.</p>

      <h3>Model-Specific Considerations</h3>
      <p>The Cayenne and Panamera models offer more conventional driving dynamics combined with Porsche's signature performance. These are excellent choices for clients bringing family or needing practical luggage space while still enjoying the Porsche driving experience.</p>

      <h3>Delivery and Practical Details</h3>
      <p>All Porsche rentals include delivery within Miami-Dade County. The 911's surprisingly practical front trunk (frunk) and rear seats can accommodate weekend luggage, making it viable for self-contained Miami adventures.</p>
      
      <h2>Popular Porsche Models We Offer</h2>
      <p>Our Porsche collection spans the brand's impressive lineup, from pure sports cars to versatile SUVs, each maintained to Stuttgart's exacting standards.</p>

      <h3>Porsche 911 Turbo S</h3>
      <p>The Porsche 911 Turbo S represents the ultimate expression of the 911 formula. With 640 horsepower and all-wheel drive, the Turbo S offers hypercar-challenging acceleration with daily-driver refinement. It's the sports car that does everything exceptionally well.</p>

      <h3>Porsche 911 Carrera S</h3>
      <p>The Porsche 911 Carrera S provides the classic rear-wheel-drive 911 experience with 443 horsepower from its twin-turbocharged flat-six. Many enthusiasts consider the Carrera S the purest modern 911, offering the most engaging connection between driver and machine.</p>

      <h3>Porsche Cayenne Turbo GT</h3>
      <p>The Porsche Cayenne Turbo GT brings track-focused performance to the SUV segment. With 631 horsepower and a record-setting Nürburgring time, the Cayenne Turbo GT proves that Porsche's SUV wears its badge with pride. It's perfect for Miami families who refuse to sacrifice performance.</p>

      <h2>Frequently Asked Questions</h2>

      <h3>Is a Porsche 911 practical for a Miami vacation?</h3>
      <p>Surprisingly, yes. The 911's front trunk accommodates carry-on luggage, and the rear seats can hold additional bags. For couples or solo travelers, a 911 offers plenty of practicality alongside its legendary performance.</p>

      <h3>What's special about Porsche's rear-engine layout?</h3>
      <p>The rear-mounted engine provides excellent traction, especially under acceleration. While the handling characteristics differ from front-engine cars, modern Porsches are engineered to be approachable for all experienced drivers. Our orientation covers the basics.</p>

      <h3>Which Porsche is best for families visiting Miami?</h3>
      <p>The Cayenne offers the ideal combination of Porsche performance and family practicality. With seating for five, generous cargo space, and genuine sports car acceleration, the Cayenne handles beach trips, shopping excursions, and spirited drives with equal aplomb.</p>

      <h3>Can I rent a Porsche convertible in Miami?</h3>
      <p>Yes! We offer various 911 Cabriolet models that let you enjoy Miami's perfect weather. The 911 Cabriolet's roof operation is quick and seamless, allowing you to adapt to changing conditions or simply enjoy the sun.</p>

      <h3>How does Porsche compare to Ferrari or Lamborghini?</h3>
      <p>While Italian exotics emphasize drama and emotion, Porsche prioritizes precision and usability. A Porsche is equally comfortable on a track day or a grocery run - that versatility is the brand's signature. For extended Miami visits, Porsche's everyday refinement becomes a significant advantage.</p>
    `,
  },
  mercedes: {
    slug: "mercedes",
    name: "Mercedes",
    displayName: "Mercedes-Benz",
    metaTitle: "Mercedes Rental Miami | Luxury Mercedes-Benz Rentals – LUXX Miami",
    metaDescription: "Rent a Mercedes-Benz in Miami. Experience AMG performance and S-Class luxury in South Beach and beyond. LUXX Miami offers premium Mercedes rentals with delivery.",
    h1: "Mercedes-Benz Rentals in Miami",
    introText: "German luxury meets Miami style with a Mercedes-Benz rental. From the commanding presence of the G-Wagon to the refined power of AMG GT, our Mercedes fleet offers sophistication and performance for every occasion.",
    longFormContent: `
      <h2>The Mercedes-Benz Legacy: 138 Years of Automotive Innovation</h2>
      <p>Mercedes-Benz invented the automobile. In 1886, Karl Benz patented the first true motor car, and in the nearly 140 years since, the three-pointed star has symbolized the pinnacle of automotive engineering, luxury, and innovation. From pioneering safety features to setting luxury benchmarks, Mercedes-Benz continues to lead the industry in ways that matter.</p>
      <p>The AMG division, born from a partnership between engineers Hans Werner Aufrecht and Erhard Melcher, has transformed Mercedes-Benz vehicles into genuine performance machines since 1967. Today, AMG hand-builds some of the world's most powerful and refined high-performance vehicles. When you rent a Mercedes in Miami, you're experiencing this legacy of excellence.</p>

      <h2>Why Rent a Mercedes-Benz in Miami</h2>
      <p>Mercedes-Benz has been synonymous with automotive excellence for over a century, and nowhere is that excellence more appreciated than in Miami. The city's discerning residents recognize the three-pointed star as a symbol of achievement, engineering prowess, and refined taste. A Mercedes commands respect while remaining approachable - the perfect balance for Miami's diverse social landscape.</p>
      <p>The AMG division transforms already excellent Mercedes vehicles into true performance machines. In Miami, where expressing individuality is celebrated, an AMG's aggressive styling and enhanced exhaust note announce your presence without being ostentatious. It's bold sophistication in its purest form.</p>

      <h3>The G-Wagon Phenomenon</h3>
      <p>No vehicle has captured Miami's imagination quite like the Mercedes-AMG G63. Originally designed as a military transport, the G-Wagon has become the definitive status symbol of South Florida's luxury lifestyle. Its boxy silhouette is as recognizable as the Miami skyline itself.</p>

      <h3>Business and Pleasure</h3>
      <p>Mercedes-Benz bridges the gap between professional and personal use effortlessly. An S-Class communicates success in business settings, while AMG variants deliver the performance for Miami's spirited driving opportunities. This versatility makes Mercedes the ideal choice for clients who need one vehicle for all occasions.</p>
      
      <h2>Best Miami Routes for Your Mercedes</h2>
      <p>The G-Wagon has become an icon of Miami's streets, particularly in neighborhoods like Sunny Isles, Aventura, and Miami Beach. Its commanding height, military-derived design, and powerful presence make it the vehicle of choice for Miami's influencer culture. Valet attendants recognize the G-Wagon's status immediately.</p>

      <h3>Palm Beach Day Trip</h3>
      <p>The S-Class finds its perfect environment on Miami's longer routes, where its superior comfort becomes apparent. The drive to Palm Beach on I-95 or A1A showcases why the S-Class remains the benchmark for luxury sedans. Arrive refreshed after hours of driving in first-class comfort.</p>

      <h3>AMG GT Photography Opportunities</h3>
      <p>For AMG GT rentals, the bridges connecting Miami Beach to the mainland offer dramatic photo opportunities and enough open road to experience the hand-built V8's capabilities. The Julia Tuttle Causeway at sunset creates magazine-worthy imagery with your AMG as the star.</p>

      <h3>Iconic Mercedes Routes in Miami</h3>
      <ul>
        <li><strong>Collins Avenue through South Beach:</strong> G-Wagon territory, especially at night</li>
        <li><strong>Sunny Isles Beach Boulevard:</strong> Luxury condo residents appreciate the three-pointed star</li>
        <li><strong>Brickell's financial district:</strong> S-Class territory for business occasions</li>
        <li><strong>Aventura Mall valet:</strong> Mercedes models dominate this luxury destination</li>
        <li><strong>A1A to Fort Lauderdale:</strong> AMG GT's natural habitat for coastal cruising</li>
      </ul>
      
      <h2>What's Included with Your Mercedes Rental</h2>
      <p>Mercedes-Benz vehicles feature intuitive technology that most drivers find immediately comfortable. The MBUX infotainment system responds to "Hey Mercedes" voice commands, making navigation and vehicle settings adjustment easy while keeping your focus on Miami's roads.</p>

      <h3>AMG Driving Modes</h3>
      <p>AMG vehicles include multiple driving modes that dramatically change the vehicle's character. Our orientation covers the differences between Comfort, Sport, and Race modes, including exhaust valve settings that adjust the soundtrack to match your mood and surroundings.</p>

      <h3>Comprehensive Delivery Options</h3>
      <p>Delivery is available throughout the Miami metropolitan area, including all major hotels, private residences, and airports. Mercedes-Benz's broad lineup means we likely have the perfect vehicle for your specific needs, whether that's G-Wagon presence, S-Class comfort, or AMG performance.</p>
      
      <h2>Popular Mercedes-Benz Models We Offer</h2>
      <p>Our Mercedes-Benz collection spans from practical luxury to extreme performance, each vehicle prepared to represent the three-pointed star with distinction.</p>

      <h3>Mercedes-AMG G63</h3>
      <p>The Mercedes-AMG G63 has achieved icon status in Miami. Its 577-horsepower twin-turbo V8, combined with military-derived styling and luxurious interior, creates a vehicle unlike anything else on the road. The G-Wagon is both a serious off-roader and a South Beach staple.</p>

      <h3>Mercedes-AMG GT</h3>
      <p>The Mercedes-AMG GT offers supercar performance in a package that wears the three-pointed star proudly. With its long hood, set-back cabin, and handcrafted 4.0-liter V8, the AMG GT is Mercedes-Benz's statement of performance intent.</p>

      <h3>Mercedes-Maybach S-Class</h3>
      <p>The Mercedes-Maybach S-Class represents the ultimate in luxury sedan refinement. With extended wheelbase, executive rear seating, and whisper-quiet cabin, the Maybach transforms Miami drives into mobile first-class experiences.</p>

      <h2>Frequently Asked Questions</h2>

      <h3>What makes the G-Wagon so popular in Miami?</h3>
      <p>The G-Wagon combines genuine capability with unmistakable presence. Its boxy, military-derived shape is instantly recognizable, and the AMG G63's V8 delivers supercar-rivaling performance. In Miami's status-conscious culture, the G-Wagon has become a symbol of success.</p>

      <h3>What's the difference between Mercedes-Benz and Mercedes-AMG?</h3>
      <p>AMG is Mercedes-Benz's high-performance division. AMG vehicles feature hand-built engines (each signed by its builder), enhanced suspensions, aggressive styling, and significantly more power. While regular Mercedes vehicles are excellent, AMG models are transformed for performance.</p>

      <h3>Is the Mercedes MBUX system easy to use?</h3>
      <p>Yes, MBUX is one of the industry's most intuitive systems. Voice commands ("Hey Mercedes"), a touchscreen, and a center console touchpad provide multiple control methods. Most drivers find it comfortable within minutes.</p>

      <h3>What is Mercedes-Maybach?</h3>
      <p>Maybach represents the ultimate expression of Mercedes-Benz luxury. Maybach vehicles feature extended wheelbases, exclusive interior appointments, and features designed for rear-seat passengers. It's the choice when standard luxury isn't enough.</p>

      <h3>Can I rent a Mercedes for a wedding in Miami?</h3>
      <p>Absolutely. The S-Class and Maybach are popular wedding vehicles, offering elegant styling and spacious interiors. Chauffeur service is available upon request for those who prefer to be driven on their special day.</p>
    `,
  },
  bmw: {
    slug: "bmw",
    name: "BMW",
    displayName: "BMW",
    metaTitle: "BMW Rental Miami | Luxury BMW Rentals – LUXX Miami",
    metaDescription: "Rent a BMW in Miami. Experience the Ultimate Driving Machine on Miami's roads. From M Performance to X Series, LUXX Miami offers premium BMW rentals.",
    h1: "BMW Rentals in Miami",
    introText: "Drive the Ultimate Driving Machine through Miami's streets. BMW's perfect balance of luxury and performance makes it ideal for everything from airport transfers to weekend adventures along the coast.",
    longFormContent: `
      <h2>The BMW Legacy: The Ultimate Driving Machine</h2>
      <p>Since 1916, Bayerische Motoren Werke has been building vehicles that prioritize driving pleasure above all else. From aviation engines to motorcycles to automobiles, BMW's heritage is one of precision engineering and dynamic excellence. The blue and white propeller-inspired logo represents this aviation heritage and the brand's Bavarian roots.</p>
      <p>The M division, born on the racetrack in 1972, applies motorsport expertise to road cars. M vehicles aren't simply faster versions of standard BMWs - they're comprehensively re-engineered from the ground up. When you rent a BMW M in Miami, you're driving the culmination of 50 years of racing development.</p>

      <h2>Why Rent a BMW in Miami</h2>
      <p>BMW's tagline - The Ultimate Driving Machine - is more than marketing; it's a philosophy that permeates every vehicle they produce. In Miami, where driving is both necessity and pleasure, BMW's commitment to driver engagement makes every journey more enjoyable. The balanced chassis, responsive steering, and eager engines transform routine drives into experiences.</p>
      <p>The M division represents BMW's motorsport heritage applied to road cars. M vehicles in Miami strike the perfect balance between everyday usability and track-ready performance. Whether you're navigating Brickell's restaurant row or attacking the curves on Key Biscayne, an M-badged BMW rises to the occasion.</p>

      <h3>Driving Enthusiast's Paradise</h3>
      <p>For those who appreciate the art of driving, BMW delivers an experience that few manufacturers can match. The hydraulic steering (on select models), perfectly weighted controls, and rear-biased weight distribution create a connection between driver and road that defines the brand.</p>

      <h3>Versatility for Every Occasion</h3>
      <p>BMW's lineup spans from two-seat sports cars to three-row SUVs, each maintaining the brand's driving focus. This versatility means there's a perfect BMW for every Miami activity, whether that's a romantic evening in South Beach or a family beach day in Key Biscayne.</p>
      
      <h2>Best Miami Routes for Your BMW</h2>
      <p>BMW's sporting nature comes alive on the more engaging roads around Miami. Card Sound Road, connecting the mainland to the Upper Keys, offers a driver-focused experience with minimal traffic and enjoyable curves. It's the perfect testing ground for BMW's legendary handling.</p>

      <h3>Urban Driving in Brickell and Downtown</h3>
      <p>The urban environment of downtown Miami and Brickell showcases BMW's practical side. Excellent visibility, tight turning circles, and intuitive parking sensors make navigating busy streets effortless. After work, Sport mode transforms your commuter into a canyon carver.</p>

      <h3>Convertible Routes in Key Biscayne</h3>
      <p>For convertible BMW rentals, the loop through Key Biscayne to Crandon Park and beyond offers the perfect open-air experience. Miami's waterfront settings and palm-lined roads create a sensory experience enhanced by the 4-series Convertible's open cabin.</p>

      <h3>Best BMW Drives in Miami</h3>
      <ul>
        <li><strong>Card Sound Road:</strong> Light traffic and engaging curves for M models</li>
        <li><strong>Tamiami Trail (west):</strong> Long straight stretches showcase high-speed stability</li>
        <li><strong>A1A coastal route:</strong> Ocean views with convertible-friendly weather</li>
        <li><strong>Coconut Grove to Coral Gables:</strong> Tree-canopied streets for leisurely drives</li>
        <li><strong>Rickenbacker Causeway:</strong> Skyline views and moderate curves</li>
      </ul>
      
      <h2>What's Included with Your BMW Rental</h2>
      <p>BMW's iDrive system has evolved into one of the industry's most intuitive interfaces. Our brief orientation covers the basics, but most drivers find the combination of touchscreen, controller dial, and voice commands becomes natural within minutes.</p>

      <h3>M Drive Mode Configuration</h3>
      <p>M vehicles feature adjustable drive modes that significantly change the experience. Comfort mode provides a refined daily driver; Sport Plus transforms the vehicle into a track weapon. Our team can advise on the best settings for your planned driving, whether that's highway cruising or spirited back-road exploration.</p>

      <h3>Delivery Throughout Miami</h3>
      <p>All BMW rentals include delivery within the Miami-Dade County area. From Miami International Airport to private residences throughout the city, we bring your BMW directly to you, fully fueled and detailed to perfection.</p>
      
      <h2>Popular BMW Models We Offer</h2>
      <p>Our BMW collection represents the full spectrum of Munich's excellence, from nimble sports cars to commanding SUVs, each maintained to factory specifications.</p>

      <h3>BMW M8 Competition</h3>
      <p>The BMW M8 Competition represents the pinnacle of BMW performance. With 617 horsepower from its twin-turbocharged V8 and available all-wheel drive, the M8 offers supercar-humbling acceleration with grand touring refinement. The M8 Convertible adds open-air excitement to the equation.</p>

      <h3>BMW X7 M60i</h3>
      <p>The BMW X7 M60i brings M-division tuning to BMW's flagship SUV. Its twin-turbo V8 and luxurious three-row interior make it perfect for family Miami adventures where neither space nor performance can be compromised.</p>

      <h3>BMW M5 Competition</h3>
      <p>The BMW M5 Competition is the definitive super sedan. Discreet enough for executive transport, powerful enough to embarrass supercars at traffic lights, the M5 has defined the segment for decades. Its all-wheel-drive system makes 617 horsepower usable in any condition.</p>

      <h2>Frequently Asked Questions</h2>

      <h3>What does the "M" in BMW M stand for?</h3>
      <p>M stands for Motorsport. BMW M GmbH (formerly BMW Motorsport GmbH) is BMW's high-performance subsidiary that develops vehicles using racing technology and expertise. M vehicles represent the highest performance versions of BMW's models.</p>

      <h3>Is a BMW practical for a Miami vacation?</h3>
      <p>Absolutely. BMW vehicles offer an excellent balance of performance and practicality. Even M models provide comfortable interiors, quality audio systems, and reasonable cargo space. For families, the X5, X7, and other SUV options provide excellent versatility.</p>

      <h3>How does BMW iDrive work?</h3>
      <p>iDrive combines a touchscreen, rotary controller, and voice commands for intuitive vehicle control. Most drivers find it natural within minutes. Our vehicle orientation covers the essentials, but BMW's interface is designed to be user-friendly from the start.</p>

      <h3>What's the difference between BMW and BMW M?</h3>
      <p>Standard BMWs offer excellent driving dynamics and luxury. M models are comprehensively upgraded with more powerful engines, enhanced suspensions, revised bodywork, and track-focused tuning. M vehicles deliver significantly more performance while maintaining everyday usability.</p>

      <h3>Are BMW convertibles available for Miami rentals?</h3>
      <p>Yes! We offer various BMW convertibles including the M8 Convertible and 4-Series Convertible. Miami's weather makes open-top driving a year-round pleasure, and BMW's convertibles maintain their driving excellence with the top down.</p>
    `,
  },
  audi: {
    slug: "audi",
    name: "Audi",
    displayName: "Audi",
    metaTitle: "Audi Rental Miami | Luxury Audi Rentals – LUXX Miami",
    metaDescription: "Rent an Audi in Miami. Experience quattro all-wheel drive and RS performance on Miami's roads. LUXX Miami offers premium Audi rentals with concierge delivery.",
    h1: "Audi Rentals in Miami",
    introText: "Experience Vorsprung durch Technik – progress through technology – with an Audi rental in Miami. From the R8 supercar to the practical Q8, Audi combines cutting-edge technology with sophisticated design for the discerning driver.",
    longFormContent: `
      <h2>The Audi Legacy: Vorsprung durch Technik</h2>
      <p>"Advancement through Technology" - Audi's famous slogan has guided the brand since 1971. From pioneering the quattro all-wheel drive system that revolutionized rally racing to leading the industry in digital cockpit technology, Audi consistently pushes automotive boundaries. The four rings logo, representing the 1932 merger of four German manufacturers, symbolizes this united commitment to innovation.</p>
      <p>The RS (RennSport - racing sport) division applies motorsport expertise to create Audi's most capable vehicles. RS models undergo comprehensive re-engineering, with enhanced engines, suspensions, and aerodynamics that transform already excellent vehicles into genuine performance machines. When you rent an Audi RS in Miami, you're experiencing German engineering at its finest.</p>

      <h2>Why Rent an Audi in Miami</h2>
      <p>Audi represents the perfect synthesis of technology and driving pleasure. The brand's pioneering quattro all-wheel drive system, now legendary from decades of rally dominance, provides confident handling regardless of conditions. In Miami, where afternoon thunderstorms can appear suddenly, quattro's reassurance adds peace of mind to every drive.</p>
      <p>The RS line represents Audi's performance pinnacle, applying motorsport technology to refined daily drivers. RS vehicles combine subtle styling with explosive performance, perfect for clients who appreciate understated excellence. In Miami's automotive landscape, an RS Audi makes a statement through capability rather than flash.</p>

      <h3>The R8: Supercar Sophistication</h3>
      <p>The Audi R8 occupies a unique position in the supercar world. Sharing its naturally aspirated V10 with Lamborghini, the R8 delivers legitimate exotic performance in a package that's remarkably approachable. It's the supercar for those who want capability without the drama.</p>

      <h3>Technology Leadership</h3>
      <p>Audi's Virtual Cockpit, Matrix LED lighting, and MMI Touch Response system represent the cutting edge of automotive technology. These innovations enhance both the driving experience and everyday usability, making Audi the natural choice for tech-savvy drivers.</p>
      
      <h2>Best Miami Routes for Your Audi</h2>
      <p>The R8's mid-engine layout and available rear-wheel drive make it a true supercar experience. Miami's smoother roads, particularly along Brickell Bay Drive and the causeways, suit the R8's capabilities perfectly. The V10's naturally aspirated wail echoing off waterfront condominiums is pure automotive theater.</p>

      <h3>RS SUVs in Miami's Varied Terrain</h3>
      <p>For RS SUVs like the RS Q8, Miami's varied terrain showcases the vehicles' versatility. From beach parking that might intimidate lower vehicles to spirited drives through Coconut Grove's tree-lined streets, the RS Q8 handles everything with composure and style.</p>

      <h3>Grand Touring to Naples</h3>
      <p>The drive to Naples via Alligator Alley (I-75) demonstrates Audi's grand touring prowess. The smooth, straight interstate allows the adaptive cruise control to maintain pace while you enjoy the virtual cockpit's customizable displays. It's the most relaxing way to cover serious distance.</p>

      <h3>Ideal Audi Routes in Miami</h3>
      <ul>
        <li><strong>Brickell Bay Drive:</strong> Smooth pavement showcases R8's mid-engine balance</li>
        <li><strong>MacArthur Causeway:</strong> Water views and downtown skyline backdrop</li>
        <li><strong>A1A coastal highway:</strong> Extended cruising with ocean vistas</li>
        <li><strong>Alligator Alley to Naples:</strong> Grand touring excellence on the interstate</li>
        <li><strong>Key Biscayne loop:</strong> Varied terrain for RS SUV versatility</li>
      </ul>
      
      <h2>What's Included with Your Audi Rental</h2>
      <p>Audi's Virtual Cockpit is a fully digital instrument cluster that can be configured to your preferences. Whether you prefer large navigation maps or traditional gauges, the system adapts to your needs. Our orientation covers the basics to help you personalize the display immediately.</p>

      <h3>R8 Supercar Orientation</h3>
      <p>The R8 is Audi's halo car, sharing its V10 engine with Lamborghini. While easier to drive than its exotic sibling, the R8 still demands respect and attention. Our team ensures you're comfortable with the vehicle's capabilities and unique attributes before departure.</p>

      <h3>All-Weather Delivery</h3>
      <p>Delivery is available throughout the Miami area, including all major hotels, airports, and private residences. Audi's sophisticated all-wheel drive system means you can confidently accept delivery regardless of weather conditions.</p>
      
      <h2>Popular Audi Models We Offer</h2>
      <p>Our Audi collection spans from everyday performance to genuine supercar territory, each maintained to Ingolstadt's exacting standards.</p>

      <h3>Audi R8 V10 Performance</h3>
      <p>The Audi R8 V10 Performance is a legitimate supercar wearing Audi's understated design language. With 602 horsepower from its naturally aspirated V10, the R8 offers a driving experience and soundtrack that rivals anything from Italy or Britain at a fraction of the drama.</p>

      <h3>Audi RS e-tron GT</h3>
      <p>The Audi RS e-tron GT brings electric performance to our fleet. This Porsche Taycan sibling proves that EVs can deliver genuine driving excitement while offering the practicality of a four-door sedan. It's the future of performance, available today.</p>

      <h3>Audi RS Q8</h3>
      <p>The Audi RS Q8 combines supercar performance with SUV practicality. Its 591-horsepower twin-turbo V8 propels this full-size SUV with shocking urgency, while the luxurious interior and generous cargo space handle family duties without compromise.</p>

      <h2>Frequently Asked Questions</h2>

      <h3>What is quattro?</h3>
      <p>Quattro is Audi's legendary all-wheel drive system, pioneered in rally racing during the 1980s. It provides exceptional traction and stability in all conditions, distributing power between all four wheels for confident handling regardless of weather.</p>

      <h3>How does the Audi R8 compare to a Lamborghini?</h3>
      <p>The R8 shares its V10 engine with the Lamborghini Huracán and offers similar performance capabilities. The key difference is character: the R8 emphasizes refinement and approachability, while Lamborghini prioritizes drama and aggression. Many enthusiasts prefer the R8's sophisticated approach.</p>

      <h3>What is the Virtual Cockpit?</h3>
      <p>Audi's Virtual Cockpit is a fully digital 12.3-inch instrument display that replaces traditional gauges. It can be configured to show large navigation maps, performance data, or classic instrument layouts. It's one of the most advanced driver displays in the industry.</p>

      <h3>Is the RS e-tron GT practical for Miami?</h3>
      <p>Absolutely. The RS e-tron GT offers approximately 230 miles of range, more than sufficient for Miami explorations. Fast charging capability means you can add significant range during lunch or shopping stops. It's also remarkably practical with four doors and a usable trunk.</p>

      <h3>What makes RS models different from regular Audis?</h3>
      <p>RS (RennSport) models undergo comprehensive performance upgrades including significantly more powerful engines, enhanced suspensions, larger brakes, aggressive body styling, and sport-tuned transmissions. They're the most capable vehicles Audi produces, applying motorsport technology to road cars.</p>
    `,
  },
}

const BRAND_MATCH_TERMS: Record<string, string[]> = {
  mercedes: ["mercedes-benz", "mercedes-amg", "amg", "g-wagon"],
  "rolls-royce": ["rolls royce", "rolls-royce", "rollsroyce"],
  "land-rover": ["land rover", "range rover", "rangerover"],
  "aston-martin": ["aston martin", "aston"],
}

const VALID_BRANDS = Object.keys(BRANDS)

export async function generateStaticParams() {
  return VALID_BRANDS.map((brand) => ({
    "brand-slug": brand,
  }))
}

export const revalidate = 900
export const dynamicParams = true

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { "brand-slug": brandSlug } = await params
  const brand = BRANDS[brandSlug]

  if (!brand) {
    return {
      title: "Brand Not Found | Luxx Miami",
    }
  }

  return {
    title: brand.metaTitle,
    description: brand.metaDescription,
    openGraph: {
      title: brand.metaTitle,
      description: brand.metaDescription,
      type: "website",
      url: `https://luxxmiami.com/car-brand/${brand.slug}`,
      siteName: "Luxx Miami",
      images: [
        {
          url: "/luxx-logo.png",
          width: 1080,
          height: 1080,
          alt: `${brand.displayName} Rentals Miami - LUXX Miami`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brand.metaTitle,
      description: brand.metaDescription,
    },
    alternates: {
      canonical: `https://luxxmiami.com/car-brand/${brand.slug}`,
    },
  }
}

const getBrandCars = cache(async (brandName: string, brandSlug: string) => {
  const matchTerms = Array.from(new Set([
    brandName,
    brandSlug,
    brandSlug.replace(/-/g, " "),
    ...(BRAND_MATCH_TERMS[brandSlug] || []),
  ].filter(Boolean))).map((term) => term.toLowerCase())

  let cars
  try {
    cars = await db
      .select({
        id: inventory.id,
        slug: inventory.slug,
        title: inventory.title,
        subtitle: inventory.subtitle,
        pricePerDay: inventory.pricePerDay,
        images: inventory.images,
        specifications: inventory.specifications,
        isFeatured: inventory.isFeatured,
        focalPoint: inventory.focalPoint,
        brand: inventory.brand,
        brandSlug: inventory.brandSlug,
      })
      .from(inventory)
      .where(and(
        eq(inventory.category, "car"),
        eq(inventory.isPublished, true),
        or(
          eq(inventory.brandSlug, brandSlug),
          ...matchTerms.flatMap((term) => [
            ilike(inventory.brand, `%${term}%`),
            ilike(inventory.title, `%${term}%`),
          ])
        )
      ))
  } catch (richQueryError) {
    console.error(`[Brand rich query failed for ${brandSlug}, using compatibility query]:`, richQueryError)
    try {
      const result = await db.execute(sql`
        SELECT to_jsonb(i) AS item
        FROM inventory i
        WHERE i.category = 'car'
          AND i.is_published = true
        ORDER BY i.id
      `)
      const rows = Array.isArray(result) ? result : Array.isArray((result as any)?.rows) ? (result as any).rows : []
      cars = rows.map((row: any) => {
        const item = row?.item || row || {}
        return {
          id: item.id,
          slug: item.slug || null,
          title: item.title || "Luxury Car",
          subtitle: item.subtitle || "",
          pricePerDay: item.pricePerDay ?? item.price_per_day ?? null,
          images: item.images || [],
          specifications: item.specifications || {},
          isFeatured: item.isFeatured ?? item.is_featured ?? false,
          focalPoint: item.focalPoint ?? item.focal_point ?? null,
          brand: item.brand || null,
          brandSlug: item.brandSlug ?? item.brand_slug ?? null,
        }
      }).filter((car: any) => {
        const haystack = `${car.brand || ""} ${car.brandSlug || ""} ${car.title || ""}`.toLowerCase()
        return matchTerms.some((term) => haystack.includes(term))
      })
    } catch (compatibilityQueryError) {
      console.error(`[Brand compatibility query failed for ${brandSlug}]:`, compatibilityQueryError)
      cars = []
    }
  }

  const carsWithImages = cars.filter((car) => {
    const images = Array.isArray(car.images) ? car.images : []
    return images.length > 0
  })

  // Sort by price descending (highest first), cars without price go to bottom
  carsWithImages.sort((a, b) => {
    const priceA = a.pricePerDay ? Number(a.pricePerDay) : 0
    const priceB = b.pricePerDay ? Number(b.pricePerDay) : 0
    if (priceA === 0 && priceB === 0) return 0
    if (priceA === 0) return 1
    if (priceB === 0) return -1
    return priceB - priceA
  })

  return carsWithImages
})

export default async function BrandPage({ params }: BrandPageProps) {
  const { "brand-slug": brandSlug } = await params
  const brand = BRANDS[brandSlug]

  if (!brand) {
    notFound()
  }

  const cars = await getBrandCars(brand.name, brandSlug)

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: brand.h1,
    description: brand.metaDescription,
    url: `https://luxxmiami.com/car-brand/${brand.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cars.length,
      itemListElement: cars.map((car, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: car.title,
          description: car.subtitle || `${car.title} available for rent in Miami`,
          url: `https://luxxmiami.com/cars/${car.slug}`,
          image: Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : undefined,
          offers: car.pricePerDay
            ? {
                "@type": "Offer",
                price: Number(car.pricePerDay),
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              }
            : undefined,
        },
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-black">
        <section className="bg-gradient-to-b from-black via-[#0A0A0A] to-black py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6">
                {brand.h1}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {brand.introText}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-[#0A0A0A]">
          <div className="container mx-auto px-4">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-[#ECAC36]"></div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
                  Available {brand.displayName} Rentals
                </h2>
              </div>
            </div>

            {cars.length === 0 ? (
              <div className="text-center py-16 px-6 bg-[#111111] border border-[#222222] cut-corner">
                <p className="text-gray-400 text-lg mb-6">
                  No {brand.displayName} vehicles currently available. Contact us for availability
                  or special requests.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+13056055899"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ECAC36] text-black font-bold cut-corner hover:bg-[#e6c766] transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    Call (305) 605-5899
                  </a>
                  <a
                    href="https://wa.me/13056055899"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#ECAC36] text-[#ECAC36] font-bold cut-corner hover:bg-[#ECAC36]/10 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {cars.map((car, index) => {
                  const images = Array.isArray(car.images)
                    ? (car.images as any[])
                        .map((img: any) => (typeof img === "string" ? img : img.url))
                        .filter(Boolean)
                    : []

                  return (
                    <InventoryCard
                      key={car.id}
                      type="car"
                      title={car.title}
                      subtitle={car.subtitle || ""}
                      price={`$${Number(car.pricePerDay || 0).toLocaleString()}`}
                      priceUnit="day"
                      image={images[0] || ""}
                      specs={[]}
                      slug={car.slug || undefined}
                      id={car.id}
                      focalPoint={car.focalPoint || "50% 40%"}
                      priority={index < 3}
                    />
                  )
                })}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-[#ECAC36] text-[#ECAC36] font-bold cut-corner hover:bg-[#ECAC36] hover:text-black transition-all duration-300"
              >
                View All Exotic Cars
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-8 bg-gradient-to-r from-[#ECAC36]/10 via-[#0A0A0A] to-[#ECAC36]/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6">
              <div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-2">
                  Need Help Choosing?
                </h3>
                <p className="text-gray-400">
                  Our concierge team is available 24/7 to help you select the perfect{" "}
                  {brand.displayName}.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+13056055899"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ECAC36] text-black font-bold cut-corner hover:bg-[#e6c766] transition-colors min-w-[180px]"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                <a
                  href="https://wa.me/13056055899"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white font-bold cut-corner hover:bg-white/10 transition-colors min-w-[180px]"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-black">
          <div className="container mx-auto px-4 max-w-4xl">
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-heading prose-headings:font-bold
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-[#ECAC36] prose-h2:border-l-4 prose-h2:border-[#ECAC36] prose-h2:pl-4
                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-white
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-[#ECAC36] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-gray-300 prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:text-gray-300 prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-300 prose-li:mb-2 prose-li:marker:text-[#ECAC36]"
              dangerouslySetInnerHTML={{ __html: brand.longFormContent }}
            />
          </div>
        </section>
      </div>
    </>
  )
}
