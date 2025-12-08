'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import { getMatchChat, sendChatMessage, getMatchById } from '@/services/matches'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, ArrowLeft } from 'lucide-react'

export default function MatchChatPage() {
  const params = useParams()
  const router = useRouter()
  const [match, setMatch] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchData()
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchData = async () => {
    try {
      const [matchData, chatData] = await Promise.all([
        getMatchById(params.id as string),
        getMatchChat(params.id as string),
      ])
      setMatch(matchData)
      setMessages(chatData.messages || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    setSending(true)
    try {
      await sendChatMessage(params.id as string, newMessage)
      setNewMessage('')
      await fetchData()
    } catch (error: any) {
      alert(error.response?.data?.message || 'فشل إرسال الرسالة')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-4 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {match?.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {match?.players?.length || 0} مشاركين
                </p>
              </div>
            </div>
            <MessageSquare className="w-6 h-6 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-4 h-[calc(100%-8rem)] overflow-y-auto"
        >
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                لا توجد رسائل بعد. كن أول من يبدأ المحادثة!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message._id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {message.sender?.firstName?.[0]}
                    {message.sender?.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {message.sender?.firstName} {message.sender?.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleTimeString(
                          'ar-SA',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-4"
        >
          <form onSubmit={handleSend} className="flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              disabled={sending}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 gap-2"
            >
              <Send className="w-4 h-4" />
              إرسال
            </Button>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
