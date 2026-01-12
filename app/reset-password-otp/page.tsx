'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { authService } from '@/services/auth'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Phone,
} from 'lucide-react'

export default function ResetPasswordOTPPage() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get params from URL
  const phoneParam = searchParams.get('phone') || ''
  const channelParam = searchParams.get('channel') || 'sms'
  
  const [step, setStep] = useState<'otp' | 'password'>('otp')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isSuccess && step === 'otp') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isSuccess, step])

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }

      // Auto-verify when all fields are filled
      if (newOtp.every((digit) => digit !== '')) {
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
    setError('')

    try {
      const otpCode = otpToVerify.join('')
      const result = await authService.verifyOTP(
        phoneParam,
        otpCode,
        'password-reset'
      )

      if (result.success) {
        // Move to password step
        setStep('password')
      } else {
        setError(language === 'ar' ? result.messageAr : result.message)
      }
    } catch (err: any) {
      setError(err.message || (language === 'ar' ? 'فشل التحقق من الرمز' : 'OTP verification failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError(language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError(language === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const otpCode = otp.join('')
      const result = await authService.resetPasswordOTP(phoneParam, otpCode, newPassword)

      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/login?reset=true')
        }, 3000)
      } else {
        setError(language === 'ar' ? result.messageAr : result.message)
      }
    } catch (err: any) {
      setError(err.message || (language === 'ar' ? 'فشل تغيير كلمة المرور' : 'Password reset failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    
    setError('')
    
    try {
      const result = await authService.forgotPasswordOTP(phoneParam, channelParam)

      if (result.success) {
        setResendCooldown(60)
        setTimeLeft(300)
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        if (result.waitTime) {
          setResendCooldown(result.waitTime)
        }
        setError(language === 'ar' ? result.messageAr : result.message)
      }
    } catch (err: any) {
      setError(err.message || (language === 'ar' ? 'فشل إعادة إرسال الرمز' : 'Failed to resend OTP'))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isSuccess) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-6 ${language === 'ar' ? 'font-arabic' : 'font-english'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <motion.div
          className="text-center text-white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 1 }}
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">
            {language === 'ar' ? 'تم تغيير كلمة المرور!' : 'Password Changed!'}
          </h1>
          <p className="text-xl opacity-90 mb-8">
            {language === 'ar'
              ? 'سيتم تحويلك لتسجيل الدخول...'
              : 'Redirecting to login...'}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-6 ${language === 'ar' ? 'font-arabic' : 'font-english'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Back Link */}
        <Link href="/forgot-password" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'ar' ? 'العودة' : 'Back'}</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 'otp' ? (
              <Phone className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'otp'
              ? (language === 'ar' ? 'أدخل رمز التحقق' : 'Enter OTP Code')
              : (language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password')}
          </h1>
          <p className="text-gray-600">
            {step === 'otp'
              ? (language === 'ar'
                  ? `تم إرسال رمز التحقق إلى ${phoneParam.substring(0, 6)}****`
                  : `OTP sent to ${phoneParam.substring(0, 6)}****`)
              : (language === 'ar'
                  ? 'أدخل كلمة المرور الجديدة'
                  : 'Enter your new password')}
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-600 text-sm text-center">{error}</p>
          </motion.div>
        )}

        {step === 'otp' ? (
          <>
            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-6" dir="ltr">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-blue-500"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <p className="text-gray-500 text-sm">
                {language === 'ar' ? 'ينتهي خلال' : 'Expires in'}{' '}
                <span className="font-bold text-blue-600">{formatTime(timeLeft)}</span>
              </p>
            </div>

            {/* Verify Button */}
            <Button
              onClick={() => handleVerifyOtp()}
              disabled={isLoading || otp.some(d => !d)}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                language === 'ar' ? 'تحقق' : 'Verify'
              )}
            </Button>

            {/* Resend */}
            <div className="text-center mt-4">
              <button
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline text-sm"
              >
                {resendCooldown > 0
                  ? `${language === 'ar' ? 'إعادة الإرسال بعد' : 'Resend in'} ${resendCooldown}s`
                  : (language === 'ar' ? 'إعادة إرسال الرمز' : 'Resend OTP')}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Password Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-14 pl-12 pr-12 border-2 rounded-xl"
                    dir="ltr"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-14 pl-12 border-2 rounded-xl"
                    dir="ltr"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>{language === 'ar' ? 'كلمة المرور يجب أن تحتوي على:' : 'Password must contain:'}</span>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-gray-500">
                <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                  • {language === 'ar' ? '8 أحرف على الأقل' : 'At least 8 characters'}
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                  • {language === 'ar' ? 'حرف كبير' : 'Uppercase letter'}
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                  • {language === 'ar' ? 'حرف صغير' : 'Lowercase letter'}
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                  • {language === 'ar' ? 'رقم' : 'Number'}
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleResetPassword}
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                language === 'ar' ? 'تغيير كلمة المرور' : 'Reset Password'
              )}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
