// API Service - Axios instance with interceptors
// This service handles all HTTP requests and automatically includes auth tokens

import axios from 'axios'
import API_CONFIG from '@/config/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY)

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return successful response as-is
    return response
  },
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem(API_CONFIG.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.USER_KEY)

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
