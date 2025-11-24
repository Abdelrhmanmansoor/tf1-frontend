'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  User,
  Trophy,
  Building,
  Stethoscope,
  ArrowLeft,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'

export default function TestDashboardsPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if user came from test admin login
    const testMode = localStorage.getItem('testMode')
    if (testMode === 'true') {
      setIsAuthorized(true)
    } else {
      router.push('/test-admin')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('testMode')
    router.push('/login')
  }

  const dashboards = [
    {
      id: 'player',
      title: language === 'ar' ? 'لوحة اللاعب' : 'Player Dashboard',
      description:
        language === 'ar' ? 'عرض لوحة تحكم اللاعب' : 'View Player Dashboard',
      icon: User,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'from-blue-600 to-cyan-600',
      route: '/dashboard?role=player',
    },
    {
      id: 'coach',
      title: language === 'ar' ? 'لوحة المدرب' : 'Coach Dashboard',
      description:
        language === 'ar' ? 'عرض لوحة تحكم المدرب' : 'View Coach Dashboard',
      icon: Trophy,
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'from-green-600 to-emerald-600',
      route: '/dashboard?role=coach',
    },
    {
      id: 'club',
      title: language === 'ar' ? 'لوحة النادي' : 'Club Dashboard',
      description:
        language === 'ar' ? 'عرض لوحة تحكم النادي' : 'View Club Dashboard',
      icon: Building,
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'from-purple-600 to-pink-600',
      route: '/dashboard?role=club',
    },
    {
      id: 'specialist',
      title: language === 'ar' ? 'لوحة الأخصائي' : 'Specialist Dashboard',
      description:
        language === 'ar'
          ? 'عرض لوحة تحكم الأخصائي'
          : 'View Specialist Dashboard',
      icon: Stethoscope,
      color: 'from-orange-500 to-red-500',
      hoverColor: 'from-orange-600 to-red-600',
      route: '/dashboard?role=specialist',
    },
  ]

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 360],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 5,
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mr-4"
                >
                  🎯
                </motion.span>
                {language === 'ar'
                  ? 'معاينة لوحات التحكم'
                  : 'Dashboard Previews'}
              </h1>
              <p className="text-xl text-gray-300">
                {language === 'ar'
                  ? 'اختر نوع لوحة التحكم التي تريد معاينتها'
                  : 'Choose which dashboard type you want to preview'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'خروج' : 'Logout'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboards.map((dashboard, index) => (
              <motion.div
                key={dashboard.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={dashboard.route}>
                  <div
                    className={`
                    relative p-8 rounded-2xl bg-gradient-to-br ${dashboard.color}
                    shadow-2xl border border-white/20 backdrop-blur-sm
                    hover:shadow-3xl transform transition-all duration-500
                    group-hover:scale-105 cursor-pointer overflow-hidden
                  `}
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${dashboard.hoverColor}" />

                    {/* Content */}
                    <div className="relative z-10">
                      <motion.div
                        className="mb-6"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                      >
                        <dashboard.icon className="w-12 h-12 text-white" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-3">
                        {dashboard.title}
                      </h3>

                      <p className="text-white/80 text-sm mb-6">
                        {dashboard.description}
                      </p>

                      <motion.div
                        className="inline-flex items-center text-white font-medium"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {language === 'ar' ? 'عرض' : 'View'}
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Hover Effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="max-w-6xl mx-auto mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <p className="text-white/70 mb-4">
              {language === 'ar'
                ? 'هذه المعاينة لأغراض الاختبار فقط. البيانات المعروضة قد تكون تجريبية.'
                : 'This preview is for testing purposes only. Data shown may be mock data.'}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              {language === 'ar'
                ? 'العودة لتسجيل الدخول الحقيقي'
                : 'Back to Real Login'}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
