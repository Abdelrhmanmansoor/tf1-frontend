/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Edit,
  MapPin,
  Award,
  Calendar,
  Star,
  GraduationCap,
  FileText,
  Stethoscope,
  Loader2,
  Languages,
  CheckCircle2,
  Shield,
  Users,
  Camera,
  Upload,
  Maximize2,
  X,
  Globe,
} from 'lucide-react'
import Link from 'next/link'
import {
  getMyProfile,
  uploadAvatar,
  uploadBanner,
  type SpecialistProfile as SpecialistProfileType,
} from '@/services/specialist'
import { useRouter } from 'next/navigation'

const SpecialistProfilePage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState<SpecialistProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [showBannerMenu, setShowBannerMenu] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [viewImageModal, setViewImageModal] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false)
  const [isSelectingBanner, setIsSelectingBanner] = useState(false)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getMyProfile()
      console.log('✅ Profile loaded:', response.profile)
      setProfile(response.profile)
    } catch (err: any) {
      console.error('❌ Error fetching profile:', err)
      setError(
        err.response?.data?.message || err.message || 'Failed to load profile'
      )

      if (err.response?.status === 404) {
        router.push('/dashboard/specialist/setup')
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🎯 handleAvatarUpload called')
    const file = e.target.files?.[0]
    console.log('📁 File selected:', file)

    // Reset selecting state
    setIsSelectingAvatar(false)

    if (!file) {
      console.log('❌ No file selected')
      setShowAvatarMenu(false)
      return
    }

    console.log('📤 Starting avatar upload:', {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    if (!file.type.startsWith('image/')) {
      alert(
        language === 'ar' ? 'الرجاء اختيار صورة' : 'Please select an image file'
      )
      setShowAvatarMenu(false)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        language === 'ar'
          ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت'
          : 'File size must be less than 5MB'
      )
      setShowAvatarMenu(false)
      return
    }

    try {
      console.log('⏳ Setting uploadingAvatar to true...')
      setUploadingAvatar(true)
      setShowAvatarMenu(false)
      console.log('⏳ Calling uploadAvatar service...')
      const result = await uploadAvatar(file)
      console.log('✅ Avatar uploaded successfully:', result)
      console.log('🔄 Fetching updated profile...')

      // Update profile with new avatar immediately
      if (profile) {
        setProfile({
          ...profile,
          avatar: result.url || result.largeUrl,
        })
      }

      await fetchProfile()
    } catch (err: any) {
      console.error('❌ Avatar upload failed:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      })
      alert(
        err.response?.data?.message ||
          err.message ||
          (language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload avatar')
      )
    } finally {
      console.log('✅ Setting uploadingAvatar to false...')
      setUploadingAvatar(false)
      // Reset the input value so the same file can be selected again
      if (avatarInputRef.current) {
        avatarInputRef.current.value = ''
      }
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🎯 handleBannerUpload called')
    const file = e.target.files?.[0]
    console.log('📁 File selected:', file)

    // Reset selecting state
    setIsSelectingBanner(false)

    if (!file) {
      console.log('❌ No file selected')
      setShowBannerMenu(false)
      return
    }

    console.log('📤 Starting banner upload:', {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    if (!file.type.startsWith('image/')) {
      alert(
        language === 'ar' ? 'الرجاء اختيار صورة' : 'Please select an image file'
      )
      setShowBannerMenu(false)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        language === 'ar'
          ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت'
          : 'File size must be less than 5MB'
      )
      setShowBannerMenu(false)
      return
    }

    try {
      console.log('⏳ Setting uploadingBanner to true...')
      setUploadingBanner(true)
      setShowBannerMenu(false)
      console.log('⏳ Calling uploadBanner service...')
      const result = await uploadBanner(file)
      console.log('✅ Banner uploaded successfully:', result)
      console.log('🔄 Fetching updated profile...')

      // Update profile with new banner immediately
      if (profile) {
        setProfile({
          ...profile,
          bannerImage: result.url || result.largeUrl,
        })
      }

      await fetchProfile()
    } catch (err: any) {
      console.error('❌ Banner upload failed:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      })
      alert(
        err.response?.data?.message ||
          err.message ||
          (language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload banner')
      )
    } finally {
      console.log('✅ Setting uploadingBanner to false...')
      setUploadingBanner(false)
      // Reset the input value so the same file can be selected again
      if (bannerInputRef.current) {
        bannerInputRef.current.value = ''
      }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
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

  const specializationMap: Record<string, { en: string; ar: string }> = {
    sports_physiotherapy: {
      en: 'Sports Physiotherapy',
      ar: 'علاج طبيعي رياضي',
    },
    sports_nutrition: { en: 'Sports Nutrition', ar: 'تغذية رياضية' },
    fitness_training: { en: 'Fitness Training', ar: 'لياقة بدنية' },
    sports_psychology: { en: 'Sports Psychology', ar: 'علم نفس رياضي' },
    injury_rehabilitation: {
      en: 'Injury Rehabilitation',
      ar: 'إعادة تأهيل الإصابات',
    },
    sports_massage: { en: 'Sports Massage', ar: 'تدليك رياضي' },
  }

  const getSpecializationLabel = (spec: string) => {
    return language === 'ar'
      ? specializationMap[spec]?.ar || spec
      : specializationMap[spec]?.en || spec
  }

  const languageMap: Record<string, { en: string; ar: string }> = {
    english: { en: 'English', ar: 'الإنجليزية' },
    arabic: { en: 'Arabic', ar: 'العربية' },
    en: { en: 'English', ar: 'الإنجليزية' },
    ar: { en: 'Arabic', ar: 'العربية' },
  }

  const getLanguageLabel = (lang: string) => {
    return language === 'ar'
      ? languageMap[lang]?.ar || lang
      : languageMap[lang]?.en || lang
  }

  const user =
    profile.userId && typeof profile.userId === 'object'
      ? (profile.userId as any)
      : null
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Specialist'

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
            <Link href="/dashboard/specialist/profile/edit">
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
            onMouseEnter={() => {
              if (!uploadingBanner && !isSelectingBanner) {
                setShowBannerMenu(true)
              }
            }}
            onMouseLeave={() => {
              if (!uploadingBanner && !isSelectingBanner) {
                setShowBannerMenu(false)
              }
            }}
          >
            {profile.bannerImage || (profile as any).banner ? (
              <img
                src={(() => {
                  const bannerData =
                    profile.bannerImage || (profile as any).banner
                  if (typeof bannerData === 'string') return bannerData
                  return (
                    bannerData?.url ||
                    bannerData?.desktopUrl ||
                    bannerData?.largeUrl
                  )
                })()}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 bg-black/10"></div>
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>
            )}

            {/* LOADING OVERLAY - ALWAYS VISIBLE WHEN UPLOADING */}
            {uploadingBanner && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center z-50"
              >
                <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-3 shadow-2xl">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-lg">
                      {language === 'ar'
                        ? 'جاري رفع الصورة...'
                        : 'Uploading Image...'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {language === 'ar' ? 'الرجاء الانتظار' : 'Please wait'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Banner Menu Overlay - Only on Hover */}
            {showBannerMenu && !uploadingBanner && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 z-10"
                onMouseEnter={() => setShowBannerMenu(true)}
                onMouseLeave={() => {
                  if (!isSelectingBanner) {
                    setShowBannerMenu(false)
                  }
                }}
              >
                {(profile.bannerImage || (profile as any).banner) && (
                  <button
                    onClick={() => {
                      const bannerData =
                        profile.bannerImage || (profile as any).banner
                      const bannerUrl =
                        typeof bannerData === 'string'
                          ? bannerData
                          : bannerData?.url ||
                            bannerData?.desktopUrl ||
                            bannerData?.largeUrl
                      setViewImageModal(bannerUrl)
                    }}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all shadow-lg"
                  >
                    <Maximize2 className="w-4 h-4 text-gray-700" />
                    <span className="font-medium text-gray-900">
                      {language === 'ar' ? 'عرض' : 'View'}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => {
                    console.log('📷 Banner button clicked')
                    setIsSelectingBanner(true)
                    setShowBannerMenu(true)
                    bannerInputRef.current?.click()
                  }}
                  className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    {language === 'ar' ? 'تغيير الغلاف' : 'Change Banner'}
                  </span>
                </button>
              </motion.div>
            )}

            {/* Hidden file input */}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
              disabled={uploadingBanner}
            />
          </div>

          {/* Profile Info Section */}
          <div className="px-4 md:px-8 pb-6 pt-4 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              {/* Left: Avatar + Name */}
              <div className="flex items-end gap-4 md:gap-6 flex-1">
                {/* Avatar overlapping banner */}
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-2xl border-4 border-white overflow-hidden flex-shrink-0 -mt-16 md:-mt-20 relative z-20 group"
                  onMouseEnter={() => {
                    console.log('🖱️ Mouse entered avatar')
                    if (!uploadingAvatar && !isSelectingAvatar) {
                      setShowAvatarMenu(true)
                    }
                  }}
                  onMouseLeave={() => {
                    console.log('🖱️ Mouse left avatar')
                    if (!uploadingAvatar && !isSelectingAvatar) {
                      setShowAvatarMenu(false)
                    }
                  }}
                >
                  {profile.avatar ? (
                    <img
                      src={
                        typeof profile.avatar === 'string'
                          ? profile.avatar
                          : (profile.avatar as any).url ||
                            (profile.avatar as any).largeUrl
                      }
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-5xl font-bold">
                      <Stethoscope className="w-20 h-20" />
                    </div>
                  )}

                  {/* LOADING OVERLAY - ALWAYS VISIBLE WHEN UPLOADING */}
                  {uploadingAvatar && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 z-50"
                    >
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                      <p className="text-white text-xs font-medium">
                        {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                      </p>
                    </motion.div>
                  )}

                  {/* Avatar Menu Overlay - Only on Hover */}
                  {showAvatarMenu && !uploadingAvatar && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 z-10"
                      onMouseEnter={() => {
                        console.log('🖱️ Mouse entered menu overlay')
                        setShowAvatarMenu(true)
                      }}
                      onMouseLeave={() => {
                        console.log('🖱️ Mouse left menu overlay')
                        if (!isSelectingAvatar) {
                          setShowAvatarMenu(false)
                        }
                      }}
                    >
                      {profile.avatar && (
                        <button
                          onClick={() => {
                            console.log('👁️ View button clicked')
                            const avatarUrl =
                              typeof profile.avatar === 'string'
                                ? profile.avatar
                                : (profile.avatar as any).url ||
                                  (profile.avatar as any).largeUrl
                            setViewImageModal(avatarUrl)
                          }}
                          className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg p-2 transition-all"
                          title={
                            language === 'ar' ? 'عرض الصورة' : 'View Photo'
                          }
                        >
                          <Maximize2 className="w-5 h-5 text-gray-700" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          console.log('📷 Camera button clicked')
                          setIsSelectingAvatar(true)
                          setShowAvatarMenu(true)
                          avatarInputRef.current?.click()
                        }}
                        className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg p-2 transition-all cursor-pointer"
                        title={
                          language === 'ar' ? 'تغيير الصورة' : 'Change Photo'
                        }
                      >
                        <Camera className="w-5 h-5 text-blue-600" />
                      </button>
                    </motion.div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
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
                  <p className="text-lg md:text-xl text-blue-600 font-semibold mb-2">
                    {getSpecializationLabel(profile.primarySpecialization)}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {(profile as any).experienceYears ||
                        profile.yearsOfExperience ||
                        0}{' '}
                      {language === 'ar' ? 'سنوات خبرة' : 'years experience'}
                    </span>
                    {profile.languages && profile.languages.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Languages className="w-4 h-4" />
                        {profile.languages.map(getLanguageLabel).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Stats */}
              <div className="flex gap-3 flex-shrink-0">
                {profile.rating && (
                  <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl px-4 md:px-6 py-3 border border-yellow-200 min-w-[100px]">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <div className="text-xl md:text-2xl font-bold text-yellow-700">
                        {profile.rating.average?.toFixed(1) || '0.0'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {profile.rating.count || 0}{' '}
                      {language === 'ar' ? 'تقييم' : 'reviews'}
                    </div>
                  </div>
                )}
                {profile.clientStats && (
                  <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl px-4 md:px-6 py-3 border border-green-200 min-w-[100px]">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Users className="w-4 h-4 text-green-600" />
                      <div className="text-xl md:text-2xl font-bold text-green-700">
                        {profile.clientStats.totalClients || 0}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {language === 'ar' ? 'عميل' : 'clients'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Specializations */}
        {profile.additionalSpecializations &&
          profile.additionalSpecializations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                {language === 'ar'
                  ? 'التخصصات الإضافية'
                  : 'Additional Specializations'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.additionalSpecializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {getSpecializationLabel(spec)}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

        {/* Bio */}
        {profile.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {language === 'ar' ? 'نبذة' : 'About'}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {typeof profile.bio === 'string'
                ? profile.bio
                : language === 'ar'
                  ? profile.bio.ar || profile.bio.en
                  : profile.bio.en}
            </p>
          </motion.div>
        )}

        {/* Rest of profile sections... */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          {(profile as any).previousExperience &&
            (profile as any).previousExperience.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'التعليم' : 'Education'}
                </h2>
                <div className="space-y-4">
                  {(profile as any).previousExperience.map(
                    (edu: any, index: number) => {
                      // Map degree values to display labels
                      const degreeLabels: Record<
                        string,
                        { en: string; ar: string }
                      > = {
                        high_school: {
                          en: 'High School',
                          ar: 'الثانوية العامة',
                        },
                        diploma: { en: 'Diploma', ar: 'دبلوم' },
                        associate: { en: 'Associate Degree', ar: 'درجة مشارك' },
                        bachelor: { en: 'Bachelor', ar: 'بكالوريوس' },
                        master: { en: 'Master', ar: 'ماجستير' },
                        doctorate: { en: 'Doctorate', ar: 'دكتوراه' },
                        postdoctorate: {
                          en: 'Post-Doctorate',
                          ar: 'ما بعد الدكتوراه',
                        },
                      }
                      const degreeLabel = degreeLabels[edu.degree]
                        ? language === 'ar'
                          ? degreeLabels[edu.degree].ar
                          : degreeLabels[edu.degree].en
                        : edu.degree

                      return (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                        >
                          <h3 className="font-bold text-gray-900">
                            {degreeLabel}
                          </h3>
                          <p className="text-gray-700 text-sm">
                            {edu.institution}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {edu.graduationYear}
                          </p>
                          {edu.fieldOfStudy && (
                            <p className="text-blue-700 text-sm mt-1">
                              {edu.fieldOfStudy}
                            </p>
                          )}
                        </div>
                      )
                    }
                  )}
                </div>
              </motion.div>
            )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                {language === 'ar' ? 'الشهادات' : 'Certifications'}
              </h2>
              <div className="space-y-4">
                {profile.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                  >
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-700 text-sm">
                      {cert.issuingOrganization}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {new Date(cert.issueDate).toLocaleDateString()}
                      {cert.expiryDate &&
                        ` - ${new Date(cert.expiryDate).toLocaleDateString()}`}
                    </p>
                    {cert.credentialId && (
                      <p className="text-xs text-gray-600 mt-2 bg-white px-2 py-1 rounded inline-block">
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Licenses */}
          {(profile as any).professionalAssociations &&
            (profile as any).professionalAssociations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'التراخيص' : 'Licenses'}
                </h2>
                <div className="space-y-4">
                  {(profile as any).professionalAssociations.map(
                    (license: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900">
                            #{license.licenseNumber}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              license.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : license.status === 'expired'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {language === 'ar'
                              ? license.status === 'active'
                                ? 'نشط'
                                : license.status === 'expired'
                                  ? 'منتهي'
                                  : 'معلق'
                              : license.status}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {license.issuingAuthority}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          {license.issueDate &&
                            new Date(license.issueDate).toLocaleDateString()}
                          {license.expiryDate &&
                            ` - ${new Date(license.expiryDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            )}

          {/* Service Locations */}
          {profile.serviceLocations && profile.serviceLocations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {language === 'ar' ? 'مواقع الخدمة' : 'Service Locations'}
              </h2>
              <div className="space-y-4">
                {profile.serviceLocations.map((location, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">
                        {location.name}
                      </h3>
                      {location.isPrimary && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          {language === 'ar' ? 'أساسي' : 'Primary'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1 capitalize">
                      {location.type}
                    </p>
                    {location.address && (
                      <p className="text-sm text-gray-700">
                        {(location.address as any).street &&
                          `${(location.address as any).street}, `}
                        {(location.address as any).city},{' '}
                        {(location.address as any).country}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Consultation Types */}
          {(profile as any).consultationTypes &&
            (profile as any).consultationTypes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'أنواع الاستشارة' : 'Consultation Types'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(profile as any).consultationTypes.map(
                    (type: string, index: number) => {
                      const typeLabels: Record<
                        string,
                        { en: string; ar: string }
                      > = {
                        individual: { en: 'Individual', ar: 'فردي' },
                        group: { en: 'Group', ar: 'مجموعة' },
                        team: { en: 'Team', ar: 'فريق' },
                        workshop: { en: 'Workshop', ar: 'ورشة عمل' },
                      }
                      const typeLabel = typeLabels[type]
                        ? language === 'ar'
                          ? typeLabels[type].ar
                          : typeLabels[type].en
                        : type

                      return (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {typeLabel}
                        </span>
                      )
                    }
                  )}
                </div>
              </motion.div>
            )}

          {/* Online Consultation */}
          {(profile as any).onlineConsultation?.available && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                {language === 'ar'
                  ? 'الاستشارات الأونلاين'
                  : 'Online Consultation'}
              </h2>
              <p className="text-gray-700 mb-3">
                {language === 'ar'
                  ? 'أقدم استشارات أونلاين عبر المنصات التالية:'
                  : 'I offer online consultations via the following platforms:'}
              </p>
              {(profile as any).onlineConsultation.platforms &&
                (profile as any).onlineConsultation.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(profile as any).onlineConsultation.platforms.map(
                      (platform: string, index: number) => {
                        const platformLabels: Record<
                          string,
                          { en: string; ar: string }
                        > = {
                          zoom: { en: 'Zoom', ar: 'زووم' },
                          'google-meet': { en: 'Google Meet', ar: 'جوجل ميت' },
                          'microsoft-teams': {
                            en: 'Microsoft Teams',
                            ar: 'مايكروسوفت تيمز',
                          },
                          skype: { en: 'Skype', ar: 'سكايب' },
                        }
                        const platformLabel = platformLabels[platform]
                          ? language === 'ar'
                            ? platformLabels[platform].ar
                            : platformLabels[platform].en
                          : platform

                        return (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-800 rounded-full text-sm font-medium border border-green-200"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {platformLabel}
                          </span>
                        )
                      }
                    )}
                  </div>
                )}
            </motion.div>
          )}
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

export default SpecialistProfilePage
