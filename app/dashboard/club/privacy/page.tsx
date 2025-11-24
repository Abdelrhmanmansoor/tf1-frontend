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
  Users,
  Globe,
  Lock,
  Unlock,
  Loader2,
  CheckCircle2,
  Briefcase,
  Calendar,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import clubService from '@/services/club'
import type { Privacy } from '@/types/club'

const ClubPrivacySettingsPage = () => {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [privacy, setPrivacy] = useState<Privacy>({
    profileVisibility: 'public',
    showMembers: true,
    showStatistics: true,
    showContactInfo: true,
    allowSearch: true,
    allowMembershipRequests: true,
    allowJobApplications: true,
    allowBookings: true,
  })

  useEffect(() => {
    fetchPrivacySettings()
  }, [])

  const fetchPrivacySettings = async () => {
    try {
      setLoading(true)
      const profile = await clubService.getMyProfile()
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

      await clubService.updatePrivacySettings({ privacy })

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
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
                <Shield className="w-6 h-6 text-blue-600" />
                {language === 'ar' ? 'إعدادات الخصوصية' : 'Privacy Settings'}
              </h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-6 h-6" />
              {language === 'ar' ? 'ظهور الملف الشخصي' : 'Profile Visibility'}
            </h2>
            <p className="text-blue-100 text-sm mt-2">
              {language === 'ar'
                ? 'حدد من يمكنه رؤية ملف النادي'
                : 'Control who can see your club profile'}
            </p>
          </div>
          <div className="p-6 space-y-4">
            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 ${
                privacy.profileVisibility === 'public'
                  ? 'border-blue-500 bg-blue-50'
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
                className="mt-1 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-gray-900">
                    {language === 'ar' ? 'عام' : 'Public'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'يمكن لأي شخص رؤية ملف النادي'
                    : 'Anyone can see your club profile'}
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition hover:bg-gray-50 ${
                privacy.profileVisibility === 'members_only'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value="members_only"
                checked={privacy.profileVisibility === 'members_only'}
                onChange={() =>
                  setPrivacy({ ...privacy, profileVisibility: 'members_only' })
                }
                className="mt-1 w-5 h-5 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-gray-900">
                    {language === 'ar' ? 'الأعضاء فقط' : 'Members Only'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'يمكن للأعضاء المسجلين فقط رؤية الملف'
                    : 'Only registered members can see your profile'}
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
                    ? 'الملف غير مرئي للعامة'
                    : 'Profile is not visible to public'}
                </p>
              </div>
            </label>
          </div>
        </motion.div>

        {/* Information Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
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
            {/* Show Members */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.showMembers
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.showMembers ? (
                    <Users className="w-5 h-5 text-green-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar' ? 'إظهار الأعضاء' : 'Show Members'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'عرض قائمة أعضاء النادي'
                        : 'Display club members list'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showMembers}
                    onChange={(e) =>
                      setPrivacy({ ...privacy, showMembers: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                </div>
              </label>
            </div>

            {/* Show Statistics */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.showStatistics
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.showStatistics ? (
                    <MapPin className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar'
                        ? 'إظهار الإحصائيات'
                        : 'Show Statistics'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'عرض إحصائيات النادي'
                        : 'Display club statistics'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showStatistics}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        showStatistics: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>

            {/* Show Contact Info */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.showContactInfo
                  ? 'border-purple-200 bg-purple-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.showContactInfo ? (
                    <Unlock className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar'
                        ? 'إظهار معلومات الاتصال'
                        : 'Show Contact Info'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'البريد الإلكتروني والهاتف'
                        : 'Email and phone numbers'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.showContactInfo}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        showContactInfo: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                </div>
              </label>
            </div>

            {/* Allow Job Applications */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.allowJobApplications
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.allowJobApplications ? (
                    <Briefcase className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {language === 'ar'
                        ? 'السماح بطلبات التوظيف'
                        : 'Allow Job Applications'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'قبول طلبات التوظيف من المتقدمين'
                        : 'Accept job applications from candidates'}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privacy.allowJobApplications}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        allowJobApplications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-600"></div>
                </div>
              </label>
            </div>

            {/* Allow Bookings */}
            <div
              className={`p-4 border-2 rounded-xl transition ${
                privacy.allowBookings
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  {privacy.allowBookings ? (
                    <Calendar className="w-5 h-5 text-indigo-600" />
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
                        ? 'قبول حجوزات المنشآت'
                        : 'Accept facility bookings'}
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
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

export default ClubPrivacySettingsPage
