'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import notificationService, { JobNotification } from '@/services/notifications'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface NotificationBellProps {
  userRole?: 'club' | 'applicant' | 'general'
}

export default function NotificationBell({ userRole = 'general' }: NotificationBellProps) {
  const { language } = useLanguage()
  const [notifications, setNotifications] = useState<JobNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [userRole])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      let result
      
      if (userRole === 'club') {
        result = await notificationService.getClubApplicationNotifications(1, 10)
      } else if (userRole === 'applicant') {
        result = await notificationService.getApplicationNotifications(1, 10)
      } else {
        result = await notificationService.getNotifications(1, 10)
      }
      
      setNotifications(result.notifications)
      const unread = result.notifications.filter(n => !n.read && !n.isRead).length
      setUnreadCount(unread)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(n => n._id !== notificationId))
      const notification = notifications.find(n => n._id === notificationId)
      if (notification && !notification.read && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_received':
        return '📩'
      case 'application_submitted':
        return '✉️'
      case 'application_accepted':
      case 'application_reviewed':
        return '✅'
      case 'application_rejected':
        return '❌'
      case 'new_job':
      case 'job_match':
        return '💼'
      case 'urgent_job':
        return '🔥'
      default:
        return '🔔'
    }
  }

  const getNotificationLink = (notification: JobNotification) => {
    if (userRole === 'club' && notification.applicationId) {
      return `/dashboard/club/applications/${notification.applicationId}`
    } else if (userRole === 'applicant' && notification.jobId) {
      return `/jobs/${notification.jobId}`
    }
    return null
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return language === 'ar' ? 'الآن' : 'Just now'
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      return language === 'ar' ? `منذ ${minutes} دقيقة` : `${minutes}m ago`
    }
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600)
      return language === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`
    }
    const days = Math.floor(seconds / 86400)
    return language === 'ar' ? `منذ ${days} يوم` : `${days}d ago`
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleMarkAllAsRead}
                      className="text-xs"
                    >
                      <CheckCheck className="w-4 h-4 mr-1" />
                      {language === 'ar' ? 'قراءة الكل' : 'Mark all read'}
                    </Button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {loading && notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => {
                      const isUnread = !notification.read && !notification.isRead
                      const link = getNotificationLink(notification)

                      const NotificationContent = (
                        <div
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            isUnread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="text-2xl flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                {language === 'ar' ? notification.titleAr : notification.title}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {language === 'ar' ? notification.messageAr : notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {isUnread && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleMarkAsRead(notification._id)
                                  }}
                                  className="p-1 hover:bg-gray-200 rounded-lg"
                                  title={language === 'ar' ? 'تعليم كمقروء' : 'Mark as read'}
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDelete(notification._id)
                                }}
                                className="p-1 hover:bg-gray-200 rounded-lg"
                                title={language === 'ar' ? 'حذف' : 'Delete'}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )

                      return link ? (
                        <Link
                          key={notification._id}
                          href={link}
                          onClick={() => {
                            if (isUnread) handleMarkAsRead(notification._id)
                            setIsOpen(false)
                          }}
                        >
                          {NotificationContent}
                        </Link>
                      ) : (
                        <div key={notification._id}>{NotificationContent}</div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 text-center">
                  <Link
                    href={userRole === 'club' ? '/dashboard/club/notifications' : '/dashboard/notifications'}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {language === 'ar' ? 'عرض جميع الإشعارات' : 'View all notifications'}
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
