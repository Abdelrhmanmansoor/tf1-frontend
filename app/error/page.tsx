'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const code = searchParams?.get('code') || 'unknown'

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
            <div className="max-w-lg w-full">
                {/* Logo/Icon Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
                        <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        نعمل على حل المشكلة
                    </h1>

                    <p className="text-lg text-gray-600 mb-2">
                        We're working on fixing this issue
                    </p>

                    <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                        نواجه مشكلة تقنية مؤقتة في الخادم. فريقنا يعمل على حلها الآن.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-8">
                    <Link
                        href="/"
                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        العودة للصفحة الرئيسية
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="block w-full text-center bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors duration-200"
                    >
                        إعادة المحاولة
                    </button>
                </div>

                {/* Additional Info */}
                <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2">
                        إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                        Error Code: {code.toUpperCase()}
                    </p>
                </div>
            </div>
        </div>
    )
}
