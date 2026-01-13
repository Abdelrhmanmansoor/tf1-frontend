import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import API_CONFIG from '@/config/api'
import { ApiError } from '@/types/auth'

// Create axios instance with secure defaults
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // CRITICAL: Required for cross-origin cookie handling
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-Token',
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

function getCsrfFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split(';')
    .map((c) => c.trim().split('='))
    .find(([name]) => name === 'XSRF-TOKEN')
  return match ? decodeURIComponent(match[1]) : null
}

// Request Interceptor - Attach CSRF token to unsafe methods
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const method = (config.method || 'get').toLowerCase()
      const unsafe = ['post', 'put', 'patch', 'delete'].includes(method)
      
      // Attach CSRF token for unsafe methods if not already set
      if (unsafe && !config.headers['X-CSRF-Token']) {
        const csrf = getCsrfFromCookie()
        if (csrf) {
          config.headers['X-CSRF-Token'] = csrf
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
    if (newCsrfToken && typeof document !== 'undefined') {
      // The server sets the cookie, but we can also store it for immediate use
      // This helps when the next request happens before the cookie is readable
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
      
      try {
        // Fetch a fresh CSRF token
        const csrfResponse = await api.get('/auth/csrf-token', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        const newToken = 
          csrfResponse.data?.data?.csrfToken ||
          csrfResponse.data?.data?.token ||
          csrfResponse.data?.csrfToken ||
          csrfResponse.data?.token ||
          (csrfResponse.headers as any)?.['x-csrf-token'] ||
          getCsrfFromCookie()
        
        if (newToken && originalRequest.headers) {
          originalRequest.headers['X-CSRF-Token'] = newToken
          return api(originalRequest)
        }
      } catch (csrfError) {
        console.warn('[API] Failed to refresh CSRF token:', csrfError)
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

export default api

