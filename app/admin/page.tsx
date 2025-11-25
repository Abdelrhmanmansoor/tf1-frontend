'use client'

import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Settings } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar activeMode="application" />
      
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {language === 'ar' ? 'لوحة التحكم قيد الصيانة' : 'Admin Panel Under Maintenance'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {language === 'ar' 
              ? 'نعمل على تحسين لوحة التحكم. ستكون متاحة قريباً.'
              : 'We are improving the admin panel. It will be available soon.'}
          </p>
          
          <Link href="/">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
