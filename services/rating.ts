import { getAuthToken } from '@/lib/auth'
import api from './api'
import API_CONFIG from '@/config/api'

const BASE_URL = API_CONFIG.BASE_URL

interface ReviewData {
  revieweeId: string
  revieweeRole: 'player' | 'coach' | 'specialist' | 'club'
  rating: number
  title?: string
  titleAr?: string
  comment: string
  commentAr?: string
  detailedRatings?: {
    professionalism?: number
    communication?: number
    expertise?: number
    punctuality?: number
    valueForMoney?: number
  }
}

interface Review {
  _id: string
  revieweeId: string
  revieweeRole: string
  reviewerId: {
    _id: string
    firstName: string
    lastName: string
    profileImage?: string
  }
  reviewerRole: string
  rating: number
  title?: string
  review: string
  reviewAr?: string
  detailedRatings?: {
    professionalism?: number
    communication?: number
    expertise?: number
    punctuality?: number
    valueForMoney?: number
  }
  helpfulCount: number
  notHelpfulCount: number
  response?: {
    text: string
    textAr?: string
    respondedAt: string
  }
  createdAt: string
  updatedAt: string
}

interface ReviewStatistics {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    '5': number
    '4': number
    '3': number
    '2': number
    '1': number
  }
  detailedAverages?: {
    professionalism?: number
    communication?: number
    expertise?: number
    punctuality?: number
    valueForMoney?: number
  }
}

interface ReviewsResponse {
  success: boolean
  count: number
  total: number
  page: number
  pages: number
  statistics: ReviewStatistics
  data: Review[]
}

interface TopRatedPlayer {
  _id: string
  userId: string
  fullName: string
  firstName: string
  lastName: string
  avatar?: string
  primarySport: string
  additionalSports?: string[]
  position: string
  positionAr?: string
  level: string
  location?: {
    city: string
    country: string
  }
  bio?: string
  bioAr?: string
  ratingStats: {
    averageRating: number
    totalReviews: number
  }
  verified: boolean
  age?: number
}

class RatingService {
  private async getHeaders() {
    const token = getAuthToken()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  // Create a review
  async createReview(
    reviewData: ReviewData
  ): Promise<{ success: boolean; message: string; data: Review }> {
    const response = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create review')
    }

    return response.json()
  }

  // Get reviews by role
  async getPlayerReviews(
    playerId: string,
    params?: {
      page?: number
      limit?: number
      minRating?: number
      sort?: string
    }
  ): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.minRating)
      queryParams.append('minRating', params.minRating.toString())
    if (params?.sort) queryParams.append('sort', params.sort)

    const response = await fetch(
      `${BASE_URL}/reviews/player/${playerId}?${queryParams.toString()}`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch player reviews')
    }

    return response.json()
  }

  async getCoachReviews(
    coachId: string,
    params?: {
      page?: number
      limit?: number
      minRating?: number
      sort?: string
    }
  ): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.minRating)
      queryParams.append('minRating', params.minRating.toString())
    if (params?.sort) queryParams.append('sort', params.sort)

    const response = await fetch(
      `${BASE_URL}/reviews/coach/${coachId}?${queryParams.toString()}`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch coach reviews')
    }

    return response.json()
  }

  async getSpecialistReviews(
    specialistId: string,
    params?: {
      page?: number
      limit?: number
      minRating?: number
      sort?: string
    }
  ): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.minRating)
      queryParams.append('minRating', params.minRating.toString())
    if (params?.sort) queryParams.append('sort', params.sort)

    const response = await fetch(
      `${BASE_URL}/reviews/specialist/${specialistId}?${queryParams.toString()}`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch specialist reviews')
    }

    return response.json()
  }

  async getClubReviews(
    clubId: string,
    params?: {
      page?: number
      limit?: number
      minRating?: number
      sort?: string
    }
  ): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.minRating)
      queryParams.append('minRating', params.minRating.toString())
    if (params?.sort) queryParams.append('sort', params.sort)

    const response = await fetch(
      `${BASE_URL}/reviews/club/${clubId}?${queryParams.toString()}`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch club reviews')
    }

    return response.json()
  }

  // Get reviews by user (written by user)
  async getUserReviews(
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ReviewsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${BASE_URL}/reviews/user/${userId}?${queryParams.toString()}`,
      {
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user reviews')
    }

    return response.json()
  }

  // Update a review
  async updateReview(
    reviewId: string,
    updateData: Partial<ReviewData>
  ): Promise<{ success: boolean; message: string; data: Review }> {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update review')
    }

    return response.json()
  }

  // Delete a review
  async deleteReview(
    reviewId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete review')
    }

    return response.json()
  }

  // Add response to review
  async addResponse(
    reviewId: string,
    responseText: string,
    responseTextAr?: string
  ): Promise<{ success: boolean; message: string; data: Review }> {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}/response`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ responseText, responseTextAr }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add response')
    }

    return response.json()
  }

  // Mark review as helpful
  async markAsHelpful(
    reviewId: string
  ): Promise<{ success: boolean; message: string; helpfulCount: number }> {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}/helpful`, {
      method: 'POST',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to mark as helpful')
    }

    return response.json()
  }

  // Mark review as not helpful
  async markAsNotHelpful(reviewId: string): Promise<{
    success: boolean
    message: string
    notHelpfulCount: number
  }> {
    const response = await fetch(
      `${BASE_URL}/reviews/${reviewId}/not-helpful`,
      {
        method: 'POST',
        headers: await this.getHeaders(),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to mark as not helpful')
    }

    return response.json()
  }

  // Report a review
  async reportReview(
    reviewId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}/report`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify({ reason }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to report review')
    }

    return response.json()
  }

  // Get top rated players
  async getTopRatedPlayers(params?: {
    limit?: number
    sport?: string
    minReviews?: number
  }): Promise<{ success: boolean; players: TopRatedPlayer[]; total: number }> {
    try {
      const response = await api.get('/search/players/top-rated', {
        params: {
          limit: params?.limit,
          sport: params?.sport,
          minReviews: params?.minReviews,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('[RatingService] Error fetching top rated players:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to fetch top rated players'
      )
    }
  }
}

export const ratingService = new RatingService()
export type {
  ReviewData,
  Review,
  ReviewStatistics,
  ReviewsResponse,
  TopRatedPlayer,
}
