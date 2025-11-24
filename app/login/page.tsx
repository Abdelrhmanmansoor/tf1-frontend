'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSelector } from '@/components/language-selector'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { language } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)
    setLoading(true)

    try {
      // Call login API
      const response = await login(email, password)

      // Check if email is verified
      if (response.requiresVerification) {
        setError(
          language === 'ar'
            ? 'يرجى تفعيل حسابك عبر البريد الإلكتروني قبل تسجيل الدخول'
            : 'Please verify your email before logging in. Check your inbox.'
        )
        setLoading(false)
        return
      }

      // Login successful - redirect based on role
      const userRole = response.user.role

      switch (userRole) {
        case 'player':
          router.push('/dashboard?role=player')
          break
        case 'coach':
          router.push('/dashboard?role=coach')
          break
        case 'club':
          router.push('/dashboard?role=club')
          break
        case 'specialist':
          router.push('/dashboard?role=specialist')
          break
        default:
          router.push('/dashboard')
      }
    } catch (err: any) {
      setError(
        err.message || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 p-6 relative overflow-hidden ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Animated Background - Same as Register */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      {/* Language Selector - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      {/* Back to Home Button - Mobile friendly */}
      <Link href="/" className="fixed top-6 left-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="hidden sm:inline">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </motion.button>
      </Link>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="text-5xl mb-6"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              🏆
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar'
                ? 'مرحباً بعودتك! سجل دخولك للمتابعة'
                : 'Welcome back! Please sign in to continue'}
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
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Mail className="w-4 h-4 inline mr-2" />
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'أدخل بريدك الإلكتروني'
                      : 'Enter your email'
                  }
                  className="h-14 text-lg border-2 focus:border-blue-500 transition-all duration-300 rounded-xl pl-12"
                  dir="ltr"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Lock className="w-4 h-4 inline mr-2" />
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'أدخل كلمة المرور'
                      : 'Enter your password'
                  }
                  className="h-14 text-lg border-2 focus:border-blue-500 transition-all duration-300 rounded-xl pl-12 pr-12"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-6">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-300"
              >
                {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 hover:from-blue-700 hover:via-blue-600 hover:to-green-600 transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              {loading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              <div className="flex items-center justify-center gap-2">
                {loading ? (
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
                    <LogIn className="w-5 h-5" />
                    {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </>
                )}
              </div>
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-300"
              >
                {language === 'ar' ? 'سجل الآن' : 'Sign Up'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
