'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import adminService from '@/services/admin'
import type { ActivityLog } from '@/services/admin'

export default function AdminActivity() {
  const { language } = useLanguage()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const data = await adminService.getActivityLogs(100)
      setLogs(data)
    } catch (error) {
      console.error('Error loading logs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'ar' ? 'سجل الأنشطة' : 'Activity Logs'}
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الوقت' : 'Time'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'المستخدم' : 'User'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الإجراء' : 'Action'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'التفاصيل' : 'Details'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.userId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                    {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            {language === 'ar' ? 'لا توجد أنشطة' : 'No activities'}
          </div>
        )}
      </div>
    </div>
  )
}
