'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSelector } from '@/components/language-selector'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2, Home } from 'lucide-react'
import Image from 'next/image'
import { getDashboardRoute } from '@/utils/role-routes'
import { toast } from 'sonner' // Assuming sonner is installed as per package.json

// Zod Schema for Validation
const loginSchema = z.object({
  email: z.string().email('Email is invalid').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginContent() {
  const { language } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Check for registration success param
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setRegistrationSuccess(true)
      if (language === 'ar') {
        toast.success('تم التسجيل بنجاح! يرجى تفعيل حسابك.')
      } else {
        toast.success('Registration successful! Please verify your account.')
      }
    }
  }, [searchParams, language])

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)
    setLoading(true)

    try {
      const response = await login(data.email, data.password)

      if (response.requiresVerification) {
        const msg = language === 'ar' ? 'يرجى تفعيل حسابك أولاً' : 'Please verify your email first'
        setError(msg)
        toast.warning(msg)
        setLoading(false)
        return
      }

      toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful')

      // Determine Redirect
      const redirectUrl = searchParams.get('redirect') || searchParams.get('next')
      if (redirectUrl) {
        window.location.href = redirectUrl
        return
      }

      const roleRoute = getDashboardRoute(response.user.role)
      // Use window.location for a fresh state on dashboard load
      window.location.href = roleRoute

    } catch (err: any) {
      console.error('[LOGIN] Error:', err)
      const errorMsg = err.message || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed')
      setError(errorMsg)
      toast.error(errorMsg)
      setLoading(false)
    }
  }

  const isRtl = language === 'ar'

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4"
      dir={isRtl ? 'rtl' : 'ltr'}
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
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/50 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 px-8 pt-8 pb-6 relative">
            <Link
              href="/"
              className={`absolute top-4 ${isRtl ? 'left-4' : 'left-4'} w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 group`}
            >
              <Home className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </Link>

            <div className={`absolute top-4 ${isRtl ? 'right-4' : 'right-4'} text-3xl`}>
              🇸🇦
            </div>

            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="TF1 Logo"
                  width={56}
                  height={56}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 text-center">TF1</h1>
            <p className="text-blue-100 text-sm text-center">
              {language === 'ar' ? 'منصة التوظيف الرياضي' : 'Sports Career Platform'}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {language === 'ar' ? 'أدخل بيانات حسابك للمتابعة' : 'Enter your credentials to continue'}
            </p>

            {/* Registration Success Message */}
            {registrationSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">
                    {language === 'ar' ? 'تحقق من بريدك' : 'Check your email'}
                  </h4>
                  <p className="text-xs text-blue-700 mt-1">
                    {language === 'ar'
                      ? 'تم إرسال رابط التفعيل. يرجى التحقق لتسجيل الدخول.'
                      : 'Verification link sent. Please verify to login.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* General Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-3 w-5 h-5 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder={language === 'ar' ? 'example@domain.com' : 'example@domain.com'}
                    className={`${isRtl ? 'pr-10' : 'pl-10'} bg-gray-50 border-gray-200 focus:bg-white transition-colors`}
                    disabled={loading}
                    dir="ltr" // Email is always LTR
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-3 w-5 h-5 text-gray-400 ${isRtl ? 'right-3' : 'left-3'}`} />
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} bg-gray-50 border-gray-200 focus:bg-white transition-colors`}
                    disabled={loading}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-3 text-gray-400 hover:text-gray-600 ${isRtl ? 'left-3' : 'right-3'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                    {language === 'ar' ? 'تذكرني' : 'Remember me'}
                  </span>
                </label>
                <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    {language === 'ar' ? 'جاري الدخول...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    <LogIn className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                    {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </>
                )}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs uppercase tracking-wider">{language === 'ar' ? 'أو' : 'OR'}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-center text-gray-600 text-sm">
              {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                {language === 'ar' ? 'سجل الآن' : 'Create Account'}
              </Link>
            </p>
          </div>
        </div>

        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>
          <LanguageSelector />
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
