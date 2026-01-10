'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import ProtectedRoute from '@/components/ProtectedRoute'
import CoachDashboard from '@/components/dashboards/CoachDashboard'
import authService from '@/services/auth'

function CoachDashboardContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const userRole = authService.getUserRole()
    console.log('[CoachDashboard] User role:', userRole)

    if (userRole === 'coach') {
      setIsAuthorized(true)
    } else if (userRole) {
      console.log('[CoachDashboard] Unauthorized role, redirecting to correct dashboard')
      router.push('/dashboard')
    } else {
      console.log('[CoachDashboard] No role found, redirecting to login')
      router.push('/login')
    }
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

  return <CoachDashboard />
}

export default function CoachDashboardPage() {
  const { language } = useLanguage()

  return (
    <ProtectedRoute allowedRoles={['coach']}>
      <div
        className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <CoachDashboardContent />
      </div>
    </ProtectedRoute>
  )
}
