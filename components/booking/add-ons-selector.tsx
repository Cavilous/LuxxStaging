'use client'

import React from 'react'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export interface AddOnItem {
  id: string
  name: string
  description: string | null
  category: string
  priceType: string
  basePrice: string | null
  pricePerUnit: string | null
  minimumQuantity: number | null
  maximumQuantity: number | null
  unit: string | null
}

export interface SelectedAddOn extends AddOnItem {
  quantity: number
}

interface AddOnsSelectorProps {
  addOns: AddOnItem[]
  selectedAddOns: SelectedAddOn[]
  onAddOnsChange: (addOns: SelectedAddOn[]) => void
  category: string
}

export function AddOnsSelector({
  addOns,
  selectedAddOns,
  onAddOnsChange,
  category
}: AddOnsSelectorProps) {
  const formatPrice = (addOn: AddOnItem) => {
    if (addOn.priceType === 'custom') {
      return 'Custom pricing'
    }
    
    const price = addOn.basePrice || addOn.pricePerUnit
    if (!price) return 'Price on request'
    
    const amount = parseFloat(price)
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)

    if (addOn.priceType === 'flat') {
      return formatted
    } else if (addOn.priceType === 'per_hour') {
      return `${formatted}/hr`
    } else if (addOn.priceType === 'per_day') {
      return `${formatted}/day`
    } else if (addOn.priceType === 'per_unit' && addOn.unit) {
      return `${formatted}/${addOn.unit}`
    }
    
    return formatted
  }

  const getQuantity = (addOnId: string): number => {
    const selected = selectedAddOns.find(a => a.id === addOnId)
    return selected?.quantity || 0
  }

  const handleQuantityChange = (addOn: AddOnItem, delta: number) => {
    const currentQuantity = getQuantity(addOn.id)
    const newQuantity = Math.max(0, currentQuantity + delta)
    
    const minQty = addOn.minimumQuantity || 1
    const maxQty = addOn.maximumQuantity || 999

    if (newQuantity === 0) {
      onAddOnsChange(selectedAddOns.filter(a => a.id !== addOn.id))
    } else if (newQuantity >= minQty && newQuantity <= maxQty) {
      const existingIndex = selectedAddOns.findIndex(a => a.id === addOn.id)
      
      if (existingIndex >= 0) {
        const updated = [...selectedAddOns]
        updated[existingIndex] = { ...addOn, quantity: newQuantity }
        onAddOnsChange(updated)
      } else {
        onAddOnsChange([...selectedAddOns, { ...addOn, quantity: newQuantity }])
      }
    }
  }

  const handleToggleAddOn = (addOn: AddOnItem) => {
    const isSelected = getQuantity(addOn.id) > 0
    
    if (isSelected) {
      onAddOnsChange(selectedAddOns.filter(a => a.id !== addOn.id))
    } else {
      const minQty = addOn.minimumQuantity || 1
      onAddOnsChange([...selectedAddOns, { ...addOn, quantity: minQty }])
    }
  }

  if (addOns.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Enhance Your Experience</h3>
        <span className="text-sm text-gray-400">{selectedAddOns.length} selected</span>
      </div>

      <div className="grid gap-3">
        {addOns.map((addOn) => {
          const quantity = getQuantity(addOn.id)
          const isSelected = quantity > 0
          const isCustomPricing = addOn.priceType === 'custom'
          const requiresQuantity = addOn.priceType !== 'flat' && addOn.priceType !== 'custom'

          return (
            <Card
              key={addOn.id}
              className={`
                p-4 transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? 'bg-[#ECAC36]/10 border-[#ECAC36] shadow-lg' 
                  : 'bg-[#1A1A1A] border-[#333333] hover:border-[#ECAC36]/50'
                }
              `}
              onClick={() => {
                if (isCustomPricing || !requiresQuantity) {
                  handleToggleAddOn(addOn)
                }
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white">{addOn.name}</h4>
                  {addOn.description && (
                    <p className="text-sm text-gray-400 mt-1">{addOn.description}</p>
                  )}
                  <p className="text-sm text-[#ECAC36] mt-1">{formatPrice(addOn)}</p>
                  {addOn.minimumQuantity && addOn.minimumQuantity > 1 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Minimum: {addOn.minimumQuantity} {addOn.unit || 'units'}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {!isCustomPricing && requiresQuantity ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(addOn, -1)}
                        disabled={quantity === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center text-white font-medium">
                        {quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(addOn, 1)}
                        disabled={addOn.maximumQuantity !== null && quantity >= addOn.maximumQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleAddOn(addOn)}
                    >
                      {isSelected ? 'Selected' : 'Add'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedAddOns.length > 0 && (
        <div className="p-4 bg-[#ECAC36]/5 border border-[#ECAC36]/30 rounded-lg">
          <p className="text-sm text-gray-300">
            💡 <span className="text-white font-medium">Pro tip:</span> Bundle your rental with add-ons from other categories to unlock additional discounts!
          </p>
        </div>
      )}
    </div>
  )
}
