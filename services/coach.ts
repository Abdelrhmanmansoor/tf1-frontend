/* eslint-disable no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
// Coach API Service
// This service handles all coach-related API calls

import api from './api'
import type {
  CoachProfile,
  CreateCoachProfileData,
  UpdateCoachProfileData,
  DashboardStats,
  SearchCoachesParams,
  NearbyCoachesParams,
  CoachSearchResult,
  PaginationInfo,
  Availability,
  DaySchedule,
  BookingSettings,
  CancellationPolicy,
  Privacy,
  Photo,
  Video,
  AddVideoData,
  UpdatePrivacyData,
  Student,
  StudentListParams,
  StudentListResponse,
  StudentDetailsResponse,
  TrainingSession,
  SessionListParams,
  SessionListResponse,
  SessionDetailsResponse,
  AddStudentRequest,
  AddStudentResponse,
  UpdateSessionStatusRequest,
  UpdateSessionStatusResponse,
} from '@/types/coach'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

interface ProfileResponse {
  success: boolean
  message?: string
  profile: CoachProfile
}

interface StatsResponse {
  success: boolean
  stats: DashboardStats
}

interface SearchResponse {
  success: boolean
  coaches: CoachSearchResult[]
  pagination: PaginationInfo
}

interface AvailabilityResponse {
  success: boolean
  availability: Availability
}

class CoachService {
  private readonly BASE_PATH = '/coaches'

  /**
   * 1. Create Coach Profile
   * POST /coaches/profile
   */
  async createProfile(
    profileData: CreateCoachProfileData
  ): Promise<CoachProfile> {
    try {
      const response = await api.post<ProfileResponse>(
        `${this.BASE_PATH}/profile`,
        profileData
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 2. Get My Profile
   * GET /coaches/profile/me
   */
  async getMyProfile(): Promise<CoachProfile> {
    try {
      const response = await api.get<ProfileResponse>(
        `${this.BASE_PATH}/profile/me`
      )
      const p = response.data.profile
      const origin = API_CONFIG.BASE_URL.replace(/\/api\/v\d+$/, '')
      if (p?.avatar && !/^https?:\/\//.test(p.avatar)) {
        p.avatar = p.avatar.startsWith('/') ? origin + p.avatar : origin + '/' + p.avatar
      }
      if (p?.bannerImage && !/^https?:\/\//.test(p.bannerImage)) {
        p.bannerImage = p.bannerImage.startsWith('/') ? origin + p.bannerImage : origin + '/' + p.bannerImage
      }
      return p
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 3. Get Coach Profile by ID
   * GET /coaches/profile/:id
   */
  async getProfileById(id: string): Promise<CoachProfile> {
    try {
      const response = await api.get<ProfileResponse>(
        `${this.BASE_PATH}/profile/${id}`
      )
      const p = response.data.profile
      const origin = API_CONFIG.BASE_URL.replace(/\/api\/v\d+$/, '')
      if (p?.avatar && !/^https?:\/\//.test(p.avatar)) {
        p.avatar = p.avatar.startsWith('/') ? origin + p.avatar : origin + '/' + p.avatar
      }
      if (p?.bannerImage && !/^https?:\/\//.test(p.bannerImage)) {
        p.bannerImage = p.bannerImage.startsWith('/') ? origin + p.bannerImage : origin + '/' + p.bannerImage
      }
      return p
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 4. Update Coach Profile
   * PUT /coaches/profile
   */
  async updateProfile(
    profileData: UpdateCoachProfileData
  ): Promise<CoachProfile> {
    try {
      const response = await api.put<ProfileResponse>(
        `${this.BASE_PATH}/profile`,
        profileData
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 5. Delete Coach Profile
   * DELETE /coaches/profile
   */
  async deleteProfile(): Promise<void> {
    try {
      await api.delete(`${this.BASE_PATH}/profile`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 6. Search Coaches
   * GET /coaches/search
   */
  async searchCoaches(params: SearchCoachesParams): Promise<{
    coaches: CoachSearchResult[]
    pagination: PaginationInfo
  }> {
    try {
      const response = await api.get<SearchResponse>(
        `${this.BASE_PATH}/search`,
        {
          params,
        }
      )
      return {
        coaches: response.data.coaches,
        pagination: response.data.pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 7. Get Nearby Coaches
   * GET /coaches/nearby
   */
  async getNearbyCoaches(params: NearbyCoachesParams): Promise<{
    coaches: CoachSearchResult[]
    pagination: PaginationInfo
  }> {
    try {
      const response = await api.get<SearchResponse>(
        `${this.BASE_PATH}/nearby`,
        {
          params,
        }
      )
      return {
        coaches: response.data.coaches,
        pagination: response.data.pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 8. Get My Availability
   * GET /coaches/availability
   */
  async getMyAvailability(): Promise<Availability> {
    try {
      const response = await api.get<AvailabilityResponse>(
        `${this.BASE_PATH}/availability`
      )
      return response.data.availability
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 9. Update Weekly Schedule
   * PUT /coaches/availability/schedule
   */
  async updateWeeklySchedule(
    weeklySchedule: DaySchedule[]
  ): Promise<Availability> {
    try {
      const response = await api.put<AvailabilityResponse>(
        `${this.BASE_PATH}/availability/schedule`,
        { weeklySchedule }
      )
      return response.data.availability
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 10. Block Date
   * POST /coaches/availability/block-date
   */
  async blockDate(
    date: string,
    reason?: string,
    reasonAr?: string
  ): Promise<Availability> {
    try {
      const response = await api.post<AvailabilityResponse>(
        `${this.BASE_PATH}/availability/block-date`,
        { date, reason, reasonAr }
      )
      return response.data.availability
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 11. Unblock Date
   * POST /coaches/availability/unblock-date
   */
  async unblockDate(date: string): Promise<Availability> {
    try {
      const response = await api.post<AvailabilityResponse>(
        `${this.BASE_PATH}/availability/unblock-date`,
        { date }
      )
      return response.data.availability
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 12. Get Available Slots for Date
   * GET /coaches/availability/slots/:date
   */
  async getAvailableSlots(
    date: string,
    coachId: string
  ): Promise<{
    date: string
    availableSlots: Array<{
      startTime: string
      endTime: string
      isBooked: boolean
    }>
  }> {
    try {
      const response = await api.get<{
        success: boolean
        date: string
        availableSlots: Array<{
          startTime: string
          endTime: string
          isBooked: boolean
        }>
      }>(`${this.BASE_PATH}/availability/slots/${date}`, {
        params: { coachId },
      })
      return {
        date: response.data.date,
        availableSlots: response.data.availableSlots,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 13. Update Booking Settings
   * PUT /coaches/availability/settings
   */
  async updateBookingSettings(
    settings: BookingSettings
  ): Promise<Availability> {
    try {
      const response = await api.put<AvailabilityResponse>(
        `${this.BASE_PATH}/availability/settings`,
        settings
      )
      return response.data.availability
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 14. Update Cancellation Policy
   * PUT /coaches/availability/cancellation-policy
   */
  async updateCancellationPolicy(
    cancellationPolicy: CancellationPolicy
  ): Promise<Availability> {
    try {
      const response = await api.put<AvailabilityResponse>(
        `${this.BASE_PATH}/availability/cancellation-policy`,
        { cancellationPolicy }
      )
      return response.data.availability
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 15. Get Dashboard Stats
   * GET /coaches/dashboard/stats
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<StatsResponse>(
        `${this.BASE_PATH}/dashboard/stats`
      )
      return response.data.stats
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 22. Upload Avatar (Cloudinary)
   * POST /coaches/profile/avatar
   */
  async uploadAvatar(file: File): Promise<{
    url: string
    thumbnailUrl: string
    mediumUrl: string
    largeUrl: string
  }> {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await api.post<{
        success: boolean
        message: string
        avatar: {
          url: string
          thumbnailUrl: string
          mediumUrl: string
          largeUrl: string
        }
      }>(`${this.BASE_PATH}/profile/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data.avatar
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 23. Upload Banner (Cloudinary)
   * POST /coaches/profile/banner
   */
  async uploadBanner(file: File): Promise<{
    url: string
    smallUrl: string
    mediumUrl: string
    largeUrl: string
  }> {
    try {
      const formData = new FormData()
      formData.append('banner', file)

      const response = await api.post<{
        success: boolean
        message: string
        banner: {
          url: string
          smallUrl: string
          mediumUrl: string
          largeUrl: string
        }
      }>(`${this.BASE_PATH}/profile/banner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data.banner
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 24. Add Photo (Cloudinary Upload)
   * POST /coaches/photos
   */
  async addPhoto(
    file: File,
    caption?: string,
    captionAr?: string
  ): Promise<{
    photo: Photo
    totalPhotos: number
  }> {
    try {
      const formData = new FormData()
      formData.append('photo', file)
      if (caption) formData.append('caption', caption)
      if (captionAr) formData.append('captionAr', captionAr)

      const response = await api.post<{
        success: boolean
        message: string
        photo: Photo
        totalPhotos: number
      }>(`${this.BASE_PATH}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return {
        photo: response.data.photo,
        totalPhotos: response.data.totalPhotos,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 25. Remove Photo
   * DELETE /coaches/photos/:photoId
   */
  async removePhoto(
    photoId: string
  ): Promise<{ success: boolean; totalPhotos: number }> {
    try {
      const response = await api.delete<{
        success: boolean
        message: string
        totalPhotos: number
      }>(`${this.BASE_PATH}/photos/${photoId}`)

      return {
        success: response.data.success,
        totalPhotos: response.data.totalPhotos,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 26. Add Video
   * POST /coaches/videos
   */
  async addVideo(videoData: AddVideoData): Promise<CoachProfile> {
    try {
      const response = await api.post<ProfileResponse>(
        `${this.BASE_PATH}/videos`,
        videoData
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 27. Remove Video
   * DELETE /coaches/videos/:videoId
   */
  async removeVideo(videoId: string): Promise<CoachProfile> {
    try {
      const response = await api.delete<ProfileResponse>(
        `${this.BASE_PATH}/videos/${videoId}`
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 28. Update Privacy Settings
   * PUT /coaches/privacy
   */
  async updatePrivacy(privacyData: UpdatePrivacyData): Promise<CoachProfile> {
    try {
      const response = await api.put<ProfileResponse>(
        `${this.BASE_PATH}/privacy`,
        privacyData
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ==================== STUDENTS & SESSIONS APIs ====================

  /**
   * 29. Add a New Student
   * POST /coaches/students
   */
  async addStudent(studentData: AddStudentRequest): Promise<Student> {
    try {
      const response = await api.post<AddStudentResponse>(
        `${this.BASE_PATH}/students`,
        studentData
      )
      return response.data.student
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 30. Get Coach's Students List
   * GET /coaches/students
   */
  async getStudents(params?: StudentListParams): Promise<{
    students: Student[]
    pagination: {
      currentPage: number
      totalPages: number
      totalStudents: number
      hasMore: boolean
    }
    stats: {
      total: number
      active: number
      former: number
    }
  }> {
    try {
      const response = await api.get<StudentListResponse>(
        `${this.BASE_PATH}/students`,
        {
          params,
        }
      )
      return {
        students: response.data.students,
        pagination: response.data.pagination,
        stats: response.data.stats,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 31. Get Single Student Details
   * GET /coaches/students/:studentId
   */
  async getStudentById(studentId: string): Promise<{
    student: Student
    recentSessions: Array<{
      _id: string
      date: Date | string
      duration: number
      status: string
      rating?: any
    }>
  }> {
    try {
      const response = await api.get<StudentDetailsResponse>(
        `${this.BASE_PATH}/students/${studentId}`
      )
      return {
        student: response.data.student,
        recentSessions: response.data.recentSessions,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 32. Get Coach's Sessions List
   * GET /coaches/sessions
   */
  async getSessions(params?: SessionListParams): Promise<{
    sessions: TrainingSession[]
    pagination: {
      currentPage: number
      totalPages: number
      totalSessions: number
      hasMore: boolean
    }
    stats: {
      total: number
      upcoming: number
      completed: number
      cancelled: number
    }
  }> {
    try {
      const response = await api.get<SessionListResponse>(
        `${this.BASE_PATH}/sessions`,
        {
          params,
        }
      )
      return {
        sessions: response.data.sessions,
        pagination: response.data.pagination,
        stats: response.data.stats,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 33. Get Single Session Details
   * GET /coaches/sessions/:sessionId
   */
  async getSessionById(sessionId: string): Promise<TrainingSession> {
    try {
      const response = await api.get<SessionDetailsResponse>(
        `${this.BASE_PATH}/sessions/${sessionId}`
      )
      return response.data.session
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 34. Update Session Status
   * PATCH /coaches/sessions/:sessionId/status
   */
  async updateSessionStatus(
    sessionId: string,
    statusData: UpdateSessionStatusRequest
  ): Promise<{
    message: string
    session: {
      _id: string
      status: string
      coachNotes?: string
    }
  }> {
    try {
      const response = await api.patch<UpdateSessionStatusResponse>(
        `${this.BASE_PATH}/sessions/${sessionId}/status`,
        statusData
      )
      return {
        message: response.data.message,
        session: response.data.session,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors
   * @private
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 'An error occurred'
      const code = error.response.data?.code
      const errors = error.response.data?.errors
      const err = new Error(message)
      ;(err as any).code = code
      ;(err as any).status = error.response.status
      ;(err as any).errors = errors
      ;(err as any).details = error.response.data

      // Log validation errors for debugging
      if (errors) {
        console.error('Validation errors:', JSON.stringify(errors, null, 2))
      }
      console.error(
        'Full error response:',
        JSON.stringify(error.response.data, null, 2)
      )

      return err
    } else if (error.request) {
      return new Error('Network error. Please check your connection.')
    } else {
      return new Error(error.message || 'An unexpected error occurred')
    }
  }
}

// Export singleton instance
export default new CoachService()
