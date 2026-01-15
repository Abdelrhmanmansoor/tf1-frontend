'use client'

import { useSearchParams } from 'next/navigation'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const code = searchParams?.get('code') || 'unknown'

    const errorMessages: Record<string, {
        ar: string
        en: string
        details_ar: string
        details_en: string
        action_ar?: string
        action_en?: string
    }> = {
        server_misconfigured: {
            ar: 'خطأ في إعدادات السيرفر',
            en: 'Server Configuration Error',
            details_ar: 'نعتذر، يوجد خطأ في إعدادات السيرفر. فريق الدعم تم إخطاره تلقائياً وسيتم حل المشكلة قريباً.',
            details_en: 'Sorry, there is a server configuration error. The support team has been notified automatically and will resolve this issue soon.',
            action_ar: 'يرجى المحاولة مرة أخرى بعد بضع دقائق',
            action_en: 'Please try again in a few minutes'
        },
        unknown: {
            ar: 'حدث خطأ غير متوقع',
            en: 'An Unexpected Error Occurred',
            details_ar: 'نعتذر عن هذا الإزعاج. يرجى المحاولة مرة أخرى.',
            details_en: 'We apologize for the inconvenience. Please try again.',
        }
    }

    const error = errorMessages[code] || errorMessages.unknown

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {error.ar}
                </h1>
                <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                    {error.en}
                </h2>

                {/* Details */}
                <div className="mb-6 space-y-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {error.details_ar}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed">
                        {error.details_en}
                    </p>
                </div>

                {/* Action Message */}
                {error.action_ar && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-800 dark:text-blue-300 text-sm font-medium mb-1">
                            {error.action_ar}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 text-xs">
                            {error.action_en}
                        </p>
                    </div>
                )}

                {/* Error Code */}
                <div className="mb-6 text-xs text-gray-400 dark:text-gray-600 font-mono">
                    Error Code: {code.toUpperCase()}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        <Home className="w-4 h-4" />
                        <span>العودة للرئيسية / Home</span>
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>إعادة المحاولة / Retry</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
