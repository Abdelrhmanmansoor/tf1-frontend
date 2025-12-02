'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import executiveDirectorService from '@/services/executive-director'
import {
  LineChart,
  Loader2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  Calendar,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['executive-director']}>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}

function AnalyticsContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [analytics, setAnalytics] = useState<any>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await executiveDirectorService.getAnalytics(period)
      setAnalytics(data)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل التحليلات' : 'Failed to load analytics'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [language, period])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    )
  }

  const stats = [
    {
      icon: DollarSign,
      label: language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: analytics?.totalRevenue ? `${(analytics.totalRevenue / 1000000).toFixed(2)}M SAR` : '0',
      change: analytics?.revenueChange || 0,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      label: language === 'ar' ? 'الأعضاء الجدد' : 'New Members',
      value: analytics?.newMembers || 0,
      change: analytics?.membersChange || 0,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Activity,
      label: language === 'ar' ? 'معدل الاحتفاظ' : 'Retention Rate',
      value: `${analytics?.retentionRate || 0}%`,
      change: analytics?.retentionChange || 0,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: BarChart3,
      label: language === 'ar' ? 'البرامج المكتملة' : 'Programs Completed',
      value: analytics?.completedPrograms || 0,
      change: analytics?.programsChange || 0,
      color: 'from-orange-500 to-amber-500'
    }
  ]

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
                {language === 'ar' ? 'التحليلات' : 'Analytics'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={period}
                onChange={(e) => { setPeriod(e.target.value as any); setLoading(true); }}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="week">{language === 'ar' ? 'أسبوع' : 'Week'}</option>
                <option value="month">{language === 'ar' ? 'شهر' : 'Month'}</option>
                <option value="quarter">{language === 'ar' ? 'ربع سنة' : 'Quarter'}</option>
                <option value="year">{language === 'ar' ? 'سنة' : 'Year'}</option>
              </select>
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'نمو الإيرادات' : 'Revenue Growth'}
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <LineChart className="w-12 h-12 mx-auto mb-4" />
                <p>{language === 'ar' ? 'الرسم البياني متصل بالـ Backend' : 'Chart connected to Backend'}</p>
                <p className="text-sm mt-2">{language === 'ar' ? 'سيتم عرض البيانات عند توفرها' : 'Data will display when available'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'نمو الأعضاء' : 'Member Growth'}
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <p>{language === 'ar' ? 'الرسم البياني متصل بالـ Backend' : 'Chart connected to Backend'}</p>
                <p className="text-sm mt-2">{language === 'ar' ? 'سيتم عرض البيانات عند توفرها' : 'Data will display when available'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            {language === 'ar' ? 'ملخص الأداء' : 'Performance Summary'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: language === 'ar' ? 'إجمالي الشراكات' : 'Total Partnerships', value: analytics?.totalPartnerships || 0 },
              { label: language === 'ar' ? 'البرامج النشطة' : 'Active Programs', value: analytics?.activePrograms || 0 },
              { label: language === 'ar' ? 'رضا الأعضاء' : 'Member Satisfaction', value: `${analytics?.memberSatisfaction || 0}%` },
              { label: language === 'ar' ? 'معدل النمو' : 'Growth Rate', value: `${analytics?.growthRate || 0}%` },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
