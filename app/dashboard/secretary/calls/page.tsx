'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import api from '@/services/api'
import {
  Phone,
  Loader2,
  Plus,
  X,
  ArrowLeft,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  User,
  Calendar,
  Search
} from 'lucide-react'
import Link from 'next/link'

interface Call {
  id: string
  type: 'incoming' | 'outgoing' | 'missed'
  contactName: string
  contactPhone: string
  date: string
  time: string
  duration: number
  notes?: string
  status: 'completed' | 'scheduled' | 'missed'
}

export default function SecretaryCallsPage() {
  const { language } = useLanguage()

  const [loading, setLoading] = useState(true)
  const [calls, setCalls] = useState<Call[]>([])
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const [newCall, setNewCall] = useState({
    type: 'outgoing' as Call['type'],
    contactName: '',
    contactPhone: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: 0,
    notes: '',
    status: 'scheduled' as Call['status']
  })

  const fetchCalls = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/secretary/calls')
      setCalls(response.data?.data?.calls || [])
      setFilteredCalls(response.data?.data?.calls || [])
    } catch (error) {
      console.error('Error fetching calls:', error)
      setCalls([])
      setFilteredCalls([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCalls()
  }, [fetchCalls])

  useEffect(() => {
    let filtered = [...calls]

    if (searchQuery) {
      filtered = filtered.filter(call => 
        call.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.contactPhone.includes(searchQuery)
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(call => call.type === filterType)
    }

    setFilteredCalls(filtered)
  }, [calls, searchQuery, filterType])

  const handleAddCall = async () => {
    if (!newCall.contactName || !newCall.contactPhone) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields')
      return
    }

    try {
      setSaving(true)
      await api.post('/secretary/calls', newCall)
      toast.success(language === 'ar' ? 'تم إضافة المكالمة بنجاح' : 'Call added successfully')
      setShowAddModal(false)
      setNewCall({
        type: 'outgoing',
        contactName: '',
        contactPhone: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        duration: 0,
        notes: '',
        status: 'scheduled'
      })
      fetchCalls()
    } catch (error: any) {
      console.error('Error adding call:', error)
      toast.error(language === 'ar' ? 'الخدمة غير متاحة حالياً' : 'Service temporarily unavailable')
    } finally {
      setSaving(false)
    }
  }

  const getCallIcon = (type: Call['type']) => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming className="w-5 h-5 text-green-600" />
      case 'outgoing':
        return <PhoneOutgoing className="w-5 h-5 text-blue-600" />
      case 'missed':
        return <PhoneMissed className="w-5 h-5 text-red-600" />
    }
  }

  const getTypeLabel = (type: Call['type']) => {
    const labels = {
      incoming: language === 'ar' ? 'واردة' : 'Incoming',
      outgoing: language === 'ar' ? 'صادرة' : 'Outgoing',
      missed: language === 'ar' ? 'فائتة' : 'Missed'
    }
    return labels[type]
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const incomingCount = calls.filter(c => c.type === 'incoming').length
  const outgoingCount = calls.filter(c => c.type === 'outgoing').length
  const missedCount = calls.filter(c => c.type === 'missed').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/secretary">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'سجل المكالمات' : 'Call Log'}
            </h1>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'مكالمة جديدة' : 'New Call'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{language === 'ar' ? 'واردة' : 'Incoming'}</p>
                <p className="text-3xl font-bold text-green-600">{incomingCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <PhoneIncoming className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{language === 'ar' ? 'صادرة' : 'Outgoing'}</p>
                <p className="text-3xl font-bold text-blue-600">{outgoingCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <PhoneOutgoing className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{language === 'ar' ? 'فائتة' : 'Missed'}</p>
                <p className="text-3xl font-bold text-red-600">{missedCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <PhoneMissed className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{language === 'ar' ? 'كل الأنواع' : 'All Types'}</option>
              <option value="incoming">{language === 'ar' ? 'واردة' : 'Incoming'}</option>
              <option value="outgoing">{language === 'ar' ? 'صادرة' : 'Outgoing'}</option>
              <option value="missed">{language === 'ar' ? 'فائتة' : 'Missed'}</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredCalls.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Phone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>{language === 'ar' ? 'لا توجد مكالمات' : 'No calls found'}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCalls.map((call) => (
                <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      call.type === 'incoming' ? 'bg-green-100' :
                      call.type === 'outgoing' ? 'bg-blue-100' :
                      'bg-red-100'
                    }`}>
                      {getCallIcon(call.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{call.contactName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          call.type === 'incoming' ? 'bg-green-100 text-green-700' :
                          call.type === 'outgoing' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {getTypeLabel(call.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{call.contactPhone}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {call.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {call.time}
                        </span>
                        {call.duration > 0 && (
                          <span>{formatDuration(call.duration)}</span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      window.location.href = `tel:${call.contactPhone}`
                    }}>
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                  {call.notes && (
                    <p className="text-sm text-gray-500 mt-2 ml-16 bg-gray-50 p-2 rounded">
                      {call.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {language === 'ar' ? 'إضافة مكالمة جديدة' : 'Add New Call'}
                </h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'نوع المكالمة' : 'Call Type'}
                  </label>
                  <select
                    value={newCall.type}
                    onChange={(e) => setNewCall({ ...newCall, type: e.target.value as Call['type'] })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="outgoing">{language === 'ar' ? 'صادرة' : 'Outgoing'}</option>
                    <option value="incoming">{language === 'ar' ? 'واردة' : 'Incoming'}</option>
                    <option value="missed">{language === 'ar' ? 'فائتة' : 'Missed'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'اسم جهة الاتصال' : 'Contact Name'} *
                  </label>
                  <input
                    type="text"
                    value={newCall.contactName}
                    onChange={(e) => setNewCall({ ...newCall, contactName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    value={newCall.contactPhone}
                    onChange={(e) => setNewCall({ ...newCall, contactPhone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'التاريخ' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={newCall.date}
                      onChange={(e) => setNewCall({ ...newCall, date: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'ar' ? 'الوقت' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={newCall.time}
                      onChange={(e) => setNewCall({ ...newCall, time: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'المدة (بالثواني)' : 'Duration (seconds)'}
                  </label>
                  <input
                    type="number"
                    value={newCall.duration}
                    onChange={(e) => setNewCall({ ...newCall, duration: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </label>
                  <textarea
                    value={newCall.notes}
                    onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  type="button"
                  onClick={handleAddCall}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إضافة' : 'Add')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
