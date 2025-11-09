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
  Stethoscope,
  MapPin,
  GraduationCap,
  Award,
  FileText,
  Plus,
  Trash2,
  Building,
  Globe,
  X,
} from 'lucide-react'
import Link from 'next/link'
import {
  getMyProfile,
  updateProfile,
  type SpecialistProfile,
} from '@/services/specialist'
import { useRouter } from 'next/navigation'

const EditSpecialistProfilePage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    primarySpecialization: '',
    additionalSpecializations: [] as string[],
    yearsOfExperience: 0,
    bio: '',
    languages: [] as string[],
    education: [] as Array<{
      degree: string
      institution: string
      graduationYear: number
      fieldOfStudy: string
    }>,
    certifications: [] as Array<{
      name: string
      issuingOrganization: string
      issueDate: string
      expiryDate: string
      credentialId: string
    }>,
    licenses: [] as Array<{
      licenseNumber: string
      issuingAuthority: string
      issueDate: string
      expiryDate: string
      status: string
    }>,
    serviceLocations: [] as Array<{
      type: string
      name: string
      street: string
      city: string
      country: string
      isPrimary: boolean
    }>,
    consultationTypes: [] as string[],
    onlineAvailable: false,
    onlinePlatforms: [] as string[],
  })

  const [newSpecialization, setNewSpecialization] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getMyProfile()
      const profile = response.profile

      console.log('📥 Loaded profile:', profile)
      console.log(
        '📚 previousExperience from backend:',
        profile.previousExperience
      )
      console.log('📜 Certifications from backend:', profile.certifications)
      console.log(
        '🏛️ professionalAssociations from backend:',
        profile.professionalAssociations
      )

      // Populate form with existing data
      // Handle bio - can be string or BilingualText object
      let bioValue = ''
      if (typeof profile.bio === 'string') {
        bioValue = profile.bio
      } else if (profile.bio && typeof profile.bio === 'object') {
        bioValue =
          language === 'ar' ? profile.bio.ar || profile.bio.en : profile.bio.en
      }

      // Backend uses previousExperience for education
      const mappedEducation = (profile.previousExperience || []).map(
        (edu: any) => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          graduationYear:
            Number(edu.graduationYear) || new Date().getFullYear(),
          fieldOfStudy: edu.fieldOfStudy || '',
        })
      )

      const mappedCertifications = (profile.certifications || []).map(
        (cert: any) => ({
          name: cert.name || '',
          issuingOrganization: cert.issuingOrganization || '',
          issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
          expiryDate: cert.expiryDate ? cert.expiryDate.split('T')[0] : '',
          credentialId: cert.credentialId || '',
        })
      )

      // Backend uses professionalAssociations for licenses
      const mappedLicenses = (profile.professionalAssociations || []).map(
        (lic: any) => ({
          licenseNumber: lic.licenseNumber || '',
          issuingAuthority: lic.issuingAuthority || '',
          issueDate: lic.issueDate ? lic.issueDate.split('T')[0] : '',
          expiryDate: lic.expiryDate ? lic.expiryDate.split('T')[0] : '',
          status: lic.status || 'active',
        })
      )

      console.log('✅ Mapped education:', mappedEducation)
      console.log('✅ Mapped certifications:', mappedCertifications)
      console.log('✅ Mapped licenses:', mappedLicenses)

      setFormData({
        primarySpecialization: profile.primarySpecialization || '',
        additionalSpecializations: profile.additionalSpecializations || [],
        yearsOfExperience: Number(profile.experienceYears) || 0, // Backend uses experienceYears
        bio: bioValue,
        languages: profile.languages || [],
        education: mappedEducation,
        certifications: mappedCertifications,
        licenses: mappedLicenses,
        serviceLocations:
          profile.serviceLocations?.map((loc: any) => ({
            type: loc.type,
            name: loc.name,
            street: loc.address?.street || '',
            city: loc.address?.city || '',
            country: loc.address?.country || '',
            isPrimary: loc.isPrimary || false,
          })) || [],
        consultationTypes: profile.consultationTypes || [],
        onlineAvailable: profile.onlineConsultation?.available || false,
        onlinePlatforms: profile.onlineConsultation?.platforms || [],
      })
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError(err.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)

      const updateData: any = {
        primarySpecialization: formData.primarySpecialization,
        additionalSpecializations: formData.additionalSpecializations,
        experienceYears: Number(formData.yearsOfExperience), // Backend uses experienceYears, not yearsOfExperience
        bio: formData.bio,
        languages: formData.languages,
        previousExperience: formData.education // Backend uses previousExperience for education
          .filter((edu) => edu.degree && edu.institution && edu.graduationYear)
          .map((edu) => ({
            degree: edu.degree,
            institution: edu.institution,
            graduationYear: Number(edu.graduationYear),
            fieldOfStudy: edu.fieldOfStudy || undefined,
          })),
        certifications: formData.certifications
          .filter(
            (cert) => cert.name && cert.issuingOrganization && cert.issueDate
          )
          .map((cert) => ({
            name: cert.name,
            issuingOrganization: cert.issuingOrganization,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate || undefined,
            credentialId: cert.credentialId || undefined,
          })),
        professionalAssociations: formData.licenses // Backend uses professionalAssociations for licenses
          .filter(
            (lic) => lic.licenseNumber && lic.issuingAuthority && lic.issueDate
          )
          .map((lic) => ({
            licenseNumber: lic.licenseNumber,
            issuingAuthority: lic.issuingAuthority,
            issueDate: lic.issueDate,
            expiryDate: lic.expiryDate || undefined,
            status: lic.status,
          })),
        serviceLocations: formData.serviceLocations
          .filter((loc) => loc.name && loc.city && loc.country)
          .map((loc) => ({
            type: loc.type,
            name: loc.name,
            address: {
              street: loc.street || undefined,
              city: loc.city,
              country: loc.country,
            },
            isPrimary: loc.isPrimary,
          })),
        consultationTypes: formData.consultationTypes,
        onlineConsultation: {
          available: formData.onlineAvailable,
          platforms: formData.onlinePlatforms,
        },
      }

      console.log('📤 Sending update data:', updateData)
      const response = await updateProfile(updateData)
      console.log('✅ Update response:', response)

      setSuccess(true)

      // Wait a bit for backend to finish processing, then redirect
      setTimeout(() => {
        router.push('/dashboard/specialist/profile')
      }, 1000)
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  // Helper functions for managing arrays
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: '',
          institution: '',
          graduationYear: new Date().getFullYear(),
          fieldOfStudy: '',
        },
      ],
    })
  }

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    })
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...formData.education]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, education: updated })
  }

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        {
          name: '',
          issuingOrganization: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
        },
      ],
    })
  }

  const removeCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    })
  }

  const updateCertification = (index: number, field: string, value: any) => {
    const updated = [...formData.certifications]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, certifications: updated })
  }

  const addLicense = () => {
    setFormData({
      ...formData,
      licenses: [
        ...formData.licenses,
        {
          licenseNumber: '',
          issuingAuthority: '',
          issueDate: '',
          expiryDate: '',
          status: 'active',
        },
      ],
    })
  }

  const removeLicense = (index: number) => {
    setFormData({
      ...formData,
      licenses: formData.licenses.filter((_, i) => i !== index),
    })
  }

  const updateLicense = (index: number, field: string, value: any) => {
    const updated = [...formData.licenses]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, licenses: updated })
  }

  const addServiceLocation = () => {
    setFormData({
      ...formData,
      serviceLocations: [
        ...formData.serviceLocations,
        {
          type: 'clinic',
          name: '',
          street: '',
          city: '',
          country: '',
          isPrimary: false,
        },
      ],
    })
  }

  const removeServiceLocation = (index: number) => {
    setFormData({
      ...formData,
      serviceLocations: formData.serviceLocations.filter((_, i) => i !== index),
    })
  }

  const updateServiceLocation = (index: number, field: string, value: any) => {
    const updated = [...formData.serviceLocations]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, serviceLocations: updated })
  }

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData({
        ...formData,
        additionalSpecializations: [
          ...formData.additionalSpecializations,
          newSpecialization.trim(),
        ],
      })
      setNewSpecialization('')
    }
  }

  const removeSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      additionalSpecializations: formData.additionalSpecializations.filter(
        (s) => s !== spec
      ),
    })
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

  if (error && !formData.primarySpecialization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/dashboard')}>
            {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard/specialist/profile">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {language === 'ar' ? 'العودة' : 'Back'}
            </Button>
          </Link>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
          </h1>
          <p className="text-gray-600 mb-8">
            {language === 'ar'
              ? 'قم بتحديث معلوماتك الشخصية والمهنية'
              : 'Update your professional information'}
          </p>

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
                ? '✓ تم تحديث الملف الشخصي بنجاح!'
                : '✓ Profile updated successfully!'}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Specialization Section */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                {language === 'ar'
                  ? 'التخصص والخبرة'
                  : 'Specialization & Experience'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar'
                      ? 'التخصص الأساسي'
                      : 'Primary Specialization'}{' '}
                    *
                  </label>
                  <select
                    value={formData.primarySpecialization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primarySpecialization: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">
                      {language === 'ar'
                        ? 'اختر التخصص'
                        : 'Select Specialization'}
                    </option>
                    <option value="sports_physiotherapy">
                      {language === 'ar'
                        ? 'علاج طبيعي رياضي'
                        : 'Sports Physiotherapy'}
                    </option>
                    <option value="sports_nutrition">
                      {language === 'ar' ? 'تغذية رياضية' : 'Sports Nutrition'}
                    </option>
                    <option value="fitness_training">
                      {language === 'ar' ? 'لياقة بدنية' : 'Fitness Training'}
                    </option>
                    <option value="sports_psychology">
                      {language === 'ar'
                        ? 'علم نفس رياضي'
                        : 'Sports Psychology'}
                    </option>
                    <option value="injury_rehabilitation">
                      {language === 'ar'
                        ? 'إعادة تأهيل الإصابات'
                        : 'Injury Rehabilitation'}
                    </option>
                    <option value="sports_massage">
                      {language === 'ar' ? 'تدليك رياضي' : 'Sports Massage'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar'
                      ? 'التخصصات الإضافية'
                      : 'Additional Specializations'}
                  </label>
                  <div className="flex gap-2 mb-2">
                    <select
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">
                        {language === 'ar'
                          ? 'اختر تخصص إضافي'
                          : 'Select additional specialization'}
                      </option>
                      <option value="sports_physiotherapy">
                        {language === 'ar'
                          ? 'علاج طبيعي رياضي'
                          : 'Sports Physiotherapy'}
                      </option>
                      <option value="sports_nutrition">
                        {language === 'ar'
                          ? 'تغذية رياضية'
                          : 'Sports Nutrition'}
                      </option>
                      <option value="fitness_training">
                        {language === 'ar' ? 'لياقة بدنية' : 'Fitness Training'}
                      </option>
                      <option value="sports_psychology">
                        {language === 'ar'
                          ? 'علم نفس رياضي'
                          : 'Sports Psychology'}
                      </option>
                      <option value="injury_rehabilitation">
                        {language === 'ar'
                          ? 'إعادة تأهيل الإصابات'
                          : 'Injury Rehabilitation'}
                      </option>
                      <option value="sports_massage">
                        {language === 'ar' ? 'تدليك رياضي' : 'Sports Massage'}
                      </option>
                    </select>
                    <Button
                      type="button"
                      onClick={addSpecialization}
                      size="sm"
                      disabled={
                        !newSpecialization ||
                        formData.additionalSpecializations.includes(
                          newSpecialization
                        ) ||
                        formData.primarySpecialization === newSpecialization
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.additionalSpecializations.map((spec, index) => {
                      const specializationNames: Record<
                        string,
                        { en: string; ar: string }
                      > = {
                        sports_physiotherapy: {
                          en: 'Sports Physiotherapy',
                          ar: 'علاج طبيعي رياضي',
                        },
                        sports_nutrition: {
                          en: 'Sports Nutrition',
                          ar: 'تغذية رياضية',
                        },
                        fitness_training: {
                          en: 'Fitness Training',
                          ar: 'لياقة بدنية',
                        },
                        sports_psychology: {
                          en: 'Sports Psychology',
                          ar: 'علم نفس رياضي',
                        },
                        injury_rehabilitation: {
                          en: 'Injury Rehabilitation',
                          ar: 'إعادة تأهيل الإصابات',
                        },
                        sports_massage: {
                          en: 'Sports Massage',
                          ar: 'تدليك رياضي',
                        },
                      }
                      const displayName = specializationNames[spec]
                        ? language === 'ar'
                          ? specializationNames[spec].ar
                          : specializationNames[spec].en
                        : spec
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {displayName}
                          <button
                            type="button"
                            onClick={() => removeSpecialization(spec)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}{' '}
                    *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearsOfExperience: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اللغات' : 'Languages'} *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes('english')}
                        onChange={(e) => {
                          const langs = e.target.checked
                            ? [...formData.languages, 'english']
                            : formData.languages.filter((l) => l !== 'english')
                          setFormData({ ...formData, languages: langs })
                        }}
                        className="w-4 h-4"
                      />
                      <span>
                        {language === 'ar' ? 'الإنجليزية' : 'English'}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.languages.includes('arabic')}
                        onChange={(e) => {
                          const langs = e.target.checked
                            ? [...formData.languages, 'arabic']
                            : formData.languages.filter((l) => l !== 'arabic')
                          setFormData({ ...formData, languages: langs })
                        }}
                        className="w-4 h-4"
                      />
                      <span>{language === 'ar' ? 'العربية' : 'Arabic'}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Bio Section */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {language === 'ar' ? 'نبذة عنك' : 'About You'}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'النبذة' : 'Bio'} *
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={5}
                  placeholder={
                    language === 'ar'
                      ? 'أخبرنا عن خبرتك وتخصصك...'
                      : 'Tell us about your experience and expertise...'
                  }
                  className="resize-none"
                  required
                />
              </div>
            </div>

            {/* 3. Education Section */}
            <div className="border-b pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'التعليم' : 'Education'}
                </h2>
                <Button
                  type="button"
                  onClick={addEducation}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </Button>
              </div>

              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {language === 'ar'
                          ? `التعليم ${index + 1}`
                          : `Education ${index + 1}`}
                      </h3>
                      <Button
                        type="button"
                        onClick={() => removeEducation(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'الدرجة' : 'Degree'} *
                        </label>
                        <select
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(index, 'degree', e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">
                            {language === 'ar'
                              ? 'اختر الدرجة'
                              : 'Select Degree'}
                          </option>
                          <option value="high_school">
                            {language === 'ar'
                              ? 'الثانوية العامة'
                              : 'High School'}
                          </option>
                          <option value="diploma">
                            {language === 'ar' ? 'دبلوم' : 'Diploma'}
                          </option>
                          <option value="associate">
                            {language === 'ar'
                              ? 'درجة مشارك'
                              : 'Associate Degree'}
                          </option>
                          <option value="bachelor">
                            {language === 'ar' ? 'بكالوريوس' : 'Bachelor'}
                          </option>
                          <option value="master">
                            {language === 'ar' ? 'ماجستير' : 'Master'}
                          </option>
                          <option value="doctorate">
                            {language === 'ar' ? 'دكتوراه' : 'Doctorate'}
                          </option>
                          <option value="postdoctorate">
                            {language === 'ar'
                              ? 'ما بعد الدكتوراه'
                              : 'Post-Doctorate'}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'المؤسسة' : 'Institution'} *
                        </label>
                        <Input
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              'institution',
                              e.target.value
                            )
                          }
                          placeholder={
                            language === 'ar'
                              ? 'مثال: جامعة القاهرة'
                              : 'e.g., Cairo University'
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'سنة التخرج' : 'Graduation Year'}{' '}
                          *
                        </label>
                        <Input
                          type="number"
                          min="1950"
                          max={new Date().getFullYear()}
                          value={edu.graduationYear}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              'graduationYear',
                              parseInt(e.target.value)
                            )
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar'
                            ? 'مجال الدراسة'
                            : 'Field of Study'}
                        </label>
                        <Input
                          value={edu.fieldOfStudy}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              'fieldOfStudy',
                              e.target.value
                            )
                          }
                          placeholder={
                            language === 'ar'
                              ? 'مثال: العلاج الطبيعي'
                              : 'e.g., Physical Therapy'
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {formData.education.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    {language === 'ar'
                      ? 'لم تتم إضافة أي تعليم بعد'
                      : 'No education added yet'}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Certifications Section */}
            <div className="border-b pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'الشهادات' : 'Certifications'}
                </h2>
                <Button
                  type="button"
                  onClick={addCertification}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </Button>
              </div>

              <div className="space-y-4">
                {formData.certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {language === 'ar'
                          ? `الشهادة ${index + 1}`
                          : `Certification ${index + 1}`}
                      </h3>
                      <Button
                        type="button"
                        onClick={() => removeCertification(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar'
                            ? 'اسم الشهادة'
                            : 'Certificate Name'}{' '}
                          *
                        </label>
                        <Input
                          value={cert.name}
                          onChange={(e) =>
                            updateCertification(index, 'name', e.target.value)
                          }
                          placeholder={
                            language === 'ar'
                              ? 'مثال: شهادة مدرب معتمد'
                              : 'e.g., Certified Trainer'
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar'
                            ? 'الجهة المانحة'
                            : 'Issuing Organization'}{' '}
                          *
                        </label>
                        <Input
                          value={cert.issuingOrganization}
                          onChange={(e) =>
                            updateCertification(
                              index,
                              'issuingOrganization',
                              e.target.value
                            )
                          }
                          placeholder={
                            language === 'ar' ? 'مثال: NASM' : 'e.g., NASM'
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'} *
                        </label>
                        <Input
                          type="date"
                          value={cert.issueDate}
                          onChange={(e) =>
                            updateCertification(
                              index,
                              'issueDate',
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                        </label>
                        <Input
                          type="date"
                          value={cert.expiryDate}
                          onChange={(e) =>
                            updateCertification(
                              index,
                              'expiryDate',
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'رقم الشهادة' : 'Credential ID'}
                        </label>
                        <Input
                          value={cert.credentialId}
                          onChange={(e) =>
                            updateCertification(
                              index,
                              'credentialId',
                              e.target.value
                            )
                          }
                          placeholder={
                            language === 'ar' ? 'رقم الشهادة' : 'Certificate ID'
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {formData.certifications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    {language === 'ar'
                      ? 'لم تتم إضافة أي شهادات بعد'
                      : 'No certifications added yet'}
                  </p>
                )}
              </div>
            </div>

            {/* 5. Licenses Section */}
            <div className="border-b pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'التراخيص' : 'Licenses'}
                </h2>
                <Button
                  type="button"
                  onClick={addLicense}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </Button>
              </div>

              <div className="space-y-4">
                {formData.licenses.map((lic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {language === 'ar'
                          ? `الترخيص ${index + 1}`
                          : `License ${index + 1}`}
                      </h3>
                      <Button
                        type="button"
                        onClick={() => removeLicense(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'رقم الترخيص' : 'License Number'}{' '}
                          *
                        </label>
                        <Input
                          value={lic.licenseNumber}
                          onChange={(e) =>
                            updateLicense(
                              index,
                              'licenseNumber',
                              e.target.value
                            )
                          }
                          placeholder={
                            language === 'ar' ? 'رقم الترخيص' : 'License #'
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar'
                            ? 'الجهة المانحة'
                            : 'Issuing Authority'}{' '}
                          *
                        </label>
                        <Input
                          value={lic.issuingAuthority}
                          onChange={(e) =>
                            updateLicense(
                              index,
                              'issuingAuthority',
                              e.target.value
                            )
                          }
                          placeholder={
                            language === 'ar'
                              ? 'مثال: وزارة الصحة'
                              : 'e.g., Health Ministry'
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'} *
                        </label>
                        <Input
                          type="date"
                          value={lic.issueDate}
                          onChange={(e) =>
                            updateLicense(index, 'issueDate', e.target.value)
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                        </label>
                        <Input
                          type="date"
                          value={lic.expiryDate}
                          onChange={(e) =>
                            updateLicense(index, 'expiryDate', e.target.value)
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'الحالة' : 'Status'} *
                        </label>
                        <select
                          value={lic.status}
                          onChange={(e) =>
                            updateLicense(index, 'status', e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="active">
                            {language === 'ar' ? 'نشط' : 'Active'}
                          </option>
                          <option value="expired">
                            {language === 'ar' ? 'منتهي' : 'Expired'}
                          </option>
                          <option value="suspended">
                            {language === 'ar' ? 'معلق' : 'Suspended'}
                          </option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {formData.licenses.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    {language === 'ar'
                      ? 'لم تتم إضافة أي تراخيص بعد'
                      : 'No licenses added yet'}
                  </p>
                )}
              </div>
            </div>

            {/* 6. Service Locations Section */}
            <div className="border-b pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {language === 'ar'
                    ? 'أماكن تقديم الخدمة'
                    : 'Service Locations'}
                </h2>
                <Button
                  type="button"
                  onClick={addServiceLocation}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </Button>
              </div>

              <div className="space-y-4">
                {formData.serviceLocations.map((loc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {language === 'ar'
                          ? `الموقع ${index + 1}`
                          : `Location ${index + 1}`}
                      </h3>
                      <Button
                        type="button"
                        onClick={() => removeServiceLocation(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'النوع' : 'Type'} *
                          </label>
                          <select
                            value={loc.type}
                            onChange={(e) =>
                              updateServiceLocation(
                                index,
                                'type',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="clinic">
                              {language === 'ar' ? 'عيادة' : 'Clinic'}
                            </option>
                            <option value="gym">
                              {language === 'ar' ? 'صالة رياضية' : 'Gym'}
                            </option>
                            <option value="hospital">
                              {language === 'ar' ? 'مستشفى' : 'Hospital'}
                            </option>
                            <option value="home_visit">
                              {language === 'ar'
                                ? 'زيارة منزلية'
                                : 'Home Visit'}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الاسم' : 'Name'} *
                          </label>
                          <Input
                            value={loc.name}
                            onChange={(e) =>
                              updateServiceLocation(
                                index,
                                'name',
                                e.target.value
                              )
                            }
                            placeholder={
                              language === 'ar'
                                ? 'اسم العيادة/المركز'
                                : 'Clinic/Center Name'
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'ar' ? 'الشارع' : 'Street'}
                        </label>
                        <Input
                          value={loc.street}
                          onChange={(e) =>
                            updateServiceLocation(
                              index,
                              'street',
                              e.target.value
                            )
                          }
                          placeholder={
                            language === 'ar' ? 'العنوان' : 'Street Address'
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'المدينة' : 'City'} *
                          </label>
                          <Input
                            value={loc.city}
                            onChange={(e) =>
                              updateServiceLocation(
                                index,
                                'city',
                                e.target.value
                              )
                            }
                            placeholder={language === 'ar' ? 'المدينة' : 'City'}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الدولة' : 'Country'} *
                          </label>
                          <Input
                            value={loc.country}
                            onChange={(e) =>
                              updateServiceLocation(
                                index,
                                'country',
                                e.target.value
                              )
                            }
                            placeholder={
                              language === 'ar' ? 'الدولة' : 'Country'
                            }
                            required
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={loc.isPrimary}
                          onChange={(e) =>
                            updateServiceLocation(
                              index,
                              'isPrimary',
                              e.target.checked
                            )
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">
                          {language === 'ar'
                            ? 'الموقع الأساسي'
                            : 'Primary Location'}
                        </span>
                      </label>
                    </div>
                  </motion.div>
                ))}

                {formData.serviceLocations.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    {language === 'ar'
                      ? 'لم تتم إضافة أي مواقع بعد'
                      : 'No locations added yet'}
                  </p>
                )}
              </div>
            </div>

            {/* 7. Consultation Settings */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                {language === 'ar'
                  ? 'إعدادات الاستشارة'
                  : 'Consultation Settings'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar'
                      ? 'أنواع الاستشارة'
                      : 'Consultation Types'}
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        value: 'individual',
                        label: { en: 'Individual', ar: 'فردي' },
                      },
                      { value: 'group', label: { en: 'Group', ar: 'مجموعة' } },
                      { value: 'team', label: { en: 'Team', ar: 'فريق' } },
                      {
                        value: 'workshop',
                        label: { en: 'Workshop', ar: 'ورشة عمل' },
                      },
                    ].map((type) => (
                      <label
                        key={type.value}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.consultationTypes.includes(
                            type.value
                          )}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...formData.consultationTypes, type.value]
                              : formData.consultationTypes.filter(
                                  (t) => t !== type.value
                                )
                            setFormData({
                              ...formData,
                              consultationTypes: types,
                            })
                          }}
                          className="w-4 h-4"
                        />
                        <span>
                          {language === 'ar' ? type.label.ar : type.label.en}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.onlineAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          onlineAvailable: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'ar'
                        ? 'أقدم استشارات أونلاين'
                        : 'I offer online consultations'}
                    </span>
                  </label>

                  {formData.onlineAvailable && (
                    <div className="ml-6 space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المنصات' : 'Platforms'}
                      </label>
                      {[
                        { value: 'zoom', label: { en: 'Zoom', ar: 'زووم' } },
                        {
                          value: 'google-meet',
                          label: { en: 'Google Meet', ar: 'جوجل ميت' },
                        },
                        {
                          value: 'microsoft-teams',
                          label: {
                            en: 'Microsoft Teams',
                            ar: 'مايكروسوفت تيمز',
                          },
                        },
                        { value: 'skype', label: { en: 'Skype', ar: 'سكايب' } },
                      ].map((platform) => (
                        <label
                          key={platform.value}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.onlinePlatforms.includes(
                              platform.value
                            )}
                            onChange={(e) => {
                              const platforms = e.target.checked
                                ? [...formData.onlinePlatforms, platform.value]
                                : formData.onlinePlatforms.filter(
                                    (p) => p !== platform.value
                                  )
                              setFormData({
                                ...formData,
                                onlinePlatforms: platforms,
                              })
                            }}
                            className="w-4 h-4"
                          />
                          <span>
                            {language === 'ar'
                              ? platform.label.ar
                              : platform.label.en}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Link href="/dashboard/specialist/profile" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6 text-lg"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default EditSpecialistProfilePage
