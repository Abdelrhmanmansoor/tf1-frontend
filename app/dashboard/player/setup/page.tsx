'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  User,
  Briefcase,
  MapPin,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import playerService from '@/services/player'
import type { CreatePlayerProfileData } from '@/types/player'

const PlayerSetupPage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<CreatePlayerProfileData>({
    primarySport: '',
    position: '',
    level: 'amateur',
    bio: '',
    location: {
      country: '',
      city: '',
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      await playerService.createProfile(formData)

      // Redirect to dashboard after successful creation
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  const canProceedToStep2 =
    formData.primarySport && formData.position && formData.level
  const canSubmit =
    canProceedToStep2 && formData.location?.country && formData.location?.city

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
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
                ? 'لنقم بإنشاء ملفك الشخصي كلاعب'
                : "Let's create your player profile"}
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
          </div>
          <div className="flex justify-between mt-2 text-sm text-blue-100">
            <span>
              {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Info'}
            </span>
            <span>
              {language === 'ar' ? 'الموقع والتفاصيل' : 'Location & Details'}
            </span>
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

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  {language === 'ar'
                    ? 'المعلومات الرياضية'
                    : 'Sports Information'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الرياضة الأساسية' : 'Primary Sport'}{' '}
                      *
                    </label>
                    <Input
                      value={formData.primarySport}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primarySport: e.target.value,
                        })
                      }
                      placeholder={
                        language === 'ar'
                          ? 'مثال: كرة القدم'
                          : 'e.g., Football, Basketball'
                      }
                      required
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المركز' : 'Position'} *
                    </label>
                    <Input
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      placeholder={
                        language === 'ar'
                          ? 'مثال: مهاجم'
                          : 'e.g., Striker, Guard'
                      }
                      required
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المستوى' : 'Level'} *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          level: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="beginner">
                        {language === 'ar' ? 'مبتدئ' : 'Beginner'}
                      </option>
                      <option value="amateur">
                        {language === 'ar' ? 'هاوي' : 'Amateur'}
                      </option>
                      <option value="semi-pro">
                        {language === 'ar' ? 'شبه محترف' : 'Semi-Pro'}
                      </option>
                      <option value="professional">
                        {language === 'ar' ? 'محترف' : 'Professional'}
                      </option>
                    </select>
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

          {/* Step 2: Location & Bio */}
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
                    ? 'الموقع والتفاصيل'
                    : 'Location & Details'}
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الدولة' : 'Country'} *
                      </label>
                      <Input
                        value={formData.location?.country}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: {
                              ...formData.location!,
                              country: e.target.value,
                            },
                          })
                        }
                        placeholder={language === 'ar' ? 'مصر' : 'Egypt'}
                        required
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المدينة' : 'City'} *
                      </label>
                      <Input
                        value={formData.location?.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: {
                              ...formData.location!,
                              city: e.target.value,
                            },
                          })
                        }
                        placeholder={language === 'ar' ? 'القاهرة' : 'Cairo'}
                        required
                        className="text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نبذة عنك' : 'Bio'} (
                      {language === 'ar' ? 'اختياري' : 'Optional'})
                    </label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      placeholder={
                        language === 'ar'
                          ? 'أخبرنا عن نفسك...'
                          : 'Tell us about yourself...'
                      }
                      className="resize-none text-lg"
                    />
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

export default PlayerSetupPage
