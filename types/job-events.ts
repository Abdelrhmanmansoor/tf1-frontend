export type JobEventType = 
  | 'job_posted'
  | 'job_updated'
  | 'job_closed'
  | 'job_reopened'
  | 'deadline_changed'
  | 'announcement_posted'

export interface JobEvent {
  id: string
  jobId: string
  jobTitle: string
  jobTitleAr?: string
  organization: string
  organizationAr?: string
  organizationLogo?: string
  eventType: JobEventType
  timestamp: string
  link: string
  sport?: string
  location?: string
  locationAr?: string
  deadline?: string
  previousDeadline?: string
  salary?: string
  isUrgent?: boolean
}

export interface JobEventsResponse {
  success: boolean
  data: JobEvent[]
  total: number
}

export interface JobEventSubscription {
  channel: string
  events: JobEventType[]
}

export const getEventIcon = (eventType: JobEventType): string => {
  switch (eventType) {
    case 'job_posted':
      return '🆕'
    case 'job_updated':
      return '🔄'
    case 'job_closed':
      return '🔒'
    case 'job_reopened':
      return '🔓'
    case 'deadline_changed':
      return '⏰'
    case 'announcement_posted':
      return '📢'
    default:
      return '📌'
  }
}

export const getEventLabel = (eventType: JobEventType, language: 'ar' | 'en'): string => {
  const labels: Record<JobEventType, { ar: string; en: string }> = {
    job_posted: { ar: 'وظيفة جديدة', en: 'New Job' },
    job_updated: { ar: 'تم التحديث', en: 'Updated' },
    job_closed: { ar: 'تم الإغلاق', en: 'Closed' },
    job_reopened: { ar: 'تم إعادة الفتح', en: 'Reopened' },
    deadline_changed: { ar: 'تغيير الموعد', en: 'Deadline Changed' },
    announcement_posted: { ar: 'إعلان توظيف', en: 'Hiring Announcement' },
  }
  return labels[eventType]?.[language] || eventType
}

export const getEventColor = (eventType: JobEventType): string => {
  switch (eventType) {
    case 'job_posted':
      return 'bg-green-500'
    case 'job_updated':
      return 'bg-blue-500'
    case 'job_closed':
      return 'bg-gray-500'
    case 'job_reopened':
      return 'bg-purple-500'
    case 'deadline_changed':
      return 'bg-orange-500'
    case 'announcement_posted':
      return 'bg-cyan-500'
    default:
      return 'bg-gray-500'
  }
}
