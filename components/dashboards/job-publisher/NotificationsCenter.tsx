'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import api from '@/services/api'
import { toast } from 'sonner'
import { Bell, Check, Trash2, Eye, Loader2, Briefcase, FileText, Calendar, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

interface Notification {
  _id: string
  type: string
  title: string
  description: string
  isRead: boolean
  createdAt: string
  data?: {
    jobTitle?: string
    applicationStatus?: string
    messagePreview?: string
  }
  relatedEntity?: {
    entityType: string
    entityId: string
  }
  priority: string
}

export default function NotificationsCenter() {
  const { language } = useLanguage()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'application_status_change' | 'interview_scheduled' | 'message_received'>('all')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [filter, typeFilter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const endpoint = typeFilter === 'all' ? '/notifications' : `/notifications/by-type/${typeFilter}`
      const response = await api.get(endpoint, {
        params: { isRead: filter === 'unread' ? false : 'all', limit: 30 },
      })
      if (response.data.success) {
        setNotifications(response.data.notifications)
        setUnreadCount(response.data.unreadCount || 0)
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error: any) {
      toast.error(language === 'ar' ? 'فشل تحديث الإشعار' : 'Failed to update notification')
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success(language === 'ar' ? 'تم تحديد الكل كمقروء' : 'All marked as read')
    } catch (error: any) {
      toast.error(language === 'ar' ? 'فشل التحديث' : 'Failed to update')
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(notifications.filter((n) => n._id !== id))
      toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted')
    } catch (error: any) {
      toast.error(language === 'ar' ? 'فشل الحذف' : 'Failed to delete')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_application':
      case 'application_status_change':
        return <FileText className="w-5 h-5" />
      case 'interview_scheduled':
        return <Calendar className="w-5 h-5" />
      case 'message_received':
      case 'message_reply':
        return <MessageCircle className="w-5 h-5" />
      case 'job_posted':
        return <Briefcase className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-red-200'
      case 'high':
        return 'bg-orange-50 border-orange-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: language === 'ar' ? ar : enUS,
    })
  }

  const isRtl = language === 'ar'

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'مركز الإشعارات' : 'Notifications Center'}
            </h2>
            {unreadCount > 0 && (
              <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All Read'}
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-purple-600' : ''}
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 'bg-purple-600' : ''}
          >
            {language === 'ar' ? 'غير مقروءة' : 'Unread'} ({unreadCount})
          </Button>
          <div className="flex gap-2 ml-4">
            {[
              { id: 'all', labelAr: 'كل الأنواع', labelEn: 'All types' },
              { id: 'application_status_change', labelAr: 'تحديثات الطلب', labelEn: 'Application updates' },
              { id: 'interview_scheduled', labelAr: 'المقابلات', labelEn: 'Interviews' },
              { id: 'message_received', labelAr: 'الرسائل', labelEn: 'Messages' },
            ].map((type) => (
              <Button
                key={type.id}
                variant={typeFilter === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter(type.id as any)}
                className={typeFilter === type.id ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
              >
                {language === 'ar' ? type.labelAr : type.labelEn}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50' : ''
              } ${getNotificationColor(notification.priority)}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg ${
                    notification.priority === 'urgent'
                      ? 'bg-red-100 text-red-600'
                      : notification.priority === 'high'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                  {notification.data?.jobTitle && (
                    <p className="text-xs text-gray-500 mb-1">
                      <Briefcase className="w-3 h-3 inline mr-1" />
                      {notification.data.jobTitle}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">{formatTime(notification.createdAt)}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title={language === 'ar' ? 'تحديد كمقروء' : 'Mark as read'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={language === 'ar' ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
