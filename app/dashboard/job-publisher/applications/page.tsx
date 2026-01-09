'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import JobPublisherDashboard from '@/components/dashboards/JobPublisherDashboard'

export default function JobPublisherApplicationsPage() {
  return (
    <ProtectedRoute allowedRoles={['job-publisher']}>
      <JobPublisherDashboard defaultTab="applications" />
    </ProtectedRoute>
  )
}
