'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useSocket } from '@/contexts/socket-context'
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import notificationService, { JobNotification } from '@/services/notifications'
import { Bell, CheckCircle, XCircle, Briefcase, FileText, X } from 'lucide-react'
import Link from 'next/link'

export default function NotificationBell() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const socketContext = useSocket()
  
  const [notifications, setNotifications] = useState<JobNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const socketHandlerRef = useRef<((notification: any) => void) | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const result = await notificationService.getNotifications(1, 5)
      setNotifications(result.notifications)
      setUnreadCount(result.unreadCount)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

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
          return [notification, ...prev.slice(0, 4)]
        })
        setUnreadCount(prev => prev + 1)
      }
    }
    
    socketHandlerRef.current = handleNewNotification
    socketContext.socket.on('new_notification', handleNewNotification)
    
    return () => {
      if (socketContext.socket && socketHandlerRef.current) {
        socketContext.socket.off('new_notification', socketHandlerRef.current)
      }
    }
  }, [socketContext, user])

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const success = await notificationService.markAsRead(id)
    if (success) {
      setNotifications(prev => prev.map(n => 
        n._id === id ? { ...n, read: true, isRead: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_received':
        return <FileText className="w-4 h-4 text-blue-600" />
      case 'application_accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'application_rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'new_job':
        return <Briefcase className="w-4 h-4 text-purple-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden`}
            >
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-between">
                <span className="font-semibold">
                  {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                </span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {unreadCount} {language === 'ar' ? 'جديد' : 'new'}
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map(notification => (
                      <div
                        key={notification._id}
                        className={`p-3 hover:bg-gray-50 transition-colors ${
                          !notification.read && !notification.isRead ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm text-gray-900 ${
                              !notification.read && !notification.isRead ? 'font-semibold' : ''
                            }`}>
                              {language === 'ar' ? notification.titleAr || notification.title : notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {language === 'ar' ? notification.messageAr || notification.message : notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString(
                                language === 'ar' ? 'ar-SA' : 'en-US',
                                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                              )}
                            </p>
                          </div>
                          {!notification.read && !notification.isRead && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification._id, e)}
                              className="text-gray-400 hover:text-blue-600 flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-1"
                >
                  {language === 'ar' ? 'عرض جميع الإشعارات' : 'View all notifications'}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
