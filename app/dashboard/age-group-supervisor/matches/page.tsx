'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import ageGroupSupervisorService from '@/services/age-group-supervisor'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Plus,
  Loader2,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Plane,
  Edit,
  Trash2
} from 'lucide-react'

interface Match {
  id: string
  ageGroupId: string
  ageGroupName: string
  opponent: string
  date: string
  time: string
  location: string
  homeAway: 'home' | 'away'
  status: 'scheduled' | 'completed' | 'cancelled'
  result?: { our: number; opponent: number }
}

interface AgeGroup {
  id: string
  name: string
  nameAr: string
}

function MatchesContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<Match[]>([])
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')
  const [newMatch, setNewMatch] = useState({
    ageGroupId: '',
    opponent: '',
    date: '',
    time: '',
    location: '',
    homeAway: 'home' as 'home' | 'away'
  })

  useEffect(() => {
    fetchMatches()
    fetchAgeGroups()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-group-supervisor/matches`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.ok) {
        const result = await response.json()
        setMatches(result.data?.matches || [])
      } else {
        setMatches([])
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAgeGroups = async () => {
    try {
      const groups = await ageGroupSupervisorService.getAgeGroups()
      setAgeGroups(groups)
    } catch (error) {
      console.error('Error fetching age groups:', error)
      setAgeGroups([])
    }
  }

  const handleAddMatch = async () => {
    if (!newMatch.ageGroupId || !newMatch.opponent || !newMatch.date || !newMatch.time) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    try {
      setSaving(true)
      const selectedGroup = ageGroups.find(g => g.id === newMatch.ageGroupId)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-group-supervisor/matches`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...newMatch,
            ageGroupName: language === 'ar' ? selectedGroup?.nameAr : selectedGroup?.name,
            status: 'scheduled'
          })
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تمت إضافة المباراة بنجاح' : 'Match added successfully')
        setShowAddModal(false)
        setNewMatch({ ageGroupId: '', opponent: '', date: '', time: '', location: '', homeAway: 'home' })
        fetchMatches()
      } else if (response.status === 404) {
        toast.error(
          language === 'ar' 
            ? 'الخدمة غير متاحة - يرجى التواصل مع مطور الباك اند' 
            : 'Service unavailable - please contact backend developer'
        )
      } else {
        toast.error(language === 'ar' ? 'حدث خطأ أثناء الإضافة' : 'Error adding match')
      }
    } catch (error) {
      console.error('Error adding match:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service unavailable')
    } finally {
      setSaving(false)
    }
  }

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingMatch) return

    try {
      setSaving(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-group-supervisor/matches/${editingMatch.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(editingMatch)
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تم تحديث المباراة بنجاح' : 'Match updated successfully')
        setShowEditModal(false)
        setEditingMatch(null)
        fetchMatches()
      } else if (response.status === 404) {
        toast.error(
          language === 'ar' 
            ? 'الخدمة غير متاحة - يرجى التواصل مع مطور الباك اند' 
            : 'Service unavailable - please contact backend developer'
        )
      } else {
        toast.error(language === 'ar' ? 'حدث خطأ أثناء التحديث' : 'Error updating match')
      }
    } catch (error) {
      console.error('Error updating match:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service unavailable')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMatch = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه المباراة؟' : 'Are you sure you want to delete this match?')) {
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-group-supervisor/matches/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تم حذف المباراة' : 'Match deleted')
        fetchMatches()
      } else if (response.status === 404) {
        toast.error(language === 'ar' ? 'الخدمة غير متاحة' : 'Service unavailable')
      }
    } catch (error) {
      console.error('Error deleting match:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة' : 'Service unavailable')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { icon: Clock, color: 'bg-blue-100 text-blue-700', label: language === 'ar' ? 'مجدولة' : 'Scheduled' }
      case 'completed':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: language === 'ar' ? 'مكتملة' : 'Completed' }
      case 'cancelled':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: language === 'ar' ? 'ملغية' : 'Cancelled' }
      default:
        return { icon: AlertCircle, color: 'bg-gray-100 text-gray-600', label: status }
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredMatches = matches.filter(match => 
    filter === 'all' || match.status === filter
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إدارة المباريات' : 'Matches Management'}
              </h1>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-600 to-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة مباراة' : 'Add Match'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? 'bg-green-600 text-white' : ''}
            >
              {status === 'all' && (language === 'ar' ? 'الكل' : 'All')}
              {status === 'scheduled' && (language === 'ar' ? 'مجدولة' : 'Scheduled')}
              {status === 'completed' && (language === 'ar' ? 'مكتملة' : 'Completed')}
              {status === 'cancelled' && (language === 'ar' ? 'ملغية' : 'Cancelled')}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : filteredMatches.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد مباريات' : 'No Matches Found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'ar' ? 'ابدأ بإضافة مباراة جديدة' : 'Start by adding a new match'}
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة مباراة' : 'Add Match'}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match, index) => {
              const status = getStatusBadge(match.status)
              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        match.homeAway === 'home' 
                          ? 'bg-gradient-to-br from-green-500 to-cyan-500' 
                          : 'bg-gradient-to-br from-orange-500 to-red-500'
                      }`}>
                        {match.homeAway === 'home' 
                          ? <Home className="w-7 h-7 text-white" />
                          : <Plane className="w-7 h-7 text-white" />
                        }
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          {match.ageGroupName} vs {match.opponent}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {match.homeAway === 'home' 
                            ? (language === 'ar' ? 'مباراة منزلية' : 'Home Match')
                            : (language === 'ar' ? 'مباراة خارجية' : 'Away Match')
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => handleEditMatch(match)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteMatch(match.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(match.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{match.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{match.location || (language === 'ar' ? 'لم يحدد' : 'Not set')}</span>
                    </div>
                    {match.status === 'completed' && match.result && (
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>{match.result.our} - {match.result.opponent}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إضافة مباراة جديدة' : 'Add New Match'}
              </h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الفئة السنية' : 'Age Group'} *
                </label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500"
                  value={newMatch.ageGroupId}
                  onChange={(e) => setNewMatch({ ...newMatch, ageGroupId: e.target.value })}
                >
                  <option value="">{language === 'ar' ? 'اختر الفئة' : 'Select Group'}</option>
                  {ageGroups.map(group => (
                    <option key={group.id} value={group.id}>
                      {language === 'ar' ? group.nameAr : group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الفريق المنافس' : 'Opponent Team'} *
                </label>
                <Input 
                  value={newMatch.opponent}
                  onChange={(e) => setNewMatch({ ...newMatch, opponent: e.target.value })}
                  placeholder={language === 'ar' ? 'اسم الفريق المنافس' : 'Opponent team name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'نوع المباراة' : 'Match Type'} *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="homeAway"
                      checked={newMatch.homeAway === 'home'}
                      onChange={() => setNewMatch({ ...newMatch, homeAway: 'home' })}
                      className="text-green-600"
                    />
                    <Home className="w-4 h-4" />
                    <span>{language === 'ar' ? 'منزلية' : 'Home'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="homeAway"
                      checked={newMatch.homeAway === 'away'}
                      onChange={() => setNewMatch({ ...newMatch, homeAway: 'away' })}
                      className="text-green-600"
                    />
                    <Plane className="w-4 h-4" />
                    <span>{language === 'ar' ? 'خارجية' : 'Away'}</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'التاريخ' : 'Date'} *
                  </label>
                  <Input 
                    type="date" 
                    value={newMatch.date}
                    onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوقت' : 'Time'} *
                  </label>
                  <Input 
                    type="time" 
                    value={newMatch.time}
                    onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'المكان' : 'Location'}
                </label>
                <Input 
                  value={newMatch.location}
                  onChange={(e) => setNewMatch({ ...newMatch, location: e.target.value })}
                  placeholder={language === 'ar' ? 'ملعب المباراة' : 'Match venue'}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleAddMatch}
                disabled={saving || !newMatch.ageGroupId || !newMatch.opponent || !newMatch.date || !newMatch.time}
                className="flex-1 bg-green-600 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إضافة' : 'Add')}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {showEditModal && editingMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'تعديل المباراة' : 'Edit Match'}
              </h2>
              <button onClick={() => { setShowEditModal(false); setEditingMatch(null); }}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الفريق المنافس' : 'Opponent Team'}
                </label>
                <Input 
                  value={editingMatch.opponent}
                  onChange={(e) => setEditingMatch({ ...editingMatch, opponent: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </label>
                  <Input 
                    type="date" 
                    value={editingMatch.date}
                    onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوقت' : 'Time'}
                  </label>
                  <Input 
                    type="time" 
                    value={editingMatch.time}
                    onChange={(e) => setEditingMatch({ ...editingMatch, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'المكان' : 'Location'}
                </label>
                <Input 
                  value={editingMatch.location}
                  onChange={(e) => setEditingMatch({ ...editingMatch, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <select
                  value={editingMatch.status}
                  onChange={(e) => setEditingMatch({ ...editingMatch, status: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="scheduled">{language === 'ar' ? 'مجدولة' : 'Scheduled'}</option>
                  <option value="completed">{language === 'ar' ? 'مكتملة' : 'Completed'}</option>
                  <option value="cancelled">{language === 'ar' ? 'ملغية' : 'Cancelled'}</option>
                </select>
              </div>

              {editingMatch.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'النتيجة' : 'Result'}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder={language === 'ar' ? 'فريقنا' : 'Our score'}
                      value={editingMatch.result?.our || ''}
                      onChange={(e) => setEditingMatch({ 
                        ...editingMatch, 
                        result: { 
                          our: parseInt(e.target.value) || 0, 
                          opponent: editingMatch.result?.opponent || 0 
                        }
                      })}
                      className="w-20 text-center"
                      min={0}
                    />
                    <span className="font-bold">-</span>
                    <Input 
                      type="number" 
                      placeholder={language === 'ar' ? 'المنافس' : 'Opponent'}
                      value={editingMatch.result?.opponent || ''}
                      onChange={(e) => setEditingMatch({ 
                        ...editingMatch, 
                        result: { 
                          our: editingMatch.result?.our || 0, 
                          opponent: parseInt(e.target.value) || 0 
                        }
                      })}
                      className="w-20 text-center"
                      min={0}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => { setShowEditModal(false); setEditingMatch(null); }} className="flex-1">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 bg-green-600 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'حفظ' : 'Save')}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function MatchesPage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <MatchesContent />
    </ProtectedRoute>
  )
}
