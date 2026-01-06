// Authentication Service
// This service handles all authentication-related API calls
// Refactored for Type Safety & Security

import api from './api'
import API_CONFIG from '@/config/api'
import { jwtDecode } from 'jwt-decode'
import { User, LoginResponse, UserRole } from '@/types/auth'

interface RegisterData {
  email: string
  password: string
  role: UserRole
  firstName?: string
  lastName?: string
  phone?: string
  // Club-specific required fields
  organizationName?: string
  organizationType?: 'club' | 'academy' | 'federation' | 'sports-center'
  establishedDate?: string
  businessRegistrationNumber?: string
  // National Address fields
  buildingNumber?: string
  additionalNumber?: string
  zipCode?: string
  nationalAddressVerified?: boolean
  verifiedAt?: string
  verificationAttempted?: boolean
  // Admin roles specific fields
  department?: string
  position?: string
}

class AuthService {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with registration response
   */
  async register(userData: RegisterData): Promise<any> {
    try {
      const payload = {
        ...userData,
        role: userData.role === 'applicant' ? ('player' as UserRole) : userData.role,
      }
      const response = await api.post('/auth/register', payload)
      return response.data
    } catch (error) {
      const err = this.handleError(error)
      throw err
    }
  }

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   * @returns Promise with login response
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const endpoints = ['/auth/login', '/auth/signin', '/users/login']
    for (const endpoint of endpoints) {
      try {
        const response = await api.post(endpoint, { email, password })
        const { accessToken, user } = response.data
        this.saveToken(accessToken)
        this.saveUser(user)
        return response.data
      } catch (error: any) {
        const status = error.response?.status
        if (status !== 404) {
          throw this.handleError(error)
        }
      }
    }
    throw new Error('Login endpoints not available')
  }

  /**
   * Logout user - Clear local storage, cookies, and redirect
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.USER_KEY)
      // Clear matches related keys
      localStorage.removeItem('matches_token')
      localStorage.removeItem('matches_user')
      
      // Clear cookie - Ensure correct path and domain handling
      document.cookie = `${API_CONFIG.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      document.cookie = `matches_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      document.cookie = `sportx_ui_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      
      // Use window.location only if we need a hard refresh, otherwise router.push should be used by the caller
      // For safety and complete cleanup, a hard refresh is acceptable here until we implement a better flow
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
   * @returns true if user has a valid token
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY)
    if (!token) return false

    // Check if token is expired using jwt-decode
    try {
      const decoded: any = jwtDecode(token)
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp && decoded.exp < currentTime) {
        // Token expired - clear storage
        this.clearSession()
        return false
      }
      return true
    } catch (e) {
      // Invalid token format
      console.warn('[AUTH] Invalid token format during check', e)
      this.clearSession() // Clear invalid token to prevent repeated errors
      return false
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

      const response = await api.get('/auth/profile')
      if (response.data?.user) {
        // Update user data with fresh data from backend
        this.saveUser(response.data.user)
        return true
      }
      return false
    } catch (error: any) {
      const status = error.response?.status || error.status

      // Only clear session on explicit 401 (unauthorized)
      if (status === 401) {
        this.clearSession()
        return false
      }

      // For actual network errors (no response/status), throw to let caller decide
      if ((!error.response && !error.status) || error.code === 'ECONNABORTED' || error.message?.includes('Network')) {
        throw new Error('Network error during validation')
      }
      
      // For other errors (like 404, 500), return false
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
    try {
      return userJson ? JSON.parse(userJson) : null
    } catch {
      return null;
    }
  }

  /**
   * Get user role
   * @returns User role or null
   */
  getUserRole(): UserRole | null {
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
      const uiRole = localStorage.getItem('sportx_ui_role')
      if (uiRole === 'applicant') {
        document.cookie = `sportx_ui_role=applicant; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
      }
    }
  }

  /**
   * Handle API errors
   * @private
   */
  private handleError(error: any): any {
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
