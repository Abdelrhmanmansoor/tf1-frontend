import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import API_CONFIG from '@/config/api'
import { ApiError } from '@/types/auth'

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
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

// Safer token parsing function (Fallback if jwt-decode isn't used here to avoid circular dep)
function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload)
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp && payload.exp < currentTime
  } catch (error) {
    return true // Assume expired if invalid
  }
}

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Try matches_token first for matches routes, then fall back to main token
      const url = config.url || ''
      const isMatchesRoute = url.includes('/matches')
      
      let token = localStorage.getItem(API_CONFIG.TOKEN_KEY)
      const matchesToken = localStorage.getItem('matches_token')
      
      // For matches routes, prefer matches_token if available
      if (isMatchesRoute && matchesToken) {
        token = matchesToken
      }

      if (token) {
        if (isTokenExpired(token)) {
          // Token is expired, let the response interceptor handle the 401 or refresh logic
          // But we can proactively clear if we know it's dead and we don't have refresh token logic
          // For now, allow it to fail to 401 so we handle cleanup centrally
        }
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const url = originalRequest?.url || ''

    // Prevent infinite loops
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

          // If we had a refresh token flow, we would do it here.
          // Since we don't seem to have one in the current architecture, we logout.

          isRedirecting = true

          // Clear session
          localStorage.removeItem(API_CONFIG.TOKEN_KEY)
          localStorage.removeItem(API_CONFIG.USER_KEY)
          document.cookie = `${API_CONFIG.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`

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

