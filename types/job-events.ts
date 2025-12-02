export type JobEventType = 
  | 'new'
  | 'updated'
  | 'closed'
  | 'reopened'
  | 'deadline_changed'
  | 'urgent'
  | 'hiring_announcement'

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
    case 'new':
      return '🆕'
    case 'updated':
      return '🔄'
    case 'closed':
      return '🔒'
    case 'reopened':
      return '🔓'
    case 'deadline_changed':
      return '⏰'
    case 'urgent':
      return '🔥'
    case 'hiring_announcement':
      return '📢'
    default:
      return '📌'
  }
}

export const getEventLabel = (eventType: JobEventType, language: 'ar' | 'en'): string => {
  const labels: Record<JobEventType, { ar: string; en: string }> = {
    new: { ar: 'وظيفة جديدة', en: 'New Job' },
    updated: { ar: 'تم التحديث', en: 'Updated' },
    closed: { ar: 'تم الإغلاق', en: 'Closed' },
    reopened: { ar: 'تم إعادة الفتح', en: 'Reopened' },
    deadline_changed: { ar: 'تغيير الموعد', en: 'Deadline Changed' },
    urgent: { ar: 'عاجل', en: 'Urgent' },
    hiring_announcement: { ar: 'إعلان توظيف', en: 'Hiring Announcement' },
  }
  return labels[eventType][language]
}

export const getEventColor = (eventType: JobEventType): string => {
  switch (eventType) {
    case 'new':
      return 'bg-green-500'
    case 'updated':
      return 'bg-blue-500'
    case 'closed':
      return 'bg-gray-500'
    case 'reopened':
      return 'bg-purple-500'
    case 'deadline_changed':
      return 'bg-orange-500'
    case 'urgent':
      return 'bg-red-500'
    case 'hiring_announcement':
      return 'bg-cyan-500'
    default:
      return 'bg-gray-500'
  }
}
