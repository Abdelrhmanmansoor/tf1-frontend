'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Trophy, TrendingUp, Award, Flame, Users, Target,
  Star, Calendar, BarChart3, ArrowLeft, Crown, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Achievement {
  level: number
  points: number
  points_to_next_level: number
  badges: Array<{
    badge_id: string
    name: string
    earned_at: string
  }>
  current_streak: number
  longest_streak: number
  matches: {
    created: number
    joined: number
    completed: number
  }
  ratings: {
    average: number
    total: number
  }
  reliability: number
}

export default function StatsPage() {
  const [achievements, setAchievements] = useState<Achievement | null>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/matches/login')
        return
      }

      const [achievementsRes, leaderboardRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com'}/matches/api/analytics/me/achievements`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com'}/matches/api/analytics/leaderboard?type=points&limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        })
      ])

      if (achievementsRes.ok) {
        const data = await achievementsRes.json()
        setAchievements(data.data)
      }

      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json()
        setLeaderboard(data.data.leaderboard || [])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('فشل في تحميل الإحصائيات')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إحصائياتي</h1>
              <p className="text-gray-600">نقاطك، شاراتك وإنجازاتك</p>
            </div>
          </div>
        </div>

        {/* Level & Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-8 mb-6 text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-purple-200 text-sm mb-1">المستوى</p>
              <div className="flex items-center gap-3">
                <h2 className="text-6xl font-black">{achievements?.level || 1}</h2>
                <Trophy className="w-12 h-12 text-yellow-300" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-sm mb-1">النقاط</p>
              <h3 className="text-4xl font-bold">{achievements?.points || 0}</h3>
              <p className="text-purple-200 text-xs mt-1">
                {achievements?.points_to_next_level || 100} للمستوى التالي
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <motion.div
              className="bg-gradient-to-r from-yellow-300 to-green-300 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((achievements?.points || 0) % 100)}%`
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Streaks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">السلسلة الحالية</h3>
                <p className="text-sm text-gray-600">نشاط أسبوعي متواصل</p>
              </div>
            </div>
            <div className="text-center py-6">
              <p className="text-6xl font-black text-orange-600 mb-2">
                {achievements?.current_streak || 0}
              </p>
              <p className="text-gray-600">أسبوع</p>
              <p className="text-sm text-gray-500 mt-2">
                الأطول: {achievements?.longest_streak || 0} أسبوع
              </p>
            </div>
          </motion.div>

          {/* Match Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">المباريات</h3>
                <p className="text-sm text-gray-600">إحصائياتك الشاملة</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">تم الإنشاء</span>
                <span className="font-bold text-blue-600">{achievements?.matches.created || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">تم الانضمام</span>
                <span className="font-bold text-green-600">{achievements?.matches.joined || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">تم الإكمال</span>
                <span className="font-bold text-purple-600">{achievements?.matches.completed || 0}</span>
              </div>
            </div>
          </motion.div>

          {/* Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">التقييم</h3>
                <p className="text-sm text-gray-600">من اللاعبين</p>
              </div>
            </div>
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-5xl font-black text-yellow-600">
                  {achievements?.ratings.average.toFixed(1) || '0.0'}
                </p>
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-600">من {achievements?.ratings.total || 0} تقييم</p>
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">الشارات</h3>
                <p className="text-sm text-gray-600">إنجازاتك</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {achievements?.badges && achievements.badges.length > 0 ? (
                achievements.badges.map((badge, i) => (
                  <div key={i} className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-3xl mb-1">🏆</div>
                    <p className="text-xs font-medium text-gray-700 truncate">{badge.name}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-400 py-8">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">لا توجد شارات بعد</p>
                  <p className="text-xs mt-1">العب أكثر لكسب الشارات!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 mt-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl">لوحة الصدارة</h3>
              <p className="text-sm text-gray-600">أفضل 10 لاعبين</p>
            </div>
          </div>

          <div className="space-y-2">
            {leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((player, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    i < 3
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    i === 0 ? 'bg-yellow-500 text-white' :
                    i === 1 ? 'bg-gray-400 text-white' :
                    i === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-300 text-gray-700'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{player.user?.name || 'لاعب'}</p>
                    <p className="text-sm text-gray-500">مستوى {player.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{player.score}</p>
                    <p className="text-xs text-gray-500">نقطة</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Crown className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p>لا توجد بيانات في لوحة الصدارة</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

