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
import sportsDirectorService, { 
  DashboardStats, 
  SportsProgram, 
  CoachPerformance,
  Notification 
} from '@/services/sports-director'
import {
  Users,
  Calendar,
  User,
  TrendingUp,
  Clock,
  XCircle,
  Award,
  Loader2,
  LogOut,
  BarChart3,
  Trophy,
  Dumbbell,
  Medal,
  Star,
  Zap,
  Bell,
  Eye,
  MessageSquare,
  ChevronRight,
  Plus,
  X,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NotificationBell from '@/components/notifications/NotificationBell'

const SportsDirectorDashboard = () => {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    activePrograms: 0,
    totalAthletes: 0,
    coachingStaff: 0,
    upcomingEvents: 0,
    winRate: 0,
    trainingHours: 0,
    pendingApprovals: 0,
    recentMatches: 0,
    totalWins: 0,
    totalMatches: 0
  })
  const [programs, setPrograms] = useState<SportsProgram[]>([])
  const [coachPerformances, setCoachPerformances] = useState<CoachPerformance[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showNewProgramModal, setShowNewProgramModal] = useState(false)
  const [newProgram, setNewProgram] = useState({
    name: '',
    nameAr: '',
    type: 'training' as const,
    description: '',
    descriptionAr: '',
    startDate: '',
    endDate: '',
    maxParticipants: 50
  })
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null)
      
      const [dashboardData, programsData, coachData, notificationsData] = await Promise.allSettled([
        sportsDirectorService.getDashboard(),
        sportsDirectorService.getPrograms({ status: 'active' }),
        sportsDirectorService.getCoachPerformance(),
        sportsDirectorService.getNotifications()
      ])

      if (dashboardData.status === 'fulfilled') {
        setStats(dashboardData.value)
      }

      if (programsData.status === 'fulfilled') {
        setPrograms(programsData.value.slice(0, 4))
      }

      if (coachData.status === 'fulfilled') {
        setCoachPerformances(coachData.value.slice(0, 4))
      }

      if (notificationsData.status === 'fulfilled') {
        setNotifications(notificationsData.value)
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

  const handleCreateProgram = async () => {
    if (!newProgram.name || !newProgram.nameAr || !newProgram.startDate || !newProgram.endDate) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    try {
      setSaving(true)
      await sportsDirectorService.createProgram({
        ...newProgram,
        participants: 0,
        progress: 0,
        status: 'upcoming',
        coaches: []
      })
      toast.success(language === 'ar' ? 'تم إنشاء البرنامج بنجاح' : 'Program created successfully')
      setShowNewProgramModal(false)
      setNewProgram({
        name: '',
        nameAr: '',
        type: 'training',
        description: '',
        descriptionAr: '',
        startDate: '',
        endDate: '',
        maxParticipants: 50
      })
      await fetchDashboardData()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل إنشاء البرنامج' : 'Failed to create program'))
    } finally {
      setSaving(false)
    }
  }

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await sportsDirectorService.markNotificationRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      console.error('Failed to mark notification read:', err)
    }
  }

  const displayName = user?.firstName || (language === 'ar' ? 'المدير الرياضي' : 'Sports Director')
  const unreadCount = notifications.filter(n => !n.read).length

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
              onClick={() => {
                setLoading(true)
                fetchDashboardData()
              }}
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
    { icon: Dumbbell, label: language === 'ar' ? 'البرامج النشطة' : 'Active Programs', value: stats.activePrograms, color: 'from-indigo-500 to-blue-500', href: '/dashboard/sports-director/programs' },
    { icon: Users, label: language === 'ar' ? 'الرياضيين' : 'Athletes', value: stats.totalAthletes, color: 'from-blue-500 to-cyan-500', href: '/dashboard/sports-director/athletes' },
    { icon: Award, label: language === 'ar' ? 'الطاقم الفني' : 'Coaching Staff', value: stats.coachingStaff, color: 'from-purple-500 to-pink-500', href: '/dashboard/sports-director/coaches' },
    { icon: Calendar, label: language === 'ar' ? 'الأحداث القادمة' : 'Upcoming Events', value: stats.upcomingEvents, color: 'from-green-500 to-emerald-500', href: '/dashboard/sports-director/events' },
    { icon: Trophy, label: language === 'ar' ? 'نسبة الفوز' : 'Win Rate', value: `${stats.winRate}%`, color: 'from-yellow-500 to-orange-500', href: '/dashboard/sports-director/reports' },
    { icon: Clock, label: language === 'ar' ? 'ساعات التدريب' : 'Training Hours', value: stats.trainingHours.toLocaleString(), color: 'from-cyan-500 to-teal-500', href: '/dashboard/sports-director/reports' },
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
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-gray-600"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900">
                            {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNotifications(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleMarkNotificationRead(notification.id)}
                              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                            >
                              <p className="font-medium text-gray-900 text-sm">
                                {language === 'ar' ? notification.titleAr : notification.title}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                {language === 'ar' ? notification.messageAr : notification.message}
                              </p>
                              <p className="text-gray-400 text-xs mt-2">
                                {new Date(notification.timestamp).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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
                {language === 'ar' ? 'البرامج الرياضية' : 'Sports Programs'}
              </h2>
              <Button 
                onClick={() => setShowNewProgramModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'برنامج جديد' : 'New Program'}
              </Button>
            </div>
            <div className="space-y-4">
              {programs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {language === 'ar' ? 'لا توجد برامج نشطة' : 'No active programs'}
                </div>
              ) : (
                programs.map((program) => (
                  <Link key={program.id} href={`/dashboard/sports-director/programs/${program.id}`}>
                    <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
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
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            program.status === 'active' ? 'bg-green-100 text-green-800' :
                            program.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            program.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {program.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') :
                             program.status === 'completed' ? (language === 'ar' ? 'مكتمل' : 'Completed') :
                             program.status === 'inactive' ? (language === 'ar' ? 'متوقف' : 'Inactive') :
                             (language === 'ar' ? 'قادم' : 'Upcoming')}
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${program.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{program.progress}% {language === 'ar' ? 'مكتمل' : 'complete'}</p>
                    </div>
                  </Link>
                ))
              )}
              <Link href="/dashboard/sports-director/programs">
                <Button variant="outline" className="w-full mt-4">
                  {language === 'ar' ? 'عرض جميع البرامج' : 'View All Programs'}
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
                {language === 'ar' ? 'أداء المدربين' : 'Coach Performance'}
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
                  />
                </div>
                <Link href="/dashboard/sports-director/coaches">
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {coachPerformances.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {language === 'ar' ? 'لا توجد بيانات للمدربين' : 'No coach data available'}
                </div>
              ) : (
                coachPerformances
                  .filter(coach => 
                    searchQuery === '' || 
                    coach.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((coach, index) => (
                    <Link key={coach.id} href={`/dashboard/sports-director/coaches/${coach.coachId || coach.id}`}>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
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
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-gray-900">{coach.rating}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="p-1" onClick={(e) => {
                              e.preventDefault()
                              router.push(`/messages?to=${coach.coachId || coach.id}`)
                            }}>
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1">
                              <Eye className="w-4 h-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
              )}
              <Link href="/dashboard/sports-director/coaches">
                <Button variant="outline" className="w-full mt-4">
                  {language === 'ar' ? 'عرض جميع المدربين' : 'View All Coaches'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
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

      <AnimatePresence>
        {showNewProgramModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewProgramModal(false)}
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
                  {language === 'ar' ? 'برنامج جديد' : 'New Program'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowNewProgramModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}
                    </label>
                    <input
                      type="text"
                      value={newProgram.name}
                      onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={newProgram.nameAr}
                      onChange={(e) => setNewProgram({ ...newProgram, nameAr: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'النوع' : 'Type'}
                  </label>
                  <select
                    value={newProgram.type}
                    onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value as any })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="training">{language === 'ar' ? 'تدريب' : 'Training'}</option>
                    <option value="competition">{language === 'ar' ? 'مسابقة' : 'Competition'}</option>
                    <option value="development">{language === 'ar' ? 'تطوير' : 'Development'}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                    </label>
                    <input
                      type="date"
                      value={newProgram.startDate}
                      onChange={(e) => setNewProgram({ ...newProgram, startDate: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}
                    </label>
                    <input
                      type="date"
                      value={newProgram.endDate}
                      onChange={(e) => setNewProgram({ ...newProgram, endDate: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الحد الأقصى للمشاركين' : 'Max Participants'}
                  </label>
                  <input
                    type="number"
                    value={newProgram.maxParticipants}
                    onChange={(e) => setNewProgram({ ...newProgram, maxParticipants: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
                  </label>
                  <textarea
                    value={newProgram.description}
                    onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    value={newProgram.descriptionAr}
                    onChange={(e) => setNewProgram({ ...newProgram, descriptionAr: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    dir="rtl"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewProgramModal(false)}
                    className="flex-1"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleCreateProgram}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
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

export default SportsDirectorDashboard
