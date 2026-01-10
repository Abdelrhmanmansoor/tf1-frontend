'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import SportsAdminSidebar from '@/components/dashboards/SportsAdminSidebar'
import type { ReactNode } from 'react'

export default function SportsAdminLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['sports-administrator']}>
            <div className="flex min-h-screen bg-slate-50">
                <SportsAdminSidebar />
                <main className="flex-1 p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    )
}
