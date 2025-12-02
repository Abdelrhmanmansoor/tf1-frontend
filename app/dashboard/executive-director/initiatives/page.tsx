'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import executiveDirectorService, { Initiative } from '@/services/executive-director'
import {
  Target,
  Loader2,
  Plus,
  X,
  Search,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  User,
  DollarSign,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Pause
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function InitiativesPage() {
  return (
    <ProtectedRoute allowedRoles={['executive-director']}>
      <InitiativesContent />
    </ProtectedRoute>
  )
}

function InitiativesContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [filteredInitiatives, setFilteredInitiatives] = useState<Initiative[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    status: 'planning' as 'planning' | 'in-progress' | 'completed' | 'on-hold',
    priority: 'medium' as 'high' | 'medium' | 'low',
    deadline: '',
    owner: '',
    ownerAr: '',
    department: '',
    departmentAr: '',
    budget: 0,
    progress: 0
  })

  const fetchInitiatives = useCallback(async () => {
    try {
      setLoading(true)
      const data = await executiveDirectorService.getInitiatives()
      setInitiatives(data)
      setFilteredInitiatives(data)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل المبادرات' : 'Failed to load initiatives'))
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchInitiatives()
  }, [fetchInitiatives])

  useEffect(() => {
    let filtered = [...initiatives]

    if (searchQuery) {
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.titleAr?.includes(searchQuery)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(i => i.status === filterStatus)
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(i => i.priority === filterPriority)
    }

    setFilteredInitiatives(filtered)
  }, [initiatives, searchQuery, filterStatus, filterPriority])

  const handleCreate = async () => {
    if (!formData.title || !formData.titleAr) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    try {
      setSaving(true)
      await executiveDirectorService.createInitiative({
        ...formData,
        spent: 0,
        tasks: []
      })
      toast.success(language === 'ar' ? 'تم إنشاء المبادرة بنجاح' : 'Initiative created successfully')
      setShowAddModal(false)
      resetForm()
      await fetchInitiatives()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل إنشاء المبادرة' : 'Failed to create initiative'))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedInitiative) return

    try {
      setSaving(true)
      await executiveDirectorService.updateInitiative(selectedInitiative.id, formData)
      toast.success(language === 'ar' ? 'تم تحديث المبادرة بنجاح' : 'Initiative updated successfully')
      setShowEditModal(false)
      setSelectedInitiative(null)
      resetForm()
      await fetchInitiatives()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحديث المبادرة' : 'Failed to update initiative'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه المبادرة؟' : 'Are you sure you want to delete this initiative?')) {
      return
    }

    try {
      setDeleting(id)
      await executiveDirectorService.deleteInitiative(id)
      toast.success(language === 'ar' ? 'تم حذف المبادرة بنجاح' : 'Initiative deleted successfully')
      await fetchInitiatives()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل حذف المبادرة' : 'Failed to delete initiative'))
    } finally {
      setDeleting(null)
    }
  }

  const handleProgressUpdate = async (id: string, progress: number) => {
    try {
      await executiveDirectorService.updateInitiativeProgress(id, progress)
      toast.success(language === 'ar' ? 'تم تحديث التقدم' : 'Progress updated')
      await fetchInitiatives()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحديث التقدم' : 'Failed to update progress'))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      status: 'planning',
      priority: 'medium',
      deadline: '',
      owner: '',
      ownerAr: '',
      department: '',
      departmentAr: '',
      budget: 0,
      progress: 0
    })
  }

  const openEditModal = (initiative: Initiative) => {
    setSelectedInitiative(initiative)
    setFormData({
      title: initiative.title,
      titleAr: initiative.titleAr,
      description: initiative.description || '',
      descriptionAr: initiative.descriptionAr || '',
      status: initiative.status,
      priority: initiative.priority,
      deadline: initiative.deadline,
      owner: initiative.owner || '',
      ownerAr: initiative.ownerAr || '',
      department: initiative.department || '',
      departmentAr: initiative.departmentAr || '',
      budget: initiative.budget || 0,
      progress: initiative.progress
    })
    setShowEditModal(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />
      case 'on-hold': return <Pause className="w-4 h-4 text-orange-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
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
                {language === 'ar' ? 'المبادرات الاستراتيجية' : 'Strategic Initiatives'}
              </h1>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'مبادرة جديدة' : 'New Initiative'}
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
                placeholder={language === 'ar' ? 'بحث عن مبادرة...' : 'Search initiatives...'}
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
              <option value="planning">{language === 'ar' ? 'تخطيط' : 'Planning'}</option>
              <option value="in-progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
              <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
              <option value="on-hold">{language === 'ar' ? 'معلق' : 'On Hold'}</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الأولويات' : 'All Priorities'}</option>
              <option value="high">{language === 'ar' ? 'عالية' : 'High'}</option>
              <option value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
              <option value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInitiatives.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl">
              {language === 'ar' ? 'لا توجد مبادرات' : 'No initiatives found'}
            </div>
          ) : (
            filteredInitiatives.map((initiative) => (
              <motion.div
                key={initiative.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      initiative.priority === 'high' ? 'bg-red-500' :
                      initiative.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <h3 className="text-lg font-bold text-gray-900">
                      {language === 'ar' ? initiative.titleAr : initiative.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      initiative.status === 'completed' ? 'bg-green-100 text-green-800' :
                      initiative.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      initiative.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusIcon(initiative.status)}
                      {initiative.status === 'completed' ? (language === 'ar' ? 'مكتمل' : 'Completed') :
                       initiative.status === 'in-progress' ? (language === 'ar' ? 'قيد التنفيذ' : 'In Progress') :
                       initiative.status === 'on-hold' ? (language === 'ar' ? 'معلق' : 'On Hold') :
                       (language === 'ar' ? 'تخطيط' : 'Planning')}
                    </span>
                    <div className="relative group">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:block z-10">
                        <button
                          onClick={() => openEditModal(initiative)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          {language === 'ar' ? 'تعديل' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleDelete(initiative.id)}
                          disabled={deleting === initiative.id}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                          {deleting === initiative.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          {language === 'ar' ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {(initiative.description || initiative.descriptionAr) && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {language === 'ar' ? initiative.descriptionAr || initiative.description : initiative.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(initiative.deadline).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </div>
                  {initiative.owner && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="w-4 h-4" />
                      {language === 'ar' ? initiative.ownerAr || initiative.owner : initiative.owner}
                    </div>
                  )}
                  {initiative.budget > 0 && (
                    <div className="flex items-center gap-2 text-gray-500 col-span-2">
                      <DollarSign className="w-4 h-4" />
                      {initiative.spent?.toLocaleString()} / {initiative.budget?.toLocaleString()} SAR
                    </div>
                  )}
                </div>

                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                  <span className="text-sm font-bold text-gray-900">{initiative.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${initiative.progress}%` }}
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={initiative.progress}
                    onChange={(e) => handleProgressUpdate(initiative.id, parseInt(e.target.value))}
                    className="flex-1 accent-purple-500"
                  />
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
            onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedInitiative(null); resetForm(); }}
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
                    ? (language === 'ar' ? 'تعديل المبادرة' : 'Edit Initiative')
                    : (language === 'ar' ? 'مبادرة جديدة' : 'New Initiative')
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="planning">{language === 'ar' ? 'تخطيط' : 'Planning'}</option>
                      <option value="in-progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                      <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                      <option value="on-hold">{language === 'ar' ? 'معلق' : 'On Hold'}</option>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الموعد النهائي' : 'Deadline'}
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'التقدم %' : 'Progress %'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'المسؤول' : 'Owner'}
                    </label>
                    <input
                      type="text"
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الميزانية' : 'Budget'}
                    </label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
