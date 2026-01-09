'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useSearchParams } from 'next/navigation'
import api from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  Briefcase
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

interface Job {
  _id: string
  title: string
  titleAr?: string
  status: string
  createdAt: string
  applicationDeadline?: string
  applicationsCount?: number
  views?: number
}

export default function JobsList() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchJobs()
  }, [page, statusFilter, searchTerm])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      let url = `/jobs/my-jobs?page=${page}&limit=10&sort=-createdAt`
      
      if (statusFilter && statusFilter !== 'all') {
        url += `&status=${statusFilter}`
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`
      }

      const response = await api.get(url)
      if (response.data.success) {
        setJobs(response.data.data.jobs)
        setTotalPages(response.data.data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error(language === 'ar' ? 'فشل تحميل الوظائف' : 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الوظيفة؟' : 'Are you sure you want to delete this job?')) {
      return
    }

    try {
      await api.delete(`/jobs/${id}`)
      toast.success(language === 'ar' ? 'تم حذف الوظيفة بنجاح' : 'Job deleted successfully')
      fetchJobs()
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل حذف الوظيفة' : 'Failed to delete job')
    }
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: any }> = {
      active: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
      draft: { bg: 'bg-gray-50', text: 'text-gray-700', icon: FileText },
      closed: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
    }
    return statusMap[status] || { bg: 'bg-gray-50', text: 'text-gray-700', icon: FileText }
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
            placeholder={language === 'ar' ? 'بحث عن وظيفة...' : 'Search jobs...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rtl:pr-10"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['all', 'active', 'draft', 'closed'].map((status) => (
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
                ? (status === 'all' ? 'الكل' : status === 'active' ? 'نشطة' : status === 'draft' ? 'مسودة' : 'مغلقة')
                : (status.charAt(0).toUpperCase() + status.slice(1))}
            </Button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              {language === 'ar' ? 'لا توجد وظائف' : 'No jobs found'}
            </p>
            <Link href="/dashboard/job-publisher/jobs/new">
              <Button>
                {language === 'ar' ? 'إضافة وظيفة جديدة' : 'Post New Job'}
              </Button>
            </Link>
          </div>
        ) : (
          jobs.map((job) => {
            const statusInfo = getStatusColor(job.status)
            const StatusIcon = statusInfo.icon
            
            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {language === 'ar' ? job.titleAr || job.title : job.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.bg} ${statusInfo.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {language === 'ar' 
                          ? (job.status === 'active' ? 'نشطة' : job.status === 'draft' ? 'مسودة' : 'مغلقة')
                          : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>
                          {job.applicationsCount || 0} {language === 'ar' ? 'طلب' : 'Applications'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>
                          {job.views || 0} {language === 'ar' ? 'مشاهدة' : 'Views'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/job-publisher/jobs/${job._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'تعديل' : 'Edit'}
                      </Button>
                    </Link>
                    
                    <Link href={`/dashboard/job-publisher/applications?jobId=${job._id}`}>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'الطلبات' : 'Applications'}
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(job._id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'حذف' : 'Delete'}
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
