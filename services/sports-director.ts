// Sports Director Service
import api from './api'

interface SportsProgram {
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
  status: 'active' | 'completed' | 'upcoming'
  coaches: string[]
}

interface CoachPerformance {
  id: string
  name: string
  rating: number
  sessionsCompleted: number
  playersManaged: number
  winRate: number
}

class SportsDirectorService {
  async getDashboard(): Promise<any> {
    try {
      const response = await api.get('/sports-director/dashboard')
      return response.data.data.stats
    } catch (error) {
      throw error
    }
  }

  async getPrograms(): Promise<SportsProgram[]> {
    try {
      const response = await api.get('/sports-director/programs')
      return response.data.data.programs || []
    } catch (error) {
      throw error
    }
  }

  async createProgram(data: Omit<SportsProgram, 'id'>): Promise<SportsProgram> {
    try {
      const response = await api.post('/sports-director/programs', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async updateProgram(id: string, data: Partial<SportsProgram>): Promise<SportsProgram> {
    try {
      const response = await api.patch(`/sports-director/programs/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async deleteProgram(id: string): Promise<any> {
    try {
      const response = await api.delete(`/sports-director/programs/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getCoachPerformance(): Promise<CoachPerformance[]> {
    try {
      const response = await api.get('/sports-director/coaches/performance')
      return response.data.data.coaches || []
    } catch (error) {
      throw error
    }
  }

  async getAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<any> {
    try {
      const response = await api.get('/sports-director/analytics/training', {
        params: { period }
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  }
}

export default new SportsDirectorService()
