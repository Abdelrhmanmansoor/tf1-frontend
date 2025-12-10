import React from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from './ui/button'
import { X, Download } from 'lucide-react'
import clubApplicationsService from '@/services/club-applications'

interface ResumeViewerProps {
  applicationId: string
  onClose: () => void
}

const ResumeViewer = ({ applicationId, onClose }: ResumeViewerProps) => {
  const { language } = useLanguage()

  const handleDownload = async () => {
    try {
      const blob = await clubApplicationsService.downloadResume(applicationId)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading resume:', error)
    }
  }

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {language === 'ar' ? 'عرض السيرة الذاتية' : 'Resume Viewer'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-body flex-1 overflow-hidden">
          <iframe
            src={`/api/v1/clubs/applications/${applicationId}/resume/view`}
            width="100%"
            height="100%"
            style={{ border: 'none', minHeight: '600px' }}
            title="Resume Viewer"
          />
        </div>
        
        <div className="modal-footer flex justify-end gap-2 p-4 border-t border-gray-200">
          <Button 
            onClick={handleDownload}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'تحميل' : 'Download'}
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResumeViewer
