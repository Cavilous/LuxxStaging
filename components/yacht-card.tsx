import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, Eye, Calendar } from "lucide-react"
import Image from "next/image"

interface YachtCardProps {
  id: string
  title: string
  subtitle: string
  price4h: string
  price6h?: string
  price8h?: string
  image: string
  guests: number
  crew: number
  marina: string
  specs: string[]
  badges?: string[]
  featured?: boolean
  isPriority?: boolean;
}

export function YachtCard({
  title,
  subtitle,
  price4h,
  price6h,
  price8h,
  image,
  guests,
  crew,
  marina,
  specs,
  badges = [],
  featured = false,
  isPriority = false,
}: YachtCardProps) {
  const imageUrl = image || "/placeholder.svg?height=300&width=400&query=luxury yacht on miami waters";
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
        <h3 className="text-xl font-heading font-bold text-white mb-3">{title}</h3>

        {/* Price - 4 hour default */}
        <div className="mb-4">
          <span className="text-2xl font-heading font-black text-gold-bright">{price4h}</span>
          <span className="text-gray-400 ml-1">/ 4 hours</span>
        </div>

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