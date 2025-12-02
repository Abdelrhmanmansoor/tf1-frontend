'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Edit,
  Save,
  Loader2,
  Camera,
  Shield,
  Calendar,
  MapPin
} from 'lucide-react'

function ProfileContent() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    department: '',
    joinedAt: ''
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
              </h1>
            </div>
            {!editing ? (
              <Button onClick={() => setEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditing(false)}>
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-green-600 text-white">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-600 to-cyan-600 h-32 relative">
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
              <div className="inline-flex items-center gap-2 mt-2 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <Shield className="w-4 h-4" />
                {language === 'ar' ? 'مشرف الفئات السنية' : 'Age Group Supervisor'}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                  </label>
                  {editing ? (
                    <Input
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.firstName || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                  </label>
                  {editing ? (
                    <Input
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.lastName || '-'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <p className="text-gray-900 py-2">{profile.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                {editing ? (
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+966 50 000 0000"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.phone || (language === 'ar' ? 'لم يتم الإضافة' : 'Not added')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'نبذة شخصية' : 'Bio'}
                </label>
                {editing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg resize-none h-24"
                    placeholder={language === 'ar' ? 'اكتب نبذة عنك...' : 'Write about yourself...'}
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile.bio || (language === 'ar' ? 'لم يتم الإضافة' : 'Not added')}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <ProfileContent />
    </ProtectedRoute>
  )
}
