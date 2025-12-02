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
  DollarSign,
  PieChart,
  LineChart,
  Building2,
  Globe,
  Megaphone,
  FileCheck,
  TrendingDown
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface KPI {
  id: string
  name: string
  nameAr: string
  value: number
  target: number
  trend: 'up' | 'down' | 'stable'
  unit: string
}

interface Initiative {
  id: string
  title: string
  titleAr: string
  status: 'planning' | 'in-progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  deadline: string
  progress: number
}

interface DashboardStats {
  totalRevenue: number
  monthlyGrowth: number
  totalMembers: number
  activePartnerships: number
  pendingDecisions: number
  upcomingMeetings: number
}

const ExecutiveDirectorDashboard = () => {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalMembers: 0,
    activePartnerships: 0,
    pendingDecisions: 0,
    upcomingMeetings: 0
  })
  const [kpis, setKpis] = useState<KPI[]>([])
  const [initiatives, setInitiatives] = useState<Initiative[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalRevenue: 2450000,
          monthlyGrowth: 12.5,
          totalMembers: 3200,
          activePartnerships: 18,
          pendingDecisions: 7,
          upcomingMeetings: 4
        })

        setKpis([
          { id: '1', name: 'Member Satisfaction', nameAr: 'رضا الأعضاء', value: 92, target: 95, trend: 'up', unit: '%' },
          { id: '2', name: 'Revenue Growth', nameAr: 'نمو الإيرادات', value: 15, target: 20, trend: 'up', unit: '%' },
          { id: '3', name: 'Staff Retention', nameAr: 'الاحتفاظ بالموظفين', value: 88, target: 90, trend: 'stable', unit: '%' },
          { id: '4', name: 'Program Completion', nameAr: 'إكمال البرامج', value: 78, target: 85, trend: 'down', unit: '%' },
        ])

        setInitiatives([
          { id: '1', title: 'Digital Transformation', titleAr: 'التحول الرقمي', status: 'in-progress', priority: 'high', deadline: '2024-06-30', progress: 65 },
          { id: '2', title: 'Youth Academy Expansion', titleAr: 'توسعة أكاديمية الشباب', status: 'planning', priority: 'high', deadline: '2024-09-15', progress: 25 },
          { id: '3', title: 'Partnership Program', titleAr: 'برنامج الشراكات', status: 'in-progress', priority: 'medium', deadline: '2024-04-30', progress: 80 },
          { id: '4', title: 'Sustainability Initiative', titleAr: 'مبادرة الاستدامة', status: 'planning', priority: 'low', deadline: '2024-12-31', progress: 10 },
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

  const displayName = user?.firstName || (language === 'ar' ? 'المدير التنفيذي' : 'Executive Director')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
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
            <Loader2 className="w-12 h-12 text-purple-600" />
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
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
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const statCards = [
    { icon: DollarSign, label: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', value: `${(stats.totalRevenue / 1000000).toFixed(1)}M SAR`, color: 'from-purple-500 to-indigo-500' },
    { icon: TrendingUp, label: language === 'ar' ? 'النمو الشهري' : 'Monthly Growth', value: `+${stats.monthlyGrowth}%`, color: 'from-green-500 to-emerald-500' },
    { icon: Users, label: language === 'ar' ? 'إجمالي الأعضاء' : 'Total Members', value: stats.totalMembers, color: 'from-blue-500 to-cyan-500' },
    { icon: Globe, label: language === 'ar' ? 'الشراكات النشطة' : 'Active Partnerships', value: stats.activePartnerships, color: 'from-pink-500 to-rose-500' },
    { icon: FileCheck, label: language === 'ar' ? 'قرارات معلقة' : 'Pending Decisions', value: stats.pendingDecisions, color: 'from-yellow-500 to-orange-500' },
    { icon: Calendar, label: language === 'ar' ? 'اجتماعات قادمة' : 'Upcoming Meetings', value: stats.upcomingMeetings, color: 'from-cyan-500 to-teal-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  TF1
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">
                {language === 'ar' ? 'المدير التنفيذي' : 'Executive Director'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <GlobalSearchButton />
              <MessageNotificationBadge dashboardType="executive-director" />
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
            {language === 'ar' ? 'نظرة عامة على الأداء الاستراتيجي' : 'Strategic performance overview'}
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
                {language === 'ar' ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
              </h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{language === 'ar' ? kpi.nameAr : kpi.name}</span>
                    <div className="flex items-center gap-2">
                      {kpi.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {kpi.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {kpi.trend === 'stable' && <Activity className="w-4 h-4 text-yellow-500" />}
                      <span className="font-bold text-gray-900">{kpi.value}{kpi.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          kpi.value >= kpi.target ? 'bg-green-500' :
                          kpi.value >= kpi.target * 0.8 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{language === 'ar' ? 'الهدف:' : 'Target:'} {kpi.target}{kpi.unit}</span>
                  </div>
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
                {language === 'ar' ? 'المبادرات الاستراتيجية' : 'Strategic Initiatives'}
              </h2>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <Target className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'مبادرة جديدة' : 'New Initiative'}
              </Button>
            </div>
            <div className="space-y-4">
              {initiatives.map((initiative) => (
                <div key={initiative.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        initiative.priority === 'high' ? 'bg-red-500' :
                        initiative.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <span className="font-medium text-gray-900">{language === 'ar' ? initiative.titleAr : initiative.title}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      initiative.status === 'completed' ? 'bg-green-100 text-green-800' :
                      initiative.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {initiative.status === 'completed' ? (language === 'ar' ? 'مكتمل' : 'Completed') :
                       initiative.status === 'in-progress' ? (language === 'ar' ? 'قيد التنفيذ' : 'In Progress') :
                       (language === 'ar' ? 'تخطيط' : 'Planning')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{language === 'ar' ? 'الموعد النهائي:' : 'Deadline:'} {initiative.deadline}</span>
                    <span>{initiative.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                      style={{ width: `${initiative.progress}%` }}
                    />
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
            { icon: LineChart, label: language === 'ar' ? 'التحليلات' : 'Analytics', href: '/dashboard/executive-director/analytics' },
            { icon: FileText, label: language === 'ar' ? 'التقارير' : 'Reports', href: '/dashboard/executive-director/reports' },
            { icon: Globe, label: language === 'ar' ? 'الشراكات' : 'Partnerships', href: '/dashboard/executive-director/partnerships' },
            { icon: Megaphone, label: language === 'ar' ? 'الإعلانات' : 'Announcements', href: '/dashboard/executive-director/announcements' },
          ].map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
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

export default ExecutiveDirectorDashboard
