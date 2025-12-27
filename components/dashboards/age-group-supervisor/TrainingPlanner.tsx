'use client'

import React, { useState, useEffect } from 'react'
import { TrainingSession } from '@/types/age-group-supervisor'
import { ageGroupSupervisorMockService } from '@/services/age-group-supervisor-mock'
import { Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TrainingPlanner() {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await ageGroupSupervisorMockService.getTrainingSessions()
      setSessions(data)
      setLoading(false)
    }
    fetchSessions()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Training Planner</h2>
          <p className="text-sm text-gray-500">Monitor and manage training schedules</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          + New Session
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div>Loading schedule...</div>
        ) : (
          sessions.map((session) => (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 hover:border-green-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-3 w-16 text-center">
                    <span className="text-xs text-gray-500 uppercase">{new Date(session.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-bold text-gray-800">{new Date(session.date).getDate()}</span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {session.focus}
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        session.type === 'tactical' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                        session.type === 'physical' ? 'border-red-200 bg-red-50 text-red-700' :
                        'border-gray-200 bg-gray-50 text-gray-700'
                      }`}>
                        {session.type}
                      </span>
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 16:00 - 18:00
                      </span>
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" /> {session.coachName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    session.status === 'completed' ? 'text-green-600' : 
                    session.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {session.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </div>
                  {session.status === 'completed' && (
                    <span className="text-xs text-gray-400">
                      Attendance: {session.attendanceCount} players
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
