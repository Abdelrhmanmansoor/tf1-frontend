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
      
      const response = await api.post('/auth/register', userData)
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
      const response = await api.post('/auth/login', { email, password })
      const { accessToken, user } = response.data
      
      if (!accessToken || !user) {
        throw new Error('Invalid response from server')
      }
      
      this.saveToken(accessToken)
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
      const response = await api.post('/auth/verify-email', { token })
      return response.data
    } catch (error) {
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
   * Get current user profile
   * @returns Promise with user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/me')
      return response.data.user
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Save token to local storage and cookie
   * @param token - JWT access token
   */
  private saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_CONFIG.TOKEN_KEY, token)
      // Set cookie for middleware support - secure in production
      const secure = window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `${API_CONFIG.TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 60 * 60}${secure}; SameSite=Strict`
    }
  }

  /**
   * Save user data to local storage
   * @param user - User object
   */
  private saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(user))
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
    
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY)
    if (!token) return false
    
    try {
      const decoded: any = jwtDecode(token)
      const currentTime = Date.now() / 1000
      return decoded.exp > currentTime
    } catch (e) {
      return false
    }
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
