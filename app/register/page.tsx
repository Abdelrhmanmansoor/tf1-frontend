'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSelector } from '@/components/language-selector'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { Mail, Lock, Phone, Eye, EyeOff, AlertCircle, CheckCircle, Loader2, ChevronDown, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const { language } = useLanguage()
  const { register } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1) // Step 1: Role, Step 2: Basic Info, Step 3: Role-specific
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Basic Form Data
  const [basicData, setBasicData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'player' as any,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Role-specific data - MINIMAL fields only
  const [roleData, setRoleData] = useState<any>({
    // Player fields
    city: '',
    age: '',
    position: '',
    level: '',
    
    // Coach fields
    experience: '',
    trainingType: '',
    certificates: [] as string[],
    
    // Club fields
    organizationName: '',
    organizationType: 'club',
    
    // Specialist fields
    specialization: '',
    
    // Admin fields
    department: '',
    adminPosition: '',
  })

  // Select options
  const playerPositions = language === 'ar' ? 
    ['حارس مرمى', 'مدافع', 'لاعب وسط', 'مهاجم'] :
    ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

  const playerLevels = language === 'ar' ?
    ['مبتدئ', 'متوسط', 'متقدم', 'احترافي'] :
    ['Beginner', 'Intermediate', 'Advanced', 'Professional']

  const trainingTypes = language === 'ar' ?
    ['كرة قدم', 'سلة', 'طائرة', 'تنس', 'سباحة', 'لياقة بدنية'] :
    ['Football', 'Basketball', 'Volleyball', 'Tennis', 'Swimming', 'Fitness']

  const certificateOptions = language === 'ar' ?
    ['C', 'B', 'A', 'BRO', 'أخرى'] :
    ['C', 'B', 'A', 'BRO', 'Other']

  const organizationTypes = language === 'ar' ?
    [{ value: 'club', label: 'نادي' }, { value: 'academy', label: 'أكاديمية' }, { value: 'federation', label: 'اتحاد' }] :
    [{ value: 'club', label: 'Club' }, { value: 'academy', label: 'Academy' }, { value: 'federation', label: 'Federation' }]

  const saudiCities = language === 'ar' ?
    ['الرياض', 'جدة', 'الدمام', 'الخبر', 'الظهران', 'الأحساء', 'أبها', 'الباحة', 'عسير', 'نجران', 'جيزان', 'تبوك', 'حائل', 'القصيم', 'الجوف', 'المدينة المنورة', 'مكة المكرمة', 'الطائف', 'ينبع', 'رابغ', 'الجبيل', 'الزلفي', 'شرورة', 'خميس مشيط', 'المجمعة', 'الشمالية', 'الحدود الشمالية', 'صفوى', 'حفر الباطن', 'بيشة', 'سكاكا'] :
    ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Dhahran', 'Al-Ahsa', 'Abha', 'Al-Baha', 'Asir', 'Najran', 'Jazan', 'Tabuk', 'Hail', 'Qassim', 'Al-Jouf', 'Madinah', 'Makkah', 'Taif', 'Yanbu', 'Rabigh', 'Jubail', 'Al-Zulfi', 'Sharurah', 'Khamis Mushait', 'Al-Majmaah', 'Northern Region', 'Northern Borders', 'Safwa', 'Hafar Al-Batin', 'Bisha', 'Sakaka']

  const handleStep1Continue = () => {
    if (!basicData.role) {
      setError(language === 'ar' ? 'اختر دوراً' : 'Please select a role')
      return
    }
    setError(null)
    setStep(2)
  }

  const handleStep2Continue = () => {
    if (!basicData.email || !basicData.password || !basicData.confirmPassword || !basicData.firstName || !basicData.lastName || !basicData.phone) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields')
      return
    }
    if (basicData.password !== basicData.confirmPassword) {
      setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
      return
    }
    if (basicData.password.length < 6) {
      setError(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters')
      return
    }
    setError(null)
    setStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Build clean registration data - ONLY what backend needs
      const registrationData: any = {
        email: basicData.email,
        password: basicData.password,
        firstName: basicData.firstName,
        lastName: basicData.lastName,
        phone: basicData.phone,
        role: basicData.role,
      }

      // Add role-specific fields only if they have values
      if (basicData.role === 'player') {
        registrationData.city = roleData.city
        registrationData.age = roleData.age
        registrationData.position = roleData.position
        registrationData.level = roleData.level
      } else if (basicData.role === 'coach') {
        registrationData.experience = roleData.experience
        registrationData.trainingType = roleData.trainingType
        registrationData.certificates = roleData.certificates.length > 0 ? roleData.certificates.join(',') : null
      } else if (basicData.role === 'club') {
        registrationData.organizationName = roleData.organizationName
        registrationData.organizationType = roleData.organizationType
      } else if (basicData.role === 'specialist') {
        registrationData.specialization = roleData.specialization
      } else if (['administrator', 'age-group-supervisor', 'sports-director', 'executive-director', 'secretary'].includes(basicData.role)) {
        registrationData.department = roleData.department
        registrationData.position = roleData.adminPosition
      }

      console.log('[REGISTER] Sending data:', registrationData)
      await register(registrationData)
      
      // Redirect to login or verification
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 1000)
    } catch (err: any) {
      console.error('[REGISTER] Error:', err)
      setError(err.message || (language === 'ar' ? 'فشل التسجيل' : 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 py-8 px-4"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TF1</h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'انضم إلى منصة التوظيف الرياضي' : 'Join the Sports Career Platform'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s === step
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-12 h-1 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: Role Selection */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'اختر دورك' : 'Select Your Role'}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { value: 'player', emoji: '⚽', label: language === 'ar' ? 'لاعب' : 'Player' },
                    { value: 'coach', emoji: '👨‍🏫', label: language === 'ar' ? 'مدرب' : 'Coach' },
                    { value: 'club', emoji: '🏟️', label: language === 'ar' ? 'نادي' : 'Club' },
                    { value: 'specialist', emoji: '💪', label: language === 'ar' ? 'متخصص' : 'Specialist' },
                    { value: 'administrator', emoji: '👔', label: language === 'ar' ? 'إداري' : 'Administrator' },
                    { value: 'age-group-supervisor', emoji: '👥', label: language === 'ar' ? 'مشرف فئات' : 'Age Supervisor' },
                    { value: 'sports-director', emoji: '🏆', label: language === 'ar' ? 'مدير رياضي' : 'Sports Director' },
                    { value: 'executive-director', emoji: '📊', label: language === 'ar' ? 'مدير تنفيذي' : 'Executive' },
                    { value: 'secretary', emoji: '📋', label: language === 'ar' ? 'سكرتير' : 'Secretary' },
                  ].map((role) => (
                    <motion.button
                      key={role.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setBasicData({ ...basicData, role: role.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        basicData.role === role.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{role.emoji}</div>
                      <div className="font-semibold text-gray-900 text-sm">{role.label}</div>
                    </motion.button>
                  ))}
                </div>

                <Button
                  onClick={handleStep1Continue}
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2.5 rounded-lg"
                >
                  {language === 'ar' ? 'التالي' : 'Next'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* STEP 2: Basic Information */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'البيانات الأساسية' : 'Basic Information'}
                </h2>

                <div className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                      </label>
                      <Input
                        type="text"
                        placeholder={language === 'ar' ? 'أدخل اسمك الأول' : 'First name'}
                        value={basicData.firstName}
                        onChange={(e) => setBasicData({ ...basicData, firstName: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                      </label>
                      <Input
                        type="text"
                        placeholder={language === 'ar' ? 'أدخل اسمك الأخير' : 'Last name'}
                        value={basicData.lastName}
                        onChange={(e) => setBasicData({ ...basicData, lastName: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder={language === 'ar' ? 'بريدك@example.com' : 'your@email.com'}
                        value={basicData.email}
                        onChange={(e) => setBasicData({ ...basicData, email: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder={language === 'ar' ? '+966 50 1234 5678' : '+966 50 1234 5678'}
                        value={basicData.phone}
                        onChange={(e) => setBasicData({ ...basicData, phone: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={language === 'ar' ? 'اختر كلمة مرور قوية' : 'Choose a strong password'}
                        value={basicData.password}
                        onChange={(e) => setBasicData({ ...basicData, password: e.target.value })}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                        value={basicData.confirmPassword}
                        onChange={(e) => setBasicData({ ...basicData, confirmPassword: e.target.value })}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-gray-400"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 py-2.5 rounded-lg"
                  >
                    {language === 'ar' ? 'رجوع' : 'Back'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleStep2Continue}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2.5 rounded-lg"
                  >
                    {language === 'ar' ? 'التالي' : 'Next'} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Role-Specific Fields */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Player Fields */}
                  {basicData.role === 'player' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'المدينة' : 'City'} *
                        </label>
                        <select
                          value={roleData.city}
                          onChange={(e) => setRoleData({ ...roleData, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          required
                        >
                          <option value="">{language === 'ar' ? 'اختر مدينة' : 'Select a city'}</option>
                          {saudiCities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'العمر' : 'Age'} *
                          </label>
                          <Input
                            type="number"
                            placeholder="20"
                            value={roleData.age}
                            onChange={(e) => setRoleData({ ...roleData, age: e.target.value })}
                            min="16"
                            max="100"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'المركز' : 'Position'} *
                          </label>
                          <select
                            value={roleData.position}
                            onChange={(e) => setRoleData({ ...roleData, position: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                            required
                          >
                            <option value="">{language === 'ar' ? 'اختر' : 'Select'}</option>
                            {playerPositions.map((pos) => (
                              <option key={pos} value={pos}>{pos}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'المستوى' : 'Level'} *
                          </label>
                          <select
                            value={roleData.level}
                            onChange={(e) => setRoleData({ ...roleData, level: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                            required
                          >
                            <option value="">{language === 'ar' ? 'اختر' : 'Select'}</option>
                            {playerLevels.map((level) => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Coach Fields */}
                  {basicData.role === 'coach' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}
                          </label>
                          <Input
                            type="number"
                            placeholder="5"
                            value={roleData.experience}
                            onChange={(e) => setRoleData({ ...roleData, experience: e.target.value })}
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'نوع التدريب' : 'Training Type'}
                          </label>
                          <select
                            value={roleData.trainingType}
                            onChange={(e) => setRoleData({ ...roleData, trainingType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          >
                            <option value="">{language === 'ar' ? 'اختر' : 'Select'}</option>
                            {trainingTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الشهادات' : 'Certificates'}
                        </label>
                        <div className="space-y-2">
                          {certificateOptions.map((cert) => (
                            <label key={cert} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={roleData.certificates.includes(cert)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setRoleData({ ...roleData, certificates: [...roleData.certificates, cert] })
                                  } else {
                                    setRoleData({ ...roleData, certificates: roleData.certificates.filter((c: string) => c !== cert) })
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-gray-700">{cert}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Club Fields */}
                  {basicData.role === 'club' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'اسم النادي/المنظمة' : 'Organization Name'} *
                        </label>
                        <Input
                          type="text"
                          placeholder={language === 'ar' ? 'اسم النادي' : 'Club name'}
                          value={roleData.organizationName}
                          onChange={(e) => setRoleData({ ...roleData, organizationName: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'نوع المنظمة' : 'Organization Type'} *
                        </label>
                        <select
                          value={roleData.organizationType}
                          onChange={(e) => setRoleData({ ...roleData, organizationType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                          required
                        >
                          {organizationTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Specialist Fields */}
                  {basicData.role === 'specialist' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'مجال التخصص' : 'Specialization'}
                      </label>
                      <Input
                        type="text"
                        placeholder={language === 'ar' ? 'مثال: معالج فيزيائي' : 'E.g., Physical Therapist'}
                        value={roleData.specialization || ''}
                        onChange={(e) => setRoleData({ ...roleData, specialization: e.target.value })}
                      />
                    </div>
                  )}

                  {/* Admin Roles Fields */}
                  {['administrator', 'age-group-supervisor', 'sports-director', 'executive-director', 'secretary'].includes(basicData.role) && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'القسم' : 'Department'}
                        </label>
                        <Input
                          type="text"
                          placeholder={language === 'ar' ? 'مثال: الإدارة العامة' : 'E.g., General Management'}
                          value={roleData.department || ''}
                          onChange={(e) => setRoleData({ ...roleData, department: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الموضع' : 'Position'}
                        </label>
                        <Input
                          type="text"
                          placeholder={language === 'ar' ? 'مثال: مدير' : 'E.g., Manager'}
                          value={roleData.adminPosition || ''}
                          onChange={(e) => setRoleData({ ...roleData, adminPosition: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {/* Terms & Conditions */}
                  <label className="flex items-start gap-2 cursor-pointer mt-6">
                    <input type="checkbox" className="rounded mt-1" required />
                    <span className="text-sm text-gray-600">
                      {language === 'ar' 
                        ? 'أوافق على شروط الخدمة وسياسة الخصوصية' 
                        : 'I agree to Terms of Service and Privacy Policy'}
                    </span>
                  </label>

                  {/* Buttons */}
                  <div className="flex gap-4 mt-8">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="flex-1 py-2.5 rounded-lg"
                    >
                      {language === 'ar' ? 'رجوع' : 'Back'}
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white py-2.5 rounded-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === 'ar' ? 'جاري...' : 'Loading...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Login Link */}
                <p className="text-center text-gray-600 mt-6">
                  {language === 'ar' ? 'لديك حساب؟' : 'Already have an account?'}{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                    {language === 'ar' ? 'دخول' : 'Sign in'}
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
      </motion.div>
    </div>
  )
}
