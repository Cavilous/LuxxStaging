"use client"

import { useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

interface TurnstileOptions {
  sitekey: string
  callback?: (token: string) => void
  'error-callback'?: () => void
  'expired-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact' | 'invisible'
  appearance?: 'always' | 'execute' | 'interaction-only'
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  className?: string
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

export function Turnstile({ 
  onVerify, 
  onError, 
  onExpire,
  theme = 'dark',
  size = 'normal',
  className = ''
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const scriptLoadedRef = useRef(false)

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) return

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: onVerify,
        'error-callback': onError,
        'expired-callback': onExpire,
        theme,
        size,
        appearance: 'always',
      })
    } catch (error) {
      console.error('Failed to render Turnstile widget:', error)
    }
  }, [onVerify, onError, onExpire, theme, size])

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      console.warn('Turnstile site key not configured')
      onVerify('dev-mode-skip')
      return
    }

    if (window.turnstile) {
      renderWidget()
      return
    }

    if (scriptLoadedRef.current) return
    scriptLoadedRef.current = true

    window.onTurnstileLoad = () => {
      renderWidget()
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
        }
        widgetIdRef.current = null
      }
    }
  }, [renderWidget, onVerify])

  if (!TURNSTILE_SITE_KEY) {
    return null
  }

  return (
    <div 
      ref={containerRef} 
      className={`turnstile-container ${className}`}
      data-theme={theme}
    />
  )
}

export function useTurnstileToken() {
  const tokenRef = useRef<string>('')

  const setToken = useCallback((token: string) => {
    tokenRef.current = token
  }, [])

  const getToken = useCallback(() => tokenRef.current, [])

  const clearToken = useCallback(() => {
    tokenRef.current = ''
  }, [])

  return { setToken, getToken, clearToken }
}
