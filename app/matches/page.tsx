'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  getMatches,
  getRegionsData,
  joinMatch,
  createMatch,
  type Match,
  type MatchFilters,
  type RegionsData,
  type CreateMatchData,
} from '@/services/matches'
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  Trophy,
  Plus,
  Filter,
  Search,
  X,
  ChevronDown,
  Loader2,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Dribbble,
  Target,
} from 'lucide-react'

export default function MatchesPage() {
  const { language } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [regionsData, setRegionsData] = useState<RegionsData | null>(null)
  const [filters, setFilters] = useState<MatchFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [joiningMatchId, setJoiningMatchId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [createData, setCreateData] = useState<CreateMatchData>({
    name: '',
    sport: '',
    region: '',
    city: '',
    neighborhood: '',
    date: '',
    time: '',
    level: '',
    maxPlayers: 10,
    venue: '',
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'create' && isAuthenticated) {
      setShowCreateModal(true)
      router.replace('/matches', { scroll: false })
    }
  }, [isAuthenticated, searchParams, router])

  useEffect(() => {
    if (regionsData) {
      loadMatches()
    }
  }, [filters, regionsData])

  const loadData = async () => {
    const defaultData: RegionsData = {
      regions: [
        { name: 'الرياض', nameEn: 'Riyadh', cities: [{ name: 'الرياض', nameEn: 'Riyadh' }, { name: 'العليا', nameEn: 'Al Olaya' }] },
        { name: 'مكة المكرمة', nameEn: 'Makkah', cities: [{ name: 'جدة', nameEn: 'Jeddah' }, { name: 'مكة', nameEn: 'Makkah' }] },
        { name: 'المنطقة الشرقية', nameEn: 'Eastern', cities: [{ name: 'الدمام', nameEn: 'Dammam' }, { name: 'الخبر', nameEn: 'Khobar' }] },
      ],
      neighborhoods: {
        'الرياض': ['العليا', 'النخيل', 'الفيصلية'],
        'جدة': ['جدة', 'البلد', 'الروضة'],
        'مكة': ['مكة', 'العزيزية'],
        'الدمام': ['الدمام', 'الخليج'],
        'الخبر': ['الخبر', 'الدانة'],
      },
      leagues: [],
      positions: [],
      levels: [
        { value: 'BEGINNER', label: 'مبتدئ', labelEn: 'Beginner' },
        { value: 'AMATEUR', label: 'هاوي', labelEn: 'Amateur' },
        { value: 'SEMI_PRO', label: 'شبه احترافي', labelEn: 'Semi-Pro' },
        { value: 'PROFESSIONAL', label: 'احترافي', labelEn: 'Professional' },
      ],
      sports: [
        { value: 'FOOTBALL', label: 'كرة القدم', labelEn: 'Football' },
        { value: 'BASKETBALL', label: 'كرة السلة', labelEn: 'Basketball' },
        { value: 'VOLLEYBALL', label: 'الكرة الطائرة', labelEn: 'Volleyball' },
      ],
    }

    // Always use default data (Backend has missing files)
    setRegionsData(defaultData)
  }

  const loadMatches = async () => {
    setLoading(true)
    try {
      const response = await getMatches(filters)
      setMatches(response.matches || [])
    } catch (err) {
      console.error('Error loading matches:', err)
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  const handleJoinMatch = async (matchId: string) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/matches')
      return
    }

    setJoiningMatchId(matchId)
    try {
      await joinMatch(matchId)
      setMessage({
        type: 'success',
        text: language === 'ar' ? 'تم الانضمام للمباراة بنجاح!' : 'Successfully joined the match!',
      })
      loadMatches()
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || (language === 'ar' ? 'فشل الانضمام للمباراة' : 'Failed to join match'),
      })
    } finally {
      setJoiningMatchId(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!createData.name || !createData.sport || !createData.region || !createData.city || !createData.neighborhood || !createData.date || !createData.time || !createData.level || !createData.venue) {
      setMessage({
        type: 'error',
        text: language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields',
      })
      return
    }

    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent('/matches?action=create'))
      return
    }

    setCreating(true)
    try {
      console.log('Creating match with data:', createData)
      const result = await createMatch(createData)
      console.log('Match created:', result)
      setMessage({
        type: 'success',
        text: language === 'ar' ? 'تم إنشاء المباراة بنجاح!' : 'Match created successfully!',
      })
      setShowCreateModal(false)
      setCreateData({
        name: '',
        sport: '',
        region: '',
        city: '',
        neighborhood: '',
        date: '',
        time: '',
        level: '',
        maxPlayers: 10,
        venue: '',
      })
      loadMatches()
    } catch (err: any) {
      console.error('Full error object:', err)
      console.error('Error status:', err.response?.status)
      console.error('Error response:', err.response?.data)
      
      // Build comprehensive error message
      let errorMsg = language === 'ar' ? 'فشل إنشاء المباراة' : 'Failed to create match'
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        errorMsg = language === 'ar' ? 'أنت غير مصرح بإنشاء مبارة. يرجى تسجيل الدخول' : 'Unauthorized. Please login'
      } else if (err.response?.status === 400) {
        errorMsg = err.response?.data?.message || (language === 'ar' ? 'بيانات غير صحيحة' : 'Invalid data')
      } else if (err.response?.status === 404) {
        errorMsg = language === 'ar' ? 'الخدمة غير متاحة' : 'Service not available'
      } else if (err.response?.status === 500) {
        errorMsg = language === 'ar' ? 'خطأ في الخادم. يرجى المحاولة لاحقاً' : 'Server error. Please try again later'
      } else if (err.message?.includes('Network')) {
        errorMsg = language === 'ar' ? 'خطأ في الاتصال بالانترنت' : 'Network error'
      } else {
        errorMsg = err.response?.data?.message || err.message || errorMsg
      }
      
      console.error('Final error message:', errorMsg)
      setMessage({
        type: 'error',
        text: errorMsg,
      })
    } finally {
      setCreating(false)
      setTimeout(() => setMessage(null), 6000)
    }
  }

  const getCitiesForRegion = (regionName: string) => {
    const region = regionsData?.regions.find((r) => r.name === regionName || r.nameEn === regionName)
    return region?.cities || []
  }

  const getNeighborhoodsForCity = (cityName: string) => {
    return regionsData?.neighborhoods[cityName] || []
  }

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'football':
      case 'كرة القدم':
        return '⚽'
      case 'basketball':
      case 'كرة السلة':
        return '🏀'
      case 'volleyball':
      case 'الكرة الطائرة':
        return '🏐'
      case 'tennis':
      case 'التنس':
        return '🎾'
      default:
        return '🏆'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
      case 'مبتدئ':
        return 'bg-green-100 text-green-700'
      case 'intermediate':
      case 'متوسط':
        return 'bg-yellow-100 text-yellow-700'
      case 'advanced':
      case 'متقدم':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar activeMode="application" activePage="matches" />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"
            animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20"
            animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Dribbble className="w-4 h-4" />
              {language === 'ar' ? 'انضم لمباراة' : 'Join a Match'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'ابحث عن مباراتك القادمة' : 'Find Your Next Match'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'ar'
                ? 'انضم لمباريات رياضية في منطقتك أو أنشئ مباراتك الخاصة'
                : 'Join sports matches in your area or create your own match'}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => (isAuthenticated ? setShowCreateModal(true) : router.push('/login?redirect=' + encodeURIComponent('/matches?action=create')))}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'إنشاء مباراة' : 'Create Match'}
              </Button>
              {isAuthenticated && (
                <Link href="/matches/my-matches">
                  <Button variant="outline" className="px-6 py-3 rounded-xl border-2">
                    <Trophy className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'مباراتي' : 'My Matches'}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-white/50 backdrop-blur-sm sticky top-0 z-20 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {language === 'ar' ? 'الفلاتر' : 'Filters'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {/* Quick Filters */}
            <select
              value={filters.region || ''}
              onChange={(e) => setFilters({ ...filters, region: e.target.value, city: '' })}
              className="px-4 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="">{language === 'ar' ? 'جميع المناطق' : 'All Regions'}</option>
              {regionsData?.regions.map((region) => (
                <option key={region.name} value={region.name}>
                  {language === 'ar' ? region.name : region.nameEn}
                </option>
              ))}
            </select>

            <select
              value={filters.sport || ''}
              onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
              className="px-4 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="">{language === 'ar' ? 'جميع الرياضات' : 'All Sports'}</option>
              {regionsData?.sports.map((sport) => (
                <option key={sport.value} value={sport.value}>
                  {language === 'ar' ? sport.label : sport.labelEn}
                </option>
              ))}
            </select>

            <select
              value={filters.level || ''}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="px-4 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="">{language === 'ar' ? 'جميع المستويات' : 'All Levels'}</option>
              {regionsData?.levels.map((level) => (
                <option key={level.value} value={level.value}>
                  {language === 'ar' ? level.label : level.labelEn}
                </option>
              ))}
            </select>

            {Object.values(filters).some(Boolean) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({})}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                {language === 'ar' ? 'مسح الفلاتر' : 'Clear'}
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {filters.region && (
                    <select
                      value={filters.city || ''}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      className="px-4 py-2 border rounded-lg bg-white text-sm"
                    >
                      <option value="">{language === 'ar' ? 'جميع المدن' : 'All Cities'}</option>
                      {getCitiesForRegion(filters.region).map((city) => (
                        <option key={city.name} value={city.name}>
                          {language === 'ar' ? city.name : city.nameEn}
                        </option>
                      ))}
                    </select>
                  )}
                  <Input
                    type="date"
                    value={filters.date || ''}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    className="bg-white"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Matches Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد مباريات' : 'No matches found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'ar'
                  ? 'جرب تغيير الفلاتر أو أنشئ مباراة جديدة'
                  : 'Try changing filters or create a new match'}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'إنشاء مباراة' : 'Create Match'}
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match, index) => (
                <motion.div
                  key={match._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Match Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{getSportIcon(match.sport)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(match.level)}`}>
                        {match.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mt-2">{match.name}</h3>
                  </div>

                  {/* Match Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{match.city}, {match.neighborhood}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{new Date(match.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">{match.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Target className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">{match.venue}</span>
                    </div>

                    {/* Players Progress */}
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {language === 'ar' ? 'اللاعبون' : 'Players'}
                        </span>
                        <span className="text-sm font-medium">
                          {match.currentPlayers || match.players?.length || 0} / {match.maxPlayers}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                          style={{ width: `${((match.currentPlayers || match.players?.length || 0) / match.maxPlayers) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Join Button */}
                    <Button
                      onClick={() => handleJoinMatch(match._id)}
                      disabled={joiningMatchId === match._id || match.status === 'full'}
                      className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white mt-4"
                    >
                      {joiningMatchId === match._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : match.status === 'full' ? (
                        language === 'ar' ? 'المباراة ممتلئة' : 'Match Full'
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'انضم للمباراة' : 'Join Match'}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Match Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Plus className="w-6 h-6" />
                    {language === 'ar' ? 'إنشاء مباراة جديدة' : 'Create New Match'}
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleCreateMatch} className="p-6 overflow-y-auto max-h-[60vh] space-y-4 flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'اسم المباراة' : 'Match Name'}
                  </label>
                  <Input
                    value={createData.name}
                    onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                    placeholder={language === 'ar' ? 'مثال: مباراة ودية' : 'E.g., Friendly Match'}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الرياضة' : 'Sport'}
                    </label>
                    <select
                      value={createData.sport}
                      onChange={(e) => setCreateData({ ...createData, sport: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">{language === 'ar' ? 'اختر' : 'Select'}</option>
                      {regionsData?.sports.map((sport) => (
                        <option key={sport.value} value={sport.value}>
                          {language === 'ar' ? sport.label : sport.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'المستوى' : 'Level'}
                    </label>
                    <select
                      value={createData.level}
                      onChange={(e) => setCreateData({ ...createData, level: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">{language === 'ar' ? 'اختر' : 'Select'}</option>
                      {regionsData?.levels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {language === 'ar' ? level.label : level.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'المنطقة' : 'Region'}
                    </label>
                    <select
                      value={createData.region}
                      onChange={(e) => setCreateData({ ...createData, region: e.target.value, city: '', neighborhood: '' })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">{language === 'ar' ? 'اختر' : 'Select'}</option>
                      {regionsData?.regions.map((region) => (
                        <option key={region.name} value={region.name}>
                          {language === 'ar' ? region.name : region.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'المدينة' : 'City'}
                    </label>
                    <select
                      value={createData.city}
                      onChange={(e) => setCreateData({ ...createData, city: e.target.value, neighborhood: '' })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                      disabled={!createData.region}
                    >
                      <option value="">{language === 'ar' ? 'اختر' : 'Select'}</option>
                      {getCitiesForRegion(createData.region).map((city) => (
                        <option key={city.name} value={city.name}>
                          {language === 'ar' ? city.name : city.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الحي' : 'Neighborhood'}
                  </label>
                  <Input
                    value={createData.neighborhood}
                    onChange={(e) => setCreateData({ ...createData, neighborhood: e.target.value })}
                    placeholder={language === 'ar' ? 'مثال: العليا' : 'E.g., Al Olaya'}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </label>
                    <Input
                      type="date"
                      value={createData.date}
                      onChange={(e) => setCreateData({ ...createData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الوقت' : 'Time'}
                    </label>
                    <Input
                      type="time"
                      value={createData.time}
                      onChange={(e) => setCreateData({ ...createData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'عدد اللاعبين' : 'Max Players'}
                    </label>
                    <Input
                      type="number"
                      value={createData.maxPlayers}
                      onChange={(e) => setCreateData({ ...createData, maxPlayers: parseInt(e.target.value) || 10 })}
                      min={2}
                      max={50}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الملعب' : 'Venue'}
                    </label>
                    <Input
                      value={createData.venue}
                      onChange={(e) => setCreateData({ ...createData, venue: e.target.value })}
                      placeholder={language === 'ar' ? 'مثال: ملعب النادي' : 'E.g., Club Stadium'}
                      required
                    />
                  </div>
                </div>

                {/* Modal Footer - Inside Form */}
                <div className="p-4 -m-6 -mb-0 mt-4 border-t bg-gray-50 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'إنشاء' : 'Create'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
