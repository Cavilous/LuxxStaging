"use client"

import { usePathname } from 'next/navigation'
import { useCallback, ReactNode } from 'react'

interface TrackedPhoneLinkProps {
  phoneNumber: string
  children: ReactNode
  className?: string
  ariaLabel?: string
  suppressHydrationWarning?: boolean
}

export function TrackedPhoneLink({
  phoneNumber,
  children,
  className,
  ariaLabel,
  suppressHydrationWarning,
}: TrackedPhoneLinkProps) {
  const pathname = usePathname()

  const handleClick = useCallback(async () => {
    try {
      await fetch('/api/analytics/track-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          pageUrl: window.location.href,
          pageRoute: pathname,
        }),
        keepalive: true,
      })
    } catch (error) {
      console.error('Failed to track call event:', error)
    }
  }, [phoneNumber, pathname])

  const formattedNumber = phoneNumber.startsWith('+')
    ? phoneNumber
    : `+${phoneNumber.replace(/\D/g, '')}`

  return (
    <a
      href={`tel:${formattedNumber}`}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      {children}
    </a>
  )
}
