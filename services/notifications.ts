import api from './api'

export interface JobNotification {
  _id: string
  userId: string
  clubId: string
  jobId: string
  type: 'application_received' | 'application_submitted' | 'application_accepted' | 'application_rejected'
  title: string
  titleAr: string
  message: string
  messageAr: string
  read: boolean
  createdAt: string
  jobData?: {
    title: string
    titleAr: string
    clubName: string
    clubNameAr: string
  }
  applicantData?: {
    name: string
    email: string
    phone: string
  }
}

const notificationService = {
  // Send application notification
  async sendApplicationNotification(jobId: string, applicantInfo: any): Promise<any> {
    try {
      const response = await api.post('/notifications/job-application', {
        jobId,
        applicantInfo,
      })
      return response.data
    } catch (error) {
      console.error('Error sending application notification:', error)
      throw error
    }
  },

  // Get job notifications for user
  async getJobNotifications(page = 1, limit = 20): Promise<{ notifications: JobNotification[]; total: number }> {
    try {
      const response = await api.get('/notifications/jobs', {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  },

  // Get club notifications (for club dashboard)
  async getClubApplicationNotifications(page = 1, limit = 20): Promise<{ notifications: JobNotification[]; total: number }> {
    try {
      const response = await api.get('/notifications/club/applications', {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching club notifications:', error)
      throw error
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<any> {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  },

  // Mark all as read
  async markAllAsRead(): Promise<any> {
    try {
      const response = await api.put('/notifications/mark-all-read')
      return response.data
    } catch (error) {
      console.error('Error marking all as read:', error)
      throw error
    }
  },

  // Get unread count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count')
      return response.data.data.count
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<any> {
    try {
      const response = await api.delete(`/notifications/${notificationId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  },
}

export default notificationService
