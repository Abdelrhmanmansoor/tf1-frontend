'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import authService from '@/services/auth'
import { getDashboardRoute } from '@/utils/role-routes'

// FRONTEND ONLY - Redirect to dashboard
export default function VerifyEmailPage() {
  const router = useRouter()

  useEffect(() => {
    const user = authService.getCurrentUser()
    const role = (user && (user as any).role) || 'player'
    const route = getDashboardRoute(role as any)
    router.push(route)
  }, [router])

  return <div>Redirecting to dashboard...</div>
}
