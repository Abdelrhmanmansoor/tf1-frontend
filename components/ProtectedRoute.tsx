'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import authService from '@/services/auth'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type UserRole = 'leader' | 'team' | 'player' | 'coach' | 'club' | 'specialist' | 'administrative-officer' | 'age-group-supervisor' | 'sports-director' | 'executive-director' | 'secretary'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  fallbackPath?: string
}

const getFallbackByRole = (role: string | null, currentPath: string): string => {
  if (!role) return '/login'
  
  if (role === 'leader') {
    if (currentPath.includes('/dashboard/leader')) {
      return '/dashboard/leader/fallback'
    }
    return '/dashboard/leader'
  }
  
  if (role === 'team') {
    if (currentPath.includes('/dashboard/team')) {
      return '/dashboard/team/access-denied'
    }
    return '/dashboard/team'
  }
  
  return '/dashboard'
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  fallbackPath,
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        const currentPath = window.location.pathname
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
        return
      }

      const userRole = authService.getUserRole() as UserRole

      if (allowedRoles && allowedRoles.length > 0) {
        if (userRole && !allowedRoles.includes(userRole)) {
          const redirectPath = fallbackPath || getFallbackByRole(userRole, pathname)
          router.push(redirectPath)
          return
        }
      }

      setIsAuthorized(true)
      setIsChecking(false)
    }

    checkAuth()
  }, [router, allowedRoles, fallbackPath, pathname])

  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-12 h-12 text-blue-600" />
          </motion.div>
          <p className="text-gray-600 text-lg">جاري التحقق...</p>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
