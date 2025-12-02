'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import sportsDirectorService, { Coach, CoachPerformance } from '@/services/sports-director'
import {
  User,
  Loader2,
  X,
  Search,
  ArrowLeft,
  Star,
  Medal,
  MessageSquare,
  Eye,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Phone,
  Mail,
  Award,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function CoachesPage() {
  return (
    <ProtectedRoute allowedRoles={['sports-director']}>
      <CoachesContent />
    </ProtectedRoute>
  )
}

function CoachesContent() {
  const { language } = useLanguage()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [coachPerformances, setCoachPerformances] = useState<CoachPerformance[]>([])
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [selectedPerformance, setSelectedPerformance] = useState<CoachPerformance | null>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [message, setMessage] = useState({ subject: '', body: '' })
  const [sending, setSending] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [coachesData, performanceData] = await Promise.all([
        sportsDirectorService.getCoaches(),
        sportsDirectorService.getCoachPerformance()
      ])
      setCoaches(coachesData)
      setCoachPerformances(performanceData)
      setFilteredCoaches(coachesData)
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data'))
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    let filtered = [...coaches]

    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameAr?.includes(searchQuery) ||
        c.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus)
    }

    setFilteredCoaches(filtered)
  }, [coaches, searchQuery, filterStatus])

  const getCoachPerformance = (coachId: string) => {
    return coachPerformances.find(p => p.coachId === coachId || p.id === coachId)
  }

  const handleViewDetails = (coach: Coach) => {
    setSelectedCoach(coach)
    setSelectedPerformance(getCoachPerformance(coach.id) || null)
    setShowDetailModal(true)
  }

  const handleSendMessage = async () => {
    if (!selectedCoach || !message.subject || !message.body) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields')
      return
    }

    try {
      setSending(true)
      await sportsDirectorService.sendMessageToCoach(selectedCoach.id, message)
      toast.success(language === 'ar' ? 'تم إرسال الرسالة بنجاح' : 'Message sent successfully')
      setShowMessageModal(false)
      setMessage({ subject: '', body: '' })
    } catch (err: any) {
      toast.error(err.message || (language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message'))
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/sports-director">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'المدربين' : 'Coaches'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredCoaches.length} {language === 'ar' ? 'مدرب' : 'coaches'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'بحث عن مدرب...' : 'Search coaches...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
              <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
              <option value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              {language === 'ar' ? 'لا يوجد مدربين' : 'No coaches found'}
            </div>
          ) : (
            filteredCoaches.map((coach, index) => {
              const performance = getCoachPerformance(coach.id)
              return (
                <motion.div
                  key={coach.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                          {coach.avatar ? (
                            <img src={coach.avatar} alt={coach.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-white" />
                          )}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Medal className="w-4 h-4 text-yellow-800" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {language === 'ar' ? coach.nameAr || coach.name : coach.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? coach.specializationAr || coach.specialization : coach.specialization}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      coach.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {coach.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-900">{performance?.rating || coach.rating || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'التقييم' : 'Rating'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-bold text-gray-900">{performance?.sessionsCompleted || coach.sessionsCompleted || 0}</p>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'جلسات' : 'Sessions'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-bold text-gray-900">{performance?.playersManaged || coach.playersManaged || 0}</p>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'لاعبين' : 'Players'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(coach)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {language === 'ar' ? 'التفاصيل' : 'Details'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setSelectedCoach(coach); setShowMessageModal(true); }}
                      className="flex-1"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {language === 'ar' ? 'رسالة' : 'Message'}
                    </Button>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </main>

      <AnimatePresence>
        {showDetailModal && selectedCoach && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowDetailModal(false); setSelectedCoach(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'تفاصيل المدرب' : 'Coach Details'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                  {selectedCoach.avatar ? (
                    <img src={selectedCoach.avatar} alt={selectedCoach.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {language === 'ar' ? selectedCoach.nameAr || selectedCoach.name : selectedCoach.name}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'ar' ? selectedCoach.specializationAr || selectedCoach.specialization : selectedCoach.specialization}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="w-4 h-4" /> {selectedCoach.email}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="w-4 h-4" /> {selectedCoach.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedPerformance?.rating || selectedCoach.rating || 0}</p>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'التقييم' : 'Rating'}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedPerformance?.sessionsCompleted || 0}</p>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'جلسات' : 'Sessions'}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedPerformance?.playersManaged || 0}</p>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'لاعبين' : 'Players'}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{selectedPerformance?.winRate || 0}%</p>
                  <p className="text-sm text-gray-500">{language === 'ar' ? 'نسبة الفوز' : 'Win Rate'}</p>
                </div>
              </div>

              {selectedPerformance?.performanceHistory && selectedPerformance.performanceHistory.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {language === 'ar' ? 'سجل الأداء' : 'Performance History'}
                  </h4>
                  <div className="space-y-3">
                    {selectedPerformance.performanceHistory.map((record, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{record.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {record.rating}
                          </span>
                          <span className="text-gray-500">{record.sessions} {language === 'ar' ? 'جلسة' : 'sessions'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => { setShowDetailModal(false); setShowMessageModal(true); }}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إرسال رسالة' : 'Send Message'}
                </Button>
                <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMessageModal && selectedCoach && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowMessageModal(false); setMessage({ subject: '', body: '' }); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? `رسالة إلى ${selectedCoach.nameAr || selectedCoach.name}` : `Message to ${selectedCoach.name}`}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMessageModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الموضوع' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={message.subject}
                    onChange={(e) => setMessage({ ...message, subject: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الرسالة' : 'Message'}
                  </label>
                  <textarea
                    value={message.body}
                    onChange={(e) => setMessage({ ...message, body: e.target.value })}
                    rows={5}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => { setShowMessageModal(false); setMessage({ subject: '', body: '' }); }}
                    className="flex-1"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : (language === 'ar' ? 'إرسال' : 'Send')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
