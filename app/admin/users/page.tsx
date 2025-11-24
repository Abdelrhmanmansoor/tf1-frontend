'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import adminService from '@/services/admin'
import type { AdminUser } from '@/services/admin'
import { Button } from '@/components/ui/button'
import { Lock, Unlock } from 'lucide-react'

export default function AdminUsers() {
  const { language } = useLanguage()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [blockReason, setBlockReason] = useState('')
  const [showBlockModal, setShowBlockModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBlockUser = async () => {
    if (!selectedUser) return

    try {
      await adminService.blockUser(selectedUser._id, blockReason)
      loadUsers()
      setShowBlockModal(false)
      setBlockReason('')
      setSelectedUser(null)
    } catch (error) {
      console.error('Error blocking user:', error)
    }
  }

  const handleUnblockUser = async (userId: string) => {
    try {
      await adminService.unblockUser(userId)
      loadUsers()
    } catch (error) {
      console.error('Error unblocking user:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'ar' ? 'إدارة المستخدمين' : 'Users Management'}
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الدور' : 'Role'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.blocked ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        {language === 'ar' ? 'محجوب' : 'Blocked'}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {user.blocked ? (
                      <Button
                        size="sm"
                        onClick={() => handleUnblockUser(user._id)}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                      >
                        <Unlock className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowBlockModal(true)
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white gap-2"
                      >
                        <Lock className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Modal */}
      {showBlockModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {language === 'ar' ? 'حجب المستخدم' : 'Block User'}
            </h2>

            <p className="text-gray-600 mb-4">
              {language === 'ar'
                ? `هل تريد حجب ${selectedUser.email}؟`
                : `Are you sure you want to block ${selectedUser.email}?`}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'السبب' : 'Reason'}
              </label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل سبب الحجب...' : 'Enter reason...'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleBlockUser}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
              >
                {language === 'ar' ? 'حجب' : 'Block'}
              </Button>
              <Button
                onClick={() => {
                  setShowBlockModal(false)
                  setBlockReason('')
                  setSelectedUser(null)
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
