'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { getMatches, getMyMatches, matchesGetMe } from '@/services/matches'
import API_CONFIG from '@/config/api'
import Image from 'next/image'
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  Plus,
  Search,
  Filter,
  MapPin,
  Loader2,
  Sparkles,
  BarChart3,
  UserPlus,
  Star,
  TrendingUp,
  Zap,
  LogOut,
  User as UserIcon
} from 'lucide-react'
import Link from 'next/link'

export default function MatchesDashboardPage() {
  const { language } = useLanguage()
  const router = useRouter()
  
  const [stats, setStats] = useState({
    totalMatches: 0,
    myMatches: 0,
    upcomingMatches: 0,
    completedMatches: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const handleLogout = () => {
    // Clear all tokens
    localStorage.removeItem('token')
    localStorage.removeItem('matches_token')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('matches_user')
    localStorage.removeItem('user')
    
    // Clear cookies
    document.cookie = 'matches_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    toast.success('تم تسجيل الخروج بنجاح')
    router.push('/matches/login')
  }

  // التحقق من تسجيل الدخول
  useEffect(() => {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY) ||
                 localStorage.getItem('token') ||
                 localStorage.getItem('matches_token')
    const matchesUser = localStorage.getItem('matches_user') ||
                       localStorage.getItem('user')
    
    if (!token) {
      router.push('/matches/login?redirect=/matches/dashboard')
      return
    }
    
    try {
      const user = matchesUser ? JSON.parse(matchesUser) : null
      setCurrentUser(user)
      setIsAuthenticated(true)
    } catch {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return
    
    const fetchStats = async () => {
      try {
        // Fetch user data to get profile picture
        try {
          const userData = await matchesGetMe()
          setCurrentUser(userData)
        } catch (err) {
          console.error('Error fetching user:', err)
        }

        const [allMatches, myMatchesData] = await Promise.all([
          getMatches({ limit: 1 }),
          getMyMatches(),
        ])

        setStats({
          totalMatches: allMatches.total || 0,
          myMatches: myMatchesData.total || 0,
          upcomingMatches:
            myMatchesData.matches?.filter((m: any) => m.status === 'upcoming')
              .length || 0,
          completedMatches:
            myMatchesData.matches?.filter((m: any) => m.status === 'completed')
              .length || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated])

  const statCards = [
    {
      title: language === 'ar' ? 'إجمالي المباريات' : 'Total Matches',
      value: stats.totalMatches,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: language === 'ar' ? 'مبارياتي' : 'My Matches',
      value: stats.myMatches,
      icon: Users,
      color: 'from-green-500 to-green-600',
    },
    {
      title: language === 'ar' ? 'المباريات القادمة' : 'Upcoming',
      value: stats.upcomingMatches,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: language === 'ar' ? 'المباريات المكتملة' : 'Completed',
      value: stats.completedMatches,
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
    },
  ]

  // عرض شاشة تحميل أثناء التحقق من تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 p-6"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar'
                  ? 'مرحباً بك في لوحة تحكم المباريات'
                  : 'Welcome to Matches Dashboard'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar'
                  ? 'إدارة مبارياتك وفرقك والتواصل مع اللاعبين'
                  : 'Manage your matches, teams, and connect with players'}
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              {currentUser && (
                <Link href="/matches/dashboard/profile" className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
                  {currentUser.profilePicture ? (
                    <Image
                      src={currentUser.profilePicture}
                      alt={currentUser.name || 'Profile'}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold">
                      {currentUser.firstName?.[0] || currentUser.name?.charAt(0) || <UserIcon className="w-5 h-5" />}
                      {currentUser.lastName?.[0] || ''}
                    </div>
                  )}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser.firstName && currentUser.lastName
                        ? `${currentUser.firstName} ${currentUser.lastName}`
                        : currentUser.name || 'مستخدم'}
                    </p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                </Link>
              )}
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
              
              <Link href="/matches/create">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إنشاء مباراة' : 'Create Match'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : card.value}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Discover - جديد! */}
            <Link href="/matches/discover">
              <div className="p-4 border-2 border-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">جديد!</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {language === 'ar' ? 'اكتشف المباريات' : 'Discover Matches'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'اسحب واكتشف مباريات مخصصة لك! 🎯'
                    : 'Swipe & discover personalized matches!'}
                </p>
              </div>
            </Link>

            {/* Browse */}
            <Link href="/matches/dashboard/browse">
              <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                <Search className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {language === 'ar' ? 'تصفح المباريات' : 'Browse Matches'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'استعرض جميع المباريات المتاحة'
                    : 'Explore all available matches'}
                </p>
              </div>
            </Link>

            {/* Create */}
            <Link href="/matches/create">
              <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                <Plus className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {language === 'ar' ? 'إنشاء مباراة' : 'Create Match'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'أنشئ مباراة جديدة وادعُ اللاعبين'
                    : 'Create a new match and invite players'}
                </p>
              </div>
            </Link>

            {/* My Matches */}
            <Link href="/matches/dashboard/my-matches">
              <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                <Trophy className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {language === 'ar' ? 'مبارياتي' : 'My Matches'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'راجع وأدِر مبارياتك'
                    : 'Review and manage your matches'}
                </p>
              </div>
            </Link>

            {/* Analytics - جديد! */}
            <Link href="/matches/stats">
              <div className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                  <Zap className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {language === 'ar' ? 'إحصائياتي' : 'My Stats'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'نقاطك، مستواك، شاراتك وإنجازاتك'
                    : 'Points, level, badges & achievements'}
                </p>
              </div>
            </Link>

            {/* Social - جديد! */}
            <Link href="/matches/social">
              <div className="p-4 border-2 border-cyan-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-8 h-8 text-cyan-600" />
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {language === 'ar' ? 'الأصدقاء' : 'Friends'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'تواصل مع اللاعبين واكتسب أصدقاء جدد'
                    : 'Connect with players & make friends'}
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
