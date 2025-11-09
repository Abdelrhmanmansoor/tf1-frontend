'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import coachService from '@/services/coach'
import type { CreateCoachProfileData, Certification } from '@/types/coach'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Award,
  MapPin,
  Globe,
  DollarSign,
  FileText,
  Sparkles,
  Loader2,
  XCircle,
  Plus,
  Trash2,
} from 'lucide-react'

const CoachSetupWizard = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState<CreateCoachProfileData>({
    primarySport: '',
    coachingSpecialties: [],
    experienceYears: 0,
    bio: '',
    bioAr: '',
    certifications: [],
    location: {
      city: '',
      cityAr: '',
      area: '',
      areaAr: '',
      country: '',
      countryAr: '',
    },
    languages: [],
    trainingLocations: [],
  })

  // Temporary inputs
  const [specialtyInput, setSpecialtyInput] = useState('')
  const [languageInput, setLanguageInput] = useState('')
  const [trainingLocationInput, setTrainingLocationInput] = useState('')
  const [newCert, setNewCert] = useState<Partial<Certification>>({
    name: '',
    nameAr: '',
    issuedBy: '',
    issuedDate: '',
    level: 'beginner',
  })

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

  const steps = [
    {
      id: 0,
      title: language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information',
      icon: Award,
    },
    {
      id: 1,
      title: language === 'ar' ? 'الموقع واللغات' : 'Location & Languages',
      icon: Globe,
    },
    {
      id: 2,
      title: language === 'ar' ? 'الشهادات' : 'Certifications',
      icon: Award,
    },
    {
      id: 3,
      title: language === 'ar' ? 'نبذة عنك' : 'About You',
      icon: FileText,
    },
  ]

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
        city: prev.location?.city || '',
        country: prev.location?.country || '',
        ...prev.location,
        [field]: value,
      },
    }))
  }

  const addSpecialty = () => {
    if (
      specialtyInput.trim() &&
      !formData.coachingSpecialties.includes(specialtyInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        coachingSpecialties: [
          ...prev.coachingSpecialties,
          specialtyInput.trim(),
        ],
      }))
      setSpecialtyInput('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      coachingSpecialties: prev.coachingSpecialties.filter(
        (s) => s !== specialty
      ),
    }))
  }

  const addLanguage = () => {
    if (
      languageInput.trim() &&
      !(formData.languages || []).includes(languageInput.trim())
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
      languages: (prev.languages || []).filter((l) => l !== lang),
    }))
  }

  const addTrainingLocation = () => {
    if (
      trainingLocationInput.trim() &&
      !(formData.trainingLocations || []).includes(trainingLocationInput.trim())
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
      trainingLocations: (prev.trainingLocations || []).filter(
        (l) => l !== location
      ),
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
      certifications: (prev.certifications || []).filter(
        (c) => c._id !== certId
      ),
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.primarySport && formData.experienceYears > 0
      case 1:
        return (
          formData.location?.city &&
          formData.location?.country &&
          (formData.languages || []).length > 0
        )
      case 2:
        return true // Certifications are optional
      case 3:
        return formData.bio || formData.bioAr
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setCreating(true)
      setError(null)

      // Clean up the data before submission
      const cleanedData = {
        ...formData,
        // Remove _id from certifications (it's auto-generated by backend)
        certifications:
          formData.certifications?.map(({ _id, ...cert }) => cert) || [],
      }

      // Log the data being sent for debugging
      console.log(
        'Submitting coach profile data:',
        JSON.stringify(cleanedData, null, 2)
      )

      await coachService.createProfile(cleanedData)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Error creating profile:', err)
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        status: err.status,
        errors: err.errors,
        details: err.details,
        data: formData,
      })

      // Show detailed validation errors if available
      let errorMessage = err.message || 'Failed to create profile'
      if (err.errors && Array.isArray(err.errors)) {
        errorMessage +=
          ':\n' +
          err.errors.map((e: any) => `- ${e.field}: ${e.message}`).join('\n')
      } else if (err.errors && typeof err.errors === 'object') {
        errorMessage +=
          ':\n' +
          Object.entries(err.errors)
            .map(([field, msg]) => `- ${field}: ${msg}`)
            .join('\n')
      }

      setError(errorMessage)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? 'إعداد ملف المدرب' : 'Coach Profile Setup'}
            </h1>
          </div>
          <p className="text-purple-100">
            {language === 'ar'
              ? 'أكمل هذه الخطوات لإنشاء ملفك الشخصي كمدرب'
              : 'Complete these steps to create your coaching profile'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-8 pt-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      index <= currentStep
                        ? 'text-purple-600 font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      index < currentStep
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="px-8 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {/* Step 0: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الرياضة الرئيسية' : 'Primary Sport'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="primarySport"
                      value={formData.primarySport}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'سنوات الخبرة'
                        : 'Years of Experience'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears || ''}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'التخصصات التدريبية'
                        : 'Coaching Specialties'}
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={specialtyInput}
                        onChange={(e) => setSpecialtyInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(), addSpecialty())
                        }
                        placeholder={
                          language === 'ar' ? 'أضف تخصص...' : 'Add specialty...'
                        }
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addSpecialty}
                        className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.coachingSpecialties.map((specialty) => (
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
                </div>
              )}

              {/* Step 1: Location & Languages */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'المدينة (English)'
                          : 'City (English)'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location?.city || ''}
                        onChange={(e) =>
                          handleLocationChange('city', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'المدينة (العربية)'
                          : 'City (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={formData.location?.cityAr || ''}
                        onChange={(e) =>
                          handleLocationChange('cityAr', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'المنطقة (English)'
                          : 'Area (English)'}
                      </label>
                      <input
                        type="text"
                        value={formData.location?.area || ''}
                        onChange={(e) =>
                          handleLocationChange('area', e.target.value)
                        }
                        placeholder={
                          language === 'ar'
                            ? 'مثال: مدينة نصر'
                            : 'e.g., Nasr City'
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'المنطقة (العربية)'
                          : 'Area (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={formData.location?.areaAr || ''}
                        onChange={(e) =>
                          handleLocationChange('areaAr', e.target.value)
                        }
                        placeholder={
                          language === 'ar'
                            ? 'مثال: مدينة نصر'
                            : 'e.g., مدينة نصر'
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'الدولة (English)'
                          : 'Country (English)'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location?.country || ''}
                        onChange={(e) =>
                          handleLocationChange('country', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'الدولة (العربية)'
                          : 'Country (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={formData.location?.countryAr || ''}
                        onChange={(e) =>
                          handleLocationChange('countryAr', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اللغات' : 'Languages'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(), addLanguage())
                        }
                        placeholder={
                          language === 'ar' ? 'أضف لغة...' : 'Add language...'
                        }
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addLanguage}
                        className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.languages || []).map((lang) => (
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'أماكن التدريب'
                        : 'Training Locations'}
                    </label>
                    <div className="flex gap-2 mb-3">
                      <select
                        value={trainingLocationInput}
                        onChange={(e) =>
                          setTrainingLocationInput(e.target.value)
                        }
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(formData.trainingLocations || []).map((location) => {
                        const locationLabels: Record<
                          string,
                          { en: string; ar: string }
                        > = {
                          indoor: { en: 'Indoor', ar: 'داخلي' },
                          outdoor: { en: 'Outdoor', ar: 'خارجي' },
                          gym: { en: 'Gym', ar: 'صالة رياضية' },
                          field: { en: 'Field', ar: 'ملعب' },
                          court: { en: 'Court', ar: 'ملعب كرة سلة/تنس' },
                          pool: { en: 'Pool', ar: 'مسبح' },
                          track: { en: 'Track', ar: 'مضمار' },
                          studio: { en: 'Studio', ar: 'استوديو' },
                          home: { en: 'Home', ar: 'المنزل' },
                          online: { en: 'Online', ar: 'عبر الإنترنت' },
                        }
                        const label = locationLabels[location]
                          ? language === 'ar'
                            ? locationLabels[location].ar
                            : locationLabels[location].en
                          : location
                        return (
                          <div
                            key={location}
                            className="bg-gray-50 px-4 py-2 rounded-lg flex items-center justify-between"
                          >
                            <span className="text-gray-700">{label}</span>
                            <button
                              type="button"
                              onClick={() => removeTrainingLocation(location)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Certifications */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    {language === 'ar'
                      ? 'أضف شهاداتك التدريبية (اختياري)'
                      : 'Add your coaching certifications (optional)'}
                  </p>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
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
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        value={newCert.issuedDate || ''}
                        onChange={(e) =>
                          setNewCert({ ...newCert, issuedDate: e.target.value })
                        }
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <select
                        value={newCert.level || 'beginner'}
                        onChange={(e) =>
                          setNewCert({
                            ...newCert,
                            level: e.target.value as any,
                          })
                        }
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        {language === 'ar' ? 'إضافة' : 'Add'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(formData.certifications || []).map((cert) => (
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
                </div>
              )}

              {/* Step 3: Bio */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'نبذة عنك (English)'
                        : 'Bio (English)'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={
                        language === 'ar'
                          ? 'اكتب نبذة عن خبرتك وأسلوبك التدريبي...'
                          : 'Write about your experience and coaching style...'
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'نبذة عنك (العربية)'
                        : 'Bio (Arabic)'}
                    </label>
                    <textarea
                      name="bioAr"
                      value={formData.bioAr}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={
                        language === 'ar'
                          ? 'اكتب نبذة عن خبرتك وأسلوبك التدريبي...'
                          : 'Write about your experience and coaching style...'
                      }
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === 'ar' ? 'السابق' : 'Back'}
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {language === 'ar' ? 'التالي' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed() || creating}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>
                      {language === 'ar' ? 'جاري الإنشاء...' : 'Creating...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>
                      {language === 'ar' ? 'إنشاء الملف' : 'Create Profile'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CoachSetupWizard
