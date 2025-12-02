'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import ageGroupSupervisorService from '@/services/age-group-supervisor'
import {
  ArrowLeft,
  Search,
  Users,
  Loader2,
  User,
  Phone,
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

interface Player {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  position?: string
  ageGroupId: string
  ageGroupName: string
  parentName?: string
  parentPhone?: string
  status: 'active' | 'inactive' | 'pending'
}

function PlayersContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const groupFilter = searchParams.get('group')
  
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchPlayers()
  }, [groupFilter])

  const fetchPlayers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/age-group-supervisor/players${groupFilter ? `?ageGroupId=${groupFilter}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        setPlayers(result.data?.players || [])
      } else {
        setPlayers([])
      }
    } catch (error) {
      console.error('Error fetching players:', error)
      setPlayers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter(player => {
    const matchesSearch = 
      player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: language === 'ar' ? 'نشط' : 'Active' }
      case 'pending':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: language === 'ar' ? 'معلق' : 'Pending' }
      case 'inactive':
        return { icon: XCircle, color: 'bg-gray-100 text-gray-600', label: language === 'ar' ? 'غير نشط' : 'Inactive' }
      default:
        return { icon: User, color: 'bg-gray-100 text-gray-600', label: status }
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
                {language === 'ar' ? 'إدارة اللاعبين' : 'Players Management'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={language === 'ar' ? 'بحث عن لاعب...' : 'Search players...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
            <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
            <option value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</option>
            <option value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : filteredPlayers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا يوجد لاعبين' : 'No Players Found'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar' ? 'لم يتم تسجيل أي لاعبين بعد' : 'No players have been registered yet'}
            </p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'اللاعب' : 'Player'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'العمر' : 'Age'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'الفئة' : 'Group'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'ولي الأمر' : 'Parent'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPlayers.map((player) => {
                    const status = getStatusBadge(player.status)
                    return (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {player.firstName[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{player.firstName} {player.lastName}</p>
                              <p className="text-sm text-gray-500">{player.position || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{player.age} {language === 'ar' ? 'سنة' : 'years'}</td>
                        <td className="px-6 py-4 text-gray-600">{player.ageGroupName}</td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{player.parentName || '-'}</p>
                          <p className="text-sm text-gray-500">{player.parentPhone || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <status.icon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function PlayersPage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <PlayersContent />
    </ProtectedRoute>
  )
}
