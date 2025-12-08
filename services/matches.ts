// Matches Service - API calls for "Join a Match" feature
import api from './api'
import API_CONFIG from '@/config/api'
import type {
  MatchesRegisterData,
  MatchesLoginResponse,
  MatchesUser,
  MatchesRegisterResponse,
} from '@/types/match'

export interface Match {
  _id: string
  name: string
  sport: string
  region: string
  city: string
  neighborhood: string
  date: string
  time: string
  level: string
  maxPlayers: number
  currentPlayers: number
  venue: string
  creator: {
    _id: string
    firstName: string
    lastName: string
    profilePicture?: string
  }
  players: Array<{
    _id: string
    firstName: string
    lastName: string
    profilePicture?: string
  }>
  status: 'upcoming' | 'full' | 'completed' | 'cancelled'
  createdAt: string
}

export interface MatchFilters {
  region?: string
  city?: string
  sport?: string
  level?: string
  date?: string
  page?: number
  limit?: number
}

export interface CreateMatchData {
  name: string
  sport: string
  region: string
  city: string
  neighborhood: string
  date: string
  time: string
  level: string
  maxPlayers: number
  venue: string
}

export interface MatchesResponse {
  success: boolean
  matches: Match[]
  total: number
  page: number
  pages: number
}

export interface RegionsData {
  regions: Array<{
    name: string
    nameEn: string
    cities: Array<{
      name: string
      nameEn: string
    }>
  }>
  neighborhoods: Record<string, string[]>
  leagues: string[]
  positions: string[]
  levels: Array<{
    value: string
    label: string
    labelEn: string
  }>
  sports: Array<{
    value: string
    label: string
    labelEn: string
  }>
}

// Get regions and dropdown options
export const getRegionsData = async (): Promise<RegionsData> => {
  const response = await api.get('/matches/regions')
  return response.data
}

// Get matches with filters
export const getMatches = async (
  filters: MatchFilters = {}
): Promise<MatchesResponse> => {
  const response = await api.get('/matches', { params: filters })
  return response.data
}

// Get match by ID
export const getMatchById = async (matchId: string): Promise<Match> => {
  const response = await api.get(`/matches/${matchId}`)
  return response.data.match
}

// Create a new match (requires authentication)
export const createMatch = async (data: CreateMatchData): Promise<Match> => {
  const response = await api.post('/matches', data)
  return response.data.match
}

// Join a match (requires authentication)
export const joinMatch = async (
  matchId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/matches/${matchId}/join`)
  return response.data
}

// Leave a match (requires authentication)
export const leaveMatch = async (
  matchId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/matches/${matchId}/leave`)
  return response.data
}

// Get my matches
export const getMyMatches = async (): Promise<{
  matches: Match[]
  total: number
}> => {
  const response = await api.get('/matches/my-matches')
  return response.data
}

// ============================================
// Matches Auth Methods
// ============================================

/**
 * Register a new user in the Matches module
 * Tries /matches/register first, falls back to /matches/auth/signup on 404
 */
export const matchesRegister = async (
  userData: MatchesRegisterData
): Promise<MatchesRegisterResponse> => {
  try {
    // Try primary endpoint first
    const response = await api.post('/matches/register', userData)
    return response.data
  } catch (error: any) {
    // If 404, try fallback endpoint
    if (error.response?.status === 404) {
      const fallbackResponse = await api.post('/matches/auth/signup', userData)
      return fallbackResponse.data
    }
    // For any other error, rethrow
    throw error
  }
}

/**
 * Login user in the Matches module
 * Uses /matches/auth/login endpoint
 * Stores JWT in localStorage with Authorization: Bearer pattern
 * Note: Token storage logic is intentionally duplicated here for Matches module independence
 */
export const matchesLogin = async (
  email: string,
  password: string
): Promise<MatchesLoginResponse> => {
  const response = await api.post('/matches/auth/login', {
    email,
    password,
  })

  const { accessToken, user } = response.data

  // Save token and user data to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(API_CONFIG.TOKEN_KEY, accessToken)
    localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(user))
    // Also save to cookie for middleware access
    document.cookie = `${API_CONFIG.TOKEN_KEY}=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
  }

  return response.data
}

/**
 * Get current authenticated user from Matches module
 * Uses /matches/auth/me endpoint
 * Validates JWT stored in localStorage
 * Backend response format: { user: MatchesUser }
 */
export const matchesGetMe = async (): Promise<MatchesUser> => {
  const response = await api.get('/matches/auth/me')

  // Update user data in localStorage with fresh data from backend
  // Response structure: { user: {...} }
  if (response.data?.user && typeof window !== 'undefined') {
    localStorage.setItem(
      API_CONFIG.USER_KEY,
      JSON.stringify(response.data.user)
    )
  }

  return response.data.user
}

export default {
  getRegionsData,
  getMatches,
  getMatchById,
  createMatch,
  joinMatch,
  leaveMatch,
  getMyMatches,
  // Matches auth methods
  matchesRegister,
  matchesLogin,
  matchesGetMe,
}
