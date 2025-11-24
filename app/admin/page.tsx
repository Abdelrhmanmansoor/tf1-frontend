'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import adminService from '@/services/admin'
import type { AdminStats } from '@/services/admin'
import { Users, BarChart3, Briefcase, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { language } = useLanguage()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  const statItems = [
    {
      label: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: language === 'ar' ? 'إجمالي الأندية' : 'Total Clubs',
      value: stats?.totalClubs || 0,
      icon: BarChart3,
      color: 'bg-purple-500',
    },
    {
      label: language === 'ar' ? 'إجمالي الوظائف' : 'Total Jobs',
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: 'bg-green-500',
    },
    {
      label: language === 'ar' ? 'المستخدمون النشطون' : 'Active Users',
      value: stats?.activeUsers || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{item.label}</p>
                  <p className="text-3xl font-bold mt-2">{item.value}</p>
                </div>
                <div className={`${item.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          {language === 'ar' ? 'ملخص النظام' : 'System Summary'}
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>✅ {language === 'ar' ? 'النظام يعمل بشكل طبيعي' : 'System is running normally'}</p>
          <p>✅ {language === 'ar' ? 'جميع الخدمات متاحة' : 'All services are available'}</p>
          <p>✅ {language === 'ar' ? 'لا توجد تنبيهات' : 'No alerts'}</p>
        </div>
      </div>
    </div>
  )
}
