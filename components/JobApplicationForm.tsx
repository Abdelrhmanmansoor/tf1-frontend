'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  MessageCircle,
  ExternalLink,
  Linkedin,
  X,
  Phone,
  User,
  MapPin,
  GraduationCap,
  Zap,
  Building2,
  Mail,
  FileText,
  Award,
  Briefcase,
  Calendar,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import api from '@/services/api'

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  clubId: string
  clubName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function JobApplicationForm({
  jobId,
  jobTitle,
  clubId,
  clubName,
  onSuccess,
  onCancel,
}: JobApplicationFormProps) {
  const { language } = useLanguage()
  const [applying, setApplying] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [whatsapp, setWhatsapp] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [qualification, setQualification] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [jobPublisher, setJobPublisher] = useState<any>(null)
  const [loadingPublisher, setLoadingPublisher] = useState(false)

  // Fetch job publisher information
  useEffect(() => {
    const fetchJobPublisher = async () => {
      try {
        setLoadingPublisher(true)
        const response = await api.get(`/jobs/${jobId}`)
        if (response.data.success && response.data.job) {
          const job = response.data.job
          // Get publisher info from job
          if (job.postedBy || job.club) {
            setJobPublisher({
              name: job.postedBy?.fullName || job.club?.name || clubName,
              email: job.postedBy?.email || job.club?.email,
              phone: job.club?.phone,
              verified: job.club?.verified || false,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching job publisher:', error)
      } finally {
        setLoadingPublisher(false)
      }
    }

    if (jobId) {
      fetchJobPublisher()
    }
  }, [jobId, clubName])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadError(null)

    if (!file) {
      setResumeFile(null)
      return
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setUploadError(language === 'ar' ? 'يُسمح فقط بملفات PDF و DOC و DOCX' : 'Only PDF, DOC, and DOCX files are allowed')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(language === 'ar' ? 'حجم الملف يجب أن يكون أقل من 10 ميجابايت' : 'File size must be less than 10MB')
      return
    }

    setResumeFile(file)
  }

  const handleApply = async () => {
    if (!resumeFile || !whatsapp || !phone || !age || !city || !qualification || !experienceYears) {
      setUploadError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    try {
      setApplying(true)
      setUploadError(null)

      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('whatsapp', whatsapp)
      formData.append('phone', phone)
      formData.append('age', age)
      formData.append('city', city)
      formData.append('qualification', qualification)
      formData.append('experienceYears', experienceYears)
      if (coverLetter) formData.append('coverLetter', coverLetter)
      if (portfolio) formData.append('portfolio', portfolio)
      if (linkedin) formData.append('linkedin', linkedin)

      // Apply to job using API service
      const response = await api.post(`/jobs/${jobId}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        toast.success(language === 'ar' ? 'تم التقديم بنجاح! سيتم إرسال إشعار لناشر الوظيفة' : 'Application submitted successfully! The job publisher will be notified')
        
        // Reset form
        setResumeFile(null)
        setWhatsapp('')
        setPhone('')
        setAge('')
        setCity('')
        setQualification('')
        setExperienceYears('')
        setCoverLetter('')
        setPortfolio('')
        setLinkedin('')

        onSuccess?.()
      } else {
        throw new Error(response.data.message || 'Failed to apply')
      }
    } catch (error: any) {
      console.error('Error applying:', error)
      let errorMessage = language === 'ar' ? 'فشل إرسال الطلب' : 'Failed to apply'

      if (error.response?.status === 409) {
        errorMessage = language === 'ar' ? 'لقد تقدمت بالفعل على هذه الوظيفة' : 'You have already applied to this job'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      setUploadError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setApplying(false)
    }
  }

  const isRtl = language === 'ar'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {language === 'ar' ? 'تقديم طلب التوظيف' : 'Job Application'}
              </h2>
              <p className="text-white/90 text-sm mt-1">
                {language === 'ar' ? 'للوظيفة:' : 'For Position:'} {jobTitle}
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Job Publisher Info */}
        {jobPublisher && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">
                  {language === 'ar' ? 'ناشر الوظيفة:' : 'Job Publisher:'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{jobPublisher.name}</span>
                  {jobPublisher.verified && (
                    <Shield className="w-4 h-4 text-yellow-300" />
                  )}
                </div>
                {jobPublisher.email && (
                  <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {jobPublisher.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 space-y-6">
        {/* Resume Upload - Enhanced */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {language === 'ar' ? 'السيرة الذاتية *' : 'Resume/CV *'}
          </label>
          <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
              disabled={applying}
            />
            <label htmlFor="resume-upload" className="cursor-pointer block">
              {resumeFile ? (
                <div className="space-y-2">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {language === 'ar' ? 'اضغط لتحميل السيرة الذاتية' : 'Click to upload resume'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'PDF, DOC, أو DOCX (حتى 10 ميجابايت)' : 'PDF, DOC, or DOCX (up to 10MB)'}
                  </p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Personal Info Grid - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white shadow-sm transition-all">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 50 123 4567"
                className="flex-1 outline-none text-sm bg-transparent"
                disabled={applying}
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              {language === 'ar' ? 'رقم واتس أب *' : 'WhatsApp *'}
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 bg-white shadow-sm transition-all">
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+966 50 123 4567"
                className="flex-1 outline-none text-sm bg-transparent"
                disabled={applying}
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" />
              {language === 'ar' ? 'العمر *' : 'Age *'}
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 bg-white shadow-sm transition-all">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                min="18"
                max="100"
                className="flex-1 outline-none text-sm bg-transparent"
                disabled={applying}
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              {language === 'ar' ? 'المدينة *' : 'City *'}
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 bg-white shadow-sm transition-all">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={language === 'ar' ? 'الرياض' : 'Riyadh'}
                className="flex-1 outline-none text-sm bg-transparent"
                disabled={applying}
              />
            </div>
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-orange-500" />
              {language === 'ar' ? 'المؤهل العلمي *' : 'Qualification *'}
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 bg-white shadow-sm transition-all">
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder={language === 'ar' ? 'بكالوريوس في الرياضة' : 'Bachelor in Sports'}
                className="flex-1 outline-none text-sm bg-transparent"
                disabled={applying}
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              {language === 'ar' ? 'سنوات الخبرة *' : 'Years of Experience *'}
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500 bg-white shadow-sm transition-all">
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="5"
                min="0"
                className="flex-1 outline-none text-sm bg-transparent"
                disabled={applying}
              />
            </div>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            {language === 'ar' ? 'معلومات إضافية (اختياري)' : 'Additional Information (Optional)'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Portfolio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-500" />
                {language === 'ar' ? 'محفظة أعمالك' : 'Portfolio'}
              </label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm transition-all"
                disabled={applying}
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-700" />
                {language === 'ar' ? 'ملف LinkedIn' : 'LinkedIn Profile'}
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm transition-all"
                disabled={applying}
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              {language === 'ar' ? 'خطاب التقديم' : 'Cover Letter'}
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none bg-white shadow-sm transition-all"
              placeholder={language === 'ar' ? 'اكتب رسالة قصيرة عن نفسك وخبراتك...' : 'Write a brief message about yourself and your experience...'}
              disabled={applying}
            />
          </div>
        </div>

        {/* Error Message */}
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm font-medium">{uploadError}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={handleApply}
            disabled={applying || !resumeFile || !whatsapp || !phone || !age || !city || !qualification || !experienceYears}
            className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 hover:from-blue-700 hover:via-purple-700 hover:to-green-600 h-12 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
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
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={applying}
              className="h-12 border-2"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
          )}
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-700 flex items-start gap-2">
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              {language === 'ar' 
                ? 'سيتم إرسال طلبك مباشرة إلى ناشر الوظيفة. سيتم إشعارك عند تحديث حالة طلبك.'
                : 'Your application will be sent directly to the job publisher. You will be notified when your application status is updated.'}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
