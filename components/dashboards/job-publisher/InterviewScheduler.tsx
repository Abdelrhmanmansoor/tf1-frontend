'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Clock, Video, MapPin, Users } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/services/api'

interface InterviewSchedulerProps {
  applicationId: string
  applicantName: string
  jobTitle: string
  onSuccess?: (interview: any) => void
}

export default function InterviewScheduler({
  applicationId,
  applicantName,
  jobTitle,
  onSuccess,
}: InterviewSchedulerProps) {
  const { language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [interviewType, setInterviewType] = useState<'online' | 'onsite'>('online')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [duration, setDuration] = useState('60')
  const [location, setLocation] = useState('')

  const handleScheduleInterview = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error(language === 'ar' ? 'الرجاء إدخال التاريخ والوقت' : 'Please enter date and time')
      return
    }

    setLoading(true)

    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00.000Z`).toISOString()

      const interviewData: any = {
        applicationId,
        type: interviewType,
        scheduledAt,
        duration: parseInt(duration),
        timezone: 'Asia/Riyadh',
        meetingPlatform: interviewType === 'online' ? 'internal' : undefined,
        instructionsForApplicant:
          interviewType === 'online'
            ? 'Please join the meeting 5 minutes early'
            : 'Please arrive 10 minutes early',
        instructionsForApplicantAr:
          interviewType === 'online'
            ? 'يرجى الانضمام للاجتماع قبل 5 دقائق'
            : 'يرجى الوصول قبل 10 دقائق',
      }

      if (interviewType === 'onsite' && location) {
        interviewData.location = {
          type: 'custom',
          address: {
            fullAddress: location,
          },
        }
      }

      const response = await api.post('/publisher/interviews', interviewData)

      if (response.data.success) {
        toast.success(language === 'ar' ? 'تم جدولة المقابلة بنجاح' : 'Interview scheduled successfully')
        setOpen(false)
        
        // Auto-open messaging thread
        if (response.data.data.thread) {
          window.location.href = `/dashboard/job-publisher/messages?thread=${response.data.data.thread._id}`
        }

        onSuccess?.(response.data.data.interview)
      }
    } catch (error: any) {
      console.error('Error scheduling interview:', error)
      toast.error(
        error.response?.data?.message ||
        (language === 'ar' ? 'فشل في جدولة المقابلة' : 'Failed to schedule interview')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Calendar className="w-4 h-4 mr-2" />
        {language === 'ar' ? 'جدولة مقابلة' : 'Schedule Interview'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'جدولة مقابلة' : 'Schedule Interview'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar'
                ? `جدولة مقابلة مع ${applicantName} لوظيفة ${jobTitle}`
                : `Schedule an interview with ${applicantName} for ${jobTitle}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Interview Type */}
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'نوع المقابلة' : 'Interview Type'}</Label>
              <Select value={interviewType} onValueChange={(value: any) => setInterviewType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">
                    <div className="flex items-center">
                      <Video className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'عبر الإنترنت' : 'Online'}
                    </div>
                  </SelectItem>
                  <SelectItem value="onsite">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'في الموقع' : 'Onsite'}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'التاريخ' : 'Date'}</Label>
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الوقت' : 'Time'}</Label>
              <Input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'المدة (دقيقة)' : 'Duration (minutes)'}</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 {language === 'ar' ? 'دقيقة' : 'minutes'}</SelectItem>
                  <SelectItem value="45">45 {language === 'ar' ? 'دقيقة' : 'minutes'}</SelectItem>
                  <SelectItem value="60">60 {language === 'ar' ? 'دقيقة' : 'minutes'}</SelectItem>
                  <SelectItem value="90">90 {language === 'ar' ? 'دقيقة' : 'minutes'}</SelectItem>
                  <SelectItem value="120">120 {language === 'ar' ? 'دقيقة' : 'minutes'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location (for onsite) */}
            {interviewType === 'onsite' && (
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الموقع' : 'Location'}</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'أدخل العنوان الكامل'
                      : 'Enter full address'
                  }
                />
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">
                    {language === 'ar' ? 'سيحدث تلقائياً:' : 'Will happen automatically:'}
                  </p>
                  <ul className="mt-2 space-y-1 text-blue-700">
                    <li>✓ {language === 'ar' ? 'توليد رابط اجتماع (إذا عبر الإنترنت)' : 'Generate meeting link (if online)'}</li>
                    <li>✓ {language === 'ar' ? 'إرسال إشعارات للمرشح' : 'Send notifications to candidate'}</li>
                    <li>✓ {language === 'ar' ? 'فتح محادثة تلقائياً' : 'Open message thread automatically'}</li>
                    <li>✓ {language === 'ar' ? 'جدولة تذكيرات' : 'Schedule reminders'} (24h, 1h, 15min)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleScheduleInterview} disabled={loading}>
              {loading
                ? language === 'ar'
                  ? 'جاري الجدولة...'
                  : 'Scheduling...'
                : language === 'ar'
                ? 'جدولة المقابلة'
                : 'Schedule Interview'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
