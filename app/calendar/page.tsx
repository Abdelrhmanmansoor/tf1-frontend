'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  Bell,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Share2,
  Eye,
  User,
  FileText,
  Target,
  Activity,
  Filter,
  X,
  Save,
  Trash2,
  Link2,
  Repeat,
} from 'lucide-react'
import Link from 'next/link'

const CalendarPage = () => {
  const { language } = useLanguage()
  const [currentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>(
    'month'
  )
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [showRemindersModal, setShowRemindersModal] = useState(false)

  // Form states for Add Event Modal
  const [eventForm, setEventForm] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    locationAr: '',
    type: 'meeting',
    priority: 'medium',
    attendees: '',
    attendeesAr: '',
    organizer: '',
    organizerAr: '',
    meetingLink: '',
    reminder: '15',
    recurring: 'none',
    status: 'confirmed',
    notes: '',
  })

  // Mock data for reminders
  const [reminders, setReminders] = useState([
    {
      id: 1,
      eventTitle: 'Interview with Al-Hilal FC',
      eventTitleAr: 'مقابلة مع نادي الهلال',
      time: '15 minutes before',
      timeAr: '15 دقيقة قبل',
      date: '2024-01-20 09:45',
      type: 'notification',
      enabled: true,
    },
    {
      id: 2,
      eventTitle: 'Training Session',
      eventTitleAr: 'جلسة تدريب',
      time: '30 minutes before',
      timeAr: '30 دقيقة قبل',
      date: '2024-01-22 15:30',
      type: 'email',
      enabled: true,
    },
    {
      id: 3,
      eventTitle: 'Medical Checkup',
      eventTitleAr: 'فحص طبي',
      time: '2 hours before',
      timeAr: 'ساعتين قبل',
      date: '2024-01-25 07:00',
      type: 'notification',
      enabled: false,
    },
    {
      id: 4,
      eventTitle: 'Contract Signing',
      eventTitleAr: 'توقيع العقد',
      time: '1 day before',
      timeAr: 'يوم واحد قبل',
      date: '2024-01-27 14:00',
      type: 'both',
      enabled: true,
    },
  ])

  // Mock data for events
  const events = [
    {
      id: 1,
      title: 'Interview with Al-Hilal FC',
      titleAr: 'مقابلة مع نادي الهلال',
      description: 'Final interview for midfielder position',
      descriptionAr: 'المقابلة النهائية لمنصب لاعب الوسط',
      startTime: '2024-01-20 10:00',
      endTime: '2024-01-20 11:30',
      location: 'Al-Hilal Training Center',
      locationAr: 'مركز تدريب الهلال',
      type: 'interview',
      priority: 'high',
      attendees: ['HR Manager', 'Head Coach'],
      attendeesAr: ['مدير الموارد البشرية', 'المدرب الرئيسي'],
      reminders: [60, 15],
      status: 'confirmed',
      organizer: 'Al-Hilal FC',
      organizerAr: 'نادي الهلال',
      meetingLink: 'https://meet.alhilal.com/interview-123',
    },
    {
      id: 2,
      title: 'Training Session',
      titleAr: 'جلسة تدريب',
      description: 'Weekly training with youth team',
      descriptionAr: 'التدريب الأسبوعي مع فريق الشباب',
      startTime: '2024-01-22 16:00',
      endTime: '2024-01-22 18:00',
      location: 'City Sports Complex',
      locationAr: 'مجمع المدينة الرياضي',
      type: 'training',
      priority: 'medium',
      attendees: ['Team Members', 'Assistant Coach'],
      attendeesAr: ['أعضاء الفريق', 'المدرب المساعد'],
      reminders: [30],
      status: 'confirmed',
      organizer: 'Youth Academy',
      organizerAr: 'أكاديمية الشباب',
      recurring: 'weekly',
    },
    {
      id: 3,
      title: 'Medical Checkup',
      titleAr: 'فحص طبي',
      description: 'Routine medical examination and fitness assessment',
      descriptionAr: 'فحص طبي روتيني وتقييم اللياقة البدنية',
      startTime: '2024-01-25 09:00',
      endTime: '2024-01-25 10:00',
      location: 'Sports Medicine Clinic',
      locationAr: 'عيادة طب الرياضة',
      type: 'medical',
      priority: 'high',
      attendees: ['Dr. Ahmed Hassan', 'Fitness Specialist'],
      attendeesAr: ['د. أحمد حسن', 'أخصائي اللياقة'],
      reminders: [120, 30],
      status: 'confirmed',
      organizer: 'Medical Team',
      organizerAr: 'الفريق الطبي',
    },
    {
      id: 4,
      title: 'Contract Signing',
      titleAr: 'توقيع العقد',
      description: 'Final contract signing with new club',
      descriptionAr: 'توقيع العقد النهائي مع النادي الجديد',
      startTime: '2024-01-28 14:00',
      endTime: '2024-01-28 15:30',
      location: 'Al-Nassr Headquarters',
      locationAr: 'مقر نادي النصر',
      type: 'meeting',
      priority: 'high',
      attendees: ['Legal Team', 'Club Manager', 'Agent'],
      attendeesAr: ['الفريق القانوني', 'مدير النادي', 'الوكيل'],
      reminders: [180, 60, 15],
      status: 'pending',
      organizer: 'Al-Nassr Management',
      organizerAr: 'إدارة النصر',
    },
    {
      id: 5,
      title: 'Skill Assessment',
      titleAr: 'تقييم المهارات',
      description: 'Technical skills evaluation session',
      descriptionAr: 'جلسة تقييم المهارات التقنية',
      startTime: '2024-01-30 15:00',
      endTime: '2024-01-30 17:00',
      location: 'Performance Center',
      locationAr: 'مركز الأداء',
      type: 'assessment',
      priority: 'medium',
      attendees: ['Technical Director', 'Scout Team'],
      attendeesAr: ['المدير التقني', 'فريق الكشافة'],
      reminders: [60],
      status: 'tentative',
      organizer: 'Talent Academy',
      organizerAr: 'أكاديمية المواهب',
    },
    {
      id: 6,
      title: 'Team Meeting',
      titleAr: 'اجتماع الفريق',
      description: 'Monthly team strategy and goals discussion',
      descriptionAr: 'مناقشة استراتيجية وأهداف الفريق الشهرية',
      startTime: '2024-02-02 11:00',
      endTime: '2024-02-02 12:30',
      location: 'Conference Room A',
      locationAr: 'قاعة الاجتماعات أ',
      type: 'meeting',
      priority: 'low',
      attendees: ['Team Captain', 'All Players', 'Coaching Staff'],
      attendeesAr: ['قائد الفريق', 'جميع اللاعبين', 'الطاقم التدريبي'],
      reminders: [30],
      status: 'confirmed',
      organizer: 'Team Management',
      organizerAr: 'إدارة الفريق',
      recurring: 'monthly',
    },
  ]

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <User className="w-4 h-4" />
      case 'training':
        return <Activity className="w-4 h-4" />
      case 'medical':
        return <FileText className="w-4 h-4" />
      case 'meeting':
        return <Users className="w-4 h-4" />
      case 'assessment':
        return <Target className="w-4 h-4" />
      default:
        return <CalendarIcon className="w-4 h-4" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'training':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'meeting':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'assessment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'tentative':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getWeekEvents = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    return events.filter((event) => {
      const eventDate = new Date(event.startTime)
      return eventDate >= startOfWeek && eventDate <= endOfWeek
    })
  }

  const upcomingEvents = events
    .filter((event) => new Date(event.startTime) > new Date())
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    .slice(0, 5)

  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.startTime)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleEventFormChange = (field: string, value: string) => {
    setEventForm({ ...eventForm, [field]: value })
  }

  const handleSaveEvent = () => {
    console.log('Saving event:', eventForm)
    setShowAddEventModal(false)
    // Reset form
    setEventForm({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      locationAr: '',
      type: 'meeting',
      priority: 'medium',
      attendees: '',
      attendeesAr: '',
      organizer: '',
      organizerAr: '',
      meetingLink: '',
      reminder: '15',
      recurring: 'none',
      status: 'confirmed',
      notes: '',
    })
  }

  const toggleReminder = (id: number) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    )
  }

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter((r) => r.id !== id))
  }

  // New reminder form state
  const [newReminder, setNewReminder] = useState({
    eventTitle: '',
    eventTitleAr: '',
    time: '15',
    timeUnit: 'minutes',
    type: 'notification',
  })

  const handleAddReminder = () => {
    const newReminderObj = {
      id: reminders.length + 1,
      eventTitle: newReminder.eventTitle,
      eventTitleAr: newReminder.eventTitleAr,
      time: `${newReminder.time} ${newReminder.timeUnit}${parseInt(newReminder.time) > 1 ? 's' : ''} before`,
      timeAr: `${newReminder.time} ${newReminder.timeUnit === 'minutes' ? 'دقيقة' : newReminder.timeUnit === 'hours' ? 'ساعة' : 'يوم'}${parseInt(newReminder.time) > 1 ? 'ات' : ''} قبل`,
      date: new Date().toISOString().split('T')[0] + ' 00:00',
      type: newReminder.type,
      enabled: true,
    }
    setReminders([...reminders, newReminderObj])
    setNewReminder({
      eventTitle: '',
      eventTitleAr: '',
      time: '15',
      timeUnit: 'minutes',
      type: 'notification',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
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
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {language === 'ar' ? 'التقويم والأحداث' : 'Calendar & Events'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {language === 'ar'
                    ? 'تنظيم مواعيدك ومتابعة أحداثك المهمة'
                    : 'Organize your schedule and track important events'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {language === 'ar' ? 'الفلاتر' : 'Filters'}
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={() => setShowAddEventModal(true)}
              >
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'حدث جديد' : 'New Event'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calendar View */}
          <div className="lg:col-span-2 space-y-8">
            {/* View Mode Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  {language === 'ar' ? 'شهر' : 'Month'}
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  {language === 'ar' ? 'أسبوع' : 'Week'}
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  {language === 'ar' ? 'قائمة' : 'List'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-medium text-gray-900 mx-3">
                  {currentDate.toLocaleDateString([], {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Today's Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border"
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                  {language === 'ar' ? 'أحداث اليوم' : "Today's Events"}
                </h2>
              </div>
              <div className="p-6">
                {todayEvents.length > 0 ? (
                  <div className="space-y-4">
                    {todayEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`border-l-4 pl-4 py-3 rounded-r-lg ${getEventTypeColor(event.type)} border-l-current`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getEventTypeIcon(event.type)}
                              <h3 className="font-medium">
                                {language === 'ar'
                                  ? event.titleAr
                                  : event.title}
                              </h3>
                              {getStatusIcon(event.status)}
                            </div>
                            <p className="text-sm opacity-80 mb-2">
                              {language === 'ar'
                                ? event.descriptionAr
                                : event.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs opacity-70">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(event.startTime)} -{' '}
                                {formatTime(event.endTime)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {language === 'ar'
                                  ? event.locationAr
                                  : event.location}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {language === 'ar'
                        ? 'لا توجد أحداث اليوم'
                        : 'No events scheduled for today'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Weekly Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border"
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-600" />
                  {language === 'ar' ? 'نظرة أسبوعية' : 'Weekly Overview'}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {getWeekEvents().map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}
                        >
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {language === 'ar' ? event.titleAr : event.title}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>{formatDate(event.startTime)}</span>
                            <span>{formatTime(event.startTime)}</span>
                            <span>•</span>
                            <span>
                              {language === 'ar'
                                ? event.organizerAr
                                : event.organizer}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowAddEventModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إضافة حدث' : 'Add Event'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowRemindersModal(true)}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تذكيرات' : 'Reminders'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'مشاركة التقويم' : 'Share Calendar'}
                </Button>
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border"
            >
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  {language === 'ar' ? 'الأحداث القادمة' : 'Upcoming Events'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div
                      className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}
                    >
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {language === 'ar' ? event.titleAr : event.title}
                      </h4>
                      <div className="text-xs text-gray-600 mt-1">
                        {formatDate(event.startTime)} •{' '}
                        {formatTime(event.startTime)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {getStatusIcon(event.status)}
                        <span
                          className={`text-xs ${getPriorityColor(event.priority)}`}
                        >
                          {event.priority} priority
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Event Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4">
                {language === 'ar' ? 'إحصائيات الأحداث' : 'Event Statistics'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">
                    {language === 'ar' ? 'هذا الأسبوع' : 'This Week'}
                  </span>
                  <span className="font-bold">{getWeekEvents().length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">
                    {language === 'ar' ? 'قادمة' : 'Upcoming'}
                  </span>
                  <span className="font-bold">{upcomingEvents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">
                    {language === 'ar' ? 'مؤكدة' : 'Confirmed'}
                  </span>
                  <span className="font-bold">
                    {events.filter((e) => e.status === 'confirmed').length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'إضافة حدث جديد' : 'Add New Event'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddEventModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Event Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'عنوان الحدث (إنجليزي)'
                        : 'Event Title (English)'}
                    </label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) =>
                        handleEventFormChange('title', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'عنوان الحدث (عربي)'
                        : 'Event Title (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={eventForm.titleAr}
                      onChange={(e) =>
                        handleEventFormChange('titleAr', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="أدخل عنوان الحدث"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'الوصف (إنجليزي)'
                        : 'Description (English)'}
                    </label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) =>
                        handleEventFormChange('description', e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter event description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'الوصف (عربي)'
                        : 'Description (Arabic)'}
                    </label>
                    <textarea
                      value={eventForm.descriptionAr}
                      onChange={(e) =>
                        handleEventFormChange('descriptionAr', e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="أدخل وصف الحدث"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                    </label>
                    <input
                      type="date"
                      value={eventForm.startDate}
                      onChange={(e) =>
                        handleEventFormChange('startDate', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'وقت البدء' : 'Start Time'}
                    </label>
                    <input
                      type="time"
                      value={eventForm.startTime}
                      onChange={(e) =>
                        handleEventFormChange('startTime', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}
                    </label>
                    <input
                      type="date"
                      value={eventForm.endDate}
                      onChange={(e) =>
                        handleEventFormChange('endDate', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'وقت الانتهاء' : 'End Time'}
                    </label>
                    <input
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) =>
                        handleEventFormChange('endTime', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'الموقع (إنجليزي)'
                        : 'Location (English)'}
                    </label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) =>
                        handleEventFormChange('location', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'الموقع (عربي)'
                        : 'Location (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={eventForm.locationAr}
                      onChange={(e) =>
                        handleEventFormChange('locationAr', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      placeholder="أدخل الموقع"
                    />
                  </div>
                </div>

                {/* Event Type & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نوع الحدث' : 'Event Type'}
                    </label>
                    <select
                      value={eventForm.type}
                      onChange={(e) =>
                        handleEventFormChange('type', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="interview">Interview</option>
                      <option value="training">Training</option>
                      <option value="medical">Medical</option>
                      <option value="assessment">Assessment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الأولوية' : 'Priority'}
                    </label>
                    <select
                      value={eventForm.priority}
                      onChange={(e) =>
                        handleEventFormChange('priority', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Meeting Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Link2 className="w-4 h-4 inline mr-2" />
                    {language === 'ar'
                      ? 'رابط الاجتماع (اختياري)'
                      : 'Meeting Link (Optional)'}
                  </label>
                  <input
                    type="url"
                    value={eventForm.meetingLink}
                    onChange={(e) =>
                      handleEventFormChange('meetingLink', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://meet.example.com/your-meeting"
                  />
                </div>

                {/* Recurring Event */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Repeat className="w-4 h-4 inline mr-2" />
                    {language === 'ar' ? 'تكرار الحدث' : 'Recurring Event'}
                  </label>
                  <select
                    value={eventForm.recurring}
                    onChange={(e) =>
                      handleEventFormChange('recurring', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="none">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {/* Reminder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bell className="w-4 h-4 inline mr-2" />
                    {language === 'ar' ? 'التذكير' : 'Reminder'}
                  </label>
                  <select
                    value={eventForm.reminder}
                    onChange={(e) =>
                      handleEventFormChange('reminder', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="5">5 minutes before</option>
                    <option value="15">15 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                    <option value="1440">1 day before</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                <Button
                  variant="outline"
                  onClick={() => setShowAddEventModal(false)}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSaveEvent}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'حفظ الحدث' : 'Save Event'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders Modal */}
      <AnimatePresence>
        {showRemindersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'إدارة التذكيرات' : 'Manage Reminders'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRemindersModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6">
                {/* Add New Reminder */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-blue-900 mb-3">
                    {language === 'ar'
                      ? 'إضافة تذكير جديد'
                      : 'Add New Reminder'}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newReminder.eventTitle}
                        onChange={(e) =>
                          setNewReminder({
                            ...newReminder,
                            eventTitle: e.target.value,
                          })
                        }
                        placeholder={
                          language === 'ar'
                            ? 'عنوان الحدث (إنجليزي)'
                            : 'Event Title (English)'
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={newReminder.eventTitleAr}
                        onChange={(e) =>
                          setNewReminder({
                            ...newReminder,
                            eventTitleAr: e.target.value,
                          })
                        }
                        placeholder={
                          language === 'ar'
                            ? 'عنوان الحدث (عربي)'
                            : 'Event Title (Arabic)'
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                      />
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={newReminder.time}
                        onChange={(e) =>
                          setNewReminder({
                            ...newReminder,
                            time: e.target.value,
                          })
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                      <select
                        value={newReminder.timeUnit}
                        onChange={(e) =>
                          setNewReminder({
                            ...newReminder,
                            timeUnit: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="minutes">minutes before</option>
                        <option value="hours">hours before</option>
                        <option value="days">days before</option>
                      </select>
                      <select
                        value={newReminder.type}
                        onChange={(e) =>
                          setNewReminder({
                            ...newReminder,
                            type: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="notification">Notification</option>
                        <option value="email">Email</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleAddReminder}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'إضافة التذكير' : 'Add Reminder'}
                    </Button>
                  </div>
                </div>

                {/* Reminders List */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">
                    {language === 'ar'
                      ? 'التذكيرات الحالية'
                      : 'Current Reminders'}
                  </h3>
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={reminder.enabled}
                            onChange={() => toggleReminder(reminder.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <Bell
                            className={`w-4 h-4 ${reminder.enabled ? 'text-blue-600' : 'text-gray-400'}`}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {language === 'ar'
                              ? reminder.eventTitleAr
                              : reminder.eventTitle}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {language === 'ar'
                              ? reminder.timeAr
                              : reminder.time}
                          </p>
                          <p className="text-xs text-gray-500">
                            {reminder.type === 'notification' &&
                              (language === 'ar' ? 'إشعار' : 'Notification')}
                            {reminder.type === 'email' &&
                              (language === 'ar' ? 'بريد إلكتروني' : 'Email')}
                            {reminder.type === 'both' &&
                              (language === 'ar' ? 'كليهما' : 'Both')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                <Button
                  variant="outline"
                  onClick={() => setShowRemindersModal(false)}
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CalendarPage
