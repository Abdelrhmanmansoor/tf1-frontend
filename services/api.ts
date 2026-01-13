import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import API_CONFIG from '@/config/api'
import { ApiError } from '@/types/auth'

// Create axios instance with secure defaults
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // CRITICAL: Required for cross-origin cookie handling
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types for queueing failed requests
interface RetryQueueItem {
  resolve: (value?: any) => void
  reject: (error?: any) => void
  config: InternalAxiosRequestConfig
}

// Global state for auth handling to avoid race conditions
let isRefreshing = false
let failedQueue: RetryQueueItem[] = []
let isRedirecting = false

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      if (prom.config.headers && token) {
        prom.config.headers.Authorization = `Bearer ${token}`
      }
      prom.resolve(api(prom.config))
    }
  })
  failedQueue = []
}

// CSRF Token storage in memory (works with cross-origin)
let csrfTokenCache: string | null = null

function getCsrfToken(): string | null {
  // First check memory cache
  if (csrfTokenCache) {
    return csrfTokenCache
  }
  
  // Then try localStorage (persists across page refreshes)
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('csrf_token')
    if (stored) {
      csrfTokenCache = stored
      return stored
    }
  }
  
  // Finally try cookie (may not work in cross-origin)
  if (typeof document !== 'undefined') {
    const match = document.cookie
      .split(';')
      .map((c) => c.trim().split('='))
      .find(([name]) => name === 'XSRF-TOKEN')
    if (match && match[1]) {
      return decodeURIComponent(match[1])
    }
  }
  
  return null
}

function setCsrfToken(token: string): void {
  csrfTokenCache = token
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('csrf_token', token)
  }
}

// Flag to prevent concurrent CSRF token fetches
let isFetchingCsrf = false
let csrfFetchPromise: Promise<string | null> | null = null

// Helper function to fetch CSRF token (with concurrency protection)
async function fetchCsrfToken(): Promise<string | null> {
  // If already fetching, wait for that promise
  if (isFetchingCsrf && csrfFetchPromise) {
    console.log('[CSRF] Already fetching token, waiting...')
    return csrfFetchPromise
  }

  isFetchingCsrf = true
  csrfFetchPromise = (async () => {
    try {
      console.log('[CSRF] 🔄 Fetching new CSRF token from server...')
      const csrfResponse = await axios.get(`${API_CONFIG.BASE_URL}/auth/csrf-token`, {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      // Try multiple possible paths for the token
      const token = 
        csrfResponse.data?.data?.csrfToken ||
        csrfResponse.data?.data?.token ||
        csrfResponse.data?.csrfToken ||
        csrfResponse.data?.token
      
      if (token && typeof token === 'string') {
        setCsrfToken(token)
        console.log('[CSRF] ✅ Token fetched and cached:', token.substring(0, 20) + '...')
        console.log('[CSRF] Token will be attached to all POST/PUT/PATCH/DELETE requests')
        return token
      } else {
        console.error('[CSRF] ❌ Invalid token received from server:', csrfResponse.data)
        return null
      }
    } catch (error: any) {
      console.error('[CSRF] ❌ Failed to fetch CSRF token:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data
      })
      return null
    } finally {
      isFetchingCsrf = false
      csrfFetchPromise = null
    }
  })()

  return csrfFetchPromise
}

// Helper to get access token from cookie
function getAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    // Check both cookie names for compatibility
    if ((name === 'accessToken' || name === 'sportx_access_token') && value) {
      return decodeURIComponent(value)
    }
  }
  return null
}

// Request Interceptor - Attach Authorization header and CSRF token
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      // CRITICAL: Attach Authorization Bearer token to ALL requests (except login/register)
      const isAuthEndpoint = config.url?.includes('/auth/login') || 
                            config.url?.includes('/auth/register') ||
                            config.url?.includes('/auth/csrf-token')
      
      if (!isAuthEndpoint) {
        const accessToken = getAccessTokenFromCookie()
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
          console.log(`[AUTH] ✓ Authorization header attached to ${config.method?.toUpperCase()} ${config.url}`)
        } else {
          // Only log warning for protected endpoints
          if (!config.url?.includes('/auth/')) {
            console.warn(`[AUTH] ⚠️  No access token found for ${config.method?.toUpperCase()} ${config.url}`)
          }
        }
      }
      
      const method = (config.method || 'get').toLowerCase()
      const unsafe = ['post', 'put', 'patch', 'delete'].includes(method)
      
      // Attach CSRF token for unsafe methods
      if (unsafe) {
        // Skip CSRF for the csrf-token endpoint itself
        if (config.url?.includes('/csrf-token')) {
          return config
        }

        // Check if token already set in headers
        if (config.headers['X-CSRF-Token'] || config.headers['x-csrf-token']) {
          console.log('[CSRF] ✓ Token already attached to request')
          return config
        }
        
        let csrf = getCsrfToken()
        
        // If no CSRF token, fetch it BEFORE sending the request (BLOCKING)
        if (!csrf) {
          console.warn('[CSRF] ⚠️  No cached token found, fetching new one...')
          csrf = await fetchCsrfToken()
        }
        
        if (csrf) {
          config.headers['X-CSRF-Token'] = csrf
          console.log(`[CSRF] ✓ Token attached to ${method.toUpperCase()} ${config.url}:`, csrf.substring(0, 20) + '...')
        } else {
          console.error(`[CSRF] ❌ CRITICAL: No CSRF token available for ${method.toUpperCase()} ${config.url}`)
          console.error('[CSRF] Request may fail with 403 - CSRF_TOKEN_MISSING')
          // Still allow the request to go through - backend will reject it with proper error
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - Handle errors and update CSRF token
api.interceptors.response.use(
  (response) => {
    // Update CSRF token from response headers if present
    const newCsrfToken = response.headers?.['x-csrf-token']
    if (newCsrfToken) {
      setCsrfToken(newCsrfToken)
    }
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _csrfRetry?: boolean }
    const url = originalRequest?.url || ''

    // Handle CSRF token errors (403 with CSRF codes)
    const errorCode = (error.response?.data as any)?.code
    const isCsrfError = error.response?.status === 403 && 
      ['CSRF_TOKEN_INVALID', 'CSRF_TOKEN_EXPIRED', 'CSRF_TOKEN_MISSING', 'CSRF_ORIGIN_INVALID'].includes(errorCode)
    
    if (isCsrfError && !originalRequest._csrfRetry) {
      originalRequest._csrfRetry = true
      console.log(`[CSRF] 🔄 Error detected (${errorCode}), fetching new token and retrying...`)
      
      try {
        // Clear old token completely
        csrfTokenCache = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('csrf_token')
        }
        console.log('[CSRF] Old token cleared from cache')
        
        // Fetch a fresh CSRF token (BLOCKING - wait for it)
        const newToken = await fetchCsrfToken()
        
        if (newToken && originalRequest.headers) {
          originalRequest.headers['X-CSRF-Token'] = newToken
          // Also try lowercase variant
          originalRequest.headers['x-csrf-token'] = newToken
          console.log('[CSRF] ✓ Retrying request with fresh token')
          return api(originalRequest)
        } else {
          console.error('[CSRF] ❌ Failed to get new token, cannot retry')
        }
      } catch (csrfError) {
        console.error('[CSRF] ❌ Error during token refresh:', csrfError)
      }
    }

    // Prevent infinite loops for auth endpoints
    if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname

        // Auth pages list
        const authPages = [
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-email'
        ]

        const isAuthPage = authPages.some(page => currentPath.startsWith(page))

        if (!isAuthPage && !isRedirecting) {

          isRedirecting = true
          localStorage.removeItem(API_CONFIG.USER_KEY)

          // Redirect
          const redirectUrl = encodeURIComponent(currentPath)
          const isMatches = currentPath.startsWith('/matches')
          const loginPath = isMatches ? '/matches/login' : '/login'
          window.location.href = `${loginPath}?redirect=${redirectUrl}&reason=session_expired`
        }
      }
    }

    // Standard error format
    const apiError: ApiError = {
      message: (error.response?.data as any)?.message || error.message || 'Unknown Error',
      status: error.response?.status,
      code: (error.response?.data as any)?.code
    }

    return Promise.reject(apiError)
  }
)

// Export helper to initialize CSRF token (call this on app startup)
export const initializeCsrfToken = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    console.log('[CSRF] Skipping initialization (server-side)')
    return
  }
  
  console.log('[CSRF] 🚀 Initializing CSRF protection...')
  
  // Check if we already have a valid token
  const existing = getCsrfToken()
  if (existing) {
    console.log('[CSRF] ✓ Using cached token:', existing.substring(0, 20) + '...')
    return
  }
  
  // Fetch fresh token
  console.log('[CSRF] No cached token found, fetching from server...')
  const token = await fetchCsrfToken()
  
  if (token) {
    console.log('[CSRF] ✅ Initialization complete - Ready for secure requests')
  } else {
    console.error('[CSRF] ⚠️  Initialization failed - Requests may fail')
    console.error('[CSRF] Please check your network connection and backend server')
  }
}

// Export helper to check if CSRF is ready
export const isCsrfReady = (): boolean => {
  if (typeof window === 'undefined') return false
  const token = getCsrfToken()
  return !!token
}

// Export helper to manually refresh CSRF token (useful for debugging or after long inactivity)
export const refreshCsrfToken = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false
  
  console.log('[CSRF] 🔄 Manually refreshing CSRF token...')
  
  // Clear old token
  csrfTokenCache = null
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('csrf_token')
  }
  
  const token = await fetchCsrfToken()
  return !!token
}

export default api
