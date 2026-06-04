import 'server-only'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { blockedIps, rateLimitLog } from '@/lib/db/schema'
import { eq, and, gte, sql } from 'drizzle-orm'
import crypto from 'crypto'

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || ''
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const DAILY_LIMIT_MAX_REQUESTS = 50

const rateLimitStore = new Map<string, { count: number; resetTime: number; dailyCount: number; dailyResetTime: number }>()

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIp) return cfConnectingIp
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIp) return realIp
  
  return '127.0.0.1'
}

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + (process.env.JWT_SECRET || 'salt')).digest('hex').substring(0, 16)
}

export async function verifyTurnstile(token: string, ip: string): Promise<{ success: boolean; error?: string }> {
  if (!TURNSTILE_SECRET) {
    console.warn('⚠️ Turnstile secret not configured - skipping verification')
    return { success: true }
  }

  if (!token) {
    return { success: false, error: 'CAPTCHA token required' }
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    })

    const result = await response.json()
    
    if (result.success) {
      return { success: true }
    } else {
      console.warn('❌ Turnstile verification failed:', result['error-codes'])
      return { success: false, error: 'CAPTCHA verification failed' }
    }
  } catch (error) {
    console.error('❌ Turnstile verification error:', error)
    return { success: false, error: 'CAPTCHA verification error' }
  }
}

export function checkRateLimit(ip: string, endpoint: string = 'default'): { allowed: boolean; retryAfter?: number } {
  const key = `${ip}:${endpoint}`
  const now = Date.now()
  const dayStart = new Date().setHours(0, 0, 0, 0)
  
  let record = rateLimitStore.get(key)
  
  if (!record) {
    record = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS, dailyCount: 0, dailyResetTime: dayStart + 24 * 60 * 60 * 1000 }
  }
  
  if (now > record.resetTime) {
    record.count = 0
    record.resetTime = now + RATE_LIMIT_WINDOW_MS
  }
  
  if (now > record.dailyResetTime) {
    record.dailyCount = 0
    record.dailyResetTime = dayStart + 24 * 60 * 60 * 1000
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) }
  }
  
  if (record.dailyCount >= DAILY_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((record.dailyResetTime - now) / 1000) }
  }
  
  record.count++
  record.dailyCount++
  rateLimitStore.set(key, record)
  
  return { allowed: true }
}

export function validateHoneypot(honeypotValue: string | undefined): boolean {
  return !honeypotValue || honeypotValue.trim() === ''
}

export function validateSubmissionTime(formLoadedAt: number | undefined): { valid: boolean; error?: string } {
  if (!formLoadedAt) {
    return { valid: true }
  }
  
  const submissionTime = Date.now()
  const elapsedSeconds = (submissionTime - formLoadedAt) / 1000
  
  if (elapsedSeconds < 3) {
    return { valid: false, error: 'Form submitted too quickly' }
  }
  
  if (elapsedSeconds > 30 * 60) {
    return { valid: false, error: 'Form session expired' }
  }
  
  return { valid: true }
}

export function detectSpamContent(text: string | undefined): { isSpam: boolean; reason?: string } {
  if (!text) return { isSpam: false }
  
  const urlRegex = /(https?:\/\/[^\s]+)/gi
  const urls = text.match(urlRegex) || []
  if (urls.length > 2) {
    return { isSpam: true, reason: 'Too many URLs in message' }
  }
  
  const spamPatterns = [
    /\b(viagra|cialis|casino|poker|crypto|bitcoin|nft|forex)\b/i,
    /\b(click here|buy now|limited time|act now|free money)\b/i,
    /(.)\1{10,}/,
    /<script|<iframe|javascript:/i,
  ]
  
  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      return { isSpam: true, reason: 'Spam content detected' }
    }
  }
  
  return { isSpam: false }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false
  
  const disposableDomains = [
    'tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com',
    '10minutemail.com', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (disposableDomains.includes(domain)) return false
  
  return true
}

export function validatePhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '')
  return digitsOnly.length >= 10 && digitsOnly.length <= 15
}

export async function isIpBlocked(ip: string): Promise<boolean> {
  try {
    const hashedIp = hashIp(ip)
    const blocked = await db.select()
      .from(blockedIps)
      .where(and(
        eq(blockedIps.ipHash, hashedIp),
        eq(blockedIps.isActive, true)
      ))
      .limit(1)
    
    return blocked.length > 0
  } catch (error) {
    console.error('Error checking blocked IP:', error)
    return false
  }
}

export async function blockIp(ip: string, reason: string, blockedBy?: string): Promise<void> {
  try {
    const hashedIp = hashIp(ip)
    await db.insert(blockedIps).values({
      ipHash: hashedIp,
      reason,
      blockedBy,
      isActive: true,
    }).onConflictDoUpdate({
      target: blockedIps.ipHash,
      set: {
        isActive: true,
        reason,
        blockedBy,
        updatedAt: new Date(),
      }
    })
  } catch (error) {
    console.error('Error blocking IP:', error)
  }
}

export async function logRateLimitHit(ip: string, endpoint: string): Promise<void> {
  try {
    const hashedIp = hashIp(ip)
    await db.insert(rateLimitLog).values({
      ipHash: hashedIp,
      endpoint,
    })
    
    const recentHits = await db.select({ count: sql<number>`count(*)` })
      .from(rateLimitLog)
      .where(and(
        eq(rateLimitLog.ipHash, hashedIp),
        gte(rateLimitLog.createdAt, new Date(Date.now() - 60 * 60 * 1000))
      ))
    
    if (recentHits[0]?.count >= 20) {
      await blockIp(ip, 'Automatic: Exceeded rate limit threshold', 'system')
    }
  } catch (error) {
    console.error('Error logging rate limit hit:', error)
  }
}

export interface SecurityCheckResult {
  passed: boolean
  error?: string
  statusCode?: number
}

export async function performSecurityChecks(
  request: NextRequest,
  body: {
    turnstileToken?: string
    honeypot?: string
    formLoadedAt?: number
    name?: string
    email?: string
    phone?: string
    message?: string
  },
  endpoint: string
): Promise<SecurityCheckResult> {
  const ip = getClientIp(request)
  
  if (await isIpBlocked(ip)) {
    return { passed: false, error: 'Access denied', statusCode: 403 }
  }
  
  const rateLimit = checkRateLimit(ip, endpoint)
  if (!rateLimit.allowed) {
    await logRateLimitHit(ip, endpoint)
    return { 
      passed: false, 
      error: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.`,
      statusCode: 429 
    }
  }
  
  const turnstileResult = await verifyTurnstile(body.turnstileToken || '', ip)
  if (!turnstileResult.success) {
    return { passed: false, error: turnstileResult.error, statusCode: 400 }
  }
  
  if (!validateHoneypot(body.honeypot)) {
    return { passed: false, error: 'Invalid submission', statusCode: 400 }
  }
  
  const timeCheck = validateSubmissionTime(body.formLoadedAt)
  if (!timeCheck.valid) {
    return { passed: false, error: timeCheck.error, statusCode: 400 }
  }
  
  if (body.email && !validateEmail(body.email)) {
    return { passed: false, error: 'Invalid email address', statusCode: 400 }
  }
  
  if (body.phone && !validatePhone(body.phone)) {
    return { passed: false, error: 'Invalid phone number', statusCode: 400 }
  }
  
  const spamCheck = detectSpamContent(body.message)
  if (spamCheck.isSpam) {
    return { passed: false, error: 'Message contains prohibited content', statusCode: 400 }
  }
  
  const nameSpamCheck = detectSpamContent(body.name)
  if (nameSpamCheck.isSpam) {
    return { passed: false, error: 'Invalid name', statusCode: 400 }
  }
  
  return { passed: true }
}
