'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    })

    // Optionally log to error tracking service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // You can add error tracking here (e.g., Sentry)
      // Sentry.captureException(error, { extra: errorInfo })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

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

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-right">
                <p className="text-sm text-red-800 font-mono break-all mb-2">
                  <strong>الخطأ:</strong> {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-red-600 mt-2 text-right">
                    <summary className="cursor-pointer mb-2">تفاصيل الخطأ</summary>
                    <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto max-h-40 text-left">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleReset}
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
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

