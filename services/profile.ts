import api from './api'

export interface ProfileData {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'player' | 'coach' | 'specialist' | 'club'
  avatar?: string
  isVerified: boolean
  verificationBadge?: {
    isVerified: boolean
    verifiedAt: string
  }
  bio?: string
  bioAr?: string
  location?: {
    city: string
    country: string
    coordinates?: number[]
  }
  phoneNumber?: string
  dateOfBirth?: string
  profile?: any
  createdAt: string
  stats?: {
    profileViews?: number
    connections?: number
    rating?: {
      average: number
      count: number
    }
  }
  socialLinks?: {
    website?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
  }
}

export interface UniversalProfileResponse {
  success: boolean
  role: 'player' | 'coach' | 'specialist' | 'club'
  profile: any
}

class ProfileService {
  private BASE_PATH = '/global'

  /**
   * Get universal profile by ID - Auto-detects role (player/coach/specialist/club)
   * GET /global/profile/:id
   * Backend automatically searches all profile types and returns the matching one
   *
   * @param profileId - The profile ID to fetch
   * @returns Promise<UniversalProfileResponse>
   */
  async getUniversalProfile(
    profileId: string
  ): Promise<UniversalProfileResponse> {
    try {
      const response = await api.get(`${this.BASE_PATH}/profile/${profileId}`)
      return response.data
    } catch (error: any) {
      console.error('[ProfileService] Error fetching universal profile:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to fetch profile'
      )
    }
  }

  /**
   * Get user profile by ID (legacy method - kept for compatibility)
   * @deprecated Use getUniversalProfile instead
   */
  async getProfile(userId: string): Promise<ProfileData> {
    try {
      const response = await this.getUniversalProfile(userId)
      return this.transformProfileData(response)
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Transform universal profile response to ProfileData format
   */
  private transformProfileData(
    response: UniversalProfileResponse
  ): ProfileData {
    const { role, profile } = response
    const userId = profile.userId

    return {
      _id: profile._id,
      firstName: userId?.firstName || '',
      lastName: userId?.lastName || '',
      email: userId?.email || '',
      role: role,
      avatar: userId?.profileImage || userId?.avatar,
      isVerified: userId?.isVerified || false,
      verificationBadge: userId?.verificationBadge,
      bio: profile.bio,
      bioAr: profile.bioAr,
      location: profile.location || userId?.location,
      phoneNumber: userId?.phoneNumber,
      dateOfBirth: userId?.dateOfBirth,
      profile: profile,
      createdAt: userId?.createdAt || profile.createdAt,
      stats: {
        profileViews: profile.profileViews,
        connections: profile.connections?.length || 0,
        rating: profile.rating || profile.ratingStats,
      },
      socialLinks: profile.socialLinks || userId?.socialLinks,
    }
  }

  /**
   * Track profile view
   * POST /profiles/:userId/view
   *
   * @param userId - The user ID whose profile was viewed
   */
  async trackProfileView(userId: string): Promise<void> {
    try {
      await api.post(`${this.BASE_PATH}/${userId}/view`)
    } catch (error: any) {
      console.error('[ProfileService] Error tracking profile view:', error)
      // Don't throw error for tracking, just log it
    }
  }

  /**
   * Send connection request
   * POST /profiles/:userId/connect
   *
   * @param userId - The user ID to connect with
   */
  async sendConnectionRequest(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`${this.BASE_PATH}/${userId}/connect`)
      return response.data
    } catch (error: any) {
      console.error('[ProfileService] Error sending connection request:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to send connection request'
      )
    }
  }

  /**
   * Report profile
   * POST /profiles/:userId/report
   *
   * @param userId - The user ID to report
   * @param reason - Reason for reporting
   * @param description - Detailed description
   */
  async reportProfile(
    userId: string,
    reason: string,
    description?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`${this.BASE_PATH}/${userId}/report`, {
        reason,
        description,
      })
      return response.data
    } catch (error: any) {
      console.error('[ProfileService] Error reporting profile:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to report profile'
      )
    }
  }
}

const profileService = new ProfileService()
export default profileService
