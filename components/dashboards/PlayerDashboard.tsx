'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  FileText,
  User,
  Target,
  Calendar,
  Award,
  MessageCircle,
  Eye,
  Star,
  Users,
  Edit,
  Image as ImageIcon,
  Settings,
  MapPin,
  Briefcase,
  ChevronRight,
  Loader2,
  LogOut,
  Trophy,
  Clock,
  Dumbbell,
  Shield,
  Bell,
  AlertCircle,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import playerService from '@/services/player'
import authService from '@/services/auth'
import type { 
  DashboardStats, 
  PlayerProfile,
  PlayerAgeCategory,
  TrainingProgram,
  TrainingSession,
  AgeCategoryMatch,
  PlayerPerformanceStats,
  AgeCategoryAnnouncement,
  TeamMember,
  CoachInfo
} from '@/types/player'
import { calculateProfileCompletion } from '@/utils/profileCompletion'
import JobNotifications from '@/components/notifications/JobNotifications'
import { ActiveRequestsWidget, UpcomingSessionsWidget } from '@/components/dashboards/player'

const PlayerDashboard = () => {
  const { language } = useLanguage()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [playerCategory, setPlayerCategory] = useState<PlayerAgeCategory | null>(null)
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([])
  const [upcomingTrainings, setUpcomingTrainings] = useState<TrainingSession[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<AgeCategoryMatch[]>([])
  const [performanceStats, setPerformanceStats] = useState<PlayerPerformanceStats | null>(null)
  const [announcements, setAnnouncements] = useState<AgeCategoryAnnouncement[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [coach, setCoach] = useState<CoachInfo | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        statsData,
        profileData,
        categoryData,
        programsData,
        trainingsData,
        matchesData,
        perfData,
        announcementsData,
        teamData,
        coachData
      ] = await Promise.all([
        playerService.getDashboardStats(),
        playerService.getMyProfile(),
        playerService.getMyAgeCategory(),
        playerService.getTrainingPrograms(),
        playerService.getUpcomingTrainingSessions(5),
        playerService.getAgeCategoryMatches('upcoming'),
        playerService.getPerformanceStats(),
        playerService.getAgeCategoryAnnouncements(),
        playerService.getTeamMembers(),
        playerService.getMyCoach()
      ])

      setStats(statsData)
      setProfile(profileData)
      setPlayerCategory(categoryData)
      setTrainingPrograms(programsData)
      setUpcomingTrainings(trainingsData)
      setUpcomingMatches(matchesData)
      setPerformanceStats(perfData)
      setAnnouncements(announcementsData)
      setTeamMembers(teamData)
      setCoach(coachData)
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)

      if (
        err.message?.toLowerCase().includes('profile not found') ||
        err.status === 404
      ) {
        router.push('/dashboard/player/setup')
        return
      }

      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const markAnnouncementRead = async (id: string) => {
    await playerService.markAnnouncementRead(id)
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading dashboard...'}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'خطأ في التحميل' : 'Loading Error'}
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchDashboardData} className="w-full">
            {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </Button>
        </motion.div>
      </div>
    )
  }

  const getUserName = () => {
    if (!profile?.userId) return language === 'ar' ? 'اللاعب' : 'Player'
    const user = typeof profile.userId === 'object' ? profile.userId : null
    return user?.firstName || (language === 'ar' ? 'اللاعب' : 'Player')
  }

  const profileCompletion = profile
    ? calculateProfileCompletion(profile)
    : { percentage: 0, missingFields: [], completedFields: [], totalFields: 0, completedCount: 0 }

  const unreadAnnouncements = announcements.filter(a => !a.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {language === 'ar' ? `مرحباً ${getUserName()}!` : `Welcome back, ${getUserName()}!`}
                </h1>
                {playerCategory && (
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-600">
                      {language === 'ar' ? playerCategory.ageCategory.nameAr : playerCategory.ageCategory.name}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span>{language === 'ar' ? playerCategory.team.nameAr : playerCategory.team.name}</span>
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 flex-wrap">
              <GlobalSearchButton variant="outline" showLabel={true} />
              <LanguageSelector />
              <MessageNotificationBadge dashboardType="player" />
              <Link href="/dashboard/player/opportunities">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {language === 'ar' ? 'الفرص' : 'Opportunities'}
                </Button>
              </Link>
              <Button
                onClick={() => { authService.logout(); router.push('/login') }}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Age Category Info Card */}
        {playerCategory ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {language === 'ar' ? playerCategory.ageCategory.nameAr : playerCategory.ageCategory.name}
                  </h2>
                  <p className="text-white/80">
                    {language === 'ar' ? playerCategory.team.nameAr : playerCategory.team.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      #{playerCategory.jerseyNumber || '--'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {language === 'ar' ? playerCategory.positionAr || playerCategory.position : playerCategory.position}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-center">
                  <p className="text-2xl font-bold">{playerCategory.team.totalPlayers}</p>
                  <p className="text-xs text-white/70">{language === 'ar' ? 'لاعب' : 'Players'}</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-center">
                  <p className="text-2xl font-bold">{upcomingMatches.length}</p>
                  <p className="text-xs text-white/70">{language === 'ar' ? 'مباريات' : 'Matches'}</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-center">
                  <p className="text-2xl font-bold">{trainingPrograms.length}</p>
                  <p className="text-xs text-white/70">{language === 'ar' ? 'برامج' : 'Programs'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-yellow-800">
                  {language === 'ar' ? 'لم يتم تعيينك في فئة عمرية بعد' : 'Not Assigned to Age Category Yet'}
                </h3>
                <p className="text-yellow-700 text-sm">
                  {language === 'ar' 
                    ? 'تواصل مع إدارة النادي للتسجيل في الفئة العمرية المناسبة'
                    : 'Contact club management to register for the appropriate age category'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assigned Coach */}
            {coach && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  {language === 'ar' ? 'المدرب المعين' : 'Assigned Coach'}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {coach.avatar ? (
                      <img src={coach.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      coach.name?.charAt(0) || 'C'
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{language === 'ar' ? coach.nameAr || coach.name : coach.name}</h4>
                    <p className="text-sm text-gray-500">{language === 'ar' ? coach.specializationAr || coach.specialization : coach.specialization}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      {coach.rating && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          {coach.rating.toFixed(1)}
                        </span>
                      )}
                      {coach.yearsOfExperience && (
                        <span className="text-gray-500">
                          {coach.yearsOfExperience} {language === 'ar' ? 'سنوات خبرة' : 'years exp.'}
                        </span>
                      )}
                    </div>
                  </div>
                  {coach.phone && (
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'تواصل' : 'Contact'}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Training Programs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-green-600" />
                  {language === 'ar' ? 'برامج التدريب' : 'Training Programs'}
                </h3>
                <Link href="/dashboard/player/training-programs">
                  <Button variant="ghost" size="sm">
                    {language === 'ar' ? 'عرض الكل' : 'View All'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              {trainingPrograms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Dumbbell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{language === 'ar' ? 'لا توجد برامج تدريب حالياً' : 'No training programs available'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trainingPrograms.slice(0, 3).map((program) => (
                    <div key={program.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {language === 'ar' ? program.nameAr : program.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          program.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          program.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {program.status === 'in-progress' ? (language === 'ar' ? 'جاري' : 'In Progress') :
                           program.status === 'completed' ? (language === 'ar' ? 'مكتمل' : 'Completed') :
                           (language === 'ar' ? 'قادم' : 'Upcoming')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {program.duration} {language === 'ar' ? 'دقيقة' : 'min'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          program.type === 'fitness' ? 'bg-orange-100 text-orange-700' :
                          program.type === 'technical' ? 'bg-blue-100 text-blue-700' :
                          program.type === 'tactical' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {program.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${program.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{program.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Upcoming Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  {language === 'ar' ? 'المباريات القادمة' : 'Upcoming Matches'}
                </h3>
                <Link href="/dashboard/player/matches">
                  <Button variant="ghost" size="sm">
                    {language === 'ar' ? 'عرض الكل' : 'View All'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              {upcomingMatches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{language === 'ar' ? 'لا توجد مباريات قادمة' : 'No upcoming matches'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingMatches.slice(0, 3).map((match) => (
                    <div key={match.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          match.type === 'league' ? 'bg-blue-100 text-blue-700' :
                          match.type === 'cup' ? 'bg-purple-100 text-purple-700' :
                          match.type === 'tournament' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {match.type === 'league' ? (language === 'ar' ? 'الدوري' : 'League') :
                           match.type === 'cup' ? (language === 'ar' ? 'الكأس' : 'Cup') :
                           match.type === 'tournament' ? (language === 'ar' ? 'بطولة' : 'Tournament') :
                           (language === 'ar' ? 'ودية' : 'Friendly')}
                        </span>
                        {match.playerStatus && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            match.playerStatus === 'starting' ? 'bg-green-100 text-green-700' :
                            match.playerStatus === 'substitute' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {match.playerStatus === 'starting' ? (language === 'ar' ? 'أساسي' : 'Starting') :
                             match.playerStatus === 'substitute' ? (language === 'ar' ? 'احتياطي' : 'Substitute') :
                             (language === 'ar' ? 'غير مختار' : 'Not Selected')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="text-center flex-1">
                          <p className="font-bold text-gray-900">
                            {language === 'ar' ? match.homeTeamAr || match.homeTeam : match.homeTeam}
                          </p>
                          {match.isHomeGame && <span className="text-xs text-blue-600">{language === 'ar' ? '(نحن)' : '(Us)'}</span>}
                        </div>
                        <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-bold">
                          VS
                        </div>
                        <div className="text-center flex-1">
                          <p className="font-bold text-gray-900">
                            {language === 'ar' ? match.awayTeamAr || match.awayTeam : match.awayTeam}
                          </p>
                          {!match.isHomeGame && <span className="text-xs text-blue-600">{language === 'ar' ? '(نحن)' : '(Us)'}</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(match.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {match.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {language === 'ar' ? match.venueAr || match.venue : match.venue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Upcoming Training Sessions */}
            <UpcomingSessionsWidget
              language={language}
              sessions={upcomingTrainings}
            />

            {/* Job Notifications */}
            {profile && (authService.getCurrentUser()?.id || (authService.getCurrentUser() as any)?._id) && (
              <JobNotifications 
                userId={authService.getCurrentUser()?.id || (authService.getCurrentUser() as any)?._id} 
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                {language === 'ar' ? 'إحصائيات الأداء' : 'Performance Stats'}
              </h3>
              {performanceStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{performanceStats.matchesPlayed}</p>
                      <p className="text-xs text-gray-600">{language === 'ar' ? 'مباريات' : 'Matches'}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{performanceStats.goals}</p>
                      <p className="text-xs text-gray-600">{language === 'ar' ? 'أهداف' : 'Goals'}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">{performanceStats.assists}</p>
                      <p className="text-xs text-gray-600">{language === 'ar' ? 'تمريرات' : 'Assists'}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{performanceStats.averageRating.toFixed(1)}</p>
                      <p className="text-xs text-gray-600">{language === 'ar' ? 'التقييم' : 'Rating'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{language === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}</span>
                      <span className="font-bold text-gray-900">{performanceStats.attendanceRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${performanceStats.attendanceRate}%` }} />
                    </div>
                  </div>
                  {performanceStats.skillLevels && performanceStats.skillLevels.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">{language === 'ar' ? 'المهارات' : 'Skills'}</p>
                      {performanceStats.skillLevels.slice(0, 4).map((skill, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 w-20 truncate">
                            {language === 'ar' ? skill.skillAr : skill.skill}
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                skill.trend === 'improving' ? 'bg-green-500' :
                                skill.trend === 'declining' ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${skill.level * 10}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{skill.level}/10</span>
                          {skill.trend === 'improving' && <TrendingUp className="w-3 h-3 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  )}
                  <Link href="/dashboard/player/performance">
                    <Button variant="outline" className="w-full">
                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <BarChart3 className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">{language === 'ar' ? 'لا توجد إحصائيات بعد' : 'No stats available yet'}</p>
                </div>
              )}
            </motion.div>

            {/* Team Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                {language === 'ar' ? 'زملاء الفريق' : 'Team Members'}
              </h3>
              {teamMembers.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">{language === 'ar' ? 'لا يوجد زملاء' : 'No teammates yet'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {member.avatar ? (
                          <img src={member.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          member.name?.charAt(0) || '?'
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {language === 'ar' ? member.nameAr || member.name : member.name}
                          {member.isCaptain && <span className="ml-1 text-yellow-500">©</span>}
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === 'ar' ? member.positionAr || member.position : member.position}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-400">#{member.jerseyNumber || '--'}</span>
                    </div>
                  ))}
                  {teamMembers.length > 5 && (
                    <Link href="/dashboard/player/team">
                      <Button variant="ghost" size="sm" className="w-full">
                        {language === 'ar' ? `+${teamMembers.length - 5} آخرين` : `+${teamMembers.length - 5} more`}
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </motion.div>

            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  {language === 'ar' ? 'إعلانات الفئة' : 'Category Announcements'}
                  {unreadAnnouncements > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadAnnouncements}</span>
                  )}
                </h3>
              </div>
              {announcements.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">{language === 'ar' ? 'لا توجد إعلانات' : 'No announcements'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.slice(0, 4).map((announcement) => (
                    <div
                      key={announcement.id}
                      onClick={() => markAnnouncementRead(announcement.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-colors ${
                        announcement.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          announcement.priority === 'high' ? 'bg-red-500' :
                          announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${announcement.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {language === 'ar' ? announcement.titleAr : announcement.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {language === 'ar' ? announcement.contentAr : announcement.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(announcement.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Active Training Requests */}
            <ActiveRequestsWidget language={language} />

            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 rounded-2xl shadow-lg p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Edit className="w-5 h-5" />
                {language === 'ar' ? 'اكتمال الملف' : 'Profile Completion'}
              </h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold">{profileCompletion.percentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: `${profileCompletion.percentage}%` }} />
                </div>
              </div>
              <p className="text-white/80 text-sm mb-4">
                {language === 'ar'
                  ? 'أكمل ملفك الشخصي لزيادة فرصك'
                  : 'Complete your profile to increase your visibility'}
              </p>
              <Link href="/dashboard/player/profile/edit">
                <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                  <Edit className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تحديث الملف' : 'Update Profile'}
                </Button>
              </Link>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </h3>
              <div className="space-y-2">
                <Link href="/dashboard/player/profile">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50">
                    <Eye className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'عرض الملف' : 'View Profile'}
                  </Button>
                </Link>
                <Link href="/dashboard/player/gallery">
                  <Button variant="outline" className="w-full justify-start hover:bg-pink-50">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'معرض الصور' : 'Media Gallery'}
                  </Button>
                </Link>
                <Link href="/dashboard/player/achievements">
                  <Button variant="outline" className="w-full justify-start hover:bg-yellow-50">
                    <Award className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'الإنجازات' : 'Achievements'}
                  </Button>
                </Link>
                <Link href="/dashboard/player/privacy">
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50">
                    <Settings className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'الخصوصية' : 'Privacy'}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDashboard
