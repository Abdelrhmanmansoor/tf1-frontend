'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import executiveDirectorService, { KPI } from '@/services/executive-director'
import {
  PieChart,
  Loader2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronRight,
  BarChart3,
  Target,
  Users,
  DollarSign,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function KPIsPage() {
  return (
    <ProtectedRoute allowedRoles={['executive-director']}>
      <KPIsContent />
    </ProtectedRoute>
  )
}

function KPIsContent() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<KPI[]>([])

  const fetchKPIs = useCallback(async () => {
    try {
      setLoading(true)
      const data = await executiveDirectorService.getKPIs()
      setKpis(data)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل المؤشرات' : 'Failed to load KPIs'))
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchKPIs()
  }, [fetchKPIs])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return <DollarSign className="w-6 h-6" />
      case 'operational': return <BarChart3 className="w-6 h-6" />
      case 'member': return <Users className="w-6 h-6" />
      case 'staff': return <Briefcase className="w-6 h-6" />
      default: return <Target className="w-6 h-6" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'from-green-500 to-emerald-500'
      case 'operational': return 'from-blue-500 to-cyan-500'
      case 'member': return 'from-purple-500 to-indigo-500'
      case 'staff': return 'from-orange-500 to-amber-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const groupedKPIs = kpis.reduce((acc, kpi) => {
    const category = kpi.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(kpi)
    return acc
  }, {} as Record<string, KPI[]>)

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
                {language === 'ar' ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(groupedKPIs).map(([category, categoryKpis]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center text-white`}>
                  {getCategoryIcon(category)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 capitalize">
                    {category === 'financial' ? (language === 'ar' ? 'مالي' : 'Financial') :
                     category === 'operational' ? (language === 'ar' ? 'تشغيلي' : 'Operational') :
                     category === 'member' ? (language === 'ar' ? 'الأعضاء' : 'Members') :
                     category === 'staff' ? (language === 'ar' ? 'الموظفين' : 'Staff') :
                     (language === 'ar' ? 'أخرى' : 'Other')}
                  </h3>
                  <p className="text-sm text-gray-500">{categoryKpis.length} {language === 'ar' ? 'مؤشرات' : 'indicators'}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {categoryKpis.filter(k => k.value >= k.target).length}/{categoryKpis.length}
              </div>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'يحققون الهدف' : 'meeting target'}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          {kpis.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl">
              {language === 'ar' ? 'لا توجد مؤشرات أداء' : 'No KPIs available'}
            </div>
          ) : (
            kpis.map((kpi, index) => (
              <motion.div
                key={kpi.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(kpi.category || 'other')} flex items-center justify-center text-white`}>
                      {getCategoryIcon(kpi.category || 'other')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {language === 'ar' ? kpi.nameAr : kpi.name}
                      </h3>
                      {(kpi.description || kpi.descriptionAr) && (
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? kpi.descriptionAr || kpi.description : kpi.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {kpi.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                        {kpi.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
                        {kpi.trend === 'stable' && <Activity className="w-5 h-5 text-yellow-500" />}
                        <span className="text-3xl font-bold text-gray-900">{kpi.value}{kpi.unit}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {language === 'ar' ? 'الهدف:' : 'Target:'} {kpi.target}{kpi.unit}
                      </p>
                    </div>
                    <Link href={`/dashboard/executive-director/kpis/${kpi.id}`}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      kpi.value >= kpi.target ? 'bg-green-500' :
                      kpi.value >= kpi.target * 0.8 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">0{kpi.unit}</span>
                  <span className={`font-medium ${
                    kpi.value >= kpi.target ? 'text-green-600' :
                    kpi.value >= kpi.target * 0.8 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {Math.round((kpi.value / kpi.target) * 100)}% {language === 'ar' ? 'من الهدف' : 'of target'}
                  </span>
                  <span className="text-gray-500">{kpi.target}{kpi.unit}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
