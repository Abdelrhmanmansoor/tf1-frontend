'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { useRouter } from 'next/navigation'
import clubService from '@/services/club'
import authService from '@/services/auth'
import type { DashboardStats } from '@/types/club'
import {
  Users,
  Star,
  Briefcase,
  CheckCircle,
  XCircle,
  Award,
  Settings,
  Edit,
  Image as ImageIcon,
  Lock,
  Loader2,
  Bell,
  LogOut,
  Building2,
  UserPlus,
  CalendarCheck,
  MapPinned,
} from 'lucide-react'
import Link from 'next/link'
import JobNotifications from '@/components/notifications/JobNotifications'
import NotificationBell from '@/components/notifications/NotificationBell'

const ClubDashboard = () => {
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
        const dashboardStats = await clubService.getDashboardStats()
        console.log('[ClubDashboard] Received stats:', dashboardStats)

        // Check if profile exists - if not, redirect to setup
        if (!dashboardStats.profile || !dashboardStats.profile.clubName) {
          console.log('[ClubDashboard] No profile found, redirecting to setup')
          router.push('/dashboard/club/setup')
          return
        }

        // Ensure all objects exist with defaults
        const statsWithDefaults: DashboardStats = {
          profile: dashboardStats.profile || {
            clubName: '',
            completionPercentage: 0,
            isVerified: false,
            rating: 0,
            totalReviews: 0,
          },
          members: dashboardStats.members || {
            total: 0,
            active: 0,
            players: 0,
            coaches: 0,
            specialists: 0,
            staff: 0,
            newThisMonth: 0,
            pendingRequests: 0,
          },
          teams: dashboardStats.teams || {
            total: 0,
          },
          recruitment: dashboardStats.recruitment || {
            activeJobs: 0,
            totalApplications: 0,
            pendingApplications: 0,
          },
          events: dashboardStats.events || {
            total: 0,
            upcoming: 0,
            upcomingList: [],
          },
          facilities: dashboardStats.facilities || {
            totalBookings: 0,
            pendingBookings: 0,
          },
          activity: dashboardStats.activity || {
            profileViews: 0,
            lastActivityDate: new Date().toISOString(),
          },
        }

        setStats(statsWithDefaults)
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)

        // Check if error is "Profile not found" - redirect to setup
        if (
          err.message?.toLowerCase().includes('profile not found') ||
          err.status === 404 ||
          err.message?.includes('Club profile not found')
        ) {
          console.log('[ClubDashboard] Profile not found, redirecting to setup')
          router.push('/dashboard/club/setup')
          return
        }

        // If 500 error, show helpful message
        if (err.status === 500) {
          setError(
            'Server error loading dashboard. Backend needs fixing: ' +
              (err.message || 'Unknown error')
          )
        } else {
          setError(err.message || 'Failed to load dashboard data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {language === 'ar'
                  ? `مرحباً ${stats.profile.clubName || userName || 'النادي'}!`
                  : `Welcome ${stats.profile.clubName || userName || 'Club'}!`}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ar'
                  ? 'إليك نظرة عامة على نشاط وإحصائيات النادي'
                  : "Here's an overview of your club activity and statistics"}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/dashboard/club/profile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                </motion.button>
              </Link>
              <GlobalSearchButton variant="outline" showLabel={true} />
              <LanguageSelector />
              <NotificationBell />
              <MessageNotificationBadge dashboardType="club" />
              <Link href="/dashboard/club/profile/edit">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {language === 'ar' ? 'تعديل الملف' : 'Edit Profile'}
                </motion.button>
              </Link>
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
                      ? 'أكمل ملف النادي للحصول على المزيد من الفرص'
                      : 'Complete club profile for more opportunities'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {language === 'ar'
                      ? `ملف النادي مكتمل بنسبة ${stats.profile.completionPercentage}%`
                      : `Club profile is ${stats.profile.completionPercentage}% complete`}
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
                    onClick={() => router.push('/dashboard/club/profile/edit')}
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
          {/* Total Members */}
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
                <div className="text-lg font-bold">{stats.members.active}</div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">{stats.members.total}</h3>
              <p className="text-blue-100 text-sm">
                {language === 'ar' ? 'إجمالي الأعضاء' : 'Total Members'}
              </p>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                <span className="opacity-80">
                  {language === 'ar' ? 'جديد هذا الشهر' : 'New this month'}
                </span>
                <span className="font-semibold">
                  +{stats.members.newThisMonth}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Teams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'فرق' : 'Teams'}
                </div>
                <div className="text-lg font-bold text-green-600">
                  {stats.teams.total}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.events.upcoming}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ar' ? 'فعاليات قادمة' : 'Upcoming Events'}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Link
                  href="/dashboard/club/events"
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {language === 'ar' ? 'عرض الفعاليات' : 'View Events'} →
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Rating */}
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

          {/* Job Applications */}
          <Link href="/dashboard/club/jobs">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-full p-3">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                  {stats.recruitment.activeJobs}{' '}
                  {language === 'ar' ? 'نشط' : 'Active'}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-1">
                  {stats.recruitment.totalApplications}
                </h3>
                <p className="text-purple-200 text-sm">
                  {language === 'ar' ? 'طلبات التوظيف' : 'Job Applications'}
                </p>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                  <span className="opacity-80">
                    {language === 'ar' ? 'معلق' : 'Pending'}
                  </span>
                  <span className="font-semibold">
                    {stats.recruitment.pendingApplications}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Member Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'تصنيف الأعضاء' : 'Member Breakdown'}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'لاعبون' : 'Players'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.members.players}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'مدربون' : 'Coaches'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.members.coaches}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'متخصصون' : 'Specialists'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.members.specialists}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'طاقم العمل' : 'Staff'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.members.staff}
                </span>
              </div>
            </div>
            <Link href="/dashboard/club/members">
              <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold mt-4">
                {language === 'ar' ? 'إدارة الأعضاء' : 'Manage Members'}
              </button>
            </Link>
          </motion.div>

          {/* Pending Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <CalendarCheck className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'طلبات معلقة' : 'Pending Requests'}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'عضويات' : 'Memberships'}
                </span>
                <span className="text-sm font-semibold text-orange-600">
                  {stats.members.pendingRequests}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'حجوزات' : 'Bookings'}
                </span>
                <span className="text-sm font-semibold text-orange-600">
                  {stats.facilities.pendingBookings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'طلبات توظيف' : 'Applications'}
                </span>
                <span className="text-sm font-semibold text-orange-600">
                  {stats.recruitment.pendingApplications}
                </span>
              </div>
            </div>
            <Link href="/dashboard/club/requests">
              <button className="w-full bg-orange-50 text-orange-600 py-2 rounded-lg hover:bg-orange-100 transition-colors text-sm font-semibold mt-4">
                {language === 'ar' ? 'مراجعة الطلبات' : 'Review Requests'}
              </button>
            </Link>
           
          </motion.div>

          {/* Facility Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <MapPinned className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'حجوزات المنشآت' : 'Facility Bookings'}
              </h3>
            </div>
            <div className="text-center py-4">
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                {stats.facilities.totalBookings}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}
              </p>
            </div>
            <Link href="/dashboard/club/bookings">
              <button className="w-full bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold mt-4">
                {language === 'ar' ? 'إدارة الحجوزات' : 'Manage Bookings'}
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl text-white"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5" />
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link href="/dashboard/club/jobs">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center w-full"
              >
                <Briefcase className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">
                  {language === 'ar' ? 'الوظائف' : 'Jobs'}
                </span>
              </motion.button>
            </Link>

            <Link href="/dashboard/club/profile/edit">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center w-full"
              >
                <Settings className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">
                  {language === 'ar' ? 'إعدادات' : 'Settings'}
                </span>
              </motion.button>
            </Link>

            <Link href="/dashboard/club/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center w-full"
              >
                <ImageIcon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">
                  {language === 'ar' ? 'المعرض' : 'Gallery'}
                </span>
              </motion.button>
            </Link>

            <Link href="/dashboard/club/privacy">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center w-full"
              >
                <Lock className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">
                  {language === 'ar' ? 'الخصوصية' : 'Privacy'}
                </span>
              </motion.button>
            </Link>

            <Link href="/dashboard/club/teams">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center w-full"
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-semibold">
                  {language === 'ar' ? 'الفرق' : 'Teams'}
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ClubDashboard
