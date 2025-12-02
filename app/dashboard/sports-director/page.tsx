'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import SportsDirectorDashboard from '@/components/dashboards/SportsDirectorDashboard'

export default function SportsDirectorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['sports-director']}>
      <SportsDirectorDashboard />
    </ProtectedRoute>
  )
}
