'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { matchesGetMe, uploadProfilePicture, updateProfile } from '@/services/matches'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Camera, Save, Loader2, Upload } from 'lucide-react'
import type { MatchesUser } from '@/types/match'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<MatchesUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await matchesGetMe()
        setUser(userData)
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
        })
        if (userData.profilePicture) {
          setPreview(userData.profilePicture)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('فشل تحميل الملف الشخصي')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('الرجاء اختيار ملف صورة صالح (JPG, PNG, GIF)')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الملف يجب أن يكون أقل من 5 ميجابايت')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploading(true)
    try {
      const result = await uploadProfilePicture(file)
      if (result.success) {
        setUser((prev) => prev ? { ...prev, profilePicture: result.profilePicture } : null)
        toast.success('تم رفع الصورة الشخصية بنجاح!')
      } else {
        throw new Error('فشل رفع الصورة')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || error.message || 'فشل رفع الصورة. يرجى المحاولة مرة أخرى.')
      setPreview(user?.profilePicture || null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        setUser(result.user)
        toast.success('تم حفظ التغييرات بنجاح!')
      } else {
        throw new Error('فشل تحديث الملف الشخصي')
      }
    } catch (error: any) {
      console.error('Update error:', error)
      toast.error(error.response?.data?.message || error.message || 'فشل تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/matches/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            ← رجوع للوحة التحكم
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            الملف الشخصي
          </h1>
          <p className="text-gray-600">
            إدارة معلوماتك الشخصية وصورة الملف الشخصي
          </p>
        </motion.div>

        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            الصورة الشخصية
          </h2>

          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Profile Picture"
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {(user?.firstName?.[0] || user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                  {(user?.lastName?.[0] || '').toUpperCase()}
                </div>
              )}

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 rounded-full p-3 cursor-pointer transition-all shadow-lg ${
                  uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
                }`}
                title="اضغط لرفع صورة شخصية"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </div>

            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={uploading}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'جاري الرفع...' : 'رفع صورة جديدة'}
              </Button>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  الصور الموصى بها: JPG, PNG, GIF, WebP
                </p>
                <p className="text-xs text-gray-500">
                  الحجم الأقصى: 5 ميجابايت
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            المعلومات الشخصية
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الأول
                </label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="أدخل الاسم الأول"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العائلة
                </label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="أدخل اسم العائلة"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                لا يمكن تغيير البريد الإلكتروني
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="أدخل رقم الهاتف"
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/matches/dashboard')}
                className="gap-2"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={saving || uploading}
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 gap-2 min-w-[140px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}


