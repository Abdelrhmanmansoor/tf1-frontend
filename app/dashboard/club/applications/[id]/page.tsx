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
  MapPin,
  GraduationCap,
  Zap,
  FileCheck,
  Clock,
  User,
  Badge,
  Copy,
} from 'lucide-react'
import Link from 'next/link'
import clubService from '@/services/club'
import type { JobApplication } from '@/types/club'
import { toast } from 'sonner'

const ApplicationDetailPage = () => {
  const { language } = useLanguage()
  const params = useParams()
  const applicationId = params.id as string
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [editingNotes, setEditingNotes] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [applicationId])

  useEffect(() => {
    if (application) {
      setSelectedStatus(application.status)
    }
  }, [application])

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
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'interviewed':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'offered':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300'
      case 'hired':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, { ar: string; en: string }> = {
      new: { ar: 'جديد', en: 'New' },
      under_review: { ar: 'قيد المراجعة', en: 'Under Review' },
      interviewed: { ar: 'تمت المقابلة', en: 'Interviewed' },
      offered: { ar: 'عرض مقدم', en: 'Offered' },
      hired: { ar: 'تم التوظيف', en: 'Hired' },
      rejected: { ar: 'مرفوض', en: 'Rejected' },
    }
    return statusLabels[status] || { ar: status, en: status }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!application || newStatus === application.status) return
    
    try {
      setStatusLoading(true)
      const updatedApp = await clubService.updateApplicationStatus(
        application._id,
        newStatus as any
      )
      setApplication(updatedApp)
      setSelectedStatus(updatedApp.status)
      toast.success(language === 'ar' ? 'تم تحديث الحالة بنجاح!' : 'Status updated successfully!')
    } catch (err: any) {
      console.error('Error updating status:', err)
      toast.error(err.message || (language === 'ar' ? 'خطأ في تحديث الحالة' : 'Error updating status'))
      setSelectedStatus(application.status)
    } finally {
      setStatusLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!application) return
    try {
      setSavingNotes(true)
      const updatedApp = await clubService.addAdminNotes(application._id, notes)
      setApplication(updatedApp)
      setEditingNotes(false)
      toast.success(language === 'ar' ? 'تم حفظ الملاحظات' : 'Notes saved successfully')
    } catch (err: any) {
      console.error('Error saving notes:', err)
      toast.error(language === 'ar' ? 'خطأ في حفظ الملاحظات' : 'Error saving notes')
    } finally {
      setSavingNotes(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(language === 'ar' ? `تم نسخ ${label}` : `Copied ${label}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/dashboard/club/applications">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'العودة' : 'Back'}
              </Button>
            </Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
    (typeof application.applicantId === 'object' && application.applicantId.fullName) ||
    (language === 'ar' ? 'متقدم' : 'Applicant')

  const applicantEmail =
    (typeof application.applicantId === 'object' && application.applicantId.email) || ''

  const jobTitle =
    (typeof application.jobId === 'object' && application.jobId.title) || ''

  const applicantPhone = application.applicantSnapshot?.phone || ''
  const experienceYears = application.applicantSnapshot?.experienceYears || 0
  const city = application.applicantSnapshot?.city || ''
  const qualification = application.applicantSnapshot?.qualification || ''
  const age = application.applicantSnapshot?.age || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/club/applications">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                {language === 'ar' ? 'العودة' : 'Back'}
              </Button>
            </Link>
            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(application.status)}`}>
              {getStatusLabel(application.status)[language]}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Applicant Info & Contact */}
          <div className="lg:col-span-2">
            {/* Applicant Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
            >
              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0 shadow-md">
                  {applicantName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{applicantName}</h1>
                  <p className="text-xl text-blue-600 font-semibold mb-4">{jobTitle}</p>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(application.createdAt).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-600 mb-1">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </p>
                      <div className="flex items-center gap-2 group">
                        <a href={`mailto:${applicantEmail}`} className="text-blue-600 hover:text-blue-700 font-medium break-all truncate">
                          {applicantEmail}
                        </a>
                        <button
                          onClick={() => copyToClipboard(applicantEmail, 'Email')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-200 rounded"
                          title={language === 'ar' ? 'نسخ' : 'Copy'}
                        >
                          <Copy className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200"
                  >
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-600 mb-1">
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                      </p>
                      {applicantPhone ? (
                        <div className="flex items-center gap-2 group">
                          <a href={`tel:${applicantPhone}`} className="text-green-600 hover:text-green-700 font-medium">
                            {applicantPhone}
                          </a>
                          <button
                            onClick={() => copyToClipboard(applicantPhone, 'Phone')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-green-200 rounded"
                          >
                            <Copy className="w-4 h-4 text-green-600" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">{language === 'ar' ? 'غير محدد' : 'Not provided'}</p>
                      )}
                    </div>
                  </motion.div>

                  {/* WhatsApp */}
                  {application.whatsapp && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-start gap-4 p-4 bg-teal-50 rounded-xl border border-teal-200"
                    >
                      <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          {language === 'ar' ? 'واتس أب' : 'WhatsApp'}
                        </p>
                        <a
                          href={`https://wa.me/${application.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
                        >
                          {application.whatsapp}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* LinkedIn */}
                  {application.linkedin && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200"
                    >
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-600 mb-1">LinkedIn</p>
                        <a
                          href={application.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 break-all truncate"
                        >
                          {application.linkedin.replace('https://', '')}
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* Portfolio */}
                  {application.portfolio && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200"
                    >
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          {language === 'ar' ? 'محفظة الأعمال' : 'Portfolio'}
                        </p>
                        <a
                          href={application.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 break-all truncate"
                        >
                          {application.portfolio.replace('https://', '')}
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                {language === 'ar' ? 'البيانات الشخصية' : 'Personal Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    {language === 'ar' ? 'العمر' : 'Age'}
                  </p>
                  {age ? (
                    <p className="text-2xl font-bold text-amber-700">{age} {language === 'ar' ? 'سنة' : 'years'}</p>
                  ) : (
                    <p className="text-gray-400 italic">{language === 'ar' ? 'غير محدد' : 'Not provided'}</p>
                  )}
                </div>

                {/* City */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {language === 'ar' ? 'المدينة' : 'City'}
                  </p>
                  {city ? (
                    <p className="text-2xl font-bold text-blue-700">{city}</p>
                  ) : (
                    <p className="text-gray-400 italic">{language === 'ar' ? 'غير محددة' : 'Not provided'}</p>
                  )}
                </div>

                {/* Experience */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}
                  </p>
                  {experienceYears ? (
                    <p className="text-2xl font-bold text-green-700">{experienceYears} {language === 'ar' ? 'سنة' : 'years'}</p>
                  ) : (
                    <p className="text-gray-400 italic">{language === 'ar' ? 'غير محددة' : 'Not provided'}</p>
                  )}
                </div>

                {/* Qualification */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {language === 'ar' ? 'المؤهل' : 'Qualification'}
                  </p>
                  {qualification ? (
                    <p className="text-lg font-bold text-purple-700">{qualification}</p>
                  ) : (
                    <p className="text-gray-400 italic">{language === 'ar' ? 'غير محدد' : 'Not provided'}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  {language === 'ar' ? 'خطاب التقديم' : 'Cover Letter'}
                </h2>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {application.coverLetter}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Attachments */}
            {application.attachments && application.attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  {language === 'ar' ? 'المرفقات' : 'Attachments'} ({application.attachments.length})
                </h2>
                <div className="space-y-3">
                  {application.attachments.map((attachment, idx) => (
                    <motion.a
                      key={idx}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl border border-blue-200 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">
                            {attachment.type === 'resume'
                              ? language === 'ar' ? 'السيرة الذاتية' : 'Resume'
                              : attachment.name || attachment.type}
                          </p>
                          <p className="text-sm text-gray-500">
                            {attachment.type}
                            {attachment.uploadedAt && (
                              <> • {new Date(attachment.uploadedAt).toLocaleDateString()}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <Download className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Status & Actions */}
          <div className="lg:col-span-1">
            {/* Status Update */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 sticky top-24"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Badge className="w-5 h-5 text-blue-600" />
                {language === 'ar' ? 'إدارة الطلب' : 'Manage Application'}
              </h3>

              {/* Current Status */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">
                  {language === 'ar' ? 'الحالة الحالية' : 'Current Status'}
                </p>
                <div className={`px-3 py-2 rounded-lg text-sm font-bold text-center border ${getStatusColor(application.status)}`}>
                  {getStatusLabel(application.status)[language]}
                </div>
              </div>

              {/* Status Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={statusLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
                >
                  {['new', 'under_review', 'interviewed', 'offered', 'hired', 'rejected'].map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)[language]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Update Button */}
              <Button
                onClick={() => handleStatusChange(selectedStatus)}
                disabled={statusLoading || selectedStatus === application.status}
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold"
              >
                {statusLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {language === 'ar' ? 'جاري التحديث...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
                  </>
                )}
              </Button>
            </motion.div>

            {/* Interview Info (if exists) */}
            {application.interview && application.interview.isScheduled && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 mb-8"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'جدولة المقابلة' : 'Interview Scheduled'}
                </h3>
                <div className="space-y-3">
                  {application.interview.scheduledDate && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">{language === 'ar' ? 'التاريخ' : 'Date'}</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(application.interview.scheduledDate).toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : 'en-US',
                            { year: 'numeric', month: 'long', day: 'numeric' }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.interview.type && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">{language === 'ar' ? 'نوع المقابلة' : 'Interview Type'}</p>
                        <p className="font-semibold text-gray-900 capitalize">{application.interview.type}</p>
                      </div>
                    </div>
                  )}
                  {application.interview.notes && (
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">{language === 'ar' ? 'ملاحظات' : 'Notes'}</p>
                      <p className="text-sm text-gray-700">{application.interview.notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Admin Notes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                {language === 'ar' ? 'الملاحظات الإدارية' : 'Admin Notes'}
              </h3>

              {editingNotes ? (
                <div className="space-y-3">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'أضف ملاحظاتك هنا...' : 'Add your notes here...'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-h-[120px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {savingNotes ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          {language === 'ar' ? 'حفظ' : 'Save'}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingNotes(false)
                        setNotes(application.interview?.notes || '')
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {application.interview?.notes ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                      <p className="text-sm text-gray-700">{application.interview.notes}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic mb-3">
                      {language === 'ar' ? 'لا توجد ملاحظات' : 'No notes yet'}
                    </p>
                  )}
                  <Button
                    onClick={() => {
                      setNotes(application.interview?.notes || '')
                      setEditingNotes(true)
                    }}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {language === 'ar' ? 'إضافة ملاحظة' : 'Add Note'}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailPage
