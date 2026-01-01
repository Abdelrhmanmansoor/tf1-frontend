'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { motion, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'
import authService from '@/services/auth'

interface MagicOrb {
  id: string
  x: number
  y: number
  size: number
  color: string
  opacity: number
  speed: number
}

function ResetPasswordForm() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [magicOrbs, setMagicOrbs] = useState<MagicOrb[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useSpring(0, { stiffness: 300, damping: 30 })
  const mouseY = useSpring(0, { stiffness: 300, damping: 30 })

  // Get token from URL params
  useEffect(() => {
    const tokenFromURL = searchParams.get('token')
    if (tokenFromURL) {
      setToken(tokenFromURL)
    } else {
      setError(
        language === 'ar' ? 'رمز إعادة التعيين مفقود' : 'Reset token is missing'
      )
    }
  }, [searchParams, language])

  // Magic orbs animation
  useEffect(() => {
    const colors = ['#3B82F6', '#10B981', '#60A5FA', '#34D399']

    const createOrbs = () => {
      const newOrbs: MagicOrb[] = []
      for (let i = 0; i < 15; i++) {
        newOrbs.push({
          id: i.toString(),
          x:
            Math.random() *
            (typeof window !== 'undefined' ? window.innerWidth : 1200),
          y:
            Math.random() *
            (typeof window !== 'undefined' ? window.innerHeight : 800),
          size: Math.random() * 80 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.3 + 0.1,
          speed: Math.random() * 2 + 1,
        })
      }
      setMagicOrbs(newOrbs)
    }

    createOrbs()

    const animateOrbs = () => {
      setMagicOrbs((prev) =>
        prev.map((orb) => {
          const newY = orb.y - orb.speed
          return {
            ...orb,
            y:
              newY < -100
                ? (typeof window !== 'undefined' ? window.innerHeight : 800) +
                  100
                : newY,
            x: orb.x + Math.sin(orb.y * 0.01) * 2,
          }
        })
      )
    }

    const interval = setInterval(animateOrbs, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleResetPassword = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError(
        language === 'ar'
          ? 'كلمات المرور غير متطابقة'
          : 'Passwords do not match'
      )
      return
    }

    if (!token) {
      setError(
        language === 'ar' ? 'رمز إعادة التعيين مفقود' : 'Reset token is missing'
      )
      return
    }

    if (formData.password.length < 8) {
      setError(
        language === 'ar'
          ? 'كلمة المرور يجب ألا تقل عن 8 أحرف'
          : 'Password must be at least 8 characters long'
      )
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError(
        language === 'ar'
          ? 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم'
          : 'Password must contain uppercase, lowercase, and a number'
      )
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Call reset password API
      await authService.resetPassword(token, formData.password)
      // Redirect to success page or login
      router.push('/reset-password-success')
    } catch (error: any) {
      setError(
        error.message ||
          (language === 'ar'
            ? 'فشل في إعادة تعيين كلمة المرور'
            : 'Failed to reset password')
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-screen relative overflow-hidden ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Magical Background */}
      <div className="fixed inset-0 z-0">
        {/* Dynamic Gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #3B82F6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #10B981 0%, transparent 50%), radial-gradient(circle at 40% 40%, #60A5FA 0%, transparent 50%)',
              'radial-gradient(circle at 60% 20%, #10B981 0%, transparent 50%), radial-gradient(circle at 20% 60%, #3B82F6 0%, transparent 50%), radial-gradient(circle at 80% 80%, #34D399 0%, transparent 50%)',
              'radial-gradient(circle at 80% 40%, #60A5FA 0%, transparent 50%), radial-gradient(circle at 40% 80%, #10B981 0%, transparent 50%), radial-gradient(circle at 20% 20%, #3B82F6 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Magic Orbs */}
        <div className="absolute inset-0">
          {magicOrbs.map((orb) => (
            <motion.div
              key={orb.id}
              className="absolute rounded-full filter blur-sm"
              style={{
                x: orb.x,
                y: orb.y,
                width: orb.size,
                height: orb.size,
                backgroundColor: orb.color,
                opacity: orb.opacity,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [orb.opacity, orb.opacity * 1.5, orb.opacity],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Interactive Light Effect */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 filter blur-3xl pointer-events-none"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + i * 7}%`,
                top: `${15 + i * 5}%`,
              }}
              animate={{
                y: [0, -50, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.2,
              }}
            >
              {i % 3 === 0 ? (
                <div className="w-8 h-8 bg-white/10 rounded-full" />
              ) : i % 3 === 1 ? (
                <div className="w-6 h-6 bg-white/15 rotate-45" />
              ) : (
                <div className="w-4 h-8 bg-white/20 rounded-full transform rotate-45" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0, rotateY: 10 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-10"
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="text-5xl sm:text-6xl lg:text-7xl mb-6"
                animate={{
                  rotateY: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotateY: { duration: 4, repeat: Infinity, ease: 'linear' },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  },
                }}
              >
                🔐
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {language === 'ar'
                  ? 'إعادة تعيين كلمة المرور'
                  : 'Reset Password'}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ar'
                  ? 'أدخل كلمة مرور جديدة قوية لحسابك'
                  : 'Enter a new strong password for your account'}
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Reset Password Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleResetPassword()
              }}
            >
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Lock className="w-4 h-4 inline mr-2" />
                  {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    placeholder={
                      language === 'ar'
                        ? 'أدخل كلمة مرور قوية'
                        : 'Enter a strong password'
                    }
                    className="h-14 text-lg border-2 focus:border-purple-500 transition-all duration-300 rounded-xl pl-12 pr-14"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    placeholder={
                      language === 'ar'
                        ? 'أعد إدخال كلمة المرور'
                        : 'Re-enter your password'
                    }
                    className="h-14 text-lg border-2 focus:border-purple-500 transition-all duration-300 rounded-xl pl-12 pr-14"
                    required
                  />
                  <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Password Requirements */}
              <motion.div
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="text-purple-800 font-medium mb-2">
                  {language === 'ar'
                    ? 'متطلبات كلمة المرور:'
                    : 'Password Requirements:'}
                </h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>
                    {language === 'ar'
                      ? '• 8 أحرف على الأقل'
                      : '• At least 8 characters'}
                  </li>
                  <li>
                    {language === 'ar'
                      ? '• حرف كبير واحد على الأقل'
                      : '• At least one uppercase letter'}
                  </li>
                  <li>
                    {language === 'ar'
                      ? '• حرف صغير واحد على الأقل'
                      : '• At least one lowercase letter'}
                  </li>
                  <li>
                    {language === 'ar'
                      ? '• رقم واحد على الأقل'
                      : '• At least one number'}
                  </li>
                  <li>
                    {language === 'ar'
                      ? '• رمز خاص واحد على الأقل'
                      : '• At least one special character'}
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  disabled={
                    isLoading || !formData.password || !formData.confirmPassword
                  }
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 hover:from-blue-700 hover:via-blue-600 hover:to-green-600 transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  <div className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        {language === 'ar'
                          ? 'إعادة تعيين كلمة المرور'
                          : 'Reset Password'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </div>
                </Button>
              </motion.div>
            </form>

            {/* Back to Login Link */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'تذكرت كلمة المرور؟'
                  : 'Remember your password?'}
                <Link
                  href="/login"
                  className="ml-2 text-blue-600 hover:text-blue-500 font-medium transition-colors duration-300"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
              </p>
            </motion.div>

            {/* Back to Home */}
            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                {language === 'ar'
                  ? 'العودة للصفحة الرئيسية'
                  : 'Back to Homepage'}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
