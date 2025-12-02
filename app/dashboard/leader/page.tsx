'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/language-selector'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import {
  Users,
  Shield,
  Settings,
  BarChart3,
  FileText,
  Bell,
  MessageSquare,
  Briefcase,
  FolderOpen,
  ClipboardList,
  LogOut,
  Crown,
  UserPlus,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalTeamMembers: number
  totalJobs: number
  totalApplications: number
  pendingActions: number
  activeUsers: number
}

function LeaderDashboardContent() {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTeamMembers: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingActions: 0,
    activeUsers: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/leader/dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.ok) {
        const result = await response.json()
        setStats(result.data?.stats || stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  const statCards = [
    { icon: Users, label: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users', value: stats.totalUsers, color: 'from-blue-500 to-cyan-500', href: '/dashboard/leader/users' },
    { icon: UserPlus, label: language === 'ar' ? 'أعضاء الفريق' : 'Team Members', value: stats.totalTeamMembers, color: 'from-purple-500 to-pink-500', href: '/dashboard/leader/teams' },
    { icon: Briefcase, label: language === 'ar' ? 'الوظائف' : 'Jobs', value: stats.totalJobs, color: 'from-green-500 to-emerald-500', href: '/dashboard/leader/jobs' },
    { icon: ClipboardList, label: language === 'ar' ? 'الطلبات' : 'Applications', value: stats.totalApplications, color: 'from-orange-500 to-amber-500', href: '/dashboard/leader/applications' },
    { icon: Activity, label: language === 'ar' ? 'المستخدمين النشطين' : 'Active Users', value: stats.activeUsers, color: 'from-teal-500 to-cyan-500', href: '/dashboard/leader/analytics' },
    { icon: AlertTriangle, label: language === 'ar' ? 'إجراءات معلقة' : 'Pending Actions', value: stats.pendingActions, color: 'from-red-500 to-pink-500', href: '/dashboard/leader/notifications' },
  ]

  const quickActions = [
    { icon: Users, label: language === 'ar' ? 'المستخدمين' : 'Users', href: '/dashboard/leader/users', color: 'from-blue-500 to-cyan-500' },
    { icon: UserPlus, label: language === 'ar' ? 'الفريق' : 'Team', href: '/dashboard/leader/teams', color: 'from-purple-500 to-pink-500' },
    { icon: Shield, label: language === 'ar' ? 'الصلاحيات' : 'Permissions', href: '/dashboard/leader/permissions', color: 'from-indigo-500 to-purple-500' },
    { icon: FileText, label: language === 'ar' ? 'المحتوى' : 'Content', href: '/dashboard/leader/content', color: 'from-green-500 to-emerald-500' },
    { icon: Briefcase, label: language === 'ar' ? 'الوظائف' : 'Jobs', href: '/dashboard/leader/jobs', color: 'from-orange-500 to-amber-500' },
    { icon: FolderOpen, label: language === 'ar' ? 'الفئات' : 'Categories', href: '/dashboard/leader/categories', color: 'from-teal-500 to-cyan-500' },
    { icon: BarChart3, label: language === 'ar' ? 'التحليلات' : 'Analytics', href: '/dashboard/leader/analytics', color: 'from-pink-500 to-rose-500' },
    { icon: ClipboardList, label: language === 'ar' ? 'سجل التدقيق' : 'Audit Log', href: '/dashboard/leader/audit', color: 'from-gray-500 to-gray-600' },
    { icon: Settings, label: language === 'ar' ? 'الإعدادات' : 'Settings', href: '/dashboard/leader/settings', color: 'from-slate-500 to-slate-600' },
    { icon: Bell, label: language === 'ar' ? 'الإشعارات' : 'Notifications', href: '/dashboard/leader/notifications', color: 'from-yellow-500 to-orange-500' },
    { icon: MessageSquare, label: language === 'ar' ? 'الرسائل' : 'Messages', href: '/dashboard/leader/messages', color: 'from-cyan-500 to-blue-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TF1 Leader
                </span>
              </Link>
              <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs font-medium">
                <Crown className="w-3 h-3" />
                {language === 'ar' ? 'تحكم كامل' : 'Full Control'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
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
            {language === 'ar' ? `مرحباً، ${user?.firstName}` : `Welcome, ${user?.firstName}`}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'لديك تحكم كامل في جميع أقسام المنصة' : 'You have full control over all platform sections'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
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
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'الوصول السريع' : 'Quick Access'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{action.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">
                {language === 'ar' ? 'لوحة تحكم القائد' : 'Leader Control Panel'}
              </h3>
              <p className="text-indigo-100">
                {language === 'ar' 
                  ? 'لديك صلاحيات كاملة لإدارة جميع جوانب المنصة'
                  : 'You have full permissions to manage all aspects of the platform'
                }
              </p>
            </div>
            <Crown className="w-16 h-16 text-white/20" />
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function LeaderDashboard() {
  return (
    <ProtectedRoute allowedRoles={['leader']} fallbackPath="/dashboard/leader/access-denied">
      <LeaderDashboardContent />
    </ProtectedRoute>
  )
}
