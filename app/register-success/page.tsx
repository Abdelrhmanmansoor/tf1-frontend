'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Mail,
  RefreshCw,
} from 'lucide-react'

export default function RegisterSuccessPage() {
  const { language } = useLanguage()
  const [showConfetti, setShowConfetti] = useState(false)
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleResendVerification = async () => {
    if (!email) {
      setResendError(
        language === 'ar'
          ? 'يرجى إدخال بريدك الإلكتروني'
          : 'Please enter your email'
      )
      return
    }

    setIsResending(true)
    setResendError('')
    setResendMessage('')

    try {
      // Mock resend - NO BACKEND
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setResendMessage(
        language === 'ar'
          ? 'تم إرسال رسالة التحقق بنجاح'
          : 'Verification email sent successfully'
      )
    } catch (error: any) {
      setResendError(
        error.message ||
          (language === 'ar' ? 'فشل في إرسال البريد' : 'Failed to send email')
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Brand Gradient Background */}
      <div className="fixed inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
              'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
              'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Subtle animated circles */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-white/40 rounded-full"
              style={{
                width: 80 + i * 30,
                height: 80 + i * 30,
                left: `${10 + i * 15}%`,
                top: `${15 + i * 12}%`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? '#3B82F6' : '#10B981',
                left: `${Math.random() * 100}%`,
                top: '-10px',
              }}
              initial={{ y: -10, x: 0 }}
              animate={{
                y: window.innerHeight + 10,
                x: (Math.random() - 0.5) * 200,
                rotate: [0, 360],
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: Math.random() * 2,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-30 min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="text-center text-white max-w-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', duration: 1, delay: 0.2 }}
        >
          {/* Success Icon */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1, delay: 0.5 }}
          >
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
              <CheckCircle className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-white relative z-10" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
              {language === 'ar'
                ? 'مرحباً بك في SportX!'
                : 'Welcome to SportX!'}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6">
              {language === 'ar'
                ? 'تم إنشاء حسابك بنجاح'
                : 'Your account has been created successfully'}
            </p>

            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-white/80 leading-relaxed">
                {language === 'ar'
                  ? 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول والبدء في استكشاف الفرص الرياضية المتاحة.'
                  : 'Your account has been created successfully! You can now sign in and start exploring sports opportunities.'}
              </p>
            </motion.div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {/* Action Buttons */}
            <div className="flex flex-col gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Sparkles className="w-5 h-5" />
                    {language === 'ar' ? 'تسجيل الدخول' : 'Sign In Now'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>

              {/* Resend Verification Section */}
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <h3 className="text-white font-semibold mb-4 text-center">
                  {language === 'ar'
                    ? 'لم تتلق رسالة التحقق؟'
                    : "Didn't receive verification email?"}
                </h3>

                <div className="space-y-4">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'أدخل بريدك الإلكتروني'
                        : 'Enter your email address'
                    }
                    className="h-12 text-lg border-2 focus:border-blue-500 bg-white/90"
                    dir="ltr"
                  />

                  {resendError && (
                    <motion.div
                      className="bg-red-500/20 border border-red-500/30 rounded-lg p-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-red-200 text-sm">{resendError}</p>
                    </motion.div>
                  )}

                  {resendMessage && (
                    <motion.div
                      className="bg-green-500/20 border border-green-500/30 rounded-lg p-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-green-200 text-sm">{resendMessage}</p>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleResendVerification}
                      disabled={isResending || !email}
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResending ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5" />
                          {language === 'ar'
                            ? 'إعادة إرسال رسالة التحقق'
                            : 'Resend Verification Email'}
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
