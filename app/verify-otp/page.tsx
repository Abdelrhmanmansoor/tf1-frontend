/* eslint-disable no-unused-vars */
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Smartphone,
  Shield,
  Zap,
  Clock,
} from 'lucide-react'

interface FireworkParticle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
  gravity: number
}

interface DigitalRain {
  id: string
  x: number
  y: number
  speed: number
  char: string
  opacity: number
}

export default function VerifyOTPPage() {
  const { language } = useLanguage()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [fireworks, setFireworks] = useState<FireworkParticle[]>([])
  const [digitalRain, setDigitalRain] = useState<DigitalRain[]>([])
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Subtle particle effect
  useEffect(() => {
    const chars = '01'
    const createRain = () => {
      const newDrops: DigitalRain[] = []
      for (let i = 0; i < 10; i++) {
        newDrops.push({
          id: i.toString(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * -window.innerHeight,
          speed: Math.random() * 2 + 1,
          char: chars[Math.floor(Math.random() * chars.length)],
          opacity: Math.random() * 0.3 + 0.1,
        })
      }
      setDigitalRain(newDrops)
    }

    createRain()
    const animateRain = () => {
      setDigitalRain((prev) =>
        prev.map((drop) => ({
          ...drop,
          y: drop.y > window.innerHeight ? -50 : drop.y + drop.speed,
          opacity:
            drop.y > window.innerHeight * 0.8
              ? drop.opacity * 0.95
              : drop.opacity,
        }))
      )
    }

    const rainInterval = setInterval(animateRain, 200)
    return () => clearInterval(rainInterval)
  }, [])

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isSuccess) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isSuccess])

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      )
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const createFirework = useCallback((centerX: number, centerY: number) => {
    const colors = ['#3B82F6', '#10B981', '#60A5FA', '#34D399']
    const newParticles: FireworkParticle[] = []

    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30
      const velocity = Math.random() * 5 + 3
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        life: 1,
        gravity: 0.1,
      })
    }

    setFireworks((prev) => [...prev, ...newParticles])
  }, [])

  // Animate fireworks
  useEffect(() => {
    if (fireworks.length > 0) {
      const animateFireworks = () => {
        setFireworks((prev) =>
          prev
            .map((particle) => ({
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vy: particle.vy + particle.gravity,
              life: particle.life - 0.02,
              size: particle.size * 0.99,
            }))
            .filter((particle) => particle.life > 0 && particle.size > 0.5)
        )
      }

      const interval = setInterval(animateFireworks, 16)
      return () => clearInterval(interval)
    }
  }, [fireworks.length])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }

      // Auto-submit when all fields are filled
      if (newOtp.every((digit) => digit !== '') && !isLoading) {
        handleVerifyOtp(newOtp)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async (otpToVerify = otp) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setIsSuccess(true)

    // Create multiple fireworks
    setTimeout(
      () => createFirework(window.innerWidth * 0.2, window.innerHeight * 0.3),
      200
    )
    setTimeout(
      () => createFirework(window.innerWidth * 0.8, window.innerHeight * 0.4),
      400
    )
    setTimeout(
      () => createFirework(window.innerWidth * 0.5, window.innerHeight * 0.2),
      600
    )
    setTimeout(
      () => createFirework(window.innerWidth * 0.3, window.innerHeight * 0.6),
      800
    )
    setTimeout(
      () => createFirework(window.innerWidth * 0.7, window.innerHeight * 0.7),
      1000
    )
  }

  const handleResendOtp = async () => {
    setResendCooldown(30)
    setTimeLeft(120)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isSuccess) {
    return (
      <div
        className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      >
        {/* Success Fireworks */}
        <div className="fixed inset-0 pointer-events-none z-10">
          {fireworks.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.life,
              }}
            />
          ))}
        </div>

        <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
          <motion.div
            className="text-center text-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 1 }}
          >
            <motion.div
              className="text-8xl mb-8"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, ease: 'linear' },
                scale: { duration: 1, repeat: Infinity, repeatType: 'reverse' },
              }}
            >
              ✅
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {language === 'ar'
                ? 'تم التحقق بنجاح!'
                : 'Successfully Verified!'}
            </motion.h1>

            <motion.p
              className="text-xl mb-8 opacity-90"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {language === 'ar' ? 'مرحباً بك في SportX' : 'Welcome to SportX'}
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/">
                <Button className="px-8 py-4 text-lg bg-white text-gray-900 hover:bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  {language === 'ar'
                    ? 'الذهاب للصفحة الرئيسية'
                    : 'Go to Homepage'}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Epic Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Cyber Grid Background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0 0', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Brand Gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 30% 40%, #3B82F6 0%, transparent 50%), radial-gradient(circle at 70% 60%, #10B981 0%, transparent 50%)',
              'radial-gradient(circle at 60% 20%, #10B981 0%, transparent 50%), radial-gradient(circle at 40% 80%, #3B82F6 0%, transparent 50%)',
              'radial-gradient(circle at 30% 40%, #3B82F6 0%, transparent 50%), radial-gradient(circle at 70% 60%, #10B981 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Digital Rain */}
        <div className="absolute inset-0">
          {digitalRain.map((drop) => (
            <div
              key={drop.id}
              className="absolute text-green-400 font-mono font-bold pointer-events-none select-none"
              style={{
                left: drop.x,
                top: drop.y,
                opacity: drop.opacity,
                fontSize: '14px',
                textShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
              }}
            >
              {drop.char}
            </div>
          ))}
        </div>

        {/* Pulsing Orbs */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 filter blur-xl"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + i * 8}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10 relative overflow-hidden">
            {/* Loading Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full mx-auto mb-4"
                    />
                    <p className="text-lg font-medium text-gray-700">
                      {language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="text-5xl sm:text-6xl lg:text-7xl mb-6"
                animate={{
                  rotateY: [0, 180, 360],
                  scale: [1, 1.1, 1],
                  filter: [
                    'hue-rotate(0deg)',
                    'hue-rotate(180deg)',
                    'hue-rotate(360deg)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                📱
              </motion.div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {language === 'ar' ? 'تحقق من الهاتف' : 'Verify Your Phone'}
              </h1>

              <p className="text-gray-600 leading-relaxed mb-2">
                {language === 'ar'
                  ? 'أدخل الرمز المرسل إلى هاتفك'
                  : 'Enter the code sent to your phone'}
              </p>

              <motion.div
                className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-4 py-2"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <Smartphone className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  +966 5**** 1234
                </span>
              </motion.div>
            </div>

            {/* Timer Display */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className={`inline-flex items-center px-6 py-3 rounded-2xl font-mono text-lg font-bold ${
                  timeLeft > 60
                    ? 'bg-green-100 text-green-700 border-2 border-green-200'
                    : timeLeft > 30
                      ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                      : 'bg-red-100 text-red-700 border-2 border-red-200'
                }`}
              >
                <Clock className="w-5 h-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
            </motion.div>

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-8">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotateY: -90 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: 'spring',
                    duration: 0.8,
                  }}
                >
                  <Input
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl transition-all duration-300 ${
                      digit
                        ? 'border-green-400 bg-green-50 text-green-700 shadow-lg shadow-green-200/50'
                        : 'border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  />
                </motion.div>
              ))}
            </div>

            {/* Verify Button */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={() => handleVerifyOtp()}
                disabled={otp.some((digit) => !digit) || isLoading}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 hover:from-blue-600 hover:via-blue-700 hover:to-green-600 transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <Shield className="w-5 h-5" />
                  {language === 'ar' ? 'تحقق من الرمز' : 'Verify Code'}
                  <Zap className="w-5 h-5" />
                </div>
              </Button>
            </motion.div>

            {/* Resend Button */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || timeLeft > 90}
                className="text-blue-600 hover:text-blue-500 hover:bg-blue-50 disabled:opacity-50 p-0 h-auto font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {resendCooldown > 0
                  ? `${language === 'ar' ? 'إعادة الإرسال خلال' : 'Resend in'} ${resendCooldown}s`
                  : language === 'ar'
                    ? 'إعادة إرسال الرمز'
                    : 'Resend Code'}
              </Button>
            </motion.div>

            {/* Security Note */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 mb-6 border border-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-center text-blue-700">
                <Shield className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  {language === 'ar'
                    ? 'لا تشارك هذا الرمز مع أي شخص للحفاظ على أمان حسابك'
                    : "Don't share this code with anyone to keep your account secure"}
                </p>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <Link
                href="/register"
                className="inline-flex items-center text-gray-600 hover:text-gray-500 font-medium transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                {language === 'ar' ? 'العودة للتسجيل' : 'Back to Registration'}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
