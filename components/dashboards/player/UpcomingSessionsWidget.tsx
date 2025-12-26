'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dumbbell, 
  Clock, 
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Users,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import playerService from '@/services/player'
import type { TrainingSession, EnhancedTrainingSession } from '@/types/player'

interface UpcomingSessionsWidgetProps {
  language: 'ar' | 'en'
  sessions?: TrainingSession[]
  onConfirmAttendance?: (_sessionId: string) => void
}

const sessionTypeLabels = {
  group: { ar: 'جماعي', en: 'Group' },
  individual: { ar: 'فردي', en: 'Individual' }
}

const intensityConfig = {
  low: { color: 'bg-green-100 text-green-700', label: { ar: 'خفيف', en: 'Low' } },
  medium: { color: 'bg-amber-100 text-amber-700', label: { ar: 'متوسط', en: 'Medium' } },
  high: { color: 'bg-red-100 text-red-700', label: { ar: 'مكثف', en: 'High' } }
}

export default function UpcomingSessionsWidget({ 
  language, 
  sessions: propSessions,
  onConfirmAttendance 
}: UpcomingSessionsWidgetProps) {
  const [sessions, setSessions] = useState<TrainingSession[]>(propSessions || [])
  const [loading, setLoading] = useState(!propSessions)
  const [error, setError] = useState<string | null>(null)
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    if (propSessions) {
      setSessions(propSessions)
      setLoading(false)
      return
    }

    try {
      setError(null)
      const data = await playerService.getUpcomingTrainingSessions(5)
      setSessions(data)
      setBackendAvailable(true)
    } catch (err: any) {
      console.error('Failed to fetch training sessions:', err)
      if (err?.response?.status === 404 || err?.message?.includes('Network')) {
        setBackendAvailable(false)
      } else {
        setError(err.message || 'Failed to load sessions')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [propSessions])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  useEffect(() => {
    if (propSessions) {
      setSessions(propSessions)
    }
  }, [propSessions])

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
      
      onConfirmAttendance?.(sessionId)
    } catch (err) {
      console.error('Failed to confirm attendance:', err)
    } finally {
      setConfirmingId(null)
    }
  }

  const getTimeUntilSession = (dateStr: string, startTime: string) => {
    const sessionDate = new Date(dateStr)
    const [hours, minutes] = startTime.split(':').map(Number)
    sessionDate.setHours(hours, minutes, 0, 0)

    const now = new Date()
    const diff = sessionDate.getTime() - now.getTime()

    if (diff < 0) return null

    const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
    const minsLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hoursLeft >= 24) {
      const days = Math.floor(hoursLeft / 24)
      return language === 'ar' ? `بعد ${days} يوم` : `in ${days} day(s)`
    }
    if (hoursLeft > 0) {
      return language === 'ar' ? `بعد ${hoursLeft} ساعة` : `in ${hoursLeft}h`
    }
    return language === 'ar' ? `بعد ${minsLeft} دقيقة` : `in ${minsLeft}m`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (!backendAvailable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {language === 'ar' ? 'الحصص القادمة' : 'Upcoming Sessions'}
              </h3>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'جدول تدريباتك' : 'Your training schedule'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-amber-700 font-medium">
            {language === 'ar' 
              ? 'جدول التدريبات قيد الإعداد - قريباً'
              : 'Training schedule being set up - coming soon'}
          </p>
          <p className="text-amber-600 text-sm mt-1">
            {language === 'ar'
              ? 'ستتمكن من متابعة جميع حصصك التدريبية'
              : 'You will be able to track all your training sessions'}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              {language === 'ar' ? 'الحصص القادمة' : 'Upcoming Sessions'}
            </h3>
            <p className="text-sm text-gray-500">
              {sessions.length > 0 
                ? (language === 'ar' ? `${sessions.length} حصة قادمة` : `${sessions.length} upcoming session(s)`)
                : (language === 'ar' ? 'لا توجد حصص قادمة' : 'No upcoming sessions')}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <Button variant="ghost" size="sm" onClick={handleRefresh} className="mt-2">
            {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {language === 'ar' 
                  ? 'لا توجد حصص تدريبية مجدولة'
                  : 'No training sessions scheduled'}
              </p>
            </motion.div>
          ) : (
            sessions.map((session, index) => {
              const timeUntil = getTimeUntilSession(session.date, session.startTime)
              const isToday = new Date(session.date).toDateString() === new Date().toDateString()
              const enhanced = session as EnhancedTrainingSession

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative rounded-xl p-4 transition-all ${
                    isToday 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${
                      isToday ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-700'
                    }`}>
                      <span className="text-xs font-medium">
                        {new Date(session.date).toLocaleDateString(language === 'ar' ? 'ar' : 'en', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {new Date(session.date).getDate()}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {language === 'ar' ? session.titleAr || session.title : session.title}
                        </h4>
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
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{session.startTime} - {session.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">
                            {language === 'ar' ? session.locationAr || session.location : session.location}
                          </span>
                        </div>
                        {enhanced.participants !== undefined && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{enhanced.participants}/{enhanced.maxParticipants || '∞'}</span>
                          </div>
                        )}
                      </div>

                      {timeUntil && (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                          isToday ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {timeUntil}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {session.attendance ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          {language === 'ar' ? 'تم التأكيد' : 'Confirmed'}
                        </span>
                      ) : isToday ? (
                        <Button
                          size="sm"
                          onClick={() => handleConfirmAttendance(session.id)}
                          disabled={confirmingId === session.id}
                          className="gap-1 bg-green-600 hover:bg-green-700"
                        >
                          {confirmingId === session.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {language === 'ar' ? 'تأكيد' : 'Confirm'}
                        </Button>
                      ) : null}
                      
                      <Link href={`/dashboard/player/sessions/${session.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1 h-7">
                          {language === 'ar' ? 'التفاصيل' : 'Details'}
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {enhanced.objectives && enhanced.objectives.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Target className="w-3 h-3" />
                        {language === 'ar' ? 'أهداف الحصة:' : 'Session objectives:'}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(language === 'ar' ? enhanced.objectivesAr || enhanced.objectives : enhanced.objectives).slice(0, 3).map((obj, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white rounded text-xs text-gray-600 border border-gray-200">
                            {obj}
                          </span>
                        ))}
                        {enhanced.objectives.length > 3 && (
                          <span className="px-2 py-0.5 text-xs text-gray-400">
                            +{enhanced.objectives.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {sessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href="/dashboard/player/sessions">
            <Button variant="ghost" className="w-full gap-2">
              {language === 'ar' ? 'عرض جميع الحصص' : 'View All Sessions'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  )
}
