'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Users,
  Calendar,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Loader2,
  LogOut,
  Briefcase,
  AlertCircle,
  Edit,
  Shield,
  FileText,
  Bell,
  BarChart3,
  Target,
  Trophy,
  Activity,
  Dumbbell,
  Medal,
  Star,
  TrendingDown,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Program {
  id: string
  name: string
  nameAr: string
  type: 'training' | 'competition' | 'development'
  participants: number
  progress: number
  status: 'active' | 'completed' | 'upcoming'
}

interface CoachPerformance {
  id: string
  name: string
  rating: number
  sessionsCompleted: number
  playersManaged: number
}

interface DashboardStats {
  activePrograms: number
  totalAthletes: number
  coachingStaff: number
  upcomingEvents: number
  winRate: number
  trainingHours: number
}

const SportsDirectorDashboard = () => {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    activePrograms: 0,
    totalAthletes: 0,
    coachingStaff: 0,
    upcomingEvents: 0,
    winRate: 0,
    trainingHours: 0
  })
  const [programs, setPrograms] = useState<Program[]>([])
  const [coachPerformances, setCoachPerformances] = useState<CoachPerformance[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          activePrograms: 12,
          totalAthletes: 580,
          coachingStaff: 28,
          upcomingEvents: 8,
          winRate: 72,
          trainingHours: 1250
        })

        setPrograms([
          { id: '1', name: 'Elite Development', nameAr: 'تطوير النخبة', type: 'development', participants: 45, progress: 75, status: 'active' },
          { id: '2', name: 'Youth League Prep', nameAr: 'إعداد دوري الشباب', type: 'competition', participants: 80, progress: 60, status: 'active' },
          { id: '3', name: 'Fitness Enhancement', nameAr: 'تحسين اللياقة', type: 'training', participants: 120, progress: 45, status: 'active' },
          { id: '4', name: 'Tactical Training', nameAr: 'التدريب التكتيكي', type: 'training', participants: 65, progress: 90, status: 'active' },
        ])

        setCoachPerformances([
          { id: '1', name: 'أحمد محمد', rating: 4.8, sessionsCompleted: 156, playersManaged: 32 },
          { id: '2', name: 'خالد العلي', rating: 4.6, sessionsCompleted: 142, playersManaged: 28 },
          { id: '3', name: 'محمد سعيد', rating: 4.5, sessionsCompleted: 128, playersManaged: 25 },
          { id: '4', name: 'فهد أحمد', rating: 4.4, sessionsCompleted: 115, playersManaged: 22 },
        ])

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const displayName = user?.firstName || (language === 'ar' ? 'المدير الرياضي' : 'Sports Director')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-12 h-12 text-indigo-600" />
          </motion.div>
          <p className="text-gray-600 text-lg">
            {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'خطأ في التحميل' : 'Loading Error'}
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const statCards = [
    { icon: Dumbbell, label: language === 'ar' ? 'البرامج النشطة' : 'Active Programs', value: stats.activePrograms, color: 'from-indigo-500 to-blue-500' },
    { icon: Users, label: language === 'ar' ? 'الرياضيين' : 'Athletes', value: stats.totalAthletes, color: 'from-blue-500 to-cyan-500' },
    { icon: Award, label: language === 'ar' ? 'الطاقم الفني' : 'Coaching Staff', value: stats.coachingStaff, color: 'from-purple-500 to-pink-500' },
    { icon: Calendar, label: language === 'ar' ? 'الأحداث القادمة' : 'Upcoming Events', value: stats.upcomingEvents, color: 'from-green-500 to-emerald-500' },
    { icon: Trophy, label: language === 'ar' ? 'نسبة الفوز' : 'Win Rate', value: `${stats.winRate}%`, color: 'from-yellow-500 to-orange-500' },
    { icon: Clock, label: language === 'ar' ? 'ساعات التدريب' : 'Training Hours', value: stats.trainingHours, color: 'from-cyan-500 to-teal-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  TF1
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">
                {language === 'ar' ? 'المدير الرياضي' : 'Sports Director'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <GlobalSearchButton />
              <MessageNotificationBadge dashboardType="sports-director" />
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? `مرحباً، ${displayName}` : `Welcome, ${displayName}`}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة البرامج الرياضية والأداء' : 'Manage sports programs and performance'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'البرامج الرياضية' : 'Sports Programs'}
              </h2>
              <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <Zap className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'برنامج جديد' : 'New Program'}
              </Button>
            </div>
            <div className="space-y-4">
              {programs.map((program) => (
                <div key={program.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        program.type === 'training' ? 'bg-blue-100' :
                        program.type === 'competition' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        {program.type === 'training' ? <Dumbbell className="w-5 h-5 text-blue-600" /> :
                         program.type === 'competition' ? <Trophy className="w-5 h-5 text-yellow-600" /> :
                         <TrendingUp className="w-5 h-5 text-green-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{language === 'ar' ? program.nameAr : program.name}</p>
                        <p className="text-sm text-gray-500">{program.participants} {language === 'ar' ? 'مشارك' : 'participants'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      program.status === 'active' ? 'bg-green-100 text-green-800' :
                      program.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {program.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') :
                       program.status === 'completed' ? (language === 'ar' ? 'مكتمل' : 'Completed') :
                       (language === 'ar' ? 'قادم' : 'Upcoming')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${program.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{program.progress}% {language === 'ar' ? 'مكتمل' : 'complete'}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'أداء المدربين' : 'Coach Performance'}
              </h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {coachPerformances.map((coach, index) => (
                <div key={coach.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Medal className="w-3 h-3 text-yellow-800" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{coach.name}</p>
                      <p className="text-sm text-gray-500">
                        {coach.sessionsCompleted} {language === 'ar' ? 'جلسة' : 'sessions'} | {coach.playersManaged} {language === 'ar' ? 'لاعب' : 'players'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-900">{coach.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Dumbbell, label: language === 'ar' ? 'البرامج' : 'Programs', href: '/dashboard/sports-director/programs' },
            { icon: Users, label: language === 'ar' ? 'الرياضيين' : 'Athletes', href: '/dashboard/sports-director/athletes' },
            { icon: Award, label: language === 'ar' ? 'المدربين' : 'Coaches', href: '/dashboard/sports-director/coaches' },
            { icon: BarChart3, label: language === 'ar' ? 'التقارير' : 'Reports', href: '/dashboard/sports-director/reports' },
          ].map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-gray-900">{action.label}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </main>
    </div>
  )
}

export default SportsDirectorDashboard
