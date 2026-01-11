'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useSearchParams } from 'next/navigation'
import api from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Briefcase,
  MoreVertical,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Application {
  _id: string
  jobId: {
    _id: string
    title: string
    titleAr?: string
  }
  applicantId: {
    _id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
  status: string
  createdAt: string
  coverLetter?: string
}

export default function ApplicationsList() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const jobId = searchParams.get('jobId')

  useEffect(() => {
    fetchApplications()
  }, [page, statusFilter, searchTerm, jobId])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      let url = `/job-publisher/applications?page=${page}&limit=10&sort=-createdAt`
      
      if (statusFilter && statusFilter !== 'all') {
        url += `&status=${statusFilter}`
      }
      
      if (jobId) {
        url += `&jobId=${jobId}`
      }

      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`

      const response = await api.get(url)
      if (response.data.success) {
        setApplications(response.data.data.applications)
        setTotalPages(response.data.data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error(language === 'ar' ? 'فشل تحميل الطلبات' : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/job-publisher/applications/${id}/status`, { status: newStatus })
      toast.success(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated')
      fetchApplications()
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل تحديث الحالة' : 'Failed to update status')
    }
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      new: { bg: 'bg-blue-50', text: 'text-blue-700' },
      under_review: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
      interviewed: { bg: 'bg-purple-50', text: 'text-purple-700' },
      offered: { bg: 'bg-green-50', text: 'text-green-700' },
      rejected: { bg: 'bg-red-50', text: 'text-red-700' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800' },
    }
    return statusMap[status] || { bg: 'bg-gray-50', text: 'text-gray-700' }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 rtl:right-3 rtl:left-auto" />
          <Input
            placeholder={language === 'ar' ? 'بحث في الطلبات...' : 'Search applications...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rtl:pr-10"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['all', 'new', 'under_review', 'interviewed', 'offered', 'accepted', 'hired', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => {
                setStatusFilter(status)
                setPage(1)
              }}
              size="sm"
              className={statusFilter === status ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              {language === 'ar' 
                ? (status === 'all' ? 'الكل' : status.replace('_', ' '))
                : (status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '))}
            </Button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              {language === 'ar' ? 'لا توجد طلبات' : 'No applications found'}
            </p>
          </div>
        ) : (
          applications.map((app) => {
            const statusInfo = getStatusColor(app.status)
            
            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {app.applicantId.avatar ? (
                        <img src={app.applicantId.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {app.applicantId.firstName} {app.applicantId.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {language === 'ar' ? 'متقدم لوظيفة:' : 'Applied for:'} {' '}
                        <span className="font-medium text-purple-600">
                          {language === 'ar' ? app.jobId.titleAr || app.jobId.title : app.jobId.title}
                        </span>
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(app.createdAt)}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    <Link href={`/dashboard/job-publisher/applications/${app._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'عرض' : 'View'}
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateStatus(app._id, 'interviewed')}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'مقابلة' : 'Interview'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(app._id, 'rejected')} className="text-red-600">
                          <XCircle className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'رفض' : 'Reject'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            {language === 'ar' ? 'السابق' : 'Previous'}
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            {language === 'ar' ? 'التالي' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  )
}
