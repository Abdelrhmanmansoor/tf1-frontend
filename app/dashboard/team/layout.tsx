'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import type { ReactNode } from 'react'

export default function TeamDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['team']}>
      {children}
    </ProtectedRoute>
  )
}
