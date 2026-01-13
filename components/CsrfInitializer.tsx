'use client'

import { useEffect, useState } from 'react'
import { initializeCsrfToken } from '@/services/api'

/**
 * Component to initialize CSRF token on app startup
 * This ensures the token is ready before any POST requests
 * 
 * CRITICAL: This must be mounted early in the app tree (in layout.tsx)
 * to ensure CSRF token is ready before any user interactions
 */
export function CsrfInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        console.log('[CSRF Init] 🚀 Starting CSRF protection initialization...')
        await initializeCsrfToken()
        
        if (mounted) {
          setInitialized(true)
          console.log('[CSRF Init] ✅ CSRF protection ready')
        }
      } catch (error) {
        console.error('[CSRF Init] ❌ Initialization failed:', error)
        if (mounted) {
          setInitialized(false)
        }
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [])

  // This component doesn't render anything visible
  // But we track initialization state for debugging
  if (typeof window !== 'undefined' && initialized) {
    // Store initialization state globally for debugging
    ;(window as any).__csrfInitialized = true
  }

  return null
}
