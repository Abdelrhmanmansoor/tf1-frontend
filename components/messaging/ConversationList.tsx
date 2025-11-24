'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import {
  Users,
  User,
  Volume2,
  VolumeX,
  Archive,
  Trash2,
  Search,
} from 'lucide-react'
import type { Conversation } from '@/services/messaging'
import { useState } from 'react'

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (conversation: Conversation) => void
  onMuteConversation?: (id: string) => void
  onArchiveConversation?: (id: string) => void
  onDeleteConversation?: (id: string) => void
  currentUserId?: string
  onlineUsers?: Set<string>
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onMuteConversation,
  onArchiveConversation,
  onDeleteConversation,
  currentUserId,
  onlineUsers = new Set(),
}: ConversationListProps) {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [showOptions, setShowOptions] = useState<string | null>(null)

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.name || (language === 'ar' ? 'مجموعة' : 'Group')
    }

    // For direct conversations, show the other participant's name
    const otherParticipant = conversation.participants.find((p) => {
      // Handle both populated and unpopulated userId
      const participantId =
        typeof p.userId === 'string' ? p.userId : p.userId?._id
      return participantId !== currentUserId
    })

    if (otherParticipant) {
      // Handle case where userId is populated with user data
      let name = null

      if (
        typeof otherParticipant.userId === 'object' &&
        otherParticipant.userId
      ) {
        // userId is populated with user object - use firstName and lastName
        const firstName = otherParticipant.userId.firstName || ''
        const lastName = otherParticipant.userId.lastName || ''
        name = `${firstName} ${lastName}`.trim()
      } else {
        // Fallback to direct name fields (old structure)
        const firstName = otherParticipant.firstName || ''
        const lastName = otherParticipant.lastName || ''
        name = `${firstName} ${lastName}`.trim()
      }

      // Ensure we always return a string
      return name || (language === 'ar' ? 'مستخدم' : 'User')
    }

    return language === 'ar' ? 'محادثة' : 'Conversation'
  }

  const isParticipantOnline = (conversation: Conversation) => {
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

  const getConversationAvatar = (conversation: Conversation) => {
    const isOnline = isParticipantOnline(conversation)

    if (conversation.isGroup) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
      )
    }

    const otherParticipant = conversation.participants.find((p) => {
      const participantId =
        typeof p.userId === 'string' ? p.userId : p.userId?._id
      return participantId !== currentUserId
    })

    // Get avatar from userId object if populated (backend uses 'avatar' not 'profilePicture')
    const avatar =
      typeof otherParticipant?.userId === 'object'
        ? otherParticipant.userId.avatar
        : otherParticipant?.avatar

    // Get name for alt text
    const firstName =
      typeof otherParticipant?.userId === 'object'
        ? otherParticipant.userId.firstName
        : otherParticipant?.firstName
    const lastName =
      typeof otherParticipant?.userId === 'object'
        ? otherParticipant.userId.lastName
        : otherParticipant?.lastName
    const name = `${firstName || ''} ${lastName || ''}`.trim()

    if (avatar) {
      return (
        <>
          <img
            src={avatar}
            alt={name || 'User'}
            className="w-12 h-12 rounded-full object-cover"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </>
      )
    }

    return (
      <>
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </>
    )
  }

  const formatLastMessageTime = (dateString: string | undefined) => {
    if (!dateString) return ''

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''
    }

    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (diffDays === 1) {
      return language === 'ar' ? 'أمس' : 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        weekday: 'short',
      })
    } else {
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    const name = getConversationName(conv)
    if (!name) return false
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-gray-400"
            >
              <Users className="w-16 h-16 mb-4" />
              <p>
                {language === 'ar'
                  ? 'لا توجد محادثات'
                  : 'No conversations found'}
              </p>
            </motion.div>
          ) : (
            filteredConversations.map((conversation) => (
              <motion.div
                key={conversation._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectConversation(conversation)}
                onMouseEnter={() => setShowOptions(conversation._id)}
                onMouseLeave={() => setShowOptions(null)}
                className={`relative p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversationId === conversation._id
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {getConversationAvatar(conversation)}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {conversation.unreadCount > 9
                          ? '9+'
                          : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-semibold truncate ${
                          conversation.unreadCount > 0
                            ? 'text-gray-900'
                            : 'text-gray-700'
                        }`}
                      >
                        {getConversationName(conversation)}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatLastMessageTime(
                            conversation.lastMessage.createdAt
                          )}
                        </span>
                      )}
                    </div>

                    {conversation.lastMessage && (
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm truncate ${
                            conversation.unreadCount > 0
                              ? 'text-gray-900 font-medium'
                              : 'text-gray-500'
                          }`}
                        >
                          {conversation.lastMessage.type === 'text'
                            ? conversation.lastMessage.content
                            : conversation.lastMessage.type === 'image'
                              ? language === 'ar'
                                ? '📷 صورة'
                                : '📷 Image'
                              : conversation.lastMessage.type === 'video'
                                ? language === 'ar'
                                  ? '🎥 فيديو'
                                  : '🎥 Video'
                                : conversation.lastMessage.type === 'file'
                                  ? language === 'ar'
                                    ? '📎 ملف'
                                    : '📎 File'
                                  : conversation.lastMessage.type === 'audio'
                                    ? language === 'ar'
                                      ? '🎵 صوت'
                                      : '🎵 Audio'
                                    : ''}
                        </p>
                        {conversation.isMuted && (
                          <VolumeX className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <AnimatePresence>
                  {showOptions === conversation._id && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white shadow-lg rounded-lg p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onMuteConversation && (
                        <button
                          onClick={() => onMuteConversation(conversation._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={
                            conversation.isMuted
                              ? language === 'ar'
                                ? 'إلغاء كتم الصوت'
                                : 'Unmute'
                              : language === 'ar'
                                ? 'كتم الصوت'
                                : 'Mute'
                          }
                        >
                          {conversation.isMuted ? (
                            <Volume2 className="w-4 h-4 text-gray-600" />
                          ) : (
                            <VolumeX className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      )}
                      {onArchiveConversation && (
                        <button
                          onClick={() =>
                            onArchiveConversation(conversation._id)
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={language === 'ar' ? 'أرشفة' : 'Archive'}
                        >
                          <Archive className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      {onDeleteConversation && (
                        <button
                          onClick={() => onDeleteConversation(conversation._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title={language === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
