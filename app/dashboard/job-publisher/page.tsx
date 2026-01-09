'use client'

import { useSearchParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import JobPublisherDashboard from '@/components/dashboards/JobPublisherDashboard'

export default function JobPublisherDashboardPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('defaultTab') || 'overview'

  return (
    <ProtectedRoute allowedRoles={['job-publisher']}>
      <JobPublisherDashboard defaultTab={defaultTab} />
    </ProtectedRoute>
  )
}

