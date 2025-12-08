'use client'

import DashboardLayout from '@/components/matches-dashboard/DashboardLayout'
import { motion } from 'framer-motion'
import { Settings, Bell, Lock, Globe, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
          <p className="text-gray-600">إدارة إعدادات حسابك</p>
        </motion.div>

        <div className="space-y-6">
          {/* Notifications Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">الإشعارات</h2>
                <p className="text-sm text-gray-600">إدارة تفضيلات الإشعارات</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">إشعارات المباريات</p>
                  <p className="text-sm text-gray-600">
                    تلقي إشعارات عند إنشاء مباريات جديدة
                  </p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">إشعارات الفرق</p>
                  <p className="text-sm text-gray-600">
                    تلقي إشعارات عند إضافتك لفريق
                  </p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">إشعارات الشات</p>
                  <p className="text-sm text-gray-600">
                    تلقي إشعارات عند تلقي رسائل جديدة
                  </p>
                </div>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">الخصوصية</h2>
                <p className="text-sm text-gray-600">
                  إدارة إعدادات الخصوصية والأمان
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                تغيير كلمة المرور
              </Button>
              <Button variant="outline" className="w-full justify-start">
                إدارة الجلسات النشطة
              </Button>
            </div>
          </motion.div>

          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">اللغة</h2>
                <p className="text-sm text-gray-600">اختر لغة الواجهة</p>
              </div>
            </div>

            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </motion.div>

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Palette className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">المظهر</h2>
                <p className="text-sm text-gray-600">اختر مظهر الواجهة</p>
              </div>
            </div>

            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="light">فاتح</option>
              <option value="dark">داكن</option>
              <option value="auto">تلقائي</option>
            </select>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
              حفظ التغييرات
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
