'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import clubService from '@/services/club'
import type { ClubMember, MemberListParams } from '@/types/club'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Check,
  X,
  MoreVertical,
  Shield,
  Mail,
  Calendar,
  Loader2,
  ChevronLeft,
  AlertCircle,
  UserCog,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'

const MembersPage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [members, setMembers] = useState<ClubMember[]>([])
  const [pendingRequests, setPendingRequests] = useState<ClubMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
    fetchPendingRequests()
  }, [filterType, filterStatus])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: MemberListParams = {}
      if (filterType) params.memberType = filterType as any
      if (filterStatus) params.status = filterStatus as any

      const { members: membersData } = await clubService.getMembers(params)
      setMembers(membersData)
    } catch (err: any) {
      console.error('Error fetching members:', err)
      setError(err.message || 'Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingRequests = async () => {
    try {
      const { requests } = await clubService.getPendingRequests()
      setPendingRequests(requests)
    } catch (err: any) {
      console.error('Error fetching pending requests:', err)
    }
  }

  const handleApprove = async (memberId: string) => {
    try {
      setActionLoading(memberId)
      await clubService.approveMember(memberId)

      // Refresh data
      await Promise.all([fetchMembers(), fetchPendingRequests()])

      // Show success (you can add a toast notification here)
    } catch (err: any) {
      console.error('Error approving member:', err)
      alert(err.message || 'Failed to approve member')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (memberId: string) => {
    const reason = prompt(
      language === 'ar'
        ? 'الرجاء إدخال سبب الرفض:'
        : 'Please enter rejection reason:'
    )

    if (!reason) return

    try {
      setActionLoading(memberId)
      await clubService.rejectMember(memberId, { reason })

      // Refresh data
      await fetchPendingRequests()
    } catch (err: any) {
      console.error('Error rejecting member:', err)
      alert(err.message || 'Failed to reject member')
    } finally {
      setActionLoading(null)
    }
  }

  const getMemberTypeBadge = (type: string) => {
    const badges = {
      player: {
        label: language === 'ar' ? 'لاعب' : 'Player',
        color: 'bg-blue-100 text-blue-700',
      },
      coach: {
        label: language === 'ar' ? 'مدرب' : 'Coach',
        color: 'bg-green-100 text-green-700',
      },
      specialist: {
        label: language === 'ar' ? 'متخصص' : 'Specialist',
        color: 'bg-purple-100 text-purple-700',
      },
      staff: {
        label: language === 'ar' ? 'طاقم عمل' : 'Staff',
        color: 'bg-orange-100 text-orange-700',
      },
    }
    return badges[type as keyof typeof badges] || badges.player
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        label: language === 'ar' ? 'معلق' : 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
      },
      active: {
        label: language === 'ar' ? 'نشط' : 'Active',
        color: 'bg-green-100 text-green-700',
      },
      inactive: {
        label: language === 'ar' ? 'غير نشط' : 'Inactive',
        color: 'bg-gray-100 text-gray-700',
      },
      suspended: {
        label: language === 'ar' ? 'موقوف' : 'Suspended',
        color: 'bg-red-100 text-red-700',
      },
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      owner: { label: language === 'ar' ? 'مالك' : 'Owner', icon: Shield },
      admin_manager: {
        label: language === 'ar' ? 'مدير' : 'Admin',
        icon: Shield,
      },
      coach_manager: {
        label: language === 'ar' ? 'مدير تدريب' : 'Coach Manager',
        icon: UserCog,
      },
      regular_member: {
        label: language === 'ar' ? 'عضو عادي' : 'Member',
        icon: Users,
      },
    }
    return badges[role as keyof typeof badges] || badges.regular_member
  }

  const filteredMembers = members.filter((member) => {
    const user = typeof member.userId === 'object' ? member.userId : null
    const searchLower = searchQuery.toLowerCase()
    return (
      user?.fullName?.toLowerCase().includes(searchLower) ||
      user?.email?.toLowerCase().includes(searchLower) ||
      member.memberType?.toLowerCase().includes(searchLower)
    )
  })

  if (loading && members.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-7 h-7 text-blue-600" />
                  {language === 'ar' ? 'إدارة الأعضاء' : 'Member Management'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {language === 'ar'
                    ? 'إدارة أعضاء النادي والطلبات المعلقة'
                    : 'Manage club members and pending requests'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {language === 'ar' ? 'جميع الأعضاء' : 'All Members'} (
            {members.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {language === 'ar' ? 'الطلبات المعلقة' : 'Pending Requests'}
            {pendingRequests.length > 0 && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* All Members Tab */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'ابحث عن الأعضاء...'
                        : 'Search members...'
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {language === 'ar' ? 'جميع الأنواع' : 'All Types'}
                  </option>
                  <option value="player">
                    {language === 'ar' ? 'لاعب' : 'Player'}
                  </option>
                  <option value="coach">
                    {language === 'ar' ? 'مدرب' : 'Coach'}
                  </option>
                  <option value="specialist">
                    {language === 'ar' ? 'متخصص' : 'Specialist'}
                  </option>
                  <option value="staff">
                    {language === 'ar' ? 'طاقم عمل' : 'Staff'}
                  </option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">
                    {language === 'ar' ? 'جميع الحالات' : 'All Statuses'}
                  </option>
                  <option value="active">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </option>
                  <option value="inactive">
                    {language === 'ar' ? 'غير نشط' : 'Inactive'}
                  </option>
                  <option value="suspended">
                    {language === 'ar' ? 'موقوف' : 'Suspended'}
                  </option>
                </select>
              </div>
            </div>

            {/* Members List */}
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {language === 'ar' ? 'لا يوجد أعضاء' : 'No members found'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredMembers.map((member) => {
                  const user =
                    typeof member.userId === 'object' ? member.userId : null
                  const typeBadge = getMemberTypeBadge(member.memberType)
                  const statusBadge = getStatusBadge(member.status)
                  const roleBadge = getRoleBadge(member.memberRole)
                  const RoleIcon = roleBadge.icon

                  return (
                    <motion.div
                      key={member._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Avatar */}
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                            {user?.fullName?.charAt(0).toUpperCase() || '?'}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {user?.fullName || 'N/A'}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${typeBadge.color}`}
                              >
                                {typeBadge.label}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}
                              >
                                {statusBadge.label}
                              </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {user?.email || 'N/A'}
                              </div>
                              <div className="flex items-center gap-2">
                                <RoleIcon className="w-4 h-4" />
                                {roleBadge.label}
                              </div>
                              {member.sport && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">Sport:</span>
                                  <span className="font-medium">
                                    {member.sport}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {language === 'ar' ? 'انضم في' : 'Joined'}{' '}
                                {new Date(member.joinDate).toLocaleDateString(
                                  language === 'ar' ? 'ar-SA' : 'en-US'
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Pending Requests Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {language === 'ar'
                    ? 'لا توجد طلبات معلقة'
                    : 'No pending requests'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingRequests.map((request) => {
                  const user =
                    typeof request.userId === 'object' ? request.userId : null
                  const typeBadge = getMemberTypeBadge(request.memberType)

                  return (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Avatar */}
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center text-white text-xl font-bold">
                            {user?.fullName?.charAt(0).toUpperCase() || '?'}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {user?.fullName || 'N/A'}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${typeBadge.color}`}
                              >
                                {typeBadge.label}
                              </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {user?.email || 'N/A'}
                              </div>
                              {request.sport && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">Sport:</span>
                                  <span className="font-medium">
                                    {request.sport}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {language === 'ar'
                                  ? 'تاريخ الطلب'
                                  : 'Requested'}{' '}
                                {new Date(request.createdAt).toLocaleDateString(
                                  language === 'ar' ? 'ar-SA' : 'en-US'
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(request._id)}
                            disabled={actionLoading === request._id}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === request._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            {language === 'ar' ? 'قبول' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            disabled={actionLoading === request._id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            {language === 'ar' ? 'رفض' : 'Reject'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MembersPage
