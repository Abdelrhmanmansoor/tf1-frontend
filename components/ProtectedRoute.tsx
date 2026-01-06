'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import { Loader2, ShieldAlert } from 'lucide-react'

type UserRole = 'sports-administrator' | 'team' | 'player' | 'coach' | 'club' | 'specialist' | 'administrator' | 'age-group-supervisor' | 'sports-director' | 'executive-director' | 'secretary' | 'applicant'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  fallbackPath?: string
}

const ROLE_DASHBOARDS: Record<string, string> = {
  player: '/dashboard/player',
  coach: '/dashboard/coach',
  club: '/dashboard/club',
  specialist: '/dashboard/specialist',
  administrator: '/dashboard/administrator',
  'age-group-supervisor': '/dashboard/age-group-supervisor',
  'sports-director': '/dashboard/sports-director',
  'executive-director': '/dashboard/executive-director',
  secretary: '/dashboard/secretary',
  'sports-administrator': '/dashboard/sports-admin',
  team: '/dashboard/team',
  applicant: '/dashboard/applicant',
  'job-publisher': '/dashboard/job-publisher',
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  fallbackPath,
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, loading, validateSession, sessionValidated } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const checkAuth = useCallback(async () => {
    setIsChecking(true)
    setAuthError(null)

    // Wait for auth context to finish loading
    if (loading) return

    // Check if authenticated
    if (!isAuthenticated || !user) {
      const currentPath = pathname || window.location.pathname
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}&reason=no_session`)
      return
    }

    // Validate session with backend (background check)
    // Only if context hasn't validated it yet or if we want to be extra secure
    if (!sessionValidated) {
      const isValid = await validateSession()
      if (!isValid) {
        setAuthError('session_invalid')
        const currentPath = pathname || window.location.pathname
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}&reason=session_invalid`)
        return
      }
    }

    // Check role-based access
    const userRole = user.role as UserRole
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // User doesn't have permission - redirect to their dashboard
      const correctDashboard = fallbackPath || ROLE_DASHBOARDS[userRole] || '/dashboard'
      setAuthError('access_denied')
      router.push(correctDashboard)
      return
    }

    // All checks passed
    setIsAuthorized(true)
    setIsChecking(false)
  }, [loading, isAuthenticated, user, allowedRoles, fallbackPath, pathname, router, validateSession, sessionValidated])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Re-check on pathname change
  useEffect(() => {
    if (!loading && isAuthorized) {
      // Quick re-validation on navigation
      if (!isAuthenticated) {
        setIsAuthorized(false)
        checkAuth()
      }
    }
  }, [pathname, loading, isAuthenticated, isAuthorized, checkAuth])

  // Timeout failsafe
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading || isChecking) {
        setAuthError('timeout')
      }
    }, 8000) // 8 seconds timeout

    return () => clearTimeout(timer)
  }, [loading, isChecking])

  // Loading state
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 flex-col gap-4">
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
          <p className="text-gray-600 text-lg">جاري التحقق من الجلسة...</p>
        </motion.div>
        
        {authError === 'timeout' && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }}
             className="flex flex-col gap-2 items-center"
           >
             <p className="text-red-500 text-sm">استغرق التحقق وقتاً أطول من المعتاد</p>
             <button 
               onClick={() => {
                 window.location.href = '/login'
               }}
               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
             >
               تسجيل الدخول مجدداً
             </button>
           </motion.div>
        )}
      </div>
    )
  }

  // Access denied state
  if (authError === 'access_denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md p-8"
        >
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
          <p className="text-gray-600 mb-4">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
          <p className="text-sm text-gray-500">جاري تحويلك إلى لوحة التحكم الخاصة بك...</p>
        </motion.div>
      </div>
    )
  }

  // Authorized - render children
  if (isAuthorized) {
    return <>{children}</>
  }

  // Default loading fallback
  return null
}
