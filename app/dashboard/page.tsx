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
    // CRITICAL FIX: Get user's role from API first to ensure accuracy
    // localStorage might have incorrect role data
    const fetchUserRole = async () => {
      try {
        // First try to get from API (most accurate)
        const user = await authService.getProfile()
        if (user && user.role) {
          console.log('[Dashboard] User role from API:', user.role)
          setCurrentRole(user.role)
          
          // Redirect all roles directly to their specific dashboards
          const redirectMap: Record<string, string> = {
            'player': '/dashboard/player',
            'coach': '/dashboard/coach',
            'club': '/dashboard/club',
            'specialist': '/dashboard/specialist',
            'administrator': '/dashboard/administrator',
            'age-group-supervisor': '/dashboard/age-group-supervisor',
            'sports-director': '/dashboard/sports-director',
            'executive-director': '/dashboard/executive-director',
            'secretary': '/dashboard/secretary',
            'sports-administrator': '/dashboard/sports-admin',
            'team': '/dashboard/team',
            'leader': '/platform-control',
            'applicant': '/dashboard/applicant',
            'job-publisher': '/dashboard/job-publisher'
          }
          
          if (redirectMap[user.role]) {
            window.location.href = redirectMap[user.role]
            return
          }
          setIsLoading(false)
          return
        }
      } catch (apiError) {
        console.warn('[Dashboard] Failed to get user from API, falling back to localStorage:', apiError)
      }
      
      // Fallback to localStorage if API fails
      const userRole = authService.getUserRole()
      console.log('[Dashboard] User role from localStorage (fallback):', userRole)

      if (userRole) {
        setCurrentRole(userRole)
        // Redirect all roles directly to their specific dashboards
        const redirectMap: Record<string, string> = {
          'player': '/dashboard/player',
          'coach': '/dashboard/coach',
          'club': '/dashboard/club',
          'specialist': '/dashboard/specialist',
          'administrator': '/dashboard/administrator',
          'age-group-supervisor': '/dashboard/age-group-supervisor',
          'sports-director': '/dashboard/sports-director',
          'executive-director': '/dashboard/executive-director',
          'secretary': '/dashboard/secretary',
          'sports-administrator': '/dashboard/sports-admin',
          'team': '/dashboard/team',
          'leader': '/platform-control',
          'applicant': '/dashboard/applicant',
          'job-publisher': '/dashboard/job-publisher'
        }
        
        if (redirectMap[userRole]) {
          window.location.href = redirectMap[userRole]
          return
        }
      } else {
        // Fallback to login if no role found
        window.location.href = '/login?reason=no_role'
        return
      }

      setIsLoading(false)
    }
    
    fetchUserRole()
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

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (currentRole) {
      case 'sports-administrator':
        // Redirect handled in useEffect
        return null
      case 'team':
        // Redirect handled in useEffect
        return null
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
      case 'applicant':
        // Redirect handled in useEffect
        return null
      case 'job-publisher':
        // Redirect handled in useEffect
        return null
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
