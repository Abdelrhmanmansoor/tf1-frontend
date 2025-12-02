'use client'

import { useEffect, useState, Suspense } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Loader2, Shield, Users, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import authService from '@/services/auth'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

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
  const router = useRouter()
  const { logout } = useAuth()
  const [currentRole, setCurrentRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRoleSelector, setShowRoleSelector] = useState(false)

  useEffect(() => {
    // Get user's role from localStorage
    const userRole = authService.getUserRole()
    console.log('[Dashboard] User role from localStorage:', userRole)

    if (userRole) {
      setCurrentRole(userRole)
      // Show role selector for admin and age-group-supervisor
      if (userRole === 'administrator' || userRole === 'age-group-supervisor') {
        setShowRoleSelector(true)
      }
    } else {
      // Fallback to player if no role found
      setCurrentRole('player')
    }

    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

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

  // Show role selector for admin and supervisor
  if (showRoleSelector && (currentRole === 'administrator' || currentRole === 'age-group-supervisor')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TF1
                </span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">{language === 'ar' ? 'تسجيل خروج' : 'Logout'}</span>
              </motion.button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'اختري لوحة التحكم' : 'Select Control Panel'}
            </h1>
            <p className="text-gray-600 text-lg">
              {language === 'ar' 
                ? 'اختري بين لوحات التحكم المتاحة لك'
                : 'Choose between your available control panels'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Administrator Dashboard */}
            {currentRole === 'administrator' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/dashboard/administrator">
                  <div className="h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 cursor-pointer">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                          <Shield className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3">
                          {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
                        </h2>
                        <p className="text-white/80 mb-4">
                          {language === 'ar'
                            ? 'تحكم كامل بإدارة الموقع والمستخدمين والإعدادات'
                            : 'Full control of site management, users and settings'
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-white/80 group">
                        <span>{language === 'ar' ? 'الدخول الآن' : 'Enter Now'}</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Supervisor Dashboard */}
            {currentRole === 'age-group-supervisor' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/dashboard/age-group-supervisor">
                  <div className="h-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 cursor-pointer">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                          <Users className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3">
                          {language === 'ar' ? 'لوحة المشرف' : 'Supervisor Panel'}
                        </h2>
                        <p className="text-white/80 mb-4">
                          {language === 'ar'
                            ? 'إدارة اللاعبين والفئات العمرية والجلسات التدريبية'
                            : 'Manage players, age categories and training sessions'
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-white/80 group">
                        <span>{language === 'ar' ? 'الدخول الآن' : 'Enter Now'}</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Both roles can access both panels */}
            {currentRole === 'administrator' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/dashboard/age-group-supervisor">
                  <div className="h-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 cursor-pointer">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                          <Users className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3">
                          {language === 'ar' ? 'لوحة المشرف' : 'Supervisor Panel'}
                        </h2>
                        <p className="text-white/80 mb-4">
                          {language === 'ar'
                            ? 'إدارة اللاعبين والفئات العمرية والجلسات التدريبية'
                            : 'Manage players, age categories and training sessions'
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-white/80 group">
                        <span>{language === 'ar' ? 'الدخول الآن' : 'Enter Now'}</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {currentRole === 'age-group-supervisor' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/dashboard/administrator">
                  <div className="h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 cursor-pointer">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                          <Shield className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3">
                          {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
                        </h2>
                        <p className="text-white/80 mb-4">
                          {language === 'ar'
                            ? 'تحكم كامل بإدارة الموقع والمستخدمين والإعدادات'
                            : 'Full control of site management, users and settings'
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-white/80 group">
                        <span>{language === 'ar' ? 'الدخول الآن' : 'Enter Now'}</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </main>
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
