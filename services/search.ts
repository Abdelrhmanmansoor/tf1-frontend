import api from './api'

// Base Search Filters
export interface SearchFilters {
  q?: string
  role?: string
  sport?: string
  location?: string
  minRating?: number
  verified?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Coach-specific filters
export interface CoachSearchFilters extends SearchFilters {
  specialization?: string
  maxPrice?: number
  minPrice?: number
  experienceLevel?: string
  coachingLevel?: string
  certifications?: string
  language?: string
  availability?: string
}

// Player-specific filters
export interface PlayerSearchFilters extends SearchFilters {
  position?: string
  skillLevel?: string
  minAge?: number
  maxAge?: number
  preferredFoot?: string
  height?: number
  weight?: number
  availability?: string
}

// Specialist-specific filters
export interface SpecialistSearchFilters extends SearchFilters {
  specialization?: string
  language?: string
  yearsOfExperience?: number
}

// Club-specific filters
export interface ClubSearchFilters extends SearchFilters {
  organizationType?: string
  facilities?: string
  programs?: string
}

// Job search filters
export interface JobSearchParams {
  q?: string
  sport?: string
  location?: string
  jobType?: string
  salaryMin?: number
  salaryMax?: number
  minSalary?: number
  maxSalary?: number
  postedWithin?: string
  experienceRequired?: string
  status?: string
  clubId?: string
  page?: number
  limit?: number
  sortBy?: string
}

// Job search result
export interface JobSearchResult {
  _id: string
  title: string
  club: {
    _id: string
    name: string
    logo?: string
  }
  jobType: string
  sport?: string
  position?: string
  location?: string
  salaryRange?: string
  deadline?: string
  applicationCount?: number
  postedAt: string
}

export interface JobSearchResponse {
  success: boolean
  results: JobSearchResult[]
  total: number
  page: number
  pages: number
  hasMore: boolean
}

// Global search result - matches actual backend response
export interface GlobalSearchResult {
  success: boolean
  query?: string
  total: {
    users: number
    clubs: number
    jobs: number
  }
  results: {
    users?: {
      coaches?: any[]
      players?: any[]
      specialists?: any[]
    }
    clubs?: any[]
    jobs?: any[]
  }
}

// Autocomplete result
export interface AutocompleteResult {
  _id: string
  name: string
  type: string
  avatar?: string
  logo?: string
  sport?: string
  rating?: number
  location?: string
  position?: string
}

// Saved search
export interface SavedSearch {
  _id: string
  name: string
  searchQuery: string
  searchType: string
  filters: any
  notifyOnNewResults: boolean
  isActive: boolean
  createdAt: string
}

// Search history
export interface SearchHistory {
  _id: string
  searchQuery: string
  searchType: string
  filters: any
  resultsCount: number
  clickedResults: Array<{
    resultId: string
    resultType: string
    clickedAt: string
  }>
  createdAt: string
}

class SearchService {
  private BASE_PATH = '/search'

  // ========== GLOBAL SEARCH ==========
  /**
   * Global search across all entities
   * GET /search/all
   */
  async globalSearch(
    query: string,
    page = 1,
    limit = 10
  ): Promise<GlobalSearchResult> {
    try {
      const response = await api.get<GlobalSearchResult>(
        `${this.BASE_PATH}/all`,
        { params: { q: query, page, limit } }
      )
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error in global search:', error)
      console.error('[SearchService] Error response:', error.response?.data)
      console.error('[SearchService] Error status:', error.response?.status)
      throw new Error(
        error.response?.data?.message || 'Failed to perform global search'
      )
    }
  }

  // ========== ENTITY-SPECIFIC SEARCHES ==========
  /**
   * Search users
   * GET /search/users
   */
  async searchUsers(filters: SearchFilters) {
    try {
      const response = await api.get(`${this.BASE_PATH}/users`, {
        params: filters,
      })
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error searching users:', error)
      throw new Error(error.response?.data?.message || 'Failed to search users')
    }
  }

  /**
   * Search coaches
   * GET /search/coaches
   */
  async searchCoaches(filters: CoachSearchFilters) {
    try {
      const response = await api.get(`${this.BASE_PATH}/coaches`, {
        params: filters,
      })
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error searching coaches:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to search coaches'
      )
    }
  }

  /**
   * Search players
   * GET /search/players
   */
  async searchPlayers(filters: PlayerSearchFilters) {
    try {
      const response = await api.get(`${this.BASE_PATH}/players`, {
        params: filters,
      })
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error searching players:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to search players'
      )
    }
  }

  /**
   * Search specialists
   * GET /search/specialists
   */
  async searchSpecialists(filters: SpecialistSearchFilters) {
    try {
      const response = await api.get(`${this.BASE_PATH}/specialists`, {
        params: filters,
      })
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error searching specialists:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to search specialists'
      )
    }
  }

  /**
   * Search clubs
   * GET /search/clubs
   */
  async searchClubs(filters: ClubSearchFilters) {
    try {
      const response = await api.get(`${this.BASE_PATH}/clubs`, {
        params: filters,
      })
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error searching clubs:', error)
      throw new Error(error.response?.data?.message || 'Failed to search clubs')
    }
  }

  /**
   * Search for jobs
   * GET /search/jobs
   */
  async searchJobs(params: JobSearchParams = {}): Promise<JobSearchResponse> {
    try {
      const response = await api.get<JobSearchResponse>(
        `${this.BASE_PATH}/jobs`,
        { params }
      )
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error searching jobs:', error)
      throw new Error(error.response?.data?.message || 'Failed to search jobs')
    }
  }

  /**
   * Get job details by ID
   * GET /search/jobs/:jobId
   */
  async getJobDetails(jobId: string): Promise<JobSearchResult> {
    try {
      const response = await api.get<{
        success: boolean
        job: JobSearchResult
      }>(`${this.BASE_PATH}/jobs/${jobId}`)
      return response.data.job
    } catch (error: any) {
      console.error('[SearchService] Error getting job details:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to get job details'
      )
    }
  }

  // ========== AUTOCOMPLETE & SUGGESTIONS ==========
  /**
   * Autocomplete search
   * GET /search/autocomplete
   */
  async autocomplete(
    query: string,
    type: string = 'all',
    limit = 5
  ): Promise<AutocompleteResult[]> {
    try {
      if (query.length < 2) return []
      const response = await api.get(`${this.BASE_PATH}/autocomplete`, {
        params: { q: query, type, limit },
      })
      return response.data.suggestions || []
    } catch (error: any) {
      console.error('[SearchService] Error in autocomplete:', error)
      return []
    }
  }

  /**
   * Get personalized suggestions
   * GET /search/suggestions
   */
  async getSuggestions(limit = 10) {
    try {
      const response = await api.get(`${this.BASE_PATH}/suggestions`, {
        params: { limit },
      })
      return response.data.suggestions || []
    } catch (error: any) {
      console.error('[SearchService] Error getting suggestions:', error)
      return []
    }
  }

  // ========== SEARCH HISTORY ==========
  /**
   * Get search history
   * GET /search/history
   */
  async getSearchHistory(page = 1, limit = 20) {
    try {
      const response = await api.get(`${this.BASE_PATH}/history`, {
        params: { page, limit },
      })
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error getting search history:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to get search history'
      )
    }
  }

  /**
   * Clear search history
   * DELETE /search/history
   */
  async clearSearchHistory() {
    try {
      const response = await api.delete(`${this.BASE_PATH}/history`)
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error clearing search history:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to clear search history'
      )
    }
  }

  // ========== SAVED SEARCHES ==========
  /**
   * Save a search
   * POST /search/saved
   */
  async saveSearch(data: {
    name: string
    searchQuery: string
    searchType: string
    filters: any
    notifyOnNewResults: boolean
  }) {
    try {
      const response = await api.post(`${this.BASE_PATH}/saved`, data)
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error saving search:', error)
      throw new Error(error.response?.data?.message || 'Failed to save search')
    }
  }

  /**
   * Get saved searches
   * GET /search/saved
   */
  async getSavedSearches(): Promise<SavedSearch[]> {
    try {
      const response = await api.get(`${this.BASE_PATH}/saved`)
      return response.data.data || []
    } catch (error: any) {
      console.error('[SearchService] Error getting saved searches:', error)
      return []
    }
  }

  /**
   * Delete saved search
   * DELETE /search/saved/:searchId
   */
  async deleteSavedSearch(searchId: string) {
    try {
      const response = await api.delete(`${this.BASE_PATH}/saved/${searchId}`)
      return response.data
    } catch (error: any) {
      console.error('[SearchService] Error deleting saved search:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to delete saved search'
      )
    }
  }

  // ========== TRENDING SEARCHES ==========
  /**
   * Get trending searches
   * GET /search/trending
   */
  async getTrendingSearches(limit = 10, days = 7) {
    try {
      const response = await api.get(`${this.BASE_PATH}/trending`, {
        params: { limit, days },
      })
      return response.data.data || []
    } catch (error: any) {
      console.error('[SearchService] Error getting trending searches:', error)
      return []
    }
  }
}

const searchService = new SearchService()
export default searchService
