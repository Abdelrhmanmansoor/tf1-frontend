'use client'

import React, { useState } from 'react'
import { Evaluation } from '@/types/age-group-supervisor'
import { ageGroupSupervisorMockService } from '@/services/age-group-supervisor-mock'
import { BarChart, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PerformanceScouting() {
  const [playerId, setPlayerId] = useState('1') // Default to first player
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true)
      const data = await ageGroupSupervisorMockService.getEvaluations(playerId)
      setEvaluations(data)
      setLoading(false)
    }
    fetchEvaluations()
  }, [playerId])

  // Helper to render a metric bar
  const MetricBar = ({ label, value }: { label: string, value: number }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${value * 10}%` }}
        ></div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Performance Scouting</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search player..." 
            className="pl-10 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Player Selection / Radar Placeholder */}
        <div className="md:col-span-1 bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
             <BarChart className="w-12 h-12" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900">Ahmed Ali</h3>
          <p className="text-sm text-gray-500">U16 - Forward</p>
          
          <div className="mt-6 w-full">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Recent Trend</h4>
            <div className="h-20 flex items-end justify-between gap-1">
              {[6, 7, 7, 8, 8, 9].map((h, i) => (
                <div key={i} className="w-full bg-blue-200 rounded-t" style={{ height: `${h * 10}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="md:col-span-2">
          {loading ? (
            <div>Loading evaluations...</div>
          ) : evaluations.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="font-bold text-gray-800 mb-4">Latest Evaluation ({evaluations[0].date})</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <MetricBar label="Technical" value={evaluations[0].metrics.technical} />
                <MetricBar label="Tactical" value={evaluations[0].metrics.tactical} />
                <MetricBar label="Physical" value={evaluations[0].metrics.physical} />
                <MetricBar label="Mental" value={evaluations[0].metrics.mental} />
                <MetricBar label="Social" value={evaluations[0].metrics.social} />
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-1">Evaluator Comments</h4>
                <p className="text-sm text-yellow-700">{evaluations[0].comments}</p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-10 text-gray-500">No evaluations found for this player.</div>
          )}
        </div>
      </div>
    </div>
  )
}
