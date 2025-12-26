// Matches Service - API calls for "Join a Match" feature
import api from './api'
import API_CONFIG from '@/config/api'
import type {
  MatchesRegisterData,
  MatchesLoginResponse,
  MatchesUser,
  MatchesRegisterResponse,
  Team,
  CreateTeamData,
  ChatMessage,
  Notification,
  MatchHistory,
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
  search?: string
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
 * POST /api/v1/matches/auth/register
 * Required fields: email, password, name (full name)
 */
export const matchesRegister = async (
  userData: MatchesRegisterData
): Promise<MatchesRegisterResponse> => {
  const response = await api.post('/matches/auth/register', userData)
  return response.data
}

/**
 * Login user in the Matches module
 * Uses /matches/auth/login endpoint
 * Backend sets matches_token as httpOnly cookie
 * Note: Token is managed by backend via httpOnly cookie for security
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

  // تخزين التوكن وبيانات المستخدم
  if (typeof window !== 'undefined') {
    // تخزين التوكن للـ API calls
    if (accessToken) {
      localStorage.setItem(API_CONFIG.TOKEN_KEY, accessToken)
      // ✅ 1. تخزين التوكن في LocalStorage (أساسي) كما هو مطلوب
      localStorage.setItem('matches_token', accessToken)
    }

    // تخزين بيانات المستخدم
    if (user) {
      const minimalUserData = {
        id: user.id,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name || user.email,
        email: user.email,
      }
      localStorage.setItem('matches_user', JSON.stringify(minimalUserData))
    }
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

/**
 * Verify email with token
 * Returns accessToken and user data for auto-login after verification
 */
export const verifyEmail = async (
  token: string
): Promise<{ success: boolean; message: string; accessToken?: string; user?: MatchesUser }> => {
  const response = await api.get(`/matches/auth/verify-email?token=${token}`)

  const { accessToken, user } = response.data

  // تخزين التوكن وبيانات المستخدم للدخول التلقائي بعد التحقق
  if (typeof window !== 'undefined' && response.data.success) {
    if (accessToken) {
      localStorage.setItem(API_CONFIG.TOKEN_KEY, accessToken)
      localStorage.setItem('matches_token', accessToken)
    }
    if (user) {
      const minimalUserData = {
        id: user.id,
        name: user.name || user.email,
        email: user.email,
      }
      localStorage.setItem('matches_user', JSON.stringify(minimalUserData))
    }
  }

  return response.data
}

/**
 * Resend verification email
 * POST /api/v1/matches/auth/resend-verification
 */
export const resendVerificationEmail = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/matches/auth/resend-verification', {
    email,
  })
  return response.data
}

/**
 * Logout user from Matches module
 * POST /api/v1/matches/auth/logout
 * Clears the matches_token cookie and local storage
 */
export const matchesLogout = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/matches/auth/logout')

  // Clear local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY)
    localStorage.removeItem('matches_token')
    localStorage.removeItem('matches_user')
    localStorage.removeItem(API_CONFIG.USER_KEY)
  }

  return response.data
}

// ============================================
// Teams Methods
// ============================================

export const getMyTeams = async (): Promise<{
  teams: Team[]
  total: number
}> => {
  const response = await api.get('/matches/teams/my-teams')
  return response.data
}

export const createTeam = async (
  data: CreateTeamData
): Promise<{ success: boolean; team: Team }> => {
  const response = await api.post('/matches/teams', data)
  return response.data
}

// ============================================
// Chat Methods
// ============================================

export const getMatchChat = async (
  matchId: string
): Promise<{ messages: ChatMessage[] }> => {
  const response = await api.get(`/matches/${matchId}/chat`)
  return response.data
}

export const sendChatMessage = async (
  matchId: string,
  message: string
): Promise<{ success: boolean; message: ChatMessage }> => {
  const response = await api.post(`/matches/${matchId}/chat`, { message })
  return response.data
}

// ============================================
// Notifications Methods
// ============================================

export const getNotifications = async (): Promise<{
  notifications: Notification[]
  total: number
}> => {
  const response = await api.get('/matches/notifications')
  return response.data
}

export const markNotificationAsRead = async (
  notificationId: string
): Promise<{ success: boolean }> => {
  const response = await api.post(
    `/matches/notifications/${notificationId}/read`
  )
  return response.data
}

// ============================================
// History Methods
// ============================================

export const getMatchHistory = async (): Promise<{
  matches: MatchHistory[]
  total: number
}> => {
  const response = await api.get('/matches/me/matches/history')
  return response.data
}

// ============================================
// Match Actions Methods
// ============================================

export const startMatch = async (
  matchId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/matches/${matchId}/start`)
  return response.data
}

export const finishMatch = async (
  matchId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/matches/${matchId}/finish`)
  return response.data
}

export const ratePlayer = async (
  matchId: string,
  playerId: string,
  rating: number,
  review?: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/matches/${matchId}/rate`, {
    playerId,
    rating,
    review,
  })
  return response.data
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
  verifyEmail,
  resendVerificationEmail,
  matchesLogout,
  // Teams methods
  getMyTeams,
  createTeam,
  // Chat methods
  getMatchChat,
  sendChatMessage,
  // Notifications methods
  getNotifications,
  markNotificationAsRead,
  // History methods
  getMatchHistory,
  // Match actions methods
  startMatch,
  finishMatch,
  ratePlayer,
}
