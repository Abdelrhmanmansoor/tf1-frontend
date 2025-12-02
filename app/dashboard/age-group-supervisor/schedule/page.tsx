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
  Calendar,
  Clock,
  MapPin,
  Users,
  X,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface TrainingSession {
  id: string
  ageGroupId: string
  ageGroupName: string
  date: string
  time: string
  duration: number
  location: string
  coachId: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface AgeGroup {
  id: string
  name: string
  nameAr: string
}

function ScheduleContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newSession, setNewSession] = useState({
    ageGroupId: '',
    date: '',
    time: '',
    duration: 90,
    location: ''
  })

  useEffect(() => {
    fetchSchedule()
    fetchAgeGroups()
  }, [])

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const data = await ageGroupSupervisorService.getTrainingSchedule()
      setSessions(data)
    } catch (error) {
      console.error('Error fetching schedule:', error)
      setSessions([])
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

  const handleAddSession = async () => {
    if (!newSession.ageGroupId || !newSession.date || !newSession.time) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-group-supervisor/schedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ageGroupId: newSession.ageGroupId,
            date: newSession.date,
            time: newSession.time,
            duration: newSession.duration,
            location: newSession.location || (language === 'ar' ? 'ملعب النادي الرئيسي' : 'Main Club Field'),
            status: 'scheduled'
          })
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تمت إضافة جلسة التدريب بنجاح' : 'Training session added successfully')
        setShowAddModal(false)
        setNewSession({ ageGroupId: '', date: '', time: '', duration: 90, location: '' })
        fetchSchedule()
      } else if (response.status === 404) {
        toast.error(
          language === 'ar' 
            ? 'الخدمة غير متاحة - يرجى التواصل مع مطور الباك اند' 
            : 'Service unavailable - please contact backend developer'
        )
      } else {
        toast.error(language === 'ar' ? 'حدث خطأ أثناء الإضافة' : 'Error adding training session')
      }
    } catch (error) {
      console.error('Error adding session:', error)
      toast.error(
        language === 'ar' 
          ? 'الخدمة غير متاحة حالياً' 
          : 'Service unavailable'
      )
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { icon: Clock, color: 'bg-blue-100 text-blue-700', label: language === 'ar' ? 'مجدول' : 'Scheduled' }
      case 'completed':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: language === 'ar' ? 'مكتمل' : 'Completed' }
      case 'cancelled':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: language === 'ar' ? 'ملغي' : 'Cancelled' }
      default:
        return { icon: AlertCircle, color: 'bg-gray-100 text-gray-600', label: status }
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
                {language === 'ar' ? 'جدول التدريبات' : 'Training Schedule'}
              </h1>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-600 to-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة تدريب' : 'Add Training'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : sessions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد تدريبات مجدولة' : 'No Scheduled Trainings'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'ar' ? 'ابدأ بإضافة جلسة تدريب جديدة' : 'Start by adding a new training session'}
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة تدريب' : 'Add Training'}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => {
              const status = getStatusBadge(session.status)
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{session.ageGroupName}</h3>
                        <p className="text-sm text-gray-500">{formatDate(session.date)}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <status.icon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{session.duration} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{session.location}</span>
                    </div>
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
                {language === 'ar' ? 'إضافة جلسة تدريب' : 'Add Training Session'}
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
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={newSession.ageGroupId}
                  onChange={(e) => setNewSession({ ...newSession, ageGroupId: e.target.value })}
                >
                  <option value="">{language === 'ar' ? 'اختر الفئة' : 'Select Group'}</option>
                  {ageGroups.map(group => (
                    <option key={group.id} value={group.id}>
                      {language === 'ar' ? group.nameAr : group.name}
                    </option>
                  ))}
                </select>
                {ageGroups.length === 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    {language === 'ar' ? 'لا توجد فئات - يرجى إضافة فئة أولاً' : 'No groups - please add a group first'}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'التاريخ' : 'Date'} *
                  </label>
                  <Input 
                    type="date" 
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الوقت' : 'Time'} *
                  </label>
                  <Input 
                    type="time" 
                    value={newSession.time}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'المدة (بالدقائق)' : 'Duration (minutes)'}
                </label>
                <Input 
                  type="number" 
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) || 90 })}
                  placeholder="90" 
                  min={15}
                  max={240}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'المكان' : 'Location'}
                </label>
                <Input 
                  value={newSession.location}
                  onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                  placeholder={language === 'ar' ? 'ملعب النادي الرئيسي' : 'Main Club Field'} 
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleAddSession}
                disabled={saving || !newSession.ageGroupId || !newSession.date || !newSession.time}
                className="flex-1 bg-green-600 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إضافة' : 'Add')}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function SchedulePage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <ScheduleContent />
    </ProtectedRoute>
  )
}
