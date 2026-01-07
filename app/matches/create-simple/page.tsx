'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateSimpleMatchPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    sport: 'Football',
    city: '',
    area: '',
    location: '',
    date: '',
    time: '',
    level: 'intermediate',
    max_players: 14
  })

  useEffect(() => {
    // Fetch cities from backend
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com'}/matches/api/locations/cities`)
      if (res.ok) {
        const data = await res.json()
        setCities(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token') ||
                   localStorage.getItem('matches_token') ||
                   localStorage.getItem('auth_token')

      if (!token) {
        toast.error('يرجى تسجيل الدخول أولاً')
        router.push('/matches/login')
        return
      }

      // Prepare payload
      const payload = {
        title: formData.title || 'مباراة جديدة',
        sport: formData.sport,
        city: formData.city || 'الرياض',
        area: formData.area || formData.city || 'منطقة',
        location: formData.location || 'ملعب رياضي',
        date: formData.date,
        time: formData.time,
        level: formData.level,
        max_players: Number(formData.max_players),
        cost_per_player: 0,
        currency: 'SAR',
        notes: ''
      }

      console.log('📤 Sending payload:', payload)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com'}/matches/api/matches`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        }
      )

      console.log('📥 Response status:', res.status)
      const data = await res.json()
      console.log('📥 Response data:', data)

      if (res.ok && data.success) {
        toast.success('✅ تم إنشاء المباراة بنجاح!')
        setTimeout(() => {
          router.push('/matches/dashboard')
        }, 1500)
      } else {
        toast.error(data.message || 'فشل إنشاء المباراة')
        console.error('Error response:', data)
      }
    } catch (error: any) {
      console.error('❌ Create match error:', error)
      toast.error(error.message || 'حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إنشاء مباراة جديدة</h1>
            <p className="text-gray-600">املأ البيانات وأنشئ مباراتك</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان المباراة *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مباراة الجمعة"
              required
              className="text-right"
            />
          </div>

          {/* Sport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الرياضة *
            </label>
            <select
              value={formData.sport}
              onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-right"
              required
            >
              <option value="Football">كرة القدم</option>
              <option value="Basketball">كرة السلة</option>
              <option value="Volleyball">كرة الطائرة</option>
              <option value="Tennis">التنس</option>
              <option value="Padel">البادل</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المدينة *
            </label>
            {cities.length > 0 ? (
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg text-right"
                required
              >
                <option value="">اختر المدينة</option>
                {cities.map((city) => (
                  <option key={city._id} value={city.name_ar}>
                    {city.name_ar}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="الرياض"
                required
                className="text-right"
              />
            )}
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المنطقة *
            </label>
            <Input
              type="text"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="العليا"
              required
              className="text-right"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الموقع *
            </label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="النادي الرياضي"
              required
              className="text-right"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التاريخ *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المستوى *
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-right"
              required
            >
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">محترف</option>
            </select>
          </div>

          {/* Max Players */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد اللاعبين *
            </label>
            <Input
              type="number"
              value={formData.max_players}
              onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) || 14 })}
              min="2"
              max="100"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 ml-2" />
                  إنشاء المباراة
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

