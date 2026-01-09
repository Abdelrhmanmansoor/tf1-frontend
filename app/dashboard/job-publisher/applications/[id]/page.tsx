'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  FileText,
  Download,
  MessageCircle,
  ExternalLink,
  Briefcase,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  User,
  Copy,
} from 'lucide-react'
import Link from 'next/link'
import api from '@/services/api'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

interface Application {
  _id: string
  jobId: {
    _id: string
    title: string
    titleAr?: string
  }
  applicantId: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    avatar?: string
  }
  status: string
  createdAt: string
  coverLetter?: string
  cv?: string
  resume?: string
}

const ApplicationDetailPage = () => {
  const { language } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  
  // Interview fields
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [interviewLocation, setInterviewLocation] = useState('')

  useEffect(() => {
    fetchApplication()
  }, [applicationId])

  useEffect(() => {
    if (application) {
      setSelectedStatus(application.status)
    }
  }, [application])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/job-publisher/applications/${applicationId}`)
      if (response.data.success) {
        setApplication(response.data.data.application || response.data.data)
      }
    } catch (err: any) {
      console.error('Error fetching application:', err)
      toast.error(language === 'ar' ? 'خطأ في تحميل الطلب' : 'Error loading application')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'under_review': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'interviewed': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'offered': return 'bg-indigo-100 text-indigo-700 border-indigo-300'
      case 'hired': return 'bg-green-100 text-green-700 border-green-300'
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!application || newStatus === application.status) return
    
    // Validation for interview
    if (newStatus === 'interviewed' && (!interviewDate || !interviewTime)) {
       // Allow changing to interview without details first, or require them?
       // User said "opens messaging system only when status is interview"
       // We'll proceed but warn if details missing? No, let's keep it simple.
    }

    try {
      setStatusLoading(true)
      await api.put(`/job-publisher/applications/${application._id}/status`, {
        status: newStatus,
        notes,
        interviewDate: newStatus === 'interviewed' ? `${interviewDate}T${interviewTime}` : undefined,
        interviewLocation: newStatus === 'interviewed' ? interviewLocation : undefined
      })
      
      setApplication(prev => prev ? { ...prev, status: newStatus } : null)
      setSelectedStatus(newStatus)
      toast.success(language === 'ar' ? 'تم تحديث الحالة بنجاح' : 'Status updated successfully')
      
      // If status is interviewed, suggest messaging
      if (newStatus === 'interviewed') {
        toast.info(language === 'ar' 
          ? 'يمكنك الآن مراسلة المتقدم عبر نظام الرسائل' 
          : 'You can now message the applicant via messaging system')
      }
    } catch (err: any) {
      console.error('Error updating status:', err)
      toast.error(language === 'ar' ? 'خطأ في تحديث الحالة' : 'Error updating status')
      setSelectedStatus(application?.status || '')
    } finally {
      setStatusLoading(false)
    }
  }

  const handleMessageClick = () => {
    // Navigate to messaging with this applicant selected (if possible)
    // Or just go to messaging center
    router.push('/dashboard/job-publisher/messages')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          {language === 'ar' ? 'الطلب غير موجود' : 'Application not found'}
        </h2>
        <Link href="/dashboard/job-publisher">
          <Button variant="link" className="mt-4">
            {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 pb-12 ${language === 'ar' ? 'font-arabic' : 'font-english'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/job-publisher" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className={`w-4 h-4 ${language === 'ar' ? 'rotate-180 ml-2' : 'mr-2'}`} />
            {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
                {application.applicantId.avatar ? (
                  <img src={application.applicantId.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {application.applicantId.firstName} {application.applicantId.lastName}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Briefcase className="w-4 h-4" />
                  {language === 'ar' ? application.jobId.titleAr || application.jobId.title : application.jobId.title}
                </p>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
              {application.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                    <p className="text-sm font-medium text-gray-900">{application.applicantId.email}</p>
                  </div>
                </div>
                {application.applicantId.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</p>
                      <p className="text-sm font-medium text-gray-900" dir="ltr">{application.applicantId.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                {language === 'ar' ? 'المستندات' : 'Documents'}
              </h2>
              <div className="space-y-3">
                {application.cv || application.resume ? (
                   <a 
                     href={application.cv || application.resume} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                   >
                     <div className="flex items-center gap-3">
                       <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-white transition-colors">
                         <FileText className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="font-medium text-gray-900">{language === 'ar' ? 'السيرة الذاتية' : 'CV / Resume'}</p>
                         <p className="text-xs text-gray-500">{language === 'ar' ? 'اضغط للعرض' : 'Click to view'}</p>
                       </div>
                     </div>
                     <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                   </a>
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    {language === 'ar' ? 'لا يوجد سيرة ذاتية مرفقة' : 'No CV attached'}
                  </p>
                )}
                
                {application.coverLetter && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {language === 'ar' ? 'خطاب التغطية' : 'Cover Letter'}
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {application.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Interview Section - Visible only if status is interviewed */}
            {application.status === 'interviewed' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-50 rounded-xl border border-purple-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {language === 'ar' ? 'منطقة المقابلة' : 'Interview Zone'}
                  </h2>
                  <Button 
                    onClick={handleMessageClick}
                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'فتح المحادثة' : 'Open Chat'}
                  </Button>
                </div>
                <p className="text-sm text-purple-700 mb-4">
                  {language === 'ar' 
                    ? 'بما أن حالة الطلب "مقابلة"، يمكنك الآن التواصل مباشرة مع المتقدم عبر نظام الرسائل الداخلي.' 
                    : 'Since the status is "Interview", you can now communicate directly with the applicant via the internal messaging system.'}
                </p>
              </motion.div>
            )}

          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
              </h2>
              
              <div className="space-y-3">
                {['new', 'under_review', 'interviewed', 'offered', 'rejected', 'hired'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={statusLoading || application.status === status}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                      application.status === status
                        ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm ring-1 ring-purple-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <span>
                      {language === 'ar' 
                        ? (status === 'all' ? 'الكل' : status.replace('_', ' '))
                        : (status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '))}
                    </span>
                    {application.status === status && <CheckCircle className="w-4 h-4 text-purple-600" />}
                  </button>
                ))}
              </div>

              {/* Interview Details Inputs */}
              {selectedStatus === 'interviewed' && application.status !== 'interviewed' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 space-y-3 border-t pt-4"
                >
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    {language === 'ar' ? 'تفاصيل المقابلة (اختياري)' : 'Interview Details (Optional)'}
                  </p>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'الموقع / الرابط' : 'Location / Link'}
                    value={interviewLocation}
                    onChange={(e) => setInterviewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </motion.div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 className="text-sm font-bold text-gray-900 mb-3">
                 {language === 'ar' ? 'ملاحظات' : 'Notes'}
               </h3>
               <textarea
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
                 placeholder={language === 'ar' ? 'أضف ملاحظات خاصة...' : 'Add private notes...'}
                 className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500"
               />
               <Button 
                 onClick={() => handleStatusChange(application.status)} // Just save notes
                 variant="outline" 
                 size="sm" 
                 className="mt-2 w-full"
               >
                 {language === 'ar' ? 'حفظ الملاحظات' : 'Save Notes'}
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailPage
