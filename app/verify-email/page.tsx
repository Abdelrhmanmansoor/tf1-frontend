'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  )
  const [message, setMessage] = useState('')
  const hasVerified = useRef(false)

  useEffect(() => {
    // ✅ CRITICAL: Only run ONCE - prevent all retries
    if (hasVerified.current) {
      console.log('[VERIFY] Already called API, skipping')
      return
    }

    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage(
        language === 'ar' ? 'رمز التحقق مفقود' : 'Invalid verification link'
      )
      return
    }

    // ✅ Set flag BEFORE API call - prevents all retries
    hasVerified.current = true
    console.log(
      '[VERIFY] Calling API ONCE with token:',
      token.substring(0, 10) + '...'
    )

    // ✅ Single API call - NO RETRIES
    fetch(
      `https://sportsplatform-be.onrender.com/api/v1/auth/verify-email?token=${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('[VERIFY] Response received:', data)

        // ✅ STOP on ANY response - success OR failure
        if (data.success === true) {
          setStatus('success')
          setMessage(data.message || 'Email verified successfully!')

          if (data.accessToken) {
            localStorage.setItem('sportx_access_token', data.accessToken)
          }
          if (data.user) {
            localStorage.setItem('sportx_user_data', JSON.stringify(data.user))
          }

          console.log('[VERIFY] Success! Redirecting...')

          if (data.alreadyVerified === true) {
            setTimeout(() => router.replace('/login'), 1500)
          } else {
            const userRole = data.user?.role || 'player'
            setTimeout(
              () => router.replace(`/dashboard?role=${userRole}`),
              2000
            )
          }
        } else {
          setStatus('error')
          setMessage(data.message || 'Verification failed')
        }
        // ✅ NO RETRY - just stop here
      })
      .catch((error) => {
        console.error('[VERIFY] Network error:', error)
        setStatus('error')
        setMessage(language === 'ar' ? 'خطأ في الاتصال' : 'Network error')
        // ✅ NO RETRY - just stop here
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // ✅ EMPTY ARRAY - only run once on mount - CRITICAL to prevent retries

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Loader2 className="w-16 h-16 text-blue-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
            </h2>
            <p className="text-gray-600">
              {language === 'ar'
                ? 'جاري التحقق من بريدك الإلكتروني، يرجى الانتظار...'
                : 'Verifying your email, please wait...'}
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="text-green-500 mb-6"
            >
              <CheckCircle className="w-16 h-16 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              {language === 'ar' ? 'تم التحقق بنجاح!' : 'Email Verified!'}
            </h2>
            <p className="text-green-600 mb-4">{message}</p>
            <p className="text-sm text-green-600">
              {message.includes('already') || message.includes('بالفعل')
                ? language === 'ar'
                  ? 'سيتم توجيهك لصفحة تسجيل الدخول...'
                  : 'Redirecting to login page...'
                : language === 'ar'
                  ? 'سيتم توجيهك للوحة التحكم...'
                  : 'Redirecting to dashboard...'}
            </p>
            <Button
              onClick={() => {
                const userData = localStorage.getItem('sportx_user_data')
                const user = userData ? JSON.parse(userData) : null
                const userRole = user?.role || 'player'
                router.replace(`/dashboard?role=${userRole}`)
              }}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              {language === 'ar' ? 'الذهاب للوحة التحكم' : 'Go to Dashboard'}
            </Button>
          </div>
        )

      case 'error':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="text-red-500 mb-6"
            >
              <XCircle className="w-16 h-16 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              {language === 'ar' ? 'فشل في التحقق' : 'Verification Failed'}
            </h2>
            <p className="text-red-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/verify-email-notice')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {language === 'ar'
                  ? 'إعادة إرسال رسالة التحقق'
                  : 'Resend Verification Email'}
              </Button>
              <Link
                href="/login"
                className="block text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </Link>
            </div>
          </div>
        )
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-6 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <motion.div
        className="max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
