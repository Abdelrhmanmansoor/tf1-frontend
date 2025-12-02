'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  User,
  Calendar,
  MapPin,
  Loader2,
  RefreshCw,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import playerService from '@/services/player'
import type { TrainingRequest, TrainingRequestStatus } from '@/types/player'

interface ActiveRequestsWidgetProps {
  language: 'ar' | 'en'
  onNewRequest?: () => void
}

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
  accepted: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: { ar: 'مقبول', en: 'Accepted' }
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

export default function ActiveRequestsWidget({ language, onNewRequest }: ActiveRequestsWidgetProps) {
  const [requests, setRequests] = useState<TrainingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchRequests = useCallback(async () => {
    try {
      setError(null)
      const response = await playerService.getTrainingRequests({ 
        status: 'all',
        limit: 5 
      })
      
      const activeRequests = response.requests.filter(
        r => r.status === 'pending' || r.status === 'accepted'
      )
      setRequests(activeRequests)
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
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchRequests()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (!backendAvailable) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {language === 'ar' ? 'طلبات التدريب النشطة' : 'Active Training Requests'}
              </h3>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'تتبع طلباتك' : 'Track your requests'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-amber-700 font-medium">
            {language === 'ar' 
              ? 'نظام طلبات التدريب قيد الإعداد - قريباً'
              : 'Training requests system being set up - coming soon'}
          </p>
          <p className="text-amber-600 text-sm mt-1">
            {language === 'ar'
              ? 'ستتمكن من إرسال طلبات تدريب للمدربين'
              : 'You will be able to send training requests to coaches'}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              {language === 'ar' ? 'طلبات التدريب النشطة' : 'Active Training Requests'}
            </h3>
            <p className="text-sm text-gray-500">
              {requests.length > 0 
                ? (language === 'ar' ? `${requests.length} طلب نشط` : `${requests.length} active request(s)`)
                : (language === 'ar' ? 'لا توجد طلبات نشطة' : 'No active requests')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          {onNewRequest && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNewRequest}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'طلب جديد' : 'New Request'}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <Button variant="ghost" size="sm" onClick={handleRefresh} className="mt-2">
            {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">
                {language === 'ar' 
                  ? 'لم ترسل أي طلبات تدريب بعد'
                  : 'You haven\'t sent any training requests yet'}
              </p>
              {onNewRequest && (
                <Button onClick={onNewRequest} className="gap-2">
                  <Plus className="w-4 h-4" />
                  {language === 'ar' ? 'أرسل طلبك الأول' : 'Send Your First Request'}
                </Button>
              )}
            </motion.div>
          ) : (
            requests.map((request, index) => {
              const config = statusConfig[request.status]
              const StatusIcon = config.icon

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all cursor-pointer"
                >
                  <Link href={`/dashboard/player/requests/${request.id}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {language === 'ar' ? request.titleAr || request.title : request.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                            {config.label[language]}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            <span>{request.coach?.name || 'Coach'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {request.scheduledDate 
                                ? formatDate(request.scheduledDate)
                                : typeLabels[request.type][language]}
                            </span>
                          </div>
                          {request.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[100px]">
                                {language === 'ar' ? request.locationAr || request.location : request.location}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {requests.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href="/dashboard/player/requests">
            <Button variant="ghost" className="w-full gap-2">
              {language === 'ar' ? 'عرض جميع الطلبات' : 'View All Requests'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  )
}
