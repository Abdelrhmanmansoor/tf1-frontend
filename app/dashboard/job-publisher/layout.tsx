'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import type { ReactNode } from 'react'

export default function JobPublisherDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['job-publisher']}>
      {children}
    </ProtectedRoute>
  )
}
