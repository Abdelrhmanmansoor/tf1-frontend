'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Zap,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  RefreshCw,
  Sparkles
} from 'lucide-react'

interface KPICardProps {
  title: string
  value: number | string
  change?: number
  trend?: 'up' | 'down' | 'stable'
  target?: number
  achievement?: number
  status?: 'excellent' | 'good' | 'fair' | 'poor'
  icon: any
  color: string
}

function KPICard({ title, value, change, trend, target, achievement, status, icon: Icon, color }: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4" />
    if (trend === 'down') return <ArrowDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-600'
  }

  const getStatusColor = () => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-200'
      case 'good': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'fair': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'poor': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {status && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            {status}
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      {target && achievement && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Target: {target}</span>
            <span>{Math.round(achievement)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                achievement >= 100 ? 'bg-green-500' : 
                achievement >= 75 ? 'bg-blue-500' : 
                achievement >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, achievement)}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function AdvancedAnalyticsPage() {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month')
  const [kpiData, setKpiData] = useState<any>(null)
  const [healthData, setHealthData] = useState<any>(null)
  const [growthData, setGrowthData] = useState<any>(null)
  const [funnelData, setFunnelData] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'
      
      const [kpiRes, healthRes, growthRes, funnelRes] = await Promise.all([
        fetch(`${baseUrl}/matches/analytics/kpi?period=${period}`),
        fetch(`${baseUrl}/matches/analytics/platform-health`),
        fetch(`${baseUrl}/matches/analytics/growth-trend?days=90`),
        fetch(`${baseUrl}/matches/analytics/funnel?days=30`)
      ])

      if (kpiRes.ok) {
        const kpiResult = await kpiRes.json()
        setKpiData(kpiResult.data)
      }

      if (healthRes.ok) {
        const healthResult = await healthRes.json()
        setHealthData(healthResult.data)
      }

      if (growthRes.ok) {
        const growthResult = await growthRes.json()
        setGrowthData(growthResult.data)
      }

      if (funnelRes.ok) {
        const funnelResult = await funnelRes.json()
        setFunnelData(funnelResult.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  const exportReport = () => {
    // TODO: Implement PDF/Excel export
    alert(language === 'ar' ? 'سيتم تنفيذ التصدير قريباً' : 'Export will be implemented soon')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">{language === 'ar' ? 'جاري تحميل التحليلات...' : 'Loading analytics...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'ar' ? 'التحليلات المتقدمة' : 'Advanced Analytics'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'ar' ? 'نماذج إحصائية حقيقية وتحليلات تنبؤية' : 'Real Statistical Models & Predictive Analytics'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {language === 'ar' ? 'تحديث' : 'Refresh'}
              </Button>
              <Button
                onClick={exportReport}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
              </Button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 mt-4">
            {(['today', 'week', 'month', 'quarter', 'year'] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health Score Banner */}
        {healthData && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  {language === 'ar' ? 'صحة المنصة' : 'Platform Health Score'}
                </h2>
                <p className="text-purple-100 text-sm">
                  {language === 'ar' ? 'مؤشر شامل لأداء المنصة' : 'Comprehensive platform performance indicator'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold">{kpiData?.health_score?.score || 0}</div>
                <div className="text-purple-200 text-sm mt-1">
                  {kpiData?.health_score?.rating || 'N/A'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Growth KPIs */}
        {kpiData?.growth && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              {language === 'ar' ? 'مؤشرات النمو' : 'Growth KPIs'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                title={language === 'ar' ? 'المباريات المنشأة' : 'Matches Created'}
                value={kpiData.growth.matches_created.current}
                change={kpiData.growth.matches_created.change_percent}
                trend={kpiData.growth.matches_created.trend}
                icon={Activity}
                color="bg-gradient-to-br from-blue-500 to-cyan-500"
              />
              <KPICard
                title={language === 'ar' ? 'مستخدمون جدد' : 'New Users'}
                value={kpiData.growth.new_users.current}
                change={kpiData.growth.new_users.change_percent}
                trend={kpiData.growth.new_users.trend}
                icon={Users}
                color="bg-gradient-to-br from-green-500 to-emerald-500"
              />
              <KPICard
                title={language === 'ar' ? 'إجمالي المشاركات' : 'Total Participations'}
                value={kpiData.growth.total_participations.current}
                change={kpiData.growth.total_participations.change_percent}
                trend={kpiData.growth.total_participations.trend}
                icon={Target}
                color="bg-gradient-to-br from-purple-500 to-pink-500"
              />
            </div>
          </section>
        )}

        {/* Engagement KPIs */}
        {kpiData?.engagement && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-600" />
              {language === 'ar' ? 'مؤشرات التفاعل' : 'Engagement KPIs'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title={language === 'ar' ? 'المستخدمون النشطون' : 'Active Users'}
                value={kpiData.engagement.active_users.value}
                target={Math.round(kpiData.engagement.active_users.target)}
                achievement={kpiData.engagement.active_users.achievement}
                status={kpiData.engagement.active_users.status}
                icon={Users}
                color="bg-gradient-to-br from-orange-500 to-red-500"
              />
              <KPICard
                title={language === 'ar' ? 'معدل التفاعل' : 'Engagement Rate'}
                value={`${kpiData.engagement.engagement_rate.value}%`}
                target={kpiData.engagement.engagement_rate.target}
                achievement={kpiData.engagement.engagement_rate.achievement}
                status={kpiData.engagement.engagement_rate.status}
                icon={Activity}
                color="bg-gradient-to-br from-pink-500 to-rose-500"
              />
              <KPICard
                title={language === 'ar' ? 'النشطون يومياً' : 'Daily Active'}
                value={kpiData.engagement.daily_active_users.avg_per_day}
                icon={Calendar}
                color="bg-gradient-to-br from-indigo-500 to-purple-500"
              />
              <KPICard
                title={language === 'ar' ? 'متوسط الجلسات' : 'Avg Sessions'}
                value={kpiData.engagement.avg_sessions_per_user.value}
                status={kpiData.engagement.avg_sessions_per_user.status}
                icon={BarChart3}
                color="bg-gradient-to-br from-teal-500 to-cyan-500"
              />
            </div>
          </section>
        )}

        {/* Conversion KPIs */}
        {kpiData?.conversion && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              {language === 'ar' ? 'مؤشرات التحويل' : 'Conversion KPIs'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title={language === 'ar' ? 'معدل الانضمام' : 'Join Rate'}
                value={`${kpiData.conversion.swipe_to_join_rate.value}%`}
                target={kpiData.conversion.swipe_to_join_rate.target}
                achievement={kpiData.conversion.swipe_to_join_rate.achievement}
                status={kpiData.conversion.swipe_to_join_rate.status}
                icon={CheckCircle}
                color="bg-gradient-to-br from-green-500 to-lime-500"
              />
              <KPICard
                title={language === 'ar' ? 'معدل امتلاء المباريات' : 'Fill Rate'}
                value={`${kpiData.conversion.match_fill_rate.value}%`}
                target={kpiData.conversion.match_fill_rate.target}
                achievement={kpiData.conversion.match_fill_rate.achievement}
                status={kpiData.conversion.match_fill_rate.status}
                icon={PieChart}
                color="bg-gradient-to-br from-blue-500 to-indigo-500"
              />
              <KPICard
                title={language === 'ar' ? 'معدل الإتمام' : 'Completion Rate'}
                value={`${kpiData.conversion.match_completion_rate.value}%`}
                target={kpiData.conversion.match_completion_rate.target}
                achievement={kpiData.conversion.match_completion_rate.achievement}
                status={kpiData.conversion.match_completion_rate.status}
                icon={Award}
                color="bg-gradient-to-br from-yellow-500 to-orange-500"
              />
              <KPICard
                title={language === 'ar' ? 'معدل الاحتفاظ' : 'Retention Rate'}
                value={`${kpiData.conversion.user_retention_rate.value}%`}
                target={kpiData.conversion.user_retention_rate.target}
                achievement={kpiData.conversion.user_retention_rate.achievement}
                status={kpiData.conversion.user_retention_rate.status}
                icon={Users}
                color="bg-gradient-to-br from-purple-500 to-violet-500"
              />
            </div>
          </section>
        )}

        {/* Growth Trend Chart */}
        {growthData && (
          <section className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <LineChart className="w-6 h-6 text-purple-600" />
                    {language === 'ar' ? 'تحليل اتجاه النمو' : 'Growth Trend Analysis'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {language === 'ar' ? 'نموذج الانحدار الخطي + التنبؤ' : 'Linear Regression Model + Forecasting'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">
                    {language === 'ar' ? 'معامل التحديد (R²)' : 'R² Score'}
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(growthData.matches?.regression?.r2 * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    {language === 'ar' ? 'إحصائيات المباريات' : 'Matches Statistics'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ar' ? 'الاتجاه' : 'Trend'}:</span>
                      <span className="font-medium capitalize">{growthData.matches?.trend_direction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ar' ? 'معدل النمو' : 'Growth Rate'}:</span>
                      <span className="font-medium">{growthData.matches?.growth_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ar' ? 'الميل' : 'Slope'}:</span>
                      <span className="font-medium">{growthData.matches?.regression?.slope.toFixed(3)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    {language === 'ar' ? 'إحصائيات الانضمامات' : 'Joins Statistics'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ar' ? 'الاتجاه' : 'Trend'}:</span>
                      <span className="font-medium capitalize">{growthData.joins?.trend_direction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ar' ? 'معدل النمو' : 'Growth Rate'}:</span>
                      <span className="font-medium">{growthData.joins?.growth_rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ar' ? 'الارتباط' : 'Correlation'}:</span>
                      <span className="font-medium">{growthData.correlation?.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast */}
              {growthData.matches?.forecast && growthData.matches.forecast.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    {language === 'ar' ? 'التنبؤ للأيام القادمة' : 'Forecast for Next Days'}
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {growthData.matches.forecast.slice(0, 7).map((forecast: any, index: number) => (
                      <div key={index} className="text-center bg-purple-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600">Day {forecast.period}</div>
                        <div className="text-lg font-bold text-purple-600">
                          {Math.round(forecast.forecast)}
                        </div>
                        <div className="text-xs text-gray-500">{forecast.confidence}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </section>
        )}

        {/* Funnel Analysis */}
        {funnelData && (
          <section className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                {language === 'ar' ? 'تحليل القمع التحويلي' : 'Conversion Funnel Analysis'}
              </h2>
              
              <div className="space-y-4">
                {funnelData.funnel?.map((stage: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700 capitalize">{stage.stage}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{stage.users} users</span>
                        <span className="text-sm font-medium text-purple-600">
                          {stage.conversion_from_previous.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                        style={{ width: `${stage.conversion_from_previous}%` }}
                      />
                    </div>
                    {stage.drop_off > 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        Drop-off: {stage.drop_off} users
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">{language === 'ar' ? 'التحويل الإجمالي' : 'Overall Conversion'}</div>
                  <div className="text-3xl font-bold text-purple-600">{funnelData.overall_conversion}%</div>
                </div>
                {funnelData.biggest_drop_off && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{language === 'ar' ? 'أكبر انخفاض' : 'Biggest Drop-off'}</div>
                    <div className="text-xl font-bold text-red-600 capitalize">
                      {funnelData.biggest_drop_off.stage}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </section>
        )}

        {/* Model Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">
                {language === 'ar' ? 'النماذج الإحصائية المستخدمة' : 'Statistical Models Used'}
              </h3>
              <ul className="space-y-1 text-sm text-purple-800">
                <li>• {language === 'ar' ? 'الانحدار الخطي للتنبؤ بالاتجاهات' : 'Linear Regression for trend prediction'}</li>
                <li>• {language === 'ar' ? 'المتوسط المتحرك لتنعيم البيانات' : 'Moving Average for data smoothing'}</li>
                <li>• {language === 'ar' ? 'التنعيم الأسي للتنبؤ' : 'Exponential Smoothing for forecasting'}</li>
                <li>• {language === 'ar' ? 'كشف الشذوذ باستخدام IQR' : 'Anomaly Detection using IQR method'}</li>
                <li>• {language === 'ar' ? 'محاكاة مونت كارلو لتقييم المخاطر' : 'Monte Carlo Simulation for risk assessment'}</li>
                <li>• {language === 'ar' ? 'تحليل الموسمية والأنماط المتكررة' : 'Seasonality and recurring pattern analysis'}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}


