'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import AdministratorDashboard from '@/components/dashboards/AdministratorDashboard'

export default function AdministratorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['administrator']}>
      <AdministratorDashboard />
    </ProtectedRoute>
  )
}
