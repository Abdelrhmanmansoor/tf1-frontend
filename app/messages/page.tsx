'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  MessageCircle,
  Send,
  Search,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  ArrowLeft,
  Filter,
  User,
  Building2,
  Image as ImageIcon,
} from 'lucide-react'
import Link from 'next/link'

const MessagesPage = () => {
  const { language } = useLanguage()
  // Mock user - NO BACKEND
  const mockUser = { id: '1', name: 'Demo User', role: 'player' }
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(1)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      name: 'Al-Hilal FC Recruitment',
      nameAr: 'توظيف نادي الهلال',
      avatar: '/avatars/hilal.jpg',
      lastMessage:
        'Thank you for your application. We would like to schedule an interview.',
      lastMessageAr: 'شكراً لك على طلبك. نود أن نحدد موعداً للمقابلة.',
      timestamp: '2 min ago',
      timestampAr: 'منذ دقيقتين',
      unreadCount: 2,
      online: true,
      type: 'club',
      status: 'active',
    },
    {
      id: 2,
      name: 'Ahmed Hassan',
      nameAr: 'أحمد حسن',
      avatar: '/avatars/ahmed.jpg',
      lastMessage: "Great performance in today's training session!",
      lastMessageAr: 'أداء رائع في جلسة التدريب اليوم!',
      timestamp: '1 hour ago',
      timestampAr: 'منذ ساعة',
      unreadCount: 0,
      online: true,
      type: 'coach',
      status: 'active',
    },
    {
      id: 3,
      name: 'Al-Nassr Academy',
      nameAr: 'أكاديمية النصر',
      avatar: '/avatars/nassr.jpg',
      lastMessage: 'Your medical clearance has been approved.',
      lastMessageAr: 'تم الموافقة على التخليص الطبي الخاص بك.',
      timestamp: '3 hours ago',
      timestampAr: 'منذ 3 ساعات',
      unreadCount: 1,
      online: false,
      type: 'club',
      status: 'active',
    },
    {
      id: 4,
      name: 'Dr. Sarah Al-Mansouri',
      nameAr: 'د. سارة المنصوري',
      avatar: '/avatars/doctor.jpg',
      lastMessage: 'Your fitness assessment results are ready for review.',
      lastMessageAr: 'نتائج تقييم اللياقة البدنية جاهزة للمراجعة.',
      timestamp: 'Yesterday',
      timestampAr: 'أمس',
      unreadCount: 0,
      online: false,
      type: 'specialist',
      status: 'active',
    },
    {
      id: 5,
      name: 'Sports Management Group',
      nameAr: 'مجموعة إدارة الرياضة',
      avatar: '/avatars/management.jpg',
      lastMessage: 'Contract details have been updated as discussed.',
      lastMessageAr: 'تم تحديث تفاصيل العقد كما نوقش.',
      timestamp: '2 days ago',
      timestampAr: 'منذ يومين',
      unreadCount: 0,
      online: false,
      type: 'agent',
      status: 'archived',
    },
  ]

  // Mock data for messages in selected conversation
  const messages = [
    {
      id: 1,
      senderId: 'club-hilal',
      senderName: 'Al-Hilal FC Recruitment',
      senderNameAr: 'توظيف نادي الهلال',
      message:
        'Hello! We received your application for the midfielder position.',
      messageAr: 'مرحباً! تلقينا طلبك لمنصب لاعب الوسط.',
      timestamp: '2024-01-15 10:00:00',
      type: 'text',
      status: 'read',
      isOwn: false,
    },
    {
      id: 2,
      senderId: mockUser.id || 'player-1',
      senderName: 'Demo',
      senderNameAr: 'Demo',
      message:
        "Thank you for considering my application. I'm very excited about this opportunity.",
      messageAr: 'شكراً لك على النظر في طلبي. أنا متحمس جداً لهذه الفرصة.',
      timestamp: '2024-01-15 10:05:00',
      type: 'text',
      status: 'read',
      isOwn: true,
    },
    {
      id: 3,
      senderId: 'club-hilal',
      senderName: 'Al-Hilal FC Recruitment',
      senderNameAr: 'توظيف نادي الهلال',
      message:
        "We've reviewed your profile and highlight videos. Your skills are impressive!",
      messageAr:
        'لقد راجعنا ملفك الشخصي ومقاطع الفيديو المميزة. مهاراتك مثيرة للإعجاب!',
      timestamp: '2024-01-15 14:30:00',
      type: 'text',
      status: 'read',
      isOwn: false,
    },
    {
      id: 4,
      senderId: mockUser.id || 'player-1',
      senderName: 'Demo',
      senderNameAr: 'Demo',
      message:
        'I appreciate the positive feedback. When would be a good time for an interview?',
      messageAr: 'أقدر التعليقات الإيجابية. متى سيكون الوقت المناسب للمقابلة؟',
      timestamp: '2024-01-15 14:35:00',
      type: 'text',
      status: 'read',
      isOwn: true,
    },
    {
      id: 5,
      senderId: 'club-hilal',
      senderName: 'Al-Hilal FC Recruitment',
      senderNameAr: 'توظيف نادي الهلال',
      message:
        'Perfect! How about this Thursday at 2 PM at our training facility?',
      messageAr: 'ممتاز! ما رأيك في الخميس الساعة 2 مساءً في منشأة التدريب؟',
      timestamp: '2024-01-15 16:20:00',
      type: 'text',
      status: 'read',
      isOwn: false,
    },
    {
      id: 6,
      senderId: mockUser.id || 'player-1',
      senderName: 'Demo',
      senderNameAr: 'Demo',
      message: "Thursday at 2 PM works perfectly for me. I'll be there!",
      messageAr: 'يوم الخميس الساعة الثانية مساءً مناسب تماماً لي. سأكون هناك!',
      timestamp: '2024-01-15 16:25:00',
      type: 'text',
      status: 'delivered',
      isOwn: true,
    },
    {
      id: 7,
      senderId: 'club-hilal',
      senderName: 'Al-Hilal FC Recruitment',
      senderNameAr: 'توظيف نادي الهلال',
      message:
        'Thank you for your application. We would like to schedule an interview.',
      messageAr: 'شكراً لك على طلبك. نود أن نحدد موعداً للمقابلة.',
      timestamp: '2024-01-15 18:45:00',
      type: 'text',
      status: 'delivered',
      isOwn: false,
    },
  ]

  const filteredConversations = conversations.filter(
    (conv) =>
      searchQuery === '' ||
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.nameAr.includes(searchQuery) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessageAr.includes(searchQuery)
  )

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Here you would typically send the message via API
      console.log('Sending message:', messageText)
      setMessageText('')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'club':
        return <Building2 className="w-4 h-4" />
      case 'coach':
        return <User className="w-4 h-4" />
      case 'specialist':
        return <User className="w-4 h-4" />
      case 'agent':
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getMessageStatus = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'العودة' : 'Back'}
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'الرسائل' : 'Messages'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'جديد' : 'New'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={
                  language === 'ar'
                    ? 'البحث في المحادثات...'
                    : 'Search conversations...'
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id
                    ? 'bg-blue-50 border-r-4 border-r-blue-500'
                    : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(conversation.type)}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {language === 'ar'
                        ? conversation.nameAr
                        : conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {language === 'ar'
                        ? conversation.timestampAr
                        : conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {language === 'ar'
                        ? conversation.lastMessageAr
                        : conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col bg-white lg:flex">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      {getTypeIcon(selectedConv.type)}
                    </div>
                    {selectedConv.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {language === 'ar'
                        ? selectedConv.nameAr
                        : selectedConv.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedConv.online
                        ? language === 'ar'
                          ? 'متصل الآن'
                          : 'Online now'
                        : language === 'ar'
                          ? 'غير متصل'
                          : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-1' : 'order-2'}`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.isOwn
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 rounded-bl-sm border'
                      }`}
                    >
                      <p className="text-sm">
                        {language === 'ar'
                          ? message.messageAr
                          : message.message}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                        message.isOwn ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {message.isOwn && getMessageStatus(message.status)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={
                      language === 'ar' ? 'اكتب رسالة...' : 'Type a message...'
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {language === 'ar' ? 'اختر محادثة' : 'Select a conversation'}
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
  )
}

export default MessagesPage
