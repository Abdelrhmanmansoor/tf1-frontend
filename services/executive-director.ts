// Executive Director Service
import api from './api'

interface KPI {
  id: string
  name: string
  nameAr: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  period: string
}

interface Initiative {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  status: 'planning' | 'in-progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  deadline: string
  progress: number
  owner: string
  budget: number
  spent: number
}

interface Partnership {
  id: string
  partnerName: string
  partnerNameAr: string
  type: 'sponsor' | 'strategic' | 'vendor' | 'affiliate'
  status: 'active' | 'negotiating' | 'expired'
  startDate: string
  endDate: string
  value: number
  contactPerson: string
  contactEmail: string
}

class ExecutiveDirectorService {
  async getDashboard(): Promise<any> {
    try {
      const response = await api.get('/executive-director/dashboard')
      return response.data.data.stats
    } catch (error) {
      throw error
    }
  }

  async getKPIs(): Promise<KPI[]> {
    try {
      const response = await api.get('/executive-director/kpis')
      return response.data.data.kpis || []
    } catch (error) {
      throw error
    }
  }

  async updateKPI(id: string, data: Partial<KPI>): Promise<KPI> {
    try {
      const response = await api.patch(`/executive-director/kpis/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async getInitiatives(): Promise<Initiative[]> {
    try {
      const response = await api.get('/executive-director/initiatives')
      return response.data.data.initiatives || []
    } catch (error) {
      throw error
    }
  }

  async createInitiative(data: Omit<Initiative, 'id'>): Promise<Initiative> {
    try {
      const response = await api.post('/executive-director/initiatives', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async updateInitiative(id: string, data: Partial<Initiative>): Promise<Initiative> {
    try {
      const response = await api.patch(`/executive-director/initiatives/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async getPartnerships(): Promise<Partnership[]> {
    try {
      const response = await api.get('/executive-director/partnerships')
      return response.data.data.partnerships || []
    } catch (error) {
      throw error
    }
  }

  async createPartnership(data: Omit<Partnership, 'id'>): Promise<Partnership> {
    try {
      const response = await api.post('/executive-director/partnerships', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async getFinancialReport(period: 'month' | 'quarter' | 'year', year: number, month?: number): Promise<any> {
    try {
      const response = await api.get('/executive-director/reports/financial', {
        params: { period, year, month }
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  }
}

export default new ExecutiveDirectorService()
