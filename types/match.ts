// Match Types for "Join a Match" feature

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
}

export interface RegionData {
  name: string
  nameEn: string
  cities: Array<{
    name: string
    nameEn: string
  }>
}

export interface LevelOption {
  value: string
  label: string
  labelEn: string
}

export interface SportOption {
  value: string
  label: string
  labelEn: string
}

// Matches Auth Types
export interface MatchesRegisterData {
  email: string
  password: string
  name: string
}

export interface MatchesLoginResponse {
  accessToken: string
  user: MatchesUser
}

export interface MatchesUser {
  id: string
  email: string
  firstName: string
  lastName: string
  isEmailVerified: boolean
}

export interface MatchesRegisterResponse {
  success: boolean
  message: string
  user?: MatchesUser
}

// Email Verification Types
export interface EmailVerificationResponse {
  success: boolean
  message: string
}

// Team Types
export interface Team {
  _id: string
  name: string
  captain: string
  members: Array<{
    _id: string
    firstName: string
    lastName: string
    profilePicture?: string
  }>
  sport: string
  createdAt: string
}

export interface CreateTeamData {
  name: string
  sport: string
}

// Chat Types
export interface ChatMessage {
  _id: string
  matchId: string
  sender: {
    _id: string
    firstName: string
    lastName: string
    profilePicture?: string
  }
  message: string
  createdAt: string
}

export interface SendMessageData {
  message: string
}

// Notification Types
export interface Notification {
  _id: string
  type: string
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: string
}

// History Types
export interface MatchHistory {
  _id: string
  match: Match
  rating?: number
  review?: string
  completedAt: string
}

// Match Action Types
export interface RatePlayerData {
  playerId: string
  rating: number
  review?: string
}
