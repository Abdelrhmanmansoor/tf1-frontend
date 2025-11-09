'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import coachService from '@/services/coach'
import type {
  CoachProfile,
  UpdateCoachProfileData,
  Certification,
} from '@/types/coach'
import {
  ArrowLeft,
  Save,
  Loader2,
  XCircle,
  Plus,
  Trash2,
  Upload,
  MapPin,
  Award,
  Globe,
  DollarSign,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  Image as ImageIcon,
  Camera,
  User,
} from 'lucide-react'
import Image from 'next/image'

const CoachProfileEditPage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [profile, setProfile] = useState<CoachProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState<UpdateCoachProfileData>({
    primarySport: '',
    coachingSpecialties: [],
    experienceYears: 0,
    bio: '',
    bioAr: '',
    certifications: [],
    location: undefined,
    languages: [],
    trainingLocations: [],
  })

  // Certification form
  const [newCert, setNewCert] = useState<Partial<Certification>>({
    name: '',
    nameAr: '',
    issuedBy: '',
    issuedDate: '',
    level: 'beginner',
  })

  // Specialty input
  const [specialtyInput, setSpecialtyInput] = useState('')
  const [languageInput, setLanguageInput] = useState('')
  const [trainingLocationInput, setTrainingLocationInput] = useState('')

  // Image upload states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  // Available options
  const sportsOptions = [
    { value: 'football', label: 'كرة القدم', labelEn: 'Football' },
    { value: 'basketball', label: 'كرة السلة', labelEn: 'Basketball' },
    { value: 'tennis', label: 'التنس', labelEn: 'Tennis' },
    { value: 'swimming', label: 'السباحة', labelEn: 'Swimming' },
    { value: 'athletics', label: 'ألعاب القوى', labelEn: 'Athletics' },
    { value: 'volleyball', label: 'الكرة الطائرة', labelEn: 'Volleyball' },
    { value: 'handball', label: 'كرة اليد', labelEn: 'Handball' },
    { value: 'boxing', label: 'الملاكمة', labelEn: 'Boxing' },
    {
      value: 'martial_arts',
      label: 'الفنون القتالية',
      labelEn: 'Martial Arts',
    },
    { value: 'yoga', label: 'اليوغا', labelEn: 'Yoga' },
  ]

  const certificationLevels = [
    { value: 'beginner', label: 'مبتدئ', labelEn: 'Beginner' },
    { value: 'intermediate', label: 'متوسط', labelEn: 'Intermediate' },
    { value: 'advanced', label: 'متقدم', labelEn: 'Advanced' },
    { value: 'expert', label: 'خبير', labelEn: 'Expert' },
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const profileData = await coachService.getMyProfile()
        setProfile(profileData)

        // Set image previews
        setAvatarPreview(profileData.avatar || null)
        setBannerPreview(profileData.bannerImage || null)

        // Populate form data
        setFormData({
          primarySport: profileData.primarySport || '',
          coachingSpecialties: profileData.coachingSpecialties || [],
          experienceYears: profileData.experienceYears || 0,
          bio: profileData.bio || '',
          bioAr: profileData.bioAr || '',
          certifications: profileData.certifications || [],
          location: profileData.location,
          languages: profileData.languages || [],
          trainingLocations: profileData.trainingLocations || [],
        })
      } catch (err: any) {
        console.error('Error fetching profile:', err)
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experienceYears' ? parseInt(value) || 0 : value,
    }))
  }

  const handleLocationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      } as any,
    }))
  }

  const addSpecialty = () => {
    if (
      specialtyInput.trim() &&
      !formData.coachingSpecialties?.includes(specialtyInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        coachingSpecialties: [
          ...(prev.coachingSpecialties || []),
          specialtyInput.trim(),
        ],
      }))
      setSpecialtyInput('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      coachingSpecialties:
        prev.coachingSpecialties?.filter((s) => s !== specialty) || [],
    }))
  }

  const addLanguage = () => {
    if (
      languageInput.trim() &&
      !formData.languages?.includes(languageInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...(prev.languages || []), languageInput.trim()],
      }))
      setLanguageInput('')
    }
  }

  const removeLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages?.filter((l) => l !== lang) || [],
    }))
  }

  const addTrainingLocation = () => {
    if (
      trainingLocationInput.trim() &&
      !formData.trainingLocations?.includes(trainingLocationInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        trainingLocations: [
          ...(prev.trainingLocations || []),
          trainingLocationInput.trim(),
        ],
      }))
      setTrainingLocationInput('')
    }
  }

  const removeTrainingLocation = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      trainingLocations:
        prev.trainingLocations?.filter((l) => l !== location) || [],
    }))
  }

  const addCertification = () => {
    if (newCert.name && newCert.issuedBy && newCert.issuedDate) {
      setFormData((prev) => ({
        ...prev,
        certifications: [
          ...(prev.certifications || []),
          {
            ...newCert,
            _id: Date.now().toString(),
          } as Certification,
        ],
      }))
      setNewCert({
        name: '',
        nameAr: '',
        issuedBy: '',
        issuedDate: '',
        level: 'beginner',
      })
    }
  }

  const removeCertification = (certId: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications:
        prev.certifications?.filter((c) => c._id !== certId) || [],
    }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ]
    if (!validTypes.includes(file.type)) {
      setError(
        language === 'ar'
          ? 'نوع الملف غير صالح. يرجى تحميل صورة (JPEG, PNG, WebP, GIF)'
          : 'Invalid file type. Please upload an image (JPEG, PNG, WebP, GIF)'
      )
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(
        language === 'ar'
          ? 'حجم الملف كبير جداً. الحد الأقصى 5 ميغابايت'
          : 'File size too large. Maximum 5MB'
      )
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
      const avatarData = await coachService.uploadAvatar(file)

      setSuccessMessage(
        language === 'ar'
          ? 'تم رفع الصورة الشخصية بنجاح!'
          : 'Avatar uploaded successfully!'
      )
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar')
      setAvatarPreview(null)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ]
    if (!validTypes.includes(file.type)) {
      setError(
        language === 'ar'
          ? 'نوع الملف غير صالح. يرجى تحميل صورة (JPEG, PNG, WebP, GIF)'
          : 'Invalid file type. Please upload an image (JPEG, PNG, WebP, GIF)'
      )
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(
        language === 'ar'
          ? 'حجم الملف كبير جداً. الحد الأقصى 5 ميغابايت'
          : 'File size too large. Maximum 5MB'
      )
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
      const bannerData = await coachService.uploadBanner(file)

      setSuccessMessage(
        language === 'ar'
          ? 'تم رفع صورة الغلاف بنجاح!'
          : 'Banner uploaded successfully!'
      )
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to upload banner')
      setBannerPreview(null)
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      await coachService.updateProfile(formData)

      setSuccessMessage(
        language === 'ar'
          ? 'تم حفظ التعديلات بنجاح!'
          : 'Profile updated successfully!'
      )

      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/coach/profile')
      }, 2000)
    } catch (err: any) {
      console.error('Error updating profile:', err)
      console.error(
        'Error details:',
        JSON.stringify(
          {
            message: err.message,
            code: err.code,
            status: err.status,
            errors: err.errors,
            details: err.details,
          },
          null,
          2
        )
      )
      console.error('FormData being sent:', JSON.stringify(formData, null, 2))

      // Show validation errors if available
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors
          .map((e: any) => `${e.field || e.path}: ${e.message}`)
          .join(', ')
        setError(`Validation failed: ${errorMessages}`)
      } else {
        setError(err.message || 'Failed to update profile')
      }
    } finally {
      setSaving(false)
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

  if (error && !profile) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard/coach/profile')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
            </h1>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                  </span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حفظ' : 'Save'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-semibold">{successMessage}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-semibold">{error}</p>
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
            <div className="relative h-48 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 opacity-80" />
              )}
              <label className="absolute bottom-4 right-4 cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white transition-all rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
                {uploadingBanner ? (
                  <>
                    <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                    <span className="text-sm font-medium text-purple-600">
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
                  onChange={handleBannerUpload}
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
                <label className="absolute bottom-0 right-0 cursor-pointer bg-purple-600 hover:bg-purple-700 transition-all rounded-full p-2 shadow-lg">
                  {uploadingAvatar ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
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

          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Sport */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الرياضة الرئيسية' : 'Primary Sport'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="primarySport"
                  value={formData.primarySport}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">
                    {language === 'ar' ? 'اختر رياضة' : 'Select a sport'}
                  </option>
                  {sportsOptions.map((sport) => (
                    <option key={sport.value} value={sport.value}>
                      {language === 'ar' ? sport.label : sport.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Coaching Specialties */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar'
                  ? 'التخصصات التدريبية'
                  : 'Coaching Specialties'}
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">
                    {language === 'ar' ? 'اختر تخصص...' : 'Select specialty...'}
                  </option>
                  <option value="technical">
                    {language === 'ar' ? 'تدريب تقني' : 'Technical Training'}
                  </option>
                  <option value="tactical">
                    {language === 'ar' ? 'تحليل تكتيكي' : 'Tactical Analysis'}
                  </option>
                  <option value="fitness">
                    {language === 'ar' ? 'لياقة بدنية' : 'Fitness Training'}
                  </option>
                  <option value="strength">
                    {language === 'ar'
                      ? 'تدريب القوة'
                      : 'Strength & Conditioning'}
                  </option>
                  <option value="speed">
                    {language === 'ar' ? 'تدريب السرعة' : 'Speed & Agility'}
                  </option>
                  <option value="youth">
                    {language === 'ar' ? 'تطوير الشباب' : 'Youth Development'}
                  </option>
                  <option value="goalkeeping">
                    {language === 'ar' ? 'تدريب حراس المرمى' : 'Goalkeeping'}
                  </option>
                  <option value="nutrition">
                    {language === 'ar'
                      ? 'التغذية الرياضية'
                      : 'Sports Nutrition'}
                  </option>
                  <option value="psychology">
                    {language === 'ar'
                      ? 'علم النفس الرياضي'
                      : 'Sports Psychology'}
                  </option>
                  <option value="injury">
                    {language === 'ar'
                      ? 'الوقاية من الإصابات'
                      : 'Injury Prevention'}
                  </option>
                  <option value="rehabilitation">
                    {language === 'ar' ? 'إعادة التأهيل' : 'Rehabilitation'}
                  </option>
                  <option value="junior">
                    {language === 'ar' ? 'تدريب المبتدئين' : 'Junior Coaching'}
                  </option>
                  <option value="elite">
                    {language === 'ar' ? 'تدريب النخبة' : 'Elite Performance'}
                  </option>
                </select>
                <button
                  type="button"
                  onClick={addSpecialty}
                  disabled={!specialtyInput}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.coachingSpecialties?.map((specialty) => (
                  <span
                    key={specialty}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="hover:text-purple-900"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'نبذة عنك (English)' : 'Bio (English)'}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={
                  language === 'ar'
                    ? 'اكتب نبذة عن خبرتك وأسلوبك التدريبي...'
                    : 'Write about your experience and coaching style...'
                }
              />
            </div>

            {/* Bio Arabic */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'نبذة عنك (العربية)' : 'Bio (Arabic)'}
              </label>
              <textarea
                name="bioAr"
                value={formData.bioAr}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={
                  language === 'ar'
                    ? 'اكتب نبذة عن خبرتك وأسلوبك التدريبي...'
                    : 'Write about your experience and coaching style...'
                }
              />
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              {language === 'ar' ? 'الموقع' : 'Location'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المدينة (English)' : 'City (English)'}
                </label>
                <input
                  type="text"
                  value={formData.location?.city || ''}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المدينة (العربية)' : 'City (Arabic)'}
                </label>
                <input
                  type="text"
                  value={formData.location?.cityAr || ''}
                  onChange={(e) =>
                    handleLocationChange('cityAr', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الدولة (English)' : 'Country (English)'}
                </label>
                <input
                  type="text"
                  value={formData.location?.country || ''}
                  onChange={(e) =>
                    handleLocationChange('country', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الدولة (العربية)' : 'Country (Arabic)'}
                </label>
                <input
                  type="text"
                  value={formData.location?.countryAr || ''}
                  onChange={(e) =>
                    handleLocationChange('countryAr', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Training Locations */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'أماكن التدريب' : 'Training Locations'}
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  value={trainingLocationInput}
                  onChange={(e) => setTrainingLocationInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">
                    {language === 'ar'
                      ? 'اختر مكان التدريب...'
                      : 'Select training location...'}
                  </option>
                  <option value="indoor">
                    {language === 'ar' ? 'داخلي' : 'Indoor'}
                  </option>
                  <option value="outdoor">
                    {language === 'ar' ? 'خارجي' : 'Outdoor'}
                  </option>
                  <option value="gym">
                    {language === 'ar' ? 'صالة رياضية' : 'Gym'}
                  </option>
                  <option value="field">
                    {language === 'ar' ? 'ملعب' : 'Field'}
                  </option>
                  <option value="court">
                    {language === 'ar' ? 'ملعب كرة سلة/تنس' : 'Court'}
                  </option>
                  <option value="pool">
                    {language === 'ar' ? 'مسبح' : 'Pool'}
                  </option>
                  <option value="track">
                    {language === 'ar' ? 'مضمار' : 'Track'}
                  </option>
                  <option value="studio">
                    {language === 'ar' ? 'استوديو' : 'Studio'}
                  </option>
                  <option value="home">
                    {language === 'ar' ? 'المنزل' : 'Home'}
                  </option>
                  <option value="online">
                    {language === 'ar' ? 'عبر الإنترنت' : 'Online'}
                  </option>
                </select>
                <button
                  type="button"
                  onClick={addTrainingLocation}
                  disabled={!trainingLocationInput}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.trainingLocations?.map((location) => (
                  <div
                    key={location}
                    className="bg-gray-50 px-4 py-2 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-gray-700">{location}</span>
                    <button
                      type="button"
                      onClick={() => removeTrainingLocation(location)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              {language === 'ar' ? 'اللغات' : 'Languages'}
            </h2>

            <div className="flex gap-2 mb-3">
              <select
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">
                  {language === 'ar' ? 'اختر لغة...' : 'Select language...'}
                </option>
                <option value="arabic">
                  {language === 'ar' ? 'العربية' : 'Arabic'}
                </option>
                <option value="english">
                  {language === 'ar' ? 'الإنجليزية' : 'English'}
                </option>
                <option value="french">
                  {language === 'ar' ? 'الفرنسية' : 'French'}
                </option>
                <option value="spanish">
                  {language === 'ar' ? 'الإسبانية' : 'Spanish'}
                </option>
                <option value="german">
                  {language === 'ar' ? 'الألمانية' : 'German'}
                </option>
                <option value="italian">
                  {language === 'ar' ? 'الإيطالية' : 'Italian'}
                </option>
                <option value="portuguese">
                  {language === 'ar' ? 'البرتغالية' : 'Portuguese'}
                </option>
                <option value="turkish">
                  {language === 'ar' ? 'التركية' : 'Turkish'}
                </option>
              </select>
              <button
                type="button"
                onClick={addLanguage}
                disabled={!languageInput}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages?.map((lang) => (
                <span
                  key={lang}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="hover:text-blue-900"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              {language === 'ar' ? 'الشهادات' : 'Certifications'}
            </h2>

            {/* Add Certification Form */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newCert.name || ''}
                  onChange={(e) =>
                    setNewCert({ ...newCert, name: e.target.value })
                  }
                  placeholder={
                    language === 'ar'
                      ? 'اسم الشهادة (English)'
                      : 'Certification Name (English)'
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newCert.nameAr || ''}
                  onChange={(e) =>
                    setNewCert({ ...newCert, nameAr: e.target.value })
                  }
                  placeholder={
                    language === 'ar'
                      ? 'اسم الشهادة (العربية)'
                      : 'Certification Name (Arabic)'
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newCert.issuedBy || ''}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issuedBy: e.target.value })
                  }
                  placeholder={
                    language === 'ar' ? 'الجهة المصدرة' : 'Issued By'
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={newCert.issuedDate || ''}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issuedDate: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select
                  value={newCert.level || 'beginner'}
                  onChange={(e) =>
                    setNewCert({ ...newCert, level: e.target.value as any })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {certificationLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {language === 'ar' ? level.label : level.labelEn}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addCertification}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {language === 'ar' ? 'إضافة شهادة' : 'Add Certification'}
                </button>
              </div>
            </div>

            {/* Certifications List */}
            <div className="space-y-3">
              {formData.certifications?.map((cert) => (
                <div
                  key={cert._id}
                  className="bg-gray-50 p-4 rounded-xl flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' && cert.nameAr
                        ? cert.nameAr
                        : cert.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {cert.issuedBy}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(cert.issuedDate).toLocaleDateString(
                          language === 'ar' ? 'ar-SA' : 'en-US',
                          { year: 'numeric', month: 'long' }
                        )}
                      </span>
                      {cert.level && (
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full capitalize">
                          {cert.level}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertification(cert._id || '')}
                    className="text-red-600 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-4"
          >
            <button
              type="button"
              onClick={() => router.push('/dashboard/coach/profile')}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>
                    {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                  </span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>
                    {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                  </span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}

export default CoachProfileEditPage
