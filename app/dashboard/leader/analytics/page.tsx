'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Loader2,
  BarChart3,
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Eye
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalUsers: number
    newUsersThisMonth: number
    totalJobs: number
    activeJobs: number
    totalApplications: number
    conversionRate: number
  }
  usersByRole: Record<string, number>
  monthlyGrowth: number[]
}

export default function AnalyticsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    overview: {
      totalUsers: 0,
      newUsersThisMonth: 0,
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      conversionRate: 0
    },
    usersByRole: {},
    monthlyGrowth: []
  })

  useEffect(() => {
    if (user?.role !== 'leader') {
      router.push('/dashboard/leader/fallback')
      return
    }
    fetchAnalytics()
  }, [user, router])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/admin/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.ok) {
        const result = await response.json()
        setAnalytics(result.data || analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: Users, label: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', value: analytics.overview.totalUsers, color: 'from-blue-500 to-cyan-500', trend: 12 },
    { icon: TrendingUp, label: language === 'ar' ? 'مستخدمين جدد' : 'New Users', value: analytics.overview.newUsersThisMonth, color: 'from-green-500 to-emerald-500', trend: 8 },
    { icon: Briefcase, label: language === 'ar' ? 'الوظائف النشطة' : 'Active Jobs', value: analytics.overview.activeJobs, color: 'from-purple-500 to-pink-500', trend: -3 },
    { icon: Activity, label: language === 'ar' ? 'معدل التحويل' : 'Conversion Rate', value: `${analytics.overview.conversionRate}%`, color: 'from-orange-500 to-amber-500', trend: 5 },
  ]

  const roleLabels: Record<string, { en: string; ar: string }> = {
    player: { en: 'Players', ar: 'اللاعبين' },
    coach: { en: 'Coaches', ar: 'المدربين' },
    club: { en: 'Clubs', ar: 'الأندية' },
    specialist: { en: 'Specialists', ar: 'المتخصصين' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/leader')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'التحليلات' : 'Analytics'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{Math.abs(stat.trend)}%</span>
                        <span className="text-gray-400">
                          {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'توزيع المستخدمين حسب الدور' : 'Users by Role'}
                </h3>
                <div className="space-y-4">
                  {Object.entries(analytics.usersByRole).map(([role, count], index) => (
                    <div key={role} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {language === 'ar' ? roleLabels[role]?.ar || role : roleLabels[role]?.en || role}
                          </span>
                          <span className="text-sm text-gray-500">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / analytics.overview.totalUsers) * 100}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {language === 'ar' ? 'تسجيلات جديدة اليوم' : 'New registrations today'}
                      </p>
                      <p className="text-sm text-gray-500">24 {language === 'ar' ? 'مستخدم' : 'users'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {language === 'ar' ? 'وظائف جديدة' : 'New jobs posted'}
                      </p>
                      <p className="text-sm text-gray-500">12 {language === 'ar' ? 'وظيفة' : 'jobs'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {language === 'ar' ? 'مشاهدات الملفات' : 'Profile views'}
                      </p>
                      <p className="text-sm text-gray-500">1,234 {language === 'ar' ? 'مشاهدة' : 'views'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
