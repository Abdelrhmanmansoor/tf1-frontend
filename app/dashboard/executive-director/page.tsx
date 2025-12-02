'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import ExecutiveDirectorDashboard from '@/components/dashboards/ExecutiveDirectorDashboard'

export default function ExecutiveDirectorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['executive-director']}>
      <ExecutiveDirectorDashboard />
    </ProtectedRoute>
  )
}
