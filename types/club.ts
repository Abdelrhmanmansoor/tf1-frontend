// Club API Types
// Based on Club API Documentation

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface Location {
  address: string
  addressAr?: string
  city: string
  cityAr?: string
  area?: string
  areaAr?: string
  country: string
  countryAr?: string
  postalCode?: string
  coordinates?: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
}

export interface ContactInfo {
  phoneNumbers: string[]
  email: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    linkedin?: string
  }
}

export interface FacilityDetails {
  facilitySizeSqm?: number
  capacity?: number
  numberOfFields?: number
  facilityTypes?: string[] // e.g., 'outdoor_field', 'indoor_court', 'gym'
  additionalAmenities?: string[] // e.g., 'locker_rooms', 'cafeteria', 'parking'
}

export interface About {
  bio: string
  bioAr?: string
  vision?: string
  visionAr?: string
  mission?: string
  missionAr?: string
}

export interface OperatingHours {
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
  isOpen: boolean
  openTime: string // HH:mm format
  closeTime: string // HH:mm format
}

export interface Verification {
  isVerified: boolean
  verificationBadge?: 'bronze' | 'silver' | 'gold' | 'platinum'
  verificationDate?: string
}

export interface MemberStats {
  totalMembers: number
  activeMembers: number
  playerMembers: number
  coachMembers: number
  specialistMembers: number
  staffMembers: number
}

export interface RatingStats {
  averageRating: number
  totalReviews: number
}

export interface Privacy {
  profileVisibility: 'public' | 'private' | 'members_only'
  showMembers: boolean
  showStatistics: boolean
  showContactInfo: boolean
  allowSearch: boolean
  allowMembershipRequests: boolean
  allowJobApplications: boolean
  allowBookings: boolean
}

export interface NotificationSettings {
  newMembershipRequests: boolean
  jobApplications: boolean
  newBookings: boolean
  payments: boolean
  newReviews: boolean
  eventReminders: boolean
  newMessages: boolean
  systemUpdates: boolean
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
  duration?: number
  uploadedAt: string
}

// ============================================================================
// CLUB PROFILE
// ============================================================================

export interface ClubProfile {
  _id: string
  userId:
    | string
    | {
        _id: string
        email: string
        fullName?: string
        firstName?: string
        lastName?: string
        roles: string[]
      }
  organizationType:
    | 'sports_club'
    | 'academy'
    | 'training_center'
    | 'federation'
    | 'other'
  clubName: string
  clubNameAr?: string
  logo?: string
  establishedDate?: string
  businessRegistrationNumber?: string
  sportsLicenseNumber?: string
  legalStatus?: 'licensed' | 'registered' | 'pending' | 'unlicensed'
  location: Location
  contactInfo: ContactInfo
  facilityDetails?: FacilityDetails
  availableSports: string[]
  about: About
  operatingHours?: OperatingHours[]
  verification?: Verification
  memberStats?: MemberStats
  ratingStats?: RatingStats
  teams?: Team[]
  facilityPhotos?: Photo[]
  facilityVideos?: Video[]
  privacy?: Privacy
  notifications?: NotificationSettings
  completionPercentage: number
  status: 'active' | 'pending_verification' | 'suspended' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateClubProfileData {
  organizationType:
    | 'sports_club'
    | 'academy'
    | 'training_center'
    | 'federation'
    | 'other'
  clubName: string
  clubNameAr?: string
  logo?: string
  establishedDate?: string
  businessRegistrationNumber?: string
  sportsLicenseNumber?: string
  legalStatus?: 'licensed' | 'registered' | 'pending' | 'unlicensed'
  location: Location
  contactInfo: ContactInfo
  facilityDetails?: FacilityDetails
  availableSports: string[]
  about: About
}

export interface UpdateClubProfileData {
  clubName?: string
  clubNameAr?: string
  logo?: string
  contactInfo?: Partial<ContactInfo>
  facilityDetails?: Partial<FacilityDetails>
  availableSports?: string[]
  about?: Partial<About>
  operatingHours?: OperatingHours[]
}

// ============================================================================
// MEMBER MANAGEMENT
// ============================================================================

export interface ClubMember {
  _id: string
  clubId: string
  userId: {
    _id: string
    fullName: string
    email: string
    profilePhoto?: string
  }
  memberType: 'player' | 'coach' | 'specialist' | 'staff'
  memberRole: 'owner' | 'admin_manager' | 'coach_manager' | 'regular_member'
  status: 'pending' | 'active' | 'inactive' | 'suspended'
  sport?: string
  position?: string
  permissions?: {
    manageMembers?: boolean
    manageTeams?: boolean
    manageEvents?: boolean
    manageFacilities?: boolean
    viewFinancials?: boolean
    sendAnnouncements?: boolean
  }
  joinDate: string
  membershipNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MemberListParams {
  memberType?: 'player' | 'coach' | 'specialist' | 'staff'
  status?: 'pending' | 'active' | 'inactive' | 'suspended'
  sport?: string
  memberRole?: string
}

export interface UpdateMemberRoleData {
  memberRole: 'admin_manager' | 'coach_manager' | 'regular_member'
  permissions?: {
    manageMembers?: boolean
    manageTeams?: boolean
    manageEvents?: boolean
    manageFacilities?: boolean
    viewFinancials?: boolean
    sendAnnouncements?: boolean
  }
}

export interface RemoveMemberData {
  reason: string
}

export interface MemberStatistics {
  byStatus: Array<{ _id: string; count: number }>
  byType: Array<{ _id: string; count: number }>
  newThisMonth: number
}

// ============================================================================
// JOB POSTING & RECRUITMENT
// ============================================================================

export interface JobPosting {
  _id: string
  clubId: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  jobType: 'permanent' | 'contract' | 'temporary' | 'internship'
  category: 'coach' | 'player' | 'specialist' | 'staff' | 'management'
  sport?: string
  employmentType: 'full_time' | 'part_time' | 'freelance'
  requirements?: {
    minimumExperience?: number
    educationLevel?: string
    certifications?: string[]
    skills?: string[]
    languages?: string[]
  }
  responsibilities?: Array<{
    responsibility: string
    responsibilityAr?: string
  }>
  numberOfPositions?: number
  applicationDeadline?: string
  expectedStartDate?: string
  status: 'draft' | 'active' | 'closed' | 'filled'
  applicationStats?: {
    totalApplications: number
    newApplications: number
    interviewed: number
  }
  views?: number
  createdAt: string
  updatedAt: string
}

export interface CreateJobData {
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  jobType: 'permanent' | 'contract' | 'temporary' | 'internship'
  category: 'coach' | 'player' | 'specialist' | 'staff' | 'management'
  sport?: string
  employmentType: 'full_time' | 'part_time' | 'freelance'
  requirements?: {
    minimumExperience?: number
    educationLevel?: string
    certifications?: string[]
    skills?: string[]
    languages?: string[]
  }
  responsibilities?: Array<{
    responsibility: string
    responsibilityAr?: string
  }>
  numberOfPositions?: number
  applicationDeadline?: string
  expectedStartDate?: string
  // تم إزالة حقول المقابلة
}

export interface UpdateJobData extends Partial<CreateJobData> {}

export interface JobApplication {
  _id: string
  jobId: {
    _id: string
    title: string
    sport?: string
  }
  clubId: string
  applicantId: {
    _id: string
    fullName: string
    email: string
    profilePhoto?: string
  }
  status:
    | 'new'
    | 'under_review'
    | 'interviewed'
    | 'offered'
    | 'hired'
    | 'rejected'
  applicantSnapshot?: {
    experienceYears?: number
    rating?: number
    [key: string]: any
  }
  coverLetter?: string
  whatsapp?: string
  portfolio?: string
  linkedin?: string
  attachments?: Array<{
    type: 'resume' | 'cv' | 'certificate' | 'portfolio' | 'video' | 'other'
    name: string
    url: string
    uploadedAt: string
  }>
  interview?: {
    isScheduled: boolean
    scheduledDate?: string
    type?: 'in_person' | 'video' | 'phone'
    location?: string
    notes?: string
  }
  hiring?: {
    membershipId?: string
    startDate?: string
    contractUrl?: string
  }
  createdAt: string
  updatedAt: string
  submittedAt?: string
}

export interface ScheduleInterviewData {
  type: 'in_person' | 'video' | 'phone'
  date: string
  time: string
  duration: number
  location?: string
  locationAr?: string
  interviewers?: string[]
}

export interface MakeOfferData {
  offerLetter?: string
  startDate?: string
  contractType?: string
  benefits?: string[]
  expiryDate?: string
  message?: string
  contactPhone?: string
  contactAddress?: string
  meetingDate?: string
  meetingTime?: string
  meetingLocation?: string
  applicantSnapshot?: any
  applicantName?: string
  applicantEmail?: string
  jobTitle?: string
}

export interface HireApplicantData {
  startDate: string
  contractUrl?: string
  message?: string
  contactPhone?: string
  contactAddress?: string
  meetingDate?: string
  meetingTime?: string
  meetingLocation?: string
  applicantSnapshot?: any
  applicantName?: string
  applicantEmail?: string
  jobTitle?: string
}

export interface RejectApplicationData {
  reason: string
}

// ============================================================================
// TEAM MANAGEMENT
// ============================================================================

export interface Team {
  _id: string
  clubId: string
  teamName: string
  teamNameAr?: string
  logo?: string
  sport: string
  ageCategory?: string // e.g., 'U18', 'U21', 'Senior'
  level?: 'amateur' | 'semi-professional' | 'professional'
  gender?: 'male' | 'female' | 'mixed'
  season?: {
    name: string
    startDate: string
    endDate: string
  }
  colors?: {
    primary: string
    secondary: string
  }
  players?: TeamPlayer[]
  coaches?: TeamCoach[]
  staff?: TeamStaff[]
  trainingSchedule?: TrainingSchedule[]
  statistics?: TeamStatistics
  status: 'active' | 'inactive' | 'disbanded'
  createdAt: string
  updatedAt: string
}

export interface TeamPlayer {
  userId:
    | string
    | {
        _id: string
        fullName: string
        email: string
        profilePhoto?: string
      }
  memberId?: string
  jerseyNumber?: number
  position?: string
  isCaptain?: boolean
  status: 'active' | 'injured' | 'suspended' | 'inactive'
  joinedDate?: string
}

export interface TeamCoach {
  userId:
    | string
    | {
        _id: string
        fullName: string
        email: string
        profilePhoto?: string
      }
  memberId?: string
  role: 'head_coach' | 'assistant_coach' | 'goalkeeper_coach' | 'fitness_coach'
  joinedDate?: string
}

export interface TeamStaff {
  userId:
    | string
    | {
        _id: string
        fullName: string
        email: string
        profilePhoto?: string
      }
  memberId?: string
  role: string
  joinedDate?: string
}

export interface TrainingSchedule {
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
  startTime: string
  endTime: string
  location?: string
  type?: 'technical' | 'tactical' | 'physical' | 'recovery'
}

export interface TeamStatistics {
  totalMatches?: number
  wins?: number
  draws?: number
  losses?: number
  goalsScored?: number
  goalsConceded?: number
}

export interface CreateTeamData {
  teamName: string
  teamNameAr?: string
  logo?: string
  sport: string
  ageCategory?: string
  level?: 'amateur' | 'semi-professional' | 'professional'
  gender?: 'male' | 'female' | 'mixed'
  season?: {
    name: string
    startDate: string
    endDate: string
  }
  colors?: {
    primary: string
    secondary: string
  }
}

export interface UpdateTeamData extends Partial<CreateTeamData> {
  description?: string
}

export interface AddPlayerToTeamData {
  memberId: string
  userId: string
  position?: string
  jerseyNumber?: number
}

export interface AddCoachToTeamData {
  memberId: string
  userId: string
  role: 'head_coach' | 'assistant_coach' | 'goalkeeper_coach' | 'fitness_coach'
}

export interface UpdateTrainingScheduleData {
  schedule: TrainingSchedule[]
}

// ============================================================================
// EVENT MANAGEMENT
// ============================================================================

export interface ClubEvent {
  _id: string
  clubId: string
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  type: 'training' | 'match' | 'tournament' | 'meeting' | 'social' | 'other'
  sport?: string
  teamId?: string | Team
  startDate: string
  endDate?: string
  startTime: string
  endTime?: string
  location?: {
    type: 'club_facility' | 'external'
    facilityName?: string
    address?: string
    coordinates?: {
      type: 'Point'
      coordinates: [number, number]
    }
  }
  targetAudience:
    | 'all_members'
    | 'specific_team'
    | 'specific_sport'
    | 'specific_members'
  requiresRegistration: boolean
  maxParticipants?: number
  participantCount?: number
  attendanceList?: EventAttendance[]
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  cancellationReason?: string
  cancellationReasonAr?: string
  createdAt: string
  updatedAt: string
}

export interface EventAttendance {
  userId: string
  status: 'registered' | 'present' | 'absent' | 'excused'
  checkInTime?: string
  notes?: string
}

export interface CreateEventData {
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  type: 'training' | 'match' | 'tournament' | 'meeting' | 'social' | 'other'
  sport?: string
  teamId?: string
  startDate: string
  endDate?: string
  startTime: string
  endTime?: string
  location?: {
    type: 'club_facility' | 'external'
    facilityName?: string
    address?: string
  }
  targetAudience:
    | 'all_members'
    | 'specific_team'
    | 'specific_sport'
    | 'specific_members'
  requiresRegistration: boolean
  maxParticipants?: number
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export interface CancelEventData {
  reason: string
  reasonAr?: string
}

export interface MarkAttendanceData {
  userId: string
  status: 'present' | 'absent' | 'excused'
  checkInTime?: string
}

// ============================================================================
// FACILITY & BOOKING MANAGEMENT
// ============================================================================

export interface FacilityBooking {
  _id: string
  clubId: string
  facilityName: string
  facilityNameAr?: string
  facilityType: string
  facilityId: string
  bookedBy: {
    userId: string
    userType: 'member' | 'external'
    name: string
    email: string
    phone?: string
  }
  bookingType: 'team_training' | 'event' | 'external' | 'maintenance'
  teamId?: string
  eventId?: string
  bookingDate: string
  startTime: string
  endTime: string
  duration: number // in minutes
  purpose?: 'training' | 'match' | 'event' | 'maintenance' | 'other'
  description?: string
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'
  rejectionReason?: string
  rejectionReasonAr?: string
  cancellationReason?: string
  cancellationReasonAr?: string
  hasConflict?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBookingData {
  facilityName: string
  facilityNameAr?: string
  facilityType: string
  facilityId: string
  bookedBy: {
    userId: string
    userType: 'member' | 'external'
    name: string
    email: string
    phone?: string
  }
  bookingType: 'team_training' | 'event' | 'external' | 'maintenance'
  teamId?: string
  eventId?: string
  bookingDate: string
  startTime: string
  endTime: string
  purpose?: 'training' | 'match' | 'event' | 'maintenance' | 'other'
  description?: string
}

export interface BookingListParams {
  facilityType?: string
  facilityId?: string
  status?: string
  bookingType?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface FacilitySchedule {
  date: string
  facilityId: string
  bookings: Array<{
    startTime: string
    endTime: string
    bookedBy: {
      name: string
      userType: string
    }
    purpose?: string
  }>
}

export interface AvailableSlot {
  startTime: string
  endTime: string
}

export interface RejectBookingData {
  reason: string
  reasonAr?: string
}

export interface CancelBookingData {
  reason: string
  reasonAr?: string
}

export interface FacilityUtilization {
  facilityId: string
  period: {
    startDate: string
    endDate: string
  }
  utilization: {
    totalBookings: number
    totalHours: number
    utilizationRate: number
    byType: {
      [key: string]: number
    }
    averageBookingDuration: number
  }
}

// ============================================================================
// DASHBOARD & ANALYTICS
// ============================================================================

export interface DashboardStats {
  profile: {
    clubName: string
    logo?: string
    completionPercentage: number
    isVerified: boolean
    rating: number
    totalReviews: number
  }
  members: {
    total: number
    active: number
    players: number
    coaches: number
    specialists: number
    staff: number
    newThisMonth: number
    pendingRequests: number
  }
  teams: {
    total: number
  }
  recruitment: {
    activeJobs: number
    totalApplications: number
    pendingApplications: number
  }
  events: {
    total: number
    upcoming: number
    upcomingList?: ClubEvent[]
  }
  facilities: {
    totalBookings: number
    pendingBookings: number
  }
  activity: {
    profileViews: number
    lastActivityDate: string
  }
}

// ============================================================================
// SEARCH & DISCOVERY
// ============================================================================

export interface SearchClubsParams {
  organizationType?: string
  sport?: string
  city?: string
  country?: string
  minRating?: number
  verified?: boolean
  page?: number
  limit?: number
  sortBy?: 'rating' | 'members' | 'name' | 'createdAt'
  search?: string
}

export interface NearbyClubsParams {
  latitude: number
  longitude: number
  radius: number // in kilometers
  sport?: string
  page?: number
  limit?: number
}

export interface ClubSearchResult {
  _id: string
  clubName: string
  organizationType: string
  location: {
    city: string
    country: string
  }
  availableSports: string[]
  ratingStats: RatingStats
  memberStats: {
    totalMembers: number
  }
  verification?: {
    isVerified: boolean
  }
  logo?: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalClubs: number
  limit: number
}

// ============================================================================
// MEDIA GALLERY
// ============================================================================

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
  duration?: number
}

export interface UpdatePrivacyData {
  privacy: Privacy
}

export interface UpdateNotificationsData {
  notifications: NotificationSettings
}
