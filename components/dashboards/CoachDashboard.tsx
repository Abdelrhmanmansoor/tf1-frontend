'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { useRouter } from 'next/navigation'
import coachService from '@/services/coach'
import authService from '@/services/auth'
import type { DashboardStats } from '@/types/coach'
import {
  Users,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Settings,
  Edit,
  Image as ImageIcon,
  Lock,
  Activity,
  Loader2,
  User,
  Bell,
  LogOut,
  Briefcase,
} from 'lucide-react'
import JobNotifications from '@/components/notifications/JobNotifications'

const CoachDashboard = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get user name
        const user = authService.getCurrentUser()
        if (user?.firstName) {
          setUserName(user.firstName)
        }

        // Fetch dashboard stats
        const dashboardStats = await coachService.getDashboardStats()
        console.log('[CoachDashboard] Received stats:', dashboardStats)
        console.log('[CoachDashboard] Profile data:', dashboardStats.profile)
        console.log(
          '[CoachDashboard] Completion %:',
          dashboardStats.profile?.completionPercentage
        )

        // Ensure profile object exists with defaults
        const statsWithDefaults: DashboardStats = {
          profile: dashboardStats.profile || {
            completionPercentage: 0,
            isVerified: false,
            rating: 0,
            totalReviews: 0,
          },
          students: dashboardStats.students || {
            total: 0,
            active: 0,
            former: 0,
            newThisMonth: 0,
          },
          sessions: dashboardStats.sessions || {
            total: 0,
            completed: 0,
            upcoming: 0,
            cancelled: 0,
            completionRate: 0,
          },
          availability: dashboardStats.availability || {
            nextAvailableSlot: '',
            totalWeeklySlots: 0,
            bookedSlotsThisWeek: 0,
          },
          recentActivity: dashboardStats.recentActivity || [],
        }

        setStats(statsWithDefaults)
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)

        // Check if error is "Profile not found" - redirect to setup
        if (
          err.message?.toLowerCase().includes('profile not found') ||
          err.status === 404
        ) {
          router.push('/dashboard/coach/setup')
          return
        }

        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
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
            <Loader2 className="w-12 h-12 text-purple-600" />
          </motion.div>
          <p className="text-gray-600 text-lg">
            {language === 'ar'
              ? 'جاري تحميل لوحة التحكم...'
              : 'Loading Dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
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

  if (!stats) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {language === 'ar'
                  ? `مرحباً ${userName || 'المدرب'}!`
                  : `Welcome ${userName || 'Coach'}!`}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ar'
                  ? 'إليك نظرة عامة على أدائك وإحصائياتك'
                  : "Here's an overview of your performance and statistics"}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <GlobalSearchButton variant="outline" showLabel={true} />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/coach/profile')}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
              </motion.button>
              <LanguageSelector />
              <MessageNotificationBadge dashboardType="coach" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/coach/profile/edit')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {language === 'ar' ? 'تعديل الملف' : 'Edit Profile'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  authService.logout()
                  router.push('/login')
                }}
                className="bg-white border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Notifications */}
        {stats && (authService.getCurrentUser()?.id || (authService.getCurrentUser() as any)?._id) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <JobNotifications 
              userId={authService.getCurrentUser()?.id || (authService.getCurrentUser() as any)?._id} 
            />
          </motion.div>
        )}

        {/* Profile Completion Alert */}
        {stats.profile?.completionPercentage !== undefined &&
          stats.profile.completionPercentage < 100 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 rounded-full p-2">
                  <Bell className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {language === 'ar'
                      ? 'أكمل ملفك الشخصي للحصول على المزيد من الفرص'
                      : 'Complete your profile for more opportunities'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {language === 'ar'
                      ? `ملفك الشخصي مكتمل بنسبة ${stats.profile.completionPercentage}%`
                      : `Your profile is ${stats.profile.completionPercentage}% complete`}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${stats.profile.completionPercentage}%`,
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                    />
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/coach/profile/edit')}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    {language === 'ar' ? 'أكمل الآن' : 'Complete Now'} →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Students Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </div>
                <div className="text-lg font-bold">{stats.students.active}</div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">
                {stats.students.total}
              </h3>
              <p className="text-blue-100 text-sm">
                {language === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                <span className="opacity-80">
                  {language === 'ar' ? 'جديد هذا الشهر' : 'New this month'}
                </span>
                <span className="font-semibold">
                  +{stats.students.newThisMonth}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Sessions Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'قادم' : 'Upcoming'}
                </div>
                <div className="text-lg font-bold text-green-600">
                  {stats.sessions.upcoming}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.sessions.total}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ar' ? 'إجمالي الجلسات' : 'Total Sessions'}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {language === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}
                </span>
                <span className="font-semibold text-green-600">
                  {stats.sessions.completionRate}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Rating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <Star className="w-6 h-6 fill-current" />
              </div>
              {stats.profile.isVerified && (
                <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {language === 'ar' ? 'موثق' : 'Verified'}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">
                {stats.profile.rating.toFixed(1)}
              </h3>
              <p className="text-yellow-100 text-sm">
                {language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                <span className="opacity-80">
                  {language === 'ar' ? 'التقييمات' : 'Reviews'}
                </span>
                <span className="font-semibold">
                  {stats.profile.totalReviews}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Profile Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                {stats.profile.completionPercentage}%
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">
                {stats.students.former}
              </h3>
              <p className="text-purple-200 text-sm">
                {language === 'ar' ? 'الطلاب السابقون' : 'Former Students'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                <span className="opacity-80">
                  {language === 'ar' ? 'اكتمال الملف' : 'Profile Complete'}
                </span>
                <span className="font-semibold">
                  {stats.profile.completionPercentage}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Availability Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 rounded-full p-3">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'التوفر' : 'Availability'}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'الفترة المتاحة القادمة'
                    : 'Next Available'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.availability.nextAvailableSlot
                    ? new Date(
                        stats.availability.nextAvailableSlot
                      ).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )
                    : language === 'ar'
                      ? 'غير متاح'
                      : 'Not available'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'فترات هذا الأسبوع' : 'Weekly Slots'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.availability.bookedSlotsThisWeek} /{' '}
                  {stats.availability.totalWeeklySlots}
                </span>
              </div>
              <button
                onClick={() => router.push('/dashboard/coach/availability')}
                className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-semibold"
              >
                {language === 'ar' ? 'إدارة التوفر' : 'Manage Availability'}
              </button>
            </div>
          </motion.div>

          {/* Session Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'ملخص الجلسات' : 'Session Summary'}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'مكتملة' : 'Completed'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.sessions.completed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-600">
                    {language === 'ar' ? 'ملغاة' : 'Cancelled'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.sessions.cancelled}
                </span>
              </div>
              <button
                onClick={() => router.push('/dashboard/coach/sessions')}
                className="w-full bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
              >
                {language === 'ar' ? 'عرض الجلسات' : 'View Sessions'}
              </button>
            </div>
          </motion.div>

          {/* Student Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'رؤى الطلاب' : 'Student Insights'}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'جديد هذا الشهر' : 'New This Month'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.students.newThisMonth}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'الطلاب السابقون' : 'Former Students'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.students.former}
                </span>
              </div>
              <button
                onClick={() => router.push('/dashboard/coach/students')}
                className="w-full bg-purple-50 text-purple-600 py-2 rounded-lg hover:bg-purple-100 transition-colors text-sm font-semibold"
              >
                {language === 'ar' ? 'عرض الطلاب' : 'View Students'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </h2>
          </div>
          <div className="space-y-4">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="bg-purple-100 rounded-full p-2 mt-1">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 capitalize">
                    {activity.type}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  {language === 'ar'
                    ? 'لا يوجد نشاط حديث'
                    : 'No recent activity'}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 shadow-xl text-white"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5" />
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/coach/opportunities')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center"
            >
              <Briefcase className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-semibold">
                {language === 'ar' ? 'الوظائف' : 'Jobs'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/coach/profile/edit')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center"
            >
              <Settings className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-semibold">
                {language === 'ar' ? 'إعدادات' : 'Settings'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/coach/gallery')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center"
            >
              <ImageIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-semibold">
                {language === 'ar' ? 'المعرض' : 'Gallery'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/coach/privacy')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center"
            >
              <Lock className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-semibold">
                {language === 'ar' ? 'الخصوصية' : 'Privacy'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/coach/students')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center"
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-semibold">
                {language === 'ar' ? 'الطلاب' : 'Students'}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CoachDashboard
