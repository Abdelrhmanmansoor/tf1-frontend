'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { ratingService } from '@/services/rating'
import type { TopRatedPlayer } from '@/services/rating'
import { RatingDisplay } from './RatingDisplay'
import { MapPin, CheckCircle, Trophy } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface TopRatedPlayersProps {
  sport?: string
  minReviews?: number
  limit?: number
}

export function TopRatedPlayers({
  sport,
  minReviews = 5,
  limit = 3,
}: TopRatedPlayersProps) {
  const { language } = useLanguage()
  const [players, setPlayers] = useState<TopRatedPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTopPlayers()
  }, [sport])

  const fetchTopPlayers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ratingService.getTopRatedPlayers({
        limit,
        sport,
        minReviews,
      })

      if (response.success) {
        setPlayers(response.players)
      }
    } catch (err: any) {
      console.error('Error fetching top players:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          {language === 'ar'
            ? 'فشل في تحميل اللاعبين المميزين'
            : 'Failed to load top players'}
        </p>
      </div>
    )
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          {language === 'ar'
            ? 'لا يوجد لاعبون مميزون حالياً'
            : 'No top-rated players found'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player, index) => (
          <motion.div
            key={player._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Rank Badge */}
            {index < 3 && (
              <div className="absolute top-4 left-4 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                      : index === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                        : 'bg-gradient-to-br from-amber-600 to-amber-800'
                  }`}
                >
                  #{index + 1}
                </div>
              </div>
            )}

            {/* Player Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500">
              <img
                src={player.avatar || '/default-avatar.png'}
                alt={player.fullName}
                className="w-full h-full object-cover"
              />
              {player.verified && (
                <div className="absolute top-4 right-4 bg-white rounded-full p-1">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {player.fullName}
              </h3>

              {player.verified && (
                <div className="flex items-center gap-1 text-blue-600 text-sm mb-3">
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === 'ar' ? 'موثق' : 'Verified'}</span>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">
                    {language === 'ar' ? 'الرياضة:' : 'Sport:'}
                  </span>{' '}
                  {player.primarySport}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">
                    {language === 'ar' ? 'المركز:' : 'Position:'}
                  </span>{' '}
                  {language === 'ar' && player.positionAr
                    ? player.positionAr
                    : player.position}
                </p>
                {player.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {player.location.city}, {player.location.country}
                    </span>
                  </div>
                )}
                {player.age && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">
                      {language === 'ar' ? 'العمر:' : 'Age:'}
                    </span>{' '}
                    {player.age} {language === 'ar' ? 'سنة' : 'years'}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="mb-4">
                <RatingDisplay
                  averageRating={player.ratingStats.averageRating}
                  totalReviews={player.ratingStats.totalReviews}
                  size="md"
                />
              </div>

              {/* Bio */}
              {player.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {language === 'ar' && player.bioAr
                    ? player.bioAr
                    : player.bio}
                </p>
              )}

              {/* View Profile Button */}
              <Link href={`/player/${player._id}`}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
