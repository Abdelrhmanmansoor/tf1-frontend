/* eslint-disable no-unused-vars */
// Player API Service
// This service handles all player-related API calls

import api from './api'
import type {
  PlayerProfile,
  CreatePlayerProfileData,
  UpdatePlayerProfileData,
  DashboardStats,
  SearchPlayersParams,
  NearbyPlayersParams,
  PlayerSearchResult,
  PaginationInfo,
  AddPhotoData,
  AddVideoData,
  Photo,
  Video,
  UpdatePrivacyData,
  Privacy,
  PlayerAgeCategory,
  AgeCategory,
  Team,
  TrainingProgram,
  TrainingSession,
  AgeCategoryMatch,
  PlayerPerformanceStats,
  AgeCategoryAnnouncement,
  PlayerDashboardData,
  TeamMember,
  CoachInfo,
} from '@/types/player'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

interface ProfileResponse {
  success: boolean
  message?: string
  profile: PlayerProfile
}

interface StatsResponse {
  success: boolean
  stats: DashboardStats
}

interface SearchResponse {
  success: boolean
  players: PlayerSearchResult[]
  pagination: PaginationInfo
}

interface PhotoResponse {
  success: boolean
  message: string
  photos: Photo[]
}

interface VideoResponse {
  success: boolean
  message: string
  videos: Video[]
}

interface PrivacyResponse {
  success: boolean
  message: string
  privacy: Privacy
}

class PlayerService {
  private readonly BASE_PATH = '/players'

  /**
   * 1. Create Player Profile
   * POST /players/profile
   */
  async createProfile(
    profileData: CreatePlayerProfileData
  ): Promise<PlayerProfile> {
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
   * GET /players/profile/me
   */
  async getMyProfile(): Promise<PlayerProfile> {
    try {
      const response = await api.get<ProfileResponse>(
        `${this.BASE_PATH}/profile/me`
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 3. Get Player Profile by ID
   * GET /players/profile/:id
   */
  async getProfileById(id: string): Promise<PlayerProfile> {
    try {
      const response = await api.get<ProfileResponse>(
        `${this.BASE_PATH}/profile/${id}`
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 4. Update Player Profile
   * PUT /players/profile
   */
  async updateProfile(
    profileData: UpdatePlayerProfileData
  ): Promise<PlayerProfile> {
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
   * 5. Delete Player Profile
   * DELETE /players/profile
   */
  async deleteProfile(): Promise<void> {
    try {
      await api.delete(`${this.BASE_PATH}/profile`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 6. Search Players
   * GET /players/search
   */
  async searchPlayers(params: SearchPlayersParams): Promise<{
    players: PlayerSearchResult[]
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
        players: response.data.players,
        pagination: response.data.pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 7. Get Nearby Players
   * GET /players/nearby
   */
  async getNearbyPlayers(params: NearbyPlayersParams): Promise<{
    players: PlayerSearchResult[]
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
        players: response.data.players,
        pagination: response.data.pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 8. Get Dashboard Stats
   * GET /players/dashboard/stats
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
   * 9. Add Photo (Cloudinary Upload)
   * POST /players/photos
   */
  async addPhoto(
    file: File,
    caption?: string,
    captionAr?: string
  ): Promise<{
    photo: {
      url: string
      publicId: string
      thumbnailUrl: string
      mediumUrl: string
      largeUrl: string
      caption?: string
      captionAr?: string
    }
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
        photo: {
          url: string
          publicId: string
          thumbnailUrl: string
          mediumUrl: string
          largeUrl: string
          caption?: string
          captionAr?: string
        }
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
   * 10. Remove Photo
   * DELETE /players/photos/:photoId
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
   * 11. Add Video
   * POST /players/videos
   */
  async addVideo(videoData: AddVideoData): Promise<Video[]> {
    try {
      const response = await api.post<VideoResponse>(
        `${this.BASE_PATH}/videos`,
        videoData
      )
      return response.data.videos
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 12. Remove Video
   * DELETE /players/videos/:videoId
   */
  async removeVideo(videoId: string): Promise<Video[]> {
    try {
      const response = await api.delete<VideoResponse>(
        `${this.BASE_PATH}/videos/${videoId}`
      )
      return response.data.videos
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 13. Update Privacy Settings
   * PUT /players/privacy
   */
  async updatePrivacy(privacyData: UpdatePrivacyData): Promise<Privacy> {
    try {
      const response = await api.put<PrivacyResponse>(
        `${this.BASE_PATH}/privacy`,
        privacyData
      )
      return response.data.privacy
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 14. Upload Avatar (Cloudinary)
   * POST /players/profile/avatar
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
   * 15. Upload Banner (Cloudinary)
   * POST /players/profile/banner
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
   * Handle API errors
   * @private
   */
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 'An error occurred'
      const code = error.response.data?.code
      const err = new Error(message)
      ;(err as any).code = code
      ;(err as any).status = error.response.status
      return err
    } else if (error.request) {
      return new Error('Network error. Please check your connection.')
    } else {
      return new Error(error.message || 'An unexpected error occurred')
    }
  }

  // ============================================
  // Age Category System Methods
  // ============================================

  /**
   * Get Player's Age Category Assignment
   * GET /players/age-category
   */
  async getMyAgeCategory(): Promise<PlayerAgeCategory | null> {
    try {
      const response = await api.get<{ success: boolean; data: PlayerAgeCategory }>(
        `${this.BASE_PATH}/age-category`
      )
      return response.data.data || null
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw this.handleError(error)
    }
  }

  /**
   * Get Player's Team Info
   * GET /players/team
   */
  async getMyTeam(): Promise<Team | null> {
    try {
      const response = await api.get<{ success: boolean; data: Team }>(
        `${this.BASE_PATH}/team`
      )
      return response.data.data || null
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw this.handleError(error)
    }
  }

  /**
   * Get Team Members
   * GET /players/team/members
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const response = await api.get<{ success: boolean; data: TeamMember[] }>(
        `${this.BASE_PATH}/team/members`
      )
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch team members:', error)
      return []
    }
  }

  /**
   * Get Assigned Coach
   * GET /players/coach
   */
  async getMyCoach(): Promise<CoachInfo | null> {
    try {
      const response = await api.get<{ success: boolean; data: CoachInfo }>(
        `${this.BASE_PATH}/coach`
      )
      return response.data.data || null
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw this.handleError(error)
    }
  }

  /**
   * Get Training Programs for Player's Age Category
   * GET /players/training-programs
   */
  async getTrainingPrograms(): Promise<TrainingProgram[]> {
    try {
      const response = await api.get<{ success: boolean; data: TrainingProgram[] }>(
        `${this.BASE_PATH}/training-programs`
      )
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch training programs:', error)
      return []
    }
  }

  /**
   * Get Training Program Details
   * GET /players/training-programs/:id
   */
  async getTrainingProgram(id: string): Promise<TrainingProgram | null> {
    try {
      const response = await api.get<{ success: boolean; data: TrainingProgram }>(
        `${this.BASE_PATH}/training-programs/${id}`
      )
      return response.data.data || null
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get Upcoming Training Sessions
   * GET /players/training-sessions
   */
  async getUpcomingTrainingSessions(limit?: number): Promise<TrainingSession[]> {
    try {
      const response = await api.get<{ success: boolean; data: TrainingSession[] }>(
        `${this.BASE_PATH}/training-sessions`,
        { params: { limit, status: 'scheduled' } }
      )
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch training sessions:', error)
      return []
    }
  }

  /**
   * Get Matches for Player's Age Category
   * GET /players/matches
   */
  async getAgeCategoryMatches(status?: 'upcoming' | 'completed' | 'all'): Promise<AgeCategoryMatch[]> {
    try {
      const response = await api.get<{ success: boolean; data: AgeCategoryMatch[] }>(
        `${this.BASE_PATH}/matches`,
        { params: { status } }
      )
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch matches:', error)
      return []
    }
  }

  /**
   * Get Player Performance Stats
   * GET /players/performance
   */
  async getPerformanceStats(): Promise<PlayerPerformanceStats | null> {
    try {
      const response = await api.get<{ success: boolean; data: PlayerPerformanceStats }>(
        `${this.BASE_PATH}/performance`
      )
      return response.data.data || null
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      console.error('Failed to fetch performance stats:', error)
      return null
    }
  }

  /**
   * Get Age Category Announcements
   * GET /players/announcements
   */
  async getAgeCategoryAnnouncements(): Promise<AgeCategoryAnnouncement[]> {
    try {
      const response = await api.get<{ success: boolean; data: AgeCategoryAnnouncement[] }>(
        `${this.BASE_PATH}/announcements`
      )
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
      return []
    }
  }

  /**
   * Mark Announcement as Read
   * PATCH /players/announcements/:id/read
   */
  async markAnnouncementRead(id: string): Promise<void> {
    try {
      await api.patch(`${this.BASE_PATH}/announcements/${id}/read`)
    } catch (error) {
      console.error('Failed to mark announcement as read:', error)
    }
  }

  /**
   * Get Complete Player Dashboard Data (Age Category)
   * This combines all age-category related data
   * GET /players/dashboard/age-category
   */
  async getAgeCategoryDashboard(): Promise<PlayerDashboardData> {
    try {
      const response = await api.get<{ success: boolean; data: PlayerDashboardData }>(
        `${this.BASE_PATH}/dashboard/age-category`
      )
      return response.data.data || {
        playerCategory: null,
        upcomingMatches: [],
        trainingPrograms: [],
        upcomingTrainings: [],
        performanceStats: null,
        announcements: [],
        teamMembers: []
      }
    } catch (error) {
      console.error('Failed to fetch age category dashboard:', error)
      return {
        playerCategory: null,
        upcomingMatches: [],
        trainingPrograms: [],
        upcomingTrainings: [],
        performanceStats: null,
        announcements: [],
        teamMembers: []
      }
    }
  }

  /**
   * Update Training Session Attendance
   * PATCH /players/training-sessions/:id/attendance
   */
  async updateSessionAttendance(
    sessionId: string,
    attendance: 'present' | 'absent' | 'excused'
  ): Promise<void> {
    try {
      await api.patch(`${this.BASE_PATH}/training-sessions/${sessionId}/attendance`, { attendance })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get Progress History
   * GET /players/progress
   */
  async getProgressHistory(): Promise<{ date: string; rating: number; notes?: string }[]> {
    try {
      const response = await api.get<{ success: boolean; data: any[] }>(
        `${this.BASE_PATH}/progress`
      )
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch progress history:', error)
      return []
    }
  }
}

// Export singleton instance
// eslint-disable-next-line import/no-anonymous-default-export
export default new PlayerService()
