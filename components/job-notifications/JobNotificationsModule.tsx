'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import api from '@/services/api'
import {
  Bell,
  Briefcase,
  User,
  Building2,
  Clock,
  CheckCircle,
  X,
  ExternalLink,
  Star,
  FileText,
  ChevronRight,
  Loader2,
  Zap,
  Target,
  Users,
  Send
} from 'lucide-react'

interface JobNotification {
  id: string
  type: 'new_job' | 'application_received' | 'application_status' | 'job_match' | 'urgent_job'
  title: string
  titleAr: string
  message: string
  messageAr: string
  jobId?: string
  jobTitle?: string
  jobTitleAr?: string
  clubName?: string
  clubNameAr?: string
  applicantName?: string
  applicantId?: string
  applicantRole?: string
  cvUrl?: string
  deadline?: string
  matchScore?: number
  salary?: string
  location?: string
  locationAr?: string
  read: boolean
  createdAt: string
  status?: 'pending' | 'accepted' | 'rejected'
}

interface JobNotificationsModuleProps {
  dashboardType: string
  compact?: boolean
  maxItems?: number
}

export function JobNotificationsModule({ dashboardType, compact = false, maxItems = 10 }: JobNotificationsModuleProps) {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<JobNotification[]>([])
  const [selectedNotification, setSelectedNotification] = useState<JobNotification | null>(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applicationNote, setApplicationNote] = useState('')

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get(`/${dashboardType}/job-notifications`)
      const data = response.data.data?.notifications || response.data.data || []
      setNotifications(data.slice(0, maxItems))
    } catch (error) {
      console.error('Failed to fetch job notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [dashboardType, maxItems])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/${dashboardType}/job-notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error('Failed to mark notification read:', error)
    }
  }

  const handleApply = async (jobId: string) => {
    if (!jobId) return

    try {
      setApplying(true)
      await api.post(`/jobs/${jobId}/apply`, { note: applicationNote })
      toast.success(language === 'ar' ? 'تم إرسال طلبك بنجاح' : 'Application submitted successfully')
      setShowApplyModal(false)
      setApplicationNote('')
      await fetchNotifications()
    } catch (error: any) {
      toast.error(error.message || (language === 'ar' ? 'فشل إرسال الطلب' : 'Failed to submit application'))
    } finally {
      setApplying(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_job': return <Briefcase className="w-5 h-5 text-blue-600" />
      case 'application_received': return <FileText className="w-5 h-5 text-green-600" />
      case 'application_status': return <CheckCircle className="w-5 h-5 text-purple-600" />
      case 'job_match': return <Target className="w-5 h-5 text-orange-600" />
      case 'urgent_job': return <Zap className="w-5 h-5 text-red-600" />
      default: return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-gray-50'
    switch (type) {
      case 'new_job': return 'bg-blue-50'
      case 'application_received': return 'bg-green-50'
      case 'application_status': return 'bg-purple-50'
      case 'job_match': return 'bg-orange-50'
      case 'urgent_job': return 'bg-red-50'
      default: return 'bg-gray-100'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">
              {language === 'ar' ? 'إشعارات الوظائف' : 'Job Notifications'}
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm">
              {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
            </p>
          ) : (
            notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                onClick={() => { markAsRead(notification.id); setSelectedNotification(notification); }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${getNotificationBg(notification.type, notification.read)}`}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {language === 'ar' ? notification.titleAr || notification.title : notification.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {language === 'ar' ? notification.messageAr || notification.message : notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {language === 'ar' ? 'إشعارات الوظائف الذكية' : 'Smart Job Notifications'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'وظائف مطابقة لملفك الشخصي' : 'Jobs matching your profile'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
              {unreadCount} {language === 'ar' ? 'جديد' : 'new'}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === 'ar' ? 'لا توجد إشعارات وظائف حالياً' : 'No job notifications at the moment'}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => { markAsRead(notification.id); setSelectedNotification(notification); }}
                className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${getNotificationBg(notification.type, notification.read)}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    notification.type === 'urgent_job' ? 'bg-red-100' :
                    notification.type === 'job_match' ? 'bg-orange-100' :
                    notification.type === 'application_received' ? 'bg-green-100' :
                    'bg-blue-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {language === 'ar' ? notification.titleAr || notification.title : notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {language === 'ar' ? notification.messageAr || notification.message : notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      {notification.clubName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {language === 'ar' ? notification.clubNameAr || notification.clubName : notification.clubName}
                        </span>
                      )}
                      {notification.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(notification.deadline).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                      )}
                      {notification.matchScore && (
                        <span className="flex items-center gap-1 text-orange-600">
                          <Star className="w-3 h-3" />
                          {notification.matchScore}% {language === 'ar' ? 'مطابقة' : 'match'}
                        </span>
                      )}
                      <span className="text-gray-400">
                        {new Date(notification.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNotification(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {getNotificationIcon(selectedNotification.type)}
                  <h2 className="text-lg font-bold text-gray-900">
                    {language === 'ar' ? selectedNotification.titleAr || selectedNotification.title : selectedNotification.title}
                  </h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNotification(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  {language === 'ar' ? selectedNotification.messageAr || selectedNotification.message : selectedNotification.message}
                </p>

                {selectedNotification.jobTitle && (
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-2">
                      {language === 'ar' ? selectedNotification.jobTitleAr || selectedNotification.jobTitle : selectedNotification.jobTitle}
                    </p>
                    {selectedNotification.clubName && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {language === 'ar' ? selectedNotification.clubNameAr || selectedNotification.clubName : selectedNotification.clubName}
                      </p>
                    )}
                    {selectedNotification.location && (
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        {language === 'ar' ? selectedNotification.locationAr || selectedNotification.location : selectedNotification.location}
                      </p>
                    )}
                    {selectedNotification.salary && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        {selectedNotification.salary}
                      </p>
                    )}
                  </div>
                )}

                {selectedNotification.applicantName && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-2">
                      {language === 'ar' ? 'معلومات المتقدم' : 'Applicant Information'}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedNotification.applicantName}
                    </p>
                    {selectedNotification.applicantRole && (
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedNotification.applicantRole}
                      </p>
                    )}
                    {selectedNotification.cvUrl && (
                      <a
                        href={selectedNotification.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700"
                      >
                        <FileText className="w-4 h-4" />
                        {language === 'ar' ? 'عرض السيرة الذاتية' : 'View CV'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {selectedNotification.matchScore && (
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{language === 'ar' ? 'نسبة المطابقة' : 'Match Score'}</span>
                      <span className="text-2xl font-bold text-orange-600">{selectedNotification.matchScore}%</span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${selectedNotification.matchScore}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {(selectedNotification.type === 'new_job' || selectedNotification.type === 'job_match' || selectedNotification.type === 'urgent_job') && selectedNotification.jobId && (
                    <Button
                      onClick={() => setShowApplyModal(true)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'تقديم طلب' : 'Apply Now'}
                    </Button>
                  )}
                  {selectedNotification.applicantId && (
                    <Button
                      onClick={() => window.open(`/profile/${selectedNotification.applicantId}`, '_blank')}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedNotification(null)} className="flex-1">
                    {language === 'ar' ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showApplyModal && selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'تقديم طلب للوظيفة' : 'Apply for Job'}
              </h2>
              <p className="text-gray-600 mb-4">
                {language === 'ar' ? selectedNotification.jobTitleAr || selectedNotification.jobTitle : selectedNotification.jobTitle}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رسالة إضافية (اختياري)' : 'Additional Note (optional)'}
                </label>
                <textarea
                  value={applicationNote}
                  onChange={(e) => setApplicationNote(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={language === 'ar' ? 'أضف ملاحظة للمسؤول...' : 'Add a note to the employer...'}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowApplyModal(false)} className="flex-1">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={() => handleApply(selectedNotification.jobId!)}
                  disabled={applying}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                >
                  {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : (language === 'ar' ? 'إرسال الطلب' : 'Submit Application')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default JobNotificationsModule
