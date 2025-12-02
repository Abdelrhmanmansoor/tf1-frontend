'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import {
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Calendar,
  MapPin,
  Loader2,
  RefreshCw,
  Plus,
  Filter,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import playerService from '@/services/player'
import type { TrainingRequest, TrainingRequestStatus } from '@/types/player'

const statusConfig: Record<TrainingRequestStatus, {
  icon: React.ElementType
  color: string
  bgColor: string
  label: { ar: string; en: string }
}> = {
  pending: {
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    label: { ar: 'قيد الانتظار', en: 'Pending' }
  },
  approved: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: { ar: 'مقبول', en: 'Approved' }
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    label: { ar: 'مرفوض', en: 'Rejected' }
  },
  cancelled: {
    icon: XCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    label: { ar: 'ملغي', en: 'Cancelled' }
  },
  completed: {
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: { ar: 'مكتمل', en: 'Completed' }
  }
}

const typeLabels = {
  private: { ar: 'تدريب خاص', en: 'Private Training' },
  group: { ar: 'تدريب جماعي', en: 'Group Training' },
  evaluation: { ar: 'تقييم', en: 'Evaluation' },
  trial: { ar: 'تجربة', en: 'Trial' }
}

type FilterStatus = TrainingRequestStatus | 'all'

export default function TrainingRequestsPage() {
  const { language } = useLanguage()
  const router = useRouter()
  
  const [requests, setRequests] = useState<TrainingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchRequests = useCallback(async () => {
    try {
      setError(null)
      const response = await playerService.getTrainingRequests({
        status: filter === 'all' ? undefined : filter,
        page,
        limit: 10
      })
      
      setRequests(response.requests)
      setTotalPages(response.pagination.totalPages)
      setBackendAvailable(true)
    } catch (err: any) {
      console.error('Failed to fetch training requests:', err)
      if (err?.response?.status === 404 || err?.message?.includes('Network')) {
        setBackendAvailable(false)
      } else {
        setError(err.message || 'Failed to load requests')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filter, page])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchRequests()
  }

  const handleCancelRequest = async (id: string) => {
    try {
      await playerService.cancelTrainingRequest(id)
      setRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: 'cancelled' as TrainingRequestStatus } : r
      ))
    } catch (err) {
      console.error('Failed to cancel request:', err)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const filterOptions: { value: FilterStatus; label: { ar: string; en: string } }[] = [
    { value: 'all', label: { ar: 'الكل', en: 'All' } },
    { value: 'pending', label: { ar: 'قيد الانتظار', en: 'Pending' } },
    { value: 'approved', label: { ar: 'مقبول', en: 'Approved' } },
    { value: 'rejected', label: { ar: 'مرفوض', en: 'Rejected' } },
    { value: 'completed', label: { ar: 'مكتمل', en: 'Completed' } },
    { value: 'cancelled', label: { ar: 'ملغي', en: 'Cancelled' } }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (!backendAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'طلبات التدريب' : 'Training Requests'}
            </h1>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-amber-800 mb-2">
              {language === 'ar'
                ? 'نظام طلبات التدريب قيد الإعداد'
                : 'Training Requests System Being Set Up'}
            </h2>
            <p className="text-amber-700 mb-6">
              {language === 'ar'
                ? 'ستتمكن قريباً من إرسال طلبات تدريب للمدربين وتتبع حالتها'
                : 'Soon you will be able to send training requests to coaches and track their status'}
            </p>
            <Button onClick={() => router.back()} variant="outline">
              {language === 'ar' ? 'العودة' : 'Go Back'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'طلبات التدريب' : 'Training Requests'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' ? 'إدارة وتتبع طلباتك' : 'Manage and track your requests'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'طلب جديد' : 'New Request'}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {filterOptions.map(option => (
            <Button
              key={option.value}
              variant={filter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setFilter(option.value); setPage(1) }}
              className="flex-shrink-0"
            >
              {option.label[language]}
            </Button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="mt-2">
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {requests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'ar' ? 'لا توجد طلبات' : 'No Requests'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {filter === 'all'
                    ? (language === 'ar' ? 'لم ترسل أي طلبات تدريب بعد' : 'You haven\'t sent any training requests yet')
                    : (language === 'ar' ? 'لا توجد طلبات بهذه الحالة' : 'No requests with this status')}
                </p>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  {language === 'ar' ? 'أرسل طلبك الأول' : 'Send Your First Request'}
                </Button>
              </motion.div>
            ) : (
              requests.map((request, index) => {
                const config = statusConfig[request.status]
                const StatusIcon = config.icon

                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`w-6 h-6 ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">
                            {language === 'ar' ? request.titleAr || request.title : request.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                            {config.label[language]}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {typeLabels[request.type][language]}
                          </span>
                        </div>

                        {request.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {language === 'ar' ? request.descriptionAr || request.description : request.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{request.coach?.name || 'Coach'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {request.scheduledDate
                                ? formatDate(request.scheduledDate)
                                : (language === 'ar' ? 'لم يحدد بعد' : 'Not scheduled yet')}
                            </span>
                          </div>
                          {request.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {language === 'ar' ? request.locationAr || request.location : request.location}
                              </span>
                            </div>
                          )}
                        </div>

                        {request.status === 'rejected' && request.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg">
                            <p className="text-sm text-red-700">
                              <span className="font-medium">{language === 'ar' ? 'سبب الرفض: ' : 'Reason: '}</span>
                              {language === 'ar' ? request.rejectionReasonAr || request.rejectionReason : request.rejectionReason}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-4">
                          <p className="text-xs text-gray-400">
                            {language === 'ar' ? 'تم الإرسال: ' : 'Sent: '}
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Link href={`/dashboard/player/requests/${request.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            {language === 'ar' ? 'التفاصيل' : 'Details'}
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </Link>
                        {request.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            {language === 'ar' ? 'إلغاء' : 'Cancel'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-4 py-2 text-sm text-gray-600">
              {language === 'ar'
                ? `صفحة ${page} من ${totalPages}`
                : `Page ${page} of ${totalPages}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
