// Executive Director Service - Complete Implementation
import api from './api'

// Types
export interface DashboardStats {
  totalRevenue: number
  monthlyGrowth: number
  totalMembers: number
  activePartnerships: number
  pendingDecisions: number
  upcomingMeetings: number
  newMembers: number
  memberRetention: number
}

export interface KPI {
  id: string
  name: string
  nameAr: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  period: string
  category: 'financial' | 'operational' | 'member' | 'staff'
  description?: string
  descriptionAr?: string
  lastUpdated?: string
}

export interface KPIDetail {
  kpi: KPI
  history: { date: string; value: number }[]
  breakdown: { category: string; value: number }[]
  insights: string[]
  recommendations: string[]
}

export interface Initiative {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold'
  priority: 'high' | 'medium' | 'low'
  deadline: string
  progress: number
  owner: string
  ownerAr: string
  department: string
  departmentAr: string
  budget: number
  spent: number
  tasks: InitiativeTask[]
  createdAt?: string
  updatedAt?: string
}

export interface InitiativeTask {
  id: string
  title: string
  titleAr: string
  status: 'pending' | 'in-progress' | 'completed'
  assignee: string
  dueDate: string
}

export interface Partnership {
  id: string
  partnerName: string
  partnerNameAr: string
  type: 'sponsor' | 'strategic' | 'vendor' | 'affiliate' | 'government'
  status: 'active' | 'negotiating' | 'expired' | 'pending'
  startDate: string
  endDate: string
  value: number
  currency: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  description: string
  descriptionAr: string
  logo?: string
  benefits: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Announcement {
  id: string
  title: string
  titleAr: string
  content: string
  contentAr: string
  type: 'internal' | 'public' | 'urgent'
  priority: 'high' | 'medium' | 'low'
  status: 'draft' | 'published' | 'archived'
  targetAudience: string[]
  publishDate: string
  expiryDate?: string
  author: string
  authorId: string
  attachments?: string[]
  views: number
  createdAt?: string
  updatedAt?: string
}

export interface Decision {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  status: 'pending' | 'approved' | 'rejected' | 'deferred'
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  requestedBy: string
  department: string
  impact: string
  impactAr: string
  createdAt?: string
}

export interface Meeting {
  id: string
  title: string
  titleAr: string
  date: string
  time: string
  duration: number
  location: string
  locationAr: string
  isOnline: boolean
  meetingLink?: string
  attendees: string[]
  agenda: string
  agendaAr: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface FinancialReport {
  period: string
  revenue: number
  expenses: number
  profit: number
  growth: number
  breakdown: { category: string; amount: number }[]
  comparison: { previousPeriod: number; change: number }
}

export interface JobNotification {
  id: string
  type: 'new_job' | 'application_received' | 'application_status' | 'job_match'
  title: string
  titleAr: string
  message: string
  messageAr: string
  jobId?: string
  jobTitle?: string
  jobTitleAr?: string
  clubName?: string
  clubNameAr?: string
  applicantName?: string
  applicantId?: string
  deadline?: string
  matchScore?: number
  read: boolean
  createdAt: string
}

class ExecutiveDirectorService {
  // Dashboard
  async getDashboard(): Promise<DashboardStats> {
    try {
      const response = await api.get('/executive-director/dashboard')
      return response.data.data?.stats || response.data.data || {
        totalRevenue: 0,
        monthlyGrowth: 0,
        totalMembers: 0,
        activePartnerships: 0,
        pendingDecisions: 0,
        upcomingMeetings: 0,
        newMembers: 0,
        memberRetention: 0
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
      throw error
    }
  }

  // KPIs
  async getKPIs(): Promise<KPI[]> {
    try {
      const response = await api.get('/executive-director/kpis')
      return response.data.data?.kpis || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch KPIs:', error)
      throw error
    }
  }

  async getKPIDetail(id: string): Promise<KPIDetail> {
    try {
      const response = await api.get(`/executive-director/kpis/${id}/detail`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch KPI detail:', error)
      throw error
    }
  }

  async updateKPI(id: string, data: Partial<KPI>): Promise<KPI> {
    try {
      const response = await api.patch(`/executive-director/kpis/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Failed to update KPI:', error)
      throw error
    }
  }

  // Strategic Initiatives
  async getInitiatives(filters?: { status?: string; priority?: string }): Promise<Initiative[]> {
    try {
      const response = await api.get('/executive-director/initiatives', { params: filters })
      return response.data.data?.initiatives || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch initiatives:', error)
      throw error
    }
  }

  async getInitiative(id: string): Promise<Initiative> {
    try {
      const response = await api.get(`/executive-director/initiatives/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch initiative:', error)
      throw error
    }
  }

  async createInitiative(data: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt'>): Promise<Initiative> {
    try {
      const response = await api.post('/executive-director/initiatives', data)
      return response.data.data
    } catch (error) {
      console.error('Failed to create initiative:', error)
      throw error
    }
  }

  async updateInitiative(id: string, data: Partial<Initiative>): Promise<Initiative> {
    try {
      const response = await api.patch(`/executive-director/initiatives/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Failed to update initiative:', error)
      throw error
    }
  }

  async deleteInitiative(id: string): Promise<void> {
    try {
      await api.delete(`/executive-director/initiatives/${id}`)
    } catch (error) {
      console.error('Failed to delete initiative:', error)
      throw error
    }
  }

  async updateInitiativeProgress(id: string, progress: number): Promise<Initiative> {
    try {
      const response = await api.patch(`/executive-director/initiatives/${id}/progress`, { progress })
      return response.data.data
    } catch (error) {
      console.error('Failed to update initiative progress:', error)
      throw error
    }
  }

  async addInitiativeTask(initiativeId: string, task: Omit<InitiativeTask, 'id'>): Promise<InitiativeTask> {
    try {
      const response = await api.post(`/executive-director/initiatives/${initiativeId}/tasks`, task)
      return response.data.data
    } catch (error) {
      console.error('Failed to add task:', error)
      throw error
    }
  }

  // Partnerships
  async getPartnerships(filters?: { status?: string; type?: string }): Promise<Partnership[]> {
    try {
      const response = await api.get('/executive-director/partnerships', { params: filters })
      return response.data.data?.partnerships || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch partnerships:', error)
      throw error
    }
  }

  async getPartnership(id: string): Promise<Partnership> {
    try {
      const response = await api.get(`/executive-director/partnerships/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch partnership:', error)
      throw error
    }
  }

  async createPartnership(data: Omit<Partnership, 'id' | 'createdAt' | 'updatedAt'>): Promise<Partnership> {
    try {
      const response = await api.post('/executive-director/partnerships', data)
      return response.data.data
    } catch (error) {
      console.error('Failed to create partnership:', error)
      throw error
    }
  }

  async updatePartnership(id: string, data: Partial<Partnership>): Promise<Partnership> {
    try {
      const response = await api.patch(`/executive-director/partnerships/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Failed to update partnership:', error)
      throw error
    }
  }

  async deletePartnership(id: string): Promise<void> {
    try {
      await api.delete(`/executive-director/partnerships/${id}`)
    } catch (error) {
      console.error('Failed to delete partnership:', error)
      throw error
    }
  }

  // Announcements
  async getAnnouncements(filters?: { status?: string; type?: string }): Promise<Announcement[]> {
    try {
      const response = await api.get('/executive-director/announcements', { params: filters })
      return response.data.data?.announcements || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
      throw error
    }
  }

  async getAnnouncement(id: string): Promise<Announcement> {
    try {
      const response = await api.get(`/executive-director/announcements/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch announcement:', error)
      throw error
    }
  }

  async createAnnouncement(data: Omit<Announcement, 'id' | 'views' | 'createdAt' | 'updatedAt'>): Promise<Announcement> {
    try {
      const response = await api.post('/executive-director/announcements', data)
      return response.data.data
    } catch (error) {
      console.error('Failed to create announcement:', error)
      throw error
    }
  }

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement> {
    try {
      const response = await api.patch(`/executive-director/announcements/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Failed to update announcement:', error)
      throw error
    }
  }

  async deleteAnnouncement(id: string): Promise<void> {
    try {
      await api.delete(`/executive-director/announcements/${id}`)
    } catch (error) {
      console.error('Failed to delete announcement:', error)
      throw error
    }
  }

  async publishAnnouncement(id: string): Promise<Announcement> {
    try {
      const response = await api.patch(`/executive-director/announcements/${id}/publish`)
      return response.data.data
    } catch (error) {
      console.error('Failed to publish announcement:', error)
      throw error
    }
  }

  // Decisions
  async getDecisions(filters?: { status?: string }): Promise<Decision[]> {
    try {
      const response = await api.get('/executive-director/decisions', { params: filters })
      return response.data.data?.decisions || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch decisions:', error)
      throw error
    }
  }

  async updateDecisionStatus(id: string, status: Decision['status'], notes?: string): Promise<Decision> {
    try {
      const response = await api.patch(`/executive-director/decisions/${id}/status`, { status, notes })
      return response.data.data
    } catch (error) {
      console.error('Failed to update decision:', error)
      throw error
    }
  }

  // Meetings
  async getMeetings(filters?: { status?: string }): Promise<Meeting[]> {
    try {
      const response = await api.get('/executive-director/meetings', { params: filters })
      return response.data.data?.meetings || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch meetings:', error)
      throw error
    }
  }

  async createMeeting(data: Omit<Meeting, 'id'>): Promise<Meeting> {
    try {
      const response = await api.post('/executive-director/meetings', data)
      return response.data.data
    } catch (error) {
      console.error('Failed to create meeting:', error)
      throw error
    }
  }

  async updateMeeting(id: string, data: Partial<Meeting>): Promise<Meeting> {
    try {
      const response = await api.patch(`/executive-director/meetings/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Failed to update meeting:', error)
      throw error
    }
  }

  // Financial Reports
  async getFinancialReport(period: 'month' | 'quarter' | 'year', year: number, month?: number): Promise<FinancialReport> {
    try {
      const response = await api.get('/executive-director/reports/financial', {
        params: { period, year, month }
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch financial report:', error)
      throw error
    }
  }

  async getAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<any> {
    try {
      const response = await api.get('/executive-director/analytics', { params: { period } })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      throw error
    }
  }

  // Job Notifications (Smart Job Matching System)
  async getJobNotifications(): Promise<JobNotification[]> {
    try {
      const response = await api.get('/executive-director/job-notifications')
      return response.data.data?.notifications || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch job notifications:', error)
      throw error
    }
  }

  async markJobNotificationRead(id: string): Promise<void> {
    try {
      await api.patch(`/executive-director/job-notifications/${id}/read`)
    } catch (error) {
      console.error('Failed to mark notification read:', error)
      throw error
    }
  }

  async getMatchingJobs(): Promise<any[]> {
    try {
      const response = await api.get('/executive-director/matching-jobs')
      return response.data.data?.jobs || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch matching jobs:', error)
      throw error
    }
  }

  async applyToJob(jobId: string, application: any): Promise<any> {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, application)
      return response.data.data
    } catch (error) {
      console.error('Failed to apply to job:', error)
      throw error
    }
  }
}

const executiveDirectorService = new ExecutiveDirectorService()
export default executiveDirectorService
