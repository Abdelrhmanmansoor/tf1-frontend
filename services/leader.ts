import api from './api'

export interface LeaderDashboardStats {
  totalUsers: number
  totalTeamMembers: number
  totalJobs: number
  totalApplications: number
  pendingActions: number
  activeUsers: number
}

export interface PermissionItem {
  id: string
  name: string
  description: string
  category: string
}

export interface RoleItem {
  id: string
  name: string
  description: string
  permissions: string[]
}

export interface AuditLog {
  id: string
  action: string
  actor: string
  target: string
  timestamp: string
  status: string
}

export interface LeaderDashboardData {
  stats: LeaderDashboardStats
  permissions: PermissionItem[]
  roles: RoleItem[]
  recentLogs: AuditLog[]
  settings: Record<string, any>
}

const leaderService = {
  // Get leader dashboard data
  async getDashboard(): Promise<LeaderDashboardData> {
    try {
      const response = await api.get('/leader/dashboard')
      return response.data.data
    } catch (error) {
      console.error('Error fetching leader dashboard:', error)
      throw error
    }
  },

  // Get all permissions
  async getPermissions(): Promise<PermissionItem[]> {
    try {
      const response = await api.get('/leader/permissions')
      return response.data.data
    } catch (error) {
      console.error('Error fetching permissions:', error)
      throw error
    }
  },

  // Get all roles
  async getRoles(): Promise<RoleItem[]> {
    try {
      const response = await api.get('/leader/roles')
      return response.data.data
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw error
    }
  },

  // Update role permissions
  async updateRolePermissions(roleId: string, permissions: string[]): Promise<RoleItem> {
    try {
      const response = await api.put(`/leader/roles/${roleId}/permissions`, {
        permissions,
      })
      return response.data.data
    } catch (error) {
      console.error('Error updating role permissions:', error)
      throw error
    }
  },

  // Get audit logs
  async getAuditLogs(page = 1, limit = 50): Promise<{ logs: AuditLog[]; total: number }> {
    try {
      const response = await api.get('/leader/audit-logs', {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      throw error
    }
  },

  // Get users
  async getUsers(page = 1, limit = 50): Promise<{ users: any[]; total: number }> {
    try {
      const response = await api.get('/leader/users', {
        params: { page, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Get teams
  async getTeams(): Promise<any[]> {
    try {
      const response = await api.get('/leader/teams')
      return response.data.data
    } catch (error) {
      console.error('Error fetching teams:', error)
      throw error
    }
  },

  // Create team member
  async createTeamMember(userId: string, permissions: string[]): Promise<any> {
    try {
      const response = await api.post('/leader/teams/members', {
        userId,
        permissions,
      })
      return response.data.data
    } catch (error) {
      console.error('Error creating team member:', error)
      throw error
    }
  },

  // Update team member permissions
  async updateTeamMemberPermissions(memberId: string, permissions: string[]): Promise<any> {
    try {
      const response = await api.put(`/leader/teams/members/${memberId}/permissions`, {
        permissions,
      })
      return response.data.data
    } catch (error) {
      console.error('Error updating team member permissions:', error)
      throw error
    }
  },

  // Get settings
  async getSettings(): Promise<Record<string, any>> {
    try {
      const response = await api.get('/leader/settings')
      return response.data.data
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  },

  // Update settings
  async updateSettings(settings: Record<string, any>): Promise<Record<string, any>> {
    try {
      const response = await api.put('/leader/settings', settings)
      return response.data.data
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  },

  // Get analytics
  async getAnalytics(startDate?: string, endDate?: string): Promise<any> {
    try {
      const response = await api.get('/leader/analytics', {
        params: { startDate, endDate },
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  },
}

export default leaderService
