'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import authService from '@/services/auth'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type UserRole = 'player' | 'coach' | 'club' | 'specialist' | 'administrator' | 'age-group-supervisor' | 'sports-director' | 'executive-director' | 'secretary'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        const currentPath = window.location.pathname
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
        return
      }

      if (allowedRoles && allowedRoles.length > 0) {
        const userRole = authService.getUserRole() as UserRole

        if (userRole && !allowedRoles.includes(userRole)) {
          router.push('/dashboard')
          return
        }
      }

      setIsAuthorized(true)
      setIsChecking(false)
    }

    checkAuth()
  }, [router, allowedRoles])

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
