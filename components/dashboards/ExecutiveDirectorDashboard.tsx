'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import executiveDirectorService, {
  DashboardStats,
  KPI,
  Initiative
} from '@/services/executive-director'
import { JobNotificationsModule } from '@/components/job-notifications/JobNotificationsModule'
import {
  Users,
  Calendar,
  TrendingUp,
  XCircle,
  Loader2,
  LogOut,
  BarChart3,
  Target,
  Activity,
  DollarSign,
  PieChart,
  LineChart,
  Globe,
  Megaphone,
  FileCheck,
  TrendingDown,
  Plus,
  X,
  ChevronRight,
  RefreshCw,
  Briefcase,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ExecutiveDirectorDashboard = () => {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalMembers: 0,
    activePartnerships: 0,
    pendingDecisions: 0,
    upcomingMeetings: 0,
    newMembers: 0,
    memberRetention: 0
  })
  const [kpis, setKpis] = useState<KPI[]>([])
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [showNewInitiativeModal, setShowNewInitiativeModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newInitiative, setNewInitiative] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    deadline: '',
    owner: '',
    ownerAr: '',
    department: '',
    departmentAr: '',
    budget: 0
  })

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null)
      
      const [dashboardData, kpisData, initiativesData] = await Promise.allSettled([
        executiveDirectorService.getDashboard(),
        executiveDirectorService.getKPIs(),
        executiveDirectorService.getInitiatives({ status: 'in-progress' })
      ])

      if (dashboardData.status === 'fulfilled') {
        setStats(dashboardData.value)
      }

      if (kpisData.status === 'fulfilled') {
        setKpis(kpisData.value.slice(0, 4))
      }

      if (initiativesData.status === 'fulfilled') {
        setInitiatives(initiativesData.value.slice(0, 4))
      }

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || (language === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [language])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    toast.success(language === 'ar' ? 'تم تحديث البيانات' : 'Data refreshed')
  }

  const handleCreateInitiative = async () => {
    if (!newInitiative.title || !newInitiative.titleAr || !newInitiative.deadline) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    try {
      setSaving(true)
      await executiveDirectorService.createInitiative({
        ...newInitiative,
        progress: 0,
        spent: 0,
        tasks: []
      })
      toast.success(language === 'ar' ? 'تم إنشاء المبادرة بنجاح' : 'Initiative created successfully')
      setShowNewInitiativeModal(false)
      setNewInitiative({
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        status: 'planning',
        priority: 'medium',
        deadline: '',
        owner: '',
        ownerAr: '',
        department: '',
        departmentAr: '',
        budget: 0
      })
      await fetchDashboardData()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل إنشاء المبادرة' : 'Failed to create initiative'))
    } finally {
      setSaving(false)
    }
  }

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
              onClick={() => {
                setLoading(true)
                fetchDashboardData()
              }}
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
    { icon: DollarSign, label: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', value: `${(stats.totalRevenue / 1000000).toFixed(1)}M SAR`, color: 'from-purple-500 to-indigo-500', href: '/dashboard/executive-director/reports' },
    { icon: TrendingUp, label: language === 'ar' ? 'النمو الشهري' : 'Monthly Growth', value: `+${stats.monthlyGrowth}%`, color: 'from-green-500 to-emerald-500', href: '/dashboard/executive-director/analytics' },
    { icon: Users, label: language === 'ar' ? 'إجمالي الأعضاء' : 'Total Members', value: stats.totalMembers, color: 'from-blue-500 to-cyan-500', href: '/dashboard/executive-director/analytics' },
    { icon: Globe, label: language === 'ar' ? 'الشراكات النشطة' : 'Active Partnerships', value: stats.activePartnerships, color: 'from-pink-500 to-rose-500', href: '/dashboard/executive-director/partnerships' },
    { icon: FileCheck, label: language === 'ar' ? 'قرارات معلقة' : 'Pending Decisions', value: stats.pendingDecisions, color: 'from-yellow-500 to-orange-500', href: '/dashboard/executive-director/decisions' },
    { icon: Calendar, label: language === 'ar' ? 'اجتماعات قادمة' : 'Upcoming Meetings', value: stats.upcomingMeetings, color: 'from-cyan-500 to-teal-500', href: '/dashboard/executive-director/meetings' },
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-gray-600"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <GlobalSearchButton />
              <Link href="/dashboard/executive-director/job-notifications">
                <Button variant="ghost" size="sm" className="relative text-gray-600">
                  <Briefcase className="w-5 h-5" />
                </Button>
              </Link>
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
            <Link key={index} href={stat.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
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
            </Link>
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
              <Link href="/dashboard/executive-director/kpis">
                <Button variant="ghost" size="sm">
                  <PieChart className="w-5 h-5 text-gray-400" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {kpis.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {language === 'ar' ? 'لا توجد مؤشرات أداء' : 'No KPIs available'}
                </div>
              ) : (
                kpis.map((kpi) => (
                  <Link key={kpi.id} href={`/dashboard/executive-director/kpis/${kpi.id}`}>
                    <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
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
                  </Link>
                ))
              )}
              <Link href="/dashboard/executive-director/kpis">
                <Button variant="outline" className="w-full mt-4">
                  {language === 'ar' ? 'عرض جميع المؤشرات' : 'View All KPIs'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
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
              <Button 
                onClick={() => setShowNewInitiativeModal(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'مبادرة جديدة' : 'New Initiative'}
              </Button>
            </div>
            <div className="space-y-4">
              {initiatives.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {language === 'ar' ? 'لا توجد مبادرات نشطة' : 'No active initiatives'}
                </div>
              ) : (
                initiatives.map((initiative) => (
                  <Link key={initiative.id} href={`/dashboard/executive-director/initiatives/${initiative.id}`}>
                    <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
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
                          initiative.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {initiative.status === 'completed' ? (language === 'ar' ? 'مكتمل' : 'Completed') :
                           initiative.status === 'in-progress' ? (language === 'ar' ? 'قيد التنفيذ' : 'In Progress') :
                           initiative.status === 'on-hold' ? (language === 'ar' ? 'معلق' : 'On Hold') :
                           (language === 'ar' ? 'تخطيط' : 'Planning')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>{language === 'ar' ? 'الموعد النهائي:' : 'Deadline:'} {new Date(initiative.deadline).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                        <span>{initiative.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${initiative.progress}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                ))
              )}
              <Link href="/dashboard/executive-director/initiatives">
                <Button variant="outline" className="w-full mt-4">
                  {language === 'ar' ? 'عرض جميع المبادرات' : 'View All Initiatives'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <JobNotificationsModule dashboardType="executive-director" maxItems={5} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {[
              { icon: LineChart, label: language === 'ar' ? 'التحليلات' : 'Analytics', href: '/dashboard/executive-director/analytics', color: 'from-blue-500 to-cyan-500' },
              { icon: FileText, label: language === 'ar' ? 'التقارير' : 'Reports', href: '/dashboard/executive-director/reports', color: 'from-green-500 to-emerald-500' },
              { icon: Globe, label: language === 'ar' ? 'الشراكات' : 'Partnerships', href: '/dashboard/executive-director/partnerships', color: 'from-pink-500 to-rose-500' },
              { icon: Megaphone, label: language === 'ar' ? 'الإعلانات' : 'Announcements', href: '/dashboard/executive-director/announcements', color: 'from-yellow-500 to-orange-500' },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 flex-1">{action.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {showNewInitiativeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewInitiativeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'مبادرة استراتيجية جديدة' : 'New Strategic Initiative'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowNewInitiativeModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'} *
                    </label>
                    <input
                      type="text"
                      value={newInitiative.title}
                      onChange={(e) => setNewInitiative({ ...newInitiative, title: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'} *
                    </label>
                    <input
                      type="text"
                      value={newInitiative.titleAr}
                      onChange={(e) => setNewInitiative({ ...newInitiative, titleAr: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الأولوية' : 'Priority'}
                    </label>
                    <select
                      value={newInitiative.priority}
                      onChange={(e) => setNewInitiative({ ...newInitiative, priority: e.target.value as any })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="high">{language === 'ar' ? 'عالية' : 'High'}</option>
                      <option value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
                      <option value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </label>
                    <select
                      value={newInitiative.status}
                      onChange={(e) => setNewInitiative({ ...newInitiative, status: e.target.value as any })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="planning">{language === 'ar' ? 'تخطيط' : 'Planning'}</option>
                      <option value="in-progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الموعد النهائي' : 'Deadline'} *
                    </label>
                    <input
                      type="date"
                      value={newInitiative.deadline}
                      onChange={(e) => setNewInitiative({ ...newInitiative, deadline: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الميزانية (ريال)' : 'Budget (SAR)'}
                    </label>
                    <input
                      type="number"
                      value={newInitiative.budget}
                      onChange={(e) => setNewInitiative({ ...newInitiative, budget: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'المسؤول' : 'Owner'}
                    </label>
                    <input
                      type="text"
                      value={newInitiative.owner}
                      onChange={(e) => setNewInitiative({ ...newInitiative, owner: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'القسم' : 'Department'}
                    </label>
                    <input
                      type="text"
                      value={newInitiative.department}
                      onChange={(e) => setNewInitiative({ ...newInitiative, department: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </label>
                  <textarea
                    value={newInitiative.description}
                    onChange={(e) => setNewInitiative({ ...newInitiative, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewInitiativeModal(false)}
                    className="flex-1"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleCreateInitiative}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'إنشاء' : 'Create'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExecutiveDirectorDashboard
