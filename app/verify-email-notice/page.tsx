'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'

function VerifyEmailNoticeContent() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Pre-fill email from URL parameters if available
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleResendVerification = async () => {
    if (!email) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال بريدك الإلكتروني'
          : 'Please enter your email'
      )
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        `https://tf1-backend.onrender.com/api/v1/auth/resend-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      ).then((r) => r.json())
      setMessage(
        response.message ||
          (language === 'ar'
            ? 'تم إرسال رسالة التحقق'
            : 'Verification email sent')
      )
    } catch (error: any) {
      setError(
        error.message ||
          (language === 'ar' ? 'فشل في إرسال البريد' : 'Failed to send email')
      )
    } finally {
      setIsLoading(false)
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <motion.div
            className="text-6xl mb-6"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            📧
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {language === 'ar'
              ? 'تحقق من بريدك الإلكتروني'
              : 'Check Your Email'}
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {language === 'ar'
              ? 'تم إرسال رسالة تحقق إلى بريدك الإلكتروني. يرجى النقر على الرابط في الرسالة لتفعيل حسابك.'
              : "We've sent a verification email to your inbox. Please click the link in the email to activate your account."}
          </p>

          <div className="space-y-4 mb-6">
            <div className="text-sm text-gray-500">
              {language === 'ar'
                ? 'لم تتلق الرسالة؟ أدخل بريدك الإلكتروني لإعادة الإرسال:'
                : "Didn't receive the email? Enter your email to resend:"}
            </div>

            <div className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'أدخل بريدك الإلكتروني'
                    : 'Enter your email'
                }
                className="h-12 text-lg border-2 focus:border-blue-500"
                dir="ltr"
              />

              {error && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-xl p-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              {message && (
                <motion.div
                  className="bg-green-50 border border-green-200 rounded-xl p-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-green-600 text-sm">{message}</p>
                </motion.div>
              )}

              <Button
                onClick={handleResendVerification}
                disabled={isLoading || !email}
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'إعادة الإرسال' : 'Resend Email'}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-500">
            <p>
              {language === 'ar'
                ? '• تحقق من مجلد البريد المهمل أو الرسائل الإعلانية'
                : '• Check your spam or promotions folder'}
            </p>
            <p>
              {language === 'ar'
                ? '• قد تستغرق الرسالة بضع دقائق للوصول'
                : '• The email may take a few minutes to arrive'}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/login"
              className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailNoticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailNoticeContent />
    </Suspense>
  )
}
