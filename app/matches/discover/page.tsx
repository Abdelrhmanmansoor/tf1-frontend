'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Heart, X, Star, ArrowLeft, MapPin, Calendar, Clock, 
  Users, TrendingUp, Sparkles, Trophy 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Match {
  _id: string
  title: string
  sport: string
  city: string
  area: string
  location: string
  date: string
  time: string
  level: string
  max_players: number
  current_players: number
  cost_per_player: number
  currency: string
  compatibilityScore?: number
  reasonsToJoin?: Array<{
    type: string
    text: string
    icon: string
  }>
  owner_id: {
    name: string
    email: string
  }
}

export default function DiscoverPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      // Try multiple token sources
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('matches_token') ||
                   localStorage.getItem('auth_token')
      
      if (!token) {
        router.push('/matches/login')
        return
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com'}/matches/api/swipe/discover?limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      )

      if (res.ok) {
        const data = await res.json()
        setMatches(data.data.matches || [])
      } else if (res.status === 401) {
        // Unauthorized - redirect to login
        toast.error('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى')
        localStorage.clear()
        router.push('/matches/login')
      } else {
        toast.error('فشل في تحميل المباريات')
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
      toast.error('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    const match = matches[currentIndex]
    if (!match) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com'}/matches/api/swipe/${match._id}/swipe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({ direction })
        }
      )

      if (res.ok) {
        const data = await res.json()
        if (direction === 'right') {
          toast.success('✅ تم الإعجاب بالمباراة!')
        } else if (direction === 'up') {
          toast.success('🌟 Super Like!')
        }
        setCurrentIndex(currentIndex + 1)
      }
    } catch (error) {
      console.error('Error swiping:', error)
      toast.error('حدث خطأ')
    }
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleSwipe('right')
    } else if (info.offset.x < -100) {
      handleSwipe('left')
    } else if (info.offset.y < -100) {
      handleSwipe('up')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المباريات...</p>
        </div>
      </div>
    )
  }

  const currentMatch = matches[currentIndex]

  if (!currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
        <div className="text-center max-w-md">
          <Sparkles className="w-20 h-20 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            لا توجد مباريات جديدة!
          </h2>
          <p className="text-gray-600 mb-6">
            تحقق لاحقاً للحصول على توصيات جديدة
          </p>
          <Button onClick={() => router.push('/matches/dashboard')} className="bg-blue-600">
            العودة للوحة التحكم
          </Button>
        </div>
      </div>
    )
  }

  const spotsLeft = currentMatch.max_players - currentMatch.current_players

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4" dir="rtl">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">اكتشف المباريات</h1>
          <div className="w-10"></div>
        </div>
        <p className="text-center text-gray-600 mt-2">
          {currentIndex + 1} / {matches.length}
        </p>
      </div>

      {/* Swipe Card */}
      <div className="max-w-md mx-auto relative h-[600px]">
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
            {/* Match Image/Sport Icon */}
            <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <div className="text-white text-7xl">
                {currentMatch.sport === 'Football' && '⚽'}
                {currentMatch.sport === 'Basketball' && '🏀'}
                {currentMatch.sport === 'Volleyball' && '🏐'}
                {currentMatch.sport === 'Tennis' && '🎾'}
                {!['Football', 'Basketball', 'Volleyball', 'Tennis'].includes(currentMatch.sport) && '🏃'}
              </div>
            </div>

            {/* Match Info */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentMatch.title}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {currentMatch.sport} • مستوى {currentMatch.level === 'beginner' ? 'مبتدئ' : currentMatch.level === 'intermediate' ? 'متوسط' : 'محترف'}
              </p>

              {/* Compatibility Score */}
              {currentMatch.compatibilityScore && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">نسبة التوافق</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-3xl font-bold text-green-600">
                        {currentMatch.compatibilityScore}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reasons to Join */}
              {currentMatch.reasonsToJoin && currentMatch.reasonsToJoin.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">لماذا هذه المباراة؟</h3>
                  {currentMatch.reasonsToJoin.map((reason, i) => (
                    <div key={i} className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                      <span className="text-xl">{reason.icon}</span>
                      <span className="text-sm text-gray-700">{reason.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Match Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>{currentMatch.city}, {currentMatch.area}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>{new Date(currentMatch.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>{currentMatch.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>{currentMatch.current_players}/{currentMatch.max_players} لاعب</span>
                  {spotsLeft <= 3 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      {spotsLeft} أماكن فقط!
                    </span>
                  )}
                </div>
                {currentMatch.cost_per_player > 0 && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Trophy className="w-5 h-5 text-blue-600" />
                    <span>{currentMatch.cost_per_player} {currentMatch.currency}</span>
                  </div>
                )}
              </div>

              {/* Organizer */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">المنظم</p>
                <p className="font-medium text-gray-900">{currentMatch.owner_id?.name}</p>
              </div>
            </div>
          </div>

          {/* Swipe Indicators */}
          <motion.div
            className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-2xl transform -rotate-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: x.get() < -50 ? 1 : 0 }}
          >
            تمرير
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-2xl transform rotate-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: x.get() > 50 ? 1 : 0 }}
          >
            إعجاب
          </motion.div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto mt-8">
        <div className="flex items-center justify-center gap-4">
          {/* Pass */}
          <Button
            onClick={() => handleSwipe('left')}
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-500 transition-all"
          >
            <X className="w-8 h-8 text-red-500" />
          </Button>

          {/* Super Like */}
          <Button
            onClick={() => handleSwipe('up')}
            size="lg"
            className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg"
          >
            <Star className="w-10 h-10 text-white fill-white" />
          </Button>

          {/* Like */}
          <Button
            onClick={() => handleSwipe('right')}
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
          >
            <Heart className="w-8 h-8 text-white" />
          </Button>
        </div>

        <div className="text-center mt-4 space-y-1">
          <p className="text-sm text-gray-500">اسحب أو اضغط</p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span><X className="w-3 h-3 inline text-red-500" /> تمرير</span>
            <span><Heart className="w-3 h-3 inline text-green-500" /> إعجاب</span>
            <span><Star className="w-3 h-3 inline text-yellow-500" /> Super Like</span>
          </div>
        </div>
      </div>
    </div>
  )
}

