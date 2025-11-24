'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Stethoscope,
  GraduationCap,
  MapPin,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createProfile } from '@/services/specialist'

const SpecialistSetupPage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    primarySpecialization: '',
    yearsOfExperience: '',
    bio: '', // Simple string, not object
    languages: [] as string[], // Array of enum values
    clinicName: '',
    city: '',
    country: '',
    street: '',
    onlineAvailable: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      // Build the profile data according to backend schema
      const profileData: any = {
        primarySpecialization: formData.primarySpecialization,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        bio: formData.bio,
        languages: formData.languages,
        serviceLocations: [
          {
            type: 'clinic', // Backend only accepts 'clinic'
            name: formData.clinicName,
            address: {
              street: formData.street || 'N/A',
              city: formData.city,
              country: formData.country,
            },
            isPrimary: true,
          },
        ],
        consultationTypes: ['individual'],
        onlineConsultation: {
          available: formData.onlineAvailable,
          platforms: formData.onlineAvailable ? ['zoom'] : [],
        },
      }

      console.log('=== SUBMITTING PROFILE DATA ===')
      console.log('Primary Specialization:', profileData.primarySpecialization)
      console.log(
        'Years of Experience:',
        profileData.yearsOfExperience,
        typeof profileData.yearsOfExperience
      )
      console.log('Bio:', profileData.bio)
      console.log('Languages:', profileData.languages)
      console.log(
        'Service Locations:',
        JSON.stringify(profileData.serviceLocations, null, 2)
      )
      console.log('Consultation Types:', profileData.consultationTypes)
      console.log('Online Consultation:', profileData.onlineConsultation)
      console.log('=== FULL PAYLOAD ===')
      console.log(JSON.stringify(profileData, null, 2))

      const response = await createProfile(profileData)

      console.log('Profile created successfully:', response)

      setSuccess(true)

      // Redirect to dashboard after successful creation
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      console.error('Error creating profile:', err)
      console.error('Error response:', err.response?.data)

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to create profile. Please check all fields and try again.'

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const canProceedToStep2 =
    formData.primarySpecialization &&
    formData.yearsOfExperience &&
    formData.languages.length > 0
  const canProceedToStep3 =
    canProceedToStep2 &&
    formData.city &&
    formData.country &&
    formData.clinicName
  const canSubmit = canProceedToStep3 && formData.bio

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              {language === 'ar' ? '🎉 مرحباً بك!' : '🎉 Welcome!'}
            </h1>
            <p className="text-blue-100">
              {language === 'ar'
                ? 'لنقم بإنشاء ملفك الشخصي كأخصائي'
                : "Let's create your specialist profile"}
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center gap-2">
            <div
              className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}
            ></div>
            <div
              className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}
            ></div>
            <div
              className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/30'}`}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-blue-100">
            <span>{language === 'ar' ? 'التخصص' : 'Specialization'}</span>
            <span>{language === 'ar' ? 'الموقع' : 'Location'}</span>
            <span>{language === 'ar' ? 'النبذة' : 'Bio'}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6"
            >
              {language === 'ar'
                ? '✓ تم إنشاء الملف الشخصي بنجاح! جاري التوجيه...'
                : '✓ Profile created successfully! Redirecting...'}
            </motion.div>
          )}

          {/* Step 1: Specialization & Experience */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                  {language === 'ar'
                    ? 'التخصص والخبرة'
                    : 'Specialization & Experience'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'التخصص الأساسي'
                        : 'Primary Specialization'}{' '}
                      *
                    </label>
                    <select
                      value={formData.primarySpecialization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primarySpecialization: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">
                        {language === 'ar'
                          ? 'اختر التخصص'
                          : 'Select Specialization'}
                      </option>
                      <option value="sports_physiotherapy">
                        {language === 'ar'
                          ? 'علاج طبيعي رياضي'
                          : 'Sports Physiotherapy'}
                      </option>
                      <option value="sports_nutrition">
                        {language === 'ar'
                          ? 'تغذية رياضية'
                          : 'Sports Nutrition'}
                      </option>
                      <option value="fitness_training">
                        {language === 'ar' ? 'لياقة بدنية' : 'Fitness Training'}
                      </option>
                      <option value="sports_psychology">
                        {language === 'ar'
                          ? 'علم نفس رياضي'
                          : 'Sports Psychology'}
                      </option>
                      <option value="injury_rehabilitation">
                        {language === 'ar'
                          ? 'إعادة تأهيل الإصابات'
                          : 'Injury Rehabilitation'}
                      </option>
                      <option value="sports_massage">
                        {language === 'ar' ? 'تدليك رياضي' : 'Sports Massage'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'سنوات الخبرة'
                        : 'Years of Experience'}{' '}
                      *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsOfExperience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          yearsOfExperience: e.target.value,
                        })
                      }
                      placeholder={language === 'ar' ? 'مثال: 5' : 'e.g., 5'}
                      required
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'اللغات' : 'Languages'} *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes('english')}
                          onChange={(e) => {
                            const langs = e.target.checked
                              ? [...formData.languages, 'english']
                              : formData.languages.filter(
                                  (l) => l !== 'english'
                                )
                            setFormData({ ...formData, languages: langs })
                          }}
                          className="w-4 h-4"
                        />
                        <span>
                          {language === 'ar' ? 'الإنجليزية' : 'English'}
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes('arabic')}
                          onChange={(e) => {
                            const langs = e.target.checked
                              ? [...formData.languages, 'arabic']
                              : formData.languages.filter((l) => l !== 'arabic')
                            setFormData({ ...formData, languages: langs })
                          }}
                          className="w-4 h-4"
                        />
                        <span>{language === 'ar' ? 'العربية' : 'Arabic'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {language === 'ar' ? 'التالي' : 'Next'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  {language === 'ar'
                    ? 'موقع العيادة/المركز'
                    : 'Clinic/Center Location'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'اسم العيادة/المركز'
                        : 'Clinic/Center Name'}{' '}
                      *
                    </label>
                    <Input
                      value={formData.clinicName}
                      onChange={(e) =>
                        setFormData({ ...formData, clinicName: e.target.value })
                      }
                      placeholder={
                        language === 'ar'
                          ? 'مثال: عيادة الصحة الرياضية'
                          : 'e.g., Sports Health Clinic'
                      }
                      required
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الشارع/العنوان' : 'Street Address'}
                    </label>
                    <Input
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      placeholder={
                        language === 'ar'
                          ? 'مثال: شارع النصر'
                          : 'e.g., 123 Medical St'
                      }
                      className="text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المدينة' : 'City'} *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        placeholder={language === 'ar' ? 'القاهرة' : 'Cairo'}
                        required
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الدولة' : 'Country'} *
                      </label>
                      <Input
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        placeholder={language === 'ar' ? 'مصر' : 'Egypt'}
                        required
                        className="text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.onlineAvailable}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            onlineAvailable: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      {language === 'ar'
                        ? 'أقدم استشارات أونلاين'
                        : 'I offer online consultations'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 py-6 text-lg"
                  disabled={loading}
                >
                  {language === 'ar' ? 'السابق' : 'Back'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className="flex-1 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {language === 'ar' ? 'التالي' : 'Next'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Bio */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                  {language === 'ar' ? 'نبذة عنك' : 'About You'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'النبذة' : 'Bio'} *
                    </label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={5}
                      placeholder={
                        language === 'ar'
                          ? 'أخبرنا عن خبرتك وتخصصك...'
                          : 'Tell us about your experience and expertise...'
                      }
                      className="resize-none text-lg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ar'
                        ? 'يمكنك الكتابة بالعربية أو الإنجليزية'
                        : 'You can write in Arabic or English'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 py-6 text-lg"
                  disabled={loading}
                >
                  {language === 'ar' ? 'السابق' : 'Back'}
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !canSubmit}
                  className="flex-1 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {language === 'ar' ? 'جاري الإنشاء...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {language === 'ar'
                        ? 'إنشاء الملف الشخصي'
                        : 'Create Profile'}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
          {language === 'ar'
            ? 'يمكنك تحديث هذه المعلومات لاحقاً من إعدادات الملف الشخصي'
            : 'You can update this information later from profile settings'}
        </div>
      </motion.div>
    </div>
  )
}

export default SpecialistSetupPage
