'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Save,
  Shield,
  Eye,
  MapPin,
  Phone,
  Mail,
  Lock,
  Unlock,
  Users,
  Globe,
  Loader2,
  CheckCircle2,
  MessageCircle,
  Calendar,
  UserCheck,
} from 'lucide-react'
import Link from 'next/link'
import coachService from '@/services/coach'
import type { Privacy } from '@/types/coach'

const PrivacySettingsPage = () => {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [privacy, setPrivacy] = useState<Privacy>({
    showPhoneNumber: true,
    showEmail: true,
    showLocation: true,
    showStudentCount: true,
    profileVisibility: 'public',
    allowMessages: true,
    allowBookings: true,
  })

  useEffect(() => {
    fetchPrivacySettings()
  }, [])

  const fetchPrivacySettings = async () => {
    try {
      setLoading(true)
      const profile = await coachService.getMyProfile()
      if (profile.privacy) {
        setPrivacy(profile.privacy)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load privacy settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      await coachService.updatePrivacy({ privacy })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update privacy settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {language === 'ar' ? 'العودة' : 'Back'}
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                {language === 'ar' ? 'إعدادات الخصوصية' : 'Privacy Settings'}
              </h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving
                ? language === 'ar'
                  ? 'جاري الحفظ...'
                  : 'Saving...'
                : language === 'ar'
                  ? 'حفظ'
                  : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            {language === 'ar'
              ? 'تم تحديث إعدادات الخصوصية بنجاح!'
              : 'Privacy settings updated successfully!'}
          </motion.div>
        )}

        {/* Profile Visibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-6 h-6" />
              {language === 'ar' ? 'ظهور الملف الشخصي' : 'Profile Visibility'}
            </h2>
            <p className="text-purple-100 text-sm mt-2">
              {language === 'ar'
                ? 'حدد من يمكنه رؤية ملفك الشخصي'
                : 'Control who can see your profile'}
            </p>
          </div>
          <div className="p-6 space-y-4">
            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 ${
                privacy.profileVisibility === 'public'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={privacy.profileVisibility === 'public'}
                onChange={() =>
                  setPrivacy({ ...privacy, profileVisibility: 'public' })
                }
                className="mt-1 w-5 h-5 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-gray-900">
                    {language === 'ar' ? 'عام' : 'Public'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'يمكن لأي شخص رؤية ملفك الشخصي'
                    : 'Anyone can see your profile'}
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 ${
                privacy.profileVisibility === 'registered_users'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value="registered_users"
                checked={privacy.profileVisibility === 'registered_users'}
                onChange={() =>
                  setPrivacy({
                    ...privacy,
                    profileVisibility: 'registered_users',
                  })
                }
                className="mt-1 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-gray-900">
                    {language === 'ar'
                      ? 'المستخدمون المسجلون فقط'
                      : 'Registered Users Only'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'يمكن للمستخدمين المسجلين فقط رؤية ملفك'
                    : 'Only registered users can see your profile'}
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 ${
                privacy.profileVisibility === 'private'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={privacy.profileVisibility === 'private'}
                onChange={() =>
                  setPrivacy({ ...privacy, profileVisibility: 'private' })
                }
                className="mt-1 w-5 h-5 text-red-600 focus:ring-2 focus:ring-red-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-gray-900">
                    {language === 'ar' ? 'خاص' : 'Private'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'مخفي من البحث والاستكشاف'
                    : 'Hidden from search and discovery'}
                </p>
              </div>
            </label>
          </div>
        </motion.div>

        {/* Contact Information Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Eye className="w-6 h-6 text-green-600" />
            {language === 'ar' ? 'خصوصية المعلومات' : 'Information Privacy'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar'
              ? 'اختر المعلومات التي تريد مشاركتها مع الآخرين'
              : 'Choose what information you want to share with others'}
          </p>

          <div className="space-y-4">
            {/* Show Phone Number */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.showPhoneNumber
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.showPhoneNumber ? (
                    <Phone className="w-5 h-5 text-green-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar'
                        ? 'إظهار رقم الهاتف'
                        : 'Show Phone Number'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'يمكن للاعبين رؤية رقم هاتفك'
                        : 'Players can see your phone number'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showPhoneNumber}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        showPhoneNumber: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                </div>
              </label>
            </div>

            {/* Show Email */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.showEmail
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.showEmail ? (
                    <Mail className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar'
                        ? 'إظهار البريد الإلكتروني'
                        : 'Show Email'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'يمكن للاعبين رؤية بريدك الإلكتروني'
                        : 'Players can see your email'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, showEmail: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>

            {/* Show Location */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.showLocation
                  ? 'border-purple-200 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.showLocation ? (
                    <MapPin className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar' ? 'إظهار الموقع' : 'Show Location'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'المدينة والبلد'
                        : 'City and country'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showLocation}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, showLocation: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                </div>
              </label>
            </div>

            {/* Show Student Count */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.showStudentCount
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.showStudentCount ? (
                    <Users className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar'
                        ? 'إظهار عدد الطلاب'
                        : 'Show Student Count'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'إجمالي الطلاب الذين تدربهم'
                        : 'Total students you train'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showStudentCount}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        showStudentCount: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Interaction Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-orange-600" />
            {language === 'ar' ? 'إعدادات التفاعل' : 'Interaction Settings'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'ar'
              ? 'تحكم في كيفية تفاعل الآخرين معك'
              : 'Control how others can interact with you'}
          </p>

          <div className="space-y-4">
            {/* Allow Messages */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.allowMessages
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.allowMessages ? (
                    <MessageCircle className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar' ? 'السماح بالرسائل' : 'Allow Messages'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'يمكن للاعبين إرسال رسائل إليك'
                        : 'Players can send you messages'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.allowMessages}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        allowMessages: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
                </div>
              </label>
            </div>

            {/* Allow Bookings */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.allowBookings
                  ? 'border-teal-200 bg-teal-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.allowBookings ? (
                    <Calendar className="w-5 h-5 text-teal-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar'
                        ? 'السماح بالحجوزات'
                        : 'Allow Bookings'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'يمكن للاعبين حجز جلسات تدريب'
                        : 'Players can book training sessions'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.allowBookings}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        allowBookings: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600"></div>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacySettingsPage
