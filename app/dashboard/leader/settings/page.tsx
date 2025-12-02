'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Loader2,
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Save,
  RefreshCw
} from 'lucide-react'

interface PlatformSettings {
  siteName: string
  siteNameAr: string
  supportEmail: string
  maintenanceMode: boolean
  allowRegistration: boolean
  emailNotifications: boolean
  maxUploadSize: number
  defaultLanguage: 'en' | 'ar'
}

export default function SettingsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<PlatformSettings>({
    siteName: 'TF1',
    siteNameAr: 'تي إف وان',
    supportEmail: 'support@tf1.com',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    maxUploadSize: 10,
    defaultLanguage: 'ar'
  })

  useEffect(() => {
    if (user?.role !== 'leader') {
      router.push('/dashboard/leader/fallback')
      return
    }
    fetchSettings()
  }, [user, router])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/admin/settings`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.ok) {
        const result = await response.json()
        setSettings(result.data || settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/admin/settings`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(settings)
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تم حفظ الإعدادات' : 'Settings saved')
      } else {
        toast.info(language === 'ar' ? 'الخدمة قيد التطوير' : 'Service under development')
      }
    } catch (error) {
      toast.info(language === 'ar' ? 'الخدمة قيد التطوير' : 'Service under development')
    } finally {
      setSaving(false)
    }
  }

  const settingSections = [
    {
      title: language === 'ar' ? 'الإعدادات العامة' : 'General Settings',
      icon: Settings,
      items: [
        { key: 'siteName', label: language === 'ar' ? 'اسم الموقع (إنجليزي)' : 'Site Name (English)', type: 'text' },
        { key: 'siteNameAr', label: language === 'ar' ? 'اسم الموقع (عربي)' : 'Site Name (Arabic)', type: 'text' },
        { key: 'supportEmail', label: language === 'ar' ? 'البريد الدعم' : 'Support Email', type: 'email' },
        { key: 'defaultLanguage', label: language === 'ar' ? 'اللغة الافتراضية' : 'Default Language', type: 'select', options: [{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'English' }] },
      ]
    },
    {
      title: language === 'ar' ? 'إعدادات النظام' : 'System Settings',
      icon: Shield,
      items: [
        { key: 'maintenanceMode', label: language === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode', type: 'toggle' },
        { key: 'allowRegistration', label: language === 'ar' ? 'السماح بالتسجيل' : 'Allow Registration', type: 'toggle' },
        { key: 'emailNotifications', label: language === 'ar' ? 'إشعارات البريد' : 'Email Notifications', type: 'toggle' },
      ]
    },
    {
      title: language === 'ar' ? 'إعدادات الملفات' : 'File Settings',
      icon: Database,
      items: [
        { key: 'maxUploadSize', label: language === 'ar' ? 'الحد الأقصى للرفع (MB)' : 'Max Upload Size (MB)', type: 'number' },
      ]
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/leader')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إعدادات المنصة' : 'Platform Settings'}
              </h1>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {language === 'ar' ? 'حفظ' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="space-y-6">
                {section.items.map((item) => (
                  <div key={item.key} className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="sm:w-1/3 text-sm font-medium text-gray-700">
                      {item.label}
                    </label>
                    <div className="sm:w-2/3">
                      {item.type === 'text' || item.type === 'email' || item.type === 'number' ? (
                        <Input
                          type={item.type}
                          value={settings[item.key as keyof PlatformSettings] as string | number}
                          onChange={(e) => setSettings({
                            ...settings,
                            [item.key]: item.type === 'number' ? parseInt(e.target.value) : e.target.value
                          })}
                        />
                      ) : item.type === 'toggle' ? (
                        <button
                          onClick={() => setSettings({
                            ...settings,
                            [item.key]: !settings[item.key as keyof PlatformSettings]
                          })}
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            settings[item.key as keyof PlatformSettings] ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            settings[item.key as keyof PlatformSettings] ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </button>
                      ) : item.type === 'select' ? (
                        <select
                          value={settings[item.key as keyof PlatformSettings] as string}
                          onChange={(e) => setSettings({
                            ...settings,
                            [item.key]: e.target.value
                          })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          {item.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
