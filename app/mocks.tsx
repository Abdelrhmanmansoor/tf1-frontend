'use client'

import { useEffect } from 'react'

export function MSWProvider() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true'
    ) {
      import('@/lib/msw/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass',
        })
      })
    }
  }, [])

  return null
}