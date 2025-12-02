'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import SecretaryDashboard from '@/components/dashboards/SecretaryDashboard'

export default function SecretaryDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['secretary']}>
      <SecretaryDashboard />
    </ProtectedRoute>
  )
}
