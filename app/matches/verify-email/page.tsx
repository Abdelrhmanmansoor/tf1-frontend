'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { verifyEmail, resendVerificationEmail } from '@/services/matches'

function VerifyEmailContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const hasVerified = useRef(false)

  useEffect(() => {
    // Only run ONCE - prevent all retries
    if (hasVerified.current) {
      console.log('[MATCHES VERIFY] Already called API, skipping')
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

    // Set flag BEFORE API call - prevents all retries
    hasVerified.current = true
    console.log('[MATCHES VERIFY] Calling API ONCE with token:', token.substring(0, 10) + '...')

    // Call the matches verify email API
    verifyEmail(token)
      .then((data) => {
        console.log('[MATCHES VERIFY] Response received:', data)
        
        if (data.success) {
          setStatus('success')
          setMessage(data.message || (language === 'ar' ? 'تم تأكيد البريد الإلكتروني بنجاح!' : 'Email verified successfully!'))
          
          // Redirect to dashboard after success (token is already stored by verifyEmail service)
          setTimeout(() => {
            router.push('/matches/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage(data.message || (language === 'ar' ? 'فشل التحقق' : 'Verification failed'))
        }
      })
      .catch((error: any) => {
        console.error('[MATCHES VERIFY] Error:', error)
        setStatus('error')
        
        const errorMsg = error.response?.data?.message || error.message || ''
        
        // ترجمة رسائل الخطأ
        if (language === 'ar') {
          if (errorMsg.includes('invalid') || errorMsg.includes('expired') || errorMsg.includes('Token not found')) {
            setMessage('رابط التحقق غير صالح أو تم استخدامه مسبقاً. إذا قمت بتأكيد حسابك، يرجى تسجيل الدخول.')
            setStatus('error') // Or create a new status 'warning' if needed
          } else {
            setMessage('فشل التحقق. يرجى المحاولة مرة أخرى.')
          }
        } else {
          if (errorMsg.includes('invalid') || errorMsg.includes('expired')) {
            setMessage('Invalid or expired verification link. If you have already verified your account, please log in.')
          } else {
            setMessage('Verification failed. Please try again.')
          }
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Show login button if verification might have already happened
  const showLoginButton = message.includes('مسبقاً') || message.includes('already verified') || message.includes('log in');

  const handleResendVerification = async () => {
    if (!email) {
      setMessage(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email')
      return
    }
    
    setResending(true)
    setResendSuccess(false)
    
    try {
      await resendVerificationEmail(email)
      setResendSuccess(true)
      setMessage(language === 'ar' ? 'تم إرسال رابط التحقق إلى بريدك الإلكتروني' : 'Verification email sent successfully')
    } catch (error: any) {
      setMessage(language === 'ar' ? 'فشل إرسال رابط التحقق' : 'Failed to send verification email')
    } finally {
      setResending(false)
    }
  }

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
            <p className="text-sm text-green-600 mb-4">
              {language === 'ar'
                ? 'سيتم توجيهك لصفحة تسجيل الدخول...'
                : 'Redirecting to login page...'}
            </p>
            <Button
              onClick={() => router.push('/matches/login')}
              className="bg-green-600 hover:bg-green-700"
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Go to Login'}
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
            
            {/* نموذج إعادة إرسال رابط التحقق */}
            {showLoginButton ? (
              <Button
                onClick={() => router.push('/matches/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Button>
            ) : (
              !resendSuccess && (
                <div className="space-y-4 mb-6">
                  <p className="text-sm text-gray-600">
                    {language === 'ar' 
                      ? 'أدخل بريدك الإلكتروني لإرسال رابط تحقق جديد:'
                      : 'Enter your email to receive a new verification link:'}
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dir="ltr"
                  />
                  <Button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                      </>
                    ) : (
                      language === 'ar' ? 'إرسال رابط جديد' : 'Send New Link'
                    )}
                  </Button>
                </div>
              )
            )}
            
            {resendSuccess && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                <p className="text-green-800 text-sm">{message}</p>
              </div>
            )}
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
              </Button>
            </Link>
            </div>
            )}

            {/* رسالة نجاح إعادة الإرسال */}
            {resendSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span>
                    {language === 'ar'
                      ? 'تم إرسال رابط التحقق! تحقق من بريدك الإلكتروني.'
                      : 'Verification email sent! Check your inbox.'}
                  </span>
                </div>
              </div>
            )}

            <Link
              href="/matches/login"
              className="block text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </Link>
          </div>
        )
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 p-6"
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

export default function MatchesVerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
