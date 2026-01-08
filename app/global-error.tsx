'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              خطأ في التطبيق
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة أو المحاولة لاحقاً.
            </p>

            {process.env.NODE_ENV === 'development' && error.message && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-right mb-6">
                <p className="text-sm text-red-800 font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-600 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            <Button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/'
                }
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة تحميل الصفحة
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}

