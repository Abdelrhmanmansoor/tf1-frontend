'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import JobPublisherDashboard from '@/components/dashboards/JobPublisherDashboard'

export default function JobPublisherDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['job-publisher']}>
      <JobPublisherDashboard />
    </ProtectedRoute>
  )
}

