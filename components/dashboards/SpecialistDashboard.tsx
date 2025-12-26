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
  Star,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Settings,
  Image as ImageIcon,
  Lock,
  Activity,
  Loader2,
  LogOut,
  Briefcase,
  AlertCircle,
  Edit,
  ShieldCheck
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  getDashboardStats,
  getTodaySessions,
  getMyProfile,
  type DashboardStats,
  type Session,
  type SpecialistProfile,
} from '@/services/specialist'
import JobNotifications from '@/components/notifications/JobNotifications'

const SpecialistDashboard = () => {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  // State management
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [_todaySessions, setTodaySessions] = useState<Session[]>([])
  const [profile, setProfile] = useState<SpecialistProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch dashboard stats, today's sessions, and profile in parallel
        const [statsResponse, sessionsResponse, profileResponse] = await Promise.all([
          getDashboardStats(),
          getTodaySessions(),
          getMyProfile(),
        ])

        setDashboardStats(statsResponse.stats)
        setTodaySessions(sessionsResponse.sessions)
        setProfile(profileResponse.profile)
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)

        // Check if error is "Profile not found" - redirect to setup
        if (
          err.response?.data?.message?.toLowerCase().includes('profile not found') ||
          err.response?.status === 404
        ) {
          router.push('/dashboard/specialist/setup')
          return
        }

        setError(err.response?.data?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  // Helper function to calculate profile completion
  const getProfileCompletion = () => {
    if (!profile) return 0

    const fields = [
      typeof profile.bio === 'string' ? !!profile.bio : !!(profile.bio?.en || profile.bio?.ar),
      (profile as any).previousExperience?.length > 0,
      (profile.certifications?.length ?? 0) > 0,
      (profile as any).professionalAssociations?.length > 0,
      !!((profile as any).experienceYears || profile.yearsOfExperience),
      profile.languages?.length > 0,
      (profile.serviceLocations?.length ?? 0) > 0,
      (profile.consultationTypes?.length ?? 0) > 0,
      !!profile.onlineConsultation,
      (profile.additionalSpecializations?.length ?? 0) > 0,
    ]

    const completedCount = fields.filter(Boolean).length
    return Math.round((completedCount / fields.length) * 100)
  }

  // Get display name
  const displayName = user?.firstName || 'Specialist'

  // Loading state
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
            {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  // Error state
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

  const profileCompletion = getProfileCompletion()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {language === 'ar' ? `مرحباً ${displayName}!` : `Welcome ${displayName}!`}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ar'
                  ? 'إليك نظرة عامة على أدائك وإحصائياتك'
                  : "Here's an overview of your performance and stats"}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <GlobalSearchButton variant="outline" showLabel={true} />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/specialist/profile')}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
              </motion.button>
              <LanguageSelector />
              <MessageNotificationBadge dashboardType="specialist" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/specialist/profile/edit')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {language === 'ar' ? 'تعديل الملف' : 'Edit Profile'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Notifications */}
        {profile && (user?.id || (user as any)?._id) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <JobNotifications 
              userId={user?.id || (user as any)?._id} 
            />
          </motion.div>
        )}

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-8 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {language === 'ar'
                    ? 'أكمل ملفك الشخصي للحصول على المزيد من الفرص'
                    : 'Complete your profile for more opportunities'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'ar'
                    ? `ملفك الشخصي مكتمل بنسبة ${profileCompletion}%`
                    : `Your profile is ${profileCompletion}% complete`}
                </p>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletion}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                    />
                  </div>
                </div>
                <Link href="/dashboard/specialist/profile/edit">
                  <Button
                    variant="link"
                    className="text-orange-600 hover:text-orange-700 p-0 h-auto mt-3"
                  >
                    {language === 'ar' ? 'أكمل الآن ←' : 'Complete Now →'}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                {language === 'ar' ? 'نشط' : 'Active'}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {dashboardStats?.clients?.total || 0}
            </div>
            <div className="text-white/90 text-sm">
              {language === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}
            </div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">
                  {language === 'ar' ? 'جديد هذا الشهر' : 'New this month'}
                </span>
                <span className="font-semibold">
                  +{dashboardStats?.clients?.newThisMonth || 0}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Total Sessions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">
                {language === 'ar' ? 'قادمة' : 'Upcoming'}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {dashboardStats?.thisWeekSessions?.upcoming || 0}
            </div>
            <div className="text-gray-600 text-sm">
              {language === 'ar' ? 'إجمالي الجلسات' : 'Total Sessions'}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {language === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}
                </span>
                <span className="font-semibold text-green-600">
                  {(dashboardStats?.thisWeekSessions?.completed ?? 0) > 0
                    ? Math.round(
                        (dashboardStats?.thisWeekSessions?.completed ?? 0) /
                          (dashboardStats?.thisWeekSessions?.total || 1)) *
                          100
                      : 0}
                  {(dashboardStats?.thisWeekSessions?.completed ?? 0) > 0
                    ? Math.round(
                        (dashboardStats?.thisWeekSessions?.completed ?? 0) /
                          (dashboardStats?.thisWeekSessions?.total || 1) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </motion.div>

          {/* Average Rating Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <Star className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">0.0</div>
            <div className="text-white/90 text-sm">
              {language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
            </div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">
                  {language === 'ar' ? 'المراجعات' : 'Reviews'}
                </span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </motion.div>

          {/* Former Students Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                {profileCompletion}%
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {(dashboardStats?.clients?.total ?? 0) - (dashboardStats?.clients?.active ?? 0)}
            </div>
            <div className="text-white/90 text-sm">
              {language === 'ar' ? 'الطلاب السابقون' : 'Former Students'}
            </div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">
                  {language === 'ar' ? 'اكتمال الملف الشخصي' : 'Profile Complete'}
                </span>
                <span className="font-semibold">{profileCompletion}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'التوفر' : 'Availability'}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'التالي المتاح' : 'Next Available'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'غير متاح' : 'Not available'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'الفتحات الأسبوعية' : 'Weekly Slots'}
                </span>
                <span className="text-sm font-semibold text-gray-900">0 / 0</span>
              </div>
              <button
                onClick={() => router.push('/dashboard/specialist/availability')}
                className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
              >
                {language === 'ar' ? 'إدارة التوفر' : 'Manage Availability'}
              </button>
            </div>
          </motion.div>

          {/* Session Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'ملخص الجلسة' : 'Session Summary'}
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
                  {dashboardStats?.thisWeekSessions?.completed || 0}
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
                  0
                </span>
              </div>
              <button
                onClick={() => router.push('/dashboard/specialist/sessions')}
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
            transition={{ duration: 0.5, delay: 0.7 }}
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
                  {dashboardStats?.clients?.newThisMonth || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {language === 'ar' ? 'الطلاب السابقون' : 'Former Students'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                    {(dashboardStats?.clients?.total ?? 0) - (dashboardStats?.clients?.active ?? 0)}
                </span>
              </div>
              <button
                onClick={() => router.push('/dashboard/specialist/students')}
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
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              {language === 'ar' ? 'لا يوجد نشاط حديث' : 'No recent activity'}
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
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
              onClick={() => router.push('/dashboard/specialist/opportunities')}
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
              onClick={() => router.push('/dashboard/specialist/profile/edit')}
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
              onClick={() => router.push('/dashboard/specialist/gallery')}
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
              onClick={() => router.push('/dashboard/specialist/privacy')}
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
              onClick={() => router.push('/dashboard/specialist/certifications')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all text-center"
            >
              <ShieldCheck className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-semibold">
                {language === 'ar' ? 'الشهادات' : 'Certifications'}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SpecialistDashboard