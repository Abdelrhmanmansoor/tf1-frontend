'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TestAdminPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (credentials.username === 'admin' && credentials.password === 'admin') {
      // Store a temporary test auth flag
      if (typeof window !== 'undefined') {
        localStorage.setItem('testMode', 'true')
      }
      router.push('/test-dashboards')
    } else {
      setError(
        language === 'ar'
          ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
          : 'Invalid credentials'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-green-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.3,
            }}
          >
            <div className="w-6 h-6 bg-white/10 rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="text-4xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔧
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'وضع الاختبار' : 'Testing Mode'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'أدخل بيانات الاعتماد للوصول إلى لوحات المعاينة'
                  : 'Enter credentials to access dashboard previews'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                    placeholder={
                      language === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'
                    }
                    className="h-12 pl-12 pr-4"
                  />
                  <User className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ar' ? 'تلميح: admin' : 'Hint: admin'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    placeholder={
                      language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'
                    }
                    className="h-12 pl-12 pr-4"
                  />
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ar' ? 'تلميح: admin' : 'Hint: admin'}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {language === 'ar' ? 'متابعة' : 'Proceed'}
              </Button>
            </form>

            {/* Back to Login */}
            <motion.div
              className="text-center mt-6 pt-6 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
