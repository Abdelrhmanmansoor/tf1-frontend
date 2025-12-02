'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import sportsDirectorService from '@/services/sports-director'
import {
  BarChart3,
  Loader2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Trophy,
  Users,
  Calendar,
  Clock,
  Download,
  RefreshCw,
  Award,
  Target,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={['sports-director']}>
      <ReportsContent />
    </ProtectedRoute>
  )
}

function ReportsContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [analytics, setAnalytics] = useState<any>(null)
  const [trainingAnalytics, setTrainingAnalytics] = useState<any>(null)
  const [matchAnalytics, setMatchAnalytics] = useState<any>(null)
  const [winRate, setWinRate] = useState<any>(null)
  const [trainingHours, setTrainingHours] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [
        analyticsData,
        trainingData,
        matchData,
        winRateData,
        hoursData,
        achievementsData
      ] = await Promise.allSettled([
        sportsDirectorService.getAnalytics(period),
        sportsDirectorService.getTrainingAnalytics(period),
        sportsDirectorService.getMatchAnalytics(period),
        sportsDirectorService.getWinRate(),
        sportsDirectorService.getTrainingHours(period),
        sportsDirectorService.getAchievements()
      ])

      if (analyticsData.status === 'fulfilled') setAnalytics(analyticsData.value)
      if (trainingData.status === 'fulfilled') setTrainingAnalytics(trainingData.value)
      if (matchData.status === 'fulfilled') setMatchAnalytics(matchData.value)
      if (winRateData.status === 'fulfilled') setWinRate(winRateData.value)
      if (hoursData.status === 'fulfilled') setTrainingHours(hoursData.value)
      if (achievementsData.status === 'fulfilled') setAchievements(achievementsData.value)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [language, period])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const handleGenerateReport = async (type: string) => {
    try {
      toast.loading(language === 'ar' ? 'جاري إنشاء التقرير...' : 'Generating report...')
      await sportsDirectorService.generateReport(type as any, { period })
      toast.dismiss()
      toast.success(language === 'ar' ? 'تم إنشاء التقرير بنجاح' : 'Report generated successfully')
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message || (language === 'ar' ? 'فشل إنشاء التقرير' : 'Failed to generate report'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/sports-director">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'التقارير والإحصائيات' : 'Reports & Analytics'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="week">{language === 'ar' ? 'أسبوع' : 'Week'}</option>
                <option value="month">{language === 'ar' ? 'شهر' : 'Month'}</option>
                <option value="quarter">{language === 'ar' ? 'ربع سنة' : 'Quarter'}</option>
                <option value="year">{language === 'ar' ? 'سنة' : 'Year'}</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              {winRate && winRate.winRate > 50 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">{winRate?.winRate || 0}%</p>
            <p className="text-sm text-gray-500">{language === 'ar' ? 'نسبة الفوز' : 'Win Rate'}</p>
            <div className="mt-4 text-xs text-gray-400">
              {winRate?.wins || 0} {language === 'ar' ? 'فوز' : 'wins'} / {winRate?.totalMatches || 0} {language === 'ar' ? 'مباراة' : 'matches'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{trainingHours?.total?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-500">{language === 'ar' ? 'ساعات التدريب' : 'Training Hours'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics?.activeAthletes || 0}</p>
            <p className="text-sm text-gray-500">{language === 'ar' ? 'رياضي نشط' : 'Active Athletes'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{achievements.length}</p>
            <p className="text-sm text-gray-500">{language === 'ar' ? 'إنجازات' : 'Achievements'}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {language === 'ar' ? 'إحصائيات المباريات' : 'Match Statistics'}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateReport('match')}
              >
                <Download className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تصدير' : 'Export'}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <span className="text-gray-700">{language === 'ar' ? 'الفوز' : 'Wins'}</span>
                <span className="font-bold text-green-600">{winRate?.wins || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <span className="text-gray-700">{language === 'ar' ? 'التعادل' : 'Draws'}</span>
                <span className="font-bold text-yellow-600">{winRate?.draws || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <span className="text-gray-700">{language === 'ar' ? 'الخسارة' : 'Losses'}</span>
                <span className="font-bold text-red-600">{winRate?.losses || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700">{language === 'ar' ? 'إجمالي المباريات' : 'Total Matches'}</span>
                <span className="font-bold text-gray-900">{winRate?.totalMatches || 0}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {language === 'ar' ? 'إحصائيات التدريب' : 'Training Statistics'}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateReport('training')}
              >
                <Download className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تصدير' : 'Export'}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <span className="text-gray-700">{language === 'ar' ? 'الجلسات المنفذة' : 'Sessions Completed'}</span>
                <span className="font-bold text-blue-600">{trainingAnalytics?.sessionsCompleted || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                <span className="text-gray-700">{language === 'ar' ? 'متوسط الحضور' : 'Average Attendance'}</span>
                <span className="font-bold text-indigo-600">{trainingAnalytics?.averageAttendance || 0}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <span className="text-gray-700">{language === 'ar' ? 'إجمالي الساعات' : 'Total Hours'}</span>
                <span className="font-bold text-purple-600">{trainingHours?.total?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <span className="text-gray-700">{language === 'ar' ? 'معدل التحسن' : 'Improvement Rate'}</span>
                <span className="font-bold text-green-600">{trainingAnalytics?.improvementRate || 0}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {language === 'ar' ? 'الإنجازات' : 'Achievements'}
            </h2>
          </div>
          {achievements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {language === 'ar' ? 'لا توجد إنجازات مسجلة' : 'No achievements recorded'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement: any, index: number) => (
                <div key={index} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                    <span className="font-bold text-gray-900">{achievement.title || achievement.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.date && (
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(achievement.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            {language === 'ar' ? 'إنشاء تقرير' : 'Generate Report'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => handleGenerateReport('performance')}
              className="flex flex-col items-center p-6 h-auto"
            >
              <Activity className="w-8 h-8 mb-2 text-green-600" />
              <span>{language === 'ar' ? 'تقرير الأداء' : 'Performance Report'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGenerateReport('attendance')}
              className="flex flex-col items-center p-6 h-auto"
            >
              <Calendar className="w-8 h-8 mb-2 text-blue-600" />
              <span>{language === 'ar' ? 'تقرير الحضور' : 'Attendance Report'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGenerateReport('training')}
              className="flex flex-col items-center p-6 h-auto"
            >
              <Clock className="w-8 h-8 mb-2 text-purple-600" />
              <span>{language === 'ar' ? 'تقرير التدريب' : 'Training Report'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleGenerateReport('match')}
              className="flex flex-col items-center p-6 h-auto"
            >
              <Trophy className="w-8 h-8 mb-2 text-yellow-600" />
              <span>{language === 'ar' ? 'تقرير المباريات' : 'Match Report'}</span>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
