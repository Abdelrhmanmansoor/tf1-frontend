'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Download,
  FileSpreadsheet,
  FileJson,
  Loader2,
  CheckCircle,
  Calendar,
  TrendingUp,
  Activity,
  Users,
  AlertTriangle
} from 'lucide-react'

export default function ReportsPage() {
  const { language } = useLanguage()
  const [generating, setGenerating] = useState(false)
  const [reportType, setReportType] = useState<'analytics' | 'health' | 'user'>('analytics')
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'excel' | 'pdf'>('json')
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month')
  const [generatedReport, setGeneratedReport] = useState<any>(null)

  const generateReport = async () => {
    try {
      setGenerating(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'
      
      let endpoint = ''
      if (reportType === 'analytics') {
        endpoint = `${baseUrl}/matches/analytics/reports/analytics?period=${period}`
      } else if (reportType === 'health') {
        endpoint = `${baseUrl}/matches/analytics/reports/health`
      } else if (reportType === 'user') {
        endpoint = `${baseUrl}/matches/analytics/reports/user`
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        setGeneratedReport(result.data)
      } else {
        alert(language === 'ar' ? 'فشل في إنشاء التقرير' : 'Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert(language === 'ar' ? 'حدث خطأ' : 'An error occurred')
    } finally {
      setGenerating(false)
    }
  }

  const exportReport = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'
      const url = `${baseUrl}/matches/analytics/export/${reportType}?format=${exportFormat}&period=${period}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      })

      if (response.ok) {
        if (exportFormat === 'csv') {
          const text = await response.text()
          const blob = new Blob([text], { type: 'text/csv' })
          const downloadUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `${reportType}-report-${Date.now()}.csv`
          link.click()
        } else {
          const result = await response.json()
          const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
          const downloadUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `${reportType}-report-${Date.now()}.json`
          link.click()
        }

        alert(language === 'ar' ? 'تم التصدير بنجاح' : 'Export successful')
      }
    } catch (error) {
      console.error('Error exporting report:', error)
      alert(language === 'ar' ? 'فشل التصدير' : 'Export failed')
    }
  }

  const reportTypes = [
    {
      id: 'analytics' as const,
      icon: TrendingUp,
      title: language === 'ar' ? 'تقرير التحليلات الشامل' : 'Comprehensive Analytics',
      description: language === 'ar' 
        ? 'تحليلات متقدمة مع نماذج إحصائية وتنبؤات' 
        : 'Advanced analytics with statistical models and forecasts',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'health' as const,
      icon: Activity,
      title: language === 'ar' ? 'تقرير صحة المنصة' : 'Platform Health',
      description: language === 'ar' 
        ? 'مؤشرات الأداء وكشف الشذوذ' 
        : 'Performance indicators and anomaly detection',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'user' as const,
      icon: Users,
      title: language === 'ar' ? 'تقرير أداء المستخدم' : 'User Performance',
      description: language === 'ar' 
        ? 'تحليل شامل لأداء المستخدم' 
        : 'Comprehensive user performance analysis',
      color: 'from-blue-500 to-cyan-500'
    }
  ]

  const exportFormats = [
    { id: 'json' as const, icon: FileJson, label: 'JSON' },
    { id: 'csv' as const, icon: FileSpreadsheet, label: 'CSV' },
    { id: 'excel' as const, icon: FileSpreadsheet, label: 'Excel' },
    { id: 'pdf' as const, icon: FileText, label: 'PDF' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'تقارير التحليلات' : 'Analytics Reports'}
              </h1>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'إنشاء وتصدير التقارير التفصيلية' : 'Generate and export detailed reports'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Type Selection */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'اختر نوع التقرير' : 'Select Report Type'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReportType(type.id)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  reportType === type.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
                {reportType === type.id && (
                  <div className="mt-3 flex items-center gap-2 text-purple-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'محدد' : 'Selected'}
                    </span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Period Selection */}
        {reportType === 'analytics' && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              {language === 'ar' ? 'اختر الفترة الزمنية' : 'Select Time Period'}
            </h2>
            <div className="flex flex-wrap gap-3">
              {(['today', 'week', 'month', 'quarter', 'year'] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? 'default' : 'outline'}
                  onClick={() => setPeriod(p)}
                  className={period === p ? 'bg-purple-600 text-white' : ''}
                >
                  {p === 'today' && (language === 'ar' ? 'اليوم' : 'Today')}
                  {p === 'week' && (language === 'ar' ? 'أسبوع' : 'Week')}
                  {p === 'month' && (language === 'ar' ? 'شهر' : 'Month')}
                  {p === 'quarter' && (language === 'ar' ? 'ربع سنة' : 'Quarter')}
                  {p === 'year' && (language === 'ar' ? 'سنة' : 'Year')}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Export Format Selection */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'صيغة التصدير' : 'Export Format'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => setExportFormat(format.id)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  exportFormat === format.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <format.icon className={`w-8 h-8 ${
                  exportFormat === format.id ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <span className={`font-medium ${
                  exportFormat === format.id ? 'text-purple-600' : 'text-gray-700'
                }`}>
                  {format.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={generateReport}
              disabled={generating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
                </>
              )}
            </Button>

            {generatedReport && (
              <Button
                onClick={exportReport}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
              </Button>
            )}
          </div>
        </section>

        {/* Generated Report Preview */}
        {generatedReport && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'معاينة التقرير' : 'Report Preview'}
            </h2>

            {/* Metadata */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">
                {language === 'ar' ? 'معلومات التقرير' : 'Report Information'}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">{language === 'ar' ? 'النوع:' : 'Type:'}</span>
                  <span className="ml-2 font-medium">{generatedReport.metadata?.report_type}</span>
                </div>
                <div>
                  <span className="text-gray-600">{language === 'ar' ? 'التاريخ:' : 'Date:'}</span>
                  <span className="ml-2 font-medium">
                    {new Date(generatedReport.metadata?.generated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            {generatedReport.executive_summary && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {language === 'ar' ? 'الملخص التنفيذي' : 'Executive Summary'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(generatedReport.executive_summary).map(([key, value]: [string, any]) => {
                    if (typeof value === 'object') return null
                    return (
                      <div key={key} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                        <div className="text-xs text-purple-600 mb-1 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{value}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sections Count */}
            {generatedReport.sections && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">
                    {language === 'ar' ? 'يحتوي التقرير على' : 'Report contains'} {generatedReport.sections.length} {language === 'ar' ? 'أقسام' : 'sections'}
                  </span>
                </div>
              </div>
            )}

            {/* Statistical Models Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">
                {language === 'ar' ? 'النماذج الإحصائية المستخدمة' : 'Statistical Models Used'}
              </h3>
              <ul className="space-y-1 text-sm text-purple-800">
                <li>✓ {language === 'ar' ? 'الانحدار الخطي' : 'Linear Regression'}</li>
                <li>✓ {language === 'ar' ? 'المتوسط المتحرك' : 'Moving Average'}</li>
                <li>✓ {language === 'ar' ? 'التنعيم الأسي' : 'Exponential Smoothing'}</li>
                <li>✓ {language === 'ar' ? 'كشف الشذوذ' : 'Anomaly Detection'}</li>
                <li>✓ {language === 'ar' ? 'تحليل الموسمية' : 'Seasonality Analysis'}</li>
              </ul>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  )
}

