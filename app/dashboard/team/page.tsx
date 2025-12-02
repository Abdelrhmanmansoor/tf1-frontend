'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/language-selector'
import { usePermission } from '@/lib/rbac/hooks'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import {
  Users,
  FileText,
  Briefcase,
  ClipboardList,
  Bell,
  MessageSquare,
  LogOut,
  UserCircle,
  Lock,
  Loader2
} from 'lucide-react'

function TeamDashboardContent() {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()
  const { hasPermission, userPermissions, loading: permissionsLoading } = usePermission()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-slate-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  const allActions = [
    { icon: Users, label: language === 'ar' ? 'المستخدمين' : 'Users', href: '/dashboard/team/users', permission: 'users.view', color: 'from-blue-500 to-cyan-500' },
    { icon: FileText, label: language === 'ar' ? 'المحتوى' : 'Content', href: '/dashboard/team/content', permission: 'content.view', color: 'from-green-500 to-emerald-500' },
    { icon: Briefcase, label: language === 'ar' ? 'الوظائف' : 'Jobs', href: '/dashboard/team/jobs', permission: 'jobs.view', color: 'from-orange-500 to-amber-500' },
    { icon: ClipboardList, label: language === 'ar' ? 'الطلبات' : 'Applications', href: '/dashboard/team/applications', permission: 'applications.view', color: 'from-purple-500 to-pink-500' },
    { icon: Bell, label: language === 'ar' ? 'الإشعارات' : 'Notifications', href: '/dashboard/team/notifications', permission: 'notifications.view', color: 'from-yellow-500 to-orange-500' },
    { icon: MessageSquare, label: language === 'ar' ? 'الرسائل' : 'Messages', href: '/dashboard/team/messages', permission: 'messages.view', color: 'from-cyan-500 to-blue-500' },
  ]

  const availableActions = allActions.filter(action => hasPermission(action.permission))
  const restrictedActions = allActions.filter(action => !hasPermission(action.permission))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-slate-600 to-gray-700 bg-clip-text text-transparent">
                  TF1 Team
                </span>
              </Link>
              <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                <UserCircle className="w-3 h-3" />
                {language === 'ar' ? 'عضو فريق' : 'Team Member'}
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
            {language === 'ar' 
              ? `لديك صلاحية الوصول إلى ${availableActions.length} أقسام`
              : `You have access to ${availableActions.length} sections`
            }
          </p>
        </motion.div>

        {availableActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'الأقسام المتاحة' : 'Available Sections'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer text-center">
                    <div className={`w-14 h-14 mx-auto mb-3 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="font-medium text-gray-900">{action.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {restrictedActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-500 mb-4">
              {language === 'ar' ? 'الأقسام المقيدة' : 'Restricted Sections'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {restrictedActions.map((action, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-xl text-center opacity-50 cursor-not-allowed"
                >
                  <div className="w-14 h-14 mx-auto mb-3 bg-gray-300 rounded-xl flex items-center justify-center relative">
                    <action.icon className="w-7 h-7 text-gray-500" />
                    <Lock className="w-4 h-4 text-gray-600 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
                  </div>
                  <p className="font-medium text-gray-500">{action.label}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {language === 'ar' ? 'غير مصرح' : 'Not Authorized'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-slate-100 rounded-2xl p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'ملاحظة' : 'Note'}
          </h3>
          <p className="text-gray-600 text-sm">
            {language === 'ar'
              ? 'صلاحياتك يتم تحديدها من قبل مدير النظام (Leader). إذا كنت بحاجة لصلاحيات إضافية، تواصل مع المسؤول.'
              : 'Your permissions are managed by the system Leader. If you need additional access, please contact your administrator.'
            }
          </p>
        </motion.div>
      </main>
    </div>
  )
}

export default function TeamDashboard() {
  return (
    <ProtectedRoute allowedRoles={['team']} fallbackPath="/dashboard/team/access-denied">
      <TeamDashboardContent />
    </ProtectedRoute>
  )
}
