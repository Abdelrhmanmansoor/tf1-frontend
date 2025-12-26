'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSelector } from '@/components/language-selector'
import { MessageNotificationBadge } from '@/components/messaging/MessageNotificationBadge'
import { GlobalSearchButton } from '@/components/search/GlobalSearchButton'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Users, LogOut, LayoutDashboard, Calendar, Activity, ClipboardList, Stethoscope, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Sub-components
import Overview from './age-group-supervisor/Overview'
import SquadManagement from './age-group-supervisor/SquadManagement'
import TrainingPlanner from './age-group-supervisor/TrainingPlanner'
import PerformanceScouting from './age-group-supervisor/PerformanceScouting'
import MedicalUnit from './age-group-supervisor/MedicalUnit'
import Reports from './age-group-supervisor/Reports'

export default function AgeGroupSupervisorDashboard() {
  const { language } = useLanguage()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const displayName = user?.firstName || (language === 'ar' ? 'مشرف الفئات السنية' : 'Age Group Supervisor')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'squad', label: 'Squad Management', icon: Users },
    { id: 'training', label: 'Training Planner', icon: Calendar },
    { id: 'performance', label: 'Performance & Scouting', icon: ClipboardList },
    { id: 'medical', label: 'Medical Unit', icon: Stethoscope },
    { id: 'reports', label: 'Edu & Behavior', icon: FileText },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />
      case 'squad': return <SquadManagement />
      case 'training': return <TrainingPlanner />
      case 'performance': return <PerformanceScouting />
      case 'medical': return <MedicalUnit />
      case 'reports': return <Reports />
      default: return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
                  TF1
                </span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <span className="text-gray-600 font-medium hidden sm:block">
                {language === 'ar' ? 'مشرف الفئات السنية' : 'Age Group Supervisor'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <GlobalSearchButton />
              <MessageNotificationBadge dashboardType="age-group-supervisor" />
              <LanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout()
                  router.push('/login')
                }}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? `مرحباً، ${displayName}` : `Welcome, ${displayName}`}
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your youth sector efficiently with the comprehensive dashboard.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[500px]">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
