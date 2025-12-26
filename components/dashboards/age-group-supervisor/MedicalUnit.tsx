'use client'

import React, { useState, useEffect } from 'react'
import { MedicalRecord, Player } from '@/types/age-group-supervisor'
import { ageGroupSupervisorMockService } from '@/services/age-group-supervisor-mock'
import { Activity, AlertCircle, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MedicalUnit() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [recs, pls] = await Promise.all([
        ageGroupSupervisorMockService.getMedicalRecords(),
        ageGroupSupervisorMockService.getPlayers()
      ])
      setRecords(recs)
      setPlayers(pls)
      setLoading(false)
    }
    fetchData()
  }, [])

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Medical Unit</h2>
        <div className="flex gap-2">
           <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
             Active Injuries: {records.filter(r => r.status === 'active').length}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div>Loading medical records...</div>
        ) : (
          records.map((record) => (
            <motion.div 
              key={record.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-l-4 border-l-red-500 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-gray-800">{getPlayerName(record.playerId)}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  record.severity === 'high' ? 'bg-red-100 text-red-800' :
                  record.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {record.severity.toUpperCase()} Priority
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{record.description}</h3>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Reported: {record.dateReported}
                </span>
                {record.expectedReturnDate && (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <AlertCircle className="w-4 h-4" /> Return: {record.expectedReturnDate}
                  </span>
                )}
              </div>
              
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                  Full Report
                </button>
                <button className="flex-1 bg-red-50 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-100">
                  Update Status
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
