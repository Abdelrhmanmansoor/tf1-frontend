'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import clubService from '@/services/club'
import type { ClubProfile } from '@/types/club'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  Star,
  Edit,
  ArrowLeft,
  CheckCircle,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Shield,
  Award,
  Loader2,
  FileText,
  Image as ImageIcon,
  Video,
  TrendingUp,
  AlertTriangle,
  Info,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const ClubProfilePage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState<ClubProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clubService.getMyProfile()
      console.log('Club profile data:', data)
      setProfile(data)
    } catch (err: any) {
      console.error('Error fetching club profile:', err)
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleRetryVerification = async () => {
    if (!profile?.nationalAddress) return

    try {
      setIsRetrying(true)
      const { buildingNumber, additionalNumber, zipCode } =
        profile.nationalAddress

      if (!buildingNumber || !additionalNumber || !zipCode) {
        toast.error(
          language === 'ar'
            ? 'بيانات العنوان الوطني ناقصة'
            : 'Incomplete national address data'
        )
        return
      }

      const result = await clubService.retryVerification({
        buildingNumber,
        additionalNumber,
        zipCode,
      })

      if (result.success && result.verified) {
        toast.success(result.message)
        setProfile(result.profile)
      } else {
        toast.error(result.message)
        if (result.profile) {
          setProfile(result.profile)
        }
      }
    } catch (err: any) {
      console.error('Retry verification error:', err)
      toast.error(
        err.message ||
          (language === 'ar' ? 'حدث خطأ أثناء التحقق' : 'Error during verification')
      )
    } finally {
      setIsRetrying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error || !profile) {
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
          <button
            onClick={fetchProfile}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </motion.div>
      </div>
    )
  }

  const organizationTypeLabel = {
    sports_club: language === 'ar' ? 'نادي رياضي' : 'Sports Club',
    academy: language === 'ar' ? 'أكاديمية' : 'Academy',
    training_center: language === 'ar' ? 'مركز تدريب' : 'Training Center',
    federation: language === 'ar' ? 'اتحاد' : 'Federation',
    other: language === 'ar' ? 'أخرى' : 'Other',
  }[profile.organizationType]

  const legalStatusLabel = {
    licensed: language === 'ar' ? 'مرخص' : 'Licensed',
    registered: language === 'ar' ? 'مسجل' : 'Registered',
    pending: language === 'ar' ? 'قيد المراجعة' : 'Pending',
    unlicensed: language === 'ar' ? 'غير مرخص' : 'Unlicensed',
  }[profile.legalStatus || 'unlicensed']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'ar' ? 'ملف النادي' : 'Club Profile'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {language === 'ar'
                    ? 'اعرض وأدر معلومات النادي'
                    : 'View and manage club information'}
                </p>
              </div>
            </div>
            <Link href="/dashboard/club/profile/edit">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                <Edit className="w-5 h-5" />
                {language === 'ar' ? 'تعديل الملف' : 'Edit Profile'}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border overflow-hidden mb-8"
        >
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Club Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              {/* Logo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  {profile.logo ? (
                    <img
                      src={profile.logo}
                      alt={profile.clubName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Name and Stats */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {profile.clubName}
                      </h2>
                      {profile.nationalAddress?.isVerified ? (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 border border-green-200">
                          <div className="relative flex items-center justify-center">
                            <Shield className="w-4 h-4 text-green-600 fill-green-100" />
                            <CheckCircle className="w-2.5 h-2.5 text-green-600 absolute" />
                          </div>
                          {language === 'ar'
                            ? 'تم تأكيد العنوان الوطني'
                            : 'National Address Verified'}
                        </div>
                      ) : (
                        <div className="group relative">
                          <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 border border-orange-200 cursor-help">
                            <AlertTriangle className="w-4 h-4" />
                            {language === 'ar'
                              ? 'العنوان الوطني غير موثّق بعد'
                              : 'National Address Not Yet Verified'}
                          </div>
                          {/* Tooltip */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-xl">
                            {language === 'ar'
                              ? 'تم تسجيل النادي بدون توثيق العنوان الوطني — ولم يتم التحقق من الموقع الجغرافي رسميًا.'
                              : 'Club registered without national address verification — geographic location not officially verified.'}
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-lg">
                      {organizationTypeLabel}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-2xl font-bold text-gray-900">
                          {profile.ratingStats?.averageRating.toFixed(1) ||
                            '0.0'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {profile.ratingStats?.totalReviews || 0}{' '}
                        {language === 'ar' ? 'تقييم' : 'reviews'}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">
                          {profile.memberStats?.totalMembers || 0}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === 'ar' ? 'أعضاء' : 'Members'}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">
                          {profile.completionPercentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === 'ar' ? 'اكتمال' : 'Complete'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sports Tags */}
                <div className="flex flex-wrap gap-2">
                  {profile.availableSports.map((sport) => (
                    <span
                      key={sport}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                {language === 'ar' ? 'نبذة عن النادي' : 'About'}
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {language === 'ar' && profile.about.bioAr
                  ? profile.about.bioAr
                  : profile.about.bio}
              </p>

              {profile.about.vision && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-bold text-gray-900 mb-2">
                    {language === 'ar' ? 'الرؤية' : 'Vision'}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'ar' && profile.about.visionAr
                      ? profile.about.visionAr
                      : profile.about.vision}
                  </p>
                </div>
              )}

              {profile.about.mission && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-bold text-gray-900 mb-2">
                    {language === 'ar' ? 'الرسالة' : 'Mission'}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'ar' && profile.about.missionAr
                      ? profile.about.missionAr
                      : profile.about.mission}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Facility Details */}
            {profile.facilityDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  {language === 'ar' ? 'تفاصيل المنشأة' : 'Facility Details'}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {profile.facilityDetails.facilitySizeSqm && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'ar' ? 'المساحة' : 'Size'}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {profile.facilityDetails.facilitySizeSqm.toLocaleString()}{' '}
                        {language === 'ar' ? 'م²' : 'sqm'}
                      </p>
                    </div>
                  )}

                  {profile.facilityDetails.capacity && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'ar' ? 'السعة' : 'Capacity'}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {profile.facilityDetails.capacity.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {profile.facilityDetails.numberOfFields && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'ar' ? 'عدد الملاعب' : 'Fields'}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {profile.facilityDetails.numberOfFields}
                      </p>
                    </div>
                  )}
                </div>

                {profile.facilityDetails.facilityTypes &&
                  profile.facilityDetails.facilityTypes.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'ar' ? 'أنواع المنشآت' : 'Facility Types'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.facilityDetails.facilityTypes.map((type) => (
                          <span
                            key={type}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            {type.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {profile.facilityDetails.additionalAmenities &&
                  profile.facilityDetails.additionalAmenities.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'ar' ? 'المرافق الإضافية' : 'Amenities'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.facilityDetails.additionalAmenities.map(
                          (amenity) => (
                            <span
                              key={amenity}
                              className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold"
                            >
                              {amenity.replace(/_/g, ' ')}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </motion.div>
            )}

            {/* Operating Hours */}
            {profile.operatingHours && profile.operatingHours.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  {language === 'ar' ? 'ساعات العمل' : 'Operating Hours'}
                </h3>

                <div className="space-y-3">
                  {profile.operatingHours.map((schedule) => (
                    <div
                      key={schedule.day}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="font-semibold text-gray-900 capitalize">
                        {schedule.day}
                      </span>
                      {schedule.isOpen ? (
                        <span className="text-gray-700">
                          {schedule.openTime} - {schedule.closeTime}
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          {language === 'ar' ? 'مغلق' : 'Closed'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Contact & Details */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
              </h3>

              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'الموقع' : 'Location'}
                    </p>
                    <p className="text-gray-900 font-medium">
                      {profile.location.address}
                    </p>
                    <p className="text-gray-700">
                      {profile.location.city}, {profile.location.country}
                    </p>
                    {profile.location.postalCode && (
                      <p className="text-gray-600 text-sm">
                        {profile.location.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* National Address */}
                {profile.nationalAddress && (
                  <div className="flex items-start gap-3">
                    {profile.nationalAddress.isVerified ? (
                      <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 mb-1">
                          {language === 'ar'
                            ? 'العنوان الوطني'
                            : 'National Address'}
                        </p>
                        {!profile.nationalAddress.isVerified && (
                          <button
                            onClick={handleRetryVerification}
                            disabled={isRetrying}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <RefreshCw
                              className={`w-3 h-3 ${
                                isRetrying ? 'animate-spin' : ''
                              }`}
                            />
                            {language === 'ar' ? 'إعادة التحقق' : 'Retry'}
                          </button>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium">
                        {profile.nationalAddress.buildingNumber}
                        {profile.nationalAddress.additionalNumber
                          ? ` - ${profile.nationalAddress.additionalNumber}`
                          : ''}
                      </p>
                      <p className="text-gray-700">
                        {profile.nationalAddress.zipCode}
                      </p>
                      {!profile.nationalAddress.isVerified && (
                        <p className="text-xs text-orange-600 mt-1">
                          {language === 'ar' ? 'غير موثق' : 'Not Verified'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </p>
                    <a
                      href={`mailto:${profile.contactInfo.email}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {profile.contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {language === 'ar' ? 'الهاتف' : 'Phone'}
                    </p>
                    {profile.contactInfo.phoneNumbers.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone}`}
                        className="block text-blue-600 hover:underline font-medium mb-1"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Website */}
                {profile.contactInfo.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                      </p>
                      <a
                        href={profile.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {profile.contactInfo.website}
                      </a>
                    </div>
                  </div>
                )}

                {/* Social Media */}
                {profile.contactInfo.socialMedia && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-3">
                      {language === 'ar' ? 'وسائل التواصل' : 'Social Media'}
                    </p>
                    <div className="flex gap-3">
                      {profile.contactInfo.socialMedia.facebook && (
                        <a
                          href={profile.contactInfo.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {profile.contactInfo.socialMedia.instagram && (
                        <a
                          href={profile.contactInfo.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {profile.contactInfo.socialMedia.twitter && (
                        <a
                          href={profile.contactInfo.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Additional Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'تفاصيل إضافية' : 'Additional Details'}
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ar' ? 'الحالة القانونية' : 'Legal Status'}
                  </p>
                  <p className="text-gray-900 font-medium">
                    {legalStatusLabel}
                  </p>
                </div>

                {profile.establishedDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? 'تاريخ التأسيس' : 'Established'}
                    </p>
                    <p className="text-gray-900 font-medium">
                      {new Date(profile.establishedDate).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </p>
                  </div>
                )}

                {profile.businessRegistrationNumber && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar'
                        ? 'رقم السجل التجاري'
                        : 'Business Registration'}
                    </p>
                    <p className="text-gray-900 font-medium">
                      {profile.businessRegistrationNumber}
                    </p>
                  </div>
                )}

                {profile.sportsLicenseNumber && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {language === 'ar'
                        ? 'رقم الترخيص الرياضي'
                        : 'Sports License'}
                    </p>
                    <p className="text-gray-900 font-medium">
                      {profile.sportsLicenseNumber}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      profile.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : profile.status === 'pending_verification'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {profile.status}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h3>
              <div className="space-y-2">
                <Link href="/dashboard/club/gallery">
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">
                      {language === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
                    </span>
                  </button>
                </Link>
                <Link href="/dashboard/club/members">
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium">
                      {language === 'ar' ? 'الأعضاء' : 'Members'}
                    </span>
                  </button>
                </Link>
                <Link href="/dashboard/club/teams">
                  <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">
                      {language === 'ar' ? 'الفرق' : 'Teams'}
                    </span>
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubProfilePage
