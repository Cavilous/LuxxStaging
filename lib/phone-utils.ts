// Phone number formatting and validation utilities

/**
 * Format phone number to (XXX) XXX-XXXX format
 * @param value - Raw phone input
 * @returns Formatted phone string
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '')
  
  // Limit to 10 digits
  const limited = numbers.slice(0, 10)
  
  // Format based on length
  if (limited.length === 0) return ''
  if (limited.length <= 3) return limited
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`
}

/**
 * Validate phone number (must be 10 digits)
 * @param phone - Formatted or raw phone number
 * @returns true if valid 10-digit phone
 */
export function validatePhoneNumber(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '')
  return numbers.length === 10
}

/**
 * Get raw phone number (digits only)
 * @param formatted - Formatted phone string
 * @returns Digits-only string
 */
export function getRawPhoneNumber(formatted: string): string {
  return formatted.replace(/\D/g, '')
}
