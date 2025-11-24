'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import {
  LayoutDashboard,
  Settings,
  Users,
  Activity,
  LogOut,
  FileText,
} from 'lucide-react'

export function Sidebar() {
  const { language } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    {
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: language === 'ar' ? 'الإعدادات' : 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
    {
      label: language === 'ar' ? 'المستخدمون' : 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: language === 'ar' ? 'سجل الأنشطة' : 'Activity',
      href: '/admin/activity',
      icon: Activity,
    },
    {
      label: language === 'ar' ? 'المقالات' : 'Articles',
      href: '/dashboard/admin/blog',
      icon: FileText,
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">TF1 Admin</h1>
      </div>

      <nav className="p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
        </button>
      </div>
    </div>
  )
}
