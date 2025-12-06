import axios from 'axios'
import API_CONFIG from '@/config/api'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent multiple redirects
let isRedirecting = false

// Retry count for transient errors
const MAX_RETRIES = 1
const retryCount: Record<string, number> = {}

// Check if token is expired locally
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp && payload.exp < currentTime
  } catch {
    return false
  }
}

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(API_CONFIG.TOKEN_KEY)
      if (token) {
        // Check if token is expired before making request
        if (isTokenExpired(token)) {
          // Clear expired token
          localStorage.removeItem(API_CONFIG.TOKEN_KEY)
          localStorage.removeItem(API_CONFIG.USER_KEY)
          document.cookie = `${API_CONFIG.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          
          // Redirect if on dashboard
          const currentPath = window.location.pathname
          if (currentPath.startsWith('/dashboard') && !isRedirecting) {
            isRedirecting = true
            const redirectUrl = encodeURIComponent(currentPath)
            window.location.href = `/login?redirect=${redirectUrl}&reason=token_expired`
          }
          return Promise.reject(new Error('Token expired'))
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

api.interceptors.response.use(
  (response) => {
    // Reset retry count on success
    const url = response.config.url || ''
    if (retryCount[url]) {
      delete retryCount[url]
    }
    return response
  },
  (error) => {
    const url = error.config?.url || ''
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      
      // List of auth pages that should not trigger redirect
      const authPages = [
        '/login', 
        '/register', 
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/verify-email-notice',
        '/leader/login'
      ]
      
      const isAuthPage = authPages.some(page => currentPath.includes(page))
      
      // Skip redirect for /auth/me endpoint - let caller handle it
      const isAuthCheck = url.includes('/auth/me')

      // Only redirect if:
      // 1. Not on auth page
      // 2. Not already redirecting
      // 3. On a dashboard page
      // 4. Not a background auth check
      if (!isAuthPage && !isRedirecting && currentPath.startsWith('/dashboard') && !isAuthCheck) {
        console.warn('[API] 401 Unauthorized - Session expired or invalid')
        isRedirecting = true
        
        // Clear session data
        localStorage.removeItem(API_CONFIG.TOKEN_KEY)
        localStorage.removeItem(API_CONFIG.USER_KEY)
        document.cookie = `${API_CONFIG.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        
        // Redirect with context
        const redirectUrl = encodeURIComponent(currentPath)
        
        // Use setTimeout to prevent blocking
        setTimeout(() => {
          window.location.href = `/login?redirect=${redirectUrl}&reason=session_expired`
        }, 100)
      }
    }
    
    // Handle network errors with retry for non-auth endpoints
    if (!error.response && error.code !== 'ECONNABORTED') {
      // Network error - could be transient
      const currentRetry = retryCount[url] || 0
      if (currentRetry < MAX_RETRIES && !url.includes('/auth/')) {
        retryCount[url] = currentRetry + 1
        console.warn(`[API] Network error, retrying (${currentRetry + 1}/${MAX_RETRIES}):`, url)
        return new Promise(resolve => setTimeout(resolve, 1000)).then(() => api(error.config))
      }
    }

    return Promise.reject(error)
  }
)

// Reset redirect flag when page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    isRedirecting = false
  })
}

export default api
