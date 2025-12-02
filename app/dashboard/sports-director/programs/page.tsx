'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import sportsDirectorService, { SportsProgram } from '@/services/sports-director'
import {
  Dumbbell,
  Loader2,
  Plus,
  X,
  Search,
  Filter,
  ArrowLeft,
  Edit,
  Trash2,
  Trophy,
  TrendingUp,
  Users,
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProgramsPage() {
  return (
    <ProtectedRoute allowedRoles={['sports-director']}>
      <ProgramsContent />
    </ProtectedRoute>
  )
}

function ProgramsContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [programs, setPrograms] = useState<SportsProgram[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<SportsProgram[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<SportsProgram | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    type: 'training' as 'training' | 'competition' | 'development',
    description: '',
    descriptionAr: '',
    startDate: '',
    endDate: '',
    maxParticipants: 50,
    status: 'upcoming' as 'active' | 'completed' | 'upcoming' | 'inactive'
  })

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true)
      const data = await sportsDirectorService.getPrograms()
      setPrograms(data)
      setFilteredPrograms(data)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل البرامج' : 'Failed to load programs'))
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  useEffect(() => {
    let filtered = [...programs]

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameAr.includes(searchQuery)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType)
    }

    setFilteredPrograms(filtered)
  }, [programs, searchQuery, filterStatus, filterType])

  const handleCreate = async () => {
    if (!formData.name || !formData.nameAr) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    try {
      setSaving(true)
      await sportsDirectorService.createProgram({
        ...formData,
        participants: 0,
        progress: 0,
        coaches: []
      })
      toast.success(language === 'ar' ? 'تم إنشاء البرنامج بنجاح' : 'Program created successfully')
      setShowAddModal(false)
      resetForm()
      await fetchPrograms()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل إنشاء البرنامج' : 'Failed to create program'))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedProgram) return

    try {
      setSaving(true)
      await sportsDirectorService.updateProgram(selectedProgram.id, formData)
      toast.success(language === 'ar' ? 'تم تحديث البرنامج بنجاح' : 'Program updated successfully')
      setShowEditModal(false)
      setSelectedProgram(null)
      resetForm()
      await fetchPrograms()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحديث البرنامج' : 'Failed to update program'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا البرنامج؟' : 'Are you sure you want to delete this program?')) {
      return
    }

    try {
      setDeleting(id)
      await sportsDirectorService.deleteProgram(id)
      toast.success(language === 'ar' ? 'تم حذف البرنامج بنجاح' : 'Program deleted successfully')
      await fetchPrograms()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل حذف البرنامج' : 'Failed to delete program'))
    } finally {
      setDeleting(null)
    }
  }

  const handleStatusChange = async (id: string, status: SportsProgram['status']) => {
    try {
      await sportsDirectorService.updateProgramStatus(id, status)
      toast.success(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated')
      await fetchPrograms()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحديث الحالة' : 'Failed to update status'))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      type: 'training',
      description: '',
      descriptionAr: '',
      startDate: '',
      endDate: '',
      maxParticipants: 50,
      status: 'upcoming'
    })
  }

  const openEditModal = (program: SportsProgram) => {
    setSelectedProgram(program)
    setFormData({
      name: program.name,
      nameAr: program.nameAr,
      type: program.type,
      description: program.description || '',
      descriptionAr: program.descriptionAr || '',
      startDate: program.startDate,
      endDate: program.endDate,
      maxParticipants: program.maxParticipants,
      status: program.status
    })
    setShowEditModal(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training': return <Dumbbell className="w-5 h-5 text-blue-600" />
      case 'competition': return <Trophy className="w-5 h-5 text-yellow-600" />
      case 'development': return <TrendingUp className="w-5 h-5 text-green-600" />
      default: return <Dumbbell className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> {language === 'ar' ? 'نشط' : 'Active'}
        </span>
      case 'completed':
        return <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {language === 'ar' ? 'مكتمل' : 'Completed'}
        </span>
      case 'upcoming':
        return <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {language === 'ar' ? 'قادم' : 'Upcoming'}
        </span>
      case 'inactive':
        return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle className="w-3 h-3" /> {language === 'ar' ? 'متوقف' : 'Inactive'}
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
                {language === 'ar' ? 'البرامج الرياضية' : 'Sports Programs'}
              </h1>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'برنامج جديد' : 'New Program'}
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
                placeholder={language === 'ar' ? 'بحث عن برنامج...' : 'Search programs...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
              <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
              <option value="upcoming">{language === 'ar' ? 'قادم' : 'Upcoming'}</option>
              <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
              <option value="inactive">{language === 'ar' ? 'متوقف' : 'Inactive'}</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
              <option value="training">{language === 'ar' ? 'تدريب' : 'Training'}</option>
              <option value="competition">{language === 'ar' ? 'مسابقة' : 'Competition'}</option>
              <option value="development">{language === 'ar' ? 'تطوير' : 'Development'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              {language === 'ar' ? 'لا توجد برامج' : 'No programs found'}
            </div>
          ) : (
            filteredPrograms.map((program) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    program.type === 'training' ? 'bg-blue-100' :
                    program.type === 'competition' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}>
                    {getTypeIcon(program.type)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(program.status)}
                    <div className="relative group">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:block z-10">
                        <button
                          onClick={() => openEditModal(program)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          {language === 'ar' ? 'تعديل' : 'Edit'}
                        </button>
                        {program.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(program.id, 'inactive')}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-orange-600"
                          >
                            <Pause className="w-4 h-4" />
                            {language === 'ar' ? 'إيقاف' : 'Deactivate'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(program.id, 'active')}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-green-600"
                          >
                            <Play className="w-4 h-4" />
                            {language === 'ar' ? 'تفعيل' : 'Activate'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(program.id)}
                          disabled={deleting === program.id}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                          {deleting === program.id ? (
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

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {language === 'ar' ? program.nameAr : program.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {program.participants}/{program.maxParticipants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(program.startDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{program.progress}% {language === 'ar' ? 'مكتمل' : 'complete'}</p>
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
            onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedProgram(null); resetForm(); }}
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
                    ? (language === 'ar' ? 'تعديل البرنامج' : 'Edit Program')
                    : (language === 'ar' ? 'برنامج جديد' : 'New Program')
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
                      {language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'} *
                    </label>
                    <input
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
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
                      <option value="competition">{language === 'ar' ? 'مسابقة' : 'Competition'}</option>
                      <option value="development">{language === 'ar' ? 'تطوير' : 'Development'}</option>
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
                      <option value="upcoming">{language === 'ar' ? 'قادم' : 'Upcoming'}</option>
                      <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                      <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                      <option value="inactive">{language === 'ar' ? 'متوقف' : 'Inactive'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الحد الأقصى للمشاركين' : 'Max Participants'}
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
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
