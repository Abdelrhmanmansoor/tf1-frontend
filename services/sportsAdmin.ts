import api from './api'

export interface SportsAdminDashboardStats {
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

export interface SportsAdminDashboardData {
    stats: SportsAdminDashboardStats
    permissions: PermissionItem[]
    roles: RoleItem[]
    recentLogs: AuditLog[]
    settings: Record<string, any>
}

const sportsAdminService = {
    // Get dashboard data
    async getDashboard(): Promise<SportsAdminDashboardData> {
        try {
            const response = await api.get('/sports-admin/dashboard')
            return response.data.data
        } catch (error) {
            console.error('Error fetching dashboard:', error)
            throw error
        }
    },

    // Get all permissions
    async getPermissions(): Promise<PermissionItem[]> {
        try {
            const response = await api.get('/sports-admin/permissions')
            return response.data.data
        } catch (error) {
            console.error('Error fetching permissions:', error)
            throw error
        }
    },

    // Get all roles
    async getRoles(): Promise<RoleItem[]> {
        try {
            const response = await api.get('/sports-admin/roles')
            return response.data.data
        } catch (error) {
            console.error('Error fetching roles:', error)
            throw error
        }
    },

    // Update role permissions
    async updateRolePermissions(roleId: string, permissions: string[]): Promise<RoleItem> {
        try {
            const response = await api.put(`/sports-admin/roles/${roleId}/permissions`, {
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
            const response = await api.get('/sports-admin/audit-logs', {
                params: { page, limit },
            })
            return response.data.data
        } catch (error) {
            console.error('Error fetching audit logs:', error)
            throw error
        }
    },

    // Get users
    // Search users with filters
    async searchUsers(params: { role?: string; search?: string; page?: number; limit?: number }): Promise<any[]> {
        try {
            const response = await api.get('/sports-admin/users', {
                params,
            })
            return response.data.data
        } catch (error) {
            console.error('Error searching users:', error)
            throw error
        }
    },

    // Update user status
    async updateUserStatus(userId: string, status: string): Promise<any> {
        try {
            const response = await api.patch(`/sports-admin/users/${userId}/status`, {
                status,
            })
            return response.data.data
        } catch (error) {
            console.error('Error updating user status:', error)
            throw error
        }
    },

    // Get teams
    async getTeams(): Promise<any[]> {
        try {
            const response = await api.get('/sports-admin/teams')
            return response.data.data
        } catch (error) {
            console.error('Error fetching teams:', error)
            throw error
        }
    },

    // Verify Team
    async verifyTeam(teamId: string): Promise<any> {
        try {
            const response = await api.post(`/sports-admin/teams/${teamId}/verify`)
            return response.data.data
        } catch (error) {
            console.error('Error verifying team:', error)
            throw error
        }
    },

    // Create team member
    async createTeamMember(userId: string, permissions: string[]): Promise<any> {
        try {
            const response = await api.post('/sports-admin/teams/members', {
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
            const response = await api.put(`/sports-admin/teams/members/${memberId}/permissions`, {
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
            const response = await api.get('/sports-admin/settings')
            return response.data.data
        } catch (error) {
            console.error('Error fetching settings:', error)
            throw error
        }
    },

    // Update settings
    async updateSettings(settings: Record<string, any>): Promise<Record<string, any>> {
        try {
            const response = await api.put('/sports-admin/settings', settings)
            return response.data.data
        } catch (error) {
            console.error('Error updating settings:', error)
            throw error
        }
    },

    // Get analytics
    async getAnalytics(startDate?: string, endDate?: string): Promise<any> {
        try {
            const response = await api.get('/sports-admin/analytics', {
                params: { startDate, endDate },
            })
            return response.data.data
        } catch (error) {
            console.error('Error fetching analytics:', error)
            throw error
        }
    },
}

export default sportsAdminService
