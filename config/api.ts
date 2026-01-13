// API Configuration for SportX Platform
// This file contains all API-related configuration

// CRITICAL FIX: Ensure BASE_URL is never undefined
function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  const defaultUrl = 'https://tf1-backend.onrender.com/api/v1'
  
  // Check if env variable is set
  if (!envUrl) {
    console.warn('[API_CONFIG] NEXT_PUBLIC_API_URL is not set, using default:', defaultUrl)
    
    // In development, throw error to catch the issue early
    if (process.env.NODE_ENV === 'development') {
      console.error('[API_CONFIG] Please add NEXT_PUBLIC_API_URL to your .env.local file')
      console.error('[API_CONFIG] Example: NEXT_PUBLIC_API_URL=https://tf1-backend.onrender.com/api/v1')
    }
  }
  
  const baseUrl = envUrl || defaultUrl
  
  // Validate URL format
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    console.error('[API_CONFIG] Invalid BASE_URL format:', baseUrl)
    throw new Error(`Invalid API BASE_URL: ${baseUrl}. Must start with http:// or https://`)
  }
  
  console.log('[API_CONFIG] Using BASE_URL:', baseUrl)
  return baseUrl
}

const API_CONFIG = {
  // Production API Base URL - can be overridden with NEXT_PUBLIC_API_URL env variable
  BASE_URL: getBaseUrl(),

  // Request timeout (30 seconds - Render free tier can be slow)
  TIMEOUT: 30000,

  // LocalStorage keys for token and user data
  TOKEN_KEY: 'sportx_access_token',
  USER_KEY: 'sportx_user_data',
} as const

export default API_CONFIG
