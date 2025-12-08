'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { matchesLogin } from '@/services/matches'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2, Home, Dribbble } from 'lucide-react'
import Image from 'next/image'

export default function MatchesLoginPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!email || !password) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      console.log('[MATCHES LOGIN] Attempting login with email:', email)
      const response = await matchesLogin(email, password)
      console.log('[MATCHES LOGIN] Success:', response)

      setSuccess(true)

      // Redirect to matches page or specified redirect URL
      const redirectUrl = searchParams.get('redirect') || '/matches'
      
      setTimeout(() => {
        router.push(redirectUrl)
      }, 500)
    } catch (err: any) {
      console.error('[MATCHES LOGIN] Error:', err)
      const errorMsg = err.response?.data?.message || err.message || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed')
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4"
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

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 px-8 pt-8 pb-6 relative">
            {/* Home Button */}
            <Link 
              href="/matches"
              className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 group"
            >
              <Home className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </Link>

            {/* Saudi Arabia Flag */}
            <div className="absolute top-4 right-4 text-3xl">
              🇸🇦
            </div>
            
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="TF1 Logo" 
                  width={56} 
                  height={56}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Dribbble className="w-6 h-6 text-white" />
              <h1 className="text-3xl font-bold text-white">
                {language === 'ar' ? 'المباريات' : 'Matches'}
              </h1>
            </div>
            <p className="text-blue-100 text-sm text-center">
              {language === 'ar' ? 'تسجيل الدخول للانضمام للمباريات' : 'Sign in to join matches'}
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

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
              >
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-green-800">
                  {language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful'}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'ar' ? 'جاري...' : 'Loading...'}
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'دخول' : 'Sign In'}
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-500 text-sm">{language === 'ar' ? 'أو' : 'or'}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600">
              {language === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
              <Link href="/matches/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                {language === 'ar' ? 'إنشاء حساب' : 'Sign up'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
