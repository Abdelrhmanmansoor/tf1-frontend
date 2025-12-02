import axios from 'axios'
import API_CONFIG from '@/config/api'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(API_CONFIG.TOKEN_KEY)
      if (token) {
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
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
      const isAuthPage = currentPath.includes('/login') || 
                         currentPath.includes('/register') || 
                         currentPath.includes('/forgot-password') ||
                         currentPath.includes('/reset-password') ||
                         currentPath.includes('/verify-email')

      if (!isAuthPage && typeof window !== 'undefined') {
        console.warn('[API] 401 Unauthorized - Session expired')
        localStorage.removeItem(API_CONFIG.TOKEN_KEY)
        localStorage.removeItem(API_CONFIG.USER_KEY)
        
        const redirectUrl = encodeURIComponent(currentPath)
        window.location.href = `/login?redirect=${redirectUrl}&expired=true`
      }
    }

    return Promise.reject(error)
  }
)

export default api
