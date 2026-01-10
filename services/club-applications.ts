import api from './api'
import API_CONFIG from '@/config/api'

export interface ApplicationFile {
  _id: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  uploadedAt: string
}

export interface ApplicationData {
  _id: string
  jobId: string
  jobTitle: string
  jobTitleAr: string
  clubId: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  applicantPhone?: string
  whatsapp: string
  portfolio?: string
  linkedin?: string
  coverLetter?: string
  resume: ApplicationFile
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected'
  appliedAt: string
  statusUpdatedAt?: string
  rejectionReason?: string
  adminNotes?: string
}

export interface ApplicationsListResponse {
  applications: ApplicationData[]
  total: number
  page: number
  limit: number
}

const clubApplicationsService = {
  // Get all applications for club's jobs
  async getClubApplications(page = 1, limit = 20): Promise<ApplicationsListResponse> {
    try {
      const response = await api.get('/clubs/applications', {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching club applications:', error)
      throw error
    }
  },

  // Get applications for specific job
  async getJobApplications(jobId: string, page = 1, limit = 20): Promise<ApplicationsListResponse> {
    try {
      const response = await api.get(`/clubs/jobs/${jobId}/applications`, {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching job applications:', error)
      throw error
    }
  },

  // Get single application details
  async getApplicationDetails(applicationId: string): Promise<ApplicationData> {
    try {
      const response = await api.get(`/clubs/applications/${applicationId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching application details:', error)
      throw error
    }
  },

  // Download resume using the new endpoint
  async downloadResume(applicationId: string): Promise<Blob> {
    try {
      const response = await api.get(`/clubs/applications/${applicationId}/resume/download`, {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error('Error downloading resume:', error)
      throw error
    }
  },

  // View resume using the new endpoint
  async viewResume(applicationId: string): Promise<void> {
    try {
      const url = `${API_CONFIG.BASE_URL}/clubs/applications/${applicationId}/resume/view`
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error viewing resume:', error)
      throw error
    }
  },

  // Check if resume exists
  async checkResumeExists(applicationId: string): Promise<{ exists: boolean; resume?: any; message?: string }> {
    try {
      const response = await api.get(`/clubs/applications/${applicationId}/resume/info`)
      const data = response.data
      if (data.fileExists || data.exists) {
        return { exists: true, resume: data.resume || data.data }
      }
      return { exists: false, message: data.message || 'الملف غير موجود على السيرفر' }
    } catch (error) {
      console.error('Error checking resume:', error)
      return { exists: false }
    }
  },

  // Update application status
  async updateApplicationStatus(
    applicationId: string,
    status: string,
    rejectionReason?: string
  ): Promise<ApplicationData> {
    try {
      const response = await api.put(`/clubs/applications/${applicationId}/status`, {
        status,
        rejectionReason,
      })
      return response.data.data
    } catch (error) {
      console.error('Error updating application status:', error)
      throw error
    }
  },

  // Add admin notes
  async addAdminNotes(applicationId: string, notes: string): Promise<ApplicationData> {
    try {
      const response = await api.put(`/clubs/applications/${applicationId}/notes`, {
        adminNotes: notes,
      })
      return response.data.data
    } catch (error) {
      console.error('Error adding notes:', error)
      throw error
    }
  },

  // Export applications as CSV
  async exportApplications(jobId?: string): Promise<Blob> {
    try {
      const params = jobId ? { jobId } : {}
      const response = await api.get('/clubs/applications/export', {
        params,
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error('Error exporting applications:', error)
      throw error
    }
  },
}

export default clubApplicationsService
