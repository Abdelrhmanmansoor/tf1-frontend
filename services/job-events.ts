import api from './api'
import type { JobEvent, JobEventsResponse, JobEventType } from '@/types/job-events'

class JobEventsService {
  private readonly BASE_PATH = '/jobs/events'

  async getRecentEvents(limit: number = 20): Promise<JobEvent[]> {
    try {
      const response = await api.get<JobEventsResponse>(this.BASE_PATH, {
        params: { limit }
      })
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch job events:', error)
      return []
    }
  }

  async getEventsByType(eventType: JobEventType, limit: number = 10): Promise<JobEvent[]> {
    try {
      const response = await api.get<JobEventsResponse>(`${this.BASE_PATH}/type/${eventType}`, {
        params: { limit }
      })
      return response.data.data || []
    } catch (error) {
      console.error(`Failed to fetch ${eventType} events:`, error)
      return []
    }
  }

  async getPublicTickerEvents(limit: number = 20): Promise<JobEvent[]> {
    try {
      const response = await api.get<JobEventsResponse>(`${this.BASE_PATH}/ticker`, {
        params: { limit }
      })
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch ticker events:', error)
      return []
    }
  }

  async subscribeToEvents(callback: (event: JobEvent) => void): Promise<() => void> {
    return () => {}
  }
}

export const jobEventsService = new JobEventsService()
export default jobEventsService
