// Specialist Service - All specialist-related API calls
// Based on the Specialist API Documentation

import api from './api'

// ============================================
// TYPES & INTERFACES
// ============================================

export interface BilingualText {
  en: string
  ar?: string
}

export interface SpecialistProfile {
  _id: string
  userId: string
  primarySpecialization: string
  additionalSpecializations?: string[]
  bio: BilingualText
  avatar?: string
  bannerImage?: string
  rating: {
    average: number
    count: number
  }
  clientStats: {
    totalClients: number
    activeClients: number
  }
  yearsOfExperience: number
  experienceYears?: number // Backend field name
  education?: Array<{
    degree: string
    institution: string
    graduationYear: number
    fieldOfStudy?: string
  }>
  previousExperience?: Array<{
    // Backend field name for education
    degree: string
    institution: string
    graduationYear: number
    fieldOfStudy?: string
  }>
  certifications?: Array<{
    name: string
    issuingOrganization: string
    issueDate: string
    expiryDate?: string
    credentialId?: string
  }>
  licenses?: Array<{
    licenseNumber: string
    issuingAuthority: string
    issueDate: string
    expiryDate?: string
    status: string
  }>
  professionalAssociations?: Array<{
    // Backend field name for licenses
    licenseNumber: string
    issuingAuthority: string
    issueDate: string
    expiryDate?: string
    status: string
  }>
  languages: string[]
  serviceLocations?: Array<{
    type: string
    name: string
    address?: any
    coordinates?: any
    isPrimary?: boolean
  }>
  consultationTypes?: string[]
  onlineConsultation?: {
    available: boolean
    platforms?: string[]
  }
}

export interface DashboardStats {
  todaySessions: {
    total: number
    completed: number
    upcoming: number
  }
  thisWeekSessions: {
    total: number
    completed: number
    upcoming: number
  }
  clients: {
    total: number
    active: number
    newThisMonth: number
  }
  pendingRequests: number
  upcomingSessionsToday: Array<{
    _id: string
    clientName: string
    time: string
    duration: number
  }>
  recentActivity: Array<{
    type: string
    timestamp: string
    description: string
  }>
}

export interface Session {
  _id: string
  specialistId: string
  clientId: any
  sessionType: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  location?: {
    type: string
    name?: string
    address?: string
  }
  attendance: {
    status: string
    checkInTime?: string
    checkOutTime?: string
  }
  price: number
  sessionNotes?: string
  physiotherapy?: any
  nutrition?: any
  fitness?: any
  psychology?: any
}

export interface ConsultationRequest {
  _id: string
  clientId: string
  specialistId: string
  serviceType: string
  specialization: string
  status: string
  preferredDates: Array<{
    date: string
    timeSlots: string[]
  }>
  clientMessage?: string
  injuryDetails?: any
  createdAt: string
}

export interface Client {
  _id: string
  specialistId: string
  clientId: any
  status: string
  startDate: string
  goals?: Array<{
    description: string
    targetDate: string
    status: string
    progress: number
  }>
  sessionStats: {
    totalSessions: number
    completedSessions: number
    upcomingSessions: number
  }
  medicalHistory?: any
  measurements?: any[]
  painTracking?: any[]
  notes?: any[]
}

export interface Program {
  _id: string
  specialistId: string
  programType: string
  title: BilingualText
  description?: BilingualText
  duration: {
    value: number
    unit: string
  }
  isTemplate: boolean
  usageStats?: {
    timesAssigned: number
    activeClients: number
  }
  physiotherapy?: any
  nutrition?: any
  fitness?: any
  psychology?: any
}

export interface Availability {
  _id: string
  specialistId: string
  weeklySchedule: Array<{
    day: string
    isAvailable: boolean
    slots: Array<{
      startTime: string
      endTime: string
      isBooked?: boolean
      bookingId?: string
    }>
  }>
  dateOverrides?: any[]
  blockedPeriods?: any[]
  bookingSettings?: {
    minNoticeHours: number
    maxAdvanceBookingDays: number
    sessionDurations: number[]
  }
}

export interface Analytics {
  period: string
  totalSessions: number
  completedSessions: number
  cancelledSessions: number
  noShowSessions: number
  newClients: number
  totalClients: number
  activeClients: number
  averageRating: number
  totalReviews: number
  sessionTypes: {
    individual: number
    group: number
    online: number
  }
  specializationBreakdown: Record<string, number>
}

// ============================================
// PROFILE MANAGEMENT
// ============================================

/**
 * Create specialist profile
 */
export const createProfile = async (profileData: any) => {
  const response = await api.post('/specialists/profile', profileData)
  return response.data
}

/**
 * Get authenticated specialist's profile
 */
export const getMyProfile = async (): Promise<{
  success: boolean
  profile: SpecialistProfile
}> => {
  const response = await api.get('/specialists/profile/me')
  return response.data
}

/**
 * Get specialist profile by ID
 */
export const getProfileById = async (
  id: string
): Promise<{ success: boolean; profile: SpecialistProfile }> => {
  const response = await api.get(`/specialists/profile/${id}`)
  return response.data
}

/**
 * Update specialist profile
 */
export const updateProfile = async (
  profileData: Partial<SpecialistProfile>
) => {
  const response = await api.put('/specialists/profile', profileData)
  return response.data
}

/**
 * Delete specialist profile (soft delete)
 */
export const deleteProfile = async () => {
  const response = await api.delete('/specialists/profile')
  return response.data
}

// ============================================
// SEARCH & DISCOVERY
// ============================================

/**
 * Search specialists with filters
 */
export const searchSpecialists = async (params: {
  specialization?: string
  location?: string
  sport?: string
  minRating?: number
  maxDistance?: number
  lat?: number
  lng?: number
  injuryType?: string
  dietType?: string
  trainingStyle?: string
  onlineAvailable?: boolean
  language?: string
  page?: number
  limit?: number
}) => {
  const response = await api.get('/specialists/search', { params })
  return response.data
}

/**
 * Get nearby specialists using geospatial search
 */
export const getNearbySpecialists = async (params: {
  lat: number
  lng: number
  maxDistance?: number
  specialization?: string
  limit?: number
}) => {
  const response = await api.get('/specialists/nearby', { params })
  return response.data
}

// ============================================
// AVAILABILITY MANAGEMENT
// ============================================

/**
 * Get specialist's availability settings
 */
export const getMyAvailability = async (): Promise<{
  success: boolean
  availability: Availability
}> => {
  const response = await api.get('/specialists/availability')
  return response.data
}

/**
 * Get available time slots for a specific date
 */
export const getAvailableSlots = async (
  specialistId: string,
  params: {
    date: string // YYYY-MM-DD
    duration?: number
  }
) => {
  const response = await api.get(
    `/specialists/availability/${specialistId}/slots`,
    { params }
  )
  return response.data
}

/**
 * Update weekly schedule
 */
export const updateWeeklySchedule = async (weeklySchedule: any) => {
  const response = await api.put('/specialists/availability/weekly', {
    weeklySchedule,
  })
  return response.data
}

/**
 * Block or override availability for a specific date
 */
export const blockDate = async (params: {
  date: string
  isAvailable: boolean
  reason?: string
}) => {
  const response = await api.post(
    '/specialists/availability/block-date',
    params
  )
  return response.data
}

/**
 * Remove date override
 */
export const unblockDate = async (date: string) => {
  const response = await api.delete('/specialists/availability/block-date', {
    data: { date },
  })
  return response.data
}

/**
 * Block a range of dates (vacation)
 */
export const blockPeriod = async (params: {
  startDate: string
  endDate: string
  reason?: string
}) => {
  const response = await api.post(
    '/specialists/availability/block-period',
    params
  )
  return response.data
}

// ============================================
// CONSULTATION REQUESTS
// ============================================

/**
 * Get all consultation requests
 */
export const getConsultationRequests = async (params?: {
  status?: string
  page?: number
  limit?: number
}): Promise<{
  success: boolean
  count: number
  requests: ConsultationRequest[]
  pagination: any
}> => {
  const response = await api.get('/specialists/requests', { params })
  return response.data
}

/**
 * Accept a consultation request
 */
export const acceptRequest = async (
  requestId: string,
  data: {
    message: string
    suggestedDate: string
    suggestedTime: string
    duration: number
  }
) => {
  const response = await api.put(
    `/specialists/requests/${requestId}/accept`,
    data
  )
  return response.data
}

/**
 * Reject a consultation request
 */
export const rejectRequest = async (requestId: string, reason: string) => {
  const response = await api.put(`/specialists/requests/${requestId}/reject`, {
    reason,
  })
  return response.data
}

/**
 * Confirm booking and create session
 */
export const confirmBooking = async (
  requestId: string,
  data: {
    date: string
    time: string
    duration: number
    location?: any
    notes?: string
  }
) => {
  const response = await api.put(
    `/specialists/requests/${requestId}/confirm`,
    data
  )
  return response.data
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Get all consultation sessions
 */
export const getSessions = async (params?: {
  status?: string
  clientId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}): Promise<{
  success: boolean
  count: number
  sessions: Session[]
  pagination: any
}> => {
  const response = await api.get('/specialists/sessions', { params })
  return response.data
}

/**
 * Get today's sessions
 */
export const getTodaySessions = async (): Promise<{
  success: boolean
  count: number
  sessions: Session[]
}> => {
  const response = await api.get('/specialists/sessions/today')
  return response.data
}

/**
 * Get session by ID
 */
export const getSessionById = async (
  sessionId: string
): Promise<{ success: boolean; session: Session }> => {
  const response = await api.get(`/specialists/sessions/${sessionId}`)
  return response.data
}

/**
 * Create a consultation session manually
 */
export const createSession = async (sessionData: {
  clientId: string
  sessionType: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  location?: any
  notes?: string
}) => {
  const response = await api.post('/specialists/sessions', sessionData)
  return response.data
}

/**
 * Update session details
 */
export const updateSession = async (sessionId: string, sessionData: any) => {
  const response = await api.put(
    `/specialists/sessions/${sessionId}`,
    sessionData
  )
  return response.data
}

/**
 * Mark session as completed
 */
export const completeSession = async (
  sessionId: string,
  data: {
    sessionNotes: string
    physiotherapy?: any
    nutrition?: any
    fitness?: any
    psychology?: any
    progress?: any
  }
) => {
  const response = await api.put(
    `/specialists/sessions/${sessionId}/complete`,
    data
  )
  return response.data
}

/**
 * Cancel a scheduled session
 */
export const cancelSession = async (
  sessionId: string,
  data: {
    reason: string
    cancelledBy: 'specialist' | 'client'
  }
) => {
  const response = await api.put(
    `/specialists/sessions/${sessionId}/cancel`,
    data
  )
  return response.data
}

/**
 * Reschedule a session
 */
export const rescheduleSession = async (
  sessionId: string,
  data: {
    newDate: string
    newTime: string
    reason?: string
  }
) => {
  const response = await api.put(
    `/specialists/sessions/${sessionId}/reschedule`,
    data
  )
  return response.data
}

// ============================================
// CLIENT MANAGEMENT
// ============================================

/**
 * Get all clients
 */
export const getClients = async (params?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{
  success: boolean
  count: number
  clients: Client[]
  pagination: any
}> => {
  const response = await api.get('/specialists/clients', { params })
  return response.data
}

/**
 * Get client details with full history
 */
export const getClientDetails = async (clientId: string) => {
  const response = await api.get(`/specialists/clients/${clientId}`)
  return response.data
}

/**
 * Add a private note about the client
 */
export const addClientNote = async (
  clientId: string,
  data: {
    note: string
    category: string
  }
) => {
  const response = await api.post(
    `/specialists/clients/${clientId}/notes`,
    data
  )
  return response.data
}

/**
 * Add body measurements for tracking progress
 */
export const addClientMeasurement = async (
  clientId: string,
  measurements: any
) => {
  const response = await api.post(
    `/specialists/clients/${clientId}/measurements`,
    measurements
  )
  return response.data
}

/**
 * Update client goals and objectives
 */
export const updateClientGoals = async (clientId: string, goals: any[]) => {
  const response = await api.put(`/specialists/clients/${clientId}/goals`, {
    goals,
  })
  return response.data
}

/**
 * Add pain tracking entry for physiotherapy clients
 */
export const addPainTracking = async (
  clientId: string,
  data: {
    area: string
    painLevel: number
    description?: string
  }
) => {
  const response = await api.post(
    `/specialists/clients/${clientId}/pain-tracking`,
    data
  )
  return response.data
}

/**
 * Add fitness metrics for tracking athletic performance
 */
export const addFitnessMetrics = async (clientId: string, metrics: any) => {
  const response = await api.post(
    `/specialists/clients/${clientId}/fitness-metrics`,
    metrics
  )
  return response.data
}

// ============================================
// PROGRAM MANAGEMENT
// ============================================

/**
 * Get all programs created by the specialist
 */
export const getPrograms = async (params?: {
  programType?: string
  isTemplate?: boolean
  status?: string
  category?: string
}): Promise<{ success: boolean; count: number; programs: Program[] }> => {
  const response = await api.get('/specialists/programs', { params })
  return response.data
}

/**
 * Get reusable program templates
 */
export const getProgramTemplates = async (params?: {
  programType?: string
}): Promise<{ success: boolean; count: number; templates: Program[] }> => {
  const response = await api.get('/specialists/programs/templates', { params })
  return response.data
}

/**
 * Get program by ID
 */
export const getProgramById = async (
  programId: string
): Promise<{ success: boolean; program: Program }> => {
  const response = await api.get(`/specialists/programs/${programId}`)
  return response.data
}

/**
 * Create a new program or template
 */
export const createProgram = async (programData: any) => {
  const response = await api.post('/specialists/programs', programData)
  return response.data
}

/**
 * Update an existing program
 */
export const updateProgram = async (programId: string, programData: any) => {
  const response = await api.put(
    `/specialists/programs/${programId}`,
    programData
  )
  return response.data
}

/**
 * Soft delete a program
 */
export const deleteProgram = async (programId: string) => {
  const response = await api.delete(`/specialists/programs/${programId}`)
  return response.data
}

/**
 * Assign a program to a client
 */
export const assignProgram = async (
  programId: string,
  clientId: string,
  data?: {
    startDate?: string
    customizations?: any
  }
) => {
  const response = await api.post(
    `/specialists/programs/${programId}/assign/${clientId}`,
    data
  )
  return response.data
}

/**
 * Clone an existing program as a reusable template
 */
export const cloneProgram = async (programId: string) => {
  const response = await api.post(`/specialists/programs/${programId}/clone`)
  return response.data
}

// ============================================
// DASHBOARD & ANALYTICS
// ============================================

/**
 * Get dashboard overview statistics
 */
export const getDashboardStats = async (): Promise<{
  success: boolean
  stats: DashboardStats
}> => {
  const response = await api.get('/specialists/dashboard')
  return response.data
}

/**
 * Get detailed analytics for a specific period
 */
export const getAnalytics = async (params?: {
  period?: 'week' | 'month' | 'year'
}): Promise<{ success: boolean; analytics: Analytics }> => {
  const response = await api.get('/specialists/analytics', { params })
  return response.data
}

// ============================================
// MEDIA GALLERY
// ============================================

/**
 * Add a photo to the profile gallery
 */
export const addPhoto = async (data: {
  url: string
  caption?: BilingualText
  category?: string
}) => {
  const response = await api.post('/specialists/gallery/photos', data)
  return response.data
}

/**
 * Remove a photo from the gallery
 */
export const removePhoto = async (photoId: string) => {
  const response = await api.delete(`/specialists/gallery/photos/${photoId}`)
  return response.data
}

/**
 * Add a video to the profile gallery
 */
export const addVideo = async (data: {
  url: string
  thumbnail?: string
  title?: BilingualText
  description?: BilingualText
}) => {
  const response = await api.post('/specialists/gallery/videos', data)
  return response.data
}

/**
 * Remove a video from the gallery
 */
export const removeVideo = async (videoId: string) => {
  const response = await api.delete(`/specialists/gallery/videos/${videoId}`)
  return response.data
}

// ============================================
// SETTINGS
// ============================================

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (privacy: {
  showEmail?: boolean
  showPhone?: boolean
  showLocation?: boolean
  allowDirectBooking?: boolean
  profileVisibility?: string
}) => {
  const response = await api.put('/specialists/settings/privacy', { privacy })
  return response.data
}

/**
 * Update notification preferences
 */
export const updateNotificationSettings = async (notifications: {
  emailNotifications?: boolean
  smsNotifications?: boolean
  pushNotifications?: boolean
  newRequests?: boolean
  sessionReminders?: boolean
  cancellations?: boolean
  reviews?: boolean
}) => {
  const response = await api.put('/specialists/settings/notifications', {
    notifications,
  })
  return response.data
}

// ============================================
// IMAGE UPLOADS
// ============================================

/**
 * Upload avatar image
 */
export const uploadAvatar = async (
  file: File
): Promise<{
  url: string
  thumbnailUrl: string
  mediumUrl: string
  largeUrl: string
}> => {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await api.post('/specialists/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.avatar
}

/**
 * Upload banner image
 */
export const uploadBanner = async (
  file: File
): Promise<{
  url: string
  smallUrl: string
  mediumUrl: string
  largeUrl: string
}> => {
  const formData = new FormData()
  formData.append('banner', file)

  const response = await api.post('/specialists/upload/banner', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.banner
}

const specialistService = {
  // Profile
  createProfile,
  getMyProfile,
  getProfileById,
  updateProfile,
  deleteProfile,

  // Search
  searchSpecialists,
  getNearbySpecialists,

  // Availability
  getMyAvailability,
  getAvailableSlots,
  updateWeeklySchedule,
  blockDate,
  unblockDate,
  blockPeriod,

  // Requests
  getConsultationRequests,
  acceptRequest,
  rejectRequest,
  confirmBooking,

  // Sessions
  getSessions,
  getTodaySessions,
  getSessionById,
  createSession,
  updateSession,
  completeSession,
  cancelSession,
  rescheduleSession,

  // Clients
  getClients,
  getClientDetails,
  addClientNote,
  addClientMeasurement,
  updateClientGoals,
  addPainTracking,
  addFitnessMetrics,

  // Programs
  getPrograms,
  getProgramTemplates,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  assignProgram,
  cloneProgram,

  // Dashboard & Analytics
  getDashboardStats,
  getAnalytics,

  // Gallery
  addPhoto,
  removePhoto,
  addVideo,
  removeVideo,

  // Settings
  updatePrivacySettings,
  updateNotificationSettings,

  // Image uploads
  uploadAvatar,
  uploadBanner,
}

export default specialistService
