'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import {
  getMatchById,
  joinMatch,
  leaveMatch,
} from '@/services/matches'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'

export default function MatchDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchMatch = useCallback(async () => {
    try {
      const data = await getMatchById(params.id as string)
      setMatch(data)
    } catch (error) {
      console.error('Error fetching match:', error)
      alert('فشل تحميل تفاصيل المباراة')
      router.back()
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    fetchMatch()
  }, [fetchMatch])

  const handleJoin = async () => {
    setActionLoading(true)
    try {
      await joinMatch(match._id)
      await fetchMatch()
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل الانضمام للمباراة')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLeave = async () => {
    if (!confirm('هل أنت متأكد من رغبتك في مغادرة هذه المباراة؟')) {
      return
    }

    setActionLoading(true)
    try {
      await leaveMatch(match._id)
      await fetchMatch()
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل مغادرة المباراة')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!match) {
    return null
  }

  const isFull = match.currentPlayers >= match.maxPlayers
  const statusColors: Record<string, string> = {
    upcoming: 'bg-green-100 text-green-800',
    full: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← رجوع
        </button>

        {/* Match Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {match.name}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[match.status]}`}
                >
                  {match.status === 'upcoming' && 'قادمة'}
                  {match.status === 'full' && 'مكتملة'}
                  {match.status === 'completed' && 'منتهية'}
                  {match.status === 'cancelled' && 'ملغاة'}
                </span>
                <span className="text-gray-600">{match.sport}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600">{match.level}</span>
              </div>
            </div>
          </div>

          {/* Match Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">التاريخ</p>
                  <p className="font-medium text-gray-900">{match.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">الوقت</p>
                  <p className="font-medium text-gray-900">{match.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">الموقع</p>
                  <p className="font-medium text-gray-900">
                    {match.region} - {match.city}
                  </p>
                  <p className="text-sm text-gray-600">{match.neighborhood}</p>
                  <p className="text-sm text-gray-600">{match.venue}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">اللاعبون</p>
                  <p className="font-medium text-gray-900">
                    {match.currentPlayers} / {match.maxPlayers}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">المنظم</p>
                  <p className="font-medium text-gray-900">
                    {match.creator.firstName} {match.creator.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-green-500 h-3 rounded-full transition-all"
                style={{
                  width: `${(match.currentPlayers / match.maxPlayers) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/matches-dashboard/match/${match._id}/chat`}
              className="flex-1"
            >
              <Button variant="outline" className="w-full gap-2">
                <MessageSquare className="w-4 h-4" />
                الشات
              </Button>
            </Link>

            {!isFull && match.status === 'upcoming' && (
              <Button
                onClick={handleJoin}
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
              >
                {actionLoading ? 'جاري...' : 'انضم'}
              </Button>
            )}

            {match.status === 'upcoming' && (
              <Button
                onClick={handleLeave}
                disabled={actionLoading}
                variant="destructive"
                className="flex-1"
              >
                {actionLoading ? 'جاري...' : 'غادر'}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Players List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            اللاعبون المشاركون ({match.players?.length || 0})
          </h2>

          {match.players && match.players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {match.players.map((player: any) => (
                <div
                  key={player._id}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center text-white font-bold">
                    {player.firstName?.[0]}
                    {player.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {player.firstName} {player.lastName}
                    </p>
                    {player._id === match.creator._id && (
                      <span className="text-xs text-blue-600">المنظم</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">لا يوجد لاعبون بعد</p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
