// Secretary Service
import api from './api'

interface Meeting {
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
  attendees: Array<{ id: string; name: string; email: string; status: 'pending' | 'confirmed' | 'declined' }>
  agenda: string
  agendaAr: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  notes?: string
}

interface Document {
  id: string
  name: string
  type: 'contract' | 'letter' | 'report' | 'memo'
  fileUrl: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  priority: 'high' | 'normal' | 'low'
  assignedTo: string
  dueDate: string
  notes?: string
}

interface Message {
  id: string
  from: { id: string; name: string; email: string }
  to: { id: string; name: string; email: string }
  subject: string
  subjectAr: string
  body: string
  bodyAr: string
  priority: 'high' | 'normal'
  date: string
  read: boolean
}

interface Task {
  id: string
  title: string
  titleAr: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  assignedBy: string
}

class SecretaryService {
  async getDashboard(): Promise<any> {
    try {
      const response = await api.get('/secretary/dashboard')
      return response.data.data.stats
    } catch (error) {
      throw error
    }
  }

  async getMeetings(): Promise<Meeting[]> {
    try {
      const response = await api.get('/secretary/calendar')
      return response.data.data.meetings || []
    } catch (error) {
      throw error
    }
  }

  async createMeeting(data: Omit<Meeting, 'id'>): Promise<Meeting> {
    try {
      const response = await api.post('/secretary/calendar/meetings', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async updateMeeting(id: string, data: Partial<Meeting>): Promise<Meeting> {
    try {
      const response = await api.patch(`/secretary/calendar/meetings/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async deleteMeeting(id: string): Promise<any> {
    try {
      const response = await api.delete(`/secretary/calendar/meetings/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getDocuments(): Promise<Document[]> {
    try {
      const response = await api.get('/secretary/documents')
      return response.data.data.documents || []
    } catch (error) {
      throw error
    }
  }

  async uploadDocument(data: Omit<Document, 'id'>): Promise<Document> {
    try {
      const response = await api.post('/secretary/documents', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async approveDocument(id: string): Promise<any> {
    try {
      const response = await api.post(`/secretary/documents/${id}/approve`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async rejectDocument(id: string, reason: string): Promise<any> {
    try {
      const response = await api.post(`/secretary/documents/${id}/reject`, { reason })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getMessages(): Promise<Message[]> {
    try {
      const response = await api.get('/secretary/messages')
      return response.data.data.messages || []
    } catch (error) {
      throw error
    }
  }

  async sendMessage(data: Omit<Message, 'id' | 'date' | 'read'>): Promise<Message> {
    try {
      const response = await api.post('/secretary/messages', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const response = await api.get('/secretary/tasks')
      return response.data.data.tasks || []
    } catch (error) {
      throw error
    }
  }

  async createTask(data: Omit<Task, 'id'>): Promise<Task> {
    try {
      const response = await api.post('/secretary/tasks', data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    try {
      const response = await api.patch(`/secretary/tasks/${id}`, data)
      return response.data.data
    } catch (error) {
      throw error
    }
  }

  async completeTask(id: string): Promise<any> {
    try {
      const response = await api.patch(`/secretary/tasks/${id}`, { status: 'completed' })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new SecretaryService()
