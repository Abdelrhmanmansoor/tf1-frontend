'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  LayoutDashboard,
  Users,
  FileText,
  Image,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Database,
  Key,
  HelpCircle,
  LogOut,
  Home,
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  isMobile: boolean
  onClose: () => void
}

interface NavItem {
  href: string
  labelAr: string
  labelEn: string
  icon: React.ElementType
  badge?: number
}

const mainNavItems: NavItem[] = [
  {
    href: '/admin',
    labelAr: 'لوحة التحكم',
    labelEn: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/users',
    labelAr: 'المستخدمين',
    labelEn: 'Users',
    icon: Users,
  },
  {
    href: '/admin/posts',
    labelAr: 'المنشورات',
    labelEn: 'Posts',
    icon: FileText,
  },
  {
    href: '/admin/media',
    labelAr: 'الوسائط',
    labelEn: 'Media',
    icon: Image,
  },
  {
    href: '/admin/logs',
    labelAr: 'السجلات',
    labelEn: 'Activity Logs',
    icon: Activity,
  },
]

const systemNavItems: NavItem[] = [
  {
    href: '/admin/settings',
    labelAr: 'الإعدادات',
    labelEn: 'Settings',
    icon: Settings,
  },
  {
    href: '/admin/backups',
    labelAr: 'النسخ الاحتياطي',
    labelEn: 'Backups',
    icon: Database,
  },
  {
    href: '/admin/admin-keys',
    labelAr: 'مفاتيح المدير',
    labelEn: 'Admin Keys',
    icon: Key,
  },
]

export function AdminSidebar({ isOpen, isCollapsed, isMobile, onClose }: AdminSidebarProps) {
  const { language } = useLanguage()
  const pathname = usePathname()
  const isRTL = language === 'ar'

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href)
    const label = isRTL ? item.labelAr : item.labelEn
    const Icon = item.icon

    const linkContent = (
      <Link
        href={item.href}
        onClick={() => isMobile && onClose()}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-primary/10",
          active && "bg-primary text-primary-foreground hover:bg-primary/90",
          isCollapsed && !isMobile && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary-foreground")} />
        {(!isCollapsed || isMobile) && (
          <span className="font-medium truncate">{label}</span>
        )}
        {item.badge && item.badge > 0 && (!isCollapsed || isMobile) && (
          <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    )

    if (isCollapsed && !isMobile) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {linkContent}
            </TooltipTrigger>
            <TooltipContent side={isRTL ? "left" : "right"} className="font-medium">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return linkContent
  }

  return (
    <aside
      className={cn(
        "fixed top-0 z-50 h-screen bg-card border-e transition-all duration-300",
        isRTL ? "right-0 border-l" : "left-0 border-r",
        isMobile 
          ? (isOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full"))
          : "",
        isCollapsed && !isMobile ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {(!isCollapsed || isMobile) && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">
                {isRTL ? 'لوحة الإدارة' : 'Admin Panel'}
              </span>
            </Link>
          )}
          {isCollapsed && !isMobile && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-6">
            {/* Main Navigation */}
            <div className="space-y-1">
              {(!isCollapsed || isMobile) && (
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {isRTL ? 'الرئيسية' : 'Main'}
                </p>
              )}
              {mainNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>

            {/* System Navigation */}
            <div className="space-y-1">
              {(!isCollapsed || isMobile) && (
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {isRTL ? 'النظام' : 'System'}
                </p>
              )}
              {systemNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-3 space-y-1">
          <NavLink 
            item={{
              href: '/',
              labelAr: 'العودة للموقع',
              labelEn: 'Back to Site',
              icon: Home,
            }} 
          />
          <NavLink 
            item={{
              href: '/help',
              labelAr: 'المساعدة',
              labelEn: 'Help',
              icon: HelpCircle,
            }} 
          />
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
