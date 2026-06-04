import { notFound, permanentRedirect } from "next/navigation"
import type { Metadata } from "next"
import { db } from "@/lib/db"
import { inventory, seoPages } from "@/lib/db/schema"
import { eq, and, desc, ilike, or, sql } from "drizzle-orm"
import Link from "next/link"
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
  inventoryMatch: string[]
}

const BRANDS: Record<string, BrandData> = {
  audi: {
    slug: "audi",
    name: "Audi",
    displayName: "Audi",
    inventoryMatch: ["audi"],
    metaTitle: "Audi Rental Miami | Audi Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent an Audi in Miami. Experience German engineering excellence with our R8, RS models, and luxury Audi fleet. LUXX Miami offers premium Audi rentals with delivery.",
    h1: "Audi Rentals in Miami",
    introText: "Experience the pinnacle of German engineering with an Audi rental in Miami. From the legendary R8 supercar to the refined RS performance models, Audi combines cutting-edge technology with sophisticated design for an unmatched driving experience.",
    longFormContent: `
      <h2>About Audi</h2>
      <p>Audi represents over a century of German automotive innovation. The four interlocking rings symbolize the 1932 merger of Audi, DKW, Horch, and Wanderer - four pioneering manufacturers whose combined heritage created one of the world's most respected luxury brands. Today, Audi stands at the intersection of performance, technology, and refined luxury.</p>
      <p>From the groundbreaking Quattro all-wheel-drive system that revolutionized rally racing to the virtual cockpit that redefined automotive interiors, Audi has consistently led the industry in innovation. The brand's "Vorsprung durch Technik" (advancement through technology) philosophy guides every vehicle they produce.</p>

      <h2>Why Rent an Audi in Miami</h2>
      <p>Miami's diverse driving conditions - from highway cruising to urban navigation - showcase Audi's engineering versatility. The Quattro all-wheel-drive system provides confident handling regardless of conditions, while the refined interiors create a serene environment amid the city's energy. Audi offers the perfect balance of performance and everyday usability.</p>
      <p>Whether you're attending business meetings in Brickell or exploring Miami Beach's vibrant scene, an Audi projects success without ostentation. The understated German elegance resonates with Miami's sophisticated clientele who appreciate quality over flash.</p>

      <h3>The R8: German Supercar Excellence</h3>
      <p>The Audi R8 represents the brand's halo car - a mid-engine supercar that shares its DNA with Lamborghini's finest. With its naturally aspirated V10 engine and Quattro all-wheel drive, the R8 delivers Italian supercar excitement with German precision and reliability.</p>

      <h3>RS Performance Models</h3>
      <p>Audi's RS (Renn Sport) line transforms everyday vehicles into track-capable performers. From the RS5's twin-turbo V6 to the RS6 Avant's wagon practicality with supercar speed, RS models offer the ultimate combination of versatility and performance.</p>

      <h2>Popular Audi Models We Offer</h2>
      <p>Our Miami Audi fleet represents the best of Ingolstadt engineering, each vehicle maintained to factory specifications.</p>

      <h3>Audi R8 V10</h3>
      <p>The R8 V10 delivers 602 horsepower from its naturally aspirated engine - a rarity in today's turbocharged world. The mid-engine layout provides perfect weight balance, while Quattro AWD ensures you can access all that power confidently. Available in Coupe and Spyder configurations.</p>

      <h3>Audi RS Models</h3>
      <p>Our RS fleet includes various models featuring enhanced performance, sport-tuned suspensions, and distinctive styling that sets them apart from standard Audi vehicles while maintaining everyday practicality.</p>

      <h2>Best Miami Routes for Your Audi</h2>
      <p>The A1A coastal highway showcases Audi's grand touring capabilities. The smooth power delivery and composed ride make long stretches effortless, while the available sport suspension keeps things engaging through curves.</p>

      <h3>Brickell and Downtown</h3>
      <p>Miami's financial district appreciates Audi's refined presence. The sophisticated styling and understated luxury project professionalism, while the advanced technology keeps you connected and productive.</p>

      <h3>Top Audi Driving Destinations</h3>
      <ul>
        <li><strong>Design District:</strong> Modern luxury meets German precision</li>
        <li><strong>Coral Gables:</strong> Tree-lined streets perfect for refined cruising</li>
        <li><strong>Key Biscayne:</strong> Scenic coastal roads for spirited driving</li>
        <li><strong>Aventura:</strong> Upscale shopping destinations match Audi's sophistication</li>
        <li><strong>Palm Beach day trip:</strong> Highway cruising showcases Audi's comfort</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>Familiarize yourself with Audi's MMI infotainment system during orientation</li>
        <li>The Virtual Cockpit offers multiple display configurations - find your preferred setup early</li>
        <li>RS models have drive mode selectors that significantly change the driving character</li>
        <li>The R8's engine is behind you - don't expect traditional front trunk storage</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What makes Audi different from other German luxury brands?</h3>
      <p>Audi emphasizes advanced technology and understated elegance. The brand's focus on all-wheel drive, innovative lighting systems, and digital interfaces creates a distinct character. Many clients appreciate Audi's refined approach compared to more traditional German luxury.</p>

      <h3>Is the Audi R8 practical for a Miami vacation?</h3>
      <p>The R8 is surprisingly practical for a mid-engine supercar. Front and rear storage compartments accommodate weekend luggage, and the Spyder version adds open-air excitement for Miami's perfect weather.</p>

      <h3>What is Quattro all-wheel drive?</h3>
      <p>Quattro is Audi's legendary all-wheel-drive system that distributes power between all four wheels. It provides exceptional traction and stability, particularly beneficial during sudden acceleration or variable road conditions.</p>

      <h3>How do Audi RS models compare to the R8?</h3>
      <p>RS models offer exceptional performance with greater everyday practicality. While the R8 is a focused supercar, RS models retain practical features like more luggage space and rear seating while still delivering exhilarating performance.</p>

      <h3>Are Audi rentals appropriate for business use?</h3>
      <p>Absolutely. Audi's sophisticated design and advanced technology make it ideal for business settings. The refined interiors and connected features support productivity while projecting success to clients and partners.</p>
    `,
  },
  bmw: {
    slug: "bmw",
    name: "BMW",
    displayName: "BMW",
    inventoryMatch: ["bmw"],
    metaTitle: "BMW Rental Miami | BMW Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent a BMW in Miami. Experience the Ultimate Driving Machine with our M-series performance fleet. LUXX Miami offers premium BMW rentals with concierge delivery.",
    h1: "BMW Rentals in Miami",
    introText: "Drive the Ultimate Driving Machine in Miami. BMW's legendary performance heritage combines with modern luxury to create vehicles that engage drivers like no other. From M-series supercars to elegant luxury sedans, our BMW fleet delivers pure driving pleasure.",
    longFormContent: `
      <h2>About BMW</h2>
      <p>Bayerische Motoren Werke - BMW - has built "The Ultimate Driving Machine" since 1916. What began as an aircraft engine manufacturer evolved into one of the world's most respected automotive brands, known for vehicles that prioritize driver engagement above all else. The iconic kidney grille and Hofmeister kink are recognized worldwide as symbols of German driving excellence.</p>
      <p>BMW's M division represents the pinnacle of the brand's performance philosophy. Born from motorsport, M vehicles transform already capable BMWs into track-ready performers while maintaining everyday usability. Every M car is hand-finished by dedicated specialists who understand that performance and refinement must coexist.</p>

      <h2>Why Rent a BMW in Miami</h2>
      <p>BMW's driver-focused philosophy aligns perfectly with Miami's dynamic driving environment. Whether navigating the MacArthur Causeway's sweeping curves or cruising Collins Avenue, a BMW responds to your inputs with precision and enthusiasm. The rear-wheel-drive heritage (maintained in many models) creates that connected, balanced feel that driving enthusiasts crave.</p>
      <p>Miami's appreciation for performance and style makes BMW a natural fit. The aggressive M-series styling commands attention at South Beach valet stands, while the refined interiors provide comfort during longer Miami explorations.</p>

      <h3>M Performance: Track Bred, Street Legal</h3>
      <p>BMW M cars aren't just faster versions of standard models - they're entirely reimagined from the ground up. Enhanced engines, suspension systems, brakes, and aerodynamics create vehicles that can lap racetracks yet remain refined enough for daily Miami driving.</p>

      <h3>The Driving Experience</h3>
      <p>BMW's legendary 50:50 weight distribution and communicative steering create a driving experience that rewards skill and engagement. M models add even more capability through advanced differentials, adaptive suspension, and engines that respond instantly to your right foot.</p>

      <h2>Popular BMW Models We Offer</h2>
      <p>Our Miami BMW fleet represents the best of Munich's engineering excellence, each vehicle maintained to factory M-division specifications.</p>

      <h3>BMW M4 Competition</h3>
      <p>The M4 Competition delivers 503 horsepower from its twin-turbocharged inline-six engine. The Coupe's aggressive styling and rear-wheel-drive layout create a pure driving experience that enthusiasts cherish.</p>

      <h3>BMW M8 Competition</h3>
      <p>The flagship M8 combines grand touring luxury with supercar performance. Over 600 horsepower propels this elegant coupe with refinement that matches its velocity.</p>

      <h2>Best Miami Routes for Your BMW</h2>
      <p>The Rickenbacker Causeway to Key Biscayne offers the engaging curves and scenery that BMW drivers crave. The M-series vehicles come alive on this route, rewarding smooth inputs with precise responses.</p>

      <h3>Highway Performance</h3>
      <p>I-95 and the Turnpike let you experience BMW's high-speed stability. The vehicles feel planted and confident at highway speeds, with power reserves available for confident passing maneuvers.</p>

      <h3>Top BMW Driving Experiences</h3>
      <ul>
        <li><strong>Rickenbacker Causeway:</strong> Engaging curves with water views</li>
        <li><strong>A1A to Fort Lauderdale:</strong> Extended cruising on coastal highways</li>
        <li><strong>Coconut Grove:</strong> Tree-canopied streets for spirited driving</li>
        <li><strong>Downtown Miami:</strong> Urban performance showcasing M-car agility</li>
        <li><strong>Homestead track days:</strong> Experience full BMW potential safely</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>M models have selectable drive modes - Sport+ unleashes full performance character</li>
        <li>The iDrive system controls most vehicle functions; take time during orientation</li>
        <li>Head-up displays (where equipped) reduce the need to look away from the road</li>
        <li>M vehicles have larger brakes that provide exceptional stopping power</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What does "M" mean in BMW models?</h3>
      <p>M stands for Motorsport. The BMW M division creates high-performance versions of BMW vehicles, featuring enhanced engines, suspension, brakes, and styling. These vehicles are developed with input from BMW's racing programs.</p>

      <h3>Is BMW rear-wheel drive better for performance?</h3>
      <p>Many driving enthusiasts prefer rear-wheel drive for its balanced handling characteristics and connected feel. BMW's traditional 50:50 weight distribution creates predictable, engaging dynamics that reward skilled driving.</p>

      <h3>How do BMW M cars compare to AMG Mercedes?</h3>
      <p>Both offer exceptional performance, but BMW M vehicles typically prioritize driver engagement and handling precision, while AMG often emphasizes luxury and power delivery. Many clients rent both to compare!</p>

      <h3>Are BMW rentals practical for longer trips?</h3>
      <p>Absolutely. BMW's grand touring heritage means even M models offer comfortable long-distance capabilities. The refined cabins, excellent ergonomics, and smooth power delivery make extended Miami explorations enjoyable.</p>

      <h3>What occasions suit a BMW rental?</h3>
      <p>BMW suits virtually any occasion - from business meetings where understated success matters to weekend adventures where driving engagement is paramount. The versatility of our BMW fleet accommodates diverse client needs.</p>
    `,
  },
  bentley: {
    slug: "bentley",
    name: "Bentley",
    displayName: "Bentley",
    inventoryMatch: ["bentley"],
    metaTitle: "Bentley Rental Miami | Bentley Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent a Bentley in Miami. Experience British ultra-luxury with our Continental GT, Flying Spur, and Bentayga fleet. LUXX Miami offers premium Bentley rentals.",
    h1: "Bentley Rentals in Miami",
    introText: "Experience British ultra-luxury at its finest with a Bentley rental in Miami. Hand-crafted at the legendary Crewe factory, every Bentley combines extraordinary performance with uncompromising luxury, creating the ultimate grand touring experience.",
    longFormContent: `
      <h2>About Bentley</h2>
      <p>Bentley Motors has defined British luxury motoring since 1919 when W.O. Bentley founded the company with a simple philosophy: "To build a good car, a fast car, the best in class." Over a century later, that commitment remains unchanged. Every Bentley is hand-crafted at the Crewe factory in England, where master craftspeople spend over 100 hours assembling each vehicle.</p>
      <p>The Bentley badge - the famous "Flying B" - represents more than automotive excellence; it symbolizes a tradition of Le Mans victories, royal patronage, and an unwavering commitment to creating the world's finest grand touring cars. Bentley ownership has long been associated with success, refinement, and an appreciation for the very best things in life.</p>

      <h2>Why Rent a Bentley in Miami</h2>
      <p>Bentley and Miami share a common appreciation for the extraordinary. The city's vibrant luxury culture - from Star Island estates to Design District boutiques - provides the perfect backdrop for Bentley's distinctive presence. When you arrive in a Bentley, you're making a statement that transcends mere transportation.</p>
      <p>Beyond presence, Bentley offers a driving experience unlike any other. The hand-stitched leather, polished wood veneers, and quilted diamond patterns create an environment of absolute luxury, while the twin-turbo engines deliver surprisingly spirited performance. It's grand touring elevated to an art form.</p>

      <h3>Continental GT: The Definitive Grand Tourer</h3>
      <p>The Continental GT defines the modern grand touring genre. With its powerful W12 engine, all-wheel drive, and sumptuous interior, the Continental GT crosses continents in absolute comfort while still delivering genuine performance when called upon.</p>

      <h3>Bentayga: Luxury Without Limits</h3>
      <p>The Bentley Bentayga brings Crewe craftsmanship to the SUV segment. With commanding road presence, genuine off-road capability (rarely used but always ready), and the most luxurious interior in any SUV, the Bentayga conquers Miami's diverse terrain with effortless grace.</p>

      <h2>Popular Bentley Models We Offer</h2>
      <p>Our Miami Bentley collection represents the finest examples from Crewe, each hand-inspected and prepared for your distinguished arrival.</p>

      <h3>Bentley Continental GT</h3>
      <p>The Continental GT's W12 engine produces 626 horsepower, yet delivers power with silk-smooth refinement. The all-wheel-drive system provides confident handling in all conditions, while the rotating display adds a touch of theater to the dashboard experience.</p>

      <h3>Bentley Bentayga</h3>
      <p>The Bentayga offers Bentley luxury in a commanding SUV package. The raised seating position provides excellent visibility, while the generous interior space accommodates families or groups without compromising on luxury appointments.</p>

      <h3>Bentley Flying Spur</h3>
      <p>For those who prefer to be driven, the Flying Spur offers limousine-like rear accommodations with the performance of a grand tourer. The extended wheelbase creates exceptional legroom, while the same powerful engines ensure spirited performance when required.</p>

      <h2>Best Miami Routes for Your Bentley</h2>
      <p>Indian Creek Island and the surrounding Miami Beach waterfront provide an appropriately prestigious backdrop for Bentley motoring. The stately homes and manicured landscapes complement Bentley's refined character.</p>

      <h3>Coral Gables Elegance</h3>
      <p>Coral Gables' Mediterranean architecture and tree-lined boulevards suit Bentley's old-world charm. The Biltmore Hotel makes an ideal destination - a venue that understands luxury as deeply as Bentley does.</p>

      <h3>Premier Bentley Destinations</h3>
      <ul>
        <li><strong>Fisher Island:</strong> Exclusive enclave matching Bentley's prestige</li>
        <li><strong>Bal Harbour Shops:</strong> Luxury retail experiences worthy of your arrival</li>
        <li><strong>Faena District:</strong> Artistic sophistication meets British luxury</li>
        <li><strong>Palm Beach:</strong> Worth Avenue shopping befits Bentley elegance</li>
        <li><strong>Miami Beach luxury hotels:</strong> Valet attendants understand Bentley's significance</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>Bentley interiors feature genuine materials - take a moment to appreciate the craftsmanship</li>
        <li>The rotating dashboard display cycles between touchscreen, analog gauges, and smooth veneer</li>
        <li>Naim or Breitling audio systems offer exceptional sound quality</li>
        <li>All-wheel drive provides confident handling in Miami's occasional rain</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What makes Bentley different from Rolls-Royce?</h3>
      <p>While both represent British ultra-luxury, Bentley emphasizes the driver experience with more sporting character. Bentleys are designed to be driven enthusiastically, whereas Rolls-Royce typically prioritizes serene comfort. Many clients appreciate both for different occasions.</p>

      <h3>Is Bentley suitable for business occasions?</h3>
      <p>Absolutely. Bentley's understated British elegance projects success and refined taste. The brand's association with achievement makes it particularly appropriate for high-level business entertainment and client meetings.</p>

      <h3>How does the Bentayga compare to other luxury SUVs?</h3>
      <p>The Bentayga offers unmatched interior craftsmanship compared to any competitor. While others may match its performance, none approach Bentley's attention to detail, material quality, and hand-finishing.</p>

      <h3>What occasions are best for a Bentley rental?</h3>
      <p>Bentley suits any occasion where exceptional quality matters - weddings, anniversaries, significant business milestones, or simply experiencing the finest automotive craftsmanship available. The vehicle's presence enhances any celebration.</p>

      <h3>Can I drive a Bentley, or is chauffeur service required?</h3>
      <p>All Bentley rentals are available for self-drive. While chauffeur service can be arranged for the Flying Spur, Bentley's sporting character means driving yourself is a rewarding experience.</p>
    `,
  },
  ferrari: {
    slug: "ferrari",
    name: "Ferrari",
    displayName: "Ferrari",
    inventoryMatch: ["ferrari"],
    metaTitle: "Ferrari Rental Miami | Exotic Ferrari Car Rentals – LUXX Miami",
    metaDescription: "Rent a Ferrari in Miami from LUXX Miami. Experience the thrill of driving a Prancing Horse through South Beach, Brickell, and beyond. Premium Ferrari rentals with delivery.",
    h1: "Ferrari Rentals in Miami",
    introText: "Experience the pinnacle of Italian automotive excellence with a Ferrari rental in Miami. From the iconic 488 to the breathtaking SF90, our Ferrari fleet delivers pure adrenaline and unmistakable style for your Miami adventure.",
    longFormContent: `
      <h2>About Ferrari</h2>
      <p>Ferrari represents more than a century of Italian automotive passion distilled into every vehicle bearing the Prancing Horse badge. Founded by Enzo Ferrari in 1939, the marque has become synonymous with the pinnacle of automotive achievement, racing dominance, and uncompromising luxury. Each Ferrari is handcrafted in Maranello, Italy, where master artisans combine cutting-edge technology with time-honored craftsmanship.</p>
      <p>The Prancing Horse emblem carries with it decades of Formula 1 championships, legendary road cars, and a commitment to performance that remains unmatched. When you rent a Ferrari in Miami, you're experiencing a living piece of automotive history.</p>

      <h2>Why Rent a Ferrari in Miami</h2>
      <p>There's no better backdrop for a Ferrari than the sun-soaked streets of Miami. The city's vibrant culture, stunning oceanfront views, and year-round perfect weather create the ideal setting for experiencing everything a Ferrari has to offer. Whether you're cruising down Ocean Drive or accelerating along the MacArthur Causeway, a Ferrari transforms every Miami moment into an unforgettable memory.</p>
      <p>Miami's luxury lifestyle and Ferrari's legendary performance are a match made in automotive heaven. From celebrity sightings to impromptu photo opportunities, driving a Ferrari in Miami is an experience that goes far beyond transportation.</p>

      <h3>Perfect for Special Occasions</h3>
      <p>A Ferrari rental elevates any Miami celebration. Whether celebrating a milestone birthday, anniversary, or bachelor party, arriving in a Ferrari makes a statement that words cannot express.</p>

      <h3>Ideal for Business and Networking</h3>
      <p>In Miami's competitive business landscape, impressions matter. A Ferrari speaks volumes about success, taste, and attention to quality - attributes that resonate with high-level clients and business partners.</p>

      <h2>Popular Ferrari Models We Offer</h2>
      <p>Our Miami Ferrari fleet features the most sought-after models from Maranello, each maintained to factory specifications.</p>

      <h3>Ferrari 488 GTB and Spider</h3>
      <p>The Ferrari 488 GTB and Spider represent the perfect balance of usability and supercar performance. With twin-turbocharged V8 engines producing over 660 horsepower, these machines deliver breathtaking acceleration while remaining refined enough for Miami exploration.</p>

      <h3>Ferrari SF90 Stradale</h3>
      <p>For the ultimate Ferrari experience, the SF90 Stradale represents Ferrari's engineering pinnacle. This plug-in hybrid hypercar combines a turbocharged V8 with three electric motors for nearly 1,000 combined horsepower.</p>

      <h3>Ferrari 812 Superfast</h3>
      <p>The Ferrari 812 Superfast brings naturally aspirated V12 power to our fleet. With 789 horsepower, the 812 offers a driving experience that connects you directly to Ferrari's storied racing heritage.</p>

      <h2>Best Miami Routes for Your Ferrari</h2>
      <p>The A1A coastal highway offers one of the most scenic Ferrari drives in Florida. Starting from South Beach, cruise north through the Art Deco District and continue to Fort Lauderdale with the Atlantic Ocean as your constant companion.</p>

      <h3>Key Biscayne and Rickenbacker Causeway</h3>
      <p>For photo-worthy moments, Key Biscayne provides stunning backdrops. The Rickenbacker Causeway offers panoramic views of downtown Miami's skyline.</p>

      <h3>Top Photo Spots with Your Ferrari</h3>
      <ul>
        <li><strong>Wynwood Walls:</strong> Colorful murals create stunning contrasts with Ferrari's sleek lines</li>
        <li><strong>The Venetian Islands:</strong> Palm-lined bridges and water views</li>
        <li><strong>Star Island Causeway:</strong> Capture Miami's skyline with your Ferrari</li>
        <li><strong>South Pointe Park:</strong> Fisher Island creates dramatic backdrops</li>
        <li><strong>Coconut Grove waterfront:</strong> Tropical ambiance meets Italian performance</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>Ferrari's launch control requires specific conditions - ask about proper usage during orientation</li>
        <li>The manettino dial controls driving modes - experiment to find your preferred setting</li>
        <li>Spider models have quick-operating tops for adapting to Miami's weather</li>
        <li>V12 models require more warm-up time before spirited driving</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What are the requirements to rent a Ferrari in Miami?</h3>
      <p>Renters must be at least 25 years old with a valid driver's license. A major credit card is required for the security deposit, and proof of full-coverage insurance may be requested.</p>

      <h3>Is delivery included with Ferrari rentals?</h3>
      <p>Yes, complimentary delivery is included throughout Miami-Dade County. This includes hotels, private residences, and airports.</p>

      <h3>How much does it cost to rent a Ferrari in Miami?</h3>
      <p>Ferrari rental rates vary by model and season. Contact our concierge team for current pricing and availability.</p>

      <h3>Can I drive the Ferrari outside of Miami?</h3>
      <p>Ferrari rentals include generous daily mileage allowances. Extended trips can be arranged with advance notice.</p>

      <h3>What happens if there's an issue with the car?</h3>
      <p>Our 24/7 concierge team is always available to assist. In the unlikely event of an issue, we'll arrange immediate assistance.</p>
    `,
  },
  lamborghini: {
    slug: "lamborghini",
    name: "Lamborghini",
    displayName: "Lamborghini",
    inventoryMatch: ["lamborghini"],
    metaTitle: "Lamborghini Rental Miami | Exotic Lamborghini Rentals – LUXX Miami",
    metaDescription: "Rent a Lamborghini in Miami. Turn heads in a Huracán or Urus across South Beach and Brickell. LUXX Miami offers premium Lamborghini rentals with airport delivery.",
    h1: "Lamborghini Rentals in Miami",
    introText: "Command attention with a Lamborghini rental in Miami. From the scissor doors to the aggressive styling, every Lamborghini makes a statement. Our curated collection of Huracáns, Urus SUVs, and more awaits your Miami adventure.",
    longFormContent: `
      <h2>About Lamborghini</h2>
      <p>Lamborghini was born from a legendary rivalry. When Ferruccio Lamborghini, a successful tractor manufacturer, felt slighted by Enzo Ferrari, he decided to build his own sports cars. The result was a brand that has never compromised, never followed trends, and never failed to provoke a reaction.</p>
      <p>Headquartered in Sant'Agata Bolognese, Italy, Lamborghini continues to push boundaries with angular designs and naturally aspirated engines. When you rent a Lamborghini in Miami, you're joining a legacy of those who refuse to blend in.</p>

      <h2>Why Rent a Lamborghini in Miami</h2>
      <p>Lamborghini and Miami share the same DNA: bold, unapologetic, and impossible to ignore. The angular lines and aggressive stance perfectly complement Miami's avant-garde architecture. When you roll down Collins Avenue in a Huracán, you're making a statement that echoes the city's fearless spirit.</p>
      <p>The attention a Lamborghini attracts in Miami is unlike anywhere else. Photographers will ask for shots, fellow enthusiasts will give thumbs up, and every traffic light becomes an opportunity for admiration.</p>

      <h3>Make Every Entrance Unforgettable</h3>
      <p>Nothing announces your arrival quite like Lamborghini's scissor doors rising skyward. Whether pulling up to LIV nightclub or a charity gala, the theatrical door mechanism transforms every arrival into an event.</p>

      <h3>The Ultimate Miami Photo Companion</h3>
      <p>In the age of social media, a Lamborghini in Miami is content gold. The dramatic lines photograph beautifully against Art Deco buildings, graffiti murals, and ocean sunsets.</p>

      <h2>Popular Lamborghini Models We Offer</h2>
      <p>Our Miami Lamborghini fleet represents the best of Sant'Agata Bolognese, each maintained to factory standards.</p>

      <h3>Lamborghini Huracán EVO</h3>
      <p>The Huracán EVO is the heart of our Lamborghini fleet. With its naturally aspirated V10 producing 630 horsepower, the Huracán delivers the visceral experience enthusiasts crave. Available in both coupe and Spyder configurations.</p>

      <h3>Lamborghini Urus</h3>
      <p>For practicality without sacrificing presence, the Urus Super SUV combines Lamborghini's aggressive styling with genuine utility. This 650-horsepower SUV is perfect for Miami Beach weekends with room for friends and beach gear.</p>

      <h3>Huracán Spyder</h3>
      <p>The Huracán Spyder adds open-air excitement to the Lamborghini experience. With Miami's year-round sunshine, dropping the top transforms every drive into an event.</p>

      <h2>Best Miami Routes for Your Lamborghini</h2>
      <p>Ocean Drive demands a Lamborghini. The famous stretch through South Beach is designed for slow cruising where every café patron can appreciate your Lambo's dramatic styling. Time your drive for sunset when golden light illuminates the pastel Art Deco buildings.</p>

      <h3>Nightlife Arrivals in Brickell and Wynwood</h3>
      <p>For nightlife arrivals, Brickell and Wynwood offer the perfect stage. Park your Lamborghini at LIV, Story, or E11EVEN and walk in knowing you've made the night's biggest entrance.</p>

      <h3>Top Lamborghini Photo Locations</h3>
      <ul>
        <li><strong>Wynwood Arts District:</strong> Graffiti walls create perfect contrast with angular design</li>
        <li><strong>Ocean Drive at golden hour:</strong> Art Deco pastels meet Italian aggression</li>
        <li><strong>Venetian Causeway bridges:</strong> Water reflections and palm trees</li>
        <li><strong>Design District:</strong> Luxury storefronts echo Lamborghini's positioning</li>
        <li><strong>Key Biscayne lighthouse:</strong> Historic backdrop meets futuristic design</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>Scissor doors require practice - our team demonstrates proper technique during orientation</li>
        <li>The V10 engine sounds best above 4,000 RPM - don't be afraid to rev it</li>
        <li>Urus offers surprising practicality with Lamborghini drama</li>
        <li>Spyder models have quick-operating tops for Miami's weather changes</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What age do I need to be to rent a Lamborghini in Miami?</h3>
      <p>Most Lamborghini rentals require drivers to be at least 25 years old with a valid driver's license and proof of insurance.</p>

      <h3>How do the scissor doors work?</h3>
      <p>Lamborghini's iconic scissor doors open upward rather than outward. Our team demonstrates proper operation during vehicle orientation.</p>

      <h3>Is the Lamborghini Urus as exciting as the Huracán?</h3>
      <p>The Urus delivers unmistakable Lamborghini DNA in an SUV package. With 650 horsepower and supercar-like acceleration, it offers dramatic presence with practical utility.</p>

      <h3>Can I take a Lamborghini to the Keys?</h3>
      <p>Yes! The drive to Key West is a spectacular Lamborghini experience. Extended mileage packages are available.</p>

      <h3>What's included in the daily rate?</h3>
      <p>Daily rates include delivery within Miami-Dade County, a generous mileage allowance, full tank of premium fuel, vehicle orientation, and 24/7 concierge support.</p>
    `,
  },
  "land-rover": {
    slug: "land-rover",
    name: "Land Rover",
    displayName: "Land Rover",
    inventoryMatch: ["land rover", "range rover", "landrover"],
    metaTitle: "Land Rover Rental Miami | Range Rover Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent a Land Rover or Range Rover in Miami. Experience British luxury SUV excellence in South Beach and beyond. LUXX Miami offers premium Land Rover rentals with delivery.",
    h1: "Land Rover Rentals in Miami",
    introText: "Experience British luxury adventure with a Land Rover rental in Miami. From the iconic Range Rover to the sporty Range Rover Sport, our Land Rover fleet combines go-anywhere capability with uncompromising luxury for the ultimate Miami driving experience.",
    longFormContent: `
      <h2>About Land Rover</h2>
      <p>Land Rover has defined the luxury SUV segment since 1948 when the first Land Rover debuted at the Amsterdam Motor Show. What began as a utilitarian workhorse for British farmers evolved into the world's most prestigious SUV brand. The Range Rover, introduced in 1970, created an entirely new category: the luxury off-roader.</p>
      <p>Today, Land Rover vehicles are crafted at various British facilities, combining genuine off-road capability with levels of luxury that rival the finest sedans. The brand's "Above and Beyond" philosophy guides every vehicle they produce.</p>

      <h2>Why Rent a Land Rover in Miami</h2>
      <p>Land Rover's commanding presence suits Miami's diverse landscape perfectly. The elevated seating position provides excellent visibility in urban traffic, while the powerful engines and refined interiors make highway cruising effortless. Whether navigating Brickell's congested streets or cruising to the Keys, a Range Rover handles it all with British composure.</p>
      <p>Miami's luxury scene has fully embraced the Range Rover as a status symbol. The distinctive silhouette is instantly recognizable at valet stands throughout South Beach, Bal Harbour, and the Design District.</p>

      <h3>Range Rover: The Original Luxury SUV</h3>
      <p>The Range Rover defined the luxury SUV category and continues to set the standard. The current generation combines aluminum construction, advanced air suspension, and interiors that rival the finest British sedans.</p>

      <h3>Range Rover Sport: Dynamic Performance</h3>
      <p>The Range Rover Sport adds athletic capability to the Range Rover formula. With more aggressive styling and sportier dynamics, it appeals to drivers who want luxury with genuine performance.</p>

      <h2>Popular Land Rover Models We Offer</h2>
      <p>Our Miami Land Rover fleet represents the finest British SUV engineering, each maintained to exacting standards.</p>

      <h3>Range Rover Full Size</h3>
      <p>The flagship Range Rover offers uncompromising luxury in the most capable package. Available in various configurations, the full-size Range Rover provides space, presence, and refinement in equal measure.</p>

      <h3>Range Rover Sport</h3>
      <p>The Range Rover Sport combines dynamic handling with Range Rover luxury. Available with powerful supercharged engines, it delivers sports car performance from an SUV platform.</p>

      <h3>Range Rover Sport SVR</h3>
      <p>The SVR variant takes Range Rover Sport to extremes. With over 500 horsepower and track-tuned dynamics, it's the performance SUV for enthusiasts who refuse to compromise.</p>

      <h2>Best Miami Routes for Your Land Rover</h2>
      <p>The scenic drive to the Florida Keys showcases Land Rover's grand touring capabilities. The smooth, quiet ride makes the journey as enjoyable as the destination, while the elevated seating provides excellent views of the Seven Mile Bridge and surrounding waters.</p>

      <h3>Urban Excellence</h3>
      <p>Miami Beach's busy streets are easily conquered from a Range Rover's commanding driving position. The advanced cameras and parking systems make navigating tight spots effortless, while the refined cabin isolates you from urban chaos.</p>

      <h3>Premier Land Rover Destinations</h3>
      <ul>
        <li><strong>Bal Harbour Shops:</strong> Luxury retail matching Land Rover's prestige</li>
        <li><strong>Star Island:</strong> Exclusive neighborhoods suit Range Rover's status</li>
        <li><strong>Everglades National Park:</strong> Genuine capability for nature exploration</li>
        <li><strong>Palm Beach day trips:</strong> Comfortable highway cruising</li>
        <li><strong>Key West adventure:</strong> The ultimate Florida road trip vehicle</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>Air suspension adjusts for different driving conditions - explore the settings</li>
        <li>The Terrain Response system optimizes for various surfaces automatically</li>
        <li>Meridian audio systems offer exceptional sound quality</li>
        <li>The commanding seating position takes adjustment if you're used to lower vehicles</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What's the difference between Range Rover and Range Rover Sport?</h3>
      <p>The full-size Range Rover prioritizes luxury and space, while the Range Rover Sport emphasizes dynamic driving. Both offer exceptional capability, but the Sport has a more athletic character.</p>

      <h3>Is Land Rover practical for Miami vacations?</h3>
      <p>Absolutely. The generous cargo space accommodates luggage for extended stays, while rear seat comfort rivals business-class airline seating. Range Rovers excel at both daily transportation and longer adventures.</p>

      <h3>How does Range Rover compare to Bentley Bentayga?</h3>
      <p>Both offer ultra-luxury SUV experiences. Range Rover emphasizes genuine off-road capability and iconic British design, while Bentayga focuses on ultimate craftsmanship. Many clients appreciate both for different occasions.</p>

      <h3>Are Land Rover rentals suitable for families?</h3>
      <p>Range Rovers are excellent family vehicles. The spacious interiors, entertainment options, and comfortable seating make them ideal for family Miami adventures.</p>

      <h3>What occasions suit a Land Rover rental?</h3>
      <p>Land Rover suits virtually any occasion - from airport arrivals and business entertainment to beach trips and nightlife. The versatility and commanding presence work for any Miami experience.</p>
    `,
  },
  maserati: {
    slug: "maserati",
    name: "Maserati",
    displayName: "Maserati",
    inventoryMatch: ["maserati"],
    metaTitle: "Maserati Rental Miami | Maserati Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent a Maserati in Miami. Experience Italian luxury and performance with our GranTurismo, Ghibli, and Levante fleet. LUXX Miami offers premium Maserati rentals.",
    h1: "Maserati Rentals in Miami",
    introText: "Experience Italian passion and sophistication with a Maserati rental in Miami. The Trident emblem represents over a century of racing heritage combined with elegant luxury, creating vehicles that stir the soul while pampering the senses.",
    longFormContent: `
      <h2>About Maserati</h2>
      <p>Maserati's story begins in Bologna in 1914, when the Maserati brothers founded their eponymous company. The Trident logo - inspired by Neptune's trident from Bologna's Piazza Maggiore fountain - has since graced some of the most beautiful and spirited automobiles ever created. Maserati's racing heritage includes victories at every major Grand Prix and the Indianapolis 500.</p>
      <p>Today, Maserati crafts its vehicles in Modena, Italy's Motor Valley, where passion for automotive excellence runs as deep as the region's famous balsamic vinegar traditions. Each Maserati combines Ferrari-derived engineering with distinctly elegant Italian design.</p>

      <h2>Why Rent a Maserati in Miami</h2>
      <p>Maserati offers a unique proposition in Miami's exotic car scene: Italian performance and prestige with more subtle sophistication than some rivals. The distinctive styling is unmistakably exotic, yet refined enough for any occasion. Maserati's exhaust note - particularly from Ferrari-built engines - provides a soundtrack that makes every drive memorable.</p>
      <p>Miami's appreciation for Italian culture extends naturally to Maserati. The brand's elegant design and passionate character resonate with the city's vibrant, style-conscious atmosphere.</p>

      <h3>GranTurismo: The Beautiful GT</h3>
      <p>The Maserati GranTurismo is widely considered one of the most beautiful cars ever designed. Its flowing lines and Pininfarina-influenced styling create a timeless aesthetic, while Ferrari-derived V8 power ensures the beauty is more than skin deep.</p>

      <h3>Levante: Italian SUV Elegance</h3>
      <p>The Maserati Levante brings Italian passion to the luxury SUV segment. Named after a Mediterranean wind, the Levante combines Maserati's distinctive styling with genuine practicality and capability.</p>

      <h2>Popular Maserati Models We Offer</h2>
      <p>Our Miami Maserati fleet showcases the brand's diverse lineup, each vehicle embodying Italian passion and sophistication.</p>

      <h3>Maserati GranTurismo</h3>
      <p>The GranTurismo's 4.7-liter V8 produces an unforgettable exhaust note that announces your arrival before you're even seen. The 2+2 seating configuration offers surprising practicality, while the driving experience rewards both spirited and relaxed driving styles.</p>

      <h3>Maserati Ghibli</h3>
      <p>The Ghibli brings Italian style to the sports sedan segment. With available V6 or V8 power, the Ghibli offers four-door practicality without sacrificing the Maserati driving experience.</p>

      <h3>Maserati Levante</h3>
      <p>The Levante SUV combines Maserati's distinctive design with practical utility. Available with various powertrains, including a Ferrari-derived twin-turbo V8 in the Trofeo variant, the Levante offers Italian passion in SUV form.</p>

      <h2>Best Miami Routes for Your Maserati</h2>
      <p>The coastal roads from Miami Beach to Fort Lauderdale showcase Maserati's grand touring capabilities. The refined ride absorbs rough pavement, while the responsive engines make spirited moments enjoyable.</p>

      <h3>Evening Elegance</h3>
      <p>Maserati's sophisticated styling makes it particularly suited for Miami's evening scene. The distinctive front grille and quad exhaust tips create memorable arrivals at Miami's premier restaurants and venues.</p>

      <h3>Premier Maserati Destinations</h3>
      <ul>
        <li><strong>Design District:</strong> Italian design meets Miami sophistication</li>
        <li><strong>Coral Gables:</strong> Mediterranean architecture complements Italian styling</li>
        <li><strong>South Beach restaurants:</strong> Memorable arrivals at Carbone, Papi Steak, and more</li>
        <li><strong>Coconut Grove:</strong> Artistic atmosphere suits Maserati's creative spirit</li>
        <li><strong>Palm Beach:</strong> Worth Avenue sophistication matches Maserati elegance</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>Maserati's exhaust note is part of the experience - enjoy it responsibly</li>
        <li>The GranTurismo's long hood requires adjustment to parking judgment</li>
        <li>Sport mode sharpens throttle response and exhaust sound</li>
        <li>The Skyhook suspension adapts to driving conditions automatically</li>
      </ul>

      <h2>FAQ</h2>

      <h3>How does Maserati compare to Ferrari?</h3>
      <p>Maserati shares Ferrari engineering (many engines are built by Ferrari) but emphasizes grand touring luxury over pure performance. Maserati offers more everyday usability and subtle sophistication while still delivering Italian passion.</p>

      <h3>Is Maserati suitable for daily driving during my Miami visit?</h3>
      <p>Absolutely. Maserati's grand touring heritage means their vehicles are designed for extended use. The comfortable interiors, reasonable trunk space, and refined ride quality make them excellent choices for multi-day Miami adventures.</p>

      <h3>What makes the Maserati exhaust sound special?</h3>
      <p>Many Maserati engines are built by Ferrari, and the exhaust systems are tuned to create a distinctive Italian V8 sound. The combination of engineering and careful tuning creates one of the most evocative exhaust notes in the automotive world.</p>

      <h3>Which Maserati is best for groups?</h3>
      <p>The Levante SUV offers the most passenger and cargo space, followed by the Ghibli sedan. The GranTurismo's rear seats are best suited for occasional use or smaller passengers.</p>

      <h3>Are Maserati rentals appropriate for business occasions?</h3>
      <p>Yes. Maserati's understated elegance projects success and refined taste without the overt attention some supercars attract. The brand is particularly appropriate for clients who appreciate Italian craftsmanship and culture.</p>
    `,
  },
  mclaren: {
    slug: "mclaren",
    name: "McLaren",
    displayName: "McLaren",
    inventoryMatch: ["mclaren"],
    metaTitle: "McLaren Rental Miami | Exotic McLaren Rentals – LUXX Miami",
    metaDescription: "Rent a McLaren in Miami. Experience Formula 1 DNA on Miami's streets with our McLaren fleet. LUXX Miami offers 720S, Artura, and more with premium delivery service.",
    h1: "McLaren Rentals in Miami",
    introText: "Drive with Formula 1 DNA coursing through every component. A McLaren rental in Miami brings racing technology to the streets, offering precision handling and extraordinary performance wrapped in dramatic British design.",
    longFormContent: `
      <h2>About McLaren</h2>
      <p>McLaren's story begins on the racetrack. Founded by New Zealand racing driver Bruce McLaren in 1963, the company has amassed more Grand Prix victories than almost any other constructor in Formula 1 history. This racing heritage isn't just marketing - it's embedded in every road car McLaren produces.</p>
      <p>At the McLaren Technology Centre in Woking, England, road cars and race cars are developed side by side. Carbon fiber technology, aerodynamic innovations, and suspension systems flow directly from the racing program to the production line.</p>

      <h2>Why Rent a McLaren in Miami</h2>
      <p>McLaren represents the pure distillation of Formula 1 technology for the road. Born from decades of racing dominance, every McLaren carries genuine motorsport DNA in its carbon fiber bones. In Miami - home to the newest F1 Grand Prix - driving a McLaren connects you to a racing legacy that few manufacturers can claim.</p>
      <p>The Miami Grand Prix has made the city synonymous with Formula 1, and McLaren's racing success adds special significance to renting one here.</p>

      <h3>For the Driving Enthusiast</h3>
      <p>Unlike some supercars that prioritize straight-line speed, McLaren vehicles are engineered for total engagement. The hydraulic steering provides unfiltered road feedback, the carbon fiber monocoque delivers incredible rigidity, and the Proactive Chassis Control adapts to every corner.</p>

      <h3>Miami Grand Prix Experience</h3>
      <p>During Miami Grand Prix weekend each May, renting a McLaren transforms your visit into a complete Formula 1 immersion.</p>

      <h2>Popular McLaren Models We Offer</h2>
      <p>Our McLaren collection represents the finest examples from Woking, each prepared to deliver the driving experience racing drivers trust.</p>

      <h3>McLaren 720S</h3>
      <p>The McLaren 720S represents engineering excellence. With 710 horsepower from its twin-turbocharged V8, the 720S offers hypercar performance in a surprisingly usable package. Its active aerodynamics and Proactive Chassis Control create an adaptive driving experience.</p>

      <h3>McLaren Artura</h3>
      <p>The McLaren Artura brings hybrid technology to McLaren's lineup, combining a twin-turbo V6 with an electric motor for instant torque and improved efficiency.</p>

      <h3>Spider Variants</h3>
      <p>Spider variants offer open-top McLaren thrills with minimal performance compromise thanks to the rigid carbon fiber monocoque structure.</p>

      <h2>Best Miami Routes for Your McLaren</h2>
      <p>The roads through Coconut Grove offer a pleasant mix of sweeping curves and canopy-covered streets that suit McLaren's precision handling.</p>

      <h3>Homestead-Miami Speedway</h3>
      <p>Homestead-Miami Speedway offers track day experiences where you can explore a McLaren's full capabilities. Our team can help coordinate track time for clients who want to experience the car's full potential safely.</p>

      <h3>Scenic McLaren Routes</h3>
      <ul>
        <li><strong>Card Sound Road:</strong> Light traffic and gentle curves showcase handling</li>
        <li><strong>Key Biscayne loop:</strong> Coastal views with engaging road surfaces</li>
        <li><strong>A1A to Fort Lauderdale:</strong> Extended cruising with ocean vistas</li>
        <li><strong>Coral Gables residential:</strong> Tree-canopied streets for photos</li>
        <li><strong>Miami Design District:</strong> Urban appreciation from fellow enthusiasts</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>McLaren's dihedral doors require orientation - our team demonstrates proper technique</li>
        <li>The carbon fiber construction means the cabin is intimate; taller drivers should confirm fit</li>
        <li>Proactive Chassis Control offers various modes - experiment to find your preference</li>
        <li>The 720S has surprisingly good visibility for a supercar</li>
      </ul>

      <h2>FAQ</h2>

      <h3>Are McLarens difficult to drive?</h3>
      <p>McLaren vehicles are more accessible than their performance suggests. The progressive throttle response, precise steering, and excellent visibility make them surprisingly easy to drive. Our orientation ensures comfort with all controls.</p>

      <h3>What are dihedral doors?</h3>
      <p>McLaren's signature dihedral doors swing up and forward rather than out. They require less space to open than conventional doors and create a dramatic visual effect.</p>

      <h3>Can I take a McLaren on a track day?</h3>
      <p>Yes! We can coordinate McLaren rentals with track day experiences at Homestead-Miami Speedway.</p>

      <h3>How does McLaren compare to Ferrari or Lamborghini?</h3>
      <p>While all three are exceptional supercars, McLaren's focus on driving dynamics and racing heritage creates a distinctly different experience. McLarens typically offer the most direct, connected driving feel.</p>

      <h3>Are McLaren rentals appropriate for Miami nightlife?</h3>
      <p>Absolutely. The dihedral doors create memorable entrances, and the distinctive design ensures you'll be noticed at Miami's premier venues.</p>
    `,
  },
  mercedes: {
    slug: "mercedes",
    name: "Mercedes",
    displayName: "Mercedes-Benz",
    inventoryMatch: ["mercedes", "mercedes-benz", "amg"],
    metaTitle: "Mercedes Rental Miami | Luxury Mercedes-Benz Rentals – LUXX Miami",
    metaDescription: "Rent a Mercedes-Benz in Miami. Experience AMG performance and S-Class luxury in South Beach and beyond. LUXX Miami offers premium Mercedes rentals with delivery.",
    h1: "Mercedes-Benz Rentals in Miami",
    introText: "German luxury meets Miami style with a Mercedes-Benz rental. From the commanding presence of the G-Wagon to the refined power of AMG GT, our Mercedes fleet offers sophistication and performance for every occasion.",
    longFormContent: `
      <h2>About Mercedes-Benz</h2>
      <p>Mercedes-Benz invented the automobile. In 1886, Karl Benz patented the first true motor car, and in the nearly 140 years since, the three-pointed star has symbolized the pinnacle of automotive engineering, luxury, and innovation. From pioneering safety features to setting luxury benchmarks, Mercedes-Benz continues to lead the industry.</p>
      <p>The AMG division, born from a partnership between engineers Hans Werner Aufrecht and Erhard Melcher, has transformed Mercedes-Benz vehicles into genuine performance machines since 1967. Today, AMG hand-builds some of the world's most powerful and refined high-performance vehicles.</p>

      <h2>Why Rent a Mercedes-Benz in Miami</h2>
      <p>Mercedes-Benz has been synonymous with automotive excellence for over a century, and nowhere is that excellence more appreciated than in Miami. The city's discerning residents recognize the three-pointed star as a symbol of achievement, engineering prowess, and refined taste.</p>
      <p>The AMG division transforms already excellent Mercedes vehicles into true performance machines. In Miami, where expressing individuality is celebrated, an AMG's aggressive styling and enhanced exhaust note announce your presence appropriately.</p>

      <h3>The G-Wagon Phenomenon</h3>
      <p>No vehicle has captured Miami's imagination quite like the Mercedes-AMG G63. Originally designed as a military transport, the G-Wagon has become the definitive status symbol of South Florida's luxury lifestyle.</p>

      <h3>Business and Pleasure</h3>
      <p>Mercedes-Benz bridges the gap between professional and personal use effortlessly. An S-Class communicates success in business settings, while AMG variants deliver performance for spirited driving.</p>

      <h2>Popular Mercedes-Benz Models We Offer</h2>
      <p>Our Mercedes-Benz collection spans the brand's impressive lineup, each vehicle maintained to Stuttgart's exacting standards.</p>

      <h3>Mercedes-AMG G63</h3>
      <p>The G63 combines military-inspired design with 577 horsepower of AMG performance. The hand-built twin-turbo V8 provides surprising acceleration from this iconic SUV, while the boxy styling ensures you'll never be overlooked.</p>

      <h3>Mercedes-AMG GT</h3>
      <p>The AMG GT represents Mercedes' sports car vision. With its long hood, wide stance, and hand-built engine, the AMG GT delivers pure driving excitement with Mercedes refinement.</p>

      <h3>Mercedes-Benz S-Class</h3>
      <p>The S-Class remains the benchmark for luxury sedans. Advanced technology, supreme comfort, and understated elegance make it the ideal choice for business and formal occasions.</p>

      <h2>Best Miami Routes for Your Mercedes</h2>
      <p>The G-Wagon has become an icon of Miami's streets, particularly in Sunny Isles, Aventura, and Miami Beach. Its commanding height and powerful presence make it the vehicle of choice for Miami's influencer culture.</p>

      <h3>Palm Beach Day Trip</h3>
      <p>The S-Class finds its perfect environment on longer routes. The drive to Palm Beach showcases why the S-Class remains the benchmark for luxury sedans. Arrive refreshed after hours of first-class comfort.</p>

      <h3>Iconic Mercedes Routes</h3>
      <ul>
        <li><strong>Collins Avenue:</strong> G-Wagon territory, especially at night</li>
        <li><strong>Sunny Isles Beach:</strong> Luxury condos appreciate the three-pointed star</li>
        <li><strong>Brickell financial district:</strong> S-Class territory for business occasions</li>
        <li><strong>Design District:</strong> AMG GT photography opportunities</li>
        <li><strong>Venetian Causeway:</strong> Bridge views with downtown backdrop</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>AMG models have extensive drive mode options - spend time exploring them</li>
        <li>The MBUX system controls most vehicle functions; ask about features during orientation</li>
        <li>G-Wagon's height requires attention in parking structures</li>
        <li>AMG exhaust systems are loudest in Sport+ mode - be mindful in residential areas</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What does AMG mean?</h3>
      <p>AMG stands for Aufrecht Melcher Großaspach, named after founders Hans Werner Aufrecht and Erhard Melcher. AMG transforms Mercedes vehicles into high-performance machines with hand-built engines, enhanced suspension, and distinctive styling.</p>

      <h3>Is the G-Wagon practical for Miami?</h3>
      <p>Despite its military origins, the G-Wagon offers surprising luxury and practicality. The spacious interior accommodates passengers and luggage, while the elevated seating provides excellent visibility in traffic.</p>

      <h3>Which Mercedes is best for business use?</h3>
      <p>The S-Class remains the quintessential executive vehicle. Its understated luxury, advanced technology, and refined presence make it ideal for business occasions and client entertainment.</p>

      <h3>How does AMG compare to BMW M?</h3>
      <p>Both offer exceptional performance, but AMG often emphasizes luxury and power delivery while BMW M typically prioritizes handling dynamics. Many clients rent both to compare!</p>

      <h3>Are Mercedes rentals available with chauffeur service?</h3>
      <p>Chauffeur service is available upon request, particularly popular with S-Class rentals for business occasions and special events.</p>
    `,
  },
  porsche: {
    slug: "porsche",
    name: "Porsche",
    displayName: "Porsche",
    inventoryMatch: ["porsche"],
    metaTitle: "Porsche Rental Miami | Porsche Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent a Porsche in Miami. Experience Stuttgart engineering excellence with our 911, Cayenne, and Taycan fleet. LUXX Miami offers premium Porsche rentals with delivery.",
    h1: "Porsche Rentals in Miami",
    introText: "Experience German sports car perfection with a Porsche rental in Miami. From the legendary 911 to the all-electric Taycan, Porsche combines decades of racing heritage with cutting-edge technology to deliver the ultimate driving experience on Miami's scenic roads.",
    longFormContent: `
      <h2>About Porsche</h2>
      <p>Porsche has built some of the world's most iconic sports cars since 1948 when Ferdinand "Ferry" Porsche created the first 356 in Stuttgart, Germany. The company's commitment to "everyday sports cars" has produced legends like the 911, a model that has evolved continuously since 1963 while maintaining its unmistakable silhouette and rear-engine layout.</p>
      <p>Beyond the 911, Porsche has expanded into luxury SUVs with the Cayenne and Macan, four-door sports cars with the Panamera, and electric vehicles with the groundbreaking Taycan. Each model carries Porsche's DNA of performance, precision, and driving engagement.</p>

      <h2>Why Rent a Porsche in Miami</h2>
      <p>Porsche and Miami share a passion for performance and style. The city's year-round sunshine, coastal highways, and vibrant nightlife create the perfect backdrop for Porsche's engaging driving dynamics. Whether carving through the curves of Key Biscayne or cruising Collins Avenue, a Porsche responds to every input with precision and enthusiasm.</p>
      <p>Miami's car culture has deep appreciation for Porsche's motorsport heritage. The brand's racing pedigree - including countless Le Mans victories - resonates with enthusiasts who recognize that every Porsche benefits from lessons learned on the track.</p>

      <h3>The 911: A Living Legend</h3>
      <p>The Porsche 911 remains the benchmark for sports cars. Its rear-engine layout creates unique handling characteristics that reward skilled drivers, while modern technology makes it more accessible than ever. The 911 Turbo and GT3 variants push performance to supercar levels.</p>

      <h3>Cayenne and Macan: Performance SUVs</h3>
      <p>Porsche proved that SUVs could be genuine sports cars with the Cayenne and Macan. These vehicles offer Porsche's legendary handling in packages practical enough for Miami's diverse needs - from beach trips to business meetings.</p>

      <h2>Popular Porsche Models We Offer</h2>
      <p>Our Miami Porsche fleet represents Stuttgart's finest, each maintained to factory specifications for optimal performance.</p>

      <h3>Porsche 911 Turbo S</h3>
      <p>The 911 Turbo S delivers 640 horsepower from its twin-turbocharged flat-six engine. All-wheel drive ensures maximum traction, while the sophisticated suspension balances comfort with track-capable handling. Available in Coupe and Cabriolet configurations.</p>

      <h3>Porsche Cayenne Turbo</h3>
      <p>The Cayenne Turbo proves performance and practicality can coexist. With over 500 horsepower and genuine sports car dynamics, it handles Miami's varied terrain - from highway cruising to Design District valet - with equal aplomb.</p>

      <h3>Porsche Taycan Turbo S</h3>
      <p>The Taycan represents Porsche's electric future. With over 750 horsepower on overboost, the Taycan Turbo S accelerates like few cars on earth while producing zero emissions. The futuristic interior complements Miami's forward-thinking culture.</p>

      <h2>Best Miami Routes for Your Porsche</h2>
      <p>The Rickenbacker Causeway to Key Biscayne offers the engaging curves and stunning views that showcase Porsche's handling prowess. The 911 feels particularly alive on this route, rewarding smooth inputs with precise responses.</p>

      <h3>Overseas Highway to the Keys</h3>
      <p>For a true Porsche adventure, the drive to Key West via US-1 provides hours of varied driving. The 911's grand touring capabilities shine on this journey, delivering comfort and performance in equal measure.</p>

      <h3>Top Porsche Driving Destinations</h3>
      <ul>
        <li><strong>Key Biscayne:</strong> Winding roads perfect for 911 agility</li>
        <li><strong>A1A coastal route:</strong> Ocean views complement Porsche's refined cruising</li>
        <li><strong>Coconut Grove:</strong> Tree-canopied streets for spirited driving</li>
        <li><strong>Homestead-Miami Speedway:</strong> Track day experiences (when available)</li>
        <li><strong>Palm Beach via I-95:</strong> Highway cruising showcases Porsche comfort</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>The 911's rear-engine layout creates unique handling - take time to understand its characteristics</li>
        <li>Sport Chrono packages add launch control and dynamic engine mounts</li>
        <li>PDK transmissions offer manual mode via steering wheel paddles</li>
        <li>Taycan models have extensive regenerative braking settings to explore</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What makes Porsche 911 handling unique?</h3>
      <p>The rear-engine layout places most weight over the rear wheels, creating distinctive turn-in characteristics and excellent traction. Modern electronics make it very manageable, but experienced drivers appreciate the engaged feel that's unlike any other sports car.</p>

      <h3>Is the Porsche Taycan practical for Miami driving?</h3>
      <p>Absolutely. The Taycan's range exceeds 200 miles, and Miami's growing charging infrastructure makes it practical for daily use. The instant electric torque is perfectly suited to Miami's stop-and-go traffic.</p>

      <h3>How does the Cayenne compare to other luxury SUVs?</h3>
      <p>The Cayenne offers genuine sports car dynamics that competitors can't match. While others prioritize comfort, the Cayenne delivers Porsche's signature driving engagement in an SUV package.</p>

      <h3>Are Porsche rentals suitable for longer trips?</h3>
      <p>Yes. Porsche's grand touring heritage means even the 911 offers comfortable long-distance capability. The Cayenne and Panamera add practical space for extended adventures.</p>
    `,
  },
  "rolls-royce": {
    slug: "rolls-royce",
    name: "Rolls-Royce",
    displayName: "Rolls-Royce",
    inventoryMatch: ["rolls-royce", "rolls royce", "rollsroyce"],
    metaTitle: "Rolls-Royce Rental Miami | Rolls-Royce Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent a Rolls-Royce in Miami. Experience the pinnacle of British ultra-luxury with our Phantom, Ghost, and Cullinan fleet. LUXX Miami offers bespoke Rolls-Royce rentals.",
    h1: "Rolls-Royce Rentals in Miami",
    introText: "Experience automotive perfection with a Rolls-Royce rental in Miami. Hand-built at the Goodwood factory in England, every Rolls-Royce represents the absolute pinnacle of luxury motoring - where every detail is crafted to exceed the highest expectations.",
    longFormContent: `
      <h2>About Rolls-Royce</h2>
      <p>Rolls-Royce has defined automotive excellence since Charles Rolls and Henry Royce joined forces in 1904. Their commitment to building "the best car in the world" established standards that remain unmatched. Every Rolls-Royce is hand-assembled at the Goodwood factory in West Sussex, England, where master craftspeople spend months perfecting each vehicle.</p>
      <p>The Spirit of Ecstasy - the iconic hood ornament - symbolizes a century of uncompromising luxury. From the hand-painted coachlines (each applied by a single artist) to the starlight headliner with fiber optic stars, Rolls-Royce attention to detail borders on obsessive perfection.</p>

      <h2>Why Rent a Rolls-Royce in Miami</h2>
      <p>Miami's appreciation for the extraordinary makes it the perfect setting for Rolls-Royce. The brand's stately presence commands respect at Fisher Island estates, Star Island mansions, and Bal Harbour's finest establishments. When you arrive in a Rolls-Royce, you announce that only the very best will suffice.</p>
      <p>Beyond status, Rolls-Royce offers an unparalleled experience of serenity and luxury. The "magic carpet ride" suspension isolates you from road imperfections, while the whisper-quiet cabin creates a sanctuary from Miami's energy when desired.</p>

      <h3>The Phantom: Automotive Royalty</h3>
      <p>The Phantom represents the ultimate expression of Rolls-Royce philosophy. Its presence commands attention without demanding it, and its interior rivals the world's finest private spaces for comfort and craftsmanship.</p>

      <h3>The Cullinan: Luxury Without Limits</h3>
      <p>The Cullinan brings Rolls-Royce excellence to the SUV segment. Named after the largest diamond ever discovered, this vehicle offers commanding presence and genuine capability while maintaining the brand's legendary refinement.</p>

      <h2>Popular Rolls-Royce Models We Offer</h2>
      <p>Our Miami Rolls-Royce collection represents Goodwood's finest creations, each inspected and prepared to exceed your expectations.</p>

      <h3>Rolls-Royce Phantom</h3>
      <p>The Phantom stands as the flagship - a vehicle so refined that engineers measured its cabin acoustics against recording studios. The 6.75-liter twin-turbo V12 delivers effortless power, never rushed, always serene.</p>

      <h3>Rolls-Royce Ghost</h3>
      <p>The Ghost offers Rolls-Royce luxury in a slightly more driver-focused package. Its "Post Opulence" design philosophy emphasizes refined simplicity while maintaining the brand's legendary craftsmanship.</p>

      <h3>Rolls-Royce Cullinan</h3>
      <p>The Cullinan combines Rolls-Royce luxury with SUV practicality. The elevated seating provides commanding views of Miami, while the spacious interior accommodates families or groups in absolute comfort.</p>

      <h2>Best Miami Routes for Your Rolls-Royce</h2>
      <p>Fisher Island and the surrounding Miami Beach waterfront provide the appropriate backdrop for Rolls-Royce motoring. The stately homes, manicured landscapes, and refined atmosphere complement the vehicle's dignified presence.</p>

      <h3>Palm Beach Worth Avenue</h3>
      <p>The drive to Palm Beach and Worth Avenue shopping district suits Rolls-Royce perfectly. The highway journey showcases the magic carpet ride, while Worth Avenue's luxury boutiques appreciate your distinguished arrival.</p>

      <h3>Premier Rolls-Royce Destinations</h3>
      <ul>
        <li><strong>Fisher Island:</strong> Miami's most exclusive enclave matches Rolls-Royce prestige</li>
        <li><strong>Bal Harbour Shops:</strong> Luxury retail experiences worthy of your arrival</li>
        <li><strong>The Setai:</strong> Ultra-luxury hotel understands Rolls-Royce clientele</li>
        <li><strong>Coral Gables Biltmore:</strong> Historic elegance complements British luxury</li>
        <li><strong>Star Island:</strong> Celebrity homes provide appropriate backdrop</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>Coach doors (rear-hinged) open rearward - allow extra clearance when parking</li>
        <li>The starlight headliner is best appreciated after dark</li>
        <li>Spirit of Ecstasy retracts into the hood for parking security</li>
        <li>Whisper-quiet cabins may require adjustment if accustomed to road noise</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What makes Rolls-Royce different from Bentley?</h3>
      <p>While both represent British ultra-luxury, Rolls-Royce emphasizes serene, chauffeur-style comfort and absolute refinement. Bentley offers a more sporting character. Rolls-Royce is for those who prioritize ultimate luxury over driving engagement.</p>

      <h3>Are Rolls-Royce rentals only for special occasions?</h3>
      <p>While Rolls-Royce elevates any occasion, many clients simply appreciate the daily experience of the world's finest automobiles. Every drive becomes special when traveling in Rolls-Royce luxury.</p>

      <h3>Can I drive a Rolls-Royce myself?</h3>
      <p>Yes, all Rolls-Royce rentals are available for self-drive. While chauffeur service can be arranged, many clients enjoy the surprisingly engaging driving experience these vehicles offer.</p>

      <h3>How does the Cullinan compare to other luxury SUVs?</h3>
      <p>The Cullinan offers a level of interior craftsmanship and ride quality that no competitor approaches. While others may match size or power, none deliver the Rolls-Royce experience of absolute luxury.</p>
    `,
  },
  "aston-martin": {
    slug: "aston-martin",
    name: "Aston Martin",
    displayName: "Aston Martin",
    inventoryMatch: ["aston martin", "aston-martin", "astonmartin"],
    metaTitle: "Aston Martin Rental Miami | Aston Martin Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent an Aston Martin in Miami. Experience British elegance and James Bond heritage with our DB11, DBS, and Vantage fleet. LUXX Miami offers premium Aston Martin rentals.",
    h1: "Aston Martin Rentals in Miami",
    introText: "Experience British elegance and sporting heritage with an Aston Martin rental in Miami. Famous for its association with James Bond, Aston Martin crafts some of the world's most beautiful and refined grand tourers - perfect for Miami's sophisticated driving scene.",
    longFormContent: `
      <h2>About Aston Martin</h2>
      <p>Aston Martin has represented British automotive excellence since Lionel Martin and Robert Bamford founded the company in 1913. The name "Aston" comes from the Aston Clinton hillclimb where Martin achieved early racing success. Over a century later, Aston Martin remains synonymous with elegant design, refined performance, and unmistakable British character.</p>
      <p>The brand's association with James Bond since 1964's "Goldfinger" cemented its status as the choice of sophisticated adventurers worldwide. Every Aston Martin is hand-assembled at the Gaydon factory in Warwickshire, England, where craftspeople combine traditional techniques with modern engineering.</p>

      <h2>Why Rent an Aston Martin in Miami</h2>
      <p>Aston Martin's elegant lines and refined character suit Miami's sophisticated side perfectly. Where other exotics shout for attention, Aston Martin commands respect through understated beauty and cultured presence. The brand appeals to those who appreciate quality over flash.</p>
      <p>Miami's diverse driving opportunities showcase Aston Martin's grand touring capabilities. Whether attending Art Basel events, dining at Michelin-starred restaurants, or cruising the A1A coastal highway, an Aston Martin projects refined success.</p>

      <h3>DB11: The Modern Grand Tourer</h3>
      <p>The DB11 represents Aston Martin's vision of the perfect grand touring car. Its twin-turbo V8 or V12 engines deliver effortless power, while the elegant interior creates a refined environment for Miami explorations.</p>

      <h3>DBS Superleggera: Ultimate Performance</h3>
      <p>The DBS Superleggera combines Aston Martin elegance with genuine supercar performance. Over 700 horsepower from its twin-turbo V12 delivers breathtaking acceleration while maintaining the brand's signature refinement.</p>

      <h2>Popular Aston Martin Models We Offer</h2>
      <p>Our Miami Aston Martin fleet represents Gaydon's finest creations, each maintained to factory specifications.</p>

      <h3>Aston Martin DB11</h3>
      <p>The DB11 offers the quintessential Aston Martin experience. Its sculpted bodywork houses either a 503-horsepower V8 or 630-horsepower V12, delivering performance with characteristic British refinement.</p>

      <h3>Aston Martin DBS Superleggera</h3>
      <p>The DBS Superleggera is Aston Martin's flagship grand tourer. With 715 horsepower and a 211-mph top speed, it delivers supercar performance wrapped in elegant British design.</p>

      <h3>Aston Martin Vantage</h3>
      <p>The Vantage offers more focused driving dynamics in a compact, athletic package. Its Mercedes-AMG-derived twin-turbo V8 delivers 503 horsepower with a distinctive Aston Martin character.</p>

      <h2>Best Miami Routes for Your Aston Martin</h2>
      <p>The A1A coastal highway provides the perfect setting for Aston Martin grand touring. The smooth surface, ocean views, and flowing curves complement the DB11's refined character beautifully.</p>

      <h3>Design District and Wynwood</h3>
      <p>Miami's artistic districts appreciate Aston Martin's sculptural design. The Design District's luxury boutiques and Wynwood's creative energy provide sophisticated backdrops for these British beauties.</p>

      <h3>Premier Aston Martin Destinations</h3>
      <ul>
        <li><strong>Design District:</strong> Luxury boutiques match Aston Martin sophistication</li>
        <li><strong>Faena Hotel:</strong> Artistic elegance complements British design</li>
        <li><strong>Key Biscayne:</strong> Scenic drives showcase grand touring capability</li>
        <li><strong>Coral Gables:</strong> Tree-lined streets perfect for refined cruising</li>
        <li><strong>Palm Beach:</strong> Sophisticated destination for sophisticated cars</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>Aston Martin interiors feature hand-stitched leather - appreciate the craftsmanship</li>
        <li>The distinctive grille requires care when parking to avoid curb contact</li>
        <li>V12 models have more power but V8 versions offer engaging dynamics</li>
        <li>The infotainment system uses Mercedes-derived technology for intuitive operation</li>
      </ul>

      <h2>FAQ</h2>

      <h3>What's the connection between Aston Martin and James Bond?</h3>
      <p>Aston Martin has appeared in James Bond films since 1964's "Goldfinger" featuring the iconic DB5. This association established Aston Martin as the choice of sophisticated, capable individuals worldwide.</p>

      <h3>How does Aston Martin compare to Ferrari or Lamborghini?</h3>
      <p>Aston Martin offers a more refined, understated presence compared to Italian exotics. While Ferraris and Lamborghinis demand attention, Aston Martins command respect through elegant design and cultured character.</p>

      <h3>Is Aston Martin suitable for everyday driving in Miami?</h3>
      <p>Absolutely. Aston Martin's grand touring philosophy means these vehicles handle daily driving beautifully. Comfortable interiors, adequate cargo space, and refined road manners make them surprisingly practical.</p>

      <h3>What occasions suit an Aston Martin rental?</h3>
      <p>Aston Martin suits occasions requiring sophisticated presence - business entertainment, upscale dining, cultural events, or simply appreciating beautiful automotive design on Miami's scenic roads.</p>
    `,
  },
  cadillac: {
    slug: "cadillac",
    name: "Cadillac",
    displayName: "Cadillac",
    inventoryMatch: ["cadillac"],
    metaTitle: "Cadillac Rental Miami | Cadillac Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent a Cadillac in Miami. Experience American luxury with our Escalade, CT5-V Blackwing, and bold Cadillac fleet. LUXX Miami offers premium Cadillac rentals with delivery.",
    h1: "Cadillac Rentals in Miami",
    introText: "Experience American luxury at its boldest with a Cadillac rental in Miami. From the iconic Escalade to the track-capable CT5-V Blackwing, Cadillac combines distinctive design with genuine performance for a uniquely American luxury experience.",
    longFormContent: `
      <h2>About Cadillac</h2>
      <p>Cadillac has defined American luxury since 1902, making it one of the oldest automobile brands in the world. Named after the French explorer who founded Detroit, Cadillac established early standards for precision manufacturing and became known as "The Standard of the World." Presidents, celebrities, and captains of industry chose Cadillac for its combination of luxury, presence, and American craftsmanship.</p>
      <p>Today's Cadillac embraces bold design language and genuine performance. The V-Series performance division creates vehicles capable of competing with European sport sedans, while the Escalade remains the undisputed king of full-size luxury SUVs.</p>

      <h2>Why Rent a Cadillac in Miami</h2>
      <p>Cadillac's bold American presence resonates powerfully in Miami. The Escalade has become an icon of success in South Florida, instantly recognizable and universally respected. Its commanding size and distinctive lighting signature announce arrival with authority.</p>
      <p>For those seeking performance, Cadillac's V-Series offers genuine track capability wrapped in luxury appointments. The CT5-V Blackwing's supercharged V8 and manual transmission option appeal to enthusiasts who appreciate American muscle refined for the modern era.</p>

      <h3>Escalade: The Icon</h3>
      <p>The Cadillac Escalade transcends transportation - it's a cultural phenomenon. Its commanding presence, advanced technology, and spacious luxury have made it the choice of executives, athletes, and entertainers throughout Miami.</p>

      <h3>V-Series Performance</h3>
      <p>Cadillac's V-Series proves American manufacturers can compete with European performance brands. The CT5-V Blackwing's 668-horsepower supercharged V8 and available manual transmission create a driving experience that rivals anything from Germany.</p>

      <h2>Popular Cadillac Models We Offer</h2>
      <p>Our Miami Cadillac fleet represents the best of American luxury, each vehicle maintained to exceed expectations.</p>

      <h3>Cadillac Escalade</h3>
      <p>The Escalade offers unmatched presence and capability. The curved OLED display, Super Cruise driver assistance, and available 600+ horsepower V8 create a technological showcase wrapped in bold American styling.</p>

      <h3>Cadillac CT5-V Blackwing</h3>
      <p>The CT5-V Blackwing is Cadillac's most powerful production car ever. With 668 horsepower and an available six-speed manual transmission, it offers old-school muscle car thrills with modern refinement.</p>

      <h3>Cadillac Escalade-V</h3>
      <p>The Escalade-V combines the Escalade's iconic presence with supercharged V8 performance. Over 680 horsepower propels this full-size luxury SUV with surprising urgency while maintaining its refined character.</p>

      <h2>Best Miami Routes for Your Cadillac</h2>
      <p>The Escalade dominates Miami's nightlife districts. Arriving at LIV, Story, or E11EVEN in a Cadillac Escalade makes a statement that resonates with Miami's appreciation for bold luxury.</p>

      <h3>Highway Cruising</h3>
      <p>For CT5-V Blackwing experiences, I-95 and Florida's Turnpike provide opportunities to safely experience its highway performance. The refined cabin makes extended drives comfortable while the supercharged V8 remains ready for spirited moments.</p>

      <h3>Premier Cadillac Destinations</h3>
      <ul>
        <li><strong>South Beach nightlife:</strong> Escalade's natural habitat</li>
        <li><strong>Brickell financial district:</strong> Bold American luxury for business</li>
        <li><strong>Aventura Mall:</strong> Luxury shopping matches Cadillac's presence</li>
        <li><strong>Hard Rock Stadium:</strong> Game day arrivals in commanding style</li>
        <li><strong>Miami Beach hotels:</strong> Valet stands appreciate the Escalade's status</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>The Escalade's size requires awareness in parking structures and tight spaces</li>
        <li>Super Cruise (where equipped) allows hands-free highway driving on mapped roads</li>
        <li>V-Series models have track-focused modes - explore during orientation</li>
        <li>The curved OLED display offers extensive customization options</li>
      </ul>

      <h2>FAQ</h2>

      <h3>How does the Escalade compare to European luxury SUVs?</h3>
      <p>The Escalade offers more interior space and bolder presence than most European competitors. Its American approach prioritizes commanding size and advanced technology over subtle refinement.</p>

      <h3>Is the CT5-V Blackwing really competitive with German performance sedans?</h3>
      <p>Absolutely. The Blackwing has proven competitive with BMW M5 and Mercedes-AMG E63 on track while offering a manual transmission option that neither European rival provides.</p>

      <h3>What occasions suit an Escalade rental?</h3>
      <p>The Escalade excels for nightlife, group transportation, and occasions requiring commanding presence. Its spacious interior accommodates groups while the bold styling ensures memorable arrivals.</p>

      <h3>Are Cadillac rentals practical for families?</h3>
      <p>The Escalade offers exceptional family capability with three-row seating, abundant cargo space, and rear entertainment systems. Its luxury appointments keep everyone comfortable during Miami explorations.</p>
    `,
  },
  tesla: {
    slug: "tesla",
    name: "Tesla",
    displayName: "Tesla",
    inventoryMatch: ["tesla"],
    metaTitle: "Tesla Rental Miami | Tesla Exotic Car Rentals – LUXX Miami",
    metaDescription: "Rent a Tesla in Miami. Experience electric innovation with our Model S Plaid, Model X, and sustainable luxury fleet. LUXX Miami offers premium Tesla rentals with delivery.",
    h1: "Tesla Rentals in Miami",
    introText: "Experience the future of automotive luxury with a Tesla rental in Miami. From the record-breaking Model S Plaid to the versatile Model X, Tesla combines sustainable innovation with exhilarating performance for an unforgettable Miami driving experience.",
    longFormContent: `
      <h2>About Tesla</h2>
      <p>Tesla has revolutionized the automotive industry since Elon Musk's 2004 vision to accelerate the world's transition to sustainable energy. The company proved that electric vehicles could be desirable, fast, and practical - shattering preconceptions about what sustainable transportation could be.</p>
      <p>The Model S Plaid holds the record as the quickest production car ever made, reaching 60 mph in under 2 seconds. Tesla's Supercharger network, industry-leading battery technology, and continuous over-the-air updates have made electric vehicle ownership not just viable but often preferable to traditional luxury cars.</p>

      <h2>Why Rent a Tesla in Miami</h2>
      <p>Tesla and Miami share a forward-thinking spirit. The city's progressive culture, environmental awareness, and appreciation for technology align perfectly with Tesla's vision. Miami's extensive Supercharger network makes electric driving seamless, while the year-round sunshine can charge vehicles equipped with solar features.</p>
      <p>Beyond practicality, Tesla's instant torque transforms Miami's stop-and-go traffic into an entertaining experience. The silent acceleration and advanced Autopilot features make navigating busy streets effortless, while the minimalist interiors feel appropriately futuristic for this modern city.</p>

      <h3>Model S Plaid: The Quickest Car in the World</h3>
      <p>The Model S Plaid's tri-motor powertrain produces over 1,000 horsepower, launching from 0-60 in under 2 seconds. This performance, combined with a 400+ mile range, creates the ultimate electric grand tourer.</p>

      <h3>Model X: Electric SUV Excellence</h3>
      <p>The Model X combines dramatic falcon-wing doors with genuine utility. Seating for up to seven, ample cargo space, and supercar-rivaling acceleration make it the world's most capable electric SUV.</p>

      <h2>Popular Tesla Models We Offer</h2>
      <p>Our Miami Tesla fleet represents the latest in electric vehicle technology, each maintained and charged for optimal performance.</p>

      <h3>Tesla Model S Plaid</h3>
      <p>The Model S Plaid delivers acceleration that defies belief - sub-2-second 0-60 times embarrass vehicles costing three times as much. The refreshed interior features a minimalist yoke steering wheel and gaming-capable infotainment system.</p>

      <h3>Tesla Model X Plaid</h3>
      <p>The Model X Plaid brings the same tri-motor performance to SUV packaging. The distinctive falcon-wing doors create theatrical entries, while the spacious interior accommodates families or groups in high-tech comfort.</p>

      <h3>Tesla Model 3 Performance</h3>
      <p>The Model 3 Performance offers Tesla's engaging driving dynamics in a more accessible package. Track-capable handling and instant torque make it surprisingly entertaining on Miami's varied roads.</p>

      <h2>Best Miami Routes for Your Tesla</h2>
      <p>The quiet, instant acceleration makes Tesla ideal for Miami's stop-and-go traffic. Every traffic light becomes an opportunity to experience guilt-free performance, while Autopilot reduces fatigue on congested routes.</p>

      <h3>Keys Road Trip</h3>
      <p>Tesla's expanding Supercharger network makes Key West road trips practical. Stop in Islamorada or Marathon to top up while enjoying ocean views, then continue your zero-emission adventure to America's southernmost point.</p>

      <h3>Premier Tesla Destinations</h3>
      <ul>
        <li><strong>Design District:</strong> Technology meets art in Miami's creative hub</li>
        <li><strong>Wynwood:</strong> Progressive culture appreciates sustainable luxury</li>
        <li><strong>Brickell:</strong> Tech-forward business district suits Tesla's image</li>
        <li><strong>Key West:</strong> Scenic road trip with Supercharger support</li>
        <li><strong>Everglades day trips:</strong> Silent driving enhances nature experiences</li>
      </ul>

      <h2>Rental Tips</h2>
      <ul>
        <li>Familiarize yourself with the touchscreen interface - it controls most vehicle functions</li>
        <li>The Tesla app allows climate control, charging status, and vehicle location monitoring</li>
        <li>Autopilot is a driver assistance feature - remain attentive at all times</li>
        <li>Regenerative braking allows one-pedal driving once you adapt to the feel</li>
      </ul>

      <h2>FAQ</h2>

      <h3>Where can I charge a Tesla in Miami?</h3>
      <p>Miami has extensive Supercharger coverage throughout the metro area and along major highways. Most luxury hotels also offer destination charging. We deliver your Tesla fully charged and provide charging guidance during orientation.</p>

      <h3>How does Tesla range work in real-world driving?</h3>
      <p>Real-world range varies based on driving style, climate control use, and speed. In Miami's warm climate, expect close to rated range. The Model S Plaid offers over 400 miles, more than sufficient for typical Miami use.</p>

      <h3>Is the Model S Plaid really faster than supercars?</h3>
      <p>Yes. The Model S Plaid's sub-2-second 0-60 time makes it quicker than virtually every production car ever made, regardless of price. The instant electric torque creates acceleration that must be experienced to be believed.</p>

      <h3>What makes Tesla's Autopilot unique?</h3>
      <p>Tesla's Autopilot offers advanced driver assistance including adaptive cruise control and lane centering. Full Self-Driving capability adds navigation on Autopilot and automatic lane changes. Always remain attentive - it's a driver assistance system, not autonomous driving.</p>
    `,
  },
}

const VALID_BRANDS = Object.keys(BRANDS)

export async function generateStaticParams() {
  return VALID_BRANDS.map((brand) => ({
    "brand-slug": brand,
  }))
}

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

const getBrandCars = cache(async (brandName: string, brandSlug: string, inventoryMatch: string[] = []) => {
  const matchTerms = Array.from(new Set([
    brandName,
    brandSlug,
    brandSlug.replace(/-/g, " "),
    ...inventoryMatch,
  ].filter(Boolean)))

  const cars = await db
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
      flipHorizontal: inventory.flipHorizontal,
      flipVertical: inventory.flipVertical,
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
    .orderBy(desc(inventory.pricePerDay))

  return cars.filter((car) => {
    const images = Array.isArray(car.images) ? car.images : []
    return images.length > 0
  })
})

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function CarBrandPage({ params }: BrandPageProps) {
  const { "brand-slug": brandSlug } = await params
  const brand = BRANDS[brandSlug]

  if (!brand) {
    notFound()
  }

  const seoSlug = `miami/${brandSlug}-rental`
  const existingSeoPage = await db
    .select({ id: seoPages.id, contentStatus: seoPages.contentStatus, isPublished: seoPages.isPublished })
    .from(seoPages)
    .where(eq(seoPages.slug, seoSlug))
    .limit(1)

  if (existingSeoPage.length > 0 && existingSeoPage[0].contentStatus !== 'pending') {
    permanentRedirect(`/${seoSlug}`)
  }

  const cars = await getBrandCars(brand.name, brand.slug, brand.inventoryMatch)

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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
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
                      flipHorizontal={car.flipHorizontal}
                      flipVertical={car.flipVertical}
                      priority={index < 3}
                    />
                  )
                })}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/cars-listing"
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
