'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSelector } from '@/components/language-selector'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { Mail, Lock, Phone, Eye, EyeOff, AlertCircle, Loader2, ArrowRight, X, Shield, User, Building, Calendar, FileText, Home } from 'lucide-react'

export default function RegisterPage() {
  const { language } = useLanguage()
  const { register } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'player' as string,
  })

  const [roleData, setRoleData] = useState({
    organizationName: '',
    organizationType: 'club' as 'club' | 'academy' | 'federation' | 'sports-center',
    establishedDate: '',
    businessRegistrationNumber: '',
  })

  const roles = [
    { value: 'player', emoji: '⚽', label: language === 'ar' ? 'لاعب' : 'Player', needsExtra: false },
    { value: 'coach', emoji: '👨‍🏫', label: language === 'ar' ? 'مدرب' : 'Coach', needsExtra: false },
    { value: 'club', emoji: '🏟️', label: language === 'ar' ? 'نادي' : 'Club', needsExtra: true },
    { value: 'specialist', emoji: '💪', label: language === 'ar' ? 'متخصص' : 'Specialist', needsExtra: false },
    { value: 'administrator', emoji: '👔', label: language === 'ar' ? 'إداري' : 'Administrator', needsExtra: false },
    { value: 'age-group-supervisor', emoji: '👥', label: language === 'ar' ? 'مشرف فئات' : 'Age Supervisor', needsExtra: false },
    { value: 'sports-director', emoji: '🏆', label: language === 'ar' ? 'مدير رياضي' : 'Sports Director', needsExtra: false },
    { value: 'executive-director', emoji: '📊', label: language === 'ar' ? 'مدير تنفيذي' : 'Executive', needsExtra: false },
    { value: 'secretary', emoji: '📋', label: language === 'ar' ? 'سكرتير' : 'Secretary', needsExtra: false },
  ]

  const organizationTypes = [
    { value: 'club', label: language === 'ar' ? 'نادي' : 'Club' },
    { value: 'academy', label: language === 'ar' ? 'أكاديمية' : 'Academy' },
    { value: 'federation', label: language === 'ar' ? 'اتحاد' : 'Federation' },
    { value: 'sports-center', label: language === 'ar' ? 'مركز رياضي' : 'Sports Center' },
  ]

  const needsExtraStep = formData.role === 'club'
  const totalSteps = needsExtraStep ? 3 : 2

  const handleStep1Continue = () => {
    if (!formData.role) {
      setError(language === 'ar' ? 'اختر دوراً' : 'Please select a role')
      return
    }
    setError(null)
    setStep(2)
  }

  const handleStep2Continue = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.phone) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters')
      return
    }
    setError(null)
    
    if (needsExtraStep) {
      setStep(3)
    } else {
      submitRegistration()
    }
  }

  const handleStep3Continue = () => {
    if (formData.role === 'club') {
      if (!roleData.organizationName || !roleData.establishedDate || !roleData.businessRegistrationNumber) {
        setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields')
        return
      }
    }
    setError(null)
    submitRegistration()
  }

  // تعريف رسائل الخطأ المترجمة
  const getErrorMessage = (errorMsg: string): string => {
    if (language === 'ar') {
      // ترجمة رسائل الخطأ الشائعة
      if (errorMsg.includes('Email, password, and name are required')) {
        return 'البريد الإلكتروني وكلمة المرور والاسم مطلوبة';
      }
      if (errorMsg.includes('Email already exists')) {
        return 'البريد الإلكتروني مسجل مسبقاً';
      }
      if (errorMsg.includes('Invalid email format')) {
        return 'صيغة البريد الإلكتروني غير صحيحة';
      }
      // إذا لم تكن الرسالة معروفة، أعد الرسالة الأصلية
      return errorMsg;
    }
    return errorMsg;
  };

  const submitRegistration = async () => {
    setLoading(true)
    setError(null)

    try {
      let registrationData: any = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
      }

      if (formData.role === 'club') {
        registrationData.organizationName = roleData.organizationName
        registrationData.organizationType = roleData.organizationType
        registrationData.establishedDate = roleData.establishedDate
        registrationData.businessRegistrationNumber = roleData.businessRegistrationNumber
      }

      console.log('[REGISTER] Sending data:', registrationData)
      await register(registrationData)
      
      setSuccess(true)
      setStep(needsExtraStep ? 4 : 3)
      
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 4000)
    } catch (err: any) {
      console.error('[REGISTER] Error:', err)
      const errorMessage = err.message || ''
      
      if (errorMessage.includes('Validation failed') || errorMessage.includes('validation')) {
        setError(language === 'ar' 
          ? 'خطأ في البيانات المدخلة. تأكد من صحة جميع الحقول.' 
          : 'Invalid data. Please check all fields.')
      } else if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        setError(language === 'ar' 
          ? 'هذا البريد الإلكتروني مسجل مسبقاً. جرب تسجيل الدخول.' 
          : 'This email is already registered. Try logging in.')
      } else if (errorMessage.includes('network') || errorMessage.includes('connect')) {
        setError(language === 'ar' 
          ? 'خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً.' 
          : 'Connection error. Check your internet and try again.')
      } else {
        setError(errorMessage || (language === 'ar' ? 'فشل التسجيل. حاول مجدداً.' : 'Registration failed. Please try again.'))
      }
    } finally {
      setLoading(false)
    }
  }

  const renderSuccessStep = () => (
    <motion.div 
      key="success" 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        {language === 'ar' ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}
      </h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Mail className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-blue-900">
            {language === 'ar' ? 'تأكيد الحساب' : 'Account Verification'}
          </span>
        </div>
        <p className="text-sm text-blue-700">
          {language === 'ar' 
            ? `تم إرسال رابط التفعيل إلى ${formData.email}. يرجى فتح بريدك الإلكتروني والضغط على الرابط لتفعيل حسابك.`
            : `A verification link has been sent to ${formData.email}. Please check your email and click the link to activate your account.`}
        </p>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {language === 'ar' 
          ? 'سيتم تحويلك لصفحة تسجيل الدخول خلال ثواني...'
          : 'Redirecting to login page in a few seconds...'}
      </p>

      <Button
        onClick={() => router.push('/login?registered=true')}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
      >
        {language === 'ar' ? 'الذهاب لتسجيل الدخول' : 'Go to Login'}
      </Button>
    </motion.div>
  )

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 py-8 px-4"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
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
        className="relative max-w-lg mx-auto"
      >
        <div className="text-center mb-8 relative">
          {/* Home Button */}
          <Link 
            href="/"
            className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full flex items-center justify-center transition-all duration-300 group shadow-lg"
          >
            <Home className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </Link>

          {/* Saudi Arabia Flag */}
          <div className="absolute top-0 right-0 text-4xl">
            🇸🇦
          </div>
          
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 rounded-2xl p-1 shadow-lg">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="TF1 Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent mb-2">
            TF1 JOBS
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'انضم إلى منصة التوظيف الرياضي' : 'Join the Sports Career Platform'}
          </p>
        </div>

        {!success && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
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
                {s < totalSteps && <div className={`w-12 h-1 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{getErrorMessage(error)}</p>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {language === 'ar' ? 'اختر دورك' : 'Select Your Role'}
                </h2>
                
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <motion.button
                      key={role.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.role === role.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{role.emoji}</div>
                      <div className="font-medium text-gray-900 text-xs">{role.label}</div>
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

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {language === 'ar' ? 'البيانات الأساسية' : 'Basic Information'}
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الاسم الأول' : 'First Name'} *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder={language === 'ar' ? 'أدخل اسمك' : 'First name'}
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="pl-10"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الاسم الأخير' : 'Last Name'} *
                      </label>
                      <Input
                        type="text"
                        placeholder={language === 'ar' ? 'اسمك الأخير' : 'Last name'}
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder={language === 'ar' ? 'بريدك@example.com' : 'your@email.com'}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم الجوال' : 'Phone Number'} *
                    </label>
                    <div className="flex gap-2 items-center" dir="ltr">
                      <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2 font-semibold text-gray-700 flex-shrink-0">
                        <span>🇸🇦</span>
                        <span>+966</span>
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="5X XXX XXXX"
                          value={formData.phone.replace('+966', '').replace(/\D/g, '').slice(0, 9)}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 9)
                            setFormData({ ...formData, phone: '+966' + digits })
                          }}
                          className="pl-10"
                          disabled={loading}
                          maxLength={9}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ar' ? 'أدخل 9 أرقام (بدون صفر)' : 'Enter 9 digits (without leading zero)'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'كلمة المرور' : 'Password'} *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={language === 'ar' ? 'كلمة مرور قوية' : 'Strong password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'} *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={language === 'ar' ? 'أعد كلمة المرور' : 'Re-enter password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-gray-500 text-center mb-4">
                      {language === 'ar' 
                        ? 'بالتسجيل، أنت توافق على ' 
                        : 'By registering, you agree to our '}
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-blue-600 hover:underline"
                      >
                        {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                      </button>
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 py-2.5 rounded-lg"
                      disabled={loading}
                    >
                      {language === 'ar' ? 'رجوع' : 'Back'}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleStep2Continue}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2.5 rounded-lg"
                    >
                      {loading && !needsExtraStep ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === 'ar' ? 'جاري...' : 'Loading...'}
                        </>
                      ) : needsExtraStep ? (
                        <>
                          {language === 'ar' ? 'التالي' : 'Next'} <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        language === 'ar' ? 'إنشاء حساب' : 'Create Account'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && formData.role === 'club' && (
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {language === 'ar' ? 'معلومات النادي/المنظمة' : 'Organization Information'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اسم المنظمة' : 'Organization Name'} *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={language === 'ar' ? 'اسم النادي أو الأكاديمية' : 'Club or Academy name'}
                        value={roleData.organizationName}
                        onChange={(e) => setRoleData({ ...roleData, organizationName: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نوع المنظمة' : 'Organization Type'} *
                    </label>
                    <select
                      value={roleData.organizationType}
                      onChange={(e) => setRoleData({ ...roleData, organizationType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    >
                      {organizationTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تاريخ التأسيس' : 'Established Date'} *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type="date"
                        value={roleData.establishedDate}
                        onChange={(e) => setRoleData({ ...roleData, establishedDate: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'رقم السجل التجاري' : 'Business Registration Number'} *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={language === 'ar' ? 'رقم السجل التجاري' : 'Registration number'}
                        value={roleData.businessRegistrationNumber}
                        onChange={(e) => setRoleData({ ...roleData, businessRegistrationNumber: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="flex-1 py-2.5 rounded-lg"
                      disabled={loading}
                    >
                      {language === 'ar' ? 'رجوع' : 'Back'}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleStep3Continue}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2.5 rounded-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === 'ar' ? 'جاري...' : 'Loading...'}
                        </>
                      ) : (
                        language === 'ar' ? 'إنشاء حساب' : 'Create Account'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {success && renderSuccessStep()}
          </AnimatePresence>

          {!success && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {language === 'ar' ? 'لديك حساب؟' : 'Already have an account?'}{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  {language === 'ar' ? 'سجل دخول' : 'Sign In'}
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
      </motion.div>

      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  <h3 className="text-xl font-bold">
                    {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                  </h3>
                </div>
                <button onClick={() => setShowPrivacyModal(false)} className="p-1 hover:bg-white/20 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-gray-700 leading-relaxed" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {language === 'ar' ? (
                  <div className="space-y-4">
                    <p className="font-semibold">وفقاً لنظام حماية البيانات الشخصية السعودي (المرسوم الملكي رقم م/19):</p>
                    <p>نلتزم بحماية بياناتك الشخصية وفقاً للأنظمة السعودية.</p>
                    <p><strong>البيانات المجمعة:</strong> الاسم، البريد الإلكتروني، رقم الجوال، والمعلومات المهنية.</p>
                    <p><strong>الغرض:</strong> تقديم خدمات التوظيف الرياضي وتحسين تجربتك.</p>
                    <p><strong>حقوقك:</strong> الوصول لبياناتك، تصحيحها، أو حذفها.</p>
                    <p><strong>الأمان:</strong> نستخدم تقنيات تشفير متقدمة لحماية بياناتك.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="font-semibold">In accordance with Saudi Personal Data Protection Law (Royal Decree M/19):</p>
                    <p>We are committed to protecting your personal data in compliance with Saudi regulations.</p>
                    <p><strong>Data Collected:</strong> Name, email, phone number, and professional information.</p>
                    <p><strong>Purpose:</strong> To provide sports recruitment services and improve your experience.</p>
                    <p><strong>Your Rights:</strong> Access, correct, or delete your data.</p>
                    <p><strong>Security:</strong> We use advanced encryption to protect your data.</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t">
                <Button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                >
                  {language === 'ar' ? 'فهمت' : 'I Understand'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
