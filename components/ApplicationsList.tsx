import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import ApplicationCard from './ApplicationCard'
import ResumeViewer from './ResumeViewer'
import { Loader2 } from 'lucide-react'

interface Application {
  _id: string
  applicantId: {
    fullName: string
  }
  resume?: {
    name: string
    originalName: string
    url: string
    downloadUrl: string
    viewUrl: string
  }
}

const ApplicationsList = () => {
  const { language } = useLanguage()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResume, setSelectedResume] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/clubs/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }
      
      const data = await response.json()
      setApplications(data.applications)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewResume = (applicationId: string) => {
    setSelectedResume(applicationId)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="applications-list space-y-4">
      {applications.length > 0 ? (
        applications.map(app => (
          <ApplicationCard 
            key={app._id} 
            application={app} 
            onViewResume={viewResume} 
          />
        ))
      ) : (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {language === 'ar' ? 'لا توجد طلبات' : 'No applications found'}
          </p>
        </div>
      )}

      {/* Modal لعرض السيرة الذاتية */}
      {selectedResume && (
        <ResumeViewer
          applicationId={selectedResume}
          onClose={() => setSelectedResume(null)}
        />
      )}
    </div>
  )
}

export default ApplicationsList
