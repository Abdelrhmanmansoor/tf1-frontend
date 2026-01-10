import axios, { AxiosInstance } from 'axios'
import API_CONFIG from '@/config/api'

// Admin API Instance with custom headers
const createAdminApi = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor to add admin headers
  instance.interceptors.request.use((config) => {
    // Add admin key from localStorage
    const adminKey = typeof window !== 'undefined' ? localStorage.getItem('admin_key') : null
    if (adminKey) {
      config.headers['x-admin-key'] = adminKey
    }

    // Add CSRF token from sessionStorage
    const csrfToken = typeof window !== 'undefined' ? sessionStorage.getItem('csrf_token') : null
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken
    }

    return config
  })

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_key')
          window.location.href = '/login?redirect=/admin'
        }
      }
      if (error.response?.status === 403) {
        // Handle forbidden - no admin access
        console.error('Admin access denied')
      }
      return Promise.reject(error)
    }
  )

  return instance
}

const adminApi = createAdminApi()

// Types
export interface AdminOverview {
  totalUsers: number
  activeUsers: number
  totalPosts: number
  publishedPosts: number
  totalMedia: number
  storageUsed: string
  recentActivity: ActivityLog[]
  userGrowth: ChartData[]
  postStats: ChartData[]
}

export interface ChartData {
  name: string
  value: number
  date?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  createdAt: string
  lastLogin: string
  avatar?: string
  phone?: string
}

export interface Post {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  category: string
  thumbnail?: string
}

export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  size: number
  url: string
  uploadedBy: string
  uploadedAt: string
  folder?: string
}

export interface ActivityLog {
  id: string
  action: string
  description: string
  userId: string
  userName: string
  userRole: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
  resource?: string
  resourceId?: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export interface AdminSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  allowRegistration: boolean
  emailNotifications: boolean
  defaultLanguage: 'ar' | 'en'
  defaultTheme: 'light' | 'dark' | 'system'
  maxUploadSize: number
  allowedFileTypes: string[]
  smtpSettings: {
    host: string
    port: number
    secure: boolean
    user: string
  }
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

export interface Backup {
  id: string
  name: string
  size: number
  createdAt: string
  type: 'full' | 'partial' | 'database'
  status: 'completed' | 'pending' | 'failed'
  downloadUrl?: string
}

export interface AdminKey {
  id: string
  name: string
  key: string
  permissions: string[]
  createdAt: string
  expiresAt?: string
  lastUsed?: string
  isActive: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Admin Service
export const adminService = {
  // Overview/Dashboard
  getOverview: async (): Promise<AdminOverview> => {
    const response = await adminApi.get<ApiResponse<AdminOverview>>('/api/v1/admin-dashboard/overview')
    return response.data.data
  },

  // Users
  getUsers: async (params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<User>> => {
    const response = await adminApi.get<ApiResponse<PaginatedResponse<User>>>('/api/v1/admin-dashboard/users', { params })
    return response.data.data
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await adminApi.get<ApiResponse<User>>(`/api/v1/admin-dashboard/users/${id}`)
    return response.data.data
  },

  createUser: async (data: Partial<User> & { password: string }): Promise<User> => {
    const response = await adminApi.post<ApiResponse<User>>('/api/v1/admin-dashboard/users', data)
    return response.data.data
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await adminApi.put<ApiResponse<User>>(`/api/v1/admin-dashboard/users/${id}`, data)
    return response.data.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await adminApi.delete(`/api/v1/admin-dashboard/users/${id}`)
  },

  suspendUser: async (id: string, reason?: string): Promise<User> => {
    const response = await adminApi.post<ApiResponse<User>>(`/api/v1/admin-dashboard/users/${id}/suspend`, { reason })
    return response.data.data
  },

  activateUser: async (id: string): Promise<User> => {
    const response = await adminApi.post<ApiResponse<User>>(`/api/v1/admin-dashboard/users/${id}/activate`)
    return response.data.data
  },

  // Posts
  getPosts: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    category?: string
    authorId?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Post>> => {
    const response = await adminApi.get<ApiResponse<PaginatedResponse<Post>>>('/api/v1/admin-dashboard/posts', { params })
    return response.data.data
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await adminApi.get<ApiResponse<Post>>(`/api/v1/admin-dashboard/posts/${id}`)
    return response.data.data
  },

  createPost: async (data: Partial<Post>): Promise<Post> => {
    const response = await adminApi.post<ApiResponse<Post>>('/api/v1/admin-dashboard/posts', data)
    return response.data.data
  },

  updatePost: async (id: string, data: Partial<Post>): Promise<Post> => {
    const response = await adminApi.put<ApiResponse<Post>>(`/api/v1/admin-dashboard/posts/${id}`, data)
    return response.data.data
  },

  deletePost: async (id: string): Promise<void> => {
    await adminApi.delete(`/api/v1/admin-dashboard/posts/${id}`)
  },

  publishPost: async (id: string): Promise<Post> => {
    const response = await adminApi.post<ApiResponse<Post>>(`/api/v1/admin-dashboard/posts/${id}/publish`)
    return response.data.data
  },

  archivePost: async (id: string): Promise<Post> => {
    const response = await adminApi.post<ApiResponse<Post>>(`/api/v1/admin-dashboard/posts/${id}/archive`)
    return response.data.data
  },

  // Media
  getMedia: async (params?: {
    page?: number
    limit?: number
    search?: string
    type?: string
    folder?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<MediaFile>> => {
    const response = await adminApi.get<ApiResponse<PaginatedResponse<MediaFile>>>('/api/v1/admin-dashboard/media', { params })
    return response.data.data
  },

  uploadMedia: async (file: File, folder?: string): Promise<MediaFile> => {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) formData.append('folder', folder)
    
    const response = await adminApi.post<ApiResponse<MediaFile>>('/api/v1/admin-dashboard/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  deleteMedia: async (id: string): Promise<void> => {
    await adminApi.delete(`/api/v1/admin-dashboard/media/${id}`)
  },

  bulkDeleteMedia: async (ids: string[]): Promise<void> => {
    await adminApi.post('/api/v1/admin-dashboard/media/bulk-delete', { ids })
  },

  // Logs
  getLogs: async (params?: {
    page?: number
    limit?: number
    search?: string
    action?: string
    userId?: string
    status?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<ActivityLog>> => {
    const response = await adminApi.get<ApiResponse<PaginatedResponse<ActivityLog>>>('/api/v1/admin-dashboard/logs', { params })
    return response.data.data
  },

  exportLogs: async (params?: {
    startDate?: string
    endDate?: string
    format?: 'csv' | 'json'
  }): Promise<Blob> => {
    const response = await adminApi.get('/api/v1/admin-dashboard/logs/export', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  // Settings
  getSettings: async (): Promise<AdminSettings> => {
    const response = await adminApi.get<ApiResponse<AdminSettings>>('/api/v1/admin-dashboard/settings')
    return response.data.data
  },

  updateSettings: async (data: Partial<AdminSettings>): Promise<AdminSettings> => {
    const response = await adminApi.put<ApiResponse<AdminSettings>>('/api/v1/admin-dashboard/settings', data)
    return response.data.data
  },

  testEmailSettings: async (): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.post<ApiResponse<{ success: boolean; message: string }>>('/api/v1/admin-dashboard/settings/test-email')
    return response.data.data
  },

  // Backups
  getBackups: async (): Promise<Backup[]> => {
    const response = await adminApi.get<ApiResponse<Backup[]>>('/api/v1/admin-dashboard/backups')
    return response.data.data
  },

  createBackup: async (type: 'full' | 'partial' | 'database'): Promise<Backup> => {
    const response = await adminApi.post<ApiResponse<Backup>>('/api/v1/admin-dashboard/backups', { type })
    return response.data.data
  },

  deleteBackup: async (id: string): Promise<void> => {
    await adminApi.delete(`/api/v1/admin-dashboard/backups/${id}`)
  },

  downloadBackup: async (id: string): Promise<Blob> => {
    const response = await adminApi.get(`/api/v1/admin-dashboard/backups/${id}/download`, {
      responseType: 'blob',
    })
    return response.data
  },

  restoreBackup: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.post<ApiResponse<{ success: boolean; message: string }>>(`/api/v1/admin-dashboard/backups/${id}/restore`)
    return response.data.data
  },

  // Admin Keys
  getAdminKeys: async (): Promise<AdminKey[]> => {
    const response = await adminApi.get<ApiResponse<AdminKey[]>>('/api/v1/admin-dashboard/admin-keys')
    return response.data.data
  },

  createAdminKey: async (data: { name: string; permissions: string[]; expiresAt?: string }): Promise<AdminKey> => {
    const response = await adminApi.post<ApiResponse<AdminKey>>('/api/v1/admin-dashboard/admin-keys', data)
    return response.data.data
  },

  revokeAdminKey: async (id: string): Promise<void> => {
    await adminApi.delete(`/api/v1/admin-dashboard/admin-keys/${id}`)
  },

  updateAdminKey: async (id: string, data: Partial<AdminKey>): Promise<AdminKey> => {
    const response = await adminApi.put<ApiResponse<AdminKey>>(`/api/v1/admin-dashboard/admin-keys/${id}`, data)
    return response.data.data
  },
}

export default adminService
