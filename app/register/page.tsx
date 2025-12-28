'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { Mail, Lock, Phone, Eye, EyeOff, Loader2, ArrowRight, User, Building, Calendar, FileText, Home, Info, CircleCheck, ShieldCheck, CircleHelp } from 'lucide-react'
import { toast } from 'sonner'

// Schema Definitions
const commonShape = {
  firstName: z.string().min(2, 'Name too short'),
  lastName: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(9, 'Phone number invalid'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/, 'Password must contain uppercase, lowercase, and a number'),
  confirmPassword: z.string()
}

const clubObject = z.object({
  ...commonShape,
  role: z.literal('club'),
  organizationName: z.string().min(2, 'Organization name required'),
  organizationType: z.enum(['club', 'academy', 'federation', 'sports-center']),
  establishedDate: z.string().min(1, 'Date required'),
  businessRegistrationNumber: z.string().min(1, 'Registration number required'),
})

const regularObject = z.object({
  ...commonShape,
  role: z.enum(['player', 'coach', 'specialist', 'sports-administrator', 'age-group-supervisor', 'sports-director', 'executive-director', 'secretary', 'team']),
  organizationName: z.string().optional(),
  organizationType: z.string().optional(),
  establishedDate: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
})

// Union schema 
const registrationSchema = z.discriminatedUnion("role", [
  regularObject,
  clubObject
]).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegistrationFormValues = z.infer<typeof registrationSchema>

export default function RegisterPage() {
  const { language } = useLanguage()
  const { register: authRegister } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [success, setSuccess] = useState(false)
  const [emailForSuccess, setEmailForSuccess] = useState('')

  // Form Setup
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: 'player', // Default
      organizationType: 'club',
      phone: '+966'
    },
    mode: 'onChange'
  })

  // Watchers
  const selectedRole = watch('role')
  const formValues = watch()

  // Steps Logic
  const needsExtraStep = selectedRole === 'club'
  const totalSteps = needsExtraStep ? 3 : 2

  const handleStep1Continue = async () => {
    const isValid = await trigger('role')
    if (isValid) setStep(2)
  }

  const handleStep2Continue = async () => {
    // Validate fields for step 2
    const fieldsToValidate: any[] = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword']
    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      if (needsExtraStep) {
        setStep(3)
      } else {
        // Submit
        await onSubmit(formValues)
      }
    }
  }

  const handleStep3Continue = async () => {
    const isValid = await trigger(['organizationName', 'organizationType', 'establishedDate', 'businessRegistrationNumber'])
    if (isValid) {
      await onSubmit(formValues)
    }
  }

  const onSubmit = async (data: RegistrationFormValues) => {
    setLoading(true)
    try {
      // Prepare payload
      const payload: any = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role
      }

      if (data.role === 'club') {
        payload.organizationName = data.organizationName
        payload.organizationType = data.organizationType
        payload.establishedDate = data.establishedDate
        payload.businessRegistrationNumber = data.businessRegistrationNumber
      }

      await authRegister(payload)

      setEmailForSuccess(data.email)
      setSuccess(true)
      toast.success(language === 'ar' ? 'تم التسجيل بنجاح' : 'Registration successful')

      setTimeout(() => {
        router.push('/login?registered=true')
      }, 5000)

    } catch (err: any) {
      console.error('Registration Error:', err)
      let msg = err.message || (language === 'ar' ? 'فشل التسجيل' : 'Registration failed')
      if (Array.isArray(err.errors) && err.errors.length > 0) {
        const first = err.errors[0]
        const mapped = language === 'ar'
          ? (first.message
              .replace('Password must be at least 8 characters long', 'كلمة المرور يجب ألا تقل عن 8 أحرف')
              .replace('Password must contain at least one uppercase letter, one lowercase letter, and one number', 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم')
              .replace('Please provide a valid email address', 'يرجى إدخال بريد إلكتروني صالح')
              .replace('First name is required', 'الاسم الأول مطلوب')
              .replace('Last name is required', 'الاسم الأخير مطلوب')
              .replace('Organization name is required', 'اسم المنظمة مطلوب')
              .replace('Established date is required', 'تاريخ التأسيس مطلوب')
              .replace('Business registration number is required', 'رقم السجل التجاري مطلوب'))
          : first.message
        msg = `${language === 'ar' ? 'فشل التحقق:' : 'Validation failed:'} ${mapped}`
      }
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // --- Constants ---
  const roles = [
    { value: 'player', emoji: '⚽', label: language === 'ar' ? 'لاعب' : 'Player' },
    { value: 'coach', emoji: '👨‍🏫', label: language === 'ar' ? 'مدرب' : 'Coach' },
    { value: 'club', emoji: '🏟️', label: language === 'ar' ? 'نادي' : 'Club' },
    { value: 'specialist', emoji: '💪', label: language === 'ar' ? 'متخصص' : 'Specialist' },
    { value: 'sports-administrator', emoji: '👔', label: language === 'ar' ? 'إداري رياضي' : 'Sports Administrator' },
    { value: 'age-group-supervisor', emoji: '👥', label: language === 'ar' ? 'مشرف فئات' : 'Age Supervisor' },
    { value: 'sports-director', emoji: '🏆', label: language === 'ar' ? 'مدير رياضي' : 'Sports Director' },
    { value: 'executive-director', emoji: '📊', label: language === 'ar' ? 'مدير تنفيذي' : 'Executive' },
    { value: 'secretary', emoji: '📋', label: language === 'ar' ? 'سكرتير' : 'Secretary' },
  ]
  const organizationTypes = [
    { value: 'club', label: language === 'ar' ? 'نادي' : 'Club' },
    { value: 'academy', label: language === 'ar' ? 'أكاديمية' : 'Academy' },
    { value: 'federation', label: language === 'ar' ? 'اتحاد' : 'Federation' },
    { value: 'sports-center', label: language === 'ar' ? 'مركز رياضي' : 'Sports Center' },
  ]

  const isRtl = language === 'ar'

  // --- Render Helpers ---

  const renderClubInfo = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 overflow-hidden"
    >
      <div className="flex items-start gap-3">
        <Info className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
        <div>
          <h3 className="font-bold text-blue-900 mb-2">
            {language === 'ar' ? 'هام: تسجيل حساب نادي/منظمة' : 'Important: Club/Organization Registration'}
          </h3>
          <p className="text-sm text-blue-800 mb-3 leading-relaxed">
            {language === 'ar' 
              ? 'هذا الدور مخصص فقط للمؤسسات الرسمية (أندية، أكاديميات، شركات رياضية) ويتطلب وثائق رسمية.' 
              : 'This role is for official entities only (Clubs, Academies, Sports Companies) and requires official documents.'}
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-blue-700">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              {language === 'ar' ? 'يجب توفر سجل تجاري أو ترخيص' : 'Commercial Registration or License required'}
            </li>
            <li className="flex items-center gap-2 text-sm text-blue-700">
              <CircleCheck className="w-4 h-4 text-blue-600" />
              {language === 'ar' ? 'سيتم التحقق من الوثائق قبل التفعيل' : 'Documents will be verified before activation'}
            </li>
          </ul>
          
          <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between text-xs text-blue-900">
            <span>{language === 'ar' ? 'تواجه مشكلة في التسجيل؟' : 'Need help registering?'}</span>
            <a href="mailto:support@tf1.com" className="font-semibold underline hover:text-blue-700 flex items-center gap-1">
              {language === 'ar' ? 'تواصل مع الدعم الفني' : 'Contact Support'}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )

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
        className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <div className="text-4xl text-white">✓</div>
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
            ? `تم إرسال رابط التفعيل إلى ${emailForSuccess}. يرجى التحقق من بريدك.`
            : `Verification link sent to ${emailForSuccess}. Please check your email.`}
        </p>
      </div>

      <Button
        onClick={() => router.push('/login?registered=true')}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
      >
        {language === 'ar' ? 'الذهاب لتسجيل الدخول' : 'Go to Login'}
      </Button>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 py-8 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20" animate={{ y: [0, 30, 0], x: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20" animate={{ y: [0, -30, 0], x: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative max-w-lg mx-auto">
        <div className="text-center mb-8 relative">
          <Link href="/" className={`absolute top-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform ${isRtl ? 'left-0' : 'left-0'}`}>
            <Home className="w-6 h-6" />
          </Link>
          <div className={`absolute top-0 text-4xl ${isRtl ? 'right-0' : 'right-0'}`}>🇸🇦</div>

          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={80} height={80} className="object-contain" priority />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent mb-2">TF1 JOBS</h1>
          <p className="text-gray-600">{language === 'ar' ? 'انضم إلى منصة التوظيف الرياضي' : 'Join the Sports Career Platform'}</p>
        </div>

        {!success && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${s === step ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : s < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {s < step ? '✓' : s}
                </div>
                {s < totalSteps && <div className={`w-12 h-1 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/50 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {step === 1 && !success && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{language === 'ar' ? 'اختر دورك' : 'Select Your Role'}</h2>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role: any) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setValue('role', role.value)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedRole === role.value ? 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-100' : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'}`}
                    >
                      <span className="text-2xl">{role.emoji}</span>
                      <span className="text-xs font-semibold text-gray-700 text-center">{role.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6">
                  {selectedRole === 'club' && renderClubInfo()}
                </div>

                <Button onClick={handleStep1Continue} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3">
                  {language === 'ar' ? 'التالي' : 'Next'} <ArrowRight className="w-4 h-4 mx-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && !success && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{language === 'ar' ? 'البيانات الأساسية' : 'Basic Information'}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
                      <div className="relative">
                        <User className={`absolute top-3 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                        <Input {...register('firstName')} className={`bg-gray-50 focus:bg-white ${isRtl ? 'pr-10' : 'pl-10'}`} placeholder="" />
                      </div>
                      {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'الاسم الأخير' : 'Last Name'}</label>
                      <Input {...register('lastName')} className="bg-gray-50 focus:bg-white" placeholder="" />
                      {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                    <div className="relative">
                      <Mail className={`absolute top-3 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                      <Input {...register('email')} type="email" className={`bg-gray-50 focus:bg-white ${isRtl ? 'pr-10' : 'pl-10'}`} dir="ltr" />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'رقم الجوال' : 'Phone'}</label>
                    <div className="relative" dir="ltr">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input {...register('phone')} className="pl-10 bg-gray-50 focus:bg-white" placeholder="+966" />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                    <div className="relative">
                      <Lock className={`absolute top-3 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                      <Input {...register('password')} type={showPassword ? 'text' : 'password'} className={`bg-gray-50 focus:bg-white ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'}`} dir="ltr" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-3 text-gray-400 ${isRtl ? 'left-3' : 'right-3'}`}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                    <div className="relative">
                      <Lock className={`absolute top-3 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                      <Input {...register('confirmPassword')} type={showConfirmPassword ? 'text' : 'password'} className={`bg-gray-50 focus:bg-white ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'}`} dir="ltr" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute top-3 text-gray-400 ${isRtl ? 'left-3' : 'right-3'}`}>
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">{language === 'ar' ? 'السابق' : 'Back'}</Button>
                    <Button type="button" onClick={handleStep2Continue} disabled={loading} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold">
                      {loading && !needsExtraStep ? <Loader2 className="w-4 h-4 animate-spin" /> : needsExtraStep ? (language === 'ar' ? 'التالي' : 'Next') : (language === 'ar' ? 'إنشاء حساب' : 'Create Account')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && needsExtraStep && !success && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{language === 'ar' ? 'بيانات النادي/المنظمة' : 'Organization Info'}</h2>
                
                {renderClubInfo()}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'اسم المنظمة' : 'Organization Name'}</label>
                    <div className="relative">
                      <Building className={`absolute top-3 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                      <Input {...register('organizationName')} className={`bg-gray-50 focus:bg-white ${isRtl ? 'pr-10' : 'pl-10'}`} />
                    </div>
                    {errors.organizationName && <p className="text-xs text-red-500">{errors.organizationName.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'نوع المنظمة' : 'Type'}</label>
                    <select {...register('organizationType')} className="w-full p-2 border rounded-md bg-gray-50 focus:bg-white border-input">
                      {organizationTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'تاريخ التأسيس' : 'Established Date'}</label>
                    <div className="relative">
                      <Calendar className={`absolute top-3 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                      <Input {...register('establishedDate')} type="date" className={`bg-gray-50 focus:bg-white ${isRtl ? 'pr-10' : 'pl-10'}`} />
                    </div>
                    {errors.establishedDate && <p className="text-xs text-red-500">{errors.establishedDate.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">{language === 'ar' ? 'رقم السجل التجاري' : 'Registration Number'}</label>
                    <div className="relative">
                      <FileText className={`absolute top-3 w-4 h-4 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                      <Input {...register('businessRegistrationNumber')} className={`bg-gray-50 focus:bg-white ${isRtl ? 'pr-10' : 'pl-10'}`} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <CircleHelp className="w-3 h-3" />
                      {language === 'ar' ? 'رقم السجل التجاري أو الترخيص الرسمي للمنشأة' : 'Commercial Registration or Official License Number'}
                    </p>
                    {errors.businessRegistrationNumber && <p className="text-xs text-red-500">{errors.businessRegistrationNumber.message}</p>}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">{language === 'ar' ? 'السابق' : 'Back'}</Button>
                    <Button type="button" onClick={handleStep3Continue} disabled={loading} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إنشاء حساب' : 'Create Account')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {success && renderSuccessStep()}
          </AnimatePresence>

          {!success && (
            <div className="mt-6 text-center pt-6 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                {language === 'ar' ? 'لديك حساب؟' : 'Already have an account?'}{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">{language === 'ar' ? 'سجل دخول' : 'Sign In'}</Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowPrivacyModal(false)}>
            <div className="bg-white p-6 rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</h3>
              <p className="text-gray-600 mb-4 text-sm">
                {language === 'ar' ? 'نلتزم بحماية بياناتك...' : 'We are committed to protecting your data...'}
              </p>
              <Button onClick={() => setShowPrivacyModal(false)} className="w-full">{language === 'ar' ? 'إغلاق' : 'Close'}</Button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
