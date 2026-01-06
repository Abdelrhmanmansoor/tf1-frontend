'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Briefcase } from 'lucide-react'

export default function ApplicantDashboardPage() {
  const { language } = useLanguage()

  return (
    <ProtectedRoute allowedRoles={['applicant']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === 'ar' ? 'مرحبًا بك في لوحة تحكم الباحث عن وظيفة 👋' : 'Welcome to the Job Seeker Dashboard 👋'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {language === 'ar' ? 'إدارة طلباتك ومتابعة الفرص المناسبة لك' : 'Manage your applications and follow suitable opportunities'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/jobs">
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <Briefcase className="w-4 h-4 mr-2" />
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
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'ar' ? 'آخر الفرص المناسبة لك' : 'Latest opportunities for you'}
                </h2>
                <p className="text-gray-600">
                  {language === 'ar' ? 'سيتم عرض الوظائف الموصى بها لك هنا قريبًا.' : 'Recommended jobs will show up here soon.'}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'ar' ? 'نصائح سريعة' : 'Quick Tips'}
                </h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>{language === 'ar' ? 'حدّث سيرتك الذاتية بانتظام' : 'Keep your resume updated'}</li>
                  <li>{language === 'ar' ? 'تابع الإشعارات للتحديثات' : 'Check notifications for updates'}</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

