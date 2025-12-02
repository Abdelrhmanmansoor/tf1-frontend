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
  UserPlus,
  Star,
  Target,
  Trophy,
  Activity,
  Layers,
  Baby,
  GraduationCap
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AgeGroup {
  id: string
  name: string
  nameAr: string
  ageRange: string
  playersCount: number
  coachName: string
  nextTraining: string
  status: 'active' | 'inactive'
}

interface DashboardStats {
  totalAgeGroups: number
  totalPlayers: number
  totalCoaches: number
  upcomingMatches: number
  activeTrainings: number
  pendingRegistrations: number
}

const AgeGroupSupervisorDashboard = () => {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalAgeGroups: 0,
    totalPlayers: 0,
    totalCoaches: 0,
    upcomingMatches: 0,
    activeTrainings: 0,
    pendingRegistrations: 0
  })
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalAgeGroups: 8,
          totalPlayers: 245,
          totalCoaches: 12,
          upcomingMatches: 5,
          activeTrainings: 3,
          pendingRegistrations: 8
        })

        setAgeGroups([
          { id: '1', name: 'Under 8', nameAr: 'تحت 8 سنوات', ageRange: '6-8', playersCount: 28, coachName: 'أحمد محمد', nextTraining: '2024-01-16 16:00', status: 'active' },
          { id: '2', name: 'Under 10', nameAr: 'تحت 10 سنوات', ageRange: '8-10', playersCount: 32, coachName: 'خالد علي', nextTraining: '2024-01-16 17:00', status: 'active' },
          { id: '3', name: 'Under 12', nameAr: 'تحت 12 سنة', ageRange: '10-12', playersCount: 35, coachName: 'محمد سعيد', nextTraining: '2024-01-17 16:00', status: 'active' },
          { id: '4', name: 'Under 14', nameAr: 'تحت 14 سنة', ageRange: '12-14', playersCount: 40, coachName: 'عبدالله أحمد', nextTraining: '2024-01-17 17:00', status: 'active' },
          { id: '5', name: 'Under 16', nameAr: 'تحت 16 سنة', ageRange: '14-16', playersCount: 38, coachName: 'فهد سالم', nextTraining: '2024-01-18 16:00', status: 'active' },
          { id: '6', name: 'Under 18', nameAr: 'تحت 18 سنة', ageRange: '16-18', playersCount: 42, coachName: 'سعود محمد', nextTraining: '2024-01-18 17:00', status: 'active' },
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

  const displayName = user?.firstName || (language === 'ar' ? 'مشرف الفئات السنية' : 'Age Group Supervisor')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50">
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
            <Loader2 className="w-12 h-12 text-green-600" />
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50">
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
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const statCards = [
    { icon: Layers, label: language === 'ar' ? 'الفئات السنية' : 'Age Groups', value: stats.totalAgeGroups, color: 'from-green-500 to-emerald-500' },
    { icon: Users, label: language === 'ar' ? 'إجمالي اللاعبين' : 'Total Players', value: stats.totalPlayers, color: 'from-blue-500 to-cyan-500' },
    { icon: GraduationCap, label: language === 'ar' ? 'المدربين' : 'Coaches', value: stats.totalCoaches, color: 'from-purple-500 to-pink-500' },
    { icon: Trophy, label: language === 'ar' ? 'المباريات القادمة' : 'Upcoming Matches', value: stats.upcomingMatches, color: 'from-yellow-500 to-orange-500' },
    { icon: Activity, label: language === 'ar' ? 'التدريبات النشطة' : 'Active Trainings', value: stats.activeTrainings, color: 'from-cyan-500 to-teal-500' },
    { icon: UserPlus, label: language === 'ar' ? 'طلبات التسجيل' : 'Pending Registrations', value: stats.pendingRegistrations, color: 'from-red-500 to-pink-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
                  TF1
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">
                {language === 'ar' ? 'مشرف الفئات السنية' : 'Age Group Supervisor'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <GlobalSearchButton />
              <MessageNotificationBadge dashboardType="age-group-supervisor" />
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
            {language === 'ar' ? 'إدارة الفئات السنية واللاعبين' : 'Manage age groups and players'}
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
                  <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'الفئات السنية' : 'Age Groups'}
            </h2>
            <Button className="bg-gradient-to-r from-green-500 to-cyan-500 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة فئة' : 'Add Group'}
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'الفئة' : 'Group'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'الفئة العمرية' : 'Age Range'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'اللاعبين' : 'Players'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'المدرب' : 'Coach'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'التدريب القادم' : 'Next Training'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ageGroups.map((group) => (
                  <tr key={group.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Baby className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{language === 'ar' ? group.nameAr : group.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{group.ageRange} {language === 'ar' ? 'سنة' : 'years'}</td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {group.playersCount}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{group.coachName}</td>
                    <td className="py-4 px-4 text-gray-600">{group.nextTraining}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        group.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {group.status === 'active' 
                          ? (language === 'ar' ? 'نشط' : 'Active')
                          : (language === 'ar' ? 'غير نشط' : 'Inactive')
                        }
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Layers, label: language === 'ar' ? 'إدارة الفئات' : 'Manage Groups', href: '/dashboard/age-group-supervisor/groups' },
            { icon: Users, label: language === 'ar' ? 'اللاعبين' : 'Players', href: '/dashboard/age-group-supervisor/players' },
            { icon: Calendar, label: language === 'ar' ? 'الجدول' : 'Schedule', href: '/dashboard/age-group-supervisor/schedule' },
            { icon: Trophy, label: language === 'ar' ? 'المباريات' : 'Matches', href: '/dashboard/age-group-supervisor/matches' },
          ].map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
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

export default AgeGroupSupervisorDashboard
