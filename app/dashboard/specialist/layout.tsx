'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import type { ReactNode } from 'react'

export default function SpecialistDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['specialist']}>
      {children}
    </ProtectedRoute>
  )
}
