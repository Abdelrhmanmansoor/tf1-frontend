'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { messagingService } from '@/services/messaging'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

interface MessageNotificationBadgeProps {
  dashboardType: 'player' | 'coach' | 'club' | 'specialist' | 'administrator' | 'age-group-supervisor' | 'sports-director' | 'executive-director' | 'secretary'
}

export function MessageNotificationBadge({
  dashboardType,
}: MessageNotificationBadgeProps) {
  const { language } = useLanguage()
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch initial unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await messagingService.getUnreadCount()
        if (response.success) {
          setUnreadCount(response.count)
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    fetchUnreadCount()

    // Poll for unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [])

  const messagesHref = `/dashboard/${dashboardType}/messages`

  return (
    <Link href={messagesHref}>
      <Button
        variant="outline"
        className="relative border-purple-300 text-purple-600 hover:bg-purple-50 flex items-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        {language === 'ar' ? 'الرسائل' : 'Messages'}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </Button>
    </Link>
  )
}
