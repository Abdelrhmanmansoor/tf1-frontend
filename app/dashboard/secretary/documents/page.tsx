'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import secretaryService from '@/services/secretary'
import {
  FileText,
  Loader2,
  Plus,
  X,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

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

export default function SecretaryDocumentsPage() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [saving, setSaving] = useState(false)

  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'memo' as Document['type'],
    fileUrl: '',
    priority: 'normal' as Document['priority'],
    assignedTo: '',
    dueDate: '',
    notes: ''
  })

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await secretaryService.getDocuments()
      setDocuments(data || [])
      setFilteredDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast.error(language === 'ar' ? 'تعذر تحميل المستندات' : 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  useEffect(() => {
    let filtered = [...documents]

    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(doc => doc.status === filterStatus)
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.type === filterType)
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(doc => doc.priority === filterPriority)
    }

    setFilteredDocuments(filtered)
  }, [documents, searchQuery, filterStatus, filterType, filterPriority])

  const handleAddDocument = async () => {
    if (!newDocument.name) {
      toast.error(language === 'ar' ? 'يرجى إدخال اسم المستند' : 'Please enter document name')
      return
    }

    try {
      setSaving(true)
      await secretaryService.uploadDocument({
        name: newDocument.name,
        type: newDocument.type,
        fileUrl: newDocument.fileUrl || '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        priority: newDocument.priority,
        assignedTo: newDocument.assignedTo,
        dueDate: newDocument.dueDate,
        notes: newDocument.notes
      })
      toast.success(language === 'ar' ? 'تمت إضافة المستند بنجاح' : 'Document added successfully')
      setShowAddModal(false)
      setNewDocument({
        name: '',
        type: 'memo',
        fileUrl: '',
        priority: 'normal',
        assignedTo: '',
        dueDate: '',
        notes: ''
      })
      fetchDocuments()
    } catch (error: any) {
      console.error('Error adding document:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    } finally {
      setSaving(false)
    }
  }

  const handleApproveDocument = async (id: string) => {
    try {
      await secretaryService.approveDocument(id)
      toast.success(language === 'ar' ? 'تمت الموافقة على المستند' : 'Document approved')
      fetchDocuments()
    } catch (error: any) {
      console.error('Error approving document:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    }
  }

  const handleRejectDocument = async (id: string) => {
    const reason = prompt(language === 'ar' ? 'سبب الرفض:' : 'Rejection reason:')
    if (reason === null) return

    try {
      await secretaryService.rejectDocument(id, reason)
      toast.success(language === 'ar' ? 'تم رفض المستند' : 'Document rejected')
      fetchDocuments()
    } catch (error: any) {
      console.error('Error rejecting document:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    }
  }

  const getTypeLabel = (type: Document['type']) => {
    const labels = {
      contract: language === 'ar' ? 'عقد' : 'Contract',
      letter: language === 'ar' ? 'خطاب' : 'Letter',
      report: language === 'ar' ? 'تقرير' : 'Report',
      memo: language === 'ar' ? 'مذكرة' : 'Memo'
    }
    return labels[type]
  }

  const getStatusLabel = (status: Document['status']) => {
    const labels = {
      pending: language === 'ar' ? 'معلق' : 'Pending',
      approved: language === 'ar' ? 'موافق' : 'Approved',
      rejected: language === 'ar' ? 'مرفوض' : 'Rejected'
    }
    return labels[status]
  }

  const getPriorityLabel = (priority: Document['priority']) => {
    const labels = {
      high: language === 'ar' ? 'عالي' : 'High',
      normal: language === 'ar' ? 'عادي' : 'Normal',
      low: language === 'ar' ? 'منخفض' : 'Low'
    }
    return labels[priority]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    )
  }

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
              {language === 'ar' ? 'إدارة المستندات' : 'Document Management'}
            </h1>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'مستند جديد' : 'New Document'}
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{language === 'ar' ? 'كل الحالات' : 'All Status'}</option>
              <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
              <option value="approved">{language === 'ar' ? 'موافق' : 'Approved'}</option>
              <option value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{language === 'ar' ? 'كل الأنواع' : 'All Types'}</option>
              <option value="contract">{language === 'ar' ? 'عقد' : 'Contract'}</option>
              <option value="letter">{language === 'ar' ? 'خطاب' : 'Letter'}</option>
              <option value="report">{language === 'ar' ? 'تقرير' : 'Report'}</option>
              <option value="memo">{language === 'ar' ? 'مذكرة' : 'Memo'}</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{language === 'ar' ? 'كل الأولويات' : 'All Priorities'}</option>
              <option value="high">{language === 'ar' ? 'عالي' : 'High'}</option>
              <option value="normal">{language === 'ar' ? 'عادي' : 'Normal'}</option>
              <option value="low">{language === 'ar' ? 'منخفض' : 'Low'}</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {language === 'ar' ? 'لا توجد مستندات' : 'No documents found'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-4 px-6 font-medium text-gray-600`}>
                      {language === 'ar' ? 'المستند' : 'Document'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-4 px-6 font-medium text-gray-600`}>
                      {language === 'ar' ? 'النوع' : 'Type'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-4 px-6 font-medium text-gray-600`}>
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-4 px-6 font-medium text-gray-600`}>
                      {language === 'ar' ? 'الأولوية' : 'Priority'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-4 px-6 font-medium text-gray-600`}>
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className={`${language === 'ar' ? 'text-right' : 'text-left'} py-4 px-6 font-medium text-gray-600`}>
                      {language === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.type === 'contract' ? 'bg-blue-100' :
                            doc.type === 'letter' ? 'bg-green-100' :
                            doc.type === 'report' ? 'bg-purple-100' :
                            'bg-gray-100'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              doc.type === 'contract' ? 'text-blue-600' :
                              doc.type === 'letter' ? 'text-green-600' :
                              doc.type === 'report' ? 'text-purple-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <span className="font-medium text-gray-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          doc.type === 'contract' ? 'bg-blue-100 text-blue-800' :
                          doc.type === 'letter' ? 'bg-green-100 text-green-800' :
                          doc.type === 'report' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getTypeLabel(doc.type)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{doc.date}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          doc.priority === 'high' ? 'bg-red-100 text-red-800' :
                          doc.priority === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {getPriorityLabel(doc.priority)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getStatusLabel(doc.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDocument(doc)
                              setShowViewModal(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {doc.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveDocument(doc.id)}
                                className="text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectDocument(doc.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
                  {language === 'ar' ? 'إضافة مستند جديد' : 'Add New Document'}
                </h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'اسم المستند' : 'Document Name'} *
                  </label>
                  <input
                    type="text"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'نوع المستند' : 'Document Type'}
                  </label>
                  <select
                    value={newDocument.type}
                    onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as Document['type'] })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="memo">{language === 'ar' ? 'مذكرة' : 'Memo'}</option>
                    <option value="contract">{language === 'ar' ? 'عقد' : 'Contract'}</option>
                    <option value="letter">{language === 'ar' ? 'خطاب' : 'Letter'}</option>
                    <option value="report">{language === 'ar' ? 'تقرير' : 'Report'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الأولوية' : 'Priority'}
                  </label>
                  <select
                    value={newDocument.priority}
                    onChange={(e) => setNewDocument({ ...newDocument, priority: e.target.value as Document['priority'] })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="low">{language === 'ar' ? 'منخفض' : 'Low'}</option>
                    <option value="normal">{language === 'ar' ? 'عادي' : 'Normal'}</option>
                    <option value="high">{language === 'ar' ? 'عالي' : 'High'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'موجه إلى' : 'Assigned To'}
                  </label>
                  <input
                    type="text"
                    value={newDocument.assignedTo}
                    onChange={(e) => setNewDocument({ ...newDocument, assignedTo: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    value={newDocument.dueDate}
                    onChange={(e) => setNewDocument({ ...newDocument, dueDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </label>
                  <textarea
                    value={newDocument.notes}
                    onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
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
                  onClick={handleAddDocument}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إضافة' : 'Add')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {showViewModal && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{selectedDocument.name}</h3>
                <button onClick={() => { setShowViewModal(false); setSelectedDocument(null); }}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">{language === 'ar' ? 'النوع' : 'Type'}</span>
                    <p className="font-medium">{getTypeLabel(selectedDocument.type)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{language === 'ar' ? 'الأولوية' : 'Priority'}</span>
                    <p className="font-medium">{getPriorityLabel(selectedDocument.priority)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{language === 'ar' ? 'التاريخ' : 'Date'}</span>
                    <p className="font-medium">{selectedDocument.date}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{language === 'ar' ? 'الحالة' : 'Status'}</span>
                    <p className="font-medium">{getStatusLabel(selectedDocument.status)}</p>
                  </div>
                </div>

                {selectedDocument.assignedTo && (
                  <div>
                    <span className="text-sm text-gray-500">{language === 'ar' ? 'موجه إلى' : 'Assigned To'}</span>
                    <p className="font-medium">{selectedDocument.assignedTo}</p>
                  </div>
                )}

                {selectedDocument.notes && (
                  <div>
                    <span className="text-sm text-gray-500">{language === 'ar' ? 'ملاحظات' : 'Notes'}</span>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedDocument.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                {selectedDocument.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        handleApproveDocument(selectedDocument.id)
                        setShowViewModal(false)
                        setSelectedDocument(null)
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'موافقة' : 'Approve'}
                    </Button>
                    <Button
                      onClick={() => {
                        handleRejectDocument(selectedDocument.id)
                        setShowViewModal(false)
                        setSelectedDocument(null)
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'رفض' : 'Reject'}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
