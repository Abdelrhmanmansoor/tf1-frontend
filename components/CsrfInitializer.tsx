'use client'

import { useEffect } from 'react'
import { initializeCsrfToken } from '@/services/api'

/**
 * Component to initialize CSRF token on app startup
 * This ensures the token is ready before any POST requests
 */
export function CsrfInitializer() {
  useEffect(() => {
    // Initialize CSRF token when app loads
    initializeCsrfToken().catch(error => {
      console.warn('[CSRF] Failed to initialize token on startup:', error)
    })
  }, [])

  return null // This component doesn't render anything
}
