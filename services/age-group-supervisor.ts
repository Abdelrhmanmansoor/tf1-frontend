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
  ageGroupName: string
  opponent: string
  date: string
  time: string
  location: string
  homeAway: 'home' | 'away'
  status: 'scheduled' | 'completed' | 'cancelled'
  result?: { our: number; opponent: number }
}

interface Coach {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  assignedAgeGroups: string[]
  status: 'active' | 'inactive'
}

interface Registration {
  id: string
  playerName: string
  dateOfBirth: string
  age: number
  parentName: string
  parentPhone: string
  parentEmail?: string
  requestedAgeGroup: string
  requestedAgeGroupId: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
}

interface DashboardStats {
  totalAgeGroups: number
  totalPlayers: number
  totalCoaches: number
  upcomingMatches: number
  activeTrainings: number
  pendingRegistrations: number
}

class AgeGroupSupervisorService {
  // Dashboard
  async getDashboard(): Promise<DashboardStats> {
    try {
      const response = await api.get('/age-group-supervisor/dashboard')
      return response.data.data.stats
    } catch (error) {
      throw error
    }
  }

  // Age Groups CRUD
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
      const response = await api.put(`/age-group-supervisor/groups/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async deleteAgeGroup(id: string): Promise<void> {
    try {
      await api.delete(`/age-group-supervisor/groups/${id}`)
    } catch (error) {
      throw error
    }
  }

  async assignCoachToGroup(groupId: string, coachId: string): Promise<AgeGroup> {
    try {
      const response = await api.patch(`/age-group-supervisor/groups/${groupId}/coach`, { coachId })
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  // Training Schedule CRUD
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
      const response = await api.put(`/age-group-supervisor/schedule/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async deleteTrainingSession(id: string): Promise<void> {
    try {
      await api.delete(`/age-group-supervisor/schedule/${id}`)
    } catch (error) {
      throw error
    }
  }

  // Matches CRUD
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
      const response = await api.put(`/age-group-supervisor/matches/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async deleteMatch(id: string): Promise<void> {
    try {
      await api.delete(`/age-group-supervisor/matches/${id}`)
    } catch (error) {
      throw error
    }
  }

  // Coaches Management
  async getCoaches(): Promise<Coach[]> {
    try {
      const response = await api.get('/age-group-supervisor/coaches')
      return response.data.data.coaches || []
    } catch (error) {
      throw error
    }
  }

  // Registrations Management
  async getRegistrations(status?: string): Promise<Registration[]> {
    try {
      const url = status ? `/age-group-supervisor/registrations?status=${status}` : '/age-group-supervisor/registrations'
      const response = await api.get(url)
      return response.data.data.registrations || []
    } catch (error) {
      throw error
    }
  }

  async approveRegistration(id: string, ageGroupId: string): Promise<void> {
    try {
      await api.post(`/age-group-supervisor/registrations/${id}/approve`, { 
        ageGroupId,
        status: 'approved'
      })
    } catch (error) {
      throw error
    }
  }

  async rejectRegistration(id: string, reason?: string): Promise<void> {
    try {
      await api.post(`/age-group-supervisor/registrations/${id}/reject`, { 
        status: 'rejected',
        reason 
      })
    } catch (error) {
      throw error
    }
  }

  // Players Management
  async getPlayers(ageGroupId?: string): Promise<any[]> {
    try {
      const url = ageGroupId ? `/age-group-supervisor/players?ageGroupId=${ageGroupId}` : '/age-group-supervisor/players'
      const response = await api.get(url)
      return response.data.data.players || []
    } catch (error) {
      throw error
    }
  }

  // Reports
  async getReport(type: 'players' | 'attendance' | 'performance' | 'registrations'): Promise<any> {
    try {
      const response = await api.get(`/age-group-supervisor/reports/${type}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  }
}

export default new AgeGroupSupervisorService()
