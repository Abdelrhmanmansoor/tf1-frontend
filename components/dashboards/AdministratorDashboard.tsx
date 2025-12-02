'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Users,
  Calendar,
  Settings,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Loader2,
  LogOut,
  Briefcase,
  AlertCircle,
  Edit,
  Shield,
  FileText,
  Bell,
  BarChart3,
  Building2,
  UserCheck,
  UserX,
  Activity,
  ClipboardList,
  Mail,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  pendingApprovals: number
  totalClubs: number
  totalCoaches: number
  totalPlayers: number
  recentRegistrations: number
  systemAlerts: number
}

interface PendingApproval {
  id: string
  name: string
  email: string
  role: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
}

interface SystemAlert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  messageAr: string
  date: string
}

const AdministratorDashboard = () => {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    totalClubs: 0,
    totalCoaches: 0,
    totalPlayers: 0,
    recentRegistrations: 0,
    systemAlerts: 0
  })
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([])
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalUsers: 1250,
          activeUsers: 890,
          pendingApprovals: 15,
          totalClubs: 45,
          totalCoaches: 180,
          totalPlayers: 820,
          recentRegistrations: 28,
          systemAlerts: 3
        })

        setPendingApprovals([
          { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', role: 'coach', date: '2024-01-15', status: 'pending' },
          { id: '2', name: 'نادي الاتحاد', email: 'ittihad@example.com', role: 'club', date: '2024-01-14', status: 'pending' },
          { id: '3', name: 'سارة علي', email: 'sara@example.com', role: 'specialist', date: '2024-01-13', status: 'pending' },
        ])

        setSystemAlerts([
          { id: '1', type: 'warning', message: 'High server load detected', messageAr: 'تم اكتشاف حمل عالي على الخادم', date: '2024-01-15' },
          { id: '2', type: 'info', message: 'System maintenance scheduled', messageAr: 'صيانة مجدولة للنظام', date: '2024-01-16' },
        ])

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const displayName = user?.firstName || language === 'ar' ? 'الإداري' : 'Administrator'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-12 h-12 text-blue-600" />
          </motion.div>
          <p className="text-gray-600 text-lg">
            {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'خطأ في التحميل' : 'Loading Error'}
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const statCards = [
    { icon: Users, label: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', value: stats.totalUsers, color: 'from-blue-500 to-cyan-500' },
    { icon: UserCheck, label: language === 'ar' ? 'المستخدمين النشطين' : 'Active Users', value: stats.activeUsers, color: 'from-green-500 to-emerald-500' },
    { icon: ClipboardList, label: language === 'ar' ? 'طلبات معلقة' : 'Pending Approvals', value: stats.pendingApprovals, color: 'from-yellow-500 to-orange-500' },
    { icon: Building2, label: language === 'ar' ? 'الأندية' : 'Clubs', value: stats.totalClubs, color: 'from-purple-500 to-pink-500' },
    { icon: Award, label: language === 'ar' ? 'المدربين' : 'Coaches', value: stats.totalCoaches, color: 'from-indigo-500 to-blue-500' },
    { icon: Activity, label: language === 'ar' ? 'اللاعبين' : 'Players', value: stats.totalPlayers, color: 'from-cyan-500 to-teal-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  TF1
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">
                {language === 'ar' ? 'لوحة الإداري' : 'Administrator Panel'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <GlobalSearchButton />
              <MessageNotificationBadge dashboardType="administrator" />
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? `مرحباً، ${displayName}` : `Welcome, ${displayName}`}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة النظام والمستخدمين' : 'System and user management'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'طلبات الموافقة المعلقة' : 'Pending Approvals'}
              </h2>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingApprovals.length} {language === 'ar' ? 'معلق' : 'pending'}
              </span>
            </div>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{approval.name}</p>
                      <p className="text-sm text-gray-500">{approval.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'تنبيهات النظام' : 'System Alerts'}
              </h2>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-xl border-l-4 ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                    alert.type === 'error' ? 'bg-red-50 border-red-500' :
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${
                      alert.type === 'warning' ? 'text-yellow-600' :
                      alert.type === 'error' ? 'text-red-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {language === 'ar' ? alert.messageAr : alert.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{alert.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Users, label: language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users', href: '/dashboard/administrator/users' },
            { icon: Building2, label: language === 'ar' ? 'إدارة الأندية' : 'Manage Clubs', href: '/dashboard/administrator/clubs' },
            { icon: Settings, label: language === 'ar' ? 'إعدادات النظام' : 'System Settings', href: '/dashboard/administrator/settings' },
            { icon: BarChart3, label: language === 'ar' ? 'التقارير' : 'Reports', href: '/dashboard/administrator/reports' },
          ].map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-gray-900">{action.label}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </main>
    </div>
  )
}

export default AdministratorDashboard
