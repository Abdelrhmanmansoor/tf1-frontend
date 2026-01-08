'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error)
    
    // Optionally log to error tracking service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // You can add error tracking here (e.g., Sentry)
      // Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 p-4" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          حدث خطأ غير متوقع
        </h1>

        <p className="text-lg text-gray-600 mb-2">
          عذراً، حدث خطأ أثناء تحميل الصفحة
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-right">
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

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            إذا استمرت المشكلة، يرجى{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              الاتصال بالدعم
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

