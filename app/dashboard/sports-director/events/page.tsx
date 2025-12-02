'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import sportsDirectorService, { TechnicalEvent } from '@/services/sports-director'
import {
  Calendar,
  Loader2,
  Plus,
  X,
  Search,
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Users,
  Trophy,
  Dumbbell,
  MessageSquare,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function EventsPage() {
  return (
    <ProtectedRoute allowedRoles={['sports-director']}>
      <EventsContent />
    </ProtectedRoute>
  )
}

function EventsContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<TechnicalEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<TechnicalEvent[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<TechnicalEvent | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    type: 'training' as 'match' | 'training' | 'tournament' | 'meeting' | 'other',
    date: '',
    time: '',
    location: '',
    locationAr: '',
    description: '',
    descriptionAr: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled'
  })

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const data = await sportsDirectorService.getEvents()
      setEvents(data)
      setFilteredEvents(data)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل الأحداث' : 'Failed to load events'))
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    let filtered = [...events]

    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.titleAr?.includes(searchQuery) ||
        e.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus)
    }

    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setFilteredEvents(filtered)
  }, [events, searchQuery, filterType, filterStatus])

  const handleCreate = async () => {
    if (!formData.title || !formData.titleAr || !formData.date) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    try {
      setSaving(true)
      await sportsDirectorService.createEvent({
        ...formData,
        participants: []
      })
      toast.success(language === 'ar' ? 'تم إنشاء الحدث بنجاح' : 'Event created successfully')
      setShowAddModal(false)
      resetForm()
      await fetchEvents()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل إنشاء الحدث' : 'Failed to create event'))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedEvent) return

    try {
      setSaving(true)
      await sportsDirectorService.updateEvent(selectedEvent.id, formData)
      toast.success(language === 'ar' ? 'تم تحديث الحدث بنجاح' : 'Event updated successfully')
      setShowEditModal(false)
      setSelectedEvent(null)
      resetForm()
      await fetchEvents()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحديث الحدث' : 'Failed to update event'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الحدث؟' : 'Are you sure you want to delete this event?')) {
      return
    }

    try {
      setDeleting(id)
      await sportsDirectorService.deleteEvent(id)
      toast.success(language === 'ar' ? 'تم حذف الحدث بنجاح' : 'Event deleted successfully')
      await fetchEvents()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل حذف الحدث' : 'Failed to delete event'))
    } finally {
      setDeleting(null)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      type: 'training',
      date: '',
      time: '',
      location: '',
      locationAr: '',
      description: '',
      descriptionAr: '',
      status: 'scheduled'
    })
  }

  const openEditModal = (event: TechnicalEvent) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      titleAr: event.titleAr,
      type: event.type,
      date: event.date,
      time: event.time,
      location: event.location,
      locationAr: event.locationAr || '',
      description: event.description,
      descriptionAr: event.descriptionAr || '',
      status: event.status
    })
    setShowEditModal(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'match': return <Trophy className="w-5 h-5 text-yellow-600" />
      case 'training': return <Dumbbell className="w-5 h-5 text-blue-600" />
      case 'tournament': return <Trophy className="w-5 h-5 text-purple-600" />
      case 'meeting': return <MessageSquare className="w-5 h-5 text-green-600" />
      default: return <Calendar className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {language === 'ar' ? 'مجدول' : 'Scheduled'}
        </span>
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> {language === 'ar' ? 'مكتمل' : 'Completed'}
        </span>
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle className="w-3 h-3" /> {language === 'ar' ? 'ملغي' : 'Cancelled'}
        </span>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/sports-director">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'الأحداث التقنية' : 'Technical Events'}
              </h1>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'حدث جديد' : 'New Event'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث عن حدث...' : 'Search events...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
              <option value="match">{language === 'ar' ? 'مباراة' : 'Match'}</option>
              <option value="training">{language === 'ar' ? 'تدريب' : 'Training'}</option>
              <option value="tournament">{language === 'ar' ? 'بطولة' : 'Tournament'}</option>
              <option value="meeting">{language === 'ar' ? 'اجتماع' : 'Meeting'}</option>
              <option value="other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
              <option value="scheduled">{language === 'ar' ? 'مجدول' : 'Scheduled'}</option>
              <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
              <option value="cancelled">{language === 'ar' ? 'ملغي' : 'Cancelled'}</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl">
              {language === 'ar' ? 'لا توجد أحداث' : 'No events found'}
            </div>
          ) : (
            filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      event.type === 'match' ? 'bg-yellow-100' :
                      event.type === 'training' ? 'bg-blue-100' :
                      event.type === 'tournament' ? 'bg-purple-100' :
                      event.type === 'meeting' ? 'bg-green-100' :
                      'bg-gray-100'
                    }`}>
                      {getTypeIcon(event.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {language === 'ar' ? event.titleAr : event.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {language === 'ar' ? event.descriptionAr || event.description : event.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {language === 'ar' ? event.locationAr || event.location : event.location}
                        </span>
                        {event.participants && event.participants.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.participants.length} {language === 'ar' ? 'مشارك' : 'participants'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(event.status)}
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(event)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        disabled={deleting === event.id}
                        className="text-red-500 hover:text-red-700"
                      >
                        {deleting === event.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedEvent(null); resetForm(); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {showEditModal
                    ? (language === 'ar' ? 'تعديل الحدث' : 'Edit Event')
                    : (language === 'ar' ? 'حدث جديد' : 'New Event')
                  }
                </h2>
                <Button variant="ghost" size="sm" onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'} *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'} *
                    </label>
                    <input
                      type="text"
                      value={formData.titleAr}
                      onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'النوع' : 'Type'}
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="training">{language === 'ar' ? 'تدريب' : 'Training'}</option>
                      <option value="match">{language === 'ar' ? 'مباراة' : 'Match'}</option>
                      <option value="tournament">{language === 'ar' ? 'بطولة' : 'Tournament'}</option>
                      <option value="meeting">{language === 'ar' ? 'اجتماع' : 'Meeting'}</option>
                      <option value="other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="scheduled">{language === 'ar' ? 'مجدول' : 'Scheduled'}</option>
                      <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                      <option value="cancelled">{language === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'التاريخ' : 'Date'} *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الوقت' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الموقع (إنجليزي)' : 'Location (English)'}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الموقع (عربي)' : 'Location (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={formData.locationAr}
                      onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    dir="rtl"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}
                    className="flex-1"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    type="button"
                    onClick={showEditModal ? handleUpdate : handleCreate}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      showEditModal ? (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes') : (language === 'ar' ? 'إنشاء' : 'Create')
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
