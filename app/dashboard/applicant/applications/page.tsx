'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  MapPin,
  FileText,
} from 'lucide-react'
import Link from 'next/link'

interface Application {
  _id: string
  jobId: {
    _id: string
    title: string
    titleAr?: string
    clubId?: {
      clubName: string
      clubNameAr?: string
      logo?: string
    }
  }
  status: 'new' | 'under_review' | 'interviewed' | 'offered' | 'hired' | 'rejected'
  createdAt: string
  updatedAt: string
  interview?: {
    isScheduled: boolean
    scheduledDate?: string
    type?: string
    location?: string
  }
  statusHistory?: Array<{
    status: string
    date: string
    message?: string
  }>
}

export default function ApplicantApplicationsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/my-applications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to fetch applications')

      const data = await response.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'interviewed':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'offered':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'hired':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      new: { ar: 'جديد', en: 'New' },
      under_review: { ar: 'قيد المراجعة', en: 'Under Review' },
      interviewed: { ar: 'تمت المقابلة', en: 'Interviewed' },
      offered: { ar: 'عرض مقدم', en: 'Offered' },
      hired: { ar: 'تم التوظيف', en: 'Hired' },
      rejected: { ar: 'مرفوض', en: 'Rejected' },
    }
    return language === 'ar' ? labels[status]?.ar || status : labels[status]?.en || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hired':
      case 'offered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'interviewed':
        return <Eye className="w-5 h-5 text-purple-600" />
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <FileText className="w-5 h-5 text-blue-600" />
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true
    return app.status === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
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
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'طلباتي الوظيفية' : 'My Applications'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: language === 'ar' ? 'الكل' : 'All' },
              { value: 'new', label: language === 'ar' ? 'جديد' : 'New' },
              { value: 'under_review', label: language === 'ar' ? 'قيد المراجعة' : 'Under Review' },
              { value: 'interviewed', label: language === 'ar' ? 'تمت المقابلة' : 'Interviewed' },
              { value: 'offered', label: language === 'ar' ? 'عرض مقدم' : 'Offered' },
              { value: 'hired', label: language === 'ar' ? 'تم التوظيف' : 'Hired' },
              { value: 'rejected', label: language === 'ar' ? 'مرفوض' : 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === tab.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.value !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {applications.filter((a) => a.status === tab.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-500">
                {language === 'ar' ? 'لا توجد طلبات' : 'No applications found'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {language === 'ar'
                  ? 'ابدأ بالتقديم على الوظائف المتاحة'
                  : 'Start applying to available jobs'}
              </p>
              <Link href="/browse-jobs">
                <Button className="mt-4 gap-2">
                  <Briefcase className="w-4 h-4" />
                  {language === 'ar' ? 'تصفح الوظائف' : 'Browse Jobs'}
                </Button>
              </Link>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Job Title and Club */}
                    <div className="flex items-start gap-4 mb-4">
                      {application.jobId.clubId?.logo ? (
                        <img
                          src={application.jobId.clubId.logo}
                          alt="Club Logo"
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {language === 'ar'
                            ? application.jobId.titleAr || application.jobId.title
                            : application.jobId.title}
                        </h3>
                        <p className="text-gray-600">
                          {language === 'ar'
                            ? application.jobId.clubId?.clubNameAr ||
                              application.jobId.clubId?.clubName
                            : application.jobId.clubId?.clubName}
                        </p>
                      </div>
                    </div>

                    {/* Status and Info */}
                    <div className="flex flex-wrap gap-3 items-center mb-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}
                        {getStatusLabel(application.status)}
                      </span>

                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {language === 'ar' ? 'تاريخ التقديم:' : 'Applied:'}{' '}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {application.updatedAt !== application.createdAt && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            {language === 'ar' ? 'آخر تحديث:' : 'Updated:'}{' '}
                            {new Date(application.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Interview Info */}
                    {application.interview?.isScheduled && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-purple-900 mb-2">
                          {language === 'ar' ? '📅 مقابلة مجدولة' : '📅 Interview Scheduled'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-purple-700">
                          {application.interview.scheduledDate && (
                            <div>
                              <strong>{language === 'ar' ? 'التاريخ:' : 'Date:'}</strong>{' '}
                              {new Date(application.interview.scheduledDate).toLocaleString()}
                            </div>
                          )}
                          {application.interview.type && (
                            <div>
                              <strong>{language === 'ar' ? 'النوع:' : 'Type:'}</strong>{' '}
                              {application.interview.type}
                            </div>
                          )}
                          {application.interview.location && (
                            <div className="md:col-span-2">
                              <strong>{language === 'ar' ? 'الموقع:' : 'Location:'}</strong>{' '}
                              {application.interview.location}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status History */}
                    {application.statusHistory && application.statusHistory.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {language === 'ar' ? 'تاريخ الحالة:' : 'Status History:'}
                        </p>
                        <div className="space-y-2">
                          {application.statusHistory.slice(0, 3).map((history, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-xs text-gray-600"
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="font-medium">{getStatusLabel(history.status)}</span>
                              <span>•</span>
                              <span>{new Date(history.date).toLocaleDateString()}</span>
                              {history.message && (
                                <>
                                  <span>•</span>
                                  <span className="italic">{history.message}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div>
                    <Link href={`/jobs/${application.jobId._id}`}>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="w-4 h-4" />
                        {language === 'ar' ? 'عرض الوظيفة' : 'View Job'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
