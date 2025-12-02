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
  GraduationCap,
  Mail,
  Phone,
  Award,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface Coach {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  specialization?: string
  assignedGroups: string[]
  experience?: number
  certifications?: string[]
  status: 'active' | 'inactive'
}

function CoachesContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      setLoading(true)
      const data: Coach[] = []
      setCoaches(data)
    } catch (error) {
      console.error('Error fetching coaches:', error)
      setCoaches([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCoaches = coaches.filter(coach =>
    coach.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                {language === 'ar' ? 'إدارة المدربين' : 'Coaches Management'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={language === 'ar' ? 'بحث عن مدرب...' : 'Search coaches...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : filteredCoaches.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا يوجد مدربين' : 'No Coaches Found'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar' ? 'لم يتم تعيين أي مدربين بعد' : 'No coaches have been assigned yet'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach, index) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {coach.firstName[0]}{coach.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{coach.firstName} {coach.lastName}</h3>
                    <p className="text-sm text-gray-500">{coach.specialization || (language === 'ar' ? 'مدرب عام' : 'General Coach')}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    coach.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {coach.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{coach.email}</span>
                  </div>
                  {coach.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{coach.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{coach.assignedGroups.length} {language === 'ar' ? 'فئات معينة' : 'assigned groups'}</span>
                  </div>
                  {coach.experience && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>{coach.experience} {language === 'ar' ? 'سنوات خبرة' : 'years experience'}</span>
                    </div>
                  )}
                </div>

                {coach.certifications && coach.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {coach.certifications.map((cert, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {cert}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function CoachesPage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <CoachesContent />
    </ProtectedRoute>
  )
}
