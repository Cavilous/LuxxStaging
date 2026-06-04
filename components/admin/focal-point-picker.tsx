"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Target, FlipHorizontal, FlipVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FocalPointPickerProps {
  imageUrl: string
  initialFocalPoint?: string
  initialFlipHorizontal?: boolean
  initialFlipVertical?: boolean
  onChange: (focalPoint: string) => void
  onFlipChange?: (flipHorizontal: boolean, flipVertical: boolean) => void
}

export function FocalPointPicker({ 
  imageUrl, 
  initialFocalPoint = "50% 50%", 
  initialFlipHorizontal = false,
  initialFlipVertical = false,
  onChange,
  onFlipChange 
}: FocalPointPickerProps) {
  const [focalPoint, setFocalPoint] = useState(initialFocalPoint)
  const [flipH, setFlipH] = useState(initialFlipHorizontal)
  const [flipV, setFlipV] = useState(initialFlipVertical)
  const imageRef = useRef<HTMLDivElement>(null)

  const parseFocalPoint = (fp: string) => {
    const [x, y] = fp.split(" ").map(s => parseFloat(s))
    return { 
      x: Number.isFinite(x) ? x : 50, 
      y: Number.isFinite(y) ? y : 50 
    }
  }

  const { x: fpX, y: fpY } = parseFocalPoint(focalPoint)

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const roundedX = Math.round(x)
    const roundedY = Math.round(y)
    const newFocalPoint = `${roundedX}% ${roundedY}%`
    
    setFocalPoint(newFocalPoint)
    onChange(newFocalPoint)
  }

  const handleFlipHorizontal = () => {
    const newFlipH = !flipH
    setFlipH(newFlipH)
    onFlipChange?.(newFlipH, flipV)
  }

  const handleFlipVertical = () => {
    const newFlipV = !flipV
    setFlipV(newFlipV)
    onFlipChange?.(flipH, newFlipV)
  }

  const getFlipTransform = () => {
    const transforms: string[] = []
    if (flipH) transforms.push('scaleX(-1)')
    if (flipV) transforms.push('scaleY(-1)')
    return transforms.length > 0 ? transforms.join(' ') : undefined
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Target className="inline-block w-4 h-4 mr-2" />
          Card Image Focal Point & Orientation
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Click on the image to set focus point. Use flip buttons to mirror the cover image horizontally or vertically.
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={flipH ? "default" : "outline"}
          size="sm"
          onClick={handleFlipHorizontal}
          className={flipH 
            ? "bg-[#ECAC36] text-black hover:bg-[#ECAC36]/90" 
            : "border-gray-600 text-gray-300 hover:bg-gray-800"
          }
        >
          <FlipHorizontal className="w-4 h-4 mr-2" />
          Flip Horizontal {flipH && "✓"}
        </Button>
        <Button
          type="button"
          variant={flipV ? "default" : "outline"}
          size="sm"
          onClick={handleFlipVertical}
          className={flipV 
            ? "bg-[#ECAC36] text-black hover:bg-[#ECAC36]/90" 
            : "border-gray-600 text-gray-300 hover:bg-gray-800"
          }
        >
          <FlipVertical className="w-4 h-4 mr-2" />
          Flip Vertical {flipV && "✓"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-2 font-medium">Click to Set Focus Point</p>
          <div
            ref={imageRef}
            className="relative aspect-[3/2] bg-black rounded-lg overflow-hidden cursor-crosshair border-2 border-gray-700 hover:border-[#ECAC36] transition-colors"
            onClick={handleImageClick}
          >
            <Image
              src={imageUrl}
              alt="Focal point selection"
              fill
              className="object-cover"
              style={{ transform: getFlipTransform() }}
              unoptimized
            />
            <div
              className="absolute w-8 h-8 pointer-events-none"
              style={{
                left: `${fpX}%`,
                top: `${fpY}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 border-2 border-[#ECAC36] rounded-full shadow-lg shadow-[#ECAC36]/50" />
                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-[#ECAC36]/60 -translate-x-1/2" />
                <div className="absolute top-1/2 left-0 h-0.5 w-full bg-[#ECAC36]/60 -translate-y-1/2" />
                <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-[#ECAC36] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-[#ECAC36]/70" />
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Current: <span className="text-[#ECAC36] font-mono">{focalPoint}</span>
            {(flipH || flipV) && (
              <span className="ml-2 text-blue-400">
                Flipped: {flipH && "H"}{flipV && "V"}
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2 font-medium">Card Preview</p>
          <div className="aspect-[3/2] bg-black rounded-lg overflow-hidden border-2 border-gray-700">
            <Image
              src={imageUrl}
              alt="Card preview"
              width={600}
              height={400}
              className="w-full h-full object-cover"
              style={{ objectPosition: focalPoint, transform: getFlipTransform() }}
              unoptimized
            />
          </div>
          <div className="mt-2 text-xs text-green-400">
            ✓ This is how it appears in listing cards
          </div>
        </div>
      </div>

      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-3">
        <p className="text-xs text-gray-400">
          <strong className="text-gray-300">Pro tip:</strong> Click on the most important part of the image (e.g., the front of the car, yacht deck, or villa entrance) to ensure it stays visible when cropped to card aspect ratio.
        </p>
      </div>
    </div>
  )
}
