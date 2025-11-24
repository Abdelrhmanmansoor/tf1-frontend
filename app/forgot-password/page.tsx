'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
  Sparkles,
  Clock,
  Shield,
  RefreshCw,
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

export default function ForgotPasswordPage() {
  const { language } = useLanguage()
  const [step, setStep] = useState(1) // 1: Email input, 2: Email sent confirmation
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [magicOrbs, setMagicOrbs] = useState<MagicOrb[]>([])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes countdown
  const containerRef = useRef<HTMLDivElement>(null)

  // Magic orbs animation
  useEffect(() => {
    const colors = ['#3B82F6', '#10B981', '#60A5FA', '#34D399']

    const createOrbs = () => {
      const newOrbs: MagicOrb[] = []
      for (let i = 0; i < 15; i++) {
        newOrbs.push({
          id: i.toString(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
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
            y: newY < -100 ? window.innerHeight + 100 : newY,
            x: orb.x + Math.sin(orb.y * 0.01) * 2,
          }
        })
      )
    }

    const interval = setInterval(animateOrbs, 50)
    return () => clearInterval(interval)
  }, [])

  // Countdown timer
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, step])

  const handleSendEmail = async () => {
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      // Call forgot password API
      await authService.forgotPassword(email)
      setMessage(
        language === 'ar'
          ? 'تم إرسال رسالة إعادة التعيين'
          : 'Password reset email sent'
      )
      setStep(2)
      setTimeLeft(300) // Reset timer
    } catch (error: any) {
      setError(
        error.message ||
          (language === 'ar' ? 'فشل في إرسال البريد' : 'Failed to send email')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Call forgot password API again
      await authService.forgotPassword(email)
      setMessage(
        language === 'ar'
          ? 'تم إعادة إرسال الرسالة'
          : 'Email resent successfully'
      )
      setTimeLeft(300) // Reset timer
    } catch (error: any) {
      setError(
        error.message ||
          (language === 'ar'
            ? 'فشل في إعادة الإرسال'
            : 'Failed to resend email')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const mouseX = useSpring(0, { stiffness: 300, damping: 30 })
  const mouseY = useSpring(0, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

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
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-10"
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -50, rotateX: 10 }}
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
                      rotateY: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                      },
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
                      ? 'نسيت كلمة المرور؟'
                      : 'Forgot Password?'}
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    {language === 'ar'
                      ? 'لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور'
                      : "Don't worry! Enter your email address and we'll send you a password reset link"}
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

                {/* Email Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendEmail()
                  }}
                >
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Mail className="w-4 h-4 inline mr-2" />
                      {language === 'ar'
                        ? 'البريد الإلكتروني'
                        : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          language === 'ar'
                            ? 'أدخل بريدك الإلكتروني'
                            : 'Enter your email address'
                        }
                        className="h-14 text-lg border-2 focus:border-purple-500 transition-all duration-300 rounded-xl pl-12"
                        dir="ltr"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading || !email}
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
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                            {language === 'ar'
                              ? 'إرسال الرابط'
                              : 'Send Reset Link'}
                            <Sparkles className="w-5 h-5" />
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </form>

                {/* Back to Login */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors duration-300 group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    {language === 'ar'
                      ? 'العودة لتسجيل الدخول'
                      : 'Back to Sign In'}
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-10"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 1.1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {/* Success Header */}
                <div className="text-center mb-8">
                  <motion.div
                    className="text-5xl sm:text-6xl lg:text-7xl mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 1, delay: 0.2 }}
                  >
                    📧
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      {language === 'ar' ? 'تم إرسال الإيميل!' : 'Email Sent!'}
                    </h1>
                    <p className="text-gray-600 leading-relaxed">
                      {message ? (
                        <span className="text-green-600">{message}</span>
                      ) : (
                        <>
                          {language === 'ar'
                            ? `تم إرسال رابط إعادة تعيين كلمة المرور إلى`
                            : `A password reset link has been sent to`}
                          <br />
                          <strong className="text-purple-600">{email}</strong>
                        </>
                      )}
                    </p>
                  </motion.div>
                </div>

                {/* Timer and Instructions */}
                <motion.div
                  className="space-y-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-purple-600 mr-2" />
                      <span className="text-lg font-semibold text-purple-800">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <p className="text-purple-700 text-center text-sm">
                      {language === 'ar'
                        ? 'الرابط صالح لمدة 5 دقائق'
                        : 'Link expires in 5 minutes'}
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center text-gray-600">
                      <Shield className="w-5 h-5 mr-2" />
                      <span className="text-sm">
                        {language === 'ar'
                          ? 'تحقق من صندوق البريد والرسائل المرفوضة'
                          : 'Check your inbox and spam folder'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Error Display for Step 2 */}
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

                {/* Action Buttons */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={handleResendEmail}
                    disabled={isLoading || timeLeft > 240} // Allow resend after 1 minute
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 rounded-xl disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'إعادة الإرسال' : 'Resend Email'}
                    {timeLeft > 240 && (
                      <span className="ml-2 text-sm opacity-75">
                        ({Math.floor((240 - (300 - timeLeft)) / 60) + 1}m)
                      </span>
                    )}
                  </Button>

                  <div className="space-y-3">
                    <Link href="/reset-password">
                      <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 rounded-xl">
                        <Shield className="w-4 h-4 mr-2" />
                        {language === 'ar'
                          ? 'إعادة تعيين كلمة المرور'
                          : 'Reset Password Now'}
                      </Button>
                    </Link>

                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full h-12 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 rounded-xl"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {language === 'ar'
                          ? 'العودة لتسجيل الدخول'
                          : 'Back to Sign In'}
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                {/* Help Text */}
                <motion.div
                  className="mt-6 pt-6 border-t border-gray-200 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className="text-sm text-gray-500">
                    {language === 'ar'
                      ? 'لم تستلم الإيميل؟ تأكد من صحة عنوان البريد الإلكتروني'
                      : "Didn't receive the email? Double-check your email address"}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating Action Button (Hidden gem) */}
      <motion.div
        className="fixed bottom-8 right-8 z-30"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, type: 'spring', duration: 1 }}
      >
        <motion.button
          className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white"
          whileHover={{ scale: 1.1, rotateZ: 10 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -10, 0],
            boxShadow: [
              '0 10px 30px rgba(0,0,0,0.1)',
              '0 15px 40px rgba(0,0,0,0.2)',
              '0 10px 30px rgba(0,0,0,0.1)',
            ],
          }}
          transition={{
            y: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
            boxShadow: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
          }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </div>
  )
}
