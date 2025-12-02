'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import sportsDirectorService, { Athlete } from '@/services/sports-director'
import {
  Users,
  Loader2,
  X,
  Search,
  ArrowLeft,
  User,
  Calendar,
  TrendingUp,
  Eye,
  Filter,
  Activity,
  Medal,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AthletesPage() {
  return (
    <ProtectedRoute allowedRoles={['sports-director']}>
      <AthletesContent />
    </ProtectedRoute>
  )
}

function AthletesContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterTeam, setFilterTeam] = useState<string>('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [athletePerformance, setAthletePerformance] = useState<any>(null)
  const [athleteAttendance, setAthleteAttendance] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [teams, setTeams] = useState<string[]>([])

  const fetchAthletes = useCallback(async () => {
    try {
      setLoading(true)
      const data = await sportsDirectorService.getAthletes()
      setAthletes(data)
      setFilteredAthletes(data)
      const uniqueTeams = Array.from(new Set(data.map(a => a.team).filter(Boolean)))
      setTeams(uniqueTeams)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data'))
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchAthletes()
  }, [fetchAthletes])

  useEffect(() => {
    let filtered = [...athletes]

    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.nameAr?.includes(searchQuery) ||
        a.position?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === filterStatus)
    }

    if (filterTeam !== 'all') {
      filtered = filtered.filter(a => a.team === filterTeam)
    }

    setFilteredAthletes(filtered)
  }, [athletes, searchQuery, filterStatus, filterTeam])

  const handleViewDetails = async (athlete: Athlete) => {
    setSelectedAthlete(athlete)
    setShowDetailModal(true)
    setLoadingDetails(true)

    try {
      const [performance, attendance] = await Promise.all([
        sportsDirectorService.getAthletePerformance(athlete.id).catch(() => null),
        sportsDirectorService.getAthleteAttendance(athlete.id).catch(() => null)
      ])
      setAthletePerformance(performance)
      setAthleteAttendance(attendance)
    } catch (err) {
      console.error('Failed to load athlete details:', err)
    } finally {
      setLoadingDetails(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{language === 'ar' ? 'نشط' : 'Active'}</span>
      case 'injured':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">{language === 'ar' ? 'مصاب' : 'Injured'}</span>
      case 'inactive':
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{language === 'ar' ? 'غير نشط' : 'Inactive'}</span>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/sports-director">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'الرياضيين' : 'Athletes'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredAthletes.length} {language === 'ar' ? 'رياضي' : 'athletes'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث عن رياضي...' : 'Search athletes...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
              <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
              <option value="injured">{language === 'ar' ? 'مصاب' : 'Injured'}</option>
              <option value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
            </select>
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الفرق' : 'All Teams'}</option>
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAthletes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              {language === 'ar' ? 'لا يوجد رياضيين' : 'No athletes found'}
            </div>
          ) : (
            filteredAthletes.map((athlete, index) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      {athlete.avatar ? (
                        <img src={athlete.avatar} alt={athlete.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {language === 'ar' ? athlete.nameAr || athlete.name : athlete.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {language === 'ar' ? athlete.positionAr || athlete.position : athlete.position}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(athlete.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'الفريق' : 'Team'}</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {language === 'ar' ? athlete.teamAr || athlete.team : athlete.team}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'المدرب' : 'Coach'}</p>
                    <p className="font-medium text-gray-900 text-sm">{athlete.coach}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{athlete.performance}% {language === 'ar' ? 'أداء' : 'Performance'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{athlete.attendance}% {language === 'ar' ? 'حضور' : 'Attendance'}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(athlete)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </main>

      <AnimatePresence>
        {showDetailModal && selectedAthlete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowDetailModal(false); setSelectedAthlete(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'تفاصيل الرياضي' : 'Athlete Details'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  {selectedAthlete.avatar ? (
                    <img src={selectedAthlete.avatar} alt={selectedAthlete.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {language === 'ar' ? selectedAthlete.nameAr || selectedAthlete.name : selectedAthlete.name}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'ar' ? selectedAthlete.positionAr || selectedAthlete.position : selectedAthlete.position}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    {getStatusBadge(selectedAthlete.status)}
                    <span className="text-sm text-gray-500">
                      {selectedAthlete.age} {language === 'ar' ? 'سنة' : 'years old'}
                    </span>
                  </div>
                </div>
              </div>

              {loadingDetails ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">
                        {language === 'ar' ? selectedAthlete.teamAr || selectedAthlete.team : selectedAthlete.team}
                      </p>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'الفريق' : 'Team'}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{selectedAthlete.performance}%</p>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'الأداء' : 'Performance'}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{selectedAthlete.attendance}%</p>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'الحضور' : 'Attendance'}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 text-center">
                      <Medal className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">{selectedAthlete.coach}</p>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'المدرب' : 'Coach'}</p>
                    </div>
                  </div>

                  {athletePerformance && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-4">{language === 'ar' ? 'سجل الأداء' : 'Performance History'}</h4>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                          {JSON.stringify(athletePerformance, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {athleteAttendance && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-4">{language === 'ar' ? 'سجل الحضور' : 'Attendance History'}</h4>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                          {JSON.stringify(athleteAttendance, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </>
              )}

              <Button variant="outline" onClick={() => setShowDetailModal(false)} className="w-full">
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
