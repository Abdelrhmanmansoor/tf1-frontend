'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { getOpportunityById, applyToOpportunity, Opportunity } from '@/services/opportunities'
import { LanguageSelector } from '@/components/language-selector'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  Building2,
  Mail,
  Phone,
  Globe,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

export default function OpportunityDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const { user } = useAuth()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true)
        const data = await getOpportunityById(params.id as string)
        setOpportunity(data)
      } catch (err: any) {
        console.error('Error fetching opportunity:', err)
        setError(err.message || 'Failed to load opportunity')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOpportunity()
    }
  }, [params.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadError(null)

    if (!file) {
      setResumeFile(null)
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setUploadError(language === 'ar' ? 'يُسمح فقط بملفات PDF و DOC و DOCX' : 'Only PDF, DOC, and DOCX files are allowed')
      setResumeFile(null)
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(language === 'ar' ? 'حجم الملف يجب أن يكون أقل من 10 ميجابايت' : 'File size must be less than 10MB')
      setResumeFile(null)
      return
    }

    setResumeFile(file)
  }

  const handleApply = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    // Validate that resume is uploaded
    if (!resumeFile) {
      setUploadError(language === 'ar' ? 'يرجى تحميل سيرتك الذاتية' : 'Please upload your resume')
      return
    }

    try {
      setApplying(true)
      setUploadError(null)

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('resume', resumeFile)
      if (coverLetter) {
        formData.append('coverLetter', coverLetter)
      }

      await applyToOpportunity(params.id as string, formData)

      setApplySuccess(true)
      setShowApplyForm(false)
      setResumeFile(null)
      setCoverLetter('')

      setTimeout(() => {
        setApplySuccess(false)
      }, 5000)
    } catch (err: any) {
      console.error('Error applying:', err)
      setUploadError(err.message || (language === 'ar' ? 'فشل إرسال الطلب' : 'Failed to apply'))
    } finally {
      setApplying(false)
    }
  }

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      permanent: { en: 'Permanent', ar: 'دائم' },
      seasonal: { en: 'Seasonal', ar: 'موسمي' },
      temporary: { en: 'Temporary', ar: 'مؤقت' },
      trial: { en: 'Trial', ar: 'تجريبي' },
      internship: { en: 'Internship', ar: 'تدريب' },
      volunteer: { en: 'Volunteer', ar: 'تطوع' },
    }
    return labels[type]
      ? language === 'ar'
        ? labels[type].ar
        : labels[type].en
      : type
  }

  const daysUntilDeadline = opportunity
    ? Math.ceil(
        (new Date(opportunity.deadline).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline > 0
  const isExpired = daysUntilDeadline <= 0

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (error || !opportunity) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? 'خطأ' : 'Error'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || (language === 'ar' ? 'الفرصة غير موجودة' : 'Opportunity not found')}
          </p>
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'العودة' : 'Go Back'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'ar' ? 'العودة' : 'Back'}
          </Button>
          <LanguageSelector />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Message */}
        {applySuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">
                {language === 'ar' ? 'تم التقديم بنجاح!' : 'Application submitted successfully!'}
              </p>
              <p className="text-green-600 text-sm mt-1">
                {language === 'ar'
                  ? 'سيتم إخطارك بأي تحديثات'
                  : 'You will be notified of any updates'}
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunity Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-start gap-6 mb-6">
                {/* Club Logo */}
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                  {opportunity.club.logo ? (
                    <img
                      src={opportunity.club.logo}
                      alt={opportunity.club.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Briefcase className="w-10 h-10 text-blue-600" />
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {opportunity.title}
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    {opportunity.club.name}
                  </p>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span>{opportunity.location}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  <span>{getJobTypeLabel(opportunity.jobType)}</span>
                </div>

                {opportunity.sport && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl">⚽</span>
                    <span className="capitalize">{opportunity.sport}</span>
                  </div>
                )}

                {opportunity.position && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-xl">🎯</span>
                    <span>{opportunity.position}</span>
                  </div>
                )}

                {opportunity.salaryRange && (
                  <div className="flex items-center gap-3 text-gray-700 sm:col-span-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-700">
                      {opportunity.salaryRange}
                    </span>
                  </div>
                )}
              </div>

              {/* Deadline Warning */}
              {isUrgent && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">
                      {language === 'ar' ? 'وقت محدود!' : 'Limited time!'}
                    </p>
                    <p className="text-red-600 text-sm">
                      {language === 'ar'
                        ? `${daysUntilDeadline} ${daysUntilDeadline === 1 ? 'يوم' : 'أيام'} متبقية للتقديم`
                        : `Only ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left to apply`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {opportunity.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {opportunity.description}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'المسؤوليات' : 'Responsibilities'}
                </h2>
                <ul className="space-y-3">
                  {opportunity.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                </h2>
                <ul className="space-y-3">
                  {opportunity.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Form */}
            {showApplyForm && !isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'قدم طلبك' : 'Submit Your Application'}
                </h2>
                <div className="space-y-6">
                  {/* Resume Upload - Required */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'السيرة الذاتية *' : 'Resume *'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label
                        htmlFor="resume-upload"
                        className="cursor-pointer"
                      >
                        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {resumeFile
                            ? resumeFile.name
                            : language === 'ar'
                              ? 'انقر لتحميل السيرة الذاتية'
                              : 'Click to upload resume'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === 'ar'
                            ? 'PDF, DOC, أو DOCX (حتى 10 ميجابايت)'
                            : 'PDF, DOC, or DOCX (up to 10MB)'}
                        </p>
                      </label>
                    </div>
                    {uploadError && (
                      <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter - Optional */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'خطاب التقديم (اختياري)' : 'Cover Letter (Optional)'}
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={
                        language === 'ar'
                          ? 'اكتب خطاب التقديم الخاص بك هنا...'
                          : 'Write your cover letter here...'
                      }
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleApply}
                      disabled={applying || !resumeFile}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applying ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'إرسال الطلب' : 'Submit Application'}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowApplyForm(false)
                        setResumeFile(null)
                        setUploadError(null)
                      }}
                      disabled={applying}
                      className="h-12"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            {!showApplyForm && !applySuccess && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
                {isExpired ? (
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-600 font-medium">
                      {language === 'ar' ? 'انتهى الموعد النهائي' : 'Deadline has passed'}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      if (!user) {
                        router.push('/login')
                      } else {
                        setShowApplyForm(true)
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-14 text-lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'قدم الآن' : 'Apply Now'}
                  </Button>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {language === 'ar' ? 'الموعد النهائي' : 'Deadline'}
                      </p>
                      <p>{new Date(opportunity.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {language === 'ar' ? 'المتقدمين' : 'Applicants'}
                      </p>
                      <p>{opportunity.applicationCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {language === 'ar' ? 'تاريخ النشر' : 'Posted'}
                      </p>
                      <p>{new Date(opportunity.postedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Club Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'عن النادي' : 'About the Club'}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden border border-gray-200">
                  {opportunity.club.logo ? (
                    <img
                      src={opportunity.club.logo}
                      alt={opportunity.club.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{opportunity.club.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
