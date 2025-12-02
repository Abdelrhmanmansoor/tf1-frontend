'use client'

import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

export default function LeaderAccessDeniedPage() {
  const { language } = useLanguage()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ShieldX className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {language === 'ar' ? 'الوصول مرفوض' : 'Access Denied'}
        </h1>

        <p className="text-gray-600 mb-6">
          {language === 'ar'
            ? 'هذه الصفحة تتطلب صلاحيات القائد (Leader).'
            : 'This page requires Leader permissions.'
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push('/dashboard/leader')}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'رجوع' : 'Go Back'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
