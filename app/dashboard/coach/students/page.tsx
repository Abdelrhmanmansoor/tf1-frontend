'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Award,
  Star,
  Filter,
  Loader2,
  Trophy,
  Target,
  Sparkles,
  X,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import coachService from '@/services/coach'
import type { Student } from '@/types/coach'

const StudentsPage = () => {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'former'>(
    'all'
  )
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    former: 0,
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasMore: false,
  })

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [addingStudent, setAddingStudent] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [userFound, setUserFound] = useState(false)
  const [foundUserData, setFoundUserData] = useState<{
    email: string
    name: string
    avatar?: string
    hasPlayerProfile: boolean
  } | null>(null)
  const [addStudentForm, setAddStudentForm] = useState({
    studentEmail: '',
    sport: '',
    position: '',
    level: 'beginner' as 'beginner' | 'amateur' | 'semi-pro' | 'professional',
    notes: '',
    goals: [] as string[],
  })
  const [goalInput, setGoalInput] = useState('')

  // Email autocomplete
  const [emailSuggestions, setEmailSuggestions] = useState<
    Array<{
      email: string
      name: string
      avatar?: string
    }>
  >([])
  const [searchingEmails, setSearchingEmails] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Fetch students from API
  useEffect(() => {
    fetchStudents()
  }, [filterStatus, pagination.currentPage])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await coachService.getStudents({
        status: filterStatus,
        search: searchQuery,
        page: pagination.currentPage,
        limit: 20,
      })

      console.log('[StudentsPage] Fetched students:', response.students)
      console.log('[StudentsPage] Stats:', response.stats)

      setStudents(response.students)
      setStats(response.stats)
      setPagination(response.pagination)
    } catch (err: any) {
      console.error('[StudentsPage] Error fetching students:', err)
      setError(err.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchStudents()
      } else if (searchQuery === '' && students.length === 0) {
        fetchStudents()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Search for users by email (autocomplete)
  useEffect(() => {
    const searchUsers = async () => {
      const email = addStudentForm.studentEmail.trim()

      // Only search if 4+ characters
      if (email.length < 4) {
        setEmailSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        setSearchingEmails(true)

        // Call your user search API endpoint
        // TODO: Create this endpoint on the backend: GET /api/v1/users/search
        const response = await fetch(
          `/api/v1/users/search?q=${encodeURIComponent(email)}&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          // Assuming API returns: { success: true, users: [...] }
          setEmailSuggestions(data.users || [])
          setShowSuggestions(true)
        } else {
          // Silently fail if endpoint doesn't exist yet
          setEmailSuggestions([])
          setShowSuggestions(false)
        }
      } catch (err) {
        // Silently fail - endpoint might not exist yet
        console.log('[StudentsPage] User search endpoint not available yet')
        setEmailSuggestions([])
        setShowSuggestions(false)
      } finally {
        setSearchingEmails(false)
      }
    }

    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [addStudentForm.studentEmail])

  // Check if email exists in database
  const handleCheckEmail = async () => {
    if (!addStudentForm.studentEmail.trim()) {
      alert(
        language === 'ar'
          ? 'الرجاء إدخال البريد الإلكتروني'
          : 'Please enter an email address'
      )
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(addStudentForm.studentEmail.trim())) {
      alert(
        language === 'ar'
          ? 'الرجاء إدخال بريد إلكتروني صحيح'
          : 'Please enter a valid email address'
      )
      return
    }

    try {
      setCheckingEmail(true)

      // Check if user exists by searching for them
      const response = await fetch(
        `/api/v1/users/search?q=${encodeURIComponent(addStudentForm.studentEmail.trim())}&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()

        // Check if we found exact email match
        const user = data.users?.find(
          (u: any) =>
            u.email.toLowerCase() ===
            addStudentForm.studentEmail.trim().toLowerCase()
        )

        if (user) {
          // User found - proceed to add them directly
          setFoundUserData({
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            hasPlayerProfile: user.hasPlayerProfile || false,
          })
          setUserFound(true)

          // If user has player profile, add them directly
          if (user.hasPlayerProfile) {
            await handleAddStudentDirectly(user.email)
          }
        } else {
          // User not found - show manual form
          setUserFound(false)
          alert(
            language === 'ar'
              ? 'المستخدم غير موجود. يرجى ملء التفاصيل يدوياً.'
              : 'User not found. Please fill in the details manually.'
          )
        }
      } else {
        // API error - assume user doesn't exist, show manual form
        setUserFound(false)
        alert(
          language === 'ar'
            ? 'تعذر التحقق من البريد الإلكتروني. يرجى ملء التفاصيل يدوياً.'
            : 'Could not verify email. Please fill in the details manually.'
        )
      }
    } catch (err) {
      console.error('[StudentsPage] Error checking email:', err)
      // On error, show manual form
      setUserFound(false)
      alert(
        language === 'ar'
          ? 'تعذر التحقق من البريد الإلكتروني. يرجى ملء التفاصيل يدوياً.'
          : 'Could not verify email. Please fill in the details manually.'
      )
    } finally {
      setCheckingEmail(false)
    }
  }

  // Add student directly (when user exists and has player profile)
  const handleAddStudentDirectly = async (email: string) => {
    try {
      setAddingStudent(true)

      await coachService.addStudent({
        studentEmail: email,
      })

      alert(
        language === 'ar'
          ? 'تمت إضافة الطالب بنجاح!'
          : 'Student added successfully!'
      )

      // Reset form
      setAddStudentForm({
        studentEmail: '',
        sport: '',
        position: '',
        level: 'beginner',
        notes: '',
        goals: [],
      })
      setGoalInput('')
      setShowAddModal(false)
      setUserFound(false)
      setFoundUserData(null)

      // Refresh students list
      fetchStudents()
    } catch (err: any) {
      console.error('[StudentsPage] Error adding student:', err)
      alert(err.message || 'Failed to add student')
    } finally {
      setAddingStudent(false)
    }
  }

  // Handle Add Student with manual details
  const handleAddStudent = async () => {
    if (!addStudentForm.studentEmail.trim()) {
      alert(
        language === 'ar'
          ? 'الرجاء إدخال البريد الإلكتروني للطالب'
          : 'Please enter student email'
      )
      return
    }

    // If user doesn't exist, require sport
    if (!userFound && !addStudentForm.sport.trim()) {
      alert(language === 'ar' ? 'الرجاء إدخال الرياضة' : 'Please enter sport')
      return
    }

    try {
      setAddingStudent(true)

      // Backend expects studentEmail field
      await coachService.addStudent({
        studentEmail: addStudentForm.studentEmail.trim(),
        sport: addStudentForm.sport.trim() || undefined,
        position: addStudentForm.position.trim() || undefined,
        level: addStudentForm.level,
        notes: addStudentForm.notes.trim() || undefined,
        goals:
          addStudentForm.goals.length > 0 ? addStudentForm.goals : undefined,
      })

      alert(
        language === 'ar'
          ? 'تمت إضافة الطالب بنجاح!'
          : 'Student added successfully!'
      )

      // Reset form
      setAddStudentForm({
        studentEmail: '',
        sport: '',
        position: '',
        level: 'beginner',
        notes: '',
        goals: [],
      })
      setGoalInput('')
      setShowAddModal(false)
      setUserFound(false)
      setFoundUserData(null)

      // Refresh students list
      fetchStudents()
    } catch (err: any) {
      console.error('[StudentsPage] Error adding student:', err)
      alert(err.message || 'Failed to add student')
    } finally {
      setAddingStudent(false)
    }
  }

  const handleAddGoal = () => {
    if (goalInput.trim()) {
      setAddStudentForm((prev) => ({
        ...prev,
        goals: [...prev.goals, goalInput.trim()],
      }))
      setGoalInput('')
    }
  }

  const handleRemoveGoal = (index: number) => {
    setAddStudentForm((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }))
  }

  const handleSelectSuggestion = (email: string) => {
    setAddStudentForm((prev) => ({ ...prev, studentEmail: email }))
    setShowSuggestions(false)
    setEmailSuggestions([])
  }

  const renderStudentCard = (student: Student, index: number) => {
    const isPlayer = student.hasPlayerProfile
    const studentName = `${student.userId.firstName} ${student.userId.lastName}`
    const displayAvatar =
      student.userId.avatar ||
      `https://ui-avatars.com/api/?name=${studentName}&background=4F46E5&color=fff`

    return (
      <motion.div
        key={student._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * index }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
      >
        {/* Card Header */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 text-white relative">
          {/* Player Profile Badge */}
          {isPlayer && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {language === 'ar' ? 'لاعب' : 'Player'}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full border-4 border-white/30 overflow-hidden flex-shrink-0">
              <Image
                src={displayAvatar}
                alt={studentName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold truncate">{studentName}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    student.status === 'active'
                      ? 'bg-green-500/20 text-green-100'
                      : 'bg-gray-500/20 text-gray-100'
                  }`}
                >
                  {student.status === 'active'
                    ? language === 'ar'
                      ? 'نشط'
                      : 'Active'
                    : language === 'ar'
                      ? 'سابق'
                      : 'Former'}
                </span>
                {isPlayer && student.yearsOfExperience && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                    {student.yearsOfExperience}{' '}
                    {language === 'ar' ? 'سنة خبرة' : 'yrs exp'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ar' ? 'الرياضة' : 'Sport'}
              </div>
              <div className="font-semibold text-gray-900">{student.sport}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                {language === 'ar' ? 'المستوى' : 'Level'}
              </div>
              <div className="font-semibold text-gray-900 capitalize">
                {student.level}
              </div>
            </div>
            {student.position && (
              <>
                <div className="col-span-2">
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ar' ? 'المركز' : 'Position'}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {student.position}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Enhanced Player Info */}
          {isPlayer && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 space-y-3">
              {student.currentClub && (
                <div>
                  <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {language === 'ar' ? 'النادي الحالي' : 'Current Club'}
                  </div>
                  <div className="font-bold text-gray-900">
                    {student.currentClub.clubName}
                  </div>
                </div>
              )}

              {student.statistics && (
                <div className="grid grid-cols-3 gap-2">
                  {student.statistics.matchesPlayed !== undefined && (
                    <div className="text-center bg-white/60 rounded-lg p-2">
                      <div className="text-lg font-bold text-purple-600">
                        {student.statistics.matchesPlayed}
                      </div>
                      <div className="text-xs text-gray-600">
                        {language === 'ar' ? 'مباريات' : 'Matches'}
                      </div>
                    </div>
                  )}
                  {student.statistics.goals !== undefined && (
                    <div className="text-center bg-white/60 rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">
                        {student.statistics.goals}
                      </div>
                      <div className="text-xs text-gray-600">
                        {language === 'ar' ? 'أهداف' : 'Goals'}
                      </div>
                    </div>
                  )}
                  {student.statistics.assists !== undefined && (
                    <div className="text-center bg-white/60 rounded-lg p-2">
                      <div className="text-lg font-bold text-blue-600">
                        {student.statistics.assists}
                      </div>
                      <div className="text-xs text-gray-600">
                        {language === 'ar' ? 'تمريرات' : 'Assists'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Training Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {student.totalSessions}
              </div>
              <div className="text-xs text-gray-600">
                {language === 'ar' ? 'جلسات' : 'Sessions'}
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {student.completedSessions}
              </div>
              <div className="text-xs text-gray-600">
                {language === 'ar' ? 'مكتمل' : 'Completed'}
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-2xl font-bold">
                  {student.rating.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {language === 'ar' ? 'تقييم' : 'Rating'}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            {student.userId.phone && (
              <a
                href={`tel:${student.userId.phone}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition"
              >
                <Phone className="w-4 h-4" />
                {student.userId.phone}
              </a>
            )}
            <a
              href={`mailto:${student.userId.email}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition"
            >
              <Mail className="w-4 h-4" />
              {student.userId.email}
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {language === 'ar' ? 'انضم في' : 'Joined'}{' '}
              {new Date(student.joinedDate).toLocaleDateString(
                language === 'ar' ? 'ar-EG' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/dashboard/coach/students/${student._id}`}
              className="flex-1"
            >
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                {language === 'ar' ? 'عرض الملف' : 'View Profile'}
              </Button>
            </Link>
            {isPlayer && student.playerProfileId && (
              <Link
                href={`/players/${student.playerProfileId}`}
                target="_blank"
              >
                <Button
                  variant="outline"
                  size="icon"
                  title={language === 'ar' ? 'ملف اللاعب' : 'Player Profile'}
                >
                  <Trophy className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {language === 'ar' ? 'العودة' : 'Back'}
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-600" />
                {language === 'ar' ? 'طلابي' : 'My Students'}
              </h1>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {language === 'ar' ? 'إضافة طالب' : 'Add Student'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>
            <div className="text-blue-100 text-sm">
              {language === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{stats.active}</div>
            </div>
            <div className="text-green-100 text-sm">
              {language === 'ar' ? 'الطلاب النشطون' : 'Active Students'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{stats.former}</div>
            </div>
            <div className="text-gray-100 text-sm">
              {language === 'ar' ? 'الطلاب السابقون' : 'Former Students'}
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={
                  language === 'ar'
                    ? 'البحث عن طالب...'
                    : 'Search for a student...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                {language === 'ar' ? 'الكل' : 'All'}
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
              >
                {language === 'ar' ? 'نشط' : 'Active'}
              </Button>
              <Button
                variant={filterStatus === 'former' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('former')}
              >
                {language === 'ar' ? 'سابق' : 'Former'}
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-red-600 font-semibold mb-2">
              {language === 'ar' ? 'حدث خطأ' : 'Error'}
            </div>
            <div className="text-red-500 text-sm mb-4">{error}</div>
            <Button onClick={fetchStudents} variant="outline">
              {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </Button>
          </div>
        )}

        {/* Students Grid */}
        {!loading && !error && students.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, index) =>
              renderStudentCard(student, index)
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && students.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {language === 'ar' ? 'لا توجد طلاب' : 'No students found'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar'
                ? 'جرب تغيير فلاتر البحث'
                : 'Try changing your search filters'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              disabled={pagination.currentPage === 1}
            >
              {language === 'ar' ? 'السابق' : 'Previous'}
            </Button>
            <span className="text-gray-600">
              {language === 'ar' ? 'صفحة' : 'Page'} {pagination.currentPage}{' '}
              {language === 'ar' ? 'من' : 'of'} {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              disabled={!pagination.hasMore}
            >
              {language === 'ar' ? 'التالي' : 'Next'}
            </Button>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <UserPlus className="w-6 h-6" />
                  {language === 'ar' ? 'إضافة طالب جديد' : 'Add New Student'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                  disabled={addingStudent}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Step 1: Simple Email Check */}
              {!userFound && !foundUserData && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      {language === 'ar'
                        ? 'أدخل البريد الإلكتروني للطالب للتحقق من وجوده في النظام.'
                        : "Enter the student's email address to check if they're in the system."}
                    </p>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'البريد الإلكتروني للطالب'
                        : 'Student Email Address'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder={
                          language === 'ar'
                            ? 'مثال: student@example.com'
                            : 'e.g., student@example.com'
                        }
                        value={addStudentForm.studentEmail}
                        onChange={(e) => {
                          setAddStudentForm((prev) => ({
                            ...prev,
                            studentEmail: e.target.value,
                          }))
                          setShowSuggestions(true)
                        }}
                        onFocus={() => {
                          if (emailSuggestions.length > 0) {
                            setShowSuggestions(true)
                          }
                        }}
                        onBlur={() => {
                          // Delay to allow clicking on suggestions
                          setTimeout(() => setShowSuggestions(false), 200)
                        }}
                        className="w-full"
                        autoComplete="off"
                      />
                      {searchingEmails && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ar'
                        ? 'البريد الإلكتروني المسجل للطالب في النظام (مطلوب) - ابدأ الكتابة للبحث'
                        : "The student's registered email address (required) - Start typing to search"}
                    </p>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && emailSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {emailSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() =>
                              handleSelectSuggestion(suggestion.email)
                            }
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                          >
                            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {suggestion.avatar ? (
                                <Image
                                  src={suggestion.avatar}
                                  alt={suggestion.name}
                                  fill
                                  className="object-cover rounded-full"
                                />
                              ) : (
                                <span>
                                  {suggestion.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">
                                {suggestion.name}
                              </div>
                              <div className="text-sm text-gray-600 truncate">
                                {suggestion.email}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No results message */}
                    {showSuggestions &&
                      !searchingEmails &&
                      addStudentForm.studentEmail.length >= 4 &&
                      emailSuggestions.length === 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
                          <p className="text-sm text-gray-600 text-center">
                            {language === 'ar'
                              ? 'لا توجد نتائج. تحقق من البريد الإلكتروني أو تابع الكتابة.'
                              : 'No results found. Check the email or continue typing.'}
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Check Button */}
                  <Button
                    onClick={handleCheckEmail}
                    disabled={
                      checkingEmail || !addStudentForm.studentEmail.trim()
                    }
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2"
                  >
                    {checkingEmail ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {language === 'ar' ? 'جاري التحقق...' : 'Checking...'}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        {language === 'ar'
                          ? 'تحقق من البريد الإلكتروني'
                          : 'Check Email'}
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* Step 2: Manual Form (if user not found or needs details) */}
              {(userFound || foundUserData) && (
                <>
                  {foundUserData && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                      {foundUserData.avatar ? (
                        <div className="relative w-12 h-12 rounded-full flex-shrink-0">
                          <Image
                            src={foundUserData.avatar}
                            alt={foundUserData.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {foundUserData.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {foundUserData.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {foundUserData.email}
                        </p>
                        {foundUserData.hasPlayerProfile && (
                          <p className="text-xs text-green-700 font-medium mt-1">
                            {language === 'ar'
                              ? '✓ لديه ملف لاعب'
                              : '✓ Has Player Profile'}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sport (Optional if student has PlayerProfile) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? 'الرياضة' : 'Sport'}{' '}
                      <span className="text-gray-400 text-xs">
                        ({language === 'ar' ? 'اختياري' : 'optional'})
                      </span>
                    </label>
                    <Input
                      type="text"
                      placeholder={
                        language === 'ar' ? 'مثال: كرة القدم' : 'e.g., Football'
                      }
                      value={addStudentForm.sport}
                      onChange={(e) =>
                        setAddStudentForm((prev) => ({
                          ...prev,
                          sport: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ar'
                        ? 'سيتم تجاوز هذا إذا كان لدى الطالب ملف لاعب'
                        : 'Will be overridden if student has a PlayerProfile'}
                    </p>
                  </div>

                  {/* Position (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? 'المركز' : 'Position'}{' '}
                      <span className="text-gray-400 text-xs">
                        ({language === 'ar' ? 'اختياري' : 'optional'})
                      </span>
                    </label>
                    <Input
                      type="text"
                      placeholder={
                        language === 'ar' ? 'مثال: مهاجم' : 'e.g., Forward'
                      }
                      value={addStudentForm.position}
                      onChange={(e) =>
                        setAddStudentForm((prev) => ({
                          ...prev,
                          position: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? 'المستوى' : 'Level'}
                    </label>
                    <select
                      value={addStudentForm.level}
                      onChange={(e) =>
                        setAddStudentForm((prev) => ({
                          ...prev,
                          level: e.target.value as
                            | 'beginner'
                            | 'amateur'
                            | 'semi-pro'
                            | 'professional',
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="beginner">
                        {language === 'ar' ? 'مبتدئ' : 'Beginner'}
                      </option>
                      <option value="amateur">
                        {language === 'ar' ? 'هاوي' : 'Amateur'}
                      </option>
                      <option value="semi-pro">
                        {language === 'ar' ? 'شبه محترف' : 'Semi-Pro'}
                      </option>
                      <option value="professional">
                        {language === 'ar' ? 'محترف' : 'Professional'}
                      </option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}{' '}
                      <span className="text-gray-400 text-xs">
                        ({language === 'ar' ? 'اختياري' : 'optional'})
                      </span>
                    </label>
                    <textarea
                      placeholder={
                        language === 'ar'
                          ? 'أضف ملاحظات عن الطالب...'
                          : 'Add notes about the student...'
                      }
                      value={addStudentForm.notes}
                      onChange={(e) =>
                        setAddStudentForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Training Goals */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? 'أهداف التدريب' : 'Training Goals'}{' '}
                      <span className="text-gray-400 text-xs">
                        ({language === 'ar' ? 'اختياري' : 'optional'})
                      </span>
                    </label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        placeholder={
                          language === 'ar' ? 'أضف هدفاً...' : 'Add a goal...'
                        }
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddGoal()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddGoal}
                        variant="outline"
                        disabled={!goalInput.trim()}
                      >
                        {language === 'ar' ? 'إضافة' : 'Add'}
                      </Button>
                    </div>
                    {addStudentForm.goals.length > 0 && (
                      <div className="space-y-2">
                        {addStudentForm.goals.map((goal, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-3"
                          >
                            <span className="text-sm text-gray-800">
                              {goal}
                            </span>
                            <button
                              onClick={() => handleRemoveGoal(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            {(userFound || foundUserData) && (
              <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3 justify-end sticky bottom-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false)
                    setUserFound(false)
                    setFoundUserData(null)
                    setAddStudentForm({
                      studentEmail: '',
                      sport: '',
                      position: '',
                      level: 'beginner',
                      notes: '',
                      goals: [],
                    })
                  }}
                  disabled={addingStudent}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleAddStudent}
                  disabled={
                    addingStudent || !addStudentForm.studentEmail.trim()
                  }
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2"
                >
                  {addingStudent ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === 'ar' ? 'جاري الإضافة...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      {language === 'ar' ? 'إضافة طالب' : 'Add Student'}
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default StudentsPage
