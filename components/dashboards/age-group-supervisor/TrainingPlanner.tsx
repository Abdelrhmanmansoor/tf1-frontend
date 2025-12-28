'use client'

import React, { useState, useEffect } from 'react'
import { TrainingSession } from '@/types/age-group-supervisor'
import ageGroupSupervisorService from '@/services/age-group-supervisor'
import { Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TrainingPlanner() {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newSession, setNewSession] = useState({
    ageGroupId: '',
    date: '',
    time: '',
    duration: 90,
    location: '',
    status: 'scheduled',
  })

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await ageGroupSupervisorService.getTrainingSchedule()
      const mapped: TrainingSession[] = (data || []).map((s: any) => ({
        id: s.id || s._id || '',
        date: s.date || '',
        type: s.type || 'technical',
        focus: s.focus || s.ageGroupName || '',
        coachId: s.coachId || '',
        coachName: s.coachName || '',
        attendanceCount: s.attendanceCount || 0,
        status: (s.status as any) || 'planned',
        notes: s.notes || '',
      }))
      setSessions(mapped)
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
        <button
          onClick={() => setCreating(!creating)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          {creating ? 'Cancel' : '+ New Session'}
        </button>
      </div>

      {creating && (
        <div className="mb-6 border rounded-lg p-4 bg-green-50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              placeholder="Age Group ID"
              className="border rounded px-3 py-2"
              value={newSession.ageGroupId}
              onChange={(e) => setNewSession({ ...newSession, ageGroupId: e.target.value })}
            />
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={newSession.date}
              onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
            />
            <input
              type="time"
              className="border rounded px-3 py-2"
              value={newSession.time}
              onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
            />
            <input
              type="number"
              className="border rounded px-3 py-2"
              value={newSession.duration}
              onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) || 90 })}
            />
            <input
              placeholder="Location"
              className="border rounded px-3 py-2"
              value={newSession.location}
              onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <button
              onClick={async () => {
                if (!newSession.ageGroupId || !newSession.date || !newSession.time || !newSession.location) return
                setLoading(true)
                try {
                  await ageGroupSupervisorService.addTrainingSession(newSession as any)
                  const refreshed = await ageGroupSupervisorService.getTrainingSchedule()
                  const mapped: TrainingSession[] = (refreshed || []).map((s: any) => ({
                    id: s.id || s._id || '',
                    date: s.date || '',
                    type: s.type || 'technical',
                    focus: s.focus || s.ageGroupName || '',
                    coachId: s.coachId || '',
                    coachName: s.coachName || '',
                    attendanceCount: s.attendanceCount || 0,
                    status: (s.status as any) || 'planned',
                    notes: s.notes || '',
                  }))
                  setSessions(mapped)
                  setCreating(false)
                  setNewSession({ ageGroupId: '', date: '', time: '', duration: 90, location: '', status: 'scheduled' })
                } finally {
                  setLoading(false)
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Save Session
            </button>
          </div>
        </div>
      )}

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
