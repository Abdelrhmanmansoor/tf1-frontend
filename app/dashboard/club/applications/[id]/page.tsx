'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  FileText,
  Download,
  MessageCircle,
  ExternalLink,
  Briefcase,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import clubService from '@/services/club'
import type { JobApplication } from '@/types/club'

const ApplicationDetailPage = () => {
  const { language } = useLanguage()
  const params = useParams()
  const applicationId = params.id as string
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApplication()
  }, [applicationId])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await clubService.getApplications({ limit: 1000 })
      const app = response.applications.find((a) => a._id === applicationId)
      
      if (!app) {
        setError(language === 'ar' ? 'الطلب غير موجود' : 'Application not found')
        setApplication(null)
      } else {
        setApplication(app)
      }
    } catch (err: any) {
      console.error('Error fetching application:', err)
      setError(
        err.message || (language === 'ar' ? 'خطأ في تحميل الطلب' : 'Error loading application')
      )
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/dashboard/club/applications">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'العودة' : 'Back'}
              </Button>
            </Link>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-red-900 mb-2">
                {language === 'ar' ? 'خطأ' : 'Error'}
              </h2>
              <p className="text-red-700">{error || (language === 'ar' ? 'الطلب غير موجود' : 'Application not found')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const applicantName =
    (typeof application.applicantId === 'object' &&
      (application.applicantId.fullName || application.applicantId.name)) ||
    (language === 'ar' ? 'متقدم' : 'Applicant')

  const applicantEmail =
    typeof application.applicantId === 'object' && application.applicantId.email

  const jobTitle =
    (typeof application.jobId === 'object' && application.jobId.title) || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/club/applications">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'العودة' : 'Back'}
              </Button>
            </Link>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                application.status
              )}`}
            >
              {application.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          {/* Applicant Header */}
          <div className="flex items-start gap-6 pb-8 border-b border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {applicantName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{applicantName}</h1>
              <p className="text-lg text-gray-600 mb-4">{jobTitle}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {new Date(application.createdAt).toLocaleDateString()} {' '}
                    {new Date(application.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="py-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </p>
                  <a href={`mailto:${applicantEmail}`} className="text-blue-600 hover:text-blue-700 font-medium break-all">
                    {applicantEmail}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              {(application as any)?.whatsapp && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'ar' ? 'واتس أب' : 'WhatsApp'}
                    </p>
                    <a
                      href={`https://wa.me/${(application as any).whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
                    >
                      {(application as any).whatsapp}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {(application as any)?.portfolio && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'ar' ? 'محفظة الأعمال' : 'Portfolio'}
                    </p>
                    <a
                      href={(application as any).portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 break-all"
                    >
                      {(application as any).portfolio}
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              )}

              {/* LinkedIn */}
              {(application as any)?.linkedin && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">LinkedIn</p>
                    <a
                      href={(application as any).linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 break-all"
                    >
                      {(application as any).linkedin}
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'خطاب التقديم' : 'Cover Letter'}
              </h2>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {application.coverLetter}
                </p>
              </div>
            </div>
          )}

          {/* Resume */}
          {application.attachments && application.attachments.length > 0 && (
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'المرفقات' : 'Attachments'}
              </h2>
              <div className="space-y-3">
                {application.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {attachment.type === 'resume'
                          ? language === 'ar'
                            ? 'السيرة الذاتية'
                            : 'Resume'
                          : attachment.type}
                      </p>
                      <p className="text-sm text-gray-500">{attachment.type}</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'حالة التطبيق' : 'Status'}
                  </p>
                  <p className="font-medium text-gray-900 capitalize">{application.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'تاريخ التقديم' : 'Submission Date'}
                  </p>
                  <p className="font-medium text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ApplicationDetailPage
