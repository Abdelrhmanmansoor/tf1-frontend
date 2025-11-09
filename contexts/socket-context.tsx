'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import { io, Socket } from 'socket.io-client'
import { getAuthToken } from '@/lib/auth'
import API_CONFIG from '@/config/api'
import type { Message } from '@/services/messaging'

interface TypingUser {
  userId: string
  userName: string
  userNameAr?: string
  conversationId: string
}

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  onNewMessage: (callback: (message: Message) => void) => void
  onMessageUpdated: (callback: (message: Message) => void) => void
  onMessageDeleted: (
    callback: (data: { messageId: string; conversationId: string }) => void
  ) => void
  onTyping: (callback: (user: TypingUser) => void) => void
  onStopTyping: (
    callback: (data: { userId: string; conversationId: string }) => void
  ) => void
  onUserOnline: (callback: (userId: string) => void) => void
  onUserOffline: (callback: (userId: string) => void) => void
  sendTyping: (conversationId: string) => void
  stopTyping: (conversationId: string) => void
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
}

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) return

    // Initialize Socket.io connection
    // Remove /api/v1 from the socket URL as it connects to the root
    const socketUrl = API_CONFIG.BASE_URL.replace('/api/v1', '')
    const newSocket = io(socketUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    })

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const onNewMessage = useCallback((callback: (message: Message) => void) => {
    if (socketRef.current) {
      socketRef.current.on('message:new', callback)
    }
  }, [])

  const onMessageUpdated = useCallback(
    (callback: (message: Message) => void) => {
      if (socketRef.current) {
        socketRef.current.on('message:updated', callback)
      }
    },
    []
  )

  const onMessageDeleted = useCallback(
    (
      callback: (data: { messageId: string; conversationId: string }) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.on('message:deleted', callback)
      }
    },
    []
  )

  const onTyping = useCallback((callback: (user: TypingUser) => void) => {
    if (socketRef.current) {
      socketRef.current.on('typing', callback)
    }
  }, [])

  const onStopTyping = useCallback(
    (callback: (data: { userId: string; conversationId: string }) => void) => {
      if (socketRef.current) {
        socketRef.current.on('stop-typing', callback)
      }
    },
    []
  )

  const onUserOnline = useCallback((callback: (userId: string) => void) => {
    if (socketRef.current) {
      socketRef.current.on('user:online', callback)
    }
  }, [])

  const onUserOffline = useCallback((callback: (userId: string) => void) => {
    if (socketRef.current) {
      socketRef.current.on('user:offline', callback)
    }
  }, [])

  const sendTyping = useCallback((conversationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { conversationId })
    }
  }, [])

  const stopTyping = useCallback((conversationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('stop-typing', { conversationId })
    }
  }, [])

  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('conversation:join', { conversationId })
    }
  }, [])

  const leaveConversation = useCallback((conversationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('conversation:leave', { conversationId })
    }
  }, [])

  const value: SocketContextType = {
    socket,
    isConnected,
    onNewMessage,
    onMessageUpdated,
    onMessageDeleted,
    onTyping,
    onStopTyping,
    onUserOnline,
    onUserOffline,
    sendTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
