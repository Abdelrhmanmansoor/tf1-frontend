'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardAdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">جاري التحويل... / Redirecting to admin dashboard...</p>
    </div>
  )
}
