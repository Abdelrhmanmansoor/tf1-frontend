'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import ProtectedRoute from '@/components/ProtectedRoute'
import { toast } from 'sonner'
import {
  ArrowLeft,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  Activity,
  X,
  Loader2
} from 'lucide-react'

interface ReportData {
  id: string
  title: string
  titleAr: string
  data: any
  loading: boolean
  error: string | null
}

function ReportsContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const reports = [
    {
      id: 'players',
      icon: Users,
      title: 'Players Report',
      titleAr: 'تقرير اللاعبين',
      description: language === 'ar' ? 'إحصائيات اللاعبين حسب الفئات' : 'Player statistics by age groups',
      color: 'from-blue-500 to-cyan-500',
      endpoint: '/age-group-supervisor/reports/players'
    },
    {
      id: 'attendance',
      icon: Calendar,
      title: 'Attendance Report',
      titleAr: 'تقرير الحضور',
      description: language === 'ar' ? 'نسب الحضور في التدريبات' : 'Training attendance rates',
      color: 'from-green-500 to-emerald-500',
      endpoint: '/age-group-supervisor/reports/attendance'
    },
    {
      id: 'performance',
      icon: TrendingUp,
      title: 'Performance Report',
      titleAr: 'تقرير الأداء',
      description: language === 'ar' ? 'تحليل أداء اللاعبين' : 'Player performance analysis',
      color: 'from-purple-500 to-pink-500',
      endpoint: '/age-group-supervisor/reports/performance'
    },
    {
      id: 'registrations',
      icon: Activity,
      title: 'Registrations Report',
      titleAr: 'تقرير التسجيلات',
      description: language === 'ar' ? 'إحصائيات طلبات التسجيل' : 'Registration request statistics',
      color: 'from-orange-500 to-red-500',
      endpoint: '/age-group-supervisor/reports/registrations'
    }
  ]

  const handleViewReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId)
    if (!report) return

    setSelectedReport(reportId)
    setLoading(true)
    setReportData(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}${report.endpoint}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.ok) {
        const result = await response.json()
        setReportData(result.data)
      } else if (response.status === 404) {
        toast.error(
          language === 'ar' 
            ? 'الخدمة غير متاحة - يرجى التواصل مع مطور الباك اند' 
            : 'Service unavailable - please contact backend developer'
        )
        setReportData({ empty: true, message: language === 'ar' ? 'لا توجد بيانات' : 'No data available' })
      } else {
        setReportData({ empty: true, message: language === 'ar' ? 'لا توجد بيانات' : 'No data available' })
      }
    } catch (error) {
      console.error('Error fetching report:', error)
      toast.error(
        language === 'ar' 
          ? 'الخدمة غير متاحة حالياً' 
          : 'Service unavailable'
      )
      setReportData({ empty: true, message: language === 'ar' ? 'لا توجد بيانات' : 'No data available' })
    } finally {
      setLoading(false)
    }
  }

  const closeReport = () => {
    setSelectedReport(null)
    setReportData(null)
  }

  const getSelectedReportInfo = () => {
    return reports.find(r => r.id === selectedReport)
  }

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
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${report.color} rounded-xl flex items-center justify-center`}>
                  <report.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {language === 'ar' ? report.titleAr : report.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{report.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewReport(report.id)}
                  >
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

      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                {(() => {
                  const info = getSelectedReportInfo()
                  if (!info) return null
                  const IconComponent = info.icon
                  return (
                    <div className={`w-10 h-10 bg-gradient-to-br ${info.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  )
                })()}
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? getSelectedReportInfo()?.titleAr : getSelectedReportInfo()?.title}
                </h2>
              </div>
              <button onClick={closeReport} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
              ) : reportData?.empty ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">{reportData.message}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {language === 'ar' 
                      ? 'سيتم عرض البيانات عند توفرها من الباك اند'
                      : 'Data will be displayed when available from backend'
                    }
                  </p>
                </div>
              ) : reportData ? (
                <div className="space-y-4">
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(reportData, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {language === 'ar' ? 'لا توجد بيانات' : 'No data available'}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeReport}>
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </Button>
                <Button 
                  className="bg-green-600 text-white"
                  disabled={!reportData || reportData.empty}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
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
