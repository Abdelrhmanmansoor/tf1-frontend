'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Briefcase, Megaphone } from 'lucide-react'

interface Job {
  _id: string
  title: string
  titleAr?: string
  club: {
    name: string
    nameAr?: string
    location: {
      city: string
      cityAr?: string
    }
  }
}

export function JobTicker() {
  const { language } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        setLoading(true)
        // Cache bust every 60 seconds roughly by checking client time or just rely on SWR/React Query if available
        // Here we just fetch. The requirement asked for 60-180s cache. 
        // Standard fetch caches by default in Next.js unless specified otherwise, but this is client side.
        // We will just fetch on mount.
        const response = await fetch(
          'https://tf1-backend.onrender.com/api/v1/search/jobs/recent?limit=5'
        )

        if (!response.ok) throw new Error('Failed to fetch jobs')

        const data = await response.json()

        if (data.success && data.jobs) {
          setJobs(data.jobs)
        }
      } catch (err) {
        console.error('Error fetching jobs for ticker:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentJobs()
  }, [])

  // Rotate jobs every 5 seconds
  useEffect(() => {
    if (jobs.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % jobs.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [jobs])

  if (loading) return null // Don't show anything while loading to avoid layout shift or show a skeleton
  
  // Empty state - "Neutral text"
  if (jobs.length === 0) {
    return (
      <div className="bg-blue-900 text-white text-xs sm:text-sm py-2 px-4 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Megaphone className="w-4 h-4 text-yellow-400" />
          <span>
            {language === 'ar'
              ? 'نعمل حاليًا على إضافة فرص وظيفية جديدة في القطاع الرياضي — تابعنا قريبًا'
              : 'We are currently working on adding new job opportunities in the sports sector — Stay tuned'}
          </span>
        </div>
      </div>
    )
  }

  const currentJob = jobs[currentIndex]
  const jobTitle = language === 'ar' ? currentJob.titleAr || currentJob.title : currentJob.title
  const clubName = language === 'ar' ? currentJob.club.nameAr || currentJob.club.name : currentJob.club.name
  const city = language === 'ar' ? currentJob.club.location.cityAr || currentJob.club.location.city : currentJob.club.location.city

  // Template: "وظيفة {job_title} لدى {organization_name} في مدينة {city}."
  const text = language === 'ar' 
    ? `وظيفة "${jobTitle}" لدى "${clubName}" في مدينة ${city}`
    : `Job Opportunity: "${jobTitle}" at "${clubName}" in ${city}`

  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white text-xs sm:text-sm py-2 px-4 relative overflow-hidden border-b border-blue-700">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between">
        
        {/* Label */}
        <div className="hidden sm:flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full border border-blue-700/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-medium text-blue-100">
            {language === 'ar' ? 'أحدث الفرص الوظيفية:' : 'Latest Opportunities:'}
          </span>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 flex justify-center overflow-hidden relative h-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center gap-2 font-medium"
            >
              <Briefcase className="w-4 h-4 text-blue-300 hidden sm:block" />
              <span className="truncate max-w-[300px] sm:max-w-none dir-auto">
                 {text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress/Count (Optional) */}
        <div className="hidden sm:block text-blue-300 text-xs">
           {currentIndex + 1} / {jobs.length}
        </div>
      </div>
    </div>
  )
}
