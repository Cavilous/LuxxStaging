import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Eye, Calendar, Bed, Bath, MapPin } from "lucide-react"
import Image from "next/image"

interface VillaCardProps {
  id: string
  title: string
  neighborhood: string
  price: string
  image: string
  bedrooms: number
  bathrooms: number
  guests: number
  features: string[]
  badges?: string[]
  featured?: boolean
  isPriority?: boolean;
}

export function VillaCard({
  title,
  neighborhood,
  price,
  image,
  bedrooms,
  bathrooms,
  guests,
  features,
  badges = [],
  featured = false,
  isPriority = false,
}: VillaCardProps) {
  const imageUrl = image || "/placeholder.svg?height=300&width=400&query=luxury miami villa with pool"
  return (
    <div className="group relative bg-charcoal rounded-2xl overflow-hidden hover-lift border border-gold/20 min-w-[320px] snap-start">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={isPriority}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAX/2Q=="
          />

        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-2">
            {badges.map((badge) => (
              <Badge key={badge} className="bg-gold text-black font-semibold">
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-heading font-bold text-white mb-1">{title}</h3>
        {neighborhood && (
          <p className="text-gray-400 mb-4 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {neighborhood}
          </p>
        )}

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-heading font-black text-gold-bright">{price}</span>
          <span className="text-gray-400 ml-1">/ night</span>
        </div>

        {/* Key Info - Only show bedrooms and bathrooms if they exist */}
        {(bedrooms > 0 || bathrooms > 0) && (
          <div className="flex gap-4 mb-4">
            {bedrooms > 0 && (
              <div className="flex items-center text-gray-300">
                <Bed className="h-4 w-4 mr-2 text-gold" />
                <span className="text-sm">{bedrooms} BR</span>
              </div>
            )}
            {bathrooms > 0 && (
              <div className="flex items-center text-gray-300">
                <Bath className="h-4 w-4 mr-2 text-gold" />
                <span className="text-sm">{bathrooms} BA</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-gold hover:bg-gold-bright text-black font-semibold">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}