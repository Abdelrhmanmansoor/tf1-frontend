'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Search,
  Loader2,
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle
} from 'lucide-react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin?: string
}

export default function UsersPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  useEffect(() => {
    if (user?.role !== 'leader') {
      router.push('/dashboard/leader/fallback')
      return
    }
    fetchUsers()
  }, [user, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/admin/users`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.ok) {
        const result = await response.json()
        setUsers(result.data?.users || [])
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/admin/users/${userId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated')
        fetchUsers()
      } else {
        toast.info(language === 'ar' ? 'الخدمة قيد التطوير' : 'Service under development')
      }
    } catch (error) {
      toast.info(language === 'ar' ? 'الخدمة قيد التطوير' : 'Service under development')
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const roles = ['all', 'player', 'coach', 'club', 'specialist', 'team', 'leader']
  const roleLabels: Record<string, { en: string; ar: string }> = {
    all: { en: 'All', ar: 'الكل' },
    player: { en: 'Player', ar: 'لاعب' },
    coach: { en: 'Coach', ar: 'مدرب' },
    club: { en: 'Club', ar: 'نادي' },
    specialist: { en: 'Specialist', ar: 'متخصص' },
    team: { en: 'Team', ar: 'فريق' },
    leader: { en: 'Leader', ar: 'قائد' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/leader')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
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
              placeholder={language === 'ar' ? 'بحث عن مستخدم...' : 'Search users...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {roles.map((role) => (
              <Button
                key={role}
                variant={roleFilter === role ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter(role)}
                className={roleFilter === role ? 'bg-indigo-600 text-white' : ''}
              >
                {language === 'ar' ? roleLabels[role].ar : roleLabels[role].en}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا يوجد مستخدمين' : 'No Users Found'}
            </h3>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'المستخدم' : 'User'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'الدور' : 'Role'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'تاريخ التسجيل' : 'Joined'}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      {language === 'ar' ? 'إجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((u, index) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          {language === 'ar' ? roleLabels[u.role]?.ar || u.role : roleLabels[u.role]?.en || u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          u.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : u.status === 'suspended'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.status === 'active' && <CheckCircle className="w-3 h-3" />}
                          {u.status === 'suspended' && <Ban className="w-3 h-3" />}
                          {u.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'موقوف' : 'Suspended')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(u.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/profile/${u.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {u.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(u.id, 'suspended')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(u.id, 'active')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
