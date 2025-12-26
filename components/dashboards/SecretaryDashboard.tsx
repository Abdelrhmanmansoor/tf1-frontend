'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import secretaryService from '@/services/secretary'
import {
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  LogOut,
  Edit,
  FileText,
  Bell,
  Mail,
  Phone,
  Inbox,
  CalendarDays,
  ClipboardList,
  Plus,
  X,
  Trash2,
  Eye,
  Video,
  MapPin,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Meeting {
  id: string
  title: string
  titleAr: string
  date: string
  time: string
  duration: number
  location: string
  locationAr: string
  isOnline: boolean
  meetingLink?: string
  attendees: Array<{ id: string; name: string; email: string; status: 'pending' | 'confirmed' | 'declined' }>
  agenda: string
  agendaAr: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  notes?: string
}

interface Document {
  id: string
  name: string
  type: 'contract' | 'letter' | 'report' | 'memo'
  fileUrl: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  priority: 'high' | 'normal' | 'low'
  assignedTo: string
  dueDate: string
  notes?: string
}

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

interface Task {
  id: string
  title: string
  titleAr: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  assignedBy: string
}

interface DashboardStats {
  todayMeetings: number
  pendingDocuments: number
  unreadMessages: number
  upcomingCalls: number
  tasksToday: number
  scheduledEvents: number
}

interface Notification {
  id: string
  type: 'meeting' | 'message' | 'document' | 'task'
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  priority: 'urgent' | 'normal'
  timestamp: string
  read: boolean
  actionUrl: string
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
  const [_tasks, setTasks] = useState<Task[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false)
  const [showEditMeetingModal, setShowEditMeetingModal] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [saving, setSaving] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    titleAr: '',
    date: '',
    time: '',
    duration: 60,
    location: '',
    locationAr: '',
    isOnline: false,
    meetingLink: '',
    agenda: '',
    agendaAr: ''
  })

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [statsData, meetingsData, documentsData, messagesData, tasksData] = await Promise.allSettled([
        secretaryService.getDashboard(),
        secretaryService.getMeetings(),
        secretaryService.getDocuments(),
        secretaryService.getMessages(),
        secretaryService.getTasks()
      ])

      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats(statsData.value)
      }

      if (meetingsData.status === 'fulfilled') {
        const allMeetings = meetingsData.value || []
        const today = new Date().toISOString().split('T')[0]
        const todayMeetings = allMeetings.filter((m: Meeting) => m.date === today)
        setMeetings(todayMeetings.length > 0 ? todayMeetings : allMeetings.slice(0, 4))
        
        if (statsData.status !== 'fulfilled') {
          setStats(prev => ({ ...prev, todayMeetings: todayMeetings.length }))
        }
      }

      if (documentsData.status === 'fulfilled') {
        const docs = documentsData.value || []
        setDocuments(docs.slice(0, 5))
        if (statsData.status !== 'fulfilled') {
          setStats(prev => ({ ...prev, pendingDocuments: docs.filter((d: Document) => d.status === 'pending').length }))
        }
      }

      if (messagesData.status === 'fulfilled') {
        const msgs = messagesData.value || []
        setMessages(msgs.slice(0, 5))
        if (statsData.status !== 'fulfilled') {
          setStats(prev => ({ ...prev, unreadMessages: msgs.filter((m: Message) => !m.read).length }))
        }
      }

      if (tasksData.status === 'fulfilled') {
        const allTasks = tasksData.value || []
        setTasks(allTasks.slice(0, 5))
        if (statsData.status !== 'fulfilled') {
          setStats(prev => ({ ...prev, tasksToday: allTasks.filter((t: Task) => t.status !== 'completed').length }))
        }
      }

      generateNotifications(
        meetingsData.status === 'fulfilled' ? meetingsData.value : [],
        messagesData.status === 'fulfilled' ? messagesData.value : [],
        documentsData.status === 'fulfilled' ? documentsData.value : [],
        tasksData.status === 'fulfilled' ? tasksData.value : []
      )

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(language === 'ar' 
        ? 'تعذر تحميل البيانات - يرجى المحاولة مرة أخرى' 
        : 'Failed to load data - please try again')
    } finally {
      setLoading(false)
    }
  }, [language])

  const generateNotifications = (meetings: Meeting[], messages: Message[], documents: Document[], tasks: Task[]) => {
    const notifs: Notification[] = []
    
    const unreadMessages = messages.filter((m: Message) => !m.read)
    unreadMessages.forEach((msg: Message) => {
      notifs.push({
        id: `msg-${msg.id}`,
        type: 'message',
        title: 'New Message',
        titleAr: 'رسالة جديدة',
        description: msg.subject,
        descriptionAr: msg.subjectAr,
        priority: msg.priority === 'high' ? 'urgent' : 'normal',
        timestamp: msg.date,
        read: false,
        actionUrl: '/dashboard/secretary/messages'
      })
    })

    const today = new Date()
    const upcomingMeetings = meetings.filter((m: Meeting) => {
      const meetingDate = new Date(m.date + 'T' + m.time)
      const timeDiff = meetingDate.getTime() - today.getTime()
      return timeDiff > 0 && timeDiff < 3600000
    })
    upcomingMeetings.forEach((meeting: Meeting) => {
      notifs.push({
        id: `meet-${meeting.id}`,
        type: 'meeting',
        title: 'Upcoming Meeting',
        titleAr: 'اجتماع قادم',
        description: meeting.title,
        descriptionAr: meeting.titleAr,
        priority: 'urgent',
        timestamp: `${meeting.date} ${meeting.time}`,
        read: false,
        actionUrl: '/dashboard/secretary/calendar'
      })
    })

    const pendingDocs = documents.filter((d: Document) => d.status === 'pending' && d.priority === 'high')
    pendingDocs.forEach((doc: Document) => {
      notifs.push({
        id: `doc-${doc.id}`,
        type: 'document',
        title: 'Urgent Document',
        titleAr: 'مستند عاجل',
        description: doc.name,
        descriptionAr: doc.name,
        priority: 'urgent',
        timestamp: doc.date,
        read: false,
        actionUrl: '/dashboard/secretary/documents'
      })
    })

    const urgentTasks = tasks.filter((t: Task) => t.status !== 'completed' && t.priority === 'high')
    urgentTasks.forEach((task: Task) => {
      notifs.push({
        id: `task-${task.id}`,
        type: 'task',
        title: 'Urgent Task',
        titleAr: 'مهمة عاجلة',
        description: task.title,
        descriptionAr: task.titleAr,
        priority: 'urgent',
        timestamp: task.dueDate,
        read: false,
        actionUrl: '/dashboard/secretary/tasks'
      })
    })

    setNotifications(notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
  }

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 60000)
    return () => clearInterval(interval)
  }, [fetchDashboardData])

  const handleAddMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    try {
      setSaving(true)
      await secretaryService.createMeeting({
        title: newMeeting.title,
        titleAr: newMeeting.titleAr || newMeeting.title,
        date: newMeeting.date,
        time: newMeeting.time,
        duration: newMeeting.duration,
        location: newMeeting.location,
        locationAr: newMeeting.locationAr || newMeeting.location,
        isOnline: newMeeting.isOnline,
        meetingLink: newMeeting.meetingLink,
        agenda: newMeeting.agenda,
        agendaAr: newMeeting.agendaAr || newMeeting.agenda,
        attendees: [],
        status: 'scheduled'
      })
      toast.success(language === 'ar' ? 'تمت إضافة الاجتماع بنجاح' : 'Meeting added successfully')
      setShowAddMeetingModal(false)
      setNewMeeting({
        title: '',
        titleAr: '',
        date: '',
        time: '',
        duration: 60,
        location: '',
        locationAr: '',
        isOnline: false,
        meetingLink: '',
        agenda: '',
        agendaAr: ''
      })
      fetchDashboardData()
    } catch (error: any) {
      console.error('Error adding meeting:', error)
      toast.error(language === 'ar' 
        ? 'الخدمة غير متاحة حالياً' 
        : 'Service temporarily unavailable')
    } finally {
      setSaving(false)
    }
  }

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setShowEditMeetingModal(true)
  }

  const handleUpdateMeeting = async () => {
    if (!editingMeeting) return

    try {
      setSaving(true)
      await secretaryService.updateMeeting(editingMeeting.id, editingMeeting)
      toast.success(language === 'ar' ? 'تم تحديث الاجتماع بنجاح' : 'Meeting updated successfully')
      setShowEditMeetingModal(false)
      setEditingMeeting(null)
      fetchDashboardData()
    } catch (error: any) {
      console.error('Error updating meeting:', error)
      toast.error(language === 'ar' 
        ? 'الخدمة غير متاحة حالياً' 
        : 'Service temporarily unavailable')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMeeting = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الاجتماع؟' : 'Are you sure you want to delete this meeting?')) {
      return
    }

    try {
      await secretaryService.deleteMeeting(id)
      toast.success(language === 'ar' ? 'تم حذف الاجتماع' : 'Meeting deleted')
      fetchDashboardData()
    } catch (error: any) {
      console.error('Error deleting meeting:', error)
      toast.error(language === 'ar' 
        ? 'الخدمة غير متاحة حالياً' 
        : 'Service temporarily unavailable')
    }
  }

  const handleMarkMeetingComplete = async (meeting: Meeting) => {
    try {
      await secretaryService.updateMeeting(meeting.id, { status: 'completed' })
      toast.success(language === 'ar' ? 'تم تحديث حالة الاجتماع' : 'Meeting status updated')
      fetchDashboardData()
    } catch (error: any) {
      console.error('Error updating meeting:', error)
      toast.error(language === 'ar' 
        ? 'الخدمة غير متاحة حالياً' 
        : 'Service temporarily unavailable')
    }
  }

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
              onClick={() => fetchDashboardData()}
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
    { icon: CalendarDays, label: language === 'ar' ? 'اجتماعات اليوم' : "Today's Meetings", value: stats.todayMeetings, color: 'from-teal-500 to-cyan-500', href: '/dashboard/secretary/calendar' },
    { icon: FileText, label: language === 'ar' ? 'مستندات معلقة' : 'Pending Documents', value: stats.pendingDocuments, color: 'from-blue-500 to-indigo-500', href: '/dashboard/secretary/documents' },
    { icon: Mail, label: language === 'ar' ? 'رسائل غير مقروءة' : 'Unread Messages', value: stats.unreadMessages, color: 'from-purple-500 to-pink-500', href: '/dashboard/secretary/messages' },
    { icon: Phone, label: language === 'ar' ? 'مكالمات قادمة' : 'Upcoming Calls', value: stats.upcomingCalls, color: 'from-green-500 to-emerald-500', href: '/dashboard/secretary/calls' },
    { icon: ClipboardList, label: language === 'ar' ? 'مهام اليوم' : 'Tasks Today', value: stats.tasksToday, color: 'from-orange-500 to-yellow-500', href: '/dashboard/secretary/tasks' },
    { icon: Calendar, label: language === 'ar' ? 'أحداث مجدولة' : 'Scheduled Events', value: stats.scheduledEvents, color: 'from-rose-500 to-red-500', href: '/dashboard/secretary/calendar' },
  ]

  const unreadNotifications = notifications.filter(n => !n.read)

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
              
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-12 left-0 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
                    >
                      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                        </h3>
                        <button onClick={() => setShowNotifications(false)}>
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.slice(0, 10).map((notif) => (
                            <Link key={notif.id} href={notif.actionUrl}>
                              <div className={`p-3 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}>
                                <div className="flex items-start gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    notif.priority === 'urgent' ? 'bg-red-100' : 'bg-gray-100'
                                  }`}>
                                    {notif.type === 'meeting' && <CalendarDays className={`w-4 h-4 ${notif.priority === 'urgent' ? 'text-red-600' : 'text-gray-600'}`} />}
                                    {notif.type === 'message' && <Mail className={`w-4 h-4 ${notif.priority === 'urgent' ? 'text-red-600' : 'text-gray-600'}`} />}
                                    {notif.type === 'document' && <FileText className={`w-4 h-4 ${notif.priority === 'urgent' ? 'text-red-600' : 'text-gray-600'}`} />}
                                    {notif.type === 'task' && <ClipboardList className={`w-4 h-4 ${notif.priority === 'urgent' ? 'text-red-600' : 'text-gray-600'}`} />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                      {language === 'ar' ? notif.titleAr : notif.title}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {language === 'ar' ? notif.descriptionAr : notif.description}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
                                  </div>
                                  {notif.priority === 'urgent' && (
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
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
            <Link key={index} href={stat.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
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
            </Link>
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
              <Button 
                onClick={() => setShowAddMeetingModal(true)}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'اجتماع جديد' : 'New Meeting'}
              </Button>
            </div>
            <div className="space-y-4">
              {meetings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {language === 'ar' ? 'لا توجد اجتماعات اليوم' : 'No meetings today'}
                </div>
              ) : (
                meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white ${
                        meeting.status === 'completed' ? 'bg-green-500' :
                        meeting.status === 'cancelled' ? 'bg-red-500' :
                        'bg-gradient-to-br from-teal-500 to-cyan-500'
                      }`}>
                        <span className="text-xs">{meeting.time.split(':')[0]}</span>
                        <span className="text-lg font-bold">{meeting.time.split(':')[1]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{language === 'ar' ? meeting.titleAr : meeting.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {meeting.isOnline ? (
                            <Video className="w-3 h-3" />
                          ) : (
                            <MapPin className="w-3 h-3" />
                          )}
                          <span>{language === 'ar' ? meeting.locationAr : meeting.location}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {meeting.attendees?.length || 0} {language === 'ar' ? 'مشارك' : 'attendees'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {meeting.status === 'scheduled' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkMeetingComplete(meeting)}
                          title={language === 'ar' ? 'تمت' : 'Complete'}
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditMeeting(meeting)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                        className="hover:bg-red-50 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/secretary/calendar">
              <Button variant="outline" className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'عرض التقويم الكامل' : 'View Full Calendar'}
              </Button>
            </Link>
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
              {messages.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  {language === 'ar' ? 'لا توجد رسائل' : 'No messages'}
                </div>
              ) : (
                messages.map((message) => (
                  <Link key={message.id} href="/dashboard/secretary/messages">
                    <div 
                      className={`p-3 rounded-xl cursor-pointer transition-colors ${
                        message.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`font-medium ${message.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {message.from?.name || message.from}
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
                  </Link>
                ))
              )}
            </div>
            <Link href="/dashboard/secretary/messages">
              <Button variant="outline" className="w-full mt-4">
                <Inbox className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'عرض الكل' : 'View All'}
              </Button>
            </Link>
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
            <Link href="/dashboard/secretary/documents">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'مستند جديد' : 'New Document'}
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {language === 'ar' ? 'لا توجد مستندات' : 'No documents'}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-600`}>
                      {language === 'ar' ? 'المستند' : 'Document'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-600`}>
                      {language === 'ar' ? 'النوع' : 'Type'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-600`}>
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-600`}>
                      {language === 'ar' ? 'الأولوية' : 'Priority'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-600`}>
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-3 px-4 font-medium text-gray-600`}>
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
                          <Link href={`/dashboard/secretary/documents?id=${doc.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/secretary/documents?edit=${doc.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <Link href="/dashboard/secretary/documents">
            <Button variant="outline" className="w-full mt-4">
              <FileText className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'عرض جميع المستندات' : 'View All Documents'}
            </Button>
          </Link>
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

      <AnimatePresence>
        {showAddMeetingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {language === 'ar' ? 'إضافة اجتماع جديد' : 'Add New Meeting'}
                </h3>
                <button onClick={() => setShowAddMeetingModal(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'} *
                  </label>
                  <input
                    type="text"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder={language === 'ar' ? 'عنوان الاجتماع' : 'Meeting title'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={newMeeting.titleAr}
                    onChange={(e) => setNewMeeting({ ...newMeeting, titleAr: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    dir="rtl"
                    placeholder="عنوان الاجتماع بالعربي"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'التاريخ' : 'Date'} *
                    </label>
                    <input
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الوقت' : 'Time'} *
                    </label>
                    <input
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'المدة (بالدقائق)' : 'Duration (minutes)'}
                  </label>
                  <input
                    type="number"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={newMeeting.isOnline}
                    onChange={(e) => setNewMeeting({ ...newMeeting, isOnline: e.target.checked })}
                    className="w-4 h-4 text-teal-600"
                  />
                  <label htmlFor="isOnline" className="text-sm text-gray-700">
                    {language === 'ar' ? 'اجتماع أونلاين' : 'Online Meeting'}
                  </label>
                </div>

                {newMeeting.isOnline ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'رابط الاجتماع' : 'Meeting Link'}
                    </label>
                    <input
                      type="url"
                      value={newMeeting.meetingLink}
                      onChange={(e) => setNewMeeting({ ...newMeeting, meetingLink: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="https://..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'المكان' : 'Location'}
                    </label>
                    <input
                      type="text"
                      value={newMeeting.location}
                      onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder={language === 'ar' ? 'مكان الاجتماع' : 'Meeting location'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'جدول الأعمال' : 'Agenda'}
                  </label>
                  <textarea
                    value={newMeeting.agenda}
                    onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    rows={3}
                    placeholder={language === 'ar' ? 'جدول أعمال الاجتماع' : 'Meeting agenda'}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddMeetingModal(false)}
                  className="flex-1"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  type="button"
                  onClick={handleAddMeeting}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إضافة' : 'Add')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {showEditMeetingModal && editingMeeting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {language === 'ar' ? 'تعديل الاجتماع' : 'Edit Meeting'}
                </h3>
                <button onClick={() => { setShowEditMeetingModal(false); setEditingMeeting(null); }}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={editingMeeting.title}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={editingMeeting.titleAr}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, titleAr: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={editingMeeting.date}
                      onChange={(e) => setEditingMeeting({ ...editingMeeting, date: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الوقت' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={editingMeeting.time}
                      onChange={(e) => setEditingMeeting({ ...editingMeeting, time: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </label>
                  <select
                    value={editingMeeting.status}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, status: e.target.value as Meeting['status'] })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="scheduled">{language === 'ar' ? 'مجدول' : 'Scheduled'}</option>
                    <option value="in-progress">{language === 'ar' ? 'جاري' : 'In Progress'}</option>
                    <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                    <option value="cancelled">{language === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </label>
                  <textarea
                    value={editingMeeting.notes || ''}
                    onChange={(e) => setEditingMeeting({ ...editingMeeting, notes: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowEditMeetingModal(false); setEditingMeeting(null); }}
                  className="flex-1"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateMeeting}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'حفظ' : 'Save')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SecretaryDashboard
