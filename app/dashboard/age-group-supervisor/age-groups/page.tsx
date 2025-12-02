'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProtectedRoute from '@/components/ProtectedRoute'
import ageGroupSupervisorService from '@/services/age-group-supervisor'
import {
  ArrowRight,
  Plus,
  Search,
  Users,
  Edit,
  Trash2,
  Loader2,
  Layers,
  CheckCircle,
  XCircle,
  ArrowLeft,
  GraduationCap,
  Calendar,
  X
} from 'lucide-react'
import Link from 'next/link'

interface AgeGroup {
  id: string
  name: string
  nameAr: string
  ageRange: { min: number; max: number }
  playersCount: number
  coachName: string
  status: 'active' | 'inactive'
}

function AgeGroupsContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: '',
    nameAr: '',
    minAge: 6,
    maxAge: 8
  })

  useEffect(() => {
    fetchAgeGroups()
  }, [])

  const fetchAgeGroups = async () => {
    try {
      setLoading(true)
      const groups = await ageGroupSupervisorService.getAgeGroups()
      setAgeGroups(groups)
    } catch (error) {
      console.error('Error fetching age groups:', error)
      setAgeGroups([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddGroup = async () => {
    if (!newGroup.name || !newGroup.nameAr) return
    
    try {
      setSaving(true)
      await ageGroupSupervisorService.createAgeGroup({
        name: newGroup.name,
        nameAr: newGroup.nameAr,
        ageRange: { min: newGroup.minAge, max: newGroup.maxAge },
        status: 'active',
        playersCount: 0,
        coachId: '',
        coachName: ''
      })
      setShowAddModal(false)
      setNewGroup({ name: '', nameAr: '', minAge: 6, maxAge: 8 })
      fetchAgeGroups()
    } catch (error) {
      console.error('Error creating age group:', error)
    } finally {
      setSaving(false)
    }
  }

  const filteredGroups = ageGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.nameAr.includes(searchTerm)
  )

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
                {language === 'ar' ? 'إدارة الفئات السنية' : 'Age Groups Management'}
              </h1>
            </div>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-600 to-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة فئة' : 'Add Group'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={language === 'ar' ? 'بحث عن فئة...' : 'Search groups...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : filteredGroups.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد فئات سنية' : 'No Age Groups Found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'ar' ? 'ابدأ بإضافة فئة سنية جديدة' : 'Start by adding a new age group'}
            </p>
            <Button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إضافة فئة' : 'Add Group'}
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    group.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {group.status === 'active' 
                      ? (language === 'ar' ? 'نشط' : 'Active')
                      : (language === 'ar' ? 'غير نشط' : 'Inactive')
                    }
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {language === 'ar' ? group.nameAr : group.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {language === 'ar' ? `الأعمار: ${group.ageRange.min}-${group.ageRange.max} سنة` : `Ages: ${group.ageRange.min}-${group.ageRange.max} years`}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{group.playersCount} {language === 'ar' ? 'لاعب' : 'players'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{group.coachName || (language === 'ar' ? 'لم يُعين مدرب' : 'No coach assigned')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    {language === 'ar' ? 'تعديل' : 'Edit'}
                  </Button>
                  <Link href={`/dashboard/age-group-supervisor/players?group=${group.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="w-4 h-4 mr-1" />
                      {language === 'ar' ? 'اللاعبين' : 'Players'}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'ar' ? 'إضافة فئة سنية جديدة' : 'Add New Age Group'}
              </h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'}
                </label>
                <Input
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="Under 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'}
                </label>
                <Input
                  value={newGroup.nameAr}
                  onChange={(e) => setNewGroup({ ...newGroup, nameAr: e.target.value })}
                  placeholder="تحت 10 سنوات"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الحد الأدنى للعمر' : 'Min Age'}
                  </label>
                  <Input
                    type="number"
                    value={newGroup.minAge}
                    onChange={(e) => setNewGroup({ ...newGroup, minAge: parseInt(e.target.value) })}
                    min={4}
                    max={20}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'الحد الأقصى للعمر' : 'Max Age'}
                  </label>
                  <Input
                    type="number"
                    value={newGroup.maxAge}
                    onChange={(e) => setNewGroup({ ...newGroup, maxAge: parseInt(e.target.value) })}
                    min={4}
                    max={20}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleAddGroup} 
                disabled={saving || !newGroup.name || !newGroup.nameAr}
                className="flex-1 bg-green-600 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'إضافة' : 'Add')}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function AgeGroupsPage() {
  return (
    <ProtectedRoute allowedRoles={['age-group-supervisor']}>
      <AgeGroupsContent />
    </ProtectedRoute>
  )
}
