// Matches Service - API calls for "Join a Match" feature
import api from './api'

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
export const getMatches = async (filters: MatchFilters = {}): Promise<MatchesResponse> => {
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
export const joinMatch = async (matchId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/matches/${matchId}/join`)
  return response.data
}

// Leave a match (requires authentication)
export const leaveMatch = async (matchId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/matches/${matchId}/leave`)
  return response.data
}

// Get my matches
export const getMyMatches = async (): Promise<{ matches: Match[]; total: number }> => {
  const response = await api.get('/matches/my-matches')
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
}
