'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import api from '@/services/api'
import { 
  Briefcase, 
  FileText, 
  Users, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  BarChart3,
  Calendar,
  Building,
  Filter,
  Search
} from 'lucide-react'
import { toast } from 'sonner'

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  draftJobs: number
  closedJobs: number
  totalApplications: number
  newApplications: number
  underReviewApplications: number
}

interface Job {
  _id: string
  title: string
  titleAr?: string
  status: string
  createdAt: string
  applicationDeadline?: string
}

interface Application {
  _id: string
  jobId: {
    _id: string
    title: string
    titleAr?: string
    sport?: string
    category?: string
  }
  applicantId: {
    firstName: string
    lastName: string
    email: string
  }
  status: string
  createdAt: string
}

export default function JobPublisherDashboard() {
  const { language } = useLanguage()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications'>('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Use the new job-publisher endpoint with /stats
      const response = await api.get('/job-publisher/dashboard/stats')
      if (response.data.success) {
        // Map the new API response structure
        const data = response.data.data
        setStats({
          totalJobs: data.jobs?.total || 0,
          activeJobs: data.jobs?.active || 0,
          draftJobs: data.jobs?.draft || 0,
          closedJobs: data.jobs?.closed || 0,
          totalApplications: data.applications?.total || 0,
          newApplications: data.applications?.new || 0,
          underReviewApplications: data.applications?.under_review || 0,
        })
        // Fetch recent jobs and applications separately if needed
        fetchRecentData()
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      toast.error(language === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentData = async () => {
    try {
      // Fetch recent jobs
      const jobsRes = await api.get('/jobs/my-jobs?limit=5&sort=-createdAt')
      if (jobsRes.data.success) {
        setRecentJobs(jobsRes.data.data.jobs || [])
      }
      
      // Fetch recent applications
      const appsRes = await api.get('/job-publisher/applications?limit=5&sort=-createdAt')
      if (appsRes.data.success) {
        setRecentApplications(appsRes.data.data.applications || [])
      }
    } catch (error: any) {
      console.error('Error fetching recent data:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      active: { bg: 'bg-green-50', text: 'text-green-700' },
      draft: { bg: 'bg-gray-50', text: 'text-gray-700' },
      closed: { bg: 'bg-red-50', text: 'text-red-700' },
    }
    return statusMap[status] || { bg: 'bg-gray-50', text: 'text-gray-700' }
  }

  const getApplicationStatusColor = (status: string) => {
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
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isRtl = language === 'ar'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'لوحة تحكم ناشر الوظائف' : 'Job Publisher Dashboard'}
              </h1>
              <p className="text-gray-600 mt-2">
                {language === 'ar' ? 'إدارة الوظائف والطلبات' : 'Manage jobs and applications'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/job-publisher/jobs/new">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إضافة وظيفة جديدة' : 'Post New Job'}
                </Button>
              </Link>
              <Link href="/dashboard/job-publisher/jobs">
                <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'جميع الوظائف' : 'All Jobs'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: BarChart3 },
              { id: 'jobs', label: language === 'ar' ? 'الوظائف' : 'Jobs', icon: Briefcase },
              { id: 'applications', label: language === 'ar' ? 'الطلبات' : 'Applications', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-purple-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'إجمالي الوظائف' : 'Total Jobs'}</p>
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'نشطة' : 'Active'}</p>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'مسودة' : 'Draft'}</p>
                    <FileText className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-600">{stats.draftJobs}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'مغلقة' : 'Closed'}</p>
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-3xl font-bold text-red-600">{stats.closedJobs}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'إجمالي الطلبات' : 'Total Apps'}</p>
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'جديدة' : 'New'}</p>
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">{stats.newApplications}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">{language === 'ar' ? 'قيد المراجعة' : 'Review'}</p>
                    <Eye className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{stats.underReviewApplications}</p>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === 'ar' ? 'آخر الوظائف' : 'Recent Jobs'}
                  </h2>
                  <Link href="/dashboard/job-publisher/jobs">
                    <Button variant="ghost" size="sm">
                      {language === 'ar' ? 'عرض الكل' : 'View All'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentJobs.length > 0 ? (
                    recentJobs.map((job) => {
                      const statusInfo = getStatusColor(job.status)
                      return (
                        <Link
                          key={job._id}
                          href={`/dashboard/job-publisher/jobs/${job._id}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {language === 'ar' ? job.titleAr || job.title : job.title}
                              </h3>
                              <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {formatDate(job.createdAt)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                              {job.status}
                            </span>
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">
                        {language === 'ar' ? 'لا توجد وظائف بعد' : 'No jobs yet'}
                      </p>
                      <Link href="/dashboard/job-publisher/jobs/new">
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'إضافة وظيفة جديدة' : 'Post Your First Job'}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recent Applications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === 'ar' ? 'آخر الطلبات' : 'Recent Applications'}
                  </h2>
                  <Link href="/dashboard/job-publisher/applications">
                    <Button variant="ghost" size="sm">
                      {language === 'ar' ? 'عرض الكل' : 'View All'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentApplications.length > 0 ? (
                    recentApplications.map((app) => {
                      const statusInfo = getApplicationStatusColor(app.status)
                      return (
                        <Link
                          key={app._id}
                          href={`/dashboard/job-publisher/applications/${app._id}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {app.applicantId.firstName} {app.applicantId.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {language === 'ar' ? app.jobId.titleAr || app.jobId.title : app.jobId.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {formatDate(app.createdAt)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                              {app.status}
                            </span>
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        {language === 'ar' ? 'لا توجد طلبات بعد' : 'No applications yet'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'جميع الوظائف' : 'All Jobs'}
              </h2>
              <Link href="/dashboard/job-publisher/jobs">
                <Button className="w-full">
                  {language === 'ar' ? 'عرض جميع الوظائف' : 'View All Jobs'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'جميع الطلبات' : 'All Applications'}
              </h2>
              <Link href="/dashboard/job-publisher/applications">
                <Button className="w-full">
                  {language === 'ar' ? 'عرض جميع الطلبات' : 'View All Applications'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
