'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import {
  Dumbbell,
  Clock,
  MapPin,
  User,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  ArrowLeft,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import playerService from '@/services/player'
import type { TrainingSession, EnhancedTrainingSession } from '@/types/player'

type SessionFilter = 'all' | 'scheduled' | 'completed' | 'cancelled'

const sessionTypeLabels = {
  group: { ar: 'جماعي', en: 'Group' },
  individual: { ar: 'فردي', en: 'Individual' }
}

const intensityConfig = {
  low: { color: 'bg-green-100 text-green-700', label: { ar: 'خفيف', en: 'Low' } },
  medium: { color: 'bg-amber-100 text-amber-700', label: { ar: 'متوسط', en: 'Medium' } },
  high: { color: 'bg-red-100 text-red-700', label: { ar: 'مكثف', en: 'High' } }
}

export default function TrainingSessionsPage() {
  const { language } = useLanguage()
  const router = useRouter()

  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<SessionFilter>('all')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    try {
      setError(null)
      const data = await playerService.getEnhancedTrainingSessions({
        status: filter === 'all' ? undefined : filter,
        limit: 20
      })
      setSessions(data)
      setBackendAvailable(true)
    } catch (err: any) {
      console.error('Failed to fetch training sessions:', err)
      if (err?.response?.status === 404 || err?.message?.includes('Network')) {
        setBackendAvailable(false)
        const fallbackData = await playerService.getUpcomingTrainingSessions(20)
        setSessions(fallbackData)
      } else {
        setError(err.message || 'Failed to load sessions')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filter])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSessions()
  }

  const handleConfirmAttendance = async (sessionId: string) => {
    try {
      setConfirmingId(sessionId)
      await playerService.confirmSessionAttendance(sessionId)
      setSessions(prev => prev.map(s =>
        s.id === sessionId
          ? { ...s, attendance: 'present' as const }
          : s
      ))
    } catch (err) {
      console.error('Failed to confirm attendance:', err)
    } finally {
      setConfirmingId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return language === 'ar' ? 'اليوم' : 'Today'
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return language === 'ar' ? 'غداً' : 'Tomorrow'
    }

    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const filterOptions: { value: SessionFilter; label: { ar: string; en: string } }[] = [
    { value: 'all', label: { ar: 'الكل', en: 'All' } },
    { value: 'scheduled', label: { ar: 'مجدولة', en: 'Scheduled' } },
    { value: 'completed', label: { ar: 'مكتملة', en: 'Completed' } },
    { value: 'cancelled', label: { ar: 'ملغاة', en: 'Cancelled' } }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (!backendAvailable && sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'حصص التدريب' : 'Training Sessions'}
            </h1>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-amber-800 mb-2">
              {language === 'ar'
                ? 'جدول التدريبات قيد الإعداد'
                : 'Training Schedule Being Set Up'}
            </h2>
            <p className="text-amber-700 mb-6">
              {language === 'ar'
                ? 'ستتمكن قريباً من عرض جميع حصص التدريب المجدولة'
                : 'Soon you will be able to view all scheduled training sessions'}
            </p>
            <Button onClick={() => router.back()} variant="outline">
              {language === 'ar' ? 'العودة' : 'Go Back'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const groupSessionsByDate = () => {
    const grouped: { [key: string]: TrainingSession[] } = {}
    sessions.forEach(session => {
      const dateKey = new Date(session.date).toDateString()
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(session)
    })
    return grouped
  }

  const groupedSessions = groupSessionsByDate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'حصص التدريب' : 'Training Sessions'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' ? 'جميع حصصك التدريبية' : 'All your training sessions'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {filterOptions.map(option => (
            <Button
              key={option.value}
              variant={filter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(option.value)}
              className="flex-shrink-0"
            >
              {option.label[language]}
            </Button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="mt-2">
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد حصص' : 'No Sessions'}
              </h3>
              <p className="text-gray-500">
                {filter === 'all'
                  ? (language === 'ar' ? 'لا توجد حصص تدريبية حالياً' : 'No training sessions available')
                  : (language === 'ar' ? 'لا توجد حصص بهذه الحالة' : 'No sessions with this status')}
              </p>
            </motion.div>
          ) : (
            Object.entries(groupedSessions).map(([dateKey, dateSessions]) => (
              <div key={dateKey}>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  {formatDate(dateSessions[0].date)}
                </h2>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {dateSessions.map((session, index) => {
                      const enhanced = session as EnhancedTrainingSession
                      const isToday = new Date(session.date).toDateString() === new Date().toDateString()

                      return (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
                            isToday ? 'border-green-200 bg-gradient-to-r from-green-50/50 to-white' : 'border-gray-100'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                              isToday ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
                            }`}>
                              <span className="text-xs font-medium">
                                {session.startTime}
                              </span>
                              <span className="text-lg font-bold leading-none">
                                {session.endTime}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-bold text-gray-900">
                                  {language === 'ar' ? session.titleAr || session.title : session.title}
                                </h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  session.type === 'individual' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {sessionTypeLabels[session.type][language]}
                                </span>
                                {enhanced.intensity && (
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${intensityConfig[enhanced.intensity].color}`}>
                                    {intensityConfig[enhanced.intensity].label[language]}
                                  </span>
                                )}
                                {session.status === 'cancelled' && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                    {language === 'ar' ? 'ملغاة' : 'Cancelled'}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>
                                    {language === 'ar' ? session.locationAr || session.location : session.location}
                                  </span>
                                </div>
                                {enhanced.coach && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{enhanced.coach.name}</span>
                                  </div>
                                )}
                                {enhanced.participants !== undefined && (
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{enhanced.participants}/{enhanced.maxParticipants || '∞'}</span>
                                  </div>
                                )}
                              </div>

                              {enhanced.objectives && enhanced.objectives.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  <Target className="w-4 h-4 text-gray-400" />
                                  {(language === 'ar' ? enhanced.objectivesAr || enhanced.objectives : enhanced.objectives).slice(0, 3).map((obj, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                      {obj}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 flex-shrink-0">
                              {session.attendance ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-700">
                                  <CheckCircle className="w-4 h-4" />
                                  {language === 'ar' ? 'تم التأكيد' : 'Confirmed'}
                                </span>
                              ) : isToday && session.status === 'scheduled' ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmAttendance(session.id)}
                                  disabled={confirmingId === session.id}
                                  className="gap-1 bg-green-600 hover:bg-green-700"
                                >
                                  {confirmingId === session.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                  {language === 'ar' ? 'تأكيد الحضور' : 'Confirm'}
                                </Button>
                              ) : null}

                              <Link href={`/dashboard/player/sessions/${session.id}`}>
                                <Button variant="outline" size="sm" className="gap-1 w-full">
                                  {language === 'ar' ? 'التفاصيل' : 'Details'}
                                  <ChevronRight className="w-3 h-3" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
