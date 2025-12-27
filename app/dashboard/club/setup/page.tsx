'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import clubService from '@/services/club'
import authService from '@/services/auth'
import type { CreateClubProfileData } from '@/types/club'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Phone,
  Globe,
  FileText,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
} from 'lucide-react'

const ClubSetupWizard = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState<CreateClubProfileData>({
    organizationType: 'sports_club',
    clubName: '',
    clubNameAr: '',
    logo: '',
    establishedDate: '',
    businessRegistrationNumber: '',
    sportsLicenseNumber: '',
    legalStatus: 'licensed',
    location: {
      address: '',
      addressAr: '',
      city: '',
      cityAr: '',
      area: '',
      areaAr: '',
      country: '',
      countryAr: '',
      postalCode: '',
    },
    contactInfo: {
      phoneNumbers: [],
      email: '',
      website: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
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
      mission: '',
    },
  })

  // Temporary inputs
  const [phoneInput, setPhoneInput] = useState('')
  const [sportInput, setSportInput] = useState('')
  const [facilityTypeInput, setFacilityTypeInput] = useState('')
  const [amenityInput, setAmenityInput] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [uploadingLogo, setUploadingLogo] = useState(false)

  // Check if profile already exists and pre-fill data
  useEffect(() => {
    const checkProfile = async () => {
      try {
        // Try to get the profile
        const profile = await clubService.getMyProfile()
        if (profile) {
          // Profile exists, redirect to dashboard
          console.log('Profile already exists, redirecting to dashboard')
          router.push('/dashboard')
          return
        }
      } catch (err: any) {
        // Profile doesn't exist (404), continue with setup
        console.log('No profile found, showing setup wizard')
      }

      // Pre-fill from user data
      const user = authService.getCurrentUser()
      console.log('[Setup Wizard] Current user:', user)
      if (user) {
        // Backend doesn't return email in user object, only id, role, fullName, phone, isVerified
        // We need to get email from somewhere else or make contactInfo.email optional
        const userEmail = (user as any).email || ''
        const userPhone = (user as any).phone || ''
        const clubName = (user as any).fullName || (user as any).firstName || ''

        setFormData((prev) => ({
          ...prev,
          clubName: clubName,
          organizationType: 'sports_club',
          establishedDate: new Date().toISOString().split('T')[0], // Default to today
          businessRegistrationNumber: 'N/A', // Default value since backend already has it
          contactInfo: {
            ...prev.contactInfo,
            email: userEmail,
            phoneNumbers: userPhone ? [userPhone] : [],
          },
        }))
        console.log(
          '[Setup Wizard] Pre-filled form data with email:',
          userEmail,
          'phone:',
          userPhone
        )
      }
    }

    checkProfile()
  }, [router])

  const organizationTypes = [
    { value: 'sports_club', label: 'نادي رياضي', labelEn: 'Sports Club' },
    { value: 'academy', label: 'أكاديمية', labelEn: 'Academy' },
    {
      value: 'training_center',
      label: 'مركز تدريب',
      labelEn: 'Training Center',
    },
    { value: 'federation', label: 'اتحاد', labelEn: 'Federation' },
    { value: 'other', label: 'أخرى', labelEn: 'Other' },
  ]

  const legalStatusOptions = [
    { value: 'licensed', label: 'مرخص', labelEn: 'Licensed' },
    { value: 'registered', label: 'مسجل', labelEn: 'Registered' },
    { value: 'pending', label: 'قيد المراجعة', labelEn: 'Pending' },
    { value: 'unlicensed', label: 'غير مرخص', labelEn: 'Unlicensed' },
  ]

  const facilityTypesOptions = [
    { value: 'outdoor_field', label: 'ملعب خارجي', labelEn: 'Outdoor Field' },
    { value: 'indoor_court', label: 'ملعب داخلي', labelEn: 'Indoor Court' },
    { value: 'gym', label: 'صالة رياضية', labelEn: 'Gym' },
    { value: 'pool', label: 'مسبح', labelEn: 'Swimming Pool' },
    { value: 'track', label: 'مضمار', labelEn: 'Track' },
  ]

  const amenitiesOptions = [
    {
      value: 'locker_rooms',
      label: 'غرف تبديل ملابس',
      labelEn: 'Locker Rooms',
    },
    { value: 'cafeteria', label: 'كافتيريا', labelEn: 'Cafeteria' },
    { value: 'parking', label: 'موقف سيارات', labelEn: 'Parking' },
    { value: 'medical_room', label: 'غرفة طبية', labelEn: 'Medical Room' },
    { value: 'pro_shop', label: 'متجر', labelEn: 'Pro Shop' },
  ]

  const sportsOptions = [
    { value: 'Football', label: 'كرة القدم', labelEn: 'Football' },
    { value: 'Basketball', label: 'كرة السلة', labelEn: 'Basketball' },
    { value: 'Tennis', label: 'التنس', labelEn: 'Tennis' },
    { value: 'Swimming', label: 'السباحة', labelEn: 'Swimming' },
    { value: 'Volleyball', label: 'الكرة الطائرة', labelEn: 'Volleyball' },
    { value: 'Handball', label: 'كرة اليد', labelEn: 'Handball' },
  ]

  const steps = [
    {
      id: 0,
      title: language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information',
      icon: Building2,
    },
    {
      id: 1,
      title: language === 'ar' ? 'الموقع والعنوان' : 'Location & Address',
      icon: MapPin,
    },
    {
      id: 2,
      title: language === 'ar' ? 'معلومات الاتصال' : 'Contact Information',
      icon: Phone,
    },
    {
      id: 3,
      title: language === 'ar' ? 'المنشآت والرياضات' : 'Facilities & Sports',
      icon: Globe,
    },
    {
      id: 4,
      title: language === 'ar' ? 'نبذة عن النادي' : 'About Club',
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
      [name]: value,
    }))
  }

  const handleLocationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }))
  }

  const handleContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }))
  }

  const handleSocialMediaChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        socialMedia: {
          ...prev.contactInfo.socialMedia,
          [field]: value,
        },
      },
    }))
  }

  const handleFacilityChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      facilityDetails: {
        ...prev.facilityDetails!,
        [field]: value,
      },
    }))
  }

  const handleAboutChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value,
      },
    }))
  }

  const addPhone = () => {
    if (
      phoneInput.trim() &&
      !formData.contactInfo.phoneNumbers.includes(phoneInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          phoneNumbers: [...prev.contactInfo.phoneNumbers, phoneInput.trim()],
        },
      }))
      setPhoneInput('')
    }
  }

  const removePhone = (phone: string) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        phoneNumbers: prev.contactInfo.phoneNumbers.filter((p) => p !== phone),
      },
    }))
  }

  const addSport = () => {
    if (
      sportInput.trim() &&
      !formData.availableSports.includes(sportInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        availableSports: [...prev.availableSports, sportInput.trim()],
      }))
      setSportInput('')
    }
  }

  const removeSport = (sport: string) => {
    setFormData((prev) => ({
      ...prev,
      availableSports: prev.availableSports.filter((s) => s !== sport),
    }))
  }

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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

    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const addFacilityType = () => {
    if (
      facilityTypeInput &&
      !formData.facilityDetails?.facilityTypes?.includes(facilityTypeInput)
    ) {
      setFormData((prev) => ({
        ...prev,
        facilityDetails: {
          ...prev.facilityDetails!,
          facilityTypes: [
            ...(prev.facilityDetails?.facilityTypes || []),
            facilityTypeInput,
          ],
        },
      }))
      setFacilityTypeInput('')
    }
  }

  const removeFacilityType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      facilityDetails: {
        ...prev.facilityDetails!,
        facilityTypes:
          prev.facilityDetails?.facilityTypes?.filter((t) => t !== type) || [],
      },
    }))
  }

  const addAmenity = () => {
    if (
      amenityInput &&
      !formData.facilityDetails?.additionalAmenities?.includes(amenityInput)
    ) {
      setFormData((prev) => ({
        ...prev,
        facilityDetails: {
          ...prev.facilityDetails!,
          additionalAmenities: [
            ...(prev.facilityDetails?.additionalAmenities || []),
            amenityInput,
          ],
        },
      }))
      setAmenityInput('')
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      facilityDetails: {
        ...prev.facilityDetails!,
        additionalAmenities:
          prev.facilityDetails?.additionalAmenities?.filter(
            (a) => a !== amenity
          ) || [],
      },
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.clubName && formData.legalStatus
      case 1:
        return (
          formData.location.city &&
          formData.location.country &&
          formData.location.address
        )
      case 2:
        return true // Email and phone already provided during registration, just optional social media here
      case 3:
        return formData.availableSports.length > 0
      case 4:
        return formData.about.bio
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

      console.log(
        'Submitting club profile data:',
        JSON.stringify(formData, null, 2)
      )

      await clubService.createProfile(formData)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Error creating profile:', err)
      console.error('Error details:', JSON.stringify(err, null, 2))

      // If error is 500, the profile might have been created anyway (backend bug)
      // Check if profile exists now
      if (err.status === 500) {
        console.log(
          '[Setup Wizard] Got 500 error, checking if profile was created...'
        )
        try {
          const profile = await clubService.getMyProfile()
          if (profile) {
            console.log(
              '[Setup Wizard] Profile exists despite 500 error, redirecting...'
            )
            router.push('/dashboard')
            return
          }
        } catch (checkErr) {
          console.log('[Setup Wizard] Profile check failed, showing error')
        }
      }

      setError(err.message || 'Failed to create club profile')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? 'إعداد ملف النادي' : 'Club Profile Setup'}
            </h1>
          </div>
          <p className="text-blue-100">
            {language === 'ar'
              ? 'أكمل هذه الخطوات لإنشاء ملف النادي'
              : 'Complete these steps to create your club profile'}
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
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
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
                        ? 'text-blue-600 font-semibold'
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
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
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
              className="min-h-[450px]"
            >
              {/* Step 0: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'اسم النادي (English)'
                          : 'Club Name (English)'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="clubName"
                        value={formData.clubName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={
                          language === 'ar'
                            ? 'مثال: Elite Sports Academy'
                            : 'e.g., Elite Sports Academy'
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'اسم النادي (العربية)'
                          : 'Club Name (Arabic)'}
                      </label>
                      <input
                        type="text"
                        name="clubNameAr"
                        value={formData.clubNameAr}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={
                          language === 'ar'
                            ? 'مثال: أكاديمية النخبة الرياضية'
                            : 'e.g., أكاديمية النخبة الرياضية'
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'رقم الترخيص الرياضي'
                          : 'Sports License Number'}
                      </label>
                      <input
                        type="text"
                        name="sportsLicenseNumber"
                        value={formData.sportsLicenseNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'ar' ? 'اختياري' : 'Optional'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'الحالة القانونية'
                          : 'Legal Status'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="legalStatus"
                        value={formData.legalStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {legalStatusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {language === 'ar' ? status.label : status.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Location & Address */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'الدولة (English)'
                          : 'Country (English)'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location.country}
                        onChange={(e) =>
                          handleLocationChange('country', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        value={formData.location.countryAr}
                        onChange={(e) =>
                          handleLocationChange('countryAr', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

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
                        value={formData.location.city}
                        onChange={(e) =>
                          handleLocationChange('city', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        value={formData.location.cityAr}
                        onChange={(e) =>
                          handleLocationChange('cityAr', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'المنطقة (English)'
                          : 'Area (English)'}
                      </label>
                      <input
                        type="text"
                        value={formData.location.area}
                        onChange={(e) =>
                          handleLocationChange('area', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        value={formData.location.areaAr}
                        onChange={(e) =>
                          handleLocationChange('areaAr', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'العنوان (English)'
                        : 'Address (English)'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location.address}
                      onChange={(e) =>
                        handleLocationChange('address', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        language === 'ar'
                          ? 'مثال: 123 Stadium Street'
                          : 'e.g., 123 Stadium Street'
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'العنوان (العربية)'
                        : 'Address (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={formData.location.addressAr}
                      onChange={(e) =>
                        handleLocationChange('addressAr', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        language === 'ar'
                          ? 'مثال: 123 شارع الاستاد'
                          : 'e.g., 123 شارع الاستاد'
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الرمز البريدي' : 'Postal Code'}
                    </label>
                    <input
                      type="text"
                      value={formData.location.postalCode}
                      onChange={(e) =>
                        handleLocationChange('postalCode', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                    </label>
                    <input
                      type="url"
                      value={formData.contactInfo.website}
                      onChange={(e) =>
                        handleContactChange('website', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'ar' ? 'اختياري' : 'Optional'}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={formData.contactInfo.socialMedia?.facebook}
                        onChange={(e) =>
                          handleSocialMediaChange('facebook', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={formData.contactInfo.socialMedia?.instagram}
                        onChange={(e) =>
                          handleSocialMediaChange('instagram', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={formData.contactInfo.socialMedia?.twitter}
                        onChange={(e) =>
                          handleSocialMediaChange('twitter', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Facilities & Sports */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'الرياضات المتاحة'
                        : 'Available Sports'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-3">
                      <select
                        value={sportInput}
                        onChange={(e) => setSportInput(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">
                          {language === 'ar'
                            ? 'اختر رياضة...'
                            : 'Select sport...'}
                        </option>
                        {sportsOptions.map((sport) => (
                          <option key={sport.value} value={sport.value}>
                            {language === 'ar' ? sport.label : sport.labelEn}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addSport}
                        disabled={!sportInput}
                        className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.availableSports.map((sport) => (
                        <span
                          key={sport}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {sport}
                          <button
                            type="button"
                            onClick={() => removeSport(sport)}
                            className="hover:text-green-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'مساحة المنشأة (متر مربع)'
                          : 'Facility Size (sqm)'}
                      </label>
                      <input
                        type="number"
                        value={formData.facilityDetails?.facilitySizeSqm || ''}
                        onChange={(e) =>
                          handleFacilityChange(
                            'facilitySizeSqm',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'السعة' : 'Capacity'}
                      </label>
                      <input
                        type="number"
                        value={formData.facilityDetails?.capacity || ''}
                        onChange={(e) =>
                          handleFacilityChange(
                            'capacity',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'عدد الملاعب' : 'Number of Fields'}
                      </label>
                      <input
                        type="number"
                        value={formData.facilityDetails?.numberOfFields || ''}
                        onChange={(e) =>
                          handleFacilityChange(
                            'numberOfFields',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'أنواع المنشآت' : 'Facility Types'}
                    </label>
                    <div className="flex gap-2 mb-3">
                      <select
                        value={facilityTypeInput}
                        onChange={(e) => setFacilityTypeInput(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">
                          {language === 'ar'
                            ? 'اختر نوع المنشأة...'
                            : 'Select facility type...'}
                        </option>
                        {facilityTypesOptions.map((type) => (
                          <option key={type.value} value={type.value}>
                            {language === 'ar' ? type.label : type.labelEn}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addFacilityType}
                        disabled={!facilityTypeInput}
                        className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.facilityDetails?.facilityTypes?.map((type) => (
                        <span
                          key={type}
                          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {
                            facilityTypesOptions.find(
                              (t) => t.value === type
                            )?.[language === 'ar' ? 'label' : 'labelEn']
                          }
                          <button
                            type="button"
                            onClick={() => removeFacilityType(type)}
                            className="hover:text-purple-900"
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
                        ? 'المرافق الإضافية'
                        : 'Additional Amenities'}
                    </label>
                    <div className="flex gap-2 mb-3">
                      <select
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">
                          {language === 'ar'
                            ? 'اختر المرفق...'
                            : 'Select amenity...'}
                        </option>
                        {amenitiesOptions.map((amenity) => (
                          <option key={amenity.value} value={amenity.value}>
                            {language === 'ar'
                              ? amenity.label
                              : amenity.labelEn}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addAmenity}
                        disabled={!amenityInput}
                        className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.facilityDetails?.additionalAmenities?.map(
                        (amenity) => (
                          <span
                            key={amenity}
                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {
                              amenitiesOptions.find(
                                (a) => a.value === amenity
                              )?.[language === 'ar' ? 'label' : 'labelEn']
                            }
                            <button
                              type="button"
                              onClick={() => removeAmenity(amenity)}
                              className="hover:text-orange-900"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: About Club */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'نبذة عن النادي (English)'
                        : 'About Club (English)'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.about.bio}
                      onChange={(e) => handleAboutChange('bio', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        language === 'ar'
                          ? 'اكتب نبذة عن النادي...'
                          : 'Write about the club...'
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'نبذة عن النادي (العربية)'
                        : 'About Club (Arabic)'}
                    </label>
                    <textarea
                      value={formData.about.bioAr}
                      onChange={(e) =>
                        handleAboutChange('bioAr', e.target.value)
                      }
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        language === 'ar'
                          ? 'اكتب نبذة عن النادي...'
                          : 'Write about the club...'
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الرؤية' : 'Vision'}
                    </label>
                    <textarea
                      value={formData.about.vision}
                      onChange={(e) =>
                        handleAboutChange('vision', e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الرسالة' : 'Mission'}
                    </label>
                    <textarea
                      value={formData.about.mission}
                      onChange={(e) =>
                        handleAboutChange('mission', e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

export default ClubSetupWizard
