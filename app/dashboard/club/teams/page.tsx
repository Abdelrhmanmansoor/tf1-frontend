'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Users, Loader2, X, Trophy } from 'lucide-react'
import Link from 'next/link'
import clubService from '@/services/club'
import type { Team, CreateTeamData } from '@/types/club'

const ClubTeamsPage = () => {
  const { language } = useLanguage()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [formData, setFormData] = useState<CreateTeamData>({
    teamName: '',
    teamNameAr: '',
    sport: '',
    ageCategory: '',
    level: 'amateur',
    gender: 'mixed',
  })

  useEffect(() => {
    fetchTeams()
  }, [sportFilter])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (sportFilter !== 'all') params.sport = sportFilter
      const response = await clubService.getTeams(params)
      setTeams(response.teams)
    } catch (err) {
      console.error('Error fetching teams:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    try {
      setCreating(true)
      await clubService.createTeam(formData)
      await fetchTeams()
      setShowCreateModal(false)
      setFormData({
        teamName: '',
        teamNameAr: '',
        sport: '',
        ageCategory: '',
        level: 'amateur',
        gender: 'mixed',
      })
    } catch (err: any) {
      alert(err.message || 'Failed to create team')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {language === 'ar' ? 'العودة' : 'Back'}
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'ar' ? 'الفرق' : 'Teams'}
              </h1>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'إنشاء فريق' : 'Create Team'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <motion.div
              key={team._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-3 mb-4">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.teamName}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {team.teamName}
                  </h3>
                  <p className="text-sm text-gray-600">{team.sport}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                {team.ageCategory && <div>Age: {team.ageCategory}</div>}
                {team.level && <div>Level: {team.level}</div>}
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {team.players?.length || 0}{' '}
                    {language === 'ar' ? 'لاعب' : 'players'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {teams.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500">
              {language === 'ar' ? 'لا توجد فرق' : 'No teams'}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'ar' ? 'إنشاء فريق' : 'Create Team'}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اسم الفريق' : 'Team Name'} *
                  </label>
                  <Input
                    value={formData.teamName}
                    onChange={(e) =>
                      setFormData({ ...formData, teamName: e.target.value })
                    }
                    placeholder="Team name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الرياضة' : 'Sport'} *
                  </label>
                  <Input
                    value={formData.sport}
                    onChange={(e) =>
                      setFormData({ ...formData, sport: e.target.value })
                    }
                    placeholder="e.g., Football"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المستوى' : 'Level'}
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="amateur">Amateur</option>
                    <option value="semi-professional">Semi-Professional</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={creating}
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleCreateTeam}
                    className="flex-1"
                    disabled={creating || !formData.teamName || !formData.sport}
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {creating
                      ? language === 'ar'
                        ? 'جاري الإنشاء...'
                        : 'Creating...'
                      : language === 'ar'
                        ? 'إنشاء'
                        : 'Create'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClubTeamsPage
