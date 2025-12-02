'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  ArrowLeft,
  Search,
  Loader2,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  User
} from 'lucide-react'

interface Registration {
  id: string
  playerName: string
  dateOfBirth: string
  age: number
  parentName: string
  parentPhone: string
  parentEmail?: string
  requestedAgeGroup: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
}

function RegistrationsContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    fetchRegistrations()
  }, [filter])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const data: Registration[] = []
      setRegistrations(data)
    } catch (error) {
      console.error('Error fetching registrations:', error)
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    console.log('Approving:', id)
  }

  const handleReject = async (id: string) => {
    console.log('Rejecting:', id)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: language === 'ar' ? 'معلق' : 'Pending' }
      case 'approved':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: language === 'ar' ? 'مقبول' : 'Approved' }
      case 'rejected':
        return { icon: XCircle, color: 'bg-red-100 text-red-700', label: language === 'ar' ? 'مرفوض' : 'Rejected' }
      default:
        return { icon: Clock, color: 'bg-gray-100 text-gray-600', label: status }
    }
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
                {language === 'ar' ? 'طلبات التسجيل' : 'Registration Requests'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? 'bg-green-600 text-white' : ''}
            >
              {status === 'all' && (language === 'ar' ? 'الكل' : 'All')}
              {status === 'pending' && (language === 'ar' ? 'معلق' : 'Pending')}
              {status === 'approved' && (language === 'ar' ? 'مقبول' : 'Approved')}
              {status === 'rejected' && (language === 'ar' ? 'مرفوض' : 'Rejected')}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : registrations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد طلبات تسجيل' : 'No Registration Requests'}
            </h3>
            <p className="text-gray-500">
              {filter === 'pending' 
                ? (language === 'ar' ? 'لا توجد طلبات معلقة حالياً' : 'No pending requests at the moment')
                : (language === 'ar' ? 'لا توجد طلبات في هذه الفئة' : 'No requests in this category')
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg, index) => {
              const status = getStatusBadge(reg.status)
              return (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{reg.playerName}</h3>
                        <p className="text-sm text-gray-500">{reg.age} {language === 'ar' ? 'سنة' : 'years old'}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <status.icon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'الفئة المطلوبة' : 'Requested Group'}</p>
                      <p className="text-sm font-medium">{reg.requestedAgeGroup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'ولي الأمر' : 'Parent'}</p>
                      <p className="text-sm font-medium">{reg.parentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'الهاتف' : 'Phone'}</p>
                      <p className="text-sm font-medium">{reg.parentPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'تاريخ الطلب' : 'Submitted'}</p>
                      <p className="text-sm font-medium">{new Date(reg.submittedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {reg.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        onClick={() => handleApprove(reg.id)}
                        className="flex-1 bg-green-600 text-white hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'قبول' : 'Approve'}
                      </Button>
                      <Button 
                        onClick={() => handleReject(reg.id)}
                        variant="outline"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'رفض' : 'Reject'}
                      </Button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default function RegistrationsPage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <RegistrationsContent />
    </ProtectedRoute>
  )
}
