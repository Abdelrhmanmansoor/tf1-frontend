/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import JobApplicationForm from '@/components/JobApplicationForm'
import {
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  ArrowLeft,
  Eye,
  Share2,
  Bookmark,
  Shield,
  AlertTriangle,
} from 'lucide-react'

interface Job {
  _id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
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
    email?: string
    phone?: string
    website?: string
    verified?: boolean
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
  specialization?: string
  employmentType: string
  location?: {
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
  requirements?: {
    description?: string
    descriptionAr?: string
    minimumExperience?: number
    educationLevel?: string
    certifications?: string[]
    skills?: string[]
    ageRange?: { min: number; max: number }
    gender?: string
    languages?: string[]
  }
  responsibilities?: Array<{
    responsibility: string
    responsibilityAr?: string
  }>
  benefits?: Array<{
    benefit: string
    benefitAr?: string
  }>
  workSchedule?: string
  workScheduleAr?: string
  numberOfPositions: number
  positionsFilled: number
  applicationDeadline: string
  expectedStartDate?: string
  applicationStats?: {
    totalApplications: number
  }
  status: string
  isFeatured: boolean
  views: number
  createdAt: string
  isExpired: boolean
  daysUntilDeadline: number
  isFull: boolean
}

export default function JobDetailsPage() {
  const { language } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showApplyForm, setShowApplyForm] = useState(false)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search/jobs/${params.id}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch job details')
        }

        const data = await response.json()

        if (data.success && data.job) {
          setJob(data.job)
        } else {
          setError(
            language === 'ar' ? 'الوظيفة غير موجودة' : 'Job not found'
          )
        }
      } catch (err) {
        console.error('Error fetching job details:', err)
        setError(
          language === 'ar'
            ? 'فشل في تحميل تفاصيل الوظيفة'
            : 'Failed to load job details'
        )
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchJobDetails()
    }
  }, [params.id, language])

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

  const getEmploymentTypeLabel = (type: string) => {
    const types: { [key: string]: { ar: string; en: string } } = {
      full_time: { ar: 'دوام كامل', en: 'Full Time' },
      part_time: { ar: 'دوام جزئي', en: 'Part Time' },
      contract: { ar: 'عقد', en: 'Contract' },
      freelance: { ar: 'عمل حر', en: 'Freelance' },
    }
    return language === 'ar' ? types[type]?.ar || type : types[type]?.en || type
  }

  const getJobTypeLabel = (type: string) => {
    const types: { [key: string]: { ar: string; en: string } } = {
      permanent: { ar: 'دائم', en: 'Permanent' },
      seasonal: { ar: 'موسمي', en: 'Seasonal' },
      temporary: { ar: 'مؤقت', en: 'Temporary' },
      trial: { ar: 'تجريبي', en: 'Trial' },
      internship: { ar: 'تدريب', en: 'Internship' },
      volunteer: { ar: 'تطوعي', en: 'Volunteer' },
    }
    return language === 'ar' ? types[type]?.ar || type : types[type]?.en || type
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded mb-6 w-2/3"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 flex items-center justify-center ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'العودة' : 'Go Back'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'العودة' : 'Back'}
        </Button>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-start gap-6 mb-6">
            {/* Club Logo */}
            {job.club.logo ? (
              <img
                src={job.club.logo}
                alt={
                  language === 'ar'
                    ? job.club.nameAr || job.club.name
                    : job.club.name
                }
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            )}

            {/* Job Title and Company */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? job.titleAr || job.title : job.title}
              </h1>
              <p className="text-xl text-gray-700 mb-2">
                {language === 'ar'
                  ? job.club.nameAr || job.club.name
                  : job.club.name}
                {job.club.verified && (
                  <CheckCircle className="w-5 h-5 text-blue-500 inline ml-2" />
                )}
              </p>

              {/* National Address Verification Badge */}
              <div className="mb-4">
                {job.club.nationalAddress?.isVerified ? (
                  <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full border border-green-100 w-fit">
                    <div className="relative flex items-center justify-center">
                      <Shield className="w-4 h-4 fill-green-100" />
                      <CheckCircle className="w-2.5 h-2.5 text-green-600 absolute" />
                    </div>
                    <span>{language === 'ar' ? 'العنوان الوطني موثّق' : 'National Address Verified'}</span>
                  </div>
                ) : (
                  <div className="group relative w-fit">
                    <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-sm px-3 py-1 rounded-full border border-orange-100 cursor-help">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{language === 'ar' ? 'العنوان الوطني غير موثّق' : 'National Address Not Verified'}</span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-xl">
                      {language === 'ar' ? 'تم تسجيل النادي بدون توثيق العنوان الوطني — ولم يتم التحقق من الموقع الجغرافي رسميًا.' : 'Club registered without national address verification — geographic location not officially verified.'}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Info Tags */}
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {getEmploymentTypeLabel(job.employmentType)}
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {getJobTypeLabel(job.jobType)}
                </span>
                {job.isFeatured && (
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    {language === 'ar' ? 'مميزة' : 'Featured'}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Job Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {job.location
                  ? language === 'ar'
                    ? `${job.location.cityAr || job.location.city}, ${job.location.countryAr || job.location.country}`
                    : `${job.location.city}, ${job.location.country}`
                  : language === 'ar'
                    ? 'الموقع غير متاح'
                    : 'Location not available'}
              </p>
            </div>

            {job.salary && formatSalary(job.salary) && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                  <DollarSign className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatSalary(job.salary)}
                </p>
              </div>
            )}

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {job.numberOfPositions}{' '}
                {language === 'ar' ? 'وظيفة شاغرة' : 'Positions'}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                <Eye className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {job.views} {language === 'ar' ? 'مشاهدة' : 'Views'}
              </p>
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-6">
            <Button 
              onClick={() => setShowApplyForm(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold py-6 text-lg rounded-xl"
            >
              {language === 'ar' ? 'التقديم الآن' : 'Apply Now'}
            </Button>
          </div>
        </motion.div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'الوصف الوظيفي' : 'Job Description'}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {language === 'ar'
                  ? job.descriptionAr || job.description
                  : job.description}
              </p>
            </motion.div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'المسؤوليات' : 'Responsibilities'}
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {language === 'ar'
                          ? item.responsibilityAr || item.responsibility
                          : item.responsibility}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                </h2>

                {job.requirements.description && (
                  <p className="text-gray-700 mb-4">
                    {language === 'ar'
                      ? job.requirements.descriptionAr ||
                        job.requirements.description
                      : job.requirements.description}
                  </p>
                )}

                <div className="space-y-4">
                  {job.requirements.minimumExperience !== undefined && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {language === 'ar' ? 'الخبرة المطلوبة' : 'Experience'}
                      </h3>
                      <p className="text-gray-700">
                        {job.requirements.minimumExperience}{' '}
                        {language === 'ar' ? 'سنوات' : 'years'}
                      </p>
                    </div>
                  )}

                  {job.requirements.skills &&
                    job.requirements.skills.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {language === 'ar' ? 'المهارات' : 'Skills'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {job.requirements.certifications &&
                    job.requirements.certifications.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {language === 'ar' ? 'الشهادات' : 'Certifications'}
                        </h3>
                        <ul className="space-y-2">
                          {job.requirements.certifications.map(
                            (cert, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{cert}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </motion.div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'المزايا' : 'Benefits'}
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {language === 'ar'
                          ? item.benefitAr || item.benefit
                          : item.benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'معلومات الوظيفة' : 'Job Information'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {language === 'ar'
                        ? 'تاريخ الإغلاق'
                        : 'Application Deadline'}
                    </p>
                    <p className="font-medium text-gray-900">
                      {new Date(job.applicationDeadline).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {job.daysUntilDeadline > 0
                        ? language === 'ar'
                          ? `${job.daysUntilDeadline} يوم متبقي`
                          : `${job.daysUntilDeadline} days left`
                        : language === 'ar'
                          ? 'منتهية'
                          : 'Expired'}
                    </p>
                  </div>
                </div>

                {job.expectedStartDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {language === 'ar'
                          ? 'تاريخ البدء المتوقع'
                          : 'Expected Start Date'}
                      </p>
                      <p className="font-medium text-gray-900">
                        {new Date(job.expectedStartDate).toLocaleDateString(
                          language === 'ar' ? 'ar-SA' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'الرياضة' : 'Sport'}
                    </p>
                    <p className="font-medium text-gray-900">
                      {language === 'ar'
                        ? job.sportAr || job.sport
                        : job.sport || 'N/A'}
                    </p>
                  </div>
                </div>

                {job.workSchedule && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {language === 'ar' ? 'مواعيد العمل' : 'Work Schedule'}
                      </p>
                      <p className="font-medium text-gray-900">
                        {language === 'ar'
                          ? job.workScheduleAr || job.workSchedule
                          : job.workSchedule}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {language === 'ar' ? 'تاريخ النشر' : 'Posted'}
                    </p>
                    <p className="font-medium text-gray-900">
                      {new Date(job.createdAt).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'عن المنشأة' : 'About the Company'}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700">{job.club.name}</p>
                </div>
                {job.club.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      {language === 'ar'
                        ? `${job.club.location.cityAr || job.club.location.city}, ${job.club.location.countryAr || job.club.location.country}`
                        : `${job.club.location.city}, ${job.club.location.country}`}
                    </p>
                  </div>
                )}
                {job.club.website && (
                  <a
                    href={job.club.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm block"
                  >
                    {language === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Apply Form Modal */}
      {showApplyForm && job && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowApplyForm(false)}>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <JobApplicationForm
              jobId={job._id}
              jobTitle={language === 'ar' ? job.titleAr || job.title : job.title}
              clubId={job.club._id}
              clubName={language === 'ar' ? job.club.nameAr || job.club.name : job.club.name}
              onSuccess={() => setShowApplyForm(false)}
              onCancel={() => setShowApplyForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
