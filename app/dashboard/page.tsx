'use client'

import { useEffect, useState, Suspense } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import authService from '@/services/auth'

// Import role-specific dashboards
import PlayerDashboard from '@/components/dashboards/PlayerDashboard'
import ClubDashboard from '@/components/dashboards/ClubDashboard'
import CoachDashboard from '@/components/dashboards/CoachDashboard'
import SpecialistDashboard from '@/components/dashboards/SpecialistDashboard'
import AdministratorDashboard from '@/components/dashboards/AdministratorDashboard'
import AgeGroupSupervisorDashboard from '@/components/dashboards/AgeGroupSupervisorDashboard'
import SportsDirectorDashboard from '@/components/dashboards/SportsDirectorDashboard'
import ExecutiveDirectorDashboard from '@/components/dashboards/ExecutiveDirectorDashboard'
import SecretaryDashboard from '@/components/dashboards/SecretaryDashboard'

function DashboardContent() {
  const { language } = useLanguage()
  const [currentRole, setCurrentRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user's role from localStorage
    const userRole = authService.getUserRole()
    console.log('[Dashboard] User role from localStorage:', userRole)

    if (userRole) {
      setCurrentRole(userRole)
    } else {
      // Fallback to player if no role found
      setCurrentRole('player')
    }

    setIsLoading(false)
  }, [])

  // Show loading while fetching role
  if (isLoading || !currentRole) {
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

  // Redirect to role-specific dashboard for leader and team roles
  useEffect(() => {
    if (currentRole === 'leader') {
      window.location.href = '/dashboard/leader'
    } else if (currentRole === 'team') {
      window.location.href = '/dashboard/team'
    }
  }, [currentRole])

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (currentRole) {
      case 'leader':
        return null // Will redirect
      case 'team':
        return null // Will redirect
      case 'player':
        return <PlayerDashboard />
      case 'club':
        return <ClubDashboard />
      case 'coach':
        return <CoachDashboard />
      case 'specialist':
        return <SpecialistDashboard />
      case 'administrator':
      case 'administrative-officer':
        return <AdministratorDashboard />
      case 'age-group-supervisor':
        return <AgeGroupSupervisorDashboard />
      case 'sports-director':
        return <SportsDirectorDashboard />
      case 'executive-director':
        return <ExecutiveDirectorDashboard />
      case 'secretary':
        return <SecretaryDashboard />
      default:
        return <PlayerDashboard />
    }
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {renderDashboard()}
    </div>
  )
}

export default function DashboardPage() {
  const { language } = useLanguage()

  return (
    <ProtectedRoute>
      <Suspense
        fallback={
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
        }
      >
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  )
}
