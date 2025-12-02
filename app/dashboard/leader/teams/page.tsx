'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { DEFAULT_PERMISSIONS, TeamMember } from '@/types/rbac'
import {
  ArrowLeft,
  Plus,
  Loader2,
  UserPlus,
  Shield,
  Mail,
  Phone,
  Key,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  X,
  Copy,
  RefreshCw
} from 'lucide-react'

export default function TeamsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    permissions: [] as string[]
  })

  useEffect(() => {
    if (user?.role !== 'leader') {
      router.push('/dashboard/leader/fallback')
      return
    }
    fetchTeamMembers()
  }, [user, router])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/leader/teams`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.ok) {
        const result = await response.json()
        setTeamMembers(result.data?.members || [])
      } else {
        setTeamMembers([])
      }
    } catch (error) {
      console.error('Error fetching team:', error)
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }

  const generateAccessKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let key = 'TF1-'
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) key += '-'
      key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return key
  }

  const handleAddMember = async () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.email) {
      toast.error(language === 'ar' ? 'يرجى ملء البيانات المطلوبة' : 'Please fill required fields')
      return
    }

    try {
      setSaving(true)
      const accessKey = generateAccessKey()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/leader/teams`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...newMember,
            accessKey,
            role: 'team',
            status: 'active'
          })
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تم إضافة العضو بنجاح' : 'Member added successfully')
        navigator.clipboard.writeText(accessKey)
        toast.info(language === 'ar' ? 'تم نسخ مفتاح الوصول' : 'Access key copied to clipboard')
        setShowAddModal(false)
        setNewMember({ firstName: '', lastName: '', email: '', phone: '', permissions: [] })
        fetchTeamMembers()
      } else if (response.status === 404) {
        toast.info(language === 'ar' ? 'الخدمة قيد التطوير' : 'Service under development')
      } else {
        toast.error(language === 'ar' ? 'حدث خطأ' : 'An error occurred')
      }
    } catch (error) {
      console.error('Error adding member:', error)
      toast.info(language === 'ar' ? 'الخدمة قيد التطوير' : 'Service under development')
    } finally {
      setSaving(false)
    }
  }

  const handleEditPermissions = (member: TeamMember) => {
    setEditingMember(member)
    setShowEditModal(true)
  }

  const handleSavePermissions = async () => {
    if (!editingMember) return

    try {
      setSaving(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://tf1-backend.onrender.com/api/v1'}/leader/teams/${editingMember.id}/permissions`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ permissions: editingMember.permissions })
        }
      )

      if (response.ok) {
        toast.success(language === 'ar' ? 'تم تحديث الصلاحيات' : 'Permissions updated')
        setShowEditModal(false)
        setEditingMember(null)
        fetchTeamMembers()
      } else {
        toast.info(language === 'ar' ? 'الخدمة قيد التطوير' : 'Service under development')
      }
    } catch (error) {
      toast.info(language === 'ar' ? 'الخدمة قيد التطوير' : 'Service under development')
    } finally {
      setSaving(false)
    }
  }

  const togglePermission = (permissionId: string) => {
    if (!editingMember) return
    
    const newPermissions = editingMember.permissions.includes(permissionId)
      ? editingMember.permissions.filter(p => p !== permissionId)
      : [...editingMember.permissions, permissionId]
    
    setEditingMember({ ...editingMember, permissions: newPermissions })
  }

  const toggleNewMemberPermission = (permissionId: string) => {
    const newPermissions = newMember.permissions.includes(permissionId)
      ? newMember.permissions.filter(p => p !== permissionId)
      : [...newMember.permissions, permissionId]
    
    setNewMember({ ...newMember, permissions: newPermissions })
  }

  const permissionGroups = Object.entries(DEFAULT_PERMISSIONS).reduce((acc, [key, perm]) => {
    if (!acc[perm.module]) acc[perm.module] = []
    acc[perm.module].push(perm)
    return acc
  }, {} as Record<string, typeof DEFAULT_PERMISSIONS[keyof typeof DEFAULT_PERMISSIONS][]>)

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
                {language === 'ar' ? 'إدارة الفريق' : 'Team Management'}
              </h1>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة عضو' : 'Add Member'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : teamMembers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا يوجد أعضاء فريق' : 'No Team Members'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'ar' ? 'ابدأ بإضافة أعضاء الفريق' : 'Start by adding team members'}
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-indigo-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة عضو' : 'Add Member'}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{member.firstName} {member.lastName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-3 h-3" /> {member.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {member.status === 'active' 
                        ? (language === 'ar' ? 'نشط' : 'Active')
                        : (language === 'ar' ? 'غير نشط' : 'Inactive')
                      }
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handleEditPermissions(member)}>
                      <Shield className="w-4 h-4 mr-1" />
                      {language === 'ar' ? 'الصلاحيات' : 'Permissions'}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Key className="w-4 h-4" />
                    <code className="bg-gray-100 px-2 py-0.5 rounded">{member.accessKey}</code>
                    <button onClick={() => { navigator.clipboard.writeText(member.accessKey); toast.success('Copied!') }}>
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {member.permissions.length} {language === 'ar' ? 'صلاحية' : 'permissions'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{language === 'ar' ? 'إضافة عضو جديد' : 'Add New Member'}</h2>
              <button onClick={() => setShowAddModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">{language === 'ar' ? 'الاسم الأول' : 'First Name'} *</label>
                <Input value={newMember.firstName} onChange={e => setNewMember({...newMember, firstName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{language === 'ar' ? 'الاسم الأخير' : 'Last Name'} *</label>
                <Input value={newMember.lastName} onChange={e => setNewMember({...newMember, lastName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{language === 'ar' ? 'البريد' : 'Email'} *</label>
                <Input type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{language === 'ar' ? 'الهاتف' : 'Phone'}</label>
                <Input value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">{language === 'ar' ? 'الصلاحيات' : 'Permissions'}</h3>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4 space-y-4">
                {Object.entries(permissionGroups).map(([module, perms]) => (
                  <div key={module}>
                    <h4 className="font-medium text-gray-700 mb-2 capitalize">{module}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {perms.map(perm => (
                        <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newMember.permissions.includes(perm.id)}
                            onChange={() => toggleNewMemberPermission(perm.id)}
                            className="rounded text-indigo-600"
                          />
                          <span className="text-sm">{language === 'ar' ? perm.nameAr : perm.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleAddMember} disabled={saving} className="flex-1 bg-indigo-600 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إضافة' : 'Add')}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {language === 'ar' ? 'صلاحيات' : 'Permissions for'} {editingMember.firstName}
              </h2>
              <button onClick={() => { setShowEditModal(false); setEditingMember(null) }}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-lg p-4 space-y-4 mb-6">
              {Object.entries(permissionGroups).map(([module, perms]) => (
                <div key={module}>
                  <h4 className="font-medium text-gray-700 mb-2 capitalize">{module}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {perms.map(perm => (
                      <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingMember.permissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-sm">{language === 'ar' ? perm.nameAr : perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowEditModal(false); setEditingMember(null) }} className="flex-1">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button onClick={handleSavePermissions} disabled={saving} className="flex-1 bg-indigo-600 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'حفظ' : 'Save')}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
