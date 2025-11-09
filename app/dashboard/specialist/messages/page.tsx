'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { SocketProvider, useSocket } from '@/contexts/socket-context'
import { messagingService } from '@/services/messaging'
import type { Conversation } from '@/services/messaging'
import { ConversationList } from '@/components/messaging/ConversationList'
import { ChatWindow } from '@/components/messaging/ChatWindow'
import { MessageSquare, Plus, Users, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

function MessagesContent() {
  const router = useRouter()
  const { language } = useLanguage()
  const { user } = useAuth()
  const { onUserOnline, onUserOffline } = useSocket()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMobile, setShowMobile] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true)
        const response = await messagingService.getConversations()
        if (response.success) {
          setConversations(response.conversations)
        }
      } catch (err) {
        console.error('Error loading conversations:', err)
        setError(
          language === 'ar'
            ? 'فشل في تحميل المحادثات'
            : 'Failed to load conversations'
        )
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [language])

  // Listen for online/offline events
  useEffect(() => {
    onUserOnline((userId: string) => {
      console.log('[Messages] User online:', userId)
      setOnlineUsers((prev) => new Set(prev).add(userId))
    })

    onUserOffline((userId: string) => {
      console.log('[Messages] User offline:', userId)
      setOnlineUsers((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    })
  }, [onUserOnline, onUserOffline])

  const handleMuteConversation = async (id: string) => {
    try {
      const conversation = conversations.find((c) => c._id === id)
      if (!conversation) return

      if (conversation.isMuted) {
        await messagingService.unmuteConversation(id)
      } else {
        await messagingService.muteConversation(id)
      }

      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isMuted: !c.isMuted } : c))
      )
    } catch (error) {
      console.error('Error toggling mute:', error)
    }
  }

  const handleArchiveConversation = async (id: string) => {
    try {
      await messagingService.archiveConversation(id)
      setConversations((prev) => prev.filter((c) => c._id !== id))
      if (selectedConversation?._id === id) {
        setSelectedConversation(null)
      }
    } catch (error) {
      console.error('Error archiving conversation:', error)
    }
  }

  const handleDeleteConversation = async (id: string) => {
    try {
      await messagingService.deleteConversation(id)
      setConversations((prev) => prev.filter((c) => c._id !== id))
      if (selectedConversation?._id === id) {
        setSelectedConversation(null)
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setShowMobile(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="container mx-auto h-full p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl h-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => router.push('/dashboard/specialist')}
                  className="bg-white/20 text-white hover:bg-white/30 border-0"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {language === 'ar' ? 'العودة' : 'Back'}
                </Button>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {language === 'ar' ? 'الرسائل' : 'Messages'}
                  </h1>
                  <p className="text-blue-100 text-sm">
                    {language === 'ar'
                      ? `${conversations.length} محادثة`
                      : `${conversations.length} conversations`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex h-[calc(100%-108px)]">
            {/* Conversation List - Desktop */}
            <div
              className={`w-full lg:w-96 flex-shrink-0 ${
                showMobile ? 'hidden lg:block' : 'block'
              }`}
            >
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversation?._id}
                onSelectConversation={handleSelectConversation}
                onMuteConversation={handleMuteConversation}
                onArchiveConversation={handleArchiveConversation}
                onDeleteConversation={handleDeleteConversation}
                currentUserId={user?.id}
                onlineUsers={onlineUsers}
              />
            </div>

            {/* Chat Window - Desktop & Mobile */}
            <div
              className={`flex-1 ${showMobile ? 'block' : 'hidden lg:block'}`}
            >
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  currentUserId={user?.id || ''}
                  onBack={() => setShowMobile(false)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {language === 'ar'
                        ? 'اختر محادثة'
                        : 'Select a conversation'}
                    </h3>
                    <p className="text-gray-500">
                      {language === 'ar'
                        ? 'اختر محادثة من القائمة لبدء المراسلة'
                        : 'Choose a conversation from the list to start messaging'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CoachMessagesPage() {
  return (
    <SocketProvider>
      <MessagesContent />
    </SocketProvider>
  )
}
