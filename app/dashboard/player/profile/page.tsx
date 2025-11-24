'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Edit,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  TrendingUp,
  Users,
  Star,
  Globe,
  Heart,
  Flag,
  Ruler,
  Weight as WeightIcon,
  Target,
  Clock,
  DollarSign,
  Facebook,
  Instagram,
  Twitter,
  Loader2,
  Eye,
  Settings,
  FileText,
  Play,
  Upload,
  Camera,
  Maximize2,
  X,
} from 'lucide-react'
import Link from 'next/link'
import playerService from '@/services/player'
import type { PlayerProfile as PlayerProfileType } from '@/types/player'
import { useRouter } from 'next/navigation'

const PlayerProfilePage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState<PlayerProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [showBannerMenu, setShowBannerMenu] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [viewImageModal, setViewImageModal] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await playerService.getMyProfile()
      console.log('Profile data:', data)
      console.log('Banner:', data.bannerImage)
      console.log('Avatar:', data.avatar)
      setProfile(data)
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert(
        language === 'ar' ? 'الرجاء اختيار صورة' : 'Please select an image file'
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        language === 'ar'
          ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت'
          : 'File size must be less than 5MB'
      )
      return
    }

    try {
      setUploadingAvatar(true)
      await playerService.uploadAvatar(file)
      await fetchProfile() // Refresh profile
      setShowAvatarMenu(false)
    } catch (err: any) {
      alert(
        err.message ||
          (language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload avatar')
      )
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert(
        language === 'ar' ? 'الرجاء اختيار صورة' : 'Please select an image file'
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        language === 'ar'
          ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت'
          : 'File size must be less than 5MB'
      )
      return
    }

    try {
      setUploadingBanner(true)
      await playerService.uploadBanner(file)
      await fetchProfile() // Refresh profile
      setShowBannerMenu(false)
    } catch (err: any) {
      alert(
        err.message ||
          (language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload banner')
      )
    } finally {
      setUploadingBanner(false)
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
              ? 'جاري تحميل الملف الشخصي...'
              : 'Loading profile...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
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
          <p className="text-gray-600 mb-6">{error || 'Profile not found'}</p>
          <div className="flex gap-3">
            <Button onClick={fetchProfile} className="flex-1">
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="flex-1"
            >
              {language === 'ar' ? 'العودة' : 'Go Back'}
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const user = typeof profile.userId === 'object' ? profile.userId : null
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Player'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'العودة' : 'Back'}
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/player/privacy">
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="w-4 h-4" />
                  {language === 'ar' ? 'الخصوصية' : 'Privacy'}
                </Button>
              </Link>
              <Link href="/dashboard/player/profile/edit">
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Edit className="w-4 h-4" />
                  {language === 'ar' ? 'تعديل' : 'Edit'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 mb-8 relative"
        >
          {/* Banner Image */}
          <div
            className="h-48 md:h-64 relative rounded-t-3xl overflow-hidden z-0 group"
            onMouseEnter={() => setShowBannerMenu(true)}
            onMouseLeave={() => setShowBannerMenu(false)}
          >
            {profile.bannerImage ? (
              <img
                src={profile.bannerImage}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 bg-black/10"></div>
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>
            )}

            {/* Banner Menu Overlay */}
            {showBannerMenu && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3"
              >
                {uploadingBanner ? (
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="font-medium text-gray-900">
                      {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                    </span>
                  </div>
                ) : (
                  <>
                    {profile.bannerImage && (
                      <button
                        onClick={() => setViewImageModal(profile.bannerImage!)}
                        className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all shadow-lg"
                      >
                        <Maximize2 className="w-4 h-4 text-gray-700" />
                        <span className="font-medium text-gray-900">
                          {language === 'ar' ? 'عرض' : 'View'}
                        </span>
                      </button>
                    )}
                    <label className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all shadow-lg cursor-pointer">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900">
                        {language === 'ar' ? 'تغيير الغلاف' : 'Change Banner'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="px-4 md:px-8 pb-6 pt-4 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              {/* Left: Avatar + Name */}
              <div className="flex items-end gap-4 md:gap-6 flex-1">
                {/* Avatar overlapping banner */}
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-2xl border-4 border-white overflow-hidden flex-shrink-0 -mt-16 md:-mt-20 relative z-20 group"
                  onMouseEnter={() => setShowAvatarMenu(true)}
                  onMouseLeave={() => setShowAvatarMenu(false)}
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-5xl font-bold">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </div>
                  )}

                  {/* Avatar Menu Overlay */}
                  {showAvatarMenu && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : (
                        <>
                          {profile.avatar && (
                            <button
                              onClick={() => setViewImageModal(profile.avatar!)}
                              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg p-2 transition-all"
                              title={
                                language === 'ar' ? 'عرض الصورة' : 'View Photo'
                              }
                            >
                              <Maximize2 className="w-5 h-5 text-gray-700" />
                            </button>
                          )}
                          <label
                            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg p-2 transition-all cursor-pointer"
                            title={
                              language === 'ar'
                                ? 'تغيير الصورة'
                                : 'Change Photo'
                            }
                          >
                            <Camera className="w-5 h-5 text-blue-600" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                            />
                          </label>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Name and info */}
                <div className="pb-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {fullName}
                    </h1>
                    {user?.isVerified && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {profile.primarySport}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      {profile.position}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-medium">
                      {profile.level}
                    </span>
                    {profile.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {profile.location.city}, {profile.location.country}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Stats */}
              <div className="flex gap-3 flex-shrink-0">
                <div className="text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl px-4 md:px-6 py-3 border border-gray-200 min-w-[100px]">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      {profile.profileViews || 0}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === 'ar' ? 'مشاهدات' : 'Views'}
                  </div>
                </div>
                <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl px-4 md:px-6 py-3 border border-yellow-200 min-w-[100px]">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <div className="text-xl md:text-2xl font-bold text-yellow-700">
                      {profile.ratingStats?.averageRating?.toFixed(1) || '0.0'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {profile.ratingStats?.totalReviews || 0}{' '}
                    {language === 'ar' ? 'تقييم' : 'reviews'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {profile.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'نبذة عني' : 'About Me'}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'ar'
                    ? profile.bioAr || profile.bio
                    : profile.bio}
                </p>
              </motion.div>
            )}

            {/* Goals */}
            {profile.goals && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'أهدافي' : 'My Goals'}
                </h2>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {language === 'ar'
                    ? profile.goalsAr || profile.goals
                    : profile.goals}
                </p>
              </motion.div>
            )}

            {/* Achievements */}
            {profile.achievements && profile.achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  {language === 'ar' ? 'الإنجازات' : 'Achievements'}
                </h2>
                <div className="space-y-4">
                  {profile.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {language === 'ar'
                            ? achievement.titleAr || achievement.title
                            : achievement.title}
                        </h3>
                        {achievement.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {achievement.description}
                          </p>
                        )}
                        {achievement.date && (
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full h-fit">
                        {achievement.type}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Current & Previous Clubs */}
            {(profile.currentClub ||
              (profile.previousClubs && profile.previousClubs.length > 0)) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  {language === 'ar' ? 'الأندية' : 'Clubs'}
                </h2>
                <div className="space-y-4">
                  {profile.currentClub && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            {profile.currentClub.clubName}
                            <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-full">
                              {language === 'ar' ? 'حالي' : 'Current'}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {profile.currentClub.position}
                          </p>
                        </div>
                      </div>
                      {profile.currentClub.joinedDate && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                          <Calendar className="w-3 h-3" />
                          {language === 'ar' ? 'منذ' : 'Since'}{' '}
                          {new Date(
                            profile.currentClub.joinedDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                  {profile.previousClubs?.map((club, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {club.clubName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {club.position}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                        <Calendar className="w-3 h-3" />
                        {club.startDate &&
                          new Date(club.startDate).toLocaleDateString()}{' '}
                        -{' '}
                        {club.endDate &&
                          new Date(club.endDate).toLocaleDateString()}
                      </p>
                      {club.achievements && (
                        <p className="text-sm text-gray-700 mt-2 italic">
                          &quot;{club.achievements}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Statistics */}
            {profile.statistics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'الإحصائيات' : 'Statistics'}
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {profile.statistics.matchesPlayed !== undefined && (
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600">
                        {profile.statistics.matchesPlayed}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {language === 'ar' ? 'مباريات' : 'Matches'}
                      </div>
                    </div>
                  )}
                  {profile.statistics.goals !== undefined && (
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600">
                        {profile.statistics.goals}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {language === 'ar' ? 'أهداف' : 'Goals'}
                      </div>
                    </div>
                  )}
                  {profile.statistics.assists !== undefined && (
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600">
                        {profile.statistics.assists}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {language === 'ar' ? 'تمريرات' : 'Assists'}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Media Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'الوسائط' : 'Media'}
                </h2>
                <Link href="/dashboard/player/gallery">
                  <Button variant="outline" size="sm">
                    {language === 'ar' ? 'عرض الكل' : 'View All'}
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {profile.photos?.slice(0, 3).map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Photo'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {(!profile.photos || profile.photos.length === 0) && (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    {language === 'ar' ? 'لا توجد صور' : 'No photos yet'}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Personal Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'معلومات شخصية' : 'Personal Details'}
              </h2>
              <div className="space-y-3">
                {profile.nationality && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Flag className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'الجنسية' : 'Nationality'}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {profile.nationality}
                      </p>
                    </div>
                  </div>
                )}
                {profile.height && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Ruler className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'الطول' : 'Height'}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {profile.height.value} {profile.height.unit}
                      </p>
                    </div>
                  </div>
                )}
                {profile.weight && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <WeightIcon className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'الوزن' : 'Weight'}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {profile.weight.value} {profile.weight.unit}
                      </p>
                    </div>
                  </div>
                )}
                {profile.preferredFoot && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Heart className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'القدم المفضلة' : 'Preferred Foot'}
                      </p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {profile.preferredFoot}
                      </p>
                    </div>
                  </div>
                )}
                {profile.yearsOfExperience !== undefined && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'سنوات الخبرة' : 'Experience'}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {profile.yearsOfExperience}{' '}
                        {language === 'ar' ? 'سنوات' : 'years'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Additional Sports */}
            {profile.additionalSports &&
              profile.additionalSports.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {language === 'ar' ? 'رياضات إضافية' : 'Additional Sports'}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.additionalSports.map((sport, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  {language === 'ar' ? 'اللغات' : 'Languages'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Social Media */}
            {profile.socialMedia &&
              Object.keys(profile.socialMedia).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {language === 'ar' ? 'وسائل التواصل' : 'Social Media'}
                  </h2>
                  <div className="space-y-2">
                    {profile.socialMedia.facebook && (
                      <a
                        href={profile.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Facebook
                        </span>
                      </a>
                    )}
                    {profile.socialMedia.instagram && (
                      <a
                        href={profile.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition"
                      >
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <span className="text-sm font-medium text-pink-900">
                          Instagram
                        </span>
                      </a>
                    )}
                    {profile.socialMedia.twitter && (
                      <a
                        href={profile.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition"
                      >
                        <Twitter className="w-5 h-5 text-sky-600" />
                        <span className="text-sm font-medium text-sky-900">
                          Twitter
                        </span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

            {/* Training Availability */}
            {profile.availableForTraining &&
              profile.trainingAvailability &&
              profile.trainingAvailability.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    {language === 'ar'
                      ? 'التوافر للتدريب'
                      : 'Training Availability'}
                  </h2>
                  <div className="space-y-2">
                    {profile.trainingAvailability.map((avail, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg"
                      >
                        <span className="font-medium text-gray-900 capitalize">
                          {avail.day}
                        </span>
                        <div className="text-sm text-gray-600">
                          {avail.slots.map((slot, i) => (
                            <div key={i}>
                              {slot.startTime} - {slot.endTime}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setViewImageModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewImageModal(null)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-lg p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={viewImageModal}
              alt="Full size"
              className="w-full h-full object-contain rounded-lg"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default PlayerProfilePage
