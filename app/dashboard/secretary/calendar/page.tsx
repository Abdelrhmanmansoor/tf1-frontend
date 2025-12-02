'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import secretaryService from '@/services/secretary'
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  X,
  Edit,
  Trash2,
  CheckCircle,
  Video,
  MapPin,
  Users,
  ArrowLeft
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

export default function SecretaryCalendarPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')

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

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await secretaryService.getMeetings()
      setMeetings(data || [])
    } catch (error) {
      console.error('Error fetching meetings:', error)
      toast.error(language === 'ar' ? 'تعذر تحميل الاجتماعات' : 'Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days: { date: Date; isCurrentMonth: boolean }[] = []
    
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    
    return days
  }

  const getMeetingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return meetings.filter(m => m.date === dateStr)
  }

  const formatMonth = (date: Date) => {
    const months = language === 'ar' 
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const weekDays = language === 'ar'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

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
      setShowAddModal(false)
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
      fetchMeetings()
    } catch (error: any) {
      console.error('Error adding meeting:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateMeeting = async () => {
    if (!selectedMeeting) return

    try {
      setSaving(true)
      await secretaryService.updateMeeting(selectedMeeting.id, selectedMeeting)
      toast.success(language === 'ar' ? 'تم تحديث الاجتماع بنجاح' : 'Meeting updated successfully')
      setShowEditModal(false)
      setSelectedMeeting(null)
      fetchMeetings()
    } catch (error: any) {
      console.error('Error updating meeting:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
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
      fetchMeetings()
    } catch (error: any) {
      console.error('Error deleting meeting:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    }
  }

  const handleMarkComplete = async (meeting: Meeting) => {
    try {
      await secretaryService.updateMeeting(meeting.id, { status: 'completed' })
      toast.success(language === 'ar' ? 'تم تحديث حالة الاجتماع' : 'Meeting status updated')
      fetchMeetings()
    } catch (error: any) {
      console.error('Error updating meeting:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    )
  }

  const days = getDaysInMonth(currentDate)

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
              {language === 'ar' ? 'التقويم والاجتماعات' : 'Calendar & Meetings'}
            </h1>
          </div>
          <Button 
            onClick={() => {
              setNewMeeting({ ...newMeeting, date: selectedDate || new Date().toISOString().split('T')[0] })
              setShowAddModal(true)
            }}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'اجتماع جديد' : 'New Meeting'}
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={prevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-gray-900">
              {formatMonth(currentDate)}
            </h2>
            <Button variant="ghost" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayMeetings = getMeetingsForDate(day.date)
              const dateStr = day.date.toISOString().split('T')[0]
              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-colors ${
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${
                    isToday(day.date) ? 'border-teal-500 border-2' : 'border-gray-200'
                  } ${
                    selectedDate === dateStr ? 'ring-2 ring-teal-500' : ''
                  } hover:bg-teal-50`}
                >
                  <span className={`text-sm font-medium ${
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${isToday(day.date) ? 'text-teal-600' : ''}`}>
                    {day.date.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayMeetings.slice(0, 2).map((meeting) => (
                      <div
                        key={meeting.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMeeting(meeting)
                          setShowViewModal(true)
                        }}
                        className={`text-xs p-1 rounded truncate cursor-pointer ${
                          meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                          meeting.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {meeting.time} - {language === 'ar' ? meeting.titleAr : meeting.title}
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayMeetings.length - 2} {language === 'ar' ? 'أخرى' : 'more'}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'ar' ? `اجتماعات ${selectedDate}` : `Meetings on ${selectedDate}`}
            </h3>
            {getMeetingsForDate(new Date(selectedDate)).length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {language === 'ar' ? 'لا توجد اجتماعات في هذا اليوم' : 'No meetings on this day'}
              </p>
            ) : (
              <div className="space-y-4">
                {getMeetingsForDate(new Date(selectedDate)).map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                        meeting.status === 'completed' ? 'bg-green-500' :
                        meeting.status === 'cancelled' ? 'bg-red-500' :
                        'bg-gradient-to-br from-teal-500 to-cyan-500'
                      }`}>
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{language === 'ar' ? meeting.titleAr : meeting.title}</p>
                        <p className="text-sm text-gray-500">{meeting.time} - {meeting.duration} {language === 'ar' ? 'دقيقة' : 'min'}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {meeting.isOnline ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                          <span>{language === 'ar' ? meeting.locationAr : meeting.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {meeting.status === 'scheduled' && (
                        <Button size="sm" variant="outline" onClick={() => handleMarkComplete(meeting)}>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedMeeting(meeting)
                        setShowEditModal(true)
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteMeeting(meeting.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
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
                <button onClick={() => setShowAddModal(false)}>
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
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
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

        {showEditModal && selectedMeeting && (
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
                <button onClick={() => { setShowEditModal(false); setSelectedMeeting(null); }}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'العنوان' : 'Title'}
                  </label>
                  <input
                    type="text"
                    value={selectedMeeting.title}
                    onChange={(e) => setSelectedMeeting({ ...selectedMeeting, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={selectedMeeting.date}
                      onChange={(e) => setSelectedMeeting({ ...selectedMeeting, date: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الوقت' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={selectedMeeting.time}
                      onChange={(e) => setSelectedMeeting({ ...selectedMeeting, time: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </label>
                  <select
                    value={selectedMeeting.status}
                    onChange={(e) => setSelectedMeeting({ ...selectedMeeting, status: e.target.value as Meeting['status'] })}
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
                    value={selectedMeeting.notes || ''}
                    onChange={(e) => setSelectedMeeting({ ...selectedMeeting, notes: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => { setShowEditModal(false); setSelectedMeeting(null); }} className="flex-1">
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

        {showViewModal && selectedMeeting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {language === 'ar' ? selectedMeeting.titleAr : selectedMeeting.title}
                </h3>
                <button onClick={() => { setShowViewModal(false); setSelectedMeeting(null); }}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>{selectedMeeting.date} - {selectedMeeting.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  {selectedMeeting.isOnline ? <Video className="w-5 h-5 text-gray-400" /> : <MapPin className="w-5 h-5 text-gray-400" />}
                  <span>{language === 'ar' ? selectedMeeting.locationAr : selectedMeeting.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{selectedMeeting.attendees?.length || 0} {language === 'ar' ? 'مشارك' : 'attendees'}</span>
                </div>
                {selectedMeeting.agenda && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">{language === 'ar' ? 'جدول الأعمال' : 'Agenda'}</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {language === 'ar' ? selectedMeeting.agendaAr : selectedMeeting.agenda}
                    </p>
                  </div>
                )}
                <div className={`inline-flex px-3 py-1 rounded-full text-sm ${
                  selectedMeeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                  selectedMeeting.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  selectedMeeting.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-teal-100 text-teal-800'
                }`}>
                  {selectedMeeting.status === 'completed' ? (language === 'ar' ? 'مكتمل' : 'Completed') :
                   selectedMeeting.status === 'cancelled' ? (language === 'ar' ? 'ملغي' : 'Cancelled') :
                   selectedMeeting.status === 'in-progress' ? (language === 'ar' ? 'جاري' : 'In Progress') :
                   (language === 'ar' ? 'مجدول' : 'Scheduled')}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowViewModal(false)
                    setShowEditModal(true)
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تعديل' : 'Edit'}
                </Button>
                {selectedMeeting.status === 'scheduled' && (
                  <Button
                    type="button"
                    onClick={() => {
                      handleMarkComplete(selectedMeeting)
                      setShowViewModal(false)
                      setSelectedMeeting(null)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'مكتمل' : 'Complete'}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
