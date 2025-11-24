'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Loader2,
  Users,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  Briefcase,
  Mail,
  Phone,
  FileText,
  Download,
  MessageCircle,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import clubService from '@/services/club'
import type { JobApplication } from '@/types/club'

const ClubApplicationsPage = () => {
  const { language } = useLanguage()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchApplications()
  }, [statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (statusFilter !== 'all') params.status = statusFilter

      const response = await clubService.getApplications(params)
      setApplications(response.applications)
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (applicationId: string) => {
    try {
      await clubService.reviewApplication(applicationId)
      await fetchApplications()
    } catch (err: any) {
      alert(err.message || 'Failed to review application')
    }
  }

  const handleReject = async (applicationId: string) => {
    const reason = prompt(
      language === 'ar' ? 'سبب الرفض:' : 'Rejection reason:'
    )
    if (!reason) return

    try {
      await clubService.rejectApplication(applicationId, { reason })
      await fetchApplications()
    } catch (err: any) {
      alert(err.message || 'Failed to reject application')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
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
                {language === 'ar' ? 'طلبات التوظيف' : 'Job Applications'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">
              {language === 'ar' ? 'تصفية' : 'Filters'}
            </h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الحالة' : 'Status'}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
              <option value="new">{language === 'ar' ? 'جديد' : 'New'}</option>
              <option value="under_review">
                {language === 'ar' ? 'قيد المراجعة' : 'Under Review'}
              </option>
              <option value="interviewed">
                {language === 'ar' ? 'تمت المقابلة' : 'Interviewed'}
              </option>
              <option value="offered">
                {language === 'ar' ? 'عرض مقدم' : 'Offered'}
              </option>
              <option value="hired">
                {language === 'ar' ? 'تم التوظيف' : 'Hired'}
              </option>
              <option value="rejected">
                {language === 'ar' ? 'مرفوض' : 'Rejected'}
              </option>
            </select>
          </div>
        </motion.div>

        <div className="space-y-4">
          {applications.map((application) => (
            <motion.div
              key={application._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const applicantName =
                        (typeof application.applicantId === 'object' &&
                          application.applicantId.fullName) ||
                        ''
                      
                      return (
                        <>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                            {applicantName?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {applicantName || (language === 'ar' ? 'متقدم' : 'Applicant')}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {typeof application.jobId === 'object' &&
                                application.jobId.title}
                            </p>
                          </div>
                        </>
                      )
                    })()}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>
                  {/* Contact Info Row */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>
                        {typeof application.applicantId === 'object' &&
                          application.applicantId.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {application.attachments && application.attachments.length > 0 && (
                      <a
                        href={application.attachments.find(a => a.type === 'resume')?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{language === 'ar' ? 'عرض السيرة الذاتية' : 'View Resume'}</span>
                        <Download className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Additional Contact Fields */}
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {(application as any)?.whatsapp && (
                      <a
                        href={`https://wa.me/${(application as any).whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">{(application as any).whatsapp}</span>
                      </a>
                    )}
                    {(application as any)?.portfolio && (
                      <a
                        href={(application as any).portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="font-medium">{language === 'ar' ? 'محفظة' : 'Portfolio'}</span>
                      </a>
                    )}
                    {(application as any)?.linkedin && (
                      <a
                        href={(application as any).linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium">LinkedIn</span>
                      </a>
                    )}
                  </div>

                  {/* Cover Letter */}
                  {application.coverLetter && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'خطاب التقديم:' : 'Cover Letter:'}
                      </p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {application.status === 'new' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-green-600 hover:text-green-700"
                      onClick={() => handleReview(application._id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {language === 'ar' ? 'مراجعة' : 'Review'}
                    </Button>
                  )}
                  {!['rejected', 'hired'].includes(application.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-600 hover:text-red-700"
                      onClick={() => handleReject(application._id)}
                    >
                      <XCircle className="w-4 h-4" />
                      {language === 'ar' ? 'رفض' : 'Reject'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {applications.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-500">
                {language === 'ar' ? 'لا توجد طلبات' : 'No applications'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClubApplicationsPage
