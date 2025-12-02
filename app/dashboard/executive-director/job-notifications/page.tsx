'use client'

import React from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { JobNotificationsModule } from '@/components/job-notifications/JobNotificationsModule'

export default function JobNotificationsPage() {
  return (
    <ProtectedRoute allowedRoles={['executive-director']}>
      <JobNotificationsContent />
    </ProtectedRoute>
  )
}

function JobNotificationsContent() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/executive-director">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إشعارات الوظائف' : 'Job Notifications'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobNotificationsModule dashboardType="executive-director" maxItems={50} />
      </main>
    </div>
  )
}
