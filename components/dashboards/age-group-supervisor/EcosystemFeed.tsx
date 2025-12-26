'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Stethoscope, ClipboardList, Briefcase, UserCheck } from 'lucide-react'

interface FeedItem {
  id: string
  source: 'coach' | 'medical' | 'club' | 'scout'
  message: string
  timestamp: string
  entityName: string
  type: 'report' | 'alert' | 'update' | 'request'
}

const FEED_DATA: FeedItem[] = [
  {
    id: '1',
    source: 'coach',
    entityName: 'Coach Hassan (U16)',
    message: 'Submitted training report: "Defense Tactics" - 95% Attendance',
    timestamp: '10 mins ago',
    type: 'report'
  },
  {
    id: '2',
    source: 'medical',
    entityName: 'Dr. Sarah',
    message: 'Updated injury status for Mohammed Sami: "Cleared for light training"',
    timestamp: '1 hour ago',
    type: 'update'
  },
  {
    id: '3',
    source: 'club',
    entityName: 'Club Management',
    message: 'Approved budget for new training equipment',
    timestamp: '2 hours ago',
    type: 'update'
  },
  {
    id: '4',
    source: 'scout',
    entityName: 'Scout Ibrahim',
    message: 'New talent recommendation: "Yasser (GK, 2010)" added to watchlist',
    timestamp: '5 hours ago',
    type: 'request'
  },
  {
    id: '5',
    source: 'coach',
    entityName: 'Coach Khalid (U14)',
    message: 'Requested friendly match confirmation for next Friday',
    timestamp: '1 day ago',
    type: 'request'
  }
]

export default function EcosystemFeed() {
  const getIcon = (source: string) => {
    switch (source) {
      case 'coach': return <ClipboardList className="w-5 h-5 text-blue-500" />
      case 'medical': return <Stethoscope className="w-5 h-5 text-red-500" />
      case 'club': return <Briefcase className="w-5 h-5 text-purple-500" />
      case 'scout': return <UserCheck className="w-5 h-5 text-green-500" />
      default: return <Activity className="w-5 h-5 text-gray-500" />
    }
  }

  const getColor = (source: string) => {
    switch (source) {
      case 'coach': return 'bg-blue-50 border-blue-200'
      case 'medical': return 'bg-red-50 border-red-200'
      case 'club': return 'bg-purple-50 border-purple-200'
      case 'scout': return 'bg-green-50 border-green-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          Live Ecosystem Activity
        </h2>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">
          Live
        </span>
      </div>

      <div className="space-y-4 relative before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gray-100">
        {FEED_DATA.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-10"
          >
            {/* Timeline dot */}
            <div className={`absolute left-1.5 top-1.5 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
              item.source === 'coach' ? 'bg-blue-100' :
              item.source === 'medical' ? 'bg-red-100' :
              item.source === 'club' ? 'bg-purple-100' : 'bg-green-100'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                 item.source === 'coach' ? 'bg-blue-500' :
                 item.source === 'medical' ? 'bg-red-500' :
                 item.source === 'club' ? 'bg-purple-500' : 'bg-green-500'
              }`} />
            </div>

            <div className={`p-3 rounded-lg border ${getColor(item.source)}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  {getIcon(item.source)}
                  {item.entityName}
                </span>
                <span className="text-xs text-gray-500">{item.timestamp}</span>
              </div>
              <p className="text-sm text-gray-700">{item.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
