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

// ============================================
// Age Category System Types
// ============================================

export interface AgeCategory {
  id: string
  name: string
  nameAr: string
  code: string // U10, U12, U15, U17, U19, U21, Senior
  minAge: number
  maxAge: number
  description?: string
  descriptionAr?: string
  totalPlayers: number
  maxPlayers: number
  status: 'active' | 'inactive'
  createdAt?: string
}

export interface PlayerAgeCategory {
  id: string
  ageCategory: AgeCategory
  team: Team
  assignedCoach: CoachInfo
  position: string
  positionAr?: string
  jerseyNumber?: number
  joinedAt: string
  status: 'active' | 'inactive' | 'transferred'
}

export interface Team {
  id: string
  name: string
  nameAr: string
  ageCategory: string
  ageCategoryId: string
  coach: CoachInfo
  assistantCoaches?: CoachInfo[]
  totalPlayers: number
  maxPlayers: number
  trainingDays: string[]
  trainingTime: string
  homeGround?: string
  homeGroundAr?: string
  status: 'active' | 'inactive'
}

export interface CoachInfo {
  id: string
  name: string
  nameAr?: string
  avatar?: string
  phone?: string
  email?: string
  specialization?: string
  specializationAr?: string
  yearsOfExperience?: number
  rating?: number
}

export interface TrainingProgram {
  id: string
  name: string
  nameAr: string
  description?: string
  descriptionAr?: string
  ageCategory: string
  ageCategoryId: string
  type: 'fitness' | 'technical' | 'tactical' | 'mental' | 'recovery'
  duration: number // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  sessions: TrainingSession[]
  progress: number // 0-100
  startDate: string
  endDate: string
  status: 'upcoming' | 'in-progress' | 'completed'
  coach: CoachInfo
}

export interface TrainingSession {
  id: string
  programId: string
  title: string
  titleAr: string
  date: string
  startTime: string
  endTime: string
  location: string
  locationAr?: string
  type: 'group' | 'individual'
  status: 'scheduled' | 'completed' | 'cancelled'
  attendance?: 'present' | 'absent' | 'excused'
  notes?: string
  notesAr?: string
}

export interface AgeCategoryMatch {
  id: string
  title: string
  titleAr: string
  ageCategory: string
  ageCategoryId: string
  homeTeam: string
  homeTeamAr?: string
  awayTeam: string
  awayTeamAr?: string
  date: string
  time: string
  venue: string
  venueAr?: string
  type: 'league' | 'friendly' | 'cup' | 'tournament'
  status: 'upcoming' | 'live' | 'completed' | 'cancelled'
  homeScore?: number
  awayScore?: number
  isHomeGame: boolean
  playerStatus?: 'starting' | 'substitute' | 'not-selected'
}

export interface PlayerPerformanceStats {
  id: string
  playerId: string
  ageCategory: string
  season: string
  // Match stats
  matchesPlayed: number
  minutesPlayed: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  cleanSheets?: number // for goalkeepers
  // Training stats
  trainingsAttended: number
  totalTrainings: number
  attendanceRate: number
  // Performance ratings
  averageRating: number
  highestRating: number
  skillLevels: SkillLevel[]
  // Progress
  progressHistory: ProgressEntry[]
  achievements: PlayerAchievement[]
}

export interface SkillLevel {
  skill: string
  skillAr: string
  level: number // 1-10
  previousLevel?: number
  trend: 'improving' | 'stable' | 'declining'
  lastUpdated: string
}

export interface ProgressEntry {
  date: string
  rating: number
  notes?: string
  notesAr?: string
  evaluatedBy?: string
}

export interface PlayerAchievement {
  id: string
  title: string
  titleAr: string
  description?: string
  descriptionAr?: string
  type: 'mvp' | 'top-scorer' | 'best-player' | 'attendance' | 'improvement' | 'other'
  date: string
  icon?: string
}

export interface AgeCategoryAnnouncement {
  id: string
  title: string
  titleAr: string
  content: string
  contentAr: string
  ageCategory: string
  ageCategoryId: string
  type: 'general' | 'training' | 'match' | 'event' | 'urgent'
  priority: 'high' | 'medium' | 'low'
  author: string
  authorId: string
  publishDate: string
  expiryDate?: string
  attachments?: string[]
  read: boolean
  createdAt: string
}

export interface PlayerDashboardData {
  playerCategory: PlayerAgeCategory | null
  upcomingMatches: AgeCategoryMatch[]
  trainingPrograms: TrainingProgram[]
  upcomingTrainings: TrainingSession[]
  performanceStats: PlayerPerformanceStats | null
  announcements: AgeCategoryAnnouncement[]
  teamMembers: TeamMember[]
}

export interface TeamMember {
  id: string
  name: string
  nameAr?: string
  avatar?: string
  position: string
  positionAr?: string
  jerseyNumber?: number
  isCaptain?: boolean
}
