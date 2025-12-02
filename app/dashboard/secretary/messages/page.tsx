'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import secretaryService from '@/services/secretary'
import {
  Mail,
  Loader2,
  Plus,
  X,
  Search,
  Filter,
  ArrowLeft,
  Inbox,
  Send,
  Star,
  Trash2,
  Reply,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  from: { id: string; name: string; email: string }
  to: { id: string; name: string; email: string }
  subject: string
  subjectAr: string
  body: string
  bodyAr: string
  priority: 'high' | 'normal'
  date: string
  read: boolean
}

export default function SecretaryMessagesPage() {
  const { language } = useLanguage()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterRead, setFilterRead] = useState<string>('all')
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox')

  const [newMessage, setNewMessage] = useState({
    toEmail: '',
    toName: '',
    subject: '',
    subjectAr: '',
    body: '',
    bodyAr: '',
    priority: 'normal' as 'high' | 'normal'
  })

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const data = await secretaryService.getMessages()
      setMessages(data || [])
      setFilteredMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error(language === 'ar' ? 'تعذر تحميل الرسائل' : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    let filtered = [...messages]

    if (searchQuery) {
      filtered = filtered.filter(msg => 
        msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subjectAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.from?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.body?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(msg => msg.priority === filterPriority)
    }

    if (filterRead !== 'all') {
      filtered = filtered.filter(msg => filterRead === 'read' ? msg.read : !msg.read)
    }

    setFilteredMessages(filtered)
  }, [messages, searchQuery, filterPriority, filterRead])

  const handleSendMessage = async () => {
    if (!newMessage.toEmail || !newMessage.subject) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    try {
      setSaving(true)
      await secretaryService.sendMessage({
        from: { 
          id: user?.id || '', 
          name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Secretary',
          email: user?.email || ''
        },
        to: { id: '', name: newMessage.toName, email: newMessage.toEmail },
        subject: newMessage.subject,
        subjectAr: newMessage.subjectAr || newMessage.subject,
        body: newMessage.body,
        bodyAr: newMessage.bodyAr || newMessage.body,
        priority: newMessage.priority
      })
      toast.success(language === 'ar' ? 'تم إرسال الرسالة بنجاح' : 'Message sent successfully')
      setShowComposeModal(false)
      setNewMessage({
        toEmail: '',
        toName: '',
        subject: '',
        subjectAr: '',
        body: '',
        bodyAr: '',
        priority: 'normal'
      })
      fetchMessages()
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    } finally {
      setSaving(false)
    }
  }

  const unreadCount = messages.filter(m => !m.read).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/secretary">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'الرسائل' : 'Messages'}
            </h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                {unreadCount} {language === 'ar' ? 'غير مقروءة' : 'unread'}
              </span>
            )}
          </div>
          <Button 
            onClick={() => setShowComposeModal(true)}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'رسالة جديدة' : 'New Message'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'inbox' ? 'bg-teal-100 text-teal-800' : 'hover:bg-gray-100'
                }`}
              >
                <Inbox className="w-5 h-5" />
                <span>{language === 'ar' ? 'صندوق الوارد' : 'Inbox'}</span>
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'sent' ? 'bg-teal-100 text-teal-800' : 'hover:bg-gray-100'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>{language === 'ar' ? 'المرسلة' : 'Sent'}</span>
              </button>
            </div>

            <hr className="my-4" />

            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all">{language === 'ar' ? 'كل الأولويات' : 'All Priorities'}</option>
                <option value="high">{language === 'ar' ? 'عاجل' : 'Urgent'}</option>
                <option value="normal">{language === 'ar' ? 'عادي' : 'Normal'}</option>
              </select>

              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
                <option value="unread">{language === 'ar' ? 'غير مقروءة' : 'Unread'}</option>
                <option value="read">{language === 'ar' ? 'مقروءة' : 'Read'}</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>{language === 'ar' ? 'لا توجد رسائل' : 'No messages'}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message)
                      setShowViewModal(true)
                    }}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      !message.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.priority === 'high' ? 'bg-red-100' : 'bg-teal-100'
                      }`}>
                        <Mail className={`w-5 h-5 ${
                          message.priority === 'high' ? 'text-red-600' : 'text-teal-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${!message.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {message.from?.name || 'Unknown Sender'}
                          </span>
                          <span className="text-xs text-gray-400">{message.date}</span>
                        </div>
                        <p className={`text-sm truncate ${!message.read ? 'text-gray-800' : 'text-gray-500'}`}>
                          {language === 'ar' ? message.subjectAr : message.subject}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {language === 'ar' ? message.bodyAr : message.body}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {message.priority === 'high' && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        {!message.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showComposeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {language === 'ar' ? 'رسالة جديدة' : 'New Message'}
                </h3>
                <button onClick={() => setShowComposeModal(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'إلى (البريد الإلكتروني)' : 'To (Email)'} *
                  </label>
                  <input
                    type="email"
                    value={newMessage.toEmail}
                    onChange={(e) => setNewMessage({ ...newMessage, toEmail: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'اسم المستلم' : 'Recipient Name'}
                  </label>
                  <input
                    type="text"
                    value={newMessage.toName}
                    onChange={(e) => setNewMessage({ ...newMessage, toName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الموضوع' : 'Subject'} *
                  </label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الأولوية' : 'Priority'}
                  </label>
                  <select
                    value={newMessage.priority}
                    onChange={(e) => setNewMessage({ ...newMessage, priority: e.target.value as 'high' | 'normal' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="normal">{language === 'ar' ? 'عادي' : 'Normal'}</option>
                    <option value="high">{language === 'ar' ? 'عاجل' : 'Urgent'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الرسالة' : 'Message'} *
                  </label>
                  <textarea
                    value={newMessage.body}
                    onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    rows={5}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowComposeModal(false)} className="flex-1">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'إرسال' : 'Send'}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {showViewModal && selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  {selectedMessage.priority === 'high' && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs mb-2 inline-block">
                      {language === 'ar' ? 'عاجل' : 'Urgent'}
                    </span>
                  )}
                  <h3 className="text-xl font-bold">
                    {language === 'ar' ? selectedMessage.subjectAr : selectedMessage.subject}
                  </h3>
                </div>
                <button onClick={() => { setShowViewModal(false); setSelectedMessage(null); }}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedMessage.from?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.from?.email}</p>
                    <p className="text-xs text-gray-400">{selectedMessage.date}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {language === 'ar' ? selectedMessage.bodyAr : selectedMessage.body}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewMessage({
                      toEmail: selectedMessage.from?.email || '',
                      toName: selectedMessage.from?.name || '',
                      subject: `Re: ${selectedMessage.subject}`,
                      subjectAr: `رد: ${selectedMessage.subjectAr}`,
                      body: '',
                      bodyAr: '',
                      priority: 'normal'
                    })
                    setShowViewModal(false)
                    setShowComposeModal(true)
                  }}
                  className="flex-1"
                >
                  <Reply className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'رد' : 'Reply'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
