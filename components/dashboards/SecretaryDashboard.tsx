'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Users,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  LogOut,
  AlertCircle,
  Edit,
  FileText,
  Bell,
  Mail,
  Phone,
  MessageSquare,
  Inbox,
  Send,
  Paperclip,
  CalendarDays,
  ClipboardList,
  FolderOpen,
  Printer,
  Archive,
  Search,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Meeting {
  id: string
  title: string
  titleAr: string
  date: string
  time: string
  location: string
  attendees: number
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
}

interface Document {
  id: string
  name: string
  type: 'contract' | 'letter' | 'report' | 'memo'
  date: string
  status: 'pending' | 'approved' | 'rejected'
  priority: 'high' | 'normal' | 'low'
}

interface Message {
  id: string
  from: string
  subject: string
  subjectAr: string
  date: string
  read: boolean
  priority: 'high' | 'normal'
}

interface DashboardStats {
  todayMeetings: number
  pendingDocuments: number
  unreadMessages: number
  upcomingCalls: number
  tasksToday: number
  scheduledEvents: number
}

const SecretaryDashboard = () => {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    todayMeetings: 0,
    pendingDocuments: 0,
    unreadMessages: 0,
    upcomingCalls: 0,
    tasksToday: 0,
    scheduledEvents: 0
  })
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          todayMeetings: 4,
          pendingDocuments: 12,
          unreadMessages: 8,
          upcomingCalls: 3,
          tasksToday: 7,
          scheduledEvents: 15
        })

        setMeetings([
          { id: '1', title: 'Board Meeting', titleAr: 'اجتماع مجلس الإدارة', date: '2024-01-16', time: '09:00', location: 'قاعة الاجتماعات الرئيسية', attendees: 12, status: 'scheduled' },
          { id: '2', title: 'Team Sync', titleAr: 'اجتماع الفريق', date: '2024-01-16', time: '11:00', location: 'غرفة الاجتماعات 2', attendees: 8, status: 'scheduled' },
          { id: '3', title: 'Client Call', titleAr: 'مكالمة العميل', date: '2024-01-16', time: '14:00', location: 'عبر الإنترنت', attendees: 4, status: 'scheduled' },
          { id: '4', title: 'Weekly Review', titleAr: 'المراجعة الأسبوعية', date: '2024-01-16', time: '16:00', location: 'مكتب المدير', attendees: 5, status: 'scheduled' },
        ])

        setDocuments([
          { id: '1', name: 'عقد شراكة - نادي الهلال', type: 'contract', date: '2024-01-15', status: 'pending', priority: 'high' },
          { id: '2', name: 'تقرير الأداء الشهري', type: 'report', date: '2024-01-14', status: 'pending', priority: 'normal' },
          { id: '3', name: 'مذكرة داخلية - تحديث السياسات', type: 'memo', date: '2024-01-13', status: 'approved', priority: 'normal' },
          { id: '4', name: 'خطاب رسمي - وزارة الرياضة', type: 'letter', date: '2024-01-12', status: 'pending', priority: 'high' },
        ])

        setMessages([
          { id: '1', from: 'المدير التنفيذي', subject: 'Urgent: Board Meeting Preparation', subjectAr: 'عاجل: تحضيرات اجتماع مجلس الإدارة', date: '2024-01-16 08:30', read: false, priority: 'high' },
          { id: '2', from: 'قسم الموارد البشرية', subject: 'New Employee Onboarding', subjectAr: 'تعيين موظف جديد', date: '2024-01-16 07:45', read: false, priority: 'normal' },
          { id: '3', from: 'المدير الرياضي', subject: 'Training Schedule Update', subjectAr: 'تحديث جدول التدريب', date: '2024-01-15 16:20', read: true, priority: 'normal' },
        ])

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const displayName = user?.firstName || (language === 'ar' ? 'السكرتير' : 'Secretary')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-12 h-12 text-teal-600" />
          </motion.div>
          <p className="text-gray-600 text-lg">
            {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'خطأ في التحميل' : 'Loading Error'}
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const statCards = [
    { icon: CalendarDays, label: language === 'ar' ? 'اجتماعات اليوم' : "Today's Meetings", value: stats.todayMeetings, color: 'from-teal-500 to-cyan-500' },
    { icon: FileText, label: language === 'ar' ? 'مستندات معلقة' : 'Pending Documents', value: stats.pendingDocuments, color: 'from-blue-500 to-indigo-500' },
    { icon: Mail, label: language === 'ar' ? 'رسائل غير مقروءة' : 'Unread Messages', value: stats.unreadMessages, color: 'from-purple-500 to-pink-500' },
    { icon: Phone, label: language === 'ar' ? 'مكالمات قادمة' : 'Upcoming Calls', value: stats.upcomingCalls, color: 'from-green-500 to-emerald-500' },
    { icon: ClipboardList, label: language === 'ar' ? 'مهام اليوم' : 'Tasks Today', value: stats.tasksToday, color: 'from-orange-500 to-yellow-500' },
    { icon: Calendar, label: language === 'ar' ? 'أحداث مجدولة' : 'Scheduled Events', value: stats.scheduledEvents, color: 'from-rose-500 to-red-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  TF1
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">
                {language === 'ar' ? 'السكرتير' : 'Secretary'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <GlobalSearchButton />
              <MessageNotificationBadge dashboardType="secretary" />
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? `مرحباً، ${displayName}` : `Welcome, ${displayName}`}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة الجدول والمراسلات' : 'Manage schedules and correspondence'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'اجتماعات اليوم' : "Today's Meetings"}
              </h2>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'اجتماع جديد' : 'New Meeting'}
              </Button>
            </div>
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex flex-col items-center justify-center text-white">
                      <span className="text-xs">{meeting.time.split(':')[0]}</span>
                      <span className="text-lg font-bold">{meeting.time.split(':')[1]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{language === 'ar' ? meeting.titleAr : meeting.title}</p>
                      <p className="text-sm text-gray-500">{meeting.location}</p>
                      <p className="text-xs text-gray-400">{meeting.attendees} {language === 'ar' ? 'مشارك' : 'attendees'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'الرسائل' : 'Messages'}
              </h2>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                {stats.unreadMessages} {language === 'ar' ? 'جديد' : 'new'}
              </span>
            </div>
            <div className="space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    message.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`font-medium ${message.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {message.from}
                    </span>
                    {message.priority === 'high' && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs">
                        {language === 'ar' ? 'عاجل' : 'Urgent'}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${message.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {language === 'ar' ? message.subjectAr : message.subject}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{message.date}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Inbox className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'عرض الكل' : 'View All'}
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'المستندات المعلقة' : 'Pending Documents'}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'مستند جديد' : 'New Document'}
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'المستند' : 'Document'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'النوع' : 'Type'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'الأولوية' : 'Priority'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        doc.type === 'contract' ? 'bg-blue-100 text-blue-800' :
                        doc.type === 'letter' ? 'bg-green-100 text-green-800' :
                        doc.type === 'report' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.type === 'contract' ? (language === 'ar' ? 'عقد' : 'Contract') :
                         doc.type === 'letter' ? (language === 'ar' ? 'خطاب' : 'Letter') :
                         doc.type === 'report' ? (language === 'ar' ? 'تقرير' : 'Report') :
                         (language === 'ar' ? 'مذكرة' : 'Memo')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{doc.date}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        doc.priority === 'high' ? 'bg-red-100 text-red-800' :
                        doc.priority === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {doc.priority === 'high' ? (language === 'ar' ? 'عالي' : 'High') :
                         doc.priority === 'normal' ? (language === 'ar' ? 'عادي' : 'Normal') :
                         (language === 'ar' ? 'منخفض' : 'Low')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                        doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status === 'approved' ? (language === 'ar' ? 'موافق' : 'Approved') :
                         doc.status === 'rejected' ? (language === 'ar' ? 'مرفوض' : 'Rejected') :
                         (language === 'ar' ? 'معلق' : 'Pending')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Calendar, label: language === 'ar' ? 'التقويم' : 'Calendar', href: '/dashboard/secretary/calendar' },
            { icon: FileText, label: language === 'ar' ? 'المستندات' : 'Documents', href: '/dashboard/secretary/documents' },
            { icon: Mail, label: language === 'ar' ? 'الرسائل' : 'Messages', href: '/dashboard/secretary/messages' },
            { icon: ClipboardList, label: language === 'ar' ? 'المهام' : 'Tasks', href: '/dashboard/secretary/tasks' },
          ].map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-gray-900">{action.label}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </main>
    </div>
  )
}

export default SecretaryDashboard
