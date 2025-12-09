'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { getMyMatches, leaveMatch, type Match } from '@/services/matches'
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  Trophy,
  Search,
  Loader2,
  UserMinus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function MyMatchesPage() {
  const { language } = useLanguage()

  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [leavingMatchId, setLeavingMatchId] = useState<string | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    setLoading(true)
    try {
      const response = await getMyMatches()
      setMatches(response.matches || [])
    } catch (err) {
      console.error('Error loading matches:', err)
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveMatch = async (matchId: string) => {
    if (!confirm(language === 'ar' ? 'هل تريد مغادرة هذه المباراة؟' : 'Leave this match?')) {
      return
    }

    setLeavingMatchId(matchId)
    try {
      await leaveMatch(matchId)
      setMessage({
        type: 'success',
        text:
          language === 'ar'
            ? 'تم مغادرة المباراة بنجاح!'
            : 'Successfully left the match!',
      })
      loadMatches()
    } catch (err: any) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          (language === 'ar' ? 'فشل مغادرة المباراة' : 'Failed to leave match'),
      })
    } finally {
      setLeavingMatchId(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football':
        return '⚽'
      case 'basketball':
        return '🏀'
      case 'volleyball':
        return '🏐'
      case 'tennis':
        return '🎾'
      default:
        return '🏆'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700'
      case 'advanced':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 p-6"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/matches/dashboard">
            <Button variant="ghost" className="mb-4 hover:bg-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'مبارياتي' : 'My Matches'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'راجع وأدِر المباريات التي انضممت إليها'
              : 'Review and manage matches you have joined'}
          </p>
        </motion.div>

        {/* Message Toast */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}

        {/* Matches Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : matches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-xl shadow-md"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد مباريات' : 'No matches yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar'
                ? 'ابدأ بالانضمام لبعض المباريات!'
                : 'Start by joining some matches!'}
            </p>
            <Link href="/matches/dashboard/browse">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                {language === 'ar' ? 'تصفح المباريات' : 'Browse Matches'}
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
              <motion.div
                key={match._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Match Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{getSportIcon(match.sport)}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(match.level)}`}
                    >
                      {match.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-2">{match.name}</h3>
                </div>

                {/* Match Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {match.city}, {match.neighborhood}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-sm">
                      {new Date(match.date).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">{match.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Trophy className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">{match.venue}</span>
                  </div>

                  {/* Players Progress */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {language === 'ar' ? 'اللاعبون' : 'Players'}
                      </span>
                      <span className="text-sm font-medium">
                        {match.currentPlayers || match.players?.length || 0} /{' '}
                        {match.maxPlayers}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${((match.currentPlayers || match.players?.length || 0) / match.maxPlayers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Leave Button */}
                  {match.status === 'upcoming' && (
                    <Button
                      onClick={() => handleLeaveMatch(match._id)}
                      disabled={leavingMatchId === match._id}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 mt-4"
                    >
                      {leavingMatchId === match._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserMinus className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'مغادرة المباراة' : 'Leave Match'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
