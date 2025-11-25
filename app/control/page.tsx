'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ControlRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-600">...</p>
    </div>
  )
}
