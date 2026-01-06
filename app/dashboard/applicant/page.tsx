'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import api from '@/services/api'
import { 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Building,
  User,
  AlertCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

interface DashboardStats {
  totalApplications: number
  pending: number
  underReview: number
  interviewed: number
  offered: number
  accepted: number
  rejected: number
}

interface Application {
  _id: string
  jobId: {
    _id: string
    title: string
    titleAr?: string
    sport?: string
    category?: string
    status?: string
    applicationDeadline?: string
  }
  clubId?: {
    firstName?: string
    lastName?: string
  }
  status: string
  createdAt: string
  updatedAt?: string
}

interface Job {
  _id: string
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  sport?: string
  category?: string
  jobType?: string
  location?: {
    city?: string
    region?: string
  }
  applicationDeadline?: string
  clubId?: {
    firstName?: string
    lastName?: string
  }
  createdAt: string
}

export default function ApplicantDashboardPage() {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'jobs'>('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/applicant/dashboard')
      if (response.data.success) {
        setStats(response.data.data.stats)
        setRecentApplications(response.data.data.recentApplications || [])
        setRecommendedJobs(response.data.data.recommendedJobs || [])
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      toast.error(language === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: any }> = {
      new: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Clock },
      under_review: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Eye },
      interviewed: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Calendar },
      offered: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
      withdrawn: { bg: 'bg-gray-50', text: 'text-gray-700', icon: XCircle },
    }
    return statusMap[status] || { bg: 'bg-gray-50', text: 'text-gray-700', icon: Clock }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      new: { ar: 'جديد', en: 'New' },
      under_review: { ar: 'قيد المراجعة', en: 'Under Review' },
      interviewed: { ar: 'تمت المقابلة', en: 'Interviewed' },
      offered: { ar: 'عرض عمل', en: 'Offered' },
      accepted: { ar: 'مقبول', en: 'Accepted' },
      rejected: { ar: 'مرفوض', en: 'Rejected' },
      withdrawn: { ar: 'ملغي', en: 'Withdrawn' },
    }
    return labels[status] || { ar: status, en: status }
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
      <ProtectedRoute allowedRoles={['applicant']}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['applicant']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === 'ar' ? 'لوحة تحكم الباحث عن وظيفة' : 'Job Seeker Dashboard'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {language === 'ar' ? 'إدارة طلباتك ومتابعة الفرص المناسبة' : 'Manage your applications and track opportunities'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/jobs">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700">
                    <Search className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'استكشاف الوظائف' : 'Explore Jobs'}
                  </Button>
                </Link>
                <Link href="/dashboard/applicant/applications">
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                    <FileText className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'طلباتي' : 'My Applications'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              {[
                { id: 'overview', label: language === 'ar' ? 'نظرة عامة' : 'Overview', icon: BarChart3 },
                { id: 'applications', label: language === 'ar' ? 'طلباتي' : 'My Applications', icon: FileText },
                { id: 'jobs', label: language === 'ar' ? 'وظائف موصى بها' : 'Recommended Jobs', icon: Briefcase },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-blue-600'
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
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'إجمالي الطلبات' : 'Total'}</p>
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'جديدة' : 'New'}</p>
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'قيد المراجعة' : 'Review'}</p>
                      <Eye className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">{stats.underReview}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'مقابلة' : 'Interview'}</p>
                      <Calendar className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{stats.interviewed}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'عروض' : 'Offered'}</p>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats.offered}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'مقبول' : 'Accepted'}</p>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-700">{stats.accepted}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{language === 'ar' ? 'مرفوض' : 'Rejected'}</p>
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Applications */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {language === 'ar' ? 'آخر طلبات التقديم' : 'Recent Applications'}
                    </h2>
                    <Link href="/dashboard/applicant/applications">
                      <Button variant="ghost" size="sm">
                        {language === 'ar' ? 'عرض الكل' : 'View All'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentApplications.length > 0 ? (
                      recentApplications.map((app) => {
                        const statusInfo = getStatusColor(app.status)
                        const StatusIcon = statusInfo.icon
                        const statusLabel = getStatusLabel(app.status)
                        return (
                          <Link
                            key={app._id}
                            href={`/dashboard/applicant/applications/${app._id}`}
                            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {language === 'ar' ? app.jobId.titleAr || app.jobId.title : app.jobId.title}
                                </h3>
                                {app.clubId && (
                                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    {app.clubId.firstName} {app.clubId.lastName}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(app.createdAt)}
                                </p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.bg} ${statusInfo.text}`}>
                                <StatusIcon className="w-3 h-3" />
                                {language === 'ar' ? statusLabel.ar : statusLabel.en}
                              </div>
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
                        <Link href="/jobs">
                          <Button variant="outline" size="sm" className="mt-4">
                            {language === 'ar' ? 'استكشف الوظائف' : 'Explore Jobs'}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Recommended Jobs */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {language === 'ar' ? 'وظائف موصى بها' : 'Recommended Jobs'}
                    </h2>
                    <Link href="/jobs">
                      <Button variant="ghost" size="sm">
                        {language === 'ar' ? 'عرض الكل' : 'View All'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recommendedJobs.length > 0 ? (
                      recommendedJobs.map((job) => (
                        <Link
                          key={job._id}
                          href={`/jobs/${job._id}`}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                        >
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {language === 'ar' ? job.titleAr || job.title : job.title}
                          </h3>
                          {job.clubId && (
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {job.clubId.firstName} {job.clubId.lastName}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {job.location?.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location.city}
                              </span>
                            )}
                            {job.applicationDeadline && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(job.applicationDeadline)}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          {language === 'ar' ? 'لا توجد وظائف موصى بها حالياً' : 'No recommended jobs at the moment'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === 'ar' ? 'جميع طلبات التقديم' : 'All Applications'}
                </h2>
                <Link href="/dashboard/applicant/applications">
                  <Button className="w-full">
                    {language === 'ar' ? 'عرض جميع الطلبات' : 'View All Applications'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === 'ar' ? 'الوظائف المتاحة' : 'Available Jobs'}
                </h2>
                <Link href="/jobs">
                  <Button className="w-full">
                    {language === 'ar' ? 'استكشف جميع الوظائف' : 'Explore All Jobs'}
                    <Search className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
