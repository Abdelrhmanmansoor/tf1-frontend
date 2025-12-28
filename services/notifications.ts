import api from './api'

export interface JobNotification {
  _id: string
  userId: string
  recipientId?: string
  type: 'application_received' | 'application_submitted' | 'application_accepted' | 'application_rejected' | 'application_reviewed' | 'new_job' | 'job_match' | 'urgent_job' | 'general'
  title: string
  titleAr: string
  message: string
  messageAr: string
  read: boolean
  isRead?: boolean
  createdAt: string
  jobId?: string
  applicationId?: string
  clubId?: string
  applicantId?: string
  jobData?: {
    title: string
    titleAr?: string
    clubName?: string
    clubNameAr?: string
  }
  applicantData?: {
    name: string
    email?: string
    phone?: string
  }
  metadata?: Record<string, any>
}

export interface NotificationResponse {
  success: boolean
  data: {
    notifications: JobNotification[]
    total: number
    page: number
    limit: number
    unreadCount?: number
  }
}

export class NotificationError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message)
    this.name = 'NotificationError'
  }
}

const notificationService = {
  async getNotifications(page = 1, limit = 20): Promise<{ notifications: JobNotification[]; total: number; unreadCount: number }> {
    try {
      const response = await api.get('/notifications', {
        params: { page, limit },
      })
      const data = response.data.data || response.data
      return {
        notifications: data.notifications || data || [],
        total: data.total || data.length || 0,
        unreadCount: data.unreadCount || 0,
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error)
      throw new NotificationError(
        error.response?.data?.message || 'Failed to fetch notifications',
        error
      )
    }
  },

  async getJobNotifications(page = 1, limit = 20): Promise<{ notifications: JobNotification[]; total: number }> {
    try {
      const response = await api.get('/notifications/jobs', {
        params: { page, limit },
      })
      const data = response.data.data || response.data
      return {
        notifications: data.notifications || data || [],
        total: data.total || data.length || 0,
      }
    } catch (error: any) {
      console.error('Error fetching job notifications:', error)
      throw new NotificationError(
        error.response?.data?.message || 'Failed to fetch job notifications',
        error
      )
    }
  },

  async getClubApplicationNotifications(page = 1, limit = 20): Promise<{ notifications: JobNotification[]; total: number }> {
    try {
      const response = await api.get('/notifications', {
        params: { page, limit, type: 'application_received' },
      })
      const data = response.data.data || response.data
      return {
        notifications: data.notifications || data || [],
        total: data.total || data.length || 0,
      }
    } catch (error: any) {
      console.error('Error fetching club notifications:', error)
      throw new NotificationError(
        error.response?.data?.message || 'Failed to fetch club notifications',
        error
      )
    }
  },

  async getApplicationNotifications(page = 1, limit = 20): Promise<{ notifications: JobNotification[]; total: number }> {
    try {
      const response = await api.get('/notifications', {
        params: { 
          page, 
          limit,
          types: 'application_submitted,application_accepted,application_rejected,application_reviewed'
        },
      })
      const data = response.data.data || response.data
      return {
        notifications: data.notifications || data || [],
        total: data.total || data.length || 0,
      }
    } catch (error: any) {
      console.error('Error fetching application notifications:', error)
      throw new NotificationError(
        error.response?.data?.message || 'Failed to fetch application notifications',
        error
      )
    }
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await api.patch(`/notifications/${notificationId}/read`)
      return true
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  },

  async markAllAsRead(): Promise<boolean> {
    try {
      await api.patch('/notifications/read-all')
      return true
    } catch (error) {
      console.error('Error marking all as read:', error)
      return false
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count')
      return response.data.data?.count || response.data.count || 0
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await api.delete(`/notifications/${notificationId}`)
      return true
    } catch (error) {
      console.error('Error deleting notification:', error)
      return false
    }
  },

  async sendApplicationNotification(jobId: string, applicantInfo: any): Promise<boolean> {
    return true
  },
}

export default notificationService
