'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MatchCardProps {
  match: any
  onJoin?: (matchId: string) => void
  onLeave?: (matchId: string) => void
  isJoined?: boolean
  loading?: boolean
}

export default function MatchCard({
  match,
  onJoin,
  onLeave,
  isJoined,
  loading,
}: MatchCardProps) {
  const isFull = match.currentPlayers >= match.maxPlayers
  const statusColors: Record<string, string> = {
    upcoming: 'bg-green-100 text-green-800',
    full: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{match.name}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[match.status]}`}
            >
              {match.status === 'upcoming' && 'قادمة'}
              {match.status === 'full' && 'مكتملة'}
              {match.status === 'completed' && 'منتهية'}
              {match.status === 'cancelled' && 'ملغاة'}
            </span>
            <span className="text-sm text-gray-600">{match.sport}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">المنظم</p>
          <p className="font-medium text-gray-900">
            {match.creator.firstName} {match.creator.lastName}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{match.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{match.time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {match.region} - {match.city} - {match.neighborhood}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {match.currentPlayers} / {match.maxPlayers} لاعبين
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-green-500 h-2 rounded-full transition-all"
            style={{
              width: `${(match.currentPlayers / match.maxPlayers) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/matches-dashboard/match/${match._id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            التفاصيل
          </Button>
        </Link>

        {onJoin && !isJoined && !isFull && match.status === 'upcoming' && (
          <Button
            onClick={() => onJoin(match._id)}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
          >
            {loading ? 'جاري الانضمام...' : 'انضم'}
          </Button>
        )}

        {onLeave && isJoined && match.status === 'upcoming' && (
          <Button
            onClick={() => onLeave(match._id)}
            disabled={loading}
            variant="destructive"
            className="flex-1"
          >
            {loading ? 'جاري المغادرة...' : 'غادر'}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
