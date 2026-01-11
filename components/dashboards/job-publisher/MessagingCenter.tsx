'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import api from '@/services/api'
import { toast } from 'sonner'
import { MessageCircle, Send, Clock, User, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

interface Conversation {
  _id: string
  applicationId: string
  participants: Array<{
    userId: {
      _id: string
      firstName: string
      lastName: string
    }
    role: string
  }>
  subject: string
  lastMessage: {
    content: string
    sentAt: string
  }
  unreadCounts: Array<{
    userId: string
    unreadCount: number
  }>
}

interface Message {
  _id: string
  senderId: {
    _id: string
    firstName: string
    lastName: string
  }
  content: string
  createdAt: string
  isRead: boolean
}

export default function MessagingCenter() {
  const { language } = useLanguage()
  const searchParams = useSearchParams() // Add this
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  // Add this effect to handle initial conversation from URL
  useEffect(() => {
    const conversationId = searchParams.get('conversationId')
    if (conversationId) {
      setSelectedConversation(conversationId)
    }
  }, [searchParams])

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await api.get('/messages/conversations')
      if (response.data.success) {
        setConversations(response.data.conversations)
      }
    } catch (error: any) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await api.get(`/messages/conversation/${conversationId}`)
      if (response.data.success) {
        setMessages(response.data.messages || [])
        if (response.data.currentUserId) {
          setCurrentUserId(response.data.currentUserId)
        }
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    try {
      const response = await api.post('/messages/send', {
        conversationId: selectedConversation,
        content: newMessage.trim(),
      })

      if (response.data.success) {
        setMessages([...messages, response.data.message])
        setNewMessage('')
        fetchConversations() // Update conversation list
      }
    } catch (error: any) {
      toast.error(language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message')
    } finally {
      setSending(false)
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 p-6 border-b">
        <MessageCircle className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'مركز الرسائل' : 'Messaging Center'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
        {/* Conversations List */}
        <div className="border-b lg:border-b-0 lg:border-r overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{language === 'ar' ? 'لا توجد محادثات' : 'No conversations'}</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const otherParticipant = conv.participants.find((p) => p.role === 'applicant')
              const unreadCount = conv.unreadCounts.find((u) => u.unreadCount > 0)?.unreadCount || 0

              return (
                <button
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv._id)}
                  className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                    selectedConversation === conv._id ? 'bg-purple-50 border-purple-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-900">
                        {otherParticipant?.userId.firstName} {otherParticipant?.userId.lastName}
                      </h3>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-1">{conv.subject}</p>
                  {conv.lastMessage && (
                    <>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-1">{conv.lastMessage.content}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(conv.lastMessage.sentAt)}
                      </p>
                    </>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isOwn = currentUserId && msg.senderId?._id === currentUserId
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwn ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">
                          {msg.senderId.firstName} {msg.senderId.lastName}
                        </p>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-purple-200' : 'text-gray-500'}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Send Message */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={sending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === 'ar' ? 'اختر محادثة لعرض الرسائل' : 'Select a conversation to view messages'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
