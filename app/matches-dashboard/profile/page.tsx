'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import { matchesGetMe } from '@/services/matches'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await matchesGetMe()
        setUser(data)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            الملف الشخصي
          </h1>
          <p className="text-gray-600">معلوماتك الشخصية</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-8"
        >
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center text-white text-3xl font-bold">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              {user?.isEmailVerified && (
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    البريد الإلكتروني موثق
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">الاسم الكامل</p>
                <p className="font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">معرف المستخدم</p>
                <p className="font-medium text-gray-900 font-mono text-sm">
                  {user?.id}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
