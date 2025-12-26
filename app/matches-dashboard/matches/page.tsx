'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import MatchCard from '@/components/matches-dashboard/MatchCard'
import { getMatches, joinMatch, getRegionsData } from '@/services/matches'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'

export default function AllMatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [joinLoading, setJoinLoading] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    region: '',
    city: '',
    sport: '',
    level: '',
  })
  const [regionsData, setRegionsData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesData, regions] = await Promise.all([
          getMatches(filters),
          getRegionsData(),
        ])
        setMatches(matchesData.matches || [])
        setRegionsData(regions)
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  const handleJoin = async (matchId: string) => {
    setJoinLoading(matchId)
    try {
      await joinMatch(matchId)
      const matchesData = await getMatches(filters)
      setMatches(matchesData.matches || [])
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل الانضمام للمباراة')
    } finally {
      setJoinLoading(null)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            جميع المباريات
          </h1>
          <p className="text-gray-600">استعرض وانضم للمباريات المتاحة</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">فلتر البحث</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المنطقة
              </label>
              <select
                value={filters.region}
                onChange={(e) =>
                  setFilters({ ...filters, region: e.target.value, city: '' })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع المناطق</option>
                {regionsData?.regions?.map((region: any) => (
                  <option key={region.name} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة
              </label>
              <select
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
                disabled={!filters.region}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">جميع المدن</option>
                {regionsData?.regions
                  ?.find((r: any) => r.name === filters.region)
                  ?.cities?.map((city: any) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرياضة
              </label>
              <select
                value={filters.sport}
                onChange={(e) =>
                  setFilters({ ...filters, sport: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع الرياضات</option>
                {regionsData?.sports?.map((sport: any) => (
                  <option key={sport.value} value={sport.value}>
                    {sport.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المستوى
              </label>
              <select
                value={filters.level}
                onChange={(e) =>
                  setFilters({ ...filters, level: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع المستويات</option>
                {regionsData?.levels?.map((level: any) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">جاري تحميل المباريات...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">لا توجد مباريات متاحة</p>
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
                  onJoin={handleJoin}
                  loading={joinLoading === match._id}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
