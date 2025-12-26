'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useSocket } from '@/contexts/socket-context'
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  X,
  Users,
  User,
  Info,
} from 'lucide-react'
import { messagingService } from '@/services/messaging'
import type { Message, Conversation } from '@/services/messaging'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

interface ChatWindowProps {
  conversation: Conversation
  currentUserId: string
  onBack?: () => void
}

export function ChatWindow({
  conversation,
  currentUserId,
  onBack,
}: ChatWindowProps) {
  const { language } = useLanguage()
  const {
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
  } = useSocket()

  const [messages, setMessages] = useState<Message[]>([])
  const [messageContent, setMessageContent] = useState('')
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [loading, setLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState<
    Array<{ userId: string; userName: string; userNameAr?: string }>
  >([])
  const [showInfo, setShowInfo] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get conversation name and avatar
  const getConversationName = () => {
    if (conversation.isGroup) {
      return conversation.name || (language === 'ar' ? 'مجموعة' : 'Group')
    }

    const otherParticipant = conversation.participants.find((p) => {
      // Handle both populated and unpopulated userId
      const participantId =
        typeof p.userId === 'string' ? p.userId : p.userId?._id
      return participantId !== currentUserId
    })

    if (otherParticipant) {
      // Get name from userId if populated, otherwise from direct fields
      if (
        typeof otherParticipant.userId === 'object' &&
        otherParticipant.userId
      ) {
        return `${otherParticipant.userId.firstName} ${otherParticipant.userId.lastName}`.trim()
      } else {
        return `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim()
      }
    }

    return language === 'ar' ? 'محادثة' : 'Conversation'
  }

  // Check if other participant is online
  const isOtherParticipantOnline = () => {
    if (conversation.isGroup) return false

    const otherParticipant = conversation.participants.find((p) => {
      const participantId =
        typeof p.userId === 'string' ? p.userId : p.userId?._id
      return participantId !== currentUserId
    })

    if (!otherParticipant) return false

    const participantId =
      typeof otherParticipant.userId === 'string'
        ? otherParticipant.userId
        : otherParticipant.userId?._id

    return participantId ? onlineUsers.has(participantId) : false
  }

  const getConversationAvatar = () => {
    if (conversation.isGroup) {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
      )
    }

    const otherParticipant = conversation.participants.find((p) => {
      // Handle both populated and unpopulated userId
      const participantId =
        typeof p.userId === 'string' ? p.userId : p.userId?._id
      return participantId !== currentUserId
    })

    // Get avatar from userId if populated
    const avatar =
      typeof otherParticipant?.userId === 'object'
        ? otherParticipant.userId.avatar
        : otherParticipant?.avatar

    if (avatar) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
      )
    }

    return (
      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-white" />
      </div>
    )
  }

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true)
        const response = await messagingService.getMessages(conversation._id, {
          limit: 50,
        })
        if (response.success) {
          // Debug: Check if messages have sender info
          if (response.messages.length > 0 && !response.messages[0].senderId) {
            console.error(
              'Backend is not populating message.senderId! First message:',
              response.messages[0]
            )
          }
          setMessages(response.messages)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
    joinConversation(conversation._id)

    // Mark as read - silently fail if endpoint doesn't exist
    messagingService.markAsRead(conversation._id).catch((err) => {
      console.warn('Failed to mark conversation as read:', err.message)
    })

    return () => {
      leaveConversation(conversation._id)
    }
  }, [conversation._id, joinConversation, leaveConversation])

  // Socket listeners
  useEffect(() => {
    onNewMessage((payload: any) => {
      console.log('[Socket] New message event received:', payload)

      // Backend sends: { conversationId: '...', data: messageObject }
      const message = payload.data
      const conversationId = payload.conversationId

      if (conversationId === conversation._id && message) {
        console.log('[Socket] Adding message to conversation:', message)

        // Check if message already exists (to avoid duplicates from both socket and manual add)
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === message._id)
          if (exists) {
            console.log('[Socket] Message already exists, skipping')
            return prev
          }
          return [...prev, message]
        })

        // Mark as read - silently fail if endpoint doesn't exist
        messagingService.markAsRead(conversation._id).catch((err) => {
          console.warn('Failed to mark conversation as read:', err.message)
        })
      } else {
        console.log('[Socket] Message for different conversation, ignoring')
      }
    })

    onMessageUpdated((message: Message) => {
      if (message.conversation === conversation._id) {
        setMessages((prev) =>
          prev.map((m) => (m._id === message._id ? message : m))
        )
      }
    })

    onMessageDeleted((data) => {
      if (data.conversationId === conversation._id) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === data.messageId
              ? { ...m, deletedAt: new Date().toISOString() }
              : m
          )
        )
      }
    })

    onTyping((user) => {
      if (
        user.conversationId === conversation._id &&
        user.userId !== currentUserId
      ) {
        setTypingUsers((prev) => {
          if (prev.find((u) => u.userId === user.userId)) return prev
          return [
            ...prev,
            {
              userId: user.userId,
              userName: user.userName,
              userNameAr: user.userNameAr,
            },
          ]
        })
      }
    })

    onStopTyping((data) => {
      if (data.conversationId === conversation._id) {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId))
      }
    })

    // Listen for user online/offline events
    onUserOnline((userId: string) => {
      console.log('[Socket] User online:', userId)
      setOnlineUsers((prev) => new Set(prev).add(userId))
    })

    onUserOffline((userId: string) => {
      console.log('[Socket] User offline:', userId)
      setOnlineUsers((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    })
  }, [
    conversation._id,
    currentUserId,
    onNewMessage,
    onMessageUpdated,
    onMessageDeleted,
    onTyping,
    onStopTyping,
    onUserOnline,
    onUserOffline,
  ])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingUsers])

  // Handle typing indicator
  const handleInputChange = (value: string) => {
    setMessageContent(value)

    if (value.trim()) {
      sendTyping(conversation._id)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(conversation._id)
      }, 3000)
    } else {
      stopTyping(conversation._id)
    }
  }

  // Send message
  const handleSendMessage = async () => {
    if (!messageContent.trim()) return

    try {
      const messageData = {
        content: messageContent.trim(),
        type: 'text' as const,
        ...(replyTo && { replyTo: replyTo._id }),
      }

      const response = await messagingService.sendMessage(
        conversation._id,
        messageData
      )

      // Add message manually for immediate feedback
      // Response: { success: true, message: "Message sent", data: messageObject }
      if (response.success && (response as any).data) {
        const messageObj = (response as any).data
        console.log('Adding message to UI:', messageObj)
        setMessages((prev) => [...prev, messageObj])
      }

      setMessageContent('')
      setReplyTo(null)
      stopTyping(conversation._id)
    } catch (error: any) {
      console.error('Error sending message:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      alert(
        `Failed to send message: ${error.response?.data?.message || error.message}`
      )
    }
  }

  // Handle reactions
  const handleReact = async (messageId: string, emoji: string) => {
    try {
      await messagingService.addReaction(messageId, emoji)
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  // Handle edit
  const handleEdit = async (messageId: string, content: string) => {
    try {
      await messagingService.editMessage(messageId, content)
    } catch (error) {
      console.error('Error editing message:', error)
    }
  }

  // Handle delete
  const handleDelete = async (messageId: string) => {
    try {
      await messagingService.deleteMessage(messageId)
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="relative">
            {getConversationAvatar()}
            {!conversation.isGroup && isOtherParticipantOnline() && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {getConversationName()}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {conversation.isGroup ? (
                `${conversation.participants.length} ${language === 'ar' ? 'أعضاء' : 'members'}`
              ) : (
                <>
                  {isOtherParticipantOnline() && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                  {isOtherParticipantOnline()
                    ? language === 'ar'
                      ? 'نشط الآن'
                      : 'Active now'
                    : language === 'ar'
                      ? 'غير متصل'
                      : 'Offline'}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Users className="w-16 h-16 mb-4" />
            <p>{language === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}</p>
            <p className="text-sm">
              {language === 'ar' ? 'ابدأ المحادثة!' : 'Start the conversation!'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              // Safety check for senderId
              if (!message.senderId || !message.senderId._id) {
                console.warn('Message missing senderId:', message)
                return null
              }

              const isOwn = message.senderId._id === currentUserId
              const showAvatar =
                index === 0 ||
                messages[index - 1]?.senderId?._id !== message.senderId._id

              return (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  onReact={handleReact}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReply={setReplyTo}
                />
              )
            })}

            {/* Typing Indicators */}
            <AnimatePresence>
              {typingUsers.map((user) => (
                <TypingIndicator
                  key={user.userId}
                  userName={user.userName}
                  userNameAr={user.userNameAr}
                />
              ))}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Reply Preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 py-3 border-t border-gray-200 bg-blue-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-600">
                  {language === 'ar' ? 'الرد على' : 'Replying to'}{' '}
                  {`${replyTo.senderId.firstName} ${replyTo.senderId.lastName}`.trim()}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {replyTo.content}
                </p>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ImageIcon className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={messageContent}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder={
                language === 'ar' ? 'اكتب رسالة...' : 'Type a message...'
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!messageContent.trim()}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {language === 'ar' ? 'معلومات المحادثة' : 'Conversation Info'}
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              {getConversationAvatar()}
              <h4 className="font-semibold text-gray-900 mt-3">
                {getConversationName()}
              </h4>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                {language === 'ar' ? 'الأعضاء' : 'Members'}
              </h4>
              <div className="space-y-2">
                {conversation.participants.map((participant) => {
                  // Get avatar and name from userId if populated
                  const avatar =
                    typeof participant.userId === 'object'
                      ? participant.userId.avatar
                      : participant.avatar
                  const firstName =
                    typeof participant.userId === 'object'
                      ? participant.userId.firstName
                      : participant.firstName
                  const lastName =
                    typeof participant.userId === 'object'
                      ? participant.userId.lastName
                      : participant.lastName
                  const fullName = `${firstName || ''} ${lastName || ''}`.trim()

                  return (
                    <div
                      key={participant._id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                    >
                      {avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatar}
                          alt={fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {firstName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {fullName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {participant.role}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
