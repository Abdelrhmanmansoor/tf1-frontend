'use client'

import { useEffect, useState } from 'react'
import { isCsrfReady, refreshCsrfToken } from '@/services/api'

/**
 * Debug panel for CSRF token status
 * Only shows in development mode
 * 
 * Usage: Add <CsrfDebugPanel /> to your layout (only in development)
 */
export function CsrfDebugPanel() {
  const [isReady, setIsReady] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    // Check CSRF status every 2 seconds
    const interval = setInterval(() => {
      setIsReady(isCsrfReady())
    }, 2000)

    // Initial check
    setIsReady(isCsrfReady())

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const success = await refreshCsrfToken()
      setIsReady(success)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-full text-xs shadow-lg hover:bg-gray-700 z-50"
        title="CSRF Debug Panel"
      >
        🔒 CSRF
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4 z-50 min-w-[250px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">CSRF Debug Panel</h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Status:</span>
          <span className={`font-semibold ${isReady ? 'text-green-600' : 'text-red-600'}`}>
            {isReady ? '✅ Ready' : '❌ Not Ready'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Token:</span>
          <span className={`text-xs ${isReady ? 'text-green-600' : 'text-gray-400'}`}>
            {isReady ? 'Cached' : 'Missing'}
          </span>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full mt-2 bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh Token'}
        </button>

        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
          <p>Open console for detailed logs</p>
        </div>
      </div>
    </div>
  )
}
