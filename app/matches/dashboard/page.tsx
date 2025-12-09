'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { getMatches, getMyMatches } from '@/services/matches'
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  Plus,
  Search,
  Filter,
  MapPin,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

export default function MatchesDashboardPage() {
  const { language } = useLanguage()
  const router = useRouter()
  
  const [stats, setStats] = useState({
    totalMatches: 0,
    myMatches: 0,
    upcomingMatches: 0,
    completedMatches: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allMatches, myMatchesData] = await Promise.all([
          getMatches({ limit: 1 }),
          getMyMatches(),
        ])

        setStats({
          totalMatches: allMatches.total || 0,
          myMatches: myMatchesData.total || 0,
          upcomingMatches:
            myMatchesData.matches?.filter((m: any) => m.status === 'upcoming')
              .length || 0,
          completedMatches:
            myMatchesData.matches?.filter((m: any) => m.status === 'completed')
              .length || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: language === 'ar' ? 'إجمالي المباريات' : 'Total Matches',
      value: stats.totalMatches,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: language === 'ar' ? 'مبارياتي' : 'My Matches',
      value: stats.myMatches,
      icon: Users,
      color: 'from-green-500 to-green-600',
    },
    {
      title: language === 'ar' ? 'المباريات القادمة' : 'Upcoming',
      value: stats.upcomingMatches,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: language === 'ar' ? 'المباريات المكتملة' : 'Completed',
      value: stats.completedMatches,
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 p-6"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar'
                ? 'مرحباً بك في لوحة تحكم المباريات'
                : 'Welcome to Matches Dashboard'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar'
                ? 'إدارة مبارياتك وفرقك والتواصل مع اللاعبين'
                : 'Manage your matches, teams, and connect with players'}
            </p>
          </motion.div>

          <Link href="/matches/create">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إنشاء مباراة' : 'Create Match'}
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : card.value}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/matches/dashboard/browse">
              <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                <Search className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {language === 'ar' ? 'تصفح المباريات' : 'Browse Matches'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'استعرض جميع المباريات المتاحة'
                    : 'Explore all available matches'}
                </p>
              </div>
            </Link>

            <Link href="/matches/create">
              <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                <Plus className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {language === 'ar' ? 'إنشاء مباراة' : 'Create Match'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'أنشئ مباراة جديدة وادعُ اللاعبين'
                    : 'Create a new match and invite players'}
                </p>
              </div>
            </Link>

            <Link href="/matches/dashboard/my-matches">
              <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                <Trophy className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {language === 'ar' ? 'مبارياتي' : 'My Matches'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'راجع وأدِر مبارياتك'
                    : 'Review and manage your matches'}
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
