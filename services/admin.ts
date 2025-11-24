import api from './api'

export interface AdminStats {
  totalUsers: number
  totalClubs: number
  totalJobs: number
  activeUsers: number
}

export interface AdminUser {
  _id: string
  email: string
  name: string
  role: string
  blocked: boolean
  blockedReason?: string
  lastLogin?: string
}

export interface AdminSettings {
  _id: string
  primaryColor: string
  secondaryColor: string
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
}

export interface ActivityLog {
  _id: string
  userId: string
  action: string
  details: any
  timestamp: string
}

class AdminService {
  // Dashboard Stats
  async getDashboardStats() {
    try {
      const response = await api.get<{ stats: AdminStats }>('/admin/dashboard')
      return response.data.stats
    } catch (error) {
      throw error
    }
  }

  // Settings Management
  async getSettings() {
    try {
      const response = await api.get<{ settings: AdminSettings }>('/admin/settings')
      return response.data.settings
    } catch (error) {
      throw error
    }
  }

  async updateSettings(settings: Partial<AdminSettings>) {
    try {
      const response = await api.patch<{ settings: AdminSettings }>('/admin/settings', settings)
      return response.data.settings
    } catch (error) {
      throw error
    }
  }

  // Users Management
  async getAllUsers() {
    try {
      const response = await api.get<{ users: AdminUser[] }>('/admin/users')
      return response.data.users
    } catch (error) {
      throw error
    }
  }

  async blockUser(userId: string, reason: string) {
    try {
      const response = await api.patch<{ user: AdminUser }>(`/admin/users/${userId}/block`, {
        reason,
      })
      return response.data.user
    } catch (error) {
      throw error
    }
  }

  async unblockUser(userId: string) {
    try {
      const response = await api.patch<{ user: AdminUser }>(`/admin/users/${userId}/unblock`)
      return response.data.user
    } catch (error) {
      throw error
    }
  }

  // Activity Logs
  async getActivityLogs(limit = 50) {
    try {
      const response = await api.get<{ logs: ActivityLog[] }>('/admin/logs', {
        params: { limit },
      })
      return response.data.logs
    } catch (error) {
      throw error
    }
  }

  // Analytics
  async getAnalytics() {
    try {
      const response = await api.get('/admin/analytics')
      return response.data
    } catch (error) {
      throw error
    }
  }

  // User Activity
  async getUserActivity(userId: string) {
    try {
      const response = await api.get(`/admin/user-activity/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new AdminService()
