'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import executiveDirectorService, { Partnership } from '@/services/executive-director'
import {
  Globe,
  Loader2,
  Plus,
  X,
  Search,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  User,
  Building2,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function PartnershipsPage() {
  return (
    <ProtectedRoute allowedRoles={['executive-director']}>
      <PartnershipsContent />
    </ProtectedRoute>
  )
}

function PartnershipsContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [filteredPartnerships, setFilteredPartnerships] = useState<Partnership[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    partnerName: '',
    partnerNameAr: '',
    type: 'strategic' as 'sponsor' | 'strategic' | 'vendor' | 'affiliate' | 'government',
    status: 'negotiating' as 'active' | 'negotiating' | 'expired' | 'pending',
    startDate: '',
    endDate: '',
    value: 0,
    currency: 'SAR',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    descriptionAr: '',
    benefits: [] as string[]
  })

  const fetchPartnerships = useCallback(async () => {
    try {
      setLoading(true)
      const data = await executiveDirectorService.getPartnerships()
      setPartnerships(data)
      setFilteredPartnerships(data)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل الشراكات' : 'Failed to load partnerships'))
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchPartnerships()
  }, [fetchPartnerships])

  useEffect(() => {
    let filtered = [...partnerships]

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.partnerNameAr?.includes(searchQuery)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType)
    }

    setFilteredPartnerships(filtered)
  }, [partnerships, searchQuery, filterStatus, filterType])

  const handleCreate = async () => {
    if (!formData.partnerName || !formData.partnerNameAr) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    try {
      setSaving(true)
      await executiveDirectorService.createPartnership(formData)
      toast.success(language === 'ar' ? 'تم إنشاء الشراكة بنجاح' : 'Partnership created successfully')
      setShowAddModal(false)
      resetForm()
      await fetchPartnerships()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل إنشاء الشراكة' : 'Failed to create partnership'))
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedPartnership) return

    try {
      setSaving(true)
      await executiveDirectorService.updatePartnership(selectedPartnership.id, formData)
      toast.success(language === 'ar' ? 'تم تحديث الشراكة بنجاح' : 'Partnership updated successfully')
      setShowEditModal(false)
      setSelectedPartnership(null)
      resetForm()
      await fetchPartnerships()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحديث الشراكة' : 'Failed to update partnership'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الشراكة؟' : 'Are you sure you want to delete this partnership?')) {
      return
    }

    try {
      setDeleting(id)
      await executiveDirectorService.deletePartnership(id)
      toast.success(language === 'ar' ? 'تم حذف الشراكة بنجاح' : 'Partnership deleted successfully')
      await fetchPartnerships()
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل حذف الشراكة' : 'Failed to delete partnership'))
    } finally {
      setDeleting(null)
    }
  }

  const resetForm = () => {
    setFormData({
      partnerName: '',
      partnerNameAr: '',
      type: 'strategic',
      status: 'negotiating',
      startDate: '',
      endDate: '',
      value: 0,
      currency: 'SAR',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      description: '',
      descriptionAr: '',
      benefits: []
    })
  }

  const openEditModal = (partnership: Partnership) => {
    setSelectedPartnership(partnership)
    setFormData({
      partnerName: partnership.partnerName,
      partnerNameAr: partnership.partnerNameAr,
      type: partnership.type,
      status: partnership.status,
      startDate: partnership.startDate,
      endDate: partnership.endDate,
      value: partnership.value,
      currency: partnership.currency || 'SAR',
      contactPerson: partnership.contactPerson,
      contactEmail: partnership.contactEmail,
      contactPhone: partnership.contactPhone || '',
      description: partnership.description || '',
      descriptionAr: partnership.descriptionAr || '',
      benefits: partnership.benefits || []
    })
    setShowEditModal(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> {language === 'ar' ? 'نشط' : 'Active'}
        </span>
      case 'negotiating':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {language === 'ar' ? 'قيد التفاوض' : 'Negotiating'}
        </span>
      case 'expired':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {language === 'ar' ? 'منتهي' : 'Expired'}
        </span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
          {language === 'ar' ? 'معلق' : 'Pending'}
        </span>
    }
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      sponsor: 'bg-purple-100 text-purple-800',
      strategic: 'bg-blue-100 text-blue-800',
      vendor: 'bg-orange-100 text-orange-800',
      affiliate: 'bg-cyan-100 text-cyan-800',
      government: 'bg-green-100 text-green-800'
    }
    const labels: Record<string, { en: string; ar: string }> = {
      sponsor: { en: 'Sponsor', ar: 'راعي' },
      strategic: { en: 'Strategic', ar: 'استراتيجي' },
      vendor: { en: 'Vendor', ar: 'مورد' },
      affiliate: { en: 'Affiliate', ar: 'تابع' },
      government: { en: 'Government', ar: 'حكومي' }
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {language === 'ar' ? labels[type]?.ar : labels[type]?.en}
      </span>
    )
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
                {language === 'ar' ? 'الشراكات' : 'Partnerships'}
              </h1>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'شراكة جديدة' : 'New Partnership'}
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
                placeholder={language === 'ar' ? 'بحث عن شراكة...' : 'Search partnerships...'}
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
              <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
              <option value="negotiating">{language === 'ar' ? 'قيد التفاوض' : 'Negotiating'}</option>
              <option value="expired">{language === 'ar' ? 'منتهي' : 'Expired'}</option>
              <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
              <option value="sponsor">{language === 'ar' ? 'راعي' : 'Sponsor'}</option>
              <option value="strategic">{language === 'ar' ? 'استراتيجي' : 'Strategic'}</option>
              <option value="vendor">{language === 'ar' ? 'مورد' : 'Vendor'}</option>
              <option value="affiliate">{language === 'ar' ? 'تابع' : 'Affiliate'}</option>
              <option value="government">{language === 'ar' ? 'حكومي' : 'Government'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartnerships.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl">
              {language === 'ar' ? 'لا توجد شراكات' : 'No partnerships found'}
            </div>
          ) : (
            filteredPartnerships.map((partnership) => (
              <motion.div
                key={partnership.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                      {partnership.logo ? (
                        <img src={partnership.logo} alt="" className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {language === 'ar' ? partnership.partnerNameAr : partnership.partnerName}
                      </h3>
                      {getTypeBadge(partnership.type)}
                    </div>
                  </div>
                  <div className="relative group">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:block z-10">
                      <button
                        onClick={() => openEditModal(partnership)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        {language === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(partnership.id)}
                        disabled={deleting === partnership.id}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      >
                        {deleting === partnership.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {language === 'ar' ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  {getStatusBadge(partnership.status)}
                </div>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {partnership.value?.toLocaleString()} {partnership.currency || 'SAR'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(partnership.startDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')} - {new Date(partnership.endDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </div>
                  {partnership.contactPerson && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {partnership.contactPerson}
                    </div>
                  )}
                  {partnership.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {partnership.contactEmail}
                    </div>
                  )}
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
            onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedPartnership(null); resetForm(); }}
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
                    ? (language === 'ar' ? 'تعديل الشراكة' : 'Edit Partnership')
                    : (language === 'ar' ? 'شراكة جديدة' : 'New Partnership')
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
                      {language === 'ar' ? 'اسم الشريك (إنجليزي)' : 'Partner Name (English)'} *
                    </label>
                    <input
                      type="text"
                      value={formData.partnerName}
                      onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'اسم الشريك (عربي)' : 'Partner Name (Arabic)'} *
                    </label>
                    <input
                      type="text"
                      value={formData.partnerNameAr}
                      onChange={(e) => setFormData({ ...formData, partnerNameAr: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="sponsor">{language === 'ar' ? 'راعي' : 'Sponsor'}</option>
                      <option value="strategic">{language === 'ar' ? 'استراتيجي' : 'Strategic'}</option>
                      <option value="vendor">{language === 'ar' ? 'مورد' : 'Vendor'}</option>
                      <option value="affiliate">{language === 'ar' ? 'تابع' : 'Affiliate'}</option>
                      <option value="government">{language === 'ar' ? 'حكومي' : 'Government'}</option>
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
                      <option value="negotiating">{language === 'ar' ? 'قيد التفاوض' : 'Negotiating'}</option>
                      <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
                      <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                      <option value="expired">{language === 'ar' ? 'منتهي' : 'Expired'}</option>
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
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'القيمة' : 'Value'}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'جهة الاتصال' : 'Contact Person'}
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
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
