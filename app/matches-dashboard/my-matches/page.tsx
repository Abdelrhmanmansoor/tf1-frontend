'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import MatchCard from '@/components/matches-dashboard/MatchCard'
import { getMyMatches, leaveMatch } from '@/services/matches'
import { motion } from 'framer-motion'

export default function MyMatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [leaveLoading, setLeaveLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const data = await getMyMatches()
      setMatches(data.matches || [])
    } catch (error) {
      console.error('Error fetching my matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async (matchId: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في مغادرة هذه المباراة؟')) {
      return
    }

    setLeaveLoading(matchId)
    try {
      await leaveMatch(matchId)
      await fetchMatches()
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل مغادرة المباراة')
    } finally {
      setLeaveLoading(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مبارياتي</h1>
          <p className="text-gray-600">المباريات التي انضممت إليها</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 mb-4">لم تنضم لأي مباراة بعد</p>
            <a
              href="/matches-dashboard/matches"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              تصفح المباريات المتاحة
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => (
              <motion.div
                key={match._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MatchCard
                  match={match}
                  onLeave={handleLeave}
                  isJoined={true}
                  loading={leaveLoading === match._id}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
