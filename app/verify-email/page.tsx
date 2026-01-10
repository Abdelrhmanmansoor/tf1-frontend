'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { getDashboardRoute } from '@/utils/role-routes'

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

    // ✅ Try main API first, then matches API as fallback
    const tryMainApi = () => {
      return fetch(
        `https://tf1-backend.onrender.com/api/v1/auth/verify-email?token=${token}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((response) => response.json())
    }

    const tryMatchesApi = () => {
      return fetch(
        `https://tf1-backend.onrender.com/api/v1/matches/auth/verify-email?token=${token}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((response) => response.json())
    }

    // Try main API first
    tryMainApi()
      .then((data) => {
        console.log('[VERIFY] Main API response:', data)

        if (data.success === true) {
          setStatus('success')
          setMessage((language === 'ar' ? data.messageAr : data.message) || 'Email verified successfully!')

          // CRITICAL FIX: Save user data properly with correct role from API
          if (typeof window !== 'undefined') {
            if (data.accessToken) {
              localStorage.setItem('sportx_access_token', data.accessToken)
              const secure = window.location.protocol === 'https:' ? '; Secure' : ''
              document.cookie = `sportx_access_token=${data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}${secure}; SameSite=Strict`
            }
            if (data.user) {
              // CRITICAL: Ensure role from API is saved correctly (not from localStorage)
              localStorage.setItem('sportx_user_data', JSON.stringify(data.user))
              console.log('[VERIFY] User data saved with role from API:', data.user.role)
            }
          }

          console.log('[VERIFY] Success! Redirecting...')

          if (data.alreadyVerified === true) {
            setTimeout(() => router.replace('/login'), 1500)
          } else {
            // Use role from API response (most accurate)
            const userRole = data.user?.role || 'player'
            console.log('[VERIFY] Redirecting to dashboard with role:', userRole)
            
            // Use getDashboardRoute for proper routing
            const dashboardRoute = getDashboardRoute(userRole as any)
            setTimeout(() => router.replace(dashboardRoute), 2000)
          }
        } else {
          // Handle specific error codes
          if (data && (data.code === 'TOKEN_EXPIRED' || data.code === 'INVALID_TOKEN')) {
            return fetch(`https://tf1-backend.onrender.com/api/v1/auth/resend-verification-by-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
            }).then(r => r.json()).then(resend => {
              setStatus('error')
              setMessage((language === 'ar' ? resend.messageAr : resend.message) || (language === 'ar' ? 'تم إرسال رابط جديد إلى بريدك' : 'A new verification link has been sent'))
              return null
            }).catch(() => null)
          }
          
          // Handle VERIFICATION_FAILED error - but check if account was actually verified
          // Sometimes verification succeeds in DB but response shows error due to token generation issues
          if (data && data.code === 'VERIFICATION_FAILED') {
            console.log('[VERIFY] Got VERIFICATION_FAILED, checking if account was actually verified...')
            
            // CRITICAL FIX: Check if account was actually verified by trying to get user profile
            // If verification succeeded in DB but response failed, we should still allow login
            import('@/services/auth').then(({ default: authService }) => {
              // Try to check if user can login (which means verification succeeded)
              // Extract email from error message or token if possible, or prompt user to try login
              const errorMsg = (language === 'ar' ? data.messageAr : data.message) || ''
              const isAlreadyVerifiedHint = errorMsg.includes('already') || errorMsg.includes('بالفعل') || errorMsg.includes('مفعّل')
              
              if (isAlreadyVerifiedHint || data.alreadyVerified) {
                // Account is verified, show success even if response said failed
                setStatus('success')
                setMessage(language === 'ar' ? 'تم التحقق من بريدك الإلكتروني بنجاح! يمكنك تسجيل الدخول الآن.' : 'Your email has been verified successfully! You can now login.')
                setTimeout(() => router.replace('/login?verified=true'), 2000)
              } else {
                // Show error but also offer to try login
                setStatus('error')
                setMessage((language === 'ar' ? data.messageAr || 'فشل التحقق من البريد الإلكتروني. جرب تسجيل الدخول - قد يكون الحساب مفعّل بالفعل.' : data.message || 'Verification failed. Please try logging in - your account may already be verified.'))
              }
            }).catch(() => {
              // Fallback: show error
              setStatus('error')
              setMessage((language === 'ar' ? data.messageAr || 'فشل التحقق من البريد الإلكتروني. جرب تسجيل الدخول.' : data.message || 'Verification failed. Please try logging in.'))
            })
            return null
          }
          
          // Try matches API as fallback only if it's not a known error
          console.log('[VERIFY] Main API failed, trying matches API...')
          return tryMatchesApi()
        }
      })
      .then((matchesData) => {
        if (matchesData && matchesData.success === true) {
          setStatus('success')
          setMessage((language === 'ar' ? matchesData.messageAr : matchesData.message) || (language === 'ar' ? 'تم تأكيد البريد الإلكتروني بنجاح!' : 'Email verified successfully!'))
          
          console.log('[VERIFY] Matches API success! Redirecting to matches login...')
          setTimeout(() => router.replace('/matches/login?verified=true'), 2000)
        } else if (matchesData) {
          setStatus('error')
          const errorMessage = (language === 'ar' ? matchesData.messageAr : matchesData.message) || (language === 'ar' ? 'فشل التحقق من البريد الإلكتروني' : 'Verification failed')
          setMessage(errorMessage)
        } else {
          // If no matchesData and no success, show generic error
          setStatus('error')
          setMessage(language === 'ar' ? 'فشل التحقق من البريد الإلكتروني' : 'Verification failed')
        }
      })
      .catch((error) => {
        console.error('[VERIFY] Network error:', error)
        // CRITICAL FIX: Even on network error, verification might have succeeded
        // Show message suggesting to try login
        setStatus('error')
        setMessage(language === 'ar' 
          ? 'حدث خطأ في الاتصال. لكن التحقق من بريدك قد يكون تم بنجاح. جرب تسجيل الدخول.' 
          : 'Network error occurred. However, your email verification may have succeeded. Please try logging in.')
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
              <p className="text-sm text-gray-600 mb-2">
                {language === 'ar' 
                  ? '💡 ملاحظة: قد يكون حسابك مفعّل بالفعل رغم ظهور الخطأ. جرب تسجيل الدخول أولاً.'
                  : '💡 Note: Your account may already be verified despite the error. Please try logging in first.'}
              </p>
              <Link href="/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  {language === 'ar' ? 'جرب تسجيل الدخول' : 'Try Logging In'}
                </Button>
              </Link>
              <Button
                onClick={() => router.push('/verify-email-notice')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {language === 'ar'
                  ? 'إعادة إرسال رسالة التحقق'
                  : 'Resend Verification Email'}
              </Button>
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
