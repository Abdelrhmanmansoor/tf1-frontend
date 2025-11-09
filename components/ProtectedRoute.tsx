'use client'

// Protected Route Component
// Prevents unauthorized users from accessing protected pages

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import authService from '@/services/auth'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('player' | 'coach' | 'club' | 'specialist')[]
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    if (!authService.isAuthenticated()) {
      // Not logged in - redirect to login
      router.push('/login')
      return
    }

    // Check if user has correct role (if roles specified)
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = authService.getUserRole()

      if (userRole && !allowedRoles.includes(userRole as any)) {
        // Wrong role - redirect to their dashboard
        router.push(`/dashboard?role=${userRole}`)
        return
      }
    }
  }, [router, allowedRoles])

  // Check authentication before rendering
  if (!authService.isAuthenticated()) {
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
          <p className="text-gray-600 text-lg">Redirecting to login...</p>
        </motion.div>
      </div>
    )
  }

  // User is authorized - show page
  return <>{children}</>
}
