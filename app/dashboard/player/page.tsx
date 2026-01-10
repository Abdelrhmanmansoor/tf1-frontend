'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import ProtectedRoute from '@/components/ProtectedRoute'
import PlayerDashboard from '@/components/dashboards/PlayerDashboard'
import authService from '@/services/auth'

function PlayerDashboardContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // CRITICAL FIX: Get role from API first to ensure accuracy
    const checkRole = async () => {
      try {
        // Try to get from API first (most accurate)
        const user = await authService.getProfile()
        if (user && user.role) {
          console.log('[PlayerDashboard] User role from API:', user.role)
          
          if (user.role === 'player') {
            setIsAuthorized(true)
          } else {
            console.log('[PlayerDashboard] Unauthorized role, redirecting to correct dashboard')
            router.push('/dashboard')
          }
          return
        }
      } catch (apiError) {
        console.warn('[PlayerDashboard] Failed to get user from API, falling back to localStorage:', apiError)
      }
      
      // Fallback to localStorage if API fails
      const userRole = authService.getUserRole()
      console.log('[PlayerDashboard] User role from localStorage (fallback):', userRole)

      if (userRole === 'player') {
        setIsAuthorized(true)
      } else if (userRole) {
        console.log('[PlayerDashboard] Unauthorized role, redirecting to correct dashboard')
        router.push('/dashboard')
      } else {
        console.log('[PlayerDashboard] No role found, redirecting to login')
        router.push('/login')
      }
    }
    
    checkRole()
  }, [router])

  if (isAuthorized === null) {
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
          <p className="text-gray-600 text-lg">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </motion.div>
      </div>
    )
  }

  return <PlayerDashboard />
}

export default function PlayerDashboardPage() {
  const { language } = useLanguage()

  return (
    <ProtectedRoute allowedRoles={['player']}>
      <div
        className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <PlayerDashboardContent />
      </div>
    </ProtectedRoute>
  )
}
