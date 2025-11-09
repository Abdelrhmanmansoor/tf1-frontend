'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// FRONTEND ONLY - Redirect to dashboard
export default function VerifyEmailPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return <div>Redirecting to dashboard...</div>
}
