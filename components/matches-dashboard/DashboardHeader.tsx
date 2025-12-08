'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, LogOut, User } from 'lucide-react'
import API_CONFIG from '@/config/api'
import type { MatchesUser } from '@/types/match'

interface DashboardHeaderProps {
  user: MatchesUser | null
  onMenuClick: () => void
}

export default function DashboardHeader({
  user,
  onMenuClick,
}: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear authentication
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_CONFIG.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.USER_KEY)
      document.cookie = `${API_CONFIG.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }

    // Redirect to login
    router.push('/matches/login')
  }

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">لوحة تحكم المباريات</h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center text-white font-bold">
              <User className="w-5 h-5" />
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">تسجيل خروج</span>
        </Button>
      </div>
    </header>
  )
}
