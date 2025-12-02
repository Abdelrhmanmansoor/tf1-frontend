import api from './api'
import type { JobEvent, JobEventsResponse, JobEventType } from '@/types/job-events'

interface ServiceResponse<T> {
  success: boolean
  data: T
  error?: string
}

class JobEventsService {
  private readonly BASE_PATH = '/jobs/events'

  async getRecentEvents(limit: number = 20): Promise<ServiceResponse<JobEvent[]>> {
    try {
      const response = await api.get<JobEventsResponse>(this.BASE_PATH, {
        params: { limit }
      })
      return {
        success: true,
        data: response.data.data || []
      }
    } catch (error: any) {
      const status = error.response?.status
      const message = status === 404 
        ? 'Job events endpoint not available on backend' 
        : error.message || 'Failed to fetch job events'
      console.error('Failed to fetch job events:', message)
      return {
        success: false,
        data: [],
        error: message
      }
    }
  }

  async getEventsByType(eventType: JobEventType, limit: number = 10): Promise<ServiceResponse<JobEvent[]>> {
    try {
      const response = await api.get<JobEventsResponse>(`${this.BASE_PATH}/type/${eventType}`, {
        params: { limit }
      })
      return {
        success: true,
        data: response.data.data || []
      }
    } catch (error: any) {
      const status = error.response?.status
      const message = status === 404 
        ? `Job events type endpoint not available on backend` 
        : error.message || `Failed to fetch ${eventType} events`
      console.error(`Failed to fetch ${eventType} events:`, message)
      return {
        success: false,
        data: [],
        error: message
      }
    }
  }

  async getPublicTickerEvents(limit: number = 20): Promise<ServiceResponse<JobEvent[]>> {
    try {
      const response = await api.get<JobEventsResponse>(`${this.BASE_PATH}/ticker`, {
        params: { limit }
      })
      return {
        success: true,
        data: response.data.data || []
      }
    } catch (error: any) {
      const status = error.response?.status
      const message = status === 404 
        ? 'Ticker endpoint not available - backend implementation pending' 
        : error.message || 'Failed to fetch ticker events'
      console.error('Failed to fetch ticker events:', message)
      return {
        success: false,
        data: [],
        error: message
      }
    }
  }

  async subscribeToEvents(callback: (event: JobEvent) => void): Promise<() => void> {
    return () => {}
  }
}

export const jobEventsService = new JobEventsService()
export default jobEventsService
