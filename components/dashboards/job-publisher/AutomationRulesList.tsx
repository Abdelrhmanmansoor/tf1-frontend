'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Activity, Zap, Plus, MoreVertical, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/services/api'
import CreateAutomationModal from './CreateAutomationModal'

interface AutomationRule {
  _id: string
  name: string
  nameAr?: string
  trigger: {
    event: string
  }
  actions: any[]
  isActive: boolean
  executionCount: number
  successCount: number
}

export default function AutomationRulesList() {
  const { language } = useLanguage()
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await api.get('/publisher/automations')

      if (response.data.success) {
        setRules(response.data.data.rules || [])
      }
    } catch (error) {
      console.error('Error fetching rules:', error)
      toast.error(language === 'ar' ? 'فشل تحميل القواعد' : 'Failed to load rules')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRule = async (ruleId: string) => {
    try {
      const response = await api.post(`/publisher/automations/${ruleId}/toggle`)

      if (response.data.success) {
        toast.success(language === 'ar' ? 'تم تحديث القاعدة' : 'Rule updated')
        fetchRules()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || (language === 'ar' ? 'فشل التحديث' : 'Update failed'))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CreateAutomationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchRules}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'ar' ? 'قواعد الأتمتة' : 'Automation Rules'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {language === 'ar' ? 'أتمت سير عمل التوظيف' : 'Automate your recruitment workflow'}
          </p>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'قاعدة جديدة' : 'New Rule'}
        </Button>
      </div>

      {rules.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">
            {language === 'ar' ? 'لا توجد قواعد أتمتة' : 'No automation rules'}
          </p>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
            {language === 'ar'
              ? 'أنشئ قواعد لإرسال إشعارات تلقائية عند تغيير حالة الطلب'
              : 'Create rules to automatically send notifications when application status changes'}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إنشاء أول قاعدة' : 'Create First Rule'}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule._id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className={`w-5 h-5 ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <h3 className="font-semibold text-gray-900">
                      {language === 'ar' ? rule.nameAr || rule.name : rule.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        rule.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {rule.isActive
                        ? language === 'ar' ? 'مفعّلة' : 'Active'
                        : language === 'ar' ? 'معطّلة' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>
                      {language === 'ar' ? 'الحدث:' : 'Trigger:'} <span className="font-medium">{rule.trigger.event}</span>
                    </span>
                    <span>
                      {rule.actions.length} {language === 'ar' ? 'إجراء' : 'actions'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {language === 'ar' ? 'تنفيذات:' : 'Executions:'} {rule.executionCount}
                    </span>
                    <span>
                      {language === 'ar' ? 'نجاحات:' : 'Success:'} {rule.successCount}
                    </span>
                    {rule.executionCount > 0 && (
                      <span className="text-green-600">
                        {Math.round((rule.successCount / rule.executionCount) * 100)}% {language === 'ar' ? 'معدل النجاح' : 'success rate'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRule(rule._id)}
                  >
                    {rule.isActive ? (
                      <ToggleRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
