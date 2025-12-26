'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import clubService from '@/services/club'
import { JobPosting, JobApplication } from '@/types/club'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit,
  XCircle,
  Eye,
  UserCheck,
} from 'lucide-react'
import Link from 'next/link'

export default function ViewJobPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [job, setJob] = useState<JobPosting | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [closingJob, setClosingJob] = useState(false)

  useEffect(() => {
    fetchJobDetails()
    fetchApplications()
  }, [params.id])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      const jobData = await clubService.getJobById(params.id as string)
      setJob(jobData)
    } catch (err: any) {
      console.error('Error fetching job:', err)
      setError(err.message || (language === 'ar' ? 'فشل تحميل الوظيفة' : 'Failed to load job'))
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await clubService.getApplications({ jobId: params.id as string })
      setApplications(response.applications)
    } catch (err: any) {
      console.error('Error fetching applications:', err)
    }
  }

  const handleCloseJob = async () => {
    if (!job) return

    const confirmClose = window.confirm(
      language === 'ar'
        ? 'هل أنت متأكد من إغلاق هذه الوظيفة؟ لن يتمكن المتقدمون الجدد من التقديم.'
        : 'Are you sure you want to close this job? New applicants will not be able to apply.'
    )

    if (!confirmClose) return

    try {
      setClosingJob(true)
      await clubService.closeJob(job._id, {
        reason: language === 'ar' ? 'تم شغل الوظيفة' : 'Position filled',
      })
      // Refresh job details
      await fetchJobDetails()
    } catch (err: any) {
      console.error('Error closing job:', err)
      alert(err.message || (language === 'ar' ? 'فشل إغلاق الوظيفة' : 'Failed to close job'))
    } finally {
      setClosingJob(false)
    }
  }

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      permanent: { en: 'Permanent', ar: 'دائم' },
      seasonal: { en: 'Seasonal', ar: 'موسمي' },
      temporary: { en: 'Temporary', ar: 'مؤقت' },
      trial: { en: 'Trial', ar: 'تجريبي' },
      internship: { en: 'Internship', ar: 'تدريب' },
      volunteer: { en: 'Volunteer', ar: 'تطوع' },
    }
    return labels[type]
      ? language === 'ar'
        ? labels[type].ar
        : labels[type].en
      : type
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      active: { en: 'Active', ar: 'نشط' },
      closed: { en: 'Closed', ar: 'مغلق' },
      draft: { en: 'Draft', ar: 'مسودة' },
    }
    return labels[status]
      ? language === 'ar'
        ? labels[status].ar
        : labels[status].en
      : status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-red-100 text-red-800 border-red-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const daysUntilDeadline = (job && job.applicationDeadline)
    ? Math.ceil(
        (new Date(job.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : 0

  const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline > 0
  const isExpired = daysUntilDeadline <= 0

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'خطأ' : 'Error'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || (language === 'ar' ? 'الوظيفة غير موجودة' : 'Job not found')}
          </p>
          <Button
            onClick={() => router.push('/dashboard/club/opportunities')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'العودة للوظائف' : 'Back to Jobs'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard/club/opportunities"
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ar' ? 'العودة للوظائف' : 'Back to Jobs'}
          </Link>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/club/opportunities/edit/${job._id}`)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {language === 'ar' ? 'تعديل' : 'Edit'}
            </Button>
            {job.status === 'active' && (
              <Button
                variant="destructive"
                onClick={handleCloseJob}
                disabled={closingJob}
                className="flex items-center gap-2"
              >
                {closingJob ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {language === 'ar' ? 'إغلاق الوظيفة' : 'Close Job'}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}
                    >
                      {getStatusLabel(job.status)}
                    </span>
                    {isUrgent && (
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white">
                        {language === 'ar' ? 'عاجل' : 'Urgent'}
                      </span>
                    )}
                    {isExpired && job.status === 'active' && (
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-orange-500 text-white">
                        {language === 'ar' ? 'منتهي' : 'Expired'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === 'ar' ? 'الموقع' : 'Location'}
                    </p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === 'ar' ? 'نوع الوظيفة' : 'Job Type'}
                    </p>
                    <p className="font-medium">{getJobTypeLabel(job.jobType)}</p>
                  </div>
                </div>

                {job.sport && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl">⚽</span>
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'الرياضة' : 'Sport'}
                      </p>
                      <p className="font-medium capitalize">{job.sport}</p>
                    </div>
                  </div>
                )}

                {job.position && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl">🎯</span>
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'المركز' : 'Position'}
                      </p>
                      <p className="font-medium">{job.position}</p>
                    </div>
                  </div>
                )}

                {job.salaryRange && (
                  <div className="flex items-center gap-3 text-gray-700 sm:col-span-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {language === 'ar' ? 'نطاق الراتب' : 'Salary Range'}
                      </p>
                      <p className="font-medium text-green-700">
                        {job.salaryRange}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Deadline Warning */}
              {isUrgent && job.status === 'active' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">
                      {language === 'ar' ? 'وقت محدود!' : 'Limited time!'}
                    </p>
                    <p className="text-red-600 text-sm">
                      {language === 'ar'
                        ? `${daysUntilDeadline} ${daysUntilDeadline === 1 ? 'يوم' : 'أيام'} متبقية للتقديم`
                        : `Only ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left to apply`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {job.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'المسؤوليات' : 'Responsibilities'}
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {typeof item === 'string' ? item : (language === 'ar' ? item.responsibilityAr || item.responsibility : item.responsibility)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Applications List */}
            {applications.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {language === 'ar' ? 'المتقدمون' : 'Applications'}
                  </h2>
                  <Link href={`/dashboard/club/applications?jobId=${job._id}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {language === 'ar' ? 'عرض الكل' : 'View All'}
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div
                      key={application._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {(typeof application.applicantId === 'object' &&
                              (application.applicantId.fullName || (application.applicantId as any).name)) ||
                              (language === 'ar' ? 'متقدم' : 'Applicant')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : '-'}
                          </p>
                        </div>
                      </div>
                      <Link href={`/dashboard/club/applications/${application._id}`}>
                        <Button size="sm" variant="outline">
                          {language === 'ar' ? 'عرض' : 'View'}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'إحصائيات الوظيفة' : 'Job Statistics'}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div className="text-sm flex-1">
                    <p className="font-medium text-gray-900">
                      {language === 'ar' ? 'الموعد النهائي' : 'Deadline'}
                    </p>
                    <p className="text-gray-600">
                      {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div className="text-sm flex-1">
                    <p className="font-medium text-gray-900">
                      {language === 'ar' ? 'المتقدمين' : 'Applications'}
                    </p>
                    <p className="text-gray-600">{applications.length}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="text-sm flex-1">
                    <p className="font-medium text-gray-900">
                      {language === 'ar' ? 'تاريخ النشر' : 'Posted'}
                    </p>
                    <p className="text-gray-600">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <div className="text-sm flex-1">
                    <p className="font-medium text-gray-900">
                      {language === 'ar' ? 'المشاهدات' : 'Views'}
                    </p>
                    <p className="text-gray-600">
                      {job.views || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link href={`/opportunities/${job._id}`} target="_blank">
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'معاينة الوظيفة العامة' : 'Preview Public View'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </h3>
              <div className="space-y-2">
                <Link href={`/dashboard/club/applications?jobId=${job._id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'عرض المتقدمين' : 'View Applications'}
                  </Button>
                </Link>
                <Link href={`/dashboard/club/opportunities/edit/${job._id}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تعديل الوظيفة' : 'Edit Job'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
