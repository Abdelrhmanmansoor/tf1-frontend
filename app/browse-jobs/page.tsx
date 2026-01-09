'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react'

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
    nationalAddress?: {
      isVerified: boolean
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

export default function BrowseJobsPage() {
  const { language } = useLanguage()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const getSportEmoji = (sport?: string) => {
    const s = (sport || '').toLowerCase()
    if (s.includes('foot')) return '⚽'
    if (s.includes('basket')) return '🏀'
    if (s.includes('swim')) return '🏊'
    if (s.includes('tennis')) return '🎾'
    if (s.includes('fitness')) return '🏋️'
    return '🏅'
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search/jobs`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }

        const data = await response.json()

        if (data.success && data.results) {
          setJobs(data.results)
        } else if (data.success && data.jobs) {
            setJobs(data.jobs)
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError(
          language === 'ar' ? 'فشل في تحميل الوظائف' : 'Failed to load jobs'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
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

  const filteredJobs = jobs.filter(job => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      job.title.toLowerCase().includes(term) ||
      (job.titleAr && job.titleAr.toLowerCase().includes(term)) ||
      job.club.name.toLowerCase().includes(term) ||
      (job.club.nameAr && job.club.nameAr.toLowerCase().includes(term))
    )
  })

  return (
    <div
      className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar activeMode="application" activePage="jobs" />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'تصفح الوظائف' : 'Browse Jobs'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {language === 'ar'
              ? 'اكتشف أحدث الفرص الوظيفية في المجال الرياضي'
              : 'Discover the latest career opportunities in the sports industry'}
          </p>
          
          <div className="mb-12">
            <PartnersMarquee />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث عن وظيفة، نادي...' : 'Search for jobs, clubs...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {language === 'ar' ? 'تصفية' : 'Filters'}
          </Button>
          <Button variant="outline" onClick={() => setSearchTerm('')}>
            {language === 'ar' ? 'إعادة التعيين' : 'Reset Filters'}
          </Button>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-80">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {language === 'ar'
                ? 'لا توجد وظائف مطابقة لبحثك'
                : 'No jobs found matching your search'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <Link key={job._id} href={`/jobs/${job._id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                >
                  {/* Club Logo and Info */}
                  <div className="flex items-start gap-4 mb-4">
                    {job.club.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={job.club.logo}
                        alt={
                          language === 'ar'
                            ? job.club.nameAr || job.club.name
                            : job.club.name
                        }
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-50 group-hover:border-blue-100 transition-colors"
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
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        {language === 'ar'
                          ? job.club.nameAr || job.club.name
                          : job.club.name}
                      </p>
                      <div className="inline-flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <span className="text-base">{getSportEmoji(job.sport)}</span>
                        <span className="font-mono">{job._id.slice(0, 8)}</span>
                      </div>

                      {/* National Address Verification Badge */}
                      {job.club.nationalAddress?.isVerified ? (
                        <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-100 w-fit">
                          <div className="relative flex items-center justify-center">
                            <Shield className="w-3 h-3 fill-green-100" />
                            <CheckCircle className="w-2 h-2 text-green-600 absolute" />
                          </div>
                          <span>{language === 'ar' ? 'العنوان الوطني موثّق' : 'Address Verified'}</span>
                        </div>
                      ) : (
                        <div className="group relative w-fit">
                          <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full border border-orange-100 cursor-help">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{language === 'ar' ? 'العنوان غير موثّق' : 'Address Not Verified'}</span>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-gray-900 text-white text-[10px] rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-xl">
                            {language === 'ar' ? 'لم يتم التحقق من العنوان الوطني رسمياً' : 'National address not officially verified'}
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {job.description}
                  </p>

                  {/* Job Details */}
                  <div className="space-y-2 mb-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="truncate">
                        {job.location ? (
                          language === 'ar'
                            ? `${job.location.cityAr || job.location.city}, ${job.location.countryAr || job.location.country}`
                            : `${job.location.city}, ${job.location.country}`
                        ) : (
                          language === 'ar' ? 'الموقع غير متاح' : 'Location not available'
                        )}
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

                  {/* View Details Button */}
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </Button>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
