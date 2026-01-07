'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import { getMatches, getMyMatches } from '@/services/matches'
import { motion } from 'framer-motion'
import { Calendar, Users, Trophy, Clock } from 'lucide-react'
import Link from 'next/link'

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
            <Link
              href="/matches-dashboard/matches"
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                تصفح المباريات
              </h3>
              <p className="text-sm text-gray-600">
                استعرض جميع المباريات المتاحة
              </p>
            </Link>

            <Link
              href="/matches-dashboard/create"
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 transition-all cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-lg">إنشاء مباراة</h3>
              <p className="text-sm text-gray-600">
                أنشئ مباراة جديدة وادعُ اللاعبين
              </p>
            </Link>

            <Link
              href="/matches-dashboard/teams"
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 transition-all cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-lg">إدارة الفرق</h3>
              <p className="text-sm text-gray-600">أدِر فرقك وأعضاء الفريق</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
