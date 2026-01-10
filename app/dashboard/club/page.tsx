'use client'

import { useLanguage } from '@/contexts/language-context'
import ClubDashboard from '@/components/dashboards/ClubDashboard'

export default function ClubDashboardPage() {
  const { language } = useLanguage()

  return (
    <div
      className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <ClubDashboard />
    </div>
  )
}
