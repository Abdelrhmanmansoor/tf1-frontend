'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Users, Settings, Activity, BarChart3, Edit2, Trash2 } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalClubs: number
  totalJobs: number
  activeUsers: number
}

interface AdminUser {
  _id: string
  email: string
  name: string
  role: string
  blocked: boolean
}

export default function AdminDashboard() {
  const { language } = useLanguage()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'settings'>('stats')
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    siteName: 'TF1 Sports',
    primaryColor: '#3B82F6',
    secondaryColor: '#A855F7',
    maintenanceMode: false,
  })
  const [blockReason, setBlockReason] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Try to fetch stats
      const statsRes = await axios.get('/api/v1/admin/dashboard', {
        baseURL: 'https://tf1-backend.onrender.com',
      }).catch(() => null)
      
      if (statsRes?.data) {
        setStats(statsRes.data.stats)
      } else {
        // Demo data if backend not available
        setStats({
          totalUsers: 1250,
          totalClubs: 42,
          totalJobs: 567,
          activeUsers: 348,
        })
      }

      // Try to fetch users
      const usersRes = await axios.get('/api/v1/admin/users', {
        baseURL: 'https://tf1-backend.onrender.com',
      }).catch(() => null)
      
      if (usersRes?.data) {
        setUsers(usersRes.data.users)
      } else {
        // Demo data if backend not available
        setUsers([
          {
            _id: '1',
            email: 'player@example.com',
            name: 'Ahmed Player',
            role: 'player',
            blocked: false,
          },
          {
            _id: '2',
            email: 'coach@example.com',
            name: 'Sara Coach',
            role: 'coach',
            blocked: false,
          },
        ])
      }
    } catch (error) {
      console.log('Backend not ready yet - using demo data')
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUser = async (userId: string) => {
    try {
      await axios.patch(`/api/v1/admin/users/${userId}/block`, {
        reason: blockReason,
      }, {
        baseURL: 'https://tf1-backend.onrender.com',
      })
      loadData()
      setBlockReason('')
      setSelectedUser(null)
    } catch (error) {
      alert('Error blocking user')
    }
  }

  const handleUpdateSettings = async () => {
    try {
      await axios.patch('/api/v1/admin/settings', settings, {
        baseURL: 'https://tf1-backend.onrender.com',
      })
      alert(language === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully')
    } catch (error) {
      alert('Error updating settings')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar activeMode="application" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Backend Status Alert */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            ⚠️ {language === 'ar' ? 'الخادم قيد الإعداد - تستخدم بيانات تجريبية' : 'Backend is being configured - using demo data. Contact backend team to activate.'}
          </p>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {language === 'ar' ? '🎛️ لوحة التحكم' : '🎛️ Admin Dashboard'}
          </h1>
          <p className="text-gray-600">
            {language === 'ar' ? 'إدارة الموقع والمستخدمين والإعدادات' : 'Manage site, users, and settings'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            {language === 'ar' ? 'الإحصائيات' : 'Stats'}
          </Button>

          <Button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5" />
            {language === 'ar' ? 'المستخدمون' : 'Users'}
          </Button>

          <Button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <Settings className="w-5 h-5" />
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </Button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</p>
                  <p className="text-3xl font-bold mt-2 text-blue-600">{stats?.totalUsers || 0}</p>
                </div>
                <Users className="w-10 h-10 text-blue-200" />
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'إجمالي الأندية' : 'Total Clubs'}</p>
                  <p className="text-3xl font-bold mt-2 text-purple-600">{stats?.totalClubs || 0}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-purple-200" />
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'إجمالي الوظائف' : 'Total Jobs'}</p>
                  <p className="text-3xl font-bold mt-2 text-green-600">{stats?.totalJobs || 0}</p>
                </div>
                <Activity className="w-10 h-10 text-green-200" />
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? 'المستخدمون النشطون' : 'Active Users'}</p>
                  <p className="text-3xl font-bold mt-2 text-orange-600">{stats?.activeUsers || 0}</p>
                </div>
                <Activity className="w-10 h-10 text-orange-200" />
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">{language === 'ar' ? 'البريد' : 'Email'}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">{language === 'ar' ? 'الاسم' : 'Name'}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">{language === 'ar' ? 'الدور' : 'Role'}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                        {language === 'ar' ? 'لا يوجد مستخدمون' : 'No users'}
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{user.email}</td>
                        <td className="px-6 py-4 text-sm">{user.name}</td>
                        <td className="px-6 py-4 text-sm font-medium">{user.role}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.blocked
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.blocked ? (language === 'ar' ? 'محجوب' : 'Blocked') : (language === 'ar' ? 'نشط' : 'Active')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Button
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {user.blocked ? 'فتح' : 'حجب'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم الموقع' : 'Site Name'}
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'ar' ? 'اللون الأساسي' : 'Primary Color'}
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="h-12 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'ar' ? 'اللون الثانوي' : 'Secondary Color'}
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="h-12 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-semibold text-gray-700">
                    {language === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode'}
                  </span>
                </label>
              </div>

              <Button
                onClick={handleUpdateSettings}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                {language === 'ar' ? '💾 حفظ الإعدادات' : '💾 Save Settings'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Block User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {language === 'ar' ? 'حجب المستخدم' : 'Block User'}
            </h2>
            <p className="text-gray-600 mb-4">
              {language === 'ar' ? `حجب ${selectedUser.email}؟` : `Block ${selectedUser.email}?`}
            </p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder={language === 'ar' ? 'السبب...' : 'Reason...'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              rows={3}
            />
            <div className="flex gap-4">
              <Button
                onClick={() => handleBlockUser(selectedUser._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
              >
                {language === 'ar' ? 'حجب' : 'Block'}
              </Button>
              <Button
                onClick={() => {
                  setSelectedUser(null)
                  setBlockReason('')
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
