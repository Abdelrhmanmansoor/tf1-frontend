'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import ageGroupSupervisorService from '@/services/age-group-supervisor'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Search,
  Loader2,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  User,
  X,
  AlertCircle
} from 'lucide-react'

interface Registration {
  id: string
  playerName: string
  dateOfBirth: string
  age: number
  parentName: string
  parentPhone: string
  parentEmail?: string
  requestedAgeGroup: string
  requestedAgeGroupId: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
}

interface AgeGroup {
  id: string
  name: string
  nameAr: string
}

function RegistrationsContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchRegistrations()
    fetchAgeGroups()
  }, [filter])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const statusParam = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-group-supervisor/registrations${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setRegistrations(result.data?.registrations || [])
      } else {
        setRegistrations([])
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAgeGroups = async () => {
    try {
      const groups = await ageGroupSupervisorService.getAgeGroups()
      setAgeGroups(groups)
    } catch (error) {
      console.error('Error fetching age groups:', error)
      setAgeGroups([])
    }
  }

  const openApproveModal = (registration: Registration) => {
    setSelectedRegistration(registration)
    setSelectedAgeGroupId(registration.requestedAgeGroupId || '')
    setShowApproveModal(true)
  }

  const openRejectModal = (registration: Registration) => {
    setSelectedRegistration(registration)
    setRejectReason('')
    setShowRejectModal(true)
  }

  const handleApprove = async () => {
    if (!selectedRegistration || !selectedAgeGroupId) {
      toast.error(language === 'ar' ? 'يرجى اختيار الفئة السنية' : 'Please select an age group')
      return
    }

    try {
      setProcessing(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-group-supervisor/registrations/${selectedRegistration.id}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ageGroupId: selectedAgeGroupId,
            status: 'approved'
          })
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تم قبول الطلب بنجاح' : 'Registration approved successfully')
        setShowApproveModal(false)
        setSelectedRegistration(null)
        fetchRegistrations()
      } else if (response.status === 404) {
        toast.error(
          language === 'ar' 
            ? 'الخدمة غير متاحة - يرجى التواصل مع مطور الباك اند' 
            : 'Service unavailable - please contact backend developer'
        )
      } else {
        toast.error(language === 'ar' ? 'حدث خطأ أثناء القبول' : 'Error approving registration')
      }
    } catch (error) {
      console.error('Error approving registration:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service unavailable')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRegistration) return

    try {
      setProcessing(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-group-supervisor/registrations/${selectedRegistration.id}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: 'rejected',
            reason: rejectReason
          })
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تم رفض الطلب' : 'Registration rejected')
        setShowRejectModal(false)
        setSelectedRegistration(null)
        fetchRegistrations()
      } else if (response.status === 404) {
        toast.error(
          language === 'ar' 
            ? 'الخدمة غير متاحة - يرجى التواصل مع مطور الباك اند' 
            : 'Service unavailable - please contact backend developer'
        )
      } else {
        toast.error(language === 'ar' ? 'حدث خطأ أثناء الرفض' : 'Error rejecting registration')
      }
    } catch (error) {
      console.error('Error rejecting registration:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service unavailable')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: language === 'ar' ? 'معلق' : 'Pending' }
      case 'approved':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: language === 'ar' ? 'مقبول' : 'Approved' }
      case 'rejected':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: language === 'ar' ? 'مرفوض' : 'Rejected' }
      default:
        return { icon: Clock, color: 'bg-gray-100 text-gray-600', label: status }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'طلبات التسجيل' : 'Registration Requests'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? 'bg-green-600 text-white' : ''}
            >
              {status === 'all' && (language === 'ar' ? 'الكل' : 'All')}
              {status === 'pending' && (language === 'ar' ? 'معلق' : 'Pending')}
              {status === 'approved' && (language === 'ar' ? 'مقبول' : 'Approved')}
              {status === 'rejected' && (language === 'ar' ? 'مرفوض' : 'Rejected')}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : registrations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد طلبات تسجيل' : 'No Registration Requests'}
            </h3>
            <p className="text-gray-500">
              {filter === 'pending' 
                ? (language === 'ar' ? 'لا توجد طلبات معلقة حالياً' : 'No pending requests at the moment')
                : (language === 'ar' ? 'لا توجد طلبات في هذه الفئة' : 'No requests in this category')
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg, index) => {
              const status = getStatusBadge(reg.status)
              return (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{reg.playerName}</h3>
                        <p className="text-sm text-gray-500">{reg.age} {language === 'ar' ? 'سنة' : 'years old'}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <status.icon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'الفئة المطلوبة' : 'Requested Group'}</p>
                      <p className="text-sm font-medium">{reg.requestedAgeGroup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'ولي الأمر' : 'Parent'}</p>
                      <p className="text-sm font-medium">{reg.parentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'الهاتف' : 'Phone'}</p>
                      <p className="text-sm font-medium">{reg.parentPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'تاريخ الطلب' : 'Submitted'}</p>
                      <p className="text-sm font-medium">{new Date(reg.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {reg.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        onClick={() => openApproveModal(reg)}
                        className="flex-1 bg-green-600 text-white hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'قبول' : 'Approve'}
                      </Button>
                      <Button 
                        onClick={() => openRejectModal(reg)}
                        variant="outline"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'رفض' : 'Reject'}
                      </Button>
                    </div>
                  )}

                  {reg.status === 'rejected' && reg.notes && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}</p>
                      <p className="text-sm text-red-600">{reg.notes}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </main>

      {showApproveModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'قبول طلب التسجيل' : 'Approve Registration'}
              </h2>
              <button onClick={() => setShowApproveModal(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedRegistration.playerName}</p>
                  <p className="text-sm text-gray-500">{selectedRegistration.age} {language === 'ar' ? 'سنة' : 'years old'}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'تعيين للفئة السنية' : 'Assign to Age Group'} *
              </label>
              <select
                value={selectedAgeGroupId}
                onChange={(e) => setSelectedAgeGroupId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
              >
                <option value="">{language === 'ar' ? 'اختر الفئة' : 'Select Group'}</option>
                {ageGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {language === 'ar' ? group.nameAr : group.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'ar' 
                  ? 'سيتم إضافة اللاعب تلقائياً لهذه الفئة بعد القبول'
                  : 'Player will be automatically added to this group after approval'
                }
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowApproveModal(false)} className="flex-1">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={processing || !selectedAgeGroupId}
                className="flex-1 bg-green-600 text-white"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تأكيد القبول' : 'Confirm Approval'}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {showRejectModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'رفض طلب التسجيل' : 'Reject Registration'}
              </h2>
              <button onClick={() => setShowRejectModal(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedRegistration.playerName}</p>
                  <p className="text-sm text-gray-500">
                    {language === 'ar' ? 'سيتم إشعار ولي الأمر بالرفض' : 'Parent will be notified of rejection'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'سبب الرفض (اختياري)' : 'Rejection Reason (optional)'}
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب سبب الرفض...' : 'Enter rejection reason...'}
                className="w-full px-3 py-2 border rounded-lg resize-none h-24"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRejectModal(false)} className="flex-1">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleReject}
                disabled={processing}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تأكيد الرفض' : 'Confirm Rejection'}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function RegistrationsPage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <RegistrationsContent />
    </ProtectedRoute>
  )
}
