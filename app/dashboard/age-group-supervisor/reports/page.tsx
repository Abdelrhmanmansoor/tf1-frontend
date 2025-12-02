'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  ArrowLeft,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  PieChart,
  Activity
} from 'lucide-react'

function ReportsContent() {
  const { language } = useLanguage()
  const router = useRouter()

  const reports = [
    {
      id: 'players',
      icon: Users,
      title: language === 'ar' ? 'تقرير اللاعبين' : 'Players Report',
      description: language === 'ar' ? 'إحصائيات اللاعبين حسب الفئات' : 'Player statistics by age groups',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'attendance',
      icon: Calendar,
      title: language === 'ar' ? 'تقرير الحضور' : 'Attendance Report',
      description: language === 'ar' ? 'نسب الحضور في التدريبات' : 'Training attendance rates',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'performance',
      icon: TrendingUp,
      title: language === 'ar' ? 'تقرير الأداء' : 'Performance Report',
      description: language === 'ar' ? 'تحليل أداء اللاعبين' : 'Player performance analysis',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'registrations',
      icon: Activity,
      title: language === 'ar' ? 'تقرير التسجيلات' : 'Registrations Report',
      description: language === 'ar' ? 'إحصائيات طلبات التسجيل' : 'Registration request statistics',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Statistics'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${report.color} rounded-xl flex items-center justify-center`}>
                  <report.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{report.description}</p>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'عرض التقرير' : 'View Report'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد بيانات كافية' : 'Not Enough Data'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {language === 'ar' 
                ? 'ستظهر الإحصائيات والرسوم البيانية عند توفر بيانات كافية من الفئات واللاعبين'
                : 'Statistics and charts will appear when enough data is available from groups and players'
              }
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <ReportsContent />
    </ProtectedRoute>
  )
}
