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
    { value: 'martial_arts', label: 'الفنون القتالية', labelEn: 'Martial Arts' },
    { value: 'yoga', label: 'اليوغا', labelEn: 'Yoga' },
    { value: 'fitness', label: 'اللياقة البدنية', labelEn: 'Fitness' },
    { value: 'karate', label: 'الكاراتيه', labelEn: 'Karate' },
    { value: 'taekwondo', label: 'التايكوندو', labelEn: 'Taekwondo' },
    { value: 'judo', label: 'الجودو', labelEn: 'Judo' },
    { value: 'gymnastics', label: 'الجمباز', labelEn: 'Gymnastics' },
  ]

  const certificationLevels = [
    { value: 'beginner', label: 'مبتدئ', labelEn: 'Beginner' },
    { value: 'intermediate', label: 'متوسط', labelEn: 'Intermediate' },
    { value: 'advanced', label: 'متقدم', labelEn: 'Advanced' },
    { value: 'expert', label: 'خبير', labelEn: 'Expert' },
  ]

  const languageOptions = [
    { value: 'Arabic', label: 'العربية', labelEn: 'Arabic' },
    { value: 'English', label: 'الإنجليزية', labelEn: 'English' },
    { value: 'French', label: 'الفرنسية', labelEn: 'French' },
    { value: 'Spanish', label: 'الإسبانية', labelEn: 'Spanish' },
    { value: 'German', label: 'الألمانية', labelEn: 'German' },
    { value: 'Italian', label: 'الإيطالية', labelEn: 'Italian' },
    { value: 'Portuguese', label: 'البرتغالية', labelEn: 'Portuguese' },
    { value: 'Turkish', label: 'التركية', labelEn: 'Turkish' },
    { value: 'Urdu', label: 'الأردو', labelEn: 'Urdu' },
    { value: 'Hindi', label: 'الهندية', labelEn: 'Hindi' },
  ]

  const specialtyOptions = [
    { value: 'youth_development', label: 'تطوير الناشئين', labelEn: 'Youth Development' },
    { value: 'strength_conditioning', label: 'القوة واللياقة', labelEn: 'Strength & Conditioning' },
    { value: 'tactical_training', label: 'التدريب التكتيكي', labelEn: 'Tactical Training' },
    { value: 'goalkeeper_training', label: 'تدريب حراس المرمى', labelEn: 'Goalkeeper Training' },
    { value: 'speed_agility', label: 'السرعة والرشاقة', labelEn: 'Speed & Agility' },
    { value: 'rehabilitation', label: 'إعادة التأهيل', labelEn: 'Rehabilitation' },
    { value: 'mental_coaching', label: 'التدريب الذهني', labelEn: 'Mental Coaching' },
    { value: 'nutrition', label: 'التغذية الرياضية', labelEn: 'Sports Nutrition' },
    { value: 'performance_analysis', label: 'تحليل الأداء', labelEn: 'Performance Analysis' },
    { value: 'team_management', label: 'إدارة الفريق', labelEn: 'Team Management' },
    { value: 'individual_training', label: 'التدريب الفردي', labelEn: 'Individual Training' },
    { value: 'group_training', label: 'التدريب الجماعي', labelEn: 'Group Training' },
  ]

  const countryOptions = [
    { value: 'Saudi Arabia', valueAr: 'المملكة العربية السعودية', label: 'المملكة العربية السعودية', labelEn: 'Saudi Arabia' },
    { value: 'Egypt', valueAr: 'مصر', label: 'مصر', labelEn: 'Egypt' },
    { value: 'UAE', valueAr: 'الإمارات', label: 'الإمارات', labelEn: 'UAE' },
    { value: 'Qatar', valueAr: 'قطر', label: 'قطر', labelEn: 'Qatar' },
    { value: 'Kuwait', valueAr: 'الكويت', label: 'الكويت', labelEn: 'Kuwait' },
    { value: 'Bahrain', valueAr: 'البحرين', label: 'البحرين', labelEn: 'Bahrain' },
    { value: 'Oman', valueAr: 'عمان', label: 'عمان', labelEn: 'Oman' },
    { value: 'Jordan', valueAr: 'الأردن', label: 'الأردن', labelEn: 'Jordan' },
    { value: 'Lebanon', valueAr: 'لبنان', label: 'لبنان', labelEn: 'Lebanon' },
    { value: 'Morocco', valueAr: 'المغرب', label: 'المغرب', labelEn: 'Morocco' },
    { value: 'Tunisia', valueAr: 'تونس', label: 'تونس', labelEn: 'Tunisia' },
    { value: 'Algeria', valueAr: 'الجزائر', label: 'الجزائر', labelEn: 'Algeria' },
    { value: 'Iraq', valueAr: 'العراق', label: 'العراق', labelEn: 'Iraq' },
    { value: 'Sudan', valueAr: 'السودان', label: 'السودان', labelEn: 'Sudan' },
    { value: 'Libya', valueAr: 'ليبيا', label: 'ليبيا', labelEn: 'Libya' },
  ]

  const cityOptions: Record<string, Array<{ value: string; valueAr: string; label: string; labelEn: string }>> = {
    'Saudi Arabia': [
      { value: 'Riyadh', valueAr: 'الرياض', label: 'الرياض', labelEn: 'Riyadh' },
      { value: 'Jeddah', valueAr: 'جدة', label: 'جدة', labelEn: 'Jeddah' },
      { value: 'Mecca', valueAr: 'مكة المكرمة', label: 'مكة المكرمة', labelEn: 'Mecca' },
      { value: 'Medina', valueAr: 'المدينة المنورة', label: 'المدينة المنورة', labelEn: 'Medina' },
      { value: 'Dammam', valueAr: 'الدمام', label: 'الدمام', labelEn: 'Dammam' },
      { value: 'Khobar', valueAr: 'الخبر', label: 'الخبر', labelEn: 'Khobar' },
      { value: 'Tabuk', valueAr: 'تبوك', label: 'تبوك', labelEn: 'Tabuk' },
      { value: 'Abha', valueAr: 'أبها', label: 'أبها', labelEn: 'Abha' },
    ],
    'Egypt': [
      { value: 'Cairo', valueAr: 'القاهرة', label: 'القاهرة', labelEn: 'Cairo' },
      { value: 'Alexandria', valueAr: 'الإسكندرية', label: 'الإسكندرية', labelEn: 'Alexandria' },
      { value: 'Giza', valueAr: 'الجيزة', label: 'الجيزة', labelEn: 'Giza' },
      { value: 'Sharm El Sheikh', valueAr: 'شرم الشيخ', label: 'شرم الشيخ', labelEn: 'Sharm El Sheikh' },
      { value: 'Hurghada', valueAr: 'الغردقة', label: 'الغردقة', labelEn: 'Hurghada' },
      { value: 'Mansoura', valueAr: 'المنصورة', label: 'المنصورة', labelEn: 'Mansoura' },
      { value: 'Tanta', valueAr: 'طنطا', label: 'طنطا', labelEn: 'Tanta' },
    ],
    'UAE': [
      { value: 'Dubai', valueAr: 'دبي', label: 'دبي', labelEn: 'Dubai' },
      { value: 'Abu Dhabi', valueAr: 'أبو ظبي', label: 'أبو ظبي', labelEn: 'Abu Dhabi' },
      { value: 'Sharjah', valueAr: 'الشارقة', label: 'الشارقة', labelEn: 'Sharjah' },
      { value: 'Ajman', valueAr: 'عجمان', label: 'عجمان', labelEn: 'Ajman' },
      { value: 'Ras Al Khaimah', valueAr: 'رأس الخيمة', label: 'رأس الخيمة', labelEn: 'Ras Al Khaimah' },
    ],
    'Qatar': [
      { value: 'Doha', valueAr: 'الدوحة', label: 'الدوحة', labelEn: 'Doha' },
      { value: 'Al Wakrah', valueAr: 'الوكرة', label: 'الوكرة', labelEn: 'Al Wakrah' },
      { value: 'Al Khor', valueAr: 'الخور', label: 'الخور', labelEn: 'Al Khor' },
    ],
    'Kuwait': [
      { value: 'Kuwait City', valueAr: 'مدينة الكويت', label: 'مدينة الكويت', labelEn: 'Kuwait City' },
      { value: 'Hawalli', valueAr: 'حولي', label: 'حولي', labelEn: 'Hawalli' },
      { value: 'Salmiya', valueAr: 'السالمية', label: 'السالمية', labelEn: 'Salmiya' },
    ],
    'Bahrain': [
      { value: 'Manama', valueAr: 'المنامة', label: 'المنامة', labelEn: 'Manama' },
      { value: 'Riffa', valueAr: 'الرفاع', label: 'الرفاع', labelEn: 'Riffa' },
      { value: 'Muharraq', valueAr: 'المحرق', label: 'المحرق', labelEn: 'Muharraq' },
    ],
    'Oman': [
      { value: 'Muscat', valueAr: 'مسقط', label: 'مسقط', labelEn: 'Muscat' },
      { value: 'Salalah', valueAr: 'صلالة', label: 'صلالة', labelEn: 'Salalah' },
      { value: 'Sohar', valueAr: 'صحار', label: 'صحار', labelEn: 'Sohar' },
    ],
    'Jordan': [
      { value: 'Amman', valueAr: 'عمان', label: 'عمان', labelEn: 'Amman' },
      { value: 'Aqaba', valueAr: 'العقبة', label: 'العقبة', labelEn: 'Aqaba' },
      { value: 'Zarqa', valueAr: 'الزرقاء', label: 'الزرقاء', labelEn: 'Zarqa' },
      { value: 'Irbid', valueAr: 'إربد', label: 'إربد', labelEn: 'Irbid' },
    ],
    'Lebanon': [
      { value: 'Beirut', valueAr: 'بيروت', label: 'بيروت', labelEn: 'Beirut' },
      { value: 'Tripoli', valueAr: 'طرابلس', label: 'طرابلس', labelEn: 'Tripoli' },
      { value: 'Sidon', valueAr: 'صيدا', label: 'صيدا', labelEn: 'Sidon' },
    ],
    'Morocco': [
      { value: 'Casablanca', valueAr: 'الدار البيضاء', label: 'الدار البيضاء', labelEn: 'Casablanca' },
      { value: 'Rabat', valueAr: 'الرباط', label: 'الرباط', labelEn: 'Rabat' },
      { value: 'Marrakech', valueAr: 'مراكش', label: 'مراكش', labelEn: 'Marrakech' },
      { value: 'Fes', valueAr: 'فاس', label: 'فاس', labelEn: 'Fes' },
      { value: 'Tangier', valueAr: 'طنجة', label: 'طنجة', labelEn: 'Tangier' },
    ],
    'Tunisia': [
      { value: 'Tunis', valueAr: 'تونس', label: 'تونس', labelEn: 'Tunis' },
      { value: 'Sfax', valueAr: 'صفاقس', label: 'صفاقس', labelEn: 'Sfax' },
      { value: 'Sousse', valueAr: 'سوسة', label: 'سوسة', labelEn: 'Sousse' },
    ],
    'Algeria': [
      { value: 'Algiers', valueAr: 'الجزائر', label: 'الجزائر', labelEn: 'Algiers' },
      { value: 'Oran', valueAr: 'وهران', label: 'وهران', labelEn: 'Oran' },
      { value: 'Constantine', valueAr: 'قسنطينة', label: 'قسنطينة', labelEn: 'Constantine' },
    ],
    'Iraq': [
      { value: 'Baghdad', valueAr: 'بغداد', label: 'بغداد', labelEn: 'Baghdad' },
      { value: 'Basra', valueAr: 'البصرة', label: 'البصرة', labelEn: 'Basra' },
      { value: 'Erbil', valueAr: 'أربيل', label: 'أربيل', labelEn: 'Erbil' },
    ],
    'Sudan': [
      { value: 'Khartoum', valueAr: 'الخرطوم', label: 'الخرطوم', labelEn: 'Khartoum' },
      { value: 'Omdurman', valueAr: 'أم درمان', label: 'أم درمان', labelEn: 'Omdurman' },
    ],
    'Libya': [
      { value: 'Tripoli', valueAr: 'طرابلس', label: 'طرابلس', labelEn: 'Tripoli' },
      { value: 'Benghazi', valueAr: 'بنغازي', label: 'بنغازي', labelEn: 'Benghazi' },
    ],
  }

  const experienceOptions = [
    { value: 1, label: '1 سنة', labelEn: '1 year' },
    { value: 2, label: '2 سنة', labelEn: '2 years' },
    { value: 3, label: '3 سنوات', labelEn: '3 years' },
    { value: 5, label: '5 سنوات', labelEn: '5 years' },
    { value: 7, label: '7 سنوات', labelEn: '7 years' },
    { value: 10, label: '10 سنوات', labelEn: '10 years' },
    { value: 15, label: '15 سنة', labelEn: '15 years' },
    { value: 20, label: '20+ سنة', labelEn: '20+ years' },
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
                    <select
                      name="experienceYears"
                      value={formData.experienceYears || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">
                        {language === 'ar' ? 'اختر سنوات الخبرة' : 'Select experience'}
                      </option>
                      {experienceOptions.map((exp) => (
                        <option key={exp.value} value={exp.value}>
                          {language === 'ar' ? exp.label : exp.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'التخصصات التدريبية'
                        : 'Coaching Specialties'}
                    </label>
                    <div className="flex gap-2 mb-3">
                      <select
                        value={specialtyInput}
                        onChange={(e) => setSpecialtyInput(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">
                          {language === 'ar' ? 'اختر تخصص...' : 'Select specialty...'}
                        </option>
                        {specialtyOptions
                          .filter((s) => !formData.coachingSpecialties.includes(s.value))
                          .map((specialty) => (
                            <option key={specialty.value} value={specialty.value}>
                              {language === 'ar' ? specialty.label : specialty.labelEn}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={addSpecialty}
                        disabled={!specialtyInput}
                        className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.coachingSpecialties.map((specialty) => {
                        const spec = specialtyOptions.find((s) => s.value === specialty)
                        return (
                          <span
                            key={specialty}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {spec ? (language === 'ar' ? spec.label : spec.labelEn) : specialty}
                            <button
                              type="button"
                              onClick={() => removeSpecialty(specialty)}
                              className="hover:text-purple-900"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </span>
                        )
                      })}
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
                        {language === 'ar' ? 'الدولة' : 'Country'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.location?.country || ''}
                        onChange={(e) => {
                          const selectedCountry = countryOptions.find(c => c.value === e.target.value)
                          handleLocationChange('country', e.target.value)
                          handleLocationChange('countryAr', selectedCountry?.valueAr || '')
                          handleLocationChange('city', '')
                          handleLocationChange('cityAr', '')
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">
                          {language === 'ar' ? 'اختر الدولة' : 'Select country'}
                        </option>
                        {countryOptions.map((country) => (
                          <option key={country.value} value={country.value}>
                            {language === 'ar' ? country.label : country.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المدينة' : 'City'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.location?.city || ''}
                        onChange={(e) => {
                          const cities = cityOptions[formData.location?.country || ''] || []
                          const selectedCity = cities.find(c => c.value === e.target.value)
                          handleLocationChange('city', e.target.value)
                          handleLocationChange('cityAr', selectedCity?.valueAr || '')
                        }}
                        disabled={!formData.location?.country}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {language === 'ar' ? 'اختر المدينة' : 'Select city'}
                        </option>
                        {(cityOptions[formData.location?.country || ''] || []).map((city) => (
                          <option key={city.value} value={city.value}>
                            {language === 'ar' ? city.label : city.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اللغات التي تتحدثها' : 'Languages you speak'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-3">
                      <select
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">
                          {language === 'ar' ? 'اختر لغة...' : 'Select language...'}
                        </option>
                        {languageOptions
                          .filter((l) => !(formData.languages || []).includes(l.value))
                          .map((lang) => (
                            <option key={lang.value} value={lang.value}>
                              {language === 'ar' ? lang.label : lang.labelEn}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={addLanguage}
                        disabled={!languageInput}
                        className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.languages || []).map((lang) => {
                        const langOption = languageOptions.find((l) => l.value === lang)
                        return (
                          <span
                            key={lang}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {langOption ? (language === 'ar' ? langOption.label : langOption.labelEn) : lang}
                            <button
                              type="button"
                              onClick={() => removeLanguage(lang)}
                              className="hover:text-blue-900"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </span>
                        )
                      })}
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
