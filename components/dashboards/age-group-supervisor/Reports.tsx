'use client'

import React from 'react'
import { GraduationCap, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Reports() {
  // Mock data for educational/behavioral reports since I didn't add it to the main service yet
  const educationalReports = [
    { id: 1, playerName: 'Ahmed Ali', school: 'Al-Amal High School', grade: '10th', gpa: '3.8', status: 'Excellent', lastUpdate: '2024-10-15' },
    { id: 2, playerName: 'Mohammed Sami', school: 'City Grammar', grade: '10th', gpa: '2.5', status: 'Needs Improvement', lastUpdate: '2024-10-12' },
  ]

  const behavioralReports = [
    { id: 1, playerName: 'Mohammed Sami', type: 'Late Arrival', date: '2024-10-20', description: 'Arrived 20 mins late for training without excuse.', severity: 'Low' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Educational Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Educational Tracking</h2>
        </div>

        <div className="space-y-4">
          {educationalReports.map((report) => (
            <motion.div 
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border rounded-lg p-4 hover:bg-blue-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{report.playerName}</h3>
                  <p className="text-sm text-gray-500">{report.school} - Grade {report.grade}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  report.status === 'Excellent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  GPA: {report.gpa}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-400">Last Updated: {report.lastUpdate}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Behavioral Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-800">Behavioral & Disciplinary</h2>
        </div>

        <div className="space-y-4">
          {behavioralReports.map((report) => (
            <motion.div 
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-l-4 border-l-orange-400 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{report.playerName}</h3>
                <span className="text-xs text-orange-600 font-medium">{report.type}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{report.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{report.date}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Severity: {report.severity}</span>
              </div>
            </motion.div>
          ))}
          
          {behavioralReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">No disciplinary records found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
