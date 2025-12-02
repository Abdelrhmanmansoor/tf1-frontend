'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import AgeGroupSupervisorDashboard from '@/components/dashboards/AgeGroupSupervisorDashboard'

export default function AgeGroupSupervisorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <AgeGroupSupervisorDashboard />
    </ProtectedRoute>
  )
}
