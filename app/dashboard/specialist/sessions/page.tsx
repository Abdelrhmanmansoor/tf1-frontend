'use client'

import { useLanguage } from '@/contexts/language-context'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SessionsPage() {
  const { language } = useLanguage()
  const router = useRouter()

  return (
    <ProtectedRoute allowedRoles={['specialist']}>
      <div className={`min-h-screen bg-gradient-to-br from-green-50 to-blue-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
            >
              {language === 'ar' ? '← رجوع' : 'Back →'}
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-600" />
              {language === 'ar' ? 'عرض الجلسات' : 'View Sessions'}
            </h1>
            <p className="text-gray-600">
              {language === 'ar' ? 'جميع جلساتك المجدولة' : 'All your scheduled sessions'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {language === 'ar' ? 'قريباً - سيتم إضافة إدارة الجلسات قريباً' : 'Coming Soon - Session management will be available soon'}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/specialist')}
              >
                {language === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
