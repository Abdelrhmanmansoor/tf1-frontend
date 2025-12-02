// Sports Director Service - Complete Implementation
import api from './api'

// Types
export interface SportsProgram {
  id: string
  name: string
  nameAr: string
  type: 'training' | 'competition' | 'development'
  description: string
  descriptionAr: string
  startDate: string
  endDate: string
  participants: number
  maxParticipants: number
  progress: number
  status: 'active' | 'completed' | 'upcoming' | 'inactive'
  coaches: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Coach {
  id: string
  name: string
  nameAr: string
  email: string
  phone: string
  specialization: string
  specializationAr: string
  rating: number
  sessionsCompleted: number
  playersManaged: number
  winRate: number
  status: 'active' | 'inactive'
  joinDate: string
  avatar?: string
}

export interface CoachPerformance {
  id: string
  coachId: string
  name: string
  rating: number
  sessionsCompleted: number
  playersManaged: number
  winRate: number
  attendanceRate: number
  notes?: string
  performanceHistory: {
    month: string
    rating: number
    sessions: number
  }[]
}

export interface Athlete {
  id: string
  name: string
  nameAr: string
  email: string
  phone: string
  dateOfBirth: string
  age: number
  position: string
  positionAr: string
  team: string
  teamAr: string
  coach: string
  coachId: string
  status: 'active' | 'injured' | 'inactive'
  performance: number
  attendance: number
  joinDate: string
  avatar?: string
}

export interface TechnicalEvent {
  id: string
  title: string
  titleAr: string
  type: 'match' | 'training' | 'tournament' | 'meeting' | 'other'
  date: string
  time: string
  location: string
  locationAr: string
  description: string
  descriptionAr: string
  participants: string[]
  status: 'scheduled' | 'completed' | 'cancelled'
  createdAt?: string
}

export interface DashboardStats {
  activePrograms: number
  totalAthletes: number
  coachingStaff: number
  upcomingEvents: number
  winRate: number
  trainingHours: number
  pendingApprovals: number
  recentMatches: number
  totalWins: number
  totalMatches: number
}

export interface Report {
  id: string
  type: 'performance' | 'attendance' | 'training' | 'match' | 'financial'
  title: string
  titleAr: string
  generatedAt: string
  data: any
}

export interface Notification {
  id: string
  type: 'athlete' | 'coach' | 'program' | 'event' | 'report' | 'match'
  title: string
  titleAr: string
  message: string
  messageAr: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

class SportsDirectorService {
  // Dashboard
  async getDashboard(): Promise<DashboardStats> {
    try {
      const response = await api.get('/sports-director/dashboard')
      return response.data.data?.stats || response.data.data || {
        activePrograms: 0,
        totalAthletes: 0,
        coachingStaff: 0,
        upcomingEvents: 0,
        winRate: 0,
        trainingHours: 0,
        pendingApprovals: 0,
        recentMatches: 0,
        totalWins: 0,
        totalMatches: 0
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
      throw error
    }
  }

  // Programs CRUD
  async getPrograms(filters?: { status?: string; type?: string }): Promise<SportsProgram[]> {
    try {
      const response = await api.get('/sports-director/programs', { params: filters })
      return response.data.data?.programs || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch programs:', error)
      throw error
    }
  }

  async getProgram(id: string): Promise<SportsProgram> {
    try {
      const response = await api.get(`/sports-director/programs/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch program:', error)
      throw error
    }
  }

  async createProgram(data: Omit<SportsProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<SportsProgram> {
    try {
      const response = await api.post('/sports-director/programs', data)
      return response.data.data
    } catch (error) {
      console.error('Failed to create program:', error)
      throw error
    }
  }

  async updateProgram(id: string, data: Partial<SportsProgram>): Promise<SportsProgram> {
    try {
      const response = await api.patch(`/sports-director/programs/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Failed to update program:', error)
      throw error
    }
  }

  async deleteProgram(id: string): Promise<void> {
    try {
      await api.delete(`/sports-director/programs/${id}`)
    } catch (error) {
      console.error('Failed to delete program:', error)
      throw error
    }
  }

  async updateProgramStatus(id: string, status: SportsProgram['status']): Promise<SportsProgram> {
    try {
      const response = await api.patch(`/sports-director/programs/${id}/status`, { status })
      return response.data.data
    } catch (error) {
      console.error('Failed to update program status:', error)
      throw error
    }
  }

  // Coaches CRUD
  async getCoaches(filters?: { status?: string; specialization?: string }): Promise<Coach[]> {
    try {
      const response = await api.get('/sports-director/coaches', { params: filters })
      return response.data.data?.coaches || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch coaches:', error)
      throw error
    }
  }

  async getCoach(id: string): Promise<Coach> {
    try {
      const response = await api.get(`/sports-director/coaches/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch coach:', error)
      throw error
    }
  }

  async getCoachPerformance(coachId?: string): Promise<CoachPerformance[]> {
    try {
      const url = coachId 
        ? `/sports-director/coaches/${coachId}/performance`
        : '/sports-director/coaches/performance'
      const response = await api.get(url)
      return response.data.data?.coaches || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch coach performance:', error)
      throw error
    }
  }

  async updateCoachRating(coachId: string, rating: number, notes?: string): Promise<void> {
    try {
      await api.patch(`/sports-director/coaches/${coachId}/rating`, { rating, notes })
    } catch (error) {
      console.error('Failed to update coach rating:', error)
      throw error
    }
  }

  async assignCoachToProgram(coachId: string, programId: string): Promise<void> {
    try {
      await api.post(`/sports-director/coaches/${coachId}/assign`, { programId })
    } catch (error) {
      console.error('Failed to assign coach:', error)
      throw error
    }
  }

  // Athletes CRUD
  async getAthletes(filters?: { 
    team?: string
    coach?: string
    status?: string
    category?: string 
  }): Promise<Athlete[]> {
    try {
      const response = await api.get('/sports-director/athletes', { params: filters })
      return response.data.data?.athletes || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch athletes:', error)
      throw error
    }
  }

  async getAthlete(id: string): Promise<Athlete> {
    try {
      const response = await api.get(`/sports-director/athletes/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch athlete:', error)
      throw error
    }
  }

  async getAthletePerformance(athleteId: string): Promise<any> {
    try {
      const response = await api.get(`/sports-director/athletes/${athleteId}/performance`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch athlete performance:', error)
      throw error
    }
  }

  async getAthleteAttendance(athleteId: string): Promise<any> {
    try {
      const response = await api.get(`/sports-director/athletes/${athleteId}/attendance`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch athlete attendance:', error)
      throw error
    }
  }

  // Technical Events
  async getEvents(filters?: { type?: string; status?: string }): Promise<TechnicalEvent[]> {
    try {
      const response = await api.get('/sports-director/events', { params: filters })
      return response.data.data?.events || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch events:', error)
      throw error
    }
  }

  async getEvent(id: string): Promise<TechnicalEvent> {
    try {
      const response = await api.get(`/sports-director/events/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch event:', error)
      throw error
    }
  }

  async createEvent(data: Omit<TechnicalEvent, 'id' | 'createdAt'>): Promise<TechnicalEvent> {
    try {
      const response = await api.post('/sports-director/events', data)
      return response.data.data
    } catch (error) {
      console.error('Failed to create event:', error)
      throw error
    }
  }

  async updateEvent(id: string, data: Partial<TechnicalEvent>): Promise<TechnicalEvent> {
    try {
      const response = await api.patch(`/sports-director/events/${id}`, data)
      return response.data.data
    } catch (error) {
      console.error('Failed to update event:', error)
      throw error
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await api.delete(`/sports-director/events/${id}`)
    } catch (error) {
      console.error('Failed to delete event:', error)
      throw error
    }
  }

  // Analytics & Reports
  async getAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<any> {
    try {
      const response = await api.get('/sports-director/analytics', { params: { period } })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      throw error
    }
  }

  async getTrainingAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<any> {
    try {
      const response = await api.get('/sports-director/analytics/training', { params: { period } })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch training analytics:', error)
      throw error
    }
  }

  async getMatchAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<any> {
    try {
      const response = await api.get('/sports-director/analytics/matches', { params: { period } })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch match analytics:', error)
      throw error
    }
  }

  async getReports(type?: string): Promise<Report[]> {
    try {
      const response = await api.get('/sports-director/reports', { params: { type } })
      return response.data.data?.reports || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch reports:', error)
      throw error
    }
  }

  async generateReport(type: Report['type'], params?: any): Promise<Report> {
    try {
      const response = await api.post('/sports-director/reports/generate', { type, ...params })
      return response.data.data
    } catch (error) {
      console.error('Failed to generate report:', error)
      throw error
    }
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get('/sports-director/notifications')
      return response.data.data?.notifications || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      throw error
    }
  }

  async markNotificationRead(id: string): Promise<void> {
    try {
      await api.patch(`/sports-director/notifications/${id}/read`)
    } catch (error) {
      console.error('Failed to mark notification read:', error)
      throw error
    }
  }

  async markAllNotificationsRead(): Promise<void> {
    try {
      await api.patch('/sports-director/notifications/read-all')
    } catch (error) {
      console.error('Failed to mark all notifications read:', error)
      throw error
    }
  }

  // Training Hours
  async getTrainingHours(period?: string): Promise<{ total: number; breakdown: any[] }> {
    try {
      const response = await api.get('/sports-director/training-hours', { params: { period } })
      return response.data.data || { total: 0, breakdown: [] }
    } catch (error) {
      console.error('Failed to fetch training hours:', error)
      throw error
    }
  }

  // Win Rate / Achievements
  async getWinRate(): Promise<{ winRate: number; totalMatches: number; wins: number; losses: number; draws: number }> {
    try {
      const response = await api.get('/sports-director/win-rate')
      return response.data.data || { winRate: 0, totalMatches: 0, wins: 0, losses: 0, draws: 0 }
    } catch (error) {
      console.error('Failed to fetch win rate:', error)
      throw error
    }
  }

  async getAchievements(): Promise<any[]> {
    try {
      const response = await api.get('/sports-director/achievements')
      return response.data.data?.achievements || response.data.data || []
    } catch (error) {
      console.error('Failed to fetch achievements:', error)
      throw error
    }
  }

  // Send message to coach
  async sendMessageToCoach(coachId: string, message: { subject: string; body: string }): Promise<void> {
    try {
      await api.post(`/sports-director/coaches/${coachId}/message`, message)
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }
}

const sportsDirectorService = new SportsDirectorService()
export default sportsDirectorService
