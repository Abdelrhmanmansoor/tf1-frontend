'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import { createMatch, getRegionsData } from '@/services/matches'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CreateMatchPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [regionsData, setRegionsData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    region: '',
    city: '',
    neighborhood: '',
    date: '',
    time: '',
    level: '',
    maxPlayers: 10,
    venue: '',
    locationId: ''
  })

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getRegionsData()
        setRegionsData(data)
      } catch (error) {
        console.error('Error fetching regions:', error)
      }
    }
    fetchRegions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createMatch(formData)
      alert('تم إنشاء المباراة بنجاح!')
      router.push('/matches-dashboard/my-matches')
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل إنشاء المباراة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إنشاء مباراة جديدة
          </h1>
          <p className="text-gray-600">أنشئ مباراة جديدة وادعُ اللاعبين</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Match Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المباراة *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="مثال: مباراة ودية - ملعب الحي"
                required
              />
            </div>

            {/* Sport & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرياضة *
                </label>
                <select
                  value={formData.sport}
                  onChange={(e) =>
                    setFormData({ ...formData, sport: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الرياضة</option>
                  {regionsData?.sports?.map((sport: any) => (
                    <option key={sport.value} value={sport.value}>
                      {sport.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المستوى *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر المستوى</option>
                  {regionsData?.levels?.map((level: any) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Region & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنطقة *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      region: e.target.value,
                      city: '',
                      locationId: regionsData?.regions?.find((r:any)=>r.name===e.target.value)?.id || ''
                    })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر المنطقة</option>
                  {regionsData?.regions?.map((region: any) => (
                    <option key={region.name} value={region.name}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                  disabled={!formData.region}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">اختر المدينة</option>
                  {regionsData?.regions
                    ?.find((r: any) => r.name === formData.region)
                    ?.cities?.map((city: any) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Neighborhood & Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحي / العنوان *
                </label>
                <Input
                  value={formData.neighborhood}
                  onChange={(e) =>
                    setFormData({ ...formData, neighborhood: e.target.value })
                  }
                  placeholder="مثال: شارع العليا، الملعب الرياضي"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الملعب *
                </label>
                <Input
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  placeholder="مثال: ملعب النادي الرئيسي"
                  required
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التاريخ *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوقت *
                </label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Max Players */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد اللاعبين المطلوب *
              </label>
              <Input
                type="number"
                value={formData.maxPlayers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxPlayers: parseInt(e.target.value),
                  })
                }
                min={2}
                max={50}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء المباراة'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
