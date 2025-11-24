'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import coachService from '@/services/coach'
import type {
  Availability,
  DaySchedule,
  TimeSlot,
  DateOverride,
  BookingSettings,
  CancellationPolicy,
} from '@/types/coach'
import {
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Loader2,
  XCircle,
  CheckCircle,
  Settings,
  Ban,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

const AvailabilityManagementPage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    'schedule' | 'blocked' | 'settings'
  >('schedule')

  // Form states
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([])
  const [blockDateInput, setBlockDateInput] = useState('')
  const [blockReasonInput, setBlockReasonInput] = useState('')
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({
    minAdvanceBooking: 24,
    maxAdvanceBooking: 720,
    allowSameDayBooking: false,
  })
  const [cancellationPolicy, setCancellationPolicy] =
    useState<CancellationPolicy>({
      refundableHours: 24,
      refundPercentage: 100,
      policyText: '',
      policyTextAr: '',
    })

  const daysOfWeek = [
    { value: 'monday', label: 'الإثنين', labelEn: 'Monday' },
    { value: 'tuesday', label: 'الثلاثاء', labelEn: 'Tuesday' },
    { value: 'wednesday', label: 'الأربعاء', labelEn: 'Wednesday' },
    { value: 'thursday', label: 'الخميس', labelEn: 'Thursday' },
    { value: 'friday', label: 'الجمعة', labelEn: 'Friday' },
    { value: 'saturday', label: 'السبت', labelEn: 'Saturday' },
    { value: 'sunday', label: 'الأحد', labelEn: 'Sunday' },
  ]

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      setError(null)

      const availData = await coachService.getMyAvailability()
      setAvailability(availData)
      setWeeklySchedule(availData.weeklySchedule || [])

      if (availData.bookingSettings) {
        setBookingSettings(availData.bookingSettings)
      }

      if (availData.cancellationPolicy) {
        setCancellationPolicy(availData.cancellationPolicy)
      }
    } catch (err: any) {
      console.error('Error fetching availability:', err)
      setError(err.message || 'Failed to load availability')
    } finally {
      setLoading(false)
    }
  }

  const initializeDaySchedule = (day: string): DaySchedule => {
    return {
      day: day as any,
      isAvailable: false,
      slots: [],
    }
  }

  const getDaySchedule = (day: string): DaySchedule => {
    return (
      weeklySchedule.find((d) => d.day === day) || initializeDaySchedule(day)
    )
  }

  const toggleDayAvailability = (day: string) => {
    setWeeklySchedule((prev) => {
      const existing = prev.find((d) => d.day === day)
      if (existing) {
        return prev.map((d) =>
          d.day === day ? { ...d, isAvailable: !d.isAvailable } : d
        )
      } else {
        return [...prev, { ...initializeDaySchedule(day), isAvailable: true }]
      }
    })
  }

  const addTimeSlot = (day: string) => {
    setWeeklySchedule((prev) => {
      const daySchedule = getDaySchedule(day)
      const newSlot: TimeSlot = {
        startTime: '09:00',
        endTime: '10:00',
      }

      if (prev.find((d) => d.day === day)) {
        return prev.map((d) =>
          d.day === day ? { ...d, slots: [...d.slots, newSlot] } : d
        )
      } else {
        return [
          ...prev,
          { day: day as any, isAvailable: true, slots: [newSlot] },
        ]
      }
    })
  }

  const updateTimeSlot = (
    day: string,
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              slots: d.slots.map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
              ),
            }
          : d
      )
    )
  }

  const removeTimeSlot = (day: string, index: number) => {
    setWeeklySchedule((prev) =>
      prev.map((d) =>
        d.day === day
          ? { ...d, slots: d.slots.filter((_, i) => i !== index) }
          : d
      )
    )
  }

  const handleSaveSchedule = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      await coachService.updateWeeklySchedule(weeklySchedule)

      setSuccessMessage(
        language === 'ar'
          ? 'تم حفظ الجدول بنجاح!'
          : 'Schedule saved successfully!'
      )
    } catch (err: any) {
      console.error('Error saving schedule:', err)
      setError(err.message || 'Failed to save schedule')
    } finally {
      setSaving(false)
    }
  }

  const handleBlockDate = async () => {
    if (!blockDateInput) return

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      await coachService.blockDate(blockDateInput, blockReasonInput)

      setSuccessMessage(
        language === 'ar'
          ? 'تم حظر التاريخ بنجاح!'
          : 'Date blocked successfully!'
      )

      setBlockDateInput('')
      setBlockReasonInput('')
      fetchAvailability()
    } catch (err: any) {
      console.error('Error blocking date:', err)
      setError(err.message || 'Failed to block date')
    } finally {
      setSaving(false)
    }
  }

  const handleUnblockDate = async (date: string) => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      await coachService.unblockDate(date)

      setSuccessMessage(
        language === 'ar'
          ? 'تم إلغاء حظر التاريخ بنجاح!'
          : 'Date unblocked successfully!'
      )

      fetchAvailability()
    } catch (err: any) {
      console.error('Error unblocking date:', err)
      setError(err.message || 'Failed to unblock date')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      await coachService.updateBookingSettings(bookingSettings)
      await coachService.updateCancellationPolicy(cancellationPolicy)

      setSuccessMessage(
        language === 'ar'
          ? 'تم حفظ الإعدادات بنجاح!'
          : 'Settings saved successfully!'
      )
    } catch (err: any) {
      console.error('Error saving settings:', err)
      setError(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-12 h-12 text-purple-600" />
          </motion.div>
          <p className="text-gray-600 text-lg">
            {language === 'ar'
              ? 'جاري تحميل التوفر...'
              : 'Loading Availability...'}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === 'ar' ? 'رجوع' : 'Back'}</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'إدارة التوفر' : 'Availability Management'}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-semibold">{successMessage}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-semibold">{error}</p>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'schedule'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              {language === 'ar' ? 'الجدول الأسبوعي' : 'Weekly Schedule'}
            </button>
            <button
              onClick={() => setActiveTab('blocked')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'blocked'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Ban className="w-5 h-5" />
              {language === 'ar' ? 'التواريخ المحظورة' : 'Blocked Dates'}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'settings'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </button>
          </div>

          <div className="p-6">
            {/* Weekly Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                {daysOfWeek.map((day) => {
                  const daySchedule = getDaySchedule(day.value)
                  return (
                    <motion.div
                      key={day.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={daySchedule.isAvailable}
                              onChange={() => toggleDayAvailability(day.value)}
                              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="font-bold text-gray-900 text-lg">
                              {language === 'ar' ? day.label : day.labelEn}
                            </span>
                          </label>
                        </div>
                        {daySchedule.isAvailable && (
                          <button
                            type="button"
                            onClick={() => addTimeSlot(day.value)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            {language === 'ar' ? 'إضافة فترة' : 'Add Slot'}
                          </button>
                        )}
                      </div>

                      {daySchedule.isAvailable && (
                        <div className="space-y-3 mt-4">
                          {daySchedule.slots.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">
                              {language === 'ar'
                                ? 'لا توجد فترات زمنية. انقر على "إضافة فترة" لإضافة واحدة.'
                                : 'No time slots. Click "Add Slot" to add one.'}
                            </p>
                          ) : (
                            daySchedule.slots.map((slot, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 bg-white p-4 rounded-lg"
                              >
                                <Clock className="w-5 h-5 text-purple-600" />
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      day.value,
                                      index,
                                      'startTime',
                                      e.target.value
                                    )
                                  }
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <span className="text-gray-600">-</span>
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      day.value,
                                      index,
                                      'endTime',
                                      e.target.value
                                    )
                                  }
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTimeSlot(day.value, index)
                                  }
                                  className="text-red-600 hover:text-red-700 ml-auto"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </motion.div>
                  )
                })}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveSchedule}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>
                          {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>
                          {language === 'ar' ? 'حفظ الجدول' : 'Save Schedule'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Blocked Dates Tab */}
            {activeTab === 'blocked' && (
              <div className="space-y-6">
                {/* Add Blocked Date */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Ban className="w-5 h-5 text-red-600" />
                    {language === 'ar' ? 'حظر تاريخ' : 'Block Date'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="date"
                      value={blockDateInput}
                      onChange={(e) => setBlockDateInput(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={blockReasonInput}
                      onChange={(e) => setBlockReasonInput(e.target.value)}
                      placeholder={
                        language === 'ar'
                          ? 'السبب (اختياري)'
                          : 'Reason (optional)'
                      }
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleBlockDate}
                      disabled={!blockDateInput || saving}
                      className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Ban className="w-5 h-5" />
                          {language === 'ar' ? 'حظر' : 'Block'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Blocked Dates List */}
                <div className="space-y-3">
                  {availability?.dateOverrides &&
                  availability.dateOverrides.length > 0 ? (
                    availability.dateOverrides
                      .filter((override) => !override.isAvailable)
                      .map((override, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white p-4 rounded-xl flex items-center justify-between border border-gray-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-red-100 rounded-lg p-3">
                              <Ban className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {new Date(override.date).toLocaleDateString(
                                  language === 'ar' ? 'ar-SA' : 'en-US',
                                  {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  }
                                )}
                              </p>
                              {override.reason && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {language === 'ar' && override.reasonAr
                                    ? override.reasonAr
                                    : override.reason}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUnblockDate(override.date)}
                            disabled={saving}
                            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2 disabled:opacity-50"
                          >
                            <RefreshCw className="w-5 h-5" />
                            {language === 'ar' ? 'إلغاء الحظر' : 'Unblock'}
                          </button>
                        </motion.div>
                      ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {language === 'ar'
                          ? 'لا توجد تواريخ محظورة'
                          : 'No blocked dates'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Booking Settings */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    {language === 'ar' ? 'إعدادات الحجز' : 'Booking Settings'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'الحد الأدنى للحجز المسبق (ساعات)'
                          : 'Minimum Advance Booking (hours)'}
                      </label>
                      <input
                        type="number"
                        value={bookingSettings.minAdvanceBooking}
                        onChange={(e) =>
                          setBookingSettings({
                            ...bookingSettings,
                            minAdvanceBooking: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'الحد الأقصى للحجز المسبق (ساعات)'
                          : 'Maximum Advance Booking (hours)'}
                      </label>
                      <input
                        type="number"
                        value={bookingSettings.maxAdvanceBooking}
                        onChange={(e) =>
                          setBookingSettings({
                            ...bookingSettings,
                            maxAdvanceBooking: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingSettings.allowSameDayBooking}
                          onChange={(e) =>
                            setBookingSettings({
                              ...bookingSettings,
                              allowSameDayBooking: e.target.checked,
                            })
                          }
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="font-medium text-gray-700">
                          {language === 'ar'
                            ? 'السماح بالحجز في نفس اليوم'
                            : 'Allow Same Day Booking'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    {language === 'ar'
                      ? 'سياسة الإلغاء'
                      : 'Cancellation Policy'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'ساعات الاسترداد (قبل الجلسة)'
                          : 'Refundable Hours (before session)'}
                      </label>
                      <input
                        type="number"
                        value={cancellationPolicy.refundableHours}
                        onChange={(e) =>
                          setCancellationPolicy({
                            ...cancellationPolicy,
                            refundableHours: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'نسبة الاسترداد (%)'
                          : 'Refund Percentage (%)'}
                      </label>
                      <input
                        type="number"
                        value={cancellationPolicy.refundPercentage}
                        onChange={(e) =>
                          setCancellationPolicy({
                            ...cancellationPolicy,
                            refundPercentage: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'نص السياسة (English)'
                          : 'Policy Text (English)'}
                      </label>
                      <textarea
                        value={cancellationPolicy.policyText}
                        onChange={(e) =>
                          setCancellationPolicy({
                            ...cancellationPolicy,
                            policyText: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Describe your cancellation policy..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar'
                          ? 'نص السياسة (العربية)'
                          : 'Policy Text (Arabic)'}
                      </label>
                      <textarea
                        value={cancellationPolicy.policyTextAr || ''}
                        onChange={(e) =>
                          setCancellationPolicy({
                            ...cancellationPolicy,
                            policyTextAr: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="اكتب سياسة الإلغاء..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>
                          {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>
                          {language === 'ar'
                            ? 'حفظ الإعدادات'
                            : 'Save Settings'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvailabilityManagementPage
