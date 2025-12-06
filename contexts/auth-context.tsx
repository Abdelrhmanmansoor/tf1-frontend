'use client'

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import authService from '@/services/auth'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'player' | 'coach' | 'club' | 'specialist' | 'administrator' | 'age-group-supervisor' | 'sports-director' | 'executive-director' | 'secretary' | 'leader' | 'team'
  isEmailVerified: boolean
  permissions?: string[]
  accessKey?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => void
  register: (userData: any) => Promise<any>
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
  validateSession: () => Promise<boolean>
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
        return false
      }

      // Try to validate with backend, but don't fail on network errors
      try {
        const isValid = await authService.validateToken()
        if (!isValid) {
          // Only clear session on definitive 401, not network errors
          const currentUser = authService.getCurrentUser()
          if (!currentUser) {
            setUser(null)
            return false
          }
          // Keep local session if we have user data (backend might be temporarily unavailable)
          return true
        }
      } catch (validationError: any) {
        // Network error or timeout - don't logout, trust local token
        console.warn('[AUTH] Backend validation failed, trusting local session:', validationError.message)
        const currentUser = authService.getCurrentUser()
        if (currentUser && authService.isAuthenticated()) {
          setUser(currentUser)
          return true
        }
      }

      const currentUser = authService.getCurrentUser()
      setUser(currentUser)
      return true
    } catch (error) {
      console.error('[AUTH] Session validation failed:', error)
      // Don't clear session on general errors - only on explicit 401
      return authService.isAuthenticated()
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true)
      
      // First, check localStorage for quick initial load
      const currentUser = authService.getCurrentUser()
      if (currentUser && authService.isAuthenticated()) {
        setUser(currentUser)
        setLoading(false)
        
        // Then validate with backend in background (don't block UI)
        validateSession().then(isValid => {
          if (!isValid && pathname?.startsWith('/dashboard')) {
            router.push('/login?reason=session_invalid')
          }
          setSessionValidated(true)
        })
      } else {
        setUser(null)
        setLoading(false)
        setSessionValidated(true)
      }
    }

    initAuth()
  }, [])

  // Re-validate session on route changes within dashboard
  useEffect(() => {
    if (sessionValidated && pathname?.startsWith('/dashboard')) {
      // Quick local check first
      if (!authService.isAuthenticated()) {
        router.push('/login?reason=no_session')
        return
      }
    }
  }, [pathname, sessionValidated, router])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setUser(response.user)
    setSessionValidated(true)
    return response
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
    try {
      const isValid = await validateSession()
      if (!isValid) {
        console.warn('[AUTH] Failed to refresh user - session invalid')
      }
    } catch (error) {
      console.error('[AUTH] Failed to refresh user:', error)
    }
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
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
