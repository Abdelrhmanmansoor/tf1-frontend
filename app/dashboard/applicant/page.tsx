'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import NotificationBell from '@/components/dashboards/NotificationBell'
import { useAuth } from '@/contexts/auth-context'
import { Briefcase, FileText, Bell, ListChecks, Sparkles, User, Loader2 } from 'lucide-react'

export default function ApplicantDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['applicant']}>
      <ApplicantDashboardContent />
    </ProtectedRoute>
  )
}

function ApplicantDashboardContent() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [jobsCount, setJobsCount] = useState(0)
  const [applicationsCount, setApplicationsCount] = useState(0)
  const [latestApplications, setLatestApplications] = useState<any[]>([])
  const [latestNotifications, setLatestNotifications] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL

        // Jobs count
        const jobsRes = await fetch(`${apiUrl}/search/jobs`)
        const jobsData = await jobsRes.json()
        const jobs = jobsData.results || jobsData.jobs || []
        setJobsCount(Array.isArray(jobs) ? jobs.length : 0)

        // My applications
        const appsRes = await fetch(`${apiUrl}/applications/my-applications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })
        const appsData = await appsRes.json()
        const apps = appsData.applications || []
        setApplicationsCount(Array.isArray(apps) ? apps.length : 0)
        setLatestApplications(apps.slice(0, 5))

        // Latest notifications (if endpoint exists)
        const notiRes = await fetch(`${apiUrl}/notifications?limit=5`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })
        if (notiRes.ok) {
          const nData = await notiRes.json()
          setLatestNotifications(nData.notifications || [])
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'لوحة الباحث عن وظيفة' : 'Job Seeker Dashboard'}
          </h1>
          <NotificationBell userRole="applicant" />
        </div>
      </div>

      {/* Email verification banner */}
      {user && user.isVerified === false && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                {language === 'ar' ? 'حسابك غير مفعل — يرجى تفعيل البريد الإلكتروني' : 'Your account is not verified — please verify your email'}
              </div>
              <Link href="/auth/verify-email">
                <Button variant="outline" size="sm" className="border-yellow-300">
                  {language === 'ar' ? 'تفعيل الآن' : 'Verify Now'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Available Jobs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{jobsCount}</div>
                <div className="text-sm text-gray-600">{language === 'ar' ? 'وظائف متاحة' : 'Available Jobs'}</div>
              </div>
            </div>
          </motion.div>
          {/* Applications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{applicationsCount}</div>
                <div className="text-sm text-gray-600">{language === 'ar' ? 'طلباتي' : 'My Applications'}</div>
              </div>
            </div>
          </motion.div>
          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{latestNotifications.length}</div>
                <div className="text-sm text-gray-600">{language === 'ar' ? 'آخر إشعارات' : 'Latest Notifications'}</div>
              </div>
            </div>
          </motion.div>
          {/* Smart Suggestions placeholder (UI only) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <div>
                <div className="text-2xl font-bold">AI</div>
                <div className="text-sm text-gray-600">{language === 'ar' ? 'توصيات ذكية' : 'Smart Suggestions'}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/browse-jobs">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-900">{language === 'ar' ? 'تصفح الوظائف' : 'Browse Jobs'}</h3>
              </div>
              <p className="text-gray-600 text-sm">{language === 'ar' ? 'استكشف الفرص وتقدم فورًا' : 'Explore opportunities and apply'}</p>
            </div>
          </Link>

          <Link href="/dashboard/applicant/applications">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <ListChecks className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-gray-900">{language === 'ar' ? 'تتبع الطلبات' : 'Track Applications'}</h3>
              </div>
              <p className="text-gray-600 text-sm">{language === 'ar' ? 'شاهد الحالات لحظيًا' : 'See real-time status updates'}</p>
            </div>
          </Link>

          <Link href="/jobs/cv-builder">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-gray-900">{language === 'ar' ? 'باني السيرة الذاتية' : 'CV Builder'}</h3>
              </div>
              <p className="text-gray-600 text-sm">{language === 'ar' ? 'أنشئ سيرة ذاتية احترافية' : 'Create a professional CV'}</p>
            </div>
          </Link>
        </div>

        {/* Latest Applications List */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">{language === 'ar' ? 'آخر الطلبات' : 'Latest Applications'}</h3>
            <Link href="/dashboard/applicant/applications">
              <Button variant="outline" size="sm">{language === 'ar' ? 'عرض الكل' : 'View All'}</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {latestApplications.length === 0 ? (
              <p className="text-gray-600 text-sm">{language === 'ar' ? 'لا توجد طلبات حتى الآن' : 'No applications yet'}</p>
            ) : latestApplications.map((app: any) => (
              <div key={app._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
                <div className="font-medium text-gray-900">
                  {language === 'ar' ? app.jobId?.titleAr || app.jobId?.title : app.jobId?.title}
                </div>
                <div className="text-sm text-gray-600">{new Date(app.updatedAt || app.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
