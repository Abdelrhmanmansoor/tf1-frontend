'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Briefcase,
  TrendingUp,
  Star,
  Loader2,
  User,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import playerService from '@/services/player'
import type { PlayerSearchResult, SearchPlayersParams } from '@/types/player'

const PlayerSearchPage = () => {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState<PlayerSearchResult[]>([])
  const [showFilters, setShowFilters] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
    limit: 20,
  })

  const [filters, setFilters] = useState<SearchPlayersParams>({
    sport: '',
    position: '',
    level: undefined,
    city: '',
    country: '',
    status: undefined,
    page: 1,
    limit: 20,
  })

  const handleSearch = async () => {
    try {
      setLoading(true)
      const result = await playerService.searchPlayers(filters)
      setPlayers(result.players)
      setPagination(result.pagination)
    } catch (err) {
      console.error('Error searching players:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilters({
      sport: '',
      position: '',
      level: undefined,
      city: '',
      country: '',
      status: undefined,
      page: 1,
      limit: 20,
    })
    setPlayers([])
    setPagination({ total: 0, page: 1, pages: 0, limit: 20 })
  }

  const loadMore = async () => {
    if (pagination.page >= pagination.pages) return

    try {
      setLoading(true)
      const result = await playerService.searchPlayers({
        ...filters,
        page: pagination.page + 1,
      })
      setPlayers([...players, ...result.players])
      setPagination(result.pagination)
      setFilters({ ...filters, page: pagination.page + 1 })
    } catch (err) {
      console.error('Error loading more players:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {language === 'ar' ? 'العودة' : 'Back'}
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="w-6 h-6 text-blue-600" />
                {language === 'ar' ? 'اكتشف اللاعبين' : 'Discover Players'}
              </h1>
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters
                ? language === 'ar'
                  ? 'إخفاء الفلاتر'
                  : 'Hide Filters'
                : language === 'ar'
                  ? 'إظهار الفلاتر'
                  : 'Show Filters'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'الفلاتر' : 'Filters'}
                </h2>

                <div className="space-y-4">
                  {/* Sport */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الرياضة' : 'Sport'}
                    </label>
                    <Input
                      value={filters.sport}
                      onChange={(e) =>
                        setFilters({ ...filters, sport: e.target.value })
                      }
                      placeholder="e.g., Football"
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المركز' : 'Position'}
                    </label>
                    <Input
                      value={filters.position}
                      onChange={(e) =>
                        setFilters({ ...filters, position: e.target.value })
                      }
                      placeholder="e.g., Striker"
                    />
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المستوى' : 'Level'}
                    </label>
                    <select
                      value={filters.level || ''}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          level: (e.target.value as any) || undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">
                        {language === 'ar' ? 'الكل' : 'All'}
                      </option>
                      <option value="beginner">Beginner</option>
                      <option value="amateur">Amateur</option>
                      <option value="semi-pro">Semi-Pro</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الدولة' : 'Country'}
                    </label>
                    <Input
                      value={filters.country}
                      onChange={(e) =>
                        setFilters({ ...filters, country: e.target.value })
                      }
                      placeholder="e.g., Egypt"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'المدينة' : 'City'}
                    </label>
                    <Input
                      value={filters.city}
                      onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                      }
                      placeholder="e.g., Cairo"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: (e.target.value as any) || undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">
                        {language === 'ar' ? 'الكل' : 'All'}
                      </option>
                      <option value="active">Active</option>
                      <option value="looking_for_club">Looking for Club</option>
                      <option value="open_to_offers">Open to Offers</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1"
                      disabled={loading}
                    >
                      {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
                    </Button>
                    <Button
                      onClick={handleSearch}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'بحث' : 'Search'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Results Header */}
            {players.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {pagination.total}{' '}
                      {language === 'ar'
                        ? 'لاعب تم العثور عليه'
                        : 'players found'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'الصفحة' : 'Page'} {pagination.page}{' '}
                      {language === 'ar' ? 'من' : 'of'} {pagination.pages}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results Grid */}
            <div className="space-y-4">
              {players.map((player, index) => (
                <motion.div
                  key={player._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0 overflow-hidden">
                        {player.userId.avatar ? (
                          <img
                            src={player.userId.avatar}
                            alt={`${player.userId.firstName} ${player.userId.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                            {player.userId.firstName[0]}
                            {player.userId.lastName[0]}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                              {player.userId.firstName} {player.userId.lastName}
                              {player.userId.isVerified && (
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                              )}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600 text-sm">
                              <span className="flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4" />
                                {player.primarySport}
                              </span>
                              <span className="flex items-center gap-1.5">
                                •
                              </span>
                              <span className="flex items-center gap-1.5">
                                {player.position}
                              </span>
                              {player.location && (
                                <>
                                  <span className="flex items-center gap-1.5">
                                    •
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    {player.location.city},{' '}
                                    {player.location.country}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {player.bio && (
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {player.bio}
                          </p>
                        )}

                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                            {player.level}
                          </span>
                          {player.ratingStats &&
                            player.ratingStats.totalReviews > 0 && (
                              <span className="flex items-center gap-1.5 text-yellow-600 font-medium">
                                <Star className="w-4 h-4 fill-yellow-500" />
                                {player.ratingStats.averageRating.toFixed(1)}
                                <span className="text-gray-500 text-sm">
                                  ({player.ratingStats.totalReviews}{' '}
                                  {language === 'ar' ? 'تقييم' : 'reviews'})
                                </span>
                              </span>
                            )}
                          {player.age && (
                            <span className="text-gray-600 text-sm">
                              {player.age}{' '}
                              {language === 'ar' ? 'سنة' : 'years old'}
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <Link
                            href={`/dashboard/player/profile/${player._id}`}
                          >
                            <Button className="gap-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                              {language === 'ar'
                                ? 'عرض الملف الشخصي'
                                : 'View Profile'}
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {players.length > 0 && pagination.page < pagination.pages && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center"
              >
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  className="px-8 py-6"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {language === 'ar' ? 'تحميل المزيد' : 'Load More'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && players.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center"
              >
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'ar' ? 'ابدأ البحث' : 'Start Searching'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'ar'
                    ? 'استخدم الفلاتر على اليسار للعثور على اللاعبين'
                    : 'Use the filters on the left to find players'}
                </p>
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'بحث عن اللاعبين' : 'Search Players'}
                </Button>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && players.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerSearchPage
