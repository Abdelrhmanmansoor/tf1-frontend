'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, TrendingUp, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface Job {
  id: string
  title: string
  titleAr: string
  company: string
  salary?: string
}

const SAMPLE_JOBS: Job[] = [
  {
    id: '1',
    title: 'Football Coach - Junior Team',
    titleAr: 'مدرب كرة قدم - فريق الناشئين',
    company: 'أكاديمية النخبة',
    salary: '3,500-5,000 SAR',
  },
  {
    id: '2',
    title: 'Fitness Trainer',
    titleAr: 'مدرب لياقة بدنية',
    company: 'مركز الرياض الرياضي',
    salary: '2,500-4,000 SAR',
  },
  {
    id: '3',
    title: 'Sports Physiotherapist',
    titleAr: 'أخصائي علاج طبيعي رياضي',
    company: 'أكاديمية الساحل',
    salary: '4,000-6,500 SAR',
  },
  {
    id: '4',
    title: 'Sports Nutritionist',
    titleAr: 'أخصائي تغذية رياضية',
    company: 'مركز التميز الرياضي',
    salary: '3,000-5,000 SAR',
  },
  {
    id: '5',
    title: 'Head Coach - Basketball',
    titleAr: 'مدرب رئيسي - كرة السلة',
    company: 'أكاديمية الرياض',
    salary: '5,000-8,000 SAR',
  },
]

export function JobsAnnouncements() {
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS)
  const [activeCount, setActiveCount] = useState(SAMPLE_JOBS.length)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % jobs.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [jobs.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Announce Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">
                {language === 'ar' ? '🔥 فرص توظيف نشطة' : '🔥 Active Opportunities'}
              </span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-green-300 rounded-full"
            />
            <span className="text-sm text-white font-semibold">{activeCount}+ {language === 'ar' ? 'وظيفة' : 'Jobs'}</span>
          </div>
          <a
            href="/jobs"
            className="text-xs font-bold text-white hover:text-cyan-200 transition-colors flex items-center gap-1"
          >
            {language === 'ar' ? 'شاهد الكل ←' : '→ View All'}
          </a>
        </div>

        {/* Scrolling Jobs */}
        <div className="relative overflow-hidden">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-lg p-3.5 border border-white/20"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">
                {language === 'ar' ? jobs[currentIndex].titleAr : jobs[currentIndex].title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-cyan-100">{jobs[currentIndex].company}</span>
                {jobs[currentIndex].salary && (
                  <>
                    <span className="text-cyan-300">•</span>
                    <span className="text-xs font-semibold text-green-200">
                      {jobs[currentIndex].salary}
                    </span>
                  </>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/jobs'}
              className="flex-shrink-0 px-4 py-2 bg-white text-blue-600 rounded-lg font-bold text-xs hover:bg-cyan-50 transition-all shadow-lg"
            >
              {language === 'ar' ? 'تقدم' : 'Apply'}
            </motion.button>
          </motion.div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {jobs.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: index === currentIndex ? 1.2 : 0.8,
                opacity: index === currentIndex ? 1 : 0.5,
              }}
              onClick={() => setCurrentIndex(index)}
              className="w-2 h-2 bg-white rounded-full cursor-pointer transition-all"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
