import type { Metadata } from "next"
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us - Luxx Miami | Luxury Rentals",
  description: "Get in touch with Luxx Miami for luxury car rentals, yacht charters, villa stays, and private jet services. Available 24/7 in Miami.",
  openGraph: {
    title: "Contact Luxx Miami - Premium Luxury Rentals",
    description: "Reach out to Miami's premier luxury rental service. Available 24/7 for all your luxury lifestyle needs.",
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ECAC36]/5 to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
                Get in <span className="text-[#ECAC36]">Touch</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                We're here 24/7 to help you experience Miami's finest luxury rentals
              </p>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {/* Phone */}
              <div className="cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-6 border border-[#ECAC36]/20 hover:border-[#ECAC36]/40 transition-all duration-300 hover-lift group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ECAC36]/10 flex items-center justify-center mb-4 group-hover:bg-[#ECAC36]/20 transition-colors">
                    <Phone className="w-8 h-8 text-[#ECAC36]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                  <p className="text-gray-400 text-sm mb-4">Available 24/7</p>
                  <a 
                    href="tel:+13056055899" 
                    className="text-[#ECAC36] hover:text-[#e6c766] font-semibold transition-colors"
                  >
                    (305) 605-5899
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-6 border border-[#ECAC36]/20 hover:border-[#ECAC36]/40 transition-all duration-300 hover-lift group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ECAC36]/10 flex items-center justify-center mb-4 group-hover:bg-[#ECAC36]/20 transition-colors">
                    <MessageCircle className="w-8 h-8 text-[#ECAC36]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
                  <p className="text-gray-400 text-sm mb-4">Quick responses</p>
                  <a 
                    href="https://wa.me/13056055899" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#ECAC36] hover:text-[#e6c766] font-semibold transition-colors"
                  >
                    Chat Now
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-6 border border-[#ECAC36]/20 hover:border-[#ECAC36]/40 transition-all duration-300 hover-lift group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ECAC36]/10 flex items-center justify-center mb-4 group-hover:bg-[#ECAC36]/20 transition-colors">
                    <Mail className="w-8 h-8 text-[#ECAC36]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                  <p className="text-gray-400 text-sm mb-4">For inquiries</p>
                  <a 
                    href="mailto:luxxmiamigroup@gmail.com" 
                    className="text-[#ECAC36] hover:text-[#e6c766] font-semibold transition-colors break-all"
                  >
                    luxxmiamigroup@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-6 border border-[#ECAC36]/20 hover:border-[#ECAC36]/40 transition-all duration-300 hover-lift group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ECAC36]/10 flex items-center justify-center mb-4 group-hover:bg-[#ECAC36]/20 transition-colors">
                    <MapPin className="w-8 h-8 text-[#ECAC36]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                  <p className="text-gray-400 text-sm mb-4">Based in</p>
                  <p className="text-[#ECAC36] font-semibold">
                    Brickell, Miami FL
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-8 border border-[#ECAC36]/20">
                <h2 className="text-2xl font-heading font-bold text-white mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>

              {/* Additional Info */}
              <div className="space-y-8">
                {/* Hours */}
                <div className="cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-6 border border-[#ECAC36]/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#ECAC36]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#ECAC36]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Operating Hours</h3>
                      <div className="space-y-2 text-gray-400">
                        <p className="flex justify-between">
                          <span>Phone Support:</span>
                          <span className="text-[#ECAC36]">24/7</span>
                        </p>
                        <p className="flex justify-between">
                          <span>WhatsApp:</span>
                          <span className="text-[#ECAC36]">24/7</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Email Response:</span>
                          <span className="text-[#ECAC36]">Within 2 hours</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-6 border border-[#ECAC36]/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a 
                      href="/cars" 
                      className="block p-3 cut-corner bg-[#ECAC36]/5 hover:bg-[#ECAC36]/10 transition-colors text-gray-300 hover:text-[#ECAC36]"
                    >
                      Browse Exotic Cars →
                    </a>
                    <a 
                      href="/yachts" 
                      className="block p-3 cut-corner bg-[#ECAC36]/5 hover:bg-[#ECAC36]/10 transition-colors text-gray-300 hover:text-[#ECAC36]"
                    >
                      View Yacht Charters →
                    </a>
                    <a 
                      href="/houses" 
                      className="block p-3 cut-corner bg-[#ECAC36]/5 hover:bg-[#ECAC36]/10 transition-colors text-gray-300 hover:text-[#ECAC36]"
                    >
                      Explore Luxury Villas →
                    </a>
                    <a 
                      href="/buy-sell" 
                      className="block p-3 cut-corner bg-[#ECAC36]/5 hover:bg-[#ECAC36]/10 transition-colors text-gray-300 hover:text-[#ECAC36]"
                    >
                      Investment Opportunities →
                    </a>
                  </div>
                </div>

                {/* Why Choose Us */}
                <div className="cut-corner bg-gradient-to-br from-black/60 via-black/40 to-black/60 p-6 border border-[#ECAC36]/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Why Choose Luxx Miami?</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-[#ECAC36] mt-1">◆</span>
                      <span>Largest luxury fleet in Miami</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ECAC36] mt-1">◆</span>
                      <span>White-glove concierge service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ECAC36] mt-1">◆</span>
                      <span>Instant booking & delivery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#ECAC36] mt-1">◆</span>
                      <span>Trusted by discerning clients</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 border-t border-[#ECAC36]/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to Experience <span className="text-[#ECAC36]">Luxury?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Don't wait. Contact us now and let us create an unforgettable Miami experience for you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                asChild
                className="cut-corner bg-gradient-to-r from-[#ECAC36] to-[#e6c766] hover:from-[#e6c766] hover:to-[#ECAC36] text-black font-semibold px-8 py-6 text-lg"
              >
                <a href="tel:+13056055899">
                  <Phone className="mr-2 h-5 w-5" />
                  Call (305) 605-5899
                </a>
              </Button>
              <Button 
                asChild
                variant="outline"
                className="cut-corner border-[#ECAC36] text-[#ECAC36] hover:bg-[#ECAC36] hover:text-black px-8 py-6 text-lg bg-transparent"
              >
                <a href="https://wa.me/13056055899" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </section>
    </main>
  )
}
