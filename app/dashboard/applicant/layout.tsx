'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import type { ReactNode } from 'react'

export default function ApplicantDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['applicant']}>
      {children}
    </ProtectedRoute>
  )
}
