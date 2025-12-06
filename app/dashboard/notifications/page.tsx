'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useSocket } from '@/contexts/socket-context'
import { motion, AnimatePresence } from 'framer-motion'
import notificationService, { JobNotification } from '@/services/notifications'
import { toast } from 'sonner'
import {
  Bell,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Building2,
  Loader2,
  Trash2,
  CheckCheck,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type NotificationFilter = 'all' | 'unread' | 'applications' | 'jobs'

export default function NotificationsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const socketContext = useSocket()
  
  const [notifications, setNotifications] = useState<JobNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  
  const socketHandlerRef = useRef<((notification: any) => void) | null>(null)

  const fetchNotifications = useCallback(async (pageNum: number, append = false) => {
    try {
      setError(null)
      if (append) {
        setLoadingMore(true)
      } else if (pageNum === 1) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const result = await notificationService.getNotifications(pageNum, 20)
      
      if (append) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n._id))
          const newNotifications = result.notifications.filter(n => !existingIds.has(n._id))
          return [...prev, ...newNotifications]
        })
      } else {
        setNotifications(result.notifications)
      }
      
      setTotal(result.total)
      setUnreadCount(result.unreadCount)
      setHasMore(result.notifications.length === 20)
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err)
      setError(language === 'ar' ? 'فشل في جلب الإشعارات' : 'Failed to fetch notifications')
      if (!append) {
        toast.error(language === 'ar' ? 'فشل في جلب الإشعارات' : 'Failed to fetch notifications')
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setRefreshing(false)
    }
  }, [language])

  useEffect(() => {
    setPage(1)
    setNotifications([])
    fetchNotifications(1, false)
  }, [filter])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !loadingMore) {
        fetchNotifications(1, false)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications, loading, loadingMore])

  useEffect(() => {
    if (!socketContext || !socketContext.socket) return
    
    if (socketHandlerRef.current) {
      socketContext.socket.off('new_notification', socketHandlerRef.current)
    }
    
    const handleNewNotification = (notification: any) => {
      const userId = (user as any)?._id || (user as any)?.id
      if (notification.userId === userId || notification.recipientId === userId) {
        setNotifications(prev => {
          if (prev.some(n => n._id === notification._id)) return prev
          return [notification, ...prev]
        })
        setUnreadCount(prev => prev + 1)
        toast.info(language === 'ar' ? notification.titleAr || notification.title : notification.title)
      }
    }
    
    socketHandlerRef.current = handleNewNotification
    socketContext.socket.on('new_notification', handleNewNotification)
    
    return () => {
      if (socketContext.socket && socketHandlerRef.current) {
        socketContext.socket.off('new_notification', socketHandlerRef.current)
      }
    }
  }, [socketContext, user, language])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchNotifications(nextPage, true)
  }

  const handleRefresh = () => {
    setPage(1)
    fetchNotifications(1, false)
  }

  const handleMarkAsRead = async (id: string) => {
    const success = await notificationService.markAsRead(id)
    if (success) {
      setNotifications(prev => prev.map(n => 
        n._id === id ? { ...n, read: true, isRead: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const handleMarkAllAsRead = async () => {
    const success = await notificationService.markAllAsRead()
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })))
      setUnreadCount(0)
      toast.success(language === 'ar' ? 'تم تحديد الكل كمقروء' : 'All marked as read')
    }
  }

  const handleDelete = async (id: string) => {
    const success = await notificationService.deleteNotification(id)
    if (success) {
      setNotifications(prev => prev.filter(n => n._id !== id))
      toast.success(language === 'ar' ? 'تم حذف الإشعار' : 'Notification deleted')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_received':
        return <FileText className="w-5 h-5 text-blue-600" />
      case 'application_submitted':
        return <Briefcase className="w-5 h-5 text-green-600" />
      case 'application_accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'application_rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'application_reviewed':
        return <Clock className="w-5 h-5 text-orange-600" />
      case 'new_job':
      case 'job_match':
        return <Briefcase className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationBg = (notification: JobNotification) => {
    const isUnread = !notification.read && !notification.isRead
    if (!isUnread) return 'bg-gray-50'
    
    switch (notification.type) {
      case 'application_received':
        return 'bg-blue-50 border-blue-200'
      case 'application_submitted':
        return 'bg-green-50 border-green-200'
      case 'application_accepted':
        return 'bg-green-50 border-green-200'
      case 'application_rejected':
        return 'bg-red-50 border-red-200'
      case 'new_job':
      case 'job_match':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-100 border-gray-200'
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read && !n.isRead
    if (filter === 'applications') return n.type.includes('application')
    if (filter === 'jobs') return n.type.includes('job')
    return true
  })

  const getDashboardLink = () => {
    const role = user?.role as string
    if (role === 'club') return '/dashboard/club'
    if (role === 'player') return '/dashboard/player'
    if (role === 'coach') return '/dashboard/coach'
    if (role === 'specialist') return '/dashboard/specialist'
    if (role === 'leader' || role === 'admin') return '/dashboard/leader'
    return '/dashboard'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={getDashboardLink()}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'الإشعارات' : 'Notifications'}
              </h1>
              <p className="text-gray-600">
                {unreadCount > 0 
                  ? (language === 'ar' ? `${unreadCount} إشعار غير مقروء` : `${unreadCount} unread notifications`)
                  : (language === 'ar' ? 'لا توجد إشعارات جديدة' : 'No new notifications')
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'قراءة الكل' : 'Mark all read'}
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: language === 'ar' ? 'الكل' : 'All' },
            { key: 'unread', label: language === 'ar' ? 'غير مقروء' : 'Unread' },
            { key: 'applications', label: language === 'ar' ? 'الطلبات' : 'Applications' },
            { key: 'jobs', label: language === 'ar' ? 'الوظائف' : 'Jobs' },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key as NotificationFilter)}
              className={filter === key ? 'bg-blue-600' : ''}
            >
              {label}
            </Button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </Button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
              </h3>
              <p className="text-gray-500">
                {language === 'ar' 
                  ? 'ستظهر هنا الإشعارات عند وصولها'
                  : 'Notifications will appear here when received'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`p-4 md:p-6 transition-colors hover:bg-gray-50 border-l-4 ${getNotificationBg(notification)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.read || notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className={`font-semibold text-gray-900 ${
                              !notification.read && !notification.isRead ? 'font-bold' : ''
                            }`}>
                              {language === 'ar' ? notification.titleAr || notification.title : notification.title}
                            </h3>
                            <p className="text-gray-600 mt-1 text-sm">
                              {language === 'ar' ? notification.messageAr || notification.message : notification.message}
                            </p>
                          </div>
                          {!notification.read && !notification.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          {notification.jobData?.clubName && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {language === 'ar' 
                                ? notification.jobData.clubNameAr || notification.jobData.clubName 
                                : notification.jobData.clubName
                              }
                            </span>
                          )}
                          {notification.applicantData?.name && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {notification.applicantData.name}
                            </span>
                          )}
                          <span>
                            {new Date(notification.createdAt).toLocaleDateString(
                              language === 'ar' ? 'ar-SA' : 'en-US',
                              { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          {(!notification.read && !notification.isRead) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                            </Button>
                          )}
                          {notification.applicationId && (
                            <Link href={
                              (user?.role as string) === 'club' 
                                ? `/dashboard/club/applications?id=${notification.applicationId}`
                                : `/dashboard/player/applications`
                            }>
                              <Button variant="ghost" size="sm" className="text-purple-600">
                                {language === 'ar' ? 'عرض الطلب' : 'View Application'}
                              </Button>
                            </Link>
                          )}
                          {notification.jobId && !notification.applicationId && (
                            <Link href={`/opportunities/${notification.jobId}`}>
                              <Button variant="ghost" size="sm" className="text-green-600">
                                {language === 'ar' ? 'عرض الوظيفة' : 'View Job'}
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {hasMore && filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {language === 'ar' ? 'تحميل المزيد' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
