/* eslint-disable no-unused-vars */

// Club API Service
// This service handles all club-related API calls

import api from './api'
import type {
  ClubProfile,
  CreateClubProfileData,
  UpdateClubProfileData,
  DashboardStats,
  SearchClubsParams,
  NearbyClubsParams,
  ClubSearchResult,
  PaginationInfo,
  ClubMember,
  MemberListParams,
  UpdateMemberRoleData,
  RemoveMemberData,
  MemberStatistics,
  JobPosting,
  CreateJobData,
  UpdateJobData,
  JobApplication,
  ScheduleInterviewData,
  MakeOfferData,
  HireApplicantData,
  RejectApplicationData,
  Team,
  CreateTeamData,
  UpdateTeamData,
  AddPlayerToTeamData,
  AddCoachToTeamData,
  UpdateTrainingScheduleData,
  ClubEvent,
  CreateEventData,
  UpdateEventData,
  CancelEventData,
  MarkAttendanceData,
  FacilityBooking,
  CreateBookingData,
  BookingListParams,
  FacilitySchedule,
  AvailableSlot,
  RejectBookingData,
  CancelBookingData,
  FacilityUtilization,
  Photo,
  Video,
  AddPhotoData,
  AddVideoData,
  UpdatePrivacyData,
  UpdateNotificationsData,
  Privacy,
  NotificationSettings,
} from '@/types/club'

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
}

interface ProfileResponse {
  success: boolean
  message?: string
  profile: ClubProfile
}

interface StatsResponse {
  success: boolean
  stats: DashboardStats
}

interface SearchResponse {
  success: boolean
  clubs: ClubSearchResult[]
  pagination: PaginationInfo
}

interface MembersResponse {
  success: boolean
  members: ClubMember[]
  total: number
}

interface PendingRequestsResponse {
  success: boolean
  requests: ClubMember[]
  total: number
}

interface MemberResponse {
  success: boolean
  message: string
  member: ClubMember
}

interface MemberStatisticsResponse {
  success: boolean
  statistics: MemberStatistics
}

interface JobsResponse {
  success: boolean
  jobs: JobPosting[]
  total: number
}

interface JobResponse {
  success: boolean
  message: string
  job: JobPosting
}

interface ApplicationsResponse {
  success: boolean
  applications: JobApplication[]
  pagination: PaginationInfo
}

interface ApplicationResponse {
  success: boolean
  message: string
  application: JobApplication
}

interface TeamsResponse {
  success: boolean
  teams: Team[]
  total: number
}

interface TeamResponse {
  success: boolean
  message?: string
  team: Team
}

interface EventsResponse {
  success: boolean
  events: ClubEvent[]
  pagination?: PaginationInfo
}

interface EventResponse {
  success: boolean
  message: string
  event: ClubEvent
}

interface BookingsResponse {
  success: boolean
  bookings: FacilityBooking[]
  pagination?: PaginationInfo
}

interface BookingResponse {
  success: boolean
  message: string
  booking: FacilityBooking
}

interface FacilityScheduleResponse {
  success: boolean
  date: string
  facilityId: string
  bookings: FacilitySchedule['bookings']
}

interface AvailableSlotsResponse {
  success: boolean
  date: string
  facilityId: string
  availableSlots: AvailableSlot[]
}

interface FacilityUtilizationResponse {
  success: boolean
  facilityId: string
  period: FacilityUtilization['period']
  utilization: FacilityUtilization['utilization']
}

interface PhotoResponse {
  success: boolean
  message: string
  profile: ClubProfile
}

interface VideoResponse {
  success: boolean
  message: string
  profile: ClubProfile
}

interface PrivacyResponse {
  success: boolean
  message: string
  profile: ClubProfile
}

interface NotificationsResponse {
  success: boolean
  message: string
  profile: ClubProfile
}

class ClubService {
  private readonly BASE_PATH = '/clubs'

  // ============================================================================
  // PROFILE MANAGEMENT
  // ============================================================================

  /**
   * 1. Create Club Profile
   * POST /clubs/profile
   */
  async createProfile(
    profileData: CreateClubProfileData
  ): Promise<ClubProfile> {
    try {
      const response = await api.post<ProfileResponse>(
        `${this.BASE_PATH}/profile`,
        profileData
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 2. Get My Club Profile
   * GET /clubs/profile/me
   */
  async getMyProfile(): Promise<ClubProfile> {
    try {
      const response = await api.get<ProfileResponse>(
        `${this.BASE_PATH}/profile/me`
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 3. Get Club Profile by ID
   * GET /clubs/profile/:id
   */
  async getProfileById(clubId: string): Promise<ClubProfile> {
    try {
      const response = await api.get<ProfileResponse>(
        `${this.BASE_PATH}/profile/${clubId}`
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 4. Update Club Profile
   * PUT /clubs/profile
   */
  async updateProfile(
    profileData: UpdateClubProfileData
  ): Promise<ClubProfile> {
    try {
      const response = await api.put<ProfileResponse>(
        `${this.BASE_PATH}/profile`,
        profileData
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 5. Delete Club Profile
   * DELETE /clubs/profile
   */
  async deleteProfile(): Promise<void> {
    try {
      await api.delete(`${this.BASE_PATH}/profile`)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // SEARCH & DISCOVERY
  // ============================================================================

  /**
   * 6. Search Clubs
   * GET /clubs/search
   */
  async searchClubs(params: SearchClubsParams): Promise<{
    clubs: ClubSearchResult[]
    pagination: PaginationInfo
  }> {
    try {
      const response = await api.get<SearchResponse>(
        `${this.BASE_PATH}/search`,
        { params }
      )
      return {
        clubs: response.data.clubs,
        pagination: response.data.pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 7. Get Nearby Clubs
   * GET /clubs/nearby
   */
  async getNearbyClubs(params: NearbyClubsParams): Promise<{
    clubs: ClubSearchResult[]
    pagination: PaginationInfo
  }> {
    try {
      const response = await api.get<SearchResponse>(
        `${this.BASE_PATH}/nearby`,
        { params }
      )
      return {
        clubs: response.data.clubs,
        pagination: response.data.pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // MEMBER MANAGEMENT
  // ============================================================================

  /**
   * 8. Get All Club Members
   * GET /clubs/members
   */
  async getMembers(params?: MemberListParams): Promise<{
    members: ClubMember[]
    total: number
  }> {
    try {
      const response = await api.get<MembersResponse>(
        `${this.BASE_PATH}/members`,
        { params }
      )
      return {
        members: response.data.members,
        total: response.data.total,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 9. Get Pending Membership Requests
   * GET /clubs/members/pending
   */
  async getPendingRequests(): Promise<{
    requests: ClubMember[]
    total: number
  }> {
    try {
      const response = await api.get<PendingRequestsResponse>(
        `${this.BASE_PATH}/members/pending`
      )
      return {
        requests: response.data.requests,
        total: response.data.total,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 10. Approve Membership Request
   * POST /clubs/members/:memberId/approve
   */
  async approveMember(memberId: string): Promise<ClubMember> {
    try {
      const response = await api.post<MemberResponse>(
        `${this.BASE_PATH}/members/${memberId}/approve`
      )
      return response.data.member
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 11. Reject Membership Request
   * POST /clubs/members/:memberId/reject
   */
  async rejectMember(
    memberId: string,
    data: { reason: string }
  ): Promise<void> {
    try {
      await api.post(`${this.BASE_PATH}/members/${memberId}/reject`, data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 12. Update Member Role and Permissions
   * PUT /clubs/members/:memberId/role
   */
  async updateMemberRole(
    memberId: string,
    data: UpdateMemberRoleData
  ): Promise<ClubMember> {
    try {
      const response = await api.put<MemberResponse>(
        `${this.BASE_PATH}/members/${memberId}/role`,
        data
      )
      return response.data.member
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 13. Remove Member
   * DELETE /clubs/members/:memberId
   */
  async removeMember(memberId: string, data: RemoveMemberData): Promise<void> {
    try {
      await api.delete(`${this.BASE_PATH}/members/${memberId}`, { data })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 14. Get Member Statistics
   * GET /clubs/members/statistics
   */
  async getMemberStatistics(): Promise<MemberStatistics> {
    try {
      const response = await api.get<MemberStatisticsResponse>(
        `${this.BASE_PATH}/members/statistics`
      )
      return response.data.statistics
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // JOB POSTING & RECRUITMENT
  // ============================================================================

  /**
   * 15. Create Job Posting
   * POST /clubs/jobs
   */
  async createJob(jobData: CreateJobData): Promise<JobPosting> {
    try {
      const response = await api.post<JobResponse>(
        `${this.BASE_PATH}/jobs`,
        jobData
      )
      return response.data.job
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 16. Get Club's Job Postings
   * GET /clubs/jobs
   */
  async getJobs(params?: {
    status?: string
    category?: string
    sport?: string
  }): Promise<{ jobs: JobPosting[]; total: number }> {
    try {
      const response = await api.get<JobsResponse>(`${this.BASE_PATH}/jobs`, {
        params,
      })
      return {
        jobs: response.data.jobs,
        total: response.data.total,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 16a. Get Job Posting by ID
   * GET /clubs/jobs/:jobId
   */
  async getJobById(jobId: string): Promise<JobPosting> {
    try {
      const response = await api.get<JobResponse>(
        `${this.BASE_PATH}/jobs/${jobId}`
      )
      return response.data.job
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 17. Update Job Posting
   * PUT /clubs/jobs/:jobId
   */
  async updateJob(jobId: string, jobData: UpdateJobData): Promise<JobPosting> {
    try {
      const response = await api.put<JobResponse>(
        `${this.BASE_PATH}/jobs/${jobId}`,
        jobData
      )
      return response.data.job
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 18. Close Job Posting
   * POST /clubs/jobs/:jobId/close
   */
  async closeJob(jobId: string, data: { reason: string }): Promise<JobPosting> {
    try {
      const response = await api.post<JobResponse>(
        `${this.BASE_PATH}/jobs/${jobId}/close`,
        data
      )
      return response.data.job
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 19. Extend Job Deadline
   * PUT /clubs/jobs/:jobId/extend
   */
  async extendJobDeadline(
    jobId: string,
    data: { newDeadline: string }
  ): Promise<JobPosting> {
    try {
      const response = await api.put<JobResponse>(
        `${this.BASE_PATH}/jobs/${jobId}/extend`,
        data
      )
      return response.data.job
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 20. Get Job Applications
   * GET /clubs/applications
   */
  async getApplications(params?: {
    status?: string
    jobId?: string
    page?: number
    limit?: number
  }): Promise<{
    applications: JobApplication[]
    pagination: PaginationInfo
  }> {
    try {
      const response = await api.get<ApplicationsResponse>(
        `${this.BASE_PATH}/applications`,
        { params }
      )
      return {
        applications: response.data.applications,
        pagination: response.data.pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 21. Review Application
   * POST /clubs/applications/:applicationId/review
   */
  async reviewApplication(applicationId: string): Promise<JobApplication> {
    try {
      const response = await api.post<ApplicationResponse>(
        `${this.BASE_PATH}/applications/${applicationId}/review`
      )
      return response.data.application
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 22. Schedule Interview
   * POST /clubs/applications/:applicationId/interview
   */
  async scheduleInterview(
    applicationId: string,
    data: ScheduleInterviewData
  ): Promise<JobApplication> {
    try {
      const response = await api.post<ApplicationResponse>(
        `${this.BASE_PATH}/applications/${applicationId}/interview`,
        data
      )
      return response.data.application
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 23. Make Job Offer
   * POST /clubs/applications/:applicationId/offer
   */
  async makeOffer(
    applicationId: string,
    data: MakeOfferData
  ): Promise<JobApplication> {
    try {
      const response = await api.post<ApplicationResponse>(
        `${this.BASE_PATH}/applications/${applicationId}/offer`,
        data
      )
      return response.data.application
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 24. Hire Applicant
   * POST /clubs/applications/:applicationId/hire
   */
  async hireApplicant(
    applicationId: string,
    data: HireApplicantData
  ): Promise<JobApplication> {
    try {
      const response = await api.post<ApplicationResponse>(
        `${this.BASE_PATH}/applications/${applicationId}/hire`,
        data
      )
      return response.data.application
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 25. Reject Application
   * POST /clubs/applications/:applicationId/reject
   */
  async rejectApplication(
    applicationId: string,
    data: RejectApplicationData
  ): Promise<JobApplication> {
    try {
      const response = await api.post<ApplicationResponse>(
        `${this.BASE_PATH}/applications/${applicationId}/reject`,
        data
      )
      return response.data.application
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 26. Update Application Status
   * Uses appropriate endpoint based on status
   * Includes optional contact info, message, and applicant data for email notifications
   */
  async updateApplicationStatus(
    applicationId: string,
    status: 'new' | 'under_review' | 'interviewed' | 'offered' | 'hired' | 'rejected',
    options?: {
      message?: string
      contactPhone?: string
      contactAddress?: string
      applicantSnapshot?: any
      applicantName?: string
      applicantEmail?: string
      jobTitle?: string
      meetingDate?: string
      meetingTime?: string
      meetingLocation?: string
      meetingLink?: string
      type?: string
      date?: string
      time?: string
      location?: string
    }
  ): Promise<JobApplication> {
    try {
      let response
      const payload = options || {}

      // Map meetingDate/Time to date/time for interview endpoint if needed
      if (status === 'interviewed' && payload.meetingDate) {
        payload.date = payload.meetingDate
        payload.time = payload.meetingTime
        payload.location = payload.meetingLocation
      }
      
      switch (status) {
        case 'under_review':
          response = await api.post<ApplicationResponse>(
            `${this.BASE_PATH}/applications/${applicationId}/review`,
            payload
          )
          break
        case 'interviewed':
          response = await api.post<ApplicationResponse>(
            `${this.BASE_PATH}/applications/${applicationId}/interview`,
            { type: 'in_person', ...payload }
          )
          break
        case 'offered':
          response = await api.post<ApplicationResponse>(
            `${this.BASE_PATH}/applications/${applicationId}/offer`,
            payload
          )
          break
        case 'hired':
          response = await api.post<ApplicationResponse>(
            `${this.BASE_PATH}/applications/${applicationId}/hire`,
            { startDate: new Date().toISOString().split('T')[0], ...payload }
          )
          break
        case 'rejected':
          response = await api.post<ApplicationResponse>(
            `${this.BASE_PATH}/applications/${applicationId}/reject`,
            { reason: payload.message || 'Status updated', ...payload }
          )
          break
        default:
          throw new Error('Invalid status')
      }
      
      return response.data.application
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // TEAM MANAGEMENT
  // ============================================================================

  /**
   * 26. Create Team
   * POST /clubs/teams
   */
  async createTeam(teamData: CreateTeamData): Promise<Team> {
    try {
      const response = await api.post<TeamResponse>(
        `${this.BASE_PATH}/teams`,
        teamData
      )
      return response.data.team
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 27. Get Club Teams
   * GET /clubs/teams
   */
  async getTeams(params?: {
    sport?: string
    ageCategory?: string
    level?: string
    status?: string
  }): Promise<{ teams: Team[]; total: number }> {
    try {
      const response = await api.get<TeamsResponse>(`${this.BASE_PATH}/teams`, {
        params,
      })
      return {
        teams: response.data.teams,
        total: response.data.total,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 28. Get Team by ID
   * GET /clubs/teams/:teamId
   */
  async getTeamById(teamId: string): Promise<Team> {
    try {
      const response = await api.get<TeamResponse>(
        `${this.BASE_PATH}/teams/${teamId}`
      )
      return response.data.team
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 29. Update Team
   * PUT /clubs/teams/:teamId
   */
  async updateTeam(teamId: string, teamData: UpdateTeamData): Promise<Team> {
    try {
      const response = await api.put<TeamResponse>(
        `${this.BASE_PATH}/teams/${teamId}`,
        teamData
      )
      return response.data.team
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 30. Add Player to Team
   * POST /clubs/teams/:teamId/players
   */
  async addPlayerToTeam(
    teamId: string,
    data: AddPlayerToTeamData
  ): Promise<Team> {
    try {
      const response = await api.post<TeamResponse>(
        `${this.BASE_PATH}/teams/${teamId}/players`,
        data
      )
      return response.data.team
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 31. Remove Player from Team
   * DELETE /clubs/teams/:teamId/players/:userId
   */
  async removePlayerFromTeam(teamId: string, userId: string): Promise<Team> {
    try {
      const response = await api.delete<TeamResponse>(
        `${this.BASE_PATH}/teams/${teamId}/players/${userId}`
      )
      return response.data.team
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 32. Add Coach to Team
   * POST /clubs/teams/:teamId/coaches
   */
  async addCoachToTeam(
    teamId: string,
    data: AddCoachToTeamData
  ): Promise<Team> {
    try {
      const response = await api.post<TeamResponse>(
        `${this.BASE_PATH}/teams/${teamId}/coaches`,
        data
      )
      return response.data.team
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 33. Update Training Schedule
   * PUT /clubs/teams/:teamId/schedule
   */
  async updateTrainingSchedule(
    teamId: string,
    data: UpdateTrainingScheduleData
  ): Promise<Team> {
    try {
      const response = await api.put<TeamResponse>(
        `${this.BASE_PATH}/teams/${teamId}/schedule`,
        data
      )
      return response.data.team
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // EVENT MANAGEMENT
  // ============================================================================

  /**
   * 34. Create Event
   * POST /clubs/events
   */
  async createEvent(eventData: CreateEventData): Promise<ClubEvent> {
    try {
      const response = await api.post<EventResponse>(
        `${this.BASE_PATH}/events`,
        eventData
      )
      return response.data.event
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 35. Get Club Events
   * GET /clubs/events
   */
  async getEvents(params?: {
    type?: string
    sport?: string
    teamId?: string
    status?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<{
    events: ClubEvent[]
    pagination?: PaginationInfo
  }> {
    try {
      const response = await api.get<EventsResponse>(
        `${this.BASE_PATH}/events`,
        { params }
      )
      return {
        events: response.data.events,
        pagination: response.data.pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 36. Get Upcoming Events
   * GET /clubs/events/upcoming
   */
  async getUpcomingEvents(days: number = 7): Promise<{
    events: ClubEvent[]
    total: number
  }> {
    try {
      const response = await api.get<EventsResponse>(
        `${this.BASE_PATH}/events/upcoming`,
        { params: { days } }
      )
      return {
        events: response.data.events,
        total: response.data.events.length,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 37. Update Event
   * PUT /clubs/events/:eventId
   */
  async updateEvent(
    eventId: string,
    eventData: UpdateEventData
  ): Promise<ClubEvent> {
    try {
      const response = await api.put<EventResponse>(
        `${this.BASE_PATH}/events/${eventId}`,
        eventData
      )
      return response.data.event
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 38. Cancel Event
   * POST /clubs/events/:eventId/cancel
   */
  async cancelEvent(
    eventId: string,
    data: CancelEventData
  ): Promise<ClubEvent> {
    try {
      const response = await api.post<EventResponse>(
        `${this.BASE_PATH}/events/${eventId}/cancel`,
        data
      )
      return response.data.event
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 39. Mark Attendance
   * POST /clubs/events/:eventId/attendance
   */
  async markAttendance(
    eventId: string,
    data: MarkAttendanceData
  ): Promise<ClubEvent> {
    try {
      const response = await api.post<EventResponse>(
        `${this.BASE_PATH}/events/${eventId}/attendance`,
        data
      )
      return response.data.event
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // FACILITY & BOOKING MANAGEMENT
  // ============================================================================

  /**
   * 40. Create Facility Booking
   * POST /clubs/bookings
   */
  async createBooking(
    bookingData: CreateBookingData
  ): Promise<FacilityBooking> {
    try {
      const response = await api.post<BookingResponse>(
        `${this.BASE_PATH}/bookings`,
        bookingData
      )
      return response.data.booking
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 41. Get Club Bookings
   * GET /clubs/bookings
   */
  async getBookings(params?: BookingListParams): Promise<{
    bookings: FacilityBooking[]
    pagination?: PaginationInfo
  }> {
    try {
      const response = await api.get<BookingsResponse>(
        `${this.BASE_PATH}/bookings`,
        { params }
      )
      return {
        bookings: response.data.bookings,
        pagination: response.data.pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 42. Get Facility Schedule
   * GET /clubs/facilities/schedule
   */
  async getFacilitySchedule(
    facilityId: string,
    date: string
  ): Promise<FacilitySchedule> {
    try {
      const response = await api.get<FacilityScheduleResponse>(
        `${this.BASE_PATH}/facilities/schedule`,
        { params: { facilityId, date } }
      )
      return {
        date: response.data.date,
        facilityId: response.data.facilityId,
        bookings: response.data.bookings,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 43. Get Available Slots
   * GET /clubs/facilities/available-slots
   */
  async getAvailableSlots(
    facilityId: string,
    date: string,
    slotDuration: number = 60
  ): Promise<{
    date: string
    facilityId: string
    availableSlots: AvailableSlot[]
  }> {
    try {
      const response = await api.get<AvailableSlotsResponse>(
        `${this.BASE_PATH}/facilities/available-slots`,
        { params: { facilityId, date, slotDuration } }
      )
      return {
        date: response.data.date,
        facilityId: response.data.facilityId,
        availableSlots: response.data.availableSlots,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 44. Approve Booking
   * POST /clubs/bookings/:bookingId/approve
   */
  async approveBooking(bookingId: string): Promise<FacilityBooking> {
    try {
      const response = await api.post<BookingResponse>(
        `${this.BASE_PATH}/bookings/${bookingId}/approve`
      )
      return response.data.booking
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 45. Reject Booking
   * POST /clubs/bookings/:bookingId/reject
   */
  async rejectBooking(
    bookingId: string,
    data: RejectBookingData
  ): Promise<FacilityBooking> {
    try {
      const response = await api.post<BookingResponse>(
        `${this.BASE_PATH}/bookings/${bookingId}/reject`,
        data
      )
      return response.data.booking
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 46. Cancel Booking
   * POST /clubs/bookings/:bookingId/cancel
   */
  async cancelBooking(
    bookingId: string,
    data: CancelBookingData
  ): Promise<FacilityBooking> {
    try {
      const response = await api.post<BookingResponse>(
        `${this.BASE_PATH}/bookings/${bookingId}/cancel`,
        data
      )
      return response.data.booking
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 47. Get Facility Utilization
   * GET /clubs/facilities/utilization
   */
  async getFacilityUtilization(
    facilityId: string,
    startDate: string,
    endDate: string
  ): Promise<FacilityUtilization> {
    try {
      const response = await api.get<FacilityUtilizationResponse>(
        `${this.BASE_PATH}/facilities/utilization`,
        { params: { facilityId, startDate, endDate } }
      )
      return {
        facilityId: response.data.facilityId,
        period: response.data.period,
        utilization: response.data.utilization,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // DASHBOARD & ANALYTICS
  // ============================================================================

  /**
   * 48. Get Club Dashboard Statistics
   * GET /clubs/dashboard/stats
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<StatsResponse>(
        `${this.BASE_PATH}/dashboard/stats`
      )
      return response.data.stats
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // CLOUDINARY UPLOADS
  // ============================================================================

  /**
   * Upload Club Logo to Cloudinary
   * POST /clubs/upload/logo
   */
  async uploadLogo(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{
    url: string
    smallUrl: string
    mediumUrl: string
    largeUrl: string
  }> {
    try {
      const formData = new FormData()
      formData.append('logo', file)

      const response = await api.post<{
        success: boolean
        message: string
        logo: {
          url: string
          smallUrl: string
          mediumUrl: string
          largeUrl: string
        }
      }>(`${this.BASE_PATH}/upload/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            onProgress(progress)
          }
        },
      })

      return response.data.logo
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Upload Club Banner to Cloudinary
   * POST /clubs/upload/banner
   */
  async uploadBanner(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{
    url: string
    mobileUrl: string
    tabletUrl: string
    desktopUrl: string
  }> {
    try {
      const formData = new FormData()
      formData.append('banner', file)

      const response = await api.post<{
        success: boolean
        message: string
        banner: {
          url: string
          mobileUrl: string
          tabletUrl: string
          desktopUrl: string
        }
      }>(`${this.BASE_PATH}/upload/banner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            onProgress(progress)
          }
        },
      })

      return response.data.banner
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Upload Gallery Images to Cloudinary
   * POST /clubs/upload/gallery
   */
  async uploadGalleryImages(
    files: File[],
    captions?: string[],
    onProgress?: (progress: number) => void
  ): Promise<{ photos: Photo[]; totalPhotos: number }> {
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('images', file)
      })
      if (captions) {
        captions.forEach((caption) => {
          formData.append('captions', caption)
        })
      }

      const response = await api.post<{
        success: boolean
        message: string
        photos: Photo[]
        totalPhotos: number
      }>(`${this.BASE_PATH}/upload/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            onProgress(progress)
          }
        },
      })

      return {
        photos: response.data.photos,
        totalPhotos: response.data.totalPhotos,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // MEDIA GALLERY
  // ============================================================================

  /**
   * Upload Facility Photo to Cloudinary
   * POST /clubs/facilities/photos/upload
   */
  async uploadFacilityPhoto(
    file: File,
    caption?: string,
    captionAr?: string
  ): Promise<ClubProfile> {
    try {
      const formData = new FormData()
      formData.append('photo', file)
      if (caption) formData.append('caption', caption)
      if (captionAr) formData.append('captionAr', captionAr)

      const response = await api.post<PhotoResponse>(
        `${this.BASE_PATH}/facilities/photos/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 49. Add Facility Photo (with pre-uploaded URL)
   * POST /clubs/facilities/photos
   */
  async addFacilityPhoto(photoData: AddPhotoData): Promise<ClubProfile> {
    try {
      const response = await api.post<PhotoResponse>(
        `${this.BASE_PATH}/facilities/photos`,
        photoData
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 50. Remove Facility Photo
   * DELETE /clubs/facilities/photos/:photoId
   */
  async removeFacilityPhoto(photoId: string): Promise<ClubProfile> {
    try {
      const response = await api.delete<PhotoResponse>(
        `${this.BASE_PATH}/facilities/photos/${photoId}`
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 51. Add Facility Video
   * POST /clubs/facilities/videos
   */
  async addFacilityVideo(videoData: AddVideoData): Promise<ClubProfile> {
    try {
      const response = await api.post<VideoResponse>(
        `${this.BASE_PATH}/facilities/videos`,
        videoData
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 52. Remove Facility Video
   * DELETE /clubs/facilities/videos/:videoId
   */
  async removeFacilityVideo(videoId: string): Promise<ClubProfile> {
    try {
      const response = await api.delete<VideoResponse>(
        `${this.BASE_PATH}/facilities/videos/${videoId}`
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // SETTINGS
  // ============================================================================

  /**
   * 53. Update Privacy Settings
   * PUT /clubs/settings/privacy
   */
  async updatePrivacySettings(data: UpdatePrivacyData): Promise<ClubProfile> {
    try {
      const response = await api.put<PrivacyResponse>(
        `${this.BASE_PATH}/settings/privacy`,
        data
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * 54. Update Notification Settings
   * PUT /clubs/settings/notifications
   */
  async updateNotificationSettings(
    data: UpdateNotificationsData
  ): Promise<ClubProfile> {
    try {
      const response = await api.put<NotificationsResponse>(
        `${this.BASE_PATH}/settings/notifications`,
        data
      )
      return response.data.profile
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  private handleError(error: any): Error {
    console.error('[ClubService] Full error:', error)
    console.error('[ClubService] Error response:', error.response)

    if (error.response) {
      // API returned an error response
      const { data, status } = error.response

      // Handle validation errors (400)
      if (status === 400 && data.errors) {
        if (Array.isArray(data.errors)) {
          const errorMessage = data.errors
            .map((err: any) => `${err.field}: ${err.message}`)
            .join(', ')
          return new Error(errorMessage)
        }
        return new Error(data.message || 'Validation error')
      }

      // Handle other HTTP errors
      const err = new Error(
        data.message || `Request failed with status ${status}`
      ) as any
      err.status = status
      err.responseData = data
      return err
    }

    if (error.request) {
      // Request was made but no response received
      return new Error('No response from server. Please check your connection.')
    }

    // Something else happened
    return new Error(error.message || 'An unexpected error occurred')
  }
}

// Export singleton instance
const clubService = new ClubService()
export default clubService
