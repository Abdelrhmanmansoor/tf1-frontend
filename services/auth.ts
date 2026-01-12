// Authentication Service
// This service handles all authentication-related API calls
// Refactored for Type Safety & Security

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
      
      // Get CSRF token from multiple sources
      let csrfToken: string | undefined
      
      // 1. Try to get from cookie first (most reliable)
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';')
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=')
          if (name === 'XSRF-TOKEN') {
            csrfToken = decodeURIComponent(value)
            break
          }
        }
      }
      
      // 2. If not in cookie, fetch from endpoint
      if (!csrfToken) {
        try {
          const t = await api.get('/auth/csrf-token')
          csrfToken =
            t.data?.data?.csrfToken ||
            t.data?.data?.token ||
            t.data?.token ||
            (t.headers as any)?.['x-csrf-token']
          
          // Also try to get from cookie after the request
          if (typeof document !== 'undefined' && !csrfToken) {
            const cookies = document.cookie.split(';')
            for (const cookie of cookies) {
              const [name, value] = cookie.trim().split('=')
              if (name === 'XSRF-TOKEN') {
                csrfToken = decodeURIComponent(value)
                break
              }
            }
          }
        } catch (csrfError) {
          console.warn('Failed to fetch CSRF token:', csrfError)
          // Continue anyway - backend might skip CSRF for some routes
            try {
              const local = await api.get('/api/csrf')
              csrfToken = local.data?.csrfToken
            } catch {}
        }
      }
      
      const headers: Record<string, string> = {}
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }
      
      const response = await api.post('/auth/register', userData, {
        headers: Object.keys(headers).length > 0 ? headers : undefined,
      })
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
      // Always fetch a fresh CSRF token before login to avoid "token already used" errors
      let csrfToken: string | undefined
      try {
        // Force a new token by requesting from server
        const t = await api.get('/auth/csrf-token', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        csrfToken =
          t.data?.data?.csrfToken ||
          t.data?.csrfToken ||
          t.data?.token ||
          (t.headers as any)?.['x-csrf-token']
        
        // If not in response, try to get from cookie that was just set
        if (!csrfToken && typeof document !== 'undefined') {
          const cookies = document.cookie.split(';')
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=')
            if (name === 'XSRF-TOKEN') {
              csrfToken = decodeURIComponent(value)
              break
            }
          }
        }
      } catch (csrfError) {
        console.warn('Failed to fetch CSRF token for login:', csrfError)
      }
      
      const response = await api.post('/auth/login', { email, password }, {
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      })
      const { user, accessToken, refreshToken } = response.data

      if (!user) {
        throw new Error('Invalid response from server')
      }

      // CRITICAL: Set cookies client-side to ensure middleware can read them
      // Backend sets HttpOnly cookies but they may not work cross-origin
      // This ensures the frontend middleware has access to the token
      if (typeof document !== 'undefined' && accessToken) {
        const isProduction = window.location.protocol === 'https:'
        const secure = isProduction ? '; Secure' : ''
        const sameSite = isProduction ? '; SameSite=Strict' : '; SameSite=Lax'
        
        // Set both cookie names for compatibility
        // 'accessToken' matches backend, 'sportx_access_token' is legacy
        const maxAge = 15 * 60 // 15 minutes in seconds (matches backend ACCESS_TOKEN_MAX_AGE)
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${maxAge}${secure}${sameSite}`
        document.cookie = `sportx_access_token=${accessToken}; path=/; max-age=${maxAge}${secure}${sameSite}`
        
        console.log('[AUTH] Access token cookie set successfully')
        
        // Also set refresh token cookie if available
        if (refreshToken) {
          const refreshMaxAge = 7 * 24 * 60 * 60 // 7 days in seconds
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${refreshMaxAge}${secure}${sameSite}`
        }
      }

      this.saveUser(user)
      return response.data
    } catch (error: any) {
      // Re-throw with better error handling
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
      
      // Attempt server-side logout to clear HttpOnly cookies
      const performLogout = async () => {
        try {
          let csrfToken: string | undefined
          try {
            const t = await api.get('/auth/csrf-token')
            csrfToken =
              t.data?.data?.csrfToken ||
              t.data?.token ||
              (t.headers as any)?.['x-csrf-token']
          } catch (csrfError) {
            console.warn('CSRF fetch failed during logout, proceeding best-effort', csrfError)
          }

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
      // Get CSRF token
      let csrfToken: string | undefined
      try {
        const t = await api.get('/auth/csrf-token')
        csrfToken = t.data?.data?.csrfToken || t.data?.csrfToken || t.data?.token
      } catch (csrfError) {
        console.warn('Failed to fetch CSRF token for sendOTP:', csrfError)
      }

      const response = await api.post('/auth/send-otp', 
        { phone, email, type, channel },
        { headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined }
      )
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
      // Get CSRF token
      let csrfToken: string | undefined
      try {
        const t = await api.get('/auth/csrf-token')
        csrfToken = t.data?.data?.csrfToken || t.data?.csrfToken || t.data?.token
      } catch (csrfError) {
        console.warn('Failed to fetch CSRF token for verifyOTP:', csrfError)
      }

      const response = await api.post('/auth/verify-otp',
        { phone, email, otp, type },
        { headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined }
      )
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
      // Get CSRF token
      let csrfToken: string | undefined
      try {
        const t = await api.get('/auth/csrf-token')
        csrfToken = t.data?.data?.csrfToken || t.data?.csrfToken || t.data?.token
      } catch (csrfError) {
        console.warn('Failed to fetch CSRF token for forgotPasswordOTP:', csrfError)
      }

      const response = await api.post('/auth/forgot-password-otp',
        { phone, channel },
        { headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined }
      )
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
      // Get CSRF token
      let csrfToken: string | undefined
      try {
        const t = await api.get('/auth/csrf-token')
        csrfToken = t.data?.data?.csrfToken || t.data?.csrfToken || t.data?.token
      } catch (csrfError) {
        console.warn('Failed to fetch CSRF token for resetPasswordOTP:', csrfError)
      }

      const response = await api.post('/auth/reset-password-otp',
        { phone, otp, newPassword },
        { headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined }
      )
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
