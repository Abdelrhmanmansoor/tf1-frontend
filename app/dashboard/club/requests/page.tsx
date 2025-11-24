'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import clubService from '@/services/club'
import type { ClubMember } from '@/types/club'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Mail,
  Calendar,
  Loader2,
  ChevronLeft,
  AlertCircle,
  Clock,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Award,
  Hash,
  Briefcase,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

interface RequestDetails {
  notes?: string
  experience?: string
  qualifications?: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  documents?: Array<{
    type: string
    url: string
    name: string
  }>
}

const PendingRequestsPage = () => {
  const { language } = useLanguage()
  const router = useRouter()
  const [pendingRequests, setPendingRequests] = useState<ClubMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchPendingRequests()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPendingRequests(true)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchPendingRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const { requests } = await clubService.getPendingRequests()
      setPendingRequests(requests)
    } catch (err: any) {
      console.error('Error fetching pending requests:', err)
      setError(err.message || 'Failed to load pending requests')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleApprove = async (memberId: string) => {
    try {
      setActionLoading(memberId)
      await clubService.approveMember(memberId)

      // Remove from list with animation
      setPendingRequests(prev => prev.filter(r => r._id !== memberId))
      setSelectedRequests(prev => prev.filter(id => id !== memberId))

      // Show success notification (you can add a toast here)
    } catch (err: any) {
      console.error('Error approving member:', err)
      alert(err.message || 'Failed to approve member')
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkApprove = async () => {
    if (selectedRequests.length === 0) return

    try {
      setActionLoading('bulk')
      
      // Approve all selected requests
      await Promise.all(
        selectedRequests.map(id => clubService.approveMember(id))
      )

      // Remove approved requests from list
      setPendingRequests(prev => 
        prev.filter(r => !selectedRequests.includes(r._id))
      )
      setSelectedRequests([])
    } catch (err: any) {
      console.error('Error approving members:', err)
      alert(err.message || 'Failed to approve selected members')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectingId || !rejectReason.trim()) return

    try {
      setActionLoading(rejectingId)
      await clubService.rejectMember(rejectingId, { reason: rejectReason })

      // Remove from list
      setPendingRequests(prev => prev.filter(r => r._id !== rejectingId))
      setSelectedRequests(prev => prev.filter(id => id !== rejectingId))

      // Reset modal
      setShowRejectModal(false)
      setRejectReason('')
      setRejectingId(null)
    } catch (err: any) {
      console.error('Error rejecting member:', err)
      alert(err.message || 'Failed to reject member')
    } finally {
      setActionLoading(null)
    }
  }

  const openRejectModal = (memberId: string) => {
    setRejectingId(memberId)
    setShowRejectModal(true)
  }

  const toggleRequestExpansion = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId)
  }

  const toggleRequestSelection = (requestId: string) => {
    setSelectedRequests(prev =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    )
  }

  const selectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([])
    } else {
      setSelectedRequests(filteredRequests.map(r => r._id))
    }
  }

  const getMemberTypeBadge = (type: string) => {
    const badges = {
      player: {
        label: language === 'ar' ? 'لاعب' : 'Player',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Users,
      },
      coach: {
        label: language === 'ar' ? 'مدرب' : 'Coach',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: Award,
      },
      specialist: {
        label: language === 'ar' ? 'متخصص' : 'Specialist',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Briefcase,
      },
      staff: {
        label: language === 'ar' ? 'طاقم عمل' : 'Staff',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        icon: Hash,
      },
    }
    return badges[type as keyof typeof badges] || badges.player
  }

  const getDaysSince = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return language === 'ar' ? 'اليوم' : 'Today'
    if (days === 1) return language === 'ar' ? 'أمس' : 'Yesterday'
    return `${days} ${language === 'ar' ? 'أيام' : 'days ago'}`
  }

  // Filter and sort requests
  const filteredRequests = pendingRequests
    .filter((request) => {
      const user = typeof request.userId === 'object' ? request.userId : null
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        user?.fullName?.toLowerCase().includes(searchLower) ||
        user?.email?.toLowerCase().includes(searchLower) ||
        (user as any)?.phone?.includes(searchQuery)

      const matchesFilter = 
        filterType === 'all' || request.memberType === filterType

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

  if (loading && pendingRequests.length === 0) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/members"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">
                  {language === 'ar' ? 'الأعضاء' : 'Members'}
                </span>
              </Link>
            </div>
            <button
              onClick={() => fetchPendingRequests(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {language === 'ar' ? 'تحديث' : 'Refresh'}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'ar' ? 'الطلبات المعلقة' : 'Pending Requests'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'ar' 
                  ? `${filteredRequests.length} طلب في الانتظار`
                  : `${filteredRequests.length} requests waiting for approval`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'إجمالي الطلبات' : 'Total Requests'}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {pendingRequests.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'اليوم' : 'Today'}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {pendingRequests.filter(r => 
                    getDaysSince(r.createdAt) === (language === 'ar' ? 'اليوم' : 'Today')
                  ).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'هذا الأسبوع' : 'This Week'}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {pendingRequests.filter(r => {
                    const days = Math.floor((Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                    return days <= 7
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'المختار' : 'Selected'}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {selectedRequests.length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'البحث بالاسم أو البريد الإلكتروني أو رقم الهاتف...'
                      : 'Search by name, email, or phone...'
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">
                {language === 'ar' ? 'الأحدث أولاً' : 'Newest First'}
              </option>
              <option value="oldest">
                {language === 'ar' ? 'الأقدم أولاً' : 'Oldest First'}
              </option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedRequests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t flex items-center justify-between"
            >
              <p className="text-sm text-gray-600">
                {language === 'ar'
                  ? `تم تحديد ${selectedRequests.length} طلب`
                  : `${selectedRequests.length} requests selected`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkApprove}
                  disabled={actionLoading === 'bulk'}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading === 'bulk' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {language === 'ar' ? 'قبول الجميع' : 'Approve All'}
                </button>
                <button
                  onClick={() => setSelectedRequests([])}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {language === 'ar' ? 'إلغاء التحديد' : 'Clear Selection'}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Requests List */}
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-semibold">{error}</p>
          </motion.div>
        ) : filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border p-12 text-center"
          >
            <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery || filterType !== 'all'
                ? language === 'ar'
                  ? 'لا توجد طلبات تطابق البحث'
                  : 'No requests match your search'
                : language === 'ar'
                ? 'لا توجد طلبات معلقة'
                : 'No pending requests'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Select All Checkbox */}
            <div className="bg-white rounded-lg px-4 py-3 shadow-sm border flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                onChange={selectAll}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                {language === 'ar' ? 'تحديد الكل' : 'Select All'}
              </span>
            </div>

            {/* Request Cards */}
            <AnimatePresence>
              {filteredRequests.map((request) => {
                const user = typeof request.userId === 'object' ? request.userId : null
                const typeBadge = getMemberTypeBadge(request.memberType)
                const TypeIcon = typeBadge.icon
                const isExpanded = expandedRequest === request._id
                const isSelected = selectedRequests.includes(request._id)
                const isLoading = actionLoading === request._id

                return (
                  <motion.div
                    key={request._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-xl shadow-sm border transition-all ${
                      isSelected ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRequestSelection(request._id)}
                            className="mt-5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />

                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center text-white text-xl font-bold">
                              {user?.fullName?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                              <TypeIcon className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {user?.fullName || 'N/A'}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeBadge.color}`}
                              >
                                {typeBadge.label}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                {getDaysSince(request.createdAt)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {user?.email || 'N/A'}
                              </div>
                              {(user as any)?.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  {(user as any)?.phone}
                                </div>
                              )}
                              {request.sport && (
                                <div className="flex items-center gap-2">
                                  <Award className="w-4 h-4 text-gray-400" />
                                  {request.sport}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(request.createdAt).toLocaleDateString(
                                  language === 'ar' ? 'ar-SA' : 'en-US'
                                )}
                              </div>
                            </div>

                            {/* Additional Details Button */}
                            <button
                              onClick={() => toggleRequestExpansion(request._id)}
                              className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              {isExpanded
                                ? language === 'ar' ? 'إخفاء التفاصيل' : 'Hide Details'
                                : language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleApprove(request._id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            {language === 'ar' ? 'قبول' : 'Approve'}
                          </button>
                          <button
                            onClick={() => openRejectModal(request._id)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            {language === 'ar' ? 'رفض' : 'Reject'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Personal Information */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      {language === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}
                                    </span>
                                    <span className="text-gray-900">
                                      {(user as any)?.dateOfBirth ? new Date((user as any).dateOfBirth).toLocaleDateString() : 'N/A'}
                                    </span>
                                  </div>
                                  {(user as any)?.address && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        {language === 'ar' ? 'العنوان' : 'Address'}
                                      </span>
                                      <span className="text-gray-900">-</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Request Information */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  {language === 'ar' ? 'معلومات الطلب' : 'Request Information'}
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      {language === 'ar' ? 'رقم الطلب' : 'Request ID'}
                                    </span>
                                    <span className="text-gray-900 font-mono text-xs">
                                      {request._id.slice(-8)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      {language === 'ar' ? 'حالة الطلب' : 'Status'}
                                    </span>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                                      {language === 'ar' ? 'قيد المراجعة' : 'Under Review'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Notes */}
                              {request.notes && (
                                <div className="md:col-span-2">
                                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                                  </h4>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    {request.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Reject Modal */}
        <AnimatePresence>
          {showRejectModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowRejectModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === 'ar' ? 'رفض الطلب' : 'Reject Request'}
                  </h3>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={
                      language === 'ar'
                        ? 'الرجاء إدخال سبب الرفض...'
                        : 'Please enter rejection reason...'
                    }
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || actionLoading === rejectingId}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === rejectingId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {language === 'ar' ? 'رفض' : 'Reject'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PendingRequestsPage