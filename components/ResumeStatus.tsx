import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from './ui/button'
import { Eye, Download } from 'lucide-react'
import clubApplicationsService from '@/services/club-applications'

interface ResumeStatusProps {
  application: any
}

const ResumeStatus = ({ application }: ResumeStatusProps) => {
  const { language } = useLanguage()
  const [resumeInfo, setResumeInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkResume = async () => {
      try {
        setLoading(true)
        const info = await clubApplicationsService.checkResumeExists(application._id)
        setResumeInfo(info)
      } catch (error) {
        console.error('Error checking resume:', error)
      } finally {
        setLoading(false)
      }
    }

    checkResume()
  }, [application._id])

  const handleViewResume = async () => {
    try {
      await clubApplicationsService.viewResume(application._id)
    } catch (error) {
      console.error('Error viewing resume:', error)
    }
  }

  const handleDownloadResume = async () => {
    try {
      const blob = await clubApplicationsService.downloadResume(application._id)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = resumeInfo.resume.originalName || 'resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading resume:', error)
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-500">{language === 'ar' ? 'جاري التحقق...' : 'Checking...'}</div>
  }

  if (!resumeInfo?.exists) {
    return (
      <div className="alert alert-warning p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        ⚠️ {language === 'ar' ? 'السيرة الذاتية غير متوفرة' : 'Resume not available'}
      </div>
    )
  }

  return (
    <div className="resume-info bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="resume-details mb-3">
        <p className="text-sm font-medium">📄 {resumeInfo.resume.originalName}</p>
        <p className="text-xs text-gray-600">📊 {(resumeInfo.resume.size / 1024).toFixed(2)} KB</p>
      </div>
      
      <div className="resume-actions flex gap-2">
        <Button 
          onClick={handleViewResume}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Eye className="w-4 h-4 mr-1" />
          {language === 'ar' ? 'عرض' : 'View'}
        </Button>
        <Button 
          onClick={handleDownloadResume}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Download className="w-4 h-4 mr-1" />
          {language === 'ar' ? 'تحميل' : 'Download'}
        </Button>
      </div>
    </div>
  )
}

export default ResumeStatus
