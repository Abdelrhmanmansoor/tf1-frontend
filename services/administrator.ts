// Administrator Service
import api from './api'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  pendingApprovals: number
  totalClubs: number
  totalCoaches: number
  totalPlayers: number
  recentRegistrations: number
  systemAlerts: number
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: 'active' | 'blocked' | 'pending'
  createdAt: string
  lastActive: string
}

interface PendingApproval {
  id: string
  name: string
  email: string
  role: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
}

class AdministratorService {
  async getDashboard(): Promise<DashboardStats> {
    try {
      const response = await api.get('/administrator/dashboard')
      return response.data.data.stats
    } catch (error) {
      throw error
    }
  }

  async getUsers(page = 1, limit = 20, filters?: any): Promise<{ users: User[]; pagination: any }> {
    try {
      const response = await api.get('/administrator/users', {
        params: { page, limit, ...filters }
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async getPendingApprovals(): Promise<PendingApproval[]> {
    try {
      const response = await api.get('/administrator/approvals')
      return response.data.data.approvals
    } catch (error) {
      throw error
    }
  }

  async approveUser(userId: string, reason?: string): Promise<any> {
    try {
      const response = await api.patch(`/administrator/approvals/${userId}`, {
        action: 'approve',
        reason
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async rejectUser(userId: string, reason: string): Promise<any> {
    try {
      const response = await api.patch(`/administrator/approvals/${userId}`, {
        action: 'reject',
        reason
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async blockUser(userId: string, reason: string): Promise<any> {
    try {
      const response = await api.patch(`/administrator/users/${userId}/block`, {
        blocked: true,
        reason
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async unblockUser(userId: string): Promise<any> {
    try {
      const response = await api.patch(`/administrator/users/${userId}/block`, {
        blocked: false
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getSettings(): Promise<any> {
    try {
      const response = await api.get('/administrator/settings')
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async updateSettings(settings: any): Promise<any> {
    try {
      const response = await api.patch('/administrator/settings', settings)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new AdministratorService()
