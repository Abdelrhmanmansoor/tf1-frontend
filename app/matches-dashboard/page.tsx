'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import { getMatches, getMyMatches } from '@/services/matches'
import { motion } from 'framer-motion'
import { Calendar, Users, Trophy, Clock } from 'lucide-react'

export default function MatchesDashboardPage() {
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
      title: 'إجمالي المباريات',
      value: stats.totalMatches,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'مبارياتي',
      value: stats.myMatches,
      icon: Users,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'المباريات القادمة',
      value: stats.upcomingMatches,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'المباريات المكتملة',
      value: stats.completedMatches,
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً بك في لوحة تحكم المباريات
          </h1>
          <p className="text-gray-600">
            إدارة مبارياتك وفرقك والتواصل مع اللاعبين
          </p>
        </motion.div>

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
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : card.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            إجراءات سريعة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/matches-dashboard/matches"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
            >
              <Calendar className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">
                تصفح المباريات
              </h3>
              <p className="text-sm text-gray-600">
                استعرض جميع المباريات المتاحة
              </p>
            </a>

            <a
              href="/matches-dashboard/create"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer"
            >
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">إنشاء مباراة</h3>
              <p className="text-sm text-gray-600">
                أنشئ مباراة جديدة وادعُ اللاعبين
              </p>
            </a>

            <a
              href="/matches-dashboard/teams"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
            >
              <Trophy className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">إدارة الفرق</h3>
              <p className="text-sm text-gray-600">أدِر فرقك وأعضاء الفريق</p>
            </a>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
