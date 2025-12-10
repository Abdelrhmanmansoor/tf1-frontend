'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MessageCircle,
  Linkedin,
  ExternalLink,
  Download,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  X,
  Eye,
} from 'lucide-react'
import { Button } from './ui/button'
import clubApplicationsService, { ApplicationData } from '@/services/club-applications'
import { toast } from 'sonner'

interface ApplicationDetailsClubProps {
  applicationId: string
  onClose?: () => void
}

export default function ApplicationDetailsClub({
  applicationId,
  onClose,
}: ApplicationDetailsClubProps) {
  const { language } = useLanguage()
  const [application, setApplication] = useState<ApplicationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [showNotesForm, setShowNotesForm] = useState(false)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true)
        const data = await clubApplicationsService.getApplicationDetails(applicationId)
        setApplication(data)
        setAdminNotes(data.adminNotes || '')
      } catch (error) {
        console.error('Error:', error)
        toast.error(language === 'ar' ? 'فشل تحميل التفاصيل' : 'Failed to load details')
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [applicationId, language])

  const handleDownloadResume = async () => {
    if (!application) return

    try {
      setDownloading(true)
      // استخدام الدالة الجديدة التي تستخدم المسار الجديد
      const blob = await clubApplicationsService.downloadResume(application._id)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = application.resume.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(language === 'ar' ? 'تم تحميل الملف' : 'File downloaded')
    } catch (error) {
      console.error('Error downloading:', error)
      toast.error(language === 'ar' ? 'فشل التحميل' : 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const handleViewResume = async () => {
    if (!application) return

    try {
      // استخدام الدالة الجديدة لعرض السيرة الذاتية
      await clubApplicationsService.viewResume(application._id)
    } catch (error) {
      console.error('Error viewing resume:', error)
      toast.error(language === 'ar' ? 'فشل عرض السيرة الذاتية' : 'Failed to view resume')
    }
  }

  const handleStatusUpdate = async (status: string) => {
    try {
      setUpdatingStatus(true)
      const reason = status === 'rejected' ? rejectionReason : undefined
      const updated = await clubApplicationsService.updateApplicationStatus(
        applicationId,
        status,
        reason
      )
      setApplication(updated)
      setNewStatus(null)
      toast.success(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated')
    } catch (error) {
      console.error('Error:', error)
      toast.error(language === 'ar' ? 'فشل التحديث' : 'Update failed')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddNotes = async () => {
    try {
      setUpdatingStatus(true)
      const updated = await clubApplicationsService.addAdminNotes(applicationId, adminNotes)
      setApplication(updated)
      setShowNotesForm(false)
      toast.success(language === 'ar' ? 'تم حفظ الملاحظات' : 'Notes saved')
    } catch (error) {
      console.error('Error:', error)
      toast.error(language === 'ar' ? 'فشل الحفظ' : 'Save failed')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'reviewing':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      pending: { ar: 'قيد الانتظار', en: 'Pending' },
      reviewing: { ar: 'قيد المراجعة', en: 'Under Review' },
      accepted: { ar: 'مقبول', en: 'Accepted' },
      rejected: { ar: 'مرفوض', en: 'Rejected' },
    }
    return labels[status]?.[language === 'ar' ? 'ar' : 'en'] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">
          {language === 'ar' ? 'التطبيق غير موجود' : 'Application not found'}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'ar' ? 'تفاصيل التطبيق' : 'Application Details'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {language === 'ar' ? 'الوظيفة: ' : 'Job: '}
            {language === 'ar' ? application.jobTitleAr : application.jobTitle}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="p-8 space-y-8">
        {/* Status Badge */}
        <div className={`border rounded-xl p-4 ${getStatusColor(application.status)}`}>
          <div className="flex items-center gap-3 mb-2">
            {application.status === 'accepted' ? (
              <CheckCircle className="w-5 h-5" />
            ) : application.status === 'reviewing' ? (
              <Clock className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">{getStatusLabel(application.status)}</span>
          </div>
          <p className="text-sm">
            {language === 'ar' ? 'تاريخ التقديم: ' : 'Applied: '}
            {new Date(application.appliedAt).toLocaleDateString(
              language === 'ar' ? 'ar-SA' : 'en-US'
            )}
          </p>
        </div>

        {/* Applicant Information */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'ar' ? 'معلومات المتقدم' : 'Applicant Information'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {language === 'ar' ? 'الاسم' : 'Name'}
              </p>
              <p className="font-semibold text-gray-900">{application.applicantName}</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </p>
              <a
                href={`mailto:${application.applicantEmail}`}
                className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {application.applicantEmail}
              </a>
            </div>

            {/* Phone */}
            {application.applicantPhone && (
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </p>
                <a
                  href={`tel:${application.applicantPhone}`}
                  className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {application.applicantPhone}
                </a>
              </div>
            )}

            {/* WhatsApp */}
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {language === 'ar' ? 'واتس أب' : 'WhatsApp'}
              </p>
              <a
                href={`https://wa.me/${application.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-green-600 hover:text-green-700 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {application.whatsapp}
              </a>
            </div>
          </div>

          {/* LinkedIn & Portfolio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {application.linkedin && (
              <a
                href={application.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-blue-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600">LinkedIn</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </a>
            )}

            {application.portfolio && (
              <a
                href={application.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600">
                    {language === 'ar' ? 'محفظة' : 'Portfolio'}
                  </p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {language === 'ar' ? 'عرض الأعمال' : 'View Works'}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'خطاب التقديم' : 'Cover Letter'}
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* Resume */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">
                {language === 'ar' ? 'السيرة الذاتية' : 'Resume'}
              </p>
              <p className="font-semibold text-gray-900 mb-3">{application.resume.fileName}</p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>
                  {(application.resume.fileSize / 1024).toFixed(2)} KB
                </span>
                <span>•</span>
                <span>
                  {new Date(application.resume.uploadedAt).toLocaleDateString(
                    language === 'ar' ? 'ar-SA' : 'en-US'
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleViewResume}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'عرض' : 'View'}
              </Button>
              <Button
                onClick={handleDownloadResume}
                disabled={downloading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تحميل' : 'Download'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              {language === 'ar' ? 'ملاحظات المسؤول' : 'Admin Notes'}
            </h3>
            {!showNotesForm && (
              <Button
                onClick={() => setShowNotesForm(true)}
                variant="outline"
                size="sm"
              >
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </Button>
            )}
          </div>

          {showNotesForm ? (
            <div className="space-y-3">
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder={
                  language === 'ar'
                    ? 'أضف ملاحظاتك هنا...'
                    : 'Add your notes here...'
                }
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddNotes}
                  disabled={updatingStatus}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {updatingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    language === 'ar' ? 'حفظ' : 'Save'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowNotesForm(false)
                    setAdminNotes(application.adminNotes || '')
                  }}
                  variant="outline"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">
              {application.adminNotes || (
                <span className="text-gray-500 italic">
                  {language === 'ar' ? 'لا توجد ملاحظات' : 'No notes'}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Status Update Actions */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            {language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
          </h3>

          {newStatus === 'rejected' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                placeholder={language === 'ar' ? 'اشرح سبب الرفض...' : 'Explain the reason...'}
              />
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => {
                if (newStatus === 'reviewing') {
                  handleStatusUpdate('reviewing')
                } else {
                  setNewStatus('reviewing')
                }
              }}
              disabled={updatingStatus || application.status === 'reviewing'}
              variant="outline"
              className="flex-1"
            >
              {language === 'ar' ? 'قيد المراجعة' : 'Under Review'}
            </Button>

            <Button
              onClick={() => handleStatusUpdate('accepted')}
              disabled={updatingStatus || application.status === 'accepted'}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {language === 'ar' ? 'قبول' : 'Accept'}
            </Button>

            <Button
              onClick={() => setNewStatus('rejected')}
              disabled={updatingStatus || application.status === 'rejected'}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              {language === 'ar' ? 'رفض' : 'Reject'}
            </Button>

            {newStatus === 'rejected' && (
              <Button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={updatingStatus || !rejectionReason}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {updatingStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  language === 'ar' ? 'تأكيد الرفض' : 'Confirm Rejection'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
