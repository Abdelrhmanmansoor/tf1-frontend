import { useState, useEffect } from 'react'
import { websocketClient } from '../lib/websocketClient'

export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleConnection = (data: any) => {
      switch (data.status) {
        case 'connected':
        case 'reconnected':
          setConnectionStatus('connected')
          setError(null)
          break
        case 'disconnected':
          setConnectionStatus('disconnected')
          break
        case 'error':
        case 'reconnect_failed':
          setConnectionStatus('error')
          setError(data.error || 'Connection failed')
          break
      }
    }

    websocketClient.on('connection', handleConnection)
    websocketClient.connect()

    return () => {
      websocketClient.off('connection', handleConnection)
    }
  }, [])

  const reconnect = () => {
    websocketClient.disconnect()
    websocketClient.connect()
  }

  return {
    connectionStatus,
    error,
    connected: websocketClient.connected,
    reconnect,
  }
}

// Hook for real-time notifications
export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const handleNotification = (notification: any) => {
      setNotifications((prev) => [notification, ...prev.slice(0, 49)]) // Keep last 50
      setUnreadCount((prev) => prev + 1)

      // Show browser notification if permission granted
      if (
        typeof window !== 'undefined' &&
        Notification.permission === 'granted'
      ) {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/notification-icon.png',
          tag: notification.id,
        })
      }
    }

    websocketClient.on('notification', handleNotification)

    return () => {
      websocketClient.off('notification', handleNotification)
    }
  }, [])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
  }
}

// Hook for real-time messaging
export const useRealTimeMessages = (conversationId?: string) => {
  const [messages, setMessages] = useState<any[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (!conversationId || message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message])
      }
    }

    const handleTyping = (data: any) => {
      if (!conversationId || data.conversationId === conversationId) {
        if (data.isTyping) {
          setTypingUsers((prev) => [
            ...prev.filter((id) => id !== data.userId),
            data.userId,
          ])
        } else {
          setTypingUsers((prev) => prev.filter((id) => id !== data.userId))
        }
      }
    }

    const handleUserOnline = (data: any) => {
      setOnlineUsers((prev) => new Set([...Array.from(prev), data.userId]))
    }

    const handleUserOffline = (data: any) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(data.userId)
        return newSet
      })
    }

    websocketClient.on('message', handleMessage)
    websocketClient.on('typing', handleTyping)
    websocketClient.on('userOnline', handleUserOnline)
    websocketClient.on('userOffline', handleUserOffline)

    if (conversationId) {
      websocketClient.joinConversation(conversationId)
    }

    return () => {
      websocketClient.off('message', handleMessage)
      websocketClient.off('typing', handleTyping)
      websocketClient.off('userOnline', handleUserOnline)
      websocketClient.off('userOffline', handleUserOffline)

      if (conversationId) {
        websocketClient.leaveConversation(conversationId)
      }
    }
  }, [conversationId])

  const sendMessage = (content: string, type: 'text' | 'file' = 'text') => {
    if (conversationId) {
      websocketClient.sendMessage(conversationId, content, type)
    }
  }

  const startTyping = () => {
    if (conversationId) {
      websocketClient.startTyping(conversationId)
    }
  }

  const stopTyping = () => {
    if (conversationId) {
      websocketClient.stopTyping(conversationId)
    }
  }

  return {
    messages,
    typingUsers,
    onlineUsers,
    sendMessage,
    startTyping,
    stopTyping,
  }
}
