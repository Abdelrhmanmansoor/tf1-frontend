'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import executiveDirectorService, { FinancialReport } from '@/services/executive-director'
import {
  FileText,
  Loader2,
  ArrowLeft,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={['executive-director']}>
      <ReportsContent />
    </ProtectedRoute>
  )
}

function ReportsContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month')
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [report, setReport] = useState<FinancialReport | null>(null)

  const fetchReport = useCallback(async () => {
    try {
      const data = await executiveDirectorService.getFinancialReport(period, year, period === 'month' ? month : undefined)
      setReport(data)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل التقرير' : 'Failed to load report'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [language, period, year, month])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchReport()
  }

  const handleExport = () => {
    toast.success(language === 'ar' ? 'جاري تصدير التقرير...' : 'Exporting report...')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/executive-director">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'التقارير المالية' : 'Financial Reports'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'تصدير' : 'Export'}
              </Button>
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'الفترة' : 'Period'}
              </label>
              <select
                value={period}
                onChange={(e) => { setPeriod(e.target.value as any); setLoading(true); }}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="month">{language === 'ar' ? 'شهري' : 'Monthly'}</option>
                <option value="quarter">{language === 'ar' ? 'ربع سنوي' : 'Quarterly'}</option>
                <option value="year">{language === 'ar' ? 'سنوي' : 'Yearly'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'السنة' : 'Year'}
              </label>
              <select
                value={year}
                onChange={(e) => { setYear(parseInt(e.target.value)); setLoading(true); }}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[2024, 2023, 2022].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {period === 'month' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الشهر' : 'Month'}
                </label>
                <select
                  value={month}
                  onChange={(e) => { setMonth(parseInt(e.target.value)); setLoading(true); }}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>
                      {new Date(2024, m - 1).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <DollarSign className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">{language === 'ar' ? 'الإيرادات' : 'Revenue'}</p>
            <p className="text-2xl font-bold text-gray-900">
              {report?.revenue ? `${(report.revenue / 1000000).toFixed(2)}M SAR` : '0 SAR'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">{language === 'ar' ? 'المصروفات' : 'Expenses'}</p>
            <p className="text-2xl font-bold text-gray-900">
              {report?.expenses ? `${(report.expenses / 1000000).toFixed(2)}M SAR` : '0 SAR'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                <PieChart className="w-6 h-6" />
              </div>
              {report?.growth && report.growth >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">{language === 'ar' ? 'صافي الربح' : 'Net Profit'}</p>
            <p className="text-2xl font-bold text-gray-900">
              {report?.profit ? `${(report.profit / 1000000).toFixed(2)}M SAR` : '0 SAR'}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'توزيع المصروفات' : 'Expense Breakdown'}
            </h2>
            {report?.breakdown && report.breakdown.length > 0 ? (
              <div className="space-y-4">
                {report.breakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">{item.category}</span>
                      <span className="font-medium text-gray-900">
                        {(item.amount / 1000).toFixed(0)}K SAR
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                        style={{ width: `${(item.amount / (report.expenses || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <PieChart className="w-12 h-12 mx-auto mb-4" />
                <p>{language === 'ar' ? 'سيتم عرض البيانات عند توفرها' : 'Data will display when available'}</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'مقارنة بالفترة السابقة' : 'Period Comparison'}
            </h2>
            {report?.comparison ? (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-2">{language === 'ar' ? 'الفترة السابقة' : 'Previous Period'}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {(report.comparison.previousPeriod / 1000000).toFixed(2)}M SAR
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-2">{language === 'ar' ? 'التغيير' : 'Change'}</p>
                  <p className={`text-xl font-bold ${report.comparison.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {report.comparison.change >= 0 ? '+' : ''}{report.comparison.change}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <p>{language === 'ar' ? 'سيتم عرض البيانات عند توفرها' : 'Data will display when available'}</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
