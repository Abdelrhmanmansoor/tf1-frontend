'use client'

import { useState, useEffect, useMemo } from 'react'
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
  Bell,
  Activity,
  Flame,
  LineChart,
  ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'
import ProfileSettings from './job-publisher/ProfileSettings'
import MessagingCenter from './job-publisher/MessagingCenter'
import NotificationsCenter from './job-publisher/NotificationsCenter'
import JobsList from './job-publisher/JobsList'
import ApplicationsList from './job-publisher/ApplicationsList'
import NotificationBell from './NotificationBell'

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  draftJobs: number
  closedJobs: number
  totalApplications: number
  newApplications: number
  underReviewApplications: number
  interviewedApplications?: number
  offeredApplications?: number
  acceptedApplications?: number
  rejectedApplications?: number
  hiredApplications?: number
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

interface NotificationItem {
  _id: string
  title: string
  description: string
  createdAt: string
  isRead?: boolean
  type?: string
}

export default function JobPublisherDashboard({ defaultTab = 'overview' }: { defaultTab?: string }) {
  const { language } = useLanguage()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Use the new job-publisher endpoint with /stats
      const response = await api.get('/job-publisher/dashboard/stats')
      if (response.data.success) {
        // Map the new API response structure (support both data.statistics and statistics roots)
        const data = response.data.data?.statistics || response.data.statistics || response.data.data
        if (!data) {
          setStats(null)
          return
        }
        setStats({
          totalJobs: data.jobs?.total || 0,
          activeJobs: data.jobs?.active || 0,
          draftJobs: data.jobs?.draft || 0,
          closedJobs: data.jobs?.closed || 0,
          totalApplications: data.applications?.total || 0,
          newApplications: data.applications?.new || 0,
          underReviewApplications: data.applications?.under_review || 0,
          interviewedApplications: data.applications?.interviewed || 0,
          offeredApplications: data.applications?.offered || 0,
          acceptedApplications: data.applications?.accepted || 0,
          rejectedApplications: data.applications?.rejected || 0,
          hiredApplications: data.applications?.hired || 0,
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

      // Fetch lightweight notifications snapshot for activity stream
      const notifRes = await api.get('/notifications', {
        params: { limit: 6, sort: '-createdAt', isRead: 'all' }
      })
      if (notifRes.data.success) {
        setRecentNotifications(notifRes.data.notifications || [])
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

  const funnelData = useMemo(() => {
    if (!stats) return []
    const total = stats.totalApplications || 0
    const entries: Array<{ key: string; label: string; value: number; tone: string }> = [
      { key: 'new', label: language === 'ar' ? 'جديدة' : 'New', value: stats.newApplications, tone: 'bg-blue-100 text-blue-700' },
      { key: 'under_review', label: language === 'ar' ? 'قيد المراجعة' : 'Review', value: stats.underReviewApplications, tone: 'bg-yellow-100 text-yellow-700' },
      { key: 'interviewed', label: language === 'ar' ? 'مقابلات' : 'Interviewed', value: stats.interviewedApplications || 0, tone: 'bg-purple-100 text-purple-700' },
      { key: 'offered', label: language === 'ar' ? 'عروض' : 'Offered', value: stats.offeredApplications || 0, tone: 'bg-teal-100 text-teal-700' },
      { key: 'accepted', label: language === 'ar' ? 'مقبول' : 'Accepted', value: stats.acceptedApplications || 0, tone: 'bg-emerald-100 text-emerald-700' },
      { key: 'rejected', label: language === 'ar' ? 'مرفوض' : 'Rejected', value: stats.rejectedApplications || 0, tone: 'bg-red-100 text-red-700' },
    ]

    return entries.map((entry) => ({
      ...entry,
      percent: total > 0 ? Math.round((entry.value / total) * 100) : 0,
    }))
  }, [stats, language])

  const acceptanceRate = useMemo(() => {
    if (!stats || !stats.totalApplications) return 0
    const accepted = (stats.acceptedApplications || 0) + (stats.hiredApplications || 0)
    return Math.round((accepted / stats.totalApplications) * 100)
  }, [stats])

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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'لوحة تحكم ناشر الوظائف' : 'Job Publisher Dashboard'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ar' ? 'مؤشرات حية، أداء الوظائف، ومركز الإشعارات الذكي' : 'Live KPIs, job performance, and smart notifications'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700">
                  <ShieldCheck className="w-3 h-3" />
                  {language === 'ar' ? 'متوافق مع الـ API الحالي' : 'Aligned with existing API'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  <Activity className="w-3 h-3" />
                  {language === 'ar' ? 'إحصاءات لحظية' : 'Live insights'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              <NotificationBell userRole="club" />
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
          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: BarChart3 },
              { id: 'jobs', label: language === 'ar' ? 'الوظائف' : 'Jobs', icon: Briefcase },
              { id: 'applications', label: language === 'ar' ? 'الطلبات' : 'Applications', icon: FileText },
              { id: 'messages', label: language === 'ar' ? 'الرسائل' : 'Messages', icon: Users },
              { id: 'notifications', label: language === 'ar' ? 'الإشعارات' : 'Notifications', icon: Clock },
              { id: 'profile', label: language === 'ar' ? 'الملف الشخصي' : 'Profile', icon: Building },
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
            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-700">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{language === 'ar' ? 'مؤشرات الأداء' : 'Performance KPIs'}</p>
                  <p className="font-semibold text-gray-900">{language === 'ar' ? 'تقرير فوري' : 'Realtime snapshot'}</p>
                </div>
                <Link href="/dashboard/job-publisher/applications" className="ml-auto">
                  <Button variant="ghost" size="sm">{language === 'ar' ? 'عرض' : 'Open'}</Button>
                </Link>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
                  <LineChart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{language === 'ar' ? 'نشر سريع' : 'Quick publish'}</p>
                  <p className="font-semibold text-gray-900">{language === 'ar' ? 'ابدأ وظيفة جديدة' : 'Launch a new job'}</p>
                </div>
                <Link href="/dashboard/job-publisher/jobs/new" className="ml-auto">
                  <Button variant="outline" size="sm">{language === 'ar' ? 'جديدة' : 'New'}</Button>
                </Link>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="p-3 rounded-lg bg-amber-100 text-amber-700">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</p>
                  <p className="font-semibold text-gray-900">{language === 'ar' ? 'حالة الوقت الحقيقي' : 'Real-time inbox'}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('notifications')}>{language === 'ar' ? 'المركز' : 'Center'}</Button>
              </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
              >
                <Link href="/dashboard/job-publisher/jobs" className="block h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'إجمالي الوظائف' : 'Total Jobs'}</p>
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                  </div>
                </Link>

                <Link href="/dashboard/job-publisher/jobs?status=active" className="block h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'نشطة' : 'Active'}</p>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
                  </div>
                </Link>

                <Link href="/dashboard/job-publisher/jobs?status=draft" className="block h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'مسودة' : 'Draft'}</p>
                      <FileText className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-600">{stats.draftJobs}</p>
                  </div>
                </Link>

                <Link href="/dashboard/job-publisher/jobs?status=closed" className="block h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'مغلقة' : 'Closed'}</p>
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">{stats.closedJobs}</p>
                  </div>
                </Link>

                <Link href="/dashboard/job-publisher/applications" className="block h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'إجمالي الطلبات' : 'Total Apps'}</p>
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
                  </div>
                </Link>

                <Link href="/dashboard/job-publisher/applications?status=new" className="block h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'جديدة' : 'New'}</p>
                      <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">{stats.newApplications}</p>
                  </div>
                </Link>

                <Link href="/dashboard/job-publisher/applications?status=under_review" className="block h-full">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'قيد المراجعة' : 'Review'}</p>
                      <Eye className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{stats.underReviewApplications}</p>
                  </div>
                </Link>

                {stats.interviewedApplications !== undefined && (
                  <Link href="/dashboard/job-publisher/applications?status=interviewed" className="block h-full">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'مقابلات' : 'Interviewed'}</p>
                        <Users className="w-5 h-5 text-indigo-500" />
                      </div>
                      <p className="text-3xl font-bold text-indigo-600">{stats.interviewedApplications}</p>
                    </div>
                  </Link>
                )}

                {stats.offeredApplications !== undefined && (
                  <Link href="/dashboard/job-publisher/applications?status=offered" className="block h-full">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'عروض' : 'Offered'}</p>
                        <TrendingUp className="w-5 h-5 text-teal-500" />
                      </div>
                      <p className="text-3xl font-bold text-teal-600">{stats.offeredApplications}</p>
                    </div>
                  </Link>
                )}

                {stats.hiredApplications !== undefined && (
                  <Link href="/dashboard/job-publisher/applications?status=hired" className="block h-full">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'تم التوظيف' : 'Hired'}</p>
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-3xl font-bold text-emerald-600">{stats.hiredApplications}</p>
                    </div>
                  </Link>
                )}
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

            {/* Application funnel + performance */}
            {stats && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">{language === 'ar' ? 'مسار الطلبات' : 'Application funnel'}</p>
                      <p className="text-xl font-semibold text-gray-900">{language === 'ar' ? 'تقدّم المرشحين' : 'Candidate progress'}</p>
                    </div>
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="space-y-3">
                    {funnelData.map((stage) => (
                      <div key={stage.key} className="space-y-1">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{stage.label}</span>
                          <span className="font-semibold text-gray-900">{stage.value} · {stage.percent}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${stage.tone}`}
                            style={{ width: `${Math.min(stage.percent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">{language === 'ar' ? 'معدل التحويل' : 'Conversion'}</p>
                      <p className="text-xl font-semibold text-gray-900">{language === 'ar' ? 'قبول/توظيف' : 'Acceptance & hires'}</p>
                    </div>
                    <LineChart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{language === 'ar' ? 'معدل النجاح الإجمالي' : 'Overall success rate'}</p>
                        <p className="text-3xl font-bold text-emerald-600">{acceptanceRate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{language === 'ar' ? 'إجمالي الطلبات' : 'Total applications'}</p>
                        <p className="text-lg font-semibold text-gray-900">{stats.totalApplications}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                        <p className="text-gray-600">{language === 'ar' ? 'مقبول' : 'Accepted'}</p>
                        <p className="text-lg font-semibold text-emerald-700">{stats.acceptedApplications || 0}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                        <p className="text-gray-600">{language === 'ar' ? 'مرفوض' : 'Rejected'}</p>
                        <p className="text-lg font-semibold text-red-700">{stats.rejectedApplications || 0}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                        <p className="text-gray-600">{language === 'ar' ? 'مقابلات' : 'Interviews'}</p>
                        <p className="text-lg font-semibold text-indigo-700">{stats.interviewedApplications || 0}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                        <p className="text-gray-600">{language === 'ar' ? 'عروض' : 'Offers'}</p>
                        <p className="text-lg font-semibold text-teal-700">{stats.offeredApplications || 0}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">{language === 'ar' ? 'نبض النشاط' : 'Activity pulse'}</p>
                      <p className="text-xl font-semibold text-gray-900">{language === 'ar' ? 'إشعارات ورسائل' : 'Notifications & messages'}</p>
                    </div>
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="space-y-3">
                    {recentNotifications.length === 0 ? (
                      <p className="text-sm text-gray-500">{language === 'ar' ? 'لا نشاط حديث' : 'No recent activity'}</p>
                    ) : (
                      recentNotifications.map((notif) => (
                        <div key={notif._id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-purple-200 transition-colors">
                          <span className={`mt-1 w-2 h-2 rounded-full ${notif.isRead ? 'bg-gray-300' : 'bg-purple-500'}`}></span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{notif.title}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{notif.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(notif.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('notifications')} className="w-full">
                      {language === 'ar' ? 'فتح مركز الإشعارات' : 'Open notification center'}
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <ProfileSettings />
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <JobsList />
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <ApplicationsList />
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <MessagingCenter />
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <NotificationsCenter />
          </div>
        )}
      </main>
    </div>
  );
}
