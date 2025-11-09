'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  MapPin,
  Briefcase,
  Award,
  Users,
  Globe,
  Calendar,
  Target,
  TrendingUp,
  Image as ImageIcon,
  Video,
  Plus,
  X,
  Cake,
  Languages,
  Ruler,
  Weight as WeightIcon,
  Upload,
  Camera,
} from 'lucide-react'
import Link from 'next/link'
import playerService from '@/services/player'
import type { PlayerProfile, UpdatePlayerProfileData } from '@/types/player'
import { useRouter } from 'next/navigation'
import { calculateProfileCompletion } from '@/utils/profileCompletion'

const EditPlayerProfilePage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState({
    percentage: 0,
    missingFields: [],
    completedFields: [],
    totalFields: 0,
    completedCount: 0,
  })

  const [formData, setFormData] = useState<UpdatePlayerProfileData>({
    bio: '',
    bioAr: '',
    primarySport: '',
    position: '',
    positionAr: '',
    level: 'amateur',
    nationality: '',
    birthDate: '',
    languages: [],
    yearsOfExperience: 0,
    preferredFoot: 'right',
    status: 'active',
    location: {
      country: '',
      city: '',
      address: '',
    },
    height: {
      value: 0,
      unit: 'cm',
    },
    weight: {
      value: 0,
      unit: 'kg',
    },
    goals: '',
    goalsAr: '',
    additionalSports: [],
    currentClub: undefined,
    statistics: undefined,
    highlightVideoUrl: '',
    availableForTraining: true,
    openToRelocation: false,
  })

  const [languageInput, setLanguageInput] = useState('')
  const [sportInput, setSportInput] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const profile = await playerService.getMyProfile()

      // Calculate completion
      const completion = calculateProfileCompletion(profile as any)
      setProfileCompletion(completion as any)

      // Set image previews
      setAvatarPreview(profile.avatar || null)
      setBannerPreview(profile.bannerImage || null)

      // Map profile data to form
      setFormData({
        bio: profile.bio || '',
        bioAr: profile.bioAr || '',
        primarySport: profile.primarySport || '',
        position: profile.position || '',
        positionAr: profile.positionAr || '',
        level: profile.level || 'amateur',
        nationality: profile.nationality || '',
        birthDate: profile.birthDate || '',
        languages: profile.languages || [],
        yearsOfExperience: profile.yearsOfExperience || 0,
        preferredFoot: profile.preferredFoot || 'right',
        status: profile.status || 'active',
        location: profile.location || { country: '', city: '', address: '' },
        height: profile.height || { value: 0, unit: 'cm' },
        weight: profile.weight || { value: 0, unit: 'kg' },
        goals: profile.goals || '',
        goalsAr: profile.goalsAr || '',
        additionalSports: profile.additionalSports || [],
        currentClub: profile.currentClub || undefined,
        statistics: profile.statistics || undefined,
        highlightVideoUrl: profile.highlightVideoUrl || '',
        availableForTraining: profile.availableForTraining ?? true,
        openToRelocation: profile.openToRelocation ?? false,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      await playerService.updateProfile(formData)

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/player/profile')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const addLanguage = () => {
    const normalizedLanguage = languageInput.trim().toLowerCase()
    if (
      normalizedLanguage &&
      !formData.languages?.includes(normalizedLanguage)
    ) {
      setFormData({
        ...formData,
        languages: [...(formData.languages || []), normalizedLanguage],
      })
      setLanguageInput('')
    }
  }

  const removeLanguage = (lang: string) => {
    setFormData({
      ...formData,
      languages: formData.languages?.filter((l) => l !== lang) || [],
    })
  }

  const addSport = () => {
    if (
      sportInput.trim() &&
      !formData.additionalSports?.includes(sportInput.trim())
    ) {
      setFormData({
        ...formData,
        additionalSports: [
          ...(formData.additionalSports || []),
          sportInput.trim(),
        ],
      })
      setSportInput('')
    }
  }

  const removeSport = (sport: string) => {
    setFormData({
      ...formData,
      additionalSports:
        formData.additionalSports?.filter((s) => s !== sport) || [],
    })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar file size must be less than 5MB')
      return
    }

    try {
      setUploadingAvatar(true)
      setError(null)

      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      const avatarData = await playerService.uploadAvatar(file)

      // Update form data with Cloudinary URL
      setFormData({ ...formData, avatar: avatarData.url })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar')
      setAvatarPreview(null)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Banner file size must be less than 5MB')
      return
    }

    try {
      setUploadingBanner(true)
      setError(null)

      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      const bannerData = await playerService.uploadBanner(file)

      // Update form data with Cloudinary URL
      setFormData({ ...formData, bannerImage: bannerData.url })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to upload banner')
      setBannerPreview(null)
    } finally {
      setUploadingBanner(false)
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/player/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'تحديث الملف الشخصي' : 'Edit Profile'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {profileCompletion.percentage}%{' '}
                {language === 'ar' ? 'مكتمل' : 'complete'} •{' '}
                {profileCompletion.completedCount}/
                {profileCompletion.totalFields}{' '}
                {language === 'ar' ? 'حقول' : 'fields'}
              </p>
            </div>
            <Button
              onClick={handleSubmit}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6"
          >
            {language === 'ar'
              ? 'تم تحديث الملف الشخصي بنجاح!'
              : 'Profile updated successfully!'}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Banner Image */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-80" />
              )}
              <label className="absolute bottom-4 right-4 cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white transition-all rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
                {uploadingBanner ? (
                  <>
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-blue-600">
                      {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'ar' ? 'تغيير الغلاف' : 'Change Banner'}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                  disabled={uploadingBanner}
                />
              </label>
            </div>

            {/* Avatar Image */}
            <div className="px-6 pb-6">
              <div className="relative -mt-16 w-32 h-32 mx-auto">
                <div className="w-32 h-32 rounded-2xl bg-white shadow-2xl border-4 border-white overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 cursor-pointer bg-blue-600 hover:bg-blue-700 transition-all rounded-full p-2 shadow-lg">
                  {uploadingAvatar ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                {language === 'ar'
                  ? 'انقر على الصورة لتغيير صورة الملف الشخصي'
                  : 'Click on the image to change your profile picture'}
              </p>
            </div>
          </motion.div>

          {/* Core Information - 40% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                {language === 'ar' ? 'المعلومات الأساسية' : 'Core Information'}
              </h2>
              <span className="text-sm font-medium text-blue-600">
                40% {language === 'ar' ? 'من الوزن' : 'weight'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الرياضة الأساسية' : 'Primary Sport'} *
                </label>
                <Input
                  value={formData.primarySport}
                  onChange={(e) =>
                    setFormData({ ...formData, primarySport: e.target.value })
                  }
                  placeholder="e.g., Football, Basketball"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المركز' : 'Position'} *
                </label>
                <Input
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="e.g., Striker, Guard"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المستوى' : 'Level'} *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="amateur">Amateur</option>
                  <option value="semi-pro">Semi-Pro</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="looking_for_club">Looking for Club</option>
                  <option value="open_to_offers">Open to Offers</option>
                  <option value="not_available">Not Available</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الدولة' : 'Country'} *
                </label>
                <Input
                  value={formData.location?.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location!,
                        country: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., Egypt"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المدينة' : 'City'} *
                </label>
                <Input
                  value={formData.location?.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location!, city: e.target.value },
                    })
                  }
                  placeholder="e.g., Cairo"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Personal Details - 20% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6 text-purple-600" />
                {language === 'ar' ? 'التفاصيل الشخصية' : 'Personal Details'}
              </h2>
              <span className="text-sm font-medium text-purple-600">
                20% {language === 'ar' ? 'من الوزن' : 'weight'}
              </span>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نبذة عني (إنجليزي)' : 'Bio (English)'}
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نبذة عني (عربي)' : 'Bio (Arabic)'}
                </label>
                <Textarea
                  value={formData.bioAr}
                  onChange={(e) =>
                    setFormData({ ...formData, bioAr: e.target.value })
                  }
                  rows={4}
                  placeholder="أخبرنا عن نفسك..."
                  className="resize-none"
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Cake className="w-4 h-4" />
                    {language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}
                  </label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الجنسية' : 'Nationality'}
                  </label>
                  <Input
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                    placeholder="e.g., Egyptian, American"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  {language === 'ar' ? 'اللغات' : 'Languages'}
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addLanguage())
                    }
                    placeholder="Add a language..."
                  />
                  <Button type="button" onClick={addLanguage} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.languages?.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="hover:bg-green-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Physical Attributes - 15% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                {language === 'ar'
                  ? 'المواصفات الجسدية'
                  : 'Physical Attributes'}
              </h2>
              <span className="text-sm font-medium text-green-600">
                15% {language === 'ar' ? 'من الوزن' : 'weight'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  {language === 'ar' ? 'الطول (سم)' : 'Height (cm)'}
                </label>
                <Input
                  type="number"
                  value={formData.height?.value || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      height: {
                        value: parseInt(e.target.value) || 0,
                        unit: 'cm',
                      },
                    })
                  }
                  placeholder="180"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <WeightIcon className="w-4 h-4" />
                  {language === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}
                </label>
                <Input
                  type="number"
                  value={formData.weight?.value || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: {
                        value: parseInt(e.target.value) || 0,
                        unit: 'kg',
                      },
                    })
                  }
                  placeholder="75"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'القدم المفضلة' : 'Preferred Foot'}
                </label>
                <select
                  value={formData.preferredFoot}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredFoot: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Experience & Career - 15% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-600" />
                {language === 'ar' ? 'الخبرة والمسيرة' : 'Experience & Career'}
              </h2>
              <span className="text-sm font-medium text-yellow-600">
                15% {language === 'ar' ? 'من الوزن' : 'weight'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}
                </label>
                <Input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearsOfExperience: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max="50"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'النادي الحالي' : 'Current Club'}
                </label>
                <Input
                  value={formData.currentClub?.clubName || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentClub: {
                        clubName: e.target.value,
                        joinedDate: formData.currentClub?.joinedDate,
                      },
                    })
                  }
                  placeholder="e.g., Cairo Sports Academy"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar'
                    ? 'إحصائيات المباريات'
                    : 'Statistics (Matches Played)'}
                </label>
                <Input
                  type="number"
                  value={formData.statistics?.matchesPlayed || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statistics: {
                        ...formData.statistics,
                        matchesPlayed: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="120"
                />
              </div>
            </div>
          </motion.div>

          {/* Media & Showcase - 10% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-pink-600" />
                {language === 'ar' ? 'الوسائط والعرض' : 'Media & Showcase'}
              </h2>
              <span className="text-sm font-medium text-pink-600">
                10% {language === 'ar' ? 'من الوزن' : 'weight'}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  {language === 'ar'
                    ? 'فيديو الإبرازات'
                    : 'Highlight Video URL'}
                </label>
                <Input
                  value={formData.highlightVideoUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      highlightVideoUrl: e.target.value,
                    })
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>
              <p className="text-sm text-gray-500">
                {language === 'ar'
                  ? 'يمكنك إضافة الصور والفيديوهات من معرض الوسائط'
                  : 'Add photos and videos from the Media Gallery page'}
              </p>
              <Link href="/dashboard/player/gallery">
                <Button type="button" variant="outline" className="w-full">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {language === 'ar'
                    ? 'انتقل لمعرض الوسائط'
                    : 'Go to Media Gallery'}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-600" />
              {language === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar'
                    ? 'الأهداف المهنية (إنجليزي)'
                    : 'Career Goals (English)'}
                </label>
                <Textarea
                  value={formData.goals}
                  onChange={(e) =>
                    setFormData({ ...formData, goals: e.target.value })
                  }
                  rows={3}
                  placeholder="What are your career goals?"
                  className="resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar'
                    ? 'الأهداف المهنية (عربي)'
                    : 'Career Goals (Arabic)'}
                </label>
                <Textarea
                  value={formData.goalsAr}
                  onChange={(e) =>
                    setFormData({ ...formData, goalsAr: e.target.value })
                  }
                  rows={3}
                  placeholder="ما هي أهدافك المهنية؟"
                  className="resize-none"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رياضات إضافية' : 'Additional Sports'}
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={sportInput}
                    onChange={(e) => setSportInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addSport())
                    }
                    placeholder="Add a sport..."
                  />
                  <Button type="button" onClick={addSport} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.additionalSports?.map((sport, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {sport}
                      <button
                        type="button"
                        onClick={() => removeSport(sport)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.availableForTraining}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableForTraining: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">
                    {language === 'ar'
                      ? 'متاح للتدريب'
                      : 'Available for Training'}
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.openToRelocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        openToRelocation: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">
                    {language === 'ar'
                      ? 'مستعد للانتقال'
                      : 'Open to Relocation'}
                  </span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 sticky bottom-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200"
          >
            <Link href="/dashboard/player/profile" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={saving}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}

export default EditPlayerProfilePage
