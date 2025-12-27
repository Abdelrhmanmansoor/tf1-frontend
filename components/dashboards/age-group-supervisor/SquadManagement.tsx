'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Player } from '@/types/age-group-supervisor'
import { ageGroupSupervisorMockService } from '@/services/age-group-supervisor-mock'
import { Search, Filter, User, FileText, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SquadManagement() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await ageGroupSupervisorMockService.getPlayers()
      setPlayers(data)
      setLoading(false)
    }
    fetchPlayers()
  }, [])

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.position.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Squad Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search players..." 
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading squad...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Player</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Age Group</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Docs</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPlayers.map((player) => (
                <motion.tr 
                  key={player.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        {player.imageUrl ? (
                          <Image 
                            src={player.imageUrl} 
                            alt={player.name} 
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 m-1.5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{player.name}</div>
                        <div className="text-xs text-gray-500">Born: {player.dob}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{player.position}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                      {player.ageGroup}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      player.status === 'active' ? 'bg-green-100 text-green-700' :
                      player.status === 'injured' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            player.attendanceRate > 90 ? 'bg-green-500' : 
                            player.attendanceRate > 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${player.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{player.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <FileText className={`w-4 h-4 ${player.documents.passport ? 'text-green-500' : 'text-red-300'}`} />
                      <Activity className={`w-4 h-4 ${player.documents.federationCard ? 'text-green-500' : 'text-red-300'}`} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">View Profile</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
