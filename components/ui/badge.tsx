import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        'admin-gold':
          'bg-[#ECAC36] text-black border-[#ECAC36] font-semibold',
        'admin-gold-outline':
          'bg-transparent text-[#ECAC36] border-[#ECAC36] hover:bg-[#ECAC36]/10',
        'admin-category':
          'bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600',
        'admin-issue-red':
          'bg-red-900/60 text-red-200 border-red-700/50 hover:bg-red-800/60',
        'admin-issue-yellow':
          'bg-yellow-900/60 text-yellow-200 border-yellow-700/50 hover:bg-yellow-800/60',
        'admin-issue-blue':
          'bg-blue-900/60 text-blue-200 border-blue-700/50 hover:bg-blue-800/60',
        'admin-success':
          'bg-green-900/60 text-green-200 border-green-700/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
