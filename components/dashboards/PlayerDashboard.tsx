/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Search,
  FileText,
  User,
  Target,
  Calendar,
  Award,
  MessageCircle,
  TrendingUp,
  Eye,
  Star,
  Users,
  Edit,
  Image as ImageIcon,
  Settings,
  MapPin,
  Briefcase,
  Activity,
  ChevronRight,
  Loader2,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import playerService from '@/services/player'
import authService from '@/services/auth'
import type { DashboardStats, PlayerProfile } from '@/types/player'
import { calculateProfileCompletion } from '@/utils/profileCompletion'

const PlayerDashboard = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch dashboard stats and profile in parallel
      const [statsData, profileData] = await Promise.all([
        playerService.getDashboardStats(),
        playerService.getMyProfile(),
      ])

      setStats(statsData)
      setProfile(profileData)
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)

      // Check if error is "Profile not found" - redirect to setup
      if (
        err.message?.toLowerCase().includes('profile not found') ||
        err.status === 404
      ) {
        router.push('/dashboard/player/setup')
        return
      }

      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            {language === 'ar'
              ? 'جاري تحميل لوحة التحكم...'
              : 'Loading dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'خطأ في التحميل' : 'Loading Error'}
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchDashboardData} className="w-full">
            {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </Button>
        </motion.div>
      </div>
    )
  }

  const getUserName = () => {
    if (!profile?.userId) return language === 'ar' ? 'اللاعب' : 'Player'
    const user = typeof profile.userId === 'object' ? profile.userId : null
    return user?.firstName || (language === 'ar' ? 'اللاعب' : 'Player')
  }

  // Calculate accurate profile completion
  const profileCompletion = profile
    ? calculateProfileCompletion(profile)
    : {
        percentage: 0,
        missingFields: [],
        completedFields: [],
        totalFields: 0,
        completedCount: 0,
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {language === 'ar'
                    ? `مرحباً ${getUserName()}! 👋`
                    : `Welcome back, ${getUserName()}! 👋`}
                </h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {language === 'ar'
                    ? 'اكتشف الفرص الرياضية المثالية لك وطور مسيرتك المهنية'
                    : 'Discover perfect sports opportunities and advance your career'}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <GlobalSearchButton variant="outline" showLabel={true} />
              <LanguageSelector />
              <MessageNotificationBadge dashboardType="player" />
              <Link href="/dashboard/player/opportunities">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {language === 'ar' ? 'اكتشف الفرص' : 'Discover Opportunities'}
                </Button>
              </Link>
              <Button
                onClick={() => {
                  authService.logout()
                  router.push('/login')
                }}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* Profile Completion */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 w-fit mb-4">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">
                    {profileCompletion.percentage}%
                  </h3>
                  <p className="text-blue-100 text-sm font-medium">
                    {language === 'ar' ? 'اكتمال الملف' : 'Profile Complete'}
                  </p>
                </div>
              </motion.div>

              {/* Profile Views */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                  <div className="bg-purple-100 rounded-xl p-3 w-fit mb-4">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats?.profileViews || 0}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    {language === 'ar' ? 'مشاهدات' : 'Views'}
                  </p>
                </div>
              </motion.div>

              {/* Training Sessions */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                  <div className="bg-green-100 rounded-xl p-3 w-fit mb-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats?.completedSessions || 0}/{stats?.totalSessions || 0}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    {language === 'ar' ? 'الحصص' : 'Sessions'}
                  </p>
                </div>
              </motion.div>

              {/* Average Rating */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                  <div className="bg-yellow-100 rounded-xl p-3 w-fit mb-4">
                    <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stats?.averageRating?.toFixed(1) || '0.0'}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    {language === 'ar' ? 'التقييم' : 'Rating'}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Upcoming Sessions */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <div className="flex items-center justify-between text-white">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {language === 'ar'
                        ? 'الحصص القادمة'
                        : 'Upcoming Sessions'}
                    </h2>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                      {stats?.upcomingSessions || 0}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {(stats?.upcomingSessions || 0) > 0 ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-gray-700 font-medium mb-4">
                        {language === 'ar'
                          ? `لديك ${stats?.upcomingSessions} حصة قادمة`
                          : `You have ${stats?.upcomingSessions} upcoming session(s)`}
                      </p>
                      <Link href="/sessions">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          {language === 'ar' ? 'عرض الحصص' : 'View Sessions'}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4">
                        {language === 'ar'
                          ? 'لا توجد حصص قادمة'
                          : 'No upcoming sessions'}
                      </p>
                      <Link href="/coaches">
                        <Button variant="outline" className="w-full">
                          {language === 'ar' ? 'ابحث عن مدرب' : 'Find a Coach'}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Requests */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                  <div className="flex items-center justify-between text-white">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {language === 'ar' ? 'الطلبات النشطة' : 'Active Requests'}
                    </h2>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                      {stats?.activeRequests || 0}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {(stats?.activeRequests || 0) > 0 ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-gray-700 font-medium mb-4">
                        {language === 'ar'
                          ? `لديك ${stats?.activeRequests} طلب نشط`
                          : `You have ${stats?.activeRequests} active request(s)`}
                      </p>
                      <Link href="/requests">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          {language === 'ar' ? 'عرض الطلبات' : 'View Requests'}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4">
                        {language === 'ar'
                          ? 'لا توجد طلبات نشطة'
                          : 'No active requests'}
                      </p>
                      <Link href="/coaches">
                        <Button variant="outline" className="w-full">
                          {language === 'ar'
                            ? 'أرسل طلب تدريب'
                            : 'Send Training Request'}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Profile Overview */}
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-6 h-6" />
                    {language === 'ar'
                      ? 'نظرة عامة على الملف الشخصي'
                      : 'Profile Overview'}
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'ar'
                            ? 'الرياضة الأساسية'
                            : 'Primary Sport'}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {profile.primarySport}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Target className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? 'المركز' : 'Position'}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {profile.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? 'عدد التقييمات' : 'Total Reviews'}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {stats?.totalReviews || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? 'المستوى' : 'Level'}
                        </p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {profile.level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? 'الموقع' : 'Location'}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {profile.location?.city || 'N/A'},{' '}
                          {profile.location?.country || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Award className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? 'عضويات الأندية' : 'Club Memberships'}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {stats?.clubMemberships || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Link href="/dashboard/player/profile">
                    <Button
                      variant="outline"
                      className="w-full border-2 hover:bg-gray-50"
                    >
                      {language === 'ar'
                        ? 'عرض الملف الشخصي الكامل'
                        : 'View Full Profile'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl shadow-purple-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {language === 'ar'
                    ? 'أكمل ملفك الشخصي'
                    : 'Complete Your Profile'}
                </h3>
                <div className="text-2xl font-bold">
                  {profileCompletion.percentage}%
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-white rounded-full h-3"
                />
              </div>
              <div className="text-blue-100 text-sm mb-4">
                <p className="mb-2">
                  {language === 'ar'
                    ? 'أكمل ملفك الشخصي لزيادة فرصك في الظهور'
                    : 'Complete your profile to increase your visibility'}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium">
                    {profileCompletion.completedCount} /{' '}
                    {profileCompletion.totalFields}
                  </span>
                  <span>
                    {language === 'ar' ? 'حقول مكتملة' : 'fields completed'}
                  </span>
                </div>
                {profileCompletion.missingFields.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <p className="text-xs font-medium mb-1">
                      {language === 'ar'
                        ? 'الحقول المفقودة:'
                        : 'Missing fields:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {profileCompletion.missingFields
                        .slice(0, 5)
                        .map((field, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white/10 px-2 py-0.5 rounded"
                          >
                            {field}
                          </span>
                        ))}
                      {profileCompletion.missingFields.length > 5 && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                          +{profileCompletion.missingFields.length - 5}{' '}
                          {language === 'ar' ? 'أخرى' : 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link href="/dashboard/player/profile/edit">
                <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold shadow-lg">
                  <Edit className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تحديث الملف' : 'Update Profile'}
                </Button>
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </h3>
              <div className="space-y-2">
                <Link href="/dashboard/player/profile">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                  </Button>
                </Link>
                <Link href="/dashboard/player/profile/edit">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تحديث المعلومات' : 'Edit Profile'}
                  </Button>
                </Link>
                <Link href="/dashboard/player/gallery">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-pink-50 hover:border-pink-200"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {language === 'ar'
                      ? 'معرض الصور والفيديو'
                      : 'Media Gallery'}
                  </Button>
                </Link>
                <Link href="/dashboard/player/privacy">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-green-50 hover:border-green-200"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {language === 'ar'
                      ? 'إعدادات الخصوصية'
                      : 'Privacy Settings'}
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                {language === 'ar' ? 'إحصائياتك' : 'Your Stats'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">
                    {language === 'ar' ? 'مشاهدات الملف' : 'Profile Views'}
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {stats?.profileViews || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">
                    {language === 'ar' ? 'عضويات الأندية' : 'Club Memberships'}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {stats?.clubMemberships || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">
                    {language === 'ar' ? 'عدد التقييمات' : 'Total Reviews'}
                  </span>
                  <span className="text-lg font-bold text-yellow-600">
                    {stats?.totalReviews || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">
                    {language === 'ar' ? 'طلبات معلقة' : 'Pending Apps'}
                  </span>
                  <span className="text-lg font-bold text-purple-600">
                    {stats?.pendingApplications || 0}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDashboard
