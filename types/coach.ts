// Coach API Types
// Based on Coach API Documentation

export interface CoachLocation {
  city: string
  cityAr?: string
  area?: string
  areaAr?: string
  country: string
  countryAr?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface Certification {
  _id?: string
  name: string
  nameAr?: string
  issuedBy: string
  issuedDate: string
  certificateUrl?: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface RatingStats {
  averageRating: number
  totalReviews: number
}

export interface StudentStats {
  total: number
  active: number
  former: number
  newThisMonth?: number
}

export interface SessionStats {
  total: number
  completed: number
  upcoming: number
  cancelled: number
  completionRate?: number
}

export interface Photo {
  _id: string
  url: string
  publicId: string
  thumbnailUrl: string
  mediumUrl: string
  largeUrl: string
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
  showPhoneNumber: boolean
  showEmail: boolean
  showLocation: boolean
  showStudentCount: boolean
  profileVisibility: 'public' | 'private' | 'registered_users'
  allowMessages: boolean
  allowBookings: boolean
}

export interface TimeSlot {
  startTime: string
  endTime: string
  isBooked?: boolean
  bookingId?: string | null
}

export interface DaySchedule {
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
  isAvailable: boolean
  slots: TimeSlot[]
}

export interface DateOverride {
  _id?: string
  date: string
  isAvailable: boolean
  reason?: string
  reasonAr?: string
}

export interface BookingSettings {
  minAdvanceBooking: number
  maxAdvanceBooking: number
  allowSameDayBooking: boolean
}

export interface CancellationPolicy {
  refundableHours: number
  refundPercentage: number
  policyText?: string
  policyTextAr?: string
}

export interface Availability {
  _id?: string
  coachId: string
  weeklySchedule: DaySchedule[]
  dateOverrides?: DateOverride[]
  bookingSettings?: BookingSettings
  cancellationPolicy?: CancellationPolicy
}

export interface UserInfo {
  _id: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  avatar?: string
  isVerified: boolean
}

export interface CoachProfile {
  _id: string
  userId: UserInfo | string
  primarySport: string
  coachingSpecialties: string[]
  experienceYears: number
  bio?: string
  bioAr?: string
  certifications?: Certification[]
  location?: CoachLocation
  trainingLocations?: string[]
  languages?: string[]
  avatar?: string
  bannerImage?: string
  photos?: Photo[]
  videos?: Video[]
  privacy?: Privacy
  ratingStats?: RatingStats
  studentStats?: StudentStats
  sessionStats?: SessionStats
  completionPercentage?: number
  profileViews?: number
  isVerified?: boolean
  isActive?: boolean
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface DashboardStats {
  profile: {
    completionPercentage: number
    isVerified: boolean
    rating: number
    totalReviews: number
  }
  students: {
    total: number
    active: number
    former: number
    newThisMonth: number
  }
  sessions: {
    total: number
    completed: number
    upcoming: number
    cancelled: number
    completionRate: number
  }
  availability: {
    nextAvailableSlot: string
    totalWeeklySlots: number
    bookedSlotsThisWeek: number
  }
  recentActivity: Array<{
    type: string
    message: string
    date: string
  }>
}

export interface CreateCoachProfileData {
  primarySport: string
  coachingSpecialties: string[]
  experienceYears: number
  bio?: string
  bioAr?: string
  certifications?: Certification[]
  location?: CoachLocation
  trainingLocations?: string[]
  languages?: string[]
}

export interface UpdateCoachProfileData
  extends Partial<CreateCoachProfileData> {}

export interface CoachSearchResult {
  _id: string
  fullName: string
  primarySport: string
  experienceYears: number
  ratingStats?: RatingStats
  location?: CoachLocation
  avatar?: string
  distance?: number
}

export interface SearchCoachesParams {
  sport?: string
  specialties?: string
  minExperience?: number
  maxExperience?: number
  city?: string
  country?: string
  minRating?: number
  language?: string
  page?: number
  limit?: number
  sortBy?: 'rating' | 'experience' | 'createdAt'
}

export interface NearbyCoachesParams {
  latitude: number
  longitude: number
  radius: number
  sport?: string
  page?: number
  limit?: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  total: number
  limit: number
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
  privacy: Privacy
}

// ==================== USER (for Students & Sessions) ====================
export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  dateOfBirth?: string
  role?: string
}

// ==================== PLAYER INFO (for PlayerProfile Integration) ====================
export interface CurrentClub {
  clubId?: string
  clubName: string
  joinedDate: Date | string
  position: string
}

export interface PreviousClub {
  clubName: string
  startDate: Date | string
  endDate: Date | string
  position: string
  achievements?: string
}

export interface Achievement {
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  date: Date | string
  type: 'championship' | 'award' | 'record' | 'certificate' | 'other'
}

export interface PlayerStatistics {
  matchesPlayed?: number
  goals?: number
  assists?: number
  custom?: any
}

// ==================== STUDENT (with PlayerProfile Integration) ====================
export interface Student {
  _id: string
  userId: User
  status: 'active' | 'former'

  // Player Profile Linking
  hasPlayerProfile: boolean
  playerProfileId?: string

  // Sport Information (from PlayerProfile if linked, else local)
  sport: string
  position?: string
  level: 'beginner' | 'amateur' | 'semi-pro' | 'professional'

  // Extended Player Info (only if hasPlayerProfile = true)
  yearsOfExperience?: number
  currentClub?: CurrentClub
  previousClubs?: PreviousClub[]
  achievements?: Achievement[]
  statistics?: PlayerStatistics

  // Session Information
  joinedDate: Date | string
  totalSessions: number
  completedSessions: number
  upcomingSessions: number
  cancelledSessions: number
  rating: number
  lastSessionDate?: Date | string

  // Financial
  totalPaid: number
  currency: string

  // Coach Notes
  notes?: string
  goals?: string[]
  overallProgress?: number
  strengths?: string[]
  areasForImprovement?: string[]
}

// ==================== SESSION ====================
export interface SessionLocation {
  type: 'indoor' | 'outdoor' | 'online' | 'home' | 'club' | 'other'
  address?: string
  addressAr?: string
  coordinates?: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  meetingLink?: string
  facilityName?: string
}

export interface SessionGoal {
  goal: string
  goalAr?: string
  achieved: boolean
}

export interface Exercise {
  exercise: string
  sets?: number
  reps?: number
  duration?: number
  intensity?: string
  notes?: string
}

export interface SkillPracticed {
  skill: string
  skillAr?: string
  progressLevel: 'needs_improvement' | 'developing' | 'proficient' | 'excellent'
  notes?: string
}

export interface Performance {
  attendanceQuality?: 'excellent' | 'good' | 'average' | 'poor'
  effortLevel?: number // 1-10
  skillImprovement?: number // 1-10
  attitudeAndBehavior?: 'excellent' | 'good' | 'needs_improvement'
  notes?: string
}

export interface Progress {
  overallProgress?: number // 0-100
  strengths?: string[]
  areasForImprovement?: string[]
  recommendations?: string
  recommendationsAr?: string
}

export interface SessionRating {
  studentRating?: number // 1-5
  feedback?: string
  feedbackAr?: string
  ratedAt?: Date | string
  detailedRatings?: {
    professionalism?: number
    communication?: number
    expertise?: number
    punctuality?: number
    value?: number
  }
}

export interface TrainingSession {
  _id: string
  student: {
    _id: string
    userId: User
    sport?: string
    level?: string
  }
  date: Date | string
  duration: number // in minutes
  type: 'individual' | 'group'
  location: SessionLocation
  status: 'upcoming' | 'completed' | 'cancelled' | 'no_show'
  price: number
  currency: string
  notes?: string
  coachNotes?: string
  sessionGoals?: SessionGoal[]
  exercisesPerformed?: Exercise[]
  skillsPracticed?: SkillPracticed[]
  performance?: Performance
  progress?: Progress
  rating?: SessionRating
  review?: string
  createdAt: Date | string
  updatedAt: Date | string
}

// ==================== API REQUEST BODIES ====================
export interface AddStudentRequest {
  studentUserId?: string // Deprecated: use studentEmail instead
  studentEmail?: string // NEW: Email address of the student
  sport?: string
  position?: string
  level?: 'beginner' | 'amateur' | 'semi-pro' | 'professional'
  notes?: string
  goals?: string[]
}

export interface UpdateSessionStatusRequest {
  status: 'completed' | 'cancelled' | 'no_show'
  coachNotes?: string
  cancellationReason?: string
  performance?: Performance
  progress?: Progress
}

// ==================== API RESPONSES ====================
export interface StudentListResponse {
  success: boolean
  students: Student[]
  pagination: {
    currentPage: number
    totalPages: number
    totalStudents: number
    hasMore: boolean
  }
  stats: {
    total: number
    active: number
    former: number
  }
}

export interface StudentDetailsResponse {
  success: boolean
  student: Student
  recentSessions: Array<{
    _id: string
    date: Date | string
    duration: number
    status: string
    rating?: SessionRating
  }>
}

export interface SessionListResponse {
  success: boolean
  sessions: TrainingSession[]
  pagination: {
    currentPage: number
    totalPages: number
    totalSessions: number
    hasMore: boolean
  }
  stats: {
    total: number
    upcoming: number
    completed: number
    cancelled: number
  }
}

export interface SessionDetailsResponse {
  success: boolean
  session: TrainingSession
}

export interface AddStudentResponse {
  success: boolean
  message: string
  student: Student
}

export interface UpdateSessionStatusResponse {
  success: boolean
  message: string
  session: {
    _id: string
    status: string
    coachNotes?: string
  }
}

export interface ErrorResponse {
  success: false
  message: string
  code: string
}

// ==================== QUERY PARAMETERS ====================
export interface StudentListParams {
  status?: 'active' | 'former' | 'all'
  search?: string
  page?: number
  limit?: number
}

export interface SessionListParams {
  status?: 'upcoming' | 'completed' | 'cancelled' | 'all'
  search?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}
