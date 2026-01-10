'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAdminSettings, useUpdateSettings, useTestEmailSettings } from '@/hooks/use-admin'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Palette,
  Save,
  RefreshCw,
  Check,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  AlertTriangle,
  Info,
} from 'lucide-react'
import type { AdminSettings } from '@/services/admin.service'

// Zod schema for settings
const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().optional(),
  maintenanceMode: z.boolean(),
  allowRegistration: z.boolean(),
  emailNotifications: z.boolean(),
  defaultLanguage: z.enum(['ar', 'en']),
  defaultTheme: z.enum(['light', 'dark', 'system']),
  maxUploadSize: z.number().min(1).max(100),
  allowedFileTypes: z.array(z.string()),
})

type SettingsFormData = z.infer<typeof settingsSchema>

// Toggle Switch Component
function Toggle({ 
  checked, 
  onChange, 
  disabled 
}: { 
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-muted",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
}

export function SettingsPage() {
  const { language } = useLanguage()
  const isRTL = language === 'ar'

  const [activeTab, setActiveTab] = useState('general')

  // Queries & Mutations
  const { data: settings, isLoading, refetch } = useAdminSettings()
  const updateSettings = useUpdateSettings()
  const testEmail = useTestEmailSettings()

  // Mock settings
  const mockSettings: AdminSettings = {
    siteName: 'TF1 Jobs',
    siteDescription: 'منصة التوظيف الرياضية الرائدة في السعودية',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    defaultLanguage: 'ar',
    defaultTheme: 'light',
    maxUploadSize: 10,
    allowedFileTypes: ['jpg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    smtpSettings: {
      host: 'smtp.example.com',
      port: 587,
      secure: true,
      user: 'noreply@tf1jobs.com',
    },
    socialLinks: {
      facebook: 'https://facebook.com/tf1jobs',
      twitter: 'https://twitter.com/tf1jobs',
      instagram: 'https://instagram.com/tf1jobs',
      linkedin: 'https://linkedin.com/company/tf1jobs',
    },
  }

  const currentSettings = settings || mockSettings

  // Form state
  const [formData, setFormData] = useState<Partial<AdminSettings>>(currentSettings)

  const handleSave = () => {
    updateSettings.mutate(formData)
  }

  const tabs = [
    { id: 'general', label: isRTL ? 'عام' : 'General', icon: Settings },
    { id: 'appearance', label: isRTL ? 'المظهر' : 'Appearance', icon: Palette },
    { id: 'notifications', label: isRTL ? 'الإشعارات' : 'Notifications', icon: Bell },
    { id: 'security', label: isRTL ? 'الأمان' : 'Security', icon: Shield },
    { id: 'email', label: isRTL ? 'البريد' : 'Email', icon: Mail },
    { id: 'social', label: isRTL ? 'التواصل' : 'Social', icon: Globe },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-6 lg:grid-cols-4">
          <Skeleton className="h-12 lg:col-span-1" />
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRTL ? 'الإعدادات' : 'Settings'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL 
              ? 'إدارة إعدادات المنصة والتخصيصات'
              : 'Manage platform settings and preferences'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 me-2" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            <Save className="h-4 w-4 me-2" />
            {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Maintenance Mode Warning */}
      {formData.maintenanceMode && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              {isRTL ? 'وضع الصيانة مفعّل' : 'Maintenance Mode is Enabled'}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {isRTL 
                ? 'المنصة غير متاحة للمستخدمين حالياً'
                : 'The platform is currently unavailable to users'
              }
            </p>
          </div>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    activeTab === tab.id 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'معلومات الموقع' : 'Site Information'}</CardTitle>
                  <CardDescription>
                    {isRTL ? 'الإعدادات الأساسية للمنصة' : 'Basic platform settings'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isRTL ? 'اسم الموقع' : 'Site Name'}
                    </label>
                    <Input
                      value={formData.siteName}
                      onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isRTL ? 'وصف الموقع' : 'Site Description'}
                    </label>
                    <Textarea
                      value={formData.siteDescription}
                      onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isRTL ? 'اللغة الافتراضية' : 'Default Language'}
                    </label>
                    <Select 
                      value={formData.defaultLanguage} 
                      onValueChange={(value: 'ar' | 'en') => setFormData({ ...formData, defaultLanguage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'التسجيل والوصول' : 'Registration & Access'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{isRTL ? 'السماح بالتسجيل' : 'Allow Registration'}</p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'السماح للمستخدمين الجدد بإنشاء حسابات' : 'Allow new users to create accounts'}
                      </p>
                    </div>
                    <Toggle
                      checked={formData.allowRegistration ?? true}
                      onChange={(checked) => setFormData({ ...formData, allowRegistration: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{isRTL ? 'وضع الصيانة' : 'Maintenance Mode'}</p>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? 'تعطيل الموقع مؤقتاً للصيانة' : 'Temporarily disable the site for maintenance'}
                      </p>
                    </div>
                    <Toggle
                      checked={formData.maintenanceMode ?? false}
                      onChange={(checked) => setFormData({ ...formData, maintenanceMode: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'المظهر والتصميم' : 'Appearance & Theme'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'تخصيص مظهر المنصة' : 'Customize the platform appearance'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRTL ? 'المظهر الافتراضي' : 'Default Theme'}
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['light', 'dark', 'system'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setFormData({ ...formData, defaultTheme: theme })}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all",
                          formData.defaultTheme === theme 
                            ? "border-primary bg-primary/5" 
                            : "border-muted hover:border-muted-foreground/50"
                        )}
                      >
                        <div className={cn(
                          "h-12 w-full rounded-md mb-2",
                          theme === 'light' ? "bg-white border" : 
                          theme === 'dark' ? "bg-gray-900" : 
                          "bg-gradient-to-r from-white to-gray-900"
                        )} />
                        <p className="text-sm font-medium capitalize">
                          {theme === 'light' ? (isRTL ? 'فاتح' : 'Light') :
                           theme === 'dark' ? (isRTL ? 'داكن' : 'Dark') :
                           (isRTL ? 'تلقائي' : 'System')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'إعدادات الإشعارات' : 'Notification Settings'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{isRTL ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}</p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'إرسال إشعارات عبر البريد الإلكتروني' : 'Send notifications via email'}
                    </p>
                  </div>
                  <Toggle
                    checked={formData.emailNotifications ?? true}
                    onChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'إعدادات الأمان' : 'Security Settings'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRTL ? 'الحد الأقصى لحجم الملف (MB)' : 'Max Upload Size (MB)'}
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.maxUploadSize}
                    onChange={(e) => setFormData({ ...formData, maxUploadSize: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRTL ? 'أنواع الملفات المسموحة' : 'Allowed File Types'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.allowedFileTypes?.map((type) => (
                      <Badge key={type} variant="secondary" className="gap-1">
                        {type}
                        <button 
                          onClick={() => setFormData({
                            ...formData,
                            allowedFileTypes: formData.allowedFileTypes?.filter(t => t !== type)
                          })}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'إعدادات البريد الإلكتروني' : 'Email Settings'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'إعدادات خادم SMTP للبريد الصادر' : 'SMTP server settings for outgoing mail'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isRTL ? 'خادم SMTP' : 'SMTP Host'}
                    </label>
                    <Input
                      value={currentSettings.smtpSettings?.host}
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isRTL ? 'المنفذ' : 'Port'}
                    </label>
                    <Input
                      type="number"
                      value={currentSettings.smtpSettings?.port}
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRTL ? 'اسم المستخدم' : 'Username'}
                  </label>
                  <Input
                    value={currentSettings.smtpSettings?.user}
                    placeholder="noreply@example.com"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => testEmail.mutate()}
                  disabled={testEmail.isPending}
                >
                  <Mail className="h-4 w-4 me-2" />
                  {isRTL ? 'إرسال بريد تجريبي' : 'Send Test Email'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Social Links Settings */}
          {activeTab === 'social' && (
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'روابط التواصل الاجتماعي' : 'Social Media Links'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Facebook className="h-4 w-4" /> Facebook
                  </label>
                  <Input
                    value={currentSettings.socialLinks?.facebook}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Twitter className="h-4 w-4" /> Twitter
                  </label>
                  <Input
                    value={currentSettings.socialLinks?.twitter}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Instagram className="h-4 w-4" /> Instagram
                  </label>
                  <Input
                    value={currentSettings.socialLinks?.instagram}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </label>
                  <Input
                    value={currentSettings.socialLinks?.linkedin}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
