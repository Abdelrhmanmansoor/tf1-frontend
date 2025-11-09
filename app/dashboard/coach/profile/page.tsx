'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import coachService from '@/services/coach'
import type { CoachProfile } from '@/types/coach'
import {
  ArrowLeft,
  Edit,
  MapPin,
  Star,
  Award,
  Loader2,
  XCircle,
  CheckCircle,
  Globe,
  PlayCircle,
  ImageIcon,
  Shield,
  TrendingUp,
  Users,
  Medal,
  Upload,
  Camera,
  Maximize2,
  X,
} from 'lucide-react'
import Image from 'next/image'

const CoachProfilePage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState<CoachProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [viewImageModal, setViewImageModal] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const profileData = await coachService.getMyProfile()
      setProfile(profileData)
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log('[Avatar Upload] File selected:', file)
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
      console.log('[Avatar Upload] Starting upload...')
      setUploadingAvatar(true)
      const result = await coachService.uploadAvatar(file)
      console.log('[Avatar Upload] Upload successful:', result)
      await fetchProfile()
      console.log('[Avatar Upload] Profile refreshed')
    } catch (err: any) {
      console.error('[Avatar Upload] Error:', err)
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
    console.log('[Banner Upload] File selected:', file)
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
      console.log('[Banner Upload] Starting upload...')
      setUploadingBanner(true)
      const result = await coachService.uploadBanner(file)
      console.log('[Banner Upload] Upload successful:', result)
      await fetchProfile()
      console.log('[Banner Upload] Profile refreshed')
    } catch (err: any) {
      console.error('[Banner Upload] Error:', err)
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
              ? 'جاري تحميل الملف الشخصي...'
              : 'Loading Profile...'}
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

  if (!profile) {
    return null
  }

  const user = typeof profile.userId === 'string' ? null : profile.userId

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === 'ar' ? 'رجوع' : 'Back'}</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/coach/profile/edit')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {language === 'ar' ? 'تعديل الملف' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 mb-8 relative overflow-hidden"
        >
          {/* Banner Section */}
          <div className="h-48 md:h-64 relative bg-gradient-to-r from-purple-600 via-blue-600 to-green-600">
            {profile.bannerImage && (
              <Image
                src={profile.bannerImage}
                alt="Profile Banner"
                fill
                className="object-cover"
                priority
              />
            )}

            {/* Banner Buttons - Always Visible */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
              {profile.bannerImage && (
                <button
                  onClick={() => setViewImageModal(profile.bannerImage!)}
                  className="bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all font-medium"
                >
                  <Maximize2 className="w-4 h-4" />
                  {language === 'ar' ? 'عرض' : 'View'}
                </button>
              )}
              <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all cursor-pointer font-medium">
                <Upload className="w-4 h-4" />
                {language === 'ar' ? 'تغيير الغلاف' : 'Change Banner'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={uploadingBanner}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploading Overlay */}
            {uploadingBanner && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                  <span className="font-bold text-gray-900 text-lg">
                    {language === 'ar'
                      ? 'جاري رفع الغلاف...'
                      : 'Uploading Banner...'}
                  </span>
                </div>
              </div>
            )}

            {/* Verified Badge */}
            {profile.isVerified && (
              <div className="absolute top-4 left-4 bg-blue-600 rounded-full px-4 py-2 flex items-center gap-2 text-white shadow-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-bold">
                  {language === 'ar' ? 'موثق' : 'Verified'}
                </span>
              </div>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="px-4 md:px-8 pb-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              {/* Avatar + Name Section */}
              <div className="flex items-end gap-4 md:gap-6 flex-1">
                {/* Avatar */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-2xl border-4 border-white -mt-16 md:-mt-20 relative flex-shrink-0">
                  {profile.avatar || user?.avatar ? (
                    <Image
                      src={profile.avatar || user?.avatar || ''}
                      alt={user?.fullName || 'Coach'}
                      fill
                      className="object-cover rounded-full"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-5xl font-bold">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </div>
                  )}

                  {/* Avatar Upload Buttons - Visible Below Avatar */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {profile.avatar && (
                      <button
                        onClick={() => setViewImageModal(profile.avatar!)}
                        className="bg-white hover:bg-gray-100 border-2 border-purple-600 text-purple-600 p-2 rounded-full shadow-lg transition-all"
                        title={language === 'ar' ? 'عرض الصورة' : 'View Photo'}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    )}
                    <label
                      className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg transition-all cursor-pointer"
                      title={
                        language === 'ar' ? 'تغيير الصورة' : 'Change Photo'
                      }
                    >
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Uploading Overlay */}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/80 rounded-full flex flex-col items-center justify-center">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                      <span className="text-white text-xs font-medium mt-2">
                        {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name and Info */}
                <div className="pb-2 flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {user?.fullName || 'Coach Name'}
                  </h1>
                  <p className="text-lg text-gray-600 mb-3">
                    {profile.primarySport}
                    {profile.coachingSpecialties &&
                      profile.coachingSpecialties.length > 0 && (
                        <span className="text-gray-400">
                          {' '}
                          • {profile.coachingSpecialties.join(', ')}
                        </span>
                      )}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {language === 'ar'
                            ? profile.location.cityAr || profile.location.city
                            : profile.location.city}
                          ,{' '}
                          {language === 'ar'
                            ? profile.location.countryAr ||
                              profile.location.country
                            : profile.location.country}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>
                        {profile.experienceYears}{' '}
                        {language === 'ar' ? 'سنوات خبرة' : 'years experience'}
                      </span>
                    </div>

                    {profile.ratingStats && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">
                          {profile.ratingStats.averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-500">
                          ({profile.ratingStats.totalReviews})
                        </span>
                      </div>
                    )}

                    {profile.languages && profile.languages.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{profile.languages.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Completion Badge */}
              {profile.completionPercentage && (
                <div className="md:mb-4">
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                      {profile.completionPercentage}%
                    </div>
                    <div className="text-xs text-gray-600">
                      {language === 'ar' ? 'اكتمال الملف' : 'Profile Complete'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'نبذة عني' : 'About Me'}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {language === 'ar' && profile.bioAr
                    ? profile.bioAr
                    : profile.bio}
                </p>
              </motion.div>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'الشهادات' : 'Certifications'}
                </h2>
                <div className="space-y-4">
                  {profile.certifications.map((cert, index) => (
                    <div
                      key={cert._id || index}
                      className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {language === 'ar' && cert.nameAr
                              ? cert.nameAr
                              : cert.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {cert.issuedBy}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(cert.issuedDate).toLocaleDateString(
                              language === 'ar' ? 'ar-SA' : 'en-US',
                              { year: 'numeric', month: 'long' }
                            )}
                          </p>
                        </div>
                        {cert.level && (
                          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                            {cert.level}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Photos Gallery */}
            {profile.photos && profile.photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.photos.slice(0, 6).map((photo) => (
                    <div
                      key={photo._id}
                      className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={photo.mediumUrl || photo.url}
                        alt={photo.caption || 'Photo'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {photo.caption && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <p className="text-white text-sm">
                            {language === 'ar' && photo.captionAr
                              ? photo.captionAr
                              : photo.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {profile.photos.length > 6 && (
                  <button
                    onClick={() => router.push('/dashboard/coach/gallery')}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm"
                  >
                    {language === 'ar'
                      ? `عرض جميع الصور (${profile.photos.length})`
                      : `View all photos (${profile.photos.length})`}{' '}
                    →
                  </button>
                )}
              </motion.div>
            )}

            {/* Videos */}
            {profile.videos && profile.videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'مقاطع الفيديو' : 'Videos'}
                </h2>
                <div className="space-y-4">
                  {profile.videos.map((video) => (
                    <div
                      key={video._id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-100 rounded-lg p-3">
                          <PlayCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {language === 'ar' && video.titleAr
                              ? video.titleAr
                              : video.title}
                          </h3>
                          {video.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {language === 'ar' && video.descriptionAr
                                ? video.descriptionAr
                                : video.description}
                            </p>
                          )}
                          {video.duration && (
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.floor(video.duration / 60)}:
                              {String(video.duration % 60).padStart(2, '0')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            {(profile.studentStats || profile.sessionStats) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'الإحصائيات' : 'Statistics'}
                </h2>
                <div className="space-y-4">
                  {profile.studentStats && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {language === 'ar'
                            ? 'إجمالي الطلاب'
                            : 'Total Students'}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {profile.studentStats.total}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {language === 'ar'
                            ? 'الطلاب النشطين'
                            : 'Active Students'}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {profile.studentStats.active}
                        </span>
                      </div>
                    </>
                  )}
                  {profile.sessionStats && (
                    <>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-gray-600">
                          {language === 'ar'
                            ? 'جلسات مكتملة'
                            : 'Completed Sessions'}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {profile.sessionStats.completed}
                        </span>
                      </div>
                      {profile.sessionStats.completionRate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {language === 'ar'
                              ? 'معدل الإنجاز'
                              : 'Completion Rate'}
                          </span>
                          <span className="text-lg font-bold text-purple-600">
                            {profile.sessionStats.completionRate}%
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Training Locations */}
            {profile.trainingLocations &&
              profile.trainingLocations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    {language === 'ar' ? 'أماكن التدريب' : 'Training Locations'}
                  </h2>
                  <div className="space-y-2">
                    {profile.trainingLocations.map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700 p-2 bg-gray-50 rounded-lg"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{location}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            {/* Privacy Status */}
            {profile.privacy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'الخصوصية' : 'Privacy'}
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {language === 'ar' ? 'رؤية الملف' : 'Profile Visibility'}
                    </span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {profile.privacy.profileVisibility.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {language === 'ar'
                        ? 'السماح بالحجوزات'
                        : 'Allow Bookings'}
                    </span>
                    <span
                      className={`font-semibold ${profile.privacy.allowBookings ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {profile.privacy.allowBookings
                        ? language === 'ar'
                          ? 'نعم'
                          : 'Yes'
                        : language === 'ar'
                          ? 'لا'
                          : 'No'}
                    </span>
                  </div>
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
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setViewImageModal(null)}
        >
          <button
            onClick={() => setViewImageModal(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative w-full h-full max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={viewImageModal}
              alt="Full size"
              fill
              className="object-contain"
              sizes="(max-width: 1536px) 100vw, 1536px"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default CoachProfilePage
