import api from './api'

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
      const response = await api.get('/club/applications', {
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
      const response = await api.get(`/club/jobs/${jobId}/applications`, {
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
      const response = await api.get(`/club/applications/${applicationId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching application details:', error)
      throw error
    }
  },

  // Download resume from direct URL
  async downloadResume(fileUrl: string, filename: string): Promise<Blob> {
    try {
      const response = await fetch(fileUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.blob()
    } catch (error) {
      console.error('Error downloading resume:', error)
      throw error
    }
  },

  // Update application status
  async updateApplicationStatus(
    applicationId: string,
    status: string,
    rejectionReason?: string
  ): Promise<ApplicationData> {
    try {
      const response = await api.put(`/club/applications/${applicationId}/status`, {
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
      const response = await api.put(`/club/applications/${applicationId}/notes`, {
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
      const response = await api.get('/club/applications/export', {
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
