'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import type { ReactNode } from 'react'

export default function AgeGroupSupervisorDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      {children}
    </ProtectedRoute>
  )
}
