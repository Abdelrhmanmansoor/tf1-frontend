import api from './api'

export interface TeamPermission {
  id: string
  name: string
  description: string
  enabled: boolean
  category: string
}

export interface TeamDashboardData {
  permissions: TeamPermission[]
  memberInfo: {
    userId: string
    name: string
    email: string
    role: string
  }
  accessibleModules: string[]
}

const teamService = {
  // Get team member permissions
  async getPermissions(): Promise<TeamPermission[]> {
    try {
      const response = await api.get('/team/permissions')
      return response.data.data
    } catch (error) {
      console.error('Error fetching team permissions:', error)
      throw error
    }
  },

  // Get team dashboard
  async getDashboard(): Promise<TeamDashboardData> {
    try {
      const response = await api.get('/team/dashboard')
      return response.data.data
    } catch (error) {
      console.error('Error fetching team dashboard:', error)
      throw error
    }
  },

  // Check if team member has permission
  async checkPermission(permissionId: string): Promise<boolean> {
    try {
      const response = await api.get(`/team/permissions/${permissionId}/check`)
      return response.data.data.hasPermission
    } catch (error) {
      console.error('Error checking permission:', error)
      return false
    }
  },

  // Get users (if team has access)
  async getUsers(page = 1, limit = 50): Promise<{ users: any[]; total: number }> {
    try {
      const response = await api.get('/team/users', {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Get content (if team has access)
  async getContent(page = 1, limit = 50): Promise<{ content: any[]; total: number }> {
    try {
      const response = await api.get('/team/content', {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching content:', error)
      throw error
    }
  },

  // Get jobs (if team has access)
  async getJobs(page = 1, limit = 50): Promise<{ jobs: any[]; total: number }> {
    try {
      const response = await api.get('/team/jobs', {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }
  },

  // Get applications (if team has access)
  async getApplications(page = 1, limit = 50): Promise<{ applications: any[]; total: number }> {
    try {
      const response = await api.get('/team/applications', {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching applications:', error)
      throw error
    }
  },

  // Get notifications (if team has access)
  async getNotifications(): Promise<any[]> {
    try {
      const response = await api.get('/team/notifications')
      return response.data.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  },

  // Get messages (if team has access)
  async getMessages(): Promise<any[]> {
    try {
      const response = await api.get('/team/messages')
      return response.data.data
    } catch (error) {
      console.error('Error fetching messages:', error)
      throw error
    }
  },

  // Access denied fallback
  async accessDenied(reason: string): Promise<void> {
    try {
      await api.post('/team/access-denied', { reason })
    } catch (error) {
      console.error('Error logging access denied:', error)
    }
  },
}

export default teamService
