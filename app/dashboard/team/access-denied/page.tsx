'use client'

import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ShieldX, Home, ArrowLeft, Mail } from 'lucide-react'

export default function TeamAccessDeniedPage() {
  const { language } = useLanguage()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex items-center justify-center p-4">
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
            ? 'ليس لديك صلاحية للوصول إلى هذا القسم. تواصل مع مدير النظام لطلب الصلاحية.'
            : 'You do not have permission to access this section. Please contact your system administrator to request access.'
          }
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">
            {language === 'ar'
              ? 'هذه الصفحة تتطلب صلاحيات خاصة لم يتم منحها لحسابك.'
              : 'This page requires specific permissions that have not been granted to your account.'
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push('/dashboard/team')}
            className="flex-1 bg-gradient-to-r from-slate-600 to-gray-700 text-white"
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

        <Button
          variant="ghost"
          className="mt-4 text-gray-500"
          onClick={() => window.location.href = 'mailto:admin@tf1.com'}
        >
          <Mail className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'تواصل مع المسؤول' : 'Contact Administrator'}
        </Button>
      </motion.div>
    </div>
  )
}
