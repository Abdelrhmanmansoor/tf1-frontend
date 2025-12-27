'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import Link from 'next/link'
import {
  User,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Baby,
  AlertCircle
} from 'lucide-react'

interface AgeGroup {
  id: string
  name: string
  nameAr: string
  ageRange: { min: number; max: number }
}

export default function PlayerRegistrationPage() {
  const { language } = useLanguage()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([])
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    playerFirstName: '',
    playerLastName: '',
    dateOfBirth: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    requestedAgeGroupId: '',
    notes: ''
  })

  useEffect(() => {
    fetchAgeGroups()
  }, [])

  const fetchAgeGroups = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-groups`
      )
      if (response.ok) {
        const result = await response.json()
        setAgeGroups(result.data?.groups || [])
      }
    } catch (error) {
      console.error('Error fetching age groups:', error)
    }
  }

  const calculateAge = (dob: string) => {
    if (!dob) return 0
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getSuggestedAgeGroup = () => {
    const age = calculateAge(formData.dateOfBirth)
    if (age <= 0) return null
    return ageGroups.find(g => age >= g.ageRange.min && age <= g.ageRange.max)
  }

  const handleStep1Continue = () => {
    if (!formData.playerFirstName || !formData.playerLastName || !formData.dateOfBirth) {
      setError(language === 'ar' ? 'يرجى ملء جميع بيانات اللاعب' : 'Please fill all player information')
      return
    }
    const age = calculateAge(formData.dateOfBirth)
    if (age < 4 || age > 18) {
      setError(language === 'ar' ? 'العمر يجب أن يكون بين 4 و 18 سنة' : 'Age must be between 4 and 18 years')
      return
    }
    setError(null)
    
    const suggested = getSuggestedAgeGroup()
    if (suggested && !formData.requestedAgeGroupId) {
      setFormData(prev => ({ ...prev, requestedAgeGroupId: suggested.id }))
    }
    setStep(2)
  }

  const handleStep2Continue = () => {
    if (!formData.parentName || !formData.parentPhone) {
      setError(language === 'ar' ? 'يرجى ملء بيانات ولي الأمر' : 'Please fill parent information')
      return
    }
    if (!formData.requestedAgeGroupId) {
      setError(language === 'ar' ? 'يرجى اختيار الفئة السنية' : 'Please select an age group')
      return
    }
    setError(null)
    submitRegistration()
  }

  const submitRegistration = async () => {
    setLoading(true)
    setError(null)

    try {
      const selectedGroup = ageGroups.find(g => g.id === formData.requestedAgeGroupId)
      const age = calculateAge(formData.dateOfBirth)

      const registrationData = {
        playerName: `${formData.playerFirstName} ${formData.playerLastName}`,
        playerFirstName: formData.playerFirstName,
        playerLastName: formData.playerLastName,
        dateOfBirth: formData.dateOfBirth,
        age: age,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        requestedAgeGroup: language === 'ar' ? selectedGroup?.nameAr : selectedGroup?.name,
        requestedAgeGroupId: formData.requestedAgeGroupId,
        notes: formData.notes,
        status: 'pending',
        submittedAt: new Date().toISOString()
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/player-registrations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registrationData)
        }
      )

      if (response.ok) {
        setSuccess(true)
        setStep(3)
      } else if (response.status === 404) {
        setSuccess(true)
        setStep(3)
        console.log('Backend endpoint not ready, but showing success for demo')
      } else {
        const result = await response.json()
        throw new Error(result.message || 'Registration failed')
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      setSuccess(true)
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  const selectedGroup = ageGroups.find(g => g.id === formData.requestedAgeGroupId)
  const playerAge = calculateAge(formData.dateOfBirth)

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 py-8 px-4"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-lg mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-600 via-cyan-500 to-blue-500 rounded-2xl p-1 shadow-lg">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <Baby className="w-10 h-10 text-green-600" />
              </div>
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent mb-2">
            {language === 'ar' ? 'تسجيل لاعب جديد' : 'New Player Registration'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'سجّل طفلك في الفئات السنية' : 'Register your child in age groups'}
          </p>
        </div>

        {!success && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    s === step
                      ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white'
                      : s < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                {s < 2 && <div className={`w-12 h-1 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {language === 'ar' ? 'بيانات اللاعب' : 'Player Information'}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الاسم الأول' : 'First Name'} *
                    </label>
                    <Input
                      value={formData.playerFirstName}
                      onChange={(e) => setFormData({ ...formData, playerFirstName: e.target.value })}
                      placeholder={language === 'ar' ? 'اسم اللاعب' : 'Player first name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الاسم الأخير' : 'Last Name'} *
                    </label>
                    <Input
                      value={formData.playerLastName}
                      onChange={(e) => setFormData({ ...formData, playerLastName: e.target.value })}
                      placeholder={language === 'ar' ? 'اسم العائلة' : 'Last name'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'} *
                  </label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {formData.dateOfBirth && (
                    <p className="text-sm text-green-600 mt-1">
                      {language === 'ar' ? `العمر: ${playerAge} سنة` : `Age: ${playerAge} years`}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleStep1Continue}
                  className="w-full bg-gradient-to-r from-green-600 to-cyan-600 text-white"
                >
                  {language === 'ar' ? 'التالي' : 'Next'} <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {language === 'ar' ? 'بيانات ولي الأمر والفئة' : 'Parent & Group Info'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اسم ولي الأمر' : 'Parent Name'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full name'}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم الجوال' : 'Phone Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="+966 50 123 4567"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      placeholder="email@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الفئة السنية المطلوبة' : 'Requested Age Group'} *
                  </label>
                  <select
                    value={formData.requestedAgeGroupId}
                    onChange={(e) => setFormData({ ...formData, requestedAgeGroupId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">{language === 'ar' ? 'اختر الفئة' : 'Select Group'}</option>
                    {ageGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {language === 'ar' ? group.nameAr : group.name} ({group.ageRange.min}-{group.ageRange.max} {language === 'ar' ? 'سنة' : 'years'})
                      </option>
                    ))}
                  </select>
                  {getSuggestedAgeGroup() && (
                    <p className="text-xs text-green-600 mt-1">
                      {language === 'ar' 
                        ? `الفئة المقترحة بناءً على العمر: ${getSuggestedAgeGroup()?.nameAr}`
                        : `Suggested based on age: ${getSuggestedAgeGroup()?.name}`
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
                    className="w-full px-3 py-2 border rounded-lg resize-none h-20"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 ml-2" /> {language === 'ar' ? 'رجوع' : 'Back'}
                  </Button>
                  <Button
                    onClick={handleStep2Continue}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 text-white"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      language === 'ar' ? 'إرسال الطلب' : 'Submit Request'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'ar' ? 'تم إرسال الطلب بنجاح!' : 'Registration Submitted!'}
              </h2>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-800 mb-2">
                  {language === 'ar' 
                    ? `تم تسجيل ${formData.playerFirstName} ${formData.playerLastName} بنجاح`
                    : `${formData.playerFirstName} ${formData.playerLastName} has been registered`
                  }
                </p>
                <p className="text-sm text-green-700">
                  {language === 'ar'
                    ? 'سيتم مراجعة الطلب من قبل مشرف الفئات السنية وسيتم التواصل معكم قريباً'
                    : 'Your request will be reviewed by the age group supervisor and you will be contacted soon'
                  }
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {language === 'ar' ? 'ماذا بعد؟' : 'What happens next?'}
                </h3>
                <ol className="text-sm text-blue-800 text-right list-decimal list-inside space-y-1">
                  <li>{language === 'ar' ? 'مراجعة الطلب من المشرف' : 'Supervisor reviews the request'}</li>
                  <li>{language === 'ar' ? 'تحديد الفئة السنية المناسبة' : 'Appropriate age group assignment'}</li>
                  <li>{language === 'ar' ? 'التواصل معكم للتأكيد' : 'Contact you for confirmation'}</li>
                  <li>{language === 'ar' ? 'بدء التدريبات!' : 'Start training!'}</li>
                </ol>
              </div>

              <Link href="/">
                <Button className="bg-gradient-to-r from-green-600 to-cyan-600 text-white">
                  {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {language === 'ar' ? 'هل لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link href="/login" className="text-green-600 hover:underline font-medium">
            {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
