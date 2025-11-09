'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  MapPin,
  MessageCircle,
  Filter,
  Loader2,
  DollarSign,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import coachService from '@/services/coach'
import type { TrainingSession } from '@/types/coach'

const SessionsPage = () => {
  const { language } = useLanguage()
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'upcoming' | 'completed' | 'cancelled'
  >('all')
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSessions: 0,
    hasMore: false,
  })

  // Fetch sessions from API
  useEffect(() => {
    fetchSessions()
  }, [filterStatus, pagination.currentPage])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await coachService.getSessions({
        status: filterStatus,
        page: pagination.currentPage,
        limit: 20,
      })

      console.log('[SessionsPage] Fetched sessions:', response.sessions)
      console.log('[SessionsPage] Stats:', response.stats)

      setSessions(response.sessions)
      setStats(response.stats)
      setPagination(response.pagination)
    } catch (err: any) {
      console.error('[SessionsPage] Error fetching sessions:', err)
      setError(err.message || 'Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'no_show':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <AlertCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
      case 'no_show':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return language === 'ar' ? 'قادمة' : 'Upcoming'
      case 'completed':
        return language === 'ar' ? 'مكتملة' : 'Completed'
      case 'cancelled':
        return language === 'ar' ? 'ملغاة' : 'Cancelled'
      case 'no_show':
        return language === 'ar' ? 'لم يحضر' : 'No Show'
      default:
        return status
    }
  }

  const getLocationText = (location: TrainingSession['location']) => {
    if (language === 'ar' && location.addressAr) {
      return location.addressAr
    }
    if (location.address) {
      return location.address
    }
    if (location.facilityName) {
      return location.facilityName
    }
    return location.type
  }

  const handleCancelSession = async (sessionId: string) => {
    const reason = prompt(
      language === 'ar' ? 'سبب الإلغاء:' : 'Cancellation reason:'
    )
    if (!reason) return

    try {
      await coachService.updateSessionStatus(sessionId, {
        status: 'cancelled',
        cancellationReason: reason,
      })

      alert(
        language === 'ar' ? 'تم إلغاء الجلسة' : 'Session cancelled successfully'
      )
      fetchSessions()
    } catch (err: any) {
      alert(err.message || 'Failed to cancel session')
    }
  }

  const renderSessionCard = (session: TrainingSession, index: number) => {
    const studentName = `${session.student.userId.firstName} ${session.student.userId.lastName}`
    const displayAvatar =
      session.student.userId.avatar ||
      `https://ui-avatars.com/api/?name=${studentName}&background=4F46E5&color=fff`

    const sessionDate = new Date(session.date)
    const sessionTime = sessionDate.toLocaleTimeString(
      language === 'ar' ? 'ar-EG' : 'en-US',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )

    return (
      <motion.div
        key={session._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * index }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-14 h-14 rounded-full border-4 border-purple-100 overflow-hidden flex-shrink-0">
                <Image
                  src={displayAvatar}
                  alt={studentName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {studentName}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(session.status)}`}
                  >
                    {getStatusIcon(session.status)}
                    {getStatusText(session.status)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 capitalize">
                    {session.type}
                  </span>
                  {session.student.sport && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {session.student.sport}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </div>
                <div className="font-semibold text-gray-900 truncate">
                  {sessionDate.toLocaleDateString(
                    language === 'ar' ? 'ar-EG' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'الوقت والمدة' : 'Time & Duration'}
                </div>
                <div className="font-semibold text-gray-900 truncate">
                  {sessionTime} ({session.duration}{' '}
                  {language === 'ar' ? 'دقيقة' : 'min'})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'الموقع' : 'Location'}
                </div>
                <div className="font-semibold text-gray-900 truncate capitalize">
                  {getLocationText(session.location)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-600">
                  {language === 'ar' ? 'السعر' : 'Price'}
                </div>
                <div className="font-semibold text-gray-900 truncate">
                  {session.price} {session.currency}
                </div>
              </div>
            </div>
          </div>

          {session.notes && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="text-sm font-semibold text-yellow-800 mb-1">
                {language === 'ar' ? 'ملاحظات:' : 'Notes:'}
              </div>
              <div className="text-sm text-yellow-700">{session.notes}</div>
            </div>
          )}

          {session.coachNotes && session.status === 'completed' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="text-sm font-semibold text-green-800 mb-1">
                {language === 'ar' ? 'ملاحظات المدرب:' : 'Coach Notes:'}
              </div>
              <div className="text-sm text-green-700">{session.coachNotes}</div>
            </div>
          )}

          {/* Session Rating */}
          {session.status === 'completed' && session.rating?.studentRating && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="text-sm font-semibold text-purple-800 mb-2">
                {language === 'ar' ? 'تقييم الطالب:' : 'Student Rating:'}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-purple-600">
                  {session.rating.studentRating}/5
                </div>
                {session.rating.feedback && (
                  <div className="text-sm text-purple-700 ml-2">
                    {language === 'ar' && session.rating.feedbackAr
                      ? session.rating.feedbackAr
                      : session.rating.feedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4">
            {session.status === 'upcoming' && (
              <div className="flex gap-3">
                <Link
                  href={`/dashboard/coach/sessions/${session._id}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2">
                    <Eye className="w-4 h-4" />
                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => handleCancelSession(session._id)}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            )}

            {session.status === 'completed' && (
              <Link href={`/dashboard/coach/sessions/${session._id}`}>
                <Button
                  variant="outline"
                  className="w-full border-green-300 text-green-700 hover:bg-green-50 gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {language === 'ar'
                    ? 'عرض تفاصيل الجلسة'
                    : 'View Session Details'}
                </Button>
              </Link>
            )}

            {(session.status === 'cancelled' ||
              session.status === 'no_show') && (
              <Link href={`/dashboard/coach/sessions/${session._id}`}>
                <Button variant="outline" className="w-full gap-2">
                  <Eye className="w-4 h-4" />
                  {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
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
                <Calendar className="w-6 h-6 text-purple-600" />
                {language === 'ar'
                  ? 'جلساتي التدريبية'
                  : 'My Training Sessions'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>
            <div className="text-purple-100 text-sm">
              {language === 'ar' ? 'إجمالي الجلسات' : 'Total Sessions'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{stats.upcoming}</div>
            </div>
            <div className="text-blue-100 text-sm">
              {language === 'ar' ? 'جلسات قادمة' : 'Upcoming'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{stats.completed}</div>
            </div>
            <div className="text-green-100 text-sm">
              {language === 'ar' ? 'مكتملة' : 'Completed'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{stats.cancelled}</div>
            </div>
            <div className="text-red-100 text-sm">
              {language === 'ar' ? 'ملغاة' : 'Cancelled'}
            </div>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className="gap-2"
            >
              {language === 'ar' ? 'الكل' : 'All'}
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {stats.total}
              </span>
            </Button>
            <Button
              variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('upcoming')}
              className="gap-2"
            >
              {language === 'ar' ? 'قادمة' : 'Upcoming'}
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {stats.upcoming}
              </span>
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('completed')}
              className="gap-2"
            >
              {language === 'ar' ? 'مكتملة' : 'Completed'}
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                {stats.completed}
              </span>
            </Button>
            <Button
              variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('cancelled')}
              className="gap-2"
            >
              {language === 'ar' ? 'ملغاة' : 'Cancelled'}
              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                {stats.cancelled}
              </span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-red-600 font-semibold mb-2">
              {language === 'ar' ? 'حدث خطأ' : 'Error'}
            </div>
            <div className="text-red-500 text-sm mb-4">{error}</div>
            <Button onClick={fetchSessions} variant="outline">
              {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </Button>
          </div>
        )}

        {/* Sessions List */}
        {!loading && !error && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session, index) =>
              renderSessionCard(session, index)
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sessions.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {language === 'ar' ? 'لا توجد جلسات' : 'No sessions found'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar'
                ? 'جرب تغيير فلاتر البحث'
                : 'Try changing your filter selection'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              disabled={pagination.currentPage === 1}
            >
              {language === 'ar' ? 'السابق' : 'Previous'}
            </Button>
            <span className="text-gray-600">
              {language === 'ar' ? 'صفحة' : 'Page'} {pagination.currentPage}{' '}
              {language === 'ar' ? 'من' : 'of'} {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              disabled={!pagination.hasMore}
            >
              {language === 'ar' ? 'التالي' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionsPage
