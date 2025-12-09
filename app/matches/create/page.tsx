'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { createMatch, type CreateMatchData } from '@/services/matches'
import {
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function CreateMatchPage() {
  const { language } = useLanguage()
  const router = useRouter()

  const [formData, setFormData] = useState<CreateMatchData>({
    name: '',
    sport: 'football',
    region: 'الرياض',
    city: '',
    neighborhood: '',
    date: '',
    time: '',
    level: 'amateur',
    maxPlayers: 10,
    venue: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const regions = [
    { name: 'الرياض', nameEn: 'Riyadh', cities: ['الرياض', 'العليا', 'النخيل'] },
    { name: 'جدة', nameEn: 'Jeddah', cities: ['جدة', 'الروضة', 'البلد'] },
    { name: 'مكة المكرمة', nameEn: 'Makkah', cities: ['مكة', 'العزيزية'] },
    { name: 'المدينة المنورة', nameEn: 'Madinah', cities: ['المدينة'] },
    { name: 'الدمام', nameEn: 'Dammam', cities: ['الدمام', 'الخبر', 'الظهران'] },
  ]

  const selectedRegion = regions.find((r) => r.name === formData.region)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (
      !formData.name ||
      !formData.city ||
      !formData.neighborhood ||
      !formData.date ||
      !formData.time ||
      !formData.venue
    ) {
      setError(
        language === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة'
          : 'Please fill all required fields'
      )
      return
    }

    setLoading(true)

    try {
      await createMatch(formData)
      setSuccess(true)

      setTimeout(() => {
        router.push('/matches/dashboard')
      }, 1500)
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        (language === 'ar' ? 'فشل إنشاء المباراة' : 'Failed to create match')
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 p-6"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/matches/dashboard">
            <Button
              variant="ghost"
              className="mb-4 hover:bg-white/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'إنشاء مباراة جديدة' : 'Create New Match'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'املأ التفاصيل أدناه لإنشاء مباراة وادعُ اللاعبين'
              : 'Fill in the details below to create a match and invite players'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Error Message */}
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

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">
                {language === 'ar'
                  ? 'تم إنشاء المباراة بنجاح!'
                  : 'Match created successfully!'}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Match Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'اسم المباراة' : 'Match Name'}
              </label>
              <div className="relative">
                <Trophy className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={
                    language === 'ar' ? 'مثال: مباراة ودية' : 'E.g., Friendly Match'
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المنطقة' : 'Region'}
                </label>
                <select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value, city: '' })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  required
                >
                  {regions.map((region) => (
                    <option key={region.name} value={region.name}>
                      {language === 'ar' ? region.name : region.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المدينة' : 'City'}
                </label>
                <select
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                  required
                >
                  <option value="">
                    {language === 'ar' ? 'اختر المدينة' : 'Select City'}
                  </option>
                  {selectedRegion?.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Neighborhood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الحي / العنوان' : 'Neighborhood / Address'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  value={formData.neighborhood}
                  onChange={(e) =>
                    setFormData({ ...formData, neighborhood: e.target.value })
                  }
                  placeholder={
                    language === 'ar'
                      ? 'مثال: شارع العليا، الملعب'
                      : 'E.g., Al Olaya Street, Stadium'
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الملعب' : 'Venue'}
              </label>
              <Input
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
                placeholder={
                  language === 'ar' ? 'مثال: ملعب النادي' : 'E.g., Club Stadium'
                }
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الوقت' : 'Time'}
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Max Players */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'عدد اللاعبين الأقصى' : 'Max Players'}
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  type="number"
                  value={formData.maxPlayers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxPlayers: parseInt(e.target.value) || 10,
                    })
                  }
                  min={2}
                  max={50}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Link href="/matches/dashboard" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'ar' ? 'جاري...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'إنشاء المباراة' : 'Create Match'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
