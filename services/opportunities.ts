// Opportunities Service - API calls for job opportunities
import api from './api'

export interface OpportunitySearchParams {
  q?: string // Search query
  sport?: string // Filter by sport
  location?: string // Filter by location
  jobType?:
    | 'permanent'
    | 'seasonal'
    | 'temporary'
    | 'trial'
    | 'internship'
    | 'volunteer'
  salaryMin?: number // Minimum salary
  salaryMax?: number // Maximum salary
  postedWithin?: string // e.g., "7d", "30d"
  clubId?: string // Filter by specific club
  page?: number // Page number (default: 1)
  limit?: number // Results per page (default: 20)
  sortBy?: 'date' | 'salary_high' | 'salary_low' | 'deadline'
}

export interface Opportunity {
  _id: string
  title: string
  club: {
    _id: string
    name: string
    logo?: string
  }
  jobType: string
  sport?: string
  position?: string
  location: string
  salaryRange?: string
  deadline: string
  applicationCount: number
  postedAt: string
  description?: string
  requirements?: string[]
  responsibilities?: string[]
  category?: 'player' | 'coach' | 'specialist'
}

export interface OpportunitySearchResponse {
  success: boolean
  results: Opportunity[]
  total: number
  page: number
  pages: number
  hasMore: boolean
}

// Search opportunities (automatically filtered by user's role)
export const searchOpportunities = async (
  params: OpportunitySearchParams = {}
): Promise<OpportunitySearchResponse> => {
  const response = await api.get('/search/jobs', { params })
  return response.data
}

// Get opportunity details by ID
export const getOpportunityById = async (
  opportunityId: string
): Promise<Opportunity> => {
  const response = await api.get(`/jobs/${opportunityId}`)
  return response.data.job
}

// Apply to an opportunity
export const applyToOpportunity = async (
  opportunityId: string,
  applicationData: {
    coverLetter?: string
    resume?: string
    customQuestions?: Record<string, any>
  }
) => {
  const response = await api.post(
    `/jobs/${opportunityId}/apply`,
    applicationData
  )
  return response.data
}

// Get my applications
export const getMyApplications = async () => {
  const response = await api.get('/jobs/applications/me')
  return response.data
}

export default {
  searchOpportunities,
  getOpportunityById,
  applyToOpportunity,
  getMyApplications,
}
