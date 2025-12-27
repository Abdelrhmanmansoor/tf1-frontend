import { useLanguage } from '@/contexts/language-context'
import { Button } from './ui/button'
import { Eye, Download } from 'lucide-react'

interface ApplicationCardProps {
  application: any
  onViewResume?: (applicationId: string) => void
}

const ApplicationCard = ({ application, onViewResume }: ApplicationCardProps) => {
  const { language } = useLanguage()

  const handleViewResume = () => {
    if (onViewResume) {
      onViewResume(application._id)
    } else {
      window.open(application.resume.viewUrl, '_blank')
    }
  }

  const handleDownloadResume = () => {
    window.open(application.resume.downloadUrl, '_blank')
  }

  return (
    <div className="application-card bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">
        {application.applicantId.fullName}
      </h3>
      
      {/* استخدام البيانات الجاهزة */}
      {application.resume ? (
        <div className="resume-section bg-blue-50 rounded-lg p-3 mt-3">
          <p className="text-sm mb-2">📄 {application.resume.originalName}</p>
          
          <div className="flex gap-2">
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
      ) : (
        <p className="text-sm text-gray-500 mt-3">
          {language === 'ar' ? 'لا توجد سيرة ذاتية' : 'No resume available'}
        </p>
      )}
    </div>
  )
}

export default ApplicationCard
