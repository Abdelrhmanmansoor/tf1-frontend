// Authentication Service
// This service handles all authentication-related API calls

import api from './api'
import API_CONFIG from '@/config/api'

// Types
interface RegisterData {
  email: string
  password: string
  role: 'player' | 'coach' | 'club' | 'specialist' | 'administrator' | 'age-group-supervisor' | 'sports-director' | 'executive-director' | 'secretary'
  firstName?: string
  lastName?: string
  phone?: string
  // Club-specific required fields
  organizationName?: string
  organizationType?: 'club' | 'academy' | 'federation' | 'sports-center'
  establishedDate?: string
  businessRegistrationNumber?: string
  // Admin roles specific fields
  department?: string
  position?: string
}

interface LoginResponse {
  accessToken: string
  user: User
  requiresVerification?: boolean
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'player' | 'coach' | 'club' | 'specialist' | 'administrator' | 'age-group-supervisor' | 'sports-director' | 'executive-director' | 'secretary'
  isEmailVerified: boolean
}

interface ApiError {
  message: string
  code?: string
  errors?: any
  status?: number
}

class AuthService {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with registration response
   */
  async register(userData: RegisterData): Promise<any> {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   * @returns Promise with login response
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { accessToken, user } = response.data

      // Save token and user data to localStorage
      this.saveToken(accessToken)
      this.saveUser(user)

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Logout user - Clear local storage, cookies, and redirect
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.USER_KEY)
      // Clear cookie
      document.cookie = `${API_CONFIG.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      window.location.href = '/login'
    }
  }

  /**
   * Verify email with token from email link
   * @param token - Verification token from email
   * @returns Promise with verification response
   */
  async verifyEmail(token: string): Promise<any> {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`)

      console.log('[AUTH-SERVICE] Raw backend response:', response.data)

      // Backend returns: { success, message, user, accessToken, alreadyVerified? }
      const { accessToken, user, success } = response.data

      // Save token and user data after verification (if provided)
      if (accessToken && user) {
        this.saveToken(accessToken)
        this.saveUser(user)
      }

      // Return the full response including success flag
      return {
        success: success !== false, // Default to true if not specified
        ...response.data,
      }
    } catch (error) {
      console.error('[AUTH-SERVICE] Verify email error:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Resend verification email
   * @param email - User email
   * @returns Promise with response
   */
  async resendVerification(email: string): Promise<any> {
    try {
      const response = await api.post('/auth/resend-verification', { email })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Send forgot password email
   * @param email - User email
   * @returns Promise with response
   */
  async forgotPassword(email: string): Promise<any> {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Reset password with token from email
   * @param token - Reset token from email
   * @param newPassword - New password
   * @returns Promise with response
   */
  async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password: newPassword,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Check if user is logged in
   * @returns true if user has a token
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY)
    if (!token) return false
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < currentTime) {
        // Token expired - clear storage
        this.clearSession()
        return false
      }
      return true
    } catch {
      return !!token
    }
  }

  /**
   * Validate token with backend
   * @returns Promise with validation result
   * @throws Error on network issues (caller should handle gracefully)
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem(API_CONFIG.TOKEN_KEY)
      if (!token) return false
      
      const response = await api.get('/auth/me')
      if (response.data?.user) {
        // Update user data with fresh data from backend
        this.saveUser(response.data.user)
        return true
      }
      return false
    } catch (error: any) {
      // Only clear session on explicit 401 (unauthorized)
      if (error.response?.status === 401) {
        this.clearSession()
        return false
      }
      // For network errors, timeout, etc. - throw to let caller decide
      if (!error.response || error.code === 'ECONNABORTED' || error.message?.includes('Network')) {
        throw new Error('Network error during validation')
      }
      return false
    }
  }

  /**
   * Clear session data without redirect
   * @private
   */
  private clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.USER_KEY)
      document.cookie = `${API_CONFIG.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  }

  /**
   * Get stored user data
   * @returns User object or null
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null

    const userJson = localStorage.getItem(API_CONFIG.USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  }

  /**
   * Get user role
   * @returns User role or null
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser()
    return user ? user.role : null
  }

  /**
   * Save token to localStorage and cookie
   * @private
   */
  private saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_CONFIG.TOKEN_KEY, token)
      // Also save to cookie for middleware access
      document.cookie = `${API_CONFIG.TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
    }
  }

  /**
   * Save user data to localStorage
   * @private
   */
  private saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(user))
    }
  }

  /**
   * Handle API errors
   * @private
   */
  private handleError(error: any): ApiError {
    console.error('[AUTH-SERVICE] Error details:', error)
    
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data.message || 'An error occurred',
        code: error.response.data.code,
        errors: error.response.data.errors,
        status: error.response.status,
      }
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      // Timeout error
      return {
        message: 'Request timeout. The server is taking too long to respond. Please try again.',
        code: 'TIMEOUT_ERROR',
      }
    } else if (error.request) {
      // Request made but no response
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com'
      console.error('[AUTH-SERVICE] Backend URL:', baseUrl)
      return {
        message: `Cannot connect to server. Please check your internet connection and try again. (Backend: ${baseUrl})`,
        code: 'NETWORK_ERROR',
      }
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      }
    }
  }
}

// Export singleton instance
export default new AuthService()
