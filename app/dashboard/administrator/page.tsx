'use client'

import type { ReactNode } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdministratorDashboard from '@/components/dashboards/AdministratorDashboard'

export default function AdministratorDashboardPage(): ReactNode {
  return (
    <ProtectedRoute allowedRoles={['administrator']}>
      <AdministratorDashboard />
    </ProtectedRoute>
  )
}
