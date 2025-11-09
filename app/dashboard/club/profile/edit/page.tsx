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
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Trophy,
  Users,
  Plus,
  X,
  Upload,
  Camera,
} from 'lucide-react'
import Link from 'next/link'
import clubService from '@/services/club'
import type { ClubProfile, UpdateClubProfileData } from '@/types/club'
import { useRouter } from 'next/navigation'

const EditClubProfilePage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<UpdateClubProfileData>({
    clubName: '',
    clubNameAr: '',
    logo: '',
    contactInfo: {
      phoneNumbers: [],
      email: '',
      website: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: '',
      },
    },
    facilityDetails: {
      facilitySizeSqm: 0,
      capacity: 0,
      numberOfFields: 0,
      facilityTypes: [],
      additionalAmenities: [],
    },
    availableSports: [],
    about: {
      bio: '',
      bioAr: '',
      vision: '',
      visionAr: '',
      mission: '',
      missionAr: '',
    },
    operatingHours: [],
  })

  const [phoneInput, setPhoneInput] = useState('')
  const [sportInput, setSportInput] = useState('')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const profile = await clubService.getMyProfile()

      setLogoPreview(profile.logo || null)

      setFormData({
        clubName: profile.clubName || '',
        clubNameAr: profile.clubNameAr || '',
        logo: profile.logo || '',
        contactInfo: profile.contactInfo || {
          phoneNumbers: [],
          email: '',
          website: '',
          socialMedia: {},
        },
        facilityDetails: profile.facilityDetails || {
          facilitySizeSqm: 0,
          capacity: 0,
          numberOfFields: 0,
          facilityTypes: [],
          additionalAmenities: [],
        },
        availableSports: profile.availableSports || [],
        about: profile.about || {
          bio: '',
          bioAr: '',
          vision: '',
          visionAr: '',
          mission: '',
          missionAr: '',
        },
        operatingHours: profile.operatingHours || [],
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

      // Clean up the form data before sending
      const cleanedData: UpdateClubProfileData = {
        ...formData,
        facilityDetails: formData.facilityDetails
          ? {
              ...formData.facilityDetails,
              // Remove empty arrays
              facilityTypes:
                formData.facilityDetails.facilityTypes &&
                formData.facilityDetails.facilityTypes.length > 0
                  ? formData.facilityDetails.facilityTypes
                  : undefined,
              additionalAmenities:
                formData.facilityDetails.additionalAmenities &&
                formData.facilityDetails.additionalAmenities.length > 0
                  ? formData.facilityDetails.additionalAmenities
                  : undefined,
            }
          : undefined,
      }

      await clubService.updateProfile(cleanedData)

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError(
        language === 'ar'
          ? 'نوع الملف غير صالح. يرجى تحميل صورة (JPEG, PNG, GIF, WebP)'
          : 'Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP)'
      )
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(
        language === 'ar'
          ? 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت'
          : 'File size too large. Maximum 5MB'
      )
      return
    }

    try {
      setUploadingLogo(true)
      setUploadProgress(0)
      setError(null)

      const result = await clubService.uploadLogo(file, (progress) => {
        setUploadProgress(progress)
      })

      // Update logo in form data
      setFormData({
        ...formData,
        logo: result.url,
      })
      setLogoPreview(result.url)
      setUploadProgress(100)

      // Show success message briefly
      setTimeout(() => {
        setUploadProgress(0)
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'Failed to upload logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const addPhone = () => {
    if (
      phoneInput.trim() &&
      !formData.contactInfo?.phoneNumbers?.includes(phoneInput.trim())
    ) {
      setFormData({
        ...formData,
        contactInfo: {
          ...formData.contactInfo!,
          phoneNumbers: [
            ...(formData.contactInfo?.phoneNumbers || []),
            phoneInput.trim(),
          ],
        },
      })
      setPhoneInput('')
    }
  }

  const removePhone = (phone: string) => {
    setFormData({
      ...formData,
      contactInfo: {
        ...formData.contactInfo!,
        phoneNumbers:
          formData.contactInfo?.phoneNumbers?.filter((p) => p !== phone) || [],
      },
    })
  }

  const addSport = () => {
    if (
      sportInput.trim() &&
      !formData.availableSports?.includes(sportInput.trim())
    ) {
      setFormData({
        ...formData,
        availableSports: [
          ...(formData.availableSports || []),
          sportInput.trim(),
        ],
      })
      setSportInput('')
    }
  }

  const removeSport = (sport: string) => {
    setFormData({
      ...formData,
      availableSports:
        formData.availableSports?.filter((s) => s !== sport) || [],
    })
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
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'تحديث ملف النادي' : 'Edit Club Profile'}
              </h1>
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
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-blue-600" />
              {language === 'ar' ? 'شعار النادي' : 'Club Logo'}
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <div className="w-32 h-32 rounded-2xl bg-white shadow-xl border-4 border-white overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  {uploadingLogo && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                      <span className="text-white text-sm font-medium">
                        {uploadProgress}%
                      </span>
                    </div>
                  )}
                </div>
                <label
                  className={`absolute bottom-0 right-0 ${
                    uploadingLogo
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'cursor-pointer bg-blue-600 hover:bg-blue-700'
                  } transition-all rounded-full p-2 shadow-lg`}
                >
                  {uploadingLogo ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'انقر على الأيقونة لتحميل شعار النادي'
                    : 'Click on the icon to upload club logo'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ar'
                    ? 'PNG أو JPG، الحد الأقصى 5 ميجابايت'
                    : 'PNG, JPG, GIF, or WebP, max 5MB'}
                </p>
                {uploadingLogo && (
                  <div className="mt-2">
                    <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ar' ? 'جاري التحميل...' : 'Uploading...'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar'
                    ? 'اسم النادي (إنجليزي)'
                    : 'Club Name (English)'}{' '}
                  *
                </label>
                <Input
                  value={formData.clubName}
                  onChange={(e) =>
                    setFormData({ ...formData, clubName: e.target.value })
                  }
                  placeholder="e.g., Cairo Sports Club"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar'
                    ? 'اسم النادي (عربي)'
                    : 'Club Name (Arabic)'}
                </label>
                <Input
                  value={formData.clubNameAr}
                  onChange={(e) =>
                    setFormData({ ...formData, clubNameAr: e.target.value })
                  }
                  placeholder="مثال: نادي القاهرة الرياضي"
                  dir="rtl"
                />
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              {language === 'ar' ? 'عن النادي' : 'About Club'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نبذة (إنجليزي)' : 'Bio (English)'}
                </label>
                <Textarea
                  value={formData.about?.bio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about!, bio: e.target.value },
                    })
                  }
                  rows={4}
                  placeholder="Tell us about your club..."
                  className="resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نبذة (عربي)' : 'Bio (Arabic)'}
                </label>
                <Textarea
                  value={formData.about?.bioAr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about!, bioAr: e.target.value },
                    })
                  }
                  rows={4}
                  placeholder="أخبرنا عن ناديك..."
                  className="resize-none"
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar'
                      ? 'الرؤية (إنجليزي)'
                      : 'Vision (English)'}
                  </label>
                  <Textarea
                    value={formData.about?.vision}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about!, vision: e.target.value },
                      })
                    }
                    rows={3}
                    placeholder="Your vision..."
                    className="resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الرؤية (عربي)' : 'Vision (Arabic)'}
                  </label>
                  <Textarea
                    value={formData.about?.visionAr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about!, visionAr: e.target.value },
                      })
                    }
                    rows={3}
                    placeholder="رؤيتك..."
                    className="resize-none"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 text-green-600" />
              {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                </label>
                <Input
                  type="email"
                  value={formData.contactInfo?.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: {
                        ...formData.contactInfo!,
                        email: e.target.value,
                      },
                    })
                  }
                  placeholder="club@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {language === 'ar' ? 'أرقام الهاتف' : 'Phone Numbers'}
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addPhone())
                    }
                    placeholder="+20 123 456 7890"
                  />
                  <Button type="button" onClick={addPhone} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.contactInfo?.phoneNumbers?.map((phone, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {phone}
                      <button
                        type="button"
                        onClick={() => removePhone(phone)}
                        className="hover:bg-green-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                </label>
                <Input
                  type="url"
                  value={formData.contactInfo?.website}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: {
                        ...formData.contactInfo!,
                        website: e.target.value,
                      },
                    })
                  }
                  placeholder="https://yourclub.com"
                />
              </div>
            </div>
          </motion.div>

          {/* Available Sports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              {language === 'ar' ? 'الرياضات المتاحة' : 'Available Sports'}
            </h2>
            <div className="flex gap-2 mb-4">
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
              {formData.availableSports?.map((sport, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {sport}
                  <button
                    type="button"
                    onClick={() => removeSport(sport)}
                    className="hover:bg-yellow-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Facility Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-indigo-600" />
              {language === 'ar' ? 'تفاصيل المنشأة' : 'Facility Details'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المساحة (متر مربع)' : 'Size (sqm)'}
                </label>
                <Input
                  type="number"
                  value={formData.facilityDetails?.facilitySizeSqm || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facilityDetails: {
                        ...formData.facilityDetails!,
                        facilitySizeSqm: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'السعة' : 'Capacity'}
                </label>
                <Input
                  type="number"
                  value={formData.facilityDetails?.capacity || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facilityDetails: {
                        ...formData.facilityDetails!,
                        capacity: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'عدد الملاعب' : 'Number of Fields'}
                </label>
                <Input
                  type="number"
                  value={formData.facilityDetails?.numberOfFields || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facilityDetails: {
                        ...formData.facilityDetails!,
                        numberOfFields: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="3"
                />
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
            <Link href="/dashboard" className="flex-1">
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

export default EditClubProfilePage
