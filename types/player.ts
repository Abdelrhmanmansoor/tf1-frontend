// Player API Types
// Based on Player API Documentation

export interface Location {
  country: string
  city: string
  address?: string
  coordinates?: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  showExactLocation?: boolean
}

export interface SocialMedia {
  facebook?: string
  instagram?: string
  twitter?: string
}

export interface Height {
  value: number
  unit: 'cm' | 'ft'
}

export interface Weight {
  value: number
  unit: 'kg' | 'lbs'
}

export interface Club {
  clubName: string
  joinedDate?: string
  startDate?: string
  endDate?: string
  position?: string
  achievements?: string
}

export interface Achievement {
  _id?: string
  title: string
  titleAr?: string
  description?: string
  date?: string
  type: 'award' | 'championship' | 'milestone' | 'other'
}

export interface Certificate {
  _id?: string
  name: string
  issuedBy: string
  issuedDate: string
  certificateUrl?: string
}

export interface Statistics {
  matchesPlayed?: number
  goals?: number
  assists?: number
}

export interface TrainingSlot {
  startTime: string
  endTime: string
}

export interface TrainingAvailability {
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
  slots: TrainingSlot[]
}

export interface SalaryExpectations {
  min: number
  max: number
  currency: string
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  showPublicly: boolean
}

export interface Photo {
  _id: string
  url: string
  caption?: string
  captionAr?: string
  uploadedAt: string
}

export interface Video {
  _id: string
  url: string
  thumbnail?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  duration?: number
  uploadedAt: string
}

export interface Privacy {
  showContact: boolean
  showLocation: boolean
  showSalary: boolean
  profileVisibility: 'public' | 'clubs_only' | 'private'
}

export interface RatingStats {
  averageRating: number
  totalReviews: number
}

export interface TrainingStats {
  totalSessions: number
  completedSessions: number
  cancelledSessions: number
}

export interface UserInfo {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  isVerified: boolean
}

export interface PlayerProfile {
  _id: string
  userId: UserInfo | string
  bio?: string
  bioAr?: string
  birthDate?: string
  nationality?: string
  languages?: string[]
  location?: Location
  socialMedia?: SocialMedia
  primarySport: string
  additionalSports?: string[]
  position: string
  positionAr?: string
  preferredFoot?: 'left' | 'right' | 'both'
  height?: Height
  weight?: Weight
  level: 'beginner' | 'amateur' | 'semi-pro' | 'professional'
  yearsOfExperience?: number
  currentClub?: Club
  previousClubs?: Club[]
  achievements?: Achievement[]
  certificates?: Certificate[]
  statistics?: Statistics
  status: 'active' | 'looking_for_club' | 'open_to_offers' | 'not_available'
  availableForTraining?: boolean
  trainingAvailability?: TrainingAvailability[]
  openToRelocation?: boolean
  salaryExpectations?: SalaryExpectations
  goals?: string
  goalsAr?: string
  avatar?: string
  bannerImage?: string
  highlightVideoUrl?: string
  photos?: Photo[]
  videos?: Video[]
  privacy?: Privacy
  profileCompletionPercentage?: number
  profileViews?: number
  trainingStats?: TrainingStats
  ratingStats?: RatingStats
  createdAt?: string
  updatedAt?: string
}

export interface CreatePlayerProfileData {
  bio?: string
  bioAr?: string
  birthDate?: string
  nationality?: string
  languages?: string[]
  location?: Location
  socialMedia?: SocialMedia
  primarySport: string
  additionalSports?: string[]
  position: string
  positionAr?: string
  preferredFoot?: 'left' | 'right' | 'both'
  height?: Height
  weight?: Weight
  level: 'beginner' | 'amateur' | 'semi-pro' | 'professional'
  yearsOfExperience?: number
  currentClub?: Club
  previousClubs?: Club[]
  achievements?: Achievement[]
  certificates?: Certificate[]
  statistics?: Statistics
  status?: 'active' | 'looking_for_club' | 'open_to_offers' | 'not_available'
  availableForTraining?: boolean
  trainingAvailability?: TrainingAvailability[]
  openToRelocation?: boolean
  salaryExpectations?: SalaryExpectations
  goals?: string
  goalsAr?: string
  avatar?: string
  bannerImage?: string
  highlightVideoUrl?: string
  privacy?: Privacy
}

export interface UpdatePlayerProfileData
  extends Partial<CreatePlayerProfileData> {}

export interface DashboardStats {
  profileCompletion: number
  profileViews: number
  totalSessions: number
  completedSessions: number
  averageRating: number
  totalReviews: number
  upcomingSessions: number
  activeRequests: number
  pendingApplications: number
  clubMemberships: number
}

export interface SearchPlayersParams {
  sport?: string
  position?: string
  level?: 'beginner' | 'amateur' | 'semi-pro' | 'professional'
  city?: string
  country?: string
  status?: 'active' | 'looking_for_club' | 'open_to_offers' | 'not_available'
  minAge?: number
  maxAge?: number
  openToRelocation?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface NearbyPlayersParams {
  lat: number
  lng: number
  radius?: number
  sport?: string
  level?: string
  page?: number
  limit?: number
}

export interface PaginationInfo {
  total: number
  page: number
  pages: number
  limit: number
}

export interface PlayerSearchResult {
  _id: string
  userId: {
    firstName: string
    lastName: string
    avatar?: string
    isVerified: boolean
  }
  bio?: string
  primarySport: string
  position: string
  level: string
  location?: {
    city: string
    country: string
  }
  ratingStats?: RatingStats
  age?: number
  profileUrl?: string
}

export interface AddPhotoData {
  url: string
  caption?: string
  captionAr?: string
}

export interface AddVideoData {
  url: string
  thumbnail?: string
  title?: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  duration?: number
}

export interface UpdatePrivacyData {
  showContact?: boolean
  showLocation?: boolean
  showSalary?: boolean
  profileVisibility?: 'public' | 'clubs_only' | 'private'
}
