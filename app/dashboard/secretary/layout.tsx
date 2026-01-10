'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import type { ReactNode } from 'react'

export default function SecretaryDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['secretary']}>
      {children}
    </ProtectedRoute>
  )
}
