'use client'

import React, { useState, useEffect } from 'react'
import { Alert, TeamStats } from '@/types/age-group-supervisor'
import { ageGroupSupervisorMockService } from '@/services/age-group-supervisor-mock'
import { Bell, Users, Activity, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Overview() {
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [s, a] = await Promise.all([
        ageGroupSupervisorMockService.getStats(),
        ageGroupSupervisorMockService.getAlerts()
      ])
      setStats(s)
      setAlerts(a)
      setLoading(false)
    }
    fetchData()
  }, [])

  const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-4 text-sm">
          {trend > 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(trend)}% from last month
          </span>
        </div>
      )}
    </div>
  )

  if (loading) return <div>Loading dashboard...</div>

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Players" 
          value={stats?.totalPlayers || 0} 
          icon={Users} 
          color="bg-blue-500"
          trend={5}
        />
        <StatCard 
          label="Avg Attendance" 
          value={`${stats?.avgAttendance || 0}%`} 
          icon={Calendar} 
          color="bg-green-500"
          trend={2}
        />
        <StatCard 
          label="Active Injuries" 
          value={stats?.injuredCount || 0} 
          icon={Activity} 
          color="bg-red-500"
          trend={-10} // Negative is good for injuries? Logic depends, but let's assume red is warning
        />
        <StatCard 
          label="Upcoming Matches" 
          value={stats?.upcomingMatches || 0} 
          icon={Bell} 
          color="bg-purple-500"
        />
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-500" />
          Early Warning System
        </h2>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <motion.div 
              key={alert.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`p-4 rounded-lg border-l-4 flex items-start justify-between ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}
            >
              <div>
                <h4 className={`font-semibold ${
                   alert.severity === 'critical' ? 'text-red-800' :
                   alert.severity === 'warning' ? 'text-yellow-800' :
                   'text-blue-800'
                }`}>
                  {alert.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
              <span className="text-xs text-gray-500">{alert.date}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
