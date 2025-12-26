'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Home,
  Calendar,
  Users,
  PlusCircle,
  Bell,
  History,
  User,
  Settings,
  Dribbble,
} from 'lucide-react'

interface DashboardSidebarProps {
  open: boolean
  onToggle: () => void
}

const navItems = [
  {
    id: 'overview',
    label: 'نظرة عامة',
    icon: Home,
    href: '/matches-dashboard',
  },
  {
    id: 'matches',
    label: 'جميع المباريات',
    icon: Calendar,
    href: '/matches-dashboard/matches',
  },
  {
    id: 'my-matches',
    label: 'مبارياتي',
    icon: Dribbble,
    href: '/matches-dashboard/my-matches',
  },
  {
    id: 'teams',
    label: 'فرقي',
    icon: Users,
    href: '/matches-dashboard/teams',
  },
  {
    id: 'create',
    label: 'إنشاء مباراة',
    icon: PlusCircle,
    href: '/matches-dashboard/create',
  },
  {
    id: 'notifications',
    label: 'الإشعارات',
    icon: Bell,
    href: '/matches-dashboard/notifications',
  },
  {
    id: 'history',
    label: 'السجل',
    icon: History,
    href: '/matches-dashboard/history',
  },
  {
    id: 'profile',
    label: 'الملف الشخصي',
    icon: User,
    href: '/matches-dashboard/profile',
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    href: '/matches-dashboard/settings',
  },
]

export default function DashboardSidebar({
  open,
  onToggle,
}: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: open ? 0 : '100%',
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 h-screen w-64 bg-white shadow-xl z-30 overflow-y-auto"
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              TF1 - المباريات
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href !== '/matches-dashboard' &&
                  pathname.startsWith(item.href))

              return (
                <Link key={item.id} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  )
}
