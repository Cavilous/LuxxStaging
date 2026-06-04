'use client'

import React from 'react'
import { Check, Tag, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface PricingBreakdown {
  itemName: string
  basePrice: number
  duration?: number
  durationUnit?: string
  discount?: number
}

interface AddOnBreakdown {
  name: string
  quantity: number
  unitPrice: number
  total: number
}

interface PricingDisplayProps {
  baseTotal: number
  durationDiscount: number
  durationDiscountPercent: number
  bundleDiscount: number
  bundleDiscountPercent: number
  addOnsTotal: number
  totalDiscount: number
  finalTotal: number
  breakdown: PricingBreakdown[]
  addOnsBreakdown: AddOnBreakdown[]
}

export function PricingDisplay({
  baseTotal,
  durationDiscount,
  durationDiscountPercent,
  bundleDiscount,
  bundleDiscountPercent,
  addOnsTotal,
  totalDiscount,
  finalTotal,
  breakdown,
  addOnsBreakdown
}: PricingDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#333333] p-8 sticky top-4">
      <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>

      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-white">
              <span className="font-medium">{item.itemName}</span>
              <span>{formatCurrency(item.basePrice)}</span>
            </div>
            {item.duration && item.durationUnit && (
              <div className="text-xs text-gray-400 pl-2">
                {item.duration} {item.durationUnit}
              </div>
            )}
            {item.discount && item.discount > 0 && (
              <div className="flex items-center gap-1 text-xs text-green-400 pl-2">
                <Tag className="h-3 w-3" />
                Duration discount: -{formatCurrency(item.discount)}
              </div>
            )}
          </div>
        ))}

        {addOnsBreakdown.length > 0 && (
          <>
            <Separator className="bg-[#333333] my-5" />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Package className="h-4 w-4" />
                <span className="font-medium">Add-Ons</span>
              </div>
              {addOnsBreakdown.map((addon, index) => (
                <div key={index} className="flex justify-between text-sm text-gray-300 pl-6">
                  <span>
                    {addon.name} {addon.quantity > 1 && `(×${addon.quantity})`}
                  </span>
                  <span>{formatCurrency(addon.total)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Separator className="bg-[#333333] my-5" />

      <div className="space-y-3">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>{formatCurrency(baseTotal)}</span>
        </div>

        {durationDiscount > 0 && (
          <div className="flex justify-between text-green-400">
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              <span>Duration Discount ({durationDiscountPercent.toFixed(0)}%)</span>
            </div>
            <span>-{formatCurrency(durationDiscount)}</span>
          </div>
        )}

        {bundleDiscount > 0 && (
          <div className="flex justify-between text-green-400">
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              <span>Bundle Discount ({bundleDiscountPercent.toFixed(0)}%)</span>
            </div>
            <span>-{formatCurrency(bundleDiscount)}</span>
          </div>
        )}

        {addOnsTotal > 0 && (
          <div className="flex justify-between text-gray-300">
            <span>Add-Ons Total</span>
            <span>+{formatCurrency(addOnsTotal)}</span>
          </div>
        )}
      </div>

      <Separator className="bg-[#333333] my-5" />

      <div className="flex justify-between text-xl font-bold text-white">
        <span>Total</span>
        <span className="text-[#ECAC36]">{formatCurrency(finalTotal)}</span>
      </div>

      {totalDiscount > 0 && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-400 text-center">
            🎉 You're saving {formatCurrency(totalDiscount)}!
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-[#ECAC36]/10 border border-[#ECAC36]/30 rounded-lg">
        <p className="text-xs text-gray-300 text-center leading-relaxed">
          <span className="text-white font-medium">Payment Schedule:</span><br />
          50% deposit required at booking<br />
          Balance due 7 days before reservation
        </p>
      </div>

      <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Pricing and availability are subject to final confirmation. Rates may vary based on seasonal demand and specific requirements.
        </p>
      </div>
    </Card>
  )
}
