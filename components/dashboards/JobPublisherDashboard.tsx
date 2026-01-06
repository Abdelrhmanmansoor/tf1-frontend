'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Briefcase, 
  FileText, 
  Users, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import api from '@/services/api'

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
  status: string
  createdAt: string
}

interface Application {
  _id: string
  jobId: {
    _id: string
    title: string
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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/job-publisher/dashboard')
      if (response.data.success) {
        setStats(response.data.data.stats)
        setRecentJobs(response.data.data.recentJobs || [])
        setRecentApplications(response.data.data.recentApplications || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'closed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'interviewed':
        return 'bg-purple-100 text-purple-800'
      case 'offered':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'لوحة تحكم ناشر الوظائف 📢' : 'Job Publisher Dashboard 📢'}
              </h1>
              <p className="text-gray-600 mt-2">
                {language === 'ar' ? 'إدارة الوظائف والطلبات' : 'Manage jobs and applications'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/job-publisher/jobs/new">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ar' ? 'إجمالي الوظائف' : 'Total Jobs'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
                <Briefcase className="w-10 h-10 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ar' ? 'وظائف نشطة' : 'Active Jobs'}
                  </p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ar' ? 'إجمالي الطلبات' : 'Total Applications'}
                  </p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
                </div>
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ar' ? 'طلبات جديدة' : 'New Applications'}
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.newApplications}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <div key={job._id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {language === 'ar' ? 'لا توجد وظائف بعد' : 'No jobs yet'}
                </p>
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
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <div key={app._id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {app.applicantId.firstName} {app.applicantId.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {app.jobId.title}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {language === 'ar' ? 'لا توجد طلبات بعد' : 'No applications yet'}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

