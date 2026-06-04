import Image from "next/image"
import { ParallaxWrapper } from "./parallax-wrapper"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden hero-mask">
      <ParallaxWrapper className="absolute inset-0 z-0 parallax-element">
        <div className="relative w-full h-[120%]">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC09371.jpg-O5HNBgv5aKL6h2eBmJofJr3ZkGM5Nd.jpeg"
            alt="Luxury exotic car in Miami"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
            quality={75}
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/70 to-black/40"></div>

        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </ParallaxWrapper>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-20 md:py-24">
        <div className="w-full max-w-6xl page-reveal overflow-hidden">
          <div className="mb-4 sm:mb-6 md:mb-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl">
              <span className="block mb-2">LUXURY</span>
              <span className="relative inline-block angular-highlight animate-slide-up">REDEFINED</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-8 sm:mb-10 md:mb-14 leading-relaxed max-w-2xl drop-shadow-lg animate-fade-in-delay">
            Exotic Cars, Yachts, Villas, and Jet Charters Await Your Command
          </p>

          {/* Mobile: Compact horizontal buttons */}
          <div className="flex sm:hidden flex-wrap gap-2 mb-6">
            <a 
              href="/cars"
              className="group flex items-center gap-2 bg-black/50 backdrop-blur-md border border-[#ECAC36]/40 hover:border-[#ECAC36] px-4 py-2.5 rounded-full transition-all duration-300"
            >
              <span className="text-sm font-semibold text-white">Exotic Cars</span>
              <span className="text-[#ECAC36] text-sm">→</span>
            </a>
            <a 
              href="/yachts"
              className="group flex items-center gap-2 bg-black/50 backdrop-blur-md border border-[#ECAC36]/40 hover:border-[#ECAC36] px-4 py-2.5 rounded-full transition-all duration-300"
            >
              <span className="text-sm font-semibold text-white">Luxury Yachts</span>
              <span className="text-[#ECAC36] text-sm">→</span>
            </a>
            <a 
              href="/houses"
              className="group flex items-center gap-2 bg-black/50 backdrop-blur-md border border-[#ECAC36]/40 hover:border-[#ECAC36] px-4 py-2.5 rounded-full transition-all duration-300"
            >
              <span className="text-sm font-semibold text-white">Premium Villas</span>
              <span className="text-[#ECAC36] text-sm">→</span>
            </a>
          </div>

          {/* Desktop: Full category cards */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-5 md:gap-6 mb-8 sm:mb-10">
            <a 
              href="/cars"
              className="group relative bg-black/40 backdrop-blur-md border-2 border-[#ECAC36]/30 hover:border-[#ECAC36]/60 p-8 cut-corner hover-lift transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ECAC36]/0 via-[#ECAC36]/0 to-[#ECAC36]/10 group-hover:from-[#ECAC36]/10 group-hover:via-[#ECAC36]/5 transition-all duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-heading font-black text-white mb-2">Exotic Cars</h2>
                <p className="text-base text-gray-300 mb-4">Supercars & luxury vehicles</p>
                <div className="flex items-center gap-2 text-[#ECAC36] font-semibold group-hover:gap-3 transition-all">
                  <span>Browse Fleet</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </a>

            <a 
              href="/yachts"
              className="group relative bg-black/40 backdrop-blur-md border-2 border-[#ECAC36]/30 hover:border-[#ECAC36]/60 p-8 cut-corner hover-lift transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ECAC36]/0 via-[#ECAC36]/0 to-[#ECAC36]/10 group-hover:from-[#ECAC36]/10 group-hover:via-[#ECAC36]/5 transition-all duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-heading font-black text-white mb-2">Luxury Yachts</h2>
                <p className="text-base text-gray-300 mb-4">Premium watercraft experiences</p>
                <div className="flex items-center gap-2 text-[#ECAC36] font-semibold group-hover:gap-3 transition-all">
                  <span>View Yachts</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </a>

            <a 
              href="/houses"
              className="group relative bg-black/40 backdrop-blur-md border-2 border-[#ECAC36]/30 hover:border-[#ECAC36]/60 p-8 cut-corner hover-lift transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ECAC36]/0 via-[#ECAC36]/0 to-[#ECAC36]/10 group-hover:from-[#ECAC36]/10 group-hover:via-[#ECAC36]/5 transition-all duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-heading font-black text-white mb-2">Premium Villas</h2>
                <p className="text-base text-gray-300 mb-4">Waterfront estates & properties</p>
                <div className="flex items-center gap-2 text-[#ECAC36] font-semibold group-hover:gap-3 transition-all">
                  <span>Explore Villas</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-sm sm:text-base mb-8 sm:mb-10">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-[#ECAC36] font-bold text-lg sm:text-xl">200+</span>
              <span>Exotic Cars</span>
            </div>
            <span className="text-[#ECAC36]/40">•</span>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-[#ECAC36] font-bold text-lg sm:text-xl">50+</span>
              <span>Luxury Yachts</span>
            </div>
            <span className="text-[#ECAC36]/40">•</span>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-[#ECAC36] font-bold text-lg sm:text-xl">100+</span>
              <span>Premium Villas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <div
            className="w-8 h-12 border-2 border-[#ECAC36] flex justify-center items-start pt-2"
            style={{
              clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
            }}
          >
            <div
              className="w-1 h-4 bg-[#ECAC36] animate-bounce"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}
