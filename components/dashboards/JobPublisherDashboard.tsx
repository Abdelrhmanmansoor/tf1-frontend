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
import InterviewsList from './job-publisher/InterviewsList'
import AutomationRulesList from './job-publisher/AutomationRulesList'
import SubscriptionDashboard from './job-publisher/SubscriptionDashboard'

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header - Clean professional design */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {language === 'ar' ? 'إدارة الوظائف والمقابلات' : 'Manage jobs and interviews'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell userRole="club" />
              <Link href="/dashboard/job-publisher/jobs/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'وظيفة جديدة' : 'New Job'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs - LinkedIn style */}
          <div className="flex gap-6 mt-4 border-b border-gray-200">
            {[
              { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: BarChart3 },
              { id: 'jobs', label: language === 'ar' ? 'الوظائف' : 'Jobs', icon: Briefcase },
              { id: 'applications', label: language === 'ar' ? 'الطلبات' : 'Applications', icon: FileText },
              { id: 'interviews', label: language === 'ar' ? 'المقابلات' : 'Interviews', icon: Calendar },
              { id: 'messages', label: language === 'ar' ? 'الرسائل' : 'Messages', icon: Users },
              { id: 'automation', label: language === 'ar' ? 'الأتمتة' : 'Automation', icon: Activity },
              { id: 'subscription', label: language === 'ar' ? 'الباقة' : 'Subscription', icon: TrendingUp },
              { id: 'profile', label: language === 'ar' ? 'الإعدادات' : 'Settings', icon: Building },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
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

            {/* Statistics Cards - Clean professional design */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'الوظائف' : 'Jobs'}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</p>
                      <p className="text-xs text-gray-500 mt-1">{stats.activeJobs} {language === 'ar' ? 'نشطة' : 'active'}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'الطلبات' : 'Applications'}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalApplications}</p>
                      <p className="text-xs text-gray-500 mt-1">{stats.newApplications} {language === 'ar' ? 'جديدة' : 'new'}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'المقابلات' : 'Interviews'}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.interviewedApplications || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'مجدولة' : 'scheduled'}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{language === 'ar' ? 'التوظيفات' : 'Hired'}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.hiredApplications || 0}</p>
                      <p className="text-xs text-green-600 mt-1">{acceptanceRate}% {language === 'ar' ? 'معدل النجاح' : 'success rate'}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
              
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
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
              
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
              </div>
            </div>

            {/* Application funnel - Clean design */}
            {stats && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
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
              </div>
            )}

            {/* Conversion Stats */}
            {stats && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
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
              </div>
            )}

            {/* Activity Pulse */}
            {stats && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
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

        {/* Interviews Tab - NEW */}
        {activeTab === 'interviews' && <InterviewsList />}

        {/* Automation Tab - NEW */}
        {activeTab === 'automation' && <AutomationRulesList />}

        {/* Subscription Tab - NEW */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {language === 'ar' ? 'باقتي الحالية' : 'Current Plan'}
              </h2>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium mb-1">{language === 'ar' ? 'الباقة الحالية' : 'Current Plan'}</p>
                    <h3 className="text-3xl font-bold text-blue-900">Free</h3>
                    <p className="text-sm text-blue-700 mt-2">
                      {language === 'ar' ? '5 مقابلات شهرياً' : '5 interviews per month'}
                    </p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    {language === 'ar' ? 'ترقية الباقة' : 'Upgrade Plan'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Plan */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">Basic</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-4">299 <span className="text-sm font-normal text-gray-500">{language === 'ar' ? 'ريال/شهر' : 'SAR/month'}</span></p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      20 {language === 'ar' ? 'مقابلة/شهر' : 'interviews/month'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {language === 'ar' ? 'أتمتة المقابلات' : 'Interview automation'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {language === 'ar' ? '5 قواعد أتمتة' : '5 automation rules'}
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">{language === 'ar' ? 'اختيار' : 'Select'}</Button>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-blue-600 rounded-lg p-5 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pro</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-4">999 <span className="text-sm font-normal text-gray-500">{language === 'ar' ? 'ريال/شهر' : 'SAR/month'}</span></p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      100 {language === 'ar' ? 'مقابلة/شهر' : 'interviews/month'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {language === 'ar' ? '50 قاعدة أتمتة' : '50 automation rules'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {language === 'ar' ? 'تحليلات متقدمة' : 'Advanced analytics'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {language === 'ar' ? 'إشعارات SMS' : 'SMS notifications'}
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">{language === 'ar' ? 'ترقية' : 'Upgrade'}</Button>
                </div>

                {/* Enterprise Plan */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">Enterprise</h4>
                  <p className="text-2xl font-bold text-gray-900 mb-4">{language === 'ar' ? 'مخصص' : 'Custom'}</p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {language === 'ar' ? 'مقابلات غير محدودة' : 'Unlimited interviews'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {language === 'ar' ? 'أتمتة متقدمة' : 'Advanced automation'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {language === 'ar' ? 'مدير حساب مخصص' : 'Dedicated manager'}
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">{language === 'ar' ? 'اتصل بنا' : 'Contact Sales'}</Button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'نشطة' : 'Active'}</p>
                  <p className="text-xl font-semibold text-green-600">{stats.activeJobs}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'قيد المراجعة' : 'In Review'}</p>
                  <p className="text-xl font-semibold text-yellow-600">{stats.underReviewApplications}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'عروض' : 'Offered'}</p>
                  <p className="text-xl font-semibold text-blue-600">{stats.offeredApplications || 0}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'مرفوضة' : 'Rejected'}</p>
                  <p className="text-xl font-semibold text-red-600">{stats.rejectedApplications || 0}</p>
                </div>
              </div>
            )}
          </div>
        )}
