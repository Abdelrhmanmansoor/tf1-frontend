/**
 * Job Publisher Service
 * 
 * Handles job posting and management for job publishers
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface JobData {
  title: string;
  description: string;
  sport?: string;
  jobType?: string;
  location?: string;
  languages?: string;
  competitionLevel?: string;
  ageGroup?: string;
  startDate?: string;
  deadline?: string;
  isDraft?: boolean;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    negotiable?: boolean;
  };
  requirements?: string[];
  benefits?: string[];
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  messageAr?: string;
  data?: T;
  error?: string;
}

class JobPublisherService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Create a new job posting
   */
  async createJob(jobData: JobData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/job-publisher/jobs`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create job');
      }

      return {
        success: true,
        message: data.message || 'Job created successfully',
        messageAr: data.messageAr || 'تم إنشاء الوظيفة بنجاح',
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create job',
      };
    }
  }

  /**
   * Update an existing job posting
   */
  async updateJob(jobId: string, jobData: Partial<JobData>): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/job-publisher/jobs/${jobId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update job');
      }

      return {
        success: true,
        message: data.message || 'Job updated successfully',
        messageAr: data.messageAr || 'تم تحديث الوظيفة بنجاح',
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update job',
      };
    }
  }

  /**
   * Delete a job posting
   */
  async deleteJob(jobId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/job-publisher/jobs/${jobId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete job');
      }

      return {
        success: true,
        message: data.message || 'Job deleted successfully',
        messageAr: data.messageAr || 'تم حذف الوظيفة بنجاح',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete job',
      };
    }
  }

  /**
   * Get my job postings
   */
  async getMyJobs(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/job-publisher/jobs`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch jobs');
      }

      return {
        success: true,
        data: data.data || data.jobs || [],
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch jobs',
        data: [],
      };
    }
  }

  /**
   * Get applications for a job
   */
  async getJobApplications(jobId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/job-publisher/jobs/${jobId}/applications`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch applications');
      }

      return {
        success: true,
        data: data.data || data.applications || [],
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch applications',
        data: [],
      };
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(applicationId: string, status: string, notes?: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/job-publisher/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ status, notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update status');
      }

      return {
        success: true,
        message: data.message || 'Status updated successfully',
        messageAr: data.messageAr || 'تم تحديث الحالة بنجاح',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update status',
      };
    }
  }
}

export const jobPublisherService = new JobPublisherService();
export default jobPublisherService;
