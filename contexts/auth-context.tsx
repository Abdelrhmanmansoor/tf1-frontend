'use client'

// Authentication Context
// Global authentication state management using React Context

import React, { createContext, useState, useContext, useEffect } from 'react'
import authService from '@/services/auth'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'player' | 'coach' | 'club' | 'specialist' | 'administrator' | 'age-group-supervisor' | 'sports-director' | 'executive-director' | 'secretary'
  isEmailVerified: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => void
  register: (userData: any) => Promise<any>
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
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

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setUser(response.user)
    return response
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const register = async (userData: any) => {
    return await authService.register(userData)
  }

  const refreshUser = async () => {
    try {
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
