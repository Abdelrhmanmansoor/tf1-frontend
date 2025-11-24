'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '@/contexts/socket-context'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import type { JobNotification } from '@/contexts/socket-context'
import Link from 'next/link'

interface JobNotificationsProps {
  compact?: boolean
  userId: string
}

export default function JobNotifications({ compact = false, userId }: JobNotificationsProps) {
  const { language } = useLanguage()
  const [notifications, setNotifications] = useState<JobNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  
  // Get socket safely
  const socketContext = useSocket()
  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    if (!socketContext) return
    const handleNotification = (notification: JobNotification) => {
      // Filter only job-related notifications
      if (notification.type === 'job_application' || 
          notification.type === 'club_accepted' || 
          notification.type === 'club_rejected') {
        if (notification.userId === userId) {
          setNotifications(prev => [notification, ...prev])
        }
      }
    }
    socketContext.onJobNotification(handleNotification)
  }, [socketContext, userId])

  const handleDismiss = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n._id !== notificationId))
  }, [])

  const getNotificationIcon = (notificationType: string, priority?: string) => {
    if (priority === 'urgent') {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    
    switch (notificationType) {
      case 'application_accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'application_rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'application_reviewed':
      case 'interview_scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'job_offer_received':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Bell className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationTitle = (notification: JobNotification) => {
    if (language === 'ar' && notification.titleAr) {
      return notification.titleAr
    }
    return notification.title
  }

  const getNotificationMessage = (notification: JobNotification) => {
    if (language === 'ar' && notification.messageAr) {
      return notification.messageAr
    }
    return notification.message
  }

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
            >
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map(notification => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.notificationType, notification.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">
                            {getNotificationTitle(notification)}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {getNotificationMessage(notification)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDismiss(notification._id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          {language === 'ar' ? 'إشعارات الوظائف' : 'Job Notifications'}
        </h3>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
          </div>
        ) : (
          notifications.map(notification => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-lg border transition-all ${
                !notification.isRead
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.notificationType, notification.priority)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {getNotificationTitle(notification)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{getNotificationMessage(notification)}</p>
                  {notification.jobTitle && (
                    <p className="text-xs text-gray-500 mt-2">
                      {language === 'ar' && notification.jobTitleAr ? notification.jobTitleAr : notification.jobTitle}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    {notification.actionUrl ? (
                      <Link href={notification.actionUrl}>
                        <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                          {language === 'ar' ? 'عرض' : 'View'}
                        </button>
                      </Link>
                    ) : notification.jobId ? (
                      <Link href={`/dashboard/player/opportunities/${notification.jobId}`}>
                        <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                          {language === 'ar' ? 'عرض' : 'View'}
                        </button>
                      </Link>
                    ) : null}
                    <button
                      onClick={() => handleDismiss(notification._id)}
                      className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      {language === 'ar' ? 'إغلاق' : 'Dismiss'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
