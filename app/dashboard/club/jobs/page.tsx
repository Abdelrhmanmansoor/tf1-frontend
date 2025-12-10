'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Plus,
  Briefcase,
  X,
  Loader2,
  Users,
  Calendar,
  Filter,
  Eye,
  Edit,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import clubService from '@/services/club'
import type { JobPosting, CreateJobData } from '@/types/club'

const ClubJobsPage = () => {
  const { language } = useLanguage()
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sportFilter, setSportFilter] = useState<string>('all')

  // Create Job Form
  const [formData, setFormData] = useState<CreateJobData>({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    jobType: 'permanent',
    category: 'coach',
    sport: '',
    employmentType: 'full_time',
    requirements: {
      minimumExperience: 0,
      educationLevel: '',
      certifications: [],
      skills: [],
      languages: [],
    },
    responsibilities: [],
    numberOfPositions: 1,
    applicationDeadline: '',
    expectedStartDate: '',
    // تم إزالة حقول المقابلة
  })

  // Additional form fields
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('Saudi Arabia')
  const [requirementsText, setRequirementsText] = useState('')
  const [skillsText, setSkillsText] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchJobs()
  }, [statusFilter, categoryFilter, sportFilter])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (categoryFilter !== 'all') params.category = categoryFilter
      if (sportFilter !== 'all') params.sport = sportFilter

      const response = await clubService.getJobs(params)
      setJobs(response.jobs)
    } catch (err) {
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = language === 'ar' ? 'المسمى الوظيفي مطلوب' : 'Job title is required'
    }
    if (!formData.description.trim()) {
      errors.description = language === 'ar' ? 'الوصف مطلوب' : 'Description is required'
    }
    if (!city.trim()) {
      errors.city = language === 'ar' ? 'المدينة مطلوبة' : 'City is required'
    }
    if (!country.trim()) {
      errors.country = language === 'ar' ? 'الدولة مطلوبة' : 'Country is required'
    }
    if (!formData.numberOfPositions || formData.numberOfPositions < 1) {
      errors.numberOfPositions = language === 'ar' ? 'عدد الوظائف يجب أن يكون 1 على الأقل' : 'Number of positions must be at least 1'
    }
    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (deadline < today) {
        errors.applicationDeadline = language === 'ar' ? 'تاريخ الإغلاق يجب أن يكون في المستقبل' : 'Deadline must be in the future'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateJob = async () => {
    if (!validateForm()) {
      alert(language === 'ar' ? 'يرجى تصحيح الأخطاء في النموذج' : 'Please fix form errors')
      return
    }

    try {
      setCreating(true)

      // Clean up requirements - remove empty values
      const cleanedRequirements = {
        ...formData.requirements,
      }

      // Remove empty educationLevel
      if (!cleanedRequirements.educationLevel) {
        delete cleanedRequirements.educationLevel
      }

      // Remove empty arrays
      if (
        !cleanedRequirements.certifications ||
        cleanedRequirements.certifications.length === 0
      ) {
        delete cleanedRequirements.certifications
      }
      if (
        !cleanedRequirements.skills ||
        cleanedRequirements.skills.length === 0
      ) {
        delete cleanedRequirements.skills
      }
      if (
        !cleanedRequirements.languages ||
        cleanedRequirements.languages.length === 0
      ) {
        delete cleanedRequirements.languages
      }

      // If minimumExperience is 0, remove it
      if (cleanedRequirements.minimumExperience === 0) {
        delete cleanedRequirements.minimumExperience
      }

      // Parse skills and requirements from text
      const skillsArray = skillsText
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
      
      if (skillsArray.length > 0) {
        cleanedRequirements.skills = skillsArray
      }

      // Format data for API - convert dates to ISO 8601
      const jobData: any = {
        title: formData.title,
        titleAr: formData.titleAr || undefined,
        description: formData.description,
        descriptionAr: formData.descriptionAr || undefined,
        jobType: formData.jobType,
        category: formData.category,
        employmentType: formData.employmentType,
        sport: formData.sport || undefined,
        city: city || undefined,
        country: country || undefined,
        applicationDeadline: formData.applicationDeadline
          ? new Date(formData.applicationDeadline).toISOString()
          : undefined,
        expectedStartDate: formData.expectedStartDate || undefined,
        numberOfPositions: formData.numberOfPositions,
        requirements:
          Object.keys(cleanedRequirements).length > 0
            ? cleanedRequirements
            : undefined,
        responsibilities:
          formData.responsibilities && formData.responsibilities.length > 0
            ? formData.responsibilities
            : undefined,
        // تم إزالة حقول المقابلة
      }

      // Add requirements text if provided
      if (requirementsText.trim()) {
        if (!jobData.requirements) jobData.requirements = {}
        jobData.requirements.description = requirementsText
      }

      await clubService.createJob(jobData)
      await fetchJobs()
      setShowCreateModal(false)
      resetForm()
    } catch (err: any) {
      console.error('Error creating job:', err)
      alert(
        err.message ||
          (language === 'ar' ? 'فشل في إنشاء الوظيفة' : 'Failed to create job')
      )
    } finally {
      setCreating(false)
    }
  }

  const handleCloseJob = async (jobId: string) => {
    if (
      !confirm(
        language === 'ar'
          ? 'هل تريد إغلاق هذه الوظيفة؟'
          : 'Close this job posting?'
      )
    )
      return

    try {
      await clubService.closeJob(jobId, { reason: 'Closed by admin' })
      await fetchJobs()
    } catch (err: any) {
      console.error('Error closing job:', err)
      alert(
        err.message ||
          (language === 'ar' ? 'فشل في إغلاق الوظيفة' : 'Failed to close job')
      )
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      jobType: 'permanent',
      category: 'coach',
      sport: '',
      employmentType: 'full_time',
      requirements: {
        minimumExperience: 0,
        educationLevel: '',
        certifications: [],
        skills: [],
        languages: [],
      },
      responsibilities: [],
      numberOfPositions: 1,
      applicationDeadline: '',
      expectedStartDate: '',
      // تم إزالة حقول المقابلة
    })
    setCity('')
    setCountry('Saudi Arabia')
    setRequirementsText('')
    setSkillsText('')
    setValidationErrors({})
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'closed':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'filled':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
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
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'الوظائف المتاحة' : 'Job Postings'}
              </h1>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'إنشاء وظيفة' : 'Create Job'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">
              {language === 'ar' ? 'تصفية' : 'Filters'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الحالة' : 'Status'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">
                  {language === 'ar' ? 'الكل' : 'All'}
                </option>
                <option value="active">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </option>
                <option value="closed">
                  {language === 'ar' ? 'مغلق' : 'Closed'}
                </option>
                <option value="filled">
                  {language === 'ar' ? 'ممتلئ' : 'Filled'}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الفئة' : 'Category'}
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">
                  {language === 'ar' ? 'الكل' : 'All'}
                </option>
                <option value="coach">
                  {language === 'ar' ? 'مدرب' : 'Coach'}
                </option>
                <option value="player">
                  {language === 'ar' ? 'لاعب' : 'Player'}
                </option>
                <option value="specialist">
                  {language === 'ar' ? 'متخصص' : 'Specialist'}
                </option>
                <option value="staff">
                  {language === 'ar' ? 'موظف' : 'Staff'}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الرياضة' : 'Sport'}
              </label>
              <Input
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                placeholder={language === 'ar' ? 'أي رياضة' : 'Any sport'}
              />
            </div>
          </div>
        </motion.div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {language === 'ar' && job.titleAr
                        ? job.titleAr
                        : job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {language === 'ar' && job.descriptionAr
                      ? job.descriptionAr
                      : job.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.category}</span>
                    </div>
                    {job.sport && (
                      <div className="flex items-center gap-1">
                        <span>{job.sport}</span>
                      </div>
                    )}
                    {job.applicationStats && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {job.applicationStats.totalApplications}{' '}
                          {language === 'ar' ? 'طلب' : 'applications'}
                        </span>
                      </div>
                    )}
                    {job.applicationDeadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(
                            job.applicationDeadline
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/club/opportunities/view/${job._id}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-4 h-4" />
                      {language === 'ar' ? 'عرض' : 'View'}
                    </Button>
                  </Link>
                  {job.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-600 hover:text-red-700"
                      onClick={() => handleCloseJob(job._id)}
                    >
                      <XCircle className="w-4 h-4" />
                      {language === 'ar' ? 'إغلاق' : 'Close'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-500">
                {language === 'ar' ? 'لا توجد وظائف' : 'No job postings'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {language === 'ar'
                  ? 'أنشئ أول وظيفة!'
                  : 'Create your first job posting!'}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'إنشاء وظيفة' : 'Create Job'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  {language === 'ar' ? 'إنشاء وظيفة جديدة' : 'Create New Job'}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'المسمى الوظيفي (إنجليزي)'
                        : 'Job Title (English)'}{' '}
                      *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Football Coach"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'المسمى الوظيفي (عربي)'
                        : 'Job Title (Arabic)'}
                    </label>
                    <Input
                      value={formData.titleAr}
                      onChange={(e) =>
                        setFormData({ ...formData, titleAr: e.target.value })
                      }
                      placeholder="مثال: مدرب كرة قدم"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar'
                      ? 'الوصف (إنجليزي)'
                      : 'Description (English)'}{' '}
                    *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Job description..."
                    className="resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نوع الوظيفة' : 'Job Type'} *
                    </label>
                    <select
                      value={formData.jobType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jobType: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="permanent">
                        {language === 'ar' ? 'دائم' : 'Permanent'}
                      </option>
                      <option value="contract">
                        {language === 'ar' ? 'عقد' : 'Contract'}
                      </option>
                      <option value="temporary">
                        {language === 'ar' ? 'مؤقت' : 'Temporary'}
                      </option>
                      <option value="internship">
                        {language === 'ar' ? 'تدريب' : 'Internship'}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الفئة' : 'Category'} *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="coach">
                        {language === 'ar' ? 'مدرب' : 'Coach'}
                      </option>
                      <option value="player">
                        {language === 'ar' ? 'لاعب' : 'Player'}
                      </option>
                      <option value="specialist">
                        {language === 'ar' ? 'متخصص' : 'Specialist'}
                      </option>
                      <option value="staff">
                        {language === 'ar' ? 'موظف' : 'Staff'}
                      </option>
                      <option value="management">
                        {language === 'ar' ? 'إدارة' : 'Management'}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نوع التوظيف' : 'Employment Type'} *
                    </label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employmentType: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="full_time">
                        {language === 'ar' ? 'دوام كامل' : 'Full Time'}
                      </option>
                      <option value="part_time">
                        {language === 'ar' ? 'دوام جزئي' : 'Part Time'}
                      </option>
                      <option value="freelance">
                        {language === 'ar' ? 'عمل حر' : 'Freelance'}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'الرياضة' : 'Sport'}
                    </label>
                    <Input
                      value={formData.sport}
                      onChange={(e) =>
                        setFormData({ ...formData, sport: e.target.value })
                      }
                      placeholder={
                        language === 'ar' ? 'مثال: كرة القدم' : 'e.g., Football'
                      }
                    />
                  </div>
                </div>

                {/* Location Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {language === 'ar' ? 'الموقع' : 'Location'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المدينة' : 'City'} *
                      </label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={language === 'ar' ? 'الرياض' : 'Riyadh'}
                        className={validationErrors.city ? 'border-red-500' : ''}
                      />
                      {validationErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'الدولة' : 'Country'} *
                      </label>
                      <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder={language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
                        className={validationErrors.country ? 'border-red-500' : ''}
                      />
                      {validationErrors.country && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.country}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Requirements Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'وصف المتطلبات' : 'Requirements Description'}
                      </label>
                      <Textarea
                        value={requirementsText}
                        onChange={(e) => setRequirementsText(e.target.value)}
                        rows={3}
                        placeholder={language === 'ar' ? 'اكتب المتطلبات الوظيفية...' : 'Enter job requirements...'}
                        className="resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'سنوات الخبرة المطلوبة' : 'Minimum Experience (years)'}
                        </label>
                        <Input
                          type="number"
                          value={formData.requirements?.minimumExperience || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              requirements: {
                                ...formData.requirements,
                                minimumExperience: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'المؤهل العلمي' : 'Education Level'}
                        </label>
                        <Input
                          value={formData.requirements?.educationLevel || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              requirements: {
                                ...formData.requirements,
                                educationLevel: e.target.value,
                              },
                            })
                          }
                          placeholder={language === 'ar' ? 'بكالوريوس، ماجستير...' : 'Bachelor, Master...'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'المهارات المطلوبة (افصل بفاصلة)' : 'Required Skills (comma separated)'}
                      </label>
                      <Input
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: قيادة، تواصل، تخطيط' : 'e.g., Leadership, Communication, Planning'}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'آخر موعد للتقديم'
                        : 'Application Deadline'}
                    </label>
                    <Input
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          applicationDeadline: e.target.value,
                        })
                      }
                      className={validationErrors.applicationDeadline ? 'border-red-500' : ''}
                    />
                    {validationErrors.applicationDeadline && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.applicationDeadline}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'تاريخ البدء المتوقع'
                        : 'Expected Start Date'}
                    </label>
                    <Input
                      type="date"
                      value={formData.expectedStartDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedStartDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar'
                        ? 'عدد الوظائف'
                        : 'Number of Positions'} *
                    </label>
                    <Input
                      type="number"
                      value={formData.numberOfPositions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numberOfPositions: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                      className={validationErrors.numberOfPositions ? 'border-red-500' : ''}
                    />
                    {validationErrors.numberOfPositions && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.numberOfPositions}</p>
                    )}
                  </div>
                </div>

                {/* تم إزالة قسم تفاصيل المقابلة */}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    variant="outline"
                    className="flex-1"
                    disabled={creating}
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleCreateJob}
                    className="flex-1"
                    disabled={
                      creating || !formData.title || !formData.description
                    }
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {creating
                      ? language === 'ar'
                        ? 'جاري الإنشاء...'
                        : 'Creating...'
                      : language === 'ar'
                        ? 'إنشاء'
                        : 'Create'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClubJobsPage
