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
  firstName?: string
  lastName?: string
  phone?: string
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
