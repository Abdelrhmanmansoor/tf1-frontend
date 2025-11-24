import API_CONFIG from '@/config/api'

/**
 * Get authentication token from localStorage
 * @returns JWT token or null if not found
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(API_CONFIG.TOKEN_KEY)
}

/**
 * Save authentication token to localStorage
 * @param token - JWT token to save
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token)
  }
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY)
  }
}
