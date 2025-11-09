'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import {
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  DollarSign,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Job {
  _id: string
  title: string
  titleAr: string
  description: string
  club: {
    _id: string
    name: string
    nameAr?: string
    logo: string
    location: {
      city: string
      cityAr?: string
      country: string
      countryAr?: string
    }
  }
  jobType: string
  category: string
  sport: string
  sportAr?: string
  position: string
  positionAr?: string
  employmentType: string
  location: {
    city: string
    cityAr?: string
    country: string
    countryAr?: string
  }
  salary?: {
    min?: number
    max?: number
    currency?: string
  }
  numberOfPositions: number
  applicationDeadline: string
  createdAt: string
}

export function RecentJobs() {
  const { language } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'https://tf1-backend.onrender.com/api/v1/search/jobs/recent?limit=3'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }

        const data = await response.json()

        if (data.success && data.jobs) {
          setJobs(data.jobs)
        }
      } catch (err) {
        console.error('Error fetching recent jobs:', err)
        setError(
          language === 'ar' ? 'فشل في تحميل الوظائف' : 'Failed to load jobs'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRecentJobs()
  }, [language])

  const formatSalary = (salary?: {
    min?: number
    max?: number
    currency?: string
  }) => {
    if (!salary || (!salary.min && !salary.max)) return null

    const currency = salary.currency || 'SAR'
    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${currency}`
    } else if (salary.min) {
      return `${salary.min.toLocaleString()}+ ${currency}`
    } else if (salary.max) {
      return `${language === 'ar' ? 'حتى' : 'Up to'} ${salary.max.toLocaleString()} ${currency}`
    }
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return language === 'ar' ? 'اليوم' : 'Today'
    } else if (diffDays === 1) {
      return language === 'ar' ? 'أمس' : 'Yesterday'
    } else if (diffDays < 7) {
      return language === 'ar' ? `منذ ${diffDays} أيام` : `${diffDays} days ago`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return language === 'ar'
        ? `منذ ${weeks} أسبوع`
        : `${weeks} week${weeks > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
  }

  const getEmploymentTypeLabel = (type: string) => {
    const types: { [key: string]: { ar: string; en: string } } = {
      full_time: { ar: 'دوام كامل', en: 'Full Time' },
      part_time: { ar: 'دوام جزئي', en: 'Part Time' },
      contract: { ar: 'عقد', en: 'Contract' },
      temporary: { ar: 'مؤقت', en: 'Temporary' },
      internship: { ar: 'تدريب', en: 'Internship' },
    }
    return language === 'ar' ? types[type]?.ar || type : types[type]?.en || type
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          {language === 'ar'
            ? 'لا توجد وظائف متاحة حالياً'
            : 'No jobs available at the moment'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <motion.div
          key={job._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
        >
          {/* Club Logo and Info */}
          <div className="flex items-start gap-4 mb-4">
            {job.club.logo ? (
              <img
                src={job.club.logo}
                alt={
                  language === 'ar'
                    ? job.club.nameAr || job.club.name
                    : job.club.name
                }
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-200 transition-colors"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                {language === 'ar' ? job.titleAr || job.title : job.title}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {language === 'ar'
                  ? job.club.nameAr || job.club.name
                  : job.club.name}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {job.description}
          </p>

          {/* Job Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">
                {language === 'ar'
                  ? `${job.location.cityAr || job.location.city}, ${job.location.countryAr || job.location.country}`
                  : `${job.location.city}, ${job.location.country}`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{getEmploymentTypeLabel(job.employmentType)}</span>
            </div>

            {job.salary && formatSalary(job.salary) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="truncate">{formatSalary(job.salary)}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span>{formatDate(job.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>
                {language === 'ar' ? 'ينتهي في: ' : 'Deadline: '}
                {new Date(job.applicationDeadline).toLocaleDateString(
                  language === 'ar' ? 'ar-SA' : 'en-US',
                  { month: 'short', day: 'numeric', year: 'numeric' }
                )}
              </span>
            </div>
          </div>

          {/* Apply Button */}
          <Button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
            {language === 'ar' ? 'التقديم الآن' : 'Apply Now'}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
