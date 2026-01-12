'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  User,
  Settings,
  LogOut,
  ChevronDown,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface AdminHeaderProps {
  onToggleSidebar: () => void
  isSidebarCollapsed: boolean
}

export function AdminHeader({ onToggleSidebar, isSidebarCollapsed }: AdminHeaderProps) {
  const { language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const isRTL = language === 'ar'

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }

  const handleLogout = () => {
    logout()
  }

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'AD'

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* Search */}
        <div className={cn(
          "flex-1 max-w-md transition-all duration-200",
          searchOpen ? "flex" : "hidden md:flex"
        )}>
          <div className="relative w-full">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              type="search"
              placeholder={isRTL ? "البحث..." : "Search..."}
              className={cn(
                "w-full bg-muted/50",
                isRTL ? "pr-10" : "pl-10"
              )}
            />
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Refresh */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Language Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-80">
              <DropdownMenuLabel className="font-semibold">
                {isRTL ? 'الإشعارات' : 'Notifications'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <p className="font-medium text-sm">
                    {isRTL ? 'مستخدم جديد مسجل' : 'New user registered'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isRTL ? 'منذ 5 دقائق' : '5 minutes ago'}
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <p className="font-medium text-sm">
                    {isRTL ? 'منشور جديد في انتظار المراجعة' : 'New post pending review'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isRTL ? 'منذ 15 دقيقة' : '15 minutes ago'}
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <p className="font-medium text-sm">
                    {isRTL ? 'اكتمل النسخ الاحتياطي' : 'Backup completed'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isRTL ? 'منذ ساعة' : '1 hour ago'}
                  </p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center">
                <Link href="/admin/notifications" className="w-full text-center text-primary">
                  {isRTL ? 'عرض الكل' : 'View all'}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</span>
                  <span className="text-xs text-muted-foreground">
                    {isRTL ? 'مدير النظام' : 'System Admin'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || 'admin@tf1jobs.com'}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {isRTL ? 'الملف الشخصي' : 'Profile'}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {isRTL ? 'الإعدادات' : 'Settings'}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-destructive focus:text-destructive flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {isRTL ? 'تسجيل الخروج' : 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
