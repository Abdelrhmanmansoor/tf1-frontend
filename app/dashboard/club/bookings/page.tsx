'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Loader2,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  User,
} from 'lucide-react'
import Link from 'next/link'
import clubService from '@/services/club'
import type { FacilityBooking } from '@/types/club'

const ClubBookingsPage = () => {
  const { language } = useLanguage()
  const [bookings, setBookings] = useState<FacilityBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (statusFilter !== 'all') params.status = statusFilter
      const response = await clubService.getBookings(params)
      setBookings(response.bookings)
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId: string) => {
    try {
      await clubService.approveBooking(bookingId)
      await fetchBookings()
    } catch (err: any) {
      alert(err.message || 'Failed to approve booking')
    }
  }

  const handleReject = async (bookingId: string) => {
    const reason = prompt(
      language === 'ar' ? 'سبب الرفض:' : 'Rejection reason:'
    )
    if (!reason) return
    try {
      await clubService.rejectBooking(bookingId, { reason })
      await fetchBookings()
    } catch (err: any) {
      alert(err.message || 'Failed to reject booking')
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'pending')
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (status === 'confirmed')
      return 'bg-green-100 text-green-700 border-green-200'
    if (status === 'rejected') return 'bg-red-100 text-red-700 border-red-200'
    if (status === 'cancelled')
      return 'bg-gray-100 text-gray-700 border-gray-200'
    if (status === 'completed')
      return 'bg-blue-100 text-blue-700 border-blue-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'العودة' : 'Back'}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'الحجوزات' : 'Facility Bookings'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {bookings.map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {booking.facilityName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{booking.bookedBy.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  </div>
                </div>
                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-green-600"
                      onClick={() => handleApprove(booking._id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {language === 'ar' ? 'قبول' : 'Approve'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-600"
                      onClick={() => handleReject(booking._id)}
                    >
                      <XCircle className="w-4 h-4" />
                      {language === 'ar' ? 'رفض' : 'Reject'}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {bookings.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500">
              {language === 'ar' ? 'لا توجد حجوزات' : 'No bookings'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubBookingsPage
