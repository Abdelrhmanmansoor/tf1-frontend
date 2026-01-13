// Authentication Service
// This service handles all authentication-related API calls
// Refactored for Type Safety & Security with robust CSRF handling

import api from './api'
import API_CONFIG from '@/config/api'
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

/**
 * CSRF Token Manager
 * Handles fetching, caching, and refreshing CSRF tokens
 */
class CSRFManager {
  private cachedToken: string | null = null
  private tokenFetchPromise: Promise<string | null> | null = null
  private lastFetchTime: number = 0
  private readonly TOKEN_TTL_MS = 50 * 60 * 1000 // 50 minutes (less than server's 1 hour)

  /**
   * Get a fresh CSRF token, fetching from server if needed
   * Uses caching to avoid unnecessary network requests
   */
  async getToken(forceRefresh = false): Promise<string | null> {
    const now = Date.now()
    
    // Return cached token if still valid and not forcing refresh
    if (!forceRefresh && this.cachedToken && (now - this.lastFetchTime) < this.TOKEN_TTL_MS) {
      return this.cachedToken
    }

    // If a fetch is already in progress, wait for it
    if (this.tokenFetchPromise) {
      return this.tokenFetchPromise
    }

    // Start a new fetch
    this.tokenFetchPromise = this.fetchToken()
    
    try {
      const token = await this.tokenFetchPromise
      return token
    } finally {
      this.tokenFetchPromise = null
    }
  }

  private async fetchToken(): Promise<string | null> {
    try {
      console.log('[CSRF] Fetching new token from server...')
      const response = await api.get('/auth/csrf-token', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      const token = 
        response.data?.data?.csrfToken ||
        response.data?.data?.token ||
        response.data?.csrfToken ||
        response.data?.token

      if (token) {
        console.log('[CSRF] Token obtained successfully:', token.substring(0, 15) + '...')
        this.cachedToken = token
        this.lastFetchTime = Date.now()
        
        // Also save to localStorage for persistence
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('csrf_token', token)
        }
      } else {
        console.warn('[CSRF] No token found in response!')
      }

      return token || null
    } catch (error) {
      console.warn('[CSRF] Failed to fetch token:', error)
      
      // Try localStorage as fallback
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('csrf_token')
        if (stored) {
          this.cachedToken = stored
          return stored
        }
      }
      
      return null
    }
  }

  /**
   * Get CSRF token from cookie
   */
  getTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'XSRF-TOKEN' && value) {
        return decodeURIComponent(value)
      }
    }
    return null
  }

  /**
   * Update cached token (called after receiving new token in response)
   */
  updateToken(token: string): void {
    if (token) {
      this.cachedToken = token
      this.lastFetchTime = Date.now()
    }
  }

  /**
   * Clear cached token (called on logout or errors)
   */
  clearToken(): void {
    this.cachedToken = null
    this.lastFetchTime = 0
  }
}

const csrfManager = new CSRFManager()

class AuthService {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with registration response
   */
  async register(userData: RegisterData): Promise<any> {
    try {
      // Ensure required fields are present
      if (!userData.email || !userData.password || !userData.role) {
        throw new Error('Missing required fields: email, password, and role are required')
      }
      
      // For applicant and job-publisher roles, ensure firstName and lastName are present
      if (['applicant', 'job-publisher'].includes(userData.role)) {
        if (!userData.firstName || !userData.lastName) {
          throw new Error('First name and last name are required for this role')
        }
      }
      
      // Get fresh CSRF token (force refresh to avoid stale token issues)
      const csrfToken = await csrfManager.getToken(true)
      
      const headers: Record<string, string> = {}
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }
      
      const response = await api.post('/auth/register', userData, {
        headers: Object.keys(headers).length > 0 ? headers : undefined,
      })
      
      // Update CSRF token from response if present
      const newToken = (response.headers as any)?.['x-csrf-token']
      if (newToken) {
        csrfManager.updateToken(newToken)
      }
      
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
    try {
      // Always get a FRESH token before login (force refresh)
      console.log('[AUTH] Starting login, fetching CSRF token...')
      const csrfToken = await csrfManager.getToken(true)
      console.log('[AUTH] CSRF token for login:', csrfToken ? csrfToken.substring(0, 10) + '...' : 'NULL')
      
      if (!csrfToken) {
        console.error('[AUTH] WARNING: No CSRF token available for login!')
      }
      
      const response = await api.post('/auth/login', { email, password }, {
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      })
      
      const { user, accessToken, refreshToken } = response.data

      if (!user) {
        throw new Error('Invalid response from server')
      }

      // Update CSRF token from response
      const newToken = (response.headers as any)?.['x-csrf-token']
      if (newToken) {
        csrfManager.updateToken(newToken)
      }

      // CRITICAL: Set cookies client-side to ensure middleware can read them
      // AND wait a tiny bit to ensure they're written before any redirect happens
      if (typeof document !== 'undefined' && accessToken) {
        const isProduction = window.location.protocol === 'https:'
        const secure = isProduction ? '; Secure' : ''
        const sameSite = isProduction ? '; SameSite=Strict' : '; SameSite=Lax'
        
        const maxAge = 15 * 60 // 15 minutes in seconds
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${maxAge}${secure}${sameSite}`
        document.cookie = `sportx_access_token=${accessToken}; path=/; max-age=${maxAge}${secure}${sameSite}`
        
        if (refreshToken) {
          const refreshMaxAge = 7 * 24 * 60 * 60 // 7 days in seconds
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${refreshMaxAge}${secure}${sameSite}`
        }
        
        console.log('[AUTH] ✅ Cookies set client-side:', {
          accessToken: accessToken.substring(0, 20) + '...',
          cookieNames: ['accessToken', 'sportx_access_token'],
          cookiesNow: document.cookie.split(';').map(c => c.trim().split('=')[0]).join(', ')
        })
      }

      this.saveUser(user)
      
      // Small delay to ensure cookies are fully written before redirect
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return response.data
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  /**
   * Logout user - Clear local storage, cookies, and redirect
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_CONFIG.USER_KEY)
      // Clear matches related keys
      localStorage.removeItem('matches_token')
      localStorage.removeItem('matches_user')
      
      // Clear CSRF cache
      csrfManager.clearToken()
      
      // Attempt server-side logout to clear HttpOnly cookies
      const performLogout = async () => {
        try {
          const csrfToken = await csrfManager.getToken(true)

          await api.post('/auth/logout', undefined, {
            headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
          })
        } catch (logoutError) {
          console.warn('Server logout failed, client cleanup only', logoutError)
        }
      }

      performLogout()
      // Clear all auth-related cookies (both names for compatibility)
      document.cookie = `accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      document.cookie = `refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
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
      const response = await api.post('/auth/verify-email', { token })
      if (response.data?.success) return response.data
      const alt = await api.get('/auth/verify-email', { params: { token } })
      return alt.data
    } catch (error) {
      try {
        const alt = await api.get('/auth/verify-email', { params: { token } })
        return alt.data
      } catch (err2) {
        throw this.handleError(err2)
      }
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
   * Get current user profile
   * @returns Promise with user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/me')
      const u = response.data.user
      if (u?.avatar) {
        const origin = API_CONFIG.BASE_URL.replace(/\/api\/v\d+$/, '')
        if (!/^https?:\/\//.test(u.avatar)) {
          u.avatar = (u.avatar.startsWith('/') ? origin + u.avatar : origin + '/' + u.avatar)
        }
      }
      return u
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Save token to local storage and cookie
   * @param token - JWT access token
   */
  /**
   * Save user data to local storage
   * @param user - User object
   */
  saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      const u = { ...user } as any
      if (u?.avatar) {
        const origin = API_CONFIG.BASE_URL.replace(/\/api\/v\d+$/, '')
        if (!/^https?:\/\//.test(u.avatar)) {
          u.avatar = (u.avatar.startsWith('/') ? origin + u.avatar : origin + '/' + u.avatar)
        }
      }
      localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(u))
    }
  }

  /**
   * Validate token with backend
   * @returns Promise<boolean>
   */
  async validateToken(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) {
        return false
      }
      await this.getProfile()
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Request password reset (Forgot Password)
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
   * Reset password with token
   * @param token - Reset token
   * @param password - New password
   * @returns Promise with response
   */
  async resetPassword(token: string, password: string): Promise<any> {
    try {
      const response = await api.post('/auth/reset-password', { token, password })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ==================== OTP VERIFICATION METHODS ====================

  /**
   * Send OTP for phone/email verification
   * @param phone - Phone number in international format (e.g., +966XXXXXXXXX)
   * @param type - OTP type: 'registration', 'password-reset', 'phone-verification', 'login'
   * @param channel - Delivery channel: 'sms', 'whatsapp', 'email'
   * @param email - Email address (optional, for email channel)
   * @returns Promise with send result
   */
  async sendOTP(phone?: string, type: string = 'registration', channel: string = 'sms', email?: string): Promise<any> {
    try {
      const csrfToken = await csrfManager.getToken(true)

      const response = await api.post('/auth/send-otp', 
        { phone, email, type, channel },
        { headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined }
      )
      
      // Update token from response
      const newToken = (response.headers as any)?.['x-csrf-token']
      if (newToken) csrfManager.updateToken(newToken)
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Verify OTP code
   * @param phone - Phone number that received the OTP
   * @param otp - OTP code entered by user
   * @param type - OTP type: 'registration', 'password-reset', etc.
   * @param email - Email address (optional)
   * @returns Promise with verification result
   */
  async verifyOTP(phone: string | undefined, otp: string, type: string = 'registration', email?: string): Promise<any> {
    try {
      const csrfToken = await csrfManager.getToken(true)

      const response = await api.post('/auth/verify-otp',
        { phone, email, otp, type },
        { headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined }
      )
      
      // Update token from response
      const newToken = (response.headers as any)?.['x-csrf-token']
      if (newToken) csrfManager.updateToken(newToken)
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Request password reset via phone OTP
   * @param phone - Phone number in international format
   * @param channel - 'sms' or 'whatsapp'
   * @returns Promise with response
   */
  async forgotPasswordOTP(phone: string, channel: string = 'sms'): Promise<any> {
    try {
      const csrfToken = await csrfManager.getToken(true)

      const response = await api.post('/auth/forgot-password-otp',
        { phone, channel },
        { headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined }
      )
      
      // Update token from response
      const newToken = (response.headers as any)?.['x-csrf-token']
      if (newToken) csrfManager.updateToken(newToken)
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Reset password using phone OTP
   * @param phone - Phone number
   * @param otp - OTP code
   * @param newPassword - New password
   * @returns Promise with response
   */
  async resetPasswordOTP(phone: string, otp: string, newPassword: string): Promise<any> {
    try {
      const csrfToken = await csrfManager.getToken(true)

      const response = await api.post('/auth/reset-password-otp',
        { phone, otp, newPassword },
        { headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined }
      )
      
      // Update token from response
      const newToken = (response.headers as any)?.['x-csrf-token']
      if (newToken) csrfManager.updateToken(newToken)
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors consistently
   * @param error - Axios error object
   * @returns Error object with message
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data
      
      // Handle validation errors specifically
      if (data.code === 'VALIDATION_ERROR' || data.message === 'Validation failed') {
        const errors = data.errors || []
        if (errors.length > 0) {
          // Format validation errors into a readable message
          const errorMessages = errors.map((err: any) => err.message || err.msg).join(', ')
          return new Error(errorMessages || 'Validation failed. Please check your input.')
        }
        return new Error('Validation failed. Please check your input.')
      }
      
      // Handle other error types
      const message = data.message || data.error || 'An error occurred'
      return new Error(message)
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check your connection.')
    } else {
      // Request setup error
      return new Error(error.message || 'An unexpected error occurred')
    }
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false

    // With HttpOnly cookies we cannot inspect the token; rely on cached user presence
    return !!localStorage.getItem(API_CONFIG.USER_KEY)
  }

  /**
   * Get current user from local storage
   * @returns User object or null
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem(API_CONFIG.USER_KEY)
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch (e) {
      return null
    }
  }
  
  /**
   * Get user role from local storage or token
   */
  getUserRole(): UserRole | null {
    const user = this.getCurrentUser()
    return user ? user.role : null
  }
}

export const authService = new AuthService()
export default authService
