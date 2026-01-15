'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { X, Zap, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/services/api'

interface CreateAutomationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const TRIGGER_EVENTS = [
  { value: 'APPLICATION_SUBMITTED', label: 'Application Submitted', labelAr: 'تقديم طلب' },
  { value: 'APPLICATION_STAGE_CHANGED', label: 'Application Stage Changed', labelAr: 'تغيير مرحلة الطلب' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', labelAr: 'جدولة مقابلة' },
  { value: 'INTERVIEW_COMPLETED', label: 'Interview Completed', labelAr: 'إنهاء مقابلة' },
  { value: 'INTERVIEW_CANCELLED', label: 'Interview Cancelled', labelAr: 'إلغاء مقابلة' },
  { value: 'MESSAGE_RECEIVED', label: 'Message Received', labelAr: 'استلام رسالة' },
  { value: 'JOB_PUBLISHED', label: 'Job Published', labelAr: 'نشر وظيفة' },
  { value: 'JOB_DEADLINE_APPROACHING', label: 'Job Deadline Approaching', labelAr: 'اقتراب موعد الوظيفة' },
  { value: 'APPLICATION_UPDATED', label: 'Application Updated', labelAr: 'تحديث طلب' },
  { value: 'FEEDBACK_SUBMITTED', label: 'Feedback Submitted', labelAr: 'إرسال تقييم' },
]

const ACTION_TYPES = [
  { value: 'SEND_NOTIFICATION', label: 'Send Notification', labelAr: 'إرسال إشعار' },
  { value: 'SEND_EMAIL', label: 'Send Email', labelAr: 'إرسال بريد' },
  { value: 'SEND_MESSAGE', label: 'Send Message', labelAr: 'إرسال رسالة' },
  { value: 'CREATE_THREAD', label: 'Create Thread', labelAr: 'إنشاء محادثة' },
  { value: 'SCHEDULE_INTERVIEW', label: 'Schedule Interview', labelAr: 'جدولة مقابلة' },
  { value: 'ASSIGN_TO_STAGE', label: 'Assign to Stage', labelAr: 'تعيين لمرحلة' },
  { value: 'ADD_TAG', label: 'Add Tag', labelAr: 'إضافة وسم' },
]

export default function CreateAutomationModal({ isOpen, onClose, onSuccess }: CreateAutomationModalProps) {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    triggerEvent: '',
    actions: [
      {
        type: '',
        order: 0,
        config: {
          title: '',
          titleAr: '',
          message: '',
          messageAr: '',
        },
        enabled: true,
      },
    ],
    isActive: true,
    priority: 0,
  })

  const handleAddAction = () => {
    setFormData({
      ...formData,
      actions: [
        ...formData.actions,
        {
          type: '',
          order: formData.actions.length,
          config: {
            title: '',
            titleAr: '',
            message: '',
            messageAr: '',
          },
          enabled: true,
        },
      ],
    })
  }

  const handleRemoveAction = (index: number) => {
    const newActions = formData.actions.filter((_, i) => i !== index)
    setFormData({ ...formData, actions: newActions })
  }

  const handleActionChange = (index: number, field: string, value: any) => {
    const newActions = [...formData.actions]
    if (field === 'type') {
      newActions[index].type = value
    } else if (field.startsWith('config.')) {
      const configField = field.split('.')[1]
      newActions[index].config[configField] = value
    }
    setFormData({ ...formData, actions: newActions })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.triggerEvent) {
      toast.error(language === 'ar' ? 'املأ الحقول المطلوبة' : 'Fill required fields')
      return
    }

    if (formData.actions.length === 0 || !formData.actions[0].type) {
      toast.error(language === 'ar' ? 'أضف إجراء واحد على الأقل' : 'Add at least one action')
      return
    }

    try {
      setLoading(true)

      const payload = {
        name: formData.name,
        nameAr: formData.nameAr || formData.name,
        description: formData.description,
        descriptionAr: formData.descriptionAr || formData.description,
        trigger: {
          event: formData.triggerEvent,
          conditions: [],
        },
        actions: formData.actions.filter(a => a.type),
        isActive: formData.isActive,
        priority: formData.priority,
      }

      const response = await api.post('/publisher/automations', payload)

      if (response.data.success) {
        toast.success(language === 'ar' ? 'تم إنشاء القاعدة بنجاح' : 'Rule created successfully')
        onSuccess()
        onClose()
      }
    } catch (error: any) {
      console.error('Error creating rule:', error)
      toast.error(
        error.response?.data?.message ||
          (language === 'ar' ? 'فشل إنشاء القاعدة' : 'Failed to create rule')
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إنشاء قاعدة أتمتة' : 'Create Automation Rule'}
              </h2>
              <p className="text-sm text-gray-500">
                {language === 'ar' ? 'أتمت سير عمل التوظيف' : 'Automate your recruitment workflow'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم (EN)' : 'Name (EN)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Auto-notify on application"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم (AR)' : 'Name (AR)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="إشعار تلقائي عند التقديم"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder={
                    language === 'ar'
                      ? 'وصف القاعدة...'
                      : 'Describe what this rule does...'
                  }
                />
              </div>
            </div>

            {/* Trigger */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'المحفز (Trigger)' : 'Trigger'}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الحدث' : 'Event'} *
                </label>
                <select
                  value={formData.triggerEvent}
                  onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">
                    {language === 'ar' ? 'اختر الحدث' : 'Select Event'}
                  </option>
                  {TRIGGER_EVENTS.map((event) => (
                    <option key={event.value} value={event.value}>
                      {language === 'ar' ? event.labelAr : event.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </h3>
                <Button type="button" onClick={handleAddAction} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إضافة إجراء' : 'Add Action'}
                </Button>
              </div>

              {formData.actions.map((action, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'ar' ? `إجراء ${index + 1}` : `Action ${index + 1}`}
                    </span>
                    {formData.actions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAction(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'نوع الإجراء' : 'Action Type'}
                    </label>
                    <select
                      value={action.type}
                      onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">
                        {language === 'ar' ? 'اختر نوع الإجراء' : 'Select Action Type'}
                      </option>
                      {ACTION_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {language === 'ar' ? type.labelAr : type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {action.type && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'العنوان (EN)' : 'Title (EN)'}
                          </label>
                          <input
                            type="text"
                            value={action.config.title || ''}
                            onChange={(e) =>
                              handleActionChange(index, 'config.title', e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Notification title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'العنوان (AR)' : 'Title (AR)'}
                          </label>
                          <input
                            type="text"
                            value={action.config.titleAr || ''}
                            onChange={(e) =>
                              handleActionChange(index, 'config.titleAr', e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="عنوان الإشعار"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ar' ? 'الرسالة' : 'Message'}
                        </label>
                        <textarea
                          value={action.config.message || ''}
                          onChange={(e) =>
                            handleActionChange(index, 'config.message', e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          placeholder={
                            language === 'ar'
                              ? 'نص الرسالة...'
                              : 'Message content...'
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                {language === 'ar' ? 'الإعدادات' : 'Settings'}
              </h3>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  {language === 'ar' ? 'تفعيل القاعدة فوراً' : 'Activate rule immediately'}
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {language === 'ar' ? 'جاري الإنشاء...' : 'Creating...'}
              </div>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إنشاء القاعدة' : 'Create Rule'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
