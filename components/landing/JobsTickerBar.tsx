'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { useJobEvents } from '@/hooks/useJobEvents'
import { getEventIcon, getEventLabel, getEventColor } from '@/types/job-events'
import type { JobEvent } from '@/types/job-events'
import { 
  Briefcase, 
  TrendingUp, 
  Clock, 
  Building2,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  Loader2,
  AlertCircle,
  Zap
} from 'lucide-react'

interface JobsTickerBarProps {
  className?: string
}

export const JobsTickerBar: React.FC<JobsTickerBarProps> = ({ className = '' }) => {
  const { language } = useLanguage()
  const { events, loading, error, connected, refresh } = useJobEvents({
    maxEvents: 20,
    autoConnect: true,
    pollInterval: 30000
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null)

  const displayEvents = events.slice(0, 10)

  useEffect(() => {
    if (isPaused || displayEvents.length === 0) return

    autoRotateRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayEvents.length)
    }, 5000)

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
      }
    }
  }, [isPaused, displayEvents.length])

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % displayEvents.length)
  }

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + displayEvents.length) % displayEvents.length)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (language === 'ar') {
      if (diffMins < 1) return 'الآن'
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`
      if (diffHours < 24) return `منذ ${diffHours} ساعة`
      return `منذ ${diffDays} يوم`
    } else {
      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      return `${diffDays}d ago`
    }
  }

  if (loading && events.length === 0) {
    return (
      <div className={`bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-white">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">
            {language === 'ar' ? 'جاري تحميل آخر الوظائف...' : 'Loading latest jobs...'}
          </span>
        </div>
      </div>
    )
  }

  if (error && events.length === 0) {
    return (
      <div className={`bg-gradient-to-r from-gray-800 to-gray-900 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-gray-300">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">
            {language === 'ar' ? 'تعذر تحميل الوظائف' : 'Failed to load jobs'}
          </span>
          <button 
            onClick={refresh}
            className="ml-2 text-cyan-400 hover:text-cyan-300 text-sm underline"
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    )
  }

  if (displayEvents.length === 0) {
    return (
      <div className={`bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-white">
          <Briefcase className="w-4 h-4" />
          <span className="text-sm">
            {language === 'ar' ? 'لا توجد وظائف جديدة حالياً' : 'No new jobs at the moment'}
          </span>
        </div>
      </div>
    )
  }

  const currentEvent = displayEvents[currentIndex]

  return (
    <div 
      ref={tickerRef}
      className={`bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Desktop Ticker */}
      <div className="hidden md:block relative">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-4">
            {/* Live Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-2.5 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                  {language === 'ar' ? 'مباشر' : 'LIVE'}
                </span>
              </div>
              {connected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-yellow-400" />
              )}
            </div>

            {/* Ticker Label */}
            <div className="flex items-center gap-2 text-cyan-300 shrink-0 border-r border-white/20 pr-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {language === 'ar' ? 'آخر الوظائف' : 'Latest Jobs'}
              </span>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={goToPrev}
              className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>

            {/* Event Display */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  {/* Event Type Badge */}
                  <span className={`${getEventColor(currentEvent.eventType)} text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1`}>
                    <span>{getEventIcon(currentEvent.eventType)}</span>
                    <span className="hidden lg:inline">{getEventLabel(currentEvent.eventType, language)}</span>
                  </span>

                  {/* Job Title */}
                  <Link 
                    href={currentEvent.link || `/jobs/${currentEvent.jobId}`}
                    className="text-white font-medium hover:text-cyan-300 transition-colors truncate"
                  >
                    {language === 'ar' ? currentEvent.jobTitleAr || currentEvent.jobTitle : currentEvent.jobTitle}
                  </Link>

                  {/* Organization */}
                  <span className="text-white/70 flex items-center gap-1 shrink-0">
                    <Building2 className="w-3 h-3" />
                    <span className="text-sm truncate max-w-[150px]">
                      {language === 'ar' ? currentEvent.organizationAr || currentEvent.organization : currentEvent.organization}
                    </span>
                  </span>

                  {/* Location */}
                  {currentEvent.location && (
                    <span className="text-white/50 text-sm hidden xl:block shrink-0">
                      📍 {language === 'ar' ? currentEvent.locationAr || currentEvent.location : currentEvent.location}
                    </span>
                  )}

                  {/* Time */}
                  <span className="text-white/50 flex items-center gap-1 text-sm shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(currentEvent.timestamp)}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Button */}
            <button 
              onClick={goToNext}
              className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            {/* Counter */}
            <div className="text-white/50 text-xs shrink-0 border-l border-white/20 pl-4">
              {currentIndex + 1}/{displayEvents.length}
            </div>

            {/* View All Link */}
            <Link 
              href="/jobs"
              className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm font-medium shrink-0 group"
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
              <TrendingUp className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Ticker */}
      <div className="md:hidden relative">
        <div className="px-4 py-2">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-2 py-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                <span className="text-red-400 text-[10px] font-bold uppercase">
                  {language === 'ar' ? 'مباشر' : 'LIVE'}
                </span>
              </div>
              <Zap className="w-3 h-3 text-cyan-300" />
              <span className="text-cyan-300 text-xs font-semibold">
                {language === 'ar' ? 'آخر الوظائف' : 'Jobs'}
              </span>
            </div>
            <Link 
              href="/jobs"
              className="text-cyan-300 text-xs font-medium"
            >
              {language === 'ar' ? 'المزيد' : 'More'} →
            </Link>
          </div>

          {/* Event Display */}
          <div 
            className="bg-white/5 rounded-lg p-2 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEvent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start gap-2">
                  <span className={`${getEventColor(currentEvent.eventType)} text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0`}>
                    {getEventIcon(currentEvent.eventType)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {language === 'ar' ? currentEvent.jobTitleAr || currentEvent.jobTitle : currentEvent.jobTitle}
                    </p>
                    <p className="text-white/60 text-xs truncate">
                      {language === 'ar' ? currentEvent.organizationAr || currentEvent.organization : currentEvent.organization}
                    </p>
                  </div>
                  <span className="text-white/40 text-[10px] shrink-0">
                    {formatTimeAgo(currentEvent.timestamp)}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1 mt-2">
            {displayEvents.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-cyan-400 w-3' : 'bg-white/30'
                }`}
                aria-label={`Go to job ${idx + 1}`}
              />
            ))}
            {displayEvents.length > 5 && (
              <span className="text-white/40 text-[10px] ml-1">
                +{displayEvents.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Expanded Mobile View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/10"
            >
              <div className="px-4 py-2 max-h-48 overflow-y-auto space-y-2">
                {displayEvents.map((event, idx) => (
                  <Link
                    key={event.id}
                    href={event.link || `/jobs/${event.jobId}`}
                    className={`block p-2 rounded-lg transition-colors ${
                      idx === currentIndex ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`${getEventColor(event.eventType)} text-white text-[10px] px-1 py-0.5 rounded`}>
                        {getEventIcon(event.eventType)}
                      </span>
                      <span className="text-white text-xs font-medium truncate flex-1">
                        {language === 'ar' ? event.jobTitleAr || event.jobTitle : event.jobTitle}
                      </span>
                      <span className="text-white/40 text-[10px]">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrolling Animation Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? `${((currentIndex + 1) / displayEvents.length) * 100}%` : '100%' }}
          transition={{ 
            duration: isPaused ? 0 : 5, 
            ease: 'linear',
            repeat: isPaused ? 0 : Infinity
          }}
          key={isPaused ? 'paused' : currentIndex}
        />
      </div>
    </div>
  )
}

export default JobsTickerBar
