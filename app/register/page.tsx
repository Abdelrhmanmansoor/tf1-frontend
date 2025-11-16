'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSelector } from '@/components/language-selector'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Building2,
  ChevronDown,
  Check,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'

export default function RegisterPage() {
  const { language } = useLanguage()
  const { register } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'player' as 'player' | 'coach' | 'club' | 'specialist',
    firstName: '',
    lastName: '',
    phone: '',
    // Club-specific fields
    organizationName: '',
    representativeName: '',
    organizationType: 'club' as
      | 'club'
      | 'academy'
      | 'federation'
      | 'sports-center',
    establishedDate: '',
    businessRegistrationNumber: '',
  })

  const [countryCode, setCountryCode] = useState('+966') // Default to Saudi Arabia
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')

  // Middle East and other country codes
  const countryCodes = [
    // Gulf Countries (GCC)
    {
      code: '+966',
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      format: '9 digits',
      example: '501 234 567',
    },
    {
      code: '+971',
      country: 'UAE',
      flag: '🇦🇪',
      format: '9 digits',
      example: '501 234 567',
    },
    {
      code: '+965',
      country: 'Kuwait',
      flag: '🇰🇼',
      format: '8 digits',
      example: '501 23456',
    },
    {
      code: '+974',
      country: 'Qatar',
      flag: '🇶🇦',
      format: '8 digits',
      example: '501 23456',
    },
    {
      code: '+973',
      country: 'Bahrain',
      flag: '🇧🇭',
      format: '8 digits',
      example: '501 23456',
    },
    {
      code: '+968',
      country: 'Oman',
      flag: '🇴🇲',
      format: '8 digits',
      example: '501 23456',
    },
    // Levant
    {
      code: '+962',
      country: 'Jordan',
      flag: '🇯🇴',
      format: '9 digits',
      example: '790 123 456',
    },
    {
      code: '+961',
      country: 'Lebanon',
      flag: '🇱🇧',
      format: '8 digits',
      example: '701 23456',
    },
    {
      code: '+963',
      country: 'Syria',
      flag: '🇸🇾',
      format: '9 digits',
      example: '911 234 567',
    },
    {
      code: '+970',
      country: 'Palestine',
      flag: '🇵🇸',
      format: '9 digits',
      example: '599 123 456',
    },
    // North Africa
    {
      code: '+20',
      country: 'Egypt',
      flag: '🇪🇬',
      format: '10 digits',
      example: '100 234 5678',
    },
    {
      code: '+212',
      country: 'Morocco',
      flag: '🇲🇦',
      format: '9 digits',
      example: '612 345 678',
    },
    {
      code: '+213',
      country: 'Algeria',
      flag: '🇩🇿',
      format: '9 digits',
      example: '551 234 567',
    },
    {
      code: '+216',
      country: 'Tunisia',
      flag: '🇹🇳',
      format: '8 digits',
      example: '20 123 456',
    },
    {
      code: '+218',
      country: 'Libya',
      flag: '🇱🇾',
      format: '9 digits',
      example: '912 345 678',
    },
    {
      code: '+222',
      country: 'Mauritania',
      flag: '🇲🇷',
      format: '8 digits',
      example: '22 123 456',
    },
    {
      code: '+249',
      country: 'Sudan',
      flag: '🇸🇩',
      format: '9 digits',
      example: '912 345 678',
    },
    // Other Middle East
    {
      code: '+964',
      country: 'Iraq',
      flag: '🇮🇶',
      format: '10 digits',
      example: '771 234 5678',
    },
    {
      code: '+967',
      country: 'Yemen',
      flag: '🇾🇪',
      format: '9 digits',
      example: '712 345 678',
    },
    {
      code: '+98',
      country: 'Iran',
      flag: '🇮🇷',
      format: '10 digits',
      example: '912 345 6789',
    },
    {
      code: '+90',
      country: 'Turkey',
      flag: '🇹🇷',
      format: '10 digits',
      example: '532 123 4567',
    },
    // East Africa (Arabic speaking)
    {
      code: '+253',
      country: 'Djibouti',
      flag: '🇩🇯',
      format: '8 digits',
      example: '77 123 456',
    },
    {
      code: '+252',
      country: 'Somalia',
      flag: '🇸🇴',
      format: '8 digits',
      example: '61 234 567',
    },
    {
      code: '+269',
      country: 'Comoros',
      flag: '🇰🇲',
      format: '7 digits',
      example: '321 2345',
    },
  ]

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<
    Array<{ field: string; message: string }>
  >([])
  const [success, setSuccess] = useState(false)

  // Custom dropdown states
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [orgTypeDropdownOpen, setOrgTypeDropdownOpen] = useState(false)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    label: string
    color: string
  }>({ score: 0, label: '', color: '' })

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let score = 0
    if (!password) {
      return {
        score: 0,
        label: '',
        color: '',
      }
    }

    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1

    // Contains lowercase
    if (/[a-z]/.test(password)) score += 1

    // Contains uppercase
    if (/[A-Z]/.test(password)) score += 1

    // Contains numbers
    if (/\d/.test(password)) score += 1

    // Contains special characters
    if (/[^a-zA-Z\d]/.test(password)) score += 1

    // Determine label and color
    if (score <= 2) {
      return {
        score,
        label: language === 'ar' ? 'ضعيف' : 'Weak',
        color: 'bg-red-500',
      }
    } else if (score <= 4) {
      return {
        score,
        label: language === 'ar' ? 'متوسط' : 'Medium',
        color: 'bg-yellow-500',
      }
    } else {
      return {
        score,
        label: language === 'ar' ? 'قوي' : 'Strong',
        color: 'bg-green-500',
      }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // Check if password field
    if (name === 'password') {
      const strength = calculatePasswordStrength(value)
      setPasswordStrength(strength)
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Validate and format phone number
  const validatePhone = (number: string): boolean => {
    // Remove all non-numeric characters except +
    const cleaned = number.replace(/[^\d+]/g, '')

    // Must start with + and have at least 8 digits
    if (!cleaned.startsWith('+') || cleaned.length < 9) {
      return false
    }

    // Check specific formats based on country code
    const selectedCountry = countryCodes.find((c) => cleaned.startsWith(c.code))
    if (selectedCountry) {
      const numberPart = cleaned.substring(selectedCountry.code.length)
      const expectedLength = parseInt(selectedCountry.format.split(' ')[0])
      return numberPart.length === expectedLength
    }

    // Generic validation: between 8-15 digits after country code
    const totalDigits = cleaned.replace(/\D/g, '').length
    return totalDigits >= 8 && totalDigits <= 15
  }

  const formatPhoneNumber = (value: string, code: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')

    // Format based on country
    const selectedCountry = countryCodes.find((c) => c.code === code)
    const expectedLength = selectedCountry
      ? parseInt(selectedCountry.format.split(' ')[0])
      : 10

    // Auto-format with spaces for readability
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`
    if (numbers.length <= expectedLength) {
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`
    }
    // Limit to expected length
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, expectedLength)}`
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    // Check if user pasted a full phone number with country code
    if (input.startsWith('+')) {
      // Extract country code and number
      const matchedCountry = countryCodes.find((c) => input.startsWith(c.code))
      if (matchedCountry) {
        setCountryCode(matchedCountry.code)
        const numberPart = input.substring(matchedCountry.code.length)
        const formatted = formatPhoneNumber(numberPart, matchedCountry.code)
        setPhoneNumber(formatted)
        setPhoneError('')

        const fullPhone = matchedCountry.code + formatted.replace(/\D/g, '')
        setFormData({
          ...formData,
          phone: fullPhone,
        })
        return
      }
    }

    // Format as user types
    const formatted = formatPhoneNumber(input, countryCode)
    setPhoneNumber(formatted)
    setPhoneError('')

    // Update formData with full phone number
    const fullPhone = countryCode + formatted.replace(/\D/g, '')
    setFormData({
      ...formData,
      phone: fullPhone,
    })
  }

  const handlePhoneBlur = () => {
    if (phoneNumber.trim() === '') {
      setPhoneError(
        language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required'
      )
      return
    }

    const fullPhone = countryCode + phoneNumber.replace(/[\s\-()]/g, '')
    if (!validatePhone(fullPhone)) {
      const selectedCountry = countryCodes.find((c) => c.code === countryCode)
      setPhoneError(
        language === 'ar'
          ? `يجب أن يحتوي الرقم على ${selectedCountry?.format || '8-15 رقم'}`
          : `Number must contain ${selectedCountry?.format || '8-15 digits'}`
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)
    setValidationErrors([])
    setPhoneError('')
    setLoading(true)

    // Client-side phone validation
    if (!phoneNumber || phoneNumber.trim() === '') {
      setPhoneError(
        language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required'
      )
      setLoading(false)
      return
    }

    const fullPhone = countryCode + phoneNumber.replace(/[\s\-()]/g, '')
    if (!validatePhone(fullPhone)) {
      const selectedCountry = countryCodes.find((c) => c.code === countryCode)
      setPhoneError(
        language === 'ar'
          ? `يجب أن يحتوي الرقم على ${selectedCountry?.format || '8-15 رقم'}`
          : `Number must contain ${selectedCountry?.format || '8-15 digits'}`
      )
      setLoading(false)
      return
    }

    try {
      // Prepare registration data based on role
      const registrationData =
        formData.role === 'club'
          ? {
              email: formData.email,
              password: formData.password,
              role: formData.role,
              phone: formData.phone,
              organizationName: formData.organizationName,
              organizationType: formData.organizationType,
              establishedDate: formData.establishedDate,
              businessRegistrationNumber: formData.businessRegistrationNumber,
            }
          : {
              email: formData.email,
              password: formData.password,
              role: formData.role,
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
            }

      console.log('Sending registration data:', registrationData)

      // Call register API
      await register(registrationData)

      // Show success message
      setSuccess(true)

      // Redirect to verification notice after 3 seconds
      setTimeout(() => {
        router.push('/verify-email-notice')
      }, 3000)
    } catch (err: any) {
      console.error('Registration error:', err)
      console.error('Registration error details:', JSON.stringify(err, null, 2))

      // Handle validation errors from backend
      if (err.errors && Array.isArray(err.errors)) {
        console.error('Validation errors:', err.errors)
        setValidationErrors(err.errors)
        setError(
          language === 'ar'
            ? 'يرجى تصحيح الأخطاء أدناه'
            : 'Please correct the errors below'
        )
      } else {
        setError(
          err.message ||
            (language === 'ar' ? 'فشل التسجيل' : 'Registration failed')
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (

    
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 p-6 relative overflow-hidden ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
    {/* Back Button */}
<div className="absolute top-6 left-6 z-50">
  <a
    href="/"
    className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3b82f6] text-white font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
  >
    <span className="text-xl group-hover:-translate-x-1 transition-transform">⟵</span>
    <span className="hidden sm:block">الرئيسية</span>
  </a>
</div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Gradient Orbs */}
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

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center shadow-xl"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <UserPlus className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              {language === 'ar'
                ? 'انضم إلى SportX اليوم'
                : 'Join SportX Platform today'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">
                    {language === 'ar'
                      ? 'تم التسجيل بنجاح!'
                      : 'Registration successful!'}
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    {language === 'ar'
                      ? 'يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك'
                      : 'Please check your email to verify your account'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
                <div className="flex-1">
                  <p className="text-red-800 font-semibold text-sm mb-2">
                    {error}
                  </p>
                  {validationErrors.length > 0 && (
                    <ul className="space-y-1 text-sm text-red-600">
                      {validationErrors.map((err, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-400">•</span>
                          <span>
                            <strong className="capitalize">{err.field}:</strong>{' '}
                            {err.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            {/* Role Selection - Custom Dropdown */}
            <div className="mb-6 relative">
              <label className="block text-sm font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {language === 'ar' ? 'أنا:' : 'I am a:'}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="w-full h-14 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 rounded-xl px-4 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {formData.role === 'player' && '⚽'}
                    {formData.role === 'coach' && '👨‍🏫'}
                    {formData.role === 'club' && '🏟️'}
                    {formData.role === 'specialist' && '💪'}
                    {formData.role === 'player' &&
                      (language === 'ar' ? 'لاعب/رياضي' : 'Player/Athlete')}
                    {formData.role === 'coach' &&
                      (language === 'ar' ? 'مدرب' : 'Coach/Trainer')}
                    {formData.role === 'club' &&
                      (language === 'ar' ? 'نادي/مؤسسة' : 'Club/Organization')}
                    {formData.role === 'specialist' &&
                      (language === 'ar' ? 'متخصص' : 'Specialist')}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-500 transition-transform duration-300 ${roleDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {roleDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 w-full mt-2 bg-white border-2 border-purple-200 rounded-xl shadow-2xl overflow-hidden"
                    >
                      {[
                        {
                          value: 'player',
                          emoji: '⚽',
                          labelAr: 'لاعب/رياضي',
                          labelEn: 'Player/Athlete',
                        },
                        {
                          value: 'coach',
                          emoji: '👨‍🏫',
                          labelAr: 'مدرب',
                          labelEn: 'Coach/Trainer',
                        },
                        {
                          value: 'club',
                          emoji: '🏟️',
                          labelAr: 'نادي/مؤسسة',
                          labelEn: 'Club/Organization',
                        },
                        {
                          value: 'specialist',
                          emoji: '💪',
                          labelAr: 'متخصص',
                          labelEn: 'Specialist',
                        },
                      ].map((option) => (
                        <motion.button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              role: option.value as any,
                            })
                            setRoleDropdownOpen(false)
                          }}
                          whileHover={{
                            backgroundColor: 'rgba(147, 51, 234, 0.1)',
                          }}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-purple-50 transition-colors"
                        >
                          <span className="flex items-center gap-3 text-lg">
                            <span className="text-2xl">{option.emoji}</span>
                            <span>
                              {language === 'ar'
                                ? option.labelAr
                                : option.labelEn}
                            </span>
                          </span>
                          {formData.role === option.value && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Conditional Fields based on Role */}
            {formData.role === 'club' ? (
              <>
                {/* Organization Name for Club */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-3">
                    <Building2 className="w-4 h-4 inline mr-2 text-blue-500" />
                    <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      {language === 'ar'
                        ? 'اسم المؤسسة/النادي'
                        : 'Organization/Club Name'}{' '}
                      *
                    </span>
                  </label>
                  <Input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder={
                      language === 'ar'
                        ? 'أدخل اسم المؤسسة أو النادي'
                        : 'Enter organization or club name'
                    }
                    className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white"
                    required
                  />
                </div>

                {/* Representative Name for Club */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <User className="w-4 h-4 inline mr-2" />
                    {language === 'ar'
                      ? 'اسم المسؤول/الممثل'
                      : 'Representative Name'}{' '}
                    *
                  </label>
                  <Input
                    type="text"
                    name="representativeName"
                    value={formData.representativeName}
                    onChange={handleChange}
                    placeholder={
                      language === 'ar'
                        ? 'أدخل اسم المسؤول أو الممثل'
                        : 'Enter representative name'
                    }
                    className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white"
                    required
                  />
                </div>

                {/* Organization Type - Custom Dropdown */}
                <div className="mb-6 relative">
                  <label className="block text-sm font-bold mb-3">
                    <Building2 className="w-4 h-4 inline mr-2 text-green-500" />
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {language === 'ar' ? 'نوع المؤسسة' : 'Organization Type'}{' '}
                      *
                    </span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOrgTypeDropdownOpen(!orgTypeDropdownOpen)
                      }
                      className="w-full h-14 text-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 rounded-xl px-4 bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-white cursor-pointer flex items-center justify-between"
                    >
                      <span>
                        {formData.organizationType === 'club' &&
                          (language === 'ar'
                            ? '🏟️ نادي رياضي'
                            : '🏟️ Sports Club')}
                        {formData.organizationType === 'academy' &&
                          (language === 'ar' ? '🎓 أكاديمية' : '🎓 Academy')}
                        {formData.organizationType === 'federation' &&
                          (language === 'ar' ? '🏆 اتحاد' : '🏆 Federation')}
                        {formData.organizationType === 'sports-center' &&
                          (language === 'ar'
                            ? '🏋️ مركز رياضي'
                            : '🏋️ Sports Center')}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-green-500 transition-transform duration-300 ${orgTypeDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {orgTypeDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-full mt-2 bg-white border-2 border-green-200 rounded-xl shadow-2xl overflow-hidden"
                        >
                          {[
                            {
                              value: 'club',
                              emoji: '🏟️',
                              labelAr: 'نادي رياضي',
                              labelEn: 'Sports Club',
                            },
                            {
                              value: 'academy',
                              emoji: '🎓',
                              labelAr: 'أكاديمية',
                              labelEn: 'Academy',
                            },
                            {
                              value: 'federation',
                              emoji: '🏆',
                              labelAr: 'اتحاد',
                              labelEn: 'Federation',
                            },
                            {
                              value: 'sports-center',
                              emoji: '🏋️',
                              labelAr: 'مركز رياضي',
                              labelEn: 'Sports Center',
                            },
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  organizationType: option.value as any,
                                })
                                setOrgTypeDropdownOpen(false)
                              }}
                              whileHover={{
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              }}
                              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-green-50 transition-colors"
                            >
                              <span className="flex items-center gap-3 text-lg">
                                <span className="text-2xl">{option.emoji}</span>
                                <span>
                                  {language === 'ar'
                                    ? option.labelAr
                                    : option.labelEn}
                                </span>
                              </span>
                              {formData.organizationType === option.value && (
                                <Check className="w-5 h-5 text-green-600" />
                              )}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Established Date */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'ar' ? 'تاريخ التأسيس' : 'Established Date'} *
                  </label>
                  <Input
                    type="date"
                    name="establishedDate"
                    value={formData.establishedDate}
                    onChange={handleChange}
                    className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white"
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Business Registration Number */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'ar'
                      ? 'رقم السجل التجاري'
                      : 'Business Registration Number'}{' '}
                    *
                  </label>
                  <Input
                    type="text"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleChange}
                    placeholder={
                      language === 'ar'
                        ? 'أدخل رقم السجل التجاري'
                        : 'Enter business registration number'
                    }
                    className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {/* First Name for Player/Coach/Specialist */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-3">
                    <User className="w-4 h-4 inline mr-2 text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {language === 'ar' ? 'الاسم الأول' : 'First Name'} *
                    </span>
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={
                      language === 'ar'
                        ? 'أدخل اسمك الأول'
                        : 'Enter your first name'
                    }
                    className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white"
                    required
                  />
                </div>

                {/* Last Name for Player/Coach/Specialist */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-3">
                    <User className="w-4 h-4 inline mr-2 text-pink-500" />
                    <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {language === 'ar' ? 'اسم العائلة' : 'Last Name'} *
                    </span>
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={
                      language === 'ar'
                        ? 'أدخل اسم عائلتك'
                        : 'Enter your last name'
                    }
                    className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white"
                    required
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3">
                <Mail className="w-4 h-4 inline mr-2 text-green-500" />
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                </span>
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={
                  language === 'ar'
                    ? 'أدخل بريدك الإلكتروني'
                    : 'Enter your email'
                }
                className="h-14 text-lg border-2 focus:border-blue-500 transition-all duration-300 rounded-xl"
                dir="ltr"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3">
                <Lock className="w-4 h-4 inline mr-2 text-orange-500" />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'} *
                </span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    language === 'ar'
                      ? 'أدخل كلمة المرور'
                      : 'Enter your password'
                  }
                  className="h-14 text-lg border-2 focus:border-blue-500 transition-all duration-300 rounded-xl pr-12"
                  minLength={8}
                  required
                />
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {language === 'ar'
                        ? 'قوة كلمة المرور:'
                        : 'Password Strength:'}
                    </span>
                    <div className="flex items-center gap-2">
                      {passwordStrength.score <= 2 && (
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                      )}
                      {passwordStrength.score > 2 &&
                        passwordStrength.score <= 4 && (
                          <Shield className="w-4 h-4 text-yellow-500" />
                        )}
                      {passwordStrength.score > 4 && (
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          passwordStrength.score <= 2
                            ? 'text-red-600'
                            : passwordStrength.score <= 4
                              ? 'text-yellow-600'
                              : 'text-green-600'
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((bar) => (
                      <motion.div
                        key={bar}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: bar * 0.05 }}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          bar <= passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Strength Tips */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          formData.password.length >= 8
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span
                        className={
                          formData.password.length >= 8
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }
                      >
                        {language === 'ar'
                          ? '8 أحرف على الأقل'
                          : 'At least 8 characters'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[A-Z]/.test(formData.password) &&
                          /[a-z]/.test(formData.password)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span
                        className={
                          /[A-Z]/.test(formData.password) &&
                          /[a-z]/.test(formData.password)
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }
                      >
                        {language === 'ar'
                          ? 'أحرف كبيرة وصغيرة'
                          : 'Uppercase & lowercase'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          /\d/.test(formData.password)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span
                        className={
                          /\d/.test(formData.password)
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }
                      >
                        {language === 'ar'
                          ? 'يحتوي على أرقام'
                          : 'Contains numbers'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[^a-zA-Z\d]/.test(formData.password)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span
                        className={
                          /[^a-zA-Z\d]/.test(formData.password)
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }
                      >
                        {language === 'ar'
                          ? 'يحتوي على رموز خاصة'
                          : 'Special characters (!@#$...)'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3">
                <Phone className="w-4 h-4 inline mr-2 text-cyan-500" />
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                </span>
              </label>
              <div className="flex gap-3">
                {/* Country Code Selector - Custom Dropdown */}
                <div className="relative" style={{ minWidth: '140px' }}>
                  <button
                    type="button"
                    onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                    className="h-14 px-3 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-cyan-50 hover:to-white transition-all duration-300 outline-none cursor-pointer w-full flex items-center justify-between gap-2"
                  >
                    <span className="text-lg">
                      {countryCodes.find((c) => c.code === countryCode)?.flag}{' '}
                      {countryCode}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-cyan-500 transition-transform duration-300 ${countryDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {countryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-72 bottom-full mb-2 bg-white border-2 border-cyan-200 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
                      >
                        {countryCodes.map((country) => (
                          <motion.button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setCountryCode(country.code)
                              setCountryDropdownOpen(false)
                              // Re-format phone number for new country code
                              const formatted = formatPhoneNumber(
                                phoneNumber,
                                country.code
                              )
                              setPhoneNumber(formatted)
                              const fullPhone =
                                country.code + formatted.replace(/\D/g, '')
                              setFormData({ ...formData, phone: fullPhone })
                            }}
                            whileHover={{
                              backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            }}
                            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-cyan-50 transition-colors"
                          >
                            <span className="flex items-center gap-3">
                              <span className="text-2xl">{country.flag}</span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {country.country}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {country.code}
                                </span>
                              </div>
                            </span>
                            {countryCode === country.code && (
                              <Check className="w-5 h-5 text-cyan-600" />
                            )}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Phone Number Input */}
                <div className="flex-1 relative">
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    onBlur={handlePhoneBlur}
                    placeholder={
                      countryCodes.find((c) => c.code === countryCode)
                        ?.example || '123 456 7890'
                    }
                    className={`h-14 text-lg border-2 transition-all duration-300 rounded-xl pr-10 ${
                      phoneError
                        ? 'border-red-500 focus:border-red-500'
                        : phoneNumber &&
                            validatePhone(
                              countryCode + phoneNumber.replace(/[\s\-()]/g, '')
                            )
                          ? 'border-green-500 focus:border-green-500'
                          : 'border-gray-200 focus:border-blue-500'
                    }`}
                    dir="ltr"
                  />
                  {/* Valid indicator */}
                  {phoneNumber &&
                    !phoneError &&
                    validatePhone(
                      countryCode + phoneNumber.replace(/[\s\-()]/g, '')
                    ) && (
                      <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  {/* Error indicator */}
                  {phoneError && (
                    <AlertCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>

              {/* Dynamic Help Text */}
              {!phoneError && (
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <span>
                    {language === 'ar'
                      ? `${
                          countryCodes.find((c) => c.code === countryCode)
                            ?.format
                        } للرقم`
                      : `${
                          countryCodes.find((c) => c.code === countryCode)
                            ?.format
                        } for ${
                          countryCodes.find((c) => c.code === countryCode)
                            ?.country
                        }`}
                  </span>
                </p>
              )}

              {/* Error Message */}
              {phoneError && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{phoneError}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || success}
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
                    <UserPlus className="w-5 h-5" />
                    {language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                  </>
                )}
              </div>
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {language === 'ar'
                ? 'لديك حساب بالفعل؟'
                : 'Already have an account?'}{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-300"
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
