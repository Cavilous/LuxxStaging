import { InventoryCard } from "./inventory-card"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InventoryRowProps {
  id?: string
  title: string
  description?: string
  items: Array<{
    id: string
    type: "car" | "yacht" | "villa" | "jet"
    title: string
    subtitle: string
    price: string
    priceUnit: string
    image: string
    lqImage?: string | null
    specs: string[]
    badges?: string[]
    featured?: boolean
    focalPoint?: string
    flipHorizontal?: boolean
    flipVertical?: boolean
  }>
  viewAllHref?: string
  priorityCount?: number
  showSectionDivider?: boolean
}

export function InventoryRow({ id, title, description, items, viewAllHref, priorityCount = 4, showSectionDivider = true }: InventoryRowProps) {
  const isEmpty = items.length === 0

  return (
    <section id={id} className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="mb-8 relative">
          <div className="flex items-center mb-4">
            <div
              className="w-2 h-16 bg-gradient-to-b from-[#ECAC36] to-[#e6c766] mr-6 shadow-lg"
              style={{ transform: "skewY(-8deg)" }}
            />
            <div>
              <div className="flex items-baseline gap-4 mb-2">
                <h2 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">{title}</h2>
                {viewAllHref && !isEmpty && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="cut-corner text-[#ECAC36] hover:text-black hover:bg-[#ECAC36] font-medium transition-all duration-[280ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] magnetic-hover"
                  >
                    <a href={viewAllHref} className="flex items-center gap-1">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              {description && (
                <p className="text-gray-400 text-sm md:text-base max-w-2xl">{description}</p>
              )}
            </div>
          </div>
        </div>

        {isEmpty ? (
          <div className="relative overflow-hidden">
            <div className="cut-corner bg-gradient-to-br from-black/40 via-black/60 to-black/40 border border-[#ECAC36]/20 p-12 md:p-16 text-center backdrop-blur-sm">
              <div className="max-w-md mx-auto">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ECAC36]/10 border border-[#ECAC36]/30">
                  <Sparkles className="w-8 h-8 text-[#ECAC36]" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-3">
                  Curating Exceptional Vehicles
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Our team is carefully selecting the finest luxury {title.toLowerCase()} for your experience. 
                  Check back soon to discover extraordinary options.
                </p>
              </div>
              <div
                className="absolute top-0 right-0 w-32 h-32 bg-[#ECAC36]/5 blur-3xl"
                style={{ transform: "translate(30%, -30%)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-32 h-32 bg-[#ECAC36]/5 blur-3xl"
                style={{ transform: "translate(-30%, 30%)" }}
              />
            </div>
          </div>
        ) : (
          <div className="fleet-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {items.map((item, index) => (
              <InventoryCard 
                key={item.id} 
                {...item} 
                priority={index < priorityCount}
              />
            ))}
          </div>
        )}

        {showSectionDivider && (
          <div className="mt-20 flex justify-center" aria-hidden="true">
            <div
              className="w-48 h-1 bg-gradient-to-r from-transparent via-[#ECAC36] to-transparent relative"
              style={{ transform: "skewX(-6deg)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ECAC36]/30 to-transparent blur-sm" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
