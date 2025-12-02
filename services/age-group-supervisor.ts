// Age Group Supervisor Service
import api from './api'

interface AgeGroup {
  id: string
  name: string
  nameAr: string
  ageRange: { min: number; max: number }
  coachId: string
  coachName: string
  playersCount: number
  status: 'active' | 'inactive'
}

interface TrainingSession {
  id: string
  ageGroupId: string
  ageGroupName: string
  date: string
  time: string
  duration: number
  location: string
  coachId: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface Match {
  id: string
  ageGroupId: string
  opponent: string
  date: string
  time: string
  location: string
  homeAway: 'home' | 'away'
  status: 'scheduled' | 'completed' | 'cancelled'
  result?: { our: number; opponent: number }
}

class AgeGroupSupervisorService {
  async getDashboard(): Promise<any> {
    try {
      const response = await api.get('/age-group-supervisor/dashboard')
      return response.data.data.stats
    } catch (error) {
      throw error
    }
  }

  async getAgeGroups(): Promise<AgeGroup[]> {
    try {
      const response = await api.get('/age-group-supervisor/groups')
      return response.data.data.groups || []
    } catch (error) {
      throw error
    }
  }

  async createAgeGroup(data: Omit<AgeGroup, 'id'>): Promise<AgeGroup> {
    try {
      const response = await api.post('/age-group-supervisor/groups', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async updateAgeGroup(id: string, data: Partial<AgeGroup>): Promise<AgeGroup> {
    try {
      const response = await api.patch(`/age-group-supervisor/groups/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async getTrainingSchedule(): Promise<TrainingSession[]> {
    try {
      const response = await api.get('/age-group-supervisor/schedule')
      return response.data.data.schedule || []
    } catch (error) {
      throw error
    }
  }

  async addTrainingSession(data: Omit<TrainingSession, 'id'>): Promise<TrainingSession> {
    try {
      const response = await api.post('/age-group-supervisor/schedule', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async updateTrainingSession(id: string, data: Partial<TrainingSession>): Promise<TrainingSession> {
    try {
      const response = await api.patch(`/age-group-supervisor/schedule/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async getMatches(): Promise<Match[]> {
    try {
      const response = await api.get('/age-group-supervisor/matches')
      return response.data.data.matches || []
    } catch (error) {
      throw error
    }
  }

  async addMatch(data: Omit<Match, 'id'>): Promise<Match> {
    try {
      const response = await api.post('/age-group-supervisor/matches', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async updateMatch(id: string, data: Partial<Match>): Promise<Match> {
    try {
      const response = await api.patch(`/age-group-supervisor/matches/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }
}

export default new AgeGroupSupervisorService()
