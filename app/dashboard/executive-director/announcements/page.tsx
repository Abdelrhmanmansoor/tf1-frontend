'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import executiveDirectorService, { Announcement } from '@/services/executive-director'
import {
  Megaphone,
  Loader2,
  Plus,
  X,
  Search,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Eye,
  Send,
  MoreVertical,
  Globe,
  Lock,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AnnouncementsPage() {
  return (
    <ProtectedRoute allowedRoles={['executive-director']}>
      <AnnouncementsContent />
    </ProtectedRoute>
  )
}

function AnnouncementsContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [publishing, setPublishing] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    content: '',
    contentAr: '',
    type: 'internal' as 'internal' | 'public' | 'urgent',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'draft' as 'draft' | 'published' | 'archived',
    targetAudience: [] as string[],
    publishDate: '',
    expiryDate: ''
  })

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true)
      const data = await executiveDirectorService.getAnnouncements()
      setAnnouncements(data)
      setFilteredAnnouncements(data)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل الإعلانات' : 'Failed to load announcements'))
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  useEffect(() => {
    let filtered = [...announcements]

    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.titleAr?.includes(searchQuery)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === filterStatus)
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.type === filterType)
    }

    setFilteredAnnouncements(filtered)
  }, [announcements, searchQuery, filterStatus, filterType])

  const handleCreate = async () => {
    if (!formData.title || !formData.titleAr || !formData.content) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    try {
      setSaving(true)
      await executiveDirectorService.createAnnouncement({
        ...formData,
        author: '',
        authorId: ''
      })
      toast.success(language === 'ar' ? 'تم إنشاء الإعلان بنجاح' : 'Announcement created successfully')
      setShowAddModal(false)
      resetForm()
      await fetchAnnouncements()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل إنشاء الإعلان' : 'Failed to create announcement'))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedAnnouncement) return

    try {
      setSaving(true)
      await executiveDirectorService.updateAnnouncement(selectedAnnouncement.id, formData)
      toast.success(language === 'ar' ? 'تم تحديث الإعلان بنجاح' : 'Announcement updated successfully')
      setShowEditModal(false)
      setSelectedAnnouncement(null)
      resetForm()
      await fetchAnnouncements()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحديث الإعلان' : 'Failed to update announcement'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الإعلان؟' : 'Are you sure you want to delete this announcement?')) {
      return
    }

    try {
      setDeleting(id)
      await executiveDirectorService.deleteAnnouncement(id)
      toast.success(language === 'ar' ? 'تم حذف الإعلان بنجاح' : 'Announcement deleted successfully')
      await fetchAnnouncements()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل حذف الإعلان' : 'Failed to delete announcement'))
    } finally {
      setDeleting(null)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      setPublishing(id)
      await executiveDirectorService.publishAnnouncement(id)
      toast.success(language === 'ar' ? 'تم نشر الإعلان بنجاح' : 'Announcement published successfully')
      await fetchAnnouncements()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل نشر الإعلان' : 'Failed to publish announcement'))
    } finally {
      setPublishing(null)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      content: '',
      contentAr: '',
      type: 'internal',
      priority: 'medium',
      status: 'draft',
      targetAudience: [],
      publishDate: '',
      expiryDate: ''
    })
  }

  const openEditModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      titleAr: announcement.titleAr,
      content: announcement.content,
      contentAr: announcement.contentAr || '',
      type: announcement.type,
      priority: announcement.priority,
      status: announcement.status,
      targetAudience: announcement.targetAudience || [],
      publishDate: announcement.publishDate,
      expiryDate: announcement.expiryDate || ''
    })
    setShowEditModal(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'public': return <Globe className="w-4 h-4 text-green-600" />
      case 'internal': return <Lock className="w-4 h-4 text-blue-600" />
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <Megaphone className="w-4 h-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/executive-director">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'الإعلانات' : 'Announcements'}
              </h1>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إعلان جديد' : 'New Announcement'}
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
                placeholder={language === 'ar' ? 'بحث عن إعلان...' : 'Search announcements...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
              <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
              <option value="published">{language === 'ar' ? 'منشور' : 'Published'}</option>
              <option value="archived">{language === 'ar' ? 'مؤرشف' : 'Archived'}</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
              <option value="internal">{language === 'ar' ? 'داخلي' : 'Internal'}</option>
              <option value="public">{language === 'ar' ? 'عام' : 'Public'}</option>
              <option value="urgent">{language === 'ar' ? 'عاجل' : 'Urgent'}</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl">
              {language === 'ar' ? 'لا توجد إعلانات' : 'No announcements found'}
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      announcement.type === 'urgent' ? 'bg-red-100' :
                      announcement.type === 'public' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      {getTypeIcon(announcement.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">
                          {language === 'ar' ? announcement.titleAr : announcement.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          announcement.status === 'published' ? 'bg-green-100 text-green-800' :
                          announcement.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {announcement.status === 'published' ? (language === 'ar' ? 'منشور' : 'Published') :
                           announcement.status === 'draft' ? (language === 'ar' ? 'مسودة' : 'Draft') :
                           (language === 'ar' ? 'مؤرشف' : 'Archived')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                          announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {announcement.priority === 'high' ? (language === 'ar' ? 'عالية' : 'High') :
                           announcement.priority === 'medium' ? (language === 'ar' ? 'متوسطة' : 'Medium') :
                           (language === 'ar' ? 'منخفضة' : 'Low')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {language === 'ar' ? announcement.contentAr || announcement.content : announcement.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(announcement.publishDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {announcement.views || 0} {language === 'ar' ? 'مشاهدة' : 'views'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {announcement.status === 'draft' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublish(announcement.id)}
                        disabled={publishing === announcement.id}
                      >
                        {publishing === announcement.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-1" />
                            {language === 'ar' ? 'نشر' : 'Publish'}
                          </>
                        )}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(announcement)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(announcement.id)}
                      disabled={deleting === announcement.id}
                      className="text-red-500 hover:text-red-700"
                    >
                      {deleting === announcement.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
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
            onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedAnnouncement(null); resetForm(); }}
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
                    ? (language === 'ar' ? 'تعديل الإعلان' : 'Edit Announcement')
                    : (language === 'ar' ? 'إعلان جديد' : 'New Announcement')
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
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'النوع' : 'Type'}
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="internal">{language === 'ar' ? 'داخلي' : 'Internal'}</option>
                      <option value="public">{language === 'ar' ? 'عام' : 'Public'}</option>
                      <option value="urgent">{language === 'ar' ? 'عاجل' : 'Urgent'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الأولوية' : 'Priority'}
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="high">{language === 'ar' ? 'عالية' : 'High'}</option>
                      <option value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
                      <option value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
                      <option value="published">{language === 'ar' ? 'منشور' : 'Published'}</option>
                      <option value="archived">{language === 'ar' ? 'مؤرشف' : 'Archived'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'تاريخ النشر' : 'Publish Date'}
                    </label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'المحتوى (إنجليزي)' : 'Content (English)'} *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'المحتوى (عربي)' : 'Content (Arabic)'}
                  </label>
                  <textarea
                    value={formData.contentAr}
                    onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
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
