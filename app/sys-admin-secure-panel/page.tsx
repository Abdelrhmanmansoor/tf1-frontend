'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SysAdminSecurePanelPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to platform-control page
    router.replace('/platform-control')
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to Platform Control...</p>
      </div>
    </div>
  )
}

