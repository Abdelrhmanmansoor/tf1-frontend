'use client'

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import authService from '@/services/auth'
import { User, LoginResponse } from '@/types/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
  register: (userData: any) => Promise<any>
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
  validateSession: () => Promise<boolean>
  sessionValidated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionValidated, setSessionValidated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      if (!authService.isAuthenticated()) {
        setUser(null)
        setLoading(false)
        return false
      }

      // Get user from local storage first (fast)
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setLoading(false)
      }

      // Try to validate with backend (with timeout)
      try {
        const validationPromise = authService.validateToken()
        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(true), 3000) // 3 second timeout
        })

        // Race: if validation takes too long, trust local state
        const isValid = await Promise.race([validationPromise, timeoutPromise])

        if (isValid === false) {
          // If validation fails explicitly (locked out, token revoked), clear user
          const updatedUser = authService.getCurrentUser()
          setUser(updatedUser) // might be null now
          return !!updatedUser
        }

        // CRITICAL FIX: Get fresh user data from API instead of localStorage
        try {
          const freshUser = await authService.getProfile()
          if (freshUser) {
            setUser(freshUser)
            // Update localStorage with fresh data from API
            authService.saveUser(freshUser)
          }
        } catch (profileError) {
          console.warn('[AUTH] Failed to get fresh profile, using cached data:', profileError)
          // Fallback to cached data if API fails
          const cachedUser = authService.getCurrentUser()
          if (cachedUser) {
            setUser(cachedUser)
          }
        }
        return true
      } catch (validationError: any) {
        console.warn('[AUTH] Session validation warning:', validationError.message)
        // Network error? Trust local state if we have it
        return !!currentUser
      }
    } catch (error) {
      console.error('[AUTH] Session validation failed:', error)
      // On error, trust local state
      const currentUser = authService.getCurrentUser()
      return !!currentUser
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      // Optimistic load
      const currentUser = authService.getCurrentUser()
      if (currentUser && authService.isAuthenticated()) {
        setUser(currentUser)
      }

      await validateSession()
      setSessionValidated(true)
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount

  // Re-validate session on route changes within dashboard
  useEffect(() => {
    if (sessionValidated && pathname?.startsWith('/dashboard')) {
      if (!authService.isAuthenticated()) {
        router.push('/login?reason=no_session')
      }
    }
  }, [pathname, sessionValidated, router])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password)
      setUser(response.user)
      setSessionValidated(true)
      return response
    } catch (error: any) {
      // Re-throw to let the component handle it
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setSessionValidated(false)
    authService.logout()
  }

  const register = async (userData: any) => {
    return await authService.register(userData)
  }

  const refreshUser = async () => {
    await validateSession()
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user && authService.isAuthenticated(),
    refreshUser,
    validateSession,
    sessionValidated,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
