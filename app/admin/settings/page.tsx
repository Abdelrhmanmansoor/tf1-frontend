'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import adminService from '@/services/admin'
import type { AdminSettings } from '@/services/admin'
import { Button } from '@/components/ui/button'

export default function AdminSettings() {
  const { language } = useLanguage()
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await adminService.getSettings()
      setSettings(data)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      await adminService.updateSettings(settings)
      setMessage(language === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(language === 'ar' ? 'خطأ في حفظ الإعدادات' : 'Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">
        {language === 'ar' ? 'الإعدادات' : 'Settings'}
      </h1>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded ${message.includes('بنجاح') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        >
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Site Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'اسم الموقع' : 'Site Name'}
          </label>
          <input
            type="text"
            value={settings?.siteName || ''}
            onChange={(e) => setSettings({ ...settings!, siteName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Site Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'وصف الموقع' : 'Site Description'}
          </label>
          <textarea
            value={settings?.siteDescription || ''}
            onChange={(e) => setSettings({ ...settings!, siteDescription: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'اللون الأساسي' : 'Primary Color'}
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={settings?.primaryColor || '#3B82F6'}
              onChange={(e) => setSettings({ ...settings!, primaryColor: e.target.value })}
              className="h-12 w-24 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings?.primaryColor || '#3B82F6'}
              onChange={(e) => setSettings({ ...settings!, primaryColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'اللون الثانوي' : 'Secondary Color'}
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={settings?.secondaryColor || '#A855F7'}
              onChange={(e) => setSettings({ ...settings!, secondaryColor: e.target.value })}
              className="h-12 w-24 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings?.secondaryColor || '#A855F7'}
              onChange={(e) => setSettings({ ...settings!, secondaryColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Maintenance Mode */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings?.maintenanceMode || false}
              onChange={(e) => setSettings({ ...settings!, maintenanceMode: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              {language === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode'}
            </span>
          </label>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
