'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Calendar, Video, MapPin, Clock, User, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/services/api'
import InterviewScheduler from './InterviewScheduler'

interface Interview {
  _id: string
  type: 'online' | 'onsite'
  scheduledAt: string
  duration: number
  status: string
  meetingUrl?: string
  location?: { address?: { fullAddress?: string } }
  applicantData: {
    name: string
    email: string
    avatar?: string
  }
  jobData: {
    title: string
    titleAr?: string
  }
}

export default function InterviewsList() {
  const { language } = useLanguage()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('upcoming')

  useEffect(() => {
    fetchInterviews()
  }, [filter])

  const fetchInterviews = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: 1,
        limit: 20,
      }

      if (filter === 'upcoming') {
        params.status = 'scheduled'
        params.startDate = new Date().toISOString()
      } else if (filter === 'completed') {
        params.status = 'completed'
      } else if (filter === 'cancelled') {
        params.status = 'cancelled'
      }

      const response = await api.get('/publisher/interviews', { params })

      if (response.data.success) {
        setInterviews(response.data.data.interviews || [])
      }
    } catch (error) {
      console.error('Error fetching interviews:', error)
      toast.error(language === 'ar' ? 'فشل تحميل المقابلات' : 'Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'ar' ? 'المقابلات' : 'Interviews'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'ar' ? 'إدارة المقابلات المجدولة' : 'Manage scheduled interviews'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['upcoming', 'completed', 'cancelled'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? 'bg-blue-600' : ''}
            >
              {language === 'ar'
                ? f === 'upcoming' ? 'قادمة' : f === 'completed' ? 'مكتملة' : 'ملغاة'
                : f === 'upcoming' ? 'Upcoming' : f === 'completed' ? 'Completed' : 'Cancelled'}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">
            {language === 'ar' ? 'لا توجد مقابلات' : 'No interviews'}
          </p>
          <p className="text-sm text-gray-400">
            {language === 'ar' ? 'جدول مقابلة من صفحة الطلبات' : 'Schedule an interview from applications page'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => {
            const { date, time } = formatDateTime(interview.scheduledAt)
            
            return (
              <div
                key={interview._id}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{interview.applicantData.name}</h3>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' ? interview.jobData.titleAr || interview.jobData.title : interview.jobData.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {interview.type === 'online' ? (
                          <>
                            <Video className="w-4 h-4" />
                            <span>{language === 'ar' ? 'عبر الإنترنت' : 'Online'}</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span>{language === 'ar' ? 'في الموقع' : 'Onsite'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {interview.type === 'online' && interview.meetingUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={interview.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {language === 'ar' ? 'رابط الاجتماع' : 'Join Meeting'} →
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
