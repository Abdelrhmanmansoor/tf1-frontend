'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import SpecialistDashboard from '@/components/dashboards/SpecialistDashboard'

export default function SpecialistDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['specialist']}>
      <SpecialistDashboard />
    </ProtectedRoute>
  )
}
