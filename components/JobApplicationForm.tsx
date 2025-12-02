'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
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
} from 'lucide-react'
import { Button } from './ui/button'
import notificationService from '@/services/notifications'
import { toast } from 'sonner'

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
  const { user } = useAuth()
  const [applying, setApplying] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [whatsapp, setWhatsapp] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [coverLetter, setCoverLetter] = useState('')

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
    if (!resumeFile || !whatsapp) {
      setUploadError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    try {
      setApplying(true)
      setUploadError(null)

      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('whatsapp', whatsapp)
      if (coverLetter) formData.append('coverLetter', coverLetter)
      if (portfolio) formData.append('portfolio', portfolio)
      if (linkedin) formData.append('linkedin', linkedin)

      // Apply to job
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/apply`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to apply')
      }

      // Send notification to both user and club
      await notificationService.sendApplicationNotification(jobId, {
        applicantName: user?.name,
        applicantEmail: user?.email,
        whatsapp,
        portfolio,
        linkedin,
        coverLetter,
      })

      toast.success(language === 'ar' ? 'تم التقديم بنجاح!' : 'Application submitted successfully!')

      // Reset form
      setResumeFile(null)
      setWhatsapp('')
      setCoverLetter('')
      setPortfolio('')
      setLinkedin('')

      onSuccess?.()
    } catch (error: any) {
      console.error('Error applying:', error)
      let errorMessage = language === 'ar' ? 'فشل إرسال الطلب' : 'Failed to apply'

      if (error.response?.status === 409) {
        errorMessage = language === 'ar' ? 'لقد تقدمت بالفعل على هذه الوظيفة' : 'You have already applied to this job'
      } else if (error.message) {
        errorMessage = error.message
      }

      setUploadError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setApplying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'قدم طلبك الآن' : 'Apply Now'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            {language === 'ar' ? 'السيرة الذاتية *' : 'Resume *'}
          </label>
          <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer bg-white">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
              disabled={applying}
            />
            <label htmlFor="resume-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {resumeFile ? resumeFile.name : language === 'ar' ? 'اضغط لتحميل السيرة الذاتية' : 'Click to upload resume'}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ar' ? 'PDF, DOC, أو DOCX (حتى 10 ميجابايت)' : 'PDF, DOC, or DOCX (up to 10MB)'}
              </p>
            </label>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              {language === 'ar' ? 'رقم واتس أب *' : 'WhatsApp *'}
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
              <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
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

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              {language === 'ar' ? 'محفظة أعمالك (اختياري)' : 'Portfolio (Optional)'}
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
              <ExternalLink className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="flex-1 outline-none text-sm bg-transparent"
                disabled={applying}
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              {language === 'ar' ? 'ملف LinkedIn (اختياري)' : 'LinkedIn (Optional)'}
            </label>
            <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
              <Linkedin className="w-5 h-5 text-blue-700 flex-shrink-0" />
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="flex-1 outline-none text-sm bg-transparent"
                disabled={applying}
              />
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            {language === 'ar' ? 'خطاب التقديم (اختياري)' : 'Cover Letter (Optional)'}
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={4}
            className="w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            placeholder={language === 'ar' ? 'اكتب رسالة قصيرة عن نفسك...' : 'Write a brief message about yourself...'}
            disabled={applying}
          />
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="flex items-start gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{uploadError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleApply}
            disabled={applying || !resumeFile || !whatsapp}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="h-12"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
